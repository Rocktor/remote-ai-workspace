/* 双语：页面里写的是中文；英文在这里。按浏览器语言自动选，右上角可手动切换并记住。 */
(() => {
  'use strict';
  const EN = {
    skip: 'Skip to demo',
    brand: 'Remote AI Workspace',
    navLabel: 'Page sections',
    nav1: 'Demo', nav2: 'Channels', nav3: 'Setup', nav4: 'Pricing', nav5: 'FAQ',
    langBtn: '中文', langLabel: '切换到中文',
    ctaTop: 'Join the pilot',

    heroMeta1: 'Pilot open', heroMeta2: 'First batch: 3–4 machines', heroMeta3: 'Billed monthly',
    heroTitle: 'Remote AI Workspace',
    heroSub: 'A Mac mini that stays on around the clock, with Claude Code installed and connected to your Feishu and Discord. Send a message and it gets to work.',
    heroCta: 'Join the pilot', heroPrice: 'from ¥1,000/mo',
    heroNote: 'The first batch is small. Machines are set up in the order requests come in.',
    deviceAlt: 'Mac mini host',
    scUp: 'up 12 days', scRow1: 'running tests', scRow2: '3 threads', scRow3: '2 channels',
    feishu: 'Feishu',

    s1Title: 'Close your laptop.<br>The work keeps going.',
    s1Sub: 'Tasks run on this Mac, not on the computer in front of you. Go out, lose Wi‑Fi, go to sleep. It keeps working and pings you in the thread when it is done.',
    stageLabel: 'Workspace demo', tabsLabel: 'Choose a scenario', tabUpgrade: 'Out of quota', replay: 'Replay',
    yourSide: 'Your side', boxSide: 'The workspace', online: 'online', uptime: 'Up for',
    stageNote: 'The demo uses sample tasks. The flow is the same as real use.',

    s2Title: 'Hand it work in chat.<br>Get results in the thread.',
    s2Sub: 'No new tools to learn. Come in from Feishu, Discord or a terminal. It is the same machine and the same projects either way.',
    e1: 'One thread per job. Describe it, review the changes, reply to approve. Works for people who never open a terminal.',
    e2: 'One channel per project. Several projects move at once without getting mixed up.',
    e3: 'Connect straight to the terminal and run Claude Code, tests and builds in tmux. Disconnect and come back, the session is still there.',
    e4t: 'Remote desktop',
    e4: 'When you need to see the screen, open its desktop and use Xcode, simulators and browsers.',
    mapTitle: 'Every thread gets its own folder.',
    mapText: 'Each thread or channel maps to one project on the machine, with its own folder, session and credentials. Redesign the site here, fix the API there, nothing crosses over. After each round, the project can be pushed to your own GitHub.',
    map1: 'Site redesign', map3: 'Weekly report', mapBusy: 'working', mapWait: 'needs you', mapDone: 'delivered', mapGit: 'After each round',

    s3Title: 'Out of quota?<br>Reply with one word.',
    s3Sub: 'Claude usage is counted per 5 hours and per week. When you are about to run out, it asks in the thread. Reply “upgrade” to move up a tier and the current job carries on where it is.',
    cmBotAv: 'W', cmBot: 'Workspace',
    cmAsk: 'Pro quota for this week is almost used up and 5 pages are left. It resets on Monday. Reply “upgrade” to switch to Max and I will keep going.',
    cmYouAv: 'Y', cmYou: 'You', cmUp: 'upgrade',
    cmSys: 'Switched to Max · project and session untouched',
    cmDone: 'All 12 pages are done. Screenshots attached.',
    sig1t: 'Pro is enough', sig1: 'A few small jobs a day, and you rarely see a quota warning.',
    sig2t: 'Time for Max', sig2: 'You hit “quota used up, resets in a few hours” more than once a week, or you start running full test suites and large refactors.',
    sig3t: 'Time for Ultra', sig3: 'Two or three projects at once, or long jobs running overnight, and Max runs out before the weekend.',

    s4Title: 'Ready on day one.',
    s4Sub: 'All of this is set up before you get the machine. Sign in with your own account and send the first job.',
    rdPre: 'preinstalled', rdFeishu: 'Feishu bot', rdOn: 'connected', rdDiscord: 'Discord bot', rdGit: 'GitHub sync', rdSet: 'configured',
    rdOpen: 'enabled', rdOther: 'Other tools', rdAsk: 'on request',
    spModel: 'Model', spMem: 'Memory', spDisk: 'Storage', spDiskV: '256 GB and up', spOn: 'Uptime', spOnV: '24 hours, always on',
    spOwn: 'Access', spOwnV: 'The whole machine is yours for the term', spIn: 'Ways in', spInV: 'Feishu · Discord · SSH · Remote desktop',

    s5Title: 'We look after the machine.<br>The projects are yours.',
    s5Sub: 'We rack it, connect it and keep it running. You just hand it work.',
    c1t: 'Yours alone', c1: 'Each Mac is rented to one customer and never shared during the term.',
    c2t: 'Looked after', c2: 'Power, network or system problems are ours to fix.',
    c3t: 'Take it anywhere', c3: 'Projects can sync to your own GitHub after every round, so nothing is locked on the machine.',
    c4t: 'Wiped at the end', c4: 'When you leave we export your projects, revoke credentials and wipe the whole machine.',

    s6Title: 'One monthly price.<br>Three quota tiers.',
    s6Sub: 'The machine, the integrations, upkeep and the Claude subscription are all included. The tiers differ only in quota, and you can switch any time.',
    planLabel: 'Plan type', planPersonal: 'Personal', planTeam: 'Team',
    perMonth: '/ month', perSeat: '/ seat / month',
    proFit: 'Now and then', proDesc: 'A few jobs a day: edit a page, write a script, read code, tidy up documents.', proUnit: 'Base quota',
    maxFlag: 'Most chosen', maxFit: 'Every day', maxDesc: 'Steady development, lots of debugging, tests running all day.', maxUnit: 'About 5× the Pro quota',
    ultraFit: 'Nonstop', ultraDesc: 'Several projects at once, long jobs back to back.', ultraUnit: 'About 10× the Pro weekly quota',
    stdDesc: 'Members who use Claude Code day to day.', preDesc: 'Heavy users who need more quota.',
    stdMinus: 'Remove a Standard seat', stdCount: 'Standard seats', stdPlus: 'Add a Standard seat',
    preMinus: 'Remove a Premium seat', preCount: 'Premium seats', prePlus: 'Add a Premium seat',
    seatNote: '2–150 people in one organization, any mix of seat types. The machine belongs to your organization only, and each member has their own sign-in and folder.',
    inc1: 'A dedicated machine and project folders', inc2: 'Feishu, Discord, SSH and remote desktop access', inc3: 'The Claude subscription for your tier', inc4: 'Upkeep and fixes',
    inc5: 'Upgrade the same day when quota runs out; the difference is prorated for the rest of the month',
    billCta: 'Apply with this plan',
    fine: 'The subscription is on a Claude account in your own (or your organization’s) name, which you sign in to and keep. Its cost is included in the monthly price. The account has to meet Anthropic’s terms of use and supported regions, which we check together before setup. These are pilot prices, billed in RMB. Usage beyond the subscription quota and extra software are not included.',

    s7Title: 'Bring a real job<br>and try it.',
    s7Sub: '3–4 machines in the first batch, billed monthly, no annual contract. If it does not work for you, export your projects and go.',
    st1t: 'Talk it through', st1: 'Tell us the first job you want to hand over. We pick the channels and tier and check the account requirements.',
    st2t: 'Setup', st2: 'We prepare the machine, install everything, connect Feishu or Discord and hand you the sign-in.',
    st3t: 'Run the first job', st3: 'Go from request to result once, then disconnect and reconnect to make sure everything is still there.',
    st4t: 'Decide at month end', st4: 'Renew, change tier, or leave.',
    fTitle: 'Fill this in to create a request',
    fName: 'Your name', fNamePh: 'Name or team', fPlan: 'Plan', fEntry: 'Channels you want',
    fTask: 'The first job you would hand over', fTaskPh: 'e.g. move our company site from WordPress to a static site; send a data report every Monday',
    fSubmit: 'Copy request',
    fHint: 'Send it to whoever shared this page with you and we will get in touch. Nothing is collected or uploaded from this page.',

    s8Title: 'FAQ',
    q1: 'Whose Claude account is it?', a1: 'Yours. The subscription is in your own name, and you sign in and keep the password. The account has to meet Anthropic’s terms of use and supported regions, which we check together before setup.',
    q2: 'Does the job really keep running after I close my laptop?', a2: 'Yes. It runs on the remote Mac and reports back in your Feishu or Discord thread when it is done. Over SSH, the job lives in tmux and is there when you reconnect. Anything that needs your own approval waits for you.',
    q3: 'What happens when I run out of quota?', a3: 'It tells you in the thread. Wait for the quota to reset, or reply “upgrade” to move up a tier the same day. The difference is prorated for the rest of the month, and the current job carries on.',
    q4: 'If something happens to the account, do I lose my work?', a4: 'No. Projects, context and the Feishu and Discord connections live on the machine and can sync to your GitHub. Once the account is sorted out, or another one is connected, it picks up where it stopped.',
    q5: 'Is the machine dedicated?', a5: 'Personal plans get one machine per person. Team plans get one machine per organization, with a separate sign-in and folder for each member. Our upkeep covers the machine and environment only. We do not look at your projects.',
    q6: 'What can I do on it?', a6: 'Software development, builds, testing and related automation: writing code, building sites, running scripts, processing data, iOS and macOS builds. If your work is mostly office tasks, tell us and we can set you up on a Windows or Ubuntu machine instead.',
    q7: 'What if I want to stop?', a7: 'It is billed monthly, so just don’t renew. We export your projects, revoke the bots and credentials, and wipe the machine.',
    q8: 'I can’t code. Can I still use it?', a8: 'Yes. In Feishu, describe what you need the way you would to a colleague. It sends the result back and you ask for changes.',

    endTitle: 'Give your projects<br>a Mac that never turns off.',
    footText: 'Pilot stage. Prices and specs are confirmed in your setup agreement. Claude and Claude Code are Anthropic products. Mac and macOS are trademarks of Apple. Feishu and Discord belong to their owners. This service is not affiliated with any of these companies.'
  };

  const META_EN = {
    title: 'Remote AI Workspace',
    description: 'A Mac mini that stays on around the clock, with Claude Code installed and connected to your Feishu and Discord. Send a message and it gets to work. Billed monthly, pilot open.'
  };

  const ZH = {}, ZH_ATTR = {};
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const attrNodes = [...document.querySelectorAll('[data-i18n-attr]')];
  nodes.forEach(n => { const k = n.dataset.i18n; if (!(k in ZH)) ZH[k] = n.innerHTML; });
  const pairs = n => n.dataset.i18nAttr.split(';').map(p => p.split(':'));
  attrNodes.forEach(n => pairs(n).forEach(([a, k]) => { if (!(k in ZH_ATTR)) ZH_ATTR[k] = n.getAttribute(a); }));
  ZH.langBtn = 'EN'; ZH_ATTR.langLabel = 'Switch to English';
  const metaDesc = document.querySelector('meta[name="description"]');
  const META_ZH = { title: document.title, description: metaDesc.content };

  const listeners = [];
  const I18N = {
    lang: window.__lang === 'en' ? 'en' : 'zh',
    text(key) { return this.lang === 'en' ? (EN[key] ?? ZH[key]) : ZH[key]; },
    onChange(fn) { listeners.push(fn); },
    set(lang, remember) {
      this.lang = lang === 'en' ? 'en' : 'zh';
      const en = this.lang === 'en';
      nodes.forEach(n => { const k = n.dataset.i18n; n.innerHTML = en ? (EN[k] ?? ZH[k]) : ZH[k]; });
      attrNodes.forEach(n => pairs(n).forEach(([a, k]) => n.setAttribute(a, en ? (EN[k] ?? ZH_ATTR[k]) : ZH_ATTR[k])));
      document.documentElement.lang = en ? 'en' : 'zh-CN';
      const m = en ? META_EN : META_ZH;
      document.title = m.title; metaDesc.content = m.description;
      document.documentElement.classList.remove('i18n-pending');
      if (remember) { try { localStorage.setItem('lang', this.lang); } catch (e) { /* 隐私模式 */ } }
      listeners.forEach(fn => fn(this.lang));
    },
    missing() { return Object.keys(ZH).filter(k => !(k in EN)).concat(Object.keys(ZH_ATTR).filter(k => !(k in EN))); }
  };
  window.I18N = I18N;
  document.getElementById('lang-btn').addEventListener('click', () => I18N.set(I18N.lang === 'en' ? 'zh' : 'en', true));
  if (I18N.lang === 'en') I18N.set('en'); else document.documentElement.classList.remove('i18n-pending');
})();
