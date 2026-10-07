# Find events

**Goal:** get a list of events for a city and a category.

**Contract operations:** `listDemoEvents` — `GET /v1/demo/events` (no key) and `listEvents` — `GET /v1/events` (with a key). Same filters: `city`, `country`, `category`, `from`, `to`, `near`, `artist`, `limit`, `cursor` (and more on `/events`).

| File | Runs in |
|---|---|
| [`find-events.mjs`](find-events.mjs) | Node 18+ and browsers — the one function |
| [`node.mjs`](node.mjs) | Node: `node find-events/node.mjs Miami music` |
| [`browser.html`](browser.html) | A browser (serve the folder: `npm run serve`) |

## Steps

1. `node find-events/node.mjs Miami music` — sample events, no key.
2. Read the answer: `{ object: "list", mode, events: [...], next }`. When `next` is not null, ask again with `cursor=<next>` for the next page.
3. Want your own key? Get a test key at https://timtim.live/partners/dashboard and run `TIMTIM_KEY=tt_test_YOUR_KEY node find-events/node.mjs`.
4. In a browser: `npm run serve`, then open http://localhost:8080/find-events/browser.html.

Errors are always `application/problem+json`: `{ type, title, status, detail, request_id, code }`. Keep the `request_id` when you ask for help.
