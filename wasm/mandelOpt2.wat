(module

  ;; Temporary global variable
  (global $LO (mut f64) (f64.const 0.0))

  ;; Veltkamp’s splitter (= 2^27+1 for 64-bit float)
  (global $splitter f64 (f64.const 134217729.0))


  ;; Moller's and Knuth's summation (algorithm 2 from [1])
  (func $twoSum (param $a f64) (param $b f64) (result f64)

    (local $s f64) (local $a1 f64)
    (set_local $s (f64.add (get_local $a) (get_local $b)))
    (set_local $a1 (f64.sub (get_local $s) (get_local $b)))
    (set_global $LO
      (f64.add 
        (f64.sub (get_local $a)
                 (get_local $a1))
        (f64.sub (get_local $b)
                 (f64.sub (get_local $s)
                          (get_local $a1)))))

    (get_local $s)
  )

  ;; Dekker’s multiplication (algorithm 4.7 with inlined 4.6 from [2])
  (func $twoProd (param $a f64) (param $b f64) (result f64)

    (local $t f64) (local $ah f64) (local $al f64) (local $bh f64) (local $bl f64)
    (set_local $t (f64.mul (get_global $splitter) (get_local $a)))
    (set_local $ah
      (f64.add (get_local $t)
               (f64.sub (get_local $a)
                        (get_local $t))))
    (set_local $al (f64.sub (get_local $a) (get_local $ah)))
    (set_local $t (f64.mul (get_global $splitter) (get_local $b)))
    (set_local $bh
      (f64.add (get_local $t)
               (f64.sub (get_local $b)
                        (get_local $t))))
    (set_local $bl (f64.sub (get_local $b) (get_local $bh)))
    (set_local $t (f64.mul (get_local $a) (get_local $b)))

    (set_global $LO
      (f64.add  (f64.add
                    (f64.add (f64.sub (f64.mul (get_local $ah)
                                               (get_local $bh))
                                        (get_local $t))
                             (f64.mul (get_local $ah)
                                        (get_local $bl)))
                    (f64.mul (get_local $al)
                             (get_local $bh)))
                (f64.mul (get_local $al)
                         (get_local $bl))))

    (get_local $t)
  )

  ;; Optimized for squares Dekker’s multiplication 
  (func $oneSqr (param $a f64) (param $b f64) (result f64)

    (local $t f64) (local $ah f64) (local $al f64) (local $hl f64)
    (set_local $t (f64.mul (get_global $splitter) (get_local $a)))
    (set_local $ah
      (f64.add (get_local $t)
               (f64.sub (get_local $a)
                        (get_local $t))))
    (set_local $al (f64.sub (get_local $a) (get_local $ah)))
    (set_local $hl (f64.mul (get_local $al) (get_local $ah)))

    (set_global $LO
      (f64.add  (f64.add
                    (f64.add (f64.sub (f64.mul (get_local $ah)
                                               (get_local $ah))
                                      (get_local $t))
                             (get_local $hl))
                    (get_local $hl))
                (f64.mul (get_local $al)
                         (get_local $al))))

    (get_local $t)
  )

  ;; AccurateDWPlusDW (6 with inlined 1 from [1])
  (func $add22 (param $Xh f64) (param $Xl f64) (param $Yh f64) (param $Yl f64) (result f64)

    (local $Sh f64) (local $Sl f64) (local $Eh f64) (local $El f64)
    
    (set_local $Sh (call $twoSum (get_local $Xh) (get_local $Yh)))
    (set_local $Sl (get_global $LO))
    (set_local $Eh (call $twoSum (get_local $Xl) (get_local $Yl)))
    (set_local $El (get_global $LO))

    (set_local $Yh (f64.add (get_local $Sl) (get_local $Eh)))
    (set_local $Sl (f64.add (get_local $Sh) (get_local $Yh)))
    (set_local $Yl (f64.sub (get_local $Yh)
                            (f64.sub (get_local $Sl) (get_local $Sh))))

    (set_local $Yh (f64.add (get_local $Yl) (get_local $El)))
    (set_local $Xh (f64.add (get_local $Sl) (get_local $Yh)))
    (set_global $LO (f64.sub (get_local $Yh)
                             (f64.sub (get_local $Xh) (get_local $Sl))))

    (get_local $Xh)
  )

  ;; Negated AccurateDWPlusDW
  (func $sub22 (param $Xh f64) (param $Xl f64) (param $Yh f64) (param $Yl f64) (result f64)
    
    (local $Sh f64) (local $Sl f64) (local $Eh f64) (local $El f64)
    
    (set_local $Sh (call $twoSum (get_local $Xh) (f64.neg (get_local $Yh))))
    (set_local $Sl (get_global $LO))
    (set_local $Eh (call $twoSum (get_local $Xl) (f64.neg (get_local $Yl))))
    (set_local $El (get_global $LO))

    (set_local $Yh (f64.add (get_local $Sl) (get_local $Eh)))
    (set_local $Sl (f64.add (get_local $Sh) (get_local $Yh)))
    (set_local $Yl (f64.sub (get_local $Yh)
                            (f64.sub (get_local $Sl) (get_local $Sh))))

    (set_local $Yh (f64.add (get_local $Yl) (get_local $El)))
    (set_local $Xh (f64.add (get_local $Sl) (get_local $Yh)))
    (set_global $LO (f64.sub (get_local $Yh)
                             (f64.sub (get_local $Xh) (get_local $Sl))))

    (get_local $Xh)
  )

  ;; DWTimesDW1 (10 with inlined 1 from [1])
  (func $mul22 (param $Xh f64) (param $Xl f64) (param $Yh f64) (param $Yl f64) (result f64)

    (local $Sh f64) (local $Sl f64)
    (set_local $Sh (call $twoProd (get_local $Xh) (get_local $Yh)))
    (set_local $Sl (get_global $LO))

    (set_local $Sl (f64.add (get_local $Sl)
                   (f64.add (f64.mul (get_local $Xh) (get_local $Yl))
                            (f64.mul (get_local $Xl) (get_local $Yh)))))
    (set_local $Xh (f64.add (get_local $Sh) (get_local $Sl)))
    (set_global $LO (f64.sub (get_local $Sl)
                             (f64.sub (get_local $Xh) (get_local $Sh))))

    (get_local $Xh)
  )

  ;; DWDivDW1 unknown algo
  (func $div22 (param $Xh f64) (param $Xl f64) (param $Yh f64) (param $Yl f64) (result f64)

    (local $s f64) (local $Th f64) (local $Tl f64) (local $e f64)
    (set_local $s (f64.div (get_local $Xh) (get_local $Yh)))
    (set_local $Th (call $twoProd (get_local $s) (get_local $Yh)))
    (set_local $Tl (get_global $LO))
    (set_local $e
      (f64.div (f64.sub
                    (f64.add (f64.sub (f64.sub (get_local $Xh) (get_local $Th))
                                      (get_local $Tl))
                             (get_local $Xl))
                    (f64.mul (get_local $s) (get_local $Yl)))
               (get_local $Yh)))
    (set_local $Xh (f64.add (get_local $s) (get_local $e)))
    (set_global $LO (f64.sub (get_local $e)
                             (f64.sub (get_local $Xh) (get_local $s))))

    (get_local $Xh)
  )

  ;; test()
  (func $test (param $Eh f64) (param $El f64) (param $Lh f64) (param $Ll f64) (result f64)

    (local $result f64) (local $Rh f64) (local $Rl f64) (local $diff f64)
    (set_local $result (f64.const 0.))
    (set_local $Rh (call $sub22 (call $sub22 (call $add22 (get_local $Eh)
                                                          (get_local $El)
                                                          (get_local $Lh)
                                                          (get_local $Ll))
                                             (get_global $LO)
                                             (get_local $Lh)
                                             (get_local $Ll))
                                (get_global $LO)
                                (get_local $Eh)
                                (get_local $El)))
    (set_local $Rl (get_global $LO))
    (set_local $diff (f64.abs (f64.add (get_local $Rh) (get_local $Rl))))
    (if (f64.gt (get_local $diff) (f64.const 1e-30))
      (then (set_local $result (f64.add (get_local $result) (f64.const 1.))))
    )

    (set_local $Rh (call $sub22 (call $div22 (call $mul22 (get_local $Eh)
                                                          (get_local $El)
                                                          (get_local $Lh)
                                                          (get_local $Ll))
                                             (get_global $LO)
                                             (get_local $Lh)
                                             (get_local $Ll))
                                (get_global $LO)
                                (get_local $Eh)
                                (get_local $El)))
    (set_local $Rl (get_global $LO))
    (set_local $diff (f64.abs (f64.add (get_local $Rh) (get_local $Rl))))
    (if (f64.gt (get_local $diff) (f64.const 1e-30))
      (then (set_local $result (f64.add (get_local $result) (f64.const 2.))))
    )

    (get_local $result)
  )

  ;; Benchmark
  (func $mandelbrot (param $maxi i32) (param $w f64) (param $h f64)
                    (param $TXh f64) (param $TYh f64)
                    (param $DXh f64) (param $DYh f64)
                    (param $i f64) (param $j f64) (result i32)

    (local $Xl f64) (local $Xh f64)
    (local $Yl f64) (local $Yh f64)
    (local $XXl f64) (local $XXh f64)
    (local $XYl f64) (local $XYh f64)
    (local $YYl f64) (local $YYh f64)
    (local $TXl f64) (local $TYl f64)
    (local $DXl f64) (local $DYl f64)
    (local $CXl f64) (local $CXh f64)
    (local $CYl f64) (local $CYh f64)
    (local $iter i32)

    (set_local $Xl (f64.const 0.)) (set_local $Xh (f64.const 0.))
    (set_local $Yl (f64.const 0.)) (set_local $Yh (f64.const 0.))
    (set_local $XXl (f64.const 0.)) (set_local $XXh (f64.const 0.))
    (set_local $XYl (f64.const 0.)) (set_local $XYh (f64.const 0.))
    (set_local $YYl (f64.const 0.)) (set_local $YYh (f64.const 0.))
    (set_local $TXl (f64.const 0.)) (set_local $TYl (f64.const 0.))
    (set_local $DXl (f64.const 0.)) (set_local $DYl (f64.const 0.))

    (set_local $CXl
      (call $add22 (call $sub22 (get_local $TXh)
                                (get_local $TXl)
                                (get_local $DXh)
                                (get_local $DXl))
                   (get_global $LO)
                   (call $div22 (call $mul22  (get_local $DXh)
                                              (get_local $DXl)
                                              (f64.mul (f64.const 2.) (get_local $i))
                                              (f64.const 0.))
                                (get_global $LO)
                                (get_local $w)
                                (f64.const 0.))
                   (get_global $LO)))
    (set_local $CXh (get_global $LO))
    (set_local $CYl
      (call $add22 (call $sub22 (get_local $TYh)
                                (get_local $TYl)
                                (get_local $DYh)
                                (get_local $DYl))
                   (get_global $LO)
                   (call $div22 (call $mul22  (get_local $DYh)
                                              (get_local $DYl)
                                              (f64.mul (f64.const 2.) (get_local $j))
                                              (f64.const 0.))
                                (get_global $LO)
                                (get_local $h)
                                (f64.const 0.))
                   (get_global $LO)))
    (set_local $CYh (get_global $LO))

    (set_local $iter (i32.const 0))
    (block 
      (loop 
        (set_local $Xh (call $add22 (call $sub22 (get_local $XXh)
                                                 (get_local $XXl)
                                                 (get_local $YYh)
                                                 (get_local $YYl))
                                    (get_global $LO)
                                    (get_local $CXh)
                                    (get_local $CXl)))
        (set_local $Xl (get_global $LO))

        (set_local $Yh (call $add22 (call $add22 (get_local $XYh)
                                                 (get_local $XYl)
                                                 (get_local $XYh)
                                                 (get_local $XYl))
                                    (get_global $LO)
                                    (get_local $CYh)
                                    (get_local $CYl)))
        (set_local $Yl (get_global $LO))

        (set_local $XXh (call $mul22 (get_local $Xh)
                                     (get_local $Xl)
                                     (get_local $Xh)
                                     (get_local $Xl)))
        (set_local $XXl (get_global $LO))

        (set_local $XYh (call $mul22 (get_local $Xh)
                                     (get_local $Xl)
                                     (get_local $Yh)
                                     (get_local $Yl)))
        (set_local $XYl (get_global $LO))

        (set_local $YYh (call $mul22 (get_local $Yh)
                                     (get_local $Yl)
                                     (get_local $Yh)
                                     (get_local $Yl)))
        (set_local $YYl (get_global $LO))
        
        (set_local $iter (i32.add (get_local $iter) (i32.const 1)))
        (br_if 1 (i32.or (i32.ge_u (get_local $iter) (get_local $maxi))
                         (f64.ge (call $add22 (get_local $XXh)
                                              (get_local $XXl)
                                              (get_local $YYh)
                                              (get_local $YYl))
                                 (f64.const 4.))))
        (br 0)
      )
    )

    (get_local $iter)
  )

  (export "add22" (func $add22))
  (export "sub22" (func $sub22))
  (export "mul22" (func $mul22))
  (export "div22" (func $div22))
  (export "test" (func $test))
  (export "mandelbrot" (func $mandelbrot))
  (func (export "LO") (result f64) (get_global $LO))
)