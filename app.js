(() => {
  'use strict';

  const id = name => document.getElementById(name);
  const plans = new Map(window.catalog.map(plan => [plan.id, plan]));
  const examples = new Map([
    ['field-notes', '作品展示页'],
    ['delivery', '飞书交付回执'],
    ['code-review', '代码与测试'],
    ['channels', 'Discord 项目频道'],
  ]);
  const oldLinks = {
    '#service/mac': '#plan/personal',
    '#service/desktop': '#environment',
    '#service/studio': '#example/field-notes',
    '#service/feishu': '#example/delivery',
    '#service/ssh': '#example/code-review',
    '#service/discord': '#example/channels',
    '#catalog': '#plans',
    '#guide': '#plans',
    '#saved': '#plans',
    '#reference': '#environment',
  };
  function sampleUrl(path) {
    const key = path.split('?')[0];
    const link = document.querySelector('a[data-sample="' + key + '"]');
    return window.offlineSamples?.[key] || link?.getAttribute('href') || path;
  }
  document.querySelectorAll('a[data-sample]').forEach(link => {
    link.href = sampleUrl(link.getAttribute('href'));
  });

  function displayFeature(index) {
    const key = index === 1 ? 'team' : 'personal';
    const plan = plans.get(key);
    const visual = id('feature-img');
    visual.src = plan.image;
    visual.alt = plan.alt;
    id('feature-link').href = '#plan/' + key;
    id('feature-name').textContent = plan.name;
    if (id('feature-price')) id('feature-price').textContent = key === 'team' ? '¥1,000 / 人 / 月起' : '¥1,000 / 月起';
    if (id('feature-kind')) id('feature-kind').textContent = key === 'team' ? '团队工作空间' : '个人工作空间';
    document.querySelectorAll('[data-slide]').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.dataset.slide) === index));
    });
  }
  document.querySelectorAll('[data-slide]').forEach(button => {
    button.addEventListener('click', () => displayFeature(Number(button.dataset.slide)));
  });

  function showExample(key) {
    const node = id('detail');
    const title = examples.get(key);
    const src = sampleUrl('samples/' + key + '.html');
    node.innerHTML = '<article class="sample-page"><a class="sample-back" href="#examples">← 返回交付样例</a>'
      + '<h1></h1><div class="sample-actions"><a target="_blank" rel="noopener">在新窗口打开</a>'
      + '<a download>下载 HTML</a></div><iframe sandbox="allow-scripts allow-forms allow-downloads"></iframe></article>';
    node.querySelector('h1').textContent = title;
    node.querySelectorAll('.sample-actions a').forEach(link => { link.href = src; });
    node.querySelector('[download]').download = key + '.html';
    const frame = node.querySelector('iframe');
    frame.title = title;
    frame.src = src;
    document.title = title + ' · 远程 AI 工作台';
  }

  let lastHash = null;
  function route() {
    let hash = location.hash || '#home';
    if (oldLinks[hash]) {
      hash = oldLinks[hash];
      history.replaceState(null, '', hash);
    }
    const plan = hash.startsWith('#plan/') && plans.get(hash.slice(6));
    const example = hash.startsWith('#example/') && hash.slice(9);
    const hasDetail = Boolean(plan || examples.has(example));
    id('shop').hidden = hasDetail;
    id('detail').hidden = !hasDetail;
    if (hasDetail) {
      if (plan) {
        window.renderDetail(plan, id('detail'));
        document.title = plan.name + ' · 远程 AI 工作台';
      } else {
        showExample(example);
      }
      window.scrollTo({top:0, behavior:'instant'});
      if (lastHash !== null) {
        const heading = id('detail').querySelector('h1');
        if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
      }
    } else {
      id('detail').replaceChildren();
      document.title = '远程 AI 工作台 · 云端工作空间';
      const anchor = hash === '#home' ? null : id(hash.slice(1));
      if (anchor) {
        requestAnimationFrame(() => anchor.scrollIntoView({block:'start', behavior:'instant'}));
      } else {
        window.scrollTo({top:0, behavior:'instant'});
      }
    }
    document.querySelectorAll('aside nav a').forEach(link => {
      const selected = link.getAttribute('href') === hash;
      if (selected) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    lastHash = hash;
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey &&
        anchor.getAttribute('href') === location.hash && !id('shop').hidden) {
      event.preventDefault();
      route();
    }
  });
  route();
})();
