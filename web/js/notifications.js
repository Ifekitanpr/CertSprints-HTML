(() => {
  const data = window.NOTIFICATION_DATA;
  if (!data) return;
  const feedView = document.querySelector("[data-notification-feed]");
  const settingsView = document.querySelector("[data-notification-settings]");
  const feedTitle = document.querySelector("[data-notification-title]");
  const tabRoot = document.querySelector("[data-notification-tabs]");
  const listRoot = document.querySelector("[data-notification-list]");
  const emptyRoot = document.querySelector("[data-notification-empty]");
  const settingsList = document.querySelector("[data-notification-settings-list]");
  const moreOverlay = document.querySelector("[data-notification-more-overlay]");
  const focusOverlay = document.querySelector("[data-notification-focus-overlay]");
  const focusHourInput = document.querySelector("[data-focus-hour-input]");
  const focusMinuteInput = document.querySelector("[data-focus-minute-input]");
  const focusPeriodBtns = document.querySelectorAll("[data-focus-period]");

  let activeTab = "everything";
  let focusState = { ...data.focus };

  const itemsForTab = (tab) => {
    if (!data) return [];
    return data.items.filter((item) => item.categories.includes(tab));
  };

  const setView = (view) => {
    const isSettings = view === "settings";
    feedView?.toggleAttribute("hidden", isSettings);
    settingsView?.toggleAttribute("hidden", !isSettings);
    document.querySelector(".notification-tabs-wrap")?.toggleAttribute("hidden", isSettings);
    if (feedTitle) feedTitle.textContent = isSettings ? "Feed Controls" : "Sprint Feed";
    document.querySelector("[data-notification-more-btn]")?.toggleAttribute("hidden", isSettings);
  };

  const renderTabs = () => {
    if (!tabRoot || !data) return;
    tabRoot.innerHTML = data.tabs
      .map(
        (tab) =>
          `<button type="button" class="notification-tab${tab.id === activeTab ? " active" : ""}" data-notification-tab="${tab.id}">${tab.label}</button>`,
      )
      .join("");
    tabRoot.querySelectorAll("[data-notification-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.notificationTab || "everything";
        renderTabs();
        renderList();
      });
    });
  };

  const cardHtml = (item) => `<article class="notification-card">
    <div class="notification-card-inner">
      <div class="notification-icon" style="background:${item.iconBg}">
        <img src="assets/notifications/${item.icon}" alt="" />
      </div>
      <div class="notification-card-body">
        <div class="notification-card-copy">
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </div>
        <div class="notification-meta">
          ${item.unread ? '<span class="notification-unread" aria-hidden="true"></span>' : ""}
          <span>${item.time}</span>
        </div>
      </div>
      <span class="notification-chevron" aria-hidden="true"><img src="assets/notifications/arrow-right-01-round.svg" alt="" width="24" height="24" /></span>
    </div>
  </article>`;

  const renderList = () => {
    if (!listRoot || !emptyRoot) return;
    const items = itemsForTab(activeTab);
    const forceEmpty = new URLSearchParams(window.location.search).get("empty") === "1";
    const showEmpty = forceEmpty || items.length === 0;

    emptyRoot.hidden = !showEmpty;
    listRoot.hidden = showEmpty;
    document.querySelector(".notification-footer-bar")?.toggleAttribute("hidden", showEmpty);
    if (showEmpty) return;

    listRoot.innerHTML = items.map(cardHtml).join("");
  };

  const settingRowClass = (row) =>
    `notification-settings-row${row.enabled ? " is-on" : " is-off"}`;

  const renderSettings = () => {
    if (!settingsList || !data) return;
    const rows = data.settings
      .map(
        (row) => {
          const iconBg = row.enabled ? row.iconBgOn || row.iconBg : "#f1f5f9";
          return `<article class="${settingRowClass(row)}" data-setting-row="${row.id}">
          <div class="notification-icon notification-icon--sm" style="background:${iconBg}">
            <img src="assets/notifications/${row.icon}" alt="" />
          </div>
          <div class="notification-settings-copy">
            <h3>${row.title}</h3>
            <p>${row.body}</p>
          </div>
          <button type="button" class="notification-toggle${row.enabled ? " on" : ""}" data-setting-toggle="${row.id}" aria-pressed="${row.enabled ? "true" : "false"}"><span></span></button>
        </article>`;
        },
      )
      .join("");

    settingsList.innerHTML =
      rows +
      `<article class="notification-settings-silent">
            <div class="notification-icon notification-icon--sm" style="background:#cbd5e1">
              <img src="assets/notifications/volume-off.svg" alt="" />
            </div>
            <div>
              <h3>Silent Sprints</h3>
              <p>Enabling this automatically mutes all non-critical clinical alerts during your scheduled focus sessions.</p>
              <button type="button" class="notification-focus-link" data-open-focus>Enabled for ${data.focus.label} →</button>
            </div>
          </article>`;

    settingsList.querySelectorAll("[data-setting-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.settingToggle;
        const row = data.settings.find((s) => s.id === id);
        if (!row) return;
        row.enabled = !row.enabled;
        const article = btn.closest("[data-setting-row]");
        if (article) {
          article.className = settingRowClass(row);
          const iconBox = article.querySelector(".notification-icon");
          if (iconBox) {
            iconBox.style.background = row.enabled ? row.iconBgOn || row.iconBg : "#f1f5f9";
          }
        }
        btn.classList.toggle("on", row.enabled);
        btn.setAttribute("aria-pressed", row.enabled ? "true" : "false");
      });
    });

    settingsList.querySelector("[data-open-focus]")?.addEventListener("click", openFocus);
  };

  const openMore = () => {
    if (moreOverlay) moreOverlay.hidden = false;
  };
  const closeMore = () => {
    if (moreOverlay) moreOverlay.hidden = true;
  };

  const clampHour = (value) => Math.min(12, Math.max(1, value));
  const clampMinute = (value) => Math.min(59, Math.max(0, value));

  const readFocusInputs = () => {
    const hour = clampHour(parseInt(focusHourInput?.value || String(focusState.hour), 10) || focusState.hour);
    const minute = clampMinute(parseInt(focusMinuteInput?.value || String(focusState.minute), 10) || focusState.minute);
    focusState = { ...focusState, hour, minute };
    if (focusHourInput) focusHourInput.value = String(hour);
    if (focusMinuteInput) focusMinuteInput.value = String(minute).padStart(2, "0");
  };

  const openFocus = () => {
    if (focusHourInput) focusHourInput.value = String(focusState.hour);
    if (focusMinuteInput) focusMinuteInput.value = String(focusState.minute).padStart(2, "0");
    focusPeriodBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.focusPeriod === focusState.period);
    });
    if (focusOverlay) focusOverlay.hidden = false;
  };
  const closeFocus = () => {
    if (focusOverlay) focusOverlay.hidden = true;
  };

  const saveFocus = () => {
    readFocusInputs();
    const label = `${focusState.hour}:${String(focusState.minute).padStart(2, "0")} ${focusState.period}`;
    data.focus = { ...focusState, label };
    const link = settingsList?.querySelector("[data-open-focus]");
    if (link) link.textContent = `Enabled for ${label} →`;
    closeFocus();
  };

  renderTabs();
  renderList();
  renderSettings();
  setView("feed");

  document.querySelector("[data-notification-back]")?.addEventListener("click", () => {
    if (settingsView && !settingsView.hidden) {
      setView("feed");
      return;
    }
    window.location.href = "dashboard.html";
  });

  document.querySelector("[data-notification-more-btn]")?.addEventListener("click", openMore);
  document.querySelectorAll("[data-notification-more-close]").forEach((el) => {
    el.addEventListener("click", closeMore);
  });

  document.querySelector("[data-mark-all-read]")?.addEventListener("click", () => {
    data.items.forEach((item) => {
      item.unread = false;
    });
    renderList();
    closeMore();
  });

  document.querySelector("[data-open-settings]")?.addEventListener("click", () => {
    closeMore();
    setView("settings");
  });

  document.querySelector("[data-manage-feed]")?.addEventListener("click", () => setView("settings"));

  document.querySelectorAll("[data-focus-close]").forEach((el) => {
    el.addEventListener("click", closeFocus);
  });

  focusPeriodBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      focusState.period = btn.dataset.focusPeriod || "AM";
      focusPeriodBtns.forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  focusHourInput?.addEventListener("change", readFocusInputs);
  focusMinuteInput?.addEventListener("change", readFocusInputs);
  focusHourInput?.addEventListener("blur", readFocusInputs);
  focusMinuteInput?.addEventListener("blur", readFocusInputs);

  document.querySelector("[data-focus-save]")?.addEventListener("click", saveFocus);
  document.querySelector("[data-focus-cancel]")?.addEventListener("click", closeFocus);

  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "settings") setView("settings");
  if (params.get("tab")) {
    activeTab = params.get("tab");
    renderTabs();
    renderList();
  }
})();
