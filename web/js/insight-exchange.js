(function () {
  var data = IE_DATA;
  var textarea = document.getElementById("ie-response");
  var wrap = document.getElementById("ie-textarea-wrap");
  var charN = document.getElementById("ie-char-n");
  var postBtn = document.getElementById("ie-post-btn");
  var overlay = document.getElementById("ie-overlay");
  var root = document.getElementById("ie");
  var peerList = document.getElementById("ie-peer-list");

  function renderReflection() {
    var r = data.reflection;
    document.getElementById("ie-reflection").innerHTML =
      '<p>&quot;' +
      r.before +
      '<span class="hl">' +
      r.highlight +
      "</span>" +
      r.after +
      '&quot;</p>';
  }

  function renderGuides() {
    document.getElementById("ie-guides").innerHTML = data.guides
      .map(function (g) {
        return "<li>" + g + "</li>";
      })
      .join("");
  }

  function renderHeader() {
    document.getElementById("ie-badge-text").textContent = data.badge;
    document.getElementById("ie-title-prefix").textContent = data.titlePrefix;
    document.getElementById("ie-title-gradient").textContent = data.titleGradient;
    document.getElementById("ie-contributor-label").textContent = data.contributorLabel;
    textarea.placeholder = data.placeholder;
    textarea.maxLength = data.maxChars;
  }

  function avatarHtml(avatar, size) {
    size = size || 32;
    if (avatar.type === "photo") {
      return (
        '<div class="ie-peer-avatar" style="width:' +
        size +
        "px;height:" +
        size +
        'px"><img src="' +
        avatar.src +
        '" alt="" width="' +
        size +
        '" height="' +
        size +
        '"/></div>'
      );
    }
    return (
      '<div class="ie-peer-avatar initials" style="width:' +
      size +
      "px;height:" +
      size +
      "px;background:" +
      avatar.bg +
      '"><span>' +
      avatar.initials +
      "</span></div>"
    );
  }

  function renderPeerList(userText) {
    var html = "";

    html +=
      '<article class="ie-peer-card">' +
      '<div class="ie-peer-head">' +
      avatarHtml(data.userPeer.avatar) +
      '<div class="ie-peer-meta">' +
      '<div class="ie-peer-name-row">' +
      '<span class="ie-peer-name">' +
      data.userPeer.name +
      "</span>" +
      '<span class="ie-you-badge">You</span>' +
      "</div>" +
      '<p class="ie-peer-time">' +
      data.userPeer.meta +
      "</p>" +
      "</div></div>" +
      '<div class="ie-peer-body"><p>' +
      escapeHtml(userText) +
      "</p></div></article>";

    data.peers.forEach(function (peer) {
      html +=
        '<article class="ie-peer-card">' +
        '<div class="ie-peer-head">' +
        avatarHtml(peer.avatar) +
        '<div class="ie-peer-meta">' +
        '<span class="ie-peer-name">' +
        peer.name +
        "</span>" +
        '<p class="ie-peer-time">' +
        peer.meta +
        "</p>" +
        "</div></div>" +
        '<div class="ie-peer-body"><p>' +
        peer.text +
        "</p></div></article>";
    });

    peerList.innerHTML = html;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function syncInput() {
    var len = textarea.value.length;
    charN.textContent = String(len);
    var hasText = textarea.value.trim().length > 0;
    wrap.classList.toggle("filled", hasText);
    postBtn.classList.toggle("enabled", hasText);
  }

  function openSheet() {
    var text = textarea.value.trim();
    if (!text) return;
    localStorage.setItem(data.storageKey, text);
    renderPeerList(text);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    root.classList.add("sheet-open");
  }

  function closeSheet() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    root.classList.remove("sheet-open");
  }

  function applyDemo() {
    var demo = new URLSearchParams(window.location.search).get("demo");
    if (demo === "filled") {
      textarea.value = "This is a sample of contribrution to the discuss";
      syncInput();
    } else if (demo === "sheet") {
      textarea.value =
        "Agile has shifted our focus from 'following the plan' to 'delivering value.' In my software projects, we have seen a 40% reduction in rework because we catch errors early.";
      syncInput();
      openSheet();
    }
  }

  textarea.addEventListener("input", syncInput);

  document.getElementById("ie-back").addEventListener("click", function () {
    window.location.href = "decision-simulator.html";
  });

  postBtn.addEventListener("click", openSheet);

  document.getElementById("ie-contributors").addEventListener("click", function () {
    if (textarea.value.trim()) openSheet();
  });

  document.getElementById("ie-sheet-close").addEventListener("click", closeSheet);

  document.getElementById("ie-done-btn").addEventListener("click", function () {
    window.location.href = "scenario-sorting.html";
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeSheet();
  });

  document.getElementById("ie-sheet-wrap").addEventListener("click", function (e) {
    e.stopPropagation();
  });

  renderHeader();
  renderReflection();
  renderGuides();

  var saved = localStorage.getItem(data.storageKey);
  if (saved) {
    textarea.value = saved;
  }
  syncInput();
  applyDemo();
})();
