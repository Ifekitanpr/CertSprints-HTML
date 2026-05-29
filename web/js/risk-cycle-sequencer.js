(function () {
  'use strict';

  /* ── Data ─────────────────────────────────────── */
  var STEPS = [
    { id: 1, text: 'Identify potential new risks' },
    { id: 2, text: 'Analyze impact and probability of risks' },
    { id: 3, text: 'Develop strategies to handle the risks' },
    { id: 4, text: 'Execute planned risk responses' },
    { id: 5, text: 'Monitor for risk triggers and changes' },
  ];
  var CORRECT_IDS  = [1, 2, 3, 4, 5];
  var SHUFFLED_IDS = [2, 1, 4, 3, 5];

  /* ── State ─────────────────────────────────────── */
  var currentOrder = SHUFFLED_IDS.slice();
  var attempts  = 0;
  var gameState = 'playing'; // playing | correct | revealed

  /* ── DOM ───────────────────────────────────────── */
  var listEl   = document.getElementById('rcs-step-list');
  var bnbEl    = document.getElementById('rcs-bnb');
  var ov1      = document.getElementById('rcs-ov1');
  var ov2      = document.getElementById('rcs-ov2');
  var ovValid  = document.getElementById('rcs-ov-valid');

  /* ── View navigation ───────────────────────────── */
  document.getElementById('rcs-start-btn').addEventListener('click', function () {
    document.querySelectorAll('.rcs-view').forEach(function (v) { v.classList.remove('active'); });
    document.getElementById('rcs-game-view').classList.add('active');
    render();
  });

  document.getElementById('rcs-intro-back').addEventListener('click', function () {
    window.history.length > 1 ? window.history.back() : (window.location.href = 'scenario-sorting.html');
  });

  document.getElementById('rcs-game-close').addEventListener('click', function () {
    window.location.href = 'lesson-player.html';
  });

  /* ── Render ─────────────────────────────────────── */
  function stepById(id) {
    return STEPS.find(function (s) { return s.id === id; });
  }

  function render() {
    listEl.innerHTML = '';
    currentOrder.forEach(function (id, idx) {
      var step = stepById(id);
      var el = document.createElement('div');
      el.className = 'rcs-step' + (gameState !== 'playing' ? ' is-correct' : '');
      el.setAttribute('role', 'listitem');
      el.dataset.id  = id;
      el.dataset.idx = idx;
      el.innerHTML =
        '<div class="rcs-step-body">' +
          '<p class="rcs-step-num">STEP ' + (idx + 1) + '</p>' +
          '<p class="rcs-step-text">' + step.text + '</p>' +
        '</div>' +
        (gameState === 'playing'
          ? '<div class="rcs-grip" data-grip aria-label="Drag to reorder">' +
              '<span class="rcs-icon-slot rcs-icon-slot--20">' +
              '<img class="rcs-glyph rcs-glyph--grip-20" src="assets/risk-cycle-sequencer/icon-grip.svg" alt=""/>' +
              '</span></div>'
          : '');
      listEl.appendChild(el);
    });

    syncBnb();
  }

  /* ── Bottom bar ─────────────────────────────────── */
  function syncBnb() {
    if (gameState !== 'playing') {
      bnbEl.innerHTML =
        '<button class="btn-primary" type="button" id="rcs-complete-main">' +
          'Mark as completed' +
          '<span class="rcs-icon-slot rcs-icon-slot--20">' +
          '<img class="rcs-glyph rcs-glyph--tick-20-white" src="assets/risk-cycle-sequencer/icon-tick.svg" alt=""/>' +
          '</span></button>';
      document.getElementById('rcs-complete-main').addEventListener('click', complete);
    } else {
      bnbEl.innerHTML =
        '<button class="btn-secondary" type="button" id="rcs-reset-btn">' +
          '<span class="rcs-icon-slot rcs-icon-slot--20">' +
          '<img class="rcs-glyph rcs-glyph--reload-20" src="assets/risk-cycle-sequencer/icon-reload.svg" alt=""/>' +
          '</span>Reset' +
        '</button>' +
        '<button class="btn-primary" type="button" id="rcs-check-btn">' +
          'Check My Order' +
          '<span class="rcs-icon-slot rcs-icon-slot--20">' +
          '<img class="rcs-glyph rcs-glyph--tick-20-white" src="assets/risk-cycle-sequencer/icon-tick.svg" alt=""/>' +
          '</span></button>';
      document.getElementById('rcs-reset-btn').addEventListener('click', reset);
      document.getElementById('rcs-check-btn').addEventListener('click', check);
    }
  }

  /* ── Game logic ─────────────────────────────────── */
  function check() {
    if (JSON.stringify(currentOrder) === JSON.stringify(CORRECT_IDS)) {
      gameState = 'correct';
      render();
      openOverlay(ovValid);
    } else {
      attempts++;
      openOverlay(attempts >= 2 ? ov2 : ov1);
    }
  }

  function reset() {
    currentOrder = SHUFFLED_IDS.slice();
    gameState = 'playing';
    attempts = 0;
    render();
  }

  function complete() {
    window.location.href = 'boolean-flashcard.html';
  }

  /* ── Overlays ───────────────────────────────────── */
  function openOverlay(el)  { el.setAttribute('aria-hidden', 'false'); }
  function closeOverlay(el) { el.setAttribute('aria-hidden', 'true');  }

  document.getElementById('rcs-try-again-btn').addEventListener('click', function () { closeOverlay(ov1); });
  document.getElementById('rcs-reveal-btn').addEventListener('click', function () {
    closeOverlay(ov2);
    currentOrder = CORRECT_IDS.slice();
    gameState = 'revealed';
    render();
  });
  document.getElementById('rcs-complete-btn').addEventListener('click', complete);

  [ov1, ov2].forEach(function (ov) {
    var scrim = ov.querySelector('.rcs-scrim');
    if (scrim) scrim.addEventListener('click', function () { closeOverlay(ov); });
  });

  /* ══════════════════════════════════════════════════
     DRAG AND DROP — clean placeholder + ghost pattern
     1. Original item is HIDDEN during drag
     2. A placeholder (dashed border) shows the drop target
     3. A ghost clone follows the pointer
     4. On drop: item moves to placeholder position, DOM reread for order
  ══════════════════════════════════════════════════ */

  var drag = null; // { item, placeholder, ghost, offsetX, offsetY }

  /* Single delegated listener on the list — no duplicates possible */
  listEl.addEventListener('pointerdown', function (e) {
    if (gameState !== 'playing') return;
    var grip = e.target.closest('[data-grip]');
    if (!grip) return;
    e.preventDefault();

    var item = grip.closest('.rcs-step');
    var rect = item.getBoundingClientRect();

    /* Placeholder: same height, dashed blue border */
    var ph = document.createElement('div');
    ph.className = 'rcs-placeholder';
    ph.style.height = rect.height + 'px';
    listEl.insertBefore(ph, item);

    /* Ghost: clone floats at pointer position */
    var ghost = document.createElement('div');
    ghost.className = 'rcs-drag-ghost';
    ghost.style.width = rect.width + 'px';
    ghost.innerHTML = item.innerHTML;
    document.body.appendChild(ghost);

    /* Hide original — placeholder holds its space */
    item.style.visibility = 'hidden';

    drag = {
      item:        item,
      placeholder: ph,
      ghost:       ghost,
      offsetX:     e.clientX - rect.left,
      offsetY:     e.clientY - rect.top,
    };

    positionGhost(e.clientX, e.clientY);
    listEl.setPointerCapture(e.pointerId);
  });

  listEl.addEventListener('pointermove', function (e) {
    if (!drag) return;
    e.preventDefault();
    positionGhost(e.clientX, e.clientY);

    /* Find which sibling (not placeholder, not hidden item) the pointer is over */
    var listRect = listEl.getBoundingClientRect();
    var relY = e.clientY - listRect.top;

    var visibles = Array.from(listEl.children).filter(function (el) {
      return el !== drag.placeholder && el !== drag.item;
    });

    var insertBefore = null;
    for (var i = 0; i < visibles.length; i++) {
      var r   = visibles[i].getBoundingClientRect();
      var mid = r.top - listRect.top + r.height / 2;
      if (relY < mid) { insertBefore = visibles[i]; break; }
    }

    if (insertBefore) {
      listEl.insertBefore(drag.placeholder, insertBefore);
    } else {
      listEl.appendChild(drag.placeholder);
    }
  });

  listEl.addEventListener('pointerup', finishDrag);
  listEl.addEventListener('pointercancel', finishDrag);

  function finishDrag() {
    if (!drag) return;

    /* Put real item where placeholder is */
    drag.item.style.visibility = '';
    listEl.insertBefore(drag.item, drag.placeholder);
    drag.placeholder.remove();
    drag.ghost.remove();

    /* Sync order array from DOM */
    currentOrder = Array.from(listEl.querySelectorAll('.rcs-step')).map(function (el) {
      return parseInt(el.dataset.id, 10);
    });

    /* Renumber labels */
    listEl.querySelectorAll('.rcs-step').forEach(function (el, i) {
      el.dataset.idx = i;
      var num = el.querySelector('.rcs-step-num');
      if (num) num.textContent = 'STEP ' + (i + 1);
    });

    drag = null;
  }

  function positionGhost(cx, cy) {
    drag.ghost.style.left = (cx - drag.offsetX) + 'px';
    drag.ghost.style.top  = (cy - drag.offsetY) + 'px';
  }

})();
