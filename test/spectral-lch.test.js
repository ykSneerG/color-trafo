import { CtSNM, CtLCH, CtXYZ } from '../dist/index.js';

console.log('Running spectral and LCH tests...');

// Test CtSNM (Spectral) creation with arrays
const wavelengths = [400, 450, 500, 550, 600, 650, 700];
const values = [0.1, 0.3, 0.8, 0.9, 0.7, 0.4, 0.1];
const spectrum1 = new CtSNM(wavelengths, values);
console.assert(Array.isArray(spectrum1.wavelengths), 'CtSNM wavelengths should be array');
console.assert(Array.isArray(spectrum1.values), 'CtSNM values should be array');
console.assert(spectrum1.wavelengths.length === 7, 'CtSNM wavelengths length mismatch');
console.assert(spectrum1.values.length === 7, 'CtSNM values length mismatch');

// Test CtSNM creation with object
const spectrum2 = new CtSNM({wavelengths, values});
console.assert(spectrum2.wavelengths[0] === 400, 'CtSNM object creation failed');
console.assert(spectrum2.values[0] === 0.1, 'CtSNM object creation failed');

// Test CtSNM to XYZ conversion
const xyzFromSpectrum = spectrum1.toCtXYZ();
console.assert(xyzFromSpectrum instanceof CtXYZ, 'CtSNM to XYZ conversion failed');
console.assert(typeof xyzFromSpectrum.x === 'number', 'XYZ x should be number');
console.assert(typeof xyzFromSpectrum.y === 'number', 'XYZ y should be number');
console.assert(typeof xyzFromSpectrum.z === 'number', 'XYZ z should be number');

// Test CtLCH creation with individual values
const lch1 = new CtLCH(50, 30, 120);
console.assert(lch1.l === 50, 'CtLCH L creation failed');
console.assert(lch1.c === 30, 'CtLCH C creation failed');
console.assert(lch1.h === 120, 'CtLCH H creation failed');

// Test CtLCH creation with array
const lch2 = new CtLCH([60, 40, 240]);
console.assert(lch2.l === 60, 'CtLCH array creation failed');
console.assert(lch2.c === 40, 'CtLCH array creation failed');
console.assert(lch2.h === 240, 'CtLCH array creation failed');

// Test CtLCH creation with object
const lch3 = new CtLCH({l: 70, c: 50, h: 180});
console.assert(lch3.l === 70, 'CtLCH object creation failed');
console.assert(lch3.c === 50, 'CtLCH object creation failed');
console.assert(lch3.h === 180, 'CtLCH object creation failed');

// Test CtLCH to LAB8 conversion
const lab8FromLch = lch1.toCtLAB8();
console.assert(typeof lab8FromLch.l === 'number', 'LCH to LAB8 L should be number');
console.assert(typeof lab8FromLch.a === 'number', 'LCH to LAB8 a should be number');
console.assert(typeof lab8FromLch.b === 'number', 'LCH to LAB8 b should be number');

// Test CtLCH to XYZ conversion
const xyzFromLch = lch1.toCtXYZ();
console.assert(xyzFromLch instanceof CtXYZ, 'LCH to XYZ conversion failed');
console.assert(typeof xyzFromLch.x === 'number', 'XYZ from LCH x should be number');
console.assert(typeof xyzFromLch.y === 'number', 'XYZ from LCH y should be number');
console.assert(typeof xyzFromLch.z === 'number', 'XYZ from LCH z should be number');

// Test array and object methods
const spectrumArray = spectrum1.toArray();
console.assert(Array.isArray(spectrumArray), 'CtSNM toArray should return array');

const lchObject = lch1.toObject();
console.assert(typeof lchObject === 'object', 'CtLCH toObject should return object');
console.assert(lchObject.l === 50, 'CtLCH toObject L value mismatch');
console.assert(lchObject.c === 30, 'CtLCH toObject C value mismatch');
console.assert(lchObject.h === 120, 'CtLCH toObject H value mismatch');

console.log('✅ All spectral and LCH tests passed!');