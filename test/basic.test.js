import { CtXYZ, CtLAB8, CtLAB16 } from '../dist/index.js';

// Basic smoke tests for CI
console.log('Running basic tests...');

// Test XYZ creation
const xyz = new CtXYZ(0.5, 0.3, 0.2);
console.assert(xyz.x === 0.5, 'XYZ creation failed');
console.assert(xyz.y === 0.3, 'XYZ creation failed');
console.assert(xyz.z === 0.2, 'XYZ creation failed');

// Test LAB8 creation  
const lab8 = new CtLAB8(50, 10, -20);
console.assert(lab8.l === 50, 'LAB8 creation failed');
console.assert(lab8.a === 10, 'LAB8 creation failed');
console.assert(lab8.b === -20, 'LAB8 creation failed');

// Test LAB16 creation
const lab16 = new CtLAB16(32000, 32768, 25000);
console.assert(lab16.l === 32000, 'LAB16 creation failed');
console.assert(lab16.a === 32768, 'LAB16 creation failed');
console.assert(lab16.b === 25000, 'LAB16 creation failed');

// Test conversion
const convertedLab = xyz.toCtLAB8();
console.assert(typeof convertedLab.l === 'number', 'XYZ to LAB8 conversion failed');

const convertedXyz = lab8.toCtXYZ();
console.assert(typeof convertedXyz.x === 'number', 'LAB8 to XYZ conversion failed');

console.log('✅ All basic tests passed!');