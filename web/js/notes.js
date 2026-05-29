/**
 * CertSprints Private Notes Manager
 * Handles local storage seeding, dynamic CRUD rendering, smooth CSS-transition overlays,
 * word count calculation, and restricted-width screen boundary positioning.
 */
(function () {
  const STORAGE_KEY = "certsprints_private_notes";

  // 1. Core Mock Seeding (Authentic PMP Exam Notes)
  const MOCK_NOTES = [
    {
      id: "note-1",
      text: "Rewatch this introductory PMP video before starting the application process. Pay attention to the PMP eligibility requirements, exam structure (domains and question format), and the overall certification process. Make sure to clearly understand the 35 contact hours requirement and experience criteria. Review key terms and note any tips about exam preparation strategies.",
      date: "12 Feb, 2026",
      block: "Study block 2",
      lesson: "Lesson 3"
    },
    {
      id: "note-2",
      text: "The Agile Manifesto prioritizes individuals and interactions over processes and tools, and working software over comprehensive documentation. Remember that customer collaboration and responding to change are key. In Scrum, the Product Owner represents the voice of the customer, while the Scrum Master is a servant leader facilitating the team's progress.",
      date: "10 Feb, 2026",
      block: "Study block 1",
      lesson: "Lesson 5"
    },
    {
      id: "note-3",
      text: "Critical Path Method (CPM) calculation is essential for scheduling. Remember that the critical path is the longest path through the network diagram and has zero total float. Calculating Early Start (ES), Late Start (LS), Early Finish (EF), and Late Finish (LF) will be tested in multiple-choice questions.",
      date: "08 Feb, 2026",
      block: "Study block 3",
      lesson: "Lesson 2"
    },
    {
      id: "note-4",
      text: "Risk response strategies differ for threats and opportunities. Threats are avoided, mitigated, transferred, or accepted. Opportunities are exploited, enhanced, shared, or accepted. Make sure to understand the distinction between risk mitigation (reducing probability/impact) and risk transfer (shifting ownership like insurance).",
      date: "05 Feb, 2026",
      block: "Study block 4",
      lesson: "Lesson 1"
    }
  ];

  // Current active note tracking state
  let currentNoteId = null;

  // 2. Fetch and Seed State
  function getNotes() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTES));
      return MOCK_NOTES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse notes from storage", e);
      return MOCK_NOTES;
    }
  }

  function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  // Helper to escape HTML tags to prevent XSS injection
  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Calculate word count for private notes
  function getWordCount(text) {
    const clean = text.trim();
    if (!clean) return 0;
    return clean.split(/\s+/).length;
  }

  // 3. Smooth Overlay Animation Managers
  function showOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    
    overlay.removeAttribute("hidden");
    // Trigger transition reflow
    void overlay.offsetWidth;
    overlay.classList.add("active");
  }

  function hideOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    
    overlay.classList.remove("active");
    setTimeout(() => {
      // Confirm it hasn't been reactivated before hiding
      if (!overlay.classList.contains("active")) {
        overlay.setAttribute("hidden", "");
      }
    }, 250);
  }

  // 4. Render Notes List Feed
  function renderNotesList() {
    const container = document.getElementById("notesListContainer");
    if (!container) return;

    const notes = getNotes();

    if (notes.length === 0) {
      // Premium Empty State block
      container.innerHTML = `
        <div class="notes-empty-state">
          <img class="notes-empty-icon" src="assets/more/icon-note.svg" alt="Empty notebook" style="filter: invert(60%) sepia(10%) saturate(300%) hue-rotate(200deg);" />
          <h3 class="notes-empty-title">No private notes yet 📝</h3>
          <p class="notes-empty-desc">See notes you have made while learning here. Start by adding notes in your study dashboard!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = notes
      .map(
        (note) => `
      <div class="notes-card" data-note-id="${note.id}" role="article" tabindex="0" aria-label="Study note from ${note.date}">
        <p class="notes-card-text">${escapeHtml(note.text)}</p>
        <div class="notes-card-meta">
          <span>${note.date}</span>
          <span class="notes-meta-dot" aria-hidden="true">•</span>
          <span>${note.block}</span>
          <span class="notes-meta-dot" aria-hidden="true">•</span>
          <span>${note.lesson}</span>
        </div>
        <div class="notes-card-actions">
          <button class="notes-action-btn edit-btn" type="button" aria-label="Edit note" data-note-id="${note.id}">
            <img src="assets/icons/edit-02.svg" alt="Edit Icon" />
          </button>
          <button class="notes-action-btn delete-btn" type="button" aria-label="Delete note" data-note-id="${note.id}">
            <img src="assets/icons/delete-02.svg" alt="Delete Icon" />
          </button>
        </div>
      </div>
    `
      )
      .join("");

    // Attach Click Event Handlers
    container.querySelectorAll(".notes-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Ensure action button clicks are not intercepted as details trigger
        if (e.target.closest(".notes-action-btn")) return;
        const noteId = card.getAttribute("data-note-id");
        openDetailsSheet(noteId);
      });

      // Accessible enter key click
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.target.closest(".notes-action-btn")) {
          const noteId = card.getAttribute("data-note-id");
          openDetailsSheet(noteId);
        }
      });
    });

    container.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const noteId = btn.getAttribute("data-note-id");
        openEditSheet(noteId);
      });
    });

    container.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const noteId = btn.getAttribute("data-note-id");
        openDeleteModal(noteId);
      });
    });
  }

  // 5. Details Sheet Open Flow
  function openDetailsSheet(noteId) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    currentNoteId = noteId;

    const meta = document.getElementById("detailsMeta");
    const text = document.getElementById("detailsFullText");

    if (!meta || !text) return;

    meta.innerHTML = `
      <span>${note.date}</span>
      <span class="notes-meta-dot" aria-hidden="true">•</span>
      <span>${note.block}</span>
      <span class="notes-meta-dot" aria-hidden="true">•</span>
      <span>${note.lesson}</span>
    `;
    text.textContent = note.text;

    showOverlay("noteDetailsOverlay");
  }

  // 6. Edit Sheet Open Flow
  function openEditSheet(noteId) {
    const notes = getNotes();
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    currentNoteId = noteId;

    hideOverlay("noteDetailsOverlay");

    const textarea = document.getElementById("editNoteTextarea");
    if (!textarea) return;

    textarea.value = note.text;
    updateWordCounter(textarea.value);

    showOverlay("editNoteOverlay");
  }

  // Helper to dynamically update the word counter feedback
  function updateWordCounter(value) {
    const helper = document.querySelector(".edit-helper-text");
    if (!helper) return;
    const words = getWordCount(value);
    helper.textContent = `Max 250 words (currently ${words} words)`;
    
    // Add red accent if it exceeds 250 words
    if (words > 250) {
      helper.style.color = "#ef4444";
      helper.style.fontWeight = "600";
    } else {
      helper.style.color = "#94a3b8";
      helper.style.fontWeight = "400";
    }
  }

  // 7. Delete Confirm Modal Open Flow
  function openDeleteModal(noteId) {
    currentNoteId = noteId;
    showOverlay("deleteConfirmOverlay");
  }

  // 8. Initialize All Action Handlers & Listeners
  function initializeListeners() {
    // Details Sheet Close Actions
    document.getElementById("detailsCloseBtn")?.addEventListener("click", () => hideOverlay("noteDetailsOverlay"));
    document.getElementById("detailsScrim")?.addEventListener("click", () => hideOverlay("noteDetailsOverlay"));

    // Details Sheet: "Edit note" button click
    document.getElementById("detailsEditBtn")?.addEventListener("click", () => {
      if (currentNoteId) {
        openEditSheet(currentNoteId);
      }
    });

    // Edit Sheet Close Actions
    document.getElementById("editCloseBtn")?.addEventListener("click", () => hideOverlay("editNoteOverlay"));
    document.getElementById("editScrim")?.addEventListener("click", () => hideOverlay("editNoteOverlay"));
    document.getElementById("editCancelBtn")?.addEventListener("click", () => hideOverlay("editNoteOverlay"));

    // Edit Sheet: Dynamic word count input tracking
    const textarea = document.getElementById("editNoteTextarea");
    if (textarea) {
      textarea.addEventListener("input", (e) => {
        updateWordCounter(e.target.value);
      });
    }

    // Edit Sheet: "Save changes" click action
    document.getElementById("editSaveBtn")?.addEventListener("click", () => {
      if (!textarea) return;
      const text = textarea.value.trim();
      if (!text) return; // Ignore if completely empty

      const notes = getNotes();
      const noteIndex = notes.findIndex((n) => n.id === currentNoteId);
      if (noteIndex !== -1) {
        notes[noteIndex].text = text;
        saveNotes(notes);
        renderNotesList();
      }

      hideOverlay("editNoteOverlay");
    });

    // Delete Modal Close Actions
    document.getElementById("deleteCloseBtn")?.addEventListener("click", () => hideOverlay("deleteConfirmOverlay"));
    document.getElementById("deleteScrim")?.addEventListener("click", () => hideOverlay("deleteConfirmOverlay"));
    document.getElementById("deleteCancelBtn")?.addEventListener("click", () => hideOverlay("deleteConfirmOverlay"));

    // Delete Modal: "Yes, Delete" confirm action
    document.getElementById("deleteConfirmBtn")?.addEventListener("click", () => {
      if (currentNoteId) {
        let notes = getNotes();
        notes = notes.filter((n) => n.id !== currentNoteId);
        saveNotes(notes);
        renderNotesList();
      }

      hideOverlay("deleteConfirmOverlay");
    });
  }

  // Bootstrapping
  document.addEventListener("DOMContentLoaded", () => {
    renderNotesList();
    initializeListeners();
  });
})();
