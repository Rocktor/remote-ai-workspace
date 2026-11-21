(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yuan = n => '¥' + n.toLocaleString('en-US');

  /* ───────── 首屏演示 ───────── */
  // 每一步：chat（你/工作台说话）、term（终端行）、log（工作台日志）、lid（自动合盖/开盖）。
  // needOpen: 这一步发生在你的电脑上，合着盖时要等你打开。
  const SCENES = {
    feishu: {
      title: '话题 · 读书会报名页', cwd: '~/projects/reading-club', app: '飞书', bot: '工作台',
      steps: [
        { chat: 'me', t: '21:14', text: '把报名截止改到 6 月 14 日 18:00，签到改成出示确认邮件。改完发我手机预览。', needOpen: true },
        { chat: 'bot', t: '21:14', text: '收到，正在改报名页。', wait: 900 },
        { log: '打开 reading-club/index.html', t: '21:14' },
        { lid: 'close', wait: 1300 },
        { log: '修改 2 处：截止时间、签到方式', t: '21:15' },
        { log: '按 390px 手机宽度截图检查', t: '21:16' },
        { log: '发布预览 v2', t: '21:17' },
        { log: '提交「延后截止，改签到方式」并推送', t: '21:17' },
        { chat: 'bot', t: '21:18', final: true, text: '✅ 改好了。截止时间和签到方式 2 处已更新，手机上检查过排版。', files: ['手机预览.png', '预览链接 v2'] },
        { lid: 'open', wait: 3200 }
      ]
    },
    discord: {
      title: '# shop-api', cwd: '~/projects/shop-api', app: 'Discord', bot: '工作台',
      steps: [
        { chat: 'me', t: '18:52', text: '支付回调偶尔重复入账。查一下原因，修掉，测试跑完再叫我。', needOpen: true },
        { chat: 'bot', t: '18:52', text: '收到，先复现问题。', wait: 900 },
        { log: '翻最近 7 天的回调日志', t: '18:53' },
        { lid: 'close', wait: 1300 },
        { log: '写复现测试：同一回调连发两次 → 失败', t: '18:58' },
        { log: '定位：webhook 处理缺少幂等键', t: '19:03' },
        { log: '修改 payments/webhook.ts', t: '19:09' },
        { log: '跑全量测试：148 / 148 通过', t: '19:21' },
        { log: '推送分支，开 PR #214', t: '19:22' },
        { chat: 'bot', t: '19:22', final: true, text: '✅ 修好了。原因是回调没做幂等，重试时会再入一次账。已加幂等键和复现测试，148 项全过。', files: ['PR #214', '测试报告'] },
        { lid: 'open', wait: 3200 }
      ]
    },
    ssh: {
      title: '终端 · 你的笔记本', cwd: '~/projects/shop-api', app: 'SSH', term: true,
      closedText: 'SSH 已断开 · 任务还在主机的 tmux 里跑',
      steps: [
        { term: 'cmd', text: 'ssh you@mac-07', needOpen: true },
        { term: 'out', text: 'Last login: Fri Nov 20 09:12 · up 12 days', wait: 700 },
        { term: 'cmd', text: 'tmux new -s upgrade', needOpen: true, wait: 800 },
        { term: 'cmd', text: 'claude "把 Node 18 升到 22，全量测试跑通"', needOpen: true },
        { log: '更新 .nvmrc 和 package.json', t: '22:40' },
        { lid: 'close', wait: 1300 },
        { log: '重装依赖', t: '22:43' },
        { log: '跑测试：139 / 148，9 项失败', t: '22:51' },
        { log: '替换 3 处已弃用的 API', t: '23:06' },
        { log: '跑测试：148 / 148 通过', t: '23:15' },
        { log: '提交 a41c9e2「升级到 Node 22」', t: '23:15', final: true },
        { lid: 'open', wait: 2600 },
        { term: 'cmd', text: 'ssh you@mac-07 -t tmux attach -t upgrade', needOpen: true },
        { term: 'good', text: '✔ 148/148 通过 · 已提交 a41c9e2 · 等你 review', needOpen: true, wait: 600 }
      ]
    },
    upgrade: {
      title: '话题 · 官网改版', cwd: '~/projects/site', app: '飞书', bot: '工作台',
      steps: [
        { chat: 'me', t: '16:02', text: '官网 12 个页面都按新设计稿改一遍，改完把全站截图发我。', needOpen: true },
        { chat: 'bot', t: '16:02', text: '收到，从首页开始。', wait: 900 },
        { log: '读设计稿，拆出 12 个页面的改动', t: '16:03' },
        { lid: 'close', wait: 1300 },
        { log: '改完 7 / 12 页', t: '16:41' },
        { log: 'Pro 本周额度已用 96%', t: '16:47', warn: true },
        { chat: 'bot', t: '16:48', ask: true, text: '⚠️ Pro 本周额度快用完了，还剩 5 页没改，等额度恢复要到周一。回「升」换到 Max，当天生效，我接着改。', wait: 2600 },
        { lid: 'open', wait: 1400 },
        { chat: 'me', t: '16:51', text: '升', needOpen: true },
        { log: '已换到 Max · 项目、会话、进度原地不动', t: '16:52' },
        { log: '改完 12 / 12 页，全站截图', t: '17:36' },
        { log: '提交「官网改版」并推送', t: '17:39' },
        { chat: 'bot', t: '17:40', final: true, text: '✅ 12 页全部改完，截图在这。中途换到了 Max，进度一点没丢。', files: ['全站截图.zip', '预览链接'] }
      ]
    }
  };

  const feed = $('#feed'), log = $('#log'), pane = $('#pane-you'), lidBtn = $('#lid');
  const closedText = $('#closed-text'), notify = $('#notify'), wire = $('#wire');
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const demo = { key: 'feishu', i: 0, timer: 0, closed: false, manual: false, waiting: false, done: false, run: 0 };

  function setLid(closed) {
    demo.closed = closed;
    pane.classList.toggle('is-closed', closed);
    lidBtn.setAttribute('aria-pressed', String(closed));
    $('#lid-label').textContent = closed ? '打开电脑' : '合上电脑';
    $('#closed').setAttribute('aria-hidden', String(!closed));
    wire.classList.toggle('off', closed);
    $('#wire-text').textContent = closed ? '已断开' : '已连接';
    if (!closed) notify.classList.remove('show');
    if (!closed && demo.waiting) { demo.waiting = false; schedule(350); }
  }

  function scrollEnd(node) { node.scrollTop = node.scrollHeight; }

  function addChat(scene, step) {
    const me = step.chat === 'me';
    const m = el('div', 'msg ' + (me ? 'me' : 'bot'));
    m.innerHTML = `<span class="msg-av">${me ? '你' : '台'}</span><div><div class="msg-meta"><b>${me ? '你' : scene.bot}</b><span>${step.t}</span></div><div class="msg-text">${esc(step.text)}</div>${step.files ? '<div class="msg-files">' + step.files.map(f => `<span>${esc(f)}</span>`).join('') + '</div>' : ''}</div>`;
    feed.append(m); scrollEnd(feed);
    if ((step.final || step.ask) && demo.closed) {
      notify.innerHTML = `<div class="notify-app"><span>${scene.app} · 刚刚</span><span>${step.t}</span></div><b>${esc(scene.title)}</b><p>${esc(step.text)}</p>`;
      notify.classList.add('show');
    }
  }
  function addTerm(step) { feed.append(el('div', 'tline ' + step.term, esc(step.text))); scrollEnd(feed); }
  function addLog(step) {
    const prev = log.querySelector('.lline:not(.done)'); if (prev) prev.classList.add('done');
    $('.log-empty', log)?.remove();
    const l = el('div', 'lline' + (step.warn ? ' warn' : ''), `<time>${step.t}</time><i class="mark"></i><span>${esc(step.log)}</span>`);
    log.append(l); scrollEnd(log);
    $('#box-state').textContent = step.warn ? '额度快用满' : '正在处理';
    if (step.final) finishLog();
  }
  function finishLog() {
    $$('.lline', log).forEach(l => l.classList.add('done'));
    $('#box-state').textContent = '已完成 · 等下一件事';
  }

  function apply(scene, step) {
    if (step.chat) {
      if (step.final) finishLog();
      if (step.ask) { $$('.lline', log).forEach(l => l.classList.add('done')); $('#box-state').textContent = '等你回复'; }
      addChat(scene, step);
    }
    else if (step.term) addTerm(step);
    else if (step.log) addLog(step);
    else if (step.lid && !demo.manual) setLid(step.lid === 'close');
  }

  function schedule(ms) { clearTimeout(demo.timer); demo.timer = setTimeout(tick, ms); }

  function tick() {
    const scene = SCENES[demo.key], step = scene.steps[demo.i];
    if (!step) { demo.done = true; return; }
    if (step.needOpen && demo.closed) { demo.waiting = true; return; } // 等你打开电脑
    apply(scene, step);
    demo.i++;
    const next = scene.steps[demo.i];
    if (!next) { demo.done = true; return; }
    let wait = step.wait || (step.log ? 1500 : 1100);
    if (next.lid && demo.manual) wait = 200;
    schedule(wait);
  }

  function start(key) {
    clearTimeout(demo.timer);
    Object.assign(demo, { key, i: 0, manual: false, waiting: false, done: false, run: demo.run + 1 });
    const scene = SCENES[key];
    feed.innerHTML = ''; feed.classList.toggle('term', !!scene.term);
    log.innerHTML = '<div class="log-empty">等待任务…</div>';
    notify.classList.remove('show'); notify.innerHTML = '';
    $('#you-title').textContent = scene.title;
    $('#cwd').textContent = scene.cwd;
    $('#box-state').textContent = '等待任务';
    closedText.textContent = scene.closedText || '电脑已合上 · 工作台不受影响';
    setLid(false);
    $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.scene === key)));
    if (reduced) { // 不播动画：直接给出结果
      demo.manual = true;
      scene.steps.forEach(s => apply(scene, s));
      demo.i = scene.steps.length; demo.done = true;
      return;
    }
    schedule(700);
  }

  $$('.tabs button').forEach(b => b.addEventListener('click', () => start(b.dataset.scene)));
  $('#replay').addEventListener('click', () => start(demo.key));
  lidBtn.addEventListener('click', () => { demo.manual = true; lidBtn.classList.remove('nudge'); setLid(!demo.closed); });

  // 连续在线计时
  const upEl = $('#uptime'); let up = 12 * 86400 + 4 * 3600 + 21 * 60 + 7;
  const pad = n => String(n).padStart(2, '0');
  setInterval(() => { up++; const d = Math.floor(up / 86400), r = up % 86400; upEl.textContent = `${d} 天 ${pad(Math.floor(r / 3600))}:${pad(Math.floor(r % 3600 / 60))}:${pad(r % 60)}`; }, 1000);

  // 进入视口再开播，离开标签页暂停不处理（脚本很短）
  const stage = $('#demo');
  // 访客已经点过某个场景，就不再用默认场景覆盖
  const go = () => { if (demo.run) return; start('feishu'); if (!reduced) setTimeout(() => !demo.manual && lidBtn.classList.add('nudge'), 9000); };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { threshold: .25 });
    io.observe(stage);
  } else go();

  /* ───────── 月费 ───────── */
  const TIERS = { pro: ['Pro', 1000], max: ['Max', 2500], ultra: ['Ultra', 4000] };
  const SEATS = { standard: 1000, premium: 2500 };
  const price = { plan: 'personal' };
  const applyPlan = $('#apply-plan'), teamOpt = $('#apply-team');

  function seatCount(id) {
    const input = $('#seat-' + id); let v = parseInt(input.value, 10);
    if (!Number.isFinite(v) || v < 0) v = 0; if (v > 150) v = 150;
    return v;
  }
  function renderBill() {
    const err = $('#bill-error'); err.textContent = '';
    if (price.plan === 'personal') {
      const id = $('input[name="tier"]:checked').value, [name, cost] = TIERS[id];
      $('#bill-label').textContent = '个人 · ' + name;
      $('#bill-total').textContent = yuan(cost);
      $('#bill-unit').textContent = `每月，含主机、接入与 Claude ${name} 订阅`;
      applyPlan.value = `个人 · ${name}（${yuan(cost)} / 月）`;
    } else {
      const s = seatCount('standard'), p = seatCount('premium'), n = s + p, cost = s * SEATS.standard + p * SEATS.premium;
      const parts = [s && `${s} Standard`, p && `${p} Premium`].filter(Boolean).join(' + ') || '0 席';
      $('#bill-label').textContent = `团队 · ${n} 人`;
      $('#bill-total').textContent = yuan(cost);
      $('#bill-unit').textContent = `每月，${parts}，含主机、接入与团队席位`;
      if (n < 2) err.textContent = '团队方案 2 人起，一个人用选个人方案更合适。';
      else if (n > 150) err.textContent = '单个团队最多 150 人，更大的规模请直接联系我们。';
      teamOpt.textContent = teamOpt.value = `团队 · ${parts}（${yuan(cost)} / 月）`;
      applyPlan.value = teamOpt.value;
    }
  }
  function setPlan(plan) {
    price.plan = plan;
    $$('.seg-switch button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.plan === plan)));
    $('#plans-personal').hidden = plan !== 'personal';
    $('#plans-team').hidden = plan !== 'team';
    $('#when-personal').hidden = plan !== 'personal';
    renderBill();
  }
  $$('.seg-switch button').forEach(b => b.addEventListener('click', () => setPlan(b.dataset.plan)));
  $$('input[name="tier"]').forEach(r => r.addEventListener('change', renderBill));
  $$('.stepper button').forEach(b => b.addEventListener('click', () => {
    const input = $('#seat-' + b.dataset.for);
    input.value = Math.min(150, Math.max(0, seatCount(b.dataset.for) + Number(b.dataset.step)));
    renderBill();
  }));
  $$('.stepper input').forEach(i => {
    i.addEventListener('input', renderBill);
    i.addEventListener('blur', () => { i.value = seatCount(i.id.replace('seat-', '')); renderBill(); });
  });
  teamOpt.value = teamOpt.textContent;
  renderBill();

  /* ───────── 试点申请 ───────── */
  const form = $('#apply'), out = $('#apply-out'), hint = $('#apply-hint');
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* 走老办法 */ }
    const ta = el('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove(); return ok;
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = new FormData(form);
    const entries = d.getAll('entry');
    const text = [
      '【远程 AI 工作台 · 试点申请】',
      '称呼：' + ((d.get('name') || '').trim() || '（未填）'),
      '方案：' + d.get('plan'),
      '入口：' + (entries.length ? entries.join('、') : '还没想好'),
      '第一件事：' + ((d.get('task') || '').trim() || '（未填，见面聊）')
    ].join('\n');
    out.textContent = text; out.hidden = false;
    const ok = await copy(text);
    hint.classList.toggle('ok', ok);
    hint.textContent = ok ? '已复制。发给把这个页面转给你的人，我们会联系你。' : '没能自动复制，请长按或选中下面的内容手动复制，再发给把这个页面转给你的人。';
  });

  /* ───────── 旧链接兼容 ───────── */
  function legacy() {
    const h = location.hash;
    if (!/^#(plan\/|plans|environment|examples|home|shop)/.test(h)) return;
    if (h === '#plan/team') setPlan('team');
    const target = h.startsWith('#plan') ? '#pricing' : h === '#environment' ? '#kit' : h === '#examples' ? '#demo' : '#top';
    history.replaceState(null, '', target);
    $(target)?.scrollIntoView();
  }
  addEventListener('hashchange', legacy); legacy();
})();
