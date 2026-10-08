# Events near my hotel

**Goal:** a hotel app, concierge screen or booking email shows what is on near the hotel, nearest first, with walking time.

**Contract operations:** `listDemoEvents` — `GET /v1/demo/events` (no key) and `listEvents` — `GET /v1/events` (with a key), using `lat`, `lng` and `radius` (km).

| File | What |
|---|---|
| [`near-hotel.mjs`](near-hotel.mjs) | `eventsNearHotel({ lat, lng, radiusKm })` — events sorted by distance; `howFar(km)` — "8 min walk" / "3.4 km away" |
| [`node.mjs`](node.mjs) | `node events-near-my-hotel/node.mjs 38.9007 -77.0365 5` |

## Steps

1. `node events-near-my-hotel/node.mjs` — a sample hotel in Washington, DC; sample events, no key.
2. Use your hotel's latitude and longitude, and a radius your guests would travel (5 km walks, 25 km drives).
3. Show `tickets.buy_url` exactly as given — it carries your partner credit.
4. Real events: `TIMTIM_KEY=tt_test_… node events-near-my-hotel/node.mjs` (test key), then your server key on your server.

Distance is a straight line, so "min walk" is an estimate at 5 km/h.
