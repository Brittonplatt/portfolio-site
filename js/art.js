/* #pools: keep the Commercial Photography heading at the top of the screen while images above it finish loading */
(function(){
  if(location.hash!=='#pools')return;
  var el=document.getElementById('pools'),stop=false,de=document.documentElement;
  if(!el)return;
  function go(){if(stop)return;var p=de.style.scrollBehavior;de.style.scrollBehavior='auto';window.scrollTo(0,el.getBoundingClientRect().top+window.pageYOffset-96);de.style.scrollBehavior=p}
  ['wheel','touchstart','keydown','mousedown'].forEach(function(t){window.addEventListener(t,function(){stop=true},{passive:true,once:true})});
  document.addEventListener('DOMContentLoaded',go);window.addEventListener('load',function(){go();setTimeout(go,300);setTimeout(go,900)});
  Array.prototype.forEach.call(document.querySelectorAll('img'),function(im){im.removeAttribute('loading');if(!im.complete)im.addEventListener('load',go)});
  go();
})();
/* Art button: always land at the top of the Art page, including when already on it */
(function(){
  document.querySelectorAll('a[href="art.html"]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(/art\.html$/.test(location.pathname)||/art\.html(\?|$)/.test(location.href)){
        e.preventDefault();
        try{history.replaceState(null,'',location.pathname+location.search)}catch(x){}
        window.scrollTo({top:0,behavior:'smooth'});
      }
    });
  });
  window.addEventListener('pageshow',function(ev){if(ev.persisted&&!location.hash)window.scrollTo(0,0)});
})();
/* open at the top unless the link targets a section (e.g. #pools) */
(function(){
  try{if('scrollRestoration' in history)history.scrollRestoration='manual'}catch(e){}
  if(!location.hash){var de=document.documentElement,p=de.style.scrollBehavior;de.style.scrollBehavior='auto';window.scrollTo(0,0);de.style.scrollBehavior=p;window.addEventListener('load',function(){if(!location.hash)window.scrollTo(0,0)})}
})();
(function(){
var island=document.getElementById('island'),btn=document.getElementById('menuBtn');
function setMenu(o){island.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.textContent=o?'Close':'Menu'}
btn.addEventListener('click',function(){setMenu(!island.classList.contains('open'))});
Array.prototype.forEach.call(document.querySelectorAll('#navPanel a'),function(a){a.addEventListener('click',function(){setMenu(false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});
})();

/* island: switch to the condensed format as soon as the brand name meets the first pill */
(function(){
  var isl=document.getElementById('island'),brand=isl&&isl.querySelector('.brand'),links=isl&&isl.querySelector('.links'),btn=document.getElementById('menuBtn');
  if(!brand||!links)return;
  function chk(){
    var wasOpen=isl.classList.contains('open');
    isl.classList.remove('compact');
    var first=null,as=links.querySelectorAll('a');
    for(var i=0;i<as.length;i++){if(as[i].offsetParent!==null){first=as[i];break}}
    var txt=brand.lastElementChild,br=(txt&&txt.offsetParent!==null?txt:brand).getBoundingClientRect().right;
    var hit=first&&(first.getBoundingClientRect().left<br+8||links.scrollWidth>links.clientWidth+1);
    if(hit)isl.classList.add('compact');
    else if(wasOpen){isl.classList.remove('open');if(btn){btn.setAttribute('aria-expanded','false');btn.textContent='Menu'}}
  }
  window.addEventListener('resize',chk);window.addEventListener('orientationchange',chk);window.addEventListener('load',chk);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(chk);
  chk();
})();
