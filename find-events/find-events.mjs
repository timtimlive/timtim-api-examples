// Find events with plain fetch. Works in Node 18+ and in browsers.
// Contract operations: listDemoEvents (GET /demo/events, no key) and listEvents (GET /events, with a key).

const BASE = globalThis.process?.env?.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

/**
 * @param {{ city?: string, category?: string, limit?: number, key?: string }} options
 *   key: leave it out for sample events (no sign-up). In a browser, only a website key (tt_pk_live_…) or a test key.
 */
export async function findEvents({ city, category, limit, key } = {}) {
  const query = new URLSearchParams();
  if (city) query.set("city", city);
  if (category) query.set("category", category);
  if (limit) query.set("limit", String(limit));

  const url = key ? `${BASE}/events?${query}` : `${BASE}/demo/events?${query}`;
  const res = await fetch(url, { headers: key ? { Authorization: `Bearer ${key}` } : {} });
  const body = await res.json();
  if (!res.ok) {
    // Every error is a problem: { type, title, status, detail, request_id, code }
    throw new Error(`${body.title} ${body.detail ?? ""} (${body.code}, request ${body.request_id})`);
  }
  return body; // { object: "list", mode, events: [...], next }
}
