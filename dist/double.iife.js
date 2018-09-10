var D = (function (exports) {
  'use strict';

  /* Veltkamp-Dekker splitter = 2^27 + 1 for IEEE 64-bit float number */

  let splitter = 134217729;

  /* Operations with single numbers and result is double */

  function quickSum11(a, b) {
    let z = a + b;
    return [z, b - z + a];
  }

  function sum11(a, b) {
    let z = a + b;
    let w = z - a;
    let z2 = z - w - a;
    return [z, b - w - z2];
  }

  function mul11(a, b) {
    let p = a * splitter;
    let ah = a - p + p; let al = a - ah;
    p = b * splitter;
    let bh = b - p + p; let bl = b - bh;
    p = ah * bh;
    let q = ah * bl + al * bh;
    let z = p + q;
    return [z, p - z + q + al * bl];
  }

  function sqr1(a) {
    let u = a * splitter;
    let xh = u + (a - u);
    let xl = a - xh;
    let z = a * a;
    let v = xh * xl;
    return [z, ((xh * xh - z) + v + v) + xl * xl];
  }

  /* Unar operators with double */

  function abs2(X) {
    return (X[0] > 0) ? X : neg2(X);
  }

  function neg2(X) {
    return [-X[0], -X[1]];
  }

  function inv2(X) {
    let zh = 1 / X[0];
    let T = mul21(X, zh);
    let zl = (1 - T[0] - T[1]) / X[0];
    let zf = zh + zl;
    return [zf, zh - zf + zl];
  }

  function sqr2(X) {
    let Z = sqr1(X[0]);
    let c = X[0] * X[1];
    Z[1] += c + c;
    let zf = Z[0] + Z[1];
    return [zf, Z[0] - zf + Z[1]];
  }

  function sqrt2(X) {
    if (X[0] < 0) return [NaN, NaN];
    if (X[0] === 0) return [0, 0];
    let zh = Math.sqrt(X[0]);
    let T = mul11(zh, zh);
    let zl = (X[0] - T[0] - T[1] + X[1]) * 0.5 / zh;
    let zf = zh + zl;
    return [zf, zh - zf + zl];
  }

  function ln2(X) {
    if (le21(X, 0)) return [NaN, NaN];
    if (eq21(X, 1)) return [0, 0];
    let Z = toDouble(Math.log(X[0]));
    return  sub21(sum22(Z, mul22(X, exp2(neg2(Z)))), 1);
  }

  function exp2(X) {
    if (le21(X, 0)) return [1, 0];
    if (eq21(X, 1)) return E;
    if (le21(X, -709)) return [0, 0];
    if (ge21(X, 709)) return [Infinity, Infinity];
    let n = Math.floor(X[0] / Log2[0] + 0.5);
    let R = sub22(X, mul21(Log2, n)), U = [1, 0], V = [1, 0], i, cLen;
    let padeCoef = [1, 272, 36720, 3255840, 211629600, 10666131840, 430200650880, 14135164243200,
      381649434566400, 8481098545920000, 154355993535744030, 2273242813890047700, 26521166162050560000,
      236650405753681870000, 1.5213240369879552e+21, 6.288139352883548e+21, 1.2576278705767096e+22 ];
    for (i = 0, cLen = padeCoef.length; i < cLen; i++) U = sum21(mul22(U, R), padeCoef[i]);
    for (i = 0, cLen = padeCoef.length; i < cLen; i++) V = sum21(mul22(V, R), padeCoef[i] * ((i % 2) ? -1 : 1));
    return mul21pow2(div22(U, V), Math.pow(2, n));
  }

  /* Arithmetic operations with double and single */

  function sum21(X, b) {
    let Z = sum11(X[0], b);
    Z[1] += X[1];
    let zf = Z[0] + Z[1];
    return [zf, Z[0] - zf + Z[1]];
  }

  function sub21(X, b) {
    let Z = sum11(X[0], -b);
    Z[1] += X[1];
    let zf = Z[0] + Z[1];
    return [zf, Z[0] - zf + Z[1]];
  }

  function mul21(X, b) {
    let Z = mul11(X[0], b);
    Z[1] += X[1] * b;
    let zf = Z[0] + Z[1];
    return [zf, Z[0] - zf + Z[1]];
  }

  function div21(X, b) {
    let zh = X[0] / b; 
    let T = mul11(zh, b);
    let zl = (X[0] - T[0] - T[1] + X[1]) / b;
    let zf = zh + zl;
    return [zf, zh - zf + zl];
  }

  function mul21pow2(X, b) { return [X[0] * b, X[1] * b]; }

  function pow21n(base, exp) {
    if (exp === 0) return [1, 0];
    if (exp == 1) return base;
    let isPositive = exp > 0;
    if (!isPositive) exp = -exp;
    let n = Math.floor(Math.log(exp) / Math.log(2));
    let m = Math.floor(exp - Math.pow(2, n));
    let Z = base, Z0 = Z;
    while (n--) Z = sqr2(Z);
    while (m--) Z = mul22(Z, Z0);
    return isPositive ? Z : inv2(Z);
  }

  /* Arithmetic operations with two double */

  function sum22(X, Y) {
    let x = X[0], xl = X[1], y = Y[0], yl = Y[1];
    let zh = x + y;
    let zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
    let zf = zh + zl;
    return [zf, zh - zf + zl];
  }

  function sub22(X, Y) {
    let x = X[0], xl = X[1], y = -Y[0], yl = -Y[1];
    let zh = x + y;
    let zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
    let zf = zh + zl;
    return [zf, zh - zf + zl];
  }

  function mul22(X, Y) {
    let Z = mul11(X[0], Y[0]);
    Z[1] += X[0] * Y[1] + X[1] * Y[0];
    let zf = Z[0] + Z[1];
    return [zf, Z[0] - zf + Z[1]];
  }

  function div22(X, Y) {
    let zh = X[0] / Y[0];
    let T = mul11(zh, Y[0]);
    let zl = (X[0] - T[0] - T[1] + X[1] - zh * Y[1]) / Y[0];
    let zf = zh + zl;
    return [zf, zh - zf + zl];
  }

  function pow22(base, ex) {
    return exp2(mul22(ex, ln2(base)));
  }

  /* Different comparisons */

  function eq21(X, b) { return (X[0] === b && X[1] === 0); }
  function ne21(X, b) { return (X[0] !== b || X[1] !== 0); }
  function gt21(X, b) { return (X[0] > b || (X[0] === b && X[1] > 0)); }
  function lt21(X, b) { return (X[0] < b || (X[0] === b && X[1] < 0)); }
  function ge21(X, b) { return (X[0] >= b && (X[0] === b && X[1] >= 0)); }
  function le21(X, b) { return (X[0] <= b && (X[0] === b && X[1] <= 0)); }
  function eq22(X, Y) { return (X[0] === Y[0] && X[1] === Y[1]); }
  function ne22(X, Y) { return (X[0] !== Y[0] || X[1] !== Y[1]); }
  function gt22(X, Y) { return (X[0] > Y[0] || (X[0] === Y[0] && X[1] > Y[1])); }
  function lt22(X, Y) { return (X[0] < Y[0] || (X[0] === Y[0] && X[1] < Y[1])); }
  function ge22(X, Y) { return (X[0] >= Y[0] && (X[0] === Y[0] && X[1] >= Y[1])); }
  function le22(X, Y) { return (X[0] <= Y[0] && (X[0] === Y[0] && X[1] <= Y[1])); }

  /* Different convertation */

  function toNumber(double) {
    return double.reduce(function (sum, component) { return sum += component }, 0);
  }

  function toDouble(number) {
    if (typeof number == 'number' || typeof number == 'string') return parseDouble(number.toString());
    else return [NaN, NaN];
  }
    
  function toExponential(double, precision) {
    if (precision === undefined) precision = 31;
    let val = double, result = (val[0] < 0) ? '-' : '';
    if (isNaN(val[0])) return 'NaN';
    if (!isFinite(val[0])) return result + 'Infinity';
    if (toNumber(val) == 0) return '0e+0';

    let str, nextDigs, shift, isPositive;
    for (let i = 0; i < precision; i += 15) {
      str = val[0].toExponential().split('e');
      isPositive = (str[0][0] != '-');
      nextDigs = str[0].replace(/^0\.|\./, '').slice(0, 15);
      if (!isPositive) nextDigs = nextDigs.slice(1);
      shift = Math.floor(parseInt(str[1]) - 14);
      val = sub22(val, mul11(parseInt(nextDigs) * ((isPositive) ? 1 : -1), Math.pow(10, shift)));
      nextDigs = nextDigs.slice(0, precision - i);
      result += (i != 0) ? nextDigs : nextDigs.slice(0, 1) + '.' + nextDigs.slice(1);
    }
    return result + 'e' + double[0].toExponential().split('e')[1];
  }

  function parseDouble(string) {
    let isPositive = (/^\s*-/.exec(string) === null);
    let str = string.replace(/^\s*[+-]?/, '');
    if (/Infinity.*/.exec(str) !== null) return (isPositive) ? [Infinity, Infinity] : [-Infinity, -Infinity];
    str = /^([0-9]*\.?[0-9]+)(?:[eE]([-+]?[0-9]+))?/.exec(str);
    if (!str) return [NaN, NaN];

    let digits = str[1].replace('.', '');
    let exp = (str[2] !== undefined) ? parseInt(str[2]) : 0;
    let dotId = str[0].indexOf('.');
    if (dotId == -1) dotId = digits.length;
    if (exp + dotId - 1 < -300) return isPositive ? [0, 0] : [-0, -0];
    if (exp + dotId - 1 > 300) return isPositive ? [Infinity, Infinity] : [-Infinity, -Infinity];

    let nextDigs, shift, result = [0, 0];
    for (let i = 0; i < digits.length; i += 16) {
      nextDigs = digits.slice(i, i + 16);
      shift = Math.pow(10, exp + dotId - i - nextDigs.length);
      result = sum22(result, mul11(shift, parseInt(nextDigs)));
    }
    return (isPositive) ? result : neg2(result);
  }

  /* Constants */

  let Pi = [3.141592653589793116,  1.224646799147353207e-16];
  let X2Pi = [6.283185307179586232, 2.449293598294706414e-16];
  let E = [2.718281828459045, 1.4456468917292502e-16];
  let Log2 = [0.6931471805599453, 2.3190468138462996e-17];
  let Phi = [1.618033988749895, -5.4321152036825055e-17];

  exports.quickSum11 = quickSum11;
  exports.sum11 = sum11;
  exports.mul11 = mul11;
  exports.sqr1 = sqr1;
  exports.abs2 = abs2;
  exports.neg2 = neg2;
  exports.inv2 = inv2;
  exports.sqr2 = sqr2;
  exports.sqrt2 = sqrt2;
  exports.ln2 = ln2;
  exports.exp2 = exp2;
  exports.sum21 = sum21;
  exports.sub21 = sub21;
  exports.mul21 = mul21;
  exports.div21 = div21;
  exports.mul21pow2 = mul21pow2;
  exports.pow21n = pow21n;
  exports.sum22 = sum22;
  exports.sub22 = sub22;
  exports.mul22 = mul22;
  exports.div22 = div22;
  exports.pow22 = pow22;
  exports.eq21 = eq21;
  exports.ne21 = ne21;
  exports.gt21 = gt21;
  exports.lt21 = lt21;
  exports.ge21 = ge21;
  exports.le21 = le21;
  exports.eq22 = eq22;
  exports.ne22 = ne22;
  exports.gt22 = gt22;
  exports.lt22 = lt22;
  exports.ge22 = ge22;
  exports.le22 = le22;
  exports.toNumber = toNumber;
  exports.toDouble = toDouble;
  exports.toExponential = toExponential;
  exports.parseDouble = parseDouble;
  exports.Pi = Pi;
  exports.X2Pi = X2Pi;
  exports.E = E;
  exports.Log2 = Log2;
  exports.Phi = Phi;

  return exports;

}({}));
