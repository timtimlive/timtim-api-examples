// Things to do near me — for a tourism, university or community app: what is on nearby, grouped by type,
// and if nothing is nearby, the closest cities that do have events.
// Contract operations: listDemoEvents / listEvents (lat, lng, radius) and listDemoLocations / listLocations.

const BASE = globalThis.process?.env?.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

async function get(path, query, key) {
  const res = await fetch(`${BASE}/${key ? path : `demo/${path}`}?${new URLSearchParams(query)}`, { headers: key ? { Authorization: `Bearer ${key}` } : {} });
  const body = await res.json();
  if (!res.ok) throw new Error(`${body.title} ${body.detail ?? ""} (${body.code}, request ${body.request_id})`);
  return body;
}

/**
 * @param {{ lat: number, lng: number, radiusKm?: number, country?: string, key?: string }} where
 * @returns {Promise<{ mode: string, byType: Record<string, object[]>, elsewhere: Array<{ city: string, country: string | null, events: number }> }>}
 */
export async function thingsToDoNearMe({ lat, lng, radiusKm = 25, country, key }) {
  const page = await get("events", { lat: String(lat), lng: String(lng), radius: String(radiusKm), limit: "50" }, key);
  /** @type {Record<string, object[]>} */
  const byType = {};
  for (const e of page.events) (byType[e.category ?? "other"] ??= []).push(e);
  /* Nothing here? Say where there is something, instead of an empty screen. */
  const elsewhere = page.events.length ? [] : (await get("locations", { ...(country ? { country } : {}), limit: "5" }, key)).locations;
  return { mode: page.mode, byType, elsewhere };
}
