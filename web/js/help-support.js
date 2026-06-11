(function () {
  const H = window.HELP_SUPPORT;
  if (!H) return;

  const faqListEl = document.getElementById("hsFaqList");
  const searchInput = document.getElementById("hsFaqSearch");
  let openId = H.faqs.find(function (f) {
    return f.open;
  })?.id;

  const CANONICAL = {
    // app
    dashboard:"app/dashboard.html",progress:"app/progress.html",more:"app/more.html",
    notifications:"app/notifications.html",notes:"app/notes.html",resources:"app/resources.html",
    habits:"app/habits.html",timeline:"app/timeline.html","sprint-timeline":"app/sprint-timeline.html",
    // lms
    "study-backlog":"lms/study-backlog.html","lesson-player":"lms/lesson-player.html",
    "key-takeaway":"lms/key-takeaway.html","key-takeaway-2":"lms/key-takeaway-2.html",
    "gap-prompt":"lms/gap-prompt.html","insight-exchange":"lms/insight-exchange.html",
    "decision-simulator":"lms/decision-simulator.html","scenario-sorting":"lms/scenario-sorting.html",
    "risk-cycle-sequencer":"lms/risk-cycle-sequencer.html","sorting-type-2":"lms/sorting-type-2.html",
    "boolean-flashcard":"lms/boolean-flashcard.html","active-recall":"lms/active-recall.html",
    "blurting-canvas":"lms/blurting-canvas.html","retrieval-sprint":"lms/retrieval-sprint.html",
    "pre-assessment-quiz":"lms/pre-assessment-quiz.html","decision-tree":"lms/decision-tree.html",
    "knowledge-poll":"lms/knowledge-poll.html","knowledge-poll-2":"lms/knowledge-poll-2.html",
    "peer-teachbacks":"lms/peer-teachbacks.html","comprehension-check":"lms/comprehension-check.html",
    "lesson-quiz":"lms/lesson-quiz.html","module-quiz":"lms/module-quiz.html",
    "mock-exam":"lms/mock-exam.html","capability-matrix":"lms/capability-matrix.html",
    "standard-evolution":"lms/standard-evolution.html","ethics-evolution":"lms/ethics-evolution.html",
    "standard-comparison":"lms/standard-comparison.html","ethics-comparison":"lms/ethics-comparison.html",
    reading:"lms/reading.html","definition-matrix":"lms/definition-matrix.html",
    "phase-controller":"lms/phase-controller.html",curriculum:"lms/curriculum.html",
    "core-terms":"lms/core-terms.html",
    // other
    games:"games/games.html",settings:"settings/settings.html",
    "settings-notifications":"settings/settings-notifications.html",
    "help-support":"support/help-support.html","wellness-checkin":"support/wellness-checkin.html",
    certification:"commerce/certification.html",
  };

  function goBack() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from) {
      const key = from.replace(/\.html$/, "");
      const path = CANONICAL[key] || (key + ".html");
      window.location.href = new URL(path, document.baseURI).href;
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = new URL("app/more.html", document.baseURI).href;
  }

  function renderFaqs(filter) {
    if (!faqListEl) return;
    const query = (filter || "").trim().toLowerCase();
    faqListEl.innerHTML = H.faqs
      .map(function (faq) {
        const haystack = (faq.question + " " + faq.answer).toLowerCase();
        const hidden = query && haystack.indexOf(query) === -1;
        const isOpen = faq.id === openId;
        const icon = isOpen ? "minus-sign-24.svg" : "plus-sign-24.svg";
        const glyphClass = isOpen ? "hs-glyph--minus-24" : "hs-glyph--plus-24";
        return (
          '<article class="hs-faq-item' +
          (isOpen ? " is-open" : "") +
          (hidden ? " is-hidden" : "") +
          '" data-faq-id="' +
          faq.id +
          '">' +
          '<button type="button" class="hs-faq-trigger" data-faq-toggle="' +
          faq.id +
          '">' +
          "<h3>" +
          faq.question +
          "</h3>" +
          '<span class="hs-icon-slot hs-icon-slot--24">' +
          '<img class="hs-glyph ' +
          glyphClass +
          '" src="assets/help-support/icons/' +
          icon +
          '" alt="" />' +
          "</span></button>" +
          '<p class="hs-faq-body">' +
          faq.answer +
          "</p></article>"
        );
      })
      .join("");
  }

  faqListEl?.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-faq-toggle]");
    if (!btn) return;
    const id = btn.getAttribute("data-faq-toggle");
    openId = openId === id ? null : id;
    renderFaqs(searchInput?.value || "");
  });

  searchInput?.addEventListener("input", function () {
    renderFaqs(searchInput.value);
  });

  document.getElementById("hsBackBtn")?.addEventListener("click", goBack);

  renderFaqs();
})();
