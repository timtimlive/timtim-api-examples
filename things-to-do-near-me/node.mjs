// node things-to-do-near-me/node.mjs [lat] [lng] [radiusKm]
// Default: central Paris. With no TIMTIM_KEY you get sample events.
import { thingsToDoNearMe } from "./near-me.mjs";

const [lat = "48.8566", lng = "2.3522", radius = "25"] = process.argv.slice(2);
const { mode, byType, elsewhere } = await thingsToDoNearMe({ lat: Number(lat), lng: Number(lng), radiusKm: Number(radius), key: process.env.TIMTIM_KEY });

console.log(`Things to do within ${radius} km, mode: ${mode}`);
for (const [type, events] of Object.entries(byType)) {
  console.log(`\n${type.toUpperCase()} (${events.length})`);
  for (const e of events) console.log(`- ${e.display.date_label} · ${e.name} → ${e.tickets.buy_url}`);
}
if (elsewhere.length) {
  console.log("\nNothing nearby right now. Cities with events:");
  for (const c of elsewhere) console.log(`- ${c.city}${c.country ? `, ${c.country}` : ""}: ${c.events}`);
}
