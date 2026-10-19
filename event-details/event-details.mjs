// One event by id — even after it ended or was cancelled, so you can take it down.
// Contract operation: getEvent — GET /v1/events/{id}. Needs a key.

const BASE = process.env.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

/** The answer as JSON — or a plain error when it is not JSON (a proxy's 502 page, for example). */
async function readJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`TimTim.Live answered ${`${res.status} ${res.statusText}`.trim()} but not with JSON. Try again in a minute.`);
  }
}

export async function getEvent(id, key) {
  const res = await fetch(`${BASE}/events/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` } });
  const body = await readJson(res);
  if (res.status === 410) return { gone: true, problem: body }; // withdrawn: stop showing it
  if (!res.ok) throw new Error(`${body.title} (${body.code}, request ${body.request_id})`);
  return { gone: false, event: body.event };
}
