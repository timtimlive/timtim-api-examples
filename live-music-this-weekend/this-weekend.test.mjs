import { test } from "node:test";
import assert from "node:assert/strict";
import { liveMusicThisWeekend, thisWeekend } from "./this-weekend.mjs";

test("this weekend is Friday to Sunday, or what is left of it", () => {
  assert.deepEqual(thisWeekend(new Date("2026-10-07T12:00:00Z")), { from: "2026-10-09", to: "2026-10-11" }); // Wednesday
  assert.deepEqual(thisWeekend(new Date("2026-10-09T12:00:00Z")), { from: "2026-10-09", to: "2026-10-11" }); // Friday
  assert.deepEqual(thisWeekend(new Date("2026-10-10T12:00:00Z")), { from: "2026-10-10", to: "2026-10-11" }); // Saturday
  assert.deepEqual(thisWeekend(new Date("2026-10-11T12:00:00Z")), { from: "2026-10-11", to: "2026-10-11" }); // Sunday
});

test("only music, only inside the weekend (live, no key)", async () => {
  const { from, to, mode, events } = await liveMusicThisWeekend({});
  assert.equal(mode, "test");
  for (const e of events) {
    assert.equal(e.category, "music");
    assert.ok(e.date >= from && e.date <= to, `${e.name} on ${e.date} is outside ${from}…${to}`);
  }
});
