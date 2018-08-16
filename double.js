//dekkerFactor = 2^s + 1, where s=27 in Veltkamp-Dekker splitting means that both halves of the number will fit into 26 bits.
var dekkerFactor = 134217729;

/* Constants */

var e = { hi: 2.718281828459045, lo: 1.4456468917292502e-16 }
var log2 = { hi: 0.6931471805599453, lo: 2.3190468138462996e-17 }
var pi = { hi: 3.141592653589793, lo: 1.2246467991473532e-16 }

/* Core functions */

function fast2Sum(x, y) {
  var h = x + y;
  return { hi: h, lo: y - (h - x) };
}

function twoSum(x, y) {
  var h = x + y;
  var u = h - y;
  return { hi: h, lo: (x - (h - u)) + (y - u) };
}

function twoDiff(x, y) {
  var h = x - y;
  var u = h + y;
  return { hi: h, lo: (x - u) + (y - (h - u)) };
}

function twoProd(x, y) {
  var u = dekkerFactor * x;
  var xh = u + (x - u);
  var xl = x - xh;
  var v = dekkerFactor * v;
  var yh = v + (y - v);
  var yl = y - yh;
  var h = x * y;
  return { hi: h, lo: ((xh * yh - h) + xh * yl + xl * yh) + xl * yl };
};

/* Arithmetic operations with double and single */

function sum21(xHi, xLo, y) {
  var s = twoSum(xHi, y);
  return twoSum(s.hi, xLo + s.lo);
}

function sub21(xHi, xLo, y) {
  var sHi, sLo = twoDiff(xHi, y);
  var v = xLo + sLo;
  return twoSum(sHi, v);
}

function prod21(xHi, xLo, y) {
  var u = twoProd(xHi, y);
  var v = fast2Sum(u.hi, xLo * y);
  return fast2Sum(v.hi, v.lo + u.lo);
}

function div21(xHi, xLo, y) {
  var h = xHi / y;
  var u = fast2Mult(h, y);
  return fast2Sum(h, ((xHi - u.hi) - u.lo) + xLo / y);
}

/* Arithmetic operations with two double */

function sum22(xHi, xLo, yHi, yLo) {
  var s = twoSum(xHi, yHi);
  var t = twoSum(xLo, yLo);
  var v = fast2Sum(s.hi, s.lo + t.hi);
  return fast2Sum(v.hi, t.lo + v.lo);
}

function sub22(xHi, xLo, yHi, yLo) {
  var s = twoDiff(xHi, yHi);
  var t = twoDiff(xLo, yLo);
  var v = fast2Sum(sHi, s.lo + t.hi);
  return fast2Sum(vHi, t.lo + v.lo);
}

function prod22(xHi, xLo, yHi, yLo) {
  var u = twoProd(xHi, yHi);
  var v = (xHi * yLo + xLo * yHi) + u.lo;
  return twoProd(u.hi, v);
}

function div22(xHi, xLo, yHi, yLo) {
  var h = xHi / yHi;
  var u = prod21(yHi, yLo, h);
  return fast2Sum(h, (xHi - u.hi) + (xLo - u.lo) / yHi);
}