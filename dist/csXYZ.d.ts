import { WhitePoint } from './constants/whitepoints.js';
export declare abstract class CtBase {
    [key: string]: any;
    protected validateValue(value: number, key: string): number;
    constructor(keys: string[], ...args: any[]);
    toArray(): number[];
    toObject(): {
        [key: string]: number;
    };
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
export declare class CtXYZ extends CtBase {
    /** X component (typically 0-1, can exceed for wide gamut) */
    x: number;
    /** Y component (typically 0-1, can exceed for wide gamut) */
    y: number;
    /** Z component (typically 0-1, can exceed for wide gamut) */
    z: number;
    protected validateValue(value: number, key: string): number;
    constructor(x: number, y: number, z: number);
    constructor(xyz: [number, number, number]);
    constructor(xyz: {
        x: number;
        y: number;
        z: number;
    });
    toCsLAB(wp?: WhitePoint): CtLAB8;
}
/**
 * Internal LAB color space representation (CIELAB)
 * Used internally for conversions - not exported
 * @internal
 */
declare class CtLAB extends CtBase {
    /** Lightness (0-100, can exceed for super-white) */
    l: number;
    /** Green-red axis (typically ±127, can exceed for wide gamut) */
    a: number;
    /** Blue-yellow axis (typically ±127, can exceed for wide gamut) */
    b: number;
    protected validateValue(value: number, key: string): number;
    constructor(l: number, a: number, b: number);
    constructor(lab: [number, number, number]);
    constructor(lab: {
        l: number;
        a: number;
        b: number;
    });
    toCsXYZ(wp?: WhitePoint): CtXYZ;
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
export declare class CtLAB8 extends CtBase {
    /** Lightness (0-100), can exceed 100 for super-white */
    l: number;
    /** Green-red axis (-127 to 128), can exceed in both directions */
    a: number;
    /** Blue-yellow axis (-127 to 128), can exceed in both directions */
    b: number;
    protected validateValue(value: number, key: string): number;
    constructor(...args: any[]);
    toCsLAB(): CtLAB;
    toCsXYZ(wp?: WhitePoint): CtXYZ;
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
export declare class CtLAB16 extends CtBase {
    /** Lightness (0-65535), is limited to range */
    l: number;
    /** Green-red axis (0-65535), is limited to range */
    a: number;
    /** Blue-yellow axis (0-65535), is limited to range */
    b: number;
    protected validateValue(value: number, key: string): number;
    constructor(...args: any[]);
    toCsLAB(): CtLAB;
    toCsXYZ(wp?: WhitePoint): CtXYZ;
}
export {};
