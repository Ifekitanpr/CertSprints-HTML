(function () {
  "use strict";

  const CONFIG = window.MINDSET_SPRINT;
  const app = document.getElementById("ms-app");
  const screen = document.getElementById("ms-screen");
  const bgDim = document.getElementById("ms-bg-dim");
  const confettiCanvas = document.getElementById("ms-confetti");
  if (!app || !CONFIG) return;

  const A = "assets/mindset-sprint";
  const I = `${A}/icons`;

  const state = {
    view: "intro",
    promptIndex: 0,
    sessionPrompts: [],
    correct: 0,
    streak: 0,
    bestStreak: 0,
    timeLeft: CONFIG.timePerPrompt,
    feedback: null,
    locked: false,
    muted: false,
    tickId: null,
    drag: { active: false, dropping: false, startX: 0, startY: 0, x: 0, y: 0, originLeft: 0, originTop: 0, width: 0, height: 0 },
  };

  const Sound = {
    ctx: null,
    init() {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === "suspended") this.ctx.resume();
    },
    tone(freq, duration, type, gain, slideTo) {
      if (state.muted) return;
      this.init();
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
      g.gain.setValueAtTime(gain || 0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    },
    swoosh() { this.tone(400, 0.15, "sine", 0.06, 120); },
    correct() {
      this.tone(523, 0.12, "sine", 0.1);
      setTimeout(() => this.tone(659, 0.12, "sine", 0.1), 80);
      setTimeout(() => this.tone(784, 0.18, "sine", 0.1), 160);
    },
    wrong() { this.tone(220, 0.25, "sawtooth", 0.08, 140); },
    timeLow() { this.tone(440, 0.08, "triangle", 0.06); },
    start() {
      this.tone(392, 0.1, "sine", 0.08);
      setTimeout(() => this.tone(523, 0.15, "sine", 0.08), 100);
    },
    victory() {
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.2, "sine", 0.1), i * 90));
    },
    fail() { this.tone(196, 0.35, "sine", 0.08, 130); },
  };

  const Confetti = {
    raf: null,
    pieces: [],
    start() {
      if (!confettiCanvas) return;
      const rect = confettiCanvas.getBoundingClientRect();
      confettiCanvas.width = rect.width * devicePixelRatio;
      confettiCanvas.height = rect.height * devicePixelRatio;
      const ctx = confettiCanvas.getContext("2d");
      const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFC83D", "#007BFF"];
      this.pieces = Array.from({ length: 120 }, () => ({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.4,
        w: 6 + Math.random() * 8,
        h: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let alive = 0;
        this.pieces.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          p.rot += p.vr;
          if (p.y < confettiCanvas.height + 20) alive++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });
        if (alive > 0) this.raf = requestAnimationFrame(draw);
        else this.stop();
      };
      this.raf = requestAnimationFrame(draw);
    },
    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
      this.pieces = [];
      if (confettiCanvas) confettiCanvas.getContext("2d").clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    },
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function accuracy() {
    return state.sessionPrompts.length ? Math.round((state.correct / state.sessionPrompts.length) * 100) : 0;
  }

  function readinessBoost() {
    const acc = accuracy();
    if (acc >= 85) return "+0.7%";
    if (acc >= 70) return "+0.5%";
    if (acc >= 55) return "+0.3%";
    return "+0.1%";
  }

  function isSuccess() {
    return accuracy() >= CONFIG.successAccuracy;
  }

  function clearTimers() {
    if (state.tickId) clearInterval(state.tickId);
    state.tickId = null;
  }

  function setScreenMood(wrong) {
    screen?.classList.toggle("ms-screen--wrong", !!wrong);
    bgDim?.classList.toggle("is-visible", !!wrong);
  }

  function navTitle() {
    if (state.view === "play") return `PROMPT ${state.promptIndex + 1} OF ${state.sessionPrompts.length}`;
    if (state.view === "result") return "GAME RESULT";
    return "PRACTICE GAMES";
  }

  function volumeIconSrc() {
    return state.muted ? `${I}/volume-off.svg` : `${I}/volume-high.svg`;
  }

  function navHtml() {
    const volLabel = state.muted ? "Unmute" : "Mute";
    return `
      <header class="ms-nav">
        <button class="ms-nav-btn ms-back" type="button" aria-label="Back">
          <img src="assets/icons/arrow-left-02.svg" alt="" width="24" height="24" />
        </button>
        <p class="ms-nav-title">${navTitle()}</p>
        <button class="ms-nav-btn ms-volume ${state.muted ? "is-muted" : ""}" type="button" aria-label="${volLabel}">
          <img src="${volumeIconSrc()}" alt="" width="20" height="16" />
        </button>
      </header>`;
  }

  function bottomBtn(label, action, variant) {
    return `
      <div class="ms-bottom-bar">
        <button class="ms-btn ms-btn--${variant}" type="button" data-action="${action}">
          <img src="${I}/play-circle-blue.svg" alt="" width="20" height="20" />
          ${label}
        </button>
      </div>`;
  }

  function renderIntro() {
    setScreenMood(false);
    app.innerHTML = `
      <div class="ms-view ms-view--intro ms-enter">
        ${navHtml()}
        <div class="ms-scroll">
          <div class="ms-intro-head">
            <h1 class="ms-intro-title">Mindset <span>Sprint</span></h1>
            <p class="ms-intro-kicker">Think fast, classify faster</p>
          </div>
          <img class="ms-intro-hero" src="${A}/intro-hero.png" alt="" />
          <p class="ms-intro-desc">Sort each prompt into Assessment or Action before time runs out.</p>
          <div class="ms-tip-box">
            <div class="ms-tip-head">
              <img class="ms-icon-20" src="${I}/bulb.svg" alt="" width="20" height="20" />
              <span>Expert Tip</span>
            </div>
            <p class="ms-tip-body">You have <strong class="ms-yellow">3 seconds</strong> per item.</p>
            <p class="ms-tip-body">Remember the rule: <strong class="ms-blue">Assess</strong> before <strong class="ms-blue">Action.</strong></p>
          </div>
        </div>
        ${bottomBtn("Play Blitz", "how", "light")}
      </div>`;
  }

  function howStep(icon, title, desc) {
    return `
      <li class="ms-step">
        <span class="ms-step-icon"><img src="${icon}" alt="" width="16" height="16" /></span>
        <div class="ms-step-copy">
          <p class="ms-step-title">${title}</p>
          <p class="ms-step-desc">${desc}</p>
        </div>
      </li>`;
  }

  function renderHow() {
    setScreenMood(false);
    app.innerHTML = `
      <div class="ms-view ms-view--how ms-enter">
        ${navHtml()}
        <div class="ms-scroll">
          <p class="ms-how-kicker">MINDSET <span>SPRINT</span></p>
          <h2 class="ms-how-title">How it works</h2>
          <p class="ms-how-sub">Learn the rules before you start.</p>
          <div class="ms-panel">
            <div class="ms-panel-head">
              <img class="ms-icon-20" src="${I}/bulb.svg" alt="" width="20" height="20" />
              <span>HOW TO PLAY</span>
            </div>
            <ul class="ms-steps">
              ${howStep(`${I}/book-open.svg`, "Read the prompt", "Each card gives you a short project statement.")}
              ${howStep(`${I}/touch.svg`, "Choose the type", "Decide if it is Assessment or Action")}
              ${howStep(`${I}/timer.svg`, "Drag or swipe before time runs out", "You have 10 seconds for each prompt")}
            </ul>
          </div>
          <div class="ms-panel">
            <div class="ms-panel-head">
              <img class="ms-icon-20" src="${I}/justice-scale.svg" alt="" width="20" height="20" />
              <span>KNOW THE DIFFERENCE</span>
            </div>
            <ul class="ms-steps">
              ${howStep(`${I}/search-white.svg`, "Assessment", "Identify, analyze, review, or verify.")}
              ${howStep(`${I}/flash-white.svg`, "Action", "Implement, inform, update, or execute.")}
            </ul>
          </div>
        </div>
        ${bottomBtn("Start Challenge", "play", "light")}
      </div>`;
  }

  function progressBar() {
    const total = state.sessionPrompts.length;
    let html = '<div class="ms-progress-track">';
    for (let i = 0; i < total; i++) {
      if (i === state.promptIndex) {
        html += '<span class="ms-progress-seg ms-progress-seg--active"></span>';
      } else if (i < state.promptIndex) {
        html += '<span class="ms-progress-seg ms-progress-seg--done"></span>';
      } else {
        html += '<span class="ms-progress-seg ms-progress-seg--todo"></span>';
      }
    }
    return html + "</div>";
  }

  function bucketOverlay(side) {
    if (!state.feedback || state.feedback.bucket !== side) return "";
    const ok = state.feedback.type === "correct";
    const icon = ok ? `${I}/check-circle.svg` : `${I}/cancel-circle.svg`;
    const cls = ok ? "ms-bucket-overlay--correct" : "ms-bucket-overlay--wrong";
    return `<div class="ms-bucket-overlay ${cls}"><img src="${icon}" alt="" width="40" height="40" /></div>`;
  }

  function renderPlay() {
    const prompt = currentPrompt();
    const wrong = state.feedback && state.feedback.type === "wrong";
    const correctFb = state.feedback && state.feedback.type === "correct";
    setScreenMood(wrong);

    const secs = Math.ceil(state.timeLeft);
    const timeLow = secs <= CONFIG.timeLowThreshold;
    const cardHidden = state.feedback && !state.drag.active;

    app.innerHTML = `
      <div class="ms-view ms-view--play">
        ${navHtml()}
        <div class="ms-play-body ${wrong ? "ms-play-body--wrong" : ""}">
          <div class="ms-play-meta">
            ${progressBar()}
            <div class="ms-timer-pill ${timeLow ? "ms-timer-pill--low" : ""}">
              <img src="${I}/timer-yellow.svg" alt="" width="32" height="32" />
              <div class="ms-timer-copy">
                <span class="ms-timer-secs">${secs}s</span>
                <span class="ms-timer-label">TIME LEFT</span>
              </div>
            </div>
          </div>

          <div class="ms-card-area ${wrong ? "ms-card-area--wrong" : ""} ${correctFb ? "ms-card-area--correct" : ""} ${cardHidden ? "is-empty" : ""}" id="ms-card-area">
            <div class="ms-card-stack-frame" aria-hidden="true">
              <div class="ms-card-layer ms-card-layer--3"></div>
              <div class="ms-card-layer ms-card-layer--2"></div>
              <div class="ms-card-layer ms-card-layer--1"></div>
              <img class="ms-card-sparkle ms-card-sparkle--tr" src="${A}/card-sparkle-tr.svg" alt="" />
              <img class="ms-card-sparkle ms-card-sparkle--tl" src="${A}/card-sparkle-tl.svg" alt="" />
              <img class="ms-card-sparkle ms-card-sparkle--d1" src="${A}/card-sparkle-diamond.svg" alt="" />
              <img class="ms-card-sparkle ms-card-sparkle--d2" src="${A}/card-sparkle-diamond.svg" alt="" />
              <img class="ms-card-sparkle ms-card-sparkle--d3" src="${A}/card-sparkle-diamond.svg" alt="" />
              <img class="ms-card-sparkle ms-card-sparkle--d4" src="${A}/card-sparkle-diamond.svg" alt="" />
            </div>
            ${cardHidden ? "" : `
            <div class="ms-card-face" id="ms-prompt-card">
              <span class="ms-card-badge">${prompt.badge || "PROJECT SITUATION"}</span>
              <div class="ms-card-content">
                <p class="ms-card-text">${prompt.text}</p>
                <p class="ms-card-q">What type is this?</p>
              </div>
            </div>`}
            ${wrong ? `<img class="ms-card-feedback-img" src="${A}/card-stack-wrong.png" alt="" />` : ""}
            ${correctFb ? `<img class="ms-card-feedback-img" src="${A}/card-stack-correct.png" alt="" />` : ""}
          </div>

          ${state.feedback?.type === "correct" ? `
            <div class="ms-correct-banner ms-pop">
              <img src="${I}/check-circle.svg" alt="" width="16" height="16" />
              <span>Correct</span>
            </div>` : wrong ? `
            <div class="ms-incorrect-banner ms-pop">
              <img src="${I}/alert.svg" alt="" width="16" height="16" />
              <span>${state.feedback.timeout ? "Time's up" : "Incorrect"}</span>
            </div>` : `
            <p class="ms-drag-hint">
              <img src="${I}/touchpad.svg" alt="" width="16" height="16" />
              Drag or swipe the card to the correct bucket
            </p>`}

          <div class="ms-buckets">
            <button class="ms-bucket-btn" type="button" data-bucket="assessment" aria-label="Assessment">
              <img src="${A}/bucket-assessment.png" alt="" class="ms-bucket-img" />
              ${bucketOverlay("assessment")}
            </button>
            <button class="ms-bucket-btn ms-bucket-btn--action" type="button" data-bucket="action" aria-label="Action">
              <img src="${A}/bucket-action.png" alt="" class="ms-bucket-img" />
              ${bucketOverlay("action")}
            </button>
          </div>
        </div>
      </div>`;

    bindPlayEvents();
    clearDragLayer();
  }

  function statCell(label, icon, value, valueClass) {
    return `
      <div class="ms-stat-cell">
        <span class="ms-stat-label">${label}</span>
        <img src="${icon}" alt="" width="24" height="24" />
        <span class="ms-stat-num ${valueClass || ""}">${value}</span>
      </div>`;
  }

  function renderResult() {
    const success = isSuccess();
    setScreenMood(false);
    Confetti.stop();
    if (success) {
      Sound.victory();
      setTimeout(() => Confetti.start(), 200);
    } else {
      Sound.fail();
    }

    app.innerHTML = `
      <div class="ms-view ms-view--result ms-enter">
        ${navHtml()}
        <div class="ms-scroll ms-result-scroll">
          <div class="ms-result-head">
            ${success
              ? `<h2 class="ms-result-title">Mission<br><span>Complete!</span></h2>
                 <p class="ms-result-kicker">You hit the target and cleared the sprint.</p>`
              : `<h2 class="ms-result-title">Recalibration<br><span class="ms-result-title--fail">Required</span></h2>
                 <p class="ms-result-kicker">You completed the sprint,<br>but missed the target accuracy.</p>`}
          </div>
          <div class="ms-result-hero">
            <img src="${A}/${success ? "trophy-success" : "trophy-fail"}.png" alt="" class="ms-result-trophy" />
          </div>
          <div class="ms-stats-row">
            ${statCell(
              "Precision Accuracy",
              success ? `${I}/target-green.svg` : `${I}/target-red.svg`,
              accuracy() + "%",
              success ? "ms-stat-num--green" : "ms-stat-num--red"
            )}
            ${statCell("Best Streak", `${I}/fire.svg`, state.bestStreak, "ms-stat-num--yellow")}
            ${statCell("Readiness Boost", `${I}/startup.svg`, readinessBoost(), "")}
          </div>
        </div>
        <div class="ms-bottom-bar ms-bottom-bar--stack">
          <button class="ms-btn ms-btn--light" type="button" data-action="replay">
            <img src="${I}/play-circle-blue.svg" alt="" width="20" height="20" />
            ${success ? "Play Again" : "Try Again"}
          </button>
          <button class="ms-btn ms-btn--dark" type="button" data-action="games">
            <img src="${I}/game-controller.svg" alt="" width="20" height="20" />
            Back to Games
          </button>
        </div>
      </div>`;
  }

  function currentPrompt() {
    return state.sessionPrompts[state.promptIndex];
  }

  function render() {
    if (state.view !== "result") Confetti.stop();
    if (state.view === "intro") renderIntro();
    else if (state.view === "how") renderHow();
    else if (state.view === "play") renderPlay();
    else if (state.view === "result") renderResult();
    bindGlobalEvents();
  }

  function bindGlobalEvents() {
    app.querySelector(".ms-back")?.addEventListener("click", onBack);
    app.querySelector(".ms-volume")?.addEventListener("click", toggleMute);
    app.querySelector('[data-action="how"]')?.addEventListener("click", () => {
      state.view = "how";
      render();
    });
    app.querySelector('[data-action="play"]')?.addEventListener("click", startGame);
    app.querySelector('[data-action="replay"]')?.addEventListener("click", startGame);
    app.querySelector('[data-action="games"]')?.addEventListener("click", () => {
      window.location.href = new URL("games/games.html", document.baseURI).href;
    });
  }

  function toggleMute() {
    state.muted = !state.muted;
    Sound.init();
    render();
  }

  function onBack() {
    clearTimers();
    Confetti.stop();
    setScreenMood(false);
    if (state.view === "play") {
      state.view = "how";
      render();
      return;
    }
    if (state.view === "result") {
      window.location.href = new URL("games/games.html", document.baseURI).href;
      return;
    }
    if (state.view === "how") {
      state.view = "intro";
      render();
      return;
    }
    window.location.href = new URL("games/games.html", document.baseURI).href;
  }

  function startGame() {
    clearTimers();
    Sound.start();
    state.view = "play";
    state.promptIndex = 0;
    state.correct = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.feedback = null;
    state.locked = false;
    state.sessionPrompts = shuffle(CONFIG.prompts).slice(0, CONFIG.totalPrompts);
    state.timeLeft = CONFIG.timePerPrompt;
    render();
    startTimer();
  }

  function startTimer() {
    clearTimers();
    let lastTick = CONFIG.timePerPrompt;
    state.tickId = setInterval(() => {
      if (state.locked) return;
      state.timeLeft = Math.max(0, state.timeLeft - 0.1);
      const secsEl = app.querySelector(".ms-timer-secs");
      const pill = app.querySelector(".ms-timer-pill");
      const sec = Math.ceil(state.timeLeft);
      if (secsEl) secsEl.textContent = sec + "s";
      if (pill) pill.classList.toggle("ms-timer-pill--low", sec <= CONFIG.timeLowThreshold);
      if (sec !== lastTick && sec <= CONFIG.timeLowThreshold && sec > 0) {
        Sound.timeLow();
        lastTick = sec;
      }
      if (state.timeLeft <= 0 && !state.locked) handleAnswer(null);
    }, 100);
  }

  function bindPlayEvents() {
    const card = document.getElementById("ms-prompt-card");
    if (!card || state.locked || state.drag.dropping) return;
    card.addEventListener("pointerdown", onDragStart);
    if (!bindPlayEvents.bound) {
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragEnd);
      window.addEventListener("pointercancel", onDragEnd);
      bindPlayEvents.bound = true;
    }
    app.querySelectorAll("[data-bucket]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (state.locked) return;
        handleAnswer(btn.dataset.bucket);
      });
    });
  }
  bindPlayEvents.bound = false;

  function bucketAtPoint(x, y) {
    const buckets = app.querySelectorAll("[data-bucket]");
    for (const btn of buckets) {
      const r = btn.getBoundingClientRect();
      const pad = 16;
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) {
        return btn.dataset.bucket;
      }
    }
    return null;
  }

  function highlightDropTarget(x, y, card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.bottom - 20;
    const target = bucketAtPoint(cx, cy) || bucketAtPoint(x, y);
    app.querySelectorAll("[data-bucket]").forEach((btn) => {
      btn.classList.toggle("is-target", btn.dataset.bucket === target);
    });
    return target;
  }

  function clearDragLayer() {
    const layer = document.getElementById("ms-drag-layer");
    if (layer) layer.innerHTML = "";
    state.drag.active = false;
    state.drag.dropping = false;
  }

  function resetCardToSlot() {
    const card = document.getElementById("ms-prompt-card");
    const cardArea = document.getElementById("ms-card-area");
    if (!card || !cardArea) return;
    card.classList.remove("is-lifted", "is-snapping", "is-dropped");
    card.style.left = "";
    card.style.top = "";
    card.style.width = "";
    card.style.height = "";
    card.style.transform = "";
    card.style.opacity = "";
    card.style.visibility = "";
    cardArea.classList.remove("is-empty");
    if (!cardArea.contains(card)) cardArea.appendChild(card);
    clearDragLayer();
  }

  function animateSpringBack(done) {
    const card = document.getElementById("ms-prompt-card");
    if (!card) {
      done();
      return;
    }
    card.classList.remove("is-lifted");
    card.classList.add("is-snapping");
    card.style.transform = "translate(0, 0) rotate(0deg) scale(1)";
    setTimeout(() => {
      resetCardToSlot();
      done();
    }, 360);
  }

  function animateDropIntoBucket(choice, done) {
    const card = document.getElementById("ms-prompt-card");
    const bucket = app.querySelector(`[data-bucket="${choice}"]`);
    const screenEl = document.getElementById("ms-screen");
    if (!card || !bucket || !screenEl) {
      clearDragLayer();
      done();
      return;
    }
    const bucketRect = bucket.getBoundingClientRect();
    const screenRect = screenEl.getBoundingClientRect();
    const targetX =
      bucketRect.left + bucketRect.width / 2 - screenRect.left - state.drag.width / 2 - state.drag.originLeft;
    const targetY = bucketRect.top + 36 - screenRect.top - state.drag.originTop;

    card.classList.remove("is-lifted");
    card.classList.add("is-snapping", "is-dropped");
    card.style.transform = `translate(${targetX}px, ${targetY}px) rotate(0deg) scale(0.45)`;
    card.style.opacity = "0";
    setTimeout(() => {
      if (card.parentNode) card.remove();
      clearDragLayer();
      done();
    }, 280);
  }

  function onDragStart(e) {
    if (state.locked || state.drag.dropping || state.feedback) return;
    const card = document.getElementById("ms-prompt-card");
    const cardArea = document.getElementById("ms-card-area");
    const layer = document.getElementById("ms-drag-layer");
    const screenEl = document.getElementById("ms-screen");
    if (!card || !layer || !screenEl) return;

    e.preventDefault();
    const rect = card.getBoundingClientRect();
    const screenRect = screenEl.getBoundingClientRect();

    state.drag.active = true;
    state.drag.startX = e.clientX;
    state.drag.startY = e.clientY;
    state.drag.x = 0;
    state.drag.y = 0;
    state.drag.originLeft = rect.left - screenRect.left;
    state.drag.originTop = rect.top - screenRect.top;
    state.drag.width = rect.width;
    state.drag.height = rect.height;

    cardArea?.classList.add("is-empty");
    layer.appendChild(card);
    card.style.left = state.drag.originLeft + "px";
    card.style.top = state.drag.originTop + "px";
    card.style.width = state.drag.width + "px";
    card.style.height = state.drag.height + "px";
    card.style.transform = "translate(0, 0) rotate(0deg) scale(1.05)";
    card.classList.add("is-lifted");
    card.setPointerCapture(e.pointerId);
    Sound.swoosh();
  }

  function onDragMove(e) {
    if (!state.drag.active) return;
    state.drag.x = e.clientX - state.drag.startX;
    state.drag.y = e.clientY - state.drag.startY;
    const card = document.getElementById("ms-prompt-card");
    if (!card) return;
    const rot = state.drag.x * 0.022;
    card.style.transform = `translate(${state.drag.x}px, ${state.drag.y}px) rotate(${rot}deg) scale(1.05)`;
    highlightDropTarget(e.clientX, e.clientY, card);
  }

  function onDragEnd(e) {
    if (!state.drag.active) return;
    const card = document.getElementById("ms-prompt-card");
    const rect = card?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : e.clientX;
    const cy = rect ? rect.bottom - 24 : e.clientY;
    const choice = bucketAtPoint(cx, cy) || bucketAtPoint(e.clientX, e.clientY);

    state.drag.active = false;
    app.querySelectorAll("[data-bucket]").forEach((b) => b.classList.remove("is-target"));

    if (card) {
      try {
        card.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    }

    if (choice) {
      state.drag.dropping = true;
      animateDropIntoBucket(choice, () => {
        state.drag.dropping = false;
        handleAnswer(choice);
      });
    } else {
      animateSpringBack(() => {});
    }
  }

  function handleAnswer(choice) {
    if (state.locked) return;
    state.locked = true;
    clearTimers();
    const prompt = currentPrompt();
    const correct = choice === prompt.type;
    if (correct) {
      state.correct += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      Sound.correct();
    } else {
      state.streak = 0;
      Sound.wrong();
    }
    state.feedback = {
      type: correct ? "correct" : "wrong",
      bucket: choice || prompt.type,
      timeout: !choice,
    };
    clearDragLayer();
    render();
    setTimeout(() => {
      state.feedback = null;
      state.promptIndex += 1;
      if (state.promptIndex >= state.sessionPrompts.length) {
        state.view = "result";
        state.locked = false;
        render();
        return;
      }
      state.locked = false;
      state.timeLeft = CONFIG.timePerPrompt;
      render();
      startTimer();
    }, correct ? 850 : 1100);
  }

  render();
})();
