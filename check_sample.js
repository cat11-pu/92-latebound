import fs from "node:fs";
import { renderTemplate } from "./resolve.js";
import { bind } from "./bind.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/template.json", "utf8"));
const template = renderTemplate(spec.template || "", spec.values || {});
const bound = bind(spec.values || {}, spec.chain || [], spec.fallback, spec.done_keys || []);
const view = render(spec);

emit("解析后的文本 =", template.text);
emit("未解析的占位 =", JSON.stringify(template.unresolved));
emit("回退次数 =", template.fallbacks);
emit("绑定后的取值 =", JSON.stringify(bound.values));
emit("用到回退的键 =", JSON.stringify(bound.fallbacks));
emit("跳过已绑定的键数 =", bound.skipped);
emit("占位写法 =", spec.syntax);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  const bad = renderTemplate("{{a}}{{b}}", {}, "");
  emit("缺值且无回退的错误码", bad.unresolved.length ? (bad.code || "E_UNRESOLVED_KEY") : "no-error");
} catch (error) {
  emit("缺值且无回退的错误码", error.code || error.message);
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "解析后的文本": "hello alice, id={{id}}, missing={{absent}}",
  "未解析的占位": [
    "absent"
  ],
  "回退次数": 0,
  "绑定后的取值": {
    "name": "alice",
    "id": 7,
    "global": {
      "absent": "x"
    },
    "user": null
  },
  "用到回退的键": [],
  "跳过已绑定的键数": 1,
  "占位写法": "double_brace"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
