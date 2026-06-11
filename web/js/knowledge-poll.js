(function () {
  "use strict";

  var ratingView = document.getElementById("kp-rating");
  var resultView = document.getElementById("kp-result");
  var range = document.getElementById("kp-range");
  var scaleWrap = document.querySelector(".kp-scale-wrap");
  var marker = document.getElementById("kp-marker");
  var fill = document.getElementById("kp-fill");
  var label = document.getElementById("kp-rating-label");
  var lockButton = document.getElementById("kp-lock");
  var backButton = document.getElementById("kp-back");
  var closeButton = document.getElementById("kp-close");
  var helpButton = document.getElementById("kp-help");
  var selected = null;

  var RATINGS = {
    "-2": "HIGHLY INEFFECTIVE",
    "-1": "GENERALLY INEFFECTIVE",
    "0": "NEUTRAL / UNDECIDED",
    "1": "GENERALLY EFFECTIVE",
    "2": "HIGHLY EFFECTIVE"
  };

  function setView(name) {
    var showResult = name === "result";
    ratingView.classList.toggle("active", !showResult);
    resultView.classList.toggle("active", showResult);
    document.querySelector(".kp-nav-title").textContent = showResult ? "KNOWLEDGE POLL RESULT" : "KNOWLEDGE POLL";
  }

  function setRating(value, chosen) {
    value = Math.max(-2, Math.min(2, Number(value)));
    range.value = String(value);
    if (chosen) selected = value;

    var position = ((value + 2) / 4) * 100;
    marker.style.left = position + "%";
    marker.textContent = value > 0 ? "+" + value : String(value);
    label.textContent = RATINGS[String(value)];
    scaleWrap.classList.toggle("negative", value < 0);
    scaleWrap.classList.toggle("positive", value > 0);

    if (value < 0) {
      fill.style.left = position + "%";
      fill.style.width = (50 - position) + "%";
    } else if (value > 0) {
      fill.style.left = "50%";
      fill.style.width = (position - 50) + "%";
    } else {
      fill.style.left = "50%";
      fill.style.width = "0";
    }

    lockButton.disabled = selected === null;
  }

  function showResult() {
    if (selected === null) return;
    document.querySelectorAll(".kp-bar").forEach(function (bar) {
      bar.classList.toggle("active", Number(bar.dataset.rating) === selected);
    });
    setView("result");
  }

  range.addEventListener("input", function () { setRating(range.value, true); });
  range.addEventListener("change", function () { setRating(range.value, true); });
  lockButton.addEventListener("click", showResult);
  closeButton.addEventListener("click", function () { window.location.href = new URL("lms/peer-teachbacks.html", document.baseURI).href; });
  backButton.addEventListener("click", function () {
    if (resultView.classList.contains("active")) {
      setView("rating");
    } else if (window.history.length > 1) {
      window.history.back();
    }
  });
  helpButton.addEventListener("click", function () {
    window.location.href = new URL("support/help-support.html?from=knowledge-poll", document.baseURI).href;
  });

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("rating");
  if (preset !== null && RATINGS[preset]) setRating(Number(preset), true);
  else setRating(0, false);
  if (params.get("view") === "result") {
    if (selected === null) setRating(-2, true);
    showResult();
  }
})();
