// MIT License. © 2020 munrocket

float add(float a, float b) { return (b != 0.) ? a + b : a; }
float sub(float a, float b) { return (b != 0.) ? a - b : a; }
float mul(float a, float b) { return (a != 0.) ? a * b : 0.; }
float div(float a, float b) { return (a != 0.) ? a / b : 0.; }
float fma(float a, float b, float c) { return a * b + c; }

vec2 fastTwoSum(float a, float b) {
  float s = add(a, b);
  return vec2(s, sub(b, sub(s, a)));
}

vec2 twoSum(float a, float b) {
  float s = add(a, b);
  float a1  = sub(s, b);
  return vec2(s, add(sub(a, a1), sub(b, sub(s, a1))));
}

vec2 twoProd(float a, float b) {
  float ab = mul(a, b);
  return vec2(ab, fma(a, b, -ab));
}

vec2 add22(vec2 X, vec2 Y) {
  vec2 S = twoSum(X[0], Y[0]);
  vec2 E = twoSum(X[1], Y[1]);
  float c = add(S[1], E[0]);
  float v  = add(S[0], c);
  c = add(sub(c, sub(v, S[0])), E[1]);
  return fastTwoSum(v, c);
}

vec2 sub22(vec2 X, vec2 Y) {
  return add22(X, -Y);
}

vec2 mul22(vec2 X, vec2 Y) {
  vec2 S = twoProd(X[0], Y[0]);
  S[1] += add(mul(X[0], Y[1]), mul(X[1], Y[0]));
  return fastTwoSum(S[0], S[1]);
}