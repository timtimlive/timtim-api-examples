// Attribution: send people to the buy_url TimTim.Live gives you — exactly as given —
// optionally with your own click id as ?sub_id=. The sale then carries it back
// as Earning.sub_id (GET /v1/earnings, the earnings.changed webhook) and in postbacks.
// Contract: Event.tickets.buy_url and its sub_id note; Earning.sub_id.

const SUB_ID = /^[A-Za-z0-9._~-]{1,100}$/; // letters, digits, . _ ~ -, up to 100

/** buy_url with ?sub_id=<yours>. Keeps everything else in the link (path, query, #hash) untouched. */
export function withSubId(buyUrl, subId) {
  if (!SUB_ID.test(subId)) throw new Error("sub_id must be 1–100 of: letters, digits, . _ ~ -");
  const url = new URL(buyUrl);
  if (url.protocol !== "https:") throw new Error("buy_url must be https");
  url.searchParams.set("sub_id", subId);
  return url.toString();
}
