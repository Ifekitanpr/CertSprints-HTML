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
            <button class="dash-pill dash-pill--icon" type="button" data-streak-trigger aria-haspopup="dialog">
              <img src="${ASSETS}/fire.svg" alt="" width="20" height="20" />
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
          <div class="dash-cert-select" data-cert-select-trigger role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
            <img class="dash-cert-icon-img" src="${ASSETS}/certificate.svg" alt="" width="24" height="24" />
            <p>PMP Project Management Professional</p>
            <img class="dash-cert-caret-img" src="${ASSETS}/arrow-down.svg" alt="" width="20" height="20" />
          </div>
          <ul class="dash-cert-dropdown" data-cert-dropdown hidden role="listbox" aria-label="Your courses">
            <li class="dash-cert-dropdown-item dash-cert-dropdown-item--active" role="option" aria-selected="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007bff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span>PMP Project Management Professional</span>
            </li>
            <li class="dash-cert-dropdown-item dash-cert-dropdown-item--explore" data-explore-courses role="option">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#007bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Explore Courses</span>
            </li>
          </ul>
        </div>
        ${extraBlock}
      </header>`;
  }

  /**
   * Reliable back navigation for static HTML flows (avoid history.back() traps).
   * @param {string} fallback e.g. "app/more.html" or "app/dashboard.html"
   */
  function goBack(fallback) {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const nav = (p) => { window.location.href = new URL(p, document.baseURI).href; };
    if (from === "more") { nav("app/more.html"); return; }
    if (from === "dashboard" || from === "home") { nav("app/dashboard.html"); return; }
    nav(fallback || "app/dashboard.html");
  }

  window.CertSprintsNav = { goBack };

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
        window.location.href = new URL("account/profile/profile.html", document.baseURI).href;
      });

      container.querySelector("[data-notification-trigger]")?.addEventListener("click", () => {
        window.location.href = new URL("app/notifications.html", document.baseURI).href;
      });

      container.querySelector(".dash-icon-btn[aria-label='Notes']")?.addEventListener("click", () => {
        window.location.href = new URL("app/notes.html", document.baseURI).href;
      });

      const certTrigger = container.querySelector("[data-cert-select-trigger]");
      const certDropdown = container.querySelector("[data-cert-dropdown]");
      if (certTrigger && certDropdown) {
        const toggleDropdown = (e) => {
          e.stopPropagation();
          const isOpen = !certDropdown.hidden;
          certDropdown.hidden = isOpen;
          certTrigger.setAttribute("aria-expanded", String(!isOpen));
        };
        certTrigger.addEventListener("click", toggleDropdown);
        certTrigger.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleDropdown(e); }
        });
        certDropdown.querySelector("[data-explore-courses]")?.addEventListener("click", () => {
          window.location.href = new URL("commerce/certification.html", document.baseURI).href;
        });
        document.addEventListener("click", () => {
          certDropdown.hidden = true;
          certTrigger.setAttribute("aria-expanded", "false");
        }, { once: false, capture: false });
      }
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
        window.location.href = new URL("app/dashboard.html", document.baseURI).href;
      });
      container.querySelector("[data-nav-progress-btn]")?.addEventListener("click", () => {
        window.location.href = new URL("app/progress.html", document.baseURI).href;
      });
      container.querySelector("[data-daily-preview]")?.addEventListener("click", () => {
        window.location.href = new URL("lms/study-backlog.html", document.baseURI).href;
      });
      container.querySelector("[data-nav-games-btn]")?.addEventListener("click", () => {
        window.location.href = new URL("games/games.html", document.baseURI).href;
      });
      container.querySelector("[data-nav-more-btn]")?.addEventListener("click", () => {
        window.location.href = new URL("app/more.html", document.baseURI).href;
      });
    },
  };
})();
