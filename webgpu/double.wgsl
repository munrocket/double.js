// MIT License. © 2021 munrocket

fn add(a: f32, b: f32) -> f32 { return select(a, a + b, b != 0.); }
fn sub(a: f32, b: f32) -> f32 { return select(a, a - b, b != 0.); }
fn mul(a: f32, b: f32) -> f32 { return select(a, a * b, b != 1.); }
fn div(a: f32, b: f32) -> f32 { return select(a, a / b, b != 1.); }

fn fastTwoSum(a: f32, b: f32) -> vec2<f32> {
  let s = add(a, b);
  return vec2<f32>(s, sub(b, sub(s, a)));
}

fn twoSum(a: f32, b: f32) -> vec2<f32> {
  let s = add(a, b);
  let a1  = sub(s, b);
  return vec2<f32>(s, add(sub(a, a1), sub(b, sub(s, a1))));
}

fn twoProd(a: f32, b: f32) -> vec2<f32> {
  let ab = mul(a, b);
  return vec2<f32>(ab, fma(a, b, -ab));
}

fn add22(X: vec2<f32>, Y: vec2<f32>) -> vec2<f32> {
  let S = twoSum(X[0], Y[0]);
  let E = twoSum(X[1], Y[1]);
  let v = fastTwoSum(S[0], add(S[1], E[0]));
  return fastTwoSum(v[0], add(v[1], E[1]));
}

fn sub22(X: vec2<f32>, Y: vec2<f32>) -> vec2<f32> {
  return add22(X, -Y);
}

fn mul22(X: vec2<f32>, Y: vec2<f32>) -> vec2<f32> {
  let S = twoProd(X[0], Y[0]);
  let c = fma(X[1], Y[0], mul(X[0], Y[1]));
  return fastTwoSum(S[0], add(S[1], c));
}

fn div22(X: vec2<f32>, Y: vec2<f32>) -> vec2<f32> {
  let s = X[0] / Y[0];
  let T = twoProd(s, Y[0]);
  let e = ((((X[0] - T[0]) - T[1]) + X[1]) - s * Y[1]) / Y[0];
  return fastTwoSum(s, e);
}
