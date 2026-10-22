/* Site-wide behaviour: scroll reveal, gallery lightbox, stat count-up,
   and on-screen-only playback for looping CAD animations.
   No dependencies; every feature degrades to a plain static page. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ─── SCROLL REVEAL ─────────────────────────────────────── */
  var REVEAL = '.card, .mention, .media-block, .figure, .stat-row, .gallery-item, ' +
               '.sidebar-block, .timeline-item, .callout, .section-head, .featured-divider';

  if (hasIO && !reduceMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          revealIO.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    var fold = window.innerHeight;
    document.querySelectorAll(REVEAL).forEach(function (el) {
      if (el.closest('.figure') && el.closest('.figure') !== el) return; // animate the figure, not its parts
      if (el.getBoundingClientRect().top < fold) return;                 // already visible: leave alone
      // stagger siblings that share a row (grid cards, gallery tiles)
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', (idx % 3) * 0.07 + 's');
      el.classList.add('reveal');
      revealIO.observe(el);
    });
  }

  /* ─── STAT COUNT-UP ─────────────────────────────────────── */
  // "2.7 kg" counts 0 → 2.7 and keeps its unit; runs once when visible
  function countUp(el) {
    var m = el.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var target = parseFloat(m[1]);
    var decimals = (m[1].split('.')[1] || '').length;
    var suffix = m[2];
    var t0 = null, dur = 1100;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (hasIO && !reduceMotion) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); statIO.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.stat .num').forEach(function (el) { statIO.observe(el); });
  }

  /* ─── LOOPING ANIMATIONS: play only while on screen ─────── */
  var vids = document.querySelectorAll('video[data-autoplay]');
  vids.forEach(function (v) { v.muted = true; v.loop = true; v.playsInline = true; });
  if (hasIO && !reduceMotion) {
    var vidIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vidIO.observe(v); });
  } else {
    vids.forEach(function (v) { v.controls = true; });
  }

  /* ─── GALLERY LIGHTBOX ──────────────────────────────────── */
  // markup: <div class="gallery"><a class="gallery-item" href="full.jpg">
  //           <img src="thumb.jpg" alt="..."><figcaption>...</figcaption></a>...
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery .gallery-item'));
  if (!items.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML =
    '<button class="lb-close" aria-label="Close">&#10005;</button>' +
    '<button class="lb-prev" aria-label="Previous photo">&#8592;</button>' +
    '<button class="lb-next" aria-label="Next photo">&#8594;</button>' +
    '<img alt="">' +
    '<div class="lightbox-caption"></div>';
  document.body.appendChild(box);

  var img = box.querySelector('img');
  var cap = box.querySelector('.lightbox-caption');
  var current = 0, lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    var a = items[current];
    var thumb = a.querySelector('img');
    var fc = a.querySelector('figcaption');
    img.src = a.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    cap.innerHTML = '<span class="count">' + String(current + 1).padStart(2, '0') + ' / ' +
                    String(items.length).padStart(2, '0') + '</span>';
    cap.appendChild(document.createTextNode(fc ? fc.textContent : img.alt));
    // warm the cache for the neighbours
    [current - 1, current + 1].forEach(function (n) {
      new Image().src = items[(n + items.length) % items.length].getAttribute('href');
    });
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  // swipe on touch screens
  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
