const splitter = 134217729;

@inline
function twoSum(a: number, b: number): Double {
  let s = a + b;
  let a1  = s - b;
  return new Double(s, (a - a1) + (b - (s - a1)));
}
@inline
function twoProd(a: number, b: number): Double {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = splitter * b;
  let bh = t + (b - t), bl = b - bh;
  t = a * b;
  return new Double(t, ((ah * bh - t) + ah * bl + al * bh) + al * bl);
}
@inline
function oneSqr(a: number): Double {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = a * a;
  let hl = al * ah;
  return new Double(t, ((ah * ah - t) + hl + hl) + al * al);
}

class Double {
  constructor(
    public hi: number,
    public lo: number
  ) { }

  static clone(X: Double): Double { return new Double(X.hi, X.lo); }

  toNumber(): number {
    return this.hi + this.lo;
  }

  abs(): number {
    return Math.abs(this.hi + this.lo);
  }

  lt(f: number): boolean {
    return this.hi + this.lo < f;
  }

  add(other: Double): Double {
    return Double.add22(Double.clone(this), other);
  }
  sub(other: Double): Double {
    return Double.sub22(Double.clone(this), other);
  }
  mul(other: Double): Double {
    return Double.mul22(Double.clone(this), other);
  }
  div(other: Double): Double {
    return Double.div22(Double.clone(this), other);
  }
  sqr(): Double {
    return Double.sqr2(Double.clone(this));
  }

  static add22(X: Double, Y: Double): Double {
    let S = twoSum(X.hi, Y.hi);
    let E = twoSum(X.lo, Y.lo);
    let c = S.lo + E.hi;
    let vh  = S.hi + c, vl = c - (vh - S.hi);
    c = vl + E.lo;
    X.hi = vh + c;
    X.lo = c - (X.hi - vh);
    return X;
  }
  
  static sub22(X: Double, Y: Double): Double {
    let S = twoSum(X.hi, -Y.hi);
    let E = twoSum(X.lo, -Y.lo);
    let c = S.lo + E.hi;
    let vh  = S.hi + c, vl = S.hi - vh + c;
    let w = vl + E.lo;
    X.hi = vh + w;
    X.lo = w - (X.hi - vh);
    return X;
  }
  
  static mul22(X: Double, Y: Double): Double {
    let S = twoProd(X.hi, Y.hi);
    S.lo += X.hi * Y.lo + X.lo * Y.hi;
    X.hi = S.hi + S.lo;
    X.lo = S.lo - (X.hi - S.hi);
    return X;
  }
  
  static div22(X: Double, Y: Double): Double {
    let s = X.hi / Y.hi;
    let T = twoProd(s, Y.hi);
    let e = (X.hi - T.hi - T.lo + X.lo - s * Y.lo) / Y.hi;
    X.hi = s + e;
    X.lo = e - (X.hi - s);
    return X;
  }
  
  static sqr2(X: Double): Double {
    let S = oneSqr(X.hi);
    let c = X.hi * X.lo;
    S.lo += c + c;
    X.hi = S.hi + S.lo;
    X.lo = S.lo - (X.hi - S.hi);
    return X;
  }
}

export function test(): number {
  let result: number = 0;
  const log2 = new Double(0.6931471805599453, 2.319046813846299e-17);
  const e = new Double(2.718281828459045, 1.4456468917292502e-16);
  let diff = e.add(log2).sub(log2).sub(e).abs();
  if (diff > 1e-30) result += 1;
  diff = e.mul(log2).div(log2).sub(e).abs();
  if (diff > 1e-30) result += 2;
  return result;
}

export function mandelbrot(maxIteration: number, width: number, height: number,
    tx0: number, ty0: number, tdx0: number, tdy0: number, i: number, j: number): number {
  let x = new Double(0, 0), y = new Double(0, 0);
  let xx = new Double(0, 0), xy = new Double(0, 0), yy = new Double(0, 0);
  let tx = new Double(tx0, 0), ty = new Double(ty0, 0);
  let tdx = new Double(tdx0, 0), tdy = new Double(tdy0, 0);
  let cx = tx.sub(tdx).add(tdx.mul(new Double(2 * i, 0)).div(new Double(width, 0)));
  let cy = ty.add(tdy).sub(tdy.mul(new Double(2 * j, 0)).div(new Double(height, 0)));
  let iteration: number = 0;
  while (iteration++ < maxIteration && xx.add(yy).lt(4)) {
    x = xx.sub(yy).add(cx);
    y = xy.add(xy).add(cy);
    xx = x.sqr();
    yy = y.sqr();
    xy = x.mul(y);
  }
  return iteration;
}