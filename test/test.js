var tape = require('tape');
var tapSpec = require('tap-spec');
var d = require('../src/double');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var eps1 = 1e-15;
var eps2 = 1e-31;

function AE22(expected, actual) {
  return Math.abs(d.toNumber(d.sub22(expected, actual)));
}

tape('classic test', function (t) {
  var expected = 0.2;
  var actual = d.toNumber(d.sub22(d.toDouble(0.3), d.toDouble(0.1)));
  var diff = Math.abs(expected - actual);
  t.ok(diff < eps2, "0.3-0.1 = 0.2 ?");
  t.end();
});

tape('toNumber tests', function (t) {
  var expected = 0.001;
  var actual = d.toNumber(d.toDouble(0.001))
  var diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "small numbers");
  expected = 1000;
  actual = d.toNumber(d.toDouble(1000))
  diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "big numbers");
  expected = -10;
  actual = d.toNumber(d.toDouble(-10))
  diff = Math.abs(expected - actual);
  t.ok(diff < eps1, "negative numbers");
  t.end();
});

tape('double-double operations', function (t) {
  var expected = d.log2;
  var actual = d.sub22(d.sum22(d.log2, d.pi), d.pi);
  var diff = AE22(expected, actual);
  t.ok(diff < eps2, "additive inverse (diff=" + diff + ")");
  expected = d.pi;
  actual = d.div22(d.mul22(d.pi, d.e), d.e);
  diff = AE22(expected, actual);
  t.ok(diff < eps2, "multiplicative inverse (diff=" + diff + ")");
  t.end();
});

tape('double-single operations', function (t) {
  var expected = d.pi;
  var actual = d.sub21(d.sum21(d.pi, d.e[0]), d.e[0]);
  var diff = AE22(expected, actual);
  t.ok(diff < eps2, "additive inverse (diff=" + diff + ")");
  expected = d.pi;
  actual = d.div21(d.mul21(d.pi, d.e[0]), d.e[0]);
  diff = AE22(expected, actual);
  t.ok(diff < eps2, "multiplicative inverse (diff=" + diff + ")");
  t.end();
});

tape('unar operations', function (t) {
  var expected = d.log2;
  var actual = d.div22(d.sqr2(d.log2, d.log2), d.log2);
  var diff = AE22(expected, actual);
  t.ok(diff < eps2, "sqr(sqrt(x)) (diff=" + diff + ")");
  t.end();
});

tape('one hundred test', function (t) {
  var expected = d.log2;
  var actual = d.div22(d.sqr2(d.log2, 0.01), 100);
  var diff = AE22(expected, actual);
  t.ok(diff < eps2, "one hundred test (diff=" + diff + ")");
  t.end();
});