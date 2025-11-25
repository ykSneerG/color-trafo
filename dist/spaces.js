import { WHITE_POINTS } from './constants/whitepoints.js';
import { xyzToLab, labToXyz, labToLch, lchToLab, spectralToXyz } from './converter.js';
import { CIE1931_2DEG } from './constants/cmfs.js';
class CtBase {
    validateValue(value, key) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error(`Invalid ${key} value: ${value}. Must be a finite number.`);
        }
        return value;
    }
    constructor(keys, ...args) {
        const input = args[0];
        if (Array.isArray(input)) {
            keys.forEach((k, i) => {
                this[k] = this.validateValue(input[i], k);
            });
        }
        else if (typeof input === 'object' && input !== null) {
            keys.forEach(k => {
                this[k] = this.validateValue(input[k], k);
            });
        }
        else {
            keys.forEach((k, i) => {
                this[k] = this.validateValue(args[i], k);
            });
        }
    }
    toArray() {
        const result = [];
        Object.keys(this).forEach(key => {
            const value = this[key];
            if (typeof value === 'number') {
                result.push(value);
            }
            else if (Array.isArray(value)) {
                result.push(...value);
            }
        });
        return result;
    }
    toObject() {
        const result = {};
        Object.keys(this).forEach(key => {
            const value = this[key];
            if (typeof value === 'number') {
                result[key] = value;
            }
        });
        return result;
    }
}
/**
 * Base class for LAB color spaces with shared conversion logic
 * @internal
 */
class CtLABBase extends CtBase {
    constructor(...args) {
        super(['l', 'a', 'b'], ...args);
    }
    /**
     * Convert to XYZ color space
     * @param wp White point reference
     * @returns XYZ color instance
     */
    toCtXYZ(wp = WHITE_POINTS.D50) {
        const standardLab = this.toStandardLAB();
        const [x, y, z] = labToXyz(standardLab.l, standardLab.a, standardLab.b, wp);
        return new CtXYZ(x, y, z);
    }
    /**
     * Convert to LCH color space
     * @returns LCH color instance
     */
    toCtLCH() {
        const standardLab = this.toStandardLAB();
        const [l, c, h] = labToLch(standardLab.l, standardLab.a, standardLab.b);
        return new CtLCH(l, c, h);
    }
}
/**
 * XYZ color space representation (industry standard 0-1 range)
 * @example
 * ```typescript
 * const xyz1 = new CtXYZ(0.5, 0.3, 0.2);
 * const xyz2 = new CtXYZ([0.5, 0.3, 0.2]);
 * const xyz3 = new CtXYZ({x: 0.5, y: 0.3, z: 0.2});
 * ```
 */
export class CtXYZ extends CtBase {
    validateValue(value, key) {
        const validated = super.validateValue(value, key);
        if (validated < 0) {
            throw new Error(`Invalid XYZ ${key} value: ${validated}. Must be >= 0.`);
        }
        return validated;
    }
    constructor(...args) {
        super(['x', 'y', 'z'], ...args);
    }
    toCtLAB8(wp = WHITE_POINTS.D50) {
        const [l, a, b] = xyzToLab(this.x, this.y, this.z, wp);
        return new CtLAB8(l, a, b);
    }
    toCtLCH(wp = WHITE_POINTS.D50) {
        return this.toCtLAB8(wp).toCtLCH();
    }
}
/**
 * 8-bit LAB color space representation (standard LAB ranges)
 * @example
 * ```typescript
 * const lab8_1 = new CtLAB8(50, 10, -20);
 * const lab8_2 = new CtLAB8([50, 10, -20]);
 * const lab8_3 = new CtLAB8({l: 50, a: 10, b: -20});
 * ```
 */
export class CtLAB8 extends CtLABBase {
    validateValue(value, key) {
        const validated = super.validateValue(value, key);
        if (key === 'l' && validated < 0) {
            throw new Error(`Invalid LAB8 L value: ${validated}. Must be greater than 0.`);
        }
        return validated;
    }
    toStandardLAB() {
        return { l: this.l, a: this.a, b: this.b };
    }
}
/**
 * 16-bit LAB color space representation (0-65535 range)
 * @example
 * ```typescript
 * const lab16_1 = new CtLAB16(32000, 32768, 25000);
 * const lab16_2 = new CtLAB16([32000, 32768, 25000]);
 * const lab16_3 = new CtLAB16({l: 32000, a: 32768, b: 25000});
 * ```
 */
export class CtLAB16 extends CtLABBase {
    validateValue(value, key) {
        const validated = super.validateValue(value, key);
        const rounded = Math.round(validated);
        if (rounded < 0 || rounded > 65535) {
            throw new Error(`Invalid LAB16 ${key} value: ${rounded}. Must be between 0 and 65535.`);
        }
        return rounded;
    }
    toStandardLAB() {
        return {
            l: this.l * 100 / 65535,
            a: (this.a - 32768) * 127 / 32767,
            b: (this.b - 32768) * 127 / 32767
        };
    }
    toCtLAB8() {
        const standard = this.toStandardLAB();
        return new CtLAB8(standard.l, standard.a, standard.b);
    }
}
/**
 * LCH color space representation
 * @example
 * ```typescript
 * const lch1 = new CtLCH(50, 30, 120);
 * const lch2 = new CtLCH([50, 30, 120]);
 * const lch3 = new CtLCH({l: 50, c: 30, h: 120});
 * ```
 */
export class CtLCH extends CtBase {
    constructor(...args) {
        super(['l', 'c', 'h'], ...args);
    }
    toCtLAB8() {
        const [l, a, b] = lchToLab(this.l, this.c, this.h);
        return new CtLAB8(l, a, b);
    }
    toCtXYZ(wp = WHITE_POINTS.D50) {
        return this.toCtLAB8().toCtXYZ(wp);
    }
}
/**
 * Spectral color space representation (simplified)
 * @example
 * ```typescript
 * const spectrum = new CtSNM(
 *   [400, 450, 500, 550, 600, 650, 700],
 *   [0.1, 0.3, 0.8, 0.9, 0.7, 0.4, 0.1]
 * );
 * ```
 */
export class CtSNM extends CtBase {
    validateValue(value, key) {
        if (key === 'wavelengths' || key === 'values') {
            if (!Array.isArray(value)) {
                throw new Error(`Invalid ${key} value: must be an array.`);
            }
            return value.map((v, i) => {
                if (typeof v !== 'number' || !isFinite(v)) {
                    throw new Error(`Invalid ${key}[${i}] value: ${v}. Must be a finite number.`);
                }
                return v;
            });
        }
        return super.validateValue(value, key);
    }
    constructor(...args) {
        if (args.length === 2 && Array.isArray(args[0]) && Array.isArray(args[1])) {
            super(['wavelengths', 'values'], { wavelengths: args[0], values: args[1] });
        }
        else {
            super(['wavelengths', 'values'], ...args);
        }
    }
    toCtXYZ(cmf = CIE1931_2DEG, illuminant) {
        const spectralData = {
            wavelengths: this.wavelengths,
            values: this.values
        };
        const [x, y, z] = spectralToXyz(spectralData, cmf, illuminant);
        return new CtXYZ(x, y, z);
    }
}
