(function () {
  const P = window.PROFILE_SETTINGS;
  if (!P) return;

  const form = document.getElementById("profEditForm");
  const genderSelect = document.getElementById("profGender");

  function populateGenderOptions(selected) {
    if (!genderSelect) return;
    genderSelect.innerHTML = P.genderOptions
      .map(function (option) {
        const sel = option === selected ? " selected" : "";
        return '<option value="' + option + '"' + sel + ">" + option + "</option>";
      })
      .join("");
  }

  function loadForm() {
    const profile = P.read();
    document.getElementById("profFirstName").value = profile.firstName || "";
    document.getElementById("profLastName").value = profile.lastName || "";
    document.getElementById("profEmailInput").value = profile.email || "";
    document.getElementById("profJobTitle").value = profile.jobTitle || "";
    document.getElementById("profPhonePrefix").value = profile.phonePrefix || "+234";
    document.getElementById("profPhone").value = profile.phone || "";
    document.getElementById("profCompany").value = profile.company || "";
    populateGenderOptions(profile.gender || P.genderOptions[0]);
  }

  form?.addEventListener("submit", function (e) {
    e.preventDefault();
    const current = P.read();
    const next = {
      firstName: document.getElementById("profFirstName").value.trim(),
      lastName: document.getElementById("profLastName").value.trim(),
      email: current.email,
      phonePrefix: document.getElementById("profPhonePrefix").value.trim(),
      phone: document.getElementById("profPhone").value.trim(),
      gender: genderSelect?.value || "",
      jobTitle: document.getElementById("profJobTitle").value.trim(),
      company: document.getElementById("profCompany").value.trim(),
    };
    P.write(next);
    window.location.href = "profile.html";
  });

  document.getElementById("profCancelBtn")?.addEventListener("click", function () {
    window.location.href = "profile.html";
  });

  loadForm();
})();
