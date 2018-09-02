# double.js
<<<<<<< Updated upstream
----
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) 
![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg) [![Build Status](https://travis-ci.org/munrocket/double.js.svg?branch=master)](https://travis-ci.org/munrocket/double.js) [![dependencies Status](https://david-dm.org/munrocket/double.js/status.svg)](https://david-dm.org/munrocket/double.js)
=======
---
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) 
![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)
[![Build Status](https://travis-ci.org/munrocket/double.js.svg?branch=master)](https://travis-ci.org/munrocket/double.js)
![Codecov](https://img.shields.io/codecov/c/github/munrocket/double.js.svg)
[![dependencies Status](https://david-dm.org/munrocket/double.js/status.svg)](https://david-dm.org/munrocket/double.js)

>>>>>>> Stashed changes

Library for floating point expansions, also known as double-double arithmetic and quad-double arithmetic.

### Precision
Double precision support approximatly 32 accurate decimal digits and stored as unevaluated sum of two ordinary javascript 64 bits IEEE 754 number. Note that only the sum of the two components of the result is meaningful. In particular, the high part of the result does not necessarily equal the result of operating on the high parts.

### Current status
This library under development now. Feel free to contribute.

### References
1. Stef Graillat. *Accurate Floating Point Product and Exponentiation.* 2009 [[PDF](https://hal.archives-ouvertes.fr/hal-00164607/document)]
2. Theodorus Dekker. *A floating-point technique for extending the available precision.* 1971
3. Donald Knuth. *The Art of Computer Programming: Seminumerical Algorithms*, volume 2. 18:224–242, 1981
4. Jonathan Shewchuk. *Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates.* 1997 [[PDF](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)]
5. Arithmetic Algorithms for Extended Precision Using Floating-Point Expansions [[PDF](http://perso.ens-lyon.fr/jean-michel.muller/07118139.pdf)]
6. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic.* 2000 [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
7. David Bailey. *A Thread-Safe Arbitrary Precision Computation Package.* [[PDF](https://www.davidhbailey.com/dhbpapers/mpfun2015.pdf)]