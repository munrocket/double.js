'use strict';

/* Veltkamp-Dekker splitter = 2^27 + 1 for IEEE 64-bit float number */

let splitter = 134217729;

/* Operations with single-length numbers and result is double */

export function sum11(a, b) {
  let z = a + b;
  let w = z - a;
  let z2 = z - w - a;
  return [z, b - w - z2];
}

export function mul11(a, b) {
  let p = a * splitter;
  let ah = a - p + p; let al = a - ah;
  p = b * splitter;
  let bh = b - p + p; let bl = b - bh;
  p = ah * bh;
  let q = ah * bl + al * bh;
  let z = p + q;
  return [z, p - z + q + al * bl];
}

export function sqr1(a) {
  let u = a * splitter;
  let xh = u + (a - u);
  let xl = a - xh;
  let z = a * a;
  let v = xh * xl;
  return [z, ((xh * xh - z) + v + v) + xl * xl];
}

/* Unar operators with double */

export function abs2(X) {
  return (X[0] > 0) ? X : neg2(X);
}

export function neg2(X) {
  return [-X[0], -X[1]];
}

export function inv2(X) {
  let zh = 1 / X[0];
  let T = mul21(X, zh);
  let zl = (1 - T[0] - T[1]) / X[0];
  let zf = zh + zl;
  return [zf, zh - zf + zl];
}

export function sqr2(X) {
  let Z = sqr1(X[0]);
  let c = X[0] * X[1];
  Z[1] += c + c;
  let zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

export function sqrt2(X) {
  if (X[0] < 0) return [NaN, NaN];
  if (X[0] === 0) return [0, 0];
  let zh = Math.sqrt(X[0]);
  let T = mul11(zh, zh);
  let zl = (X[0] - T[0] - T[1] + X[1]) * 0.5 / zh;
  let zf = zh + zl;
  return [zf, zh - zf + zl];
}

export function ln2(X) {
  if (le21(X, 0)) return [NaN, NaN];
  if (eq21(X, 1)) return [0, 0];
  let Z = toDouble(Math.log(X[0]));
  return  sub21(sum22(Z, mul22(X, exp2(neg2(Z)))), 1);
}

export function exp2(X) {
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

export function sinh2(X) {
  var exp = exp2(X);
  return mul21pow2(sub22(exp, inv2(exp)), 0.5);
}

export function cosh2(X) {
  var exp = exp2(X);
  return mul21pow2(sum22(exp, inv2(exp)), 0.5);
}

/* Arithmetic operations with double and single */

export function sum21(X, b) {
  let Z = sum11(X[0], b);
  Z[1] += X[1];
  let zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

export function sub21(X, b) {
  let Z = sum11(X[0], -b);
  Z[1] += X[1];
  let zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

export function mul21(X, b) {
  let Z = mul11(X[0], b);
  Z[1] += X[1] * b;
  let zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

export function div21(X, b) {
  let zh = X[0] / b; 
  let T = mul11(zh, b);
  let zl = (X[0] - T[0] - T[1] + X[1]) / b;
  let zf = zh + zl;
  return [zf, zh - zf + zl];
}

export function mul21pow2(X, b) { return [X[0] * b, X[1] * b]; }

export function pow21n(base, exp) {
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

export function sum22(X, Y) {
  let x = X[0], xl = X[1], y = Y[0], yl = Y[1];
  let zh = x + y;
  let zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
  let zf = zh + zl;
  return [zf, zh - zf + zl];
}

export function sub22(X, Y) {
  let x = X[0], xl = X[1], y = -Y[0], yl = -Y[1];
  let zh = x + y;
  let zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
  let zf = zh + zl;
  return [zf, zh - zf + zl];
}

export function mul22(X, Y) {
  let Z = mul11(X[0], Y[0]);
  Z[1] += X[0] * Y[1] + X[1] * Y[0];
  let zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

export function div22(X, Y) {
  let zh = X[0] / Y[0];
  let T = mul11(zh, Y[0]);
  let zl = (X[0] - T[0] - T[1] + X[1] - zh * Y[1]) / Y[0];
  let zf = zh + zl;
  return [zf, zh - zf + zl];
}

export function pow22(base, ex) {
  return exp2(mul22(ex, ln2(base)));
}

/* Different comparisons */

export function eq21(X, b) { return (X[0] === b && X[1] === 0); }
export function ne21(X, b) { return (X[0] !== b || X[1] !== 0); }
export function gt21(X, b) { return (X[0] > b || (X[0] === b && X[1] > 0)); }
export function lt21(X, b) { return (X[0] < b || (X[0] === b && X[1] < 0)); }
export function ge21(X, b) { return (X[0] >= b && (X[0] === b && X[1] >= 0)); }
export function le21(X, b) { return (X[0] <= b && (X[0] === b && X[1] <= 0)); }
export function eq22(X, Y) { return (X[0] === Y[0] && X[1] === Y[1]); }
export function ne22(X, Y) { return (X[0] !== Y[0] || X[1] !== Y[1]); }
export function gt22(X, Y) { return (X[0] > Y[0] || (X[0] === Y[0] && X[1] > Y[1])); }
export function lt22(X, Y) { return (X[0] < Y[0] || (X[0] === Y[0] && X[1] < Y[1])); }
export function ge22(X, Y) { return (X[0] >= Y[0] && (X[0] === Y[0] && X[1] >= Y[1])); }
export function le22(X, Y) { return (X[0] <= Y[0] && (X[0] === Y[0] && X[1] <= Y[1])); }

/* Different convertation */

export function toNumber(double) {
  return double.reduce(function (sum, component) { return sum += component }, 0);
}

export function toDouble(number) {
  if (typeof number == 'number' || typeof number == 'string') return parseDouble(number.toString());
  else return [NaN, NaN];
}
  
export function toExponential(double, precision) {
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
    val = sub22(val, mul11(parseInt(nextDigs) * ((isPositive) ? 1 : -1), Math.pow(10, shift)))
    nextDigs = nextDigs.slice(0, precision - i);
    result += (i != 0) ? nextDigs : nextDigs.slice(0, 1) + '.' + nextDigs.slice(1);
  }
  return result + 'e' + double[0].toExponential().split('e')[1];
}

export function parseDouble(string) {
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

export let Pi = [3.141592653589793116,  1.224646799147353207e-16];
export let X2Pi = [6.283185307179586232, 2.449293598294706414e-16];
export let E = [2.718281828459045, 1.4456468917292502e-16];
export let Log2 = [0.6931471805599453, 2.3190468138462996e-17];
export let Phi = [1.618033988749895, -5.4321152036825055e-17];
