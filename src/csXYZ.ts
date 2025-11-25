import { WHITE_POINTS, WhitePoint } from './constants/whitepoints.js';
import { xyzToLab, labToXyz } from './converter.js';


export abstract class CtBase {
    [key: string]: any;

    protected validateValue(value: number, key: string): number {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error(`Invalid ${key} value: ${value}. Must be a finite number.`);
        }
        return value;
    }

    constructor(keys: string[], ...args: any[]) {
        const input = args[0];
        if (Array.isArray(input)) {
            keys.forEach((k, i) => {
                this[k] = this.validateValue(input[i], k);
            });
        } else if (typeof input === 'object' && input !== null) {
            keys.forEach(k => {
                this[k] = this.validateValue(input[k], k);
            });
        } else {
            keys.forEach((k, i) => {
                this[k] = this.validateValue(args[i], k);
            });
        }
    }

    toArray(): number[] {
        return Object.values(this).filter((v): v is number => typeof v === 'number');
    }

    toObject(): { [key: string]: number } {
        const result: { [key: string]: number } = {};
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
 * XYZ color space representation (industry standard 0-1 range)
 * @example
 * ```typescript
 * const xyz1 = new CtXYZ(0.5, 0.3, 0.2);
 * const xyz2 = new CtXYZ([0.5, 0.3, 0.2]);
 * const xyz3 = new CtXYZ({x: 0.5, y: 0.3, z: 0.2});
 * ```
 */
export class CtXYZ extends CtBase {
    /** X component (0-1 range, can exceed for wide gamut) */
    public x!: number;
    /** Y component (0-1 range, can exceed for wide gamut) */
    public y!: number;
    /** Z component (0-1 range, can exceed for wide gamut) */
    public z!: number;
    
    protected validateValue(value: number, key: string): number {
        const validated = super.validateValue(value, key);
        if (validated < 0) {
            throw new Error(`Invalid XYZ ${key} value: ${validated}. Must be >= 0.`);
        }
        return validated;
    }
    
    constructor(x: number, y: number, z: number);
    constructor(xyz: [number, number, number]);
    constructor(xyz: {x: number, y: number, z: number});
    constructor(...args: any[]) { 
        super(['x', 'y', 'z'], ...args); 
    }

    toCsLAB8(wp: WhitePoint = WHITE_POINTS.D50): CtLAB8 {
        const [l, a, b] = xyzToLab(this.x, this.y, this.z, wp);
        return new CtLAB8(l, a, b);
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
    /** Lightness (0-100), can exceed 100 for super-white */
    public l!: number;
    /** Green-red axis (-127 to 128), can exceed in both directions */
    public a!: number;
    /** Blue-yellow axis (-127 to 128), can exceed in both directions */
    public b!: number;
    
    protected validateValue(value: number, key: string): number {
        const validated = super.validateValue(value, key);
        if (key === 'l' && validated < 0) {
            throw new Error(`Invalid LAB8 L value: ${validated}. Must be greater than 0.`);
        }
        return validated;
    }
    
    constructor(...args: any[]) { 
        super(['l', 'a', 'b'], ...args); 
    }

    toCsXYZ(wp: WhitePoint = WHITE_POINTS.D50): CtXYZ {
        const [x, y, z] = labToXyz(this.l, this.a, this.b, wp);
        return new CtXYZ(x, y, z);
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
    /** Lightness (0-65535), is limited to range */
    public l!: number;
    /** Green-red axis (0-65535), is limited to range */
    public a!: number;
    /** Blue-yellow axis (0-65535), is limited to range */
    public b!: number;
    
    protected validateValue(value: number, key: string): number {
        const validated = super.validateValue(value, key);
        const rounded = Math.round(validated);
        if (rounded < 0 || rounded > 65535) {
            throw new Error(`Invalid LAB16 ${key} value: ${rounded}. Must be between 0 and 65535.`);
        }
        return rounded;
    }
    
    constructor(...args: any[]) { 
        super(['l', 'a', 'b'], ...args); 
    }

    toCsLAB8(): CtLAB8 {
        return new CtLAB8(
            this.l * 100 / 65535,
            (this.a - 32768) * 127 / 32767,
            (this.b - 32768) * 127 / 32767
        );
    }

    toCsXYZ(wp: WhitePoint = WHITE_POINTS.D50): CtXYZ {
        return this.toCsLAB8().toCsXYZ(wp);
    }
}