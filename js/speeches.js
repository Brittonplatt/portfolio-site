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
