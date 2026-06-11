(function () {
  const data = window.COMMUNITY;
  if (!data) return;

  const ICON = data.ICON;
  const AVATAR = data.AVATAR;

  const listEl = document.getElementById("cmCohortsList");
  const noteEl = document.getElementById("cmExamNote");
  const noteDismiss = document.getElementById("cmNoteDismiss");
  const tabBtns = document.querySelectorAll("[data-cm-tab]");
  const cohortsPanel = document.getElementById("cmCohortsPanel");
  const partnersPanel = document.getElementById("cmPartnersPanel");

  function liveBadge(cohort) {
    const live = cohort.liveSessions > 0;
    const icon = live ? "broadcast-live.svg" : "broadcast-idle.svg";
    return (
      '<span class="cm-badge ' +
      (live ? "cm-badge--live" : "cm-badge--live-idle") +
      '">' +
      '<img class="cm-glyph" src="' +
      ICON +
      icon +
      '" alt="" style="width:16px;height:16px" /> ' +
      cohort.liveSessions +
      " LIVE SESSION" +
      (cohort.liveSessions === 1 ? "" : "S") +
      "</span>"
    );
  }

  function avatarStack(files) {
    return files
      .map(function (f) {
        return '<img src="' + AVATAR + f + '" alt="" />';
      })
      .join("");
  }

  function renderCohorts() {
    let html = "";
    let lastSection = "";

    data.cohorts.forEach(function (c) {
      if (c.section !== lastSection) {
        if (lastSection) html += "</section>";
        lastSection = c.section;
        const isGeneral = c.section === "general";
        html +=
          '<section class="cm-section">' +
          '<div class="cm-section-head">' +
          '<p class="cm-section-label">' +
          '<span class="cm-icon-slot cm-icon-slot--16">' +
          '<img class="cm-glyph cm-glyph--' +
          (isGeneral ? "global-16" : "calendar-16") +
          '" src="' +
          ICON +
          (isGeneral ? "global-16.svg" : "calendar-16.svg") +
          '" alt="" />' +
          "</span>" +
          (isGeneral ? "General" : "Exam Month Cohort") +
          "</p>" +
          '<p class="cm-section-desc">' +
          (isGeneral
            ? "All learners on this certifications"
            : "Learners writing their exam the same month as you") +
          "</p>" +
          "</div>";
        if (!isGeneral) html += '<div class="cm-divider"></div>';
      }

      html +=
        '<button type="button" class="cm-cohort-card" data-cohort-id="' +
        c.id +
        '">' +
        '<div class="cm-cohort-top">' +
        '<div>' +
        liveBadge(c) +
        "</div>" +
        '<div class="cm-cohort-meta-row">' +
        '<span class="cm-badge cm-badge--unread">' +
        '<span class="cm-unread-wrap">' +
        '<span class="cm-icon-slot cm-icon-slot--16">' +
        '<img class="cm-glyph cm-glyph--message-16" src="' +
        ICON +
        'message-16.svg" alt="" />' +
        "</span>" +
        '<span class="cm-unread-dot"></span>' +
        "</span>" +
        c.unread +
        " unread" +
        "</span>" +
        '<span class="cm-icon-slot cm-icon-slot--24">' +
        '<img class="cm-glyph cm-glyph--chevron-right-24" src="' +
        ICON +
        'chevron-right-24.svg" alt="" />' +
        "</span>" +
        "</div>" +
        "</div>" +
        '<p class="cm-cohort-title">' +
        c.title +
        "</p>" +
        '<p class="cm-cohort-sub">' +
        c.subtitle +
        "</p>" +
        '<div class="cm-cohort-foot">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
        '<div class="cm-avatar-stack">' +
        avatarStack(c.avatarStack) +
        "</div>" +
        '<span class="cm-online-label">+' +
        c.onlineExtra +
        " Others Online</span>" +
        "</div>" +
        '<span class="cm-members-label">' +
        c.members +
        " Members</span>" +
        "</div>" +
        "</button>";
    });

    if (lastSection) html += "</section>";
    listEl.innerHTML = html;

    listEl.querySelectorAll("[data-cohort-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.location.href = new URL(
          "community/community-cohort.html?cohort=" + encodeURIComponent(btn.getAttribute("data-cohort-id")),
          document.baseURI,
        ).href;
      });
    });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tab = btn.getAttribute("data-cm-tab");
      tabBtns.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      cohortsPanel.classList.toggle("cm-screen-hidden", tab !== "cohorts");
      partnersPanel.classList.toggle("cm-screen-hidden", tab !== "partners");
    });
  });

  function activateTab(tab) {
    tabBtns.forEach(function (b) {
      const isActive = b.getAttribute("data-cm-tab") === tab;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    cohortsPanel.classList.toggle("cm-screen-hidden", tab !== "cohorts");
    partnersPanel.classList.toggle("cm-screen-hidden", tab !== "partners");
  }

  const urlTab = new URLSearchParams(window.location.search).get("tab");
  if (urlTab === "partners") activateTab("partners");

  if (localStorage.getItem(data.noteDismissKey) !== "1") {
    noteEl.hidden = false;
  }

  noteDismiss.addEventListener("click", function () {
    localStorage.setItem(data.noteDismissKey, "1");
    noteEl.hidden = true;
  });

  renderCohorts();
})();
