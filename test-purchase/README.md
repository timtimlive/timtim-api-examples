# Test purchase (sandbox)

**Goal:** sell a ticket inside your own app — practised in the sandbox, where no real money moves.

**Contract operations:** `listTicketTypes` — `GET /v1/events/{id}/tickets`, `createOrder` — `POST /v1/orders` (header `Idempotency-Key`, required), `getOrder` — `GET /v1/orders/{id}`. Server keys or test keys. **This example refuses anything but a test key (`tt_test_…`).**

## Steps

1. Get a free test key at https://timtim.live/partners/dashboard.
2. Run `TIMTIM_TEST_KEY=tt_test_YOUR_KEY node test-purchase/node.mjs` (PowerShell: `$env:TIMTIM_TEST_KEY="tt_test_YOUR_KEY"; node test-purchase/node.mjs`).
3. It lists the sample ticket types and holds one ticket with `POST /orders`. Then it sends the same request again with the **same** `Idempotency-Key`. You get the same order back, never a second hold. Last, it checks the order.
4. In a real app you would open `checkout_url` for the buyer — TimTim.Live's payment page. Card details never pass through the API.

Without `TIMTIM_TEST_KEY` the script prints `SKIPPED` and exits 0. Set `TIMTIM_TEST_BUYER_EMAIL` to an address you control if you want to see what the buyer receives.

Simpler path that needs no API key at all: send people to the event's `buy_url` (see [`../attribution`](../attribution)).
