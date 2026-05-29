/**
 * CertSprints Resources Center — rebuilt from Figma designs
 */
document.addEventListener("DOMContentLoaded", () => {
  const data = window.ResourcesData;
  if (!data) return;

  renderHub(data.hub);
  renderFundamentals(data.fundamentals);
  renderBodyOfKnowledge(data.bodyOfKnowledge);
  renderEco(data.eco);
  renderTemplates(data.templates);
  renderGlossary(data.glossary);
  initNavigation();
});

function initNavigation() {
  document.querySelectorAll(".resources-pane-back").forEach((btn) => {
    btn.addEventListener("click", closeAllPanes);
  });
}

function openPane(paneId) {
  const pane = document.getElementById(paneId);
  const scroll = document.getElementById("resourcesMainScroll");
  if (!pane || !scroll) return;

  closeAllPanes();
  scroll.hidden = true;
  pane.hidden = false;
  pane.querySelector(".resources-pane-scroll")?.scrollTo(0, 0);
}

function closeAllPanes() {
  document.querySelectorAll(".resources-pane").forEach((p) => {
    p.hidden = true;
  });
  const scroll = document.getElementById("resourcesMainScroll");
  if (scroll) scroll.hidden = false;
}

function renderHub(hub) {
  const subtitle = document.getElementById("resourcesHubSubtitle");
  const list = document.getElementById("resourcesHubList");
  if (!list) return;

  if (subtitle) subtitle.textContent = hub.subtitle;

  list.innerHTML = hub.cards
    .map((card) => {
      const actionBtn =
        card.action === "coming-soon"
          ? `<span class="resources-btn resources-btn--disabled">Coming soon</span>`
          : `<button class="resources-btn resources-btn--primary resources-explore-btn" type="button" data-pane="${card.pane}">
              Explore
              <img class="resources-icon resources-icon--16" src="assets/resources/icons/arrow-right-02-sharp-16.svg" alt="" />
            </button>`;

      return `
        <article class="resources-hub-card" role="listitem">
          <div class="resources-hub-card-cover" style="height:${card.coverHeight}px">
            <img src="${card.cover}" alt="" width="140" height="${card.coverHeight}" />
          </div>
          <div class="resources-hub-card-body">
            <div class="resources-hub-card-meta">
              <span class="resources-hub-card-category">
                <img class="resources-icon resources-icon--16" src="${card.categoryIcon}" alt="" />
                ${card.categoryLabel}
              </span>
              <h2 class="resources-hub-card-title">${card.title}</h2>
              <p class="resources-hub-card-desc">${card.description}</p>
            </div>
            ${actionBtn}
          </div>
        </article>`;
    })
    .join("");

  list.querySelectorAll(".resources-explore-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const paneId = btn.getAttribute("data-pane");
      if (paneId) openPane(paneId);
    });
  });
}

function renderFundamentals(fundamentals) {
  const content = document.getElementById("fundamentalsContent");
  const menu = document.getElementById("fundamentalsChapterMenu");
  const label = document.getElementById("fundamentalsChapterLabel");
  const btn = document.getElementById("fundamentalsChapterBtn");
  if (!content || !fundamentals.chapters.length) return;

  const chapter = fundamentals.chapters[0];

  content.innerHTML = `
    <div class="resources-article-hero">
      <img src="assets/resources/fundamentals-hero.jpg" alt="" width="320" height="320" />
    </div>
    ${chapter.sections
      .map(
        (sec, i) => `
      <section class="resources-article-section" id="fundamentals-sec-${i}">
        <h2 class="resources-article-heading">${sec.title}</h2>
        <p class="resources-article-text">${sec.body}</p>
      </section>`
      )
      .join("")}
  `;

  if (menu && label && btn) {
    menu.innerHTML = chapter.sections
      .map(
        (sec, i) =>
          `<button type="button" role="option" data-index="${i}">${sec.title}</button>`
      )
      .join("");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      btn.setAttribute("aria-expanded", String(!menu.hidden));
    });

    document.addEventListener("click", () => {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    });

    menu.querySelectorAll("button").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = item.getAttribute("data-index");
        label.textContent = item.textContent;
        menu.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        const target = document.getElementById(`fundamentals-sec-${index}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
}

function renderBodyOfKnowledge(bok) {
  const content = document.getElementById("bodyOfKnowledgeContent");
  if (!content) return;

  content.innerHTML = `
    <header class="resources-article-section">
      <h2 class="resources-article-heading">${bok.title}</h2>
      <p class="resources-article-text">${bok.subtitle}</p>
    </header>
    ${bok.sections
      .map(
        (sec) => `
      <section class="resources-article-section">
        <h2 class="resources-article-heading">${sec.title}</h2>
        <p class="resources-article-text">${sec.body}</p>
      </section>`
      )
      .join("")}
  `;
}

function renderEco(eco) {
  const tabsEl = document.getElementById("ecoTabs");
  const panelsEl = document.getElementById("ecoTabPanels");
  if (!tabsEl || !panelsEl) return;

  tabsEl.innerHTML = eco.tabs
    .map(
      (tab, i) =>
        `<button class="resources-eco-tab${i === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${tab.id}">${tab.label}</button>`
    )
    .join("");

  panelsEl.innerHTML = `
    <div class="resources-eco-panel is-active" id="ecoPanel-overview" role="tabpanel">${renderEcoOverview(eco.overview)}</div>
    <div class="resources-eco-panel" id="ecoPanel-process" role="tabpanel" hidden>${renderEcoDomain(eco.process)}</div>
    <div class="resources-eco-panel" id="ecoPanel-people" role="tabpanel" hidden>${renderEcoDomain(eco.people)}</div>
    <div class="resources-eco-panel" id="ecoPanel-business" role="tabpanel" hidden>${renderEcoDomain(eco.business)}</div>
  `;

  tabsEl.querySelectorAll(".resources-eco-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-tab");
      tabsEl.querySelectorAll(".resources-eco-tab").forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      panelsEl.querySelectorAll(".resources-eco-panel").forEach((p) => {
        p.hidden = true;
        p.classList.remove("is-active");
      });
      const panel = document.getElementById(`ecoPanel-${id}`);
      if (panel) {
        panel.hidden = false;
        panel.classList.add("is-active");
      }
    });
  });
}

function renderEcoOverview(overview) {
  const sections = overview.sections
    .map(
      (sec) => `
    <section class="resources-eco-section">
      <h2 class="resources-eco-heading">${sec.title}</h2>
      <div class="resources-eco-text">
        ${sec.paragraphs.map((p) => `<p>${p}</p>`).join("")}
      </div>
      <div class="resources-eco-image">
        <img src="${sec.image}" alt="" />
      </div>
    </section>`
    )
    .join("");

  return `
    <div class="resources-eco-card">
      ${sections}
      ${renderEcoTable(overview.table)}
    </div>`;
}

function renderEcoDomain(domain) {
  return `
    <div class="resources-eco-card">
      <p class="resources-eco-intro">${domain.intro}</p>
      ${renderEcoTable(domain.table)}
    </div>`;
}

function renderEcoTable(rows) {
  if (!rows?.length) return "";

  const body = rows
    .map(
      (row) => `
    <tr>
      <td class="resources-eco-table-id">
        <span class="resources-eco-id-badge">${row.id}</span>
      </td>
      <td class="resources-eco-table-task">
        <span class="${row.taskBold ? "is-bold" : ""}">${row.task}</span>
      </td>
      <td class="resources-eco-table-desc">${row.description}</td>
      <td class="resources-eco-table-enablers">
        <ul>${row.enablers.map((e) => `<li>${e}</li>`).join("")}</ul>
      </td>
    </tr>`
    )
    .join("");

  return `
    <div class="resources-eco-table-scroll">
      <table class="resources-eco-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Task</th>
            <th>Description</th>
            <th>Enablers</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

function renderTemplates(templates) {
  const title = document.getElementById("templatesTitle");
  const subtitle = document.getElementById("templatesSubtitle");
  const list = document.getElementById("templatesList");
  const toast = document.getElementById("resourcesToast");
  const toastText = document.getElementById("resourcesToastText");
  if (!list) return;

  if (title) title.textContent = templates.title;
  if (subtitle) subtitle.textContent = templates.subtitle;

  list.innerHTML = templates.items
    .map(
      (item) => `
    <article class="resources-hub-card" role="listitem">
      <div class="resources-hub-card-cover" style="height:${item.coverHeight}px">
        <img src="${item.cover}" alt="" width="140" height="${item.coverHeight}" />
      </div>
      <div class="resources-hub-card-body">
        <div class="resources-hub-card-meta">
          <span class="resources-hub-card-file">
            <img class="resources-icon resources-icon--20" src="${item.fileIcon}" alt="" />
            ${item.fileLabel}
          </span>
          <h2 class="resources-hub-card-title">${item.title}</h2>
          <p class="resources-hub-card-desc">${item.description}</p>
        </div>
        <button class="resources-btn resources-btn--primary resources-download-btn" type="button" data-file="${item.fileName}">
          <img class="resources-icon resources-icon--16" src="assets/resources/icons/download-05-16.svg" alt="" />
          Download
        </button>
      </div>
    </article>`
    )
    .join("");

  let toastTimer = null;
  list.querySelectorAll(".resources-download-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fileName = btn.getAttribute("data-file") || "Template";
      if (toast && toastText) {
        toastText.textContent = `${fileName} download started`;
        toast.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
      }
    });
  });
}

function renderGlossary(glossary) {
  const title = document.getElementById("glossaryTitle");
  const subtitle = document.getElementById("glossarySubtitle");
  const alpha = document.getElementById("glossaryAlpha");
  const list = document.getElementById("glossaryList");
  const search = document.getElementById("glossarySearchInput");
  const empty = document.getElementById("glossaryEmpty");
  if (!alpha || !list) return;

  if (title) title.textContent = glossary.title;
  if (subtitle) subtitle.textContent = glossary.subtitle;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let activeLetter = "A";

  alpha.innerHTML = letters
    .map(
      (letter) =>
        `<button type="button" class="resources-glossary-letter${letter === activeLetter ? " is-active" : ""}" data-letter="${letter}">${letter}</button>`
    )
    .join("");

  function renderCards() {
    const query = (search?.value || "").trim().toLowerCase();
    const filtered = glossary.terms.filter((t) => {
      const matchesLetter = t.letter === activeLetter;
      const matchesSearch =
        !query ||
        t.term.toLowerCase().includes(query) ||
        t.definition.toLowerCase().includes(query);
      return matchesLetter && matchesSearch;
    });

    list.innerHTML = filtered
      .map(
        (t) => `
      <article class="resources-glossary-card" role="listitem" data-letter="${t.letter}">
        <div class="resources-glossary-card-head">
          <h2 class="resources-glossary-card-term">${t.term}</h2>
        </div>
        <dl class="resources-glossary-card-fields">
          <div><dt>Definition</dt><dd>${t.definition}</dd></div>
          <div><dt>Data Source</dt><dd>${t.dataSource}</dd></div>
          <div><dt>Source Definition</dt><dd>${t.sourceDefinition}</dd></div>
          <div><dt>Purpose/Use Case</dt><dd>${t.purpose}</dd></div>
        </dl>
      </article>`
      )
      .join("");

    if (empty) empty.hidden = filtered.length > 0;
  }

  alpha.querySelectorAll(".resources-glossary-letter").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeLetter = btn.getAttribute("data-letter");
      alpha.querySelectorAll(".resources-glossary-letter").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderCards();
    });
  });

  search?.addEventListener("input", renderCards);
  renderCards();
}
