// TIMTIM_TEST_KEY=tt_test_… node changed-events/node.mjs
// Polls GET /events?changed_since=… every minute and keeps a local copy.
import { pollOnce } from "./sync.mjs";

const key = process.env.TIMTIM_TEST_KEY;
if (!key) {
  console.log("SKIPPED: changed_since needs a key. Get a free test key at https://timtim.live/partners/dashboard,");
  console.log("then run: TIMTIM_TEST_KEY=tt_test_YOUR_KEY node changed-events/node.mjs");
  process.exit(0);
}

const store = new Map();
let since = new Date(Date.now() - 24 * 3600 * 1000).toISOString(); // first run: the last day
const rounds = Number(process.env.ROUNDS ?? 1);

for (let i = 0; i < rounds; i++) {
  const { next, pages } = await pollOnce({ key, since, store });
  console.log(`changed since ${since}: ${pages} page(s); now holding ${store.size} event(s)`);
  for (const e of store.values()) console.log(`- ${e.status.padEnd(11)} ${e.name}`);
  since = next;
  if (i < rounds - 1) await new Promise((r) => setTimeout(r, 60_000));
}
