// Lightbox for zoomable images — click any img.zoomable to view it
// full-screen; close with the X button, Escape, or clicking outside.
// Images that opt in with data-show-caption="true" also get a bottom-left
// caption (their alt text), plus a second line from data-medium if present.
// Images that opt in with data-nav-prev/data-nav-next (each the id of a
// prev/next button elsewhere on the page, e.g. the photo roll or easel
// arrows) can also be paged through with the left/right arrow keys while
// zoomed in — the underlying viewer advances and the lightbox re-syncs
// its image and caption from it.
(function(){
  function initLightbox(){
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<div class="lightbox-frame">' +
        '<img class="lightbox-img" src="" alt="">' +
        '<div class="lightbox-caption"><span class="lightbox-caption-main"></span><span class="lightbox-caption-sub"></span></div>' +
      '</div>';
    document.body.appendChild(overlay);
    var imgEl = overlay.querySelector('.lightbox-img');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var captionEl = overlay.querySelector('.lightbox-caption');
    var captionMainEl = overlay.querySelector('.lightbox-caption-main');
    var captionSubEl = overlay.querySelector('.lightbox-caption-sub');
    var triggerImg = null;

    function renderCaption(alt, subCaption){
      if(alt){
        captionMainEl.textContent = alt;
        captionSubEl.textContent = subCaption || '';
        captionSubEl.style.display = subCaption ? '' : 'none';
        captionEl.style.display = 'flex';
      } else {
        captionEl.style.display = 'none';
      }
    }

    function open(img){
      triggerImg = img;
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.alt || '';
      var showCaption = img.dataset.showCaption === 'true';
      renderCaption(showCaption ? (img.alt || '') : '', img.dataset.medium || '');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      triggerImg = null;
    }
    function navigate(delta){
      if(!triggerImg){ return; }
      var btnId = delta < 0 ? triggerImg.dataset.navPrev : triggerImg.dataset.navNext;
      if(!btnId){ return; }
      var btn = document.getElementById(btnId);
      if(!btn){ return; }
      btn.click();
      imgEl.src = triggerImg.src;
      imgEl.alt = triggerImg.alt || '';
      var showCaption = triggerImg.dataset.showCaption === 'true';
      renderCaption(showCaption ? (triggerImg.alt || '') : '', triggerImg.dataset.medium || '');
    }
    overlay.addEventListener('click', function(e){
      if(e.target === overlay){ close(); }
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function(e){
      if(!overlay.classList.contains('open')){ return; }
      if(e.key === 'Escape'){ close(); }
      else if(e.key === 'ArrowLeft'){ navigate(-1); }
      else if(e.key === 'ArrowRight'){ navigate(1); }
    });

    document.querySelectorAll('img.zoomable').forEach(function(img){
      img.addEventListener('click', function(){ open(img); });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
