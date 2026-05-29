window.ST2_DATA = {
  intro: {
    badge: "Section Progress",
    title: "Sorting Type 2",
    description:
      "Let's verify what you've learned so far. Finish these tasks to complete this section and save your progress.",
    items: 6,
    time: "1 min",
    startLabel: "Start Sorting Type 2",
  },
  gameplay: {
    headerTitle: "SORTING TYPE 2",
    selectLabel: "Select one answer",
    correctBanner: "Accurate Retrieval",
    wrongBanner: "Logic Calibration",
    reasoningLabel: "Expert Reasoning",
    continueLabel: "Continue",
  },
  questions: [
    {
      id: "kc1",
      title: "Can a mentor do this?",
      subtitle: "Read the statement and choose the best answer",
      quote: "Share their professional experiences.",
      options: [
        { id: "yes", label: "Yes, a mentor can", tone: "yes" },
        { id: "no", label: "No, a mentor can't", tone: "no" },
      ],
      answer: "yes",
      correctAnswerLabel: "A MENTOR CAN",
      wrongAnswerLabel: "A MENTOR CAN'T",
      correctRationale:
        "Correct. Mentors help you by sharing real-world stories and career paths to help you grow. Their experience is a roadmap for your development.",
      wrongRationale:
        "Actually, this is a core mentor function. Mentors are specifically encouraged to share real-world stories and career lessons to help guide your growth.",
    },
    {
      id: "kc2",
      title: "Can a mentor do this?",
      subtitle: "Read the statement and choose the best answer",
      quote: "Make decisions on behalf of the mentee.",
      options: [
        { id: "yes", label: "Yes, a mentor can", tone: "yes" },
        { id: "no", label: "No, a mentor can't", tone: "no" },
      ],
      answer: "no",
      correctAnswerLabel: "A MENTOR CAN'T",
      wrongAnswerLabel: "A MENTOR CAN",
      correctRationale:
        "Correct. Mentors advise and guide—they do not decide for you. Ownership of career decisions stays with the mentee.",
      wrongRationale:
        "Mentors provide perspective and options, but decision authority remains with the mentee. Confusing guidance with authority is a common exam trap.",
    },
    {
      id: "kc3",
      title: "Is this statement true?",
      subtitle: "Read the statement and choose the best answer",
      quote: "The project charter authorizes the project manager to apply organizational resources.",
      options: [
        { id: "yes", label: "Yes, this is true", tone: "yes" },
        { id: "no", label: "No, this is false", tone: "no" },
      ],
      answer: "yes",
      correctAnswerLabel: "THIS IS TRUE",
      wrongAnswerLabel: "THIS IS FALSE",
      correctRationale:
        "Correct. The charter formally assigns the project manager and grants authority to commit organizational resources to project activities.",
      wrongRationale:
        "The charter is issued by the sponsor and explicitly authorizes both the project and the PM's use of resources.",
    },
    {
      id: "kc4",
      title: "Is this statement true?",
      subtitle: "Read the statement and choose the best answer",
      quote: "The critical path is the shortest sequence of activities in a project schedule.",
      options: [
        { id: "yes", label: "Yes, this is true", tone: "yes" },
        { id: "no", label: "No, this is false", tone: "no" },
      ],
      answer: "no",
      correctAnswerLabel: "THIS IS FALSE",
      wrongAnswerLabel: "THIS IS TRUE",
      correctRationale:
        "Correct. The critical path is the longest sequence of dependent activities with zero float—it defines minimum project duration.",
      wrongRationale:
        "Confusing shortest with longest is a classic trap. Critical path activities have no schedule flexibility.",
    },
    {
      id: "kc5",
      title: "Is this statement true?",
      subtitle: "Read the statement and choose the best answer",
      quote: "Stakeholder engagement should begin after the planning phase is complete.",
      options: [
        { id: "yes", label: "Yes, this is true", tone: "yes" },
        { id: "no", label: "No, this is false", tone: "no" },
      ],
      answer: "no",
      correctAnswerLabel: "THIS IS FALSE",
      wrongAnswerLabel: "THIS IS TRUE",
      correctRationale:
        "Correct. Stakeholder identification and engagement start as early as possible—often at project initiation.",
      wrongRationale:
        "Waiting until planning finishes leaves requirements blind spots. Early engagement reduces resistance and rework.",
    },
    {
      id: "kc6",
      title: "Is this statement true?",
      subtitle: "Read the statement and choose the best answer",
      quote: "Lessons learned should be documented throughout the project, not only at closure.",
      options: [
        { id: "yes", label: "Yes, this is true", tone: "yes" },
        { id: "no", label: "No, this is false", tone: "no" },
      ],
      answer: "yes",
      correctAnswerLabel: "THIS IS TRUE",
      wrongAnswerLabel: "THIS IS FALSE",
      correctRationale:
        "Correct. Capturing lessons continuously lets the team apply improvements while the project is still active.",
      wrongRationale:
        "Closing-only documentation misses mid-project course corrections. Best practice is to update the register at phase gates.",
    },
  ],
};
