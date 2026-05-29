(function () {
  var ICONS = {
    unchecked: "assets/key-takeaway-2/icons/checkbox-unchecked-20.svg",
    checked: "assets/key-takeaway-2/icons/checkbox-checked-20.svg",
  };

  var RING_C = 2 * Math.PI * 26;

  var checkedMap = KT2_DATA.readChecked();
  var sectionsRoot = document.getElementById("kt2-sections");
  var counterEl = document.getElementById("kt2-counter");
  var hintEl = document.getElementById("kt2-hint");
  var ringArc = document.getElementById("kt2-ring-arc");
  var ringPct = document.getElementById("kt2-ring-pct");
  var finishBtn = document.getElementById("btn-finish");

  function applyDemoPreset() {
    var params = new URLSearchParams(window.location.search);
    var demo = params.get("demo");
    if (!demo) return;

    var presets = {
      "17": ["pm-1"],
      "33": ["pm-1", "pm-2"],
      "50": ["pm-1", "pm-2", "pm-3"],
      "83": ["pm-1", "pm-2", "pm-3", "agile-1", "agile-2"],
      "100": KT2_DATA.allItemIds(),
    };

    var ids = presets[demo];
    if (!ids) return;

    checkedMap = {};
    ids.forEach(function (id) {
      checkedMap[id] = true;
    });
    KT2_DATA.writeChecked(checkedMap);
  }

  function sectionComplete(section) {
    return section.items.every(function (item) {
      return checkedMap[item.id];
    });
  }

  function renderSections() {
    sectionsRoot.innerHTML = "";

    KT2_DATA.sections.forEach(function (section, index) {
      var block = document.createElement("div");
      block.className = "kt2-section-block";
      block.dataset.sectionId = section.id;

      var stepCol = document.createElement("div");
      stepCol.className = "kt2-step-col";

      var step = document.createElement("div");
      step.className = "kt2-step";
      step.id = "kt2-step-" + section.id;
      step.textContent = String(section.step);
      stepCol.appendChild(step);

      if (index < KT2_DATA.sections.length - 1) {
        var line = document.createElement("div");
        line.className = "kt2-vline";
        line.id = "kt2-line-" + section.id;
        stepCol.appendChild(line);
      }

      var main = document.createElement("div");
      main.className = "kt2-section-main";

      var head = document.createElement("div");
      head.className = "kt2-section-head";
      head.innerHTML =
        '<p class="kt2-section-title">' +
        section.title +
        '</p><p class="kt2-section-tag">' +
        section.tagline +
        "</p>";
      main.appendChild(head);

      var itemsWrap = document.createElement("div");
      itemsWrap.className = "kt2-items";

      section.items.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "kt2-item" + (checkedMap[item.id] ? " checked" : "");
        btn.dataset.itemId = item.id;
        btn.innerHTML =
          '<span class="kt2-item-text">' +
          item.text +
          '</span><span class="kt2-item-check"><img src="' +
          (checkedMap[item.id] ? ICONS.checked : ICONS.unchecked) +
          '" alt="" width="15" height="15"/></span>';
        btn.addEventListener("click", function () {
          toggleItem(item.id);
        });
        itemsWrap.appendChild(btn);
      });

      main.appendChild(itemsWrap);
      block.appendChild(stepCol);
      block.appendChild(main);
      sectionsRoot.appendChild(block);
    });
  }

  function toggleItem(id) {
    checkedMap[id] = !checkedMap[id];
    KT2_DATA.writeChecked(checkedMap);
    updateUI();
  }

  function syncItemRow(id) {
    var btn = sectionsRoot.querySelector('[data-item-id="' + id + '"]');
    if (!btn) return;
    var isChecked = !!checkedMap[id];
    btn.classList.toggle("checked", isChecked);
    btn.querySelector("img").src = isChecked ? ICONS.checked : ICONS.unchecked;
  }

  function updateUI() {
    var pct = KT2_DATA.percentFromChecked(checkedMap);

    counterEl.textContent = pct + "% Knowledge Synced";
    ringPct.textContent = pct + "%";

    if (ringArc) {
      var offset = RING_C * (1 - pct / 100);
      ringArc.setAttribute("stroke-dasharray", String(RING_C));
      ringArc.setAttribute("stroke-dashoffset", String(offset));
      ringArc.setAttribute("stroke", pct >= 100 ? "#2ecc71" : "#007bff");
    }

    if (pct >= 100) {
      hintEl.textContent = "All takeaways secured!";
      finishBtn.classList.add("enabled");
    } else {
      hintEl.textContent = "Tap a tile to verify and lock.";
      finishBtn.classList.remove("enabled");
    }

    KT2_DATA.sections.forEach(function (section) {
      section.items.forEach(function (item) {
        syncItemRow(item.id);
      });

      var stepEl = document.getElementById("kt2-step-" + section.id);
      var lineEl = document.getElementById("kt2-line-" + section.id);
      var complete = sectionComplete(section);

      if (stepEl) stepEl.classList.toggle("done", complete);
      if (lineEl) lineEl.classList.toggle("done", complete);
    });
  }

  function finish() {
    if (!finishBtn.classList.contains("enabled")) return;
    window.location.href = "decision-simulator.html";
  }

  applyDemoPreset();
  renderSections();
  updateUI();

  finishBtn.addEventListener("click", finish);
})();
