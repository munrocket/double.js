//Veltkamp-Dekker splitter = 2^27 + 1, for IEEE 64-bit double
var splitter = 134217729.0;
var abs = Math.abs;

/* Arithmetic operations with two single and result is double */

function fastSum11(a, b) {
  var z = a + b; //assume that abs(a) > abs(b)
  return [z, b - (z - a)];
}

function sum11(a, b) {
  var z = a + b;
  var w = z - b;
  return [z, (a - (z - w)) + (b - w)];
}

function mul11(a, b) {
  var p = a * splitter;
  var xh = a - p + p; var xl = a - xh;
  p = b * splitter;
  var yh = b - p + p; var yl = b - yh;
  p = xh * yh;
  var q = xh * yl + xl * yh;
  var z = p + q;
  return [z, p - z + q + xl * yl];
};

function sqr1(a) {
  var u = a * splitter;
  var xh = u + (a - u);
  var xl = a - xh;
  var z = a * a;
  var v = xh * xl;
  return [z, ((xh * xh - z) + v + v) + xl * xl];
};

/* Arithmetic operations with double and single */

function sum21(X, b) {
  var T = sum11(X[0], b);
  var zl = X[1] + T[1];
  var zf = T[0] + zl;
  return [zf, T[0] - zf + zl];
}

function sub21(X, b) {
  var T = sum11(X[0], -b);
  var zl = X[1] + T[1];
  var zf = T[0] + zl;
  return [zf, T[0] - zf + zl];
}

function mul21(X, b) {
  var T = mul11(X[0], b);
  var zl = X[1] * b + T[1]
  var zf = T[0] + zl;
  return [zf, T[0] - zf + zl];
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
  var zl = (abs(x) > abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

function sub22(X, Y) {
  var x = X[0], xl = X[1], y = -Y[0], yl = -Y[1];
  var zh = x + y;
  var zl = (abs(x) > abs(y)) ? x - zh + y + yl + xl : y - zh + x + xl + yl;
  var zf = zh + zl;
  return [zf, zh - zf + zl];
}

function mul22(X, Y) {
  var Z = mul11(X[0], Y[0]);
  Z[1] = X[0] * Y[1] + X[1] * Y[0] + Z[1];
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


/* Comparisons */

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

/* Unar operators */

//2do: abs, inverse

function negate2(X) {
  return [-X[0], -X[1]];
}

function sqr2(X) {
  var u = sqr1(X[0]);
  var v = X[0] * X[1];
  return fastSum11(u[0], (v + v) + u[1]);
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

/* Conversation */

function toNumber(multicomp) {
  return multicomp.reduce(function (sum, component) { return sum += component }, 0);
}

function toDouble(number) {
  return parseDouble(number.toString());
}

function parseDouble(str) {
  if(typeof(str) == 'number') {
    str = str.toString();
  } else if (typeof(str) != 'string') {
    return [NaN, NaN];
  }
  var strlen = str.length;
  if(strlen === 0) return [NaN, NaN];
  var i = 0;
  var ch = str[i];
  while(/\s/.test(ch)) {
    if(++i == strlen) return [NaN, NaN];
    ch = str[i];
  }
  var isPositive = true;
  if (ch == '-' || ch == '+') {
    isPositive = (ch == '+');
    ch = str[++i];
  }
  var chcode;
  var numDigits = 0;
  var numBeforeDec = null;
  var exp = 0;
  var result = [0.0, 0.0];
  do {
    ch = str[i];
    chcode = ch.charCodeAt(0);
    if ('0'.charCodeAt(0) <= chcode && chcode <= '9'.charCodeAt(0)) {
      result = sum21(mul21(result, 10), chcode - '0'.charCodeAt(0));
      numDigits++;
    } else if (ch == '.') {
      numBeforeDec = numDigits;
    } else if (ch == 'e' || ch == 'E') {
      if (numDigits === 0) return [NaN, NaN];
      if (++i < strlen) exp = parseInt(str.slice(i));
      if (isNaN(exp)) {
        exp = 0;
      } else if (exp < -322 - numBeforeDec) {
        return isPositive ? [0, 0] : [-0, -0];
      } else if (exp > 300 - numBeforeDec) {
        return isPositive ? [Infinity, Infinity] : [-Infinity,-Infinity];
      }
      break;
    } else {
      if (numDigits === 0) {
        if (str.slice(i, i + 8) === "Infinity") {
          return isPositive ? [Infinity, Infinity] : [-Infinity, -Infinity];
        } else {
          return [NaN, NaN];
        }
      }
      break;
    }
  } while (++i < strlen);
  if (numBeforeDec === null) numBeforeDec = numDigits;
  result = mul21(result, Math.pow(10, -(numDigits - numBeforeDec - exp)));
  return isPositive ? result : negate2(result);
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