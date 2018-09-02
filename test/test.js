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

tape('toDouble tests', function (t) {
  var expected = 0.001;
  var actual = d.toNumber(d.toDouble(0.001))
  var diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "small numbers (diff=" + diff + ")");
  expected = 1000;
  actual = d.toNumber(d.toDouble("1000"))
  diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "big numbers (diff=" + diff + ")");
  expected = -10;
  actual = d.toNumber(d.toDouble(-10))
  diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "negative numbers (diff=" + diff + ")");
  expected = Infinity;
  actual = d.toNumber(d.toDouble(Infinity))
  t.ok(actual === expected, "Infinity number");
  expected = -Infinity;
  actual = d.toNumber(d.toDouble(-Infinity))
  t.ok(actual === expected, "-Infinity number");
  expected = NaN;
  actual = d.toNumber(d.toDouble(NaN))
  t.ok(actual === expected, "NaN number");
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

tape('unar operations', function (t) {
  var expected = 0;
  var actual = d.sum22(d.log2, d.negate2(d.log2));
  var diff = absError22(expected, actual);
  t.ok(diff < eps2, "negate2 (diff=" + diff + ")");
  expected = d.log2;
  actual = d.sqrt2(d.sqr2(d.log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, "sqr2(sqrt2(x)) (diff=" + diff + ")");
  t.end();
});

tape('one hundred test', function (t) {
  var expected = d.log2;
  var actual = d.mul21(d.mul21(d.log2, 0.01), 100);
  var diff = absError22(expected, actual);
  t.ok(diff < eps2, "one hundred test (diff=" + diff + ")");
  t.end();
});

//console.log(d.toDouble("3.141592653589793238462643383279502884197169399375105820974"));
//console.log(d.toDouble("2.718281828459045235360287471352662497757247093699959574966"));
//console.log(d.toDouble("0.693147180559945309417232121458176568075500134360255254120"));
