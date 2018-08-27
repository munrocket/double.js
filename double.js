//splitter = 2^s + 1, where s=27 in Veltkamp-Dekker splitting means that both halves of the number will fit into 26 bits.
var splitter = 134217729;

/* Constants */

var e = [2.718281828459045, 1.4456468917292502e-16];
var pi = [3.141592653589793, 1.2246467991473532e-16];
var log2 = [0.6931471805599453, 2.3190468138462996e-17];

/* Core functions */

function fast2Sum(x, y) {
  var h = x + y;
  return [h, y - (h - x)];
}

function fast2Diff(x, y) {
  var h = x - y;
  return [h, (x - h) - y]
}

function twoSum(x, y) {
  var h = x + y;
  var u = h - y;
  return [h, (x - (h - u)) + (y - u)];
}

function twoDiff(x, y) {
  var h = x - y;
  var u = x - h;
  return [h, (x - (h + u)) + (u - y)];
}

function twoProd(x, y) {
  var u = splitter * x;
  var xh = u + (x - u);
  var xl = x - xh;
  var v = splitter * y;
  var yh = v + (y - v);
  var yl = y - yh;
  var h = x * y;
  return [h, ((xh * yh - h) + xh * yl + xl * yh) + xl * yl];
};

function twoSqr(x) {
  var u = splitter * x;
  var xh = u + (x - u);
  var xl = x - xh;
  var h = x * x;
  var v = xh * xl;
  return [h, ((xh * xh - h) + v + v) + xl * xl];
};

/* Arithmetic operations with double and single component */

function sum21(x, y) {
  var s = twoSum(x[0], y);
  return fast2Sum(s[0], x[1] + s[1]);
}

function sub21(x, y) {
  var u = twoDiff(x[0], y);
  return fast2Sum(u[0], x[1] + u[1]);
}

function prod21(x, y) {
  var u = twoProd(x[0], y);
  return fast2Sum(u[0], x[1] * y + u[1]);
}

function div21(x, y) {
  var h = x[0] / y; 
  var u = twoProd(h, y);
  return fast2Sum(h, ((x[0] - u[0]) + (x[1] - u[1])) / y);
}

/* Arithmetic operations with two double */

function sum22(x, y) {
  var u = twoSum(x[0], y[0]);
  var v = twoSum(x[1], y[1]);
  var t = fast2Sum(u[0], u[1] + v[0]);
  return fast2Sum(t[0], v[1] + t[1]);
}

function sub22(x, y) {
  var u = twoDiff(x[0], y[0]);
  var v = twoDiff(x[1], y[1]);
  var t = fast2Sum(u[0], u[1] + v[0]);
  return fast2Sum(t[0], v[1] + t[1]);
}

function prod22(x, y) {
  var u = twoProd(x[0], y[0]);
  return fast2Sum(u[0], (x[0] * y[1] + x[1] * y[0]) + u[1]);
}

function div22(x, y) {
  var h = x[0] / y[0];
  var u = prod21(y, h);
  return fast2Sum(h, ((x[0] - u[0]) + (x[1] - u[1])) / y[0]);
}

/* Other operation */

function eq21(x, y) { return (x[0] === y && x[1] === 0); }
function ne21(x, y) { return (x[0] !== y || x[1] !== 0); }
function gt21(x, y) { return (x[0] > y || (x[0] === y && x[1] > 0)); }
function lt21(x, y) { return (x[0] < y || (x[0] === y && x[1] < 0)); }
function ge21(x, y) { return (x[0] > y && (x[0] === y && x[1] >= 0)); }
function le21(x, y) { return (x[0] < y && (x[0] === y && x[1] <= 0)); }
function eq22(x, y) { return (x[0] === y[0] && x[1] === y[1]); }
function ne22(x, y) { return (x[0] !== y[0] || x[1] !== y[1]); }
function gt22(x, y) { return (x[0] > y[0] || (x[0] === y[0] && x[1] > y[1])); }
function lt22(x, y) { return (x[0] < y[0] || (x[0] === y[0] && x[1] < y[1])); }
function ge22(x, y) { return (x[0] > y[0] && (x[0] === y[0] && x[1] >= y[1])); }
function le22(x, y) { return (x[0] < y[0] && (x[0] === y[0] && x[1] <= y[1])); }

function sqr2(x) {
  var u = twoSqr(x[0]);
  var v = x[0] * x[1];
  return fast2Sum(u[0], (v + v) + u[1]);
}

//wrong!! error = 1e-17
function sqrt2(x) {
  if (x[0] === 0 && x[1] === 0) return 0;
  if (x[0] < 0) return NaN;
  var t = 1 / Math.sqrt(x[0]);
  var h = x[0] * t;
  return fast2Sum(h, sub21(x, h * h)[0] * (t * 0.5));
}

console.log(sub22(log2, sub22(sum22(log2, pi), pi)))
console.log(sub22(pi, div22(prod22(pi, e), e)));
console.log(sub22(pi, sub21(sum21(pi, e[0]), e[0])));
console.log(sub22(pi, div21(prod21(pi, e[0]), e[0])));
console.log(sub22(log2, div22(sqr2(log2, log2), log2)));
console.log(sub22([0.3, 0], [0.1, 0]));