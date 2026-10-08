# Live music this weekend

**Goal:** a radio app, city guide or newsletter lists the music shows from Friday to Sunday.

**Contract operations:** `listDemoEvents` — `GET /v1/demo/events` (no key) and `listEvents` — `GET /v1/events` (with a key), using `category=music`, `from` and `to`.

| File | What |
|---|---|
| [`this-weekend.mjs`](this-weekend.mjs) | `thisWeekend(now)` — Friday to Sunday as YYYY-MM-DD (or what is left of it on a weekend); `liveMusicThisWeekend({ city })` |
| [`node.mjs`](node.mjs) | `node live-music-this-weekend/node.mjs Miami` |

## Steps

1. `node live-music-this-weekend/node.mjs` — sample shows, no key. The sample week may have no weekend shows; that is a real answer, and the script says what to try.
2. Add a city: `node live-music-this-weekend/node.mjs Paris`.
3. Dates are the day **as the venue calls it** (`event.date`), so a show at 11 PM Sunday in Paris is Sunday's.
4. Real events: set `TIMTIM_KEY`.
