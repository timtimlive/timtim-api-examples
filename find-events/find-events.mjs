// Find events with plain fetch. Works in Node 18+ and in browsers.
// Contract operations: listDemoEvents (GET /demo/events, no key) and listEvents (GET /events, with a key).

const BASE = globalThis.process?.env?.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

/** The answer as JSON — or a plain error when it is not JSON (a proxy's 502 page, for example). */
async function readJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`TimTim.Live answered ${`${res.status} ${res.statusText}`.trim()} but not with JSON. Try again in a minute.`);
  }
}

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
  const body = await readJson(res);
  if (!res.ok) {
    // Every error is a problem: { type, title, status, detail, request_id, code }
    throw new Error(`${body.title} ${body.detail ?? ""} (${body.code}, request ${body.request_id})`);
  }
  return body; // { object: "list", mode, events: [...], next }
}
