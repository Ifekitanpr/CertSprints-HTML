(function () {
  const H = window.HELP_SUPPORT;
  if (!H) return;

  const faqListEl = document.getElementById("hsFaqList");
  const searchInput = document.getElementById("hsFaqSearch");
  let openId = H.faqs.find(function (f) {
    return f.open;
  })?.id;

  function goBack() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    if (from) {
      window.location.href = from.indexOf(".html") !== -1 ? from : from + ".html";
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "more.html";
  }

  function renderFaqs(filter) {
    if (!faqListEl) return;
    const query = (filter || "").trim().toLowerCase();
    faqListEl.innerHTML = H.faqs
      .map(function (faq) {
        const haystack = (faq.question + " " + faq.answer).toLowerCase();
        const hidden = query && haystack.indexOf(query) === -1;
        const isOpen = faq.id === openId;
        const icon = isOpen ? "minus-sign-24.svg" : "plus-sign-24.svg";
        const glyphClass = isOpen ? "hs-glyph--minus-24" : "hs-glyph--plus-24";
        return (
          '<article class="hs-faq-item' +
          (isOpen ? " is-open" : "") +
          (hidden ? " is-hidden" : "") +
          '" data-faq-id="' +
          faq.id +
          '">' +
          '<button type="button" class="hs-faq-trigger" data-faq-toggle="' +
          faq.id +
          '">' +
          "<h3>" +
          faq.question +
          "</h3>" +
          '<span class="hs-icon-slot hs-icon-slot--24">' +
          '<img class="hs-glyph ' +
          glyphClass +
          '" src="assets/help-support/icons/' +
          icon +
          '" alt="" />' +
          "</span></button>" +
          '<p class="hs-faq-body">' +
          faq.answer +
          "</p></article>"
        );
      })
      .join("");
  }

  faqListEl?.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-faq-toggle]");
    if (!btn) return;
    const id = btn.getAttribute("data-faq-toggle");
    openId = openId === id ? null : id;
    renderFaqs(searchInput?.value || "");
  });

  searchInput?.addEventListener("input", function () {
    renderFaqs(searchInput.value);
  });

  document.getElementById("hsBackBtn")?.addEventListener("click", goBack);

  renderFaqs();
})();
