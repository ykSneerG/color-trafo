import { WhitePoint } from './constants/whitepoints.js';
import { SpectralData, Cmf } from './constants/cmfs.js';
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
/**
 * Convert spectral data to XYZ color space using color matching functions
 * @param spectralData Spectral power distribution or reflectance data
 * @param cmf Color matching function (defaults to CIE 1931 2°)
 * @param illuminant Illuminant spectral data (optional, for reflectance)
 * @returns XYZ tristimulus values
 * @example
 * ```typescript
 * const spectrum = {
 *   wavelengths: [400, 450, 500, 550, 600, 650, 700],
 *   values: [0.1, 0.3, 0.8, 0.9, 0.7, 0.4, 0.1]
 * };
 * const xyz = spectralToXyz(spectrum);
 * ```
 */
export declare function spectralToXyz(spectralData: SpectralData, cmf?: Cmf, illuminant?: SpectralData): [number, number, number];
export declare function labToLch(l: number, a: number, b: number): [number, number, number];
export declare function lchToLab(l: number, c: number, h: number): [number, number, number];
