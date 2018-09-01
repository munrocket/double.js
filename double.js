//splitter = 2^27 + 1, for IEEE double in Veltkamp-Dekker splitting
var splitter = 134217729.0;

/* Core error-free functions */

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

function mul21(x, y) {
  var u = twoProd(x[0], y);
  return fast2Sum(u[0], x[1] * y + u[1]);
}

function div21(x, y) {
  var h = x[0] / y; 
  var u = twoProd(h, y);
  return fast2Sum(h, ((x[0] - u[0]) + (x[1] - u[1])) / y);
}

/* Arithmetic operations with two double*/

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

/* Unar operators */

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

/* Other operation */

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

/* Conversation */

function toNumber(double) {
  return double.reduce(function (sum, component) { return sum += component }, 0);
}

function toDouble(number) {
  return parseDouble(number.toString());
}

function parseDouble(str) {
  try {
    str = str.trimStart();
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
//toDouble("3.141592653589793238462643383279502884197169399375105820974")
//toDouble("2.718281828459045235360287471352662497757247093699959574966")
//toDouble("0.693147180559945309417232121458176568075500134360255254120")

/* Tests */

console.log(toDouble(1000)); //fail to parse number bigger than 1
console.log(toNumber(sub22(pi, div22(mul22(pi, e), e))));
console.log(toNumber(sub22(pi, mul21(mul21(pi, 0.01), 100))));
console.log(toNumber(sub22(log2, sub22(sum22(log2, pi), pi))));
console.log(toNumber(sub22(pi, div22(mul22(pi, e), e))));
console.log(toNumber(sub22(pi, sub21(sum21(pi, e[0]), e[0]))));
console.log(toNumber(sub22(pi, div21(mul21(pi, e[0]), e[0]))));
console.log(toNumber(sub22(log2, div22(sqr2(log2, log2), log2))));
console.log(toNumber(sub22(toDouble(0.3), toDouble(0.1))));