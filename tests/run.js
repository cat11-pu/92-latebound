import assert from "node:assert";
import { renderTemplate } from "../resolve.js";
import { bind } from "../bind.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const values = { a: 1 };

check("renderTemplate returns text", () => {
  assert.strictEqual(typeof renderTemplate("x", values).text, "string");
});

check("renderTemplate reports unresolved", () => {
  assert.ok(Array.isArray(renderTemplate("x", values).unresolved));
});

check("bind returns values", () => {
  assert.strictEqual(typeof bind(values, [], null, []).values, "object");
});

check("bind reports skipped", () => {
  assert.strictEqual(typeof bind(values, [], null, []).skipped, "number");
});

check("render exposes idempotent flag", () => {
  assert.strictEqual(typeof render({ template: "x", values: values, chain: [], fallback: null, done_keys: [] }).idempotent, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
