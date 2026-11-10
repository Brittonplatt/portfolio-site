(function(){
document.documentElement.classList.add('js');
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* nav menu */
var island=$('#island'), menuBtn=$('#menuBtn');
function setMenu(o){island.classList.toggle('open',o);menuBtn.setAttribute('aria-expanded',o);menuBtn.textContent=o?'Close':'Menu'}
menuBtn.addEventListener('click',function(){setMenu(!island.classList.contains('open'))});
$$('#navPanel a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});


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

/* scroll spy */
var secs=['about','skills','projects','experience','recs','contact'].map(function(id){return document.getElementById(id)});
/* a section counts as current once its top passes 40% of the screen, so Contact only highlights once it fills the majority of the view; a nav click holds its target highlighted until the visitor scrolls by hand */
var lockId=null,order2=['statement','about','results','skills','projects','experience','recs','contact'].map(function(id){return document.getElementById(id)});
function curId(){if(lockId)return lockId;var cur=null;order2.forEach(function(el){if(el&&el.getBoundingClientRect().top<=window.innerHeight*0.4)cur=el.id});return cur}
function syncSpy(){var id=curId();$$('[data-sec]').forEach(function(a){a.classList.toggle('act',a.getAttribute('data-sec')===id)})}
$$('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(){var id=a.getAttribute('href').slice(1);if(document.getElementById(id)&&order2.some(function(el){return el&&el.id===id})){lockId=id;syncSpy();var h=document.getElementById('here');if(h)h.textContent=({statement:'Home',about:'About',results:'Results',skills:'Skills',projects:'Projects',experience:'Experience',recs:'Recommendations',contact:'Contact'})[id]||h.textContent}})});
['wheel','touchstart','keydown'].forEach(function(t){window.addEventListener(t,function(){if(lockId){lockId=null;syncSpy();updHere()}},{passive:true})});


/* current section name in the phone island */
var here=$('#here'),labels={statement:'Home',about:'About',results:'Results',skills:'Skills',projects:'Projects',experience:'Experience',recs:'Recommendations',contact:'Contact'};
var order=Object.keys(labels).map(function(id){return document.getElementById(id)});
function updHere(){var cur=labels[curId()]||'Home';if(here&&here.textContent!==cur)here.textContent=cur;syncSpy()}
window.addEventListener('scroll',updHere,{passive:true});window.addEventListener('resize',updHere);updHere();

/* reveal with stagger */
$$('[data-stagger]').forEach(function(g){$$('.rv',g).forEach(function(el,i){el.style.setProperty('--d',(i*100)+'ms')})});
if('IntersectionObserver' in window){
  var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}})},{threshold:.2});
  $$('.rv').forEach(function(el){rv.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')})}

/* statement word fade */
var st=$('#statement-text');
if(st){
  var words=st.textContent.trim().split(/\s+/);
  st.setAttribute('aria-label',st.textContent.trim());
  st.innerHTML=words.map(function(w){return '<span class="w" aria-hidden="true">'+w+'</span>'}).join(' ');
  var ws=$$('.w',st);
  var upd=function(){
    var r=st.getBoundingClientRect(),vh=window.innerHeight;
    var p=(vh*0.9-r.top)/(vh*0.55+r.height*0.5);
    p=Math.max(0,Math.min(1,p));
    var n=Math.round(p*ws.length);
    ws.forEach(function(w,i){w.classList.toggle('on',i<n)});
  };
  if(reduce){ws.forEach(function(w){w.classList.add('on')})}
  else{addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()}
}


/* tools cards: pointer spotlight and tilt */
(function(){
  if(reduce||!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  $$('.tools .tool').forEach(function(c){
    c.addEventListener('pointermove',function(e){
      if(!c.classList.contains('in'))return;
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      c.classList.add('live');
      c.style.setProperty('--mx',(x*100)+'%');c.style.setProperty('--my',(y*100)+'%');
      c.style.setProperty('--ry',((x-.5)*12)+'deg');c.style.setProperty('--rx',((.5-y)*10)+'deg');c.style.setProperty('--ty','-4px');
    });
    c.addEventListener('pointerleave',function(){
      c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');c.style.setProperty('--ty','0px');
      setTimeout(function(){c.classList.remove('live')},200);
    });
  });
})();


/* cursor glow on white cards */
(function(){
  if(reduce||!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  var cur=null;
  function off(){if(cur){cur.classList.remove('glow-on');cur=null}}
  document.addEventListener('pointermove',function(e){
    var el=e.target&&e.target.closest?e.target.closest('.card:not(.tool),.faq,.stat'):null;
    if(el!==cur){off();if(el){cur=el;el.classList.add('glow-on')}}
    if(el){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')}
  },{passive:true});
  document.addEventListener('pointerleave',off);
  window.addEventListener('blur',off);
})();

/* rolling counters */
$$('.num').forEach(function(el){
  var str=el.getAttribute('data-count'),suf=el.getAttribute('data-suffix')||'';
  el.setAttribute('role','img');el.setAttribute('aria-label',el.getAttribute('data-label'));
  var html='',d=0;
  str.split('').forEach(function(ch){
    if(/\d/.test(ch)){
      var strip='';for(var k=0;k<10;k++)strip+='<b>'+k+'</b>';
      html+='<span class="dg" aria-hidden="true" data-t="'+ch+'" style="--d:'+(d*80)+'ms"><i>'+strip+'</i></span>';d++;
    }else html+='<span class="cm" aria-hidden="true">'+ch+'</span>';
  });
  html+='<span class="sx" aria-hidden="true">'+suf+'</span>';
  el.innerHTML=html;
  var done=false,io=null;
  var roll=function(){
    $$('.dg',el).forEach(function(g,idx){
      var i=$('i',g),to='translateY(-'+(+g.getAttribute('data-t')*1.1)+'em)';
      i.style.transition='none';i.style.transform=to;
      if(i.animate&&!reduce){try{i.animate([{transform:'translateY(0em)'},{transform:to}],{duration:1200,delay:idx*80,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})}catch(e){}}
    });
  };
  var go=function(){if(done)return;done=true;roll();removeEventListener('scroll',chk);removeEventListener('resize',chk);if(io)io.disconnect()};
  var firstCard=document.querySelector('#results .stat');
  var chk=function(){var vh=window.innerHeight||document.documentElement.clientHeight;/* wait until the first stat card has been reached */if(firstCard&&firstCard.getBoundingClientRect().top>vh*0.75)return;var r=el.getBoundingClientRect();if(r.bottom>0&&r.top<vh*0.9)go()};
  if(reduce){$$('.dg i',el).forEach(function(i){i.style.transition='none'});go();return}
  addEventListener('scroll',chk,{passive:true});addEventListener('resize',chk);
  if('IntersectionObserver' in window){io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)chk()})},{threshold:0});io.observe(el)}
  chk();
});

/* skills ring */
var skills=[['Creative','M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18'],
['Photography','M4 8h3l1.5-2h7L17 8h3v11H4zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z'],
['Drone Photography','M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM4 5h5M15 5h5M4 19h5M15 19h5M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3'],
['Video Creator','M3 7h12v10H3zM15 11l6-3v8l-6-3'],
['Entrepreneur','M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'],
['Photoshop','M12 3l9 5-9 5-9-5zM3 13l9 5 9-5'],
['Writer','M4 20l1-4L16 5l3 3L8 19zM14 7l3 3'],
['Public speaking','M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM6 11a6 6 0 0 0 12 0M12 17v4'],
['Excel spreadsheet','M4 4h16v16H4zM4 10h16M4 15h16M10 4v16'],
['Market Research','M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l5 5'],
['Lead Generation','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
['Post Production','M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4'],
['Pre visualization','M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
['Team management','M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 6a3 3 0 0 1 0 6M18 15c2 .5 3 2.5 3 5'],
['Efficiency','M13 3L5 14h6l-1 7 8-11h-6z'],
['Operations Management','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1'],
['Web design','M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01'],
['AI tools','M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z']];
var track=$('#marqTrack');
function pill(s,dup){var el=document.createElement('div');el.className='sk'+(dup?' marq-dup':'');if(dup)el.setAttribute('aria-hidden','true');el.innerHTML='<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="'+s[1]+'"/></svg><span>'+s[0]+'</span>';return el}
skills.forEach(function(s){track.appendChild(pill(s,false))});
skills.forEach(function(s){track.appendChild(pill(s,true))});

/* project filter */
$$('.flt').forEach(function(b){b.addEventListener('click',function(){
  $$('.flt').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
  var f=b.getAttribute('data-f');
  $$('#grid .proj').forEach(function(p){p.hidden=!(f==='all'||p.getAttribute('data-cat')===f)});
})});

/* accordions */
function acc(root,single){
  $$('.acc-i',root).forEach(function(it){
    var b=$('button',it);
    b.addEventListener('click',function(){
      var o=!it.classList.contains('open');
      if(single&&o)$$('.acc-i.open',root).forEach(function(x){x.classList.remove('open');$('button',x).setAttribute('aria-expanded','false')});
      it.classList.toggle('open',o);b.setAttribute('aria-expanded',o);
    });
  });
}
acc($('#expAcc'),true);acc($('#faqAcc'),true);

/* quotes */
var LETTERS={"gm": {"head": "Aptive Environmental", "kind": "Handwritten letter", "intro": null, "paras": ["To whom the following should know, or perhaps are already aware of.", "I am writing this because I am not often impressed by those I meet.", "I am an 85 year old former manufacturing executive for General Motors. My area of expertise was Automotive Tool & Die Construction – Tryout and Production of Body Parts.", "I had the good fortune to be associated with the best of men. Many, many, hundreds of men.", "In those men I saw qualities which I somewhat envied, for I did not have them.", "Today I had a knock on the door and a man who I would learn was named Jared who was employed by Aptive Environmental, introduced himself and inquired if I might be interested in services Aptive provide. I live in a home that is not mine and as such, all commits made to home or property must be made by the owner.", "It is important to me to tell you or someone how impressed I was by this man \"Jared\". My wife of 65 years share the same feelings.", "He exuded a quiet confidence, a calm demeanor and most importantly an aura of honesty from head to toe which was impossible to miss or be mistaken.", "You have chosen your employees well, and I am better for having met him."], "close": ["Thanks"]}, "alv": {"head": "Guatemala Cobán Mission", "kind": "Letter to the Platt family", "intro": ["6 ave. 2-36 Zona 1, Cobán, A.V.", "Dear Platt Family,"], "paras": ["It has been a great privilege to be able to serve with Elder Jared Britton Platt, here in the Guatemala Cobán mission. He has served the people faithfully working in the areas of: Carcha, Tanchi, Chicojl, El Estor, Sacauha, Corralpek, Coban 1. It is a pleasure to announce that the honorable release as a full-time missionary has been recommended.", "Elder Platt will henceforth be blessed by the personal changes of heart and character that have been necessary to successfully fulfill his wonderful calling as the Lord's representative. He has learned that pefection is a gift from God that comes as a result of being as close to God as we can, not the other way around, we are not expected to be perect first but we are expected to fight for the opportunity to be so. He will forever fight to be the priesthood holder, father, and husband that Christ has taught him to be. He has found the strength to keep moving forward, there comes a point where the mind and body say no and the spirit must take hold and show who is in charge. He has found a new love for his savior and for the opportunity to have served Him for two years. There are many trials up a head and the way to overcome them is by being ready now and Elder Platt feels as though he can prepare himself for the world by way of his expiriences now held close to his heart.", "Encourage him to achieve his goals that were set forth in \"My Plan.\" For this, his priesthood leaders have assigned him a mentor to support and follow up. He will be invited to participate in 2 workshops to focus on his development, be diligent in following up that he remains faithful to the Lord and His covenants.", "Sister Alvarado and I love Elder Platt very much. We will miss our frequent association with him, but we also know that it is time for him to move forward in Heavenly Father's great plan. He leaves the mission with more preparation to achieve success in life. We encourage him to continue the habits and standards that have served him well as a missionary.", "Thank you for your love and support for Elder Platt. We trust in the Lord's continued blessings to those who honor and serve Him."], "close": ["With much love,", "Elder Platt, Secretary", "Jorge Alvarado President", "Guatemala Cobán Mission"]}, "msk": {"head": "Preserved Despite War", "kind": "Customer letter, Memory Keep", "intro": null, "paras": ["My name is Steven Mackey. In 1976, when I was 20 years old, I went on a trip to Europe with two friends whom I had known since I was 10 years old. One of my friends, named Fred, had a plan to visit the Croatian fishing village from where his Grandfather had come. Fred’s Grandfather had left the small fishing village of Jezera (pronounced Yay-zehra) on the island of Murter in Croatia back in 1917 to head for America, and since that time, neither he nor any of his offspring had returned to Jezera. Fred’s visit would prove to be a momentous occasion for the entire village, as the Family Pirjak was one of the largest families in the village. The three days we spent in Jezera were filled with visits to many of Fred’s relatives, most of whom he had never heard of. I had brought with me a 35mm Konica single lens reflex camera, and I took numerous pictures in 35mm slide format.", "Fifty years later, in 2026, my wife and I were invited to a wedding which was to be held on the island of Idra in Greece. Since Greece was not far from Croatia, I decided to revisit the island of Murter and see if anyone I had met in 1976 was still there in Jezera. Before we left on our journey, I decided to dig up my old slides and see if I could make them accessible to anyone I might meet who would enjoy seeing the old pictures. I learned about Britton Platt’s ability to digitize old slides from his Grandmother. After a short amount of time, Britton had digitized some of the slides I had selected for preserving. I made 4x6 prints from the JPEG files Britton had provided and took them with me on my trip.", "We were able to contact the wife (Dragana) of one of Fred’s relatives, Marijo, who lived in Jezera, and it turned out they had an apartment she rented to travelers regularly. It worked out perfectly for us to stay at the apartment for the weekend during our visit, and we would get occasional visits from Marijo’s wife. She drove us over to meet one of Fred’s cousins, whom we met back in 1976. While visiting with him, I pulled out the prints and showed them to him. He was the subject of some of the pictures, and as I was also the subject of some pictures, we both commented on how much we had changed during all the intervening years.", "As we were looking at the prints, Dragana was also viewing them, and at one point, she gasped and declared that one of the pictures was of Marijo’s Grandparents. She proceeded to tell us that during the Bosnian-Croatian war in the early 1990’s, Marijo’s family home on the mainland was subjected to the horrors of war and during the conflict, they were forced to abandon their house without delay and were unable to collect any of their valuables. As a result, Marijo had no pictures of his Grandparents and Dragana knew that he would be delighted to see the few pictures I had brought with me. We later learned that not only were Marijo’s Grandparents in the picture, but standing off to the side in one picture was Marijo’s Great Grandmother. There is no way to put a value on the impact of having digitized those old slides, but I am glad that Britton was able to provide that service for me, and Marijo is happy to finally have old photos of his Grandparents and of his Great Grandmother."], "close": ["-Steven"]}, "kjo": {"head": "Kenjoh Outdoor Advertising", "kind": "Letter of recommendation", "intro": ["November 10, 2026"], "paras": ["Britton spent most of his time on lead generation and prospecting. He organized our advertiser categories and streamlined how we approach prospecting, which cut down the time our team spends finding and qualifying leads.", "What stood out most was his forethought. With only basic, general direction, Britton completed tasks quickly, efficiently and with very few mistakes. But he didn’t stop at the task in front of him. As he worked, he figured out what we would want and need next, and he did it on his own. More than once, he came back with the assignment finished and the next step already handled, before we’d thought to ask.", "That’s not something you can teach, and it’s not something we see often."], "close": ["Jake Levine", "Sales Director"]}};
var quotes=[{"t": "He exuded a quiet confidence, a calm demeanor and most importantly an aura of honesty from head to toe which was impossible to miss or be mistaken.", "n": "Former General Motors manufacturing executive", "r": "Connection made through Aptive Environmental", "a": "GM", "l": "gm"}, {"t": "He has found the strength to keep moving forward, there comes a point where the mind and body say no and the spirit must take hold and show who is in charge.", "n": "Jorge Alvarado", "r": "President, Guatemala Cobán Mission", "a": "", "l": "alv", "u": "https://www.thechurchnews.com/2022/1/28/23265718/mission-leadership-recently-called-serve-mexico-mongolia-idaho-australia/"}, {"t": "There is no way to put a value on the impact of having digitized those old slides, but I am glad that Britton was able to provide that service for me.", "n": "Steven Mackey", "r": "Memory Keep customer", "a": "SM", "l": "msk"}, {"ph": 1, "n": "Matt Madrid", "r": "Video Editor Superior", "a": "MM", "u": "https://www.linkedin.com/in/matt-madrid-29483a50/"}, {"ph": 1, "n": "Jared Platt", "r": "CEO, Platt Photography", "a": "JP", "u": "https://jaredplatt.com"}, {"t": "More than once, he came back with the assignment finished and the next step already handled, before we’d thought to ask.", "n": "Jake Levine", "r": "Sales Director, Kenjoh Outdoor Advertising", "a": "JL", "l": "kjo", "u": "https://www.linkedin.com/in/jakelevine1/"}];
var qc=$('#qc');
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function meet(q){return q.u?' <a class="meet" href="'+q.u+'" target="_blank" rel="noopener">Meet '+esc(q.n.split(' ')[0])+'</a>':''}
function letterHTML(q){
  var L=LETTERS[q.l],tt=esc(q.t.replace(/\.$/,'')),h='<div class="ltr-sheet"><p class="ltr-kind">'+esc(L.kind)+'</p><p class="ltr-head">'+esc(L.head)+'</p>';
  if(L.intro)L.intro.forEach(function(p){h+='<p class="ltr-intro">'+esc(p)+'</p>'});
  L.paras.forEach(function(p){
    var e=esc(p),k=e.indexOf(tt);
    h+='<p>'+(k>-1?e.slice(0,k)+'<mark>'+tt+'</mark>'+e.slice(k+tt.length):e)+'</p>';
  });
  h+='<p class="ltr-close">'+L.close.map(esc).join('<br>')+'</p></div>';
  return h;
}
qc.innerHTML=quotes.map(function(q,i){if(q.ph){return '<figure class="card qcard"><blockquote><p style="font:500 clamp(22px,3vw,30px)/1.3 var(--f-head);letter-spacing:-.015em;color:var(--ink-muted)">[Recommendation to be added]</p></blockquote><figcaption class="who"><span class="av" aria-hidden="true">'+esc(q.a)+'</span><span>'+esc(q.n)+meet(q)+'<small>'+esc(q.r)+'</small></span></figcaption></figure>'}if(!q.l){return '<figure class="card qcard"><blockquote><q>'+esc(q.t)+'</q></blockquote><figcaption class="who"><span class="av" aria-hidden="true">'+esc(q.a)+'</span><span>'+esc(q.n)+meet(q)+'<small>'+esc(q.r)+'</small></span></figcaption></figure>'}return '<figure class="card qcard"><blockquote><q>'+esc(q.t)+'</q></blockquote><figcaption class="who"><span class="av" aria-hidden="true">'+(q.a||q.n.replace(/[^A-Z0-9]/gi,'').slice(0,2).toUpperCase())+'</span><span>'+esc(q.n)+meet(q)+'<small>'+esc(q.r)+'</small></span></figcaption><div class="q-act"><button class="btn btn-light q-btn" type="button" aria-expanded="false" aria-controls="ltr'+i+'"><span>Read the full letter</span><svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg></button></div><div class="ltr" id="ltr'+i+'"><div class="ltr-in">'+letterHTML(q)+'</div></div></figure>'}).join('');
$$('.q-btn',qc).forEach(function(b){b.addEventListener('click',function(){
  var card=b.closest('.qcard'),open=!card.classList.contains('open');
  $$('.qcard.open',qc).forEach(function(c){if(c!==card){c.classList.remove('open');$('.q-btn',c).setAttribute('aria-expanded','false');$('.q-btn span',c).textContent='Read the full letter'}});
  card.classList.toggle('open',open);b.setAttribute('aria-expanded',open);$('span',b).textContent=open?'Close the letter':'Read the full letter';
  if(open){setTimeout(function(){var r=card.getBoundingClientRect();if(r.top<80||r.top>window.innerHeight*0.5)window.scrollTo({top:window.scrollY+r.top-90,behavior:reduce?'auto':'smooth'})},120)}
})});


/* preload the Art page and its images in the background so it opens instantly */
(function(){
  var imgs=['driftwood-collector.jpg','collector.jpg','g-snow.jpg','p-hungry.jpg','about.jpg','g-volley.jpg','cta.jpg','g-raven.jpg','fs-aerial-pool.jpg','fs-aerial-spa.jpg','fs-aerial-edge.jpg','fs-waterfalls.jpg','fs-tile-glass.jpg','fs-chairs.jpg','frame-gold.png','bg-slate.jpg'];
  for(var i=1;i<=13;i++)imgs.push('mkp'+(i<10?'0':'')+i+'.jpg');
  var held=[];
  function warm(){
    try{fetch('art.html',{credentials:'same-origin'}).catch(function(){})}catch(e){}
    imgs.forEach(function(n,k){setTimeout(function(){var im=new Image();im.decoding='async';im.src='images/'+n;held.push(im)},k*60)});
    ['art.html'].forEach(function(h){var l=document.createElement('link');l.rel='prefetch';l.href=h;document.head.appendChild(l)});
  }
  var go=function(){if('requestIdleCallback' in window)requestIdleCallback(warm,{timeout:3000});else setTimeout(warm,1500)};
  if(document.readyState==='complete')go();else window.addEventListener('load',go);
})();

/* copy email */
var cp=$('#copyBtn');
cp.addEventListener('click',function(){
  var t='brittonplatt@icloud.com';
  var done=function(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy'},1800)};
  var fb=function(){var r=document.createRange();r.selectNodeContents($('#addr'));var s=getSelection();s.removeAllRanges();s.addRange(r);cp.textContent='Selected'};
  try{navigator.clipboard.writeText(t).then(done,fb)}catch(_){fb()}
});
})();
