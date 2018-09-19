var D = (function () {
  'use strict';

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /* Basic error-free algorithms */

  var splitter = 134217729; //2^27+1 for 64-bit float

  var twoSum = function twoSum(a, b) {
    var s = a + b;
    var a1 = s - b;
    var db = a1 - s + b;
    return [s, a - a1 + db];
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
    return [s, p - s + q + al * bl];
  };

  var oneSqr = function oneSqr(a) {
    var p = a * splitter;
    var ah = a - p + p,
        al = a - ah;
    p = ah * ah;
    var q = ah * al;q += q;
    var s = p + q;
    return [s, p - s + q + al * al];
  };

  /* Main class for double-length float number */

  var Double = function () {

    /* Constructors */

    function Double(val) {
      _classCallCheck(this, Double);

      if (Array.isArray(val)) this.arr = val;else if (typeof val === 'number') this.arr = Double.fromNumber(val).arr;else if (typeof val === 'string') this.arr = Double.fromString(val).arr;else if (val instanceof Double) this.arr = Double.clone(val).arr;
    }

    _createClass(Double, [{
      key: 'toNumber',


      /* Convertations */

      value: function toNumber() {
        return this.arr.reduce(function (sum, component) {
          return sum += component;
        }, 0);
      }
    }, {
      key: 'toExponential',
      value: function toExponential(precision) {
        if (precision === undefined) precision = 31;
        var result = this.arr[0] < 0 ? '-' : '';
        if (isNaN(this.arr[0])) return 'NaN';
        if (!isFinite(this.arr[0])) return result + 'Infinity';
        if (this.toNumber() == 0) return '0e+0';
        var exp = this.arr[0].toExponential().split('e')[1];

        var str = void 0,
            nextDigs = void 0,
            shift = void 0,
            isPositive = void 0;
        for (var i = 0; i < precision; i += 15) {
          str = this.arr[0].toExponential().split('e');
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
      key: 'add',


      /* Repeating static methods to instance */

      value: function add(other) {
        if (other instanceof Double) return Double.add22(Double.clone(this), other);else if (typeof other == 'number') return Double.add21(Double.clone(this), other);
      }
    }, {
      key: 'sub',
      value: function sub(other) {
        if (other instanceof Double) return Double.sub22(Double.clone(this), other);else if (typeof other == 'number') return Double.sub21(Double.clone(this), other);
      }
    }, {
      key: 'mul',
      value: function mul(other) {
        if (other instanceof Double) return Double.mul22(Double.clone(this), other);else if (typeof other == 'number') return Double.mul21(Double.clone(this), other);
      }
    }, {
      key: 'div',
      value: function div(other) {
        if (other instanceof Double) return Double.div22(Double.clone(this), other);else if (typeof other == 'number') return Double.div21(Double.clone(this), other);
      }
    }, {
      key: 'pow',
      value: function pow(exp) {
        return Double.pow22(Double.clone(this), exp);
      }
    }, {
      key: 'abs',
      value: function abs() {
        return Double.abs2(Double.clone(this));
      }
    }, {
      key: 'neg',
      value: function neg() {
        return Double.neg2(Double.clone(this));
      }
    }, {
      key: 'inv',
      value: function inv() {
        return Double.inv2(Double.clone(this));
      }
    }, {
      key: 'sqr',
      value: function sqr() {
        return Double.sqr2(Double.clone(this));
      }
    }, {
      key: 'sqrt',
      value: function sqrt() {
        return Double.sqrt2(Double.clone(this));
      }
    }, {
      key: 'exp',
      value: function exp() {
        return Double.exp2(Double.clone(this));
      }
    }, {
      key: 'ln',
      value: function ln() {
        return Double.ln2(Double.clone(this));
      }
    }, {
      key: 'sinh',
      value: function sinh() {
        return Double.sinh2(Double.clone(this));
      }
    }, {
      key: 'cosh',
      value: function cosh() {
        return Double.cosh2(Double.clone(this));
      }
    }, {
      key: 'eq',
      value: function eq(other) {
        if (other instanceof Double) return Double.eq22(Double.clone(this), other);else if (typeof other == 'number') return Double.eq21(Double.clone(this), other);
      }
    }, {
      key: 'ne',
      value: function ne(other) {
        if (other instanceof Double) return Double.ne22(Double.clone(this), other);else if (typeof other == 'number') return Double.ne21(Double.clone(this), other);
      }
    }, {
      key: 'gt',
      value: function gt(other) {
        if (other instanceof Double) return Double.gt22(Double.clone(this), other);else if (typeof other == 'number') return Double.gt21(Double.clone(this), other);
      }
    }, {
      key: 'lt',
      value: function lt(other) {
        if (other instanceof Double) return Double.lt22(Double.clone(this), other);else if (typeof other == 'number') return Double.lt21(Double.clone(this), other);
      }
    }, {
      key: 'ge',
      value: function ge(other) {
        if (other instanceof Double) return Double.ge22(Double.clone(this), other);else if (typeof other == 'number') return Double.ge21(Double.clone(this), other);
      }
    }, {
      key: 'le',
      value: function le(other) {
        if (other instanceof Double) return Double.le22(Double.clone(this), other);else if (typeof other == 'number') return Double.le21(Double.clone(this), other);
      }
    }], [{
      key: 'clone',
      value: function clone(X) {
        return new Double([X.arr[0], X.arr[1]]);
      }
    }, {
      key: 'fromSum11',
      value: function fromSum11(a, b) {
        return new Double(twoSum(a, b));
      }
    }, {
      key: 'fromMul11',
      value: function fromMul11(a, b) {
        return new Double(twoMult(a, b));
      }
    }, {
      key: 'fromSqr1',
      value: function fromSqr1(a) {
        return new Double(oneSqr(a));
      }
    }, {
      key: 'fromNumber',
      value: function fromNumber(number) {
        if (typeof number == 'number') return new Double([number, 0]);else return Double.NaN;
      }
    }, {
      key: 'fromString',
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

        var nextDigs = void 0,
            shift = void 0,
            result = Double.Zero;
        for (var i = 0; i < digits.length; i += 16) {
          nextDigs = digits.slice(i, i + 16);
          shift = Math.pow(10, exp + dotId - i - nextDigs.length);
          Double.add22(result, Double.fromMul11(shift, parseInt(nextDigs)));
        }
        return isPositive ? result : Double.neg2(result);
      }
    }, {
      key: 'add22',
      value: function add22(X, Y) {
        var S = twoSum(X.arr[0], Y.arr[0]);
        var E = twoSum(X.arr[1], Y.arr[1]);
        var c = S[1] + E[0];
        var vh = S[0] + c,
            vl = S[0] - vh + c;
        var w = vl + E[1];
        X.arr[0] = vh + w;
        X.arr[1] = vh - X.arr[0] + w;
        return X;
      }
    }, {
      key: 'sub22',
      value: function sub22(X, Y) {
        var S = twoSum(X.arr[0], -Y.arr[0]);
        var E = twoSum(X.arr[1], -Y.arr[1]);
        var c = S[1] + E[0];
        var vh = S[0] + c,
            vl = S[0] - vh + c;
        var w = vl + E[1];
        X.arr[0] = vh + w;
        X.arr[1] = vh - X.arr[0] + w;
        return X;
      }
    }, {
      key: 'mul22',
      value: function mul22(X, Y) {
        var S = twoMult(X.arr[0], Y.arr[0]);
        S[1] += X.arr[0] * Y.arr[1] + X.arr[1] * Y.arr[0];
        X.arr[0] = S[0] + S[1];
        X.arr[1] = S[0] - X.arr[0] + S[1];
        return X;
      }
    }, {
      key: 'div22',
      value: function div22(X, Y) {
        var s = X.arr[0] / Y.arr[0];
        var T = twoMult(s, Y.arr[0]);
        var e = (X.arr[0] - T[0] - T[1] + X.arr[1] - s * Y.arr[1]) / Y.arr[0];
        X.arr[0] = s + e;
        X.arr[1] = s - X.arr[0] + e;
        return X;
      }
    }, {
      key: 'pow22',
      value: function pow22(base, ex) {
        return Double.exp2(Double.mul22(Double.ln2(base), ex));
      }

      /* Unar operators with double */

    }, {
      key: 'abs2',
      value: function abs2(X) {
        if (X.arr[0] < 0) {
          X.arr[0] = -X.arr[0];
          X.arr[1] = -X.arr[1];
        }
        return X;
      }
    }, {
      key: 'neg2',
      value: function neg2(X) {
        X.arr[0] = -X.arr[0];
        X.arr[1] = -X.arr[1];
        return X;
      }
    }, {
      key: 'inv2',
      value: function inv2(X) {
        var xh = X.arr[0];
        var s = 1 / xh;
        Double.mul21(X, s);
        var zl = (1 - X.arr[0] - X.arr[1]) / xh;
        X.arr[0] = s + zl;
        X.arr[1] = s - X.arr[0] + zl;
        return X;
      }
    }, {
      key: 'sqr2',
      value: function sqr2(X) {
        var S = oneSqr(X.arr[0]);
        var c = X.arr[0] * X.arr[1];
        S[1] += c + c;
        X.arr[0] = S[0] + S[1];
        X.arr[1] = S[0] - X.arr[0] + S[1];
        return X;
      }
    }, {
      key: 'sqrt2',
      value: function sqrt2(X) {
        var s = Math.sqrt(X.arr[0]);
        var T = oneSqr(s);
        var e = (X.arr[0] - T[0] - T[1] + X.arr[1]) * 0.5 / s;
        X.arr[0] = s + e;
        X.arr[1] = s - X.arr[0] + e;
        return X;
      }
    }, {
      key: 'exp2',
      value: function exp2(X) {
        if (Double.eq21(X, 0)) return Double.One;
        if (Double.eq21(X, 1)) return Double.E;
        if (Double.lt21(X, -709)) return Double.Zero;
        if (Double.gt21(X, 709)) return Double.Infinity;
        var n = Math.floor(X.arr[0] / Double.Log2.arr[0] + 0.5);
        Double.sub22(X, Double.mul21(Double.Log2, n));
        var U = Double.One,
            V = Double.One;
        var padeCoef = [1, 272, 36720, 3255840, 211629600, 10666131840, 430200650880, 14135164243200, 381649434566400, 8481098545920000, 154355993535744030, 2273242813890047700, 26521166162050560000, 236650405753681870000, 1.5213240369879552e+21, 6.288139352883548e+21, 1.2576278705767096e+22];
        for (var i = 0, cLen = padeCoef.length; i < cLen; i++) {
          Double.add21(Double.mul22(U, X), padeCoef[i]);
        }for (var _i = 0, _cLen = padeCoef.length; _i < _cLen; _i++) {
          Double.add21(Double.mul22(V, X), padeCoef[_i] * (_i % 2 ? -1 : 1));
        }X = Double.mul21pow2(Double.div22(U, V), n);
        return X;
      }
    }, {
      key: 'ln2',
      value: function ln2(X) {
        if (Double.le21(X, 0)) return Double.NaN;
        if (Double.eq21(X, 1)) return Double.Zero;
        var Z = Double.fromNumber(Math.log(X.arr[0]));
        Double.sub21(Double.add22(Double.mul22(X, Double.exp2(Double.neg2(Double.clone(Z)))), Z), 1);
        return X;
      }
    }, {
      key: 'sinh2',
      value: function sinh2(X) {
        var exp = Double.exp2(X);
        X = Double.mul21pow2(Double.sub22(Double.clone(exp), Double.inv2(exp)), -1);
        return X;
      }
    }, {
      key: 'cosh2',
      value: function cosh2(X) {
        var exp = Double.exp2(X);
        X = Double.mul21pow2(Double.add22(Double.clone(exp), Double.inv2(exp)), -1);
        return X;
      }

      /* Arithmetic operations with double and single */

    }, {
      key: 'add21',
      value: function add21(X, a) {
        var S = twoSum(X.arr[0], a);
        S[1] += X.arr[1];
        X.arr[0] = S[0] + S[1];
        X.arr[1] = S[0] - X.arr[0] + S[1];
        return X;
      }
    }, {
      key: 'sub21',
      value: function sub21(X, a) {
        var S = twoSum(X.arr[0], -a);
        S[1] += X.arr[1];
        X.arr[0] = S[0] + S[1];
        X.arr[1] = S[0] - X.arr[0] + S[1];
        return X;
      }
    }, {
      key: 'mul21',
      value: function mul21(X, a) {
        var S = twoMult(X.arr[0], a);
        var m = X.arr[1] * a;
        var th = S[0] + m,
            tl = S[0] - th + m + S[1];
        X.arr[0] = th + tl;
        X.arr[1] = th - X.arr[0] + tl;
        return X;
      }
    }, {
      key: 'div21',
      value: function div21(X, a) {
        var s = X.arr[0] / a;
        var T = twoMult(s, a);
        var e = (X.arr[0] - T[0] + (X.arr[1] - T[1])) / a;
        X.arr[0] = s + e;
        X.arr[1] = s - X.arr[0] + e;
        return X;
      }
    }, {
      key: 'mul21pow2',
      value: function mul21pow2(X, n) {
        var c = 1 << Math.abs(n);
        if (n < 0) c = 1 / c;
        X.arr[0] = X.arr[0] * c;
        X.arr[1] = X.arr[1] * c;
        return X;
      }
    }, {
      key: 'pow21n',
      value: function pow21n(X, exp) {
        if (exp === 0) return Double.One;
        if (exp == 1) return X;
        var isPositive = exp > 0;
        if (!isPositive) exp = -exp;
        var n = Math.floor(Math.log(exp) / Math.log(2));
        var m = Math.floor(exp - (1 << n));
        var X0 = Double.clone(X);
        while (n--) {
          Double.sqr2(X);
        }while (m--) {
          Double.mul22(X, X0);
        }return isPositive ? X : Double.inv2(X);
      }

      /* Different comparisons */

    }, {
      key: 'eq22',
      value: function eq22(X, Y) {
        return X.arr[0] === Y.arr[0] && X.arr[1] === Y.arr[1];
      }
    }, {
      key: 'ne22',
      value: function ne22(X, Y) {
        return X.arr[0] !== Y.arr[0] || X.arr[1] !== Y.arr[1];
      }
    }, {
      key: 'gt22',
      value: function gt22(X, Y) {
        return X.arr[0] > Y.arr[0] || X.arr[0] === Y.arr[0] && X.arr[1] > Y.arr[1];
      }
    }, {
      key: 'lt22',
      value: function lt22(X, Y) {
        return X.arr[0] < Y.arr[0] || X.arr[0] === Y.arr[0] && X.arr[1] < Y.arr[1];
      }
    }, {
      key: 'ge22',
      value: function ge22(X, Y) {
        return X.arr[0] > Y.arr[0] || X.arr[0] === Y.arr[0] && X.arr[1] >= Y.arr[1];
      }
    }, {
      key: 'le22',
      value: function le22(X, Y) {
        return X.arr[0] < Y.arr[0] || X.arr[0] === Y.arr[0] && X.arr[1] <= Y.arr[1];
      }
    }, {
      key: 'eq21',
      value: function eq21(X, a) {
        return X.arr[0] === a && X.arr[1] === 0;
      }
    }, {
      key: 'ne21',
      value: function ne21(X, a) {
        return X.arr[0] !== a || X.arr[1] !== 0;
      }
    }, {
      key: 'gt21',
      value: function gt21(X, a) {
        return X.arr[0] > a || X.arr[0] === a && X.arr[1] > 0;
      }
    }, {
      key: 'lt21',
      value: function lt21(X, a) {
        return X.arr[0] < a || X.arr[0] === a && X.arr[1] < 0;
      }
    }, {
      key: 'ge21',
      value: function ge21(X, a) {
        return X.arr[0] > a || X.arr[0] === a && X.arr[1] >= 0;
      }
    }, {
      key: 'le21',
      value: function le21(X, a) {
        return X.arr[0] < a || X.arr[0] === a && X.arr[1] <= 0;
      }

      /* Double constants */

    }, {
      key: 'One',
      get: function get() {
        return new Double([1, 0]);
      }
    }, {
      key: 'Zero',
      get: function get() {
        return new Double([0, 0]);
      }
    }, {
      key: 'Infinity',
      get: function get() {
        return new Double([Infinity, Infinity]);
      }
    }, {
      key: 'NaN',
      get: function get() {
        return new Double([NaN, NaN]);
      }
    }, {
      key: 'Pi',
      get: function get() {
        return new Double([3.141592653589793116, 1.224646799147353207e-16]);
      }
    }, {
      key: 'X2Pi',
      get: function get() {
        return new Double([6.283185307179586232, 2.449293598294706414e-16]);
      }
    }, {
      key: 'E',
      get: function get() {
        return new Double([2.718281828459045, 1.4456468917292502e-16]);
      }
    }, {
      key: 'Log2',
      get: function get() {
        return new Double([0.6931471805599453, 2.3190468138462996e-17]);
      }
    }, {
      key: 'Phi',
      get: function get() {
        return new Double([1.618033988749895, -5.4321152036825055e-17]);
      }
    }]);

    return Double;
  }();

  return Double;

}());
