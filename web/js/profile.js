(function () {
  const P = window.PROFILE_SETTINGS;
  if (!P) return;

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "more.html";
  }

  function render() {
    const profile = P.read();
    const nameEl = document.getElementById("profDisplayName");
    const emailEl = document.getElementById("profEmail");
    const rowsEl = document.getElementById("profRows");

    if (nameEl) nameEl.textContent = P.displayName(profile);
    if (emailEl) emailEl.textContent = profile.email;

    if (rowsEl) {
      rowsEl.innerHTML = P.fields
        .map(function (field) {
          return (
            '<div class="prof-row">' +
            '<span class="prof-row-label">' +
            field.label +
            "</span>" +
            '<span class="prof-row-value">' +
            P.formatValue(field.key, profile) +
            "</span></div>"
          );
        })
        .join("");
    }
  }

  document.getElementById("profBackBtn")?.addEventListener("click", goBack);
  document.getElementById("profEditBtn")?.addEventListener("click", function () {
    window.location.href = "profile-edit.html";
  });

  render();
})();
