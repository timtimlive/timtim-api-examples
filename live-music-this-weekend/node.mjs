// node live-music-this-weekend/node.mjs [city]
// With no TIMTIM_KEY you get sample events — and the sample week may have no weekend shows; try another city.
import { liveMusicThisWeekend } from "./this-weekend.mjs";

const [city] = process.argv.slice(2);
const { from, to, mode, events } = await liveMusicThisWeekend({ city, key: process.env.TIMTIM_KEY });

console.log(`Live music ${from} to ${to}${city ? ` in ${city}` : ""}: ${events.length} show(s), mode: ${mode}`);
for (const e of events) {
  console.log(`- ${e.display.date_label} · ${e.name}`);
  console.log(`  ${[e.location.venue, e.location.city].filter(Boolean).join(", ")} · ${e.display.price_label}`);
  console.log(`  Tickets: ${e.tickets.buy_url}`);
}
if (!events.length) console.log("Nothing this weekend. Try without a city, or next week.");
