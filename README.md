# color-trafo

![CI](https://github.com/yksneerG/color-trafo/workflows/CI/badge.svg)
[![GitHub Package](https://img.shields.io/github/package-json/v/yksneerG/color-trafo?label=GitHub%20Package)](https://github.com/yksneerG/color-trafo/packages)
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
import { CtXYZ, CtLAB8, CtLAB16, CtLCH, CtSNM, WHITE_POINTS } from 'color-trafo';

// Create XYZ color (0-1 range)
const xyz = new CtXYZ(0.5, 0.3, 0.2);

// Create LAB colors
const lab8 = new CtLAB8(50, 10, -20);
const lab16 = new CtLAB16(32000, 32768, 25000);

// Create LCH color
const lch = new CtLCH(50, 30, 120);

// Create spectral color
const spectrum = new CtSNM(
  [400, 450, 500, 550, 600, 650, 700],
  [0.1, 0.3, 0.8, 0.9, 0.7, 0.4, 0.1]
);

// Convert between color spaces
const convertedLab = xyz.toCtLAB8();
const convertedXyz = lab8.toCtXYZ();
const xyzFromSpectrum = spectrum.toCtXYZ();

// Use different white points
const labD65 = xyz.toCtLAB8(WHITE_POINTS.D65);
```

## API

### CtXYZ
XYZ color space with industry standard 0-1 range.

### CtLAB8  
Standard LAB color space (L: 0-100, a/b: ±127).

### CtLAB16
16-bit LAB color space (0-65535 range for all channels).

### CtLCH
LCH color space (Lightness, Chroma, Hue).

### CtSNM
Spectral color space for measurement device data.

## License

MIT