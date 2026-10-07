# Contributing to timtim-api-examples

Thank you! Please read the [Code of Conduct](CODE_OF_CONDUCT.md). Security problems go **privately** through "Report a vulnerability" on the Security tab ([SECURITY.md](SECURITY.md)).

## What makes a good example here

1. **One goal per folder**, named for the goal (`find-events/`, not `node-sample-3/`).
2. **Plain `fetch`**, no SDK, so people see the real request.
3. **Only what the contract has** (https://timtim.live/partner-api/openapi.yaml). The folder README names the operation(s) it uses.
4. **It runs in `npm test`**: against the live keyless endpoint where possible; a local signed request for webhooks; `t.skip("why")` and a `SKIPPED` message (exit 0) when it needs `TIMTIM_TEST_KEY` and none is set.
5. **No examples for appearance.** If it cannot be run or tested, it does not go in.
6. **Safe by default:** `textContent` not `innerHTML`, `https:` links only, test keys only for anything that buys.
7. **A README a beginner can follow** in 3–5 steps.

## Checks

```bash
npm install
npm test
```

Never commit a key, token or real personal data — use placeholders like `tt_test_YOUR_KEY`.

By contributing you agree your work is licensed under the [MIT License](LICENSE).
