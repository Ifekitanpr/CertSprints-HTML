(() => {
  const data = window.NOTIFICATION_DATA;
  if (!data) return;

  const tabRoot = document.querySelector("[data-notification-tabs]");
  const listRoot = document.querySelector("[data-notification-list]");
  const emptyRoot = document.querySelector("[data-notification-empty]");
  const moreOverlay = document.querySelector("[data-notification-more-overlay]");

  let activeTab = "everything";

  const itemsForTab = (tab) => data.items.filter((item) => item.categories.includes(tab));

  const renderTabs = () => {
    if (!tabRoot) return;
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

  const openMore = () => {
    if (moreOverlay) moreOverlay.hidden = false;
  };

  const closeMore = () => {
    if (moreOverlay) moreOverlay.hidden = true;
  };

  const openNotificationSettings = () => {
    window.location.href = new URL("settings/settings-notifications.html?from=notifications", document.baseURI).href;
  };

  renderTabs();
  renderList();

  document.querySelector("[data-notification-back]")?.addEventListener("click", () => {
    window.location.href = new URL("app/dashboard.html", document.baseURI).href;
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
    openNotificationSettings();
  });

  document.querySelector("[data-manage-feed]")?.addEventListener("click", openNotificationSettings);

  const params = new URLSearchParams(window.location.search);
  if (params.get("tab")) {
    activeTab = params.get("tab");
    renderTabs();
    renderList();
  }
})();
