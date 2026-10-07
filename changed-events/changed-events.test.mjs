import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { applyChanges, pollOnce } from "./sync.mjs";

const key = process.env.TIMTIM_TEST_KEY;

test("applyChanges stores changed events and removes withdrawn ones (real events + an illustrative withdrawal)", async () => {
  const res = await fetch("https://api.timtim.live/v1/demo/events?city=Washington");
  const page = await res.json();
  assert.ok(page.events.length >= 2);
  const store = new Map();
  assert.deepEqual(applyChanges(store, page), { updated: page.events.length, removed: 0 });

  const goneId = page.events[0].id;
  const cancelled = { ...page.events[1], status: "cancelled" };
  const next = { object: "list", mode: "live", events: [cancelled], next: null, withdrawn: [{ id: goneId, withdrawn_at: "2026-10-06T14:00:00.000Z" }] };
  assert.deepEqual(applyChanges(store, next), { updated: 1, removed: 1 });
  assert.equal(store.has(goneId), false);
  assert.equal(store.get(cancelled.id).status, "cancelled");
});

test("pollOnce against /events?changed_since (needs TIMTIM_TEST_KEY)", async (t) => {
  if (!key) return t.skip("TIMTIM_TEST_KEY is not set — changed_since needs a key");
  const store = new Map();
  const { next, pages } = await pollOnce({ key, since: new Date(Date.now() - 7 * 86400e3).toISOString(), store });
  assert.ok(pages >= 1);
  assert.ok(!Number.isNaN(Date.parse(next)));
});

test("node.mjs skips cleanly without a key", (t) => {
  if (key) return t.skip("a key is set");
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("./node.mjs", import.meta.url))], { encoding: "utf8", env: { ...process.env, TIMTIM_TEST_KEY: "" } });
  assert.match(out, /^SKIPPED: changed_since needs a key/);
});
