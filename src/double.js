
/* Basic error-free algorithms */

const splitter = 134217729; // Veltkamp’s splitter for 64-bit float (equal to 2^27+1)

// Knuth's and Møller's summation (algorithm 4.4 from [1])
let twoSum = function(a, b) {
  let s = a + b;
  let a1  = s - b;
  return { hi: s, lo: (a - a1) + (b - (s - a1)) };
}

// Dekker’s multiplication (algorithm 4.7 from [1])
let twoMult = function(a, b) {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = splitter * b;
  let bh = t + (b - t), bl = b - bh;
  t = a * b;
  return { hi: t, lo: -t + ah * bh + ah * bl + al * bh + al * bl }
}
let oneSqr = function(a) {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = a * a;
  let hl = al * ah;
  return { hi: t, lo: -t + ah * ah + hl + hl + al * al }
}

/* Main class for double-length float number */

export default class Double {

  constructor(val) {
    if (val instanceof Double) {
      this.hi = val.hi;
      this.lo = val.lo;
    }
    else if (typeof val === 'number') {
      this.hi = val;
      this.lo = 0;
    } else if (typeof val === 'string') {
      let d = Double.fromString(val);
      this.hi = d.hi;
      this.lo = d.lo;
    }
    else if (Array.isArray(val)) {
      this.hi = val[0];
      this.lo = val[1];
    } else if (typeof val === "object") {
      this.hi = val.hi;
      this.lo = val.lo;
    }
  }

  /* Constructors blocks */
    
  static clone(X) { let d = new Double(); d.hi = X.hi; d.lo = X.lo; return d; }
  static fromSum11(a, b) { return new Double(twoSum(a, b)); }
  static fromMul11(a, b) { return new Double(twoMult(a, b)); }
  static fromSqr1(a) { return new Double(oneSqr(a)); }
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
    for (let i = 0; i < digits.length; i += 15) {
      nextDigs = digits.slice(i, i + 15);
      shift = Double.pow2n(new Double(10), exp + dotId - i - nextDigs.length);
      Double.add22(result, Double.mul21(shift, parseInt(nextDigs)));
    }
    return (isPositive) ? result : Double.neg2(result);
  }

  /* Convertations */

  toNumber() {
    return this.hi + this.lo;
  }

  toExponential(precision) {
    if (precision === undefined) precision = 31;
    let result = (this.hi < 0) ? '-' :  '';
    if (isNaN(this.hi)) return 'NaN';
    if (!isFinite(this.hi)) return result + 'Infinity';
    if (this.toNumber() == 0) return '0e+0';
    let exp = this.hi.toExponential().split('e')[1];
    
    let str, nextDigs, shift, isPositive;
    for (let i = 0; i < precision; i += 15) {
      str = this.hi.toExponential().split('e');
      isPositive = (str[0][0] != '-');
      nextDigs = str[0].replace(/^0\.|\./, '').slice(0, 15);
      if (!isPositive) nextDigs = nextDigs.slice(1);
      shift = Double.pow2n(new Double(10), parseInt(str[1]) - 14);
      Double.sub22(this, Double.mul21(shift, parseInt(nextDigs) * ((isPositive) ? 1 : -1)));
      nextDigs = nextDigs.slice(0, precision - i);
      result += (i != 0) ? nextDigs : nextDigs.slice(0, 1) + '.' + nextDigs.slice(1);
    }
    return result + 'e' + exp;
  }

  /* Arithmetic operations with two double */

  static add22(X, Y) {
    let S = twoSum(X.hi, Y.hi);
    let E = twoSum(X.lo, Y.lo);
    let c = S.lo + E.hi;
    let vh  = S.hi + c, vl = S.hi - vh + c;
    let w = vl + E.lo;
    X.hi = vh + w;
    X.lo = vh - X.hi + w;
    return X;
  }

  static sub22(X, Y) {
    let S = twoSum(X.hi, -Y.hi);
    let E = twoSum(X.lo, -Y.lo);
    let c = S.lo + E.hi;
    let vh  = S.hi + c, vl = S.hi - vh + c;
    let w = vl + E.lo;
    X.hi = vh + w;
    X.lo = vh - X.hi + w;
    return X;
  }

  static mul22(X, Y) {
    let S = twoMult(X.hi, Y.hi);
    S.lo += X.hi * Y.lo + X.lo * Y.hi;
    X.hi = S.hi + S.lo;
    X.lo = S.hi - X.hi + S.lo;
    return X;
  }

  static div22(X, Y) {
    let s = X.hi / Y.hi;
    let T = twoMult(s, Y.hi);
    let e = (X.hi - T.hi - T.lo + X.lo - s * Y.lo) / Y.hi;
    X.hi = s + e;
    X.lo = s - X.hi+ e;
    return X;
  }

  static pow22(base, ex) {
    return Double.exp2(Double.mul22(Double.ln2(base), ex));
  }

  /* Unar operators with double */

  static abs2(X) {
    if (X.hi < 0) {
      X.hi = -X.hi;
      X.lo = -X.lo;
    }
    return X;
  }

  static neg2(X) {
    X.hi = -X.hi;
    X.lo = -X.lo;
    return X;
  }

  static inv2(X) {
    var xh = X.hi;
    let s = 1 / xh;
    Double.mul21(X, s);
    let zl = (1 - X.hi - X.lo) / xh;
    X.hi = s + zl;
    X.lo = s - X.hi + zl;
    return X;
  }

  static sqr2(X) {
    let S = oneSqr(X.hi);
    let c = X.hi * X.lo;
    S.lo += c + c;
    X.hi = S.hi + S.lo;
    X.lo = S.hi - X.hi + S.lo;
    return X;
  }

  static sqrt2(X) {
    let s = Math.sqrt(X.hi);
    let T = oneSqr(s);
    let e = (X.hi - T.hi - T.lo + X.lo) * 0.5 / s;
    X.hi = s + e;
    X.lo = s - X.hi + e;
    return X;
  }

  static exp2(X) {
    if (Double.eq21(X, 0)) return Double.One;
    if (Double.eq21(X, 1)) return Double.E;
    if (Double.lt21(X, -709)) return Double.Zero;
    if (Double.gt21(X, 709)) return Double.Infinity;
    let n = Math.floor(X.hi / Double.Log2.hi + 0.5);
    Double.sub22(X, Double.mul21(Double.Log2, n));
    let U = Double.One, V = Double.One;
    let padeCoef = [1, 272, 36720, 3255840, 211629600, 10666131840, 430200650880, 14135164243200,
      381649434566400, 8481098545920000, 154355993535744030, 2273242813890047700, 26521166162050560000,
      236650405753681870000, 1.5213240369879552e+21, 6.288139352883548e+21, 1.2576278705767096e+22 ];
    for (let i = 0, cLen = padeCoef.length; i < cLen; i++) Double.add21(Double.mul22(U, X), padeCoef[i]);
    for (let i = 0, cLen = padeCoef.length; i < cLen; i++) Double.add21(Double.mul22(V, X), padeCoef[i] * ((i % 2) ? -1 : 1));
    X = Double.mul21pow2(Double.div22(U, V), n);
    return X;
  }

  static ln2(X) {
    if (Double.le21(X, 0)) return Double.NaN;
    if (Double.eq21(X, 1)) return Double.Zero;
    let Z = new Double(Math.log(X.hi));
    Double.sub21(Double.add22(Double.mul22(X, Double.exp2(Double.neg2(Double.clone(Z)))), Z), 1);
    return X;
  }

  static sinh2(X) {
    var exp = Double.exp2(X);
    X = Double.mul21pow2(Double.sub22(new Double(exp), Double.inv2(exp)), -1);
    return X;
  }

  static cosh2(X) {
    var exp = Double.exp2(X);
    X = Double.mul21pow2(Double.add22(new Double(exp), Double.inv2(exp)), -1);
    return X;
  }

  /* Arithmetic operations with double and single */

  static add21(X, a) {
    let S = twoSum(X.hi, a);
    S.lo += X.lo;
    X.hi = S.hi + S.lo;
    X.lo = S.hi - X.hi + S.lo;
    return X;
  }

  static sub21(X, a) {
    let S = twoSum(X.hi, -a);
    S.lo += X.lo;
    X.hi = S.hi + S.lo;
    X.lo = S.hi - X.hi + S.lo;
    return X;
  }

  static mul21(X, a) {
    let S = twoMult(X.hi, a);
    S.lo += X.lo * a;
    X.hi = S.hi + S.lo;
    X.lo = S.hi - X.hi + S.lo;
    return X;
  }

  static div21(X, a) {
    let s = X.hi / a; 
    let T = twoMult(s, a);
    let e = (X.hi - T.hi + (X.lo - T.lo)) / a;
    X.hi = s + e;
    X.lo = s - X.hi + e;
    return X;
  }

  static mul21pow2(X, n) {
    let c = 1 << Math.abs(n);
    if (n < 0) c = 1 / c;
    X.hi = X.hi * c;
    X.lo = X.lo * c;
    return X;
  }

  static pow2n(X, exp) {
    if (exp === 0) return Double.One;
    if (exp == 1) return X;
    let isPositive = exp > 0;
    if (!isPositive) exp = -exp;
    let n = Math.floor(Math.log(exp) / Math.log(2));
    let m = Math.floor(exp - (1 << n));
    let X0 = Double.clone(X);
    while (n--) Double.sqr2(X);
    while (m--) Double.mul22(X, X0);
    return isPositive ? X : Double.inv2(X);
  }

  /* Different comparisons */

  static eq22(X, Y) { return (X.hi === Y.hi && X.lo === Y.lo); }
  static ne22(X, Y) { return (X.hi !== Y.hi || X.lo !== Y.lo); }
  static gt22(X, Y) { return (X.hi > Y.hi || (X.hi === Y.hi && X.lo > Y.lo)); }
  static lt22(X, Y) { return (X.hi < Y.hi || (X.hi === Y.hi && X.lo < Y.lo)); }
  static ge22(X, Y) { return (X.hi > Y.hi || (X.hi === Y.hi && X.lo >= Y.lo)); }
  static le22(X, Y) { return (X.hi < Y.hi || (X.hi === Y.hi && X.lo <= Y.lo)); }
  static eq21(X, a) { return (X.hi === a && X.lo === 0); }
  static ne21(X, a) { return (X.hi !== a || X.lo !== 0); }
  static gt21(X, a) { return (X.hi > a || (X.hi === a && X.lo > 0)); }
  static lt21(X, a) { return (X.hi < a || (X.hi === a && X.lo < 0)); }
  static ge21(X, a) { return (X.hi > a || (X.hi === a && X.lo >= 0)); }
  static le21(X, a) { return (X.hi < a || (X.hi === a && X.lo <= 0)); }

  /* Double constants */

  static get One() {  let d = new Double();     d.hi = 1; d.lo = 0; return d; }
  static get Zero() { let d = new Double();     d.hi = 0; d.lo = 0; return d; }
  static get Infinity() { let d = new Double(); d.hi = Infinity; d.lo = Infinity; return d; }
  static get NaN() { let d = new Double();      d.hi = NaN; d.lo = NaN; return d; }
  static get Pi() { let d = new Double();       d.hi = 3.141592653589793116; d.lo =  1.224646799147353207e-16; return d; }
  static get X2Pi() { let d = new Double();     d.hi = 6.283185307179586232; d.lo = 2.449293598294706414e-16; return d; }
  static get E() { let d = new Double();        d.hi = 2.718281828459045; d.lo = 1.4456468917292502e-16; return d; }
  static get Log2() { let d = new Double();     d.hi = 0.6931471805599453; d.lo = 2.3190468138462996e-17; return d; }
  static get Phi() { let d = new Double();      d.hi = 1.618033988749895; d.lo = -5.4321152036825055e-17; return d; }
  
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
  pow(exp) { return Double.pow22(Double.clone(this), exp); }
  pown(exp) { return Double.pow2n(Double.clone(this), exp); }
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