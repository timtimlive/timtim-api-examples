// node events-near-my-hotel/node.mjs [lat] [lng] [radiusKm]
// Default: a sample hotel in downtown Washington, DC. With no TIMTIM_KEY you get sample events.
import { eventsNearHotel, howFar } from "./near-hotel.mjs";

const [lat = "38.9007", lng = "-77.0365", radius = "5"] = process.argv.slice(2);
const { events, mode } = await eventsNearHotel({ lat: Number(lat), lng: Number(lng), radiusKm: Number(radius), key: process.env.TIMTIM_KEY });

console.log(`${events.length} event(s) within ${radius} km of your hotel, mode: ${mode}`);
for (const e of events) {
  console.log(`- ${e.name} — ${howFar(e.distance_km)}`);
  console.log(`  ${e.display.date_label} · ${e.location.venue ?? ""}`);
  console.log(`  Tickets: ${e.tickets.buy_url}`);
}
