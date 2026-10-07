import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createWebhookServer } from "./server.mjs";
import { sendDeliveries } from "./send-deliveries.mjs";
import { sign, verifySignature } from "./verify.mjs";

const SECRET = "example-endpoint-secret";

test("known-answer vector: the same bytes the server signs", () => {
  const body = '{"id":"whd_example","type":"event.changed"}';
  assert.equal(sign(SECRET, 1700000000, body), "t=1700000000,v1=85a5c34573f2bbcfc43ec2a6b3c0e81e2f7afb9ebc3434270231999c8c86461a");
  assert.equal(verifySignature(SECRET, sign(SECRET, 1700000000, body), body, 1700000000), true);
});

test("verifySignature refuses tampering, wrong secrets, stale times and junk", () => {
  const now = 1700000000;
  const body = '{"a":1}';
  const header = sign(SECRET, now, body);
  assert.equal(verifySignature(SECRET, header, body, now), true);
  assert.equal(verifySignature(SECRET, header, '{"a":2}', now), false);
  assert.equal(verifySignature("other", header, body, now), false);
  assert.equal(verifySignature(SECRET, header, body, now + 301), false);
  assert.equal(verifySignature(SECRET, header, body, now - 301), false);
  for (const junk of [undefined, "", "t=,v1=", "v1=abc", `t=${now}`, `t=${now},v1=${"0".repeat(64)}`]) {
    assert.equal(verifySignature(SECRET, junk, body, now), false, String(junk));
  }
  assert.equal(header.split("v1=")[1], createHmac("sha256", SECRET).update(`${now}.${body}`).digest("hex"));
});

test("the node:http receiver accepts a signed delivery, refuses forged and stale ones, and handles a repeat once", async () => {
  const received = [];
  const server = createWebhookServer({ secret: SECRET, onMessage: (m) => received.push(m) });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  try {
    const r = await sendDeliveries(`http://127.0.0.1:${port}/timtim`, SECRET);
    assert.deepEqual(r, { signed: 200, forged: 400, stale: 400, repeat: 200 });
    assert.equal(received.length, 1, "the repeated delivery id must be handled only once");
    assert.equal(received[0].type, "event.changed");
    assert.equal(received[0].data.event.status, "cancelled");
  } finally {
    server.close();
  }
});
