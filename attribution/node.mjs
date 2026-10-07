// node attribution/node.mjs [your-click-id]
// Takes a real sample event (no key) and builds its tracked link with your click id.
import { withSubId } from "./attribution.mjs";

const BASE = process.env.TIMTIM_API_BASE ?? "https://api.timtim.live/v1";
const clickId = process.argv[2] ?? "newsletter-2026-10";

const res = await fetch(`${BASE}/demo/events?city=Washington&limit=1`);
const { events } = await res.json();
const event = events[0];
console.log(`Event:     ${event.name}`);
console.log(`buy_url:   ${event.tickets.buy_url}`);
console.log(`your link: ${withSubId(event.tickets.buy_url, clickId)}`);
console.log(`When someone buys through it, the earning comes back with sub_id = "${clickId}".`);
