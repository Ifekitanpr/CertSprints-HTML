(function () {
  var data = AR_DATA;
  var root = document.getElementById("ar");
  var introView = document.getElementById("ar-intro-view");
  var voiceView = document.getElementById("ar-voice-view");
  var chatView = document.getElementById("ar-chat-view");
  var logOverlay = document.getElementById("ar-log-overlay");
  var inputEl = document.getElementById("ar-input");
  var inputWrap = document.getElementById("ar-input-wrap");
  var userRow = document.getElementById("ar-user-row");
  var sent = false;
  var voiceControls = { micMuted: false, speakerMuted: false };
  var ICON = "assets/active-recall/icons/";

  function showView(name) {
    introView.classList.toggle("active", name === "intro");
    voiceView.classList.toggle("active", name === "voice");
    chatView.classList.toggle("active", name === "chat");
  }

  function openLog() {
    root.classList.add("log-open");
    logOverlay.classList.add("open");
    logOverlay.setAttribute("aria-hidden", "false");
  }

  function closeLog() {
    root.classList.remove("log-open");
    logOverlay.classList.remove("open");
    logOverlay.setAttribute("aria-hidden", "true");
  }

  function renderIntro() {
    document.getElementById("ar-intro-badge").textContent = data.intro.badge;
    document.getElementById("ar-intro-title").textContent = data.intro.title;
    document.getElementById("ar-intro-desc").textContent = data.intro.description;
    document.getElementById("ar-stat-interaction-label").textContent = data.intro.interactionLabel;
    document.getElementById("ar-stat-interaction-value").textContent = data.intro.interactionValue;
    document.getElementById("ar-stat-goal-label").textContent = data.intro.goalLabel;
    document.getElementById("ar-stat-goal-value").textContent = data.intro.goalValue;
    document.getElementById("ar-start-voice-label").textContent = data.intro.startVoiceLabel;
    document.getElementById("ar-start-text-label").textContent = data.intro.startTextLabel;
  }

  function renderVoice() {
    document.getElementById("ar-signal-label").textContent = data.voice.signalLabel;
    document.getElementById("ar-voice-title").textContent = data.voice.title;
    document.getElementById("ar-voice-subtitle").textContent = data.voice.subtitle;
    document.getElementById("ar-topic-label").textContent = data.voice.topicLabel;
    document.getElementById("ar-topic-value").textContent = data.voice.topicValue;
    document.getElementById("ar-try-chat-label").textContent = data.voice.tryChatLabel;
  }

  function applyMicMuted(muted) {
    voiceControls.micMuted = muted;
    var btn = document.getElementById("ar-mic-toggle");
    var img = document.getElementById("ar-mic-icon");
    btn.classList.toggle("is-muted", muted);
    btn.setAttribute("aria-pressed", muted ? "true" : "false");
    btn.setAttribute("aria-label", muted ? "Unmute microphone" : "Mute microphone");
    img.src = muted ? ICON + "mic-off-02-24.svg" : ICON + "mic-02-24.svg";
    img.className = "ar-glyph " + (muted ? "ar-glyph--mic-off-02-24" : "ar-glyph--mic-02-24");
    voiceView.classList.toggle("is-mic-muted", muted);
  }

  function applySpeakerMuted(muted) {
    voiceControls.speakerMuted = muted;
    var btn = document.getElementById("ar-volume-toggle");
    var img = document.getElementById("ar-volume-icon");
    btn.classList.toggle("is-muted", muted);
    btn.setAttribute("aria-pressed", muted ? "true" : "false");
    btn.setAttribute("aria-label", muted ? "Unmute speaker" : "Mute speaker");
    img.src = muted ? ICON + "volume-off-24.svg" : ICON + "volume-high-24.svg";
    img.className = "ar-glyph " + (muted ? "ar-glyph--volume-off-24" : "ar-glyph--volume-high-24");
    voiceView.classList.toggle("is-speaker-muted", muted);
  }

  function resetVoiceControls() {
    applyMicMuted(false);
    applySpeakerMuted(false);
  }

  function renderChat() {
    document.getElementById("ar-chat-title").textContent = data.chat.title;
    document.getElementById("ar-complete-label").textContent = data.chat.completeLabel;
    document.getElementById("ar-mentor-prompt").textContent = '"' + data.chat.mentorPrompt + '"';
    inputEl.placeholder = data.chat.placeholder;
  }

  function renderLog() {
    document.getElementById("ar-log-title").textContent = data.log.title;
    document.getElementById("ar-log-banner-label").textContent = data.log.completeBanner;
    document.getElementById("ar-log-summary").innerHTML =
      '<span class="ar-summary-accent">' +
      data.log.summaryAccent +
      "</span>" +
      data.log.summaryRest;
    document.getElementById("ar-log-complete-label").textContent = data.log.completeLabel;

    var entriesRoot = document.getElementById("ar-log-entries");
    entriesRoot.innerHTML = "";
    data.log.entries.forEach(function (entry) {
      var block = document.createElement("div");
      block.className = "ar-log-entry";
      block.innerHTML =
        '<div class="ar-log-stamp-row"><span class="ar-log-line"></span><span class="ar-log-stamp-text">STAMP ' +
        entry.stamp +
        '</span><span class="ar-log-line"></span></div><p class="ar-log-anchor-label">Anchor:</p><p class="ar-log-anchor">"' +
        entry.anchor +
        '"</p><div class="ar-log-user-box"><p class="ar-log-user-label">User:</p><p>"' +
        entry.user +
        '"</p></div>';
      entriesRoot.appendChild(block);
    });
  }

  function resetChatInput() {
    sent = false;
    inputEl.value = "";
    inputWrap.classList.remove("has-text");
    userRow.hidden = true;
  }

  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || sent) return;
    sent = true;
    document.getElementById("ar-user-response").textContent = '"' + text + '"';
    userRow.hidden = false;
    inputEl.value = "";
    inputWrap.classList.remove("has-text");
    document.getElementById("ar-chat-scroll").scrollTop = 9999;
  }

  function applyDemo() {
    var params = new URLSearchParams(window.location.search);
    var view = params.get("view");
    var demo = params.get("demo");

    if (view === "voice") showView("voice");
    if (view === "chat") showView("chat");
    if (view === "log") {
      showView("voice");
      openLog();
    }

    if (demo === "typed") {
      showView("chat");
      inputEl.value = "This is a test response";
      inputWrap.classList.add("has-text");
    }
    if (demo === "sent") {
      showView("chat");
      inputEl.value = data.chat.sampleResponse;
      sendMessage();
    }
  }

  document.getElementById("ar-start-voice").addEventListener("click", function () {
    resetVoiceControls();
    showView("voice");
  });
  document.getElementById("ar-start-text").addEventListener("click", function () {
    resetChatInput();
    showView("chat");
  });
  document.getElementById("ar-intro-back").addEventListener("click", function () {
    window.location.href = "sorting-type-2.html";
  });
  document.getElementById("ar-intro-help").addEventListener("click", function () {
    window.location.href = "help-support.html?from=active-recall";
  });

  document.getElementById("ar-voice-back").addEventListener("click", function () {
    showView("intro");
  });
  document.getElementById("ar-voice-help").addEventListener("click", function () {
    window.location.href = "help-support.html?from=active-recall";
  });
  document.getElementById("ar-try-chat").addEventListener("click", function () {
    resetChatInput();
    showView("chat");
  });
  document.getElementById("ar-end-call").addEventListener("click", openLog);
  document.getElementById("ar-mic-toggle").addEventListener("click", function () {
    applyMicMuted(!voiceControls.micMuted);
  });
  document.getElementById("ar-volume-toggle").addEventListener("click", function () {
    applySpeakerMuted(!voiceControls.speakerMuted);
  });

  document.getElementById("ar-chat-back").addEventListener("click", function () {
    showView("intro");
  });
  document.getElementById("ar-chat-voice").addEventListener("click", function () {
    showView("voice");
  });
  document.getElementById("ar-open-log").addEventListener("click", openLog);
  document.getElementById("ar-send").addEventListener("click", sendMessage);
  inputEl.addEventListener("input", function () {
    inputWrap.classList.toggle("has-text", inputEl.value.trim().length > 0);
  });
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  document.getElementById("ar-log-close").addEventListener("click", closeLog);
  document.getElementById("ar-log-complete").addEventListener("click", function () {
    window.location.href = "study-backlog.html";
  });

  renderIntro();
  renderVoice();
  renderChat();
  renderLog();
  applyDemo();
})();
