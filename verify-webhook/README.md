# Verify a webhook

**Goal:** receive TimTim.Live's webhooks and be sure each one is real, fresh and handled once.

**In plain words:** TimTim.Live sends your server a message when something changes. Each message has a seal made with a secret only you and TimTim.Live know. Check the seal before you trust the message. This example shows how.

**Contract:** webhooks `event.changed` and `earnings.changed`. Headers `TimTim-Signature: t=<unix seconds>,v1=<hex>` and `TimTim-Delivery-Id`. `v1` is HMAC-SHA256 of `<t>.<raw body>` with your endpoint secret, as hex.

| File | What it is |
|---|---|
| [`verify.mjs`](verify.mjs) | `verifySignature(secret, header, rawBody)` — 10 lines, `node:crypto` |
| [`server.mjs`](server.mjs) | A receiver with plain `node:http`: raw body → verify → skip repeats → handle |
| [`send-deliveries.mjs`](send-deliveries.mjs) | Sends your receiver a signed, a forged, a stale and a repeated delivery |

## Steps

1. Start the receiver: `TIMTIM_WEBHOOK_SECRET=any-local-secret node verify-webhook/server.mjs`
2. In a second terminal, with the same secret: `TIMTIM_WEBHOOK_SECRET=any-local-secret node verify-webhook/send-deliveries.mjs`
3. You should see: signed → 200, forged → 400, 10 minutes old → 400, same delivery id → 200 (and handled once).
4. In production, register an `https` address at https://timtim.live/partners/dashboard. Use the real endpoint secret from there. Answer within 10 seconds. If you don't, TimTim.Live tries again after 1 m, 5 m, 30 m, 2 h, 6 h, 12 h and 24 h.

The four rules. Check the **raw** body before you parse it. Compare in **constant time**, so timing gives nothing away. Refuse anything more than **300 seconds** old. Use `TimTim-Delivery-Id` to do each delivery **once**.

PowerShell: `$env:TIMTIM_WEBHOOK_SECRET="any-local-secret"; node verify-webhook/server.mjs`
