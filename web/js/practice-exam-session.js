(function () {
  const data = window.PRACTICE_EXAM;
  if (!data) return;

  const ICON = "assets/practice-exam/icons/";
  const REVIEW_ICON = "assets/practice-exam/icons/review/";
  const params = new URLSearchParams(window.location.search);
  const tierId = params.get("tier") || "beginner";
  const totalSlots = data.totalQuestions;
  const questions = data.questions;
  const qCount = questions.length;

  const state = {
    index: 0,
    answers: {},
    flagged: new Set(),
    examSecondsLeft: data.examDurationSec,
    breakSecondsLeft: data.breakDurationSec,
    breaksUsed: 0,
    onBreak: false,
    ended: false,
    passed: false,
    reviewFilter: "all",
    reviewDomain: "all",
    reviewExpanded: new Set(),
  };

  const examView = document.getElementById("peExamView");
  const resultsView = document.getElementById("peResultsView");
  const reviewView = document.getElementById("peReviewView");

  const examTimerEl = document.getElementById("peExamTimer");
  const breakTimerEl = document.getElementById("peBreakTimer");
  const breakExamLeftEl = document.getElementById("peBreakExamLeft");
  const breaksLeftEl = document.getElementById("peBreaksLeft");
  const progressPctEl = document.getElementById("peProgressPct");
  const answeredStatEl = document.getElementById("peAnsweredStat");
  const flaggedStatEl = document.getElementById("peFlaggedStat");
  const dotsGrid = document.getElementById("peDotsGrid");
  const domainLegend = document.getElementById("peDomainLegend");
  const qDomainPill = document.getElementById("peQDomainPill");
  const qNum = document.getElementById("peQNum");
  const qText = document.getElementById("peQText");
  const exhibitLabel = document.getElementById("peExhibitLabel");
  const exhibitImg = document.getElementById("peExhibitImg");
  const answersEl = document.getElementById("peAnswers");
  const flagBtn = document.getElementById("peFlagBtn");
  const flagIcon = document.getElementById("peFlagIcon");
  const navGrid = document.getElementById("peNavGrid");
  const navOverlay = document.getElementById("peNavOverlay");
  const breakOverlay = document.getElementById("peBreakOverlay");
  const endOverlay = document.getElementById("peEndOverlay");

  let tickInterval = null;

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatHMS(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return pad2(h) + ":" + pad2(m) + ":" + pad2(s);
  }

  function formatMS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return pad2(m) + ":" + pad2(s);
  }

  function answeredCount() {
    return Object.keys(state.answers).length;
  }

  function currentQ() {
    return questions[state.index];
  }

  function slotForIndex(i) {
    return i;
  }

  function updateTimers() {
    examTimerEl.textContent = formatHMS(state.examSecondsLeft);
    breakExamLeftEl.textContent = formatHMS(state.examSecondsLeft);
    if (state.onBreak) {
      breakTimerEl.textContent = formatMS(state.breakSecondsLeft);
    }
    const left = data.maxBreaks - state.breaksUsed;
    breaksLeftEl.textContent =
      "Available breaks remaining: " + left + " of " + data.maxBreaks;
  }

  function updateStats() {
    const answered = answeredCount();
    const pct = Math.round((answered / totalSlots) * 100) || 0;
    progressPctEl.textContent = pct + "%";
    answeredStatEl.textContent = answered + "/" + totalSlots;
    flaggedStatEl.textContent = String(state.flagged.size);
  }

  const DOMAIN_GLYPH = {
    people: "pe-glyph--domain-people-16",
    process: "pe-glyph--domain-process-16",
    business: "pe-glyph--domain-business-16",
  };

  const RESULT_DOMAIN_GLYPH = {
    people: "pe-glyph--domain-people-24",
    process: "pe-glyph--domain-process-24",
    business: "pe-glyph--domain-business-24",
  };

  function renderDomainLegend() {
    domainLegend.innerHTML = data.domains
      .map(function (d) {
        return (
          '<div class="pe-domain-chip">' +
          '<span class="pe-domain-icon-slot"><img class="pe-glyph ' +
          (DOMAIN_GLYPH[d.id] || "pe-glyph--domain-people-16") +
          '" src="' +
          d.icon +
          '" alt="" /></span>' +
          '<span class="lbl">' +
          d.label +
          ":</span> " +
          '<span style="color:' +
          d.color +
          '">' +
          d.pct +
          "%</span></div>"
        );
      })
      .join("");
  }

  function renderDots() {
    const show = Math.min(16, totalSlots);
    let html = "";
    for (let i = 0; i < show; i++) {
      if (i < state.index) {
        html +=
          '<span class="pe-dot pe-dot--done"><img class="pe-glyph pe-glyph--tick-10" src="' +
          ICON +
          'tick-10.svg" alt="" /></span>';
      } else if (i === state.index) {
        html += '<span class="pe-dot pe-dot--current"></span>';
      } else {
        html += '<span class="pe-dot pe-dot--empty"></span>';
      }
    }
    dotsGrid.innerHTML = html;
  }

  function renderNavGrid() {
    let html = "";
    for (let i = 0; i < totalSlots; i++) {
      const label = i + 1 < 10 ? "0" + (i + 1) : String(i + 1);
      let cls = "pe-nav-cell";
      const qIdx = i < qCount ? i : -1;
      if (qIdx === state.index) cls += " current";
      else if (qIdx >= 0 && state.flagged.has(questions[qIdx].id)) cls += " flagged";
      else if (qIdx >= 0 && state.answers[questions[qIdx].id] !== undefined) cls += " answered";
      const disabled = i >= qCount;
      html +=
        '<button type="button" class="' +
        cls +
        '" data-nav="' +
        i +
        '"' +
        (disabled ? " disabled" : "") +
        ">" +
        label +
        "</button>";
    }
    navGrid.innerHTML = html;

    navGrid.querySelectorAll("[data-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const idx = parseInt(btn.getAttribute("data-nav"), 10);
        if (idx < qCount) {
          state.index = idx;
          closeNav();
          renderQuestion();
        }
      });
    });
  }

  function renderQuestion() {
    const q = currentQ();
    if (!q) return;

    qDomainPill.textContent = q.domainLabel;
    qNum.textContent = "Question " + pad2(state.index + 1);
    qText.textContent = q.text;

    if (q.image) {
      exhibitLabel.classList.remove("pe-screen-hidden");
      exhibitImg.classList.remove("pe-screen-hidden");
      exhibitImg.src = q.image;
    } else {
      exhibitLabel.classList.add("pe-screen-hidden");
      exhibitImg.classList.add("pe-screen-hidden");
    }

    const isFlagged = state.flagged.has(q.id);
    flagBtn.classList.toggle("flagged", isFlagged);
    flagIcon.src = isFlagged ? ICON + "flag-16-active.svg" : ICON + "flag-16.svg";
    flagIcon.className =
      "pe-glyph " + (isFlagged ? "pe-glyph--flag-16-active" : "pe-glyph--flag-16");

    answersEl.innerHTML = q.options
      .map(function (opt, i) {
        const letter = String.fromCharCode(65 + i);
        const selected = state.answers[q.id] === i;
        return (
          '<button type="button" class="pe-answer' +
          (selected ? " selected" : "") +
          '" data-opt="' +
          i +
          '" role="radio" aria-checked="' +
          selected +
          '">' +
          '<span class="pe-answer-radio"></span>' +
          '<span class="pe-answer-letter">' +
          letter +
          ".</span>" +
          '<span class="pe-answer-text">' +
          opt +
          "</span></button>"
        );
      })
      .join("");

    answersEl.querySelectorAll("[data-opt]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.answers[q.id] = parseInt(btn.getAttribute("data-opt"), 10);
        renderQuestion();
        updateStats();
        renderDots();
        renderNavGrid();
      });
    });

    const prevBtn = document.getElementById("pePrevBtn");
    prevBtn.classList.toggle("is-muted", state.index === 0);
    const nextBtn = document.getElementById("peNextBtn");
    if (state.index >= qCount - 1) {
      nextBtn.textContent = "Finish";
    } else {
      nextBtn.textContent = "Next Question";
    }

    renderDots();
    updateStats();
    renderNavGrid();
  }

  function openNav() {
    renderNavGrid();
    navOverlay.classList.add("open");
    navOverlay.setAttribute("aria-hidden", "false");
  }

  function closeNav() {
    navOverlay.classList.remove("open");
    navOverlay.setAttribute("aria-hidden", "true");
  }

  function openBreak() {
    if (state.breaksUsed >= data.maxBreaks) return;
    state.onBreak = true;
    state.breakSecondsLeft = data.breakDurationSec;
    state.breaksUsed += 1;
    breakOverlay.classList.add("open");
    breakOverlay.setAttribute("aria-hidden", "false");
    updateTimers();
  }

  function closeBreak() {
    state.onBreak = false;
    breakOverlay.classList.remove("open");
    breakOverlay.setAttribute("aria-hidden", "true");
  }

  function scoreExam() {
    let correct = 0;
    let total = 0;
    questions.forEach(function (q) {
      if (state.answers[q.id] !== undefined) {
        total += 1;
        if (state.answers[q.id] === q.correct) correct += 1;
      }
    });
    const pct = total ? Math.round((correct / total) * 1000) / 10 : 0;
    return { correct, total, pct };
  }

  function minutesElapsed() {
    const used = data.examDurationSec - state.examSecondsLeft;
    return Math.max(1, Math.round(used / 60));
  }

  function domainStats() {
    const blueprint = data.domainBlueprint || {};
    const tallies = {};

    data.resultDomains.forEach(function (d) {
      tallies[d.id] = { correct: 0, answered: 0, bank: 0 };
    });

    questions.forEach(function (q) {
      if (!tallies[q.domain]) return;
      tallies[q.domain].bank += 1;
      if (state.answers[q.id] !== undefined) {
        tallies[q.domain].answered += 1;
        if (state.answers[q.id] === q.correct) tallies[q.domain].correct += 1;
      }
    });

    return data.resultDomains.map(function (d) {
      const slots = blueprint[d.id] ? blueprint[d.id].slotCount : tallies[d.id].bank;
      const t = tallies[d.id];
      const pct = t.bank ? Math.round((t.correct / t.bank) * 1000) / 10 : 0;
      const scaledCorrect = t.bank
        ? Math.max(0, Math.round((t.correct / t.bank) * slots))
        : 0;
      return {
        domain: d,
        slots: slots,
        correct: scaledCorrect,
        pct: pct,
      };
    });
  }

  function domainPerfStatus(pct, passed) {
    if (passed) {
      if (pct >= 85) return { label: "Mastery", color: "#16a34a" };
      if (pct >= 70) return { label: "Target", color: "#16a34a" };
      return { label: "Improving", color: "#974ffc" };
    }
    if (pct >= 70) return { label: "Improving", color: "#974ffc" };
    if (pct >= 40) return { label: "Fail", color: "#ff6b35" };
    return { label: "Fail", color: "#f43f5e" };
  }

  function renderDomainPerformance(passed) {
    const el = document.getElementById("peDomainPerformance");
    el.innerHTML = domainStats()
      .map(function (row) {
        const st = domainPerfStatus(row.pct, passed);
        return (
          '<article class="pe-domain-perf" style="--perf-border:' +
          row.domain.borderColor +
          '">' +
          '<div class="pe-domain-perf-card">' +
          '<div class="pe-domain-perf-left">' +
          '<div class="pe-domain-perf-icon" style="background:' +
          row.domain.iconBg +
          '">' +
          '<img class="pe-glyph ' +
          (RESULT_DOMAIN_GLYPH[row.domain.id] || "pe-glyph--domain-people-24") +
          '" src="' +
          row.domain.icon +
          '" alt="" />' +
          "</div>" +
          "<div>" +
          '<p class="pe-domain-perf-name">' +
          row.domain.name +
          "</p>" +
          '<p class="pe-domain-perf-sub">' +
          row.correct +
          " of " +
          row.slots +
          " correct</p>" +
          "</div></div>" +
          '<div class="pe-domain-perf-score" style="color:' +
          st.color +
          '">' +
          '<p class="pe-domain-perf-pct">' +
          row.pct +
          "%</p>" +
          '<p class="pe-domain-perf-status">' +
          st.label +
          "</p></div></div></article>"
        );
      })
      .join("");
  }

  function showResults() {
    state.ended = true;
    const { correct, total, pct } = scoreExam();
    const passed = pct >= data.passThreshold;
    state.passed = passed;

    examView.classList.add("pe-screen-hidden");
    resultsView.classList.remove("pe-screen-hidden");
    reviewView.classList.add("pe-screen-hidden");

    resultsView.classList.toggle("pe-results-session--pass", passed);
    resultsView.classList.toggle("pe-results-session--fail", !passed);

    document.getElementById("peResultsResultLabel").textContent = passed
      ? "Result: Successful"
      : "Result: Unsuccessful";

    const titleEl = document.getElementById("peResultsTitle");
    const descEl = document.getElementById("peResultsDesc");
    if (passed) {
      titleEl.innerHTML = 'Mock Exam <span class="pe-pass-word">Passed</span>';
      descEl.innerHTML =
        "Strategic alignment verified. You exceeded the <strong>" +
        data.passThreshold +
        "%</strong> passing threshold for this tier.";
    } else {
      titleEl.textContent = "Mock Exam Results";
      descEl.innerHTML =
        "You needed <strong>" +
        data.passThreshold +
        "%</strong> to pass. Review the logic gaps below to improve your readiness.";
    }

    const ring = document.getElementById("peScoreRing");
    ring.style.setProperty("--ring-pct", String(pct));
    document.getElementById("peScoreRingPct").textContent = pct + "%";
    document.getElementById("peScoreRingBadge").textContent = passed ? "Passed" : "Not Passed";

    document.getElementById("peStatCorrect").textContent = String(correct);
    document.getElementById("peStatTotal").textContent = String(totalSlots);
    document.getElementById("peStatMinutes").textContent = String(minutesElapsed());

    const gap = passed ? pct - data.passThreshold : data.passThreshold - pct;
    const gapLabel = document.getElementById("peResultsGapLabel");
    const gapFoot = document.getElementById("peResultsGapFoot");
    if (passed) {
      gapLabel.textContent = "Above Threshold";
      gapFoot.textContent = "Points Secured";
    } else {
      gapLabel.textContent = "Gap to Pass";
      gapFoot.textContent = "Points Required";
    }
    document.getElementById("peResultsGapVal").textContent =
      (Math.round(gap * 10) / 10) + "%";

    renderDomainPerformance(passed);
  }

  function reviewDomainLabel(q) {
    if (q.domain === "business") return "Business";
    if (q.domain === "people") return "People";
    if (q.domain === "process") return "Process";
    return q.domainLabel;
  }

  function reviewCounts() {
    let missed = 0;
    let correct = 0;
    questions.forEach(function (q) {
      const ans = state.answers[q.id];
      if (ans === undefined) {
        missed += 1;
        return;
      }
      if (ans === q.correct) correct += 1;
      else missed += 1;
    });
    return { missed, correct };
  }

  function renderReviewDomainFilters() {
    const wrap = document.getElementById("peReviewDomainFilters");
    wrap.innerHTML = (data.reviewDomains || [])
      .map(function (d) {
        return (
          '<button type="button" class="pe-review-domain-chip' +
          (state.reviewDomain === d.id ? " is-active" : "") +
          '" data-domain="' +
          d.id +
          '" role="tab">' +
          d.label +
          "</button>"
        );
      })
      .join("");

    wrap.querySelectorAll("[data-domain]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.reviewDomain = btn.getAttribute("data-domain");
        expandFirstFilteredReview();
        renderReview();
      });
    });
  }

  function expandFirstFilteredReview() {
    const filtered = questions.filter(function (q) {
      if (state.reviewDomain !== "all" && q.domain !== state.reviewDomain) return false;
      const ans = state.answers[q.id];
      const ok = ans === q.correct;
      if (state.reviewFilter === "missed") return ans === undefined || !ok;
      if (state.reviewFilter === "correct") return ok;
      return true;
    });
    state.reviewExpanded.clear();
    if (filtered.length) state.reviewExpanded.add(filtered[0].id);
  }

  function renderReviewFilters() {
    const counts = reviewCounts();
    document.getElementById("peReviewMissedTab").textContent = "Missed (" + counts.missed + ")";
    document.getElementById("peReviewCorrectTab").textContent = "Correct (" + counts.correct + ")";

    document.querySelectorAll(".pe-review-filter").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-filter") === state.reviewFilter);
    });
  }

  function renderReviewAnswers(q) {
    const letters = ["A", "B", "C", "D"];
    const userAns = state.answers[q.id];
    return q.options
      .map(function (opt, i) {
        const isCorrect = i === q.correct;
        const isSelected = userAns === i;
        let cls = "pe-review-answer";
        let tag = "";

        if (isCorrect) {
          cls += " is-correct";
          tag =
            '<span class="pe-review-answer-tag pe-review-answer-tag--ok"><span>Correct</span><img class="pe-glyph pe-glyph--tick-01-20" src="' +
            REVIEW_ICON +
            'tick-01-20.svg" alt="" /></span>';
        } else if (isSelected) {
          cls += " is-selected-wrong";
          tag =
            '<span class="pe-review-answer-tag pe-review-answer-tag--bad"><span>Selected</span><img class="pe-glyph pe-glyph--cancel-16" src="' +
            REVIEW_ICON +
            'cancel-16.svg" alt="" /></span>';
        }

        return (
          '<div class="' +
          cls +
          '">' +
          '<span class="pe-review-answer-radio"></span>' +
          '<span class="pe-review-answer-letter">' +
          letters[i] +
          ".</span>" +
          '<span class="pe-review-answer-text">' +
          opt +
          "</span>" +
          tag +
          "</div>"
        );
      })
      .join("");
  }

  function renderReview() {
    renderReviewDomainFilters();
    renderReviewFilters();

    const list = document.getElementById("peReviewList");
    const filtered = questions.filter(function (q, i) {
      if (state.reviewDomain !== "all" && q.domain !== state.reviewDomain) return false;
      const ans = state.answers[q.id];
      const ok = ans === q.correct;
      if (state.reviewFilter === "missed") return ans === undefined || !ok;
      if (state.reviewFilter === "correct") return ok;
      return true;
    });

    if (!filtered.length) {
      list.innerHTML =
        '<p class="pe-review-empty">No questions match this filter.</p>';
      examView.classList.add("pe-screen-hidden");
      resultsView.classList.add("pe-screen-hidden");
      reviewView.classList.remove("pe-screen-hidden");
      return;
    }

    list.innerHTML = filtered
      .map(function (q) {
        const idx = questions.indexOf(q);
        const ans = state.answers[q.id];
        const ok = ans === q.correct;
        const isOpen = state.reviewExpanded.has(q.id);
        const domainLbl = reviewDomainLabel(q);

        if (isOpen) {
          return (
            '<article class="pe-review-card is-open" data-qid="' +
            q.id +
            '">' +
            '<button type="button" class="pe-review-card-head" data-toggle="' +
            q.id +
            '">' +
            '<span class="pe-review-card-icon pe-review-card-icon--' +
            (ok ? "ok" : "bad") +
            '">' +
            '<img class="pe-glyph ' +
            (ok ? "pe-glyph--tick-02-16" : "pe-glyph--cancel-16") +
            '" src="' +
            REVIEW_ICON +
            (ok ? "tick-02-16.svg" : "cancel-16.svg") +
            '" alt="" /></span>' +
            '<span class="pe-review-card-meta">' +
            '<span class="pe-review-card-num">Question ' +
            pad2(idx + 1) +
            "</span>" +
            '<span class="pe-review-domain-pill pe-review-domain-pill--' +
            (ok ? "ok" : "bad") +
            '">' +
            domainLbl +
            "</span></span>" +
            '<span class="pe-review-chevron-slot"><img class="pe-glyph pe-glyph--arrow-down-24" src="' +
            REVIEW_ICON +
            'arrow-down-24.svg" alt="" /></span></button>' +
            '<div class="pe-review-card-body">' +
            '<div class="pe-review-card-divider"></div>' +
            '<p class="pe-review-card-text">' +
            q.text +
            "</p>" +
            '<div class="pe-review-answers">' +
            renderReviewAnswers(q) +
            "</div>" +
            (q.explanation
              ? '<div class="pe-review-explanation"><div class="pe-review-explanation-head"><img class="pe-glyph pe-glyph--book-open-18" src="' +
                REVIEW_ICON +
                'book-open-18.svg" alt="" /><span>Explanation</span></div><p>' +
                q.explanation +
                "</p></div>"
              : "") +
            "</div></article>"
          );
        }

        return (
          '<article class="pe-review-card is-collapsed-only" data-qid="' +
          q.id +
          '">' +
          '<button type="button" class="pe-review-card-head" data-toggle="' +
          q.id +
          '">' +
          '<span class="pe-review-card-icon pe-review-card-icon--' +
          (ok ? "ok" : "bad") +
          '">' +
          '<img class="pe-glyph ' +
          (ok ? "pe-glyph--tick-02-16" : "pe-glyph--cancel-16") +
          '" src="' +
          REVIEW_ICON +
          (ok ? "tick-02-16.svg" : "cancel-16.svg") +
          '" alt="" /></span>' +
          '<span class="pe-review-card-meta">' +
          '<span class="pe-review-card-num">Question ' +
          pad2(idx + 1) +
          "</span>" +
          '<span class="pe-review-domain-pill pe-review-domain-pill--' +
          (ok ? "ok" : "bad") +
          '">' +
          domainLbl +
          "</span></span>" +
          '<span class="pe-review-chevron-slot"><img class="pe-glyph pe-glyph--arrow-down-24" src="' +
          REVIEW_ICON +
          'arrow-down-24.svg" alt="" /></span></button>' +
          '<p class="pe-review-card-text">' +
          q.text +
          "</p></article>"
        );
      })
      .join("");

    list.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = parseInt(btn.getAttribute("data-toggle"), 10);
        if (state.reviewExpanded.has(id)) {
          state.reviewExpanded.delete(id);
        } else {
          state.reviewExpanded.clear();
          state.reviewExpanded.add(id);
        }
        renderReview();
      });
    });

    examView.classList.add("pe-screen-hidden");
    resultsView.classList.add("pe-screen-hidden");
    reviewView.classList.remove("pe-screen-hidden");
  }

  function openReview() {
    state.reviewFilter = "all";
    state.reviewDomain = "all";
    state.reviewExpanded = new Set();
    expandFirstFilteredReview();
    renderReview();
  }

  function backToResults() {
    reviewView.classList.add("pe-screen-hidden");
    resultsView.classList.remove("pe-screen-hidden");
  }

  function startTick() {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = setInterval(function () {
      if (state.ended) return;
      if (!state.onBreak && state.examSecondsLeft > 0) {
        state.examSecondsLeft -= 1;
      }
      if (state.onBreak && state.breakSecondsLeft > 0) {
        state.breakSecondsLeft -= 1;
        if (state.breakSecondsLeft <= 0) closeBreak();
      }
      if (!state.onBreak && state.examSecondsLeft <= 0) {
        showResults();
      }
      updateTimers();
    }, 1000);
  }

  document.getElementById("peOpenNav").addEventListener("click", openNav);
  document.getElementById("peNavClose").addEventListener("click", closeNav);
  navOverlay.addEventListener("click", function (e) {
    if (e.target === navOverlay) closeNav();
  });

  document.getElementById("pePauseBtn").addEventListener("click", openBreak);
  document.getElementById("peResumeBreak").addEventListener("click", closeBreak);

  document.getElementById("peEndBtn").addEventListener("click", function () {
    endOverlay.classList.add("open");
    endOverlay.setAttribute("aria-hidden", "false");
  });
  document.getElementById("peCancelEnd").addEventListener("click", function () {
    endOverlay.classList.remove("open");
    endOverlay.setAttribute("aria-hidden", "true");
  });
  document.getElementById("peConfirmEnd").addEventListener("click", function () {
    endOverlay.classList.remove("open");
    showResults();
  });

  flagBtn.addEventListener("click", function () {
    const q = currentQ();
    if (state.flagged.has(q.id)) state.flagged.delete(q.id);
    else state.flagged.add(q.id);
    renderQuestion();
  });

  document.getElementById("pePrevBtn").addEventListener("click", function () {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  });

  document.getElementById("peNextBtn").addEventListener("click", function () {
    if (state.index < qCount - 1) {
      state.index += 1;
      renderQuestion();
    } else {
      showResults();
    }
  });

  document.getElementById("peResultsReviewBtn").addEventListener("click", openReview);
  function exitPracticeExam() {
    window.location.href = "practice-exam.html";
  }

  document.getElementById("peResultsExit").addEventListener("click", exitPracticeExam);
  document.getElementById("peScoreReportBtn").addEventListener("click", function () {
    window.print();
  });
  document.getElementById("peReviewBack").addEventListener("click", backToResults);

  document.getElementById("peReviewFilters").addEventListener("click", function (e) {
    const btn = e.target.closest(".pe-review-filter");
    if (!btn) return;
    state.reviewFilter = btn.getAttribute("data-filter");
    expandFirstFilteredReview();
    renderReview();
  });

  renderDomainLegend();
  renderQuestion();
  updateTimers();
  startTick();
})();
