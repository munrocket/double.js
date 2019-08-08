var tape = require('tape');
var tapSpec = require('tap-spec');

tape.createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

/* This tests based on "The pitfalls of verifying floating-point computations" by David Monniaux  */
/* [PDF] https://hal.archives-ouvertes.fr/hal-00128124/file/floating-point-article.pdf            */

tape('Simplified floating point paranoia in javascript', function (t) {
  expected = Infinity;
  actual = (1e308 + 1e308) / 1e308;
  t.ok(actual == expected, 'Infinity');
  actual = 0/0;
  t.ok(isNaN(actual), 'NaN');
  expected = 1.0000000000000002;
  actual = 1 / (1 - Math.pow(2,-53))
  t.ok(actual == expected, 'double rounding 1');
  expected = Infinity;
  actual = 1e1023 * (2 - Math.pow(2, -52))
  t.ok(actual == expected, 'double rounding 2');
  expected = 9007199254740994;
  actual = 1 - 1/65536 + 9007199254740994;
  t.ok(actual == expected, 'SSE2 rounding 1');
  expected = 1.1125369292536007e-308;
  actual = 1.5 * 2.2250738585072014e-308 - 2.2250738585072014e-308;
  t.ok(actual == expected, 'SSE2 rounding 2');
  t.end();
});