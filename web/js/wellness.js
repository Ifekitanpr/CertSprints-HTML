/**
 * CertSprints Wellness Check-in
 *
 * Trigger conditions (all must be true):
 *   1. No other modal is active (checks data-modal-active on <body>)
 *   2. User has NOT completed a check-in in the last 3 days
 *   3. User has at least one study activity planned today (simulated via flag)
 *   4. User shows missed work, performance drop, or heavy load (simulated via flag)
 *
 * After selection:
 *   FRESH      → Full Sprint   (stores 'fresh'   in localStorage)
 *   TIRED      → Moderate Load (stores 'tired'   in localStorage)
 *   EXHAUSTED  → Rest Day      (stores 'exhausted' in localStorage)
 */

(function () {
  var STORAGE_KEY_DATE  = 'cs_wellness_last_date';
  var STORAGE_KEY_MOOD  = 'cs_wellness_mood';
  var SESSION_WELLNESS_SHOWN = 'cs_wellness_shown_this_visit';
  var THREE_DAYS_MS     = 3 * 24 * 60 * 60 * 1000;
  var ASSETS            = 'assets/wellness/';

  function findPhoneScreen() {
    return (
      document.querySelector('.phone-case .screen') ||
      document.querySelector('main.phone-case .screen') ||
      document.querySelector('.screen.dashboard-screen') ||
      document.querySelector('.screen')
    );
  }

  function markWellnessShownThisVisit() {
    try {
      sessionStorage.setItem(SESSION_WELLNESS_SHOWN, '1');
    } catch (e) { /* ignore */ }
  }

  function notifyDismissed() {
    try {
      window.dispatchEvent(new CustomEvent('cs-wellness-dismissed'));
    } catch (e) { /* ignore */ }
  }

  /* ── Trigger logic ──────────────────────────────────────────────── */

  function daysSinceLastCheckIn() {
    var last = localStorage.getItem(STORAGE_KEY_DATE);
    if (!last) return Infinity;
    return (Date.now() - parseInt(last, 10));
  }

  function shouldShow() {
    if (document.body.dataset.modalActive) return false;
    if (daysSinceLastCheckIn() < THREE_DAYS_MS) return false;
    return true;
  }

  function recordCheckIn(mood) {
    localStorage.setItem(STORAGE_KEY_DATE, Date.now().toString());
    localStorage.setItem(STORAGE_KEY_MOOD, mood);
  }

  /* ── HTML template ──────────────────────────────────────────────── */

  function buildOverlayHTML() {
    return [
      '<div id="wcOverlay" class="wc-overlay" role="dialog" aria-modal="true" aria-label="Wellness Check-in" hidden>',
        '<div class="wc-scrim" id="wcScrim"></div>',

        /* ── INTRO SHEET ─────────────────────────────── */
        '<div class="wc-sheet wc-sheet--intro" id="wcIntro">',
          '<div class="wc-handle" aria-hidden="true"></div>',
          '<div class="wc-hero-wrap">',
            '<div class="wc-ring-lg">',
              '<img class="wc-ring-img wc-ring-img--outer" src="' + ASSETS + 'ring-lg-outer.svg" alt="" />',
              '<img class="wc-ring-img wc-ring-img--inner" src="' + ASSETS + 'ring-lg-inner.svg" alt="" />',
              '<span class="wc-ring-icon">',
                '<img src="' + ASSETS + 'icon-heart-add.svg" alt="" />',
              '</span>',
            '</div>',
          '</div>',
          '<div class="wc-intro-copy">',
            '<p class="wc-eyebrow">Daily Wellness Check-in</p>',
            '<h2 class="wc-h2">How are you feeling today?</h2>',
          '</div>',
          '<div class="wc-intro-actions">',
            '<button class="wc-btn wc-btn--red" id="wcCheckInBtn" type="button">',
              'Check In',
              '<span class="wc-btn-icon"><img src="' + ASSETS + 'icon-arrow-right.svg" alt="" /></span>',
            '</button>',
            '<button class="wc-btn wc-btn--muted" id="wcSkipBtn" type="button">Skip for today</button>',
          '</div>',
        '</div>',

        /* ── MOOD SELECTION SHEET ────────────────────── */
        '<div class="wc-sheet wc-sheet--mood" id="wcMood" hidden>',
          '<div class="wc-handle" aria-hidden="true"></div>',
          '<div class="wc-sheet-header">',
            '<div class="wc-header-badge"><img src="' + ASSETS + 'icon-heart-add.svg" alt="" /></div>',
            '<span class="wc-header-title">Wellness Check-in</span>',
          '</div>',
          '<div class="wc-sheet-divider"></div>',
          '<div class="wc-mood-body">',
            '<h2 class="wc-mood-h2">How are you feeling today?</h2>',
            '<p class="wc-mood-sub">Your answer shapes today\'s study plan to match your energy level, no burnout, no wasted effort.</p>',
            '<div class="wc-mood-choices">',

              '<button class="wc-mood-btn wc-mood-btn--green" id="wcFresh" type="button">',
                '<div class="wc-mood-icon wc-mood-icon--green"><img src="' + ASSETS + 'icon-flash.svg" alt="" /></div>',
                '<div class="wc-mood-label">',
                  '<span class="wc-mood-name" style="color:#16a34a">FRESH</span>',
                  '<span class="wc-mood-desc">Ready to sprint</span>',
                '</div>',
                '<span class="wc-mood-badge" style="background:#f0fdf4;color:#22c55e">Full Sprint</span>',
              '</button>',

              '<button class="wc-mood-btn wc-mood-btn--orange" id="wcTired" type="button">',
                '<div class="wc-mood-icon wc-mood-icon--orange"><img src="' + ASSETS + 'icon-cloud-rain.svg" alt="" /></div>',
                '<div class="wc-mood-label">',
                  '<span class="wc-mood-name" style="color:#ff6b35">TIRED</span>',
                  '<span class="wc-mood-desc">A bit worn out</span>',
                '</div>',
                '<span class="wc-mood-badge" style="background:#fff0eb;color:#ff6b35">Moderate</span>',
              '</button>',

              '<button class="wc-mood-btn wc-mood-btn--blue" id="wcExhausted" type="button">',
                '<div class="wc-mood-icon wc-mood-icon--blue"><img src="' + ASSETS + 'icon-sleeping.svg" alt="" /></div>',
                '<div class="wc-mood-label">',
                  '<span class="wc-mood-name" style="color:#007bff">EXHAUSTED</span>',
                  '<span class="wc-mood-desc">Need a break</span>',
                '</div>',
                '<span class="wc-mood-badge" style="background:#e6f2ff;color:#007bff">Rest Day</span>',
              '</button>',

            '</div>',
            '<p class="wc-footer-note">Your answer is saved for today and adapts your dashboard experience</p>',
          '</div>',
        '</div>',

        /* ── RESULT: FRESH ───────────────────────────── */
        buildResultSheet('wcResultFresh', {
          iconSrc: ASSETS + 'icon-flash-result.svg',
          iconBg: '#e6f2ff',
          title: 'Peak performance mode',
          subtitle: 'You\'re in great shape. Full study load active—tackle tough concepts first.',
          barColor: '#2ecc71',
          barWidth: '100%',
          intensity: 'STUDY INTENSITY TODAY',
          intensityLabel: 'Full Sprint',
          intensityColor: '#16a34a',
          dividerColor: '#dcfce7',
          recs: [
            { icon: ASSETS + 'icon-book.svg',   bg: 'rgba(240,253,244,.5)',  text: 'Tackle new concepts first' },
            { icon: ASSETS + 'icon-timer.svg',  bg: 'rgba(240,253,244,.5)',  text: 'Full timed practice blocks' },
            { icon: ASSETS + 'icon-target.svg', bg: 'rgba(240,253,244,.5)',  text: 'Prioritise weak domains' },
          ]
        }),

        /* ── RESULT: TIRED ───────────────────────────── */
        buildResultSheet('wcResultTired', {
          iconSrc: ASSETS + 'icon-cloud-result.svg',
          iconBg: '#fff0eb',
          title: 'Adjusted for a lighter load',
          subtitle: 'Normal. Review-only, shorter sessions—reinforce what you know.',
          barColor: '#ff6b35',
          barWidth: '72%',
          intensity: 'STUDY INTENSITY TODAY',
          intensityLabel: 'Moderate',
          intensityColor: '#ff6b35',
          dividerColor: '#ffd1c0',
          recs: [
            { icon: ASSETS + 'icon-reload.svg', bg: 'rgba(255,240,235,.5)', text: 'Review sprint sessions only' },
            { icon: ASSETS + 'icon-timer2.svg', bg: 'rgba(255,240,235,.5)', text: 'Flashcard revision (20 min)' },
            { icon: ASSETS + 'icon-pause.svg',  bg: 'rgba(255,240,235,.5)', text: 'Skip timed practice exams' },
          ]
        }),

        /* ── RESULT: EXHAUSTED ───────────────────────── */
        buildResultSheet('wcResultExhausted', {
          iconSrc: ASSETS + 'icon-sun-cloud.svg',
          iconBg: '#e6f2ff',
          title: 'Rest day activated',
          subtitle: 'Recovery matters. Do a 15-min light review—skip heavy material.',
          barColor: '#007bff',
          barWidth: '17.5%',
          intensity: 'STUDY INTENSITY TODAY',
          intensityLabel: 'Rest Day',
          intensityColor: '#007bff',
          dividerColor: '#b0d6ff',
          recs: [
            { icon: ASSETS + 'icon-reload2.svg',   bg: 'rgba(230,242,255,.5)', text: '15-min passive review only' },
            { icon: ASSETS + 'icon-no-equal.svg',  bg: 'rgba(230,242,255,.5)', text: 'No timed or exam sessions' },
            { icon: ASSETS + 'icon-bed.svg',        bg: 'rgba(230,242,255,.5)', text: 'Rest & let memory consolidate' },
          ]
        }),

      '</div>'
    ].join('');
  }

  function buildResultSheet(id, o) {
    var recs = o.recs.map(function(r) {
      return [
        '<div class="wc-rec" style="background:' + r.bg + '">',
          '<span class="wc-rec-icon"><img src="' + r.icon + '" alt="" /></span>',
          '<p class="wc-rec-text">' + r.text + '</p>',
        '</div>'
      ].join('');
    }).join('');

    return [
      '<div class="wc-sheet wc-sheet--result" id="' + id + '" hidden>',
        '<div class="wc-handle" aria-hidden="true"></div>',
        '<div class="wc-sheet-header">',
          '<div class="wc-header-badge"><img src="' + ASSETS + 'icon-heart-add.svg" alt="" /></div>',
          '<span class="wc-header-title">Wellness Check-in</span>',
        '</div>',
        '<div class="wc-sheet-divider"></div>',
        '<div class="wc-result-body">',
          '<div class="wc-result-hero">',
            '<div class="wc-ring-sm">',
              '<img class="wc-ring-img wc-ring-img--outer" src="' + ASSETS + 'ring-sm-outer.svg" alt="" />',
              '<img class="wc-ring-img wc-ring-img--inner" src="' + ASSETS + 'ring-sm-inner.svg" alt="" />',
              '<span class="wc-ring-icon-sm" style="background:' + o.iconBg + '">',
                '<img src="' + o.iconSrc + '" alt="" />',
              '</span>',
            '</div>',
            '<div class="wc-result-copy">',
              '<p class="wc-result-title">' + o.title + '</p>',
              '<p class="wc-result-sub">' + o.subtitle + '</p>',
            '</div>',
          '</div>',
          '<div class="wc-intensity-block" style="border-top-color:' + o.dividerColor + '">',
            '<div class="wc-intensity-row">',
              '<span class="wc-intensity-label">Study intensity today</span>',
              '<span class="wc-intensity-value" style="color:' + o.intensityColor + '">' + o.intensityLabel + '</span>',
            '</div>',
            '<div class="wc-intensity-track">',
              '<div class="wc-intensity-fill" style="background:' + o.barColor + ';width:' + o.barWidth + '"></div>',
            '</div>',
          '</div>',
          '<div class="wc-recs">' + recs + '</div>',
          '<button class="wc-btn wc-btn--blue" id="' + id + 'Go" type="button">',
            'Go to Dashboard',
            '<span class="wc-btn-icon"><img src="' + ASSETS + 'icon-arrow-right.svg" alt="" /></span>',
          '</button>',
        '</div>',
      '</div>'
    ].join('');
  }

  /* ── CSS ────────────────────────────────────────────────────────── */

  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = [
      /* Overlay + scrim (mounted inside .screen phone frame) */
      '.wc-overlay{position:absolute;inset:0;z-index:200;display:flex;flex-direction:column;justify-content:flex-end;pointer-events:none;overflow:hidden;}',
      '.wc-overlay:not([hidden]){pointer-events:auto;}',
      '.wc-scrim{position:absolute;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity 300ms;}',
      '.wc-overlay:not([hidden]) .wc-scrim{opacity:1;}',

      /* Common sheet */
      '.wc-sheet{position:relative;z-index:1;background:#fff;border-radius:24px 24px 0 0;border:1px solid #007bff;width:100%;max-width:100%;max-height:calc(100% - 12px);overflow-x:hidden;overflow-y:auto;',
        '-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;',
        'transform:translateY(100%);transition:transform 360ms cubic-bezier(.22,1,.36,1);}',
      '.wc-overlay:not([hidden]) .wc-sheet:not([hidden]){transform:translateY(0);}',

      /* Handle */
      '.wc-handle{width:65px;height:5px;background:#b9c0c9;border-radius:100px;margin:12px auto 0;flex-shrink:0;}',

      /* INTRO sheet */
      '.wc-sheet--intro{padding-bottom:24px;}',
      '.wc-hero-wrap{display:flex;justify-content:center;padding:24px 0 16px;}',

      /* Large ring */
      '.wc-ring-lg{position:relative;width:133px;height:133px;display:grid;place-items:center;flex-shrink:0;}',
      '.wc-ring-img{position:absolute;display:block;object-fit:contain;}',
      '.wc-ring-img--outer{width:118px;height:118px;top:7px;left:7px;}',
      '.wc-ring-img--inner{width:118px;height:118px;top:7px;left:7px;}',
      '.wc-ring-icon{position:absolute;width:32px;height:32px;display:grid;place-items:center;z-index:1;}',
      '.wc-ring-icon img{width:32px;height:32px;display:block;object-fit:contain;}',

      /* Intro copy */
      '.wc-intro-copy{padding:0 20px 20px;text-align:center;}',
      '.wc-eyebrow{display:block;font:800 10px/14px Inter,sans-serif;color:#f43f5e;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}',
      '.wc-h2{margin:0;font:700 18px/24px Inter,sans-serif;color:#030507;letter-spacing:-.144px;}',

      /* Intro actions */
      '.wc-intro-actions{padding:0 20px;display:flex;flex-direction:column;gap:10px;}',

      /* Buttons */
      '.wc-btn{width:100%;min-height:48px;padding:12px 20px;border:none;border-radius:4px;font:600 14px/20px Inter,sans-serif;',
        'letter-spacing:-.084px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:filter 150ms;}',
      '.wc-btn:hover{filter:brightness(.95);}',
      '.wc-btn--red{background:#f43f5e;color:#fff;}',
      '.wc-btn--muted{background:#f1f5f9;color:#334155;}',
      '.wc-btn--blue{background:#007bff;color:#fff;}',
      '.wc-btn-icon{width:20px;height:20px;display:grid;place-items:center;flex-shrink:0;}',
      '.wc-btn-icon img{width:20px;height:20px;display:block;object-fit:contain;}',

      /* Sheet header (mood + result) */
      '.wc-sheet-header{display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 20px 0;}',
      '.wc-header-badge{width:32px;height:32px;background:#fff1f2;border-radius:5.3px;display:grid;place-items:center;flex-shrink:0;overflow:hidden;}',
      '.wc-header-badge img{width:16px;height:16px;display:block;object-fit:contain;}',
      '.wc-header-title{font:600 14px/20px Inter,sans-serif;color:#030507;letter-spacing:-.084px;}',
      '.wc-sheet-divider{height:1px;background:#e2e8f0;margin:10px 19px 0;}',

      /* MOOD sheet */
      '.wc-sheet--mood{padding-bottom:24px;}',
      '.wc-mood-body{padding:20px 19px 0;}',
      '.wc-mood-h2{margin:0 0 8px;font:700 20px/28px Inter,sans-serif;color:#030507;letter-spacing:-1px;text-align:center;}',
      '.wc-mood-sub{margin:0 0 20px;font:400 12px/1.6 Inter,sans-serif;color:#64748b;text-align:center;}',
      '.wc-mood-choices{display:flex;flex-direction:column;gap:16px;}',

      /* Mood button */
      '.wc-mood-btn{display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:10px;border:1px solid;',
        'background:#fff;cursor:pointer;width:100%;text-align:left;transition:filter 150ms;}',
      '.wc-mood-btn:hover{filter:brightness(.97);}',
      '.wc-mood-btn--green{border-color:#86efac;}',
      '.wc-mood-btn--orange{border-color:#ff9c78;}',
      '.wc-mood-btn--blue{border-color:#8ac2ff;}',
      '.wc-mood-icon{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;}',
      '.wc-mood-icon img{width:20px;height:20px;display:block;object-fit:contain;}',
      '.wc-mood-icon--green{background:#f0fdf4;}',
      '.wc-mood-icon--orange{background:#fff0eb;}',
      '.wc-mood-icon--blue{background:#e6f2ff;}',
      '.wc-mood-label{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}',
      '.wc-mood-name{font:800 12px/16px Inter,sans-serif;text-transform:uppercase;}',
      '.wc-mood-desc{font:400 12px/1.6 Inter,sans-serif;color:#000;}',
      '.wc-mood-badge{padding:10px 20px;border-radius:20px;font:800 10px/16px Inter,sans-serif;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}',
      '.wc-footer-note{margin:16px 0 0;font:500 12px/16px Inter,sans-serif;color:#64748b;text-align:center;letter-spacing:-.06px;}',

      /* RESULT sheet */
      '.wc-sheet--result{padding-bottom:24px;}',
      '.wc-result-body{padding:20px 19px 0;display:flex;flex-direction:column;gap:20px;}',

      /* Result hero row */
      '.wc-result-hero{display:flex;align-items:center;gap:10px;}',
      '.wc-ring-sm{position:relative;width:60px;height:60px;display:grid;place-items:center;flex-shrink:0;}',
      '.wc-ring-sm .wc-ring-img--outer{width:53px;height:53px;top:3px;left:3px;}',
      '.wc-ring-sm .wc-ring-img--inner{width:53px;height:53px;top:3px;left:3px;}',
      '.wc-ring-icon-sm{position:absolute;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;z-index:1;}',
      '.wc-ring-icon-sm img{width:14px;height:14px;display:block;object-fit:contain;}',
      '.wc-result-copy{flex:1;min-width:0;}',
      '.wc-result-title{margin:0 0 4px;font:700 16px/22px Inter,sans-serif;color:#030507;letter-spacing:-.112px;}',
      '.wc-result-sub{margin:0;font:500 10px/14px Inter,sans-serif;color:#64748b;letter-spacing:-.04px;}',

      /* Intensity bar */
      '.wc-intensity-block{padding-top:16px;border-top:1px solid;display:flex;flex-direction:column;gap:10px;}',
      '.wc-intensity-row{display:flex;justify-content:space-between;align-items:center;}',
      '.wc-intensity-label{font:700 10px/16px Inter,sans-serif;color:#64748b;text-transform:uppercase;letter-spacing:.5px;}',
      '.wc-intensity-value{font:800 10px/16px Inter,sans-serif;text-transform:uppercase;letter-spacing:.5px;}',
      '.wc-intensity-track{background:#f1f5f9;height:8px;border-radius:8px;overflow:hidden;}',
      '.wc-intensity-fill{height:8px;border-radius:8px;transition:width 600ms ease;}',

      /* Recommendations */
      '.wc-recs{display:flex;flex-direction:column;gap:10px;}',
      '.wc-rec{display:flex;align-items:center;gap:10px;padding:10px 20px;border-radius:10px;}',
      '.wc-rec-icon{width:16px;height:16px;display:grid;place-items:center;flex-shrink:0;}',
      '.wc-rec-icon img{width:16px;height:16px;display:block;object-fit:contain;}',
      '.wc-rec-text{font:400 12px/1.6 Inter,sans-serif;color:#000;margin:0;flex:1;}',
    ].join('');
    document.head.appendChild(style);
  }

  /* ── Controller ─────────────────────────────────────────────────── */

  function show(id) {
    var sheets = document.querySelectorAll('.wc-sheet');
    sheets.forEach(function(s) { s.hidden = true; });
    var target = document.getElementById(id);
    if (target) target.hidden = false;
  }

  function dismiss() {
    var overlay = document.getElementById('wcOverlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.body.removeAttribute('data-modal-active');
    notifyDismissed();
  }

  function mountOverlay() {
    var mount = findPhoneScreen();
    if (!mount) return null;

    var existing = document.getElementById('wcOverlay');
    if (existing) return existing;

    injectCSS();

    var container = document.createElement('div');
    container.innerHTML = buildOverlayHTML();
    mount.appendChild(container.firstChild);
    return document.getElementById('wcOverlay');
  }

  function init() {
    if (!shouldShow()) return;

    var overlay = mountOverlay();
    if (!overlay) return;

    markWellnessShownThisVisit();

    overlay.hidden = false;
    document.body.dataset.modalActive = 'wellness';

    /* Force reflow then show intro sheet */
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        show('wcIntro');
      });
    });

    /* Intro: Check In → Mood selection */
    document.getElementById('wcCheckInBtn').addEventListener('click', function() {
      show('wcMood');
    });

    /* Intro: Skip */
    document.getElementById('wcSkipBtn').addEventListener('click', function() {
      recordCheckIn('skipped');
      dismiss();
    });

    /* Scrim tap = skip */
    document.getElementById('wcScrim').addEventListener('click', function() {
      recordCheckIn('skipped');
      dismiss();
    });

    /* Mood: FRESH */
    document.getElementById('wcFresh').addEventListener('click', function() {
      recordCheckIn('fresh');
      show('wcResultFresh');
    });

    /* Mood: TIRED */
    document.getElementById('wcTired').addEventListener('click', function() {
      recordCheckIn('tired');
      show('wcResultTired');
    });

    /* Mood: EXHAUSTED */
    document.getElementById('wcExhausted').addEventListener('click', function() {
      recordCheckIn('exhausted');
      show('wcResultExhausted');
    });

    /* Results: Go to Dashboard */
    ['Fresh', 'Tired', 'Exhausted'].forEach(function(m) {
      var btn = document.getElementById('wcResult' + m + 'Go');
      if (btn) btn.addEventListener('click', dismiss);
    });
  }

  /* ── Public API ─────────────────────────────────────────────────── */
  window.WellnessCheckIn = {
    init: init,
    /** Force-show even if cooldown is active (for demo/testing) */
    forceShow: function() {
      localStorage.removeItem(STORAGE_KEY_DATE);
      var existing = document.getElementById('wcOverlay');
      if (existing) existing.remove();
      init();
    },
    wasShownThisVisit: function() {
      try {
        return sessionStorage.getItem(SESSION_WELLNESS_SHOWN) === '1';
      } catch (e) {
        return false;
      }
    },
    /** Reset stored mood */
    reset: function() {
      localStorage.removeItem(STORAGE_KEY_DATE);
      localStorage.removeItem(STORAGE_KEY_MOOD);
    },
    getMood: function() {
      return localStorage.getItem(STORAGE_KEY_MOOD);
    }
  };

  /* Auto-init when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
