# double.js [![bundlephobia](https://badgen.net/bundlephobia/minzip/double.js)](https://bundlephobia.com/result?p=double.js) [![Codecov](https://img.shields.io/codecov/c/github/munrocket/double.js.svg)](https://codecov.io/gh/munrocket/double.js)

Floating point expansion with 31 accurate decimal digits (106 bits), also known as double-double arithmetic or
emulated float128. This library can be useful for fast calculation with extended precision. For example in orbital mechanics, computational geometry and numerically unstable algorithms such as performing triangulation, polygon clipping,
inverting matrix and finding differentials.

### Algorithm
Number stored as unevaluated sum of two javascript float numbers and uses error-free arithmetic algorithms.
This brings accuracy and significant increase in performance in comparison to
digit-wise approach, because this float arithmetic is implemented in hardware. Note that there are no
theoretical limitations to javascript language since ECMAScript uses 64 bit IEEE 754 with
round-to-nearest-even after each operation and without FMA instruction.

### Benchmark
![](https://habrastorage.org/webt/zy/1e/5u/zy1e5ur2yb2l_z-hwz6bkcygdk8.png)

You can check [quality](https://munrocket.github.io/double.js/test/benchmark.html), [performance](https://www.measurethat.net/Benchmarks/Show/11028/0/doublejs-benchmark5) and [correctness](https://munrocket.github.io/double.js/test/test.html) of double.js library in your browser.

### Usage
Include double.js script to webpage or install npm package. Here some basic examples
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
Further API details you can find in [wiki](https://github.com/munrocket/double.js/wiki) page and check it in [sandbox](https://runkit.com/munrocket/double-js-example). Be careful when initializing a new floats, for example `new Double(0.1)` is ok for integer numbers, but you should use `new Double('0.1')` to get correct results for fractional numburs. All double-double arithmetic functions are accurate and tested, say me if you find something strange.

### Webassembly version
To get speed improvement with wasm, you need to write your entire algorithm with it, because Js<->Wasm interop is too heavy.
For example I got x3 boost in Chrome, x3.5 in Safari and x7 in Firefox for mandelbrot set algo, but with hardcoded global variables.

### WebGL/WebGPU versions
Just copy/paste the code with MIT copyright.
### Special thanks
To [Jeffrey Sarnoff](https://github.com/JeffreySarnoff) for help me with books and algorithms. [Sergey Yanovich](https://github.com/yanovich) for fixing issues with toExponential(). To [Max Graey](https://github.com/MaxGraey) for AssemblyScript remarks. To [Yaffle](https://github.com/Yaffle) for fixing benchmark.

### Want more functions?
If you want more functions (trigonometric for example) open an issue.

### References
1. J.-M. Muller, etc. *Tight and rigourous error bounds for basic building blocks of double-word arithmetic.*, 2017. [[PDF](https://hal.archives-ouvertes.fr/hal-01351529v3/document)]
2. J.-M. Muller, N. Brisebarre, F. deDinechin, etc. *Handbook of Floating-Point Arithmetic*, Chapter 14, 2010.
3. Theodorus Dekker. *A floating-point technique for extending the available precision*, 1971. [[Viewer](https://gdz.sub.uni-goettingen.de/id/PPN362160546_0018?tify={%22pages%22:[230],%22panX%22:0.306,%22panY%22:0.754,%22view%22:%22info%22,%22zoom%22:0.39})]
4. David Monniaux *The pitfalls of verifying floating-point computations*, 2008 [[PDF](https://hal.archives-ouvertes.fr/hal-00128124/file/floating-point-article.pdf)]
5. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic*, 2000. [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
6. Christoph Lauter *Basic building blocks for a triple-double intermediate format*, 2006. [[PDF](https://hal.inria.fr/inria-00070314/document)]
