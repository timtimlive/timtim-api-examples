# TimTim.Live API examples

> **Developer Preview.**

Small examples of the TimTim.Live events API, **organized by what you want to do**. They use plain `fetch` — no SDK — so you can see every request exactly. Each folder's README names the contract operation it uses.

[Live Demo](https://timtim.live/developers/demo) · [Documentation](https://timtim.live/developers/docs) · [Sandbox](https://timtim.live/developers/sandbox) · [Developer Access](https://timtim.live/developers) · [Community](https://timtim.live/developers/community)

## Start here (no key, 10 seconds)

```bash
git clone https://github.com/timtimlive/timtim-api-examples.git
cd timtim-api-examples
node find-events/node.mjs Miami music
```

You will see sample events. Every name starts with "TEST EVENT — NO REAL MONEY". You need Node 18 or newer to run an example, and Node 20 or newer for `npm test`.

## Pick a goal

| I want to… | Folder | Needs a key? |
|---|---|---|
| Find events for a city | [`find-events/`](find-events) | No |
| Show events on a web page, safely | [`display-events/`](display-events) | No |
| Get one event by id | [`event-details/`](event-details) | Yes (test key) |
| Know which of my links sold tickets | [`attribution/`](attribution) | No (results: yes) |
| Sell a ticket in my own app (sandbox) | [`test-purchase/`](test-purchase) | Yes (test key only) |
| Receive webhooks and check they are real | [`verify-webhook/`](verify-webhook) | No (runs locally) |
| React to a cancelled event | [`cancellation/`](cancellation) | No |
| Handle a refund | [`refund/`](refund) | No (illustrative messages) |
| Keep my copy in sync | [`changed-events/`](changed-events) | Yes (test key) |
| Show events near a hotel, nearest first | [`events-near-my-hotel/`](events-near-my-hotel) | No |
| List live music this weekend | [`live-music-this-weekend/`](live-music-this-weekend) | No |
| Show things to do near someone | [`things-to-do-near-me/`](things-to-do-near-me) | No |

Languages: Node for most, HTML + browser JavaScript where a page is the point (`find-events/browser.html`, `display-events/index.html`). For React, see the SDK's examples in [timtim-live-events](https://github.com/timtimlive/timtim-live-events/tree/main/examples).

## Keys

- No key: the keyless demo endpoint `GET https://api.timtim.live/v1/demo/events` — sample events, works from any website.
- Test key (`tt_test_…`): free at https://timtim.live/partners/dashboard. Sample events only; no real money moves.
- Examples that need a key read `TIMTIM_TEST_KEY` and print `SKIPPED` (exit 0) when it is not set.
- Never put a server key (`tt_sk_live_…`) in a browser or a URL.

## Run every example

```bash
npm install
npm test                                   # calls the live keyless endpoint; key-only parts are skipped
TIMTIM_TEST_KEY=tt_test_YOUR_KEY npm test  # runs the key-only parts too
npm run serve                              # http://localhost:8080 for the HTML pages
```

## Documentation

- Docs: https://timtim.live/developers/docs
- Quickstart: https://timtim.live/developers/quickstart
- The API contract: https://timtim.live/partner-api/openapi.yaml ([timtim-openapi](https://github.com/timtimlive/timtim-openapi))
- Status: https://timtim.live/developers/status

## Security

Report security problems privately: **Report a vulnerability** on this repository's [Security tab](https://github.com/timtimlive/timtim-api-examples/security). Policy: https://timtim.live/partners/security. See [SECURITY.md](SECURITY.md).

## Contribution

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Only examples that work against the real API — no examples for appearance.

## TimTim.Live Developer Tools

Open-source tools for connecting websites, apps and platforms to TimTim.Live.

### What is open source

SDKs, widgets, adapters, examples and public API specifications.

### What is not included

The hosted TimTim.Live Event API implementation, production databases, ticketing backend, checkout systems, attribution systems, payouts, fraud systems, customer data, infrastructure and proprietary business logic are not part of this repository.

These tools connect to the hosted TimTim.Live API at:

https://api.timtim.live

Open-source licenses for client software do not grant ownership of TimTim.Live event data, API services, commercial rights, certification marks or trademarks.

## License

[MIT](LICENSE) © 2026 timtim-live. Using the API is covered by the Partner Terms: https://timtim.live/partners/terms
