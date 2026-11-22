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
    var stripEl = document.createElement('div');
    stripEl.className = 'lightbox-strip';
    overlay.appendChild(stripEl);

    // Optional thumbnail bar: an image with data-strip="true" gets a row of
    // previews under the zoomed picture, driven by window.lightboxStrip
    // ({items:[{src,label}], index(), set(i)}) which the page provides.
    function syncStrip(){
      var api = window.lightboxStrip;
      var on = !!(triggerImg && triggerImg.dataset.strip === 'true' && api);
      overlay.classList.toggle('has-strip', on);
      stripEl.innerHTML = '';
      if(!on){ return; }
      api.items.forEach(function(it, i){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'lightbox-thumb' + (i === api.index() ? ' active' : '');
        b.setAttribute('aria-label', it.label);
        var t = document.createElement('img');
        t.src = it.src; t.alt = it.label;
        b.appendChild(t);
        b.addEventListener('click', function(e){
          e.stopPropagation();
          api.set(i);
          imgEl.src = triggerImg.src;
          imgEl.alt = triggerImg.alt || '';
          renderCaption(triggerImg.dataset.caption || triggerImg.alt || '', triggerImg.dataset.medium || '');
          syncStrip();
        });
        stripEl.appendChild(b);
      });
    }

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
      renderCaption(showCaption ? (img.dataset.caption || img.alt || '') : '', img.dataset.medium || '');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      syncStrip();
    }
    function close(){
      overlay.classList.remove('open');
      overlay.classList.remove('has-strip');
      document.body.style.overflow = '';
      triggerImg = null;
    }
    function navigate(delta){
      if(!triggerImg){ return; }
      var btnId = delta < 0 ? triggerImg.dataset.navPrev : triggerImg.dataset.navNext;
      if(!btnId){
        // Fallback: page through the other zoomable images in the same
        // carousel track (e.g. the violin Media row), wrapping around.
        var track = triggerImg.closest('.media-carousel-track, [data-lightbox-group]');
        if(!track){ return; }
        var group = Array.prototype.slice.call(track.querySelectorAll('img.zoomable'));
        var i = group.indexOf(triggerImg);
        if(i < 0){ return; }
        triggerImg = group[(i + delta + group.length) % group.length];
        imgEl.src = triggerImg.currentSrc || triggerImg.src;
        imgEl.alt = triggerImg.alt || '';
        var sc = triggerImg.dataset.showCaption === 'true';
        renderCaption(sc ? (triggerImg.dataset.caption || triggerImg.alt || '') : '', triggerImg.dataset.medium || '');
        if(triggerImg.scrollIntoView){ triggerImg.scrollIntoView({block:'nearest', inline:'center'}); }
        return;
      }
      var btn = document.getElementById(btnId);
      if(!btn){ return; }
      btn.click();
      imgEl.src = triggerImg.src;
      imgEl.alt = triggerImg.alt || '';
      var showCaption = triggerImg.dataset.showCaption === 'true';
      renderCaption(showCaption ? (triggerImg.dataset.caption || triggerImg.alt || '') : '', triggerImg.dataset.medium || '');
      syncStrip();
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
