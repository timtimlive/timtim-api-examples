// TIMTIM_TEST_KEY=tt_test_… node test-purchase/node.mjs
import { testPurchase } from "./purchase.mjs";

const key = process.env.TIMTIM_TEST_KEY;
if (!key) {
  console.log("SKIPPED: a test purchase needs a test key. Get one free at https://timtim.live/partners/dashboard,");
  console.log("then run: TIMTIM_TEST_KEY=tt_test_YOUR_KEY node test-purchase/node.mjs");
  process.exit(0);
}

const { ticket, order, retry, status } = await testPurchase({
  key,
  // Tickets are sent to the buyer's email. In the sandbox no money moves; use an address you control.
  buyerEmail: process.env.TIMTIM_TEST_BUYER_EMAIL ?? "buyer@example.com",
});
console.log(`ticket type: ${ticket.name} — ${ticket.total_per_ticket} ${ticket.currency} all-in`);
console.log(`order:       ${order.id} (${order.status}), total ${order.total} ${order.currency}`);
console.log(`retry:       ${retry.id === order.id ? "same order — no second hold" : "DIFFERENT ORDER (unexpected)"}`);
console.log(`checkout:    ${order.checkout_url ?? "(none — open the payment page only while awaiting payment)"}`);
console.log(`status now:  ${status.status}`);
