# Cancellation

**Goal:** notice when an event is cancelled (or postponed, rescheduled, sold out) and do the right thing on your page.

**Contract:** `Event.status` — `scheduled`, `postponed`, `rescheduled`, `cancelled`, `sold_out`, `completed` — and `Event.tickets.availability`. To practise with no key: `listDemoEvents` — `GET /v1/demo/events?simulate=cancelled` (also `postponed`, `rescheduled`, `sold_out`).

## Steps

1. Run `node cancellation/node.mjs cancelled` — every sample event comes back `cancelled`, and the script says **TAKE-DOWN** and hides the button.
2. Try `postponed`, `rescheduled` and `sold_out` — the card stays; the button follows `tickets.availability`.
3. Read [`cancellation.mjs`](cancellation.mjs): `actionFor(event)` is the whole decision, one `switch`.
4. In a real integration you hear about changes from the `event.changed` webhook ([`../verify-webhook`](../verify-webhook)) or by polling `changed_since` ([`../changed-events`](../changed-events)).

Money: when an event is cancelled, TimTim.Live handles the refunds. If you earned a reward on those tickets, it comes back as an earning with status `reversed` — see [`../refund`](../refund).
