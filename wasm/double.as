// MIT License. © 2020 munrocket

type float = f64;
type int = i32;
let LO: float = 0.;
const splitter: float = 134217729.;

@inline
function twoSum(a: float, b: float): float {
  let s = a + b;
  let a1  = s - b;
  LO = (a - a1) + (b - (s - a1));
  return s;
}

@inline
function twoProd(a: float, b: float): float {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = splitter * b;
  let bh = t + (b - t), bl = b - bh;
  t = a * b;
  LO = (((ah * bh - t) + ah * bl) + al * bh) + al * bl;
  return t;
}

@inline
function oneSqr(a: float): float {
  let t = splitter * a;
  let ah = t + (a - t), al = a - ah;
  t = a * a;
  let hl = al * ah;
  LO = ((ah * ah - t) + hl + hl) + al * al;
  return t;
}

function add22(Xh: float, Xl: float, Yh: float, Yl: float): float {
  let Sh = twoSum(Xh, Yh);
  let Sl = LO;
  let Eh = twoSum(Xl, Yl);
  let El = LO;
  Yh = Sl + Eh;
  Sl  = Sh + Yh;
  Yl = Yh - (Sl - Sh);
  Yh = Yl + El;
  Xh = Sl + Yh;
  LO = Yh - (Xh - Sl);
  return Xh;
}

function sub22(Xh: float, Xl: float, Yh: float, Yl: float): float {
  let Sh = twoSum(Xh, -Yh);
  let Sl = LO;
  let Eh = twoSum(Xl, -Yl);
  let El = LO;
  Yh = Sl + Eh;
  Sl  = Sh + Yh;
  Yl = Yh - (Sl - Sh);
  Yh = Yl + El;
  Xh = Sl + Yh;
  LO = Yh - (Xh - Sl);
  return Xh;
}

function mul22(Xh: float, Xl: float, Yh: float, Yl: float): float {
  let Sh = twoProd(Xh, Yh);
  let Sl = LO;
  Sl = (Sl + Xh * Yl) + Xl * Yh;
  Xh = Sh + Sl;
  LO = Sl - (Xh - Sh);
  return Xh;
}

function div22(Xh: float, Xl: float, Yh: float, Yl: float): float {
  let s = Xh / Yh;
  let Th = twoProd(s, Yh);
  let Tl = LO;
  let e = ((((Xh - Th) - Tl) + Xl) - s * Yl) / Yh;
  Xh = s + e;
  LO = e - (Xh - s);
  return Xh;
}


function sqr2(Xh: float, Xl: float): float {
  let Sh = oneSqr(Xh);
  let Sl = LO;
  let c = Xh * Xl;
  Sl += c + c;
  Xh = Sh + Sl;
  LO = Sl - (Xh - Sh);
  return Xh;
}

export { add22, sub22, mul22, div22, sqr2 }