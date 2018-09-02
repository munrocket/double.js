# double.js
---
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) 
![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)
[![Build Status](https://travis-ci.org/munrocket/double.js.svg?branch=master)](https://travis-ci.org/munrocket/double.js)
[![Codecov](https://img.shields.io/codecov/c/github/munrocket/double.js.svg)](https://codecov.io/gh/munrocket/double.js)
[![dependencies Status](https://david-dm.org/munrocket/double.js/status.svg)](https://david-dm.org/munrocket/double.js)


Floating point expansions with 32 accurate decimal digits, also known as double-double arithmetic.

### Algorithm
Number stored as unevaluated sum of two ordinary javascript IEEE 754 numbers and uses error-free arithmetic algorithms from references below. This brings accuracy and significant increase in performance in comparison with the traditional approach. Especially in javascript because it doesn't have small number types and other libraries uses strings.

### Current status
This library under development now, some operations not properly accurate. Note that only the sum of the two components of the result is meaningful. In particular, the high part of the result does not necessarily equal the result of operating on the high parts. Feel free to contribute.

### Future improvements
Implementing trigonometric operations and quad-double with 64 accurate decimal digits.

### References
1. Stef Graillat. *Accurate Floating Point Product and Exponentiation.* 2009 [[PDF](https://hal.archives-ouvertes.fr/hal-00164607/document)]
2. Theodorus Dekker. *A floating-point technique for extending the available precision.* 1971
3. Donald Knuth. *The Art of Computer Programming: Seminumerical Algorithms*, volume 2. 18:224–242, 1981
4. Jonathan Shewchuk. *Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates.* 1997 [[PDF](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)]
5. Arithmetic Algorithms for Extended Precision Using Floating-Point Expansions [[PDF](http://perso.ens-lyon.fr/jean-michel.muller/07118139.pdf)]
6. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic.* 2000 [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
7. David Bailey. *A Thread-Safe Arbitrary Precision Computation Package.* [[PDF](https://www.davidhbailey.com/dhbpapers/mpfun2015.pdf)]