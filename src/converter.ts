import { WHITE_POINTS, WhitePoint } from './constants/whitepoints.js';

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
export function labToXyz(l: number, a: number, b: number, wp: WhitePoint = WHITE_POINTS.D50): [number, number, number] {
    const { xn, yn, zn } = wp;
    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;
    const delta = 6 / 29;

    return [
        fx > delta ? xn * Math.pow(fx, 3) : xn * (fx - 16 / 116) * 3 * delta * delta,
        fy > delta ? yn * Math.pow(fy, 3) : yn * (fy - 16 / 116) * 3 * delta * delta,
        fz > delta ? zn * Math.pow(fz, 3) : zn * (fz - 16 / 116) * 3 * delta * delta
    ];
}

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
export function xyzToLab(x: number, y: number, z: number, wp: WhitePoint = WHITE_POINTS.D50): [number, number, number] {
    const { xn, yn, zn } = wp;
    const fx = x / xn;
    const fy = y / yn;
    const fz = z / zn;
    const delta = 6 / 29;
    const f = (v: number) => v > delta * delta * delta ? Math.cbrt(v) : (v / (3 * delta * delta)) + 4 / 29;

    return [
        116 * f(fy) - 16,
        500 * (f(fx) - f(fy)),
        200 * (f(fy) - f(fz))
    ];
}