/**
 * CertSprints Resources Center — content from Figma (4738:14206, 4755:73203, 4755:75064, 4755:75735, 4755:76922)
 */
window.ResourcesData = {
  hub: {
    title: "Resources",
    subtitle:
      "Master the PMP® with curated collection of essential books, articles, and more.",
    cards: [
      {
        id: "fundamentals",
        cover: "assets/resources/covers/cover-fundamentals.png",
        coverHeight: 214,
        categoryIcon: "assets/resources/icons/file-02-16.svg",
        categoryLabel: "Documentation",
        title: "PMP Fundamentals",
        description:
          "Introduces the foundational concepts of PMP, suitable for both beginners.",
        action: "explore",
        pane: "paneFundamentals",
      },
      {
        id: "body-of-knowledge",
        cover: "assets/resources/covers/cover-body-of-knowledge.png",
        coverHeight: 208,
        categoryIcon: "assets/resources/icons/book-04-16.svg",
        categoryLabel: "Textbooks",
        title: "Body of Knowledge",
        description:
          "Covers critical knowledge areas and process groups from both PMBOK 6th and 7th editions.",
        action: "explore",
        pane: "paneBodyOfKnowledge",
      },
      {
        id: "eco",
        cover: "assets/resources/covers/cover-eco.png",
        coverHeight: 214,
        categoryIcon: "assets/resources/icons/file-02-16.svg",
        categoryLabel: "Documentation",
        title: "ECOs (Exam Content Outline)",
        description:
          "Helps PMP candidates understand the exam's scope and content areas.",
        action: "explore",
        pane: "paneEco",
      },
      {
        id: "templates",
        cover: "assets/resources/covers/cover-templates.png",
        coverHeight: 244,
        categoryIcon: "assets/resources/icons/layout-06-16.svg",
        categoryLabel: "Templates",
        title: "Project Management Templates",
        description:
          "A library of downloadable project management templates that users can use to organize their projects effectively.",
        action: "explore",
        pane: "paneTemplates",
      },
      {
        id: "glossary",
        cover: "assets/resources/covers/cover-glossary.png",
        coverHeight: 244,
        categoryIcon: "assets/resources/icons/text-align-left-16.svg",
        categoryLabel: "A-Z",
        title: "Glossary",
        description:
          "A comprehensive glossary of important PMP terms organized alphabetically and by process group/knowledge area.",
        action: "explore",
        pane: "paneGlossary",
      },
      {
        id: "study-notes",
        cover: "assets/resources/covers/cover-study-notes.png",
        coverHeight: 214,
        categoryIcon: "assets/resources/icons/notebook-16.svg",
        categoryLabel: "Notebooks",
        title: "Study Notes",
        description:
          "Concise and well-organized study notes for candidates preparing for the PMP exam.",
        action: "coming-soon",
      },
    ],
  },

  fundamentals: {
    chapters: [
      {
        id: "intro",
        label: "Introduction to PMP",
        sections: [
          {
            title: "Introduction to PMP",
            body:
              "The Project Management Professional (PMP) certification is a globally recognized credential offered by the Project Management Institute (PMI). It validates your expertise in leading and directing projects and teams in various industries. Key points: Demonstrates mastery of project management methodologies Recognized in over 200 countries Can lead to higher earning potential and career advancement Covers predictive, agile, and hybrid approaches",
          },
          {
            title: "Project Management Basics",
            body:
              "Project management is the application of knowledge, skills, tools, and techniques to meet project requirements. Understanding these basics is crucial for PMP certification and successful project execution. Core concepts: Project Lifecycle: Initiation, Planning, Execution, Monitoring & Controlling, Closing Triple Constraint: Scope, Time, Cost (and sometimes Quality) Stakeholder Management: Identifying and engaging all parties affected by the project Risk Management: Identifying, analyzing, and mitigating potential project risks",
          },
          {
            title: "PMP Certification Process",
            body:
              "Obtaining PMP certification involves several steps and requires meeting specific eligibility criteria set by PMI. Process overview: Meet eligibility requirements: 35 hours of project management education 36 months leading projects with a four-year degree, OR 60 months leading projects with a high school diploma Submit PMP application Pay exam fee Schedule and take the exam (180 questions, 230 minutes) Maintain certification through Continuing Education",
          },
        ],
      },
    ],
  },

  eco: {
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "process", label: "Process Domain" },
      { id: "people", label: "People Domain" },
      { id: "business", label: "Business Environment Domain" },
    ],
    overview: {
      sections: [
        {
          title: "What is the Exam Content Outline (ECO)?",
          paragraphs: [
            "The Exam Content Outline (ECO) is an official document published by the Project Management Institute (PMI) that defines the structure of a certification exam, such as the PMP®, CAPM®, PMI-ACP®, or PMI-RMP®. It outlines the key domains, tasks, and enablers that candidates are expected to know and apply in real-world project environments.",
            "Rather than listing tools or textbook definitions, the ECO focuses on what successful professionals actually do on the job. It guides:",
            "What's tested on the exam",
            "How much weight does each domain carry",
            "The behavioural and technical expectations of certified professionals",
            "In short, the ECO is the foundation of the exam design, and your most important guide when preparing to get certified.",
          ],
          image: "assets/resources/eco-content.jpg",
        },
        {
          title: "What does the PMP Exam Content Outline (ECO) contain?",
          paragraphs: [
            "The Exam Content Outline (ECO) is an official document published by the Project Management Institute (PMI) that defines the structure of a certification exam, such as the PMP®, CAPM®, PMI-ACP®, or PMI-RMP®. It outlines the key domains, tasks, and enablers that candidates are expected to know and apply in real-world project environments.",
            "Rather than listing tools or textbook definitions, the ECO focuses on what successful professionals actually do on the job. It guides:",
            "What's tested on the exam",
            "How much weight does each domain carry",
            "The behavioural and technical expectations of certified professionals",
            "In short, the ECO is the foundation of the exam design, and your most important guide when preparing to get certified.",
          ],
          image: "assets/resources/eco-content.jpg",
        },
      ],
      table: [
        {
          id: 1,
          task: "Execute project with the urgency required to deliver business value",
          taskBold: true,
          description:
            "This process involves leading and performing the work defined in the project management plan and implementing approved changes to achieve the project's objectives. You act decisively and execute tasks without unnecessary delay. Prioritize actions that bring business value sooner, especially in fast-changing environments.",
          enablers: [
            "Assess opportunities to deliver value incrementally",
            "Examine the business value throughout the project",
            "Support the team to subdivide project tasks as necessary to find the Minimum Viable Product",
          ],
        },
        {
          id: 2,
          task: "Manage Communications",
          taskBold: false,
          description:
            "Manage Communications is the process of ensuring timely and appropriate collection, creation, distribution, storage, retrieval, management, monitoring, and the ultimate disposition of project information. It is making sure everyone gets the right information, at the right time, in the right format so decisions are informed and progress stays on track.",
          enablers: [
            "Analyze communication needs of all stakeholders",
            "Determine communications methods, channels, frequency, and level of detail for all stakeholders",
            "Communicate project information & updates effectively",
            "Confirm communication is understood and feedback is received",
          ],
        },
      ],
    },
    process: {
      intro:
        "The Process domain represents 50% of the PMP exam. It covers technical project management skills across the project lifecycle.",
      table: [
        {
          id: 1,
          task: "Execute project with the urgency required to deliver business value",
          taskBold: true,
          description:
            "Lead and perform work defined in the project management plan and implement approved changes to achieve project objectives.",
          enablers: [
            "Assess opportunities to deliver value incrementally",
            "Examine the business value throughout the project",
            "Support the team to subdivide project tasks as necessary to find the Minimum Viable Product",
          ],
        },
        {
          id: 2,
          task: "Manage Communications",
          taskBold: false,
          description:
            "Ensure timely and appropriate collection, creation, distribution, storage, retrieval, management, monitoring, and disposition of project information.",
          enablers: [
            "Analyze communication needs of all stakeholders",
            "Determine communications methods, channels, frequency, and level of detail",
            "Communicate project information and updates effectively",
            "Confirm communication is understood and feedback is received",
          ],
        },
      ],
    },
    people: {
      intro:
        "The People domain represents 42% of the PMP exam. It focuses on leadership, team building, and stakeholder engagement.",
      table: [
        {
          id: 1,
          task: "Manage conflict",
          taskBold: true,
          description:
            "Interpret the source and stage of the conflict and analyze the context for the conflict to determine the best resolution approach.",
          enablers: [
            "Interpret the source and stage of the conflict",
            "Analyze the context for the conflict",
            "Evaluate and recommend/reconcile the appropriate conflict resolution solution",
          ],
        },
        {
          id: 2,
          task: "Lead a team",
          taskBold: false,
          description:
            "Support, facilitate, and collaborate with team members to meet project goals and objectives.",
          enablers: [
            "Set a clear vision and mission",
            "Support diversity and inclusion",
            "Value servant leadership",
            "Determine an appropriate leadership style",
          ],
        },
      ],
    },
    business: {
      intro:
        "The Business Environment domain represents 8% of the PMP exam. It covers compliance, organizational change, and business value delivery.",
      table: [
        {
          id: 1,
          task: "Plan and manage project compliance",
          taskBold: true,
          description:
            "Confirm that the project complies with relevant regulations, standards, and organizational policies throughout the project lifecycle.",
          enablers: [
            "Confirm project compliance requirements",
            "Classify compliance categories",
            "Determine potential compliance violations",
            "Support compliance audit processes",
          ],
        },
        {
          id: 2,
          task: "Evaluate and deliver project benefits and value",
          taskBold: false,
          description:
            "Evaluate and deliver the benefits and value intended from the project outcomes.",
          enablers: [
            "Investigate that benefits are identified",
            "Document agreement on ownership for ongoing benefit realization",
            "Verify measurement system is in place",
            "Evaluate delivery of benefits and value",
          ],
        },
      ],
    },
  },

  templates: {
    title: "Templates",
    subtitle:
      "Access a collection of templates to streamline your project management processes. From initiation to closure, these templates cover all key areas of project execution.",
    items: [
      {
        cover: "assets/resources/covers/cover-fundamentals.png",
        coverHeight: 214,
        fileIcon: "assets/resources/icons/file-type-word-20.svg",
        fileLabel: "Docx",
        title: "PMP Fundamentals",
        description:
          "Introduces the foundational concepts of PMP, suitable for both beginners.",
        fileName: "PMP Fundamentals.docx",
      },
      {
        cover: "assets/resources/covers/cover-body-of-knowledge.png",
        coverHeight: 208,
        fileIcon: "assets/resources/icons/file-type-excel-20.svg",
        fileLabel: "Excel",
        title: "Body of Knowledge",
        description:
          "Covers critical knowledge areas and process groups from both PMBOK 6th and 7th editions.",
        fileName: "Body of Knowledge.xlsx",
      },
      {
        cover: "assets/resources/covers/cover-eco.png",
        coverHeight: 214,
        fileIcon: "assets/resources/icons/file-type-pdf-20.svg",
        fileLabel: "PDF",
        title: "ECOs (Exam Content Outline)",
        description:
          "Helps PMP candidates understand the exam's scope and content areas.",
        fileName: "ECO Exam Content Outline.pdf",
      },
      {
        cover: "assets/resources/covers/cover-templates.png",
        coverHeight: 244,
        fileIcon: "assets/resources/icons/file-type-pdf-20.svg",
        fileLabel: "PDF",
        title: "Project Management Templates",
        description:
          "A library of downloadable project management templates that users can use to organize their projects effectively.",
        fileName: "Project Management Templates.pdf",
      },
      {
        cover: "assets/resources/covers/cover-glossary.png",
        coverHeight: 244,
        fileIcon: "assets/resources/icons/file-type-powerpoint-20.svg",
        fileLabel: "PPTX",
        title: "Glossary",
        description:
          "A comprehensive glossary of important PMP terms organized alphabetically and by process group/knowledge area.",
        fileName: "PMP Glossary.pptx",
      },
    ],
  },

  glossary: {
    title: "Glossary",
    subtitle:
      "Your go-to resource for all important terms related to Project Management.",
    terms: [
      {
        term: "Agile",
        letter: "A",
        definition:
          "An iterative and incremental approach to project management that emphasizes collaboration, customer feedback, and rapid delivery of working solutions.",
        dataSource: "Agile Manifesto",
        sourceDefinition:
          'Agile Manifesto," Agile Alliance, 2001, Agile Alliance',
        purpose:
          "Used in software development and project management to adapt to changing requirements.",
      },
      {
        term: "Baseline",
        letter: "B",
        definition:
          "The approved version of a work product that serves as the basis for comparison to actual performance.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to measure and analyze variance in scope, schedule, and cost.",
      },
      {
        term: "Critical Path",
        letter: "C",
        definition:
          "The sequence of activities that represents the longest path through a project, which determines the shortest possible duration.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to identify schedule flexibility and focus on activities that directly impact project completion.",
      },
      {
        term: "Earned Value Management",
        letter: "E",
        definition:
          "A methodology that integrates scope, schedule, and cost data to assess project performance and progress.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to forecast project outcomes and measure performance against the plan.",
      },
      {
        term: "Gantt Chart",
        letter: "G",
        definition:
          "A bar chart that illustrates a project schedule, showing start and finish dates of activities.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to visualize task sequences, durations, and dependencies over time.",
      },
      {
        term: "Milestone",
        letter: "M",
        definition:
          "A significant point or event in a project with zero duration, marking the completion of a major deliverable or phase.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to track progress and communicate key achievements to stakeholders.",
      },
      {
        term: "Stakeholder",
        letter: "S",
        definition:
          "An individual, group, or organization that may affect, be affected by, or perceive itself to be affected by a decision, activity, or outcome of the project.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to identify and manage relationships with parties who influence project success.",
      },
      {
        term: "Triple Constraint",
        letter: "T",
        definition:
          "The framework of balancing project scope, schedule, and cost, often with quality as a central factor.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to understand trade-offs when changes occur in one constraint affecting others.",
      },
      {
        term: "Work Breakdown Structure",
        letter: "W",
        definition:
          "A deliverable-oriented hierarchical decomposition of the total scope of work to be executed by the project team.",
        dataSource: "PMBOK Guide",
        sourceDefinition: "PMI, PMBOK Guide – Seventh Edition",
        purpose:
          "Used to organize and define the total scope of the project for planning and control.",
      },
    ],
  },

  bodyOfKnowledge: {
    title: "Body of Knowledge",
    subtitle:
      "Covers critical knowledge areas and process groups from both PMBOK 6th and 7th editions.",
    sections: [
      {
        title: "PMBOK Guide Overview",
        body:
          "The PMBOK Guide provides foundational standards and guidelines for project management. The 7th edition shifts from process-based knowledge areas to principles and performance domains, while the 6th edition remains widely referenced for process groups and ITTOs.",
      },
      {
        title: "Performance Domains (PMBOK 7)",
        body:
          "Stakeholders, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, and Uncertainty — eight interconnected domains that describe how projects create value.",
      },
      {
        title: "Process Groups (PMBOK 6)",
        body:
          "Initiating, Planning, Executing, Monitoring and Controlling, and Closing — five process groups that organize 49 processes across ten knowledge areas for predictive project management.",
      },
    ],
  },
};
