// bind.js：延迟绑定（按链补齐缺失键，done 里已绑定的跳过，幂等）
export function bind(values, chain, fallback, done) {
  const target = values || {};
  const fallbacks = [];
  let skipped = 0;
  const doneKeys = Array.isArray(done) ? done : [];
  const doneSet = new Set(doneKeys);

  for (let index = 0; index < doneKeys.length; index += 1) {
    const key = doneKeys[index];
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      skipped += 1;
    } else {
      target[key] = fallback === undefined || fallback === null ? null : fallback;
      fallbacks.push(key);
    }
  }

  const chainKeys = Array.isArray(chain) ? chain : [];
  for (let index = 0; index < chainKeys.length; index += 1) {
    const key = chainKeys[index];
    if (doneSet.has(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = null;
    }
  }

  return { values: target, fallbacks: fallbacks, skipped: skipped };
}
