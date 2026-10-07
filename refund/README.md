# Refund

**Goal:** when a buyer gets their money back, your reward for that sale goes away — notice it and keep your numbers right.

**Contract:** webhook `earnings.changed` with `data.earning` (schema `Earning`). `status` is `pending`, `approved`, `ready`, `paid` or `reversed` — **`reversed` means refunded**. A reversal has a **negative** `commission` and carries the sale's `sub_id`. The same records come from `listEarnings` — `GET /v1/earnings` (server key or test key).

TimTim.Live runs every checkout and every refund. You never refund anyone yourself; you only update your own records.

## Steps

1. Read [`refund.mjs`](refund.mjs): `handleEarningsChanged(message, ledger)` stores each state of each sale; `reversed` is reported as a refund.
2. Run `npm test` — the tests send a sale, its approval and its refund, and check the balance goes 10 → 0.
3. A repeated delivery is stored under the same key, so it never counts twice (also use `TimTim-Delivery-Id`, see [`../verify-webhook`](../verify-webhook)).
4. Wire it into the receiver from [`../verify-webhook/server.mjs`](../verify-webhook/server.mjs): `onMessage: (m) => handleEarningsChanged(m, ledger)`.

These messages are illustrative: a real `reversed` earning needs a real refunded sale. Their shape is checked against the contract in [timtim-openapi](https://github.com/timtimlive/timtim-openapi/tree/main/examples/webhooks).
