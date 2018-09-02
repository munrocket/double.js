//Veltkamp-Dekker splitter = 2^27 + 1, for IEEE double
var splitter = 134217729.0;

/* Core error-free functions */

function fast2Sum(x, y) {
  var h = x + y;
  return [h, y - (h - x)];
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

function mul21(x, y) {
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

function mul22(x, y) {
  var u = twoProd(x[0], y[0]);
  return fast2Sum(u[0], (x[0] * y[1] + x[1] * y[0]) + u[1]);
}

function div22(x, y) {
  var h = x[0] / y[0];
  var u = mul21(y, h);
  return fast2Sum(h, ((x[0] - u[0]) + (x[1] - u[1])) / y[0]);
}


/* Comparisons */

function eq21(x, y) { return (x[0] === y && x[1] === 0); }
function ne21(x, y) { return (x[0] !== y || x[1] !== 0); }
function gt21(x, y) { return (x[0] > y || (x[0] === y && x[1] > 0)); }
function lt21(x, y) { return (x[0] < y || (x[0] === y && x[1] < 0)); }
function ge21(x, y) { return (x[0] >= y && (x[0] === y && x[1] >= 0)); }
function le21(x, y) { return (x[0] <= y && (x[0] === y && x[1] <= 0)); }
function eq22(x, y) { return (x[0] === y[0] && x[1] === y[1]); }
function ne22(x, y) { return (x[0] !== y[0] || x[1] !== y[1]); }
function gt22(x, y) { return (x[0] > y[0] || (x[0] === y[0] && x[1] > y[1])); }
function lt22(x, y) { return (x[0] < y[0] || (x[0] === y[0] && x[1] < y[1])); }
function ge22(x, y) { return (x[0] >= y[0] && (x[0] === y[0] && x[1] >= y[1])); }
function le22(x, y) { return (x[0] <= y[0] && (x[0] === y[0] && x[1] <= y[1])); }

/* Unar operators */

//2do: abs, inverse

function negate2(x) {
  return [-x[0], -x[1]];
}

function sqr2(x) {
  var u = twoSqr(x[0]);
  var v = x[0] * x[1];
  return fast2Sum(u[0], (v + v) + u[1]);
}

function sqrt2(x) { //rewrite! precision = 1e-17
  if (x[0] === 0 && x[1] === 0) return 0;
  if (x[0] < 0) return NaN;
  var t = 1 / Math.sqrt(x[0]);
  var h = x[0] * t;
  return fast2Sum(h, sub21(x, h * h)[0] * (t * 0.5));
}

/* Conversation */

function toNumber(double) {
  return double.reduce(function (sum, component) { return sum += component }, 0);
}

function toDouble(number) {
  console.log("log toDouble number=", number);
  return parseDouble(number.toString());
}

function parseDouble(str) {
  try {
    console.log("log parseDouble str=", str);
    str = str.trim();
  } catch (er) {
    console.error("error in parseDouble")
    return [NaN, NaN];
  }
  if (strlen <= 0) return [NaN, NaN];
  var i = 0;
  var strlen = str.length;
  var first = str[i];
  if (first === '-' || first === '+') {
    i++;
    isPositive = (first === '+');
  } else {
    isPositive = true;
  }
  var val = [0.0, 0.0];
  var numDigits = 0;
  var numBeforeDec = 0;
  var exp = 0;
  do {
    var ch = str[i];
    var chcode = ch.charCodeAt(0);
    if ('0'.charCodeAt(0) <= chcode && chcode <= '9'.charCodeAt(0)) {
      val = sum21(mul21(val, 10), chcode - '0'.charCodeAt(0));
      numDigits++;
    } else if (ch === '.') {
      numBeforeDec = numDigits;
    } else if (ch === 'e' || ch === 'E') {
      exp = parseInt(str.slice(i));
      if (exp === NaN) {
        exp = 0;
      } else if (exp < 345){
        return isPositive ? [0, 0] : [-0, -0];
      } else if (exp > 308) {
        return isPositive ? [Infinity, Infinity] : [-Infinity,-Infinity];
      }
      break;
    } else {
      break;
    }
  } while (++i < strlen);
  var numDecPlaces = numDigits - numBeforeDec - exp;
  if (numDecPlaces > 0) {
    val = mul21(val, Math.pow(10, -numDecPlaces));
  } else if (numDecPlaces < 0) {
    val = mul21(val, Math.pow(10, -numDecPlaces));
  }
  return isPositive ? val : negate2(val);
}

/* Constants */
var pi = [3.141592653589793, 1.2246467991473532e-16];
var e = [2.718281828459045, 1.4456468917292502e-16];
var log2 = [0.6931471805599453, 2.3190468138462996e-17];

module.exports = {
  sum21: sum21,
  sub21: sub21,
  mul21: mul21,
  div21: div21,
  sum22: sum22,
  sub22: sub22,
  mul22: mul22,
  div22: div22,
  negate2: negate2,
  sqr2: sqr2,
  sqrt2: sqrt2,
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
  e: e,
  log2: log2
}