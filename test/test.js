var tape = require('tape');
var tapSpec = require('tap-spec');
var d = require('../src/double');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var eps1 = 1e-15;
var eps2 = 1e-31;

function absError22(expected, actual) {
  return Math.abs(d.toNumber(d.sub22(expected, actual)));
}

tape('classic test', function (t) {
  var expected = 0.2;
  var actual = d.toNumber(d.sub22(d.toDouble(0.3), d.toDouble(0.1)));
  var diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "0.3-0.1 = 0.2 ?");
  t.end();
});

tape('parseDouble tests', function (t) {
  var expected = 12345;
  var actual = d.toNumber(d.parseDouble(12345));
  var diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "normal numbers (diff=" + diff + ")");
  expected = -100;
  actual = d.toNumber(d.toDouble(-100));
  diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "negative numbers (diff=" + diff + ")");
  expected = 12.345;
  actual = d.toNumber(d.toDouble("  12.345W"));
  diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "decimal numbers (diff=" + diff + ")");
  expected = 120;
  actual = d.toNumber(d.toDouble("12e1"));
  diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "Exponent format (diff=" + diff + ")");
  expected = 1.2;
  actual = d.toNumber(d.toDouble("12e-1"));
  diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "Negative exponent (diff=" + diff + ")");
  expected = -0.123;
  actual = d.toNumber(d.toDouble("-.123eW"));
  diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "wtf numbers (diff=" + diff + ")");
  expected = 9e300;
  actual = d.toDouble("9e300");
  diff = Math.abs(expected - d.toNumber(actual));
  t.ok(diff < Infinity, "Large exponent (diff=" + diff + ", actual=[" + actual[0] + "," + actual[1] + "])");
  expected = 0;
  actual = d.toDouble("9e-322");
  diff = Math.abs(expected - d.toNumber(actual));
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
  t.ok(isNaN(actual) && isNaN(actual2), "NaN number");
  t.end();
});

tape('double-double operations', function (t) {
  var expected = d.log2;
  var actual = d.sub22(d.sum22(d.log2, d.pi), d.pi);
  var diff = absError22(expected, actual);
  t.ok(diff < eps2, "additive inverse (diff=" + diff + ")");
  expected = d.pi;
  actual = d.div22(d.mul22(d.pi, d.e), d.e);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "multiplicative inverse (diff=" + diff + ")");
  t.end();
});

tape('double-single operations', function (t) {
  var expected = d.pi;
  var actual = d.sub21(d.sum21(d.pi, d.e[0]), d.e[0]);
  var diff = absError22(expected, actual);
  t.ok(diff < eps2, "additive inverse (diff=" + diff + ")");
  expected = d.pi;
  actual = d.div21(d.mul21(d.pi, d.e[0]), d.e[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "multiplicative inverse (diff=" + diff + ")");
  t.end();
});

tape('unary operators', function (t) {
  var expected = [0,0];
  var actual = d.sum22(d.pi, d.negate2(d.pi));
  var diff = absError22(expected, actual);
  t.ok(diff < eps2, "negate2 (diff=" + diff + ")");
  expected = d.pi;
  actual = d.sqrt2(d.sqr2(d.pi));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "sqr2(sqrt2(x)) (diff=" + diff + ")");
  t.end();
});

tape('strange behaviour', function (t) {
  var expected = d.log2;
  var actual = d.mul21(d.mul21(d.log2, 0.01), 100);
  var diff = absError22(expected, actual);
  t.ok(diff < eps2, "one hundred test (diff=" + diff + ")");
  t.end();
});

//console.log(d.toDouble("3.141592653589793238462643383279502884197169399375105820974"));
//console.log(d.toDouble("2.718281828459045235360287471352662497757247093699959574966"));
//console.log(d.toDouble("0.693147180559945309417232121458176568075500134360255254120"));
