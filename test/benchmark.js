
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
  colorizer(bufer, iteration - 1, xx + yy)
}
function withDoubleJs(bufer, target, i, j) {
  let iteration = 0, x = [0, 0], y = [0, 0], xx = [0, 0], xy = [0, 0], yy = [0, 0];
  let tx = [target.x, 0], ty = [target.y, 0], tdx = [target.dx, 0], tdy = [target.dy,0];
  let cx = D.sum22(D.sub22(tx, tdx), D.div21(D.mul21(tdx, 2 * i), bufer.width));
  let cy = D.sub22(D.sum22(ty, tdy), D.div21(D.mul21(tdy, 2 * j), bufer.height));
  while (iteration++ < maxIteration && D.lt21(D.sum22(xx, yy), 4)) {
    x = D.sum22(D.sub22(xx, yy), cx); y = D.sum22(D.mul21pow2(xy, 2), cy);
    xx = D.sqr2(x); yy = D.sqr2(y); xy = D.mul22(x, y);
  }
  colorizer(bufer, iteration - 1, D.toNumber(D.sum22(xx, yy)));
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
  colorizer(bufer, iteration - 1, xx.add(yy).toNumber());
}
function withBigJs(bufer, target, i, j) {
  let iteration = 0, x = new Big(0), y = new Big(0), xx = new Big(0), xy = new Big(0), yy = new Big(0);
  let tx = new Big(target.x), ty = new Big(target.y), tdx = new Big(target.dx), tdy = new Big(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(bufer.width));
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(bufer.height));
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx); y = xy.add(xy).add(cy);
    xx = x.mul(x); yy = y.mul(y); xy = x.mul(y);
  }
  colorizer(bufer, iteration - 1, xx.add(yy).toString()); 
}

/* mandelbrot drawing */

function colorizer(bufer, iteration, rr) {
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
  Big.DP = 31; Decimal.set({precision: 31, rounding: 4});
  maxIteration = 1000; var target = { x: -1.7490863748149414, y: -1e-25, dx: 3e-16, dy: 2e-16};
  var start, end, calculators = [withFloat, withDoubleJs, withDecimalJs];//, withBigJs]
  calculators.forEach(function(calculator) {
    start = new Date(); draw(calculator, target); end = new Date();
    calculator.benchmark = end - start;
  });
  var barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
    type: 'horizontalBar',
    data: { labels: calculators.map(x => x.name.slice(4)), datasets: [{borderWidth: 1, data: calculators.map(x => x.benchmark)}]},
    options: { responsive: false, legend: false, title: { display: true, text: 'Mandelbrot benchmark' } }
  });
  setTimeout(function() {
    target.dy *= 10; target.dx *= 10;
    drawSplitTest(withDoubleJs, withFloat, target);
  }, 100);
}