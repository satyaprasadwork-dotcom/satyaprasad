/* Optional analytics and advertising only after an affirmative choice.
   This preference interface is NOT a Google-certified TCF CMP. Configure a
   certified CMP in AdSense Privacy & Messaging before EEA/UK/CH ad serving. */
(function(){
  'use strict';
  var storageKey='sp-optional-consent-v1';
  var banner=document.getElementById('consent-banner');
  function script(src,attrs){
    if(document.querySelector('script[data-optional-source="'+src+'"]'))return;
    var s=document.createElement('script');s.src=src;s.async=true;s.setAttribute('data-optional-source',src);
    Object.keys(attrs||{}).forEach(function(k){s.setAttribute(k,attrs[k])});document.head.appendChild(s);
  }
  function activate(){
    if(window.__spOptionalLoaded)return;
    window.__spOptionalLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){dataLayer.push(arguments)};
    gtag('js',new Date());gtag('config','G-K44B9PCZ16');
    script('https://www.googletagmanager.com/gtag/js?id=G-K44B9PCZ16');
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i+'?ref=bwt';
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,'clarity','script','yz9non0rsk');
    script('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7937216909291905',{'crossorigin':'anonymous'});
  }
  function choice(){
    try{return localStorage.getItem(storageKey)}catch(e){return null}
  }
  function set(value){
    try{localStorage.setItem(storageKey,value)}catch(e){}
    if(banner)banner.hidden=true;
    if(value==='accepted')activate();
  }
  if(banner){
    banner.querySelector('[data-consent-accept]').addEventListener('click',function(){set('accepted')});
    banner.querySelector('[data-consent-reject]').addEventListener('click',function(){set('rejected')});
  }
  document.querySelectorAll('[data-privacy-settings]').forEach(function(b){
    b.addEventListener('click',function(){if(banner){banner.hidden=false;banner.querySelector('[data-consent-reject]').focus()}});
  });
  var saved=choice();if(saved==='accepted')activate();else if(saved!=='rejected'&&banner)banner.hidden=false;
})();
