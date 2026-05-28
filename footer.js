'use strict';
(function(){
  document.querySelectorAll('.fm-nav-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var panelId=this.getAttribute('data-target');
      var panel=document.getElementById(panelId);
      var isOpen=this.getAttribute('aria-expanded')==='true';
      document.querySelectorAll('.fm-nav-btn').forEach(function(b){b.setAttribute('aria-expanded','false');});
      document.querySelectorAll('.fm-nav-panel').forEach(function(p){p.classList.remove('is-open');});
      if(!isOpen){
        this.setAttribute('aria-expanded','true');
        panel.classList.add('is-open');
      }
    });
  });
})();
