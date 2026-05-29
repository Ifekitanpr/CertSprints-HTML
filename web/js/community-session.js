(function () {
  const data = window.COMMUNITY;
  if (!data || !data.ongoingSession) return;

  const ICON = data.ICON;
  const IMAGE = data.IMAGE;
  const AVATAR = data.AVATAR;
  const session = data.ongoingSession;

  const params = new URLSearchParams(window.location.search);
  const isHost = params.get("role") === "host";

  const state = {
    open: false,
    minimized: false,
    tab: "members",
    membersView: "grid",
    micState: "idle",
    screenShare: "none",
    commentOptionsId: null,
    comments: session.comments.slice(),
    micRequestTimer: null,
  };

  const el = {
    overlay: document.getElementById("cmOngoingOverlay"),
    main: document.getElementById("cmOngoingMain"),
    footer: document.getElementById("cmOngoingFooter"),
    minimized: document.getElementById("cmMinimizedPlayer"),
    commentPanel: document.getElementById("cmCommentOptionsPanel"),
    speakerPanel: document.getElementById("cmSpeakerRequestsPanel"),
  };

  if (!el.overlay || !el.main || !el.footer) return;

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

  function openOverlay(node) {
    if (!node) return;
    node.classList.add("open");
    node.setAttribute("aria-hidden", "false");
  }

  function closeOverlay(node) {
    if (!node) return;
    node.classList.remove("open");
    node.setAttribute("aria-hidden", "true");
  }

  function glyph(name, file, slot) {
    return (
      '<span class="cm-icon-slot cm-icon-slot--' +
      slot +
      '"><img class="cm-glyph cm-glyph--' +
      name +
      '" src="' +
      ICON +
      file +
      '" alt="" /></span>'
    );
  }

  function micGlyph(on, slot) {
    if (on) return glyph("mic-02-18", "mic-02-18.svg", slot);
    return glyph("mic-off-02-16", "mic-off-02-16.svg", slot);
  }

  function renderHero() {
    const listening = session.listening || session.listenerTotal;
    return (
      '<article class="cm-ongoing-hero">' +
      '<div class="cm-ongoing-hero-bg" aria-hidden="true"></div>' +
      '<div class="cm-ongoing-hero-inner">' +
      '<div class="cm-ongoing-hero-meta">' +
      '<span class="cm-ongoing-live-badge">LIVE</span>' +
      "<span>" +
      listening +
      " Listeners</span></div>" +
      "<h3 class=\"cm-ongoing-hero-title\">" +
      session.title +
      "</h3>" +
      '<p class="cm-ongoing-hero-desc">' +
      session.description +
      "</p>" +
      '<div class="cm-ongoing-hero-time">' +
      glyph("clock-01-white-16", "clock-01-white-16.svg", "16") +
      "<span>" +
      session.timeStart +
      " - " +
      session.timeEnd +
      "</span></div></div></article>"
    );
  }

  function renderTabs() {
    const tabs = [
      {
        id: "members",
        label: "Members",
        activeIcon: "user-group-white-18",
        activeFile: "user-group-white-18.svg",
        idleIcon: "user-group-18",
        idleFile: "user-group-18.svg",
      },
      {
        id: "comments",
        label: "Comments",
        activeIcon: "message-01-white-18",
        activeFile: "message-01-white-18.svg",
        idleIcon: "chats-tab",
        idleFile: "chats-tab.svg",
      },
      {
        id: "details",
        label: "Details",
        activeIcon: "more-horizontal-circle-18",
        activeFile: "more-horizontal-circle-18.svg",
        idleIcon: "more-horizontal-circle-18",
        idleFile: "more-horizontal-circle-18.svg",
      },
    ];
    return (
      '<div class="cm-ongoing-tabs">' +
      tabs
        .map(function (t) {
          const active = state.tab === t.id;
          const icon = active ? t.activeIcon : t.idleIcon;
          const file = active ? t.activeFile : t.idleFile;
          return (
            '<button type="button" class="cm-ongoing-tab' +
            (active ? " is-active" : "") +
            '" data-ongoing-tab="' +
            t.id +
            '">' +
            glyph(icon, file, "18") +
            t.label +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderSpeakerCard(sp, large) {
    const size = large ? 56 : 48;
    return (
      '<div class="cm-ongoing-person">' +
      '<img class="cm-ongoing-avatar cm-ongoing-avatar--' +
      (large ? "lg" : "md") +
      '" style="width:' +
      size +
      "px;height:" +
      size +
      'px" src="' +
      AVATAR +
      sp.avatar +
      '" alt="" />' +
      "<strong>" +
      sp.name +
      "</strong>" +
      '<div class="cm-ongoing-role">' +
      micGlyph(sp.micOn, "16") +
      "<span" +
      (sp.role === "Host" ? ' class="is-host"' : "") +
      ">" +
      sp.role +
      "</span></div></div>"
    );
  }

  function renderMembers() {
    if (state.membersView === "all") {
      const grid = session.listeners
        .map(function (l) {
          return (
            '<div class="cm-ongoing-person cm-ongoing-person--sm">' +
            '<img class="cm-ongoing-avatar cm-ongoing-avatar--md" src="' +
            AVATAR +
            l.avatar +
            '" alt="" />' +
            "<strong>" +
            l.name +
            '</strong><span class="cm-ongoing-role-label">Listener</span></div>'
          );
        })
        .join("");
      return (
        '<div class="cm-ongoing-section">' +
        '<button type="button" class="cm-ongoing-back-link" data-members-view="grid">← Back to speakers</button>' +
        "<h3>All listeners (" +
        session.listenerTotal +
        ")</h3>" +
        '<div class="cm-ongoing-grid cm-ongoing-grid--listeners">' +
        grid +
        "</div></div>"
      );
    }

    const speakers = session.speakers.map(function (s) {
      return renderSpeakerCard(s, true);
    }).join("");
    const preview = session.listeners.slice(0, 9).map(function (l) {
      return (
        '<div class="cm-ongoing-person cm-ongoing-person--sm">' +
        '<img class="cm-ongoing-avatar cm-ongoing-avatar--md" src="' +
        AVATAR +
        l.avatar +
        '" alt="" />' +
        "<strong>" +
        l.name +
        '</strong><span class="cm-ongoing-role-label">Listener</span></div>'
      );
    }).join("");

    return (
      '<div class="cm-ongoing-section">' +
      '<div class="cm-ongoing-section-head">' +
      micGlyph(true, "16") +
      "<span>Speakers</span><span class=\"cm-ongoing-dot\">•</span><span>" +
      session.speakers.length +
      "</span></div>" +
      '<div class="cm-ongoing-grid cm-ongoing-grid--speakers">' +
      speakers +
      "</div>" +
      '<div class="cm-ongoing-divider"></div>' +
      '<div class="cm-ongoing-section-head cm-ongoing-section-head--between">' +
      '<div class="cm-ongoing-section-head">' +
      micGlyph(true, "16") +
      "<span>Listeners</span><span class=\"cm-ongoing-dot\">•</span><span>" +
      session.listenerTotal +
      "</span></div>" +
      '<button type="button" class="cm-ongoing-link-btn" data-members-view="all">Show all listeners</button></div>' +
      '<div class="cm-ongoing-grid cm-ongoing-grid--listeners">' +
      preview +
      "</div></div>"
    );
  }

  function renderComments() {
    if (!state.comments.length) {
      return (
        '<div class="cm-ongoing-empty">' +
        glyph("chats-tab", "chats-tab.svg", "18") +
        "<h3>No comments yet</h3>" +
        "<p>Be the first to share your thoughts during this session.</p></div>"
      );
    }
    return (
      '<div class="cm-ongoing-comments">' +
      state.comments
        .map(function (c) {
          return (
            '<article class="cm-ongoing-comment" data-comment-id="' +
            c.id +
            '">' +
            '<img src="' +
            AVATAR +
            c.avatar +
            '" alt="" />' +
            '<div><div class="cm-ongoing-comment-meta"><strong>' +
            c.sender +
            "</strong><span>• " +
            c.time +
            "</span></div>" +
            "<p>" +
            c.text +
            "</p></div></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderDetails() {
    const requests =
      isHost && session.speakerRequests.length
        ? '<button type="button" class="cm-ongoing-requests-btn" id="cmOpenSpeakerRequests">' +
          session.speakerRequests.length +
          " speaker requests</button>"
        : "";
    const micBanner =
      state.micState === "requesting"
        ? '<div class="cm-ongoing-banner cm-ongoing-banner--pending">Mic request pending…</div>'
        : state.micState === "declined"
          ? '<div class="cm-ongoing-banner cm-ongoing-banner--declined">Your mic request was declined</div>'
          : state.micState === "active"
            ? '<div class="cm-ongoing-banner cm-ongoing-banner--active">You are speaking</div>'
            : "";

    return (
      micBanner +
      '<div class="cm-ongoing-details">' +
      "<h3>About this session</h3>" +
      "<p>" +
      session.description +
      "</p>" +
      '<dl class="cm-ongoing-details-list">' +
      "<dt>Host</dt><dd>" +
      session.host +
      "</dd>" +
      "<dt>Time</dt><dd>" +
      session.timeStart +
      " - " +
      session.timeEnd +
      "</dd>" +
      "<dt>Listeners</dt><dd>" +
      session.listenerTotal +
      "</dd></dl>" +
      requests +
      (isHost
        ? '<button type="button" class="cm-ongoing-danger-text" id="cmEndSessionOpen">End session for everyone</button>'
        : "") +
      "</div>"
    );
  }

  function renderTabContent() {
    if (state.tab === "members") return renderMembers();
    if (state.tab === "comments") return renderComments();
    return renderDetails();
  }

  function renderMain() {
    el.main.innerHTML =
      renderHero() +
      renderTabs() +
      '<div class="cm-ongoing-panel">' +
      renderTabContent() +
      "</div>";
    bindMainEvents();
  }

  function sendComment() {
    const input = el.footer.querySelector("#cmCommentInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    state.comments.push({
      id: "c-" + Date.now(),
      sender: "You",
      avatar: "you.jpg",
      time: "Now",
      text: text,
      isOwner: true,
    });
    input.value = "";
    renderMain();
    renderFooter();
  }

  function renderFooter() {
    if (state.minimized) {
      el.footer.innerHTML = "";
      return;
    }

    if (state.tab === "comments") {
      el.footer.innerHTML =
        '<div class="cm-ongoing-comment-compose">' +
        '<input type="text" id="cmCommentInput" placeholder="Add a comment…" />' +
        '<button type="button" class="cm-ongoing-comment-send" id="cmCommentSend" aria-label="Send">' +
        glyph("sent-20", "sent-20.svg", "20") +
        "</button></div>";
      const send = el.footer.querySelector("#cmCommentSend");
      const input = el.footer.querySelector("#cmCommentInput");
      if (send && input) {
        send.addEventListener("click", sendComment);
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendComment();
          }
        });
      }
      return;
    }

    let micBtn = "";
    if (state.micState === "idle") {
      micBtn =
        '<button type="button" class="cm-ongoing-mic-btn" id="cmMicRequest">' +
        glyph("mic-02-white-footer-20", "mic-02-white-footer-20.svg", "20") +
        " Request</button>";
    } else if (state.micState === "requesting") {
      micBtn = '<button type="button" class="cm-ongoing-mic-btn is-pending" disabled>Requesting…</button>';
    } else if (state.micState === "declined") {
      micBtn =
        '<button type="button" class="cm-ongoing-mic-btn" id="cmMicRequest">' +
        glyph("mic-02-white-footer-20", "mic-02-white-footer-20.svg", "20") +
        " Request again</button>";
    } else if (state.micState === "active") {
      micBtn =
        '<button type="button" class="cm-ongoing-mic-btn is-active" id="cmMicMute">' +
        glyph("mic-02-white-footer-20", "mic-02-white-footer-20.svg", "20") +
        " Mute</button>";
    }

    const shareBtn = isHost
      ? '<button type="button" class="cm-ongoing-share-btn" id="cmScreenShareBtn">Share screen</button>'
      : "";

    el.footer.innerHTML =
      '<div class="cm-ongoing-footer-inner">' +
      '<button type="button" class="cm-ongoing-react-btn" aria-label="Add reaction">' +
      glyph("add-reaction-24", "add-reaction-24.svg", "24") +
      "</button>" +
      '<div class="cm-ongoing-footer-actions">' +
      micBtn +
      shareBtn +
      '<button type="button" class="cm-ongoing-leave-btn" id="cmLeaveSessionOpen" aria-label="Leave session">' +
      glyph("logout-red-24", "logout-red-24.svg", "24") +
      "</button></div></div>";

    bindFooterEvents();
  }

  function renderCommentOptions(commentId) {
    const c = state.comments.find(function (x) {
      return x.id === commentId;
    });
    if (!c || !el.commentPanel) return;
    el.commentPanel.innerHTML =
      '<button type="button" class="cm-msg-options-item" data-comment-action="copy">' +
      glyph("copy-16", "copy-16.svg", "16") +
      " Copy</button>" +
      (c.isOwner
        ? '<button type="button" class="cm-msg-options-item cm-msg-options-item--danger" data-comment-action="delete">' +
          glyph("delete-16", "delete-16.svg", "16") +
          " Delete</button>"
        : '<button type="button" class="cm-msg-options-item" data-comment-action="report">' +
          glyph("report-16", "report-16.svg", "16") +
          " Report</button>");
    openOverlay(document.getElementById("cmCommentOptionsOverlay"));
  }

  function renderSpeakerSheet() {
    if (!el.speakerPanel) return;
    const rows = session.speakerRequests
      .map(function (r) {
        return (
          '<div class="cm-speaker-row">' +
          '<img src="' +
          AVATAR +
          r.avatar +
          '" alt="" /><span>' +
          r.name +
          '</span><button type="button" data-accept-speaker="' +
          r.id +
          '">Accept</button><button type="button" data-decline-speaker="' +
          r.id +
          '">Decline</button></div>'
        );
      })
      .join("");
    el.speakerPanel.innerHTML =
      '<h3>Speaker requests</h3>' +
      (rows || '<p class="cm-speaker-empty">No pending requests</p>') +
      '<button type="button" class="cm-speaker-close" id="cmSpeakerSheetClose">Close</button>';
    openOverlay(document.getElementById("cmSpeakerRequestsOverlay"));
  }

  function requestMic() {
    if (state.micState === "requesting" || state.micState === "active") return;
    if (isHost) {
      state.micState = "active";
      renderMain();
      renderFooter();
      return;
    }
    state.micState = "requesting";
    const exists = session.speakerRequests.some(function (r) {
      return r.id === "sr-you";
    });
    if (!exists) {
      session.speakerRequests.push({
        id: "sr-you",
        name: "You",
        avatar: "you.jpg",
      });
    }
    if (state.micRequestTimer) clearTimeout(state.micRequestTimer);
    state.micRequestTimer = setTimeout(function () {
      acceptSpeaker("sr-you");
    }, 2500);
    renderMain();
    renderFooter();
  }

  function acceptSpeaker(id) {
    const idx = session.speakerRequests.findIndex(function (r) {
      return r.id === id;
    });
    if (idx < 0) return;
    const person = session.speakerRequests.splice(idx, 1)[0];
    const alreadySpeaker = session.speakers.some(function (s) {
      return s.name === person.name;
    });
    if (!alreadySpeaker) {
      session.speakers.push({
        name: person.name,
        role: "Speaker",
        avatar: person.avatar,
        micOn: true,
      });
    }
    if (person.id === "sr-you" || person.name === "You") {
      state.micState = "active";
      if (state.micRequestTimer) {
        clearTimeout(state.micRequestTimer);
        state.micRequestTimer = null;
      }
    }
    renderMain();
    renderFooter();
  }

  function declineSpeaker(id) {
    session.speakerRequests = session.speakerRequests.filter(function (r) {
      return r.id !== id;
    });
    if (id === "sr-you") {
      state.micState = "declined";
      if (state.micRequestTimer) {
        clearTimeout(state.micRequestTimer);
        state.micRequestTimer = null;
      }
    }
    renderMain();
    renderFooter();
  }

  function bindMainEvents() {
    el.main.querySelectorAll("[data-ongoing-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.tab = btn.getAttribute("data-ongoing-tab");
        renderMain();
        renderFooter();
      });
    });

    el.main.querySelectorAll("[data-members-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.membersView = btn.getAttribute("data-members-view");
        renderMain();
      });
    });

    el.main.querySelectorAll(".cm-ongoing-comment").forEach(function (node) {
      node.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        state.commentOptionsId = node.getAttribute("data-comment-id");
        renderCommentOptions(state.commentOptionsId);
      });
      node.addEventListener("click", function () {
        state.commentOptionsId = node.getAttribute("data-comment-id");
        renderCommentOptions(state.commentOptionsId);
      });
    });

    const openReq = el.main.querySelector("#cmOpenSpeakerRequests");
    if (openReq) openReq.addEventListener("click", renderSpeakerSheet);

    const endOpen = el.main.querySelector("#cmEndSessionOpen");
    if (endOpen) {
      endOpen.addEventListener("click", function () {
        openOverlay(document.getElementById("cmEndSessionOverlay"));
      });
    }
  }

  function bindFooterEvents() {
    const reactBtn = el.footer.querySelector(".cm-ongoing-react-btn");
    if (reactBtn) {
      reactBtn.addEventListener("click", function () {
        showToast("🎉 Reaction sent!");
      });
    }

    const micReq = el.footer.querySelector("#cmMicRequest");
    if (micReq) micReq.addEventListener("click", requestMic);

    const micMute = el.footer.querySelector("#cmMicMute");
    if (micMute) {
      micMute.addEventListener("click", function () {
        state.micState = "idle";
        renderFooter();
      });
    }

    const share = el.footer.querySelector("#cmScreenShareBtn");
    if (share) {
      share.addEventListener("click", function () {
        openOverlay(document.getElementById("cmScreenPromptOverlay"));
      });
    }

    const leave = el.footer.querySelector("#cmLeaveSessionOpen");
    if (leave) {
      leave.addEventListener("click", function () {
        openOverlay(document.getElementById("cmLeaveSessionOverlay"));
      });
    }
  }

  function openSheet() {
    state.open = true;
    state.minimized = false;
    el.overlay.classList.add("is-open");
    el.overlay.setAttribute("aria-hidden", "false");
    if (el.minimized) el.minimized.classList.add("cm-screen-hidden");
    renderMain();
    renderFooter();
  }

  function closeSheet() {
    state.open = false;
    state.minimized = false;
    el.overlay.classList.remove("is-open", "is-minimized");
    el.overlay.setAttribute("aria-hidden", "true");
    if (el.minimized) el.minimized.classList.add("cm-screen-hidden");
  }

  function minimizeSheet() {
    state.open = false;
    state.minimized = true;
    el.overlay.classList.remove("is-open");
    el.overlay.classList.add("is-minimized");
    el.overlay.setAttribute("aria-hidden", "true");
    if (el.minimized) {
      el.minimized.classList.remove("cm-screen-hidden");
      const title = document.getElementById("cmMinimizedTitle");
      if (title) title.textContent = session.title;
    }
    el.footer.innerHTML = "";
  }

  function restoreSheet() {
    openSheet();
  }

  function bind(id, event, fn) {
    const node = document.getElementById(id);
    if (node) node.addEventListener(event, fn);
  }

  bind("cmSessionClose", "click", closeSheet);
  bind("cmSessionMinimize", "click", minimizeSheet);
  bind("cmOngoingScrim", "click", minimizeSheet);
  bind("cmMinimizedExpand", "click", restoreSheet);

  bind("cmScreenPromptCancel", "click", function () {
    closeOverlay(document.getElementById("cmScreenPromptOverlay"));
  });
  bind("cmScreenPromptScrim", "click", function () {
    closeOverlay(document.getElementById("cmScreenPromptOverlay"));
  });
  bind("cmScreenPromptConfirm", "click", function () {
    closeOverlay(document.getElementById("cmScreenPromptOverlay"));
    showToast("Screen sharing started");
  });

  bind("cmLeaveSessionCancel", "click", function () {
    closeOverlay(document.getElementById("cmLeaveSessionOverlay"));
  });
  bind("cmLeaveSessionClose", "click", function () {
    closeOverlay(document.getElementById("cmLeaveSessionOverlay"));
  });
  bind("cmLeaveSessionConfirm", "click", function () {
    closeOverlay(document.getElementById("cmLeaveSessionOverlay"));
    closeSheet();
  });

  bind("cmEndSessionCancel", "click", function () {
    closeOverlay(document.getElementById("cmEndSessionOverlay"));
  });
  bind("cmEndSessionClose", "click", function () {
    closeOverlay(document.getElementById("cmEndSessionOverlay"));
  });
  bind("cmEndSessionConfirm", "click", function () {
    closeOverlay(document.getElementById("cmEndSessionOverlay"));
    closeSheet();
  });

  bind("cmCommentOptionsScrim", "click", function () {
    closeOverlay(document.getElementById("cmCommentOptionsOverlay"));
  });

  if (el.commentPanel) {
    el.commentPanel.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-comment-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-comment-action");
      const comment = state.comments.find(function (c) {
        return c.id === state.commentOptionsId;
      });
      closeOverlay(document.getElementById("cmCommentOptionsOverlay"));
      if (action === "delete") {
        state.comments = state.comments.filter(function (c) {
          return c.id !== state.commentOptionsId;
        });
        renderMain();
        renderFooter();
        return;
      }
      if (action === "copy" && comment) {
        navigator.clipboard.writeText(comment.text).then(function () {
          showToast("Copied to clipboard");
        }).catch(function () {
          showToast("Copied");
        });
        return;
      }
      if (action === "report") showToast("Report submitted");
    });
  }

  bind("cmSpeakerRequestsScrim", "click", function () {
    closeOverlay(document.getElementById("cmSpeakerRequestsOverlay"));
  });

  if (el.speakerPanel) {
    el.speakerPanel.addEventListener("click", function (e) {
      if (e.target.id === "cmSpeakerSheetClose" || e.target.closest("#cmSpeakerSheetClose")) {
        closeOverlay(document.getElementById("cmSpeakerRequestsOverlay"));
        return;
      }
      const acceptBtn = e.target.closest("[data-accept-speaker]");
      if (acceptBtn) {
        acceptSpeaker(acceptBtn.getAttribute("data-accept-speaker"));
        closeOverlay(document.getElementById("cmSpeakerRequestsOverlay"));
        showToast("Speaker added");
        return;
      }
      const declineBtn = e.target.closest("[data-decline-speaker]");
      if (declineBtn) {
        declineSpeaker(declineBtn.getAttribute("data-decline-speaker"));
        closeOverlay(document.getElementById("cmSpeakerRequestsOverlay"));
      }
    });
  }

  window.CmLiveSession = {
    open: function () {
      openSheet();
    },
    close: closeSheet,
    minimize: minimizeSheet,
    restore: restoreSheet,
  };

  const joinParam = params.get("join") || params.get("session");
  if (joinParam) openSheet();
})();
