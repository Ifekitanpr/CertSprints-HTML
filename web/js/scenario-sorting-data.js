window.SS_DATA = {
  intro: {
    badge: "Practice Task",
    title: "Scenario Sorting",
    description:
      "Match each story to the right project phase. This helps you remember what happens and when.",
    groups: 3,
    items: 6,
    dragHint: "Drag-and-drop enabled",
  },
  gameplay: {
    title: "Sort Your Work",
    subtitle: "Put these tasks in the correct buckets to finish this section.",
    hintTitle: "Drag the card into the right bucket",
    hintSub: "Each bucket represents a project phase",
  },
  recap: {
    badge: "Mastery Synced",
    title: "Recap Summary",
    subtitle: "Audit your clinical mapping for this section.",
    completeLabel: "Mark as completed",
  },
  buckets: [
    {
      id: "planning",
      label: "PLANNING",
      icon: "assets/scenario-sorting/icons/list-view-16.svg",
      arrowIcon: "assets/scenario-sorting/icons/arrow-down-double-blue-20.svg",
      bg: "#e8f0fe",
      border: "#007bff",
    },
    {
      id: "execution",
      label: "EXECUTION",
      icon: "assets/scenario-sorting/icons/chart-relationship-16.svg",
      arrowIcon: "assets/scenario-sorting/icons/arrow-down-double-orange-20.svg",
      bg: "#fef2ed",
      border: "#ff6b35",
    },
    {
      id: "monitoring",
      label: "MONITORING",
      icon: "assets/scenario-sorting/icons/tv-01-16.svg",
      arrowIcon: "assets/scenario-sorting/icons/arrow-down-double-teal-20.svg",
      bg: "#e9f7f6",
      border: "#16bab3",
    },
  ],
  cards: [
    {
      id: "c1",
      text: "Marking a detailed schedule showing what needs to happen first.",
      bucket: "planning",
    },
    {
      id: "c2",
      text: "Sitting down with the team to identify things that could go wrong.",
      bucket: "planning",
    },
    {
      id: "c3",
      text: "Telling the project team to start creating the final product.",
      bucket: "execution",
    },
    {
      id: "c4",
      text: "Talking to stakeholders every day to keep them involved.",
      bucket: "execution",
    },
    {
      id: "c5",
      text: "Comparing how you are doing against what you originally planned.",
      bucket: "monitoring",
    },
    {
      id: "c6",
      text: "Updating a list of issues as you find mistakes or delays",
      bucket: "monitoring",
    },
  ],
  storageKey: "cs-scenario-sorting-progress",
};
