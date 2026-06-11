(function () {
  const D = window.SECURITY_SETTINGS;
  if (!D) return;

  const ICON = D.ICON;
  const IMAGE = D.IMAGE;
  const KEYS = D.storageKeys;

  const hubEl = document.getElementById("secHub");
  const tfaToggle = document.getElementById("secTfaToggle");

  let activeOverlay = null;
  let pendingDeviceId = null;
  let selected2faMethod = "authenticator";
  let codeContext = "setup-auth";

  function readState() {
    const sessionsRaw = localStorage.getItem(KEYS.sessions);
    let sessions = D.defaultSessions;
    try {
      if (sessionsRaw) sessions = JSON.parse(sessionsRaw);
    } catch (e) {
      sessions = D.defaultSessions;
    }
    return {
      passwordEnabled: localStorage.getItem(KEYS.passwordEnabled) !== "0",
      tfaMethod: localStorage.getItem(KEYS.tfaMethod) || "none",
      googleLinked: localStorage.getItem(KEYS.googleLinked) !== "0",
      linkedinLinked: localStorage.getItem(KEYS.linkedinLinked) !== "0",
      sessions: sessions,
    };
  }

  function writeState(partial) {
    const s = readState();
    const next = Object.assign({}, s, partial);
    localStorage.setItem(KEYS.passwordEnabled, next.passwordEnabled ? "1" : "0");
    localStorage.setItem(KEYS.tfaMethod, next.tfaMethod);
    localStorage.setItem(KEYS.googleLinked, next.googleLinked ? "1" : "0");
    localStorage.setItem(KEYS.linkedinLinked, next.linkedinLinked ? "1" : "0");
    localStorage.setItem(KEYS.sessions, JSON.stringify(next.sessions));
    renderHub();
  }

  function glyph(name) {
    return '<img class="sec-glyph sec-glyph--' + name + '" src="' + ICON + name + '.svg" alt="" />';
  }

  function iconBox(glyphName) {
    return (
      '<span class="sec-icon-box">' +
      '<span class="sec-icon-slot sec-icon-slot--24">' +
      glyph(glyphName) +
      "</span></span>"
    );
  }

  function renderHub() {
    const s = readState();
    const tfaOn = s.tfaMethod !== "none";

    let passwordSection = "";
    if (s.passwordEnabled) {
      passwordSection =
        '<div class="sec-row sec-row--between">' +
        '<div class="sec-row-main">' +
        iconBox("password-24") +
        '<div class="sec-copy"><h3>Password</h3><p>Last changed 3 months ago</p></div></div>' +
        '<span class="sec-badge sec-badge--success">Enabled</span></div>' +
        '<button type="button" class="sec-btn sec-btn--ghost" data-sec-action="change-password">Change password</button>';
    } else {
      passwordSection =
        '<div class="sec-row sec-row--between">' +
        '<div class="sec-row-main">' +
        iconBox("password-24") +
        '<div class="sec-copy"><h3>Password</h3><p>Last changed 3 months ago</p></div></div>' +
        '<span class="sec-badge sec-badge--muted">Disabled</span></div>' +
        '<button type="button" class="sec-btn sec-btn--primary-outline" data-sec-action="set-password">Set password</button>';
    }

    let linkedRows = "";
    if (s.googleLinked) {
      linkedRows +=
        '<hr class="sec-divider" />' +
        '<div class="sec-row sec-row--between">' +
        '<div class="sec-row-main">' +
        iconBox("google-24") +
        '<div class="sec-copy"><h3>Google</h3><p>' +
        D.googleEmail +
        "</p></div></div>" +
        '<button type="button" class="sec-btn sec-btn--remove" data-sec-action="unlink-google">Remove</button></div>';
    }
    if (s.linkedinLinked) {
      linkedRows +=
        '<hr class="sec-divider" />' +
        '<div class="sec-row sec-row--between">' +
        '<div class="sec-row-main">' +
        iconBox("linkedin-24") +
        '<div class="sec-copy"><h3>Linkedin</h3><p>Connected</p></div></div>' +
        '<button type="button" class="sec-btn sec-btn--remove" data-sec-action="unlink-linkedin">Remove</button></div>';
    }
    linkedRows +=
      '<hr class="sec-divider" />' +
      '<div class="sec-row sec-row--between">' +
      '<div class="sec-row-main">' +
      iconBox("email-24") +
      '<div class="sec-copy"><h3>Email code</h3><p>Connected</p></div></div>' +
      '<span class="sec-badge sec-badge--success">Enabled</span></div>';

    const sessionRows = s.sessions
      .map(function (device, index) {
        const currentBadge = device.isCurrent
          ? '<span class="sec-badge sec-badge--current">Current</span>'
          : "";
        return (
          (index > 0 ? '<hr class="sec-divider" />' : "") +
          '<div class="sec-row sec-row--between">' +
          '<div class="sec-row-main">' +
          iconBox(device.glyph || "phone-24") +
          '<div class="sec-copy sec-session-name-wrap">' +
          currentBadge +
          "<h3>" +
          device.name +
          "</h3><p>" +
          device.meta +
          "</p></div></div>" +
          '<button type="button" class="sec-btn sec-btn--signout" data-sec-action="sign-out-device" data-device-id="' +
          device.id +
          '">Sign out</button></div>'
        );
      })
      .join("");

    hubEl.innerHTML =
      '<section class="sec-section">' +
      '<p class="sec-section-label">Password &amp; Sign in</p>' +
      '<div class="sec-card sec-password-block">' +
      passwordSection +
      linkedRows +
      "</div></section>" +
      '<section class="sec-section">' +
      '<p class="sec-section-label">2FA</p>' +
      '<div class="sec-card">' +
      '<div class="sec-row sec-row--between">' +
      '<div class="sec-row-main">' +
      iconBox("tfa-key-24") +
      '<div class="sec-copy"><h3>Two Factor Authentication</h3><p>Use an authenticator app/SMS code for login verification</p></div></div>' +
      '<label class="sec-toggle" aria-label="Two Factor Authentication">' +
      '<input type="checkbox" id="secTfaToggleInput" ' +
      (tfaOn ? "checked" : "") +
      " />" +
      '<span class="sec-toggle-track"></span><span class="sec-toggle-thumb"></span></label></div></div></section>' +
      '<section class="sec-section">' +
      '<p class="sec-section-label">Active Sessions &amp; Devices</p>' +
      '<div class="sec-card">' +
      sessionRows +
      "</div></section>";

    const toggleInput = document.getElementById("secTfaToggleInput");
    if (toggleInput) {
      toggleInput.addEventListener("change", onTfaToggle);
    }
  }

  function openOverlay(id) {
    closeOverlay();
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    activeOverlay = id;
  }

  function closeOverlay() {
    if (!activeOverlay) return;
    const el = document.getElementById(activeOverlay);
    if (el) {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    }
    activeOverlay = null;
  }

  function closeAllOverlays() {
    document.querySelectorAll(".sec-overlay.open").forEach(function (el) {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    });
    activeOverlay = null;
  }

  function onTfaToggle(e) {
    const s = readState();
    const turningOn = e.target.checked;
    e.target.checked = s.tfaMethod !== "none";
    if (turningOn && s.tfaMethod === "none") {
      selected2faMethod = "authenticator";
      syncMethodCards();
      openOverlay("secEnable2faSheet");
    } else if (!turningOn && s.tfaMethod !== "none") {
      openOverlay("secUnbindWarningSheet");
    }
  }

  function syncMethodCards() {
    document.querySelectorAll("[data-sec-method]").forEach(function (card) {
      const method = card.getAttribute("data-sec-method");
      card.classList.toggle("is-selected", method === selected2faMethod);
    });
  }

  function bindCodeInputs(container, onComplete) {
    if (!container) return;
    const inputs = Array.from(container.querySelectorAll(".sec-code-input"));
    inputs.forEach(function (input, index) {
      input.addEventListener("input", function () {
        input.value = input.value.replace(/\D/g, "").slice(0, 1);
        if (input.value && inputs[index + 1]) inputs[index + 1].focus();
        const complete = inputs.every(function (i) {
          return i.value.length === 1;
        });
        if (onComplete) onComplete(complete);
      });
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Backspace" && !input.value && inputs[index - 1]) {
          inputs[index - 1].focus();
        }
      });
    });
  }

  function clearCodeInputs(container) {
    if (!container) return;
    container.querySelectorAll(".sec-code-input").forEach(function (input) {
      input.value = "";
    });
  }

  function verifyCodeAndComplete(successModalId, tfaMethod) {
    closeAllOverlays();
    if (tfaMethod) writeState({ tfaMethod: tfaMethod });
    openOverlay(successModalId);
  }

  function handleHubClick(e) {
    const btn = e.target.closest("[data-sec-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-sec-action");
    if (action === "change-password") {
      window.location.href = new URL("settings/settings-security-password.html?mode=change", document.baseURI).href;
    } else if (action === "set-password") {
      window.location.href = new URL("settings/settings-security-password.html?mode=set", document.baseURI).href;
    } else if (action === "unlink-google") {
      openOverlay("secUnlinkGoogleSheet");
    } else if (action === "unlink-linkedin") {
      openOverlay("secUnlinkLinkedinSheet");
    } else if (action === "sign-out-device") {
      pendingDeviceId = btn.getAttribute("data-device-id");
      openOverlay("secSignOutSheet");
    }
  }

  function bindGlobal() {
    document.querySelectorAll("[data-sec-close]").forEach(function (el) {
      el.addEventListener("click", closeOverlay);
    });
    document.querySelectorAll("[data-sec-close-all]").forEach(function (el) {
      el.addEventListener("click", closeAllOverlays);
    });

    hubEl?.addEventListener("click", handleHubClick);

    document.querySelectorAll("[data-sec-method]").forEach(function (card) {
      card.addEventListener("click", function () {
        selected2faMethod = card.getAttribute("data-sec-method");
        syncMethodCards();
      });
    });

    document.getElementById("secEnable2faCancel")?.addEventListener("click", closeOverlay);
    document.getElementById("secEnable2faProceed")?.addEventListener("click", function () {
      closeOverlay();
      if (selected2faMethod === "sms") {
        openOverlay("secSmsPhoneSheet");
      } else {
        openOverlay("secAuthSetupSheet");
      }
    });

    document.getElementById("secUnlinkGoogleConfirm")?.addEventListener("click", function () {
      writeState({ googleLinked: false });
      closeOverlay();
    });
    document.getElementById("secUnlinkLinkedinConfirm")?.addEventListener("click", function () {
      writeState({ linkedinLinked: false });
      closeOverlay();
    });

    document.getElementById("secSignOutConfirm")?.addEventListener("click", function () {
      const s = readState();
      const next = s.sessions.filter(function (d) {
        return d.id !== pendingDeviceId;
      });
      writeState({ sessions: next });
      pendingDeviceId = null;
      closeOverlay();
    });

    document.getElementById("secUnbindCancel")?.addEventListener("click", closeOverlay);
    document.getElementById("secUnbindConfirm")?.addEventListener("click", function () {
      closeOverlay();
      codeContext = "unbind";
      clearCodeInputs(document.getElementById("secUnbindCodeInputs"));
      openOverlay("secUnbindCodeSheet");
    });

    document.getElementById("secAuthSetupBack")?.addEventListener("click", function () {
      closeOverlay();
      openOverlay("secEnable2faSheet");
    });
    document.getElementById("secAuthSetupVerify")?.addEventListener("click", function () {
      verifyCodeAndComplete("secAuthCompleteModal", "authenticator");
    });

    document.getElementById("secSmsPhoneBack")?.addEventListener("click", function () {
      closeOverlay();
      openOverlay("secEnable2faSheet");
    });
    document.getElementById("secSmsPhoneProceed")?.addEventListener("click", function () {
      closeOverlay();
      codeContext = "setup-sms";
      clearCodeInputs(document.getElementById("secSmsCodeInputs"));
      openOverlay("secSmsCodeSheet");
    });

    document.getElementById("secSmsCodeVerify")?.addEventListener("click", function () {
      verifyCodeAndComplete("secSmsCompleteModal", "sms");
    });

    document.getElementById("secUnbindCodeVerify")?.addEventListener("click", function () {
      writeState({ tfaMethod: "none" });
      closeAllOverlays();
      openOverlay("secUnboundModal");
    });

    document.getElementById("secCopySecret")?.addEventListener("click", function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(D.authenticatorSecret.replace(/\s/g, ""));
      }
    });

    document.getElementById("secPasswordChangedDone")?.addEventListener("click", closeOverlay);
    document.getElementById("secAuthCompleteDone")?.addEventListener("click", closeOverlay);
    document.getElementById("secSmsCompleteDone")?.addEventListener("click", closeOverlay);
    document.getElementById("secUnboundDone")?.addEventListener("click", closeOverlay);

    bindCodeInputs(document.getElementById("secAuthCodeInputs"));
    bindCodeInputs(document.getElementById("secSmsCodeInputs"));
    bindCodeInputs(document.getElementById("secUnbindCodeInputs"));
  }

  function checkUrlModals() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("modal") === "password-changed") {
      openOverlay("secPasswordChangedModal");
      params.delete("modal");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? "?" + qs : ""));
    }
    if (params.get("modal") === "password-set") {
      openOverlay("secPasswordSetModal");
      params.delete("modal");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? "?" + qs : ""));
    }
  }

  renderHub();
  bindGlobal();
  checkUrlModals();

  window.SecSettings = {
    reset: function () {
      localStorage.removeItem(KEYS.passwordEnabled);
      localStorage.removeItem(KEYS.tfaMethod);
      localStorage.removeItem(KEYS.googleLinked);
      localStorage.removeItem(KEYS.linkedinLinked);
      localStorage.removeItem(KEYS.sessions);
      renderHub();
    },
  };
})();
