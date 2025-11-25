import { CtXYZ, CtLAB8, CtLAB16 } from '../dist/spaces.js';

// CtXYZ tests
console.log('Input: [0.5, 0.3, 0.2]');
const xyz1 = new CtXYZ([0.5, 0.3, 0.2]);
console.log('Output:', xyz1);

console.log('Input: {x: 0.5, y: 0.3, z: 0.2}');
const xyz2 = new CtXYZ({x: 0.5, y: 0.3, z: 0.2});
console.log('Output:', xyz2);

console.log('Input: 0.5, 0.3, 0.2');
const xyz3 = new CtXYZ(0.5, 0.3, 0.2);
console.log('Output:', xyz3);

// CtLAB8 tests
console.log('\nCtLAB8 tests:');
console.log('Input: [50, 10, -20]');
const lab8_1 = new CtLAB8([50, 10, -20]);
console.log('Output:', lab8_1);

console.log('Input: {l: 50, a: 10, b: -20}');
const lab8_2 = new CtLAB8({l: 50, a: 10, b: -20});
console.log('Output:', lab8_2);

console.log('Input: 50, 10, -20');
const lab8_3 = new CtLAB8(50, 10, -20);
console.log('Output:', lab8_3);

// CtLAB16 tests
console.log('\nCtLAB16 tests:');
console.log('Input: [32000, 32768, 25000]');
const lab16_1 = new CtLAB16([32000, 32768, 25000]);
console.log('Output:', lab16_1);

console.log('Input: {l: 32000, a: 32768, b: 25000}');
const lab16_2 = new CtLAB16({l: 32000, a: 32768, b: 25000});
console.log('Output:', lab16_2);

console.log('Input: 32000, 32768, 25000');
const lab16_3 = new CtLAB16(32000, 32768, 25000);
console.log('Output:', lab16_3);

// Conversion tests
console.log('\nConversion tests:');
console.log('LAB8 to XYZ:');
const lab8ForConversion = new CtLAB8(50, 10, -20);
const convertedXyz8 = lab8ForConversion.toCsXYZ();
console.log('LAB8 Input:', lab8ForConversion);
console.log('XYZ Output:', convertedXyz8);

console.log('\nLAB16 to XYZ:');
const lab16ForConversion = new CtLAB16(32000, 32768, 25000);
const convertedXyz16 = lab16ForConversion.toCsXYZ();
console.log('LAB16 Input:', lab16ForConversion);
console.log('XYZ Output:', convertedXyz16);

// toArray and toObject tests
console.log('\ntoArray/toObject tests:');
const xyz = new CtXYZ(0.5, 0.3, 0.2);
console.log('XYZ toArray():', xyz.toArray());
console.log('XYZ toObject():', xyz.toObject());

const lab8 = new CtLAB8(50, 10, -20);
console.log('LAB8 toArray():', lab8.toArray());
console.log('LAB8 toObject():', lab8.toObject());

const lab16 = new CtLAB16(32000, 32768, 25000);
console.log('LAB16 toArray():', lab16.toArray());
console.log('LAB16 toObject():', lab16.toObject());