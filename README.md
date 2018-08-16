#DoubleNumber

Library for floating point expansions, also known as double-double arithmetic and quad-double arithmetic.

###Precision

Double precision support approximatly 32 accurate decimal digits and stored as unevaluated sum of two ordinary javascript 64 bits IEEE 754 number. Note that only the sum of the two components of the result is meaningful. In particular, the high part of the result does not necessarily equal the result of operating on the high parts.

###References

1. Stef Graillat. *Accurate Floating Point Product and Exponentiation*. 2009 [[PDF](https://hal.archives-ouvertes.fr/hal-00164607/document)]
2. Theodorus Dekker. *A floating-point technique for extending the available precision.* 1971
3. Donald Knuth. *The Art of Computer Programming: Seminumerical Algorithms*, volume 2. 18:224–242, 1981
4. Jonathan Shewchuk. *Adaptive Precision Floating-Point Arithmetic and Fast Robust Geometric Predicates*. 1997 [[PDF](https://people.eecs.berkeley.edu/~jrs/papers/robustr.pdf)]
5. Yozo Hida, Xiaoye Li, David Bailey. *Library for Double-Double and Quad-Double Arithmetic* 2000 [[PDF](http://web.mit.edu/tabbott/Public/quaddouble-debian/qd-2.3.4-old/docs/qd.pdf)]
6. David Bailey. *A Thread-Safe Arbitrary Precision Computation Package*. 2018 [[PDF](https://www.davidhbailey.com/dhbpapers/mpfun2015.pdf)]