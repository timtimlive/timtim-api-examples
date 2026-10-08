# Changelog

## [Unreleased] — Developer Preview

### Added

- App examples beyond websites: `events-near-my-hotel/` (nearest first, walking time), `live-music-this-weekend/` (Friday–Sunday, venue dates), `things-to-do-near-me/` (grouped by type; nearest cities with events when nothing is near). Live keyless tests for each.
- Nine goal folders: find-events, display-events, event-details, attribution, test-purchase, verify-webhook, cancellation, refund, changed-events.
- `npm test` (node:test) runs every example: live keyless calls, a local signed webhook round-trip, and clean skips for key-only flows without `TIMTIM_TEST_KEY`.
