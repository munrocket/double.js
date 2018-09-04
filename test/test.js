var tape = require('tape');
var tapSpec = require('tap-spec');
var d = require('../src/double');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var eps1 = 1e-15;
var eps2 = 1e-30;
var abs = Math.abs;
var expected, diff, actual, actual2, actual3;

function absError22(expected, actual) {
  return abs(d.toNumber(d.sub22(expected, actual)));
}

tape('classic test', function (t) {
  expected = 0.2;
  actual = d.toNumber(d.sub22(d.parseDouble("0.3"), d.parseDouble("0.1")));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "0.3-0.1 = 0.2 (diff=" + diff + ")");
  t.end();
});

tape('unary operators with double', function (t) {
  expected = [1, 0];
  actual = d.mul22(d.log2, d.inv2(d.log2));
  diff = absError22(actual, expected);
  t.ok(diff < eps2, "inv2 (diff=" + diff + ")");
  expected = [0, 0];
  actual = d.sum22(d.log2, d.neg2(d.log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "neg2 (diff=" + diff + ")");
  expected = d.log2;
  actual = d.sqrt2(d.sqr2(d.log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "sqr2 / sqrt2 (diff=" + diff + ")");
  expected = 100000;
  actual = d.toNumber(d.npow1(10, 5));
  diff = abs(actual - expected);
  t.ok(diff < eps1, "npow1 with positive exp (diff=" + diff + ")");
  expected = 0.00001;
  actual = d.toNumber(d.npow1(10, -5));
  diff = abs(actual - expected);
  t.ok(diff < eps1, "npow1 with negative exp (diff=" + diff + ")");
  t.end();
});

tape('double-single operations', function (t) {
  expected = d.neg2(d.log2);
  actual = d.sub21(d.sum21(d.neg2(d.log2), d.e[0]), d.e[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "additive inverse (diff=" + diff + ")");
  expected = d.e;
  actual = d.div21(d.mul21(d.e, d.pi[0]), d.pi[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "multiplicative inverse (diff=" + diff + ")");
  t.end();
});

tape('double-double operations', function (t) {
  expected = d.log2;
  actual = d.sub22(d.sum22(d.log2, d.e), d.e);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "additive inverse (diff=" + diff + ")");
  expected = d.pi;
  actual = d.div22(d.mul22(d.pi, d.log2), d.log2);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "multiplicative inverse (diff=" + diff + ")");
  t.end();
});

tape('golden ratio equation test', function(t) {
  var phi = d.div21(d.sum21(d.sqrt2([5, 0]), 1), 2);
  expected = d.sum21(phi, 1);
  actual = d.mul22(phi, phi);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "ϕ² = ϕ + 1 (diff=" + diff + ")");
  expected = d.mul21(d.inv2(phi), 1);
  actual = d.sub21(phi, 1);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "1/ϕ = ϕ - 1 (diff=" + diff + ")");
  t.end();
});

tape('parseDouble tests', function (t) {
  expected = 123456789;
  actual = d.toNumber(d.toDouble("123456789Q"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "integer numbers (diff=" + diff + ")");
  expected = -100;
  actual = d.toNumber(d.toDouble(-100));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "negative numbers (diff=" + diff + ")");
  expected = 123456.345;
  actual = d.toNumber(d.toDouble(" 123456.345"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "decimal numbers (diff=" + diff + ")");
  expected = 120;
  actual = d.toNumber(d.toDouble("12e1"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "Exponent format (diff=" + diff + ")");
  expected = 1.2;
  actual = d.toNumber(d.toDouble("12e-1"));
  diff = abs(expected - actual);
  t.ok(diff < eps1, "Negative exponent (diff=" + diff + ")");
  expected = -0.123;
  actual = d.toNumber(d.toDouble("-.123R"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "short defenition (diff=" + diff + ")");
  expected = 123.12e6;
  actual = d.toNumber(d.toDouble("123.12e6"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "scientific format (diff=" + diff + ")");
  expected = 123e12;
  actual = d.toNumber(d.toDouble("123e12.6"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "mixed up (diff=" + diff + ")");
  expected = 123.12;
  actual = d.toNumber(d.toDouble("123.12.6"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "double dot (diff=" + diff + ")");
  expected = 123e12;
  actual = d.toNumber(d.toDouble("123e12e6"));
  diff = abs(expected - actual);
  t.ok(diff < eps2, "double exp (diff=" + diff + ")");
  expected = 9e300;
  actual = d.toDouble("9e300");
  diff = abs(expected - d.toNumber(actual));
  t.ok(diff < Infinity, "Large exponent (diff=" + diff + ", actual=[" + actual[0] + "," + actual[1] + "])");
  expected = 0;
  actual = d.toDouble("9e-322");
  diff = abs(expected - d.toNumber(actual));
  t.ok(diff < eps2, "Tiny exponent (diff=" + diff + ", actual=[" + actual[0] + "," + actual[1] + "])");
  actual = d.toNumber(d.toDouble("1e500"));
  actual2 = d.toNumber(d.toDouble("-1e500"));
  t.ok(actual === Infinity && actual2 === -Infinity, "Giant exponent");
  actual = d.toNumber(d.toDouble("1e-500"));
  actual2 = d.toNumber(d.toDouble("-1e-500"));
  t.ok(actual === 0 && actual2 === -0, "Insignificant exponent");
  actual = d.toNumber(d.toDouble(Infinity));
  actual2 = d.toNumber(d.toDouble(-Infinity));
  t.ok(actual === Infinity && actual2 === -Infinity, "Infinity number");
  actual = d.toNumber(d.toDouble(NaN));
  actual2 = d.toNumber(d.parseDouble("SDLFK"));
  actual3 = d.toNumber(d.parseDouble("  "));
  t.ok(isNaN(actual) && isNaN(actual2) && isNaN(actual3), "NaN number");
  t.end();
});

tape('extendend tests', function (t) {
  expected = d.pi;
  actual = d.sum21(d.sum21(d.pi, 1000), -1000);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "sum21 with inverted (diff=" + diff + ")");
  expected = d.pi;
  actual = d.sub21(d.sub21(d.pi, 1000), -1000);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "sub21 with inverted (diff=" + diff + ")");
  expected = d.pi;
  actual = d.mul21(d.mul21(d.pi, 0.001), 1000);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "mul21 with inverted (diff=" + diff + ")");
  actual = d.div21(d.div21(d.pi, 0.001), 1000);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "div21 with inverted (diff=" + diff + ")");
  t.end();
});

console.log(d.mul21(d.pi, Math.pow(10, 57)));
actual = d.parseDouble("3141592653589793238462643383279502884197169399375105820974");
console.log(actual);
console.log(absError22(d.pi, actual));
// console.log(actual);
// actual2 = d.parseDouble2("3.141592653589793238462643383279502884197169399375105820974");
// console.log(actual2);
// console.log(absError22(d.pi, actual2));


// console.log(d.parseDouble("3.141592653589793238462643383279502884197169399375105820974"));
// console.log(d.parseDouble("2.718281828459045235360287471352662497757247093699959574966"));
// console.log(d.parseDouble("0.693147180559945309417232121458176568075500134360255254120"));
//console.log(d.parseDouble("1.618033988749894848204586834365638117720309179805762862135"));
