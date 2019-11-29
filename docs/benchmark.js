let maxIteration, pixelId;

/* different calculators */

function withNumber(buffer, target, i, j) {
  let iteration = 0;
  let x = 0, y = 0;
  let xx = 0, xy = 0, yy = 0;
  let cx = target.x - target.dx + 2 * target.dx * i / buffer.width;
  let cy = target.y + target.dy - 2 * target.dy * j / buffer.height;
  while (iteration++ < maxIteration && xx + yy < 4) {
    x = xx - yy + cx;
    y = xy + xy + cy;
    xx = x * x;
    yy = y * y;
    xy = x * y;
  }
  colorizer(buffer, iteration - 1)
}
function withDoubleJs_FirstVer(buffer, target, i, j) {
  let D = D01;
  let iteration = 0;
  let x = D.Zero, y = D.Zero;
  let xx = D.Zero, xy = D.Zero, yy = D.Zero;
  let tx = new D(target.x), ty = new D(target.y);
  let tdx = new D(target.dx), tdy = new D(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(buffer.width));
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(buffer.height));
  while (iteration++ < maxIteration && xx.add(yy).lt(4)) {
    x = xx.sub(yy).add(cx);
    y = xy.add(xy).add(cy);
    xx = x.mul(x);
    yy = y.mul(y);
    xy = x.mul(y);
  }
  colorizer(buffer, iteration - 1);
}
function withDoubleJs_Static(buffer, target, i, j) {
  let D = Double;
  let iteration = 0;
  let x = D.Zero, y = D.Zero;
  let xx = D.Zero, xy = D.Zero, yy = D.Zero;
  let tx = new D(target.x), ty = new D(target.y);
  let tdx = new D(target.dx), tdy = new D(target.dy);
  let cx = D.add22(D.sub22(tx, tdx), D.div21(D.mul21(tdx, 2 * i), buffer.width));
  let cy = D.sub22(D.add22(ty, tdy), D.div21(D.mul21(tdy, 2 * j), buffer.height));
  while (iteration++ < maxIteration && D.lt21(D.add22(D.clone(xx), yy), 4)) {
    x = D.add22(D.sub22(xx, yy), cx);
    y = D.add22(D.add22(xy, xy), cy);
    xx = D.sqr2(D.clone(x));
    yy = D.sqr2(D.clone(y));
    xy = D.mul22(x, y);
  }
  colorizer(buffer, iteration - 1);
}
function withDoubleJs(buffer, target, i, j) {
  let D = Double;
  let iteration = 0;
  let x = D.Zero, y = D.Zero;
  let xx = D.Zero, xy = D.Zero, yy = D.Zero;
  let tx = new D(target.x), ty = new D(target.y);
  let tdx = new D(target.dx), tdy = new D(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(buffer.width));
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(buffer.height));
  while (iteration++ < maxIteration && xx.add(yy).lt(4)) {
    x = xx.sub(yy).add(cx);
    y = xy.add(xy).add(cy);
    xx = x.mul(x);
    yy = y.mul(y);
    xy = x.mul(y);
  }
  colorizer(buffer, iteration - 1);
}
function withDecimalJs(buffer, target, i, j) {
  let iteration = 0;
  let x = new Decimal(0), y = new Decimal(0);
  let xx = new Decimal(0), xy = new Decimal(0), yy = new Decimal(0);
  let tx = new Decimal(target.x), ty = new Decimal(target.y);
  let tdx = new Decimal(target.dx), tdy = new Decimal(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(buffer.width));
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(buffer.height));
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx);
    y = xy.add(xy).add(cy);
    xx = x.mul(x);
    yy = y.mul(y);
    xy = x.mul(y);
  }
  colorizer(buffer, iteration - 1);
}
function withBigNumberJs(buffer, target, i, j) {
  let BN = BigNumber;
  let iteration = 0;
  let x = new BN(0), y = new BN(0);
  let xx = new BN(0), xy = new BN(0), yy = new BN(0);
  let tx = new BN(target.x), ty = new BN(target.y);
  let tdx = new BN(target.dx), tdy = new BN(target.dy);
  let cx = tx.minus(tdx).plus(tdx.times(2 * i).div(buffer.width)).dp(31);
  let cy = ty.plus(tdy).minus(tdy.times(2 * j).div(buffer.height)).dp(31);
  while (iteration++ < maxIteration && xx.plus(yy).toString() < 4) {
    x = xx.minus(yy).plus(cx);
    y = xy.plus(xy).plus(cy);
    xx = x.times(x).dp(31);
    yy = y.times(y).dp(31);
    xy = x.times(y).dp(31);
  }
  colorizer(buffer, iteration - 1); 
}
function withBigJs(buffer, target, i, j) {
  let iteration = 0;
  let x = new Big(0), y = new Big(0);
  let xx = new Big(0), xy = new Big(0), yy = new Big(0);
  let tx = new Big(target.x), ty = new Big(target.y);
  let tdx = new Big(target.dx), tdy = new Big(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).div(buffer.width)).round(31);
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).div(buffer.height)).round(31);
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx);
    y = xy.add(xy).add(cy);
    xx = x.mul(x).round(31);
    yy = y.mul(y).round(31);
    xy = x.mul(y).round(31);
  }
  colorizer(buffer, iteration - 1); 
}
function withBigFloat32(buffer, target, i, j) {
  let BF = bigfloat.BigFloat32;
  let iteration = 0;
  let x = new BF(0), y = new BF(0);
  let xx = new BF(0), xy = new BF(0), yy = new BF(0);
  let tx = new BF(target.x), ty = new BF(target.y);
  let tdx = new BF(target.dx), tdy = new BF(target.dy);
  let cx = tx.sub(tdx).add(tdx.mul(2 * i).mul(1/buffer.width)).round(31);
  let cy = ty.add(tdy).sub(tdy.mul(2 * j).mul(1/buffer.height)).round(31);
  while (iteration++ < maxIteration && xx.add(yy).toString() < 4) {
    x = xx.sub(yy).add(cx);
    y = xy.add(xy).add(cy);
    xx = x.mul(x).round(31);
    yy = y.mul(y).round(31);
    xy = x.mul(y).round(31);
  }
  colorizer(buffer, iteration - 1);
}

/* mandelbrot drawing */

function colorizer(buffer, iteration) {
  color = (iteration == maxIteration) ? 0 : 256 * (maxIteration - (iteration * 25) % maxIteration) / maxIteration;
  buffer.data[pixelId++] = color;
  buffer.data[pixelId++] = color;
  buffer.data[pixelId++] = color;
  buffer.data[pixelId++] = 255;
}
function mandelbrot(calculator, buffer, target) {
  for (let j = 0; j < buffer.height; j++) {
    for (let i = 0; i < buffer.width; i++) {
      calculator(buffer, target, i, j);
    }
  }
}
function mandelbrotSplitTest(buffer, target, calculator1, calculator2) {
  for (let j = 0; j < buffer.height; j++) {
    for (let i = 0; i < buffer.width; i++) {
      if (i / buffer.width > j / buffer.height) {
        calculator1(buffer, target, i, j);
      } else {
        calculator2(buffer, target, i, j);
      }
    }
  }
}
function draw(calculator, target) {
  let canvas = document.getElementById(calculator.name);
  let buffer = canvas.getContext('2d').createImageData(canvas.width, canvas.height);
  pixelId = 0; mandelbrot(calculator, buffer, target);
  canvas.getContext('2d').putImageData(buffer, 0, 0);
}
function drawSplitTest(calc1, calc2, target) {
  let canvas = document.getElementById("splitTest");
  let ctx = canvas.getContext('2d');
  let buffer = ctx.createImageData(canvas.width, canvas.height);
  pixelId = 0; mandelbrotSplitTest(buffer, target, calc1, calc2);
  ctx.putImageData(buffer, 0, 0);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(buffer.width,buffer.height);
  ctx.stroke();
  ctx.font = 'bold 14px Open Sans';
  ctx.fillStyle = '#FFF';
  ctx.fillText(calc1.name.slice(4), canvas.width - 85, 25);
  ctx.fillText(calc2.name.slice(4), 10, canvas.height - 10);
}

/* initialization */

window.onload = function() {
  //set proper precision
  Big.DP = 31;
  Decimal.set({ precision: 31 });
  BigNumber.set({ DECIMAL_PLACES: 31 });

  //SplitTest
  let target = { x: -1.7490863748149414, y: -1e-25, dx: 3e-15, dy: 2e-15};
  maxIteration = 1000;
  drawSplitTest(withDoubleJs, withNumber, target);

  let popups = document.getElementsByClassName('bench-popup');

  //benchmark
  let now = () => (typeof performance != 'undefined') ? performance.now() : Date.now();
  target.dx = 3e-16;
  target.dy = 2e-16;
  let calculators = [withDoubleJs_FirstVer, withDoubleJs_Static, withDoubleJs, withBigNumberJs, withDecimalJs, withBigJs, withBigFloat32 ]; //withBigFloat53
  calculators.forEach((calculator) => setTimeout(() => {
    popups[0].style.display = 'block';
    popups[1].style.display = 'block';

    let start = now();
    let end = start;
    let counter = 0;
    while (end < start + 1500) {
      counter++;
      draw(calculator, target);
      end = now();
    };
    calculator.benchmark = counter / (end - start);


    //barChart
    new Chart(document.getElementById('barChart').getContext('2d'), {
      type: 'horizontalBar',
      data: { labels: calculators.map(x => x.name.slice(4)), datasets: [{ borderWidth: 1, data: calculators.map(x => x.benchmark) }]},
      options: { responsive: false, legend: false, title: {
        display: true, text: 'Mandelbrot benchmark (bigger is better)',
        fontFamily: "Sans", fontColor: "#000", fontSize: 16, fontStyle: 'normal' }
      }
    });
  }, 100));
  setTimeout(() => {
    popups[2].style.display = 'block';
    new Chart(document.getElementById('barChart').getContext('2d'), {
      type: 'horizontalBar',
      data: { labels: calculators.map(x => x.name.slice(4)), datasets: [{ borderWidth: 1, data: calculators.map(x => x.benchmark) }]},
      options: { responsive: false, legend: false, title: {
        display: true, text: 'Mandelbrot benchmark (bigger is better)',
        fontFamily: "Sans", fontColor: "#000", fontSize: 16, fontStyle: 'normal' }
      }
    });
  }, 7000);
}
