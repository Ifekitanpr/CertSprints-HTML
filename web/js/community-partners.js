(function () {
  const data = window.COMMUNITY;
  if (!data || !data.partners) return;

  const ICON = data.ICON;
  const AVATAR = data.AVATAR;
  const IMAGE = data.IMAGE;
  const P = data.partners;

  const panel = document.getElementById("cmPartnersPanel");
  const emptyEl = document.getElementById("cmPartnersEmpty");
  const matchedEl = document.getElementById("cmPartnersMatched");
  const subTabBtns = document.querySelectorAll("[data-cm-partners-sub]");
  const leaderboardEl = document.getElementById("cmPartnersLeaderboard");
  const achievementsEl = document.getElementById("cmPartnersAchievements");

  const findingOverlay = document.getElementById("cmPartnersFindingOverlay");
  const matchOverlay = document.getElementById("cmPartnersMatchOverlay");
  const reactionsOverlay = document.getElementById("cmPartnersReactionsOverlay");
  const commentsSheet = document.getElementById("cmPartnersCommentsSheet");

  let findTimer = null;
  let activeSubTab = "leaderboard";
  let activeAchievementId = null;

  function isMatched() {
    return localStorage.getItem(data.partnersMatchKey) === "1";
  }

  function setMatched(value) {
    if (value) localStorage.setItem(data.partnersMatchKey, "1");
    else localStorage.removeItem(data.partnersMatchKey);
    renderViewState();
  }

  function openOverlay(el) {
    if (!el) return;
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
  }

  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
  }

  function medalHtml(rank) {
    if (rank === "gold") {
      return '<img class="cm-partners-medal" src="' + IMAGE + 'medal-gold.png" alt="1st" />';
    }
    if (rank === "silver") {
      return '<img class="cm-partners-medal" src="' + IMAGE + 'medal-silver.png" alt="" />';
    }
    return '<span class="cm-partners-rank-label">' + rank.toUpperCase() + "</span>";
  }

  function statRow(entry) {
    return (
      '<div class="cm-partners-stats">' +
      '<span class="cm-partners-stat">' +
      '<span class="cm-icon-slot cm-icon-slot--18">' +
      '<img class="cm-glyph cm-glyph--fire-18" src="' +
      ICON +
      'fire-18.svg" alt="" />' +
      "</span>" +
      entry.streak +
      "</span>" +
      '<span class="cm-partners-stat">' +
      '<span class="cm-icon-slot cm-icon-slot--18">' +
      '<img class="cm-glyph cm-glyph--motion-02-18" src="' +
      ICON +
      'motion-02-18.svg" alt="" />' +
      "</span>" +
      entry.progress +
      "</span>" +
      '<span class="cm-partners-stat">' +
      '<span class="cm-icon-slot cm-icon-slot--18">' +
      '<img class="cm-glyph cm-glyph--dashboard-speed-02-18" src="' +
      ICON +
      'dashboard-speed-02-18.svg" alt="" />' +
      "</span>" +
      entry.readiness +
      "</span>" +
      "</div>"
    );
  }

  function renderLeaderboard() {
    if (!leaderboardEl) return;
    let html = '<div class="cm-partners-lb-card">';
    P.leaderboard.forEach(function (entry, i) {
      if (i > 0) html += '<div class="cm-partners-lb-divider"></div>';
      html +=
        '<div class="cm-partners-lb-row">' +
        '<div class="cm-partners-lb-main">' +
        '<div class="cm-partners-lb-head">' +
        '<img class="cm-partners-lb-avatar" src="' +
        AVATAR +
        entry.avatar +
        '" alt="" />' +
        '<p class="cm-partners-lb-name">' +
        entry.name +
        "</p>" +
        "</div>" +
        statRow(entry) +
        "</div>" +
        medalHtml(entry.rank) +
        "</div>";
    });
    html += "</div>";
    html +=
      '<button type="button" class="cm-partners-find-btn" id="cmPartnersFindAgain">' +
      '<span class="cm-icon-slot cm-icon-slot--20">' +
      '<img class="cm-glyph cm-glyph--ai-search-20" src="' +
      ICON +
      'ai-search-20.svg" alt="" />' +
      "</span>" +
      "Find a partner" +
      "</button>";
    leaderboardEl.innerHTML = html;

    const againBtn = document.getElementById("cmPartnersFindAgain");
    if (againBtn) againBtn.addEventListener("click", startFindPartner);
  }

  function achievementCard(item) {
    return (
      '<article class="cm-partners-ach-card" data-achievement-id="' +
      item.id +
      '">' +
      '<div class="cm-partners-ach-inner">' +
      '<div class="cm-partners-ach-author">' +
      '<img src="' +
      AVATAR +
      item.avatar +
      '" alt="" />' +
      "<span>" +
      item.author +
      "</span>" +
      "</div>" +
      '<div class="cm-partners-ach-body">' +
      '<img class="cm-partners-ach-badge" src="' +
      IMAGE +
      item.badge +
      '" alt="" />' +
      '<div class="cm-partners-ach-copy">' +
      "<h3>" +
      item.title +
      "</h3>" +
      "<p>" +
      item.subtitle +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div class="cm-partners-ach-foot">' +
      '<button type="button" class="cm-partners-react-pill" data-open-reactions="' +
      item.id +
      '">' +
      '<span class="cm-partners-react-emojis">' +
      item.reactions.join("") +
      "</span>" +
      '<span class="cm-partners-react-count">' +
      item.reactionCount +
      " reactions</span>" +
      "</button>" +
      '<button type="button" class="cm-partners-comment-count" data-open-comments="' +
      item.id +
      '">' +
      item.commentCount +
      " comments</button>" +
      "</div>" +
      "</div>" +
      '<div class="cm-partners-ach-compose">' +
      '<button type="button" class="cm-partners-add-react" aria-label="Add reaction">' +
      '<span class="cm-icon-slot cm-icon-slot--20">' +
      '<img class="cm-glyph cm-glyph--add-reaction-round-20" src="' +
      ICON +
      'add-reaction-round-20.svg" alt="" />' +
      "</span>" +
      "</button>" +
      '<div class="cm-partners-comment-input">' +
      '<input type="text" placeholder="Add a comment..." aria-label="Add a comment" />' +
      '<button type="button" class="cm-partners-send-btn">Send</button>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderAchievements() {
    if (!achievementsEl) return;
    let html = "";
    let lastMonth = "";
    P.achievements.forEach(function (item) {
      if (item.month !== lastMonth) {
        lastMonth = item.month;
        html += '<p class="cm-partners-month">' + item.month + "</p>";
      }
      html += achievementCard(item);
    });
    achievementsEl.innerHTML = html;

    achievementsEl.querySelectorAll("[data-open-reactions]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeAchievementId = btn.getAttribute("data-open-reactions");
        renderReactionsModal();
        openOverlay(reactionsOverlay);
      });
    });

    achievementsEl.querySelectorAll("[data-open-comments]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeAchievementId = btn.getAttribute("data-open-comments");
        renderCommentsSheet();
        openOverlay(commentsSheet);
      });
    });
  }

  function renderReactionsModal() {
    const list = document.getElementById("cmPartnersReactionsList");
    if (!list) return;
    list.innerHTML = P.reactions
      .map(function (r) {
        return (
          '<div class="cm-partners-reaction-row">' +
          '<div class="cm-partners-reaction-user">' +
          '<img src="' +
          AVATAR +
          r.avatar +
          '" alt="" />' +
          "<span>" +
          r.name +
          "</span>" +
          "</div>" +
          '<span class="cm-partners-reaction-emoji">' +
          r.emoji +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderCommentsSheet() {
    const list = document.getElementById("cmPartnersCommentsList");
    if (!list) return;
    list.innerHTML = P.comments
      .map(function (c) {
        return (
          '<div class="cm-partners-comment-block">' +
          '<div class="cm-partners-comment-author">' +
          '<img src="' +
          AVATAR +
          c.avatar +
          '" alt="" />' +
          "<span>" +
          c.author +
          "</span>" +
          "</div>" +
          '<div class="cm-partners-comment-bubble">' +
          c.text +
          "</div>" +
          '<div class="cm-partners-comment-meta">' +
          '<span>' +
          c.reactions +
          " reactions</span>" +
          (c.replies ? "<span>•</span><span>" + c.replies + " Comments</span>" : "") +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderMatchModal() {
    const avatars = document.getElementById("cmPartnersMatchAvatars");
    const nameEl = document.getElementById("cmPartnersMatchName");
    const descEl = document.getElementById("cmPartnersMatchDesc");
    if (avatars) {
      avatars.innerHTML =
        '<img src="' +
        AVATAR +
        (P.partner.avatarYou || "match-you.jpg") +
        '" alt="" />' +
        '<span class="cm-partners-match-link" aria-hidden="true">' +
        '<img class="cm-glyph cm-glyph--partner-link-24" src="' +
        ICON +
        'partner-link-24.svg" alt="" />' +
        "</span>" +
        '<img src="' +
        AVATAR +
        P.partner.avatar +
        '" alt="" />';
    }
    if (nameEl) nameEl.textContent = P.partner.name;
    if (descEl) descEl.textContent = P.partner.description;
  }

  function setSubTab(tab) {
    activeSubTab = tab;
    subTabBtns.forEach(function (btn) {
      const isActive = btn.getAttribute("data-cm-partners-sub") === tab;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    if (leaderboardEl) leaderboardEl.classList.toggle("cm-screen-hidden", tab !== "leaderboard");
    if (achievementsEl) achievementsEl.classList.toggle("cm-screen-hidden", tab !== "achievements");
  }

  function renderViewState() {
    const matched = isMatched();
    if (emptyEl) emptyEl.classList.toggle("cm-screen-hidden", matched);
    if (matchedEl) matchedEl.classList.toggle("cm-screen-hidden", !matched);
    if (matched) {
      renderLeaderboard();
      renderAchievements();
      setSubTab(activeSubTab);
    }
  }

  function cancelFindPartner() {
    if (findTimer) {
      clearTimeout(findTimer);
      findTimer = null;
    }
    closeOverlay(findingOverlay);
  }

  function completeFindPartner() {
    cancelFindPartner();
    renderMatchModal();
    openOverlay(matchOverlay);
  }

  function startFindPartner() {
    cancelFindPartner();
    openOverlay(findingOverlay);
    findTimer = setTimeout(completeFindPartner, 2200);
  }

  subTabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setSubTab(btn.getAttribute("data-cm-partners-sub"));
    });
  });

  document.getElementById("cmPartnersFindBtn")?.addEventListener("click", startFindPartner);

  findingOverlay?.querySelectorAll("[data-close-finding]").forEach(function (el) {
    el.addEventListener("click", cancelFindPartner);
  });

  document.getElementById("cmPartnersFindingCancel")?.addEventListener("click", cancelFindPartner);

  matchOverlay?.querySelectorAll("[data-close-match]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeOverlay(matchOverlay);
    });
  });

  document.getElementById("cmPartnersMatchOk")?.addEventListener("click", function () {
    closeOverlay(matchOverlay);
    setMatched(true);
    setSubTab("leaderboard");
  });

  reactionsOverlay?.querySelectorAll("[data-close-reactions]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeOverlay(reactionsOverlay);
    });
  });

  commentsSheet?.querySelectorAll("[data-close-comments]").forEach(function (el) {
    el.addEventListener("click", function () {
      closeOverlay(commentsSheet);
    });
  });

  window.CmPartners = {
    reset: function () {
      setMatched(false);
    },
    isMatched: isMatched,
  };

  renderViewState();
})();
