// Sends your webhook receiver one correctly signed delivery and one forged one.
//
//   TIMTIM_WEBHOOK_SECRET=your-endpoint-secret node verify-webhook/send-deliveries.mjs [url]
//
// Default url: http://127.0.0.1:8787/timtim (start server.mjs first).

import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { sign } from "./verify.mjs";

export const SAMPLE_MESSAGE = {
  id: "whd_example_1",
  type: "event.changed",
  created_at: "2026-10-06T15:04:05.000Z",
  mode: "test",
  data: { event: { id: "evt_test_washington_konpa", name: "TEST EVENT — NO REAL MONEY · Washington Konpa Night", status: "cancelled" } },
};

async function post(url, body, headers) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body });
  return res.status;
}

/** Returns the status codes your receiver answered. A good receiver: signed 200, forged 400, stale 400, repeat 200. */
export async function sendDeliveries(url, secret) {
  const body = JSON.stringify({ ...SAMPLE_MESSAGE, id: `whd_${randomUUID()}` });
  const now = Math.floor(Date.now() / 1000);
  const deliveryId = `whd_${randomUUID()}`;
  const common = { "TimTim-Delivery-Id": deliveryId, "TimTim-Event": "event.changed" };

  const signed = await post(url, body, { ...common, "TimTim-Signature": sign(secret, now, body), "TimTim-Timestamp": String(now) });
  const forged = await post(url, body, { ...common, "TimTim-Delivery-Id": `whd_${randomUUID()}`, "TimTim-Signature": sign("not-the-secret", now, body), "TimTim-Timestamp": String(now) });
  const stale = await post(url, body, { ...common, "TimTim-Delivery-Id": `whd_${randomUUID()}`, "TimTim-Signature": sign(secret, now - 600, body), "TimTim-Timestamp": String(now - 600) });
  const repeat = await post(url, body, { ...common, "TimTim-Signature": sign(secret, now, body), "TimTim-Timestamp": String(now) });
  return { signed, forged, stale, repeat };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const secret = process.env.TIMTIM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Set TIMTIM_WEBHOOK_SECRET to the same secret the server uses.");
    process.exit(1);
  }
  const url = process.argv[2] ?? "http://127.0.0.1:8787/timtim";
  const r = await sendDeliveries(url, secret);
  console.log(`correctly signed → ${r.signed} (want 200)`);
  console.log(`forged signature → ${r.forged} (want 400)`);
  console.log(`10 minutes old   → ${r.stale} (want 400)`);
  console.log(`same delivery id → ${r.repeat} (want 200, handled once)`);
}
