// Events near a hotel, nearest first — for a hotel app, a concierge screen or a booking confirmation email.
// Contract operations: listDemoEvents (GET /demo/events, no key) and listEvents (GET /events, with a key), using lat, lng and radius.

const BASE = globalThis.process?.env?.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

/** Straight-line distance in kilometres between two points (haversine). */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const r = (d) => (d * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/**
 * @param {{ lat: number, lng: number, radiusKm?: number, limit?: number, key?: string }} hotel
 * @returns {Promise<{ mode: string, events: Array<object & { distance_km: number | null }> }>}
 */
export async function eventsNearHotel({ lat, lng, radiusKm = 5, limit = 20, key }) {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng), radius: String(radiusKm), limit: String(limit) });
  const res = await fetch(`${BASE}/${key ? "events" : "demo/events"}?${query}`, { headers: key ? { Authorization: `Bearer ${key}` } : {} });
  const body = await res.json();
  if (!res.ok) throw new Error(`${body.title} ${body.detail ?? ""} (${body.code}, request ${body.request_id})`);
  const events = body.events
    .map((e) => ({ ...e, distance_km: e.location.lat == null || e.location.lng == null ? null : Math.round(distanceKm(lat, lng, e.location.lat, e.location.lng) * 10) / 10 }))
    .sort((a, b) => (a.distance_km ?? Infinity) - (b.distance_km ?? Infinity));
  return { mode: body.mode, events };
}

/** "12 min walk" under 2 km, otherwise "3.4 km away". */
export function howFar(km) {
  if (km == null) return "nearby";
  return km < 2 ? `${Math.max(1, Math.round((km / 5) * 60))} min walk` : `${km} km away`;
}
