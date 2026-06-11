(function () {
  const data = window.PRACTICE_EXAM;
  const tierList = document.getElementById("peTierList");
  const overlay = document.getElementById("peIntroOverlay");
  const introScrim = document.getElementById("peIntroScrim");
  const introDomains = document.getElementById("peIntroDomains");
  const checklist = document.getElementById("peChecklist");
  const introStart = document.getElementById("peIntroStart");
  const introClose = document.getElementById("peIntroClose");
  const dashboardScroll = document.querySelector(".dashboard-scroll");

  if (!data) {
    console.error("Practice Exam: PRACTICE_EXAM data failed to load");
    return;
  }

  if (!tierList) {
    console.error("Practice Exam: #peTierList not found");
    return;
  }

  let selectedTierId = "beginner";

  function statusLabel(status) {
    if (status === "complete") return "Complete";
    return "Not attempted";
  }

  function renderTiers() {
    tierList.innerHTML = data.tiers
      .map(function (tier) {
        const statusCls = tier.status === "complete" ? "" : " muted";
        const ctaCls = tier.btnVariant === "blue" ? "pe-tier-cta--blue" : "pe-tier-cta--dark";
        const arrow = "assets/resources/icons/arrow-right-02-sharp-16.svg";

        return (
          '<article class="pe-tier-card" role="listitem" data-tier="' +
          tier.id +
          '">' +
          '<div class="pe-tier-top">' +
          '<div class="pe-tier-icon" style="background:' +
          tier.iconBg +
          '"><img src="' +
          tier.icon +
          '" alt="" /></div>' +
          '<div class="pe-tier-copy">' +
          '<p class="pe-tier-name">' +
          tier.name +
          "</p>" +
          '<p class="pe-tier-sub">' +
          tier.subtitle +
          "</p>" +
          "</div>" +
          '<span class="pe-tier-badge" style="background:' +
          tier.badgeBg +
          ";border-color:" +
          tier.badgeBorder +
          ";color:" +
          tier.badgeColor +
          '">' +
          tier.tierLabel +
          "</span>" +
          "</div>" +
          '<div class="pe-tier-stats">' +
          '<div class="pe-tier-stat"><span class="pe-tier-stat-label">Duration</span><span class="pe-tier-stat-val">250 Mins</span></div>' +
          '<div class="pe-tier-stat"><span class="pe-tier-stat-label">Questions</span><span class="pe-tier-stat-val">180 Items</span></div>' +
          '<div class="pe-tier-stat"><span class="pe-tier-stat-label">To Pass</span><span class="pe-tier-stat-val">80%</span></div>' +
          "</div>" +
          '<div class="pe-tier-meta">' +
          '<div class="pe-tier-meta-col"><span class="pe-tier-meta-label">Status</span><span class="pe-tier-meta-val' +
          statusCls +
          '">' +
          statusLabel(tier.status) +
          "</span></div>" +
          '<div class="pe-tier-meta-col"><span class="pe-tier-meta-label">Best Score</span><span class="pe-tier-meta-val">' +
          tier.bestScore +
          "</span></div>" +
          "</div>" +
          '<button type="button" class="pe-tier-cta ' +
          ctaCls +
          '" data-action="start">' +
          "Start Practice" +
          '<img src="' +
          arrow +
          '" alt="" />' +
          "</button>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderIntroStatic() {
    if (introDomains) {
      introDomains.innerHTML = data.introDomains
        .map(function (d) {
          return (
            '<div class="pe-domain-row">' +
            '<div class="pe-domain-pct pe-domain-pct--' +
            d.colorClass +
            '">' +
            d.pct +
            "%</div>" +
            "<div>" +
            '<p class="pe-domain-name">' +
            d.title +
            "</p>" +
            '<p class="pe-domain-desc">' +
            d.desc +
            "</p>" +
            "</div></div>"
          );
        })
        .join("");
    }

    if (checklist) {
      checklist.innerHTML = data.checklist
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("");
    }
  }

  function openIntro() {
    if (!overlay) return;
    if (dashboardScroll) dashboardScroll.classList.add("pe-intro-scroll-lock");
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(function () {
      overlay.classList.add("open");
    });
  }

  function closeIntro() {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    if (dashboardScroll) dashboardScroll.classList.remove("pe-intro-scroll-lock");
  }

  /* Event delegation — works even if cards re-render */
  tierList.addEventListener("click", function (e) {
    const btn = e.target.closest(".pe-tier-cta,[data-action='start']");
    const card = e.target.closest("[data-tier]");
    if (!btn || !card) return;
    e.preventDefault();
    e.stopPropagation();
    selectedTierId = card.getAttribute("data-tier") || "beginner";
    openIntro();
  });

  if (introClose) introClose.addEventListener("click", closeIntro);
  if (introScrim) introScrim.addEventListener("click", closeIntro);

  if (introStart) {
    introStart.addEventListener("click", function () {
      window.location.href =
        new URL("practice/practice-exam-session.html?tier=", document.baseURI).href + encodeURIComponent(selectedTierId);
    });
  }

  renderTiers();
  renderIntroStatic();
})();
