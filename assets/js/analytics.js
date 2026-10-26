/* Visitor analytics via Umami Cloud (cookieless).

   Per-recipient links: send https://abdel-wakil.github.io/?ref=acme-cto
   and every visit from that browser is tagged "acme-cto" in Umami
   (time, location, device, pages, resume downloads), including later
   visits without the ?ref, since the tag is remembered in the browser.

   Exclude your own visits: open the site once with ?notrack on each of
   your devices/browsers (?track turns it back on).

   Nothing loads until UMAMI_WEBSITE_ID is set. */
(function () {
  'use strict';

  var UMAMI_WEBSITE_ID = ''; // Umami → Settings → Websites → your site → Website ID
  var REF_KEY = 'ak_ref';

  var params = new URLSearchParams(location.search);
  try {
    if (params.has('notrack')) localStorage.setItem('umami.disabled', '1');
    if (params.has('track')) localStorage.removeItem('umami.disabled');
  } catch (e) {}

  // recipient tag: from the link if present, else remembered from an earlier visit
  var ref = params.get('ref');
  if (ref && /^[A-Za-z0-9_-]{1,40}$/.test(ref)) {
    ref = ref.toLowerCase();
    try { localStorage.setItem(REF_KEY, ref); } catch (e) {}
  } else {
    ref = null;
    try { ref = localStorage.getItem(REF_KEY); } catch (e) {}
  }

  if (!UMAMI_WEBSITE_ID) return;

  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.setAttribute('data-website-id', UMAMI_WEBSITE_ID);
  s.onload = function () {
    if (ref && window.umami) window.umami.identify(ref, { recipient: ref });
  };
  document.head.appendChild(s);

  // the clicks that matter: resume, contact, profiles
  var EVENTS = [
    [/resume\.pdf/, 'resume-download'],
    [/^mailto:/, 'email-click'],
    [/linkedin\.com/, 'linkedin-click'],
    [/github\.com/, 'github-click']
  ];
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !window.umami) return;
    var href = a.getAttribute('href');
    for (var i = 0; i < EVENTS.length; i++) {
      if (EVENTS[i][0].test(href)) {
        window.umami.track(EVENTS[i][1], ref ? { recipient: ref } : undefined);
        return;
      }
    }
  });
})();
