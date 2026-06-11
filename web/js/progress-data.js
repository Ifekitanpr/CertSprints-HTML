window.PROGRESS_DATA = {
  user: { name: "Patrick", streak: 123 },
  course: "PMP Project Management Professional",
  tabs: [
    { id: "overview", label: "Overview", icon: "analytics-01.svg" },
    { id: "sprints", label: "Sprints", icon: "motion-02.svg" },
    { id: "calendar", label: "Calendar", icon: "calendar-03.svg" },
  ],
  currentSprint: {
    title: "Sprint 3: Foundations & Core Concepts",
    weekLabel: "Week 3 of 6",
    sprintLabel: "Sprint 3",
    progress: 45,
    studyBlock: {
      percent: 45,
      timeRemaining: "29:09",
      cta: "Continue session",
    },
  },
  studyExecution: {
    days: [
      { label: "Mon\n14 Jan", mins: "12 mins", percent: 30 },
      { label: "Tue\n14 Jan", mins: "60 mins", percent: 30 },
      { label: "Wed\n14 Jan", mins: "300 mins", percent: 0, missed: false },
      { label: "Thu\n14 Jan", mins: "42 mins", percent: 30 },
      { label: "Fri\n14 Jan", mins: null, percent: 0, missed: true },
      { label: "Sat\n14 Jan", mins: "120 mins", percent: 60 },
      { label: "Sun\n14 Jan", mins: null, percent: 0, missed: true },
    ],
  },
  sprintVelocity: {
    sprintLabel: "Sprint 2",
    score: 45,
    segments: [
      { label: "Lesson Completed", value: "30/30", color: "#2ecc71" },
      { label: "Recall Mastery", value: "12/20", color: "#ff6b35" },
      { label: "Sprint Quiz", value: "28/50", color: "#007bff" },
    ],
    metrics: [
      { label: "Recall\nExercises", percent: 45, delta: "-8%", deltaTone: "bad" },
      { label: "Lesson\nQuizzes", percent: 45, delta: "+8%", deltaTone: "good" },
      { label: "Sprint\nQuiz", percent: 45, delta: "-8%", deltaTone: "bad" },
    ],
  },
  burnDown: {
    warning: "You are 22 Lessons Behind Ideal Schedule",
    stats: [
      { label: "LESSONS COMPLETED", value: "120", sub: "Of 350 total" },
      { label: "LESSONS REMAINING", value: "120", sub: "~ 21 study blcoks" },
      { label: "DAYS REMAINING", value: "120", sub: "Exam: 12/12/2026" },
      { label: "REQUIRED PACE", value: "3.4", sub: "Lessons per day" },
    ],
    yMax: 300,
    yTicks: [300, 250, 200, 150, 100, 50, 0],
    xLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    actual: [280, 265, 240, 220, 195, 170, 150, 130, 115],
    ideal: [280, 245, 210, 175, 140, 105, 70, 35, 0],
    predicted: [115, 95, 75, 55, 35, 20, 10, 5, 0],
  },
  sprints: [
    {
      id: "sprint-1",
      state: "completed",
      name: "Sprint 1",
      description: "Understanding project management fundamentals and key terminology",
      hours: "8 Est. hours",
      dates: "Jan 08 - Jan 16",
      blocks: "6/6 Study Blocks",
      hoursLeft: "~ 4 Est. hours left",
      progress: 100,
    },
    {
      id: "sprint-2",
      state: "ongoing",
      name: "Sprint 2",
      description: "Understanding project management fundamentals and key terminology",
      hours: "8 Est. hours",
      dates: "Jan 08 - Jan 16",
      blocks: "2/6 Study Blocks",
      hoursLeft: "~ 4 Est. hours left",
      progress: 45,
    },
    {
      id: "sprint-3",
      state: "locked",
      name: "Sprint 3",
      description: "Understanding project management fundamentals and key terminology",
      hours: "8 Est. hours",
      dates: "Jan 08 - Jan 16",
      blocks: "0/6 Study Blocks",
      hoursLeft: "~ 6 Est. hours left",
      progress: 0,
    },
    {
      id: "sprint-4",
      state: "locked",
      name: "Sprint 4",
      description: "Understanding project management fundamentals and key terminology",
      hours: "8 Est. hours",
      dates: "Jan 08 - Jan 16",
      blocks: "0/6 Study Blocks",
      hoursLeft: "~ 6 Est. hours left",
      progress: 0,
    },
    {
      id: "sprint-5",
      state: "locked",
      name: "Sprint 5",
      description: "Understanding project management fundamentals and key terminology",
      hours: "8 Est. hours",
      dates: "Jan 08 - Jan 16",
      blocks: "0/6 Study Blocks",
      hoursLeft: "~ 6 Est. hours left",
      progress: 0,
    },
  ],
  sprintDetailSheets: {
    "sprint-1": {
      name: "Sprint 1",
      review: {
        duration: "30 mins",
        metrics: [
          { label: "Sprint velocity", value: "64%", color: "#2ecc71" },
          { label: "Recall accuracy", value: "24%", color: "#ffc83d" },
          { label: "Avg. Quiz score", value: "24%", color: "#f43f5e" },
          { label: "Study Days", value: "3", suffix: "/7", color: "#2ecc71" },
        ],
        readinessBoost: { value: "- 3.9%", tone: "bad" },
      },
      studyBlocks: [
        {
          dayLabel: "Day 1 (Jan 27)",
          duration: "1 hour",
          items: [
            {
              type: "lesson",
              title: "Lesson 1: Understanding project management fundamentals",
              duration: "25 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 2: Understanding project management fundamentals",
              duration: "15 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 3: Understanding project management fundamentals",
              duration: "5 mins",
              done: true,
            },
            { type: "quiz", title: "Sprint Quiz", duration: "15 mins", done: true },
          ],
        },
        {
          dayLabel: "Day 2 (Jan 28)",
          duration: "1 hour",
          items: [
            {
              type: "lesson",
              title: "Lesson 1: Understanding project management fundamentals",
              duration: "25 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 2: Understanding project management fundamentals",
              duration: "15 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 3: Understanding project management fundamentals",
              duration: "5 mins",
              done: true,
            },
            { type: "quiz", title: "Sprint Quiz", duration: "15 mins", done: true },
          ],
        },
        {
          dayLabel: "Day 3 (Jan 29)",
          duration: "1 hour",
          items: [
            {
              type: "lesson",
              title: "Lesson 1: Understanding project management fundamentals",
              duration: "25 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 2: Understanding project management fundamentals",
              duration: "15 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 3: Understanding project management fundamentals",
              duration: "5 mins",
              done: true,
            },
            { type: "quiz", title: "Sprint Quiz", duration: "15 mins", done: true },
          ],
        },
      ],
    },
    "sprint-2": {
      name: "Sprint 2",
      review: {
        duration: "45 mins",
        metrics: [
          { label: "Sprint velocity", value: "45%", color: "#ffc83d" },
          { label: "Recall accuracy", value: "38%", color: "#ffc83d" },
          { label: "Avg. Quiz score", value: "52%", color: "#2ecc71" },
          { label: "Study Days", value: "2", suffix: "/7", color: "#ffc83d" },
        ],
        readinessBoost: { value: "+ 1.2%", tone: "good" },
      },
      studyBlocks: [
        {
          dayLabel: "Day 1 (Jan 08)",
          duration: "1 hour",
          items: [
            {
              type: "lesson",
              title: "Lesson 1: Understanding project management fundamentals",
              duration: "25 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 2: Understanding project management fundamentals",
              duration: "15 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 3: Understanding project management fundamentals",
              duration: "5 mins",
              done: true,
            },
            { type: "quiz", title: "Sprint Quiz", duration: "15 mins", done: true },
          ],
        },
        {
          dayLabel: "Day 2 (Jan 09)",
          duration: "1 hour",
          items: [
            {
              type: "lesson",
              title: "Lesson 1: Understanding project management fundamentals",
              duration: "25 mins",
              done: true,
            },
            {
              type: "lesson",
              title: "Lesson 2: Understanding project management fundamentals",
              duration: "15 mins",
              done: false,
            },
            {
              type: "lesson",
              title: "Lesson 3: Understanding project management fundamentals",
              duration: "5 mins",
              done: false,
            },
            { type: "quiz", title: "Sprint Quiz", duration: "15 mins", done: false },
          ],
        },
      ],
    },
  },
  studyBlockDetail: {
    title: "Day 3 Study Block",
    date: "Wed 16 Jan",
    progress: 50,
    lessons: [
      { title: "Lesson 1: Agile Principles", duration: "12 min", status: "done" },
      { title: "Lesson 2: Scrum Framework", duration: "15 min", status: "done" },
      { title: "Lesson 3: Kanban Basics", duration: "18 min", status: "active" },
      { title: "Lesson 4: Hybrid Approaches", duration: "20 min", status: "locked" },
    ],
  },
  deepDiveSheet: {
    sprintLabel: "Sprint 2",
    hero: {
      tag: "sprint 3: stakeholder alignbment",
      title: "What Did You Convert?",
      description: "Showing an overview of your your sprint performace.",
    },
    velocity: {
      score: 45,
      ringSegments: [
        { weight: 30, color: "#2ecc71" },
        { weight: 12, color: "#ff6b35" },
        { weight: 28, color: "#007bff" },
      ],
      segments: [
        { label: "Lesson Completed", value: "30/30", color: "#2ecc71" },
        { label: "Recall Mastery", value: "12/20", color: "#ff6b35" },
        { label: "Sprint Quiz", value: "28/50", color: "#007bff" },
      ],
      delta: "-8",
      deltaMessage: "You dropped from previous sprint",
    },
    performance: {
      metrics: [
        { label: "Recall\nExercises", percent: 45, delta: "-8%", deltaTone: "bad" },
        { label: "Lesson\nQuizzes", percent: 45, delta: "+8%", deltaTone: "good" },
        { label: "Sprint\nQuiz", percent: 45, delta: "-8%", deltaTone: "bad" },
      ],
    },
    mastery: {
      strong: ["Stakeholder identification", "Communication planning"],
      weak: ["Scenario interpretation", "Conflict resolution timing"],
    },
    mistakes: [
      { times: "5 times", title: "Confusing Validate Scope vs Control Quality" },
      { times: "4 times", title: "Choosing escalation too early in conflict scenarios" },
      { times: "4 times", title: "Stakeholder identification vs analysis timing" },
    ],
    insights: {
      body: "You are building applied knowledge. Your content recall is solid 78%, but decision nuance needs work (68% quiz score).",
      focusHeading: "Focus next sprint on:",
      focusItems: [
        "Focus on scenario interpretation practice",
        "Practice decision-making drills",
        "Review timing vs. sequence concepts",
      ],
    },
  },
  retrospectiveFlow: {
    hero: {
      tag: "sprint 3: EXECUTION ANALYSIS",
      title: "How Did You Study?",
      description: "Showing an overview of your your sprint performace.",
    },
    studyExecution: {
      warning: "Cramming Detected Based on Study Execution Data",
    },
    spacing: {
      days: [
        { label: "Day 1", cards: "45 cards", done: true },
        { label: "Day 2", cards: "45 cards", done: true },
        { label: "Day 3", cards: "0 cards", done: false },
        { label: "Day 4", cards: "0 cards", done: false },
        { label: "Day 5", cards: "45 cards", done: true },
        { label: "Day 6", cards: "0 cards", done: false },
        { label: "Day 7", cards: "0 cards", done: false },
      ],
      flashcardsReviewed: "1 time",
      optimal: "Optimal: 3+ times",
      warning: "Single-session review increases forgetting curve risk",
    },
    quizBehaviour: {
      items: [
        {
          text: "6 of 8 quizzes taken >24hrs after lesson",
          optimal: "Optimal: Immediately after lesson",
        },
        {
          text: "3 quizzes taken late night (10 PM - 2 AM)",
          optimal: "Optimal: Immediately after lesson",
        },
      ],
      warning: "Delayed quiz attempts reduce retention",
    },
    systemInsights: {
      intro: "You are compressing learning. This increases forgetting curve risk.",
      heading: "Suggested Actions for Next Sprint:",
      actions: [
        "Study minimum 5 days (vs. 3 this sprint)",
        {
          text: "Flashcard spacing:",
          sub: ["Day 1: Initial review", "Day 3: Second pass", "Day 6: Final reinforcement"],
        },
        "Take quizzes within 24h of lesson completion",
        "Avoid late-night study sessions (reduced retention)",
      ],
    },
    executionRating: {
      percent: 45,
      delta: "-8 pts from previous sprint",
      metrics: [
        { label: "Consistency", value: "Low - 23%", tone: "warn" },
        { label: "Spacing", value: "Poor - 10%", tone: "warn" },
        { label: "Quiz timing", value: "Delayed", tone: "warn" },
        { label: "Velocity", value: "Moderate", tone: "good" },
      ],
    },
    reflection: {
      summary:
        "You studied only 3 days out of 7, and did not maintain optimal recall sessions pacing.",
      slowOptions: ["Work schedule", "Procrastination", "Content difficulty", "Platform issues", "Other"],
      defaultSlow: "Other",
      workedPlaceholder: "What strategies or habits helped you this sprint.",
      changePlaceholder: "Tell us, what will you do differently",
      otherPlaceholder: "Please Specify",
    },
  },
};
