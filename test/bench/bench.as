import { add22, sub22, mul22, div22} from '../wasm/double';

type float = f64;
type int = i32;
let LO: float = 0.;
const splitter: float = 134217729.;

function abs(Xh: float, Xl: float): float {
  return Math.abs(Xh + Xl);
}
@inline
function lt(Xh: float, Xl: float, f: float): boolean {
  return Xh + Xl < f;
}

export function test(Eh: float, El: float, Lh: float, Ll: float): float {
  let result: float = 0.;
  let Rh = sub22(sub22(add22(Eh, El, Lh, Ll), LO, Lh, Ll), LO, Eh, El); let Rl = LO;
  let diff: float = abs(Rh, Rl);
  if (diff > 1e-30) result += 1.;
  Rh = sub22(div22(mul22(Eh, El, Lh, Ll), LO, Lh, Ll), LO, Eh, El); Rl = LO;
  diff = abs(Rh, Rl);
  if (diff > 1e-30) result += 2.;
  return result;
}

export function mandelbrot(maxIteration: int, width: float, height: float,
    TXh: float, TYh: float, DXh: float, DYh: float, i: float, j: float): int {
  let Xh = 0., Xl = 0., Yh = 0., Yl = 0.;
  let XXh = 0., XXl = 0., XYh = 0., XYl = 0., YYh = 0., YYl = 0.;
  let CXh = add22(sub22(TXh, 0., DXh, 0.), LO,
                  div22(mul22(DXh, 0., 2 * i, 0.), LO, width, 0.), LO), CXl = LO;
  let CYh = sub22(add22(TYh, 0., DYh, 0.), LO,
                  div22(mul22(DYh, 0., 2 * j, 0.), LO, height, 0.), LO), CYl = LO;
  let iteration: int = 0;
  while (iteration++ < maxIteration && lt(add22(XXh, XXl, YYh, YYl), LO, 4.)) {
    Xh = add22(sub22(XXh, XXl, YYh, YYl), LO, CXh, CXl); Xl = LO;
    Yh = add22(add22(XYh, XYl, XYh, XYl), LO, CYh, CYl); Yl = LO;
    XXh = mul22(Xh, Xl, Xh, Xl); XXl = LO;
    YYh = mul22(Yh, Yl, Yh, Yl); YYl = LO;
    XYh = mul22(Xh, Xl, Yh, Yl); XYl = LO;
  }
  return iteration;
}