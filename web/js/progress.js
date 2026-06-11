(() => {
  const data = window.PROGRESS_DATA;
  const charts = window.ProgressCharts;
  if (!data || !charts) return;

  const tabsRoot = document.querySelector("[data-progress-tabs]");
  const views = document.querySelectorAll("[data-progress-view]");
  const sprintList = document.querySelector("[data-sprint-list]");
  const sprintSheet = document.querySelector("[data-sprint-sheet-overlay]");
  const studyBlockSheet = document.querySelector("[data-study-block-overlay]");
  const analysisOverlay = document.querySelector("[data-analysis-overlay]");
  const retrospectiveOverlay = document.querySelector("[data-retrospective-overlay]");
  const retroHero = document.querySelector("[data-retro-hero]");
  const retroSteps = document.querySelector("[data-retro-steps]");
  const retroStepContent = document.querySelector("[data-retro-step-content]");
  const retroFooter = document.querySelector("[data-retro-footer]");

  const RETRO_STEP_COUNT = 6;
  let retroStep = 0;
  let retroSprintId = "sprint-1";
  let retroForm = { slow: "Other", other: "", worked: "", change: "" };

  let activeTab = new URLSearchParams(location.search).get("tab") || "overview";

  const setTab = (id) => {
    activeTab = id;
    tabsRoot?.querySelectorAll("[data-progress-tab]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.progressTab === id);
    });
    views.forEach((v) => {
      v.hidden = v.dataset.progressView !== id;
    });
  };

  const renderTabs = () => {
    if (!tabsRoot) return;
    tabsRoot.innerHTML = data.tabs
      .map(
        (t) => `<button type="button" class="progress-tab${t.id === activeTab ? " active" : ""}" data-progress-tab="${t.id}" role="tab">
          <img src="assets/progress/${t.icon}" alt="" width="18" height="18" />
          <span>${t.label}</span>
        </button>`,
      )
      .join("");
    tabsRoot.querySelectorAll("[data-progress-tab]").forEach((btn) => {
      btn.addEventListener("click", () => setTab(btn.dataset.progressTab || "overview"));
    });
  };

  const renderOverview = () => {
    const cs = data.currentSprint;
    document.querySelector("[data-sprint-title]") &&
      (document.querySelector("[data-sprint-title]").textContent = cs.title);
    document.querySelector("[data-sprint-meta]") &&
      (document.querySelector("[data-sprint-meta]").textContent = `${cs.weekLabel} • ${cs.sprintLabel}`);
    const fill = document.querySelector("[data-sprint-bar-fill]");
    if (fill) fill.style.width = `${cs.progress}%`;
    document.querySelector("[data-time-remaining]") &&
      (document.querySelector("[data-time-remaining]").textContent = cs.studyBlock.timeRemaining);

    const dailyRing = document.querySelector("[data-daily-ring]");
    if (dailyRing) {
      charts.mountSingleRing(dailyRing, cs.studyBlock.percent, { size: 75, stroke: 8 });
      const dailyPct = document.querySelector("[data-daily-ring-pct]");
      if (dailyPct) dailyPct.textContent = `${cs.studyBlock.percent}%`;
    }

    const bars = document.querySelector("[data-study-bars]");
    if (bars) charts.mountStudyBars(bars, data.studyExecution.days);

    const vel = data.sprintVelocity;
    const ringEl = document.querySelector("[data-velocity-ring]");
    if (ringEl) {
      charts.mountVelocityRing(
        ringEl,
        [
          { weight: 30, color: "#2ecc71" },
          { weight: 12, color: "#ff6b35" },
          { weight: 28, color: "#007bff" },
        ],
        String(vel.score),
      );
    }
    const legend = document.querySelector("[data-velocity-legend]");
    if (legend) {
      legend.innerHTML = vel.segments
        .map(
          (s) => `<li><span class="dot" style="background:${s.color}"></span><span class="lbl">${s.label}</span><strong>${s.value}</strong></li>`,
        )
        .join("");
    }
    const metrics = document.querySelector("[data-velocity-metrics]");
    if (metrics) {
      metrics.innerHTML = "";
      vel.metrics.forEach((m) => {
        const el = document.createElement("div");
        el.className = "progress-metric";
        el.innerHTML = `<p>${m.label.replace("\n", "<br>")}</p><div class="progress-ring-wrap progress-ring-wrap--sm"><div data-metric-ring></div></div><p class="delta ${m.deltaTone}">${m.delta}<br>from last sprint</p>`;
        metrics.appendChild(el);
        const mount = el.querySelector("[data-metric-ring]");
        if (mount) {
          charts.mountSingleRing(mount, m.percent, { size: 75, stroke: 8 });
          let label = mount.querySelector(".progress-ring-pct");
          if (!label) {
            label = document.createElement("strong");
            label.className = "progress-ring-pct";
            mount.appendChild(label);
          }
          label.textContent = `${m.percent}%`;
        }
      });
    }

    const warn = document.querySelector("[data-burndown-warning]");
    if (warn) warn.textContent = data.burnDown.warning;
    const stats = document.querySelector("[data-burndown-stats]");
    if (stats) {
      stats.innerHTML = data.burnDown.stats
        .map(
          (s) => `<div class="progress-stat"><span class="progress-stat-label">${s.label}</span><strong>${s.value}</strong><span class="progress-stat-sub">${s.sub}</span></div>`,
        )
        .join("");
    }
    const chart = document.querySelector("[data-burndown-chart]");
    if (chart) charts.mountBurnDown(chart, data.burnDown);
  };

  const sprintBadges = {
    completed: `<span class="progress-sprint-badge progress-sprint-badge--completed"><img src="assets/progress/checkmark-circle-02.svg" alt="" width="14" height="14" />Completed</span>`,
    ongoing: `<span class="progress-sprint-badge progress-sprint-badge--ongoing"><img src="assets/progress/clock-01.svg" alt="" width="14" height="14" />Ongoing</span>`,
    locked: `<span class="progress-sprint-badge progress-sprint-badge--locked"><img src="assets/progress/circle-lock-02.svg" alt="" width="14" height="14" />Not Started</span>`,
  };

  const sprintActionsHtml = (s) => {
    if (s.state === "completed") {
      return `<div class="progress-sprint-actions">
        <button type="button" class="progress-btn-retrospective" data-retrospective-open="${s.id}">Start Retrospective<img class="progress-btn-retrospective-icon" src="assets/progress/arrow-right-02-sharp.svg" alt="" width="20" height="20" /></button>
        <button type="button" class="progress-btn-details" data-timeline-open="${s.id}">View details</button>
      </div>`;
    }
    if (s.state === "ongoing") {
      return `<div class="progress-sprint-actions"><button type="button" class="progress-btn-details" data-timeline-open="${s.id}">View details</button></div>`;
    }
    return "";
  };

  const sprintCardHtml = (s) => {
    const state = s.state || "locked";
    const actions = sprintActionsHtml(s);
    return `<article class="progress-sprint-card progress-sprint-card--${state}" data-sprint-id="${s.id}">
      <div class="progress-sprint-card-body">
        <div class="progress-sprint-card-head">
          <h2>${s.name}</h2>
          ${sprintBadges[state]}
        </div>
        <p class="progress-sprint-desc">${s.description}</p>
        <div class="progress-sprint-meta-row">
          <span><img src="assets/progress/clock-04.svg" alt="" width="16" height="16" />${s.hours}</span>
          <span><img src="assets/progress/calendar-03.svg" alt="" width="16" height="16" />${s.dates}</span>
        </div>
        <div class="progress-sprint-card-foot">
          <div class="progress-sprint-blocks">
            <p><img src="assets/progress/hourglass.svg" alt="" width="16" height="16" />${s.blocks}</p>
            <span>${s.hoursLeft}</span>
          </div>
          <div class="progress-ring-wrap progress-ring-wrap--sprint" data-sprint-ring="${s.progress}" data-sprint-state="${state}"></div>
        </div>
      </div>
      ${actions}
    </article>`;
  };

  const renderSprints = () => {
    if (!sprintList) return;
    sprintList.innerHTML = data.sprints.map(sprintCardHtml).join("");
    sprintList.querySelectorAll("[data-sprint-ring]").forEach((el) => {
      const pct = Number(el.dataset.sprintRing) || 0;
      const state = el.dataset.sprintState || "locked";
      const color = pct >= 100 ? "#22c55e" : "#007bff";
      charts.mountSingleRing(el, pct, { size: 72, stroke: 8, color });
      let label = el.querySelector(".progress-ring-pct");
      if (!label) {
        label = document.createElement("strong");
        label.className = "progress-ring-pct progress-ring-pct--sprint";
        el.appendChild(label);
      }
      label.textContent = `${pct}%`;
      if (state === "locked") label.classList.add("is-muted");
    });
    sprintList.querySelectorAll("[data-timeline-open]").forEach((btn) => {
      btn.addEventListener("click", () => openSprintDetailSheet(btn.dataset.timelineOpen));
    });
  };

  const P = "assets/progress";

  const renderDurationBadge = (text) =>
    `<span class="progress-duration-badge"><img src="${P}/hourglass.svg" width="14" height="14" alt="" />${text}</span>`;

  const renderMetricCircle = (metric) => {
    const value = metric.suffix
      ? `<span class="progress-sprint-metric-value">${metric.value}<span class="progress-sprint-metric-muted">${metric.suffix}</span></span>`
      : `<span class="progress-sprint-metric-value">${metric.value}</span>`;
    return `<div class="progress-sprint-metric">
      <span class="progress-sprint-metric-label">${metric.label}</span>
      <div class="progress-sprint-metric-circle" style="--metric-color:${metric.color}">${value}</div>
    </div>`;
  };

  const renderLessonRow = (item) => {
    const icon =
      item.type === "quiz"
        ? `<img src="${P}/message-question.svg" width="16" height="16" alt="" />`
        : `<img src="${P}/play.svg" width="16" height="16" alt="" />`;
    const check = item.done
      ? `<img src="${P}/checkmark-circle-green.svg" width="20" height="20" alt="" class="progress-lesson-check" />`
      : "";
    return `<div class="progress-lesson-row">
      <div class="progress-lesson-row-main">${icon}<span class="progress-lesson-title">${item.title}</span></div>
      <div class="progress-lesson-row-meta"><span>${item.duration}</span>${check}</div>
    </div>`;
  };

  const renderStudyBlockCard = (block) =>
    `<section class="progress-sprint-sheet-card progress-study-block-card">
      <div class="progress-study-block-head">
        <div class="progress-study-block-title">
          <img src="${P}/book-open-02.svg" width="24" height="24" alt="" />
          <strong>Study block :</strong>
          <span>${block.dayLabel}</span>
        </div>
        ${renderDurationBadge(block.duration)}
      </div>
      <div class="progress-lesson-list-box">${block.items.map(renderLessonRow).join("")}</div>
      <button type="button" class="progress-sprint-sheet-btn" data-study-block-review>Review</button>
    </section>`;

  const renderSprintSheetHtml = (detail) => {
    const metrics = detail.review.metrics;
    const boostTone = detail.review.readinessBoost.tone === "good" ? "is-good" : "is-bad";
    const boostArrow =
      detail.review.readinessBoost.tone === "good"
        ? `<img src="${P}/arrow-down-double-sharp.svg" width="20" height="20" alt="" class="progress-readiness-arrow is-up" />`
        : `<img src="${P}/arrow-down-double-sharp.svg" width="20" height="20" alt="" class="progress-readiness-arrow" />`;

    return `<div class="progress-sprint-sheet-header-wrap">
      <header class="progress-sprint-sheet-header">
        <div class="progress-sprint-sheet-title-row">
          <span class="progress-sprint-sheet-icon-badge"><img src="${P}/motion-02-orange.svg" width="16" height="16" alt="" /></span>
          <h2>${detail.name}</h2>
        </div>
        <button type="button" class="progress-sprint-sheet-close" data-close-sprint-sheet aria-label="Close">
          <img src="${P}/cancel-01.svg" width="24" height="24" alt="" />
        </button>
      </header>
      <div class="progress-sprint-sheet-divider" aria-hidden="true"></div>
    </div>
      <div class="progress-sprint-sheet-content">
        <section class="progress-sprint-sheet-card progress-sprint-review-card">
          <div class="progress-sprint-sheet-card-head">
            <div class="progress-sprint-sheet-card-title">
              <img src="${P}/list-star.svg" width="24" height="24" alt="" />
              <h3>Sprint review</h3>
            </div>
            ${renderDurationBadge(detail.review.duration)}
          </div>
          <div class="progress-sprint-metrics">
            <div class="progress-sprint-metrics-row">${metrics.slice(0, 2).map(renderMetricCircle).join("")}</div>
            <div class="progress-sprint-metrics-row">${metrics.slice(2, 4).map(renderMetricCircle).join("")}</div>
          </div>
          <div class="progress-readiness-row">
            <div class="progress-readiness-label">
              <img src="${P}/dashboard-speed-02.svg" width="16" height="16" alt="" />
              <span>Readiness boost</span>
            </div>
            <div class="progress-readiness-value ${boostTone}">
              <span>${detail.review.readinessBoost.value}</span>${boostArrow}
            </div>
          </div>
          <button type="button" class="progress-sprint-sheet-btn" data-analysis-open>Take a deep dive</button>
        </section>
        ${detail.studyBlocks.map(renderStudyBlockCard).join("")}
      </div>`;
  };

  const openSprintSheet = (sprintId = "sprint-1") => {
    const body = document.querySelector("[data-sprint-sheet-body]");
    if (!body) return;

    const sprint = data.sprints.find((s) => s.id === sprintId);
    const detail =
      data.sprintDetailSheets[sprintId] ||
      (sprint
        ? {
            ...data.sprintDetailSheets["sprint-1"],
            name: sprint.name,
          }
        : data.sprintDetailSheets["sprint-1"]);

    body.className = "progress-sheet-body progress-sprint-sheet-body";
    body.innerHTML = renderSprintSheetHtml(detail);

    body.querySelector("[data-close-sprint-sheet]")?.addEventListener("click", () => {
      sprintSheet.hidden = true;
    });
    body.querySelector("[data-analysis-open]")?.addEventListener("click", () => {
      const sprintName = detail.name;
      sprintSheet.hidden = true;
      openAnalysis(sprintName);
    });
    body.querySelectorAll("[data-study-block-review]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sprintSheet.hidden = true;
        openStudyBlockSheet();
      });
    });

    sprintSheet.hidden = false;
  };

  // ─── Sprint Detail Bottom Sheet (Figma timeline design) ──────────────
  const sdOverlay  = document.querySelector("[data-sprint-detail-overlay]");
  const sdScroll   = document.querySelector("[data-sd-scroll]");
  const sdFooter   = document.querySelector("[data-sd-footer]");

  const sdTimelineData = {
    "sprint-1": {
      completed: {
        dateRange: "Jan 01 - Jan 07",
        progress: 100,
        stats: [
          { label: "Velocity",   value: "64%",  colorClass: "sd-stat-value--green"  },
          { label: "Quizzes",    value: "4/10", colorClass: "sd-stat-value--navy"   },
          { label: "Quiz score", value: "24%",  colorClass: "sd-stat-value--red"    },
          { label: "Readiness",  value: "24%",  colorClass: "sd-stat-value--orange" },
        ],
        days: [
          { label: "Mon 01", status: "Done",      statusClass: "sd-day-status--done",      done: true,  pills: [{ type: "completed", text: "4 study block completed" }] },
          { label: "Tue 02", status: "Done",      statusClass: "sd-day-status--done",      done: true,  pills: [{ type: "completed", text: "4 study block completed" }] },
          { label: "Thu 04", status: "Scheduled", statusClass: "sd-day-status--scheduled", done: true,  pills: [{ type: "completed", text: "4 study block completed" }] },
          { label: "Fri 05", status: "Scheduled", statusClass: "sd-day-status--scheduled", done: true,  pills: [{ type: "completed", text: "4 study block completed" }] },
        ],
      },
      ongoing: {
        dateRange: "Jan 01 - Jan 07",
        progress: 50,
        stats: [
          { label: "Velocity",   value: "64%",  colorClass: "sd-stat-value--green"  },
          { label: "Quizzes",    value: "4/10", colorClass: "sd-stat-value--navy"   },
          { label: "Quiz score", value: "24%",  colorClass: "sd-stat-value--red"    },
          { label: "Readiness",  value: "24%",  colorClass: "sd-stat-value--orange" },
        ],
        days: [
          { label: "Mon 01", status: "Done",      statusClass: "sd-day-status--done",      done: true,  pills: [{ type: "completed", text: "4 study block completed" }] },
          { label: "Tue 02", status: "Done",      statusClass: "sd-day-status--done",      active: true, pills: [
              { type: "completed", text: "3 study block completed" },
              { type: "active",    text: "Active study block"       },
              { type: "scheduled", text: "1 study block scheduled"  },
            ]},
          { label: "Thu 04", status: "Scheduled", statusClass: "sd-day-status--scheduled", done: false, pills: [{ type: "scheduled", text: "4 study block scheduled" }] },
          { label: "Fri 05", status: "Scheduled", statusClass: "sd-day-status--scheduled", done: false, pills: [{ type: "scheduled", text: "4 study block scheduled" }] },
        ],
      },
    },
    "sprint-2": {
      ongoing: {
        dateRange: "Jan 08 - Jan 16",
        progress: 45,
        stats: [
          { label: "Velocity",   value: "52%",  colorClass: "sd-stat-value--green"  },
          { label: "Quizzes",    value: "2/10", colorClass: "sd-stat-value--navy"   },
          { label: "Quiz score", value: "18%",  colorClass: "sd-stat-value--red"    },
          { label: "Readiness",  value: "20%",  colorClass: "sd-stat-value--orange" },
        ],
        days: [
          { label: "Mon 08", status: "Done",      statusClass: "sd-day-status--done",      done: true,  pills: [{ type: "completed", text: "3 study block completed" }] },
          { label: "Tue 09", status: "Done",      statusClass: "sd-day-status--done",      active: true, pills: [
              { type: "completed", text: "2 study block completed" },
              { type: "active",    text: "Active study block"       },
            ]},
          { label: "Thu 11", status: "Scheduled", statusClass: "sd-day-status--scheduled", done: false, pills: [{ type: "scheduled", text: "3 study block scheduled" }] },
          { label: "Fri 12", status: "Scheduled", statusClass: "sd-day-status--scheduled", done: false, pills: [{ type: "scheduled", text: "3 study block scheduled" }] },
        ],
      },
    },
  };

  const sdIconDone = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5L11 15.5L16.5 9" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const sdIconActive = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#007bff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#007bff"/></svg>`;
  const sdIconEmpty = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>`;
  const sdIconLock = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="3" stroke="#cbd5e1" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/></svg>`;
  const sdIconArrow = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

  const renderSdDayIcon = (day) => {
    if (day.done)   return sdIconDone;
    if (day.active) return sdIconActive;
    return sdIconEmpty;
  };

  const renderSdPills = (pills) =>
    pills.map(p => `<span class="sd-pill sd-pill--${p.type}">${p.text}</span>`).join("");

  const renderSdTimeline = (days, isLast) =>
    days.map((day, i) => {
      const isLastDay = i === days.length - 1;
      const connector = isLastDay ? "" : `<div class="sd-connector"></div>`;
      return `<div class="sd-day">
        <div class="sd-day-track">
          <div class="sd-day-icon">${renderSdDayIcon(day)}</div>
          ${connector}
        </div>
        <div class="sd-day-content">
          <div class="sd-day-header">
            <span class="sd-day-label">${day.label}</span>
            <span class="sd-day-status ${day.statusClass}">${day.status}</span>
          </div>
          <div class="sd-day-pills">${renderSdPills(day.pills)}</div>
        </div>
      </div>`;
    }).join("");

  const renderSdLockedSprints = (currentSprintId) => {
    const locked = data.sprints.filter(s => s.state === "locked");
    if (!locked.length) return "";
    return locked.map(s => `
      <div class="sd-locked-sprint">
        <div class="sd-locked-icon">${sdIconLock}</div>
        <span class="sd-locked-name">${s.name}</span>
        <span class="sd-locked-tag">Locked</span>
      </div>`).join("");
  };

  const openSprintDetailSheet = (sprintId = "sprint-1") => {
    if (!sdOverlay || !sdScroll || !sdFooter) return;

    const sprint = data.sprints.find(s => s.id === sprintId);
    if (!sprint || sprint.state === "locked") return;

    const tData = (sdTimelineData[sprintId] || {})[sprint.state]
      || (sdTimelineData[sprintId] || {})[Object.keys(sdTimelineData[sprintId] || {})[0]];
    if (!tData) return;

    const badgeClass  = sprint.state === "completed" ? "sd-badge--completed" : "sd-badge--ongoing";
    const badgeLabel  = sprint.state === "completed" ? "Completed" : "Ongoing";
    const statsHtml   = tData.stats.map((s, i) => {
      const divider = i < tData.stats.length - 1 ? `<div class="sd-stat-divider"></div>` : "";
      return `<div class="sd-stat">
        <span class="sd-stat-value ${s.colorClass}">${s.value}</span>
        <span class="sd-stat-label">${s.label}</span>
      </div>${divider}`;
    }).join("");

    sdScroll.innerHTML = `
      <div class="sd-header">
        <div class="sd-header-left">
          <span class="sd-badge ${badgeClass}">${badgeLabel}</span>
          <span class="sd-sprint-name">${sprint.name}</span>
        </div>
        <span class="sd-date-range">${tData.dateRange}</span>
      </div>
      <div class="sd-divider"></div>
      <div class="sd-progress-section">
        <div class="sd-progress-row">
          <span class="sd-progress-label">Overall Sprint Progress</span>
          <span class="sd-progress-pct">${tData.progress}% complete</span>
        </div>
        <div class="sd-progress-track">
          <div class="sd-progress-fill" style="width:${tData.progress}%"></div>
        </div>
      </div>
      <div class="sd-stats-row">${statsHtml}</div>
      <div class="sd-timeline">${renderSdTimeline(tData.days)}</div>
      ${renderSdLockedSprints(sprintId)}
    `;

    if (sprint.state === "completed") {
      const detail = data.sprintDetailSheets[sprintId] || data.sprintDetailSheets["sprint-1"];
      sdFooter.innerHTML = `
        <button type="button" class="sd-btn-primary" data-sd-sprint-review>
          Sprint review ${sdIconArrow}
        </button>
        <button type="button" class="sd-btn-secondary" data-sd-start-retro>
          Start Retrospective
        </button>`;
      sdFooter.querySelector("[data-sd-sprint-review]").addEventListener("click", () => {
        closeSdSheet();
        openAnalysis(sprint.name);
      });
      sdFooter.querySelector("[data-sd-start-retro]").addEventListener("click", () => {
        closeSdSheet();
        openRetrospective(sprintId);
      });
    } else {
      sdFooter.innerHTML = `<button type="button" class="sd-btn-primary" data-sd-continue>Continue</button>`;
      sdFooter.querySelector("[data-sd-continue]").addEventListener("click", () => {
        closeSdSheet();
      });
    }

    sdOverlay.setAttribute("aria-hidden", "false");
  };

  const closeSdSheet = () => {
    sdOverlay?.setAttribute("aria-hidden", "true");
  };

  sdOverlay?.querySelector("[data-close-sd]")?.addEventListener("click", closeSdSheet);

  const studyBlockDetails = {
    "2024-12-29": {
      dayTitle: "Day 29 (Dec 29)",
      duration: "45 mins",
      lessons: [
        { title: "Lesson 1: Project Management Fundamentals", duration: "30 mins", completed: true },
        { title: "Quick Quiz", duration: "15 mins", completed: true }
      ]
    },
    "2024-12-30": {
      dayTitle: "Day 30 (Dec 30)",
      duration: "1.5 hours",
      lessons: [
        { title: "Lesson 1: Defining Scope & Requirements", duration: "35 mins", completed: true },
        { title: "Lesson 2: Creating a WBS", duration: "35 mins", completed: false },
        { title: "Quiz: Scope Control", duration: "20 mins", completed: false }
      ]
    },
    "2024-12-31": {
      dayTitle: "Day 31 (Dec 31)",
      duration: "30 mins",
      lessons: [
        { title: "Lesson 1: Stakeholder Communication Plans", duration: "30 mins", completed: true }
      ]
    },
    "2025-01-27": {
      dayTitle: "Day 1 (Jan 27)",
      duration: "1 hour",
      lessons: [
        { title: "Lesson 1: Intro to Stakeholder Alignment", duration: "25 mins", completed: true },
        { title: "Lesson 2: Stakeholder Power Grid", duration: "15 mins", completed: true },
        { title: "Lesson 3: Stakeholder Matrix Analysis", duration: "5 mins", completed: true },
        { title: "Sprint Quiz", duration: "15 mins", completed: false }
      ]
    }
  };

  const openStudyBlockSheet = (dateKey) => {
    // Fallback to Jan 27 stakeholder block when clicked from generic hooks
    if (typeof dateKey !== "string") {
      dateKey = "2025-01-27";
    }

    const sheetOverlay = document.querySelector("[data-study-block-overlay]");
    const body = document.querySelector("[data-study-block-sheet-body]");
    if (!sheetOverlay || !body) return;

    const block = studyBlockDetails[dateKey];
    if (!block) return;

    const svgCheckCircle = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;">
        <circle cx="12" cy="12" r="10" fill="#22c55e"/>
        <path d="M8.5 12.5L11 15L16 9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const svgSpinner = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="progress-lesson-spinner" style="flex-shrink:0; transform: rotate(-90deg);">
        <circle cx="12" cy="12" r="9" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="12" cy="12" r="9" stroke="#007bff" stroke-width="2.5" stroke-dasharray="56.5" stroke-dashoffset="28"/>
      </svg>
    `;

    // Render lessons inside list card
    const lessonsHtml = block.lessons.map(l => {
      const isQuiz = l.title.toLowerCase().includes("quiz");
      const icon = isQuiz
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
             <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
             <line x1="12" y1="17" x2="12.01" y2="17"/>
           </svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
             <polygon points="5 3 19 12 5 21 5 3"/>
           </svg>`;

      const statusIndicator = l.completed ? svgCheckCircle : svgSpinner;

      return `
        <div class="progress-lesson-row">
          <div class="progress-lesson-row-main">
            ${icon}
            <span class="progress-lesson-title">${l.title}</span>
          </div>
          <div class="progress-lesson-row-meta">
            <span>${l.duration}</span>
            ${statusIndicator}
          </div>
        </div>
      `;
    }).join("");

    body.innerHTML = `
      <!-- Header row -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="progress-study-block-icon" style="flex-shrink:0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <strong style="font-size:18px; font-weight:600; color:#0f172a;">Study block :</strong>
          <span style="font-size:18px; font-weight:500; color:#94a3b8;">${block.dayTitle}</span>
        </div>
        <button type="button" class="progress-sprint-sheet-close" data-close-study-sheet-x aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Duration badge -->
      <div style="display:flex; align-items:center; gap:6px; border:1px solid #e2e8f0; border-radius:6px; padding:6px 12px; width:max-content; margin-bottom:20px; background:#ffffff;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <path d="M5 2h14M5 22h14M19 2v6.5a7 7 0 0 1-2.2 5.17l-4.8 4.66a1 1 0 0 0 0 1.34l4.8 4.66A7 7 0 0 1 19 22M5 2v6.5a7 7 0 0 0 2.2 5.17l4.8 4.66a1 1 0 0 1 0 1.34l-4.8 4.66A7 7 0 0 0 5 22"/>
        </svg>
        <span style="font-size:13px; font-weight:500; color:#334155;">${block.duration}</span>
      </div>

      <!-- Lessons Card -->
      <div class="progress-lesson-list-box">
        ${lessonsHtml}
      </div>

      <!-- Continue CTA -->
      <button type="button" class="progress-btn-primary" data-close-study-sheet-btn style="width:100%; height:48px; background:#007bff; color:#ffffff; font-size:16px; font-weight:600; border:none; border-radius:100px; cursor:pointer; margin-top:24px; transition:background 0.2s;" onmouseover="this.style.background='#0066ff'" onmouseout="this.style.background='#007bff'">Continue</button>
    `;

    // Bind close actions
    body.querySelector("[data-close-study-sheet-x]")?.addEventListener("click", () => {
      sheetOverlay.hidden = true;
    });
    body.querySelector("[data-close-study-sheet-btn]")?.addEventListener("click", () => {
      sheetOverlay.hidden = true;
    });

    sheetOverlay.hidden = false;
  };

  const renderDeepDiveCardHead = (icon, iconClass, title, sprintLabel) =>
    `<div class="progress-deep-card-head">
      <div class="progress-deep-card-title">
        <span class="progress-deep-icon-badge ${iconClass}"><img src="${P}/${icon}" width="17" height="17" alt="" /></span>
        <h3>${title}</h3>
      </div>
      <span class="progress-deep-sprint-tag">${sprintLabel}</span>
    </div>`;

  const renderDeepDiveHtml = (d) => {
    const vel = d.velocity;
    const legend = vel.segments
      .map(
        (s) =>
          `<div class="progress-deep-legend-row"><span class="progress-deep-legend-dot" style="background:${s.color}"></span><span class="progress-deep-legend-label">${s.label}</span><strong>${s.value}</strong></div>`,
      )
      .join("");
    const perfMetrics = d.performance.metrics
      .map(
        (m) => `<div class="progress-deep-perf-metric">
        <p>${m.label.replace("\n", "<br>")}</p>
        <div class="progress-ring-wrap progress-ring-wrap--deep"><div data-deep-metric-ring data-pct="${m.percent}"></div></div>
        <p class="progress-deep-perf-delta ${m.deltaTone}">${m.delta}<br>from last sprint</p>
      </div>`,
      )
      .join("");
    const strongItems = d.mastery.strong
      .map((t) => `<div class="progress-deep-concept-item is-strong"><img src="${P}/tick-02.svg" width="16" height="16" alt="" /><span>${t}</span></div>`)
      .join("");
    const weakItems = d.mastery.weak
      .map((t) => `<div class="progress-deep-concept-item is-weak"><img src="${P}/cancel-01-red.svg" width="16" height="16" alt="" /><span>${t}</span></div>`)
      .join("");
    const mistakes = d.mistakes
      .map(
        (m) => `<article class="progress-deep-mistake">
        <div class="progress-deep-mistake-head">
          <span class="progress-deep-pill progress-deep-pill--warn"><img src="${P}/sad-01.svg" width="14" height="14" alt="" />${m.times}</span>
          <p>${m.title}</p>
        </div>
        <button type="button" class="progress-deep-review-btn">Review Concept<img src="${P}/arrow-right-02-sharp.svg" width="16" height="16" alt="" /></button>
      </article>`,
      )
      .join("");
    const focusList = d.insights.focusItems.map((item) => `<li>${item}</li>`).join("");

    return `<div class="progress-deep-header-wrap">
      <header class="progress-deep-header">
        <div class="progress-deep-title-row">
          <span class="progress-deep-icon-badge progress-deep-icon-badge--blue"><img src="${P}/list-star.svg" width="16" height="16" alt="" /></span>
          <h2>Sprint review</h2>
        </div>
        <button type="button" class="progress-sprint-sheet-close" data-close-deep-dive aria-label="Close">
          <img src="${P}/cancel-01.svg" width="24" height="24" alt="" />
        </button>
      </header>
      <div class="progress-sprint-sheet-divider" aria-hidden="true"></div>
    </div>
    <div class="progress-deep-content">
      <section class="progress-deep-hero">
        <p class="progress-deep-hero-tag">${d.hero.tag}</p>
        <h3>${d.hero.title}</h3>
        <p class="progress-deep-hero-desc">${d.hero.description}</p>
      </section>
      <section class="progress-deep-card">
        ${renderDeepDiveCardHead("motion-02-white-pink.svg", "progress-deep-icon-badge--pink", "Sprint Velocity", d.sprintLabel)}
        <div class="progress-deep-velocity-row">
          <div class="progress-velocity-ring progress-velocity-ring--deep">
            <div data-deep-velocity-ring></div>
            <strong>${vel.score}</strong>
          </div>
          <div class="progress-deep-legend">${legend}</div>
        </div>
        <div class="progress-deep-velocity-delta">
          <span class="progress-deep-delta-badge"><img src="${P}/arrow-down-02-sharp.svg" width="16" height="16" alt="" />${vel.delta}</span>
          <p>${vel.deltaMessage}</p>
        </div>
      </section>
      <section class="progress-deep-card">
        ${renderDeepDiveCardHead("laptop-performance.svg", "progress-deep-icon-badge--orange", "Performance Breakdown", d.sprintLabel)}
        <div class="progress-deep-perf-row">${perfMetrics}</div>
      </section>
      <section class="progress-deep-card">
        ${renderDeepDiveCardHead("dial-square.svg", "progress-deep-icon-badge--blue-solid", "Mastery Distribution", d.sprintLabel)}
        <div class="progress-deep-mastery-block">
          <div class="progress-deep-mastery-head">
            <span class="progress-deep-pill progress-deep-pill--good"><img src="${P}/body-part-muscle.svg" width="14" height="14" alt="" />Strong</span>
            <p>STRONG CONCEPTS</p>
          </div>
          <div class="progress-deep-concept-list">${strongItems}</div>
        </div>
        <div class="progress-deep-mastery-block">
          <div class="progress-deep-mastery-head">
            <span class="progress-deep-pill progress-deep-pill--warn"><img src="${P}/sad-01.svg" width="14" height="14" alt="" />Need focus</span>
            <p>WEAK CONCEPTS</p>
          </div>
          <div class="progress-deep-concept-list">${weakItems}</div>
        </div>
      </section>
      <section class="progress-deep-card">
        ${renderDeepDiveCardHead("multiplication-sign-circle.svg", "progress-deep-icon-badge--red", "Top 3 Mistake Patterns", d.sprintLabel)}
        <div class="progress-deep-mistakes">${mistakes}</div>
      </section>
      <section class="progress-deep-card">
        ${renderDeepDiveCardHead("bulb-charging.svg", "progress-deep-icon-badge--orange", "System Insights", d.sprintLabel)}
        <div class="progress-deep-insights-box">
          <p>${d.insights.body}</p>
          <strong>${d.insights.focusHeading}</strong>
          <ul>${focusList}</ul>
        </div>
      </section>
    </div>`;
  };

  const mountDeepDiveCharts = (root, d) => {
    const velRing = root.querySelector("[data-deep-velocity-ring]");
    if (velRing) charts.mountVelocityRing(velRing, d.velocity.ringSegments);
    root.querySelectorAll("[data-deep-metric-ring]").forEach((el) => {
      const pct = Number(el.dataset.pct) || 0;
      charts.mountSingleRing(el, pct, { size: 75, stroke: 8 });
      let label = el.querySelector(".progress-ring-pct");
      if (!label) {
        label = document.createElement("strong");
        label.className = "progress-ring-pct";
        el.appendChild(label);
      }
      label.textContent = `${pct}%`;
    });
  };

  const openAnalysis = (sprintLabel) => {
    const body = document.querySelector("[data-deep-dive-body]");
    if (!body || !analysisOverlay) return;
    const d = {
      ...data.deepDiveSheet,
      sprintLabel: sprintLabel || data.deepDiveSheet.sprintLabel,
    };
    body.className = "progress-sheet-body progress-deep-sheet-body";
    body.innerHTML = renderDeepDiveHtml(d);
    mountDeepDiveCharts(body, d);
    body.querySelectorAll("[data-close-deep-dive]").forEach((btn) => {
      btn.addEventListener("click", () => {
        analysisOverlay.hidden = true;
      });
    });
    analysisOverlay.hidden = false;
  };

  const renderRetroSteps = () => {
    if (!retroSteps) return;
    retroSteps.innerHTML = Array.from({ length: RETRO_STEP_COUNT }, (_, i) => {
      const active = i === retroStep ? " is-active" : "";
      return `<span class="progress-retro-step-dot${active}"></span>`;
    }).join("");
  };

  const renderRetroHero = () => {
    const hero = data.retrospectiveFlow.hero;
    if (!retroHero) return;
    retroHero.innerHTML = `<p class="progress-deep-hero-tag">${hero.tag}</p>
      <h3>${hero.title}</h3>
      <p class="progress-deep-hero-desc">${hero.description}</p>`;
  };

  const renderRetroStepStudyExecution = () => {
    const flow = data.retrospectiveFlow;
    return `<article class="progress-retro-card">
      <div class="progress-retro-card-head">
        <span class="progress-retro-icon-badge progress-retro-icon-badge--pink"><img src="${P}/calendar-04.svg" alt="" /></span>
        <h3>Study Execution Data</h3>
      </div>
      <div class="progress-retro-study-bars progress-study-bars" data-retro-study-bars></div>
      <div class="progress-retro-warning">
        <img src="${P}/warning-icon.svg" alt="" />
        <p>${flow.studyExecution.warning}</p>
      </div>
    </article>`;
  };

  const renderRetroStepSpacing = () => {
    const spacing = data.retrospectiveFlow.spacing;
    const days = spacing.days
      .map((d) => {
        const icon = d.done ? `${P}/checkmark-circle-green.svg` : `${P}/multiplication-sign-circle.svg`;
        return `<div class="progress-retro-spacing-day">
          <img src="${icon}" alt="" />
          <strong>${d.label}</strong>
          <span>${d.cards}</span>
        </div>`;
      })
      .join("");
    return `<article class="progress-retro-card">
      <div class="progress-retro-card-head">
        <span class="progress-retro-icon-badge progress-retro-icon-badge--red"><img src="${P}/dashed-line-01.svg" alt="" /></span>
        <h3>Spacing Discipline</h3>
      </div>
      <div class="progress-retro-spacing-grid">${days}</div>
      <div class="progress-retro-summary-box">
        <p>Flashcards Reviewed: ${spacing.flashcardsReviewed}</p>
        <span class="progress-retro-optimal-badge">${spacing.optimal}</span>
        <div class="progress-retro-warning" style="margin-top:24px">
          <img src="${P}/warning-icon.svg" alt="" />
          <p>${spacing.warning}</p>
        </div>
      </div>
    </article>`;
  };

  const renderRetroStepQuiz = () => {
    const quiz = data.retrospectiveFlow.quizBehaviour;
    const items = quiz.items
      .map(
        (item) => `<div class="progress-retro-quiz-item">
          <p>${item.text}</p>
          <span class="progress-retro-optimal-badge">${item.optimal}</span>
        </div>`,
      )
      .join("");
    return `<article class="progress-retro-card">
      <div class="progress-retro-card-head">
        <span class="progress-retro-icon-badge progress-retro-icon-badge--blue"><img src="${P}/message-question.svg" alt="" /></span>
        <h3>Quiz Behaviour</h3>
      </div>
      <div class="progress-retro-quiz-list">${items}</div>
      <div class="progress-retro-warning">
        <img src="${P}/warning-icon.svg" alt="" />
        <p>${quiz.warning}</p>
      </div>
    </article>`;
  };

  const renderRetroStepInsights = () => {
    const insights = data.retrospectiveFlow.systemInsights;
    const actions = insights.actions
      .map((action) => {
        if (typeof action === "string") {
          return `<li>${action}</li>`;
        }
        const sub = action.sub.map((line) => `<li class="progress-retro-insights-sub">${line}</li>`).join("");
        return `<li>${action.text}</li>${sub}`;
      })
      .join("");
    return `<article class="progress-retro-card">
      <div class="progress-retro-card-head">
        <span class="progress-retro-icon-badge progress-retro-icon-badge--orange"><img src="${P}/bulb-charging.svg" alt="" /></span>
        <h3>System Insights</h3>
      </div>
      <div class="progress-retro-insights-box">
        <p>${insights.intro}</p>
        <p><strong>${insights.heading}</strong></p>
        <ul>${actions}</ul>
      </div>
    </article>`;
  };

  const renderRetroStepRating = () => {
    const rating = data.retrospectiveFlow.executionRating;
    const metrics = rating.metrics
      .map((m) => {
        const icon =
          m.tone === "good" ? `${P}/checkmark-circle-green.svg` : `${P}/warning-icon.svg`;
        return `<div class="progress-retro-metric-row">
          <div class="progress-retro-metric-label">
            <img src="${icon}" alt="" />
            <span>${m.label}</span>
            <img src="${P}/info-circle.svg" alt="" />
          </div>
          <strong>${m.value}</strong>
        </div>`;
      })
      .join("");
    return `<article class="progress-retro-card">
      <div class="progress-retro-card-head">
        <span class="progress-retro-icon-badge progress-retro-icon-badge--red"><img src="${P}/legal-02.svg" alt="" /></span>
        <h3>Execution Rating</h3>
      </div>
      <div class="progress-retro-rating-row">
        <div class="progress-retro-rating-ring"><div data-retro-rating-ring></div><strong>${rating.percent}%</strong></div>
        <div class="progress-retro-rating-copy">
          <p>Last Sprint Execution Rating</p>
          <span class="progress-retro-rating-delta"><img src="${P}/arrow-down-double-sharp.svg" alt="" />${rating.delta}</span>
        </div>
      </div>
      <div class="progress-retro-metrics">${metrics}</div>
    </article>`;
  };

  const renderRetroStepReflection = () => {
    const reflection = data.retrospectiveFlow.reflection;
    const options = reflection.slowOptions
      .map((option) => {
        const selected = retroForm.slow === option ? " is-selected" : "";
        return `<button type="button" class="progress-retro-radio${selected}" data-retro-slow="${option}">
          <span class="progress-retro-radio-dot" aria-hidden="true"></span>
          <span>${option}</span>
        </button>`;
      })
      .join("");
    const otherVisible = retroForm.slow === "Other" ? "" : ' style="display:none"';
    return `<article class="progress-retro-form-card">
      <div class="progress-retro-form-head">
        <span class="progress-retro-icon-badge progress-retro-icon-badge--orange"><img src="${P}/bulb-charging.svg" alt="" /></span>
        <h3>Reflection form</h3>
      </div>
      <div class="progress-retro-form-body">
        <div class="progress-retro-form-inner">
          <div class="progress-retro-form-summary"><p>${reflection.summary}</p></div>
          <div class="progress-retro-form-group">
            <label>1. What slowed you down?</label>
            <div class="progress-retro-radio-list">${options}</div>
            <input type="text" class="progress-retro-other-input" data-retro-other placeholder="${reflection.otherPlaceholder}" value="${retroForm.other}"${otherVisible} />
          </div>
          <div class="progress-retro-form-group">
            <label>2. What worked well this sprint?</label>
            <textarea class="progress-retro-textarea" data-retro-worked placeholder="${reflection.workedPlaceholder}">${retroForm.worked}</textarea>
          </div>
          <div class="progress-retro-form-group">
            <label>3. What will you change next sprint?</label>
            <textarea class="progress-retro-textarea" data-retro-change placeholder="${reflection.changePlaceholder}">${retroForm.change}</textarea>
          </div>
        </div>
      </div>
    </article>`;
  };

  const renderRetroStepContent = () => {
    switch (retroStep) {
      case 0:
        return renderRetroStepStudyExecution();
      case 1:
        return renderRetroStepSpacing();
      case 2:
        return renderRetroStepQuiz();
      case 3:
        return renderRetroStepInsights();
      case 4:
        return renderRetroStepRating();
      case 5:
        return renderRetroStepReflection();
      default:
        return "";
    }
  };

  const renderRetroFooter = () => {
    if (!retroFooter) return;
    if (retroStep === 0) {
      retroFooter.className = "progress-retro-footer";
      retroFooter.innerHTML = `<button type="button" class="progress-retro-btn progress-retro-btn--next progress-retro-btn--full" data-retro-next>
        Next <img src="${P}/arrow-right-02-sharp-white.svg" alt="" />
      </button>`;
      return;
    }
    if (retroStep === RETRO_STEP_COUNT - 1) {
      retroFooter.className = "progress-retro-footer";
      retroFooter.innerHTML = `<button type="button" class="progress-retro-btn progress-retro-btn--finish" data-retro-finish>
        <img src="${P}/checkmark-circle-white.svg" alt="" /> Finish Retrospective
      </button>`;
      return;
    }
    retroFooter.className = "progress-retro-footer progress-retro-footer--split";
    retroFooter.innerHTML = `<button type="button" class="progress-retro-btn progress-retro-btn--prev" data-retro-prev>
      <img src="assets/icons/arrow-left-02.svg" alt="" /> Prev
    </button>
    <button type="button" class="progress-retro-btn progress-retro-btn--next" data-retro-next>
      Next <img src="${P}/arrow-right-02-sharp-white.svg" alt="" />
    </button>`;
  };

  const mountRetroStepCharts = () => {
    if (!retroStepContent) return;
    if (retroStep === 0) {
      const bars = retroStepContent.querySelector("[data-retro-study-bars]");
      if (bars) charts.mountStudyBars(bars, data.studyExecution.days);
    }
    if (retroStep === 4) {
      const ring = retroStepContent.querySelector("[data-retro-rating-ring]");
      if (ring) charts.mountSingleRing(ring, data.retrospectiveFlow.executionRating.percent, { size: 90, stroke: 8 });
    }
  };

  const bindRetroStepEvents = () => {
    retroStepContent?.querySelectorAll("[data-retro-slow]").forEach((btn) => {
      btn.addEventListener("click", () => {
        retroForm.slow = btn.dataset.retroSlow || "Other";
        renderRetrospective();
      });
    });
    retroStepContent?.querySelector("[data-retro-other]")?.addEventListener("input", (e) => {
      retroForm.other = e.target.value;
    });
    retroStepContent?.querySelector("[data-retro-worked]")?.addEventListener("input", (e) => {
      retroForm.worked = e.target.value;
    });
    retroStepContent?.querySelector("[data-retro-change]")?.addEventListener("input", (e) => {
      retroForm.change = e.target.value;
    });
  };

  const renderRetrospective = () => {
    renderRetroHero();
    renderRetroSteps();
    if (retroStepContent) retroStepContent.innerHTML = renderRetroStepContent();
    renderRetroFooter();
    mountRetroStepCharts();
    bindRetroStepEvents();
  };

  const openRetrospective = (sprintId = "sprint-1") => {
    if (!retrospectiveOverlay) return;
    retroSprintId = sprintId;
    retroStep = 0;
    retroForm = {
      slow: data.retrospectiveFlow.reflection.defaultSlow,
      other: "",
      worked: "",
      change: "",
    };
    if (analysisOverlay) analysisOverlay.hidden = true;
    if (sprintSheet) sprintSheet.hidden = true;
    renderRetrospective();
    retrospectiveOverlay.hidden = false;
  };

  const closeRetrospective = () => {
    if (retrospectiveOverlay) retrospectiveOverlay.hidden = true;
  };

  const finishRetrospective = () => {
    closeRetrospective();
    window.location.href = new URL("app/dashboard.html", document.baseURI).href;
  };

  document.querySelector("[data-open-sprint-detail]")?.addEventListener("click", openSprintSheet);
  document.querySelector("[data-open-study-block]")?.addEventListener("click", openStudyBlockSheet);
  document.querySelectorAll("[data-close-overlay]").forEach((el) => {
    el.addEventListener("click", () => {
      sprintSheet.hidden = true;
      studyBlockSheet.hidden = true;
    });
  });
  document.querySelectorAll("[data-close-deep-dive]").forEach((el) => {
    el.addEventListener("click", () => {
      analysisOverlay.hidden = true;
    });
  });

  document.querySelector("[data-open-retrospective]")?.addEventListener("click", () => {
    analysisOverlay.hidden = true;
    openRetrospective("sprint-1");
  });

  sprintList?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-retrospective-open]");
    if (btn) openRetrospective(btn.dataset.retrospectiveOpen || "sprint-1");
  });

  document.querySelector("[data-retro-back]")?.addEventListener("click", () => {
    if (retroStep <= 0) closeRetrospective();
    else {
      retroStep -= 1;
      renderRetrospective();
    }
  });

  retroFooter?.addEventListener("click", (e) => {
    if (e.target.closest("[data-retro-next]")) {
      retroStep = Math.min(retroStep + 1, RETRO_STEP_COUNT - 1);
      renderRetrospective();
    }
    if (e.target.closest("[data-retro-prev]")) {
      retroStep = Math.max(retroStep - 1, 0);
      renderRetrospective();
    }
    if (e.target.closest("[data-retro-finish]")) finishRetrospective();
  });

  // ─── Dynamic Progress Calendar ────────────────────────────────────

  let calYear = 2025;
  let calMonth = 0; // January (0-indexed)

  const monthTrigger = document.querySelector("[data-month-dropdown-trigger]");
  const monthMenu = document.querySelector("[data-month-dropdown-menu]");
  const monthLabel = document.querySelector("[data-selected-month-label]");

  const yearTrigger = document.querySelector("[data-year-dropdown-trigger]");
  const yearMenu = document.querySelector("[data-year-dropdown-menu]");
  const yearLabel = document.querySelector("[data-selected-year-label]");

  const monthHeading = document.querySelector("[data-calendar-month-heading]");
  const calendarGrid = document.querySelector("[data-calendar-grid-cells]");

  // Static mock events data organized by YYYY-MM-DD
  const mockCalendarEvents = {
    "2024-12-29": [
      { type: "completed", title: "Study..." }
    ],
    "2024-12-30": [
      { type: "in-progress", title: "Study..." },
      { type: "more", count: 2 }
    ],
    "2024-12-31": [
      { type: "completed", title: "Study..." }
    ],
    "2025-01-27": [
      { type: "exam", title: "Mock-Exam" }
    ]
  };



  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y, m) => {
    // 0 for Sunday, 1 for Monday, etc. matching S M T W T F S weekdays
    return new Date(y, m, 1).getDay();
  };

  // SVGs for the event pills
  const svgCheckCircle = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="calendar-event-pill-icon">
      <circle cx="12" cy="12" r="10" fill="#22c55e"/>
      <path d="M8.5 12.5L11 15L16 9" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const svgBookOpen = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="calendar-event-pill-icon">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const svgPenEdit = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="calendar-event-pill-icon">
      <path d="M12 20h9" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;



  const renderCalendar = () => {
    if (!calendarGrid || !monthHeading) return;

    // Update Month Heading (e.g. "Jan, 2025")
    const dateObj = new Date(calYear, calMonth, 1);
    const shortMonth = dateObj.toLocaleString("en", { month: "short" });
    monthHeading.textContent = `${shortMonth}, ${calYear}`;

    // Update Dropdown Labels
    if (monthLabel) {
      monthLabel.textContent = dateObj.toLocaleString("en", { month: "long" });
    }
    if (yearLabel) {
      yearLabel.textContent = String(calYear);
    }

    calendarGrid.innerHTML = "";

    const daysInMonth = getDaysInMonth(calYear, calMonth);
    const firstDayIndex = getFirstDayIndex(calYear, calMonth);

    // Days from Previous Month (offset days)
    const prevMonthDate = new Date(calYear, calMonth - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();
    const prevMonthDaysCount = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDaysCount - i;
      const cell = document.createElement("div");
      cell.className = "calendar-table-cell outside";
      
      const formattedDate = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      
      // Make clickable if has events
      if (mockCalendarEvents[formattedDate]) {
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
          openStudyBlockSheet(formattedDate);
        });
      }

      let pillsHtml = "";
      const events = mockCalendarEvents[formattedDate];
      if (events) {
        pillsHtml = `<div class="calendar-pill-container">` + events.map(ev => {
          if (ev.type === "completed") {
            return `<div class="calendar-event-pill">
              ${svgCheckCircle}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "in-progress") {
            return `<div class="calendar-event-pill">
              ${svgBookOpen}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "exam") {
            return `<div class="calendar-event-pill">
              ${svgPenEdit}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "more") {
            return `<div class="calendar-event-pill more-pill">
              <span>+${ev.count}</span>
            </div>`;
          }
          return "";
        }).join("") + `</div>`;
      }

      cell.innerHTML = `
        <span class="calendar-table-day-num">${dayNum}</span>
        ${pillsHtml}
      `;
      calendarGrid.appendChild(cell);
    }

    // Days from Current Month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-table-cell";

      const formattedDate = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      // Make clickable if has events
      if (mockCalendarEvents[formattedDate]) {
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
          openStudyBlockSheet(formattedDate);
        });
      }

      if (calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate()) {
        cell.classList.add("today");
      }

      let pillsHtml = "";
      const events = mockCalendarEvents[formattedDate];
      if (events) {
        pillsHtml = `<div class="calendar-pill-container">` + events.map(ev => {
          if (ev.type === "completed") {
            return `<div class="calendar-event-pill">
              ${svgCheckCircle}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "in-progress") {
            return `<div class="calendar-event-pill">
              ${svgBookOpen}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "exam") {
            return `<div class="calendar-event-pill">
              ${svgPenEdit}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "more") {
            return `<div class="calendar-event-pill more-pill">
              <span>+${ev.count}</span>
            </div>`;
          }
          return "";
        }).join("") + `</div>`;
      }

      cell.innerHTML = `
        <span class="calendar-table-day-num">${day}</span>
        ${pillsHtml}
      `;
      calendarGrid.appendChild(cell);
    }

    // Days from Next Month to complete grid row (7 columns)
    const nextMonthDate = new Date(calYear, calMonth + 1, 1);
    const nextYear = nextMonthDate.getFullYear();
    const nextMonth = nextMonthDate.getMonth();

    const totalCells = firstDayIndex + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      const cell = document.createElement("div");
      cell.className = "calendar-table-cell outside";

      const formattedDate = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      // Make clickable if has events
      if (mockCalendarEvents[formattedDate]) {
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
          openStudyBlockSheet(formattedDate);
        });
      }

      let pillsHtml = "";
      const events = mockCalendarEvents[formattedDate];
      if (events) {
        pillsHtml = `<div class="calendar-pill-container">` + events.map(ev => {
          if (ev.type === "completed") {
            return `<div class="calendar-event-pill">
              ${svgCheckCircle}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "in-progress") {
            return `<div class="calendar-event-pill">
              ${svgBookOpen}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "exam") {
            return `<div class="calendar-event-pill">
              ${svgPenEdit}
              <span>${ev.title}</span>
            </div>`;
          } else if (ev.type === "more") {
            return `<div class="calendar-event-pill more-pill">
              <span>+${ev.count}</span>
            </div>`;
          }
          return "";
        }).join("") + `</div>`;
      }

      cell.innerHTML = `
        <span class="calendar-table-day-num">${i}</span>
        ${pillsHtml}
      `;
      calendarGrid.appendChild(cell);
    }
  };

  // Dropdown interactivity
  if (monthTrigger && monthMenu) {
    monthTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      monthMenu.hidden = !monthMenu.hidden;
      if (yearMenu) yearMenu.hidden = true;
    });
  }

  if (yearTrigger && yearMenu) {
    yearTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      yearMenu.hidden = !yearMenu.hidden;
      if (monthMenu) monthMenu.hidden = true;
    });
  }

  monthMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-month-val]");
    if (btn) {
      calMonth = parseInt(btn.dataset.monthVal, 10);
      monthMenu.hidden = true;
      renderCalendar();
    }
  });

  yearMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-year-val]");
    if (btn) {
      calYear = parseInt(btn.dataset.yearVal, 10);
      yearMenu.hidden = true;
      renderCalendar();
    }
  });

  document.addEventListener("click", () => {
    if (monthMenu) monthMenu.hidden = true;
    if (yearMenu) yearMenu.hidden = true;
  });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-locked-trigger]");
    if (trigger) {
      const sprintNum = trigger.dataset.lockedTrigger;
      alert(`Sprint ${sprintNum} is locked. You can unlock it by completing all required study blocks and mock exams in Sprint ${sprintNum - 1}!`);
    }
  });

  renderCalendar();

  renderTabs();
  renderOverview();
  renderSprints();
  setTab(activeTab);

  const viewParam = new URLSearchParams(location.search).get("view");
  if (viewParam === "analysis") openAnalysis();
  if (viewParam === "sprint-sheet") openSprintSheet();
})();
