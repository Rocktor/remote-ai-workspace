(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yuan = n => '¥' + n.toLocaleString('en-US');
  const I18N = window.I18N || { lang: 'zh', onChange() {} };
  const en = () => I18N.lang === 'en';

  /* ───────── 界面文字（演示、月费、申请） ───────── */
  const UI = {
    zh: {
      close: '合上电脑', open: '打开电脑', closedText: '电脑已合上 · 工作台不受影响',
      wireOn: '已连接', wireOff: '已断开', idle: '等待任务', waitingLog: '等待任务…', working: '正在处理',
      warn: '额度快用满', ask: '等你回复', done: '已完成 · 等下一件事', me: '你', meAv: '你', botAv: '台', now: '刚刚',
      day: '天',
      personal: '个人', team: '团队', people: n => `${n} 人`, seats: '席',
      unitPersonal: name => `每月，含主机、接入与 Claude ${name} 订阅`,
      unitTeam: parts => `每月，${parts}，含主机、接入与团队席位`,
      errMin: '团队方案 2 人起，一个人用选个人方案更合适。', errMax: '单个团队最多 150 人，更大规模请直接联系我们。',
      perMonth: '月',
      entries: { feishu: '飞书', discord: 'Discord', ssh: 'SSH', desktop: '远程桌面' },
      apply: ['【远程 AI 工作台 · 试点申请】', '称呼：', '方案：', '入口：', '第一件事：'],
      blank: '（未填）', blankTask: '（未填，见面聊）', noEntry: '还没想好',
      copied: '已复制。发给把这个页面转给你的人，我们会联系你。',
      copyFail: '没能自动复制，请选中下面的内容手动复制，再发给把这个页面转给你的人。'
    },
    en: {
      close: 'Close laptop', open: 'Open laptop', closedText: 'Laptop closed · the workspace keeps going',
      wireOn: 'connected', wireOff: 'disconnected', idle: 'waiting for work', waitingLog: 'Waiting for work…', working: 'working',
      warn: 'quota almost used', ask: 'waiting for you', done: 'done · ready for the next job', me: 'You', meAv: 'Y', botAv: 'W', now: 'now',
      day: 'd',
      personal: 'Personal', team: 'Team', people: n => `${n} ${n === 1 ? 'person' : 'people'}`, seats: 'seats',
      unitPersonal: name => `per month, including the machine, integrations and Claude ${name}`,
      unitTeam: parts => `per month, ${parts}, including the machine, integrations and team seats`,
      errMin: 'Team plans start at 2 people. For one person, the personal plan fits better.', errMax: 'A team can have up to 150 people. For more, contact us directly.',
      perMonth: 'mo',
      entries: { feishu: 'Feishu', discord: 'Discord', ssh: 'SSH', desktop: 'Remote desktop' },
      apply: ['[Remote AI Workspace · Pilot request]', 'Name: ', 'Plan: ', 'Channels: ', 'First job: '],
      blank: '(not given)', blankTask: '(not given, let’s talk)', noEntry: 'not sure yet',
      copied: 'Copied. Send it to whoever shared this page with you and we will get in touch.',
      copyFail: 'Could not copy automatically. Select the text below, copy it, and send it to whoever shared this page with you.'
    }
  };
  const ui = () => UI[I18N.lang] || UI.zh;

  /* ───────── 首屏演示剧本 ───────── */
  // chat：对话；term：终端行；log：工作台日志；lid：自动合盖 / 开盖。
  // needOpen：这一步发生在你的电脑上，合着盖时要等你打开。
  const SCENES = {
    zh: {
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
          { chat: 'bot', t: '21:18', final: true, text: '改好了。截止时间和签到方式两处已更新，手机上检查过排版。', files: ['手机预览.png', '预览链接 v2'] },
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
          { log: '写复现测试：同一回调连发两次，失败', t: '18:58' },
          { log: '定位：webhook 处理缺少幂等键', t: '19:03' },
          { log: '修改 payments/webhook.ts', t: '19:09' },
          { log: '跑全量测试：148 / 148 通过', t: '19:21' },
          { log: '推送分支，开 PR #214', t: '19:22' },
          { chat: 'bot', t: '19:22', final: true, text: '修好了。回调没做幂等，重试时会再入一次账。已加幂等键和复现测试，148 项全过。', files: ['PR #214', '测试报告'] },
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
          { chat: 'bot', t: '16:48', ask: true, text: 'Pro 本周额度快用完了，还剩 5 页没改，等恢复要到周一。回「升」换到 Max，当天生效，我接着改。', wait: 2600 },
          { lid: 'open', wait: 1400 },
          { chat: 'me', t: '16:51', text: '升', needOpen: true },
          { log: '已换到 Max · 项目、会话、进度原地不动', t: '16:52' },
          { log: '改完 12 / 12 页，全站截图', t: '17:36' },
          { log: '提交「官网改版」并推送', t: '17:39' },
          { chat: 'bot', t: '17:40', final: true, text: '12 页全部改完，截图在这。中途换到了 Max，进度没丢。', files: ['全站截图.zip', '预览链接'] }
        ]
      }
    },
    en: {
      feishu: {
        title: 'Thread · Book club sign-up', cwd: '~/projects/reading-club', app: 'Feishu', bot: 'Workspace',
        steps: [
          { chat: 'me', t: '21:14', text: 'Move the sign-up deadline to June 14, 6 pm, and change check-in to showing the confirmation email. Send me a phone preview when done.', needOpen: true },
          { chat: 'bot', t: '21:14', text: 'On it, editing the sign-up page.', wait: 900 },
          { log: 'Open reading-club/index.html', t: '21:14' },
          { lid: 'close', wait: 1300 },
          { log: 'Change 2 things: deadline, check-in', t: '21:15' },
          { log: 'Screenshot at 390px phone width', t: '21:16' },
          { log: 'Publish preview v2', t: '21:17' },
          { log: 'Commit “Extend deadline, new check-in” and push', t: '21:17' },
          { chat: 'bot', t: '21:18', final: true, text: 'Done. Deadline and check-in are updated, and the layout is checked on a phone.', files: ['phone-preview.png', 'Preview link v2'] },
          { lid: 'open', wait: 3200 }
        ]
      },
      discord: {
        title: '# shop-api', cwd: '~/projects/shop-api', app: 'Discord', bot: 'Workspace',
        steps: [
          { chat: 'me', t: '18:52', text: 'Payment callbacks sometimes credit twice. Find out why, fix it, and ping me after the tests pass.', needOpen: true },
          { chat: 'bot', t: '18:52', text: 'Got it, reproducing first.', wait: 900 },
          { log: 'Read the last 7 days of callback logs', t: '18:53' },
          { lid: 'close', wait: 1300 },
          { log: 'Write a repro test: same callback twice, fails', t: '18:58' },
          { log: 'Cause: webhook handler has no idempotency key', t: '19:03' },
          { log: 'Edit payments/webhook.ts', t: '19:09' },
          { log: 'Full test run: 148 / 148 passed', t: '19:21' },
          { log: 'Push branch, open PR #214', t: '19:22' },
          { chat: 'bot', t: '19:22', final: true, text: 'Fixed. The callback was not idempotent, so a retry credited again. Added an idempotency key and a repro test, all 148 pass.', files: ['PR #214', 'Test report'] },
          { lid: 'open', wait: 3200 }
        ]
      },
      ssh: {
        title: 'Terminal · your laptop', cwd: '~/projects/shop-api', app: 'SSH', term: true,
        closedText: 'SSH disconnected · the job is still running in tmux',
        steps: [
          { term: 'cmd', text: 'ssh you@mac-07', needOpen: true },
          { term: 'out', text: 'Last login: Fri Nov 20 09:12 · up 12 days', wait: 700 },
          { term: 'cmd', text: 'tmux new -s upgrade', needOpen: true, wait: 800 },
          { term: 'cmd', text: 'claude "upgrade Node 18 to 22 and get all tests passing"', needOpen: true },
          { log: 'Update .nvmrc and package.json', t: '22:40' },
          { lid: 'close', wait: 1300 },
          { log: 'Reinstall dependencies', t: '22:43' },
          { log: 'Tests: 139 / 148, 9 failing', t: '22:51' },
          { log: 'Replace 3 deprecated APIs', t: '23:06' },
          { log: 'Tests: 148 / 148 passed', t: '23:15' },
          { log: 'Commit a41c9e2 “Upgrade to Node 22”', t: '23:15', final: true },
          { lid: 'open', wait: 2600 },
          { term: 'cmd', text: 'ssh you@mac-07 -t tmux attach -t upgrade', needOpen: true },
          { term: 'good', text: '✔ 148/148 passed · committed a41c9e2 · ready for review', needOpen: true, wait: 600 }
        ]
      },
      upgrade: {
        title: 'Thread · Site redesign', cwd: '~/projects/site', app: 'Feishu', bot: 'Workspace',
        steps: [
          { chat: 'me', t: '16:02', text: 'Update all 12 pages of the site to the new design and send me screenshots of everything.', needOpen: true },
          { chat: 'bot', t: '16:02', text: 'On it, starting with the home page.', wait: 900 },
          { log: 'Read the design, split it into 12 page changes', t: '16:03' },
          { lid: 'close', wait: 1300 },
          { log: '7 / 12 pages done', t: '16:41' },
          { log: 'Pro weekly quota 96% used', t: '16:47', warn: true },
          { chat: 'bot', t: '16:48', ask: true, text: 'Pro quota for this week is almost used up and 5 pages are left. It resets on Monday. Reply “upgrade” to switch to Max today and I will keep going.', wait: 2600 },
          { lid: 'open', wait: 1400 },
          { chat: 'me', t: '16:51', text: 'upgrade', needOpen: true },
          { log: 'Switched to Max · project, session and progress untouched', t: '16:52' },
          { log: '12 / 12 pages done, full-site screenshots', t: '17:36' },
          { log: 'Commit “Site redesign” and push', t: '17:39' },
          { chat: 'bot', t: '17:40', final: true, text: 'All 12 pages are done, screenshots attached. Switched to Max halfway, nothing lost.', files: ['site-screenshots.zip', 'Preview link'] }
        ]
      }
    }
  };
  const scenes = () => SCENES[I18N.lang] || SCENES.zh;

  const feed = $('#feed'), log = $('#log'), pane = $('#pane-you'), lidBtn = $('#lid');
  const closedText = $('#closed-text'), notify = $('#notify'), wire = $('#wire');
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const demo = { key: 'feishu', i: 0, timer: 0, closed: false, manual: false, waiting: false, done: false, run: 0 };

  function setLid(closed) {
    demo.closed = closed;
    pane.classList.toggle('is-closed', closed);
    lidBtn.setAttribute('aria-pressed', String(closed));
    $('#lid-label').textContent = closed ? ui().open : ui().close;
    $('#closed').setAttribute('aria-hidden', String(!closed));
    wire.classList.toggle('off', closed);
    $('#wire-text').textContent = closed ? ui().wireOff : ui().wireOn;
    if (!closed) notify.classList.remove('show');
    if (!closed && demo.waiting) { demo.waiting = false; schedule(350); }
  }

  const scrollEnd = node => { node.scrollTop = node.scrollHeight; };

  function addChat(scene, step) {
    const me = step.chat === 'me';
    const m = el('div', 'msg ' + (me ? 'me' : 'bot'));
    m.innerHTML = `<span class="msg-av">${me ? ui().meAv : ui().botAv}</span><div><div class="msg-meta"><b>${me ? ui().me : scene.bot}</b><span>${step.t}</span></div><div class="msg-text">${esc(step.text)}</div>${step.files ? '<div class="msg-files">' + step.files.map(f => `<span>${esc(f)}</span>`).join('') + '</div>' : ''}</div>`;
    feed.append(m); scrollEnd(feed);
    if ((step.final || step.ask) && demo.closed) {
      notify.innerHTML = `<div class="notify-app"><span>${esc(scene.app)} · ${ui().now}</span><span>${step.t}</span></div><b>${esc(scene.title)}</b><p>${esc(step.text)}</p>`;
      notify.classList.add('show');
    }
  }
  function addTerm(step) { feed.append(el('div', 'tline ' + step.term, esc(step.text))); scrollEnd(feed); }
  function addLog(step) {
    const prev = log.querySelector('.lline:not(.done)'); if (prev) prev.classList.add('done');
    $('.log-empty', log)?.remove();
    log.append(el('div', 'lline' + (step.warn ? ' warn' : ''), `<time>${step.t}</time><i class="mark"></i><span>${esc(step.log)}</span>`));
    scrollEnd(log);
    $('#box-state').textContent = step.warn ? ui().warn : ui().working;
    if (step.final) finishLog();
  }
  function finishLog() { $$('.lline', log).forEach(l => l.classList.add('done')); $('#box-state').textContent = ui().done; }

  function apply(scene, step) {
    if (step.chat) {
      if (step.final) finishLog();
      if (step.ask) { $$('.lline', log).forEach(l => l.classList.add('done')); $('#box-state').textContent = ui().ask; }
      addChat(scene, step);
    } else if (step.term) addTerm(step);
    else if (step.log) addLog(step);
    else if (step.lid && !demo.manual) setLid(step.lid === 'close');
  }

  function schedule(ms) { clearTimeout(demo.timer); demo.timer = setTimeout(tick, ms); }

  function tick() {
    const scene = scenes()[demo.key], step = scene.steps[demo.i];
    if (!step) { demo.done = true; return; }
    if (step.needOpen && demo.closed) { demo.waiting = true; return; }
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
    const scene = scenes()[key];
    feed.innerHTML = ''; feed.classList.toggle('term', !!scene.term);
    log.innerHTML = `<div class="log-empty">${ui().waitingLog}</div>`;
    notify.classList.remove('show'); notify.innerHTML = '';
    $('#you-title').textContent = scene.title;
    $('#cwd').textContent = scene.cwd;
    $('#box-state').textContent = ui().idle;
    closedText.textContent = scene.closedText || ui().closedText;
    setLid(false);
    $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.scene === key)));
    if (reduced) {
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
  setLid(false);

  // 连续在线计时
  const upEl = $('#uptime'); let up = 12 * 86400 + 4 * 3600 + 21 * 60 + 7;
  const pad = n => String(n).padStart(2, '0');
  const showUp = () => { const d = Math.floor(up / 86400), r = up % 86400; upEl.textContent = `${d}${en() ? '' : ' '}${ui().day} ${pad(Math.floor(r / 3600))}:${pad(Math.floor(r % 3600 / 60))}:${pad(r % 60)}`; };
  showUp(); setInterval(() => { up++; showUp(); }, 1000);

  // 演示进入视口再开播；访客已经点过某个场景，就不再用默认场景覆盖
  const stage = $('.stage');
  $('#log').innerHTML = `<div class="log-empty">${ui().waitingLog}</div>`;
  $('#box-state').textContent = ui().idle;
  const go = () => {
    if (demo.run) return;
    start('feishu');
    if (!reduced) setTimeout(() => !demo.manual && lidBtn.classList.add('nudge'), 9000);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { threshold: .25 });
    io.observe(stage);
  } else go();

  /* ───────── 月费 ───────── */
  const TIERS = { pro: ['Pro', 1000], max: ['Max', 2500], ultra: ['Ultra', 4000] };
  const SEATS = { standard: 1000, premium: 2500 };
  const price = { plan: 'personal' };
  const applyPlan = $('#apply-plan');

  function seatCount(id) {
    let v = parseInt($('#seat-' + id).value, 10);
    if (!Number.isFinite(v) || v < 0) v = 0; if (v > 150) v = 150;
    return v;
  }
  function teamParts() {
    const s = seatCount('standard'), p = seatCount('premium');
    return { s, p, n: s + p, cost: s * SEATS.standard + p * SEATS.premium, parts: [s && `${s} Standard`, p && `${p} Premium`].filter(Boolean).join(' + ') || `0 ${ui().seats}` };
  }
  function renderApplyOptions() {
    const keep = applyPlan.value;
    const t = teamParts(), u = ui();
    const opts = Object.entries(TIERS).map(([id, [name, cost]]) => [id, `${u.personal} · ${name} (${yuan(cost)} / ${u.perMonth})`]);
    opts.push(['team', `${u.team} · ${t.parts} (${yuan(t.cost)} / ${u.perMonth})`]);
    applyPlan.innerHTML = opts.map(([v, txt]) => `<option value="${v}">${esc(txt)}</option>`).join('');
    applyPlan.value = keep || 'max';
  }
  function renderBill() {
    const err = $('#bill-error'), u = ui(); err.textContent = '';
    renderApplyOptions();
    if (price.plan === 'personal') {
      const id = $('input[name="tier"]:checked').value, [name, cost] = TIERS[id];
      $('#bill-label').textContent = `${u.personal} · ${name}`;
      $('#bill-total').textContent = yuan(cost);
      $('#bill-unit').textContent = u.unitPersonal(name);
      applyPlan.value = id;
    } else {
      const t = teamParts();
      $('#bill-label').textContent = `${u.team} · ${u.people(t.n)}`;
      $('#bill-total').textContent = yuan(t.cost);
      $('#bill-unit').textContent = u.unitTeam(t.parts);
      if (t.n < 2) err.textContent = u.errMin;
      else if (t.n > 150) err.textContent = u.errMax;
      applyPlan.value = 'team';
    }
  }
  function setPlan(plan) {
    price.plan = plan;
    $$('.switch button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.plan === plan)));
    $('#plans-personal').hidden = plan !== 'personal';
    $('#plans-team').hidden = plan !== 'team';
    $('#when-personal').hidden = plan !== 'personal';
    renderBill();
  }
  $$('.switch button').forEach(b => b.addEventListener('click', () => setPlan(b.dataset.plan)));
  $$('input[name="tier"]').forEach(r => r.addEventListener('change', renderBill));
  $$('.stepper button').forEach(b => b.addEventListener('click', () => {
    $('#seat-' + b.dataset.for).value = Math.min(150, Math.max(0, seatCount(b.dataset.for) + Number(b.dataset.step)));
    renderBill();
  }));
  $$('.stepper input').forEach(i => {
    i.addEventListener('input', renderBill);
    i.addEventListener('blur', () => { i.value = seatCount(i.id.replace('seat-', '')); renderBill(); });
  });
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
    const d = new FormData(form), u = ui(), L = u.apply;
    const entries = d.getAll('entry').map(v => u.entries[v] || v);
    const text = [
      L[0],
      L[1] + ((d.get('name') || '').trim() || u.blank),
      L[2] + applyPlan.options[applyPlan.selectedIndex].text,
      L[3] + (entries.length ? entries.join(en() ? ', ' : '、') : u.noEntry),
      L[4] + ((d.get('task') || '').trim() || u.blankTask)
    ].join('\n');
    out.textContent = text; out.hidden = false;
    const ok = await copy(text);
    hint.classList.toggle('ok', ok);
    hint.textContent = ok ? u.copied : u.copyFail;
  });

  /* ───────── 切换语言 ───────── */
  I18N.onChange(() => {
    renderBill();
    showUp();
    out.hidden = true; hint.classList.remove('ok');
    if (demo.run) start(demo.key);
    else { setLid(false); $('#log').innerHTML = `<div class="log-empty">${ui().waitingLog}</div>`; $('#box-state').textContent = ui().idle; }
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
