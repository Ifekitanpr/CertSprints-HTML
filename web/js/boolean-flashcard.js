(function () {
  var data = BF_DATA;
  var root = document.getElementById("bf");
  var cardIndex = 0;
  var revealed = false;

  var statementEl = document.getElementById("bf-statement");
  var progressLabel = document.getElementById("bf-progress-label");
  var progressFill = document.getElementById("bf-progress-fill");
  var defaultBlock = document.getElementById("bf-default-block");
  var feedbackEl = document.getElementById("bf-feedback");
  var rationaleEl = document.getElementById("bf-rationale");
  var rationaleText = document.getElementById("bf-rationale-text");
  var answerLabel = document.getElementById("bf-answer-label");
  var feedbackTitle = document.getElementById("bf-feedback-title");
  var feedbackGlyph = document.getElementById("bf-feedback-glyph");
  var ringOuter = document.getElementById("bf-ring-outer");
  var ringInner = document.getElementById("bf-ring-inner");
  var continueBtn = document.getElementById("bf-continue");
  var yesBtn = document.getElementById("bf-yes");
  var noBtn = document.getElementById("bf-no");
  var cardEl = document.getElementById("bf-card");

  function currentCard() {
    return data.cards[cardIndex];
  }

  function answerLabelFor(val) {
    return val ? "YES" : "NO";
  }

  function renderStatic() {
    document.getElementById("bf-nav-title").textContent = data.headerTitle;
    document.getElementById("bf-title").textContent = data.title;
    document.getElementById("bf-subtitle").textContent = data.subtitle;
    document.getElementById("bf-concept-badge").textContent = data.conceptBadge;
    document.getElementById("bf-analyze-label").textContent = data.analyzeLabel;
    document.getElementById("bf-tap-hint-text").textContent = data.tapHint;
    document.getElementById("bf-tip-text").textContent = data.tipText;
    document.getElementById("bf-rationale-label").textContent = data.rationaleLabel;
  }

  function renderStatement(card) {
    statementEl.innerHTML = card.parts
      .map(function (part) {
        if (part.hl) {
          return '<span class="hl">' + part.text + "</span>";
        }
        return part.text;
      })
      .join("");
  }

  function updateProgress() {
    var total = data.cards.length;
    var current = cardIndex + 1;
    progressLabel.textContent = "Card " + current + " of " + total;
    var pct = (current / total) * 100;
    progressFill.style.width = pct + "%";
  }

  function resetChoiceStyles() {
    yesBtn.classList.remove("selected-yes", "selected-no");
    noBtn.classList.remove("selected-yes", "selected-no");
    yesBtn.disabled = false;
    noBtn.disabled = false;
  }

  function resetCardUI() {
    revealed = false;
    root.classList.remove("is-revealed");
    defaultBlock.classList.remove("is-hidden");
    feedbackEl.classList.remove("show", "correct", "wrong");
    rationaleEl.classList.remove("show");
    cardEl.classList.remove("is-feedback");
    continueBtn.classList.remove("enabled");
    continueBtn.disabled = true;
    resetChoiceStyles();
  }

  function loadCard() {
    var card = currentCard();
    if (!card) return;
    resetCardUI();
    renderStatement(card);
    updateProgress();
  }

  function revealAnswer(picked) {
    if (revealed) return;
    var card = currentCard();
    var correct = picked === card.answer;
    revealed = true;

    yesBtn.disabled = true;
    noBtn.disabled = true;
    if (picked === true) {
      yesBtn.classList.add("selected-yes");
    } else {
      noBtn.classList.add("selected-no");
    }

    root.classList.add("is-revealed");
    defaultBlock.classList.add("is-hidden");
    cardEl.classList.add("is-feedback");

    feedbackEl.classList.add("show", correct ? "correct" : "wrong");
    feedbackTitle.textContent = correct ? data.correctBanner : data.wrongBanner;
    answerLabel.textContent = "The Answer is " + answerLabelFor(card.answer);

    if (correct) {
      feedbackGlyph.src = "assets/boolean-flashcard/icons/tick-01-20.svg";
      ringOuter.src = "assets/boolean-flashcard/icons/feedback-ring-outer.svg";
      ringInner.src = "assets/boolean-flashcard/icons/feedback-ring-inner.svg";
      rationaleText.textContent = card.correctRationale;
    } else {
      feedbackGlyph.src = "assets/boolean-flashcard/icons/information-diamond-20.svg";
      ringOuter.src = "assets/boolean-flashcard/icons/feedback-ring-outer-red.svg";
      ringInner.src = "assets/boolean-flashcard/icons/feedback-ring-inner-red.svg";
      rationaleText.textContent = card.wrongRationale;
    }

    rationaleEl.classList.add("show");
    continueBtn.classList.add("enabled");
    continueBtn.disabled = false;
  }

  function onContinue() {
    if (!revealed) return;
    cardIndex += 1;
    if (cardIndex >= data.cards.length) {
      window.location.href = new URL("lms/sorting-type-2.html", document.baseURI).href;
      return;
    }
    loadCard();
  }

  function applyDemo() {
    var params = new URLSearchParams(window.location.search);
    var demo = params.get("demo");
    var card = params.get("card");
    if (card) {
      var idx = parseInt(card, 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < data.cards.length) {
        cardIndex = idx;
        loadCard();
      }
    }
    if (demo === "correct") {
      revealAnswer(currentCard().answer);
    } else if (demo === "wrong") {
      revealAnswer(!currentCard().answer);
    }
  }

  yesBtn.addEventListener("click", function () {
    revealAnswer(true);
  });
  noBtn.addEventListener("click", function () {
    revealAnswer(false);
  });

  continueBtn.addEventListener("click", onContinue);

  document.getElementById("bf-back").addEventListener("click", function () {
    window.location.href = new URL("lms/risk-cycle-sequencer.html", document.baseURI).href;
  });
  document.getElementById("bf-close").addEventListener("click", function () {
    loadCard();
  });
  document.getElementById("bf-help").addEventListener("click", function () {
    window.location.href = new URL("support/help-support.html?from=boolean-flashcard", document.baseURI).href;
  });

  renderStatic();
  loadCard();
  applyDemo();
})();
