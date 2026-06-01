window.BC_DATA = {
  navTitle: "BLURTING CANVAS",
  promptPrefix: "Explain the purpose of a ",
  promptHighlight: "Project Charter",
  promptDesc:
    "Write everything you remember in your own words. We'll verify your key ideas as you construct your logic.",
  progressLabel: "Keyword Ideas Captured",
  statusWaiting: "Waiting for retrieval signal",
  statusCaptured: "Anchor captured. Keep going.",
  editorPlaceholder:
    "Write your explanation here...Focus on what the charter authorizes and why it exists.",
  detectorLabel: "DETECTION ENGINE LISTENING",
  finishLabel: "I'm Finished",
  feedback: {
    blockSecured: "BLOCK SECURED",
    okLabel: "Ok, got it",
    aiLabel: "Brainstorm with AI",
    gapsTitle: "Gaps to close:",
    strengthLabel: "Retrieval Strength:",
    successLabel: "Retrieval Success:",
  },
  samplePartial:
    "A Project Charter is used to authorize the project and formally approve its existence within the organization. It clearly names the Project Manager and establishes initial expectations so stakeholders share a common understanding. It also grants resource authority to the Project Manager and ensures strategic alignment by linking the project objectives to the organization's broader goals.",
  sampleFull:
    "A Project Charter is used to authorize the project and formally approve its existence within the organization. It clearly names the Project Manager, defines the high-level scope, and establishes initial expectations so stakeholders share a common understanding of what the project will deliver.\n\nIt also grants resource authority to the Project Manager and ensures strategic alignment by linking the project objectives to the organization's broader goals, helping justify the project and guide decision-making throughout its lifecycle.",
  keywords: [
    {
      id: "authorize",
      label: "Authorize Project",
      patterns: [/authoriz/i, /formally approve/i],
    },
    {
      id: "name-pm",
      label: "Name PM",
      patterns: [/project manager/i, /names the project manager/i],
    },
    {
      id: "scope",
      label: "High-Level Scope",
      patterns: [/high-level scope/i, /defines.*scope/i, /\bscope\b/i],
    },
    {
      id: "resource",
      label: "Resource Authority",
      patterns: [/resource authority/i, /grants resource/i, /use resources/i],
    },
    {
      id: "alignment",
      label: "Strategic Alignment",
      patterns: [/strategic alignment/i, /broader goals/i, /organization.*goals/i],
    },
  ],
};
