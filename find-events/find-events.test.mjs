import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { findEvents } from "./find-events.mjs";

test("finds sample events in Miami (live, no key)", async () => {
  const page = await findEvents({ city: "Miami", category: "music" });
  assert.equal(page.object, "list");
  assert.equal(page.mode, "test");
  assert.ok(page.events.length > 0, "expected at least one sample event");
  for (const e of page.events) {
    assert.ok(e.name.startsWith("TEST EVENT — NO REAL MONEY"), e.name);
    assert.equal(e.location.city, "Miami");
    assert.equal(e.category, "music");
  }
});

test("a problem response becomes an error with its request id (live)", async () => {
  await assert.rejects(findEvents({ city: "Miami", key: "tt_test_not_a_real_key" }), /invalid_key, request req_/);
});

test("node.mjs runs and prints events (live)", () => {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("./node.mjs", import.meta.url)), "Miami", "music"], { encoding: "utf8", env: { ...process.env, TIMTIM_KEY: "" } });
  assert.match(out, /event\(s\) in Miami \(music\), mode: test/);
  assert.match(out, /TEST EVENT — NO REAL MONEY/);
});

test("a non-JSON answer (a proxy's 502 page) becomes a plain error, not a parse error (offline)", async () => {
  const real = globalThis.fetch;
  globalThis.fetch = async () => new Response("<html>502 Bad Gateway</html>", { status: 502, statusText: "Bad Gateway" });
  try {
    await assert.rejects(findEvents({ city: "Miami" }), (error) => {
      assert.equal(error.message, "TimTim.Live answered 502 Bad Gateway but not with JSON. Try again in a minute.");
      return true;
    });
  } finally {
    globalThis.fetch = real;
  }
});
