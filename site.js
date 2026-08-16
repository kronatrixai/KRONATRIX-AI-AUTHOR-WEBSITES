(function(){
  const GA_ID='G-HVE7XRLZEP';
  const CONSENT_KEY='kronatrix_analytics_consent';
  const SERVICE_KEY='kronatrix_selected_service';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};

  // Default denied. The Google tag itself is not loaded until analytics consent is granted.
  window.gtag('consent','default',{
    analytics_storage:'denied',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied'
  });

  let gaLoaded=false;
  function loadGA(){
    if(gaLoaded) return;
    gaLoaded=true;
    window.gtag('consent','update',{
      analytics_storage:'granted',
      ad_storage:'denied',
      ad_user_data:'denied',
      ad_personalization:'denied'
    });
    const s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.gtag('js',new Date());
    window.gtag('config',GA_ID,{send_page_view:true});
  }

  function consentValue(){
    try{return localStorage.getItem(CONSENT_KEY);}catch(e){return null;}
  }
  function storeConsent(v){
    try{localStorage.setItem(CONSENT_KEY,v);}catch(e){}
  }
  function track(name,params){
    if(consentValue()==='granted'){
      loadGA();
      window.gtag('event',name,params||{});
    }
  }

  function ensureBanner(){
    let banner=document.getElementById('cookie-banner');
    if(banner) return banner;
    banner=document.createElement('div');
    banner.id='cookie-banner';
    banner.className='cookie-banner';
    banner.setAttribute('role','dialog');
    banner.setAttribute('aria-label','Analytics cookie choices');
    banner.innerHTML='<div class="cookie-inner"><div><strong>Analytics cookies</strong><p>KRONATRIX uses Google Analytics to understand visits and improve this website. Analytics will only load if you accept. Your enquiry email is never sent to Google Analytics. <a href="privacy.html">Privacy notice</a>.</p></div><div class="cookie-actions"><button type="button" class="cookie-decline">Decline analytics</button><button type="button" class="cookie-accept">Accept analytics</button></div></div>';
    document.body.appendChild(banner);
    banner.querySelector('.cookie-accept').addEventListener('click',function(){
      storeConsent('granted'); banner.classList.remove('show'); loadGA();
      window.gtag('event','analytics_consent_granted');
    });
    banner.querySelector('.cookie-decline').addEventListener('click',function(){
      storeConsent('denied');
      window.gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      banner.classList.remove('show');
    });
    return banner;
  }

  function showBanner(){ensureBanner().classList.add('show');}

  document.addEventListener('DOMContentLoaded',function(){
    const c=consentValue();
    if(c==='granted') loadGA();
    else if(c!=='denied') showBanner();

    document.querySelectorAll('.cookie-settings').forEach(function(btn){
      btn.addEventListener('click',function(e){
        e.preventDefault();
        try{localStorage.removeItem(CONSENT_KEY);}catch(err){}
        showBanner();
      });
    });

    const field=document.getElementById('service_requested');
    const label=document.getElementById('selected-service-label');
    let saved=null;
    try{saved=sessionStorage.getItem(SERVICE_KEY);}catch(e){}
    if(saved && field){
      field.value=saved;
      if(label) label.textContent='Selected: '+saved;
    }

    document.querySelectorAll('.service-choice[data-service]').forEach(function(el){
      el.addEventListener('click',function(){
        const value=el.getAttribute('data-service')||'Not selected yet';
        try{sessionStorage.setItem(SERVICE_KEY,value);}catch(e){}
        if(field) field.value=value;
        if(label) label.textContent='Selected: '+value;
        let eventName='service_selected';
        if(value.indexOf('Book Preview')>-1) eventName='book_preview_package_selected';
        else if(value.indexOf('Author Website')>-1) eventName='author_website_package_selected';
        else if(value.indexOf('Advertising')>-1) eventName='advertising_package_selected';
        track(eventName,{service_name:value});
      });
    });

    document.querySelectorAll('[data-track]').forEach(function(el){
      el.addEventListener('click',function(){
        track(el.getAttribute('data-track'),{
          link_url:el.href||'',
          link_text:(el.textContent||'').trim().slice(0,120)
        });
      });
    });

    const form=document.getElementById('qualification-form');
    if(form){
      form.addEventListener('submit',function(){
        // No email address or other personal data is sent to Google Analytics.
        track('qualification_form_submit',{
          service_name:field?field.value:'Not selected'
        });
        track('generate_lead',{
          currency:'GBP',
          service_name:field?field.value:'Not selected'
        });
      });
    }
  });
})();
