import { WHITE_POINTS } from './constants/whitepoints.js';
import { xyzToLab, labToXyz } from './converter.js';
export class CtBase {
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
        return Object.values(this).filter((v) => typeof v === 'number');
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
 * XYZ color space representation
 * @example
 * ```typescript
 * const xyz1 = new CtXYZ(0.5, 0.3, 0.2);
 * const xyz2 = new CtXYZ([0.5, 0.3, 0.2]);
 * const xyz3 = new CtXYZ({x: 0.5, y: 0.3, z: 0.2});
 * ```
 */
export class CtXYZ extends CtBase {
    validateValue(value, key) {
        /*
        *   Minimum: >= 0 (no negative values)
        *   Maximum: No upper limit (values can exceed 1.0 for wide gamut colors)
        */
        const validated = super.validateValue(value, key);
        if (validated < 0) {
            throw new Error(`Invalid XYZ ${key} value: ${validated}. Must be >= 0.`);
        }
        return validated;
    }
    constructor(...args) {
        super(['x', 'y', 'z'], ...args);
    }
    toCsLAB(wp = WHITE_POINTS.D50) {
        const [l, a, b] = xyzToLab(this.x, this.y, this.z, wp);
        return new CtLAB(l, a, b);
    }
}
/**
 * Internal LAB color space representation (CIELAB)
 * Used internally for conversions - not exported
 * @internal
 */
class CtLAB extends CtBase {
    validateValue(value, key) {
        /*
        *   L: >= 0 (can exceed 100 for super-white colors)
        *   a, b: No bounds (can exceed ±127/128 for wide gamut colors)
        */
        const validated = super.validateValue(value, key);
        if (key === 'l' && validated < 0) {
            throw new Error(`Invalid LAB L value: ${validated}. Must be >= 0.`);
        }
        return validated;
    }
    constructor(...args) {
        super(['l', 'a', 'b'], ...args);
    }
    toCsXYZ(wp = WHITE_POINTS.D50) {
        const [x, y, z] = labToXyz(this.l, this.a, this.b, wp);
        return new CtXYZ(x, y, z);
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
export class CtLAB8 extends CtBase {
    validateValue(value, key) {
        const validated = super.validateValue(value, key);
        if (key === 'l' && validated < 0) {
            throw new Error(`Invalid LAB8 L value: ${validated}. Must be greater than 0.`);
        }
        return validated;
    }
    constructor(...args) {
        super(['l', 'a', 'b'], ...args);
    }
    toCsLAB() {
        return new CtLAB(this.l, this.a, this.b);
    }
    toCsXYZ(wp = WHITE_POINTS.D50) {
        return this.toCsLAB().toCsXYZ(wp);
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
export class CtLAB16 extends CtBase {
    validateValue(value, key) {
        const validated = super.validateValue(value, key);
        const rounded = Math.round(validated);
        if (rounded < 0 || rounded > 65535) {
            throw new Error(`Invalid LAB16 ${key} value: ${rounded}. Must be between 0 and 65535.`);
        }
        return rounded;
    }
    constructor(...args) {
        super(['l', 'a', 'b'], ...args);
    }
    toCsLAB() {
        return new CtLAB(this.l * 100 / 65535, (this.a - 32768) * 127 / 32767, (this.b - 32768) * 127 / 32767);
    }
    toCsXYZ(wp = WHITE_POINTS.D50) {
        return this.toCsLAB().toCsXYZ(wp);
    }
}
