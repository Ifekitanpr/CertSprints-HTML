(function () {
  var data = ST2_DATA;
  var root = document.getElementById("st2");
  var introView = document.getElementById("st2-intro-view");
  var gameView = document.getElementById("st2-game-view");
  var overlay = document.getElementById("st2-overlay");
  var optionsRoot = document.getElementById("st2-options");
  var questionIndex = 0;
  var feedbackOpen = false;

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function currentQuestion() {
    return data.questions[questionIndex];
  }

  function showView(name) {
    introView.classList.toggle("active", name === "intro");
    gameView.classList.toggle("active", name === "game");
  }

  function renderIntro() {
    document.getElementById("st2-intro-badge").textContent = data.intro.badge;
    document.getElementById("st2-intro-title").textContent = data.intro.title;
    document.getElementById("st2-intro-desc").textContent = data.intro.description;
    document.getElementById("st2-stat-items").textContent = pad2(data.intro.items);
    document.getElementById("st2-stat-time").textContent = data.intro.time;
    document.getElementById("st2-start-label").textContent = data.intro.startLabel;
    document.getElementById("st2-game-nav-title").textContent = data.gameplay.headerTitle;
    document.getElementById("st2-select-label").textContent = data.gameplay.selectLabel;
    document.getElementById("st2-reasoning-label").textContent = data.gameplay.reasoningLabel;
    document.getElementById("st2-continue-label").textContent = data.gameplay.continueLabel;
  }

  function updateProgress() {
    var total = data.questions.length;
    var current = questionIndex + 1;
    document.getElementById("st2-counter").textContent = current + "/" + total;
    document.getElementById("st2-progress-fill").style.width = (current / total) * 100 + "%";
  }

  function loadQuestion() {
    var q = currentQuestion();
    if (!q) return;

    document.getElementById("st2-q-title").textContent = q.title;
    document.getElementById("st2-q-sub").textContent = q.subtitle;
    document.getElementById("st2-quote").textContent = q.quote;
    updateProgress();

    optionsRoot.innerHTML = "";
    q.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "st2-option tone-" + opt.tone;
      btn.dataset.value = opt.id;

      var iconSrc =
        opt.tone === "yes"
          ? "assets/sorting-type-2/icons/tick-02-yes-20.svg"
          : "assets/sorting-type-2/icons/cancel-no-20.svg";
      var arrowSrc = "assets/icons/arrow-right-01.svg";

      btn.innerHTML =
        '<span class="st2-option-icon"><img src="' +
        iconSrc +
        '" alt="" width="16" height="16"/></span>' +
        '<span class="st2-option-label">' +
        opt.label +
        '</span><img class="st2-option-arrow" src="' +
        arrowSrc +
        '" alt="" width="24" height="24"/>';

      btn.addEventListener("click", function () {
        revealFeedback(opt.id);
      });
      optionsRoot.appendChild(btn);
    });
  }

  function setFeedbackAssets(correct) {
    var glyph = document.getElementById("st2-feedback-glyph");
    var ringOuter = document.getElementById("st2-ring-outer");
    var ringInner = document.getElementById("st2-ring-inner");
    var banner = document.getElementById("st2-feedback-banner");

    banner.classList.remove("correct", "wrong");
    banner.classList.add(correct ? "correct" : "wrong");

    if (correct) {
      glyph.src = "assets/sorting-type-2/icons/tick-01-20.svg";
      ringOuter.src = "assets/sorting-type-2/icons/feedback-ring-outer.svg";
      ringInner.src = "assets/sorting-type-2/icons/feedback-ring-inner.svg";
      document.getElementById("st2-feedback-title").textContent = data.gameplay.correctBanner;
    } else {
      glyph.src = "assets/sorting-type-2/icons/information-diamond-20.svg";
      ringOuter.src = "assets/sorting-type-2/icons/feedback-ring-outer-red.svg";
      ringInner.src = "assets/sorting-type-2/icons/feedback-ring-inner-red.svg";
      document.getElementById("st2-feedback-title").textContent = data.gameplay.wrongBanner;
    }
  }

  function revealFeedback(picked) {
    if (feedbackOpen) return;
    var q = currentQuestion();
    var correct = picked === q.answer;
    feedbackOpen = true;

    optionsRoot.querySelectorAll(".st2-option").forEach(function (btn) {
      btn.disabled = true;
    });

    setFeedbackAssets(correct);
    document.getElementById("st2-answer-label").textContent = correct
      ? q.correctAnswerLabel
      : q.wrongAnswerLabel;
    document.getElementById("st2-reasoning-text").textContent = correct
      ? q.correctRationale
      : q.wrongRationale;

    root.classList.add("sheet-open");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeFeedback() {
    feedbackOpen = false;
    root.classList.remove("sheet-open");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function onContinue() {
    if (!feedbackOpen) return;
    closeFeedback();
    questionIndex += 1;
    if (questionIndex >= data.questions.length) {
      window.location.href = new URL("lms/insight-exchange.html", document.baseURI).href;
      return;
    }
    loadQuestion();
  }

  function applyDemo() {
    var params = new URLSearchParams(window.location.search);
    var view = params.get("view");
    var demo = params.get("demo");
    var question = params.get("question");

    if (view === "game" || demo) {
      showView("game");
      loadQuestion();
    }

    if (question) {
      var idx = parseInt(question, 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < data.questions.length) {
        questionIndex = idx;
        loadQuestion();
      }
    }

    if (demo === "correct") {
      revealFeedback(currentQuestion().answer);
    } else if (demo === "wrong") {
      var q = currentQuestion();
      var wrong = q.options.find(function (o) {
        return o.id !== q.answer;
      });
      if (wrong) revealFeedback(wrong.id);
    }
  }

  document.getElementById("st2-start-btn").addEventListener("click", function () {
    showView("game");
    loadQuestion();
  });

  document.getElementById("st2-intro-back").addEventListener("click", function () {
    window.location.href = new URL("lms/boolean-flashcard.html", document.baseURI).href;
  });

  document.getElementById("st2-game-close").addEventListener("click", function () {
    if (feedbackOpen) {
      closeFeedback();
      return;
    }
    showView("intro");
  });

  document.getElementById("st2-help").addEventListener("click", function () {
    window.location.href = new URL("support/help-support.html?from=sorting-type-2", document.baseURI).href;
  });

  document.getElementById("st2-continue").addEventListener("click", onContinue);

  renderIntro();
  applyDemo();
})();
