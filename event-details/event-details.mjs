// One event by id — even after it ended or was cancelled, so you can take it down.
// Contract operation: getEvent — GET /v1/events/{id}. Needs a key.

const BASE = process.env.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

export async function getEvent(id, key) {
  const res = await fetch(`${BASE}/events/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` } });
  const body = await res.json();
  if (res.status === 410) return { gone: true, problem: body }; // withdrawn: stop showing it
  if (!res.ok) throw new Error(`${body.title} (${body.code}, request ${body.request_id})`);
  return { gone: false, event: body.event };
}
