(function(){
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function isDark(){return /dark/.test(getComputedStyle(root).colorScheme)}

  /* theme toggle */
  try{var s=localStorage.getItem('sp-theme');if(s==='light'||s==='dark')root.setAttribute('data-theme',s)}catch(e){}
  document.getElementById('tog').addEventListener('click',function(){
    var next=isDark()?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('sp-theme',next)}catch(e){}
  });

  /* name: split into letters, weight follows the pointer */
  var hero=document.getElementById('top');
  var nm=document.querySelector('.name');
  var txt=nm.textContent.trim();
  nm.textContent='';
  nm.setAttribute('aria-label',txt);
  var n=0;
  txt.split(' ').forEach(function(word){
    var w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');
    Array.from(word).forEach(function(ch){
      var l=document.createElement('span');l.className='l';l.style.setProperty('--i',n++);l.textContent=ch;w.appendChild(l);
    });
    nm.appendChild(w);
  });
  var letters=Array.prototype.slice.call(nm.querySelectorAll('.l'));
  if(!reduce && matchMedia('(pointer: fine)').matches){
    var px=0,py=0,raf=0;
    var apply=function(){
      raf=0;
      letters.forEach(function(l){
        var r=l.getBoundingClientRect();
        var d=Math.hypot(px-(r.left+r.width/2),py-(r.top+r.height/2));
        var k=Math.exp(-Math.pow(d/(r.height*1.1),2));
        l.style.fontVariationSettings='"wght" '+Math.round(260+560*k)+',"wdth" '+Math.round(100-24*k);
      });
    };
    hero.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;nm.classList.add('live');if(!raf)raf=requestAnimationFrame(apply)});
    hero.addEventListener('pointerleave',function(){
      nm.classList.remove('live');
      letters.forEach(function(l){l.style.fontVariationSettings=''});
    });
  }

  /* aurora */
  var cv=document.getElementById('aurora'),ctx=cv.getContext('2d');
  if(!ctx)return;
  var W=2,H=2,cols=[],dark=false,alpha=.5,heroVis=true,last=0;
  var P=[[.11,.15,0,1.2,.62],[.09,.13,2.1,.4,.58],[.13,.1,4,2.6,.5],[.07,.12,1.1,3.3,.55]];
  function hex(h){h=h.trim().replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');var v=parseInt(h,16);return[(v>>16)&255,(v>>8)&255,v&255]}
  function readTheme(){
    var cs=getComputedStyle(root);
    dark=isDark();
    alpha=parseFloat(cs.getPropertyValue('--aur-a'))||.5;
    cols=['--aur1','--aur2','--aur3','--aur4'].map(function(k){return hex(cs.getPropertyValue(k)||'#888888')});
  }
  function size(){
    var r=hero.getBoundingClientRect();
    W=cv.width=Math.max(2,Math.ceil(r.width*.5));
    H=cv.height=Math.max(2,Math.ceil(r.height*.5));
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation=dark?'screen':'source-over';
    P.forEach(function(p,i){
      var x=W*(.5+.42*Math.sin(t*p[0]+p[2])),y=H*(.5+.36*Math.cos(t*p[1]+p[3])),r=Math.max(W,H)*p[4]*.62;
      var c=cols[i],g=ctx.createRadialGradient(x,y,0,x,y,r);
      g.addColorStop(0,'rgba('+c[0]+','+c[1]+','+c[2]+','+alpha+')');
      g.addColorStop(1,'rgba('+c[0]+','+c[1]+','+c[2]+',0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    });
  }
  readTheme();size();draw(2);
  if(!reduce){
    (function loop(ms){
      if(heroVis&&!document.hidden&&ms-last>32){last=ms;draw(ms/1000)}
      requestAnimationFrame(loop);
    })(0);
  }
  if('ResizeObserver' in window){new ResizeObserver(function(){size();draw(2)}).observe(hero)}
  else{addEventListener('resize',function(){size();draw(2)})}
  new MutationObserver(function(){readTheme();draw(2)}).observe(root,{attributes:true,attributeFilter:['data-theme']});
  var scheme=matchMedia('(prefers-color-scheme: dark)');if(scheme.addEventListener)scheme.addEventListener('change',function(){readTheme();draw(2)});else if(scheme.addListener)scheme.addListener(function(){readTheme();draw(2)});
  if('IntersectionObserver' in window){new IntersectionObserver(function(e){heroVis=e[0].isIntersecting;nm.classList.toggle('paused',!heroVis)},{threshold:0}).observe(hero)}

  /* timeline spine */
  var tl=document.getElementById('tl'),entries=Array.prototype.slice.call(tl.children),tk=0;
  function prog(){
    tk=0;
    var r=tl.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,(innerHeight*.62-r.top)/r.height));
    tl.style.setProperty('--p',p.toFixed(4));
    var y=p*r.height;
    entries.forEach(function(e){
      var nr=e.querySelector('.node i').getBoundingClientRect();
      e.classList.toggle('on',nr.top+nr.height/2-r.top<=y+2);
    });
  }
  addEventListener('scroll',function(){if(!tk)tk=requestAnimationFrame(prog)},{passive:true});
  addEventListener('resize',prog);
  prog();

  /* sprint board */
  var lane=document.getElementById('lane'),vel=document.getElementById('vel');
  var stories=[['Login flow',3],['Export report',5],['Roles and access',2],['Search filters',8]];
  var state=[[0,1,2,3],[],[]];
  var cards=stories.map(function(s){
    var d=document.createElement('div');d.className='card-s';
    var b=document.createElement('b');b.textContent=s[0];
    var sp=document.createElement('span');sp.textContent=s[1]+' pts';
    d.appendChild(b);d.appendChild(sp);lane.appendChild(d);return d;
  });
  function place(){
    state.forEach(function(list,c){list.forEach(function(id,r){
      var el=cards[id];el.style.setProperty('--c',c);el.style.setProperty('--r',r);el.setAttribute('data-c',c);
    })});
    vel.textContent=state[2].reduce(function(t,id){return t+stories[id][1]},0);
  }
  function move(id,to){
    state.forEach(function(l){var i=l.indexOf(id);if(i>-1)l.splice(i,1)});
    state[to].push(id);place();
  }
  var script=[[0,1],[1,1],[0,2],[2,1],[1,2],[3,1],[2,2],[3,2]];
  place();
  if(reduce){script.slice(0,5).forEach(function(m){move(m[0],m[1])})}
  else{
    var step=0,boardVis=false,timer=0;
    var tick=function(){
      timer=0;
      if(boardVis&&!document.hidden){
        if(step<script.length){move(script[step][0],script[step][1]);step++;timer=setTimeout(tick,1500)}
        else{step=0;timer=setTimeout(function(){state=[[0,1,2,3],[],[]];place();timer=setTimeout(tick,1200)},2600)}
      }
    };
    if('IntersectionObserver' in window) new IntersectionObserver(function(e){
      boardVis=e[0].isIntersecting;
      if(boardVis&&!timer)timer=setTimeout(tick,700);
    },{threshold:.3}).observe(lane);
    else { boardVis=true; timer=setTimeout(tick,700); }
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&boardVis&&!timer)timer=setTimeout(tick,700)});
  }

  /* how I work: draw underlines once */
  var rows=document.querySelectorAll('.row');
  if('IntersectionObserver' in window){
    var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.6});
    rows.forEach(function(r){ro.observe(r)});
  }else{rows.forEach(function(r){r.classList.add('in')})}

  /* ovation crowd */
  var crowd=document.getElementById('crowd');
  for(var i=0;i<100;i++){var d=document.createElement('i');d.style.setProperty('--d',(i*0.04).toFixed(2)+'s');crowd.appendChild(d)}

  /* narrator waveform */
  var wave=document.getElementById('wave'),bars=0;
  function buildWave(){
    var count=Math.max(14,Math.floor(wave.clientWidth/9));
    if(count===bars)return;
    bars=count;wave.textContent='';
    for(var i=0;i<count;i++){
      var t=count>1?i/(count-1):0,env=.3+.7*Math.pow(Math.sin(Math.PI*t),.8);
      var b=document.createElement('i');
      b.style.setProperty('--h',(env*(.4+.6*Math.random())).toFixed(2));
      b.style.setProperty('--t',t.toFixed(3));
      b.style.setProperty('--dur',(1.1+Math.random()*1.5).toFixed(2)+'s');
      b.style.setProperty('--del',(-Math.random()*2.5).toFixed(2)+'s');
      wave.appendChild(b);
    }
  }
  buildWave();
  if('ResizeObserver' in window){new ResizeObserver(buildWave).observe(wave)}else{addEventListener('resize',buildWave)}

  /* featured image carousel */
  var featureSlides=Array.prototype.slice.call(document.querySelectorAll('.feature-slide'));
  var featureDots=Array.prototype.slice.call(document.querySelectorAll('.feature-dot'));
  var featureCount=document.getElementById('feature-count');
  var featureIndex=0,featureTimer=0;
  function availableSlides(){
    return featureSlides.map(function(slide,i){return {slide:slide,index:i}}).filter(function(item){return !item.slide.dataset.unavailable});
  }
  function showFeature(next){
    var available=availableSlides();
    if(!available.length){featureCount.textContent='Photos unavailable';return}
    featureIndex=((next%available.length)+available.length)%available.length;
    var selected=available[featureIndex].index;
    featureSlides.forEach(function(slide,i){
      var active=i===selected;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',active?'false':'true');
    });
    featureDots.forEach(function(dot,i){
      var active=i===selected;
      dot.hidden=!!featureSlides[i].dataset.unavailable;
      dot.classList.toggle('is-active',active);
      dot.setAttribute('aria-pressed',active?'true':'false');
    });
    featureCount.textContent=String(featureIndex+1).padStart(2,'0')+' / '+String(available.length).padStart(2,'0');
  }
  featureSlides.forEach(function(slide){
    var img=slide.querySelector('img');
    if(!img)return;
    function failed(){slide.dataset.unavailable='true';showFeature(featureIndex)}
    img.addEventListener('error',failed);
    if(img.complete&&img.naturalWidth===0)failed();
  });
  function stopFeatureTimer(){if(featureTimer){clearInterval(featureTimer);featureTimer=0}}
  function startFeatureTimer(){
    stopFeatureTimer();
    if(!reduce&&!document.hidden&&!featurePaused)featureTimer=setInterval(function(){showFeature(featureIndex+1)},5500);
  }
  document.getElementById('feature-prev').addEventListener('click',function(){showFeature(featureIndex-1);startFeatureTimer()});
  document.getElementById('feature-next').addEventListener('click',function(){showFeature(featureIndex+1);startFeatureTimer()});
  featureDots.forEach(function(dot){dot.addEventListener('click',function(){var target=Number(dot.getAttribute('data-go'));var visible=availableSlides();var position=visible.findIndex(function(entry){return entry.index===target});if(position>=0)showFeature(position);startFeatureTimer()})});
  document.getElementById('feature-stage').addEventListener('mouseenter',stopFeatureTimer);
  document.getElementById('feature-stage').addEventListener('mouseleave',startFeatureTimer);
  document.addEventListener('visibilitychange',function(){document.hidden?stopFeatureTimer():startFeatureTimer()});
  showFeature(0);startFeatureTimer();

  /* Explicit controls for the automatically rotating carousel */
  var featurePause=document.getElementById('feature-pause'),featurePaused=false;
  if(featurePause){
    featurePause.addEventListener('click',function(){
      featurePaused=!featurePaused;
      featurePause.textContent=featurePaused?'▶':'Ⅱ';
      featurePause.setAttribute('aria-label',featurePaused?'Resume automatic slideshow':'Pause automatic slideshow');
      featurePause.setAttribute('aria-pressed',featurePaused?'true':'false');
      featurePaused?stopFeatureTimer():startFeatureTimer();
    });
    var featureCard=featurePause.closest('.feature-card');
    featureCard.addEventListener('focusin',stopFeatureTimer);
    featureCard.addEventListener('focusout',function(e){if(!featureCard.contains(e.relatedTarget))startFeatureTimer()});
  }



  /* Scroll reveals: content stays visible if IntersectionObserver is unavailable or motion is reduced. */
  if(!reduce && 'IntersectionObserver' in window){
    root.classList.add('reveal-ready');
    var revealTargets=document.querySelectorAll('.sec > .wrap > .eyebrow, .sec > .wrap > h2, .sec > .wrap > .intro, .timeline .entry, .row, .grid > *, .books-collection, .narrate, .builds, .rooms, .contact .mail, .contact .social');
    revealTargets.forEach(function(el,i){
      el.classList.add('reveal');
      if(i%4===1)el.setAttribute('data-delay','1');
      else if(i%4===2)el.setAttribute('data-delay','2');
      else if(i%4===3)el.setAttribute('data-delay','3');
    });
    var revealObserver=new IntersectionObserver(function(items){
      items.forEach(function(item){
        if(item.isIntersecting){item.target.classList.add('is-visible');revealObserver.unobserve(item.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -36px 0px'});
    revealTargets.forEach(function(el){revealObserver.observe(el)});
  }

  /* Magnetic buttons on fine pointers only; small movement, no custom cursor or mobile interference. */
  if(!reduce && matchMedia('(pointer: fine)').matches){
    document.querySelectorAll('.btn,.feature-arrows button,.tog').forEach(function(el){
      el.classList.add('magnetic');
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
        el.style.transform='translate('+Math.max(-5,Math.min(5,dx*.12))+'px,'+Math.max(-5,Math.min(5,dy*.12))+'px)';
      });
      el.addEventListener('pointerleave',function(){el.style.transform=''});
      el.addEventListener('blur',function(){el.style.transform=''});
    });
  }

  /* copy address */
  var copy=document.getElementById('copy'),addr=document.getElementById('addr'),msg=document.getElementById('copied'),mt=0;
  function say(t){msg.textContent=t;clearTimeout(mt);mt=setTimeout(function(){msg.textContent=''},2600)}
  copy.addEventListener('click',function(){
    var t=addr.textContent.trim();
    var fallback=function(){
      var r=document.createRange();r.selectNodeContents(addr);
      var sel=getSelection();sel.removeAllRanges();sel.addRange(r);
      say('Selected. Press Ctrl+C to copy');
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(function(){say('Copied')},fallback);
    }else{fallback()}
  });
})();
