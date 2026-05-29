(function () {
  var data = SS_DATA;
  var introView = document.getElementById("ss-intro-view");
  var gameView = document.getElementById("ss-game-view");
  var recapView = document.getElementById("ss-recap-view");
  var cardEl = document.getElementById("ss-active-card");
  var cardTextEl = document.getElementById("ss-card-text");
  var bucketsRoot = document.getElementById("ss-buckets");
  var progressText = document.getElementById("ss-progress-text");
  var progressFill = document.getElementById("ss-game-progress-fill");
  var resetBtn = document.getElementById("ss-reset-btn");
  var deckSlot = document.getElementById("ss-deck-slot");

  var sortedCount = 0;
  var cardIndex = 0;
  var locked = false;
  var dragging = false;
  var dragOffsetX = 0;
  var dragOffsetY = 0;
  var hoverBucketId = null;
  var bucketEls = {};
  var validatedEls = {};

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function showView(name) {
    introView.classList.toggle("active", name === "intro");
    gameView.classList.toggle("active", name === "game");
    recapView.classList.toggle("active", name === "recap");
  }

  function renderIntro() {
    document.getElementById("ss-intro-badge").textContent = data.intro.badge;
    document.getElementById("ss-intro-title").textContent = data.intro.title;
    document.getElementById("ss-intro-desc").textContent = data.intro.description;
    document.getElementById("ss-stat-groups").textContent = pad2(data.intro.groups);
    document.getElementById("ss-stat-items").textContent = pad2(data.intro.items);
    document.getElementById("ss-drag-hint-text").textContent = data.intro.dragHint;
    document.getElementById("ss-game-title").textContent = data.gameplay.title;
    document.getElementById("ss-game-sub").textContent = data.gameplay.subtitle;
    document.getElementById("ss-hint-title").textContent = data.gameplay.hintTitle;
    document.getElementById("ss-hint-sub").textContent = data.gameplay.hintSub;
    document.getElementById("ss-recap-badge").textContent = data.recap.badge;
    document.getElementById("ss-recap-title").textContent = data.recap.title;
    document.getElementById("ss-recap-sub").textContent = data.recap.subtitle;
  }

  function renderBuckets() {
    bucketsRoot.innerHTML = "";
    bucketEls = {};
    validatedEls = {};
    data.buckets.forEach(function (bucket) {
      var el = document.createElement("div");
      el.className = "ss-bucket";
      el.dataset.bucket = bucket.id;
      el.style.background = bucket.bg;
      el.style.borderColor = bucket.border;
      el.innerHTML =
        '<div class="ss-bucket-icon"><img src="' +
        bucket.icon +
        '" alt="" width="16" height="16"/></div>' +
        '<p class="ss-bucket-label">' +
        bucket.label +
        '</p><p class="ss-bucket-drop">Drop here</p>' +
        '<img class="ss-bucket-arrow" src="' +
        bucket.arrowIcon +
        '" alt="" width="20" height="20"/>';

      var validated = document.createElement("div");
      validated.className = "ss-validated";
      validated.innerHTML =
        '<img src="assets/scenario-sorting/icons/tick-double-01-20.svg" alt="" width="20" height="20"/>' +
        "<span>Validated</span>";
      el.appendChild(validated);

      bucketsRoot.appendChild(el);
      bucketEls[bucket.id] = el;
      validatedEls[bucket.id] = validated;
    });
  }

  var bucketGlyphs = {
    planning: "ss-glyph--list-view-16",
    execution: "ss-glyph--chart-relationship-16",
    monitoring: "ss-glyph--tv-01-16",
  };

  function renderRecap() {
    var root = document.getElementById("ss-recap-groups");
    root.innerHTML = "";
    data.buckets.forEach(function (bucket) {
      var cards = data.cards.filter(function (c) {
        return c.bucket === bucket.id;
      });
      if (!cards.length) return;
      var section = document.createElement("div");
      section.className = "ss-recap-section";
      section.innerHTML =
        '<div class="ss-recap-group-head"><span class="ss-icon-slot ss-icon-slot--16"><img class="ss-glyph ' +
        (bucketGlyphs[bucket.id] || "ss-glyph--list-view-16") +
        '" src="' +
        bucket.icon +
        '" alt=""/></span><span>' +
        bucket.label +
        "</span></div>";
      cards.forEach(function (card) {
        var item = document.createElement("div");
        item.className = "ss-recap-item";
        item.innerHTML =
          '<div class="ss-recap-tick"><span class="ss-icon-slot ss-icon-slot--17"><img class="ss-glyph ss-glyph--tick-02-17" src="assets/scenario-sorting/icons/tick-02-17.svg" alt=""/></span></div>' +
          '<p>&quot;' +
          card.text +
          "&quot;</p>";
        section.appendChild(item);
      });
      root.appendChild(section);
    });
  }

  function currentCard() {
    return data.cards[cardIndex] || null;
  }

  function updateProgress() {
    progressText.textContent = sortedCount + "/" + data.cards.length;
    var pct = (sortedCount / data.cards.length) * 100;
    progressFill.style.width = pct + "%";
    resetBtn.classList.toggle("is-disabled", sortedCount === 0);
  }

  function resetCardVisual() {
    cardEl.classList.remove("is-dragging", "is-wrong", "is-mismatch", "is-hidden");
    cardEl.style.transform = "";
    cardEl.style.left = "";
    cardEl.style.top = "";
    cardEl.style.position = "";
    cardEl.style.width = "";
    cardEl.style.zIndex = "";
    cardEl.innerHTML =
      '<img class="ss-card-grip" src="assets/scenario-sorting/icons/horizontal-drag-drop-24.svg" alt=""/>' +
      '<div class="ss-card-icon-wrap"><img src="assets/scenario-sorting/icons/task-done-02-20.svg" alt="" width="20" height="20"/></div>' +
      '<p class="ss-card-text" id="ss-card-text"></p>' +
      '<p class="ss-mismatch-label">Logic Mismatch</p>';
    cardTextEl = document.getElementById("ss-card-text");
  }

  function loadCurrentCard() {
    var card = currentCard();
    if (!card) return;
    resetCardVisual();
    cardTextEl.textContent = '"' + card.text + '"';
    deckSlot.appendChild(cardEl);
    bindCardEvents();
  }

  function bucketAtPoint(x, y) {
    var hit = null;
    Object.keys(bucketEls).forEach(function (id) {
      var rect = bucketEls[id].getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        hit = id;
      }
    });
    return hit;
  }

  function setHoverBucket(id) {
    if (hoverBucketId === id) return;
    if (hoverBucketId && bucketEls[hoverBucketId]) {
      bucketEls[hoverBucketId].classList.remove("is-over");
    }
    hoverBucketId = id;
    if (hoverBucketId && bucketEls[hoverBucketId]) {
      bucketEls[hoverBucketId].classList.add("is-over");
    }
    cardEl.classList.toggle("is-wrong", !!hoverBucketId && hoverBucketId !== currentCard().bucket);
  }

  function onPointerMove(e) {
    if (!dragging || locked) return;
    cardEl.style.left = e.clientX - dragOffsetX + "px";
    cardEl.style.top = e.clientY - dragOffsetY + "px";
    setHoverBucket(bucketAtPoint(e.clientX, e.clientY));
  }

  function finishDrag(e) {
    if (!dragging) return;
    dragging = false;
    if (cardEl.hasPointerCapture && cardEl.hasPointerCapture(e.pointerId)) {
      cardEl.releasePointerCapture(e.pointerId);
    }
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", finishDrag);
    document.removeEventListener("pointercancel", finishDrag);
    cardEl.classList.remove("is-dragging");
    setHoverBucket(null);

    var dropBucket = bucketAtPoint(e.clientX, e.clientY);
    var card = currentCard();
    if (!card) return;

    if (!dropBucket) {
      cardEl.classList.add("is-wrong");
      setTimeout(function () {
        cardEl.classList.remove("is-wrong");
        resetCardPosition();
      }, 450);
      return;
    }

    if (dropBucket !== card.bucket) {
      showMismatch();
      return;
    }

    handleCorrectDrop(dropBucket);
  }

  function resetCardPosition() {
    cardEl.style.position = "";
    cardEl.style.left = "";
    cardEl.style.top = "";
    cardEl.style.width = "";
    cardEl.style.transform = "";
    cardEl.style.zIndex = "";
    deckSlot.appendChild(cardEl);
  }

  function showMismatch() {
    locked = true;
    cardEl.classList.add("is-mismatch");
    cardEl.classList.remove("is-wrong", "is-dragging");
    cardEl.style.position = "";
    cardEl.style.left = "";
    cardEl.style.top = "";
    cardEl.style.transform = "";
    cardEl.innerHTML =
      '<div class="ss-card-icon-wrap"><img src="assets/scenario-sorting/icons/information-circle-20.svg" alt="" width="20" height="20"/></div>' +
      '<p class="ss-mismatch-label" style="display:block">Logic Mismatch</p>';
    deckSlot.appendChild(cardEl);
    setTimeout(function () {
      locked = false;
      loadCurrentCard();
    }, 1400);
  }

  function handleCorrectDrop(bucketId) {
    locked = true;
    cardEl.classList.add("is-hidden");
    resetCardPosition();

    var bucket = bucketEls[bucketId];
    bucket.classList.add("has-card");
    var validated = validatedEls[bucketId];
    validated.classList.add("show");

    sortedCount += 1;
    updateProgress();

    setTimeout(function () {
      validated.classList.remove("show");
      cardIndex += 1;
      locked = false;
      if (cardIndex >= data.cards.length) {
        setTimeout(showRecap, 350);
      } else {
        loadCurrentCard();
      }
    }, 900);
  }

  function onPointerDown(e) {
    if (locked || cardIndex >= data.cards.length) return;
    if (e.target.closest(".ss-mismatch-label")) return;
    e.preventDefault();
    dragging = true;
    var rect = cardEl.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    cardEl.classList.add("is-dragging");
    cardEl.style.position = "fixed";
    cardEl.style.width = rect.width + "px";
    cardEl.style.left = rect.left + "px";
    cardEl.style.top = rect.top + "px";
    cardEl.style.zIndex = "300";
    document.body.appendChild(cardEl);
    cardEl.setPointerCapture(e.pointerId);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", finishDrag);
    document.addEventListener("pointercancel", finishDrag);
  }

  function bindCardEvents() {
    cardEl.onpointerdown = onPointerDown;
  }

  function resetGame() {
    sortedCount = 0;
    cardIndex = 0;
    locked = false;
    dragging = false;
    hoverBucketId = null;
    renderBuckets();
    loadCurrentCard();
    updateProgress();
  }

  function startGame() {
    resetGame();
    showView("game");
  }

  function showRecap() {
    renderRecap();
    showView("recap");
  }

  function applyDemo() {
    var params = new URLSearchParams(window.location.search);
    var view = params.get("view");
    var demo = params.get("demo");
    if (view === "recap") {
      sortedCount = data.cards.length;
      cardIndex = data.cards.length;
      renderBuckets();
      updateProgress();
      showRecap();
      return;
    }
    if (view === "game" || demo) {
      startGame();
    }
    if (demo === "drag") {
      cardEl.classList.add("is-dragging");
      cardEl.style.transform = "rotate(14deg)";
    } else if (demo === "wrong") {
      cardEl.classList.add("is-wrong");
    } else if (demo === "mismatch") {
      showMismatch();
    }
  }

  document.getElementById("ss-intro-back").addEventListener("click", function () {
    window.location.href = "insight-exchange.html";
  });

  document.getElementById("ss-start-btn").addEventListener("click", startGame);

  document.getElementById("ss-game-close").addEventListener("click", function () {
    window.location.href = "insight-exchange.html";
  });

  resetBtn.addEventListener("click", function () {
    if (sortedCount === 0) return;
    resetGame();
  });

  document.getElementById("ss-recap-back").addEventListener("click", function () {
    showView("game");
  });

  document.getElementById("ss-recap-help").addEventListener("click", function () {
    window.location.href = "help-support.html?from=scenario-sorting";
  });

  document.getElementById("ss-complete-btn").addEventListener("click", function () {
    window.location.href = "risk-cycle-sequencer.html";
  });

  renderIntro();
  renderBuckets();
  loadCurrentCard();
  updateProgress();
  applyDemo();
})();
