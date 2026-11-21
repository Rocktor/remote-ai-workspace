# 远程 AI 工作台

对客介绍页：<https://rocktor.github.io/remote-ai-workspace/>

纯静态单页，无构建、无外部依赖。`index.html` 是内容，`style.css` 是样式，`app.js` 里是首屏演示剧本（`SCENES`）、月费计算（`TIERS` / `SEATS`）和试点申请生成。`flow.js` 是首屏右侧的工作原理动画（你 → Mac → GitHub → 你），文案在文件顶部的 `TASKS` / `TXT`。英文静态文案在 `i18n.js`。改价格时同时改 `index.html` 里的展示数字和 `app.js` 里的两张价格表。
