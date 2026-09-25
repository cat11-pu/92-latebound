// app.js：渲染结果
import { renderTemplate } from "./resolve.js";
import { bind } from "./bind.js";

export function render(spec) {
  const template = renderTemplate(spec.template || "", spec.values || {});
  const bound = bind(spec.values || {}, spec.chain || [], spec.fallback, spec.done_keys || []);
  return { text: template.text, unresolved: template.unresolved, fallbacks: template.fallbacks,
           bound: bound.values, used_fallback: bound.fallbacks, skipped: bound.skipped, idempotent: true };
}
