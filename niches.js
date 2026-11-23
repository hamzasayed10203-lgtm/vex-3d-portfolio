(() => {
  'use strict';
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
      const published=items.filter(n=>n.published!==false);
      host.replaceChildren();
      if(host.id==='niche-grid'){
        if(!published.length){document.getElementById('niches').hidden=true;return;}
        published.forEach((n,i)=>{const a=document.createElement('a');a.className='niche-card';a.href='niche.html?slug='+encodeURIComponent(n.id);a.append(text('span',String(i+1).padStart(2,'0'),'niche-number'),text('h3',n.title),text('p',n.description),text('span','شوف التفاصيل والأمثلة ←','niche-more'));host.append(a);});
      }else{
        const slug=new URLSearchParams(location.search).get('slug');const n=published.find(x=>x.id===slug);
        if(!n){host.append(text('h1','الصفحة مش موجودة'),text('p','ممكن تكون اتشالت أو لسه مش منشورة.'));return;}
        document.title=n.title+' | VEX';host.append(text('p','VEX / التخصصات','hero-kicker'),text('h1',n.title),text('p',n.description,'niche-lead'),text('h2','الأمثلة وقبل / بعد'));
        const examples=Array.isArray(n.examples)?n.examples:[];
        if(!examples.length)host.append(text('p','الأمثلة هتتضاف هنا قريب. تقدر تشوف الأعمال الحالية من الصفحة الرئيسية.','niche-empty'));
        examples.forEach(e=>{const article=document.createElement('article');article.className='niche-example';article.append(text('h3',e.title||'مثال'));if(e.description)article.append(text('p',e.description));const grid=document.createElement('div');grid.className='niche-pair';if(e.before){const col=document.createElement('div');col.append(text('h4','قبل المونتاج'),media(e.before,'قبل المونتاج'));grid.append(col);}if(e.after){const col=document.createElement('div');col.append(text('h4',e.before?'بعد المونتاج':'الفيديو'),media(e.after,e.title||'الفيديو'));grid.append(col);}article.append(grid);host.append(article);});
      }
    }catch(e){host.replaceChildren(text('p','مش قادرين نحمّل التخصصات دلوقتي. جرّب تاني بعد شوية.','niche-empty'));}
  }
  window.VexNiches={defaults,validUrl};load();
})();
