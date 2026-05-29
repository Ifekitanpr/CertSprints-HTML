(function () {
  const data = window.COMMUNITY;
  if (!data || !data.members) return;

  const AVATAR = data.AVATAR;
  let panelEl = null;
  let query = "";

  function render() {
    if (!panelEl) return;
    const list = data.members.filter(function (m) {
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return m.name.toLowerCase().indexOf(q) >= 0 || m.role.toLowerCase().indexOf(q) >= 0;
    });

    panelEl.innerHTML =
      '<div class="cm-members-panel">' +
      '<div class="cm-members-head"><h2>Members</h2>' +
      '<p>' +
      data.members.length +
      " members in this cohort</p></div>" +
      '<input class="cm-members-search" type="search" id="cmMembersSearch" placeholder="Search members…" value="' +
      (query.replace(/"/g, "&quot;") || "") +
      '" />' +
      '<div class="cm-members-list">' +
      list
        .map(function (m) {
          return (
            '<article class="cm-member-row">' +
            '<img class="cm-member-avatar" src="' +
            AVATAR +
            m.avatar +
            '" alt="" />' +
            '<div class="cm-member-copy">' +
            "<strong>" +
            m.name +
            (m.isYou ? " (You)" : "") +
            "</strong>" +
            "<span>" +
            m.role +
            "</span></div>" +
            '<span class="cm-member-status' +
            (m.online ? " is-online" : "") +
            '">' +
            (m.online ? "Online" : "Offline") +
            "</span></article>"
          );
        })
        .join("") +
      (list.length ? "" : '<p class="cm-members-empty">No members match your search.</p>') +
      "</div></div>";

    const search = panelEl.querySelector("#cmMembersSearch");
    if (search) {
      search.addEventListener("input", function () {
        query = search.value;
        render();
        search.focus();
        search.selectionStart = search.selectionEnd = search.value.length;
      });
    }
  }

  window.CmMembers = {
    mount: function (el) {
      panelEl = el;
      render();
    },
  };
})();
