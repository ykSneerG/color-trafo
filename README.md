# color-trafo

![CI](https://github.com/yksneerG/color-trafo/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/color-trafo.svg)](https://badge.fury.io/js/color-trafo)
[![Coverage](https://codecov.io/gh/yksneerG/color-trafo/branch/main/graph/badge.svg)](https://codecov.io/gh/yksneerG/color-trafo)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Bundle Size](https://img.shields.io/badge/bundle%20size-~2KB-brightgreen)

Color transformation utilities for JavaScript with TypeScript support.

## Installation

```bash
npm install color-trafo
```

## Usage

```javascript
import { CtXYZ, CtLAB8, CtLAB16, WHITE_POINTS } from 'color-trafo';

// Create XYZ color (0-1 range)
const xyz = new CtXYZ(0.5, 0.3, 0.2);

// Create LAB colors
const lab8 = new CtLAB8(50, 10, -20);
const lab16 = new CtLAB16(32000, 32768, 25000);

// Convert between color spaces
const convertedLab = xyz.toCsLAB8();
const convertedXyz = lab8.toCsXYZ();

// Use different white points
const labD65 = xyz.toCsLAB8(WHITE_POINTS.D65);
```

## API

### CtXYZ
XYZ color space with industry standard 0-1 range.

### CtLAB8  
Standard LAB color space (L: 0-100, a/b: ±127).

### CtLAB16
16-bit LAB color space (0-65535 range for all channels).

## License

MIT