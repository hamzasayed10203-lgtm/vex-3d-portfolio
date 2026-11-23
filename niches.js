(() => {
  'use strict';
  const motionStyle=document.createElement('style');motionStyle.textContent='.vex-motion-sample{border-color:#8b3dff}.vex-motion-sample .niche-media{aspect-ratio:9/16;width:270px;max-width:100%;height:480px;max-height:none;margin:0 auto}@media(max-width:600px){.vex-motion-sample .niche-media{width:254px;height:450px}}';document.head.append(motionStyle);
  const API = 'https://aoabbtazodqpkkriitfj.supabase.co/rest/v1/site_links?key=eq.niches_config_v1&select=url';
  const KEY = 'sb_publishable_PKo1mx_pBxg16R8y2_6y6Q_aGRWWDU4';
  const defaults = [
    {id:'dentists', title:'دكاترة الأسنان', description:'مونتاج ريلز لمحتوى عيادات الأسنان.', examples:[], published:true},
    {id:'real-estate', title:'العقارات', description:'مونتاج ريلز للعقارات والجولات المصورة.', examples:[], published:true},
    {id:'podcast', title:'البودكاست', description:'تحويل لحظات الحوار لمقاطع قصيرة.', examples:[], published:true}
  ];
  const validUrl = value => {try {const u=new URL(value);return u.protocol==='https:'||u.protocol==='http:' ? u.href : '';}catch{return '';}};
  const text = (tag, value, cls) => {const el=document.createElement(tag);el.textContent=value||'';if(cls)el.className=cls;return el;};
  function media(url, label) {
    const wrap=document.createElement('div');wrap.className='niche-media';
    let u=validUrl(url);if(!u)return text('p','مفيش فيديو مضاف لسه.','niche-empty');
    const parsed=new URL(u);let embed='';
    if(parsed.hostname==='drive.google.com') {const id=parsed.pathname.match(/\/file\/d\/([\w-]+)/)?.[1]||parsed.searchParams.get('id');if(id&&/^[\w-]+$/.test(id))embed='https://drive.google.com/file/d/'+id+'/preview';}
    if(['www.youtube.com','youtube.com','youtu.be'].includes(parsed.hostname)){const id=parsed.hostname==='youtu.be'?parsed.pathname.slice(1):parsed.searchParams.get('v')||parsed.pathname.split('/')[2];if(id&&/^[\w-]+$/.test(id))embed='https://www.youtube.com/embed/'+id;}
    if(embed){const f=document.createElement('iframe');f.src=embed;f.title=label;f.loading='lazy';f.allow='fullscreen';f.allowFullscreen=true;wrap.append(f);}
    else if(/\.(mp4|webm)(\?|$)/i.test(u)){const v=document.createElement('video');v.src=u;v.controls=true;v.preload='none';v.playsInline=true;wrap.append(v);}
    else {const a=text('a','شاهد الفيديو ↗','btn btn-ghost');a.href=u;a.target='_blank';a.rel='noopener noreferrer';wrap.append(a);}
    return wrap;
  }
  async function load(){
    const host=document.getElementById('niche-grid')||document.getElementById('niche-detail');if(!host)return;
    try{
      const r=await fetch(API,{headers:{apikey:KEY}});if(!r.ok)throw Error('load');const rows=await r.json();
      const items=(rows.length?JSON.parse(rows[0].url):defaults);if(!Array.isArray(items))throw Error('format');
      let works=[];
      try{const wr=await fetch('https://aoabbtazodqpkkriitfj.supabase.co/rest/v1/works?select=*',{headers:{apikey:KEY}});if(wr.ok)works=await wr.json()}catch{}
      for(const n of items)n.examples=(n.examples||[]).map(e=>{if(!e.work_id)return e;const w=works.find(w=>w.id===e.work_id);return w?{...e,title:w.title,description:w.description||'',after:w.video_url,cover:w.cover_url}:null}).filter(Boolean);
      const social=items.find(n=>n.id==='playlist-2da59863-e32');if(social&&!social.examples.some(e=>e.id==='vex-motion-brand'))social.examples.unshift({id:'vex-motion-brand',title:'VEX Motion | تقديم البراند',description:'نموذج موشن للهوية البصرية لـVEX. ١١ ثانية · 9:16.',after:new URL('1-vex-motion.mp4',location.href).href,cover:new URL('4-vex-motion-poster.jpg',location.href).href});
      if(social&&!social.examples.some(e=>e.id==='vex-motion-stand-out'))social.examples.splice(1,0,{id:'vex-motion-stand-out',title:'VEX Motion | Stand Out',description:'نموذج موشن للهوية البصرية لـVEX. ١٠ ثواني · 9:16.',after:new URL('1-vex-stand-out.mp4',location.href).href,cover:new URL('2-vex-stand-out-poster.jpg',location.href).href});
      const published=items.filter(n=>n.published!==false);
      host.replaceChildren();
      if(host.id==='niche-grid'){
        if(!published.length){document.getElementById('niches').hidden=true;return;}
        published.forEach((n,i)=>{const a=document.createElement('a');a.className='niche-card';a.href='niche.html?slug='+encodeURIComponent(n.id);const first=(n.examples||[]).find(e=>e.work_id&&['7c11e63f-5f84-470d-8bbc-52e27c59909d','5f9f9fed-f2ec-4a7d-bcaf-95000bdd67a6','6c9ebc68-5644-49d3-94f3-00b08b263573'].includes(e.work_id));
        if(first){const box=document.createElement('div');box.className='playlist-preview';const v=document.createElement('video');const pref={'7c11e63f-5f84-470d-8bbc-52e27c59909d':['4-','3-'],'5f9f9fed-f2ec-4a7d-bcaf-95000bdd67a6':['6-','5-'],'6c9ebc68-5644-49d3-94f3-00b08b263573':['8-','7-']}[first.work_id];v.poster=pref[0]+'preview-'+first.work_id+'.jpg';v.dataset.src=pref[1]+'preview-'+first.work_id+'.mp4';v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.disableRemotePlayback=true;v.disablePictureInPicture=true;v.setAttribute('aria-hidden','true');const badge=text('span','معاينة صامتة · ٥ ثواني','preview-badge');const hint=text('span','مرّر الماوس للمعاينة','preview-hint');box.append(v,badge,hint);a.append(box);let timer;const stop=()=>{clearTimeout(timer);v.pause();box.classList.remove('is-playing');hint.textContent=matchMedia('(hover:hover)').matches?'مرّر الماوس للمعاينة':'اضغط للمعاينة';};const play=async()=>{if(!v.src)v.src=v.dataset.src;try{await v.play();box.classList.add('is-playing');hint.textContent='معاينة صامتة';}catch{stop();}};a.addEventListener('pointerenter',()=>{if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches)timer=setTimeout(play,300)});a.addEventListener('pointerleave',stop);a.addEventListener('blur',stop);box.addEventListener('click',ev=>{if(!matchMedia('(hover:hover)').matches){ev.preventDefault();box.classList.contains('is-playing')?stop():play();}});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});new IntersectionObserver(es=>{if(!es[0].isIntersecting)stop()}).observe(a);if(!matchMedia('(hover:hover)').matches)hint.textContent='اضغط للمعاينة';}
        a.append(text('span',String(i+1).padStart(2,'0'),'niche-number'),text('h3',n.title),text('p',n.description),text('span',(n.examples||[]).length+' فيديو · افتح البلاي ليست ←','niche-more'));host.append(a);});
      }else{
        const slug=new URLSearchParams(location.search).get('slug');const n=published.find(x=>x.id===slug);
        if(!n){host.append(text('h1','الصفحة مش موجودة'),text('p','ممكن تكون اتشالت أو لسه مش منشورة.'));return;}
        document.title=n.title+' | VEX';host.append(text('p','VEX / التخصصات','hero-kicker'),text('h1',n.title),text('p',n.description,'niche-lead'),text('h2','الأمثلة وقبل / بعد'));
        const examples=Array.isArray(n.examples)?n.examples:[];
        if(!examples.length)host.append(text('p','الأمثلة هتتضاف هنا قريب. تقدر تشوف الأعمال الحالية من الصفحة الرئيسية.','niche-empty'));
        examples.forEach(e=>{const article=document.createElement('article');article.className='niche-example';article.append(text('h3',e.title||'مثال'));if(e.description)article.append(text('p',e.description));const grid=document.createElement('div');grid.className='niche-pair';if(e.before){const col=document.createElement('div');col.append(text('h4','قبل المونتاج'),media(e.before,'قبل المونتاج'));grid.append(col);}if(e.after){const col=document.createElement('div');col.append(text('h4',e.before?'بعد المونتاج':'الفيديو'),media(e.after,e.title||'الفيديو'));grid.append(col);}if(['vex-motion-brand','vex-motion-stand-out'].includes(e.id)){article.classList.add('vex-motion-sample');const v=grid.querySelector('video');if(v){v.muted=false;v.defaultMuted=false;v.poster=e.cover;}}article.append(grid);host.append(article);});
      }
    }catch(e){host.replaceChildren(text('p','مش قادرين نحمّل التخصصات دلوقتي. جرّب تاني بعد شوية.','niche-empty'));}
  }
  window.VexNiches={defaults,validUrl};load();
})();
