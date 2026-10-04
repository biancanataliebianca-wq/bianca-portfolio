(() => {
 'use strict';
 const data=window.PORTFOLIO, $=(s,root=document)=>root.querySelector(s);
 const genre=id=>data.genres.find(g=>g.id===id);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const element=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
 function cover(work,lazy=true){
  const box=element('div','artwork genre-'+work.genre);
  if(work.thumbnail){const img=element('img');img.alt=work.title;img.loading=lazy?'lazy':'eager';img.decoding='async';img.src=work.thumbnail;img.addEventListener('error',()=>img.remove(),{once:true});box.append(img);}
  else {box.append(element('span','artwork-word',genre(work.genre).label),element('span','artwork-note','X / ORIGINAL WORK'));}
  return box;
 }
 function card(work,index,featured=false){
  const button=element('button',featured?'feature-card':'work-card');button.type='button';button.setAttribute('aria-label',work.title+'の作品詳細を開く');
  button.append(cover(work,!featured));const label=element('div','card-label');label.append(element('span','eyebrow',genre(work.genre).label),element('h3','',work.title),element('span','card-action',work.youtube.length?'▶ PLAY FILM':'VIEW WORK ↗'));button.append(label);
  button.addEventListener('click',()=>openWork(work));button.addEventListener('pointerenter',()=>{if(work.youtube.length)warmup();},{once:true});return button;
 }
 let warmed=false;
 function warmup(){if(warmed)return;warmed=true;for(const href of ['https://www.youtube-nocookie.com','https://www.youtube.com']){const l=element('link');l.rel='preconnect';l.href=href;document.head.append(l);}}
 $('#featured').append(card(data.works.find(w=>w.id===data.featured)||data.works[0],0,true));
 const home=[data.works.find(w=>w.genre==='music'),data.works.find(w=>w.genre==='action'),data.works.find(w=>w.genre==='commercial')].filter(Boolean);
 home.forEach((w,i)=>$('#home-grid').append(card(w,i)));
 function initBoutique(root){
  let filter=root.dataset.collection,index=0,items=[],start=null,lastWheel=0,suppressUntil=0;
  const tabs=$('.genre-tabs',root),deck=$('.deck',root),grid=$('.collection-grid',root);
  const available=filter==='music'?data.genres.filter(g=>g.id==='music'):data.genres;
  for(const g of available){const b=element('button','genre-tab',g.label);b.type='button';b.dataset.genre=g.id;b.addEventListener('click',()=>{filter=g.id;index=0;rebuild();});tabs.append(b);}
  function rebuild(){items=data.works.filter(w=>filter==='all'||w.genre===filter);tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.genre===filter)));grid.replaceChildren();items.forEach((w,i)=>grid.append(card(w,i)));render();}
  function step(delta){if(items.length<2)return;index=(index+delta+items.length)%items.length;render();}
  function render(){
   deck.replaceChildren();const count=items.length;
   items.forEach((w,i)=>{let offset=i-index;if(offset>count/2)offset-=count;if(offset< -count/2)offset+=count;if(Math.abs(offset)>2)return;
    const b=element('button','deck-card');b.type='button';b.dataset.offset=offset;b.style.setProperty('--offset',offset);b.style.zIndex=10-Math.abs(offset);b.setAttribute('aria-label',w.title+(offset===0?'を開く':'を選択'));b.setAttribute('aria-current',String(offset===0));b.append(cover(w,false),element('span','deck-card-title',w.title));
    if(offset===0&&w.preview&&!reduced){const v=element('video','preview-video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.src=w.preview;v.addEventListener('error',()=>v.remove(),{once:true});$('.artwork',b).append(v);v.play().catch(()=>{});}
    b.addEventListener('click',()=>{if(Date.now()<suppressUntil)return;if(offset===0)openWork(w);else {index=i;render();}});b.addEventListener('pointerenter',()=>{if(w.youtube.length)warmup();},{once:true});deck.append(b);
   });
   $('.selected-title',root).textContent=items[index].title;$('.selected-genre',root).textContent=genre(items[index].genre).label;
   $('.counter',root).textContent=String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');$('.play-selected',root).textContent=items[index].youtube.length?'▶ PLAY':'VIEW WORK ↗';
  }
  $('.previous',root).addEventListener('click',()=>step(-1));$('.next',root).addEventListener('click',()=>step(1));$('.play-selected',root).addEventListener('click',()=>openWork(items[index]));
  root.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}});
  deck.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,id:e.pointerId};});
  document.addEventListener('pointerup',e=>{if(!start||e.pointerId!==start.id)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){suppressUntil=Date.now()+400;step(dx<0?1:-1);}});
  deck.addEventListener('pointercancel',()=>start=null);deck.addEventListener('dragstart',e=>e.preventDefault());
  deck.addEventListener('wheel',e=>{const horizontal=Math.abs(e.deltaX)>Math.abs(e.deltaY);const delta=horizontal?e.deltaX:e.deltaY;if(Math.abs(delta)<8)return;e.preventDefault();if(Date.now()-lastWheel>220){lastWheel=Date.now();step(delta>0?1:-1);}},{passive:false});
  rebuild();
 }
 const initialized=new WeakSet();
 let galleryBuilt=false;
 function buildGallery(){if(galleryBuilt)return;galleryBuilt=true;const gallery=$('#gallery');for(let n=1;n<=82;n++){if(n===78)continue;const b=element('button','gallery-item');b.type='button';const img=element('img');img.src=`assets/illustrations/${n}.jpg`;img.alt=`Bianca Illustration ${n}`;img.loading='lazy';img.decoding='async';b.append(img);b.addEventListener('click',()=>{$('#modalImage').src=img.src;$('#imageModal').showModal();});gallery.append(b);}}
 function navigate(){const id=location.hash.slice(1)||'top';const target=document.getElementById(id);const valid=target?.tagName==='SECTION'?id:'top';document.querySelectorAll('.preview-video').forEach(v=>v.pause());document.querySelectorAll('main > section').forEach(s=>s.classList.toggle('active',s.id===valid));document.querySelectorAll('nav [data-target]').forEach(a=>{a.classList.toggle('active',a.dataset.target===valid);if(a.dataset.target===valid)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});const boutique=$('.boutique',document.getElementById(valid));if(boutique&&!initialized.has(boutique)){initialized.add(boutique);initBoutique(boutique);}document.querySelectorAll('section.active .preview-video').forEach(v=>v.play().catch(()=>{}));if(valid==='illustrations')buildGallery();window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});}
 window.addEventListener('hashchange',navigate);navigate();
 const dialog=$('#playerDialog'),mount=$('#playerMount'),loading=$('.loading-cover',dialog),status=$('#playerStatus');
 let player=null,request=0,timeout=null,apiPromise=null,returnFocus=null,loadingVideo=null;
 function stopVideo(){if(loadingVideo){loadingVideo.pause();loadingVideo.removeAttribute('src');loadingVideo.load();loadingVideo.remove();loadingVideo=null;}}
 function reveal(){loading.hidden=true;stopVideo();}
 function dispose(){request++;clearTimeout(timeout);if(player){player.destroy();player=null;}mount.replaceChildren();stopVideo();}
 function api(){if(window.YT?.Player)return Promise.resolve(window.YT);if(apiPromise)return apiPromise;
  apiPromise=new Promise((resolve,reject)=>{window.onYouTubeIframeAPIReady=()=>resolve(window.YT);const s=element('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>{s.remove();apiPromise=null;reject(new Error('YouTube API unavailable'));};document.head.append(s);});return apiPromise;}
 function outbound(url,text){const a=element('a','source-link',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
 async function play(work,videoId){
  dispose();const token=request;loading.hidden=false;status.textContent='';mount.append(element('div'));mount.firstChild.id='youtubePlayer';
  loading.style.backgroundImage=work.thumbnail?`linear-gradient(#0008,#000b),url("${work.thumbnail}")`:'';
  const clip=genre(work.genre).loading;
  if(clip&&!reduced){loadingVideo=element('video','loading-video');loadingVideo.muted=true;loadingVideo.loop=true;loadingVideo.playsInline=true;loadingVideo.preload='none';loadingVideo.src=clip;loadingVideo.addEventListener('error',stopVideo,{once:true});loading.prepend(loadingVideo);loadingVideo.play().catch(()=>{});}
  timeout=setTimeout(()=>{if(token!==request)return;reveal();status.textContent='読み込みに時間がかかっています。YouTubeで見ることもできます。';},10000);
  try{const YT=await api();if(token!==request||!dialog.open)return;
   player=new YT.Player('youtubePlayer',{host:'https://www.youtube-nocookie.com',videoId,playerVars:{autoplay:1,playsinline:1,rel:0,origin:location.origin},events:{onReady:e=>{if(token!==request)return;clearTimeout(timeout);reveal();e.target.playVideo();},onStateChange:e=>{if(token===request&&e.data===1){clearTimeout(timeout);reveal();status.textContent='';}},onError:()=>{if(token!==request)return;clearTimeout(timeout);reveal();status.textContent='この動画は埋め込みで再生できません。下のYouTubeリンクからご覧ください。';}}});
  }catch(e){if(token!==request)return;clearTimeout(timeout);reveal();status.textContent='プレイヤーを読み込めませんでした。下のYouTubeリンクからご覧ください。';}
 }
 function openWork(work){
  returnFocus=document.activeElement;dispose();$('#playerTitle').textContent=work.title;$('#playerGenre').textContent=genre(work.genre).label;$('#playerDescription').textContent=work.description;$('#playerTools').replaceChildren(...work.tools.map(t=>element('span','tool-tag',t)));
  const links=$('#playerLinks');links.replaceChildren();work.youtube.forEach((id,i)=>links.append(outbound('https://www.youtube.com/watch?v='+id,'YouTubeで見る'+(work.youtube.length>1?' '+(i+1):'')+' ↗')));work.links.forEach((url,i)=>links.append(outbound(url,'Xで作品を見る'+(work.links.length>1?' '+(i+1):'')+' ↗')));
  const variants=$('#playerVariants');variants.replaceChildren();if(work.youtube.length>1)work.youtube.forEach((id,i)=>{const b=element('button','variant','FILM '+String(i+1).padStart(2,'0'));b.addEventListener('click',()=>play(work,id));variants.append(b);});
  status.textContent='';dialog.showModal();
  if(work.youtube.length)play(work,work.youtube[0]);else {loading.hidden=true;mount.append(cover(work,false));status.textContent='Xに公開した作品です。下のリンクからご覧ください。';}
 }
 dialog.addEventListener('close',()=>{dispose();returnFocus?.focus();});
 for(const d of document.querySelectorAll('dialog')){$('.dialog-close',d).addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});}
})();
