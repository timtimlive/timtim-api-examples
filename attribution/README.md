# Attribution

**Goal:** know which of *your* links, pages or campaigns led to a ticket sale.

**Contract:** `Event.tickets.buy_url` — use the link exactly as given; it carries your attribution. Optionally add `?sub_id=YOUR_CLICK_ID` (letters, digits, `. _ ~ -`, up to 100). The sale carries it back as `Earning.sub_id` in `listEarnings` (`GET /v1/earnings`), in the `earnings.changed` webhook and in postbacks.

## Steps

1. Get an event from any list. Take its `tickets.buy_url`. Do not rebuild or shorten it.
2. Add your own click id: `withSubId(buyUrl, "newsletter-2026-10")` from [`attribution.mjs`](attribution.mjs). It uses the `URL` API, so everything already in the link stays.
3. Try it: `node attribution/node.mjs newsletter-2026-10` — it prints a real sample link with your `sub_id`.
4. Later, with a server or test key, read your results: `GET /v1/earnings` — each earning has `sub_id`. A refund carries the same `sub_id` (see [`../refund`](../refund)).

TimTim.Live runs the checkout, so you never report sales yourself.
