import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { renderEvents } from "./render.mjs";

function container() {
  const window = new Window();
  const div = window.document.createElement("div");
  window.document.body.append(div);
  return div;
}

test("renders real sample events from the live demo endpoint", async () => {
  const res = await fetch("https://api.timtim.live/v1/demo/events?city=Washington");
  assert.equal(res.status, 200);
  const { events } = await res.json();
  const box = container();
  assert.equal(renderEvents(box, events), events.length);
  assert.equal(box.querySelectorAll("li").length, events.length);
  assert.equal(box.querySelector("h3").textContent, events[0].name);
  for (const a of box.querySelectorAll("a")) assert.ok(a.href.startsWith("https://"));
});

const base = {
  id: "x", name: "A", status: "scheduled", test: true, image: null,
  location: { venue: "V", city: "C" }, display: { date_label: "Sat", price_label: "From $5" },
  tickets: { availability: "available", buy_url: "https://timtim.live/b/x" },
};

test("an event name with HTML stays text", () => {
  const box = container();
  const evil = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
  renderEvents(box, [{ ...base, name: evil }]);
  assert.equal(box.querySelector("h3").textContent, evil);
  assert.equal(box.querySelectorAll("img").length, 0);
  assert.equal(box.querySelectorAll("script").length, 0);
});

test("http and javascript: links and images are left out", () => {
  const box = container();
  renderEvents(box, [
    { ...base, image: "http://insecure.example.com/a.jpg", tickets: { ...base.tickets, buy_url: "http://insecure.example.com/buy" } },
    { ...base, id: "y", image: "javascript:alert(1)", tickets: { ...base.tickets, buy_url: "javascript:alert(1)" } },
  ]);
  assert.equal(box.querySelectorAll("a").length, 0);
  assert.equal(box.querySelectorAll("img").length, 0);
});

test("a cancelled event has no buy link", () => {
  const box = container();
  renderEvents(box, [{ ...base, status: "cancelled" }]);
  assert.equal(box.querySelectorAll("a").length, 0);
  assert.match(box.textContent, /Cancelled/);
});

test("no events shows an empty message", () => {
  const box = container();
  assert.equal(renderEvents(box, []), 0);
  assert.equal(box.textContent, "No events here yet.");
});
