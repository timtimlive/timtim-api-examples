# Display events

**Goal:** show events as cards on a web page, safely.

**Contract:** the `Event` object returned by `listDemoEvents` — `GET /v1/demo/events` (no key) — and `listEvents` — `GET /v1/events`.

| File | What it is |
|---|---|
| [`render.mjs`](render.mjs) | `renderEvents(container, events)` — builds the cards |
| [`index.html`](index.html) | A page that fetches sample events and shows them |

## Steps

1. From the repository root: `npm install` (once), then `npm run serve`.
2. Open http://localhost:8080/display-events/index.html — sample events in Washington.
3. Look at `render.mjs`: every piece of event text goes in with `textContent`, never `innerHTML`.
4. Links and images are used only when they are `https:`; `buy_url` is used exactly as given — it carries your attribution.
5. A cancelled or sold-out event keeps its card but loses the **Get tickets** button.

Prefer no code at all? The hosted widget does this in one line: `<script src="https://timtim.live/widget/events.js" data-city="Washington" async></script>`.
