# Changed events

**Goal:** keep your own copy of events up to date without downloading everything again.

**Contract operation:** `listEvents` — `GET /v1/events?changed_since=<date-time>`. It returns every event that changed after that time, **even ones that ended or were cancelled**. It also returns `withdrawn`: ids that are no longer shared with partners. Stop showing each of those. Up to 500 per answer; if you get 500, ask again with `changed_since` set to the last `withdrawn_at`. Always empty for a test key. **Needs a key.**

## Steps

1. Get a free test key at https://timtim.live/partners/dashboard.
2. Run `TIMTIM_TEST_KEY=tt_test_YOUR_KEY node changed-events/node.mjs` (PowerShell: `$env:TIMTIM_TEST_KEY="tt_test_YOUR_KEY"; node changed-events/node.mjs`).
3. Read [`sync.mjs`](sync.mjs). `pollOnce` follows `next` page by page. `applyChanges` updates or removes events. The next round starts from the moment this one began.
4. Set `ROUNDS=5` to poll five times, a minute apart.

Without a key the script prints `SKIPPED` and exits 0; `npm test` still checks `applyChanges` with real sample events and an illustrative withdrawal.

Rather be told than ask? The `event.changed` webhook pushes the same changes — see [`../verify-webhook`](../verify-webhook).
