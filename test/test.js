var tape = require('tape');
var tapSpec = require('tap-spec');
var D = require('../dist/double.cjs.js');
tape.createStream().pipe(tapSpec()).pipe(process.stdout);

var eps1 = 1e-15;
var eps2 = 1e-30;
var abs = Math.abs;
var diff, diff2, expected, expected2, actual, actual2, actual3;

tape('constructor test', function (t) {
  var d = new D(0.3);
  t.ok(d instanceof D, 'constructed from number');
  var d2 = new D('0.3');
  t.ok(d2 instanceof D, 'constructed from string');
  var d3 = new D({ hi: 0.3, lo: 0 });
  t.ok(d3 instanceof D, 'constructed from object');
  var d4 = new D([0.3, 0]);
  t.ok(d4 instanceof D, 'constructed from array');
  var d5 = new D(d);
  t.deepEqual(d3, d, 'fromObject() equal to fromNumber()');
  t.deepEqual(d4, d, 'fromArray() equal to fromNumber()');
  t.deepEqual(d5, d, 'clone() equal to fromString()');
  t.ok(d.toNumber() == 0.3, 'toNumber() equal to number');
  t.end();
});

tape('classic test', function (t) {
  expected = 0.2;
  actual = new D('0.3').sub(new D('0.1')).toNumber();
  diff = Math.abs(expected - actual);
  t.ok(diff < eps2, '0.3-0.1 = 0.2 (diff=' + diff + ')');
  t.end();
});

tape('unary operators with double', function (t) {
  expected = D.One;
  actual = D.Log2.mul(D.Log2.inv());
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'inv2(x) * x (diff=' + diff + ')');
  expected = D.Zero;
  actual = D.Log2.add(D.Log2.neg());
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'neg2(x) + x (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.Pi.neg().abs();
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'abs2(x) (diff=' + diff + ')');
  expected = D.Log2;
  actual = D.Log2.sqr().sqrt();
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'sqr2 (sqrt2 (x)) (diff=' + diff + ')');
  expected = D.Log2;
  actual = D.Log2.ln().exp();
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2,'exp2( ln2 (x)) (diff=' + diff + ')');
  expected = D.One;
  actual = D.Log2.cosh().sqr().sub(D.Log2.sinh().sqr());
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2,'cosh(x)² - sinh(x)² = 1 (diff=' + diff + ')');
  t.end();
});

tape('double-single operations', function (t) {
  expected = D.Log2;
  actual = D.Log2.add(D.E.hi).sub(D.E.hi);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'additive inverse (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.Pi.add(1000).add(-1000);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'add21 with inverted (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.Pi.sub(1000).sub(-1000);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'sub21 with inverted (diff=' + diff + ')');
  expected = D.E;
  actual = D.E.mul(D.Pi.hi).div(D.Pi.hi);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'multiplicative inverse (diff=' + diff + ')');
  expected = 1e20; expected2 = 1e-20;
  actual = D.pow21n(new D([10, 0]), 20).toNumber(); actual2 = D.pow21n(new D([10, 0]), -20).toNumber();
  diff = abs(actual - expected); diff2 = abs(actual2 - expected2);
  t.ok(diff < eps1 && diff2 < eps1,'pow21n (diff=' + diff + ', diff2=' + diff2 + ')');
  t.end();
});

tape('double-double operations', function (t) {
  expected = D.Log2;
  actual = D.Log2.add(D.E).sub(D.E);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'additive inverse (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.Pi.mul(D.Log2).div(D.Log2);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'multiplicative inverse (diff=' + diff + ')');
  expected = D.Pi;
  actual = D.Pi.pow(D.E).pow(D.inv2(D.E));
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'pow22 (diff=' + diff + ')');
  t.end();
});

tape('golden ratio equation test', function(t) {
  var phi = new D([5, 0]).sqrt().add(1).div(2);
  expected = new D(phi).add(1);
  actual = new D(phi).sqr();
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, 'ϕ² = ϕ + 1 (diff=' + diff + ')');
  expected = new D(phi).inv();
  actual = phi.sub(1);
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps2, '1/ϕ = ϕ - 1 (diff=' + diff + ')');
  t.end();
});

tape('toExponential', function(t) {
  expected = D.Pi;
  actual = new D(D.Pi.toExponential());
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps1, 'double -> string -> double (diff=' + diff + ')');
  t.end();
});

tape('fromNumber', function (t) {
  expected = 123456789;
  actual = new D('123456789Q').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'integer numbers (diff=' + diff + ')');
  expected = -100;
  actual = new D(-100).toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'negative numbers (diff=' + diff + ')');
  expected = 654321.789;
  actual = new D(' 654321.789').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'decimal numbers (diff=' + diff + ')');
  expected = 120;
  actual = new D('12e1').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'Exponent format (diff=' + diff + ')');
  expected = 1.2;
  actual = new D('12e-1').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps1, 'Negative exponent (diff=' + diff + ')');
  expected = -0.123;
  actual = new D('-.123R').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'short defenition (diff=' + diff + ')');
  expected = 123.12e6;
  actual = new D('123.12e6').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'scientific format (diff=' + diff + ')');
  expected = 123e12;
  actual = new D('123e12.6').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'mixed up (diff=' + diff + ')');
  expected = 456.12;
  actual = new D('456.12.6').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'two dot (diff=' + diff + ')');
  expected = 123e-12;
  actual = new D('123e-12e6').toNumber();
  diff = abs(expected - actual);
  t.ok(diff < eps2, 'two exp (diff=' + diff + ')');
  expected = 9e300;
  actual = new D('9e300');
  diff = abs(expected - actual.toNumber());
  t.ok(diff < Infinity, 'Large exponent (diff=' + diff + ', actual=[' + actual.hi + ',' + actual.lo + '])');
  expected = 0;
  actual = new D('9e-322');
  diff = abs(expected - actual.toNumber());
  t.ok(diff < eps2, 'Tiny exponent (diff=' + diff + ', actual=[' + actual.hi + ',' + actual.lo + '])');
  actual = new D('1e500').toNumber();
  actual2 = new D('-1e500').toNumber();
  t.ok(actual === Infinity && actual2 === -Infinity, 'Giant exponent');
  actual = new D('1e-500').toNumber();
  actual2 = new D('-1e-500').toNumber();
  t.ok(actual === 0 && actual2 === 0, 'Insignificant exponent');
  actual = D.Zero.toNumber();
  t.ok(actual === 0, 'Zero number');
  actual = new D(Infinity).toNumber();
  actual2 = new D('-Infinity').toNumber();
  t.ok(actual === Infinity && actual2 === -Infinity, 'Infinity number');
  actual = D.NaN.toNumber();
  actual2 = new D('SDLFK').toNumber();
  actual3 = new D('  ').toNumber();
  t.ok(isNaN(actual) && isNaN(actual2) && isNaN(actual3), 'NaN number');
  actual = new D('3.141592653589793238462643383279502884197169399375105820974');
  expected = D.Pi;
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps1, 'parse Pi (diff=' + diff + ')');
  actual = new D('2.718281828459045235360287471352662497757247093699959574966');
  expected = D.E;
  diff = expected.sub(actual).abs().toNumber();
  t.ok(diff < eps1, 'parse E (diff=' + diff + ')');
  t.end();
});

tape('comparisons', function(t) {
  t.ok(D.Pi.eq(D.Pi.mul(D.One)) && D.Pi.ne(D.Log2) && D.Zero.eq(0) && D.One.ne(2), 'eq, ne (true)');
  t.ok(!D.Pi.eq(D.Log2) && !D.Pi.ne(D.Pi) && !D.Zero.eq(D.Log2) && !D.One.ne(1), 'eq, ne (false)');
  t.ok(D.Pi.lt(D.X2Pi) && D.Pi.le(D.X2Pi) && D.Pi.lt(4) && D.Pi.le(4), 'lt, le (true)');
  t.ok(!D.Pi.lt(D.Pi) && !D.Pi.le(D.One) && !D.One.lt(1) && !D.Pi.le(1), 'lt, le (false)');
  t.ok(D.X2Pi.gt(D.Pi) && D.X2Pi.ge(D.Pi) && D.Pi.gt(2) && D.Pi.ge(2), 'gt, ge (true)');
  t.ok(!D.One.gt(D.One) && !D.Pi.ge(4) && !D.Zero.gt(0) && !D.Pi.ge(4), 'gt, ge (false)');
  t.end();
});

// tape('extendend tests', function (t) {
//   expected = D.Pi;
//   actual = D.mul21(D.mul21(D.Pi, 0.1), 10);
//   diff = expected.sub(actual).abs().toNumber();
//   t.ok(diff < eps2, 'mul21 with inverted (diff=' + diff + ')');
//   actual = D.div22(D.div22(D.Pi, new D('10')), new D('0.1'));
//   diff = expected.sub(actual).abs().toNumber();
//   t.ok(diff < eps2, 'div21 with inverted (diff=' + diff + ')');
//   t.end();
// });