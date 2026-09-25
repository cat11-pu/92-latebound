// resolve.js：占位解析（点号路径取值、严格/宽松回退、单次线性扫描）
export function renderTemplate(template, values, fallback) {
  const source = String(template == null ? "" : template);
  const root = values || {};
  const hasFallback = fallback !== undefined && fallback !== null && fallback !== "";
  const unresolved = [];
  let fallbacks = 0;
  let text = "";
  let cursor = 0;

  while (cursor < source.length) {
    const open = source.indexOf("{{", cursor);
    if (open === -1) {
      text += source.slice(cursor);
      break;
    }
    const close = source.indexOf("}}", open + 2);
    if (close === -1) {
      const error = new Error("unclosed placeholder at index " + open);
      error.code = "E_UNRESOLVED_KEY";
      throw error;
    }
    text += source.slice(cursor, open);
    const key = source.slice(open + 2, close).trim();
    let current = root;
    let found = key.length > 0;
    if (found) {
      const parts = key.split(".");
      for (let index = 0; index < parts.length; index += 1) {
        if (current !== null && typeof current === "object" &&
            Object.prototype.hasOwnProperty.call(current, parts[index])) {
          current = current[parts[index]];
        } else {
          found = false;
          break;
        }
      }
    }
    if (!found) {
      if (hasFallback) {
        text += String(fallback);
        fallbacks += 1;
      } else {
        unresolved.push(key);
        text += source.slice(open, close + 2);
      }
    } else if (typeof current === "string") {
      text += current;
    } else {
      // 非字符串的值延迟绑定：占位原样保留，不计入未解析
      text += source.slice(open, close + 2);
    }
    cursor = close + 2;
  }

  const result = { text: text, unresolved: unresolved, fallbacks: fallbacks };
  if (unresolved.length > 0) result.code = "E_UNRESOLVED_KEY";
  return result;
}
