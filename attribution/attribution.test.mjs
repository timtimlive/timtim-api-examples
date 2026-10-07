import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { withSubId } from "./attribution.mjs";

test("adds sub_id and keeps the rest of the link exactly", () => {
  assert.equal(withSubId("https://timtim.live/b/abc~sig", "click-42"), "https://timtim.live/b/abc~sig?sub_id=click-42");
  assert.equal(withSubId("https://timtim.live/b/abc?x=1", "a.b_c~d-e"), "https://timtim.live/b/abc?x=1&sub_id=a.b_c%7Ed-e");
  assert.equal(withSubId("https://timtim.live/partners/demo#buy-evt_1", "c1"), "https://timtim.live/partners/demo?sub_id=c1#buy-evt_1");
});

test("refuses a sub_id the contract does not allow", () => {
  for (const bad of ["", "has space", "a/b", "x".repeat(101), "émoji", "a&b=c"]) {
    assert.throws(() => withSubId("https://timtim.live/b/abc", bad), /sub_id must be/, JSON.stringify(bad));
  }
  assert.doesNotThrow(() => withSubId("https://timtim.live/b/abc", "x".repeat(100)));
});

test("refuses a link that is not https", () => {
  assert.throws(() => withSubId("http://timtim.live/b/abc", "c1"), /https/);
});

test("works on a real buy_url from the live demo endpoint", () => {
  const out = execFileSync(process.execPath, [fileURLToPath(new URL("./node.mjs", import.meta.url)), "test-click-1"], { encoding: "utf8" });
  const link = out.match(/your link: (\S+)/)[1];
  const url = new URL(link);
  assert.equal(url.protocol, "https:");
  assert.equal(url.searchParams.get("sub_id"), "test-click-1");
});
