/**
 * Color Matching Functions for spectral to XYZ conversion
 */
export interface SpectralData {
    wavelengths: number[];
    values: number[];
}
export interface Cmf {
    name: string;
    wavelengths: number[];
    xBar: number[];
    yBar: number[];
    zBar: number[];
}
/**
 * CIE 1931 2° Standard Observer (380-780nm, 5nm steps)
 * Normalized to peak y-bar = 1.0
 */
export declare const CIE1931_2DEG: Cmf;
/**
 * CIE 1964 10° Standard Observer (380-780nm, 5nm steps)
 * Normalized to peak y-bar = 1.0
 */
export declare const CIE1964_10DEG: Cmf;
export declare const COLOR_MATCHING_FUNCTIONS: {
    readonly CIE1931_2DEG: Cmf;
    readonly CIE1964_10DEG: Cmf;
};
