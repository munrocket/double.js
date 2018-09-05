(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/* Veltkamp-Dekker splitter = 2^27 + 1 for IEEE 64-bit float number */

var splitter = 134217729;

/* Operations with single numbers and result is double */

function quickSum11(a, b) {
  var z = a + b;
  return [z, b - z + a];
}

function sum11(a, b) {
  var z = a + b;
  var w = z - a;
  var z2 = z - w - a;
  return [z, b - w - z2];
}

function mul11(a, b) {
  var p = a * splitter;
  var ah = a - p + p; var al = a - ah;
  p = b * splitter;
  var bh = b - p + p; var bl = b - bh;
  p = ah * bh;
  var q = ah * bl + al * bh;
  var z = p + q;
  return [z, p - z + q + al * bl];
}

function sqr1(a) {
  var u = a * splitter;
  var xh = u + (a - u);
  var xl = a - xh;
  var z = a * a;
  var v = xh * xl;
  return [z, ((xh * xh - z) + v + v) + xl * xl];
}

function pow11n(base, exp) {
  if (exp === 0) return [1, 0];
  if (exp == 1) return [base, 0];
  var isPositive = exp > 0;
  if (!isPositive) exp = -exp;
  var n = Math.floor(Math.log(exp) / Math.log(2));
  var m = Math.floor(exp - Math.pow(2, n));
  var Z = [base, 0], Z0 = Z;
  while (n--) Z = sqr2(Z);
  while (m--) Z = mul22(Z, Z0);
  return isPositive ? Z : inv2(Z);
}

/* Unar operators with double */

function abs2(X) {
  return (X[0] > 0) ? X : neg2(X);
}

function neg2(X) {
  return [-X[0], -X[1]];
}

function inv2(X) {
  var zh = 1 / X[0];
  var T = mul21(X, zh);
  var zl = (1 - T[0] - T[1]) / X[0];
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

function sqr2(X) {
  var Z = sqr1(X[0]);
  var c = X[0] * X[1];
  Z[1] += c + c;
  var zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

function sqrt2(X) {
  if (X[0] < 0) return [NaN, NaN];
  if (X[0] === 0) return [0, 0];
  var zh = Math.sqrt(X[0]);
  var T = mul11(zh, zh);
  var zl = (X[0] - T[0] - T[1] + X[1]) * 0.5 / zh;
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

/* Arithmetic operations with double and single */

function sum21(X, b) {
  var Z = sum11(X[0], b);
  Z[1] += X[1];
  var zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

function sub21(X, b) {
  var Z = sum11(X[0], -b);
  Z[1] += X[1];
  var zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

function mul21(X, b) {
  var Z = mul11(X[0], b);
  Z[1] += X[1] * b;
  var zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

function div21(X, b) {
  var zh = X[0] / b; 
  var T = mul11(zh, b);
  var zl = (X[0] - T[0] - T[1] + X[1]) / b;
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

/* Arithmetic operations with two double */

function sum22(X, Y) {
  var x = X[0], xl = X[1], y = Y[0], yl = Y[1];
  var zh = x + y;
  var zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

function sub22(X, Y) {
  var x = X[0], xl = X[1], y = -Y[0], yl = -Y[1];
  var zh = x + y;
  var zl = (Math.abs(x) > Math.abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

function mul22(X, Y) {
  var Z = mul11(X[0], Y[0]);
  Z[1] += X[0] * Y[1] + X[1] * Y[0];
  var zf = Z[0] + Z[1];
  return [zf, Z[0] - zf + Z[1]];
}

function div22(X, Y) {
  var zh = X[0] / Y[0];
  var T = mul11(zh, Y[0]);
  var zl = (X[0] - T[0] - T[1] + X[1] - zh * Y[1]) / Y[0];
  var zf = zh + zl;
  return [zf, zh - zf + zl];
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

function parseDouble(string) {
  var isPositive = (/^\s*-/.exec(string) === null);
  var str = string.replace(/^\s*[+-]?/, '');
  if (/Infinity.*/.exec(str) !== null) return (isPositive) ? [Infinity, Infinity] : [-Infinity, -Infinity];
  str = /^([0-9]*\.?[0-9]+)(?:[eE]([-+]?[0-9]+))?/.exec(str);
  if (!str) return [NaN, NaN];

  var digits = str[1].replace('.', '');
  var exp = (str[2] !== undefined) ? parseInt(str[2]) : 0;
  var dotId = str[0].indexOf('.');
  if (dotId == -1) dotId = digits.length;
  if (exp + dotId - 1 < -300) return isPositive ? [0, 0] : [-0, -0];
  if (exp + dotId - 1 > 300) return isPositive ? [Infinity, Infinity] : [-Infinity, -Infinity];

  var nextDigs, shift, result = [0, 0];
  for (var i = 0; i < digits.length; i += 16) {
    nextDigs = digits.slice(i, i + 16);
    shift = Math.pow(10, exp + dotId - i - nextDigs.length);
    result = sum22(result, mul11(shift, parseInt(nextDigs)));
  }
  return (isPositive) ? result : neg2(result);
}

/* Constants */

var pi = [3.141592653589793116,  1.224646799147353207e-16];
var e = [2.718281828459045, 1.4456468917292502e-16];
var x2pi = [6.283185307179586232, 2.449293598294706414e-16];
var log2 = [0.6931471805599453, 2.3190468138462996e-17];
var phi = [1.618033988749895, -5.4321152036825055e-17];

/* CommonJS module defenition */

module.exports = {
  quickSum11: quickSum11,
  sum11: sum11,
  mul11: mul11,
  sqr1: sqr1,
  pow11n:pow11n,
  abs2: abs2,
  inv2: inv2,
  neg2: neg2,
  sqr2: sqr2,
  sqrt2: sqrt2,
  sum21: sum21,
  sub21: sub21,
  mul21: mul21,
  div21: div21,
  sum22: sum22,
  sub22: sub22,
  mul22: mul22,
  div22: div22,
  eq21: eq21,
  ne21: ne21,
  gt21: gt21,
  lt21: lt21,
  ge21: ge21,
  le21: le21,
  eq22: eq22,
  ne22: ne22,
  gt22: gt22,
  lt22: lt22,
  ge22: ge22,
  le22: le22,
  toNumber: toNumber,
  toDouble: toDouble,
  parseDouble: parseDouble,
  pi: pi,
  x2pi: x2pi,
  e: e,
  log2: log2,
  phi: phi
}
},{}]},{},[1]);