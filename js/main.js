(function(){
var t=document.querySelector('.navbar__toggle'),n=document.getElementById('nav');
if(t&&n){t.addEventListener('click',function(){var o=n.classList.toggle('is-open');t.setAttribute('aria-expanded',o)})}
var chips=document.querySelectorAll('.chip');
chips.forEach(function(c){c.addEventListener('click',function(){
 chips.forEach(function(x){x.setAttribute('aria-pressed',x===c)});
 var f=c.dataset.filter,side=document.querySelector('.card--teal');
 document.querySelectorAll('.card--proc').forEach(function(card){
  card.hidden=!(f==='all'||card.dataset.tags.split(' ').indexOf(f)>-1)});
})});
var form=document.getElementById('visit-form');
if(form){
 var mark=function(inp,ok){var f=inp.closest('.field');f.classList.toggle('is-ok',ok);f.classList.toggle('is-err',!ok)};
 var checks={
  name:function(v){return v.trim().length>=2},
  phone:function(v){return /^\+380\d{9}$/.test(v.replace(/[\s()-]/g,''))},
  proc:function(v){return !!v},
  date:function(v){return !!v}};
 form.addEventListener('submit',function(e){
  e.preventDefault();var ok=true;
  Object.keys(checks).forEach(function(k){var i=form.elements[k];var v=checks[k](i.value);mark(i,v);ok=ok&&v});
  var c=document.getElementById('f-consent'),er=document.getElementById('consent-err');
  er.hidden=c.checked;ok=ok&&c.checked;
  if(ok){document.getElementById('form-ok').hidden=false;form.reset();
   form.querySelectorAll('.field').forEach(function(f){f.classList.remove('is-ok','is-err')})}
  else{var bad=form.querySelector('.is-err input');if(bad)bad.focus()}
 });
 var d=form.elements.date;if(d){d.min=new Date().toISOString().slice(0,10)}
}
})();
/* ===== animations ===== */
(function(){
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var nb=document.querySelector('.navbar');
 if(nb){var onS=function(){nb.classList.toggle('is-scrolled',window.scrollY>8)};onS();window.addEventListener('scroll',onS,{passive:true})}
 if(reduce||!('IntersectionObserver' in window)){document.querySelectorAll('.divider').forEach(function(d){d.classList.add('is-in')});return}
 var targets=[];
 function add(el,type,delay){if(!el||el.hasAttribute('data-reveal'))return;el.setAttribute('data-reveal',type||'');el.style.setProperty('--d',(delay||0)+'ms');targets.push(el)}
 // section content blocks (skip hero/intro: they have entrance animation)
 document.querySelectorAll('main > section:not(.hero):not(.intro)').forEach(function(sec){
  var wrap=sec.querySelector('.wrap');if(!wrap)return;
  Array.prototype.forEach.call(wrap.children,function(ch,i){
   if(ch.classList.contains('grid')||ch.classList.contains('route')||ch.classList.contains('contact__grid')||ch.classList.contains('about')||ch.classList.contains('legend')||ch.classList.contains('cta__in')||ch.classList.contains('split')){
     if(ch.classList.contains('grid')){Array.prototype.forEach.call(ch.children,function(c,j){add(c,'',j*110)})}
     else if(ch.classList.contains('about')||ch.classList.contains('legend')){add(ch.children[0],'left',0);add(ch.children[1],'right',150)}
     else if(ch.classList.contains('contact__grid')){add(ch.children[0],'left',0);add(ch.children[1],'right',150)}
     else if(ch.classList.contains('route')){add(ch.children[0],'zoom',0);add(ch.children[1],'',150)}
     else add(ch,'',0);
   } else add(ch,'',i?60:0);
  });
  if(wrap.classList.contains('about')||wrap.classList.contains('legend')||wrap.classList.contains('contact__grid')||wrap.classList.contains('cta__in')){
   if(wrap.classList.contains('cta__in')){add(wrap.children[0],'left',0);add(wrap.children[1],'right',150)}
   else{add(wrap.children[0],'left',0);add(wrap.children[1],'right',150)}
  }
  var st=sec.querySelector('.cta__in');if(st&&sec.classList.contains('cta')){add(st.children[0],'left',0);add(st.children[1],'right',150)}
 });
 document.querySelectorAll('.footer > :not(hr)').forEach(function(el,i){add(el,'',i*80)});
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -3% 0px'});
 targets.forEach(function(t){io.observe(t)});
 // dividers draw themselves
 var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io2.unobserve(e.target)}})},{threshold:.6});
 document.querySelectorAll('.divider').forEach(function(d){io2.observe(d)});
 // subtle parallax on hero & legend images
 var par=[].slice.call(document.querySelectorAll('.hero__fig .arch,.arch--legend'));
 if(par.length&&window.matchMedia('(min-width:1101px)').matches){
  var tick=false;window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){
   par.forEach(function(p){var r=p.getBoundingClientRect();var k=(r.top+r.height/2-innerHeight/2)/innerHeight;p.style.translate='0 '+(k*-18).toFixed(1)+'px'});tick=false})},{passive:true});
 }
})();
