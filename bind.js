// bind.js：绑定与回退（基线：不回退、不判重复）
export function bind(values, chain, fallback, done) {
  return { values: values, fallbacks: [], skipped: 0 };
}
