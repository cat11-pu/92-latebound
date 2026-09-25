// bind.js：延迟绑定（按链依次补齐缺失键；done 里已绑定的键跳过，幂等）
export function bind(values, chain, fallback, done) {
  const target = values || {};
  const doneKeys = Array.isArray(done) ? done : [];
  const doneSet = new Set(doneKeys);
  const chainKeys = Array.isArray(chain) ? chain : [];
  const usedFallback = [];
  let skipped = 0;

  // done 里登记过且确实已有值的键视为已绑定，直接跳过
  for (let index = 0; index < doneKeys.length; index += 1) {
    const key = doneKeys[index];
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      skipped += 1;
    } else {
      target[key] = fallback === undefined || fallback === null ? null : fallback;
      usedFallback.push(key);
    }
  }

  // 沿链补齐：链上缺失的键补 null，登记在 done 里的不覆盖
  for (let index = 0; index < chainKeys.length; index += 1) {
    const key = chainKeys[index];
    if (doneSet.has(key)) continue;
    if (!Object.prototype.hasOwnProperty.call(target, key)) {
      target[key] = null;
    }
  }

  return { values: target, fallbacks: usedFallback, skipped: skipped };
}
