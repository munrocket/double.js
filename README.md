# double.js
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) 
![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)
[![Build Status](https://travis-ci.org/munrocket/double.js.svg?branch=master)](https://travis-ci.org/munrocket/double.js)
[![Codecov](https://img.shields.io/codecov/c/github/munrocket/double.js.svg)](https://codecov.io/gh/munrocket/double.js)
[![dependencies Status](https://david-dm.org/munrocket/double.js/status.svg)](https://david-dm.org/munrocket/double.js)


Floating point expansions with 31 accurate decimal digits, also known as double-double arithmetic.

### Algorithm
Number stored as unevaluated sum of two javascript float numbers and uses error-free arithmetic algorithms from references below. This brings accuracy and significant increase in performance in comparison to digit-wise approach, because this float arithmetic is implemented in hardware. Note that there are no theoretical limitations in javascript language since ECMAScript version 1 uses 64 bit IEEE 754 with round-to-nearest after each operations.

### Usage
Add double.iife.js script to webpage or clone repository from github if you use it in nodejs. Most of all functions have static and instance methods. Instance methods more handy. Static methods are faster but you need to control memory allocation by yourself. Result of static methods always returned in first variable, that's why they mutate it. If you want to avoid mutation you need to clone it before usage. List of all methods you can find in wiki page.

### Current status
This library under development now, basic arithmetic operation is stable but mult21/div21 and parseDouble/toString not properly accurate. You can check passed unit tests in travis. Feel free to contribute.

### Future improvements
Implementing trigonometric operations and quad-double with 63 accurate decimal digits, proper cheking for Infinity and NaN.

### Benchmark
![double.js](https://i.imgur.com/aR082qE.png)

### References
1. Theodorus Dekker. *A floating-point technique for extending the available precision.* 1971 [[Viewer](https://gdz.sub.uni-goettingen.de/id/PPN362160546_0018?tify={%22pages%22:[230],%22panX%22:0.306,%22panY%22:0.754,%22view%22:%22info%22,%22zoom%22:0.39})]
2. Stef Graillat. *Accurate Floating Point Product and Exponentiation.* 2009 [[PDF](https://hal.archives-ouvertes.fr/hal-00164607/document)]
3. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic.* 2000 [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
4. David Bailey. *A Thread-Safe Arbitrary Precision Computation Package MPFUN2015.* 2018 [[PDF](https://www.davidhbailey.com/dhbpapers/mpfun2015.pdf)]
5. Jonathan Shewchuk. *Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates.* 1997 [[PDF](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)]
6. *Arithmetic Algorithms for Extended Precision Using Floating-Point Expansions* 2016 [[PDF](http://perso.ens-lyon.fr/jean-michel.muller/07118139.pdf)]