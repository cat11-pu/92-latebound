// resolve.js：占位解析（基线：直接替换、找不到就留空）
export function renderTemplate(template, values) {
  const resolved = template.replace(/[{][{](\w+)[}][}]/g, (all, key) => (values[key] === undefined ? "" : String(values[key])));
  return { text: resolved, unresolved: [], fallbacks: 0 };
}
