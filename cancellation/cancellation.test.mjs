import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { actionFor, sampleEvents } from "./cancellation.mjs";

test("simulate=cancelled: every sample event is detected and taken down (live)", async () => {
  const events = await sampleEvents("cancelled");
  assert.ok(events.length > 0);
  for (const e of events) {
    assert.equal(e.status, "cancelled");
    assert.deepEqual(actionFor(e), { action: "take-down", why: "cancelled", showBuyButton: false });
  }
});

test("a normal day: nothing is taken down (live)", async () => {
  const events = await sampleEvents(undefined);
  assert.ok(events.length > 0);
  for (const e of events) assert.notEqual(actionFor(e).action, "take-down", e.id);
});

test("postponed, rescheduled and sold out keep the card (live)", async () => {
  for (const s of ["postponed", "rescheduled", "sold_out"]) {
    for (const e of await sampleEvents(s)) {
      assert.equal(e.status, s);
      assert.notEqual(actionFor(e).action, "take-down");
    }
  }
  for (const e of await sampleEvents("sold_out")) assert.equal(actionFor(e).showBuyButton, false);
});

test("node.mjs prints the decision (live)", () => {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("./node.mjs", import.meta.url)), "cancelled"], { encoding: "utf8" });
  assert.match(out, /status: cancelled → TAKE-DOWN/);
});
