import { WhitePoint } from './constants/whitepoints.js';
/**
 * Converts LAB color values to XYZ color space using CIELAB formula
 * @param l - Lightness (0-100, can exceed for super-white)
 * @param a - Green-red axis (typically ±127, can exceed for wide gamut)
 * @param b - Blue-yellow axis (typically ±127, can exceed for wide gamut)
 * @param wp - White point reference (defaults to D50)
 * @returns XYZ values as [x, y, z] array
 * @example
 * ```typescript
 * const xyz = labToXyz(50, 10, -20);
 * ```
 */
export declare function labToXyz(l: number, a: number, b: number, wp?: WhitePoint): [number, number, number];
/**
 * Converts XYZ color values to LAB color space using CIELAB formula
 * @param x - X component (typically 0-1, can exceed for wide gamut)
 * @param y - Y component (typically 0-1, can exceed for wide gamut)
 * @param z - Z component (typically 0-1, can exceed for wide gamut)
 * @param wp - White point reference (defaults to D50)
 * @returns LAB values as [l, a, b] array
 * @example
 * ```typescript
 * const lab = xyzToLab(0.5, 0.3, 0.2);
 * ```
 */
export declare function xyzToLab(x: number, y: number, z: number, wp?: WhitePoint): [number, number, number];
