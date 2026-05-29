(function () {
  const dailyQuestions = [
    {
      category: "Risk Management",
      prompt:
        "Your project has an identified risk with a 40% probability and $50,000 impact. What is the expected monetary value (EMV)?",
      options: ["$20,000", "$50,000", "$90,000", "$10,000"],
      answer: 0,
    },
    {
      category: "Stakeholder Engagement",
      prompt:
        'A key stakeholder is classified as "resistant" in the stakeholder engagement assessment matrix. What is the BEST next step?',
      options: [
        "Escalate to the project sponsor immediately",
        "Develop targeted communication and engagement strategies",
        "Remove them from the stakeholder register",
        "Proceed without their input",
      ],
      answer: 1,
    },
  ];

  function initDailyChallenge() {
    const overlay = document.querySelector("[data-daily-challenge]");
    if (!overlay) return;

    if (overlay.dataset.dailyBound === "true" && window.CertSprintsDailyChallenge) return;
    overlay.dataset.dailyBound = "true";

    const params = new URLSearchParams(window.location.search);
    const views = Array.from(overlay.querySelectorAll("[data-daily-view]"));
    const startButtons = Array.from(overlay.querySelectorAll("[data-daily-start]"));
    const skipButton = overlay.querySelector("[data-daily-skip]");
    const scrim = overlay.querySelector(".daily-challenge-scrim");
    const closeButton = overlay.querySelector("[data-daily-close]");
    const cancelSkipButton = overlay.querySelector("[data-daily-cancel-skip]");
    const countdown = overlay.querySelector("[data-daily-countdown]");
    const doneButton = overlay.querySelector("[data-daily-done]");
    const previewButtons = Array.from(document.querySelectorAll("[data-daily-preview]"));
    const questionCategory = overlay.querySelector("[data-daily-category]");
    const questionText = overlay.querySelector("[data-daily-question]");
    const optionsWrap = overlay.querySelector("[data-daily-options]");
    const feedback = overlay.querySelector("[data-daily-feedback]");
    const continueButton = overlay.querySelector("[data-daily-continue]");
    const resultTitle = overlay.querySelector("[data-daily-result-title]");
    const resultMeta = overlay.querySelector("[data-daily-result-meta]");
    const resultNote = overlay.querySelector("[data-daily-result-note]");
    const scoreRing = overlay.querySelector("[data-daily-score-ring]");
    const storageKey = "certsprints.dailyQuickWin.lastSeen";
    const todayKey = new Date().toISOString().slice(0, 10);
    const path = window.location.pathname.toLowerCase();
    const isDashboardPage =
      path.endsWith("/dashboard.html") || path.endsWith("dashboard.html");
    const previewMode =
      isDashboardPage &&
      (params.get("daily") === "1" || window.location.protocol === "file:");

    let activeQuestion = 0;
    let selectedAnswer = null;
    let correctCount = 0;
    let skipTimer = null;
    let skipSeconds = 5;

    function safeLocalStorage(action) {
      try {
        return action(window.localStorage);
      } catch (error) {
        return null;
      }
    }

    function showView(name) {
      views.forEach((view) => {
        view.hidden = view.getAttribute("data-daily-view") !== name;
      });
    }

    function stopSkipTimer() {
      window.clearInterval(skipTimer);
      skipTimer = null;
    }

    function markSeen() {
      if (previewMode) return;
      safeLocalStorage((storage) => storage.setItem(storageKey, todayKey));
    }

    function openChallenge() {
      stopSkipTimer();
      overlay.hidden = false;
      showView("intro");
    }

    function closeChallenge(markAsSeen) {
      stopSkipTimer();
      if (markAsSeen) markSeen();
      overlay.hidden = true;
    }

    function renderQuestion() {
      const question = dailyQuestions[activeQuestion];
      selectedAnswer = null;

      if (questionCategory) questionCategory.textContent = question.category;
      if (questionText) questionText.textContent = question.prompt;
      if (feedback) {
        feedback.hidden = true;
        feedback.className = "daily-feedback";
        feedback.textContent = "";
      }
      if (continueButton) continueButton.disabled = true;
      if (!optionsWrap) return;

      optionsWrap.innerHTML = "";
      question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "daily-option";
        button.type = "button";
        button.innerHTML = `
          <span class="daily-option-dot"></span>
          <span class="daily-option-letter">${String.fromCharCode(65 + index)}.</span>
          <span class="daily-option-text"></span>
        `;
        button.querySelector(".daily-option-text").textContent = option;
        button.addEventListener("click", () => chooseAnswer(index));
        optionsWrap.appendChild(button);
      });
    }

    function chooseAnswer(index) {
      const question = dailyQuestions[activeQuestion];
      selectedAnswer = index;
      const isCorrect = index === question.answer;

      Array.from(optionsWrap.querySelectorAll(".daily-option")).forEach((button, optionIndex) => {
        button.classList.toggle("correct", optionIndex === question.answer);
        button.classList.toggle("wrong", optionIndex === selectedAnswer && !isCorrect);
      });

      if (feedback) {
        feedback.hidden = false;
        feedback.className = `daily-feedback ${isCorrect ? "correct" : "wrong"}`;
        feedback.textContent = isCorrect
          ? "Correct! Active recall reinforced."
          : "Not quite. The right answer is highlighted for review.";
      }
      if (continueButton) continueButton.disabled = false;
    }

    function startDrill() {
      stopSkipTimer();
      correctCount = 0;
      activeQuestion = 0;
      renderQuestion();
      showView("question");
    }

    function continueDrill() {
      if (selectedAnswer === null) return;
      if (selectedAnswer === dailyQuestions[activeQuestion].answer) correctCount += 1;

      if (activeQuestion < dailyQuestions.length - 1) {
        activeQuestion += 1;
        renderQuestion();
        return;
      }

      renderResult();
    }

    function renderResult() {
      const percent = Math.round((correctCount / dailyQuestions.length) * 100);
      const perfect = correctCount === dailyQuestions.length;

      if (resultTitle) resultTitle.textContent = perfect ? "Perfect Score!" : correctCount === 0 ? "Well Done!" : "Streak Protected!";
      if (resultMeta) resultMeta.textContent = `${correctCount} of ${dailyQuestions.length} correct · ${percent}%`;
      if (resultNote) {
        resultNote.textContent = perfect
          ? "Streak protected. Daily commitment confirmed."
          : correctCount === 0
            ? "Commitment made - attempts strengthen recall."
            : "Streak protected. Review the miss and keep momentum.";
      }
      if (scoreRing) {
        scoreRing.classList.toggle("zero", !perfect);
        const icon = scoreRing.querySelector("img");
        if (icon) icon.src = perfect ? "assets/daily-challenge/award.svg" : "assets/daily-challenge/tick.svg";
      }

      markSeen();
      showView("result");
    }

    function startSkipCountdown() {
      showView("skipped");
      skipSeconds = 5;
      if (countdown) countdown.textContent = "5s";
      stopSkipTimer();

      skipTimer = window.setInterval(() => {
        skipSeconds -= 1;
        if (countdown) countdown.textContent = `${Math.max(skipSeconds, 0)}s`;
        if (skipSeconds > 0) return;

        closeChallenge(true);
      }, 1000);
    }

    window.CertSprintsDailyChallenge = {
      close: closeChallenge,
      continue: continueDrill,
      intro() {
        stopSkipTimer();
        showView("intro");
      },
      open: openChallenge,
      skip: startSkipCountdown,
      start: startDrill,
    };

    startButtons.forEach((button) => button.addEventListener("click", startDrill));
    skipButton?.addEventListener("click", startSkipCountdown);
    scrim?.addEventListener("click", () => closeChallenge(false));
    closeButton?.addEventListener("click", () => {
      stopSkipTimer();
      showView("intro");
    });
    cancelSkipButton?.addEventListener("click", () => {
      stopSkipTimer();
      showView("intro");
    });
    continueButton?.addEventListener("click", continueDrill);
    doneButton?.addEventListener("click", () => closeChallenge(true));
    previewButtons.forEach((button) => button.addEventListener("click", openChallenge));

    const lastSeen = safeLocalStorage((storage) => storage.getItem(storageKey));
    const shouldAutoOpen =
      isDashboardPage && (previewMode || lastSeen !== todayKey);
    if (shouldAutoOpen) {
      window.setTimeout(openChallenge, 280);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDailyChallenge);
  } else {
    initDailyChallenge();
  }
})();
