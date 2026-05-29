/** Figma 4384:75168–4384:77127 — exact badge + milestone content */
window.STREAK_DATA = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  years: [2024, 2025, 2026, 2027],
  /** Streak hit days keyed by `${year}-${monthIndex1}` */
  streakDaysByMonth: {
    "2026-1": [
      1, 2, 5, 6, 7, 8, 9, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30,
    ],
    "2026-2": [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20],
    "2025-12": [2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31],
  },
  badgeTiers: ["bronze", "silver", "gold", "platinum"],
  badges: {
    bronze: [
      {
        title: "First step",
        desc: "Complete first quiz",
        asset: "award-bronze.svg",
        earned: true,
        share: true,
      },
      {
        title: "Speedster",
        desc: "Lesson quiz <10 mins.",
        asset: "award-bronze.svg",
        earned: false,
      },
      {
        title: "Risk Guru",
        desc: "100% Accuracy in Risk Mgmt",
        asset: "award-bronze.svg",
        earned: false,
      },
    ],
    silver: [
      {
        title: "Accuracy Ace",
        desc: "> 80% accuracy on any quiz",
        asset: "award-silver-accuracy.svg",
        earned: true,
        share: true,
      },
      {
        title: "Streak Shield",
        desc: "7-day streak",
        asset: "award-silver-accuracy.svg",
        progress: { current: 4, total: 7, label: "4/7 days" },
      },
      {
        title: "Domain Master x5",
        desc: "Master each PMP domain",
        asset: "award-silver-domain.svg",
        earned: false,
      },
    ],
    gold: [
      {
        title: "Perfect Sprint",
        desc: "100% Correct in a single quiz",
        asset: "award-gold-perfect.svg",
        earned: true,
        share: true,
      },
      {
        title: "Consistency King",
        desc: "30-day streak",
        asset: "award-gold-consistency.svg",
        progress: { current: 4, total: 30, label: "4/30 days" },
      },
      {
        title: "Iron Learner",
        desc: "90-day streak",
        asset: "award-gold-iron.svg",
        progress: { current: 4, total: 90, label: "4/90 days" },
      },
      {
        title: "QuickFire Champion",
        desc: "3 perfect quizzes in a row",
        asset: "award-gold-iron.svg",
        progress: { current: 2, total: 3, label: "2/3 quizzes" },
      },
      {
        title: "PMP Ready",
        desc: "Exam readiness score > 80%",
        asset: "award-gold-iron.svg",
        earned: false,
      },
    ],
    platinum: [
      {
        title: "Grand master",
        desc: "Earn all badges",
        asset: "award-platinum-grand.svg",
        progress: { current: 3, total: 12, label: "3/12 earned" },
      },
    ],
  },
  milestones: [
    { percent: "25%", earned: true, progress: null },
    { percent: "50%", earned: true, progress: null },
    { percent: "75%", earned: false, progress: 66 },
    { percent: "100%", earned: false, progress: 66 },
  ],
};
