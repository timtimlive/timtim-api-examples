# Things to do near me

**Goal:** a tourism, university or community app shows what is on near the person, grouped by type — and when nothing is near, the closest cities that do have events, instead of an empty screen.

**Contract operations:** `listDemoEvents` / `listEvents` (`lat`, `lng`, `radius`) and `listDemoLocations` — `GET /v1/demo/locations` / `listLocations` — `GET /v1/locations`.

| File | What |
|---|---|
| [`near-me.mjs`](near-me.mjs) | `thingsToDoNearMe({ lat, lng, radiusKm })` → `{ byType, elsewhere }` |
| [`node.mjs`](node.mjs) | `node things-to-do-near-me/node.mjs 48.8566 2.3522 25` |

## Steps

1. `node things-to-do-near-me/node.mjs` — central Paris, sample events grouped by type.
2. Try somewhere with nothing on: `node things-to-do-near-me/node.mjs -54.8 -68.3 5` — you get the cities that do have events.
3. In an app, take the person's location only with their permission, and never send it anywhere but this request.
4. Real events: set `TIMTIM_KEY`.
