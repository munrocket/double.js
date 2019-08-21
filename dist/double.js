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
  var splitter = 134217729; //2^27+1 for 64-bit float

  var twoSum = function twoSum(a, b) {
    var s = a + b;
    var a1 = s - b;
    var db = a1 - s + b;
    return {
      hi: s,
      lo: a - a1 + db
    };
  };

  var twoMult = function twoMult(a, b) {
    var p = a * splitter;
    var ah = a - p + p,
        al = a - ah;
    p = b * splitter;
    var bh = b - p + p,
        bl = b - bh;
    p = ah * bh;
    var q = ah * bl + al * bh,
        s = p + q;
    return {
      hi: s,
      lo: p - s + q + al * bl
    };
  };

  var oneSqr = function oneSqr(a) {
    var p = a * splitter;
    var ah = a - p + p,
        al = a - ah;
    p = ah * ah;
    var q = ah * al;
    q += q;
    var s = p + q;
    return {
      hi: s,
      lo: p - s + q + al * al
    };
  };
  /* Main class for double-length float number */


  var Double =
  /*#__PURE__*/
  function () {
    /* Constructors */
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
          shift = Math.floor(parseInt(str[1]) - 14);
          Double.sub22(this, Double.fromMul11(parseInt(nextDigs) * (isPositive ? 1 : -1), Math.pow(10, shift)));
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
        if (other instanceof Double) return Double.add22(new Double(this), other);else if (typeof other == 'number') return Double.add21(new Double(this), other);
      }
    }, {
      key: "sub",
      value: function sub(other) {
        if (other instanceof Double) return Double.sub22(new Double(this), other);else if (typeof other == 'number') return Double.sub21(new Double(this), other);
      }
    }, {
      key: "mul",
      value: function mul(other) {
        if (other instanceof Double) return Double.mul22(new Double(this), other);else if (typeof other == 'number') return Double.mul21(new Double(this), other);
      }
    }, {
      key: "div",
      value: function div(other) {
        if (other instanceof Double) return Double.div22(new Double(this), other);else if (typeof other == 'number') return Double.div21(new Double(this), other);
      }
    }, {
      key: "pow",
      value: function pow(exp) {
        return Double.pow22(new Double(this), exp);
      }
    }, {
      key: "abs",
      value: function abs() {
        return Double.abs2(new Double(this));
      }
    }, {
      key: "neg",
      value: function neg() {
        return Double.neg2(new Double(this));
      }
    }, {
      key: "inv",
      value: function inv() {
        return Double.inv2(new Double(this));
      }
    }, {
      key: "sqr",
      value: function sqr() {
        return Double.sqr2(new Double(this));
      }
    }, {
      key: "sqrt",
      value: function sqrt() {
        return Double.sqrt2(new Double(this));
      }
    }, {
      key: "exp",
      value: function exp() {
        return Double.exp2(new Double(this));
      }
    }, {
      key: "ln",
      value: function ln() {
        return Double.ln2(new Double(this));
      }
    }, {
      key: "sinh",
      value: function sinh() {
        return Double.sinh2(new Double(this));
      }
    }, {
      key: "cosh",
      value: function cosh() {
        return Double.cosh2(new Double(this));
      }
    }, {
      key: "eq",
      value: function eq(other) {
        if (other instanceof Double) return Double.eq22(new Double(this), other);else if (typeof other == 'number') return Double.eq21(new Double(this), other);
      }
    }, {
      key: "ne",
      value: function ne(other) {
        if (other instanceof Double) return Double.ne22(new Double(this), other);else if (typeof other == 'number') return Double.ne21(new Double(this), other);
      }
    }, {
      key: "gt",
      value: function gt(other) {
        if (other instanceof Double) return Double.gt22(new Double(this), other);else if (typeof other == 'number') return Double.gt21(new Double(this), other);
      }
    }, {
      key: "lt",
      value: function lt(other) {
        if (other instanceof Double) return Double.lt22(new Double(this), other);else if (typeof other == 'number') return Double.lt21(new Double(this), other);
      }
    }, {
      key: "ge",
      value: function ge(other) {
        if (other instanceof Double) return Double.ge22(new Double(this), other);else if (typeof other == 'number') return Double.ge21(new Double(this), other);
      }
    }, {
      key: "le",
      value: function le(other) {
        if (other instanceof Double) return Double.le22(new Double(this), other);else if (typeof other == 'number') return Double.le21(new Double(this), other);
      }
    }], [{
      key: "clone",
      value: function clone(X) {
        return new Double(X);
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

        for (var i = 0; i < digits.length; i += 16) {
          nextDigs = digits.slice(i, i + 16);
          shift = Math.pow(10, exp + dotId - i - nextDigs.length);
          Double.add22(result, Double.fromMul11(shift, parseInt(nextDigs)));
        }

        return isPositive ? result : Double.neg2(result);
      }
    }, {
      key: "add22",
      value: function add22(X, Y) {
        var S = twoSum(X.hi, Y.hi);
        var E = twoSum(X.lo, Y.lo);
        var c = S.lo + E.hi;
        var vh = S.hi + c,
            vl = S.hi - vh + c;
        var w = vl + E.lo;
        X.hi = vh + w;
        X.lo = vh - X.hi + w;
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
        X.lo = vh - X.hi + w;
        return X;
      }
    }, {
      key: "mul22",
      value: function mul22(X, Y) {
        var S = twoMult(X.hi, Y.hi);
        S.lo += X.hi * Y.lo + X.lo * Y.hi;
        X.hi = S.hi + S.lo;
        X.lo = S.hi - X.hi + S.lo;
        return X;
      }
    }, {
      key: "div22",
      value: function div22(X, Y) {
        var s = X.hi / Y.hi;
        var T = twoMult(s, Y.hi);
        var e = (X.hi - T.hi - T.lo + X.lo - s * Y.lo) / Y.hi;
        X.hi = s + e;
        X.lo = s - X.hi + e;
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
        X.lo = s - X.hi + zl;
        return X;
      }
    }, {
      key: "sqr2",
      value: function sqr2(X) {
        var S = oneSqr(X.hi);
        var c = X.hi * X.lo;
        S.lo += c + c;
        X.hi = S.hi + S.lo;
        X.lo = S.hi - X.hi + S.lo;
        return X;
      }
    }, {
      key: "sqrt2",
      value: function sqrt2(X) {
        var s = Math.sqrt(X.hi);
        var T = oneSqr(s);
        var e = (X.hi - T.hi - T.lo + X.lo) * 0.5 / s;
        X.hi = s + e;
        X.lo = s - X.hi + e;
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
        Double.sub21(Double.add22(Double.mul22(X, Double.exp2(Double.neg2(new Double(Z)))), Z), 1);
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
      value: function add21(X, a) {
        var S = twoSum(X.hi, a);
        S.lo += X.lo;
        X.hi = S.hi + S.lo;
        X.lo = S.hi - X.hi + S.lo;
        return X;
      }
    }, {
      key: "sub21",
      value: function sub21(X, a) {
        var S = twoSum(X.hi, -a);
        S.lo += X.lo;
        X.hi = S.hi + S.lo;
        X.lo = S.hi - X.hi + S.lo;
        return X;
      }
    }, {
      key: "mul21",
      value: function mul21(X, a) {
        var S = twoMult(X.hi, a);
        S.lo += X.lo * a;
        X.hi = S.hi + S.lo;
        X.lo = S.hi - X.hi + S.lo;
        return X;
      }
    }, {
      key: "div21",
      value: function div21(X, a) {
        var s = X.hi / a;
        var T = twoMult(s, a);
        var e = (X.hi - T.hi + (X.lo - T.lo)) / a;
        X.hi = s + e;
        X.lo = s - X.hi + e;
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
      key: "pow21n",
      value: function pow21n(X, exp) {
        if (exp === 0) return Double.One;
        if (exp == 1) return X;
        var isPositive = exp > 0;
        if (!isPositive) exp = -exp;
        var n = Math.floor(Math.log(exp) / Math.log(2));
        var m = Math.floor(exp - (1 << n));
        var X0 = new Double(X);

        while (n--) {
          Double.sqr2(X);
        }

        while (m--) {
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
        return new Double({
          hi: 1,
          lo: 0
        });
      }
    }, {
      key: "Zero",
      get: function get() {
        return new Double({
          hi: 0,
          lo: 0
        });
      }
    }, {
      key: "Infinity",
      get: function get() {
        return new Double({
          hi: Infinity,
          lo: Infinity
        });
      }
    }, {
      key: "NaN",
      get: function get() {
        return new Double({
          hi: NaN,
          lo: NaN
        });
      }
    }, {
      key: "Pi",
      get: function get() {
        return new Double({
          hi: 3.141592653589793116,
          lo: 1.224646799147353207e-16
        });
      }
    }, {
      key: "X2Pi",
      get: function get() {
        return new Double({
          hi: 6.283185307179586232,
          lo: 2.449293598294706414e-16
        });
      }
    }, {
      key: "E",
      get: function get() {
        return new Double({
          hi: 2.718281828459045,
          lo: 1.4456468917292502e-16
        });
      }
    }, {
      key: "Log2",
      get: function get() {
        return new Double({
          hi: 0.6931471805599453,
          lo: 2.3190468138462996e-17
        });
      }
    }, {
      key: "Phi",
      get: function get() {
        return new Double({
          hi: 1.618033988749895,
          lo: -5.4321152036825055e-17
        });
      }
    }]);

    return Double;
  }();

  return Double;

}());
