import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { balance, handleEarningsChanged } from "./refund.mjs";

/* Illustrative messages in the contract's shape (a real one needs a live sale). */
const sale = { sale_id: "sale_example_1", event_id: "evt_example_1", transaction_value: 90, commission: 10, currency: "USD", reason: null, created_at: "2026-10-01T18:00:00.000Z", test: false, sub_id: "click-42" };
const msg = (id, earning) => ({ id, type: "earnings.changed", created_at: earning.created_at, mode: "live", data: { earning } });

test("a sale, its approval, then its refund", () => {
  const ledger = new Map();
  assert.equal(handleEarningsChanged(msg("whd_1", { ...sale, status: "pending" }), ledger).refund, false);
  assert.equal(handleEarningsChanged(msg("whd_2", { ...sale, status: "approved" }), ledger).refund, false);
  assert.equal(balance(ledger), 10);

  const r = handleEarningsChanged(msg("whd_3", { ...sale, status: "reversed", commission: -10, reason: "refund", created_at: "2026-10-05T09:00:00.000Z" }), ledger);
  assert.equal(r.refund, true);
  assert.match(r.text, /Refund: sale sale_example_1 \(your click click-42\) reversed 10 USD/);
  assert.equal(balance(ledger), 0);
});

test("a repeated delivery does not count twice", () => {
  const ledger = new Map();
  const reversed = msg("whd_9", { ...sale, status: "reversed", commission: -10 });
  handleEarningsChanged(msg("whd_8", { ...sale, status: "approved" }), ledger);
  handleEarningsChanged(reversed, ledger);
  handleEarningsChanged(reversed, ledger);
  assert.equal(balance(ledger), 0);
});

test("ignores other webhook types", () => {
  assert.deepEqual(handleEarningsChanged({ type: "event.changed", data: { event: {} } }, new Map()), { handled: false });
});

test("end to end: a signed earnings.changed refund is verified, then handled", () => {
  const secret = "example-endpoint-secret";
  const raw = JSON.stringify(msg("whd_10", { ...sale, status: "reversed", commission: -10 }));
  const t = Math.floor(Date.now() / 1000);
  const header = `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex")}`;

  /* The same check as ../verify-webhook/verify.mjs */
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=", 2)));
  const expected = Buffer.from(createHmac("sha256", secret).update(`${parts.t}.${raw}`).digest("hex"));
  assert.ok(Math.abs(Date.now() / 1000 - Number(parts.t)) <= 300 && timingSafeEqual(expected, Buffer.from(parts.v1)));

  const ledger = new Map();
  assert.equal(handleEarningsChanged(JSON.parse(raw), ledger).refund, true);
});
