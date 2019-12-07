const splitter = 134217729;
type float = f64;
let R = new Float64Array(16); // turing tape with registers
type id = i32;                // index in turing tape

@inline
function twoSum(a: float, b: float, r: id): float {
  let s = a + b;
  let a1  = s - b;
  R[r] = (a - a1) + (b - (s - a1));
  return s;
}

@inline
function twoProd(a: float, b: float, r: id): float {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = splitter * b;
  let bh = t + (b - t), bl = b - bh;
  t = a * b;
  R[r] = ((ah * bh - t) + ah * bl + al * bh) + al * bl;
  return t;
}

@inline
function oneSqr(a: float, r: id): float {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = a * a;
  let hl = al * ah;
  R[r] = ((ah * ah - t) + hl + hl) + al * al;
  return t;
}

function add22(Xhi: float, Xlo: float, Yhi: float, Ylo: float, r: id): float {
  let S = twoSum(Xhi, Yhi, 15);
  let E = twoSum(Xlo, Ylo, 14);
  let c = R[15] + E;
  let vh  = S + c, vl = c - (vh - S);
  c = vl + R[14];
  R[13] = vh + c;
  R[r] = c - (R[13] - vh);
  return R[13];
}

function sub22(Xhi: float, Xlo: float, Yhi: float, Ylo: float, r: id): float {
  let S = twoSum(Xhi, -Yhi, 15);
  let E = twoSum(Xlo, -Ylo, 14);
  let c = R[15] + E;
  let vh  = S + c, vl = c - (vh - S);
  c = vl + R[14];
  R[13] = vh + c;
  R[r] = c - (R[13] - vh);
  return R[13];
}

function mul22(Xhi: float, Xlo: float, Yhi: float, Ylo: float, r: id): float {
  let S = twoProd(Xhi, Yhi, 15);
  R[15] += Xhi * Ylo + Xlo * Yhi;
  R[14] = S + R[15];
  R[r] = R[15] - (R[14] - S);
  return R[14];
}

function div22(Xhi: float, Xlo: float, Yhi: float, Ylo: float, r: id): float {
  let s = Xhi / Yhi;
  let T = twoProd(s, Yhi, 15);
  let e = (Xhi - T - R[15] + Xlo - s * Ylo) / Yhi;
  R[14] = s + e;
  R[r] = e - (R[14] - s);
  return R[14];
}


function sqr2(Xhi: float, Xlo: float, r: id): float {
  let S = oneSqr(Xhi, 15);
  let c = Xhi * Xlo;
  R[15] += c + c;
  R[14] = S + R[15];
  R[r] = R[15] - (R[14] - S);
  return R[14];
}

@inline
function create(Xhi: float, Xlo: float, r: id): float {
  R[r] = Xlo;
  return Xhi;
}
function abs(Xhi: float, Xlo: float): float {
  return Math.abs(Xhi + Xlo);
}
function lt(Xhi: float, Xlo: float, f: float): boolean {
  return Xhi + Xlo < f;
}

export function test(): float {
  let result: float = 0;
  const e = create(2.718281828459045, 1.4456468917292502e-16, 0);
  const log2 = create(0.6931471805599453, 2.319046813846299e-17, 1);
  let R4 = sub22(sub22(add22(e, R[0], log2, R[1], 2), R[2], log2, R[1], 3), R[3], e, R[0], 4);
  let diff: float = abs(R4, R[4]);
  if (diff > 1e-30) result += 1;
  R4 = sub22(div22(mul22(e, R[0], log2, R[1], 2), R[2], log2, R[1], 3), R[3], e, R[0], 4);
  diff = abs(R4, R[4]);
  if (diff > 1e-30) result += 2;
  return result;
}

export function mandelbrot(maxIteration: float, width: float, height: float,
    tx0: float, ty0: float, tdx0: float, tdy0: float, i: float, j: float): float {
  let x = create(0, 0, 1), y = create(0, 0, 2);
  let xx = create(0, 0, 3), xy = create(0, 0, 4), yy = create(0, 0, 5);
  let cx = add22(sub22(tx0, 0, tdx0, 0, 8), R[8], div22(mul22(tdx0, 0, 2 * i, 0, 10), R[10], width, 0, 12), R[12], 6);
  let cy = sub22(add22(ty0, 0, tdy0, 0, 9), R[9], div22(mul22(tdy0, 0, 2 * j, 0, 11), R[11], height, 0, 13), R[13], 7);
  let iteration: float = 0;
  while (iteration++ < maxIteration && lt(add22(create(xx, R[3], 10), R[10], yy, R[5], 10), R[10], 4)) {
    x = add22(sub22(xx, R[3], yy, R[5], 3), R[3], cx, R[6], 1);
    y = add22(add22(xy, R[4], xy, R[4], 4), R[4], cy, R[7], 2);
    xx = sqr2(create(x, R[1], 8), R[8], 3);
    yy = sqr2(create(y, R[2], 9), R[8], 5);
    xy = mul22(x, R[1], y, R[2], 4);
  }
  return iteration;
}