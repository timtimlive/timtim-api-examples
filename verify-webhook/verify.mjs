// Check that a webhook really came from TimTim.Live, and is fresh.
// Contract: webhooks event.changed / earnings.changed, header TimTim-Signature.
//
//   TimTim-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256(secret, "<t>.<raw body>")>
//
// Rules: compute over the RAW body (before JSON.parse), compare in constant
// time, refuse anything more than 300 seconds from now (replay protection).

import { createHmac, timingSafeEqual } from "node:crypto";

export const TOLERANCE_S = 300;

export function sign(secret, timestampS, rawBody) {
  return `t=${timestampS},v1=${createHmac("sha256", secret).update(`${timestampS}.${rawBody}`).digest("hex")}`;
}

export function verifySignature(secret, header, rawBody, nowS = Math.floor(Date.now() / 1000)) {
  if (typeof header !== "string") return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.trim().split("=", 2)));
  const t = Number(parts.t);
  if (!Number.isInteger(t) || !parts.v1 || Math.abs(nowS - t) > TOLERANCE_S) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex"));
  const given = Buffer.from(parts.v1);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
