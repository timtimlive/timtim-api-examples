# Event details

**Goal:** get one event by its id — for a detail page, or to check whether an event you show was cancelled.

**Contract operation:** `getEvent` — `GET /v1/events/{id}`. **Needs a key.** It still answers after the event ended or was cancelled. If the event is no longer shared, it answers `410` (problem `event_withdrawn`). Then stop showing it.

## Steps

1. Get a free test key at https://timtim.live/partners/dashboard.
2. Run `TIMTIM_TEST_KEY=tt_test_YOUR_KEY node event-details/node.mjs` (PowerShell: `$env:TIMTIM_TEST_KEY="tt_test_YOUR_KEY"; node event-details/node.mjs`).
3. It prints the sample event `evt_test_washington_konpa`: status, date, place, price, performers.
4. Pass another id: `node event-details/node.mjs evt_test_paris_concert` (a sold-out sample).

Without a key the script prints `SKIPPED` and exits 0. The `Event` object is the same one lists return, so you can see its shape with no key: `curl "https://api.timtim.live/v1/demo/events?limit=1"`.
