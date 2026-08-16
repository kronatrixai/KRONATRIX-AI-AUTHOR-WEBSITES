(function(){
  const SERVICE_KEY='kronatrix_selected_service';

  document.addEventListener('DOMContentLoaded',function(){
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
        const value=el.getAttribute('data-service') || 'Not selected yet';
        try{sessionStorage.setItem(SERVICE_KEY,value);}catch(e){}
        if(field) field.value=value;
        if(label) label.textContent='Selected: '+value;
      });
    });
  });
})();
