// Handle refunds: an earnings.changed webhook whose earning has status "reversed".
// Contract: webhook earnings.changed (data.earning), schema Earning —
//   status: pending | approved | ready | paid | reversed   (reversed = refunded)
//   commission: "Negative when a refund reversed it."
//   sub_id: "A refund carries the sale's sub_id."
//
// The same records are in GET /v1/earnings (operation listEarnings).

/**
 * Applies one earnings.changed message to your own ledger (a Map keyed by sale_id + status).
 * Returns what happened, so you can tell your team or your customer.
 */
export function handleEarningsChanged(message, ledger) {
  if (message?.type !== "earnings.changed" || !message.data?.earning) return { handled: false };
  const e = message.data.earning;
  ledger.set(`${e.sale_id}:${e.status}`, e);
  if (e.status === "reversed") {
    return {
      handled: true,
      refund: true,
      text: `Refund: sale ${e.sale_id} (your click ${e.sub_id ?? "—"}) reversed ${Math.abs(e.commission)} ${e.currency} of reward.`,
    };
  }
  return { handled: true, refund: false, text: `Sale ${e.sale_id} is now ${e.status}: ${e.commission} ${e.currency}.` };
}

/** What you are owed: the sum of every recorded commission (reversals are negative, so refunds cancel sales). */
export function balance(ledger) {
  let total = 0;
  for (const e of ledger.values()) if (e.status !== "pending") total += e.commission;
  return Math.round(total * 100) / 100;
}
