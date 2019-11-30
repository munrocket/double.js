# double.js
[![bundlephobia](https://badgen.net/bundlephobia/minzip/double.js)](https://bundlephobia.com/result?p=double.js)
[![Build Status](https://travis-ci.org/munrocket/double.js.svg?branch=master)](https://travis-ci.org/munrocket/double.js)
[![Codecov](https://img.shields.io/codecov/c/github/munrocket/double.js.svg)](https://codecov.io/gh/munrocket/double.js)

Floating point expansions with 31 accurate decimal digits (100+ bits), also known as double-word arithmetic. This library can be useful for fast calculation with extended precision. For example in computational geometry and numerically unstable algorithms such as performing triangulation, polygon clipping, inverting matrix and finding differentials.

### Algorithm
Number stored as unevaluated sum of two javascript float numbers and uses error-free arithmetic algorithms from references below. This brings accuracy and significant increase in performance in comparison to digit-wise approach, because this float arithmetic is implemented in hardware. Note that there are no theoretical limitations to javascript language since ECMAScript uses 64 bit IEEE 754 with round-to-nearest-even after each operation and without FMA instruction.

### Benchmark
![](https://habrastorage.org/webt/i0/jk/-h/i0jk-hl2r9tixahe906pl2wj0j0.png)

You can check [quality](https://munrocket.github.io/double.js/) and [time](https://www.measurethat.net/Benchmarks/Show/6429/0/doublejs-benchmark) of different libraries in your browser.

### Usage
Include double.js script to webpage or install npm package. Almost all arithmetic function named similar to WASM.
```javascript
// example with ES6 modules, also you can use ES5
import { Double } from 'double.js';

// '0.3' - '0.1' == 0.2
console.log(new Double('0.3').sub(new Double('0.1')).toNumber());

// L = sqrt(a^2 + 10)
let L = a.sqr().add(10).sqrt();

// S(r) = 4/3 * PI * r^3
const S = (r) => new Double('4.1887902047863909846168578443726').mul(r.pown(3));

// f'(x) = (f(x+h) - f(x)) / h;
let dF = (x) => F(x.add(h)).sub(F(x)).div(h);

// |f'(x)| < 1 ? print(x)
if (dF(x).abs().lt(1)) { console.log(x.toExponential()); }
```
You can play with library in [sandbox](https://runkit.com/munrocket/double-js-example). API details you can find in [wiki](https://github.com/munrocket/double.js/wiki) page. Be careful when initializing a new floats, for example `new Double(0.1)` is ok only for integer numbers and you should use `new Double('0.1')` to get correct results. All double-word arithmetic functions are accurate and tested, say me if you find something strange. 

### Special thanks
To [Jeffrey Sarnoff](https://github.com/JeffreySarnoff) for help me with books and algorithms.

### AssemblyScript version
This library will be ported to [wasm](https://github.com/MaxGraey/bignum.wasm).

### References
1. J.-M. Muller, etc. *Tight and rigourous error bounds for basic building blocks of double-word arithmetic.*, 2017. [[PDF](https://hal.archives-ouvertes.fr/hal-01351529v3/document)]
2. J.-M. Muller, N. Brisebarre, F. deDinechin, etc. *Handbook of Floating-Point Arithmetic*, Chapter 14, 2010.
3. Theodorus Dekker. *A floating-point technique for extending the available precision*, 1971. [[Viewer](https://gdz.sub.uni-goettingen.de/id/PPN362160546_0018?tify={%22pages%22:[230],%22panX%22:0.306,%22panY%22:0.754,%22view%22:%22info%22,%22zoom%22:0.39})]
4. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic*, 2000. [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
5. Christoph Lauter *Basic building blocks for a triple-double intermediate format*, 2006. [[PDF](https://hal.inria.fr/inria-00070314/document)]
