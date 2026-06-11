(function () {
  const data = window.COMMUNITY;
  if (!data || !data.sessions) return;

  const ICON = data.ICON;
  const params = new URLSearchParams(window.location.search);
  const cohortId = params.get("cohort") || "pmp-general";
  const editingId = params.get("edit") || null;

  const state = {
    editingId: editingId,
    hostForm: {
      title: "",
      discussion: "",
      duration: "30 mins",
      date: "",
      time: "",
    },
    formErrors: {},
  };

  const rootEl = document.getElementById("cmHostFormRoot");
  if (!rootEl) return;

  function cohortSessionsUrl() {
    return new URL(
      "community/community-cohort.html?cohort=" +
        encodeURIComponent(cohortId) +
        "&tab=sessions",
      document.baseURI,
    ).href;
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

  function findUpcoming(id) {
    return data.sessions.upcoming.find(function (s) {
      return s.id === id;
    });
  }

  function parseDateParts(dateStr) {
    const parts = (dateStr || "").split("/");
    if (parts.length !== 3) return { dayLabel: "Mon", dayNum: "09" };
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      dayLabel: days[d.getDay()] || "Mon",
      dayNum: String(d.getDate()).padStart(2, "0"),
    };
  }

  function endTimeFromStart(start, duration) {
    const match = (start || "12:00PM").match(/(\d+):(\d+)(AM|PM)/i);
    if (!match) return "01:00PM";
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const pm = match[3].toUpperCase() === "PM";
    if (pm && h !== 12) h += 12;
    if (!pm && h === 12) h = 0;
    const mins = parseInt((duration || "30 mins").replace(/\D/g, ""), 10) || 30;
    const total = h * 60 + m + mins;
    let eh = Math.floor(total / 60) % 24;
    const em = total % 60;
    const epm = eh >= 12;
    if (eh > 12) eh -= 12;
    if (eh === 0) eh = 12;
    return eh + ":" + (em < 10 ? "0" : "") + em + (epm ? "PM" : "AM");
  }

  function fieldError(name) {
    return state.formErrors[name]
      ? '<span class="cm-host-error">' + state.formErrors[name] + "</span>"
      : "";
  }

  function renderForm() {
    const isEdit = !!state.editingId;
    rootEl.innerHTML =
      '<div class="cm-host-form cm-host-form--page">' +
      '<div class="cm-host-fields">' +
      '<label class="cm-host-field' +
      (state.formErrors.title ? " has-error" : "") +
      '"><span>Title</span>' +
      '<input type="text" id="cmHostTitle" placeholder="E.g. Earned Value Management" value="' +
      (state.hostForm.title || "").replace(/"/g, "&quot;") +
      '" />' +
      fieldError("title") +
      "</label>" +
      '<label class="cm-host-field' +
      (state.formErrors.discussion ? " has-error" : "") +
      '"><span>Discussion Point</span>' +
      '<textarea id="cmHostDiscussion" rows="5" placeholder="E.g. Earned Value Management">' +
      (state.hostForm.discussion || "") +
      "</textarea>" +
      '<span class="cm-host-hint">Max 256 words</span>' +
      fieldError("discussion") +
      "</label>" +
      '<div class="cm-host-schedule">' +
      '<label class="cm-host-field cm-host-field--duration"><span>Duration</span>' +
      '<div class="cm-host-select-wrap">' +
      '<select id="cmHostDuration">' +
      data.sessionDurations
        .map(function (d) {
          return (
            '<option' +
            (d === state.hostForm.duration ? " selected" : "") +
            ">" +
            d +
            "</option>"
          );
        })
        .join("") +
      "</select>" +
      glyph("arrow-down-18", "arrow-down-18.svg", "18") +
      "</div></label>" +
      '<div class="cm-host-row">' +
      '<label class="cm-host-field' +
      (state.formErrors.date ? " has-error" : "") +
      '"><span>Date</span>' +
      '<div class="cm-host-input-icon">' +
      '<input type="text" id="cmHostDate" placeholder="dd/mm/yyyy" value="' +
      (state.hostForm.date || "").replace(/"/g, "&quot;") +
      '" />' +
      glyph("calendar-03-18", "calendar-03-18.svg", "18") +
      "</div>" +
      fieldError("date") +
      "</label>" +
      '<label class="cm-host-field' +
      (state.formErrors.time ? " has-error" : "") +
      '"><span>Time</span>' +
      '<div class="cm-host-input-icon">' +
      '<input type="text" id="cmHostTime" placeholder="--:--" value="' +
      (state.hostForm.time || "").replace(/"/g, "&quot;") +
      '" />' +
      glyph("clock-01-18", "clock-01-18.svg", "18") +
      "</div>" +
      fieldError("time") +
      "</label></div></div></div>" +
      '<div class="cm-host-page-spacer" aria-hidden="true"></div>' +
      '<button class="cm-host-submit cm-host-submit--page" type="button" id="cmHostSubmit">' +
      (isEdit ? "Save changes" : "Create Session Request") +
      "</button></div>";

    document.getElementById("cmHostSubmit").addEventListener("click", onSubmit);
  }

  function readFormFromDom() {
    state.hostForm.title = (document.getElementById("cmHostTitle") || {}).value || "";
    state.hostForm.discussion = (document.getElementById("cmHostDiscussion") || {}).value || "";
    state.hostForm.duration = (document.getElementById("cmHostDuration") || {}).value || "30 mins";
    state.hostForm.date = (document.getElementById("cmHostDate") || {}).value || "";
    state.hostForm.time = (document.getElementById("cmHostTime") || {}).value || "";
  }

  function validateForm() {
    readFormFromDom();
    state.formErrors = {};
    if (!state.hostForm.title.trim()) state.formErrors.title = "Title is required";
    if (!state.hostForm.discussion.trim()) state.formErrors.discussion = "Discussion point is required";
    if (!state.hostForm.date.trim()) state.formErrors.date = "Date is required";
    if (!state.hostForm.time.trim()) state.formErrors.time = "Time is required";
    const words = state.hostForm.discussion.trim().split(/\s+/).length;
    if (words > 256) state.formErrors.discussion = "Keep discussion under 256 words";
    return !Object.keys(state.formErrors).length;
  }

  function upsertSession() {
    const parts = parseDateParts(state.hostForm.date);
    const end = endTimeFromStart(state.hostForm.time, state.hostForm.duration);
    const payload = {
      title: state.hostForm.title.trim(),
      description: state.hostForm.discussion.trim(),
      host: "Darren Fletcher (You)",
      timeStart: state.hostForm.time.trim(),
      timeEnd: end,
      dayLabel: parts.dayLabel,
      dayNum: parts.dayNum,
      status: "pending",
      isOwner: true,
    };

    if (state.editingId) {
      const existing = findUpcoming(state.editingId);
      if (existing) Object.assign(existing, payload);
      return "updated";
    }

    data.sessions.upcoming.unshift(
      Object.assign({ id: "up-" + Date.now() }, payload)
    );
    return "created";
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

  function renderRequestSentCard() {
    const parts = parseDateParts(state.hostForm.date);
    const end = endTimeFromStart(state.hostForm.time, state.hostForm.duration);
    const card = document.getElementById("cmHostRequestSentCard");
    if (!card) return;
    card.innerHTML =
      '<div class="cm-sess-card-top">' +
      '<div class="cm-sess-date-chip">' +
      '<p class="cm-sess-date-dow">' +
      parts.dayLabel +
      "</p>" +
      '<p class="cm-sess-date-num">' +
      parts.dayNum +
      "</p></div>" +
      '<div class="cm-sess-card-body">' +
      "<h3>" +
      state.hostForm.title +
      "</h3>" +
      "<p>" +
      state.hostForm.discussion +
      "</p>" +
      '<div class="cm-sess-time-row">' +
      glyph("clock-01-16", "clock-01-16.svg", "16") +
      "<span>" +
      state.hostForm.time +
      " - " +
      end +
      "</span></div></div></div>";
  }

  function showRequestSentModal() {
    renderRequestSentCard();
    openOverlay(document.getElementById("cmHostRequestSentOverlay"));
  }

  function onSubmit() {
    if (!validateForm()) {
      renderForm();
      return;
    }
    const result = upsertSession();
    if (result === "updated") {
      window.location.href = cohortSessionsUrl();
      return;
    }
    showRequestSentModal();
  }

  function initHeader() {
    const titleEl = document.getElementById("cmHostPageTitle");
    const subtitleEl = document.getElementById("cmHostPageSubtitle");
    if (state.editingId) {
      if (titleEl) titleEl.textContent = "Edit session";
      if (subtitleEl) subtitleEl.textContent = "Update your session request before approval";
    }
  }

  function loadEditSession() {
    if (!state.editingId) return;
    const session = findUpcoming(state.editingId);
    if (!session) return;
    state.hostForm = {
      title: session.title,
      discussion: session.description,
      duration: "30 mins",
      date: "09/03/2026",
      time: session.timeStart,
    };
  }

  document.getElementById("cmHostPageBack").addEventListener("click", function () {
    window.location.href = cohortSessionsUrl();
  });

  document.getElementById("cmHostRequestSentOk").addEventListener("click", function () {
    window.location.href = cohortSessionsUrl() + "&subTab=upcoming";
  });

  document.getElementById("cmHostRequestSentScrim").addEventListener("click", function () {
    window.location.href = cohortSessionsUrl() + "&subTab=upcoming";
  });

  loadEditSession();
  initHeader();
  renderForm();
})();
