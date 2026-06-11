(function () {
  "use strict";

  const CONFIG = window.NARRATIVE_QUEST;
  const app = document.getElementById("nq-app");
  const confettiCanvas = document.getElementById("nq-confetti");
  if (!app || !CONFIG) return;

  const A = "assets/narrative-quest";
  const I = `${A}/icons`;
  const HOUSE_KEYS = ["conditions", "intervention", "results", "authority"];

  const state = {
    view: "intro",
    sessionPrompts: [],
    promptIndex: 0,
    completedSlots: new Set(),
    anchors: 0,
    faults: 0,
    signalIntegrity: CONFIG.integrityStart,
    timeLeft: CONFIG.timePerPrompt,
    feedback: null,
    pickLocked: false,
    wrongPicksThisPrompt: new Set(),
    muted: false,
    tickId: null,
    advanceId: null,
  };

  const Sound = {
    ctx: null,
    master: null,
    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.85;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx.currentTime;
    },
    play(fn) {
      if (state.muted) return;
      const t0 = this.init();
      fn(this.ctx, this.master, t0);
    },
    osc(ctx, dest, t, freq, type, dur, gain, env) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      if (env?.slideTo) o.frequency.exponentialRampToValueAtTime(env.slideTo, t + dur);
      const peak = gain ?? 0.12;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + (env?.attack ?? 0.012));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(dest);
      o.start(t);
      o.stop(t + dur + 0.05);
    },
    noise(ctx, dest, t, dur, gain, filterHz) {
      const len = Math.ceil(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = filterHz || 900;
      filt.Q.value = 0.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filt);
      filt.connect(g);
      g.connect(dest);
      src.start(t);
      src.stop(t + dur);
    },
    tap() {
      this.play((ctx, dest, t) => {
        this.osc(ctx, dest, t, 620, "triangle", 0.05, 0.06);
      });
    },
    select() {
      this.play((ctx, dest, t) => {
        this.osc(ctx, dest, t, 440, "sine", 0.07, 0.09, { slideTo: 880, attack: 0.008 });
        this.osc(ctx, dest, t + 0.02, 660, "triangle", 0.05, 0.04);
      });
    },
    correct() {
      this.play((ctx, dest, t) => {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          this.osc(ctx, dest, t + i * 0.07, f, "sine", 0.22, 0.11 - i * 0.015);
          this.osc(ctx, dest, t + i * 0.07, f * 0.5, "triangle", 0.18, 0.05);
        });
        this.noise(ctx, dest, t + 0.05, 0.35, 0.06, 2400);
      });
    },
    wrong() {
      this.play((ctx, dest, t) => {
        this.osc(ctx, dest, t, 110, "sawtooth", 0.35, 0.09, { slideTo: 55 });
        this.osc(ctx, dest, t + 0.04, 146.83, "square", 0.2, 0.05, { slideTo: 73 });
        this.noise(ctx, dest, t, 0.28, 0.12, 400);
      });
    },
    timeLow() {
      this.play((ctx, dest, t) => {
        this.osc(ctx, dest, t, 740, "square", 0.06, 0.05);
        this.osc(ctx, dest, t + 0.11, 880, "square", 0.06, 0.05);
      });
    },
    tick(secsLeft) {
      this.play((ctx, dest, t) => {
        const f = 520 + (CONFIG.timePerPrompt - secsLeft) * 40;
        this.osc(ctx, dest, t, f, "triangle", 0.04, 0.035);
      });
    },
    launch() {
      this.play((ctx, dest, t) => {
        this.osc(ctx, dest, t, 196, "sine", 0.45, 0.08, { slideTo: 523, attack: 0.02 });
        this.noise(ctx, dest, t, 0.3, 0.05, 1800);
        this.osc(ctx, dest, t + 0.12, 392, "triangle", 0.2, 0.07);
        this.osc(ctx, dest, t + 0.22, 523.25, "sine", 0.28, 0.09);
      });
    },
    victory() {
      this.play((ctx, dest, t) => {
        const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        melody.forEach((f, i) => {
          this.osc(ctx, dest, t + i * 0.1, f, "sine", 0.32, 0.12);
          this.osc(ctx, dest, t + i * 0.1, f * 1.5, "triangle", 0.2, 0.05);
        });
        this.noise(ctx, dest, t + 0.2, 0.6, 0.04, 3000);
      });
    },
    fail() {
      this.play((ctx, dest, t) => {
        [392, 349.23, 293.66, 246.94].forEach((f, i) => {
          this.osc(ctx, dest, t + i * 0.14, f, "sine", 0.35, 0.1 - i * 0.015, { slideTo: f * 0.85 });
        });
        this.noise(ctx, dest, t, 0.4, 0.06, 300);
      });
    },
  };

  const Confetti = {
    raf: null,
    pieces: [],
    burst(count) {
      if (!confettiCanvas) return;
      const rect = confettiCanvas.getBoundingClientRect();
      confettiCanvas.width = rect.width * devicePixelRatio;
      confettiCanvas.height = rect.height * devicePixelRatio;
      const ctx = confettiCanvas.getContext("2d");
      const colors = ["#FFD700", "#007BFF", "#FF6B35", "#2ECC71", "#7152FF", "#FFC83D"];
      const n = count || 100;
      this.pieces = this.pieces.concat(
        Array.from({ length: n }, () => ({
          x: Math.random() * confettiCanvas.width,
          y: -10 - Math.random() * confettiCanvas.height * 0.3,
          w: 5 + Math.random() * 7,
          h: 4 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 5,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.25,
        }))
      );
      if (!this.raf) {
        const draw = () => {
          ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
          this.pieces.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.06;
            p.rot += p.vr;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
          });
          this.pieces = this.pieces.filter((p) => p.y < confettiCanvas.height + 30);
          if (this.pieces.length) this.raf = requestAnimationFrame(draw);
          else this.stop();
        };
        this.raf = requestAnimationFrame(draw);
      }
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

  function slotKey(house, index) {
    return `${house}:${index}`;
  }

  function currentPrompt() {
    return state.sessionPrompts[state.promptIndex];
  }

  function integrity() {
    return Math.max(0, Math.min(100, Math.round(state.signalIntegrity)));
  }

  function dipIntegrity() {
    state.faults += 1;
    state.signalIntegrity = Math.max(0, state.signalIntegrity - CONFIG.integrityLossPerFault);
  }

  function boostIntegrity() {
    state.signalIntegrity = Math.min(100, state.signalIntegrity + CONFIG.integrityGainPerCorrect);
  }

  function mastery() {
    const total = state.anchors + state.faults;
    if (!total) return 0;
    return Math.round((state.anchors / total) * 100);
  }

  function readinessBoost() {
    const m = mastery();
    if (m >= 85) return "+0.7%";
    if (m >= 70) return "+0.5%";
    if (m >= 55) return "+0.3%";
    return "+0.1%";
  }

  function sessionFailed() {
    return integrity() <= 0;
  }

  function isSuccess() {
    return state.anchors >= CONFIG.maxAnchors;
  }

  function clearTimers() {
    if (state.tickId) clearInterval(state.tickId);
    state.tickId = null;
    if (state.advanceId) clearTimeout(state.advanceId);
    state.advanceId = null;
  }

  function navTitle() {
    if (state.view === "play") return `PROMPT ${state.promptIndex + 1} OF ${CONFIG.maxAnchors}`;
    if (state.view === "result") return "GAME RESULT";
    return "PRACTICE GAMES";
  }

  function volIcon() {
    return state.muted ? `${I}/volume-off-24.svg` : `${I}/volume-high-24.svg`;
  }

  function navHtml() {
    return `
      <header class="nq-nav">
        <button class="nq-nav-btn nq-back" type="button" aria-label="Back">
          <img class="nq-icon-back" src="assets/icons/arrow-left-02.svg" alt="" width="24" height="24" />
        </button>
        <p class="nq-nav-title">${navTitle()}</p>
        <button class="nq-nav-btn nq-volume ${state.muted ? "is-muted" : ""}" type="button" aria-label="${state.muted ? "Unmute" : "Mute"}">
          <img src="${volIcon()}" alt="" width="24" height="24" />
        </button>
      </header>`;
  }

  function bottomSingle(label, action, variant, icon) {
    const iconHtml = icon ? `<img src="${icon}" alt="" width="20" height="20" />` : "";
    return `
      <div class="nq-bottom">
        <button class="nq-btn nq-btn--${variant}" type="button" data-action="${action}">
          ${iconHtml}${label}
        </button>
      </div>`;
  }

  function bottomIntro(label, action, variant, icon) {
    return bottomSingle(label, action, variant, icon);
  }

  function howStep(icon, title, desc) {
    return `
      <div class="nq-how-step">
        <span class="nq-how-step-icon"><img src="${icon}" alt="" width="16" height="16" /></span>
        <div class="nq-how-step-copy">
          <strong>${title}</strong>
          <p>${desc}</p>
        </div>
      </div>`;
  }

  function viewWrap(content, animate) {
    const cls = animate ? "nq-view nq-view--enter" : "nq-view";
    return `<div class="${cls}">${content}</div>`;
  }

  function introViewWrap(content, animate) {
    const cls = animate ? "nq-view nq-view--intro nq-view--enter" : "nq-view nq-view--intro";
    return `<div class="${cls}">${content}</div>`;
  }

  function renderIntro() {
    Confetti.stop();
    app.innerHTML = introViewWrap(`
        ${navHtml()}
        <div class="nq-scroll nq-scroll--intro">
          <div class="nq-intro-head">
            <h1 class="nq-intro-title">Narrative <span>Quest</span></h1>
            <p class="nq-intro-kicker">Repair the story, Choose the logic</p>
          </div>
          <img class="nq-intro-art" src="${A}/intro-art.png" alt="" />
          <p class="nq-intro-desc">Fix broken scenarios by choosing the term that makes the story work</p>
          <div class="nq-tip">
            <div class="nq-tip-head">
              <img src="${I}/bulb-20.svg" alt="" width="20" height="20" />
              <span>Expert Tip</span>
            </div>
            <p class="nq-tip-body">
              "Differentiate between <span class="nq-blue">Conditions (the start)</span> and <span class="nq-orange">Interventions (the action)</span>. One wrong injection breaks the entire circuit loop."
            </p>
          </div>
        </div>
        ${bottomIntro("Launch Quest", "how", "launch", `${I}/startup-02-20.svg`)}
    `, true);
  }

  function renderHow() {
    app.innerHTML = viewWrap(`
        ${navHtml()}
        <div class="nq-scroll nq-scroll--how">
          <p class="nq-how-kicker">Narrative <span>Quest</span></p>
          <h2 class="nq-how-title">How it works</h2>
          <p class="nq-how-sub">Learn the rules before you start.</p>
          <div class="nq-how-panel">
            <div class="nq-how-panel-head">
              <img src="${I}/bulb-20.svg" alt="" width="20" height="20" />
              <span>How to play</span>
            </div>
            ${howStep(`${I}/book-open-16.svg`, "Fill the missing narrative", "A project statement appears at the center of the circuit with a missing logical piece.")}
            ${howStep(`${I}/touch-01-16.svg`, "Choose from the corner houses", "Each corner house contains 4 possible answers. Tap the option you believe correctly restores the narrative flow.")}
            ${howStep(`${I}/multiplication-sign-16.svg`, "Wrong picks drain integrity", "Each incorrect selection drains Signal integrity. The mission fails when integrity reaches 0%.")}
            ${howStep(`${I}/tick-02-16.svg`, "Correct picks restore integrity", "Each correct answer boosts Signal integrity and unlocks the next narrative challenge in the circuit.")}
            ${howStep(`${I}/checkmark-circle-03-16.svg`, "Complete all 16 narrative nodes", "Restore all 16 corner-house anchors before integrity collapses to win the mission.")}
            ${howStep(`${I}/timer-02-16.svg`, "Beat the clock on each node", "You have ${CONFIG.timePerPrompt} seconds to choose the answer for each narrative card.")}
          </div>
        </div>
        ${bottomSingle("Start Challenge", "play", "start", `${I}/play-circle-20.svg`)}
    `, true);
  }

  function progressHtml() {
    const total = CONFIG.maxAnchors;
    let html = '<div class="nq-progress">';
    for (let i = 0; i < total; i++) {
      if (i === state.promptIndex) html += '<span class="nq-progress-seg nq-progress-seg--active"></span>';
      else if (i < state.promptIndex) html += '<span class="nq-progress-seg nq-progress-seg--done"></span>';
      else html += `<span class="nq-progress-seg" style="background-image:url('${I}/progress-dot-8.svg');background-size:contain;background-repeat:no-repeat;background-color:transparent"></span>`;
    }
    return html + "</div>";
  }

  function nodeConfettiHtml() {
    return `
      <img class="nq-node-confetti nq-node-confetti--tr" src="${I}/confetti-tr.svg" alt="" />
      <img class="nq-node-confetti nq-node-confetti--tl" src="${I}/confetti-tl.svg" alt="" />
      <img class="nq-node-confetti nq-node-confetti--p1" src="${I}/confetti-polygon-blue.svg" alt="" />
      <img class="nq-node-confetti nq-node-confetti--p2" src="${I}/confetti-polygon-yellow.svg" alt="" />
      <img class="nq-node-confetti nq-node-confetti--p3" src="${I}/confetti-polygon-blue.svg" alt="" />
      <img class="nq-node-confetti nq-node-confetti--p4" src="${I}/confetti-polygon-yellow.svg" alt="" />`;
  }

  function narrativeHtml(prompt) {
    const filled = state.feedback?.type === "correct";
    const house = CONFIG.houses[prompt.house];
    const answer = house.options[prompt.answerIndex];
    const blank = filled
      ? `<span class="nq-node-filled">${answer}</span>`
      : `<span class="nq-node-blank">________________</span>`;
    return `<p class="nq-node-text">${prompt.before}${blank}${prompt.after}</p>`;
  }

  function isSlotCompleted(houseKey, idx) {
    return state.completedSlots.has(slotKey(houseKey, idx));
  }

  function isWrongPickThisPrompt(houseKey, idx) {
    return state.wrongPicksThisPrompt.has(slotKey(houseKey, idx));
  }

  function optionClass(houseKey, idx, prompt) {
    if (isSlotCompleted(houseKey, idx)) return "nq-option--used";
    if (isWrongPickThisPrompt(houseKey, idx)) return "nq-option--wrong";
    const fb = state.feedback;
    if (fb?.type === "wrong" && fb.house === houseKey && fb.index === idx) return "nq-option--wrong";
    if (fb?.type === "correct" && houseKey === prompt.house && idx === prompt.answerIndex) return "nq-option--correct";
    return "";
  }

  function housesHtml(prompt) {
    const disablePick = state.pickLocked;
    return `<div class="nq-houses">${HOUSE_KEYS.map((key) => {
      const house = CONFIG.houses[key];
      const opts = house.options
        .map((label, idx) => {
          const used = isSlotCompleted(key, idx) || isWrongPickThisPrompt(key, idx);
          return `<button class="nq-option ${optionClass(key, idx, prompt)}" type="button" data-house="${key}" data-index="${idx}" ${used || disablePick ? "disabled" : ""}>${label}</button>`;
        })
        .join("");
      return `
        <div class="nq-house nq-house--${house.theme}">
          <div class="nq-house-head">
            <img src="${I}/${house.icon}" alt="" width="12" height="12" />
            <span>${house.label}</span>
          </div>
          <div class="nq-options">${opts}</div>
        </div>`;
    }).join("")}</div>`;
  }

  function feedbackHtml() {
    if (!state.feedback) {
      return `
        <div class="nq-hint">
          <img src="${I}/touchpad-16.svg" alt="" width="16" height="16" />
          <span>Select the correct option from the cornerhouses below</span>
        </div>`;
    }
    if (state.feedback.type === "correct") {
      return `
        <div class="nq-feedback nq-feedback--correct nq-feedback--show">
          <img src="${I}/checkmark-badge-16.svg" alt="" width="16" height="16" />
          <span>Correct</span>
        </div>`;
    }
    return `
      <div class="nq-feedback nq-feedback--wrong nq-feedback--show">
        <img src="${I}/alert-01-16.svg" alt="" width="16" height="16" />
        <span>${state.feedback.timeout ? "Time's up" : "Incorrect"}</span>
      </div>`;
  }

  function updatePlayHud() {
    if (state.view !== "play") return;
    const secs = Math.ceil(state.timeLeft);
    const timeLow = secs <= CONFIG.timeLowThreshold;
    const timer = app.querySelector(".nq-timer");
    const secsEl = app.querySelector(".nq-timer-secs");
    if (timer) timer.classList.toggle("nq-timer--low", timeLow);
    if (secsEl) secsEl.textContent = `${secs}s`;
  }

  function renderPlay(animate) {
    const prompt = currentPrompt();
    if (!prompt) {
      finishSession();
      return;
    }
    const secs = Math.ceil(state.timeLeft);
    const timeLow = secs <= CONFIG.timeLowThreshold;
    const showDim = state.feedback?.type === "wrong";
    const nodeCardCls = [
      "nq-node-card",
      state.feedback?.type === "wrong" ? "nq-node-card--shake" : "",
      state.feedback?.type === "correct" ? "nq-node-card--correct" : "",
    ]
      .filter(Boolean)
      .join(" ");
    app.innerHTML = viewWrap(`
        ${navHtml()}
        <div class="nq-play-body">
          <div class="nq-stats ${state.feedback?.type === "wrong" ? "nq-stats--dip" : ""}">
            <div class="nq-stat">
              <span class="nq-stat-label">Anchors</span>
              <span class="nq-stat-value ${state.feedback?.type === "correct" ? "nq-stat-value--pop" : ""}">${state.anchors}/${CONFIG.maxAnchors}</span>
            </div>
            <div class="nq-stat">
              <span class="nq-stat-label">INtegrity (Fail at 0%)</span>
              <span class="nq-stat-value ${state.feedback?.type === "wrong" ? "nq-stat-value--flash" : ""} ${state.feedback?.type === "correct" ? "nq-stat-value--boost" : ""}">${integrity()}%</span>
            </div>
            <div class="nq-stat">
              <span class="nq-stat-label">FAults</span>
              <span class="nq-stat-value nq-stat-value--fault">${state.faults}/${CONFIG.maxFaults}</span>
            </div>
          </div>
          <div class="nq-meta-row">
            ${progressHtml()}
            <div class="nq-timer ${timeLow ? "nq-timer--low" : ""}">
              <img src="${I}/timer-02-32.svg" alt="" width="32" height="32" />
              <div class="nq-timer-copy">
                <span class="nq-timer-secs">${secs}s</span>
                <span class="nq-timer-label">TIME LEFT</span>
              </div>
            </div>
          </div>
          <div class="nq-node-wrap ${animate ? "nq-node-wrap--enter" : ""}">
            <div class="nq-node-frame">
              ${nodeConfettiHtml()}
              <div class="${nodeCardCls}">
                <span class="nq-node-badge">${prompt.badge}</span>
                ${narrativeHtml(prompt)}
              </div>
            </div>
            ${feedbackHtml()}
          </div>
          <div class="nq-houses-wrap ${showDim ? "nq-houses-wrap--dimmed" : ""}">
            ${showDim ? '<div class="nq-dim" aria-hidden="true"></div>' : ""}
            ${housesHtml(prompt)}
          </div>
        </div>
    `, !!animate);
    bindEvents();
  }

  function bindPlayEvents() {
    app.querySelectorAll(".nq-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        handleSelect(btn.dataset.house, Number(btn.dataset.index));
      });
    });
  }

  function renderResult() {
    const success = isSuccess();
    Confetti.burst(success ? 140 : 40);
    if (success) Sound.victory();
    else Sound.fail();

    const resultHead = success
      ? `<h1 class="nq-result-title">
           <span class="nq-result-line">Mission</span>
           <span class="nq-result-line nq-green">Complete!</span>
         </h1>
         <p class="nq-result-sub">You hit the target and cleared the sprint.</p>`
      : `<h1 class="nq-result-title">
           <span class="nq-result-line">Recalibration</span>
           <span class="nq-result-line nq-yellow">Required</span>
         </h1>
         <p class="nq-result-sub nq-result-sub--split">
           <span>You completed the sprint,</span>
           <span>but missed the target accuracy.</span>
         </p>`;

    app.innerHTML = viewWrap(`
        ${navHtml()}
        <div class="nq-scroll nq-scroll--result">
          <div class="nq-result-head">
            ${resultHead}
          </div>
          <img class="nq-result-art" src="${A}/${success ? "trophy-success" : "trophy-recalibration"}.png" alt="" />
          <div class="nq-result-stats">
            <div class="nq-result-stat">
              <span class="nq-result-stat-label">Mastery</span>
              <img src="${I}/target-02-24.svg" alt="" width="24" height="24" />
              <span class="nq-result-stat-value nq-result-stat-value--green">${mastery()}%</span>
            </div>
            <div class="nq-result-stat">
              <span class="nq-result-stat-label">Faults</span>
              <img src="${I}/alert-01-24.svg" alt="" width="24" height="24" />
              <span class="nq-result-stat-value nq-result-stat-value--amber">${state.faults}/${CONFIG.maxFaults}</span>
            </div>
            <div class="nq-result-stat">
              <span class="nq-result-stat-label">Readiness Boost</span>
              <img src="${I}/startup-01-24.svg" alt="" width="24" height="24" />
              <span class="nq-result-stat-value">${readinessBoost()}</span>
            </div>
          </div>
        </div>
        <div class="nq-bottom nq-bottom--stack">
          <button class="nq-btn nq-btn--replay" type="button" data-action="replay">
            <img src="${I}/play-circle-20.svg" alt="" width="20" height="20" />
            ${success ? "Play Again" : "Try Again"}
          </button>
          <button class="nq-btn nq-btn--dark" type="button" data-action="games">
            <img src="${I}/game-controller-20.svg" alt="" width="20" height="20" />
            Back to Games
          </button>
        </div>
    `, true);
  }

  function render() {
    if (state.view === "intro") renderIntro();
    else if (state.view === "how") renderHow();
    else if (state.view === "play") renderPlay(false);
    else if (state.view === "result") renderResult();
    bindEvents();
  }

  function startSession() {
    clearTimers();
    state.sessionPrompts = shuffle(CONFIG.nodes);
    state.promptIndex = 0;
    state.completedSlots = new Set();
    state.anchors = 0;
    state.faults = 0;
    state.signalIntegrity = CONFIG.integrityStart;
    state.feedback = null;
    state.pickLocked = false;
    state.wrongPicksThisPrompt = new Set();
    state.timeLeft = CONFIG.timePerPrompt;
    state.view = "play";
    Sound.launch();
    renderPlay(true);
    bindEvents();
    startTimer();
  }

  function startTimer() {
    if (state.tickId) clearInterval(state.tickId);
    state.tickId = null;
    state.timeLeft = CONFIG.timePerPrompt;
    let lastLow = false;
    updatePlayHud();
    state.tickId = setInterval(() => {
      state.timeLeft -= 1;
      const secs = Math.ceil(state.timeLeft);
      if (secs <= CONFIG.timeLowThreshold && !lastLow) {
        Sound.timeLow();
        lastLow = true;
      }
      if (state.timeLeft <= 0) {
        handleTimeout();
        return;
      }
      if (secs <= 5) Sound.tick(secs);
      updatePlayHud();
    }, 1000);
  }

  function handleTimeout() {
    if (state.pickLocked) return;
    dipIntegrity();
    state.feedback = { type: "wrong", timeout: true };
    state.pickLocked = true;
    Sound.wrong();
    if (state.tickId) clearInterval(state.tickId);
    state.tickId = null;
    renderPlay();

    if (sessionFailed()) {
      state.advanceId = setTimeout(finishSession, 1200);
      return;
    }
    state.advanceId = setTimeout(() => {
      advancePrompt();
    }, 1100);
  }

  function handleSelect(houseKey, index) {
    if (state.pickLocked || isSlotCompleted(houseKey, index) || isWrongPickThisPrompt(houseKey, index)) return;
    const prompt = currentPrompt();
    if (!prompt) return;

    Sound.select();
    state.pickLocked = true;

    const correct = houseKey === prompt.house && index === prompt.answerIndex;
    if (correct) {
      if (state.tickId) clearInterval(state.tickId);
      state.tickId = null;
      state.feedback = { type: "correct", house: houseKey, index };
      state.completedSlots.add(slotKey(prompt.house, prompt.answerIndex));
      state.anchors = state.completedSlots.size;
      boostIntegrity();
      Sound.correct();
      Confetti.burst(35);
      renderPlay();

      state.advanceId = setTimeout(() => {
        if (state.anchors >= CONFIG.maxAnchors) {
          finishSession();
          return;
        }
        advancePrompt();
      }, 1100);
    } else {
      dipIntegrity();
      state.wrongPicksThisPrompt.add(slotKey(houseKey, index));
      state.feedback = { type: "wrong", house: houseKey, index };
      Sound.wrong();
      renderPlay();

      if (sessionFailed()) {
        state.advanceId = setTimeout(finishSession, 1200);
        return;
      }
      state.advanceId = setTimeout(() => {
        state.feedback = null;
        state.pickLocked = false;
        renderPlay();
      }, 900);
    }
  }

  function advancePrompt() {
    state.promptIndex += 1;
    state.feedback = null;
    state.pickLocked = false;
    state.wrongPicksThisPrompt = new Set();

    if (state.promptIndex >= state.sessionPrompts.length) {
      finishSession();
      return;
    }
    startTimer();
    renderPlay(true);
  }

  function finishSession() {
    clearTimers();
    state.view = "result";
    render();
  }

  function bindEvents() {
    app.querySelector(".nq-back")?.addEventListener("click", onBack);
    app.querySelector(".nq-volume")?.addEventListener("click", toggleMute);

    app.querySelector('[data-action="how"]')?.addEventListener("click", () => {
      Sound.launch();
      state.view = "how";
      render();
    });

    app.querySelector('[data-action="play"]')?.addEventListener("click", startSession);

    app.querySelector('[data-action="replay"]')?.addEventListener("click", () => {
      Confetti.stop();
      state.view = "intro";
      render();
    });

    app.querySelector('[data-action="games"]')?.addEventListener("click", () => {
      window.location.href = new URL("games/games.html", document.baseURI).href;
    });

    bindPlayEvents();
  }

  function toggleMute() {
    state.muted = !state.muted;
    Sound.tap();
    const volBtn = app.querySelector(".nq-volume");
    if (volBtn) {
      volBtn.classList.toggle("is-muted", state.muted);
      const img = volBtn.querySelector("img");
      if (img) img.src = volIcon();
      volBtn.setAttribute("aria-label", state.muted ? "Unmute" : "Mute");
      return;
    }
    render();
  }

  function onBack() {
    Sound.tap();
    clearTimers();
    Confetti.stop();
    if (state.view === "play") {
      state.view = "how";
      render();
    } else if (state.view === "how") {
      state.view = "intro";
      render();
    } else if (state.view === "result") {
      window.location.href = new URL("games/games.html", document.baseURI).href;
    } else {
      window.location.href = new URL("games/games.html", document.baseURI).href;
    }
  }

  render();
})();
