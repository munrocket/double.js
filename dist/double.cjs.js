'use strict';

/* Veltkamp-Dekker splitter = 2^27 + 1 for IEEE 64-bit float number */

const splitter = 134217729;

/* Main class for double-length float number*/

class Double {

  /* Constructors */

  constructor(val) {
    if (Array.isArray(val)) this.arr = val;
    else if (typeof val === 'number') this.arr = Double.fromNumber(val).arr;
    else if (typeof val === 'string') this.arr = Double.fromString(val).arr;
    else if (val instanceof Double) this.arr = Double.clone(val).arr;
  }
    
  static clone(X) {
    return new Double([X.arr[0], X.arr[1]]);
  }

  static fromSum11(a, b) {
    let z = a + b;
    let w = z - a;
    let z2 = z - w - a;
    return new Double([z, b - w - z2]);
  }

  static fromMul11(a, b) {
    let p = a * splitter;
    let ah = a - p + p; let al = a - ah;
    p = b * splitter;
    let bh = b - p + p; let bl = b - bh;
    p = ah * bh;
    let q = ah * bl + al * bh;
    let z = p + q;
    return new Double([z, p - z + q + al * bl]);
  }

  static fromSqr1(a) {
    let u = a * splitter;
    let xh = u + (a - u);
    let xl = a - xh;
    let v = xh * xl;
    let z = a * a;
    return new Double([z, (xh * xh - z + v + v) + xl * xl]);
  }

  static fromNumber(number) {
    if (typeof number == 'number') return new Double([number, 0]);
    else return Double.NaN;
  }

  static fromString(string) {
    let isPositive = (/^\s*-/.exec(string) === null);
    let str = string.replace(/^\s*[+-]?/, '');
    if (/Infinity.*/.exec(str) !== null) return (isPositive) ? Double.Infinity : Double.neg2(Double.Infinity);
    str = /^([0-9]*\.?[0-9]+)(?:[eE]([-+]?[0-9]+))?/.exec(str);
    if (!str) return Double.NaN;

    let digits = str[1].replace('.', '');
    let exp = (str[2] !== undefined) ? parseInt(str[2]) : 0;
    let dotId = str[0].indexOf('.');
    if (dotId == -1) dotId = digits.length;
    if (exp + dotId - 1 < -300) return isPositive ? Double.Zero : Double.neg2(Double.Zero);
    if (exp + dotId - 1 > 300) return isPositive ? Double.Infinity : Double.neg2(Double.Infinity);

    let nextDigs, shift, result = Double.Zero;
    for (let i = 0; i < digits.length; i += 16) {
      nextDigs = digits.slice(i, i + 16);
      shift = Math.pow(10, exp + dotId - i - nextDigs.length);
      Double.add22(result, Double.fromMul11(shift, parseInt(nextDigs)));
    }
    return (isPositive) ? result : Double.neg2(result);
  }

  /* Convertations */

  toNumber() {
    return this.arr.reduce(function (sum, component) { return sum += component }, 0);
  }

  toExponential(precision) {
    if (precision === undefined) precision = 31;
    let result = (this.arr[0] < 0) ? '-' : '';
    if (isNaN(this.arr[0])) return 'NaN';
    if (!isFinite(this.arr[0])) return result + 'Infinity';
    if (this.toNumber() == 0) return '0e+0';
    let exp = this.arr[0].toExponential().split('e')[1];
    
    let str, nextDigs, shift, isPositive;
    for (let i = 0; i < precision; i += 15) {
      str = this.arr[0].toExponential().split('e');
      isPositive = (str[0][0] != '-');
      nextDigs = str[0].replace(/^0\.|\./, '').slice(0, 15);
      if (!isPositive) nextDigs = nextDigs.slice(1);
      shift = Math.floor(parseInt(str[1]) - 14);
      Double.sub22(this, Double.fromMul11(parseInt(nextDigs) * ((isPositive) ? 1 : -1), Math.pow(10, shift)));
      nextDigs = nextDigs.slice(0, precision - i);
      result += (i != 0) ? nextDigs : nextDigs.slice(0, 1) + '.' + nextDigs.slice(1);
    }
    return result + 'e' + exp;
  }

  /* Arithmetic operations with two double */

  static add22(X, Y) {
    let x = X.arr[0], xl = X.arr[1], y = Y.arr[0], yl = Y.arr[1];
    let zh = x + y;
    let zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
    X.arr[0] = zh + zl;
    X.arr[1] = zh - X.arr[0] + zl;
    return X;
  }

  static sub22(X, Y) {
    let x = X.arr[0], xl = X.arr[1], y = -Y.arr[0], yl = -Y.arr[1];
    let zh = x + y;
    let zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
    X.arr[0] = zh + zl;
    X.arr[1] = zh - X.arr[0] + zl;
    return X;
  }

  static mul22(X, Y) {
    let Z = Double.fromMul11(X.arr[0], Y.arr[0]);
    Z.arr[1] += X.arr[0] * Y.arr[1] + X.arr[1] * Y.arr[0];
    X.arr[0] = Z.arr[0] + Z.arr[1];
    X.arr[1] = Z.arr[0] - X.arr[0] + Z.arr[1];
    return X;
  }

  static div22(X, Y) {
    let zh = X.arr[0] / Y.arr[0];
    let T = Double.fromMul11(zh, Y.arr[0]);
    let zl = (X.arr[0] - T.arr[0] - T.arr[1] + X.arr[1] - zh * Y.arr[1]) / Y.arr[0];
    X.arr[0] = zh + zl;
    X.arr[1] = zh - X.arr[0]+ zl;
    return X;
  }

  static pow22(base, ex) {
    return Double.exp2(Double.mul22(Double.ln2(base), ex));
  }

  /* Unar operators with double */

  static abs2(X) {
    if (X.arr[0] < 0) {
      X.arr[0] = -X.arr[0];
      X.arr[1] = -X.arr[1];
    }
    return X;
  }

  static neg2(X) {
    X.arr[0] = -X.arr[0];
    X.arr[1] = -X.arr[1];
    return X;
  }

  static inv2(X) {
    var xh = X.arr[0];
    let zh = 1 / xh;
    Double.mul21(X, zh);
    let zl = (1 - X.arr[0] - X.arr[1]) / xh;
    X.arr[0] = zh + zl;
    X.arr[1] = zh - X.arr[0] + zl;
    return X;
  }

  static sqr2(X) {
    let Z = Double.fromSqr1(X.arr[0]);
    let c = X.arr[0] * X.arr[1];
    Z.arr[1] += c + c;
    X.arr[0] = Z.arr[0] + Z.arr[1];
    X.arr[1] = Z.arr[0] - X.arr[0] + Z.arr[1];
    return X
  }

  static sqrt2(X) {
    if (X.arr[0] < 0) return Double.NaN;
    if (X.arr[0] === 0) return Double.Zero;
    let zh = Math.sqrt(X.arr[0]);
    let T = Double.fromMul11(zh, zh);
    let zl = (X.arr[0] - T.arr[0] - T.arr[1] + X.arr[1]) * 0.5 / zh;
    X.arr[0] = zh + zl;
    X.arr[1] = zh - X.arr[0] + zl;
    return X
  }

  static exp2(X) {
    if (Double.le21(X, 0)) return Double.One;
    if (Double.eq21(X, 1)) return Double.E;
    if (Double.le21(X, -709)) return Double.Zero;
    if (Double.ge21(X, 709)) return Double.Infinity;
    let n = Math.floor(X.arr[0] / Double.Log2.arr[0] + 0.5);
    Double.sub22(X, Double.mul21(Double.Log2, n));
    let U = Double.One, V = Double.One;
    let padeCoef = [1, 272, 36720, 3255840, 211629600, 10666131840, 430200650880, 14135164243200,
      381649434566400, 8481098545920000, 154355993535744030, 2273242813890047700, 26521166162050560000,
      236650405753681870000, 1.5213240369879552e+21, 6.288139352883548e+21, 1.2576278705767096e+22 ];
    for (let i = 0, cLen = padeCoef.length; i < cLen; i++) Double.add21(Double.mul22(U, X), padeCoef[i]);
    for (let i = 0, cLen = padeCoef.length; i < cLen; i++) Double.add21(Double.mul22(V, X), padeCoef[i] * ((i % 2) ? -1 : 1));
    X = Double.mul21pow2(Double.div22(U, V), Math.pow(2, n));
    return X;
  }

  static ln2(X) {
    if (Double.le21(X, 0)) return Double.NaN;
    if (Double.eq21(X, 1)) return Double.Zero;
    let Z = Double.fromNumber(Math.log(X.arr[0]));
    Double.sub21(Double.add22(Double.mul22(X, Double.exp2(Double.neg2(Double.clone(Z)))), Z), 1);
    return X;
  }

  static sinh2(X) {
    var exp = Double.exp2(X);
    X = Double.mul21pow2(Double.sub22(Double.clone(exp), Double.inv2(exp)), 0.5);
    return X;
  }

  static cosh2(X) {
    var exp = Double.exp2(X);
    X = Double.mul21pow2(Double.add22(Double.clone(exp), Double.inv2(exp)), 0.5);
    return X;
  }

  /* Arithmetic operations with double and single */

  static add21(X, a) {
    let Z = Double.fromSum11(X.arr[0], a);
    Z.arr[1] += X.arr[1];
    X.arr[0] = Z.arr[0] + Z.arr[1];
    X.arr[1] = Z.arr[0] - X.arr[0] + Z.arr[1];
    return X;
  }

  static sub21(X, a) {
    let Z = Double.fromSum11(X.arr[0], -a);
    Z.arr[1] += X.arr[1];
    X.arr[0] = Z.arr[0] + Z.arr[1];
    X.arr[1] = Z.arr[0] - X.arr[0] + Z.arr[1];
    return X;
  }

  static mul21(X, a) {
    let Z = Double.fromMul11(X.arr[0], a);
    Z.arr[1] += X.arr[1] * a;
    X.arr[0] = Z.arr[0] + Z.arr[1];
    X.arr[1] = Z.arr[0] - X.arr[0] + Z.arr[1];
    return X;
  }

  static div21(X, a) {
    let zh = X.arr[0] / a; 
    let T = Double.fromMul11(zh, a);
    let zl = (X.arr[0] - T.arr[0] - T.arr[1] + X.arr[1]) / a;
    X.arr[0] = zh + zl;
    X.arr[1] = zh - X.arr[0] + zl;
    return X;
  }

  static mul21pow2(X, a) {
    X.arr[0] = X.arr[0] * a;
    X.arr[1] = X.arr[1] * a;
    return X;
  }

  static pow21n(X, exp) {
    if (exp === 0) return [1, 0];
    if (exp == 1) return X;
    let isPositive = exp > 0;
    if (!isPositive) exp = -exp;
    let n = Math.floor(Math.log(exp) / Math.log(2));
    let m = Math.floor(exp - Math.pow(2, n));
    let X0 = Double.clone(X);
    while (n--) Double.sqr2(X);
    while (m--) Double.mul22(X, X0);
    return isPositive ? X : Double.inv2(X);
  }

  /* Different comparisons */

  static eq22(X, Y) { return (X.arr[0] === Y.arr[0] && X.arr[1] === Y.arr[1]); }
  static ne22(X, Y) { return (X.arr[0] !== Y.arr[0] || X.arr[1] !== Y.arr[1]); }
  static gt22(X, Y) { return (X.arr[0] > Y.arr[0] || (X.arr[0] === Y.arr[0] && X.arr[1] > Y.arr[1])); }
  static lt22(X, Y) { return (X.arr[0] < Y.arr[0] || (X.arr[0] === Y.arr[0] && X.arr[1] < Y.arr[1])); }
  static ge22(X, Y) { return (X.arr[0] >= Y.arr[0] && (X.arr[0] === Y.arr[0] && X.arr[1] >= Y.arr[1])); }
  static le22(X, Y) { return (X.arr[0] <= Y.arr[0] && (X.arr[0] === Y.arr[0] && X.arr[1] <= Y.arr[1])); }
  static eq21(X, a) { return (X.arr[0] === a && X.arr[1] === 0); }
  static ne21(X, a) { return (X.arr[0] !== a || X.arr[1] !== 0); }
  static gt21(X, a) { return (X.arr[0] > a || (X.arr[0] === a && X.arr[1] > 0)); }
  static lt21(X, a) { return (X.arr[0] < a || (X.arr[0] === a && X.arr[1] < 0)); }
  static ge21(X, a) { return (X.arr[0] >= a && (X.arr[0] === a && X.arr[1] >= 0)); }
  static le21(X, a) { return (X.arr[0] <= a && (X.arr[0] === a && X.arr[1] <= 0)); }

  /* Double constants */

  static get One() { return new Double([1, 0]) }
  static get Zero() { return new Double([0, 0]) }
  static get Infinity() { return new Double([Infinity, Infinity]) }
  static get NaN() { return new Double([NaN, NaN]) }
  static get Pi() { return new Double([3.141592653589793116,  1.224646799147353207e-16]); }
  static get X2Pi() { return new Double([6.283185307179586232, 2.449293598294706414e-16]); }
  static get E() { return new Double([2.718281828459045, 1.4456468917292502e-16]); }
  static get Log2() { return new Double([0.6931471805599453, 2.3190468138462996e-17]); }
  static get Phi() { return new Double([1.618033988749895, -5.4321152036825055e-17]); }
  
  /* Repeating static methods to instance */

  add(other) {
    if (other instanceof Double) return Double.add22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.add21(Double.clone(this), other);
  }
  sub(other) {
    if (other instanceof Double) return Double.sub22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.sub21(Double.clone(this), other);
  }
  mul(other) {
    if (other instanceof Double) return Double.mul22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.mul21(Double.clone(this), other);
  }
  div(other) {
    if (other instanceof Double) return Double.div22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.div21(Double.clone(this), other);
  }
  pow(exp) { return Double.pow22(Double.clone(this), exp)}
  abs() { return Double.abs2(Double.clone(this)); }
  neg() { return Double.neg2(Double.clone(this)); }
  inv() { return Double.inv2(Double.clone(this)); }
  sqr() { return Double.sqr2(Double.clone(this)); }
  sqrt() { return Double.sqrt2(Double.clone(this)); }
  exp() { return Double.exp2(Double.clone(this)); }
  ln() { return Double.ln2(Double.clone(this)); }
  sinh() { return Double.sinh2(Double.clone(this)); }
  cosh() { return Double.cosh2(Double.clone(this)); }
  eq(other) {
    if (other instanceof Double) return Double.eq22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.eq21(Double.clone(this), other);
  }
  ne(other) {
    if (other instanceof Double) return Double.ne22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.ne21(Double.clone(this), other);
  }
  gt(other) {
    if (other instanceof Double) return Double.gt22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.gt21(Double.clone(this), other);
  }
  lt(other) {
    if (other instanceof Double) return Double.lt22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.lt21(Double.clone(this), other);
  }
  ge(other) {
    if (other instanceof Double) return Double.ge22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.ge21(Double.clone(this), other);
  }
  le(other) {
    if (other instanceof Double) return Double.le22(Double.clone(this), other);
    else if (typeof other == 'number') return Double.le21(Double.clone(this), other);
  }
}

module.exports = Double;
