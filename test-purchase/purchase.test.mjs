import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { testPurchase } from "./purchase.mjs";

const key = process.env.TIMTIM_TEST_KEY;

test("refuses anything but a test key, before any request", async () => {
  await assert.rejects(testPurchase({ key: "tt_sk_live_example", buyerEmail: "buyer@example.com" }), /only runs with a test key/);
  await assert.rejects(testPurchase({ key: undefined, buyerEmail: "buyer@example.com" }), /only runs with a test key/);
});

test("sandbox purchase end to end (needs TIMTIM_TEST_KEY)", async (t) => {
  if (!key) return t.skip("TIMTIM_TEST_KEY is not set — POST /orders needs a test key");
  const { order, retry, status } = await testPurchase({ key, buyerEmail: process.env.TIMTIM_TEST_BUYER_EMAIL ?? "buyer@example.com" });
  assert.equal(order.object, "order");
  assert.equal(order.test, true);
  assert.equal(retry.id, order.id, "the same Idempotency-Key must return the same order");
  assert.equal(status.id, order.id);
});

test("node.mjs skips cleanly without a key", (t) => {
  if (key) return t.skip("a key is set");
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("./node.mjs", import.meta.url))], { encoding: "utf8", env: { ...process.env, TIMTIM_TEST_KEY: "" } });
  assert.match(out, /^SKIPPED: a test purchase needs a test key/);
});
