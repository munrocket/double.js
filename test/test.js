var tape = require('tape');
var tapSpec = require('tap-spec');
var D = require('../dist/double.cjs.js');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

var eps1 = 1e-15;
var eps2 = 1e-30;
var abs = Math.abs;
var diff, diff2, expected, expected2, actual, actual2, actual3;

function absError22(expected, actual) {
  return abs(D.toNumber(D.sub22(expected, actual)));
}

tape('classic test', function (t) {
  expected = 0.2;
  actual = D.toNumber(D.sub22(D.toDouble(0.3), D.toDouble(0.1)));
  diff = abs(expected - actual);
  t.ok(diff < eps2, '0.3-0.1 = 0.2 (diff=' + diff + ')');
  t.end();
});

tape('unary operators with double', function (t) {
  expected = [1, 0];
  actual = D.mul22(D.Log2, D.inv2(D.Log2));
  diff = absError22(actual, expected);
  t.ok(diff < eps2, 'inv2(x) * x (diff=' + diff + ')');
  expected = [0, 0];
  actual = D.sum22(D.Log2, D.neg2(D.Log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'neg2(x) + x (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.abs2(D.neg2(D.Pi));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'abs2(x) (diff=' + diff + ')');
  expected = D.Log2;
  actual = D.sqrt2(D.sqr2(D.Log2));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'sqr2 (sqrt2 (x)) (diff=' + diff + ')');
  expected = D.toDouble('23.14069263277926900572908');
  actual = D.exp2(D.Pi);
  diff = absError22(actual, expected);
  t.ok(diff < eps1,'exp2 (diff=' + diff + ')');
  expected = D.Log2;
  actual = D.exp2(D.ln2(D.Log2));
  diff = absError22(actual, expected);
  t.ok(diff < eps2,'exp2( ln2 (x)) (diff=' + diff + ')');
  expected = [1, 0];
  actual = D.sub22(D.sqr2(D.cosh2(D.Log2)), D.sqr2(D.sinh2(D.Log2)));
  diff = absError22(actual, expected);
  t.ok(diff < eps2,'cosh(x)² - sinh(x)² = 1 (diff=' + diff + ')');
  t.end();
});

tape('double-single operations', function (t) {
  expected = D.neg2(D.Log2);
  actual = D.sub21(D.sum21(D.neg2(D.Log2), D.E[0]), D.E[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'additive inverse (diff=' + diff + ')');
  expected = D.E;
  actual = D.div21(D.mul21(D.E, D.Pi[0]), D.Pi[0]);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'multiplicative inverse (diff=' + diff + ')');
  expected = 1e20; expected2 = 1e-20;
  actual = D.toNumber(D.pow21n([10, 0], 20)); actual2 = D.toNumber(D.pow21n([10, 0], -20));
  diff = abs(actual - expected); diff2 = abs(actual2 - expected2);
  t.ok(diff < eps1 && diff2 < eps1,'pow21n (diff=' + diff + ', diff2=' + diff2 + ')');
  t.end();
});

tape('double-double operations', function (t) {
  expected = D.Log2;
  actual = D.sub22(D.sum22(D.Log2, D.E), D.E);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'additive inverse (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.div22(D.mul22(D.Pi, D.Log2), D.Log2);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'multiplicative inverse (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.pow22(D.pow22(D.Pi, D.E), D.inv2(D.E));
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'pow22 (diff=' + diff + ')');
  t.end();
});

tape('golden ratio equation test', function(t) {
  var phi = D.div21(D.sum21(D.sqrt2([5, 0]), 1), 2);
  expected = D.sum21(phi, 1);
  actual = D.mul22(phi, phi);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, 'ϕ² = ϕ + 1 (diff=' + diff + ')');
  expected = D.mul21(D.inv2(phi), 1);
  actual = D.sub21(phi, 1);
  diff = absError22(expected, actual);
  t.ok(diff < eps2, '1/ϕ = ϕ - 1 (diff=' + diff + ')');
  t.end();
});

tape('toExponential', function(t) {
  expected = D.Pi;
  actual = D.toDouble(D.toExponential(D.Pi));
  diff = absError22(expected, actual);
  t.ok(diff < eps1, 'double -> string -> double (diff=' + diff + ')');
  t.end();
});

tape('parseDouble', function (t) {
  expected = 123456789;
  actual = D.toNumber(D.toDouble('123456789Q'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'integer numbers (diff=' + diff + ')');
  expected = -100;
  actual = D.toNumber(D.toDouble(-100));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'negative numbers (diff=' + diff + ')');
  expected = 654321.789;
  actual = D.toNumber(D.toDouble(' 654321.789'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'decimal numbers (diff=' + diff + ')');
  expected = 120;
  actual = D.toNumber(D.toDouble('12e1'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'Exponent format (diff=' + diff + ')');
  expected = 1.2;
  actual = D.toNumber(D.toDouble('12e-1'));
  diff = abs(expected - actual);
  t.ok(diff < eps1, 'Negative exponent (diff=' + diff + ')');
  expected = -0.123;
  actual = D.toNumber(D.toDouble('-.123R'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'short defenition (diff=' + diff + ')');
  expected = 123.12e6;
  actual = D.toNumber(D.toDouble('123.12e6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'scientific format (diff=' + diff + ')');
  expected = 123e12;
  actual = D.toNumber(D.toDouble('123e12.6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'mixed up (diff=' + diff + ')');
  expected = 456.12;
  actual = D.toNumber(D.toDouble('456.12.6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'two dot (diff=' + diff + ')');
  expected = 123e-12;
  actual = D.toNumber(D.toDouble('123e-12e6'));
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'two exp (diff=' + diff + ')');
  expected = 9e300;
  actual = D.toDouble('9e300');
  diff = abs(expected - D.toNumber(actual));
  t.ok(diff < Infinity, 'Large exponent (diff=' + diff + ', actual=[' + actual[0] + ',' + actual[1] + '])');
  expected = 0;
  actual = D.toDouble('9e-322');
  diff = abs(expected - D.toNumber(actual));
  t.ok(diff < eps2, 'Tiny exponent (diff=' + diff + ', actual=[' + actual[0] + ',' + actual[1] + '])');
  actual = D.toNumber(D.toDouble('1e500'));
  actual2 = D.toNumber(D.toDouble('-1e500'));
  t.ok(actual === Infinity && actual2 === -Infinity, 'Giant exponent');
  actual = D.toNumber(D.toDouble('1e-500'));
  actual2 = D.toNumber(D.toDouble('-1e-500'));
  t.ok(actual === 0 && actual2 === 0, 'Insignificant exponent');
  actual = D.toNumber(D.toDouble(0));
  t.ok(actual === 0, 'Zero number');
  actual = D.toNumber(D.toDouble(Infinity));
  actual2 = D.toNumber(D.toDouble(-Infinity));
  t.ok(actual === Infinity && actual2 === -Infinity, 'Infinity number');
  actual = D.toNumber(D.toDouble(NaN));
  actual2 = D.toNumber(D.parseDouble('SDLFK'));
  actual3 = D.toNumber(D.parseDouble('  '));
  t.ok(isNaN(actual) && isNaN(actual2) && isNaN(actual3), 'NaN number');
  actual = D.parseDouble('3.141592653589793238462643383279502884197169399375105820974');
  expected = D.Pi;
  diff = absError22(actual, expected);
  t.ok(diff < eps1, 'parse Pi (diff=' + diff + ')');
  actual = D.parseDouble('2.718281828459045235360287471352662497757247093699959574966');
  expected = D.E;
  diff = absError22(actual, expected);
  t.ok(diff < eps1, 'parse E (diff=' + diff + ')');
  t.end();
});

// tape('extendend tests', function (t) {
//   expected = D.Pi;
//   actual = D.sum21(D.sum21(D.Pi, 1000), -1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'sum21 with inverted (diff=' + diff + ')');
//   expected = D.Pi;
//   actual = D.sub21(D.sub21(D.Pi, 1000), -1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'sub21 with inverted (diff=' + diff + ')');
//   expected = D.Pi;
//   actual = D.mul21(D.mul21(D.Pi, 0.001), 1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'mul21 with inverted (diff=' + diff + ')');
//   actual = D.div21(D.div21(D.Pi, 0.001), 1000);
//   diff = absError22(expected, actual);
//   t.ok(diff < eps2, 'div21 with inverted (diff=' + diff + ')');
//   t.end();
// });