// app.js：渲染结果
import { renderTemplate } from "./resolve.js";
import { bind } from "./bind.js";

export function render(spec) {
  const values = spec.values || {};
  const mode = spec.mode || "strict";
  const fallback = mode === "strict" ? undefined : spec.fallback;
  const template = renderTemplate(spec.template || "", values, fallback);
  const bound = bind(values, spec.chain || [], spec.fallback, spec.done_keys || []);
  const again = renderTemplate(template.text, values, fallback);
  return { text: template.text, unresolved: template.unresolved, fallbacks: template.fallbacks,
           bound: bound.values, used_fallback: bound.fallbacks, skipped: bound.skipped,
           idempotent: again.text === template.text };
}
