import { test } from "node:test";
import { strict as assert } from "node:assert";
import { fakeLoadEase, LOAD_POINTS } from "./fakeLoadEase.ts";

test("fakeLoadEase: boundary values 0 and 1", () => {
  assert.equal(fakeLoadEase(0), 0);
  assert.equal(fakeLoadEase(1), 1);
});

test("fakeLoadEase: clamps out-of-range inputs", () => {
  assert.equal(fakeLoadEase(-0.5), 0);
  assert.equal(fakeLoadEase(1.5), 1);
  assert.equal(fakeLoadEase(-1000), 0);
  assert.equal(fakeLoadEase(1000), 1);
});

test("fakeLoadEase: midpoint is exactly 0.5 (sstr plateau anchor)", () => {
  assert.equal(fakeLoadEase(0.5), 0.5);
});

test("fakeLoadEase: 70% time yields 79% load (sstr late asymptote)", () => {
  assert.equal(fakeLoadEase(0.7), 0.79);
});

test("fakeLoadEase: plateau near half-time (0.5 → 0.54 moves < 0.01)", () => {
  const delta = fakeLoadEase(0.54) - fakeLoadEase(0.5);
  assert.ok(Math.abs(delta) < 0.01, `plateau drift too large: ${delta}`);
});

test("fakeLoadEase: linear interpolation between table points", () => {
  // Between t=0.2 (v=0.3641) and t=0.22 (v=0.3903) at t=0.21: k=0.5 → 0.3772
  const v = fakeLoadEase(0.21);
  assert.ok(
    Math.abs(v - 0.3772) < 0.0001,
    `expected ~0.3772 at t=0.21, got ${v}`
  );
});

test("fakeLoadEase: hits table anchor points exactly", () => {
  for (const [t, v] of LOAD_POINTS) {
    assert.ok(
      Math.abs(fakeLoadEase(t) - v) < 1e-9,
      `mismatch at t=${t}: expected ${v}, got ${fakeLoadEase(t)}`
    );
  }
});

test("LOAD_POINTS: monotonic non-decreasing", () => {
  for (let i = 0; i < LOAD_POINTS.length - 1; i++) {
    const [t0, v0] = LOAD_POINTS[i];
    const [t1, v1] = LOAD_POINTS[i + 1];
    assert.ok(
      t1 >= t0,
      `time regressed at index ${i}: t[${i + 1}]=${t1} < t[${i}]=${t0}`
    );
    assert.ok(
      v1 >= v0,
      `value regressed at index ${i}: v[${i + 1}]=${v1} < v[${i}]=${v0}`
    );
  }
});

test("LOAD_POINTS: 51 hand-tuned entries covering [0, 1]", () => {
  assert.equal(LOAD_POINTS.length, 51);
  assert.equal(LOAD_POINTS[0][0], 0);
  assert.equal(LOAD_POINTS[0][1], 0);
  assert.equal(LOAD_POINTS[50][0], 1);
  assert.equal(LOAD_POINTS[50][1], 1);
});
