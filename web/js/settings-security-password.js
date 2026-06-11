(function () {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") === "set" ? "set" : "change";
  const KEYS = window.SECURITY_SETTINGS?.storageKeys;

  const titleEl = document.getElementById("secPwPageTitle");
  const headingEl = document.getElementById("secPwHeading");
  const submitBtn = document.getElementById("secPwSubmit");
  const newInput = document.getElementById("secPwNew");
  const confirmInput = document.getElementById("secPwConfirm");
  const rules = {
    length: document.querySelector('[data-password-rule="length"]'),
    mix: document.querySelector('[data-password-rule="mix"]'),
    match: document.querySelector('[data-password-rule="match"]'),
  };
  const successModal = document.getElementById("secPwSuccessModal");
  const successTitle = document.getElementById("secPwSuccessTitle");
  const successBody = document.getElementById("secPwSuccessBody");
  const successDone = document.getElementById("secPwSuccessDone");

  if (mode === "set") {
    document.title = "CertSprints — Set Password";
    if (titleEl) titleEl.textContent = "Set password";
    if (headingEl) headingEl.textContent = "Set password";
    if (submitBtn) submitBtn.textContent = "Set password";
    if (successTitle) successTitle.textContent = "Password set!";
    if (successBody) {
      successBody.textContent =
        "Your password has been set successfully. You can now sign in with your password.";
    }
  }

  document.querySelectorAll(".sec-pw-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      const input = button.closest(".sec-pw-input")?.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  function updateRules() {
    const password = newInput?.value || "";
    const confirmation = confirmInput?.value || "";
    const checks = {
      length: password.length >= 8,
      mix: /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
      match: password.length > 0 && password === confirmation,
    };
    Object.entries(checks).forEach(function (entry) {
      rules[entry[0]]?.classList.toggle("is-valid", entry[1]);
    });
    if (submitBtn) submitBtn.disabled = !Object.values(checks).every(Boolean);
  }

  newInput?.addEventListener("input", updateRules);
  confirmInput?.addEventListener("input", updateRules);
  updateRules();

  submitBtn?.addEventListener("click", function () {
    if (submitBtn.disabled) return;
    if (KEYS) localStorage.setItem(KEYS.passwordEnabled, "1");
    successModal?.classList.add("open");
    successModal?.setAttribute("aria-hidden", "false");
  });

  successDone?.addEventListener("click", function () {
    window.location.href = new URL("settings/settings-security.html", document.baseURI).href;
  });
})();
