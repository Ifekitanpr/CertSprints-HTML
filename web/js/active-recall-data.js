window.AR_DATA = {
  intro: {
    badge: "Knowledge Verification",
    title: "Active Recall",
    description:
      "Verify your expertise through a verbal briefing. Answer questions on today's topics to secure your progress.",
    interactionLabel: "Interaction",
    interactionValue: "Verbal",
    goalLabel: "Goal",
    goalValue: "Briefing",
    startVoiceLabel: "Start briefing",
    startTextLabel: "Switch to text",
  },
  voice: {
    signalLabel: "Signal Established",
    title: "Retrieval Briefing",
    subtitle: "Speak clearly to verify knowledge anchors.",
    topicLabel: "Discussion Point",
    topicValue: "Risk Management",
    tryChatLabel: "Try chat",
  },
  chat: {
    title: "Retrieval Chat",
    completeLabel: "Complete Briefing & View Log",
    placeholder: "Explain your response here...",
    mentorPrompt:
      "Let's test your logic. Imagine your main vendor just declared bankruptcy mid-project. What is your immediate first move?",
    sampleResponse:
      "I would immediately check the Risk Register and notify the relevant stakeholders while assessing impact on the critical path.",
  },
  log: {
    title: "Knowledge Log",
    completeBanner: "Retrieval Complete",
    summaryAccent: "Knowledge Success:",
    summaryRest: " LOCKED",
    completeLabel: "Secure Knowledge Block",
    entries: [
      {
        stamp: "01:14",
        anchor: "Explain the core purpose of a Project Charter in one sentence.",
        user: "It formally authorizes the project and gives me the authority to use resources.",
      },
      {
        stamp: "02:45",
        anchor:
          "Correct. Now, if the sponsor requests a change mid-call, do you update that charter immediately?",
        user: "No. I would route the request through integrated change control before updating baselines.",
      },
      {
        stamp: "03:12",
        anchor: "What is your immediate first move when a critical vendor declares bankruptcy?",
        user: "I would immediately check the Risk Register and notify the relevant stakeholders while assessing impact on the critical path.",
      },
    ],
  },
};
