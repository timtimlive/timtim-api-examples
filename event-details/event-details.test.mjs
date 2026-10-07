import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getEvent } from "./event-details.mjs";

const key = process.env.TIMTIM_TEST_KEY;

test("getEvent returns one sample event (needs TIMTIM_TEST_KEY)", async (t) => {
  if (!key) return t.skip("TIMTIM_TEST_KEY is not set — GET /events/{id} needs a key");
  const { gone, event } = await getEvent("evt_test_washington_konpa", key);
  assert.equal(gone, false);
  assert.equal(event.id, "evt_test_washington_konpa");
  assert.ok(event.name.startsWith("TEST EVENT — NO REAL MONEY"));
});

test("node.mjs skips cleanly without a key", (t) => {
  if (key) return t.skip("a key is set");
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("./node.mjs", import.meta.url))], { encoding: "utf8", env: { ...process.env, TIMTIM_TEST_KEY: "" } });
  assert.match(out, /^SKIPPED: GET \/events\/\{id\} needs a key/);
});
