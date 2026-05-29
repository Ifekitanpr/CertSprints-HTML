/**
 * CertSprints shared shell — top header + bottom navigation (Home / Progress variants).
 */
(function () {
  const ASSETS = "assets/dashboard/home";

  function readProfileSummary() {
    const fallback = { firstName: "Patrick", avatar: ASSETS + "/avatar.png" };
    try {
      const raw = localStorage.getItem("cs-user-profile");
      if (!raw) return fallback;
      const profile = JSON.parse(raw);
      return {
        firstName: profile.firstName || fallback.firstName,
        avatar: "assets/profile/images/user-avatar.jpg",
      };
    } catch (e) {
      return fallback;
    }
  }

  function headerMarkup(extraHtml, sticky) {
    const stickyClass = sticky ? " dashboard-top--sticky" : "";
    const extraBlock = extraHtml
      ? `<div class="dashboard-top-extra">${extraHtml}</div>`
      : "";
    const profile = readProfileSummary();
    return `
      <header class="dashboard-top${stickyClass}" data-app-shell-header>
        <div class="dash-row">
          <button class="dash-welcome" type="button" aria-label="Open profile">
            <img class="dash-avatar-img" src="${profile.avatar}" alt="" width="40" height="40" />
            <p>Hi, ${profile.firstName} 👋</p>
          </button>
          <div class="dash-meta">
            <button class="dash-pill" type="button" data-streak-trigger aria-haspopup="dialog">
              <img src="${ASSETS}/fire.svg" alt="" width="20" height="20" />
              <strong>123 days</strong>
            </button>
            <button class="dash-icon-btn" type="button" aria-label="Notes">
              <img src="${ASSETS}/note.svg" alt="" width="20" height="20" />
            </button>
            <button class="dash-icon-btn" type="button" aria-label="Notifications" data-notification-trigger>
              <img src="${ASSETS}/notification.svg" alt="" width="20" height="20" />
            </button>
          </div>
        </div>
        <div class="dash-row dash-cert-row">
          <div class="dash-cert-select">
            <img class="dash-cert-icon-img" src="${ASSETS}/certificate.svg" alt="" width="24" height="24" />
            <p>PMP Project Management Professional</p>
            <img class="dash-cert-caret-img" src="${ASSETS}/arrow-down.svg" alt="" width="20" height="20" />
          </div>
        </div>
        ${extraBlock}
      </header>`;
  }

  window.CertSprintsComponents = {
    /**
     * Shared dashboard header (avatar row + cert selector).
     * @param {string} placeholderSelector
     * @param {{ extraHtml?: string, sticky?: boolean }} [options]
     */
    injectHeader(placeholderSelector, options = {}) {
      const container = document.querySelector(placeholderSelector);
      if (!container) return;

      const { extraHtml = "", sticky = false } = options;
      container.innerHTML = headerMarkup(extraHtml, sticky);

      container.querySelector(".dash-welcome")?.addEventListener("click", () => {
        window.location.href = "profile.html";
      });

      container.querySelector("[data-notification-trigger]")?.addEventListener("click", () => {
        window.location.href = "notifications.html";
      });

      container.querySelector(".dash-icon-btn[aria-label='Notes']")?.addEventListener("click", () => {
        window.location.href = "notes.html";
      });
    },

    /**
     * Bottom nav — pass active tab: 'home' | 'progress' | 'games' | 'more'
     */
    injectBottomNav(placeholderSelector, activeTab) {
      const container = document.querySelector(placeholderSelector);
      if (!container) return;

      const homeActive = activeTab === "home";
      const progressActive = activeTab === "progress";

      container.innerHTML = `
        <nav class="dashboard-bottom-nav" aria-label="Bottom navigation">
          <div class="nav-side">
            <button class="${homeActive ? "active " : ""}nav-home" type="button" data-nav-home-btn>
              <span class="nav-icon-wrap">
                <img src="${homeActive ? ASSETS + "/nav-home-active.svg" : ASSETS + "/nav-home.svg"}" alt="" />
              </span>
              <span>Home</span>
            </button>
            <button class="${progressActive ? "active " : ""}nav-progress" type="button" data-nav-progress-btn>
              <span class="nav-icon-wrap">
                <img src="${progressActive ? "assets/progress/chart-column-active.svg" : ASSETS + "/nav-progress.svg"}" alt="" />
              </span>
              <span>Progress</span>
            </button>
          </div>
          <button class="play" type="button" aria-label="Preview daily challenge" data-daily-preview>
            <img src="${ASSETS}/nav-play-icon.svg" alt="" />
          </button>
          <div class="nav-side nav-side-right">
            <button class="${activeTab === "games" ? "active " : ""}nav-games" type="button" data-nav-games-btn>
              <span class="nav-icon-wrap"><img src="${activeTab === "games" ? ASSETS + "/nav-games-active.svg" : ASSETS + "/nav-games.svg"}" alt="" /></span>
              <span>Games</span>
            </button>
            <button class="${activeTab === "more" ? "active " : ""}nav-more" type="button" data-nav-more-btn>
              <span class="nav-icon-wrap"><img src="${activeTab === "more" ? ASSETS + "/nav-more-active.svg" : ASSETS + "/nav-more.svg"}" alt="" /></span>
              <span>More</span>
            </button>
          </div>
        </nav>`;

      container.querySelector("[data-nav-home-btn]")?.addEventListener("click", () => {
        window.location.href = "dashboard.html";
      });
      container.querySelector("[data-nav-progress-btn]")?.addEventListener("click", () => {
        window.location.href = "progress.html";
      });
      container.querySelector("[data-daily-preview]")?.addEventListener("click", () => {
        window.location.href = "study-backlog.html";
      });
      container.querySelector("[data-nav-games-btn]")?.addEventListener("click", () => {
        window.location.href = "games.html";
      });
      container.querySelector("[data-nav-more-btn]")?.addEventListener("click", () => {
        window.location.href = "more.html";
      });
    },
  };
})();
