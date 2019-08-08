var maxIteration, pixelId;

/* different calculators */

function withFloat(bufer, target, i, j) {
  var iteration = 0, x = 0, y = 0, xx = 0, xy = 0, yy = 0;
  var cx = target.x - target.dx + 2 * target.dx * i / bufer.width;
  var cy = target.y + target.dy - 2 * target.dy * j / bufer.height;
  while (iteration++ < maxIteration && xx + yy < 4) {
    x = xx - yy + cx; y = xy + xy + cy;
    xx = x * x; yy = y * y; xy = x * y;
  }
  colorizer(bufer, iteration - 1)
}
function withDoubleJs(bufer, target, i, j) {
  let D = Double;
  let iteration = 0, x = D.Zero, y = D.Zero, xx = D.Zero, xy = D.Zero, yy = D.Zero;
  let tx = new D(target.x), ty = new D(target.y), tdx = new D(target.dx), tdy = new D(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(bufer.width));
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(bufer.height));
  while (iteration++ < maxIteration && xx.add(yy).lt(4)) {
    x = xx.sub(yy).add(cx); y = xy.add(xy).add(cy);
    xx = x.mul(x); yy = y.mul(y); xy = x.mul(y);
  }
  colorizer(bufer, iteration - 1);
}
function withDoubleJs_Static(bufer, target, i, j) {
  let D = Double;
  let iteration = 0, x = D.Zero, y = D.Zero, xx = D.Zero, xy = D.Zero, yy = D.Zero;
  let tx = new D(target.x), ty = new D(target.y), tdx = new D(target.dx), tdy = new D(target.dy);
  let cx = D.add22(D.sub22(tx, tdx), D.div21(D.mul21(tdx, 2 * i), bufer.width));
  let cy = D.sub22(D.add22(ty, tdy), D.div21(D.mul21(tdy, 2 * j), bufer.height));
  while (iteration++ < maxIteration && D.lt21(D.add22(D.clone(xx), yy), 4)) {
    x = D.add22(D.sub22(xx, yy), cx); y = D.add22(D.add22(xy, xy), cy);
    xx = D.sqr2(D.clone(x)); yy = D.sqr2(D.clone(y)); xy = D.mul22(x, y);
  }
  colorizer(bufer, iteration - 1);
}
function withDecimalJs(bufer, target, i, j) {
  let iteration = 0, x = new Decimal(0), y = new Decimal(0), xx = new Decimal(0), xy = new Decimal(0), yy = new Decimal(0);
  let tx = new Decimal(target.x), ty = new Decimal(target.y), tdx = new Decimal(target.dx), tdy = new Decimal(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(bufer.width));
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(bufer.height));
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx); y = xy.add(xy).add(cy);
    xx = x.mul(x); yy = y.mul(y); xy = x.mul(y);
  }
  colorizer(bufer, iteration - 1);
}
function withBigNumberJs(bufer, target, i, j) {
  let iteration = 0, x = new BigNumber(0), y = new BigNumber(0), xx = new BigNumber(0), xy = new BigNumber(0), yy = new BigNumber(0);
  let tx = new BigNumber(target.x), ty = new BigNumber(target.y), tdx = new BigNumber(target.dx), tdy = new BigNumber(target.dy);
  let cx = tx.minus(tdx).plus(tdx.times(2 * i).div(bufer.width)).dp(31);
  let cy = ty.plus(tdy).minus(tdy.times(2 * j).div(bufer.height)).dp(31);
  while (iteration++ < maxIteration && xx.plus(yy).toString() < 4) {
    x = xx.minus(yy).plus(cx); y = xy.plus(xy).plus(cy);
    xx = x.times(x).dp(31); yy = y.times(y).dp(31); xy = x.times(y).dp(31);
  }
  colorizer(bufer, iteration - 1); 
}
function withBigJs(bufer, target, i, j) {
  let iteration = 0, x = new Big(0), y = new Big(0), xx = new Big(0), xy = new Big(0), yy = new Big(0);
  let tx = new Big(target.x), ty = new Big(target.y), tdx = new Big(target.dx), tdy = new Big(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(bufer.width)).round(31);
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(bufer.height)).round(31);
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx); y = xy.add(xy).add(cy);
    xx = x.mul(x).round(31); yy = y.mul(y).round(31); xy = x.mul(y).round(31);
  }
  colorizer(bufer, iteration - 1); 
}
function withBigFloat32(bufer, target, i, j) {
  let BF = bigfloat.BigFloat32;
  let iteration = 0, x = new BF(0), y = new BF(0), xx = new BF(0), xy = new BF(0), yy = new BF(0);
  let tx = new BF(target.x), ty = new BF(target.y), tdx = new BF(target.dx), tdy = new BF(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).mul(1/bufer.width)).round(31);
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).mul(1/bufer.height)).round(31);
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx); y = xy.add(xy).add(cy);
    xx = x.mul(x).round(31); yy = y.mul(y).round(31); xy = x.mul(y).round(31);
  }
  colorizer(bufer, iteration - 1);
}
function withBigFloat53(bufer, target, i, j) {
  let Big = bigfloat.BigFloat53;
  let iteration = 0, x = new Big(0), y = new Big(0), xx = new Big(0), xy = new Big(0), yy = new Big(0);
  let tx = new Big(target.x), ty = new Big(target.y), tdx = new Big(target.dx), tdy = new Big(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).mul(1/bufer.width)).round(31);
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).mul(1/bufer.height)).round(31);
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx); y = xy.add(xy).add(cy);
    xx = x.mul(x).round(31); yy = y.mul(y).round(31); xy = x.mul(y).round(31);
  }
  colorizer(bufer, iteration - 1);
}

/* mandelbrot drawing */

function colorizer(bufer, iteration) {
  color = (iteration == maxIteration) ? 0 : 256 * (maxIteration - (iteration * 25) % maxIteration) / maxIteration;
  bufer.data[pixelId++] = color; bufer.data[pixelId++] = color;
  bufer.data[pixelId++] = color; bufer.data[pixelId++] = 255;
}
function mandelbrot(calculator, bufer, target) {
  for (var j = 0; j < bufer.height; j++) {
    for (var i = 0; i < bufer.width; i++) {
      calculator(bufer, target, i, j);
    }
  }
}
function mandelbrotSplitTest(bufer, target, calculator1, calculator2) {
  for (var j = 0; j < bufer.height; j++) {
    for (var i = 0; i < bufer.width; i++) {
      if (i / bufer.width > j / bufer.height) calculator1(bufer, target, i, j);
      else calculator2(bufer, target, i, j);
    }
  }
}
function draw(calculator, target) {
  var canvas = document.getElementById(calculator.name);
  var bufer = canvas.getContext('2d').createImageData(canvas.width, canvas.height);
  pixelId = 0; mandelbrot(calculator, bufer, target);
  canvas.getContext('2d').putImageData(bufer, 0, 0);
}
function drawSplitTest(calc1, calc2, target) {
  var canvas = document.getElementById("splitTest");
  var ctx = canvas.getContext('2d');
  var bufer = ctx.createImageData(canvas.width, canvas.height);
  pixelId = 0; mandelbrotSplitTest(bufer, target, calc1, calc2);
  ctx.putImageData(bufer, 0, 0);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(bufer.width,bufer.height);
  ctx.stroke();
  ctx.font = 'bold 14px Verdana';
  ctx.fillStyle = '#FFF';
  ctx.fillText(calc1.name.slice(4), canvas.width - 85, 25);
  ctx.fillText(calc2.name.slice(4), 10, canvas.height - 10);
}

/* initialization */

window.onload = function() {
  //set proper precision
  Big.DP = 31; Decimal.set({precision: 31}); BigNumber.set({DECIMAL_PLACES: 31});

  //barChart
  maxIteration = 8000; var target = { x: -1.7490863748149414, y: -1e-25, dx: 3e-15, dy: 2e-15};
  var start, end, calculators = [withFloat, withDoubleJs_Static, withDoubleJs, withBigNumberJs, withDecimalJs, withBigJs, withBigFloat32 ]; //withBigFloat53
  for (var i = 0; i < 3; i++) {
    calculators.forEach(function(calculator) {
      start = new Date(); draw(calculator, target); end = new Date();
      calculator.benchmark = end - start;
    })
  }
  document.getElementsByTagName('p')[0].style.display = 'block';
  new Chart(document.getElementById('barChart').getContext('2d'), {
    type: 'horizontalBar',
    data: { labels: calculators.map(x => x.name.slice(4)), datasets: [{borderWidth: 1, data: calculators.map(x => x.benchmark)}]},
    options: { responsive: false, legend: false, title: { display: true, text: 'Mandelbrot benchmark' } }
  });

  //SplitTest
  setTimeout(function() {
    maxIteration = 1000; target.dx = 3e-15; target.dy = 2e-15;
    drawSplitTest(withDoubleJs, withFloat, target);
  }, 100);
}