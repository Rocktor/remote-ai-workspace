/* 首屏「工作原理」示意图：你 → Mac（Claude Code）→ GitHub → 你，循环播放。 */
(() => {
  'use strict';
  const flow = document.getElementById('flow');
  if (!flow) return;
  const I18N = window.I18N || { lang: 'zh', onChange() {} };
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('flow-svg');
  const nodes = { you: flow.querySelector('.fn-you'), mac: flow.querySelector('.fn-mac'), git: flow.querySelector('.fn-git') };
  const lines = { you: document.getElementById('fn-you'), mac: document.getElementById('fn-mac'), git: document.getElementById('fn-git') };
  const tags = [...flow.querySelectorAll('.flow-tag')];
  const chips = [...flow.querySelectorAll('.fn-chips span')];
  const steps = [...document.querySelectorAll('.flow-steps li')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 560px)');

  /* ───────── 文案 ───────── */
  const TASKS = {
    zh: [
      { entry: 'feishu', ask: '「登录页报错，修一下」', work: ['读代码…', '改了 3 个文件', '测试 24/24 通过 ✓'], branch: 'fix/login', commits: 3, pr: 42 },
      { entry: 'discord', ask: '「报表加个导出按钮」', work: ['读代码…', '新增导出组件', '测试 31/31 通过 ✓'], branch: 'feat/export', commits: 2, pr: 43 },
      { entry: 'ssh', ask: '$ claude "升级依赖"', work: ['检查依赖…', '升级了 12 个包', '构建通过 ✓'], branch: 'chore/deps', commits: 1, pr: 44 },
      { entry: 'desktop', ask: '桌面上开个终端：补 README', work: ['读项目结构…', '写好 README', '链接检查通过 ✓'], branch: 'docs/readme', commits: 1, pr: 45 }
    ],
    en: [
      { entry: 'feishu', ask: '“The login page errors out. Fix it.”', work: ['Reading code…', '3 files changed', 'Tests 24/24 passed ✓'], branch: 'fix/login', commits: 3, pr: 42 },
      { entry: 'discord', ask: '“Add an export button to the report.”', work: ['Reading code…', 'Export component added', 'Tests 31/31 passed ✓'], branch: 'feat/export', commits: 2, pr: 43 },
      { entry: 'ssh', ask: '$ claude "upgrade dependencies"', work: ['Checking packages…', '12 packages upgraded', 'Build passed ✓'], branch: 'chore/deps', commits: 1, pr: 44 },
      { entry: 'desktop', ask: 'Opens a terminal on the desktop: “write the README”', work: ['Reading the project…', 'README written', 'Links checked ✓'], branch: 'docs/readme', commits: 1, pr: 45 }
    ]
  };
  const TXT = {
    zh: {
      wait: '等你派活', idle: '等推送',
      push: t => `↑ ${t.branch} · ${t.commits} 个提交`,
      pr: t => `PR #${t.pr} 已开`,
      back: t => `✓ PR #${t.pr} 好了，点开就能看`
    },
    en: {
      wait: 'waiting for a job', idle: 'waiting for a push',
      push: t => `↑ ${t.branch} · ${t.commits} commit${t.commits > 1 ? 's' : ''}`,
      pr: t => `PR #${t.pr} opened`,
      back: t => `✓ PR #${t.pr} is ready. Tap to review.`
    }
  };
  const tasks = () => TASKS[I18N.lang] || TASKS.zh;
  const tx = () => TXT[I18N.lang] || TXT.zh;

  /* ───────── 节奏：每一段是「节点在忙」或「包在线上跑」 ───────── */
  const PHASES = [
    { d: 1500, node: 'you', step: 0, at: [[0, t => { setEntry(t.entry); say('you', t.ask); say('mac', tx().wait, 'sent'); }]] },
    { d: 1100, edge: 0, step: 0, at: [[0, () => lines.you.classList.add('sent')]] },
    { d: 2600, node: 'mac', step: 1, busy: true, at: [[0, t => say('mac', t.work[0])], [900, t => say('mac', t.work[1])], [1800, t => say('mac', t.work[2], 'ok')]] },
    { d: 1000, edge: 1, step: 2 },
    { d: 1700, node: 'git', step: 2, at: [[0, t => say('git', tx().push(t))], [850, t => say('git', tx().pr(t), 'ok')]] },
    { d: 1100, edge: 2, step: 3, ok: true },
    { d: 2400, node: 'you', step: 3, ok: true, at: [[0, t => say('you', tx().back(t), 'ok')]] }
  ];
  const stepMs = steps.map((_, i) => PHASES.filter(p => p.step === i).reduce((a, p) => a + p.d, 0));

  function say(k, text, cls) {
    const n = lines[k];
    n.textContent = text;
    n.className = n.className.replace(/\s*\b(ok|sent|in)\b/g, '');
    if (cls) n.classList.add(cls);
    void n.offsetWidth;
    n.classList.add('in');
  }
  function setEntry(entry) { chips.forEach(c => c.classList.toggle('on', c.dataset.entry === entry)); }

  /* ───────── 连线：按节点的实际位置画 ───────── */
  svg.innerHTML = '<defs><filter id="fglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter></defs>';
  const edges = [0, 1, 2].map(i => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'edge' + (i === 2 ? ' ok' : ''));
    const base = document.createElementNS(NS, 'path'); base.setAttribute('class', 'e-base');
    const glow = document.createElementNS(NS, 'path'); glow.setAttribute('class', 'e-trail e-glow'); glow.setAttribute('filter', 'url(#fglow)');
    const trail = document.createElementNS(NS, 'path'); trail.setAttribute('class', 'e-trail');
    const head = document.createElementNS(NS, 'path'); head.setAttribute('class', 'e-head');
    g.append(base, glow, trail, head); svg.append(g);
    return { g, base, trails: [glow, trail], head, len: 0 };
  });
  const pkt = document.createElementNS(NS, 'g'); pkt.setAttribute('class', 'pkt');
  pkt.innerHTML = '<circle class="pkt-halo" r="11" filter="url(#fglow)"/><circle class="pkt-core" r="3.4"/>';
  svg.append(pkt);
  tags[2].classList.add('ok');

  const box = el => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  // side：r 右 / l 左 / t 上 / b 下；at：沿这条边的位置（0–1）
  function anchor(el, side, at) {
    const b = box(el), gap = 7;
    if (side === 'r') return { x: b.x + b.w + gap, y: b.y + b.h * at, nx: 1, ny: 0 };
    if (side === 'l') return { x: b.x - gap, y: b.y + b.h * at, nx: -1, ny: 0 };
    if (side === 't') return { x: b.x + b.w * at, y: b.y - gap, nx: 0, ny: -1 };
    return { x: b.x + b.w * at, y: b.y + b.h + gap, nx: 0, ny: 1 };
  }
  function curve(a, b, k0, k1) {
    const c0 = { x: a.x + a.nx * k0, y: a.y + a.ny * k0 }, c1 = { x: b.x + b.nx * k1, y: b.y + b.ny * k1 };
    return `M${a.x},${a.y} C${c0.x},${c0.y} ${c1.x},${c1.y} ${b.x},${b.y}`;
  }
  function arrow(p, q) {
    const a = Math.atan2(p.y - q.y, p.x - q.x), s = 6;
    const pt = d => `${p.x - Math.cos(a + d) * s},${p.y - Math.sin(a + d) * s}`;
    return `M${p.x},${p.y} L${pt(.5)} L${pt(-.5)} Z`;
  }
  function layout() {
    const W = flow.clientWidth, H = flow.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const { you, mac, git } = nodes;
    let ds;
    if (narrow.matches) {
      const ys = anchor(you, 'b', .28), mt = anchor(mac, 't', .28), mb = anchor(mac, 'b', .28), gt = anchor(git, 't', .28);
      const gr = anchor(git, 'r', .5), yr = anchor(you, 'r', .5);
      const k = Math.max(16, (W - 10 - Math.max(gr.x, yr.x)) / .75);
      ds = [curve(ys, mt, 12, 12), curve(mb, gt, 12, 12), curve(gr, yr, k, k)];
    } else {
      const yo = anchor(you, 'r', .3), ml = anchor(mac, 'l', .5);
      const mb = anchor(mac, 'b', .5), gt = anchor(git, 't', .5);
      const gl = anchor(git, 'l', .5), yi = anchor(you, 'r', .72);
      const h = (p, q) => Math.max(24, Math.abs(q.x - p.x) * .55);
      const v = (p, q) => Math.max(12, Math.abs(q.y - p.y) * .5);
      ds = [curve(yo, ml, h(yo, ml), h(yo, ml)), curve(mb, gt, v(mb, gt), v(mb, gt)), curve(gl, yi, h(gl, yi), h(gl, yi))];
    }
    edges.forEach((e, i) => {
      e.base.setAttribute('d', ds[i]);
      e.len = e.base.getTotalLength();
      e.trails.forEach(t => { t.setAttribute('d', ds[i]); t.style.strokeDasharray = `${TRAIL} ${e.len + TRAIL}`; t.style.strokeDashoffset = String(TRAIL); });
      const end = e.base.getPointAtLength(e.len), pre = e.base.getPointAtLength(Math.max(0, e.len - 4));
      e.head.setAttribute('d', arrow(end, pre));
      const m = e.base.getPointAtLength(e.len / 2);
      tags[i].style.left = m.x + 'px'; tags[i].style.top = m.y + 'px';
    });
    flow.classList.add('ready');
    if (state.edge != null) drawPacket(state.edge, state.p);
  }
  const TRAIL = 72;

  /* ───────── 播放 ───────── */
  const state = { cycle: 0, phase: -1, start: 0, elapsed: 0, fired: 0, edge: null, p: 0, raf: 0, visible: false };
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  function drawPacket(i, p) {
    const e = edges[i], s = ease(p) * e.len;
    const pt = e.base.getPointAtLength(s);
    pkt.setAttribute('transform', `translate(${pt.x},${pt.y})`);
    e.trails.forEach(t => { t.style.strokeDashoffset = String(TRAIL - s); });
  }
  function enter(idx) {
    const ph = PHASES[idx];
    state.phase = idx; state.fired = 0; state.edge = ph.edge ?? null; state.p = 0;
    Object.values(nodes).forEach(n => n.classList.remove('on', 'ok', 'busy'));
    if (ph.node) nodes[ph.node].classList.add(ph.ok ? 'ok' : 'on');
    if (ph.busy) nodes[ph.node].classList.add('busy');
    edges.forEach((e, i) => e.g.classList.toggle('on', i === ph.edge));
    tags.forEach((t, i) => t.classList.toggle('on', i === ph.edge));
    pkt.classList.toggle('show', ph.edge != null);
    pkt.classList.toggle('ok', !!ph.ok);
    if (ph.edge != null) drawPacket(ph.edge, 0);
    steps.forEach((s, i) => {
      if (i === ph.step && !s.classList.contains('on')) { s.style.setProperty('--step-ms', stepMs[i] + 'ms'); s.classList.remove('done'); void s.offsetWidth; s.classList.add('on'); }
      if (i !== ph.step) s.classList.remove('on');
      s.classList.toggle('done', i < ph.step);
    });
  }
  function frame(now) {
    state.raf = 0;
    if (!state.visible) return;
    if (state.phase < 0) { enter(0); state.start = now; }
    let ph = PHASES[state.phase], t = now - state.start;
    while (t >= ph.d) {
      fire(ph, Infinity);
      state.start += ph.d; t -= ph.d;
      let next = state.phase + 1;
      if (next >= PHASES.length) { next = 0; state.cycle++; }
      enter(next); ph = PHASES[next];
    }
    fire(ph, t);
    if (ph.edge != null) { state.p = Math.min(1, t / ph.d); drawPacket(ph.edge, state.p); }
    state.elapsed = t;
    state.raf = requestAnimationFrame(frame);
  }
  function fire(ph, t) {
    const list = ph.at || [], task = tasks()[state.cycle % tasks().length];
    while (state.fired < list.length && list[state.fired][0] <= t) { list[state.fired][1](task); state.fired++; }
  }
  function play() {
    if (state.raf || reduced.matches) return;
    state.visible = true;
    state.start = performance.now() - state.elapsed;
    state.raf = requestAnimationFrame(frame);
  }
  function pause() { state.visible = false; if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0; }

  // 不动画时：画好连线，节点显示一轮做完后的样子
  function still() {
    const t = tasks()[0];
    setEntry(t.entry); say('you', t.ask); say('mac', t.work[2], 'ok'); say('git', tx().pr(t), 'ok');
    tags.forEach(tag => tag.classList.add('on'));
  }

  /* ───────── 启动 ───────── */
  layout();
  if ('ResizeObserver' in window) {
    let q = 0;
    const ro = new ResizeObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; layout(); }); });
    ro.observe(flow); Object.values(nodes).forEach(n => ro.observe(n));
  } else addEventListener('resize', layout);
  narrow.addEventListener?.('change', layout);

  let onScreen = true;
  const idle = () => { say('mac', tx().wait, 'sent'); say('git', tx().idle, 'sent'); };
  if (reduced.matches) still();
  else {
    idle();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { onScreen = es[es.length - 1].isIntersecting; onScreen && !document.hidden ? play() : pause(); }, { threshold: .15 }).observe(flow);
    } else play();
    document.addEventListener('visibilitychange', () => (document.hidden || !onScreen) ? pause() : play());
  }

  I18N.onChange(() => {
    if (reduced.matches) { still(); return; }
    // 换语言：这一轮从头放，文字全部换成新语言
    pause(); state.phase = -1; state.elapsed = 0;
    idle();
    if (onScreen && !document.hidden) play();
  });
})();
