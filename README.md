# double.js
[![bundlephobia](https://badgen.net/bundlephobia/min/double.js)](https://bundlephobia.com/result?p=double.js)
[![Build Status](https://travis-ci.org/munrocket/double.js.svg?branch=master)](https://travis-ci.org/munrocket/double.js)
[![Codecov](https://img.shields.io/codecov/c/github/munrocket/double.js.svg)](https://codecov.io/gh/munrocket/double.js)

Floating point expansions with 31 accurate decimal digits, also known as double-double arithmetic. This library can be useful for fast calculation with extended precision. For example in computational geometry and numerically unstable algorithms such as performing triangulation, polygon clipping, inverting matrix and finding differentials.

### Algorithm
Number stored as unevaluated sum of two javascript float numbers and uses error-free arithmetic algorithms from references below. This brings accuracy and significant increase in performance in comparison to digit-wise approach, because this float arithmetic is implemented in hardware. Note that there are no theoretical limitations to javascript language since ECMAScript version 1 uses 64 bit IEEE 754 with round-to-nearest after each operations.

### Benchmark
![double.js](https://habrastorage.org/webt/te/72/ry/te72ryvkkohfy-nnyeueikgtn8q.png) 

You can check calculation [time](https://jsperf.com/double-js) and [quality](https://munrocket.github.io/double.js/) of different libraries in your browser.

### Usage
Include double.js script to webpage or install npm package. Most of all functions have static and instance methods. Instance methods more handy. Static methods are faster but you need to control memory allocation by yourself. Result of static methods always returned in first variable, that's why they mutate it. If you want to avoid mutation you need to clone it before usage.
```javascript
import { Double } from 'double.js';

// L = sqrt(a^2 + 10)
let L = a.sqr().add(new Double(10)).sqrt();

// S(r) = 4/3 * PI * r^3
const S = (r) => new Double('4.18879020478639098461685784437267').mul(r.pow(3));

// |f'(x)| = (f(x+h) - f(x)) / h;
let dF = (x) => F(x.add(h)).sub(F(x)).div(h);

// |f'(x)| < 1 ? print(x)
if (dF(x).abs().lt(1)) { console.log(x.toNumber()); }
```
You can play with library in [sandbox](https://runkit.com/munrocket/double.js-example/1.1.0). API details you can find in [wiki](https://github.com/munrocket/double.js/wiki) page.

### Current status
Functions mult21/div21 and parseDouble/toString not properly accurate with back and forth operations. Anyway it stable with long repetitive calculations. Give me feedback if you think that this library is useful.

### Special thanks
To [Jeffrey Sarnoff](https://github.com/JeffreySarnoff) for help me with books and algorithm.

### References
1. Theodorus Dekker. *A floating-point technique for extending the available precision*, 1971. [[Viewer](https://gdz.sub.uni-goettingen.de/id/PPN362160546_0018?tify={%22pages%22:[230],%22panX%22:0.306,%22panY%22:0.754,%22view%22:%22info%22,%22zoom%22:0.39})]
2. *Tight and rigourous error bounds for basic building blocks of double-word arithmetic.*, 2017. [[PDF](https://hal.archives-ouvertes.fr/hal-01351529v3/document)]
3. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic*, 2000. [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
4. Christoph Lauter *Basic building blocks for a triple-double intermediate format*, 2006. [[PDF](https://hal.inria.fr/inria-00070314/document)]
5. *Arithmetic Algorithms for Extended Precision Using Floating-Point Expansions*, 2016. [[PDF](http://perso.ens-lyon.fr/jean-michel.muller/07118139.pdf)]
6. Muller, J.-M. Brisebarre, N. de Dinechin, etc. *Handbook of Floating-Point Arithmetic*, Chapter 14, 2010.
