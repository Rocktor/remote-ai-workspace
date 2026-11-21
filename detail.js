(() => {
  'use strict';
  const shapes = {
    back:'<path d="m14 6-6 6 6 6"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4"/>',
    chip:'<rect x="5" y="5" width="14" height="14" rx="3"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3m6-3v3m4 4h3m-3 6h3m-7 4v3m-6-3v3m-7-7h3M2 9h3"/>',
    workspace:'<rect x="3" y="4" width="18" height="15" rx="3"/><path d="M3 9h18m-12 7 2-2-2-2m5 5h3"/>',
    key:'<circle cx="8" cy="9" r="4"/><path d="m11 12 8 8 2-2m-6-2 2-2"/>'
  };
  const icon = key => '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+shapes[key]+'</svg>';
  const money = amount => '¥'+amount.toLocaleString('zh-CN');
  const machine = '开发主机参考机型为 Mac mini M4，整机配备 16 GB 内存、256 GB SSD。底层计算资源可能共享。你的可用容量、并发能力和接入方式以开通清单为准。';
  const bundle = '月费包含云端主机工作空间的租用和所选 Claude Code 套餐权益。额外用量、其他付费工具及服务变更，均在启用前确认。';

  function individualControl(item) {
    return '<fieldset class="rd-field"><legend>选择个人套餐</legend><div class="rd-choices">'+
      item.tiers.map(t=>`<label class="rd-choice"><input type="radio" name="personal-tier" value="${t.id}" ${t.id==='max'?'checked':''}>
        <span><strong>${t.name}</strong><small>${t.fit}</small></span><b>${money(t.price)}</b>
      </label>`).join('')+
      '</div><p id="rd-selected-note" class="rd-selected-note" aria-live="polite"></p></fieldset>';
  }

  function teamControl(item) {
    return '<fieldset class="rd-field"><legend>搭配团队席位</legend><p class="rd-field-hint">2–150 位成员，可混合选择。</p><div class="rd-seats">'+
      item.tiers.map(t=>`<div class="rd-seat">
        <label for="rd-${t.id}"><strong>${t.name} <small>${t.fit}</small></strong><span>${money(t.price)} / 人 / 月</span></label>
        <div class="rd-stepper"><button type="button" data-step="-1" data-for="${t.id}" aria-label="减少一个${t.fit}">−</button>
        <input id="rd-${t.id}" aria-label="${t.fit}人数" type="number" inputmode="numeric" step="1" min="0" max="150" value="${t.id==='standard'?2:0}" data-seat="${t.id}">
        <button type="button" data-step="1" data-for="${t.id}" aria-label="增加一个${t.fit}">+</button></div></div>`).join('')+
      '</div><p class="rd-error" id="rd-seat-error" role="status"></p></fieldset>';
  }

  function downloadSummary(item, selection) {
    const members = item.id==='personal'?'1 人':selection.count+' 位成员';
    const lines=[item.name, selection.label, '使用人数　'+members, ...selection.rows,
      '每月合计　'+money(selection.cost), '', '账号与访问', item.access, '', '环境配置', machine, '', '月费包含', bundle, '',
      '开通流程', ...item.steps.map((entry,i)=>(i+1)+'. '+entry[0]+'　'+entry[1]),
      '', '请在开通时核对服务地区、额度、支持时段、续期和数据导出条件。'];
    const url=URL.createObjectURL(new Blob(['\uFEFF',lines.join('\n')],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');
    link.href=url;
    link.download=item.name+'-'+selection.fileLabel+'-套餐清单.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }

  window.renderDetail = (item,node) => {
    const personal=item.id==='personal';
    node.innerHTML=`<article class="rd">
      <div class="rd-dark"><div class="rd-wrap">
        <nav class="rd-crumb" aria-label="详情导航"><a href="#plans">${icon('back')} 返回套餐</a><span>/</span><span>${item.name}</span></nav>
        <div class="rd-hero">
          <div class="rd-visual"><img class="rd-cover" src="${item.image}" alt="${item.alt}" width="1440" height="900"><div class="rd-caption"><b>${item.caption}</b><p>${item.captionDetail}</p></div></div>
          <div class="rd-box"><h1>${item.name}</h1><p class="rd-lead">${item.summary}</p>
            ${personal?individualControl(item):teamControl(item)}
            <div class="rd-pricing" aria-live="polite"><div><span>每月合计</span><small id="rd-period"></small></div><strong id="rd-total"></strong></div>
            <button class="rd-action" data-save type="button">${icon('download')} 保存套餐清单</button>
            <p class="rd-download-status" role="status"></p>
          </div>
        </div>
      </div></div>
      <div class="rd-light"><div class="rd-wrap rd-content">
        <section><h2>工作环境与权益</h2>
          <div class="rd-facts">
            <div>${icon('workspace')}<h3>云端项目目录</h3><p>保留代码、依赖和日志。远端在线、任务支持后台运行时，本地断开后任务仍可继续。</p></div>
            <div>${icon('key')}<h3>${personal?'个人账号':'成员与权限'}</h3><p>${item.access}</p></div>
            <div>${icon('chip')}<h3>主机与可用资源</h3><p>${machine}</p></div>
          </div>
        </section>
        <section class="rd-delivery"><h2>怎样开通</h2><ol>${item.steps.map(s=>`<li><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join('')}</ol>
          <p class="rd-covered">${bundle} 账号及成员须符合服务地区与适用条件。</p>
        </section>
        <a class="rd-bottom-link" href="#plans">${icon('back')} 返回套餐对比</a>
      </div></div>
    </article>`;

    const save=node.querySelector('[data-save]');
    let chosen;
    const counts={standard:2,premium:0};
    const seats=[...node.querySelectorAll('[data-seat]')];

    function update() {
      node.querySelector('.rd-download-status').textContent='';
      if(personal) {
        const tier=item.tiers.find(t=>t.id===node.querySelector('[name="personal-tier"]:checked').value);
        chosen={label:'个人套餐　'+tier.name,fileLabel:tier.name,count:1,cost:tier.price,rows:[tier.name+'　'+money(tier.price)+' / 月']};
        node.querySelector('#rd-selected-note').textContent=tier.description;
      } else {
        const quantity=seats.map(field=>field.valueAsNumber);
        const count=quantity[0]+quantity[1];
        const valid=quantity.every(v=>Number.isInteger(v)&&v>=0&&v<=150)&&count>=2&&count<=150;
        node.querySelector('#rd-seat-error').textContent=valid?'':'请填写 0–150 的整数，席位总数应在 2–150 之间。';
        seats.forEach(field=>field.setAttribute('aria-invalid',String(!valid)));
        node.querySelectorAll('[data-step]').forEach(button=>{
          const current=node.querySelector('#rd-'+button.dataset.for).valueAsNumber;
          button.disabled=!valid||(button.dataset.step==='-1'?(current===0||count<=2):count>=150);
        });
        if(valid) {
          seats.forEach((field,i)=>{ counts[field.dataset.seat]=quantity[i]; });
          const rows=item.tiers.map(t=>t.name+' '+t.fit+'　'+counts[t.id]+' 人 × '+money(t.price)+' / 月');
          chosen={label:'团队席位配置',fileLabel:count+'人',count,rows,cost:item.tiers.reduce((sum,t)=>sum+counts[t.id]*t.price,0)};
        } else {
          chosen=null;
        }
      }
      node.querySelector('#rd-total').textContent=chosen?money(chosen.cost):'—';
      node.querySelector('#rd-period').textContent=chosen?(personal?'个人月付 · 1 人':'团队月付 · '+chosen.count+' 人'):'请核对席位数';
      save.disabled=!chosen;
    }
    node.querySelectorAll('[name="personal-tier"]').forEach(field=>field.addEventListener('change',update));
    seats.forEach(field=>{
      field.addEventListener('input',update);
      field.addEventListener('blur',()=>{
        if(!chosen) {
          field.value=String(counts[field.dataset.seat]);
          update();
        }
      });
    });
    node.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>{
      const field=node.querySelector('#rd-'+button.dataset.for);
      field.value=String(counts[field.dataset.seat]+Number(button.dataset.step));
      update();
    }));
    save.addEventListener('click',()=>{
      if(!chosen) return;
      downloadSummary(item,chosen);
      node.querySelector('.rd-download-status').textContent='套餐清单已生成，可交给服务人员确认开通。';
    });
    update();
  };
})();
