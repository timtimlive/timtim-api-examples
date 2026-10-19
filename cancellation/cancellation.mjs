// What to do when an event's status changes.
// Contract: Event.status (scheduled, postponed, rescheduled, cancelled, sold_out, completed)
// and Event.tickets.availability (available, limited, sold_out, not_on_sale, ended).
// Practice with no key: GET /v1/demo/events?simulate=cancelled (operation listDemoEvents).

/** One plain decision per event. */
export function actionFor(event) {
  switch (event.status) {
    case "cancelled":
      return { action: "take-down", why: "cancelled", showBuyButton: false };
    case "completed":
      return { action: "take-down", why: "it has ended", showBuyButton: false };
    case "postponed":
      return { action: "keep", why: "postponed — new date not set yet; say so on the card", showBuyButton: event.tickets.availability === "available" || event.tickets.availability === "limited" };
    case "rescheduled":
      return { action: "update", why: "rescheduled — show the new date", showBuyButton: event.tickets.availability === "available" || event.tickets.availability === "limited" };
    case "sold_out":
      return { action: "keep", why: "sold out — keep the card, hide the button", showBuyButton: false };
    default:
      return { action: "keep", why: "scheduled", showBuyButton: event.tickets.availability === "available" || event.tickets.availability === "limited" };
  }
}

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

/** Sample events with a simulated status — no key needed. */
export async function sampleEvents(simulate, city = "Miami") {
  const query = new URLSearchParams({ city, ...(simulate ? { simulate } : {}) });
  const res = await fetch(`${BASE}/demo/events?${query}`);
  const body = await readJson(res);
  if (!res.ok) throw new Error(`${body.title} (request ${body.request_id})`);
  return body.events;
}
