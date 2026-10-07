// Show events as cards — safely. Event names and places are text written by
// other people, so they are set with textContent (never innerHTML), and only
// https links and images are used.
// Contract: the Event object (components.schemas.Event) from listEvents / listDemoEvents.

function safeHttps(value) {
  try {
    return typeof value === "string" && new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/** Fills `container` with one card per event. Returns the number of cards. */
export function renderEvents(container, events) {
  const doc = container.ownerDocument;
  const el = (tag, text) => {
    const node = doc.createElement(tag);
    if (text != null) node.textContent = String(text);
    return node;
  };

  container.replaceChildren();
  if (!events.length) {
    container.append(el("p", "No events here yet."));
    return 0;
  }
  const list = el("ul");
  list.setAttribute("aria-label", "Events");
  for (const e of events) {
    const card = el("li");
    const image = safeHttps(e.image);
    if (image) {
      const img = el("img");
      img.src = image;
      img.alt = "";
      card.append(img);
    }
    if (e.test) card.append(el("small", "Sample — no real money"));
    card.append(el("h3", e.name));
    card.append(el("p", [e.display?.date_label, e.location?.venue, e.location?.city].filter(Boolean).join(" · ")));
    if (e.display?.price_label) card.append(el("p", e.display.price_label));
    const buy = safeHttps(e.tickets?.buy_url);
    const canBuy = buy && e.status !== "cancelled" && e.tickets?.availability !== "sold_out" && e.tickets?.availability !== "ended";
    if (canBuy) {
      const a = el("a", "Get tickets");
      a.href = buy; // use buy_url exactly as given: it carries your attribution
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", `Get tickets: ${e.name}`);
      card.append(a);
    } else if (e.status === "cancelled") {
      card.append(el("p", "Cancelled"));
    }
    list.append(card);
  }
  container.append(list);
  return events.length;
}
