// TIMTIM_TEST_KEY=tt_test_… node event-details/node.mjs [eventId]
import { getEvent } from "./event-details.mjs";

const key = process.env.TIMTIM_TEST_KEY;
if (!key) {
  console.log("SKIPPED: GET /events/{id} needs a key. Get a free test key at https://timtim.live/partners/dashboard,");
  console.log("then run: TIMTIM_TEST_KEY=tt_test_YOUR_KEY node event-details/node.mjs");
  process.exit(0);
}

const id = process.argv[2] ?? "evt_test_washington_konpa";
const result = await getEvent(id, key);
if (result.gone) {
  console.log(`${id} was withdrawn: stop showing it. (${result.problem.title})`);
} else {
  const e = result.event;
  console.log(e.name);
  console.log(`status: ${e.status} · ${e.display.date_label} · ${e.location.venue}, ${e.location.city}`);
  console.log(`tickets: ${e.display.price_label} (${e.tickets.availability}) → ${e.tickets.buy_url}`);
  console.log(`performers: ${e.performers.map((p) => p.name).join(", ") || "—"}`);
  console.log(`updated_at: ${e.updated_at}`);
}
