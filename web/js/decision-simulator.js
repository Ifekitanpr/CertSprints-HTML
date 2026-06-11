(function () {
  var ICON_BASE = "assets/decision-simulator/icons/";
  var intro = DS_DATA.intro;
  var scenario = DS_DATA.scenario;

  var selectedId = null;
  var lastFeedbackCorrect = false;

  var introView = document.getElementById("ds-intro-view");
  var scenarioView = document.getElementById("ds-scenario-view");
  var overlay = document.getElementById("ds-overlay");
  var submitBtn = document.getElementById("ds-submit-btn");
  var optionsRoot = document.getElementById("ds-options");
  var boundariesRoot = document.getElementById("ds-boundaries");
  var resultCard = document.getElementById("ds-result-card");
  var resultIcon = document.getElementById("ds-result-icon");
  var resultLabel = document.getElementById("ds-result-label");
  var resultAnswerText = document.getElementById("ds-result-answer-text");
  var whyText = document.getElementById("ds-why-text");

  function applyDemoView() {
    var demo = new URLSearchParams(window.location.search).get("view");
    if (demo === "scenario") showScenario();
    else if (demo === "feedback-correct") {
      showScenario();
      selectedId = scenario.correctId;
      syncOptions();
      openFeedback(true);
    } else if (demo === "feedback-wrong") {
      showScenario();
      selectedId = "b";
      syncOptions();
      openFeedback(false);
    }
  }

  function renderIntro() {
    document.getElementById("ds-badge-text").textContent = intro.badge;
    document.getElementById("ds-title-prefix").textContent = intro.titlePrefix;
    document.getElementById("ds-title-gradient").textContent = intro.titleGradient;
    document.getElementById("ds-intro-desc").textContent = intro.description;
    document.getElementById("ds-total-num").textContent = intro.totalScenarios;
    document.getElementById("ds-time-num").textContent = intro.expectedMinutes;

    var chips = document.getElementById("ds-focus-chips");
    chips.innerHTML = intro.focusAreas
      .map(function (area) {
        return '<span class="ds-focus-chip">' + area + "</span>";
      })
      .join("");
  }

  function renderScenario() {
    document.getElementById("ds-scenario-counter").textContent =
      "Scenario " + scenario.index + " of " + scenario.total;
    document.getElementById("ds-scenario-title").textContent = scenario.title;
    document.getElementById("ds-context-text").textContent = '"' + scenario.context + '"';
    document.getElementById("ds-question-text").textContent = scenario.question;

    boundariesRoot.innerHTML = scenario.boundaries
      .map(function (b) {
        return (
          '<div class="ds-boundary">' +
          '<img src="' + ICON_BASE + b.icon + '" alt="" width="16" height="16"/>' +
          '<span class="ds-boundary-k">' + b.label + "</span>" +
          '<span class="ds-boundary-v">' + b.value + "</span>" +
          "</div>"
        );
      })
      .join("");

    optionsRoot.innerHTML = "";
    scenario.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ds-option";
      btn.dataset.optionId = opt.id;
      btn.innerHTML =
        '<span class="ds-radio"><span class="ds-radio-dot"></span></span>' +
        '<span class="ds-option-letter">' + opt.letter + ".</span>" +
        '<span class="ds-option-text">' + opt.text + "</span>";
      btn.addEventListener("click", function () {
        selectOption(opt.id);
      });
      optionsRoot.appendChild(btn);
    });
  }

  function showIntro() {
    introView.classList.add("active");
    scenarioView.classList.remove("active");
    closeFeedback();
  }

  function showScenario() {
    introView.classList.remove("active");
    scenarioView.classList.add("active");
  }

  function selectOption(id) {
    selectedId = id;
    syncOptions();
  }

  function syncOptions() {
    optionsRoot.querySelectorAll(".ds-option").forEach(function (el) {
      el.classList.toggle("selected", el.dataset.optionId === selectedId);
    });
    submitBtn.classList.toggle("disabled", !selectedId);
  }

  function getOption(id) {
    return scenario.options.find(function (o) {
      return o.id === id;
    });
  }

  function openFeedback(isCorrect) {
    lastFeedbackCorrect = isCorrect;
    var correctOpt = getOption(scenario.correctId);

    resultCard.classList.toggle("correct", isCorrect);
    resultCard.classList.toggle("wrong", !isCorrect);

    if (isCorrect) {
      resultIcon.src = ICON_BASE + "tick-01-20.svg";
      resultLabel.textContent = "Correct answer is:";
      resultAnswerText.textContent = correctOpt.text;
      whyText.textContent = scenario.correctExplanation;
    } else {
      resultIcon.src = ICON_BASE + "information-diamond-20.svg";
      resultLabel.textContent = "Wrong Answer";
      resultAnswerText.textContent = getOption(selectedId).text;
      whyText.textContent = scenario.wrongExplanation;
    }

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeFeedback() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function submitDecision() {
    if (!selectedId || submitBtn.classList.contains("disabled")) return;
    openFeedback(selectedId === scenario.correctId);
  }

  function onGotIt() {
    closeFeedback();
    if (lastFeedbackCorrect) {
      window.location.href = new URL("lms/lesson-quiz.html", document.baseURI).href;
    }
  }

  document.getElementById("ds-intro-back").addEventListener("click", function () {
    window.location.href = new URL("lms/key-takeaway-2.html", document.baseURI).href;
  });

  document.getElementById("ds-start-btn").addEventListener("click", function () {
    selectedId = null;
    syncOptions();
    showScenario();
  });

  document.getElementById("ds-scenario-close").addEventListener("click", showIntro);

  submitBtn.addEventListener("click", submitDecision);

  document.getElementById("ds-got-it-btn").addEventListener("click", onGotIt);

  document.getElementById("ds-ai-btn").addEventListener("click", function () {
    window.location.href = new URL("support/help-support.html?from=decision-simulator", document.baseURI).href;
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeFeedback();
  });

  document.getElementById("ds-sheet-wrap").addEventListener("click", function (e) {
    e.stopPropagation();
  });

  renderIntro();
  renderScenario();
  applyDemoView();
})();
