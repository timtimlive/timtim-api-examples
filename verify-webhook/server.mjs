// A tiny webhook receiver with node:http — no framework.
//
//   TIMTIM_WEBHOOK_SECRET=your-endpoint-secret node verify-webhook/server.mjs
//
// It listens on http://127.0.0.1:8787/timtim. In production it must be https,
// on a public address you register at https://timtim.live/partners/dashboard.

import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { verifySignature } from "./verify.mjs";

/**
 * @param {{ secret: string, onMessage?: (message: object) => void }} options
 * onMessage gets each NEW, verified message: { id, type, created_at, mode, data }.
 */
export function createWebhookServer({ secret, onMessage = () => {} }) {
  const seen = new Set(); // TimTim-Delivery-Id values already handled (use a database in production)

  return createServer((req, res) => {
    if (req.method !== "POST" || req.url !== "/timtim") {
      res.writeHead(404).end();
      return;
    }
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8"); // the RAW body — verify before parsing
      if (!verifySignature(secret, req.headers["timtim-signature"], raw)) {
        res.writeHead(400, { "Content-Type": "text/plain" }).end("bad signature");
        return;
      }
      const deliveryId = req.headers["timtim-delivery-id"];
      if (deliveryId && seen.has(deliveryId)) {
        res.writeHead(200).end("already handled"); // a retry of something we processed: say OK, do nothing
        return;
      }
      if (deliveryId) seen.add(deliveryId);
      const message = JSON.parse(raw);
      // message.type === "event.changed"    → message.data.event  OR  message.data.withdrawn
      // message.type === "earnings.changed" → message.data.earning (status reversed = refund)
      onMessage(message);
      res.writeHead(200).end("ok"); // answer within 10 seconds, or TimTim.Live retries
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const secret = process.env.TIMTIM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Set TIMTIM_WEBHOOK_SECRET to your endpoint's signing secret (any text works for local testing).");
    process.exit(1);
  }
  const port = Number(process.env.PORT ?? 8787);
  createWebhookServer({ secret, onMessage: (m) => console.log(`received ${m.type} ${m.id}`) }).listen(port, "127.0.0.1", () => {
    console.log(`Listening on http://127.0.0.1:${port}/timtim`);
  });
}
