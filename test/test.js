var tape = require('tape');
var tapSpec = require('tap-spec');
var d = require('../src/double');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var eps1 = 1e-15;
var eps2 = 1e-30;
var abs = Math.abs;
var diff, diff2, expected, expected2, actual, actual2, actual3;

function absError22(expected, actual) {
  return abs(d.toNumber(d.sub22(expected, actual)));
}

tape('classic test', function (t) {
  expected = 0.2;
  actual = d.toNumber(d.sub22(d.toDouble(0.3), d.toDouble(0.1)));
  diff = abs(expected - actual);
  t.ok(diff < eps2, '0.3-0.1 = 0.2 (diff=' + diff + ')');
  t.end();
});

tape('unary operators with double', function (t) {
  expected = [1, 0];
  actual = d.mul22(d.Log2, d.inv2(d.Log2));
  diff = absError22(actual, expected);
  t.ok(diff < eps2, 'inv2 (diff=' + diff + ')');
  expected = [0, 0];
  actual = d.sum22(d.Log2, d.neg2(d.Log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'neg2 (diff=' + diff + ')');
  expected = d.Log2;
  actual = d.sqrt2(d.sqr2(d.Log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'sqr2 / sqrt2 (diff=' + diff + ')');
  expected = 1e20; expected2 = 1e-20;
  actual = d.toNumber(d.pow21n([10, 0], 20)); actual2 = d.toNumber(d.pow21n([10, 0], -20));
  diff = abs(actual - expected); diff2 = abs(actual2 - expected2);
  t.ok(diff < eps1 && diff2 < eps1,'pow21n (diff=' + diff + ', diff2=' + diff2 + ')');
  expected = Math.pow(Math.E, Math.PI);
  actual = d.toNumber(d.exp2(d.Pi));
  console.log(d.exp2(d.Pi));
  diff = abs(actual - expected);
  t.ok(diff < eps1,'exp2 (diff=' + diff + ')');
  t.end();
});

tape('double-single operations', function (t) {
  expected = d.neg2(d.Log2);
  actual = d.sub21(d.sum21(d.neg2(d.Log2), d.E[0]), d.E[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'additive inverse (diff=' + diff + ')');
  expected = d.E;
  actual = d.div21(d.mul21(d.E, d.Pi[0]), d.Pi[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'multiplicative inverse (diff=' + diff + ')');
  t.end();
});

tape('double-double operations', function (t) {
  expected = d.Log2;
  actual = d.sub22(d.sum22(d.Log2, d.E), d.E);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'additive inverse (diff=' + diff + ')');
  expected = d.Pi;
  actual = d.div22(d.mul22(d.Pi, d.Log2), d.Log2);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'multiplicative inverse (diff=' + diff + ')');
  t.end();
});

tape('golden ratio equation test', function(t) {
  var phi = d.div21(d.sum21(d.sqrt2([5, 0]), 1), 2);
  expected = d.sum21(phi, 1);
  actual = d.mul22(phi, phi);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'ϕ² = ϕ + 1 (diff=' + diff + ')');
  expected = d.mul21(d.inv2(phi), 1);
  actual = d.sub21(phi, 1);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, '1/ϕ = ϕ - 1 (diff=' + diff + ')');
  t.end();
});

tape('parseDouble tests', function (t) {
  expected = 123456789;
  actual = d.toNumber(d.toDouble('123456789Q'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'integer numbers (diff=' + diff + ')');
  expected = -100;
  actual = d.toNumber(d.toDouble(-100));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'negative numbers (diff=' + diff + ')');
  expected = 654321.789;
  actual = d.toNumber(d.toDouble(' 654321.789'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'decimal numbers (diff=' + diff + ')');
  expected = 120;
  actual = d.toNumber(d.toDouble('12e1'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'Exponent format (diff=' + diff + ')');
  expected = 1.2;
  actual = d.toNumber(d.toDouble('12e-1'));
  diff = abs(expected - actual);
  t.ok(diff < eps1, 'Negative exponent (diff=' + diff + ')');
  expected = -0.123;
  actual = d.toNumber(d.toDouble('-.123R'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'short defenition (diff=' + diff + ')');
  expected = 123.12e6;
  actual = d.toNumber(d.toDouble('123.12e6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'scientific format (diff=' + diff + ')');
  expected = 123e12;
  actual = d.toNumber(d.toDouble('123e12.6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'mixed up (diff=' + diff + ')');
  expected = 456.12;
  actual = d.toNumber(d.toDouble('456.12.6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'two dot (diff=' + diff + ')');
  expected = 123e-12;
  actual = d.toNumber(d.toDouble('123e-12e6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'two exp (diff=' + diff + ')');
  expected = 9e300;
  actual = d.toDouble('9e300');
  diff = abs(expected - d.toNumber(actual));
  t.ok(diff < Infinity, 'Large exponent (diff=' + diff + ', actual=[' + actual[0] + ',' + actual[1] + '])');
  expected = 0;
  actual = d.toDouble('9e-322');
  diff = abs(expected - d.toNumber(actual));
  t.ok(diff < eps2, 'Tiny exponent (diff=' + diff + ', actual=[' + actual[0] + ',' + actual[1] + '])');
  actual = d.toNumber(d.toDouble('1e500'));
  actual2 = d.toNumber(d.toDouble('-1e500'));
  t.ok(actual === Infinity && actual2 === -Infinity, 'Giant exponent');
  actual = d.toNumber(d.toDouble('1e-500'));
  actual2 = d.toNumber(d.toDouble('-1e-500'));
  t.ok(actual === 0 && actual2 === 0, 'Insignificant exponent');
  actual = d.toNumber(d.toDouble(0));
  t.ok(actual === 0, 'Zero number');
  actual = d.toNumber(d.toDouble(Infinity));
  actual2 = d.toNumber(d.toDouble(-Infinity));
  t.ok(actual === Infinity && actual2 === -Infinity, 'Infinity number');
  actual = d.toNumber(d.toDouble(NaN));
  actual2 = d.toNumber(d.parseDouble('SDLFK'));
  actual3 = d.toNumber(d.parseDouble('  '));
  t.ok(isNaN(actual) && isNaN(actual2) && isNaN(actual3), 'NaN number');
  actual = d.parseDouble('3.141592653589793238462643383279502884197169399375105820974');
  expected = d.Pi;
  t.ok(absError22(actual, expected) < eps1, 'parse Pi (diff=' + diff + ')');
  actual = d.parseDouble('2.718281828459045235360287471352662497757247093699959574966');
  expected = d.E;
  t.ok(absError22(actual, expected) < eps1, 'parse E (diff=' + diff + ')');
  t.end();
});

// tape('extendend tests', function (t) {
//   expected = d.Pi;
//   actual = d.sum21(d.sum21(d.Pi, 1000), -1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'sum21 with inverted (diff=' + diff + ')');
//   expected = d.Pi;
//   actual = d.sub21(d.sub21(d.Pi, 1000), -1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'sub21 with inverted (diff=' + diff + ')');
//   expected = d.Pi;
//   actual = d.mul21(d.mul21(d.Pi, 0.001), 1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'mul21 with inverted (diff=' + diff + ')');
//   actual = d.div21(d.div21(d.Pi, 0.001), 1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'div21 with inverted (diff=' + diff + ')');
//   t.end();
// });