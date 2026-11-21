(() => {
  const shapes = {
    back: '<path d="m14 6-6 6 6 6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    down: '<path d="M12 4v12m-5-5 5 5 5-5M5 20h14"/>',
    file: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h4"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6 6.5h.1m2.5 0h.1"/>',
    photo: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m4 16 5-5 4 4 3-3 4 4"/><circle cx="15" cy="9" r="1"/>',
    check: '<path d="m5 12 4 4 10-10"/>',
    open: '<path d="M13 5h6v6m0-6-9 9m-1-8H5v13h13v-5"/>',
    list: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h1m3 0h4m-8 4h1m3 0h4m-8 4h1m3 0h4"/>'
  };
  const icon = name => '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + shapes[name] + '</svg>';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const lines = values => (values || []).map(v => '<li>' + escape(v) + '</li>').join('');
  const sectionRows = (values, label) => (values || []).map((value, i) => '<tr><th scope="row">' + label + ' ' + String(i + 1).padStart(2, '0') + '</th><td>' + escape(value) + '</td></tr>').join('');
  const route = hash => /^#[\w-]+$/.test(hash) ? hash : '#catalog';
  function saveText(item) {
    const text = [
      item.name, item.category, item.price, '', item.summary, '', '需要准备', item.input, '',
      '交付物', ...item.outputs, '', '验收方式', ...item.accept, '', '实施步骤', ...item.steps, '', '服务条件', ...item.terms
    ].join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], {type: 'text/plain;charset=utf-8'}));
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name + '-配置单.txt';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const macGuide = () => `<section class="rd-mac" aria-labelledby="rd-mac-title">
    <h2 id="rd-mac-title">独享 Mac 是怎样工作的？</h2>
    <div class="rd-network">
      <div class="rd-hop"><span class="rd-hop-icon">${icon('window')}</span><div><h3>本地设备</h3><p>发指令，看进度</p></div></div>
      <span class="rd-wire" aria-hidden="true">→</span>
      <div class="rd-hop rd-host"><span class="rd-hop-icon">${icon('list')}</span><div><h3>远程主机</h3><p>运行 Agent，保存工作目录</p></div></div>
      <span class="rd-wire" aria-hidden="true">→</span>
      <div class="rd-hop"><span class="rd-hop-icon">${icon('file')}</span><div><h3>项目工具</h3><p>访问获授权的模型、仓库和依赖</p></div></div>
    </div>
    <p class="rd-network-note">从本地断开连接后，只要远端主机在线、任务能在后台运行，测试就可以继续。重新连入时查看同一份日志；遇到登录、审批或主机重启，任务可能暂停。</p>
    <h3 class="rd-compare-title">参考产品与本次试点</h3>
    <div class="rd-compare"><table><thead><tr><th scope="col">项目</th><th scope="col">Agent.Space 独享 Mac</th><th scope="col">我们的主机试点</th></tr></thead><tbody>
      <tr><th scope="row">主机与月费</th><td>Mac mini M4，16 GB / 256 GB。第二批早鸟价 US$160/月，美国或欧洲机位由平台分配。</td><td>参考配置 M4、16 GB、256 GB 起。主机意向价 ¥1,000／台／月，实际配置、机位和地区在开通前确认。</td></tr>
      <tr><th scope="row">工具与账号</th><td>预装 Claude Code 和 Codex，使用者自行登录模型账号。</td><td>按项目确认开发工具、模型订阅与仓库权限；订阅和用量由使用者承担。</td></tr>
      <tr><th scope="row">远程操作</th><td>浏览器或 Mac 客户端可查看整台桌面，Mac 客户端还可单独打开远端 App 窗口。</td><td>按任务确认 SSH 或远程桌面。验收时在约定的入口断开重连，取回测试日志或文件。</td></tr>
      <tr><th scope="row">交付与退出</th><td>交付后开始计费；订阅结束后保留数据 3 天，再抹除。</td><td>开通前约定支持时段和数据取回期限。退租时先导出成果并核对，再撤销授权、按约清理。</td></tr>
    </tbody></table></div>
    <p class="rd-source">参考条件核对于 2026 年 11 月 21 日。<a href="https://agent.space/zh-hans/mac" target="_blank" rel="noopener">查看 Agent.Space 官方说明 ${icon('open')}</a></p>
  </section>`;
  window.renderDetail = (item, node, returnHash) => {
    const e = escape, sample = item.sample ? e(item.sample) : '', image = e(item.image);
    const back = '<a class="rd-back" href="' + route(returnHash) + '">' + icon('back') + '返回服务市场</a>';
    const previewLink = sample ? '<a class="rd-linkout" href="' + sample + '" target="_blank" rel="noopener">' + icon('open') + e(item.sampleLabel || '新窗口打开样例') + '</a>' : '';
    const sampleAction = sample
      ? '<a class="rd-action" href="' + sample + '" target="_blank" rel="noopener">打开交付样例' + icon('open') + '</a><a class="rd-secondary" href="' + sample + '" download="' + e(item.id) + '.html">' + icon('down') + '下载源文件</a>'
      : '<button class="rd-action" type="button" data-save>保存配置单' + icon('down') + '</button><button type="button" class="rd-secondary" data-scroll>查看交付明细</button>';
    node.innerHTML = `<article class="rd">
      <div class="rd-dark"><div class="rd-wrap">
        <nav class="rd-crumb" aria-label="详情导航">${back}<span aria-hidden="true">/</span><span>${e(item.category)}</span></nav>
        <div class="rd-hero">
          <div class="rd-gallery">
            <div class="rd-frame" id="rd-visual">
              <img class="rd-cover" src="${image}" alt="${e(item.alt)}">
              <div class="rd-sheets" hidden>
                <div class="rd-sheet">${icon('list')}<h3>交付清单</h3><ul>${lines(item.outputs)}</ul></div>
              </div>
              ${sample ? '<div class="rd-embed" hidden></div>' : ''}
            </div>
            <div class="rd-gallerybar" role="group" aria-label="切换预览">
              <button type="button" class="rd-thumb" data-view="cover" aria-pressed="true" aria-controls="rd-visual"><span class="rd-minicover"><img src="${image}" alt=""></span><span>封面</span></button>
              ${sample ? '<button type="button" class="rd-thumb" data-view="sample" aria-pressed="false" aria-controls="rd-visual"><span class="rd-minipage">' + icon('window') + '</span><span>成品预览</span></button>' : ''}
              <button type="button" class="rd-thumb" data-view="sheet" aria-pressed="false" aria-controls="rd-visual"><span class="rd-minisheet">${icon('list')}</span><span>交付清单</span></button>
            </div>
          </div>
          <div class="rd-summary">
            <div class="rd-box">
              <div class="rd-category"><i aria-hidden="true"></i>${e(item.category)}${item.tag && item.tag !== item.category ? ' <span> / </span> ' + e(item.tag) : ''}</div>
              <h1>${e(item.name)}</h1><p class="rd-lead">${e(item.summary)}</p>
              <div class="rd-facts"><span>准备资料</span><p>${e(item.input)}</p><span>交付内容</span><ul>${lines(item.outputs)}</ul></div>
              <div class="rd-pricing"><span>方案费用</span><strong>${e(item.price)}</strong></div>
              <div class="rd-actions">${sampleAction}</div>
            </div>
            ${item.terms?.length ? '<div class="rd-note">' + icon('file') + '<div><h3>开通前确认</h3><p>' + e(item.terms[0]) + '</p></div></div>' : ''}
          </div>
        </div>
      </div></div>
      <div class="rd-light"><div class="rd-wrap rd-content" tabindex="-1">
        ${item.id === 'mac' ? macGuide() : ''}
        <section class="rd-spec" tabindex="-1"><h2>交付明细</h2><div class="rd-table-wrap"><table><tbody>
        <tr><th scope="row">所需资料</th><td>${e(item.input)}</td></tr>${sectionRows(item.outputs,'交付物')}${sectionRows(item.accept,'验收项')}
        ${sample ? '<tr><th scope="row">成品样例</th><td>' + previewLink + '</td></tr>' : ''}
        </tbody></table></div></section>
        <section class="rd-process"><h2>交付流程</h2><ol>${(item.steps || []).map((s,i)=>'<li><span aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span><p>'+e(s)+'</p></li>').join('')}</ol></section>
        ${item.terms?.length ? '<section class="rd-terms"><h2>服务条件</h2><ul>' + item.terms.map(t=>'<li>'+icon('check')+'<span>'+e(t)+'</span></li>').join('') + '</ul></section>' : ''}
        <footer class="rd-footer">${back}<span>远程 AI 工作台</span></footer>
      </div></div></article>`;
    const cover = node.querySelector('.rd-cover'), sheets = node.querySelector('.rd-sheets'), embed = node.querySelector('.rd-embed');
    const buttons = node.querySelectorAll('[data-view]');
    buttons.forEach(button => button.addEventListener('click', () => {
      const view = button.dataset.view;
      cover.hidden = view !== 'cover';
      sheets.hidden = view !== 'sheet';
      if (embed) {
        embed.hidden = view !== 'sample';
        if (view === 'sample' && !embed.firstElementChild) {
          const frame = document.createElement('iframe');
          frame.title = item.sampleLabel || (item.name + '成品预览');
          frame.setAttribute('sandbox', 'allow-scripts allow-downloads allow-forms');
          frame.src = item.sample;
          embed.append(frame);
        }
      }
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    }));
    node.querySelector('[data-save]')?.addEventListener('click', () => saveText(item));
    node.querySelector('[data-scroll]')?.addEventListener('click', () => {
      const detail = node.querySelector('.rd-spec');
      detail.focus({preventScroll:true});
      detail.scrollIntoView({block:'start'});
    });
  };
})();
