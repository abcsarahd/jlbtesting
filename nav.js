(function () {
  'use strict';

  /* ── Language ── */
  var LANG_KEY = 'iterum-lang';
  var DEFAULT_LANG = 'en';

  function getLang() {
    try { return localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; }
  }
  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  window.switchLang = function (lang) {
    document.querySelectorAll('.lang-content').forEach(function (el) { el.classList.remove('active'); });
    document.querySelectorAll('.lang-btn').forEach(function (el) {
      el.classList.remove('active');
      el.setAttribute('aria-pressed', 'false');
    });
    var content = document.getElementById('page-' + lang);
    if (content) content.classList.add('active');
    document.querySelectorAll('.lang-btn[data-lang="' + lang + '"]').forEach(function (el) {
      el.classList.add('active');
      el.setAttribute('aria-pressed', 'true');
    });
    document.documentElement.lang = lang;
    setLang(lang);
  };

  /* ── Hamburger ── */
  var panel = null;

  function buildPanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.id = 'nav-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Site navigation');
    panel.innerHTML =
      '<ul class="nav-panel-links">' +
        '<li><a href="index.html">Home</a></li>' +
        '<li><a href="about.html">About</a></li>' +
        '<li><a href="forms.html">Forms</a></li>' +
        '<li><a href="contact.html">Contact</a></li>' +
      '</ul>' +
      '<div class="nav-panel-lang">' +
        '<button class="panel-lang-btn" data-lang="en" onclick="switchLang(\'en\')">English</button>' +
        '<span aria-hidden="true">|</span>' +
        '<button class="panel-lang-btn" data-lang="es" onclick="switchLang(\'es\')">Español</button>' +
      '</div>';
    var nav = document.querySelector('nav');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(panel, nav.nextSibling);
  }

  function openPanel(btn) {
    buildPanel();
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.ham-icon').style.display = 'none';
    btn.querySelector('.close-icon').style.display = 'block';
    document.addEventListener('keydown', onKey);
    setTimeout(function () { document.addEventListener('click', onOutside); }, 0);
    syncPanelLang();
  }

  function closePanel(btn) {
    if (!panel) return;
    panel.classList.remove('open');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('.ham-icon').style.display = 'block';
      btn.querySelector('.close-icon').style.display = 'none';
    }
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('click', onOutside);
  }

  function syncPanelLang() {
    if (!panel) return;
    var lang = document.documentElement.lang || getLang();
    panel.querySelectorAll('.panel-lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
  }

  window.toggleNav = function (btn) {
    if (panel && panel.classList.contains('open')) {
      closePanel(btn);
    } else {
      openPanel(btn);
    }
  };

  function onKey(e) {
    if (e.key === 'Escape') {
      var btn = document.querySelector('.nav-hamburger');
      closePanel(btn);
      if (btn) btn.focus();
    }
  }

  function onOutside(e) {
    if (!panel) return;
    var btn = document.querySelector('.nav-hamburger');
    if (!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      closePanel(btn);
    }
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    var saved = getLang();
    if (saved !== DEFAULT_LANG) {
      window.switchLang(saved);
    }

    // close panel when a nav link inside it is clicked
    document.addEventListener('click', function (e) {
      if (panel && panel.classList.contains('open')) {
        var link = e.target.closest('a');
        if (link && panel.contains(link)) {
          var btn = document.querySelector('.nav-hamburger');
          closePanel(btn);
        }
      }
    });

    // keep panel lang indicators in sync whenever switchLang is called
    var origSwitch = window.switchLang;
    window.switchLang = function (lang) {
      origSwitch(lang);
      syncPanelLang();
    };

    syncPanelLang();
  });
})();
