var Double = (function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /* Basic error-free algorithms */
  var splitter = 134217729; // Veltkamp’s splitter (equal to 2^27+1 for 64-bit float)
  // Møller's and Knuth's summation (algorithm 2 from [1])

  var twoSum = function twoSum(a, b) {
    var s = a + b;
    var a1 = s - b;
    return {
      hi: s,
      lo: a - a1 + (b - (s - a1))
    };
  }; // Dekker’s multiplication (algorithm 4.7 with inlined 4.6 from [2])


  var twoMult = function twoMult(a, b) {
    var t = splitter * a;
    var ah = t + (a - t),
        al = a - ah;
    t = splitter * b;
    var bh = t + (b - t),
        bl = b - bh;
    t = a * b;
    return {
      hi: t,
      lo: -t + ah * bh + ah * bl + al * bh + al * bl
    };
  };

  var oneSqr = function oneSqr(a) {
    var t = splitter * a;
    var ah = t + (a - t),
        al = a - ah;
    t = a * a;
    var hl = al * ah;
    return {
      hi: t,
      lo: -t + ah * ah + hl + hl + al * al
    };
  };
  /* Main class for double-length float number */


  var Double =
  /*#__PURE__*/
  function () {
    function Double(val) {
      _classCallCheck(this, Double);

      if (val instanceof Double) {
        this.hi = val.hi;
        this.lo = val.lo;
      } else if (typeof val === 'number') {
        this.hi = val;
        this.lo = 0;
      } else if (typeof val === 'string') {
        var d = Double.fromString(val);
        this.hi = d.hi;
        this.lo = d.lo;
      } else if (Array.isArray(val)) {
        this.hi = val[0];
        this.lo = val[1];
      } else if (_typeof(val) === "object") {
        this.hi = val.hi;
        this.lo = val.lo;
      }
    }
    /* Constructors blocks */


    _createClass(Double, [{
      key: "toNumber",

      /* Convertations */
      value: function toNumber() {
        return this.hi + this.lo;
      }
    }, {
      key: "toExponential",
      value: function toExponential(precision) {
        if (precision === undefined) precision = 31;
        var result = this.hi < 0 ? '-' : '';
        if (isNaN(this.hi)) return 'NaN';
        if (!isFinite(this.hi)) return result + 'Infinity';
        if (this.toNumber() == 0) return '0e+0';
        var exp = this.hi.toExponential().split('e')[1];
        var str, nextDigs, shift, isPositive;

        for (var i = 0; i < precision; i += 15) {
          str = this.hi.toExponential().split('e');
          isPositive = str[0][0] != '-';
          nextDigs = str[0].replace(/^0\.|\./, '').slice(0, 15);
          if (!isPositive) nextDigs = nextDigs.slice(1);
          shift = Double.pow2n(new Double(10), parseInt(str[1]) - 14);
          Double.sub22(this, Double.mul21(shift, parseInt(nextDigs) * (isPositive ? 1 : -1)));
          nextDigs = nextDigs.slice(0, precision - i);
          result += i != 0 ? nextDigs : nextDigs.slice(0, 1) + '.' + nextDigs.slice(1);
        }

        return result + 'e' + exp;
      }
      /* Arithmetic operations with two double */

    }, {
      key: "add",

      /* Repeating static methods to instance */
      value: function add(other) {
        if (other instanceof Double) return Double.add22(Double.clone(this), other);else if (typeof other == 'number') return Double.add21(Double.clone(this), other);
      }
    }, {
      key: "sub",
      value: function sub(other) {
        if (other instanceof Double) return Double.sub22(Double.clone(this), other);else if (typeof other == 'number') return Double.sub21(Double.clone(this), other);
      }
    }, {
      key: "mul",
      value: function mul(other) {
        if (other instanceof Double) return Double.mul22(Double.clone(this), other);else if (typeof other == 'number') return Double.mul21(Double.clone(this), other);
      }
    }, {
      key: "div",
      value: function div(other) {
        if (other instanceof Double) return Double.div22(Double.clone(this), other);else if (typeof other == 'number') return Double.div21(Double.clone(this), other);
      }
    }, {
      key: "pow",
      value: function pow(exp) {
        return Double.pow22(Double.clone(this), exp);
      }
    }, {
      key: "pown",
      value: function pown(exp) {
        return Double.pow2n(Double.clone(this), exp);
      }
    }, {
      key: "abs",
      value: function abs() {
        return Double.abs2(Double.clone(this));
      }
    }, {
      key: "neg",
      value: function neg() {
        return Double.neg2(Double.clone(this));
      }
    }, {
      key: "inv",
      value: function inv() {
        return Double.inv2(Double.clone(this));
      }
    }, {
      key: "sqr",
      value: function sqr() {
        return Double.sqr2(Double.clone(this));
      }
    }, {
      key: "sqrt",
      value: function sqrt() {
        return Double.sqrt2(Double.clone(this));
      }
    }, {
      key: "exp",
      value: function exp() {
        return Double.exp2(Double.clone(this));
      }
    }, {
      key: "ln",
      value: function ln() {
        return Double.ln2(Double.clone(this));
      }
    }, {
      key: "sinh",
      value: function sinh() {
        return Double.sinh2(Double.clone(this));
      }
    }, {
      key: "cosh",
      value: function cosh() {
        return Double.cosh2(Double.clone(this));
      }
    }, {
      key: "eq",
      value: function eq(other) {
        if (other instanceof Double) return Double.eq22(Double.clone(this), other);else if (typeof other == 'number') return Double.eq21(Double.clone(this), other);
      }
    }, {
      key: "ne",
      value: function ne(other) {
        if (other instanceof Double) return Double.ne22(Double.clone(this), other);else if (typeof other == 'number') return Double.ne21(Double.clone(this), other);
      }
    }, {
      key: "gt",
      value: function gt(other) {
        if (other instanceof Double) return Double.gt22(Double.clone(this), other);else if (typeof other == 'number') return Double.gt21(Double.clone(this), other);
      }
    }, {
      key: "lt",
      value: function lt(other) {
        if (other instanceof Double) return Double.lt22(Double.clone(this), other);else if (typeof other == 'number') return Double.lt21(Double.clone(this), other);
      }
    }, {
      key: "ge",
      value: function ge(other) {
        if (other instanceof Double) return Double.ge22(Double.clone(this), other);else if (typeof other == 'number') return Double.ge21(Double.clone(this), other);
      }
    }, {
      key: "le",
      value: function le(other) {
        if (other instanceof Double) return Double.le22(Double.clone(this), other);else if (typeof other == 'number') return Double.le21(Double.clone(this), other);
      }
    }], [{
      key: "clone",
      value: function clone(X) {
        var d = new Double();
        d.hi = X.hi;
        d.lo = X.lo;
        return d;
      }
    }, {
      key: "fromSum11",
      value: function fromSum11(a, b) {
        return new Double(twoSum(a, b));
      }
    }, {
      key: "fromMul11",
      value: function fromMul11(a, b) {
        return new Double(twoMult(a, b));
      }
    }, {
      key: "fromSqr1",
      value: function fromSqr1(a) {
        return new Double(oneSqr(a));
      }
    }, {
      key: "fromString",
      value: function fromString(string) {
        var isPositive = /^\s*-/.exec(string) === null;
        var str = string.replace(/^\s*[+-]?/, '');
        if (/Infinity.*/.exec(str) !== null) return isPositive ? Double.Infinity : Double.neg2(Double.Infinity);
        str = /^([0-9]*\.?[0-9]+)(?:[eE]([-+]?[0-9]+))?/.exec(str);
        if (!str) return Double.NaN;
        var digits = str[1].replace('.', '');
        var exp = str[2] !== undefined ? parseInt(str[2]) : 0;
        var dotId = str[0].indexOf('.');
        if (dotId == -1) dotId = digits.length;
        if (exp + dotId - 1 < -300) return isPositive ? Double.Zero : Double.neg2(Double.Zero);
        if (exp + dotId - 1 > 300) return isPositive ? Double.Infinity : Double.neg2(Double.Infinity);
        var nextDigs,
            shift,
            result = Double.Zero;

        for (var i = 0; i < digits.length; i += 15) {
          nextDigs = digits.slice(i, i + 15);
          shift = Double.pow2n(new Double(10), exp + dotId - i - nextDigs.length);
          Double.add22(result, Double.mul21(shift, parseInt(nextDigs)));
        }

        return isPositive ? result : Double.neg2(result);
      }
    }, {
      key: "add22",
      value: function add22(X, Y) {
        // AccurateDWPlusDW (6 with inlined 1 from [1])
        var S = twoSum(X.hi, Y.hi);
        var E = twoSum(X.lo, Y.lo);
        var c = S.lo + E.hi;
        var vh = S.hi + c,
            vl = c - (vh - S.hi);
        c = vl + E.lo;
        X.hi = vh + c;
        X.lo = c - (X.hi - vh);
        return X;
      }
    }, {
      key: "sub22",
      value: function sub22(X, Y) {
        var S = twoSum(X.hi, -Y.hi);
        var E = twoSum(X.lo, -Y.lo);
        var c = S.lo + E.hi;
        var vh = S.hi + c,
            vl = S.hi - vh + c;
        var w = vl + E.lo;
        X.hi = vh + w;
        X.lo = w - (X.hi - vh);
        return X;
      }
    }, {
      key: "mul22",
      value: function mul22(X, Y) {
        // DWTimesDW1 (10 with inlined 1 from [1])
        var S = twoMult(X.hi, Y.hi);
        S.lo += X.hi * Y.lo + X.lo * Y.hi;
        X.hi = S.hi + S.lo;
        X.lo = S.lo - (X.hi - S.hi);
        return X;
      }
    }, {
      key: "div22",
      value: function div22(X, Y) {
        // DWDivDW1 (16 with inlined 1 from [1])
        var s = X.hi / Y.hi;
        var T = twoMult(s, Y.hi);
        var e = (X.hi - T.hi - T.lo + X.lo - s * Y.lo) / Y.hi;
        X.hi = s + e;
        X.lo = e - (X.hi - s);
        return X;
      }
    }, {
      key: "pow22",
      value: function pow22(base, ex) {
        return Double.exp2(Double.mul22(Double.ln2(base), ex));
      }
      /* Unar operators with double */

    }, {
      key: "abs2",
      value: function abs2(X) {
        if (X.hi < 0) {
          X.hi = -X.hi;
          X.lo = -X.lo;
        }

        return X;
      }
    }, {
      key: "neg2",
      value: function neg2(X) {
        X.hi = -X.hi;
        X.lo = -X.lo;
        return X;
      }
    }, {
      key: "inv2",
      value: function inv2(X) {
        var xh = X.hi;
        var s = 1 / xh;
        Double.mul21(X, s);
        var zl = (1 - X.hi - X.lo) / xh;
        X.hi = s + zl;
        X.lo = zl - (X.hi - s);
        return X;
      }
    }, {
      key: "sqr2",
      value: function sqr2(X) {
        var S = oneSqr(X.hi);
        var c = X.hi * X.lo;
        S.lo += c + c;
        X.hi = S.hi + S.lo;
        X.lo = S.lo - (X.hi - S.hi);
        return X;
      }
    }, {
      key: "sqrt2",
      value: function sqrt2(X) {
        var s = Math.sqrt(X.hi);
        var T = oneSqr(s);
        var e = (X.hi - T.hi - T.lo + X.lo) * 0.5 / s;
        X.hi = s + e;
        X.lo = e - (X.hi - s);
        return X;
      }
    }, {
      key: "exp2",
      value: function exp2(X) {
        if (Double.eq21(X, 0)) return Double.One;
        if (Double.eq21(X, 1)) return Double.E;
        if (Double.lt21(X, -709)) return Double.Zero;
        if (Double.gt21(X, 709)) return Double.Infinity;
        var n = Math.floor(X.hi / Double.Log2.hi + 0.5);
        Double.sub22(X, Double.mul21(Double.Log2, n));
        var U = Double.One,
            V = Double.One;
        var padeCoef = [1, 272, 36720, 3255840, 211629600, 10666131840, 430200650880, 14135164243200, 381649434566400, 8481098545920000, 154355993535744030, 2273242813890047700, 26521166162050560000, 236650405753681870000, 1.5213240369879552e+21, 6.288139352883548e+21, 1.2576278705767096e+22];

        for (var i = 0, cLen = padeCoef.length; i < cLen; i++) {
          Double.add21(Double.mul22(U, X), padeCoef[i]);
        }

        for (var _i = 0, _cLen = padeCoef.length; _i < _cLen; _i++) {
          Double.add21(Double.mul22(V, X), padeCoef[_i] * (_i % 2 ? -1 : 1));
        }

        X = Double.mul21pow2(Double.div22(U, V), n);
        return X;
      }
    }, {
      key: "ln2",
      value: function ln2(X) {
        if (Double.le21(X, 0)) return Double.NaN;
        if (Double.eq21(X, 1)) return Double.Zero;
        var Z = new Double(Math.log(X.hi));
        Double.sub21(Double.add22(Double.mul22(X, Double.exp2(Double.neg2(Double.clone(Z)))), Z), 1);
        return X;
      }
    }, {
      key: "sinh2",
      value: function sinh2(X) {
        var exp = Double.exp2(X);
        X = Double.mul21pow2(Double.sub22(new Double(exp), Double.inv2(exp)), -1);
        return X;
      }
    }, {
      key: "cosh2",
      value: function cosh2(X) {
        var exp = Double.exp2(X);
        X = Double.mul21pow2(Double.add22(new Double(exp), Double.inv2(exp)), -1);
        return X;
      }
      /* Arithmetic operations with double and single */

    }, {
      key: "add21",
      value: function add21(X, y) {
        // DWPlusFP (4 with inlined 1 from [1])
        var S = twoSum(X.hi, y);
        S.lo += X.lo;
        X.hi = S.hi + S.lo;
        X.lo = S.lo - (X.hi - S.hi);
        return X;
      }
    }, {
      key: "sub21",
      value: function sub21(X, y) {
        var S = twoSum(X.hi, -y);
        S.lo += X.lo;
        X.hi = S.hi + S.lo;
        X.lo = S.lo - (X.hi - S.hi);
        return X;
      }
    }, {
      key: "mul21",
      value: function mul21(X, y) {
        // DWTimesFP1 (7 with inlined 1 from [1])
        var C = twoMult(X.hi, y);
        var cl = X.lo * y;
        var th = C.hi + cl;
        X.lo = cl - (th - C.hi);
        cl = X.lo + C.lo;
        X.hi = th + cl;
        X.lo = cl - (X.hi - th);
        return X;
      }
    }, {
      key: "div21",
      value: function div21(X, y) {
        // DWDivFP1 (13 with inlined 1 from [1])
        var th = X.hi / y;
        var P = twoMult(th, y);
        var D = twoSum(X.hi, -P.hi);
        var tl = (D.hi + (D.lo + (X.lo - P.lo))) / y;
        X.hi = th + tl;
        X.lo = tl - (X.hi - th);
        return X;
      }
    }, {
      key: "mul21pow2",
      value: function mul21pow2(X, n) {
        var c = 1 << Math.abs(n);
        if (n < 0) c = 1 / c;
        X.hi = X.hi * c;
        X.lo = X.lo * c;
        return X;
      }
    }, {
      key: "pow2n",
      value: function pow2n(X, n) {
        if (n === 0) return Double.One;
        if (n == 1) return X;
        var isPositive = n > 0;
        if (!isPositive) n = -n;
        var i = Math.floor(Math.log(n) / Math.log(2));
        var j = Math.floor(n - (1 << i));
        var X0 = Double.clone(X);

        while (i--) {
          Double.sqr2(X);
        }

        while (j--) {
          Double.mul22(X, X0);
        }

        return isPositive ? X : Double.inv2(X);
      }
      /* Different comparisons */

    }, {
      key: "eq22",
      value: function eq22(X, Y) {
        return X.hi === Y.hi && X.lo === Y.lo;
      }
    }, {
      key: "ne22",
      value: function ne22(X, Y) {
        return X.hi !== Y.hi || X.lo !== Y.lo;
      }
    }, {
      key: "gt22",
      value: function gt22(X, Y) {
        return X.hi > Y.hi || X.hi === Y.hi && X.lo > Y.lo;
      }
    }, {
      key: "lt22",
      value: function lt22(X, Y) {
        return X.hi < Y.hi || X.hi === Y.hi && X.lo < Y.lo;
      }
    }, {
      key: "ge22",
      value: function ge22(X, Y) {
        return X.hi > Y.hi || X.hi === Y.hi && X.lo >= Y.lo;
      }
    }, {
      key: "le22",
      value: function le22(X, Y) {
        return X.hi < Y.hi || X.hi === Y.hi && X.lo <= Y.lo;
      }
    }, {
      key: "eq21",
      value: function eq21(X, a) {
        return X.hi === a && X.lo === 0;
      }
    }, {
      key: "ne21",
      value: function ne21(X, a) {
        return X.hi !== a || X.lo !== 0;
      }
    }, {
      key: "gt21",
      value: function gt21(X, a) {
        return X.hi > a || X.hi === a && X.lo > 0;
      }
    }, {
      key: "lt21",
      value: function lt21(X, a) {
        return X.hi < a || X.hi === a && X.lo < 0;
      }
    }, {
      key: "ge21",
      value: function ge21(X, a) {
        return X.hi > a || X.hi === a && X.lo >= 0;
      }
    }, {
      key: "le21",
      value: function le21(X, a) {
        return X.hi < a || X.hi === a && X.lo <= 0;
      }
      /* Double constants */

    }, {
      key: "One",
      get: function get() {
        var d = new Double();
        d.hi = 1;
        d.lo = 0;
        return d;
      }
    }, {
      key: "Zero",
      get: function get() {
        var d = new Double();
        d.hi = 0;
        d.lo = 0;
        return d;
      }
    }, {
      key: "Infinity",
      get: function get() {
        var d = new Double();
        d.hi = Infinity;
        d.lo = Infinity;
        return d;
      }
    }, {
      key: "NaN",
      get: function get() {
        var d = new Double();
        d.hi = NaN;
        d.lo = NaN;
        return d;
      }
    }, {
      key: "Pi",
      get: function get() {
        var d = new Double();
        d.hi = 3.141592653589793116;
        d.lo = 1.224646799147353207e-16;
        return d;
      }
    }, {
      key: "X2Pi",
      get: function get() {
        var d = new Double();
        d.hi = 6.283185307179586232;
        d.lo = 2.449293598294706414e-16;
        return d;
      }
    }, {
      key: "E",
      get: function get() {
        var d = new Double();
        d.hi = 2.718281828459045;
        d.lo = 1.4456468917292502e-16;
        return d;
      }
    }, {
      key: "Log2",
      get: function get() {
        var d = new Double();
        d.hi = 0.6931471805599453;
        d.lo = 2.3190468138462996e-17;
        return d;
      }
    }, {
      key: "Phi",
      get: function get() {
        var d = new Double();
        d.hi = 1.618033988749895;
        d.lo = -5.4321152036825055e-17;
        return d;
      }
    }]);

    return Double;
  }();

  return Double;

}());
