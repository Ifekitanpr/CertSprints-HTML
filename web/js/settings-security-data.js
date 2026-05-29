window.SECURITY_SETTINGS = {
  ICON: "assets/security/icons/",
  IMAGE: "assets/security/images/",

  storageKeys: {
    passwordEnabled: "cs-security-password-enabled",
    tfaMethod: "cs-security-2fa-method",
    googleLinked: "cs-security-google-linked",
    linkedinLinked: "cs-security-linkedin-linked",
    sessions: "cs-security-sessions",
  },

  authenticatorSecret: "EU235 8433 8474 4848",

  googleEmail: "adaninipatrick17@gmai.com",

  defaultSessions: [
    {
      id: "chrome-windows",
      name: "Chrome on Windows",
      meta: "New York, US · Today, 10:32 AM",
      icon: "phone-24.svg",
      glyph: "laptop-24",
      isCurrent: true,
    },
    {
      id: "safari-iphone",
      name: "Safari on iPhone",
      meta: "Lagos, Nigeria · Yesterday, 6:15 PM",
      icon: "phone-24.svg",
      glyph: "phone-24",
      isCurrent: false,
    },
  ],
};
