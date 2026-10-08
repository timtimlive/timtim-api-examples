// Live music this weekend — for a radio app, a city guide or a "what's on" newsletter.
// Contract operations: listDemoEvents (GET /demo/events, no key) and listEvents (GET /events, with a key), using category, from and to.

const BASE = globalThis.process?.env?.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

const day = (d) => d.toISOString().slice(0, 10);

/**
 * This weekend's Friday to Sunday, as YYYY-MM-DD. On a Saturday or Sunday it is the weekend already under way.
 * @param {Date} now
 */
export function thisWeekend(now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dow = today.getUTCDay(); // 0 Sunday … 6 Saturday
  const toFriday = dow === 0 ? -2 : dow === 6 ? -1 : 5 - dow;
  const friday = new Date(today.getTime() + toFriday * 86_400_000);
  const sunday = new Date(friday.getTime() + 2 * 86_400_000);
  return { from: day(friday < today ? today : friday), to: day(sunday) };
}

/**
 * @param {{ city?: string, country?: string, genre?: string, key?: string, now?: Date }} options
 */
export async function liveMusicThisWeekend({ city, country, key, now } = {}) {
  const { from, to } = thisWeekend(now);
  const query = new URLSearchParams({ category: "music", from, to, limit: "50" });
  if (city) query.set("city", city);
  if (country) query.set("country", country);
  const res = await fetch(`${BASE}/${key ? "events" : "demo/events"}?${query}`, { headers: key ? { Authorization: `Bearer ${key}` } : {} });
  const body = await res.json();
  if (!res.ok) throw new Error(`${body.title} ${body.detail ?? ""} (${body.code}, request ${body.request_id})`);
  return { from, to, mode: body.mode, events: body.events };
}
