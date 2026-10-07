// Keep your own copy of events in sync by asking "what changed since…?"
// Contract operation: listEvents — GET /v1/events?changed_since=<date-time>.
// "With changed_since, every event that changed after that time, including ones
//  that ended or were cancelled." Plus `withdrawn`: events no longer shared —
//  stop showing each id (up to 500; always empty for a test key).

const BASE = process.env.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";

/** Applies one page to your store (a Map of id → event). */
export function applyChanges(store, page) {
  let updated = 0;
  let removed = 0;
  for (const event of page.events) {
    store.set(event.id, event); // new, changed, cancelled or ended: keep the newest copy; show it by its status
    updated++;
  }
  for (const gone of page.withdrawn ?? []) {
    if (store.delete(gone.id)) removed++; // no longer shared: stop showing it and remove its buy_url
  }
  return { updated, removed };
}

/**
 * One polling round: every page of changes after `since`. Returns the `since`
 * to use next time — the moment this round started, so nothing falls between rounds.
 */
export async function pollOnce({ key, since, store }) {
  const startedAt = new Date().toISOString();
  let cursor = null;
  let pages = 0;
  let lastWithdrawnAt = null;
  do {
    const query = new URLSearchParams({ changed_since: since, ...(cursor ? { cursor } : {}) });
    const res = await fetch(`${BASE}/events?${query}`, { headers: { Authorization: `Bearer ${key}` } });
    const page = await res.json();
    if (!res.ok) throw new Error(`${page.title} (${page.code}, request ${page.request_id})`);
    applyChanges(store, page);
    if (page.withdrawn?.length === 500) lastWithdrawnAt = page.withdrawn.at(-1).withdrawn_at;
    cursor = page.next;
    pages++;
  } while (cursor);
  /* If a page carried the 500-item maximum of withdrawn ids, ask again from the last withdrawn_at. */
  return { next: lastWithdrawnAt ?? startedAt, pages };
}
