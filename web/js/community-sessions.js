(function () {
  const data = window.COMMUNITY;
  if (!data || !data.sessions) return;

  const ICON = data.ICON;
  const AVATAR = data.AVATAR;

  const state = {
    subTab: "live",
    deletingId: null,
  };

  let panelEl = null;

  function toast(msg) {
    if (window.cmShowToast) window.cmShowToast(msg);
  }

  function openOverlay(node) {
    node.classList.add("open");
    node.setAttribute("aria-hidden", "false");
  }

  function closeOverlay(node) {
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

  function dateChip(dayLabel, dayNum) {
    return (
      '<div class="cm-sess-date-chip">' +
      '<p class="cm-sess-date-dow">' +
      dayLabel +
      "</p>" +
      '<p class="cm-sess-date-num">' +
      dayNum +
      "</p></div>"
    );
  }

  function listenerRow(session) {
    const avatars = (session.listenerAvatars || [])
      .map(function (a) {
        return (
          '<img class="cm-sess-stack-avatar" src="' +
          AVATAR +
          a +
          '" alt="" />'
        );
      })
      .join("");
    return (
      '<div class="cm-sess-listeners">' +
      '<div class="cm-sess-stack">' +
      avatars +
      "</div>" +
      "<span>+" +
      session.listening +
      " listening</span></div>"
    );
  }

  function timeRow(start, end) {
    return (
      '<div class="cm-sess-time-row">' +
      glyph("clock-01-16", "clock-01-16.svg", "16") +
      "<span>" +
      start +
      " - " +
      end +
      "</span></div>"
    );
  }

  function liveCard(session) {
    return (
      '<article class="cm-sess-card">' +
      '<div class="cm-sess-card-top">' +
      dateChip(session.dayLabel, session.dayNum) +
      '<div class="cm-sess-card-body">' +
      "<h3>" +
      session.title +
      "</h3>" +
      "<p>" +
      session.description +
      "</p>" +
      '<p class="cm-sess-hosted">Hosted by: <strong>' +
      session.host +
      "</strong></p>" +
      '<div class="cm-sess-meta-row">' +
      timeRow(session.timeStart, session.timeEnd) +
      '<span class="cm-sess-badge cm-sess-badge--live">LIVE</span></div></div></div>' +
      '<button class="cm-sess-join-btn" type="button" data-join-session="' +
      session.id +
      '">Join session</button>' +
      listenerRow(session) +
      "</article>"
    );
  }

  function upcomingCard(session) {
    const statusBadge =
      session.status === "approved"
        ? '<span class="cm-sess-badge cm-sess-badge--approved">Approved</span>'
        : '<span class="cm-sess-badge cm-sess-badge--pending">Pending approval</span>';
    const ownerActions = session.isOwner
      ? '<div class="cm-sess-owner-actions">' +
        '<button class="cm-sess-muted-btn" type="button" data-edit-session="' +
        session.id +
        '">' +
        glyph("edit-02-20", "edit-02-20.svg", "20") +
        " Edit</button>" +
        '<button class="cm-sess-muted-btn" type="button" data-delete-session="' +
        session.id +
        '">' +
        glyph("delete-02-20", "delete-02-20.svg", "20") +
        " Delete</button></div>"
      : "";
    return (
      '<article class="cm-sess-card">' +
      statusBadge +
      '<div class="cm-sess-card-top">' +
      dateChip(session.dayLabel, session.dayNum) +
      '<div class="cm-sess-card-body">' +
      "<h3>" +
      session.title +
      "</h3>" +
      "<p>" +
      session.description +
      "</p>" +
      '<p class="cm-sess-hosted">Hosted by: <strong>' +
      session.host +
      "</strong></p>" +
      timeRow(session.timeStart, session.timeEnd) +
      "</div></div>" +
      ownerActions +
      "</article>"
    );
  }

  function findUpcoming(id) {
    return data.sessions.upcoming.find(function (s) {
      return s.id === id;
    });
  }

  function renderList() {
    const sessions =
      state.subTab === "live" ? data.sessions.live : data.sessions.upcoming;
    const cards = sessions
      .map(function (s) {
        return state.subTab === "live" ? liveCard(s) : upcomingCard(s);
      })
      .join("");
    const empty =
      !cards && state.subTab === "upcoming"
        ? '<p class="cm-sessions-empty">No upcoming sessions yet. Host one to get started.</p>'
        : "";
    return (
      '<div class="cm-sessions-panel">' +
      '<div class="cm-sessions-head">' +
      "<div><h2>Sessions</h2><p>Host or join live audio sessions with your cohort.</p></div>" +
      '<button class="cm-sessions-host-btn" type="button" id="cmSessionsHostBtn">' +
      glyph("mic-02-white-20", "mic-02-white-20.svg", "20") +
      " Host</button></div>" +
      '<div class="cm-sessions-divider"></div>' +
      '<div class="cm-sessions-subtabs">' +
      '<button type="button" class="cm-sessions-subtab' +
      (state.subTab === "live" ? " is-active" : "") +
      '" data-sessions-sub="live">' +
      glyph("broadcast-live-red-24", "broadcast-live-red-24.svg", "24") +
      " LIVE NOW</button>" +
      '<button type="button" class="cm-sessions-subtab' +
      (state.subTab === "upcoming" ? " is-active" : "") +
      '" data-sessions-sub="upcoming">' +
      glyph("calendar-03-24", "calendar-03-24.svg", "24") +
      " UPCOMING</button></div>" +
      '<div class="cm-sessions-cards">' +
      (cards || empty) +
      "</div></div>"
    );
  }

  function hostFormUrl(editId) {
    const params = new URLSearchParams(window.location.search);
    const cohort = params.get("cohort") || "pmp-general";
    let url = "community/community-host.html?cohort=" + encodeURIComponent(cohort);
    if (editId) url += "&edit=" + encodeURIComponent(editId);
    return new URL(url, document.baseURI).href;
  }

  function render() {
    if (!panelEl) return;
    panelEl.innerHTML = renderList();
    bindPanelEvents();
  }

  function openDeleteModal(id) {
    const session = findUpcoming(id);
    if (!session) return;
    state.deletingId = id;
    const body = document.getElementById("cmDeleteSessionBody");
    if (body) {
      body.textContent = 'Remove "' + session.title + '" from upcoming sessions?';
    }
    openOverlay(document.getElementById("cmDeleteSessionOverlay"));
  }

  function bindDeleteModal() {
    const overlay = document.getElementById("cmDeleteSessionOverlay");
    if (!overlay || overlay._cmBound) return;
    overlay._cmBound = true;

    ["cmDeleteSessionCancel", "cmDeleteSessionClose", "cmDeleteSessionScrim"].forEach(function (id) {
      const node = document.getElementById(id);
      if (node) {
        node.addEventListener("click", function () {
          state.deletingId = null;
          closeOverlay(overlay);
        });
      }
    });

    document.getElementById("cmDeleteSessionConfirm").addEventListener("click", function () {
      if (state.deletingId) {
        data.sessions.upcoming = data.sessions.upcoming.filter(function (s) {
          return s.id !== state.deletingId;
        });
        toast("Session deleted");
      }
      state.deletingId = null;
      closeOverlay(overlay);
      render();
    });
  }

  function bindPanelEvents() {
    if (!panelEl) return;

    const hostBtn = panelEl.querySelector("#cmSessionsHostBtn");
    if (hostBtn) {
      hostBtn.addEventListener("click", function () {
        window.location.href = hostFormUrl();
      });
    }

    panelEl.querySelectorAll("[data-sessions-sub]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.subTab = btn.getAttribute("data-sessions-sub");
        render();
      });
    });

    panelEl.querySelectorAll("[data-join-session]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.getAttribute("data-join-session");
        if (window.CmLiveSession) {
          window.CmLiveSession.open(id);
        }
      });
    });

    panelEl.querySelectorAll("[data-edit-session]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.location.href = hostFormUrl(btn.getAttribute("data-edit-session"));
      });
    });

    panelEl.querySelectorAll("[data-delete-session]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openDeleteModal(btn.getAttribute("data-delete-session"));
      });
    });
  }

  window.CmSessions = {
    mount: function (el) {
      panelEl = el;
      bindDeleteModal();
      render();

      const params = new URLSearchParams(window.location.search);
      let urlChanged = false;
      const subTab = params.get("subTab");
      if (subTab === "live" || subTab === "upcoming") {
        state.subTab = subTab;
        params.delete("subTab");
        urlChanged = true;
        render();
      }

      if (params.get("hostRequestSent") === "1") {
        const raw = sessionStorage.getItem("cmHostRequestSent");
        if (raw && window.cmSessionsShowRequestSent) {
          sessionStorage.removeItem("cmHostRequestSent");
          try {
            window.cmSessionsShowRequestSent(JSON.parse(raw));
          } catch (e) {
            window.cmSessionsShowRequestSent({});
          }
        }
        params.delete("hostRequestSent");
        urlChanged = true;
      }

      if (urlChanged) {
        const qs = params.toString();
        window.history.replaceState(
          {},
          "",
          window.location.pathname + (qs ? "?" + qs : "") + window.location.hash
        );
      }
    },
    showList: function () {
      state.subTab = "upcoming";
      render();
    },
  };
})();
