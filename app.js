(() => {
  'use strict';
  const paths = {
    store:'<path d="m3 9 2-5h14l2 5M4 12v8h16v-8M9 20v-5h6v5"/><path d="M3 9v1a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2V9"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    monitor:'<rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M12 17v4m-5 0h10"/>',
    bookmark:'<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4z"/>',
    heart:'<path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 7l-1.3-1.4a5 5 0 0 0-7.1 7.1L12 21l8.4-8.3a5 5 0 0 0 0-7.1Z"/>',
    library:'<path d="M3 4v16m4-16v16m4-16v16m3-15 4-1 4 15-4 1z"/>',
    receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2zM8 7h8M8 11h8M8 15h4"/>',
    upRight:'<path d="M6 18 18 6M7 6h11v11"/>', arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    layers:'<path d="m12 3 10 5-10 5L2 8l10-5zM2 12l10 5 10-5M2 16l10 5 10-5"/>',
    box:'<path d="m3 7 9-5 9 5v10l-9 5-9-5zM3 7l9 5 9-5m-9 5v10"/>',
    edit:'<path d="m4 16 11-11 4 4L8 20l-5 1zM14 6l4 4"/>',
    chat:'<path d="M20 12a7 7 0 0 1-7 7H8l-5 3 1-6a7 7 0 0 1 5-12h4a7 7 0 0 1 7 8Z"/>',
    code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>', globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    pause:'<path d="M8 5v14m8-14v14" stroke-width="3"/>', play:'<path d="m8 4 12 8-12 8z"/>', screen:'<rect x="3" y="4" width="18" height="15" rx="2"/><path d="M3 8h18"/>'
  };
  const icon = name => '<svg aria-hidden="true" class="icon" viewBox="0 0 24 24">'+paths[name]+'</svg>';
  const $ = id => document.getElementById(id);
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  const products = window.catalog;
  const byId = new Map(products.map(p=>[p.id,p]));
  const modes = [
    {name:'全部',icon:'grid',test:()=>true,note:'看一份成品，挑一种合作方式。'},
    {name:'标准成品',icon:'box',test:p=>['studio','ssh'].includes(p.id),note:'打开成品样例，核对结果，再下载源文件。'},
    {name:'专属定制',icon:'edit',test:p=>['feishu','discord'].includes(p.id),note:'按项目约定需求、修改范围和验收方式。'},
    {name:'主机租用',icon:'monitor',test:p=>['mac','desktop'].includes(p.id),note:'按用途选择工作环境，主机与订阅分别计费。'}
  ];
  const categories = [['全部','grid'],['网页设计','globe'],['聊天协作','chat'],['代码交付','code'],['开发主机','box'],['远程桌面','monitor']];
  const featured = [
    ['mac','独享 Mac 开发工作台'],['studio','商品介绍页 · FIELD NOTES'],['feishu','一单委托的交付回执'],
    ['desktop','远程桌面 · 回到工作现场'],['ssh','代码交付 · 运行测试'],['discord','双频道项目工作区']
  ];
  let mode=0, category='全部', featuredIndex=0, timer, savedView=false,returnHash='#catalog';
  let paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hover=false, focus=false, detailOpen=false;
  let saved;
  try {saved=new Set(JSON.parse(localStorage.getItem('remote-workspace-favs')||'[]'));} catch {saved=new Set();}
  function modeButtons() {
    $('modes').innerHTML=modes.map((m,i)=>'<button type="button" data-mode="'+i+'" aria-pressed="'+(i===mode)+'">'+icon(m.icon)+m.name+' <em>'+products.filter(m.test).length+'</em></button>').join('');
    $('mode-note').textContent=savedView?'仅在这台浏览器保存。':modes[mode].note;
    const pool=products.filter(modes[mode].test);
    $('filters').innerHTML=categories.filter(([n])=>n==='全部'||pool.some(p=>p.category===n)).map(([n,svg])=>'<button type="button" data-category="'+n+'" aria-pressed="'+(category===n)+'">'+icon(svg)+n+'</button>').join('');
    $('clear').hidden=mode===0&&category==='全部';
  }
  function renderCards(focusId) {
    modeButtons();
    const rows=products.filter(p=>modes[mode].test(p)&&(category==='全部'||p.category===category)&&(!savedView||saved.has(p.id)));
    $('catalog-title').textContent=savedView?'我的收藏':'服务橱窗';
    $('count-live').textContent=(savedView?'已收藏':'当前显示')+rows.length+'项服务';
    $('items').innerHTML=rows.length?rows.map(p=>'<article class="card"><a href="#service/'+p.id+'"><div class="cover"><img loading="lazy" width="960" height="600" src="'+p.image+'" alt="'+p.alt+'"></div><div class="card-body"><span class="card-kind">'+p.category+'</span><div class="card-title"><h3>'+p.name+'</h3><span>'+p.price+'</span></div><p>'+p.summary+'</p><div class="card-meta"><b>'+p.tag+'</b>'+icon('upRight')+'</div></div></a><button class="fav" type="button" data-save="'+p.id+'" aria-pressed="'+saved.has(p.id)+'" aria-label="'+(saved.has(p.id)?'取消收藏':'收藏')+'：'+p.name+'">'+icon('bookmark')+'</button></article>').join('')
      :'<div class="empty">'+(savedView?'还没有符合条件的收藏。点商品封面右上角可以保存。':'当前没有符合条件的方案。')+' <button type="button" id="reset-list">查看全部服务</button></div>';
    if(focusId) document.querySelector('[data-save="'+focusId+'"]')?.focus({preventScroll:true});
  }
  $('modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;mode=Number(b.dataset.mode);category='全部';renderCards();$('modes').querySelector('[data-mode="'+mode+'"]').focus({preventScroll:true});};
  $('filters').onclick=e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;renderCards();$('filters').querySelector('[data-category="'+category+'"]').focus({preventScroll:true});};
  $('clear').onclick=()=>{mode=0;category='全部';renderCards();};
  $('items').onclick=e=>{
    const b=e.target.closest('[data-save]');
    if(b){const id=b.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);
      try{localStorage.setItem('remote-workspace-favs',JSON.stringify([...saved]));}catch{}
      renderCards(id);return;}
    if(e.target.closest('#reset-list')){mode=0;category='全部';savedView=false;renderCards();location.hash='catalog';}
  };
  function schedule(){
    clearTimeout(timer);
    if(!paused&&!hover&&!focus&&!detailOpen&&!document.hidden)timer=setTimeout(()=>showFeature((featuredIndex+1)%featured.length),7200);
  }
  function showFeature(i){
    featuredIndex=i;
    const [id,title]=featured[i],p=byId.get(id),img=$('feature-img');
    img.src=p.image;img.alt=p.alt;img.classList.remove('change');void img.offsetWidth;img.classList.add('change');
    $('feature-link').href='#service/'+id;$('feature-kind').textContent=p.category;$('feature-name').textContent=title;$('feature-price').textContent=p.price;
    [...$('reel-dots').children].forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));schedule();
  }
  $('reel-dots').innerHTML=featured.map((f,i)=>'<button type="button" data-slide="'+i+'" aria-label="预览：'+f[1]+'" aria-pressed="'+(i===0)+'"></button>').join('');
  $('reel-dots').onclick=e=>{const b=e.target.closest('[data-slide]');if(b)showFeature(Number(b.dataset.slide));};
  const reel=document.querySelector('.showreel');
  reel.onmouseenter=()=>{hover=true;schedule();};reel.onmouseleave=()=>{hover=false;schedule();};
  reel.onfocusin=()=>{focus=true;schedule();};reel.onfocusout=e=>{focus=reel.contains(e.relatedTarget);schedule();};
  function playButton(){const b=$('reel-play');b.innerHTML=icon(paused?'play':'pause');b.title=b.ariaLabel=paused?'播放轮播':'暂停轮播';schedule();}
  $('reel-play').onclick=()=>{paused=!paused;playButton();};document.addEventListener('visibilitychange',schedule);
  let lastRoute=null;
  function route(){
    const hash=location.hash||'#home', item=hash.startsWith('#service/')?byId.get(hash.slice(9)):null;
    detailOpen=Boolean(item);
    $('shop').hidden=detailOpen;$('detail').hidden=!detailOpen;
    if(detailOpen){
      if(lastRoute==='#saved')returnHash='#saved';else if(!lastRoute?.startsWith('#service/'))returnHash='#catalog';
      renderDetail(item,$('detail'),returnHash);document.title=item.name+' · 远程 AI 工作台';window.scrollTo({top:0,behavior:'instant'});
    }else{
      $('detail').replaceChildren();document.title='服务市场 · 远程 AI 工作台';
      savedView=hash==='#saved';if(savedView&&lastRoute!=='#saved'&&!lastRoute?.startsWith('#service/')){mode=0;category='全部';}
      if(hash==='#home'){mode=0;category='全部';}renderCards();
      const anchor=hash==='#saved'?'catalog':hash.slice(1);
      if(anchor==='home'||!$(anchor))window.scrollTo({top:0,behavior:'instant'});
      else requestAnimationFrame(()=>$(anchor).scrollIntoView({behavior:'instant',block:'start'}));
    }
    document.querySelectorAll('.rail-link').forEach(a=>{if(a.getAttribute('href')===hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    lastRoute=hash;schedule();
  }
  window.addEventListener('hashchange',route);
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.getAttribute('href')===location.hash&&location.hash&&!detailOpen){e.preventDefault();route();}});
  playButton();route();
})();
