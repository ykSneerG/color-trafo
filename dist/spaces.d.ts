import { WhitePoint } from './constants/whitepoints.js';
import { Cmf, SpectralData } from './constants/cmfs.js';
declare abstract class CtBase {
    [key: string]: any;
    protected validateValue(value: number, key: string): number;
    constructor(keys: string[], ...args: any[]);
    toArray(): number[];
    toObject(): {
        [key: string]: number;
    };
}
/**
 * Base class for LAB color spaces with shared conversion logic
 * @internal
 */
declare abstract class CtLABBase extends CtBase {
    /** Lightness component */
    l: number;
    /** Green-red axis component */
    a: number;
    /** Blue-yellow axis component */
    b: number;
    constructor(...args: any[]);
    /**
     * Convert to standard LAB values for mathematical operations
     * @returns Standard LAB values (L: 0-100, a/b: ±127)
     */
    abstract toStandardLAB(): {
        l: number;
        a: number;
        b: number;
    };
    /**
     * Convert to XYZ color space
     * @param wp White point reference
     * @returns XYZ color instance
     */
    toCtXYZ(wp?: WhitePoint): CtXYZ;
    /**
     * Convert to LCH color space
     * @returns LCH color instance
     */
    toCtLCH(): CtLCH;
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
export declare class CtXYZ extends CtBase {
    /** X component (0-1 range, can exceed for wide gamut) */
    x: number;
    /** Y component (0-1 range, can exceed for wide gamut) */
    y: number;
    /** Z component (0-1 range, can exceed for wide gamut) */
    z: number;
    protected validateValue(value: number, key: string): number;
    constructor(x: number, y: number, z: number);
    constructor(xyz: [number, number, number]);
    constructor(xyz: {
        x: number;
        y: number;
        z: number;
    });
    toCtLAB8(wp?: WhitePoint): CtLAB8;
    toCtLCH(wp?: WhitePoint): CtLCH;
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
export declare class CtLAB8 extends CtLABBase {
    protected validateValue(value: number, key: string): number;
    toStandardLAB(): {
        l: number;
        a: number;
        b: number;
    };
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
export declare class CtLAB16 extends CtLABBase {
    protected validateValue(value: number, key: string): number;
    toStandardLAB(): {
        l: number;
        a: number;
        b: number;
    };
    toCtLAB8(): CtLAB8;
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
export declare class CtLCH extends CtBase {
    /** Lightness (0-100), can exceed 100 for super-white */
    l: number;
    /** Chroma (0-~127), can exceed for wide gamut */
    c: number;
    /** Hue angle (0-360 degrees) */
    h: number;
    constructor(...args: any[]);
    toCtLAB8(): CtLAB8;
    toCtXYZ(wp?: WhitePoint): CtXYZ;
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
export declare class CtSNM extends CtBase {
    /** Wavelength values in nanometers */
    wavelengths: number[];
    /** Spectral values (power/reflectance) */
    values: number[];
    protected validateValue(value: any, key: string): any;
    constructor(wavelengths: number[], values: number[]);
    constructor(spectralData: {
        wavelengths: number[];
        values: number[];
    });
    toCtXYZ(cmf?: Cmf, illuminant?: SpectralData): CtXYZ;
}
export {};
