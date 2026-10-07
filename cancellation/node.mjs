// node cancellation/node.mjs [cancelled|postponed|rescheduled|sold_out]
import { actionFor, sampleEvents } from "./cancellation.mjs";

const simulate = process.argv[2] ?? "cancelled";
const events = await sampleEvents(simulate);
console.log(`Pretending every sample event is ${simulate}:`);
for (const event of events) {
  const { action, why, showBuyButton } = actionFor(event);
  console.log(`- ${event.name}`);
  console.log(`  status: ${event.status} → ${action.toUpperCase()} (${why}); Get tickets button: ${showBuyButton ? "show" : "hide"}`);
}
