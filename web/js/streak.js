(() => {
  const data = window.STREAK_DATA;
  const streakOverlay = document.querySelector("[data-streak-overlay]");
  const streakTrigger = document.querySelector("[data-streak-trigger]");
  const streakTabs = Array.from(document.querySelectorAll("[data-streak-tab]"));
  const streakPanels = Array.from(document.querySelectorAll("[data-streak-panel]"));
  const badgeTabsRoot = document.querySelector("[data-badge-tabs]");
  const badgePanelsRoot = document.querySelector("[data-badge-panels]");
  const milestoneGrid = document.querySelector("[data-milestone-grid]");
  const calendarGrid = document.querySelector("[data-streak-calendar]");
  const rewardOverlays = Array.from(document.querySelectorAll("[data-reward-overlay]"));
  const openShowcaseBtn = document.querySelector("[data-open-showcase]");

  const calendarState = { month: 1, year: 2026 };
  let openFilterMenu = null;

  const tierLabel = { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" };

  const monthKey = (year, month) => `${year}-${month}`;

  const streakDaysFor = (year, month) => {
    const days = data?.streakDaysByMonth?.[monthKey(year, month)];
    return new Set(Array.isArray(days) ? days : []);
  };

  const leadingEmptyCells = (year, month) => new Date(year, month - 1, 1).getDay();

  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const buildCalendar = () => {
    if (!calendarGrid) return;
    const { year, month } = calendarState;
    const streakDays = streakDaysFor(year, month);
    const leading = leadingEmptyCells(year, month);
    const totalDays = daysInMonth(year, month);

    calendarGrid.innerHTML = "";
    for (let i = 0; i < leading; i += 1) {
      const spacer = document.createElement("span");
      spacer.className = "streak-day empty";
      spacer.setAttribute("aria-hidden", "true");
      calendarGrid.appendChild(spacer);
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const cell = document.createElement("span");
      cell.className = "streak-day";
      if (streakDays.has(day)) {
        cell.classList.add("streak-hit");
        cell.innerHTML = `<img src="assets/streak/fire-calendar.svg" width="16" height="16" alt="Streak day ${day}" />`;
      } else {
        cell.textContent = String(day);
      }
      calendarGrid.appendChild(cell);
    }
  };

  const closeFilterMenus = () => {
    document.querySelectorAll("[data-streak-filter-trigger]").forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".streak-filter-menu").forEach((menu) => {
      menu.hidden = true;
    });
    openFilterMenu = null;
  };

  const setCalendarMonth = (monthIndex) => {
    calendarState.month = monthIndex;
    const wrap = document.querySelector('[data-streak-filter="month"]');
    const label = wrap?.querySelector("[data-streak-filter-label]");
    if (label && data?.months) label.textContent = data.months[monthIndex - 1] || "January";
    buildCalendar();
    closeFilterMenus();
  };

  const setCalendarYear = (year) => {
    calendarState.year = year;
    const wrap = document.querySelector('[data-streak-filter="year"]');
    const label = wrap?.querySelector("[data-streak-filter-label]");
    if (label) label.textContent = String(year);
    buildCalendar();
    closeFilterMenus();
  };

  const initCalendarFilters = () => {
    if (!data) return;

    document.querySelectorAll("[data-streak-filter]").forEach((wrap) => {
      const kind = wrap.dataset.streakFilter;
      const menu = wrap.querySelector(".streak-filter-menu");
      const trigger = wrap.querySelector("[data-streak-filter-trigger]");
      if (!menu || !trigger) return;

      const options = kind === "month" ? data.months : data.years.map(String);
      menu.innerHTML = options
        .map((option, index) => {
          const value = kind === "month" ? String(index + 1) : option;
          return `<li><button type="button" role="option" data-filter-value="${value}">${option}</button></li>`;
        })
        .join("");

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = openFilterMenu === menu;
        closeFilterMenus();
        if (!isOpen) {
          menu.hidden = false;
          trigger.setAttribute("aria-expanded", "true");
          openFilterMenu = menu;
        }
      });

      menu.querySelectorAll("[data-filter-value]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const value = btn.dataset.filterValue || "";
          if (kind === "month") setCalendarMonth(Number(value));
          else setCalendarYear(Number(value));
        });
      });
    });

    document.addEventListener("click", closeFilterMenus);
  };

  const statusHtml = (badge) => {
    if (badge.progress) {
      const pct = Math.round((badge.progress.current / badge.progress.total) * 100);
      return `<div class="streak-progress-row">
        <span class="streak-progress-bar"><i style="width:${pct}%"></i></span>
        <span class="streak-progress-label">${badge.progress.label}</span>
      </div>`;
    }
    const label = badge.earned ? "Earned" : "Not Earned";
    const cls = badge.earned ? "earned" : "locked";
    return `<span class="streak-status ${cls}">${label}</span>`;
  };

  const badgeCardHtml = (badge, tier) => {
    const earned = Boolean(badge.earned);
    return `<article class="streak-badge-card${earned ? " earned" : ""}">
      ${badge.share ? `<button class="streak-share-btn" type="button" aria-label="Share"><img src="assets/streak/share-08.svg" alt="" /></button>` : ""}
      <div class="streak-badge-art streak-badge-art--${tier}">
        <img src="assets/streak/${badge.asset}" alt="" />
      </div>
      <h4>${badge.title}</h4>
      <p>${badge.desc}</p>
      ${statusHtml(badge)}
    </article>`;
  };

  const renderBadgePanels = () => {
    if (!badgeTabsRoot || !badgePanelsRoot || !data) return;

    badgeTabsRoot.innerHTML = data.badgeTiers
      .map(
        (tier, i) =>
          `<button class="streak-badge-tab${i === 0 ? " active" : ""}" type="button" data-badge-tier="${tier}">${tierLabel[tier]}</button>`,
      )
      .join("");

    badgePanelsRoot.innerHTML = data.badgeTiers
      .map((tier, i) => {
        const cards = data.badges[tier]
          .map((b) => badgeCardHtml(b, tier))
          .join("");
        const single = tier === "platinum" ? " streak-badge-grid--single" : "";
        return `<div class="streak-badge-panel${i === 0 ? " active" : ""}" data-badge-panel="${tier}"${i === 0 ? "" : " hidden"}>
          <div class="streak-badge-grid${single}">${cards}</div>
        </div>`;
      })
      .join("");

    badgeTabsRoot.querySelectorAll("[data-badge-tier]").forEach((tab) => {
      tab.addEventListener("click", () => setBadgeTier(tab.dataset.badgeTier || "bronze"));
    });
  };

  const milestoneCardHtml = (m) => {
    const earned = m.earned;
    return `<article class="streak-milestone-card${earned ? " earned" : ""}">
      ${earned ? `<button class="streak-share-btn" type="button" aria-label="Share"><img src="assets/streak/share-08.svg" alt="" /></button>` : ""}
      <div class="streak-milestone-stack" aria-hidden="true">
        <img class="streak-milestone-medal" src="assets/streak/milestone-medal.svg" alt="" />
        <div class="streak-milestone-ribbon">
          <img class="streak-milestone-banner" src="assets/streak/milestone-banner.svg" alt="" />
          <span class="streak-milestone-percent">${m.percent}</span>
        </div>
      </div>
      ${
        earned
          ? `<span class="streak-status earned">Completed</span>`
          : `<div class="streak-progress-row">
        <span class="streak-progress-bar"><i style="width:${m.progress || 0}%"></i></span>
        <span class="streak-progress-label">${m.progress || 0}%</span>
      </div>`
      }
    </article>`;
  };

  const renderMilestones = () => {
    if (!milestoneGrid || !data) return;
    milestoneGrid.innerHTML = data.milestones.map(milestoneCardHtml).join("");
  };

  const setStreakTab = (name) => {
    streakTabs.forEach((tab) => {
      const active = tab.dataset.streakTab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    streakPanels.forEach((panel) => {
      const active = panel.dataset.streakPanel === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  };

  const setBadgeTier = (tier) => {
    badgeTabsRoot?.querySelectorAll("[data-badge-tier]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.badgeTier === tier);
    });
    badgePanelsRoot?.querySelectorAll("[data-badge-panel]").forEach((panel) => {
      const active = panel.dataset.badgePanel === tier;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  };

  const openStreak = () => {
    if (!streakOverlay) return;
    streakOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeStreak = () => {
    if (!streakOverlay) return;
    streakOverlay.hidden = true;
    document.body.style.overflow = "";
  };

  const openReward = (name) => {
    const overlay = document.querySelector(`[data-reward-overlay="${name}"]`);
    if (overlay) overlay.hidden = false;
  };

  const closeRewards = () => {
    rewardOverlays.forEach((overlay) => {
      overlay.hidden = true;
    });
  };

  const setMilestoneReward = (percent) => {
    const ribbon = document.querySelector("[data-milestone-percent]");
    const heading = document.querySelector("[data-milestone-heading]");
    const copy = document.querySelector("[data-milestone-copy]");
    if (ribbon) ribbon.textContent = `${percent}%`;
    if (heading) heading.textContent = `${percent}% of PMP Course Completed!`;
    if (copy) {
      copy.textContent = `You have completed ${percent}% of your certification preparation. Way to go!`;
    }
  };

  renderBadgePanels();
  renderMilestones();
  initCalendarFilters();
  buildCalendar();
  setStreakTab("activity");
  setBadgeTier("bronze");

  streakTrigger?.addEventListener("click", openStreak);
  document.querySelectorAll("[data-streak-close]").forEach((el) => {
    el.addEventListener("click", closeStreak);
  });
  streakTabs.forEach((tab) => {
    tab.addEventListener("click", () => setStreakTab(tab.dataset.streakTab || "activity"));
  });
  document.querySelectorAll("[data-reward-close]").forEach((el) => {
    el.addEventListener("click", closeRewards);
  });
  openShowcaseBtn?.addEventListener("click", () => {
    closeRewards();
    openReward("showcase");
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("open") === "streak") openStreak();
  if (params.get("reward") === "badge") openReward("badge");
  if (params.get("reward") === "milestone") {
    setMilestoneReward(Number(params.get("percent") || 25));
    openReward("milestone");
  }
  if (params.get("reward") === "showcase") openReward("showcase");

  window.CertSprintsStreak = {
    openStreak,
    closeStreak,
    openReward,
    closeRewards,
    setMilestoneReward,
  };
})();
