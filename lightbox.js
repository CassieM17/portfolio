// Lightbox for zoomable images — click any img.zoomable to view it
// full-screen; close with the X button, Escape, or clicking outside.
(function(){
  function initLightbox(){
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img class="lightbox-img" src="" alt="">';
    document.body.appendChild(overlay);
    var imgEl = overlay.querySelector('.lightbox-img');
    var closeBtn = overlay.querySelector('.lightbox-close');

    function open(src, alt){
      imgEl.src = src;
      imgEl.alt = alt || '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
    overlay.addEventListener('click', function(e){
      if(e.target === overlay){ close(); }
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ close(); }
    });

    document.querySelectorAll('img.zoomable').forEach(function(img){
      img.addEventListener('click', function(){
        open(img.currentSrc || img.src, img.alt);
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
