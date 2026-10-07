// node find-events/node.mjs [city] [category]
// With no TIMTIM_KEY you get sample events. With TIMTIM_KEY=tt_test_… you use your own test key.
import { findEvents } from "./find-events.mjs";

const [city = "Miami", category = "music"] = process.argv.slice(2);
const { events, mode } = await findEvents({ city, category, key: process.env.TIMTIM_KEY });

console.log(`${events.length} event(s) in ${city} (${category}), mode: ${mode}`);
for (const event of events) {
  console.log(`- ${event.name}`);
  console.log(`  ${event.display.date_label} · ${event.location.venue}, ${event.location.city}`);
  console.log(`  ${event.display.price_label} → ${event.tickets.buy_url}`);
}
