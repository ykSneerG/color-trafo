import { WHITE_POINTS } from './constants/whitepoints.js';
import { CIE1931_2DEG } from './constants/cmfs.js';
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
export function labToXyz(l, a, b, wp = WHITE_POINTS.D50) {
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
export function xyzToLab(x, y, z, wp = WHITE_POINTS.D50) {
    const { xn, yn, zn } = wp;
    const fx = x / xn;
    const fy = y / yn;
    const fz = z / zn;
    const delta = 6 / 29;
    const f = (v) => v > delta * delta * delta ? Math.cbrt(v) : (v / (3 * delta * delta)) + 4 / 29;
    return [
        116 * f(fy) - 16,
        500 * (f(fx) - f(fy)),
        200 * (f(fy) - f(fz))
    ];
}
/**
 * Linear interpolation for spectral data
 * @internal
 */
function interpolateSpectral(spectralData, targetWavelengths) {
    const { wavelengths: srcWL, values: srcValues } = spectralData;
    return targetWavelengths.map(targetWL => {
        // Find surrounding points
        let i = 0;
        while (i < srcWL.length - 1 && srcWL[i + 1] < targetWL)
            i++;
        // Exact match
        if (srcWL[i] === targetWL)
            return srcValues[i];
        // Outside range - return 0
        if (targetWL < srcWL[0] || targetWL > srcWL[srcWL.length - 1])
            return 0;
        // Linear interpolation
        const x0 = srcWL[i], x1 = srcWL[i + 1];
        const y0 = srcValues[i], y1 = srcValues[i + 1];
        return y0 + (y1 - y0) * (targetWL - x0) / (x1 - x0);
    });
}
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
export function spectralToXyz(spectralData, cmf = CIE1931_2DEG, illuminant) {
    // Interpolate spectral data to match CMF wavelengths
    const interpolatedValues = interpolateSpectral(spectralData, cmf.wavelengths);
    // If illuminant provided, interpolate it too (for reflectance calculations)
    const illuminantValues = illuminant
        ? interpolateSpectral(illuminant, cmf.wavelengths)
        : cmf.wavelengths.map(() => 1); // Assume equal energy if no illuminant
    // Integrate spectral data with color matching functions
    let X = 0, Y = 0, Z = 0;
    const step = cmf.wavelengths[1] - cmf.wavelengths[0]; // Wavelength step size
    for (let i = 0; i < cmf.wavelengths.length; i++) {
        const power = interpolatedValues[i] * illuminantValues[i];
        X += power * cmf.xBar[i] * step;
        Y += power * cmf.yBar[i] * step;
        Z += power * cmf.zBar[i] * step;
    }
    // Normalize by illuminant Y integral for reflectance data
    if (illuminant) {
        let Yn = 0;
        for (let i = 0; i < cmf.wavelengths.length; i++) {
            Yn += illuminantValues[i] * cmf.yBar[i] * step;
        }
        X /= Yn;
        Y /= Yn;
        Z /= Yn;
    }
    return [X, Y, Z];
}
export function labToLch(l, a, b) {
    const c = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) * (180 / Math.PI);
    if (h < 0)
        h += 360;
    return [l, c, h];
}
export function lchToLab(l, c, h) {
    const hr = h * (Math.PI / 180);
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);
    return [l, a, b];
}
