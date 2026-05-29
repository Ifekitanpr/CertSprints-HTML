window.BF_DATA = {
  headerTitle: "BOOLEAN FLASHCARD",
  title: "Check Your Mastery",
  subtitle: "Decide whether this statement is true or false then reveal the explanation",
  conceptBadge: "Concept Lock-in",
  analyzeLabel: "Analyze Statement",
  tapHint: "Tap an option to reveal",
  tipText: "Quick checks like this help lock concepts into memory",
  correctBanner: "Accurate Retrieval",
  wrongBanner: "Concept Calibration",
  rationaleLabel: "Expert Rationale",
  cards: [
    {
      id: "bf1",
      parts: [
        { text: '"Is Agile methodology suitable ', hl: false },
        { text: "only", hl: true },
        { text: ' for software development?"', hl: false },
      ],
      answer: false,
      correctRationale:
        "Correct. Agile is a project management philosophy, not a tool for coders. It focuses on value-driven delivery and responsiveness to change. Today, it is used by pharmaceutical labs, marketing agencies, and military logistics to manage complex, unpredictable work streams.",
      wrongRationale:
        "Agile methodologies have moved far beyond the tech world. While they were popularized in software, they are fundamentally frameworks for managing high uncertainty. Thinking Agile is “only for code” is a common PMP exam trap that ignores the Adaptive Mindset.",
    },
    {
      id: "bf2",
      parts: [
        { text: '"A project charter authorizes the project manager to apply organizational resources to project activities."', hl: false },
      ],
      answer: true,
      correctRationale:
        "Correct. The charter formally assigns the project manager and grants authority to use resources. Without it, the PM lacks legitimate power to commit the organization.",
      wrongRationale:
        "The charter is issued by the sponsor and explicitly authorizes the project and the PM. Treating it as optional documentation is a frequent exam mistake.",
    },
    {
      id: "bf3",
      parts: [
        { text: '"The critical path is the ', hl: false },
        { text: "shortest", hl: true },
        { text: ' sequence of activities that determines the earliest project finish date."', hl: false },
      ],
      answer: false,
      correctRationale:
        "Correct. The critical path is the longest sequence of dependent activities with zero float. It defines the minimum project duration, not the shortest path.",
      wrongRationale:
        "Confusing shortest with longest is a classic trap. Critical path activities have no schedule flexibility; delaying any of them delays the project.",
    },
    {
      id: "bf4",
      parts: [
        { text: '"Risk responses include avoid, transfer, mitigate, and accept."', hl: false },
      ],
      answer: true,
      correctRationale:
        "Correct. These four strategies address threats. Opportunities use analogous strategies like exploit, share, enhance, and accept.",
      wrongRationale:
        "PMBOK-aligned threat response strategies are avoid, transfer, mitigate, and accept. “Ignore” is not a formal response for threats you are actively managing.",
    },
    {
      id: "bf5",
      parts: [
        { text: '"Stakeholder engagement should begin ', hl: false },
        { text: "after", hl: true },
        { text: ' the planning phase is complete."', hl: false },
      ],
      answer: false,
      correctRationale:
        "Correct. Stakeholder identification and engagement start as early as possible—often at project initiation—because stakeholder needs shape scope, requirements, and success criteria.",
      wrongRationale:
        "Waiting until planning finishes leaves requirements blind spots. Early engagement reduces resistance and rework later in the lifecycle.",
    },
    {
      id: "bf6",
      parts: [
        { text: '"A fixed-price contract shifts more cost risk to the seller than a cost-reimbursable contract."', hl: false },
      ],
      answer: true,
      correctRationale:
        "Correct. Under fixed-price agreements the seller absorbs overruns unless scope changes. Cost-reimbursable contracts push much of the cost uncertainty back to the buyer.",
      wrongRationale:
        "With cost-reimbursable contracts the buyer pays allowable costs plus fee, so cost risk sits primarily with the buyer—not the seller.",
    },
    {
      id: "bf7",
      parts: [
        { text: '"The WBS decomposes project deliverables into ', hl: false },
        { text: "activities", hl: true },
        { text: ' rather than deliverables."', hl: false },
      ],
      answer: false,
      correctRationale:
        "Correct. The WBS organizes deliverable-oriented work. Activities belong in the schedule after the WBS is defined, often via decomposition into a work package level.",
      wrongRationale:
        "Mixing WBS levels with activity lists blurs scope definition. The WBS answers “what” is produced; the schedule answers “how” and “when.”",
    },
    {
      id: "bf8",
      parts: [
        { text: '"Lessons learned should be documented throughout the project, not only at closure."', hl: false },
      ],
      answer: true,
      correctRationale:
        "Correct. Capturing lessons continuously lets the team apply improvements while the project is still active, not just archive knowledge after the fact.",
      wrongRationale:
        "Closing-only documentation misses mid-project course corrections. Best practice is to update the lessons learned register at phase gates and after major events.",
    },
    {
      id: "bf9",
      parts: [
        { text: '"Quality is primarily inspected in at the end of the project."', hl: false },
      ],
      answer: false,
      correctRationale:
        "Correct. Modern quality management emphasizes prevention and continuous improvement (plan-do-check-act), building quality in rather than inspecting defects out at the end.",
      wrongRationale:
        "End-loaded inspection increases rework cost. Prevention activities—standards, training, and process design—are cheaper than late defect discovery.",
    },
    {
      id: "bf10",
      parts: [
        { text: '"The project management plan is a single document that never changes once approved."', hl: false },
      ],
      answer: false,
      correctRationale:
        "Correct. The project management plan is a living baseline set. Controlled updates through change management are expected as new information emerges.",
      wrongRationale:
        "Baselines can change via formal change control. Treating the plan as frozen ignores adaptive planning and integrated change management.",
    },
  ],
};
