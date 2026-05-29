window.DS_DATA = {
  intro: {
    badge: "Interactive Challenge",
    titlePrefix: "Project ",
    titleGradient: "Decision Simulator",
    description:
      "Master high-stakes decisions by balancing project constraints against stakeholder requirements. No safe bets—just professional judgment.",
    focusAreas: ["Triple Constraint Logic", "Conflict Resolution", "Budget Negotiation"],
    totalScenarios: "01",
    expectedMinutes: "08",
  },

  scenario: {
    index: 1,
    total: 1,
    title: "Project Budget Decision",
    context:
      "You're managing a project with a tight budget constraint. The CEO has emphasized that while the timeline is fixed, the quality cannot be compromised under any circumstances.",
    boundaries: [
      { label: "BUDGET", value: "$50,000", icon: "diamond-16.svg" },
      { label: "TIME", value: "3 Minute", icon: "clock-01-16.svg" },
      { label: "QUALITY", value: "High", icon: "medal-06-16.svg" },
    ],
    question: "What is the best approach to manage this project?",
    options: [
      { id: "a", letter: "A", text: "Focus on cost optimization" },
      { id: "b", letter: "B", text: "Extend timeline to reduce costs" },
      { id: "c", letter: "C", text: "Reduce quality to save money" },
    ],
    correctId: "a",
    correctExplanation:
      "In PMP logic, cost optimization focuses on improving efficiency within the existing constraints. Since Time and Quality are fixed, optimizing resources is the only viable path that respects all project boundaries defined by the sponsor.",
    wrongExplanation:
      "In PMP logic, cost optimization focuses on improving efficiency within existing constraints. Since Time and Quality are fixed, optimizing resources is the only viable path that respects all project boundaries.",
  },
};
