// Lightbox for zoomable images — click any img.zoomable to view it
// full-screen; close with the X button, Escape, or clicking outside.
// Images that opt in with data-show-caption="true" also get a bottom-left
// caption (their alt text), plus a second line from data-medium if present.
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

    function open(src, alt, caption, subCaption){
      imgEl.src = src;
      imgEl.alt = alt || '';
      if(caption){
        captionMainEl.textContent = caption;
        captionSubEl.textContent = subCaption || '';
        captionSubEl.style.display = subCaption ? '' : 'none';
        captionEl.style.display = 'flex';
      } else {
        captionEl.style.display = 'none';
      }
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
        var showCaption = img.dataset.showCaption === 'true';
        open(img.currentSrc || img.src, img.alt, showCaption ? (img.alt || '') : '', img.dataset.medium || '');
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
