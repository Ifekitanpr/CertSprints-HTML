(function () {
  var data = window.BC_DATA;
  var root = document.getElementById("bc");
  var editor = document.getElementById("bc-editor");
  var editorWrap = document.getElementById("bc-editor-wrap");
  var progressCount = document.getElementById("bc-progress-count");
  var progressFill = document.getElementById("bc-progress-fill");
  var progressStatus = document.getElementById("bc-progress-status");
  var finishBtn = document.getElementById("bc-finish");
  var feedback = document.getElementById("bc-feedback");
  var feedbackBanner = document.getElementById("bc-feedback-banner");
  var feedbackStrength = document.getElementById("bc-feedback-strength");
  var feedbackGaps = document.getElementById("bc-feedback-gaps");
  var gapsList = document.getElementById("bc-gaps-list");
  var keywordGrid = document.getElementById("bc-keyword-grid");

  var totalKeywords = data.keywords.length;
  var captured = [];
  var detectTimer = null;

  function renderCopy() {
    document.getElementById("bc-nav-title").textContent = data.navTitle;
    document.getElementById("bc-prompt-prefix").textContent = data.promptPrefix;
    document.getElementById("bc-prompt-highlight").textContent = data.promptHighlight;
    document.getElementById("bc-prompt-desc").textContent = data.promptDesc;
    document.getElementById("bc-progress-label").textContent = data.progressLabel;
    document.getElementById("bc-detector-label").textContent = data.detectorLabel;
    document.getElementById("bc-finish-label").textContent = data.finishLabel;
    document.getElementById("bc-feedback-title").textContent = data.feedback.blockSecured;
    document.getElementById("bc-ok-label").textContent = data.feedback.okLabel;
    document.getElementById("bc-ai-label").textContent = data.feedback.aiLabel;
    document.getElementById("bc-gaps-title").textContent = data.feedback.gapsTitle;
    editor.placeholder = data.editorPlaceholder;
  }

  function matchKeywords(text) {
    var lower = text.toLowerCase();
    return data.keywords.filter(function (kw) {
      return kw.patterns.some(function (pattern) {
        return pattern.test(lower);
      });
    });
  }

  function updateProgress() {
    var count = captured.length;
    var pct = totalKeywords ? (count / totalKeywords) * 100 : 0;

    progressCount.textContent = count + "/" + totalKeywords;
    progressFill.style.width = Math.max(pct, count > 0 ? 4 : 0) + "%";

    if (count === 0) {
      progressStatus.textContent = data.statusWaiting;
      progressStatus.classList.remove("is-success");
      editorWrap.classList.remove("is-active");
      finishBtn.disabled = true;
    } else {
      progressStatus.textContent = data.statusCaptured;
      progressStatus.classList.add("is-success");
      editorWrap.classList.add("is-active");
      finishBtn.disabled = false;
    }
  }

  function scheduleDetect() {
    window.clearTimeout(detectTimer);
    detectTimer = window.setTimeout(function () {
      captured = matchKeywords(editor.value);
      updateProgress();
    }, 280);
  }

  function renderKeywordGrid(keywords) {
    keywordGrid.innerHTML = "";
    keywords.forEach(function (kw) {
      var chip = document.createElement("div");
      chip.className = "bc-keyword-chip";
      chip.innerHTML =
        '<span class="bc-icon-slot bc-icon-slot--20">' +
        '<img class="bc-glyph bc-glyph--checkbox-checked-20" src="assets/blurting-canvas/icons/checkbox-checked-20.svg" alt=""/>' +
        "</span>" +
        "<span>" +
        kw.label +
        "</span>";
      keywordGrid.appendChild(chip);
    });
  }

  function renderGaps(missed) {
    if (!missed.length) {
      feedbackGaps.hidden = true;
      gapsList.innerHTML = "";
      return;
    }
    feedbackGaps.hidden = false;
    gapsList.innerHTML = missed
      .map(function (kw) {
        return "<li>" + kw.label + "</li>";
      })
      .join("");
  }

  function openFeedback(isFull) {
    var matched = matchKeywords(editor.value);
    var missed = data.keywords.filter(function (kw) {
      return !matched.some(function (m) {
        return m.id === kw.id;
      });
    });
    var pct = Math.round((matched.length / totalKeywords) * 100);

    feedbackBanner.classList.toggle("is-full", isFull);
    feedbackBanner.classList.toggle("is-partial", !isFull);

    if (isFull) {
      feedbackStrength.textContent = data.feedback.successLabel + " " + pct + "%";
    } else {
      feedbackStrength.textContent = data.feedback.strengthLabel + " " + pct + "%";
    }

    renderGaps(isFull ? [] : missed);
    renderKeywordGrid(matched);

    feedback.setAttribute("aria-hidden", "false");
    root.classList.add("bc-feedback-open");
  }

  function closeFeedback() {
    feedback.setAttribute("aria-hidden", "true");
    root.classList.remove("bc-feedback-open");
  }

  function applyDemo() {
    var params = new URLSearchParams(window.location.search);
    var demo = params.get("demo");
    var view = params.get("view");

    if (demo === "partial") {
      editor.value = data.samplePartial;
      captured = matchKeywords(editor.value);
      updateProgress();
    }
    if (demo === "full") {
      editor.value = data.sampleFull;
      captured = matchKeywords(editor.value);
      updateProgress();
    }
    if (view === "feedback-partial") {
      editor.value = data.samplePartial;
      captured = matchKeywords(editor.value);
      updateProgress();
      openFeedback(false);
    }
    if (view === "feedback-full") {
      editor.value = data.sampleFull;
      captured = matchKeywords(editor.value);
      updateProgress();
      openFeedback(true);
    }
  }

  document.getElementById("bc-back").addEventListener("click", function () {
    window.location.href = "active-recall.html";
  });
  document.getElementById("bc-help").addEventListener("click", function () {
    window.location.href = "help-support.html?from=blurting-canvas";
  });

  editor.addEventListener("input", scheduleDetect);

  finishBtn.addEventListener("click", function () {
    if (finishBtn.disabled) return;
    var matched = matchKeywords(editor.value);
    openFeedback(matched.length >= totalKeywords);
  });

  document.getElementById("bc-feedback-ok").addEventListener("click", function () {
    window.location.href = "study-backlog.html";
  });
  document.getElementById("bc-feedback-ai").addEventListener("click", function () {
    window.location.href = "active-recall.html?view=chat";
  });
  document.getElementById("bc-feedback-scrim").addEventListener("click", closeFeedback);

  renderCopy();
  updateProgress();
  applyDemo();
})();
