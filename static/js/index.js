window.HELP_IMPROVE_VIDEOJS = false;


$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();

  (function () {
    function hydrate(video) {
      video.querySelectorAll('source[data-src]').forEach(s => (s.src = s.dataset.src));
      video.load();
    }
    document.querySelectorAll('[data-video]').forEach(function (box) {
      var poster = box.querySelector('.poster');
      var video  = box.querySelector('video');
      var btn    = box.querySelector('.play');
      var start = function () {
        if (!video.currentSrc) hydrate(video);
        if (poster) poster.hidden = true;
        video.hidden = false;
		if (btn) btn.hidden = true;
        video.play().catch(function(){});
      };
      if (btn)    btn.addEventListener('click', start);
      if (poster) poster.addEventListener('click', start);
    });
  })();
  
  
  function lazyLoadYouTube(root) {
    var iframes = (root || document).querySelectorAll('iframe[data-src]');
    function load(f){ if (!f.src) f.src = f.dataset.src; }
    if (!('IntersectionObserver' in window)) { iframes.forEach(load); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { load(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '200px' });
    iframes.forEach(function(f){ io.observe(f); });
  }

  function pauseAllYouTube(root) {
    (root || document).querySelectorAll('iframe[src*="youtube"]').forEach(function(f){
      try {
        f.contentWindow.postMessage(JSON.stringify({
          event:'command', func:'pauseVideo', args:[]
        }), '*');
      } catch(e){}
    });
  }

  
  lazyLoadYouTube(document);

  
  if (Array.isArray(carousels)) {
    carousels.forEach(function(c){
      try {
        c.on('before:show', function(){ pauseAllYouTube(c.element); });
        c.on('after:show',  function(){
          var active = c.element.querySelector('.is-active iframe[data-src]');
          if (active && !active.src) active.src = active.dataset.src;
        });
      } catch (e) {
        
        c.element.addEventListener('click', function(ev){
          if (ev.target.closest('.carousel-nav')
              || ev.target.closest('.slider-navigation-previous')
              || ev.target.closest('.slider-navigation-next')) {
            pauseAllYouTube(c.element);
            var active = c.element.querySelector('.is-active iframe[data-src]');
            if (active && !active.src) active.src = active.dataset.src;
          }
        });
      }
    });
  }
  
})
