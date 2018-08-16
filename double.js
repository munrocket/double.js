//dekkerSplitter = 2^s + 1, where s=27 in Veltkamp-Dekker splitting means that both halves of the number will fit into 26 bits.
var dekkerSplitter = 134217729;

/* Constants */

var e = { hi: 2.718281828459045, lo: 1.4456468917292502e-16 }
var pi = { hi: 3.141592653589793, lo: 1.2246467991473532e-16 }
var log2 = { hi: 0.6931471805599453, lo: 2.3190468138462996e-17 }

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
  var u = h - y;  
  return { hi: h, lo: (x - (h - u)) - (y + u) };
}

function twoProd(x, y) {
  var u = dekkerSplitter * x;
  var xh = u + (x - u);
  var xl = x - xh;
  var v = dekkerSplitter * v;
  var yh = v + (y - v);
  var yl = y - yh;
  var h = x * y;
  return { hi: h, lo: ((xh * yh - h) + xh * yl + xl * yh) + xl * yl };
};

function twoSqr(x) {
  var u = dekkerSplitter * x;
  var xh = u + (x - u);
  var xl = x - xh;
  var h = x * x;
  var v = xh * xl;
  return { hi: h, lo: ((xh * xh - h) + v + v) + xl * xl };
};

/* Arithmetic operations with double and single */

function sum21(x, y) {
  var s = twoSum(x.hi, y);
  return fast2Sum(s.hi, x.lo + s.lo);
}

function sub21(x, y) {
  var sHi, sLo = twoDiff(x.hi, y);
  var v = x.lo + sLo;
  return fast2Sum(sHi, v);
}

function prod21(x, y) {
  var u = twoProd(x.hi, y);
  var v = fast2Sum(u.hi, x.lo * y);
  return fast2Sum(v.hi, v.lo + u.lo);
}

function div21(x, y) {
  var h = x.hi / y;
  var u = fast2Mult(h, y);
  return fast2Sum(h, ((x.hi - u.hi) - u.lo) + x.lo / y);
}

/* Arithmetic operations with two double */

function sum22(x, y) {
  var s = twoSum(x.hi, y.hi);
  var t = twoSum(x.lo, y.lo);
  var v = fast2Sum(s.hi, s.lo + t.hi);
  return fast2Sum(v.hi, t.lo + v.lo);
}

function sub22(x, y) {
  var s = twoDiff(x.hi, y.hi);
  var t = twoDiff(x.lo, y.lo);
  var v = fast2Sum(s.hi, s.lo + t.hi);
  return fast2Sum(v.hi, t.lo + v.lo);
}

function prod22(x, y) {
  var u = twoProd(x.hi, y.hi);
  var v = (x.hi * y.lo + x.lo * y.hi) + u.lo;
  return twoProd(u.hi, v);
}

function div22(x, y) {
  var h = x.hi / y.hi;
  var u = prod21(y, h);
  return fast2Sum(h, (x.hi - u.hi) + (x.lo - u.lo) / y.hi);
}

/* Other operation */

function greater(x, y) {
  return (x.hi > y.hi || ((x.hi == y.hi) && (x.lo > y.lo)));
}

function sqrt2(x) {
  if (x.hi === 0 && x.lo === 0) return 0;
  if (x.hi < 0) return NaN;

  var t = 1 / Math.sqrt(x.hi);
  var h = x.hi * t;
  return fast2Sum(h, sub(x, { hi: h * h, lo: 0 }).hi * (t * 0.5));
}

console.log(sub22(pi, pi))