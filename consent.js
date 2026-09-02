/* Cookie consent for Google Analytics — Not Done Yet / Ali Heathfield
   No analytics script is loaded until the visitor accepts. Choice is
   remembered in localStorage and can be changed at any time via the
   small "Cookie settings" control in the corner of every page. */
(function () {
  var GA_ID = 'G-8Z4T3EYG12';
  var STORAGE_KEY = 'llw-analytics-consent'; // 'granted' | 'denied'
  var gaLoaded = false;

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* ignore */ }
  }

  function deleteGACookies() {
    var parts = document.cookie.split(';');
    for (var i = 0; i < parts.length; i++) {
      var name = parts[i].split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname + ';';
      }
    }
  }

  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function injectStyle() {
    if (document.getElementById('consent-style')) return;
    var css = ''
      + '#consent-banner{position:fixed;left:0;right:0;bottom:0;z-index:200;'
      + 'background:var(--paper);border-top:1px solid var(--hair);'
      + 'box-shadow:0 -6px 20px rgba(0,0,0,.06);}'
      + '#consent-banner .consent-inner{max-width:1180px;margin:0 auto;padding:18px 32px;'
      + 'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;}'
      + '#consent-banner p{margin:0;font-size:.92rem;line-height:1.6;color:var(--ink-soft);max-width:64ch;}'
      + '#consent-banner a{color:var(--ink);text-decoration:underline;}'
      + '#consent-banner .consent-actions{display:flex;gap:10px;flex-shrink:0;}'
      + '.consent-btn{font-size:.88rem;font-weight:700;padding:10px 18px;border-radius:6px;'
      + 'border:1px solid var(--hair);background:var(--paper);color:var(--ink);cursor:pointer;}'
      + '.consent-btn.consent-accept{background:var(--orange);border-color:var(--orange);color:#fff;}'
      + '#consent-toggle{position:fixed;left:20px;bottom:20px;z-index:190;'
      + 'font-size:.8rem;font-weight:600;color:var(--ink-soft);background:var(--paper);'
      + 'border:1px solid var(--hair);border-radius:20px;padding:8px 16px;cursor:pointer;'
      + 'box-shadow:0 4px 14px rgba(0,0,0,.08);}'
      + '#consent-toggle:hover{color:var(--ink);}'
      + '@media (max-width:640px){'
      + '#consent-banner .consent-inner{flex-direction:column;align-items:stretch;padding:16px 20px;}'
      + '#consent-banner .consent-actions{justify-content:flex-end;}'
      + '#consent-toggle{left:12px;bottom:12px;font-size:.76rem;padding:7px 14px;}'
      + '}';
    var style = document.createElement('style');
    style.id = 'consent-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showBanner() {
    injectStyle();
    if (document.getElementById('consent-banner')) return;
    var toggle = document.getElementById('consent-toggle');
    if (toggle) toggle.style.display = 'none';

    var el = document.createElement('div');
    el.id = 'consent-banner';
    el.innerHTML =
      '<div class="consent-inner">' +
      '<p>This site uses Google Analytics to understand how visitors find and use it. ' +
      'No data collected is used to identify you personally. ' +
      '<a href="privacy.html">Read more</a>.</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="consent-btn consent-decline">Decline</button>' +
      '<button type="button" class="consent-btn consent-accept">Accept</button>' +
      '</div></div>';
    document.body.appendChild(el);
    el.querySelector('.consent-accept').addEventListener('click', function () {
      setConsent('granted');
      loadGA();
      hideBanner();
    });
    el.querySelector('.consent-decline').addEventListener('click', function () {
      setConsent('denied');
      deleteGACookies();
      hideBanner();
    });
  }

  function hideBanner() {
    var el = document.getElementById('consent-banner');
    if (el) el.remove();
    var toggle = document.getElementById('consent-toggle');
    if (toggle) toggle.style.display = '';
  }

  function buildToggle() {
    injectStyle();
    if (document.getElementById('consent-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'consent-toggle';
    btn.textContent = 'Cookie settings';
    btn.setAttribute('aria-label', 'Cookie settings');
    btn.addEventListener('click', showBanner);
    document.body.appendChild(btn);
  }

  function init() {
    buildToggle();
    var consent = getConsent();
    if (consent === 'granted') {
      loadGA();
    } else if (consent !== 'denied') {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
