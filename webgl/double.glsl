// MIT License. © 2021 munrocket

float add(float a, float b) { return (b != 0.) ? a + b : a; }
float sub(float a, float b) { return (b != 0.) ? a - b : a; }
float mul(float a, float b) { return (b != 1.) ? a * b : a; }
float div(float a, float b) { return (b != 1.) ? a / b : a; }
float fma(float a, float b, float c) { return a * b + c; }

vec2 fastTwoSum(float a, float b) {
  float s = add(a, b);
  return vec2(s, sub(b, sub(s, a)));
}

vec2 twoProd(float a, float b) {
  float ab = mul(a, b);
  return vec2(ab, fma(a, b, -ab));
}

vec2 add22(vec2 X, vec2 Y) {
  float s = add(X[0], Y[0]);
  float c = sub(s, X[0]);
  float e = add(add(add(sub(Y[0], c), sub(X[0], sub(s, c))), X[1]), Y[1]);
  return fastTwoSum(s, e);
}

vec2 sub22(vec2 X, vec2 Y) {
  return add22(X, -Y);
}

vec2 mul22(vec2 X, vec2 Y) {
  vec2 S = twoProd(X[0], Y[0]);
  float c = fma(X[1], Y[0], mul(X[0], Y[1]));
  return fastTwoSum(S[0], add(S[1], c));
}

vec2 div22(vec2 X, vec2 Y) {
  float s = X[0] / Y[0];
  vec2 T = twoProd(s, Y[0]);
  float e = ((((X[0] - T[0]) - T[1]) + X[1]) - s * Y[1]) / Y[0];
  return fastTwoSum(s, e);
}