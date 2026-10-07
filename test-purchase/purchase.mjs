// A sandbox purchase: ticket types → hold tickets (POST /orders) → check the order.
// Contract operations: listTicketTypes (GET /v1/events/{id}/tickets),
//                      createOrder (POST /v1/orders, Idempotency-Key header),
//                      getOrder (GET /v1/orders/{id}).
// TEST KEYS ONLY in this example: a tt_test_ key moves no real money.

import { randomUUID } from "node:crypto";

const BASE = process.env.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

async function call(method, path, key, { body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${json.title} ${json.detail ?? ""} (${json.code}, request ${json.request_id})`);
  return json;
}

export async function testPurchase({ key, eventId = "evt_test_washington_konpa", buyerEmail, buyerName = "Test Buyer", subId = "api-examples" }) {
  if (!key?.startsWith("tt_test_")) throw new Error("This example only runs with a test key (tt_test_…), so no real money can move.");

  // 1. What can be sold? (paid ticket types, with the all-in price to show)
  const { ticket_types } = await call("GET", `/events/${encodeURIComponent(eventId)}/tickets`, key);
  const ticket = ticket_types.find((t) => t.available && t.sales === "open");
  if (!ticket) throw new Error(`No ticket type on sale for ${eventId}`);

  // 2. Hold tickets. The SAME Idempotency-Key always returns the SAME order — reuse it when you retry.
  const idempotencyKey = `order-${randomUUID()}`;
  const order = await call("POST", "/orders", key, {
    headers: { "Idempotency-Key": idempotencyKey },
    body: { event_id: eventId, ticket_type_id: ticket.id, quantity: 1, buyer_email: buyerEmail, buyer_name: buyerName, sub_id: subId },
  });

  // 3. A retry with the same key must not make a second order.
  const retry = await call("POST", "/orders", key, {
    headers: { "Idempotency-Key": idempotencyKey },
    body: { event_id: eventId, ticket_type_id: ticket.id, quantity: 1, buyer_email: buyerEmail, buyer_name: buyerName, sub_id: subId },
  });

  // 4. Status only — never the buyer's name or email.
  const status = await call("GET", `/orders/${encodeURIComponent(order.id)}`, key);
  return { ticket, order, retry, status };
}
