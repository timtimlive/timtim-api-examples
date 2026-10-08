import { test } from "node:test";
import assert from "node:assert/strict";
import { distanceKm, eventsNearHotel, howFar } from "./near-hotel.mjs";

test("distance and walking words", () => {
  assert.ok(Math.abs(distanceKm(38.9007, -77.0365, 38.9072, -77.0369) - 0.72) < 0.05);
  assert.equal(howFar(0.5), "6 min walk");
  assert.equal(howFar(3.44), "3.44 km away");
  assert.equal(howFar(null), "nearby");
});

test("finds sample events near a Washington hotel, nearest first (live, no key)", async () => {
  const { mode, events } = await eventsNearHotel({ lat: 38.9007, lng: -77.0365, radiusKm: 10 });
  assert.equal(mode, "test");
  assert.ok(events.length > 0, "expected sample events in Washington");
  for (const e of events) assert.ok(e.distance_km === null || e.distance_km <= 10.5, `${e.name} is ${e.distance_km} km away`);
  const known = events.map((e) => e.distance_km).filter((d) => d !== null);
  assert.deepEqual(known, [...known].sort((a, b) => a - b), "nearest first");
});

test("nothing near a point with no events (live, no key)", async () => {
  const { events } = await eventsNearHotel({ lat: -54.8, lng: -68.3, radiusKm: 5 });
  assert.equal(events.length, 0);
});
