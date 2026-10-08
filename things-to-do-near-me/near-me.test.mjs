import { test } from "node:test";
import assert from "node:assert/strict";
import { thingsToDoNearMe } from "./near-me.mjs";

test("groups sample events near Paris by type (live, no key)", async () => {
  const { mode, byType, elsewhere } = await thingsToDoNearMe({ lat: 48.8566, lng: 2.3522 });
  assert.equal(mode, "test");
  const all = Object.values(byType).flat();
  assert.ok(all.length > 0, "expected sample events near Paris");
  for (const [type, events] of Object.entries(byType)) for (const e of events) assert.equal(e.category ?? "other", type);
  assert.deepEqual(elsewhere, []);
});

test("nothing nearby → the cities that do have events (live, no key)", async () => {
  const { byType, elsewhere } = await thingsToDoNearMe({ lat: -54.8, lng: -68.3, radiusKm: 5 });
  assert.deepEqual(byType, {});
  assert.ok(elsewhere.length > 0 && elsewhere.every((c) => c.events > 0), "suggests cities with events");
});
