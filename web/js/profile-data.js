window.PROFILE_SETTINGS = {
  storageKey: "cs-user-profile",
  avatarPath: "assets/profile/images/user-avatar.jpg",

  defaults: {
    firstName: "Patrick",
    lastName: "Adanini",
    email: "patrick@gmail.com",
    phonePrefix: "+234",
    phone: "",
    gender: "Male",
    jobTitle: "Designer",
    company: "Certsprints",
  },

  fields: [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "email", label: "Email address" },
    { key: "phone", label: "Phone number", format: "phone" },
    { key: "gender", label: "Gender" },
    { key: "jobTitle", label: "Job titile" },
    { key: "company", label: "Company/Organization" },
  ],

  genderOptions: ["Male", "Female", "Non-binary", "Prefer not to say"],

  read() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return Object.assign({}, this.defaults);
    try {
      return Object.assign({}, this.defaults, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, this.defaults);
    }
  },

  write(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  },

  displayName(profile) {
    const p = profile || this.read();
    return (p.lastName + " " + p.firstName).trim();
  },

  formatPhone(profile) {
    const p = profile || this.read();
    if (!p.phone) return "N/A";
    return (p.phonePrefix ? p.phonePrefix + " " : "") + p.phone;
  },

  formatValue(key, profile) {
    const p = profile || this.read();
    if (key === "phone") return this.formatPhone(p);
    const val = p[key];
    if (val === undefined || val === null || val === "") return "N/A";
    return val;
  },
};

window.HELP_SUPPORT = {
  faqs: [
    {
      id: "faq-1",
      question: "The expense windows adapted sir. Wrong widen drawn.",
      answer:
        "Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her.",
      open: true,
    },
    {
      id: "faq-2",
      question: "The expense windows adapted sir. Wrong widen drawn.",
      answer:
        "Six started far placing saw respect males old. Understood listening on listening on listening on listening on listening on listening on.",
      open: false,
    },
    {
      id: "faq-3",
      question: "The expense windows adapted sir. Wrong widen drawn.",
      answer:
        "Ladies others the six desire age. Ready name gay she nor them direct. Pointed and reserved for the remainder of the session.",
      open: false,
    },
    {
      id: "faq-4",
      question: "The expense windows adapted sir. Wrong widen drawn.",
      answer:
        "Bred am so excited on my by in. Replied or shy favour age say around out. Adapted windows sir wrong widen drawn.",
      open: false,
    },
  ],
};
