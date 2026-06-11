(function () {
  const data = window.COMMUNITY;
  if (!data) return;

  const ICON = data.ICON;
  const AVATAR = data.AVATAR;
  const IMAGE = data.IMAGE;

  const params = new URLSearchParams(window.location.search);
  const cohortId = params.get("cohort") || "pmp-general";
  const cohort =
    data.cohorts.find(function (c) {
      return c.id === cohortId;
    }) || data.cohorts[0];

  const state = {
    chatTab: "chats",
    searchMode: false,
    searchQuery: "",
    messageOptionsId: null,
    emojiOpen: false,
    replyTo: null,
    audioMode: null,
    modal: null,
    reportReason: null,
    audioSeconds: 0,
    audioPaused: false,
    audioTimer: null,
  };

  const el = {
    cohortName: document.getElementById("cmCohortName"),
    cohortMeta: document.getElementById("cmCohortMeta"),
    messages: document.getElementById("cmMessages"),
    chatHeader: document.getElementById("cmChatHeader"),
    searchHeader: document.getElementById("cmSearchHeader"),
    searchInput: document.getElementById("cmSearchInput"),
    searchEmpty: document.getElementById("cmSearchEmpty"),
    chatTabs: document.getElementById("cmChatTabs"),
    composer: document.getElementById("cmComposer"),
    sessionsPanel: document.getElementById("cmSessionsPanel"),
    membersPanel: document.getElementById("cmMembersPanel"),
    replyBar: document.getElementById("cmReplyBar"),
    replyLabel: document.getElementById("cmReplyLabel"),
    replyText: document.getElementById("cmReplyText"),
    replyThumb: document.getElementById("cmReplyThumb"),
    audioBar: document.getElementById("cmAudioBar"),
    audioTime: document.getElementById("cmAudioTime"),
    messageInput: document.getElementById("cmMessageInput"),
    msgOptionsOverlay: document.getElementById("cmMsgOptionsOverlay"),
    msgOptionsPanel: document.getElementById("cmMsgOptionsPanel"),
    emojiOverlay: document.getElementById("cmEmojiOverlay"),
    emojiGrid: document.getElementById("cmEmojiGrid"),
    deleteOverlay: document.getElementById("cmDeleteOverlay"),
    reportOverlay: document.getElementById("cmReportOverlay"),
    reportList: document.getElementById("cmReportList"),
  };

  function openOverlay(node) {
    node.classList.add("open");
    node.setAttribute("aria-hidden", "false");
  }

  function closeOverlay(node) {
    node.classList.remove("open");
    node.setAttribute("aria-hidden", "true");
  }

  function getMessage(id) {
    return data.messages.find(function (m) {
      return m.id === id;
    });
  }

  function filteredMessages() {
    if (!state.searchMode || !state.searchQuery.trim()) return data.messages;
    const q = state.searchQuery.trim().toLowerCase();
    return data.messages.filter(function (m) {
      return (m.text && m.text.toLowerCase().indexOf(q) >= 0) || (m.sender && m.sender.toLowerCase().indexOf(q) >= 0);
    });
  }

  function statusIcon(msg) {
    if (msg.status === "pending") {
      return (
        '<span class="cm-msg-status"><span class="cm-icon-slot cm-icon-slot--16">' +
        '<img class="cm-glyph cm-glyph--clock-01-16" src="' +
        ICON +
        'clock-01-16.svg" alt="" /></span></span>'
      );
    }
    if (msg.status === "sent") {
      return (
        '<span class="cm-msg-status"><span class="cm-icon-slot cm-icon-slot--16">' +
        '<img class="cm-glyph cm-glyph--tick-01-16" src="' +
        ICON +
        'tick-01-16.svg" alt="" /></span></span>'
      );
    }
    return "";
  }

  function showToast(msg) {
    const toast = document.getElementById("cmToast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("cm-screen-hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      toast.classList.add("cm-screen-hidden");
    }, 2200);
  }

  function replyPreviewHtml(msg) {
    if (!msg || !msg.replyTo) return "";
    const parent = getMessage(msg.replyTo);
    if (!parent) return "";
    const label = parent.sender || "Message";
    const text = parent.text
      ? parent.text.slice(0, 80)
      : parent.image || parent.imageOnly
        ? "Photo"
        : "Message";
    return (
      '<div class="cm-msg-reply-preview"><span class="cm-msg-reply-name">' +
      label +
      '</span><span class="cm-msg-reply-text">' +
      text +
      "</span></div>"
    );
  }

  function imageSrc(m) {
    if (m._blob && (m.imageOnly || m.image)) return m.imageOnly || m.image;
    return IMAGE + (m.image || m.imageOnly);
  }

  function renderMessage(m) {
    if (m.type === "ai") {
      return (
        '<article class="cm-msg cm-msg-ai" data-msg-id="' +
        m.id +
        '">' +
        '<img class="cm-msg-avatar" src="' +
        ICON +
        'ai-logo.svg" alt="" />' +
        '<div class="cm-msg-body">' +
        '<div class="cm-msg-meta"><span>' +
        m.sender +
        " • " +
        m.time +
        "</span></div>" +
        '<div class="cm-msg-bubble cm-msg-bubble--ai">' +
        m.text +
        "</div></div></article>"
      );
    }

    const out = m.type === "outgoing";
    const cls = out ? "cm-msg cm-msg--out" : "cm-msg";
    let bubble = "";

    if (m.image || m.imageOnly) {
      const src = imageSrc(m);
      bubble +=
        '<div class="cm-msg-image-wrap' +
        (m.imageOnly ? " cm-msg-image-only" : "") +
        '">' +
        '<img class="cm-msg-image" src="' +
        src +
        '" alt="" />' +
        '<button type="button" class="cm-msg-image-menu" data-msg-menu="' +
        m.id +
        '" aria-label="Message options"><img src="' +
        ICON +
        'more-dots.svg" alt="" style="width:14px;height:14px" /></button>' +
        "</div>";
    }

    if (m.text) {
      bubble +=
        replyPreviewHtml(m) +
        '<div class="cm-msg-bubble ' +
        (out ? "cm-msg-bubble--out" : "cm-msg-bubble--in") +
        '">' +
        m.text +
        "</div>";
    } else if (m.replyTo && replyPreviewHtml(m)) {
      bubble += replyPreviewHtml(m);
    }

    let reactions = "";
    if (m.reactions && m.reactions.length) {
      reactions = '<div class="cm-msg-reactions">';
      m.reactions.forEach(function (r) {
        reactions +=
          '<span class="cm-reaction-pill' +
          (r.active ? " is-active" : "") +
          '"><span>' +
          r.emoji +
          "</span> " +
          r.count +
          "</span>";
      });
      reactions += "</div>";
    }

    return (
      '<article class="' +
      cls +
      '" data-msg-id="' +
      m.id +
      '" data-options-type="' +
      (m.optionsType || "text") +
      '">' +
      '<img class="cm-msg-avatar" src="' +
      AVATAR +
      m.avatar +
      '" alt="" />' +
      '<div class="cm-msg-body">' +
      '<div class="cm-msg-meta"><span>' +
      m.sender +
      " • " +
      m.time +
      "</span>" +
      (out ? statusIcon(m) : "") +
      "</div>" +
      bubble +
      reactions +
      "</div></article>"
    );
  }

  function renderMessages() {
    const list = filteredMessages();
    el.messages.innerHTML = list.map(renderMessage).join("");
    el.searchEmpty.classList.toggle("is-visible", state.searchMode && !list.length);
    el.messages.classList.toggle("cm-screen-hidden", state.searchMode && !list.length);

    el.messages.querySelectorAll("[data-msg-id]").forEach(function (node) {
      const id = node.getAttribute("data-msg-id");
      const msg = getMessage(id);
      if (!msg || msg.type === "ai") return;

      node.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        openMessageOptions(id, node);
      });
      node.addEventListener("click", function (e) {
        if (e.target.closest("[data-msg-menu]")) return;
        openMessageOptions(id, node);
      });
    });

    el.messages.querySelectorAll(".cm-reaction-pill").forEach(function (pill) {
      pill.addEventListener("click", function (e) {
        e.stopPropagation();
        const article = pill.closest("[data-msg-id]");
        if (!article) return;
        const msg = getMessage(article.getAttribute("data-msg-id"));
        if (!msg || !msg.reactions) return;
        const emoji = pill.querySelector("span").textContent.trim();
        const reaction = msg.reactions.find(function (r) {
          return r.emoji === emoji;
        });
        if (reaction) {
          reaction.active = !reaction.active;
          reaction.count += reaction.active ? 1 : -1;
          if (reaction.count <= 0) {
            msg.reactions = msg.reactions.filter(function (r) {
              return r.emoji !== emoji;
            });
          }
        }
        renderMessages();
      });
    });

    el.messages.querySelectorAll("[data-msg-menu]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        openMessageOptions(btn.getAttribute("data-msg-menu"), btn.closest("[data-msg-id]"));
      });
    });
  }

  function openMessageOptions(id, anchor) {
    const msg = getMessage(id);
    if (!msg) return;
    state.messageOptionsId = id;

    const isOwner = msg.type === "outgoing";
    const isImage = msg.optionsType === "image" || msg.image || msg.imageOnly;

    let items =
      '<div class="cm-msg-options-emoji">' +
      data.emojiQuick
        .map(function (e) {
          return '<button type="button" data-emoji-react="' + e + '">' + e + "</button>";
        })
        .join("") +
      '<button type="button" data-emoji-more>+</button></div>';

    items +=
      '<button type="button" class="cm-msg-options-item" data-action="reply">' +
      '<span class="cm-icon-slot cm-icon-slot--16"><img class="cm-glyph cm-glyph--reply-16" src="' +
      ICON +
      'reply-16.svg" alt="" /></span> Reply</button>';

    if (!isImage) {
      items +=
        '<button type="button" class="cm-msg-options-item" data-action="copy">' +
        '<span class="cm-icon-slot cm-icon-slot--16"><img class="cm-glyph cm-glyph--copy-16" src="' +
        ICON +
        'copy-16.svg" alt="" /></span> Copy</button>';
    }

    if (isOwner) {
      items +=
        '<button type="button" class="cm-msg-options-item cm-msg-options-item--danger" data-action="delete">' +
        '<span class="cm-icon-slot cm-icon-slot--16"><img class="cm-glyph cm-glyph--delete-16" src="' +
        ICON +
        'delete-16.svg" alt="" /></span> Delete</button>';
    } else {
      items +=
        '<button type="button" class="cm-msg-options-item" data-action="report">' +
        '<span class="cm-icon-slot cm-icon-slot--16"><img class="cm-glyph cm-glyph--report-16" src="' +
        ICON +
        'report-16.svg" alt="" /></span> Report</button>';
    }

    el.msgOptionsPanel.innerHTML = items;

    const rect = anchor.getBoundingClientRect();
    const rootRect = document.getElementById("cmChatRoot").getBoundingClientRect();
    const top = Math.min(rect.top - rootRect.top - 20, rootRect.height - 280);
    el.msgOptionsPanel.style.top = Math.max(80, top) + "px";

    openOverlay(el.msgOptionsOverlay);
  }

  function closeMessageOptions() {
    state.messageOptionsId = null;
    closeOverlay(el.msgOptionsOverlay);
  }

  function setReply(msg) {
    state.replyTo = msg;
    el.replyBar.classList.add("is-visible");
    el.replyLabel.textContent = "Replying to " + msg.sender;
    if (msg.image || msg.imageOnly) {
      el.replyText.textContent = "Photo";
      el.replyThumb.src = imageSrc(msg);
      el.replyThumb.classList.remove("cm-screen-hidden");
    } else if (msg.type === "ai") {
      el.replyText.textContent = msg.text.slice(0, 80);
      el.replyThumb.classList.add("cm-screen-hidden");
    } else {
      el.replyText.textContent = msg.text ? msg.text.slice(0, 120) : "Message";
      el.replyThumb.classList.add("cm-screen-hidden");
    }
    el.messageInput.focus();
  }

  function clearReply() {
    state.replyTo = null;
    el.replyBar.classList.remove("is-visible");
  }

  function setSearchMode(on) {
    state.searchMode = on;
    el.chatHeader.classList.toggle("cm-screen-hidden", on);
    el.searchHeader.classList.toggle("is-visible", on);
    el.chatTabs.classList.toggle("cm-screen-hidden", on);
    el.composer.classList.toggle("cm-screen-hidden", on || state.chatTab !== "chats");
    el.sessionsPanel.classList.toggle("cm-screen-hidden", on || state.chatTab !== "sessions");
    el.membersPanel.classList.toggle("cm-screen-hidden", on || state.chatTab !== "members");
    if (on) {
      el.searchInput.focus();
    } else {
      state.searchQuery = "";
      el.searchInput.value = "";
    }
    renderMessages();
  }

  function setAudioMode(mode) {
    state.audioMode = mode;
    el.audioBar.classList.toggle("is-visible", !!mode);
    el.messageInput.closest(".cm-composer-input-wrap").classList.toggle("cm-screen-hidden", mode === "recording" || mode === "paused" || mode === "expanded");
    if (mode === "recording") {
      state.audioSeconds = 0;
      state.audioPaused = false;
      updateAudioTime();
      if (state.audioTimer) clearInterval(state.audioTimer);
      state.audioTimer = setInterval(function () {
        if (!state.audioPaused) {
          state.audioSeconds += 1;
          updateAudioTime();
        }
      }, 1000);
    } else if (state.audioTimer) {
      clearInterval(state.audioTimer);
      state.audioTimer = null;
    }
  }

  function updateAudioTime() {
    const m = Math.floor(state.audioSeconds / 60);
    const s = state.audioSeconds % 60;
    el.audioTime.textContent = m + ":" + (s < 10 ? "0" : "") + s;
  }

  function renderEmojiGrid() {
    el.emojiGrid.innerHTML = data.emojiGrid
      .map(function (e) {
        return '<button type="button" data-emoji-pick="' + e + '">' + e + "</button>";
      })
      .join("");
  }

  function renderReportList() {
    el.reportList.innerHTML = data.reportReasons
      .map(function (r, i) {
        return (
          "<li><label><input type=\"radio\" name=\"cmReport\" value=\"" +
          r +
          "\"" +
          (i === 0 ? " checked" : "") +
          " /> " +
          r +
          "</label></li>"
        );
      })
      .join("");
  }

  function setChatTab(tab) {
    state.chatTab = tab;
    document.querySelectorAll("[data-chat-tab]").forEach(function (b) {
      const active = b.getAttribute("data-chat-tab") === tab;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    const isChats = tab === "chats";
    const isSessions = tab === "sessions";
    const isMembers = tab === "members";

    el.messages.classList.toggle("cm-tab-panel-hidden", !isChats);
    el.composer.classList.toggle("cm-screen-hidden", !isChats);
    el.sessionsPanel.classList.toggle("cm-tab-panel-hidden", !isSessions);
    el.membersPanel.classList.toggle("cm-tab-panel-hidden", !isMembers);
    el.searchEmpty.classList.toggle("cm-screen-hidden", !isChats);

    if (isChats) {
      renderMessages();
    } else if (isSessions && window.CmSessions) {
      window.CmSessions.mount(el.sessionsPanel);
    } else if (isMembers && window.CmMembers) {
      window.CmMembers.mount(el.membersPanel);
    }
  }

  window.cmSessionsShowRequestSent = function (form) {
    const card = document.getElementById("cmRequestSentCard");
    if (card) {
      card.innerHTML =
        '<div class="cm-sess-card-top">' +
        '<div class="cm-sess-date-chip"><p class="cm-sess-date-dow">Mon</p><p class="cm-sess-date-num">09</p></div>' +
        '<div class="cm-sess-card-body">' +
        "<h3>" +
        (form.title || "PMP Exam Strategy & Time Management") +
        "</h3>" +
        "<p>" +
        (form.discussion || "Tips on how to pace yourself through 180 questions.") +
        "</p>" +
        '<div class="cm-sess-time-row"><span class="cm-icon-slot cm-icon-slot--16"><img class="cm-glyph cm-glyph--clock-01-16" src="' +
        ICON +
        'clock-01-16.svg" alt="" /></span><span>' +
        (form.time || "12:00PM") +
        " - 03:00PM</span></div></div></div>";
    }
    openOverlay(document.getElementById("cmRequestSentOverlay"));
  };

  function initHeader() {
    el.cohortName.textContent = cohort.title;
    el.cohortMeta.textContent =
      cohort.membersCount + " members • 🟢 " + cohort.onlineCount + " Online";
  }

  document.getElementById("cmChatBack").addEventListener("click", function () {
    window.location.href = new URL("community/community.html", document.baseURI).href;
  });

  document.getElementById("cmLeaveCohort").addEventListener("click", function () {
    window.location.href = new URL("community/community.html", document.baseURI).href;
  });

  document.getElementById("cmSearchOpen").addEventListener("click", function () {
    setSearchMode(true);
  });

  document.getElementById("cmSearchClose").addEventListener("click", function () {
    setSearchMode(false);
  });

  el.searchInput.addEventListener("input", function () {
    state.searchQuery = el.searchInput.value;
    renderMessages();
  });

  document.querySelectorAll("[data-chat-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setChatTab(btn.getAttribute("data-chat-tab"));
    });
  });

  document.getElementById("cmEmojiOpen").addEventListener("click", function () {
    openOverlay(el.emojiOverlay);
  });

  document.getElementById("cmEmojiScrim").addEventListener("click", function () {
    closeOverlay(el.emojiOverlay);
  });

  el.emojiGrid.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-emoji-pick]");
    if (!btn) return;
    el.messageInput.value += btn.getAttribute("data-emoji-pick");
    closeOverlay(el.emojiOverlay);
    el.messageInput.focus();
  });

  document.getElementById("cmAttachBtn").addEventListener("click", function () {
    document.getElementById("cmAttachInput").click();
  });

  document.getElementById("cmAttachInput").addEventListener("change", function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    data.messages.push({
      id: "img-" + Date.now(),
      type: "outgoing",
      sender: "You",
      avatar: "you.jpg",
      time: "Now",
      imageOnly: url,
      optionsType: "image",
      status: "pending",
      _blob: true,
    });
    e.target.value = "";
    renderMessages();
    el.messages.scrollTop = el.messages.scrollHeight;
    promotePendingMessages();
  });

  document.getElementById("cmReplyClose").addEventListener("click", clearReply);

  function promotePendingMessages() {
    data.messages.forEach(function (m) {
      if (m.status === "pending" && !m._promoting) {
        m._promoting = true;
        setTimeout(function () {
          if (m.status === "pending") {
            m.status = "sent";
            renderMessages();
          }
        }, 1200);
      }
    });
  }

  window.cmShowToast = showToast;

  document.getElementById("cmMicBtn").addEventListener("click", function () {
    setAudioMode("recording");
  });

  document.getElementById("cmAudioCancel").addEventListener("click", function () {
    setAudioMode(null);
  });

  document.getElementById("cmAudioToggle").addEventListener("click", function () {
    state.audioPaused = !state.audioPaused;
    setAudioMode(state.audioPaused ? "paused" : "recording");
  });

  document.getElementById("cmAudioSend").addEventListener("click", function () {
    setAudioMode(null);
    data.messages.push({
      id: "audio-" + Date.now(),
      type: "outgoing",
      sender: "You",
      avatar: "you.jpg",
      time: "Now",
      text: "🎤 Voice message (" + el.audioTime.textContent + ")",
      status: "sent",
    });
    renderMessages();
    el.messages.scrollTop = el.messages.scrollHeight;
  });

  document.getElementById("cmSendBtn").addEventListener("click", sendMessage);
  el.messageInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  function sendMessage() {
    const text = el.messageInput.value.trim();
    if (!text) return;
    data.messages.push({
      id: "local-" + Date.now(),
      type: "outgoing",
      sender: "You",
      avatar: "you.jpg",
      time: "Now",
      text: text,
      status: "pending",
      replyTo: state.replyTo ? state.replyTo.id : null,
    });
    el.messageInput.value = "";
    clearReply();
    renderMessages();
    el.messages.scrollTop = el.messages.scrollHeight;
    promotePendingMessages();
  }

  document.getElementById("cmMsgOptionsScrim").addEventListener("click", closeMessageOptions);

  el.msgOptionsPanel.addEventListener("click", function (e) {
    const msg = getMessage(state.messageOptionsId);
    if (!msg) return;

    const actionBtn = e.target.closest("[data-action]");
    const emojiBtn = e.target.closest("[data-emoji-react]");
    const moreEmoji = e.target.closest("[data-emoji-more]");

    if (emojiBtn) {
      if (!msg.reactions) msg.reactions = [];
      const em = emojiBtn.getAttribute("data-emoji-react");
      const existing = msg.reactions.find(function (r) {
        return r.emoji === em;
      });
      if (existing) existing.count += 1;
      else msg.reactions.push({ emoji: em, count: 1, active: true });
      closeMessageOptions();
      renderMessages();
      return;
    }

    if (moreEmoji) {
      closeMessageOptions();
      openOverlay(el.emojiOverlay);
      return;
    }

    if (!actionBtn) return;

    const action = actionBtn.getAttribute("data-action");
    closeMessageOptions();

    if (action === "reply") {
      setReply(msg);
      return;
    }
    if (action === "copy" && msg.text) {
      navigator.clipboard.writeText(msg.text).then(function () {
        showToast("Copied to clipboard");
      }).catch(function () {
        showToast("Copied");
      });
      return;
    }
    if (action === "delete") {
      openOverlay(el.deleteOverlay);
      return;
    }
    if (action === "report") {
      openOverlay(el.reportOverlay);
      return;
    }
  });

  document.getElementById("cmDeleteCancel").addEventListener("click", function () {
    closeOverlay(el.deleteOverlay);
  });
  document.getElementById("cmDeleteModalClose").addEventListener("click", function () {
    closeOverlay(el.deleteOverlay);
  });
  document.getElementById("cmDeleteConfirm").addEventListener("click", function () {
    const id = state.messageOptionsId;
    const idx = data.messages.findIndex(function (m) {
      return m.id === id;
    });
    if (idx >= 0) data.messages.splice(idx, 1);
    closeOverlay(el.deleteOverlay);
    renderMessages();
  });

  document.getElementById("cmReportCancel").addEventListener("click", function () {
    closeOverlay(el.reportOverlay);
  });
  document.getElementById("cmReportModalClose").addEventListener("click", function () {
    closeOverlay(el.reportOverlay);
  });
  document.getElementById("cmReportSubmit").addEventListener("click", function () {
    closeOverlay(el.reportOverlay);
    showToast("Report submitted");
  });

  document.getElementById("cmRequestSentOk").addEventListener("click", function () {
    closeOverlay(document.getElementById("cmRequestSentOverlay"));
    if (window.CmSessions) {
      window.CmSessions.showList();
    }
  });

  document.getElementById("cmRequestSentScrim").addEventListener("click", function () {
    closeOverlay(document.getElementById("cmRequestSentOverlay"));
    if (window.CmSessions) {
      window.CmSessions.showList();
    }
  });

  initHeader();
  renderEmojiGrid();
  renderReportList();
  renderMessages();
  el.messages.scrollTop = el.messages.scrollHeight;
  promotePendingMessages();

  const initialTab = params.get("tab");
  if (initialTab === "sessions" || initialTab === "members") {
    setChatTab(initialTab);
  }
})();
