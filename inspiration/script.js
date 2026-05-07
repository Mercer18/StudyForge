(function () {
  const data = window.GENAI_STUDY_DATA;

  if (!data) {
    document.body.innerHTML = "<main style='padding:24px;font-family:Trebuchet MS,sans-serif'>Study data failed to load.</main>";
    return;
  }

  const STORAGE_KEYS = {
    completedSections: "genai-study-completed-sections",
    studiedCards: "genai-study-studied-cards",
  };

  const sections = data.sections.map((section) => ({
    ...section,
    category: getCategory(section.title),
    number: getSectionNumber(section.title),
  }));
  const sectionLookup = new Map(sections.map((section) => [section.id, section]));

  const state = {
    view: "dashboard",
    query: "",
    activeCategory: "All",
    activeDeckId: data.pageDecks[0]?.id || "",
    flashcardSectionId: "all",
    flashcardIndex: 0,
    flashcardPool: [],
    flashcardFlipped: false,
    completedSections: loadSet(STORAGE_KEYS.completedSections),
    studiedCards: loadSet(STORAGE_KEYS.studiedCards),
    counts: {
      notesSections: 0,
      notesSubsections: 0,
      flashcards: 0,
      sourcePages: 0,
    },
  };

  const categoryOrder = ["All", "Foundations", "Architectures", "Workflow", "Models", "GAN + AE", "Exam", "Core"];
  const categories = categoryOrder.filter((category, index) => {
    if (index === 0) {
      return true;
    }
    return sections.some((section) => section.category === category);
  });

  const els = {};

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    cacheElements();
    bindEvents();
    populateFlashcardSelect();
    syncFlashcardPool(true);
    renderAll();
  }

  function cacheElements() {
    const ids = [
      "progressRing",
      "progressPercent",
      "progressText",
      "globalSearch",
      "searchStatus",
      "categoryChips",
      "sectionNav",
      "heroTitle",
      "heroSubtitle",
      "statStrip",
      "sourceList",
      "gapList",
      "routeGrid",
      "bottleneckCopy",
      "revisionGrid",
      "examPromptList",
      "comparisonGrid",
      "notesResultCount",
      "notesSections",
      "flashcardMeta",
      "flashcardSectionSelect",
      "flashcardShell",
      "flashcardSectionTag",
      "flashcardSectionBackTag",
      "flashcardPrompt",
      "flashcardAnswer",
      "prevCard",
      "nextCard",
      "revealCard",
      "markCardDone",
      "deckStatus",
      "deckButtons",
      "deckTitle",
      "deckDescription",
      "pageCards",
      "dashboardView",
      "notesView",
      "flashcardsView",
      "sourcesView",
    ];

    ids.forEach((id) => {
      els[id] = document.getElementById(id);
    });

    els.viewButtons = Array.from(document.querySelectorAll("[data-view-target]"));
    els.jumpRevision = document.getElementById("jumpRevision");
    els.jumpFlashcards = document.getElementById("jumpFlashcards");
    els.jumpSources = document.getElementById("jumpSources");
    els.shuffleCards = document.getElementById("shuffleCards");
  }

  function bindEvents() {
    els.globalSearch.addEventListener("input", (event) => {
      state.query = event.target.value.trim();
      syncFlashcardPool(true);
      renderAll();
    });

    document.addEventListener("click", (event) => {
      const viewButton = event.target.closest("[data-view-target]");
      if (viewButton) {
        setView(viewButton.dataset.viewTarget);
        return;
      }

      const chipButton = event.target.closest("[data-category]");
      if (chipButton) {
        state.activeCategory = chipButton.dataset.category;
        syncFlashcardPool(true);
        renderAll();
        return;
      }

      const sectionJump = event.target.closest("[data-section-jump]");
      if (sectionJump) {
        setView("notes");
        requestAnimationFrame(() => {
          const target = document.getElementById(sectionJump.dataset.sectionJump);
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }

      const routeJump = event.target.closest("[data-route-section]");
      if (routeJump) {
        setView("notes");
        requestAnimationFrame(() => {
          const target = document.getElementById(routeJump.dataset.routeSection);
          target?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }

      const sectionToggle = event.target.closest("[data-section-toggle]");
      if (sectionToggle) {
        toggleSection(sectionToggle.dataset.sectionToggle);
        return;
      }

      const deckButton = event.target.closest("[data-deck]");
      if (deckButton) {
        state.activeDeckId = deckButton.dataset.deck;
        renderSources();
        renderSearchStatus();
      }
    });

    els.jumpRevision.addEventListener("click", () => {
      setView("dashboard");
      requestAnimationFrame(() => {
        document.getElementById("revisionPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    els.jumpFlashcards.addEventListener("click", () => {
      setView("flashcards");
    });

    els.jumpSources.addEventListener("click", () => {
      setView("sources");
    });

    els.flashcardSectionSelect.addEventListener("change", (event) => {
      state.flashcardSectionId = event.target.value;
      syncFlashcardPool(true);
      renderFlashcards();
      renderSearchStatus();
    });

    els.shuffleCards.addEventListener("click", () => {
      shuffleArray(state.flashcardPool);
      state.flashcardIndex = 0;
      state.flashcardFlipped = false;
      renderFlashcards();
      renderSearchStatus();
    });

    els.prevCard.addEventListener("click", () => moveCard(-1));
    els.nextCard.addEventListener("click", () => moveCard(1));

    els.revealCard.addEventListener("click", () => {
      if (!state.flashcardPool.length) {
        return;
      }
      state.flashcardFlipped = !state.flashcardFlipped;
      renderFlashcards();
    });

    els.markCardDone.addEventListener("click", () => {
      const current = state.flashcardPool[state.flashcardIndex];
      if (!current) {
        return;
      }
      toggleSetItem(state.studiedCards, current.id);
      saveSet(STORAGE_KEYS.studiedCards, state.studiedCards);
      renderHero();
      renderFlashcards();
      renderSearchStatus();
    });

    document.addEventListener("keydown", (event) => {
      if (document.activeElement === els.globalSearch || document.activeElement === els.flashcardSectionSelect) {
        return;
      }

      if (state.view !== "flashcards") {
        return;
      }

      if (event.key === "ArrowRight") {
        moveCard(1);
      } else if (event.key === "ArrowLeft") {
        moveCard(-1);
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (state.flashcardPool.length) {
          state.flashcardFlipped = !state.flashcardFlipped;
          renderFlashcards();
        }
      }
    });
  }

  function renderAll() {
    renderHero();
    renderCategoryChips();
    renderSectionNav();
    renderDashboard();
    renderNotes();
    renderFlashcards();
    renderSources();
    updateViewPanels();
    renderSearchStatus();
  }

  function renderHero() {
    const completedCount = state.completedSections.size;
    const totalSections = sections.length;
    const progress = totalSections ? Math.round((completedCount / totalSections) * 100) : 0;

    els.heroTitle.textContent = data.title;
    els.heroSubtitle.textContent = `${data.stats.sectionCount} sections, ${data.stats.flashcardCount} flashcards, ${data.stats.pageCount} page snapshots, and a full lecture-page browser.`;
    els.progressPercent.textContent = `${progress}%`;
    els.progressRing.style.setProperty("--progress", `${progress * 3.6}deg`);
    els.progressText.textContent = `${completedCount} of ${totalSections} sections finished`;

    const statCards = [
      {
        label: "Sections",
        value: `${data.stats.sectionCount}`,
        note: `${data.stats.subsectionCount} topic cards inside the notes view`,
      },
      {
        label: "Recall Cards",
        value: `${state.studiedCards.size}/${data.stats.flashcardCount}`,
        note: "Marked as studied",
      },
      {
        label: "Lecture Pages",
        value: `${data.stats.pageCount}`,
        note: `${data.stats.lectureDeckCount} page-summary decks`,
      },
      {
        label: "Comparison Tables",
        value: `${data.stats.tableCount}`,
        note: "High-yield comparison boards",
      },
    ];

    els.statStrip.innerHTML = statCards
      .map(
        (card) => `
          <article class="stat-card">
            <p class="mini-eyebrow">${escapeHtml(card.label)}</p>
            <div class="stat-value">${escapeHtml(card.value)}</div>
            <p>${escapeHtml(card.note)}</p>
          </article>
        `
      )
      .join("");

    els.sourceList.innerHTML = (data.meta["source-coverage"] || [])
      .map((item) => `<li>${decorateInline(item)}</li>`)
      .join("");

    els.gapList.innerHTML = (data.meta["gaps-and-cleanup"] || [])
      .map((item) => `<li>${decorateInline(item)}</li>`)
      .join("");
  }

  function renderCategoryChips() {
    els.categoryChips.innerHTML = categories
      .map((category) => {
        const count = category === "All"
          ? sections.length
          : sections.filter((section) => section.category === category).length;
        const activeClass = category === state.activeCategory ? "active" : "";
        return `
          <button type="button" class="chip-button ${activeClass}" data-category="${escapeHtml(category)}">
            ${escapeHtml(category)} <span aria-hidden="true">·</span> ${count}
          </button>
        `;
      })
      .join("");
  }

  function renderSectionNav() {
    const filteredSections = getFilteredSections();

    if (!filteredSections.length) {
      els.sectionNav.innerHTML = `<div class="empty-card">No sections match the current filter.</div>`;
      return;
    }

    els.sectionNav.innerHTML = filteredSections
      .map((section) => {
        const done = state.completedSections.has(section.id);
        return `
          <button type="button" class="section-link" data-section-jump="${escapeHtml(section.id)}">
            <span>
              <strong>${escapeHtml(section.title)}</strong>
              <span>${escapeHtml(section.visibleSubsections.length)} visible topics</span>
            </span>
            <span class="section-status ${done ? "is-done" : ""}" aria-hidden="true"></span>
          </button>
        `;
      })
      .join("");
  }

  function renderDashboard() {
    const phases = [
      {
        title: "Pass 1",
        subtitle: "Foundation Lock-In",
        description: "AI basics, history, GenAI shift, foundation models, and the ecosystem stack.",
        sections: sections.filter((section) => section.number >= 1 && section.number <= 5),
      },
      {
        title: "Pass 2",
        subtitle: "Model Mechanics",
        description: "LLMs, architecture families, GANs, autoencoders, and transformer internals.",
        sections: sections.filter((section) => section.number >= 6 && section.number <= 10),
      },
      {
        title: "Pass 3",
        subtitle: "Exam Finish",
        description: "Comparisons, likely questions, fast revision, and the bottleneck reminder.",
        sections: sections.filter((section) => section.number >= 11),
      },
    ];

    els.routeGrid.innerHTML = phases
      .map((phase) => {
        const completed = phase.sections.filter((section) => state.completedSections.has(section.id)).length;
        const firstSection = phase.sections[0];
        const focusList = phase.sections.slice(0, 4).map((section) => escapeHtml(stripNumber(section.title))).join(", ");
        return `
          <article class="route-card">
            <p class="mini-eyebrow">${escapeHtml(phase.title)}</p>
            <h4>${escapeHtml(phase.subtitle)}</h4>
            <p>${escapeHtml(phase.description)}</p>
            <p class="route-progress">${completed}/${phase.sections.length} sections done</p>
            <p>${focusList}</p>
            <button type="button" class="hero-button" data-route-section="${escapeHtml(firstSection?.id || "")}">
              Jump to first section
            </button>
          </article>
        `;
      })
      .join("");

    const bottleneckSection = sections.find((section) => section.number === 14);
    const bottleneckHtml = bottleneckSection?.subsections[0]?.html || "<p>No bottleneck section found.</p>";
    els.bottleneckCopy.innerHTML = bottleneckHtml;

    const revisionPoints = filterByQuery(data.revisionPoints, state.query).slice(0, 18);
    els.revisionGrid.innerHTML = revisionPoints.length
      ? revisionPoints
          .map(
            (point, index) => `
              <article class="revision-card">
                <p class="mini-eyebrow">Rev ${index + 1}</p>
                <p>${escapeHtml(point)}</p>
              </article>
            `
          )
          .join("")
      : `<div class="empty-card">No revision cards match the current search.</div>`;

    const prompts = filterByQuery(data.examPrompts, state.query);
    els.examPromptList.innerHTML = prompts.length
      ? prompts.map((prompt) => `<li>${escapeHtml(prompt)}</li>`).join("")
      : `<li>No active recall prompts match the current search.</li>`;

    const tables = data.tables.filter((table) => {
      if (!matchesCategory(table.sectionId)) {
        return false;
      }
      if (!state.query) {
        return true;
      }
      return matchesQuery(`${table.sectionTitle} ${table.subsectionTitle} ${table.text}`);
    });

    els.comparisonGrid.innerHTML = tables.length
      ? tables
          .map(
            (table) => `
              <article class="comparison-card">
                <div>
                  <p class="mini-eyebrow">${escapeHtml(stripNumber(table.sectionTitle))}</p>
                  <h4>${escapeHtml(table.subsectionTitle)}</h4>
                </div>
                ${table.html}
              </article>
            `
          )
          .join("")
      : `<div class="empty-card">No comparison boards match the current filter.</div>`;
  }

  function renderNotes() {
    const filteredSections = getFilteredSections();
    const visibleSubsections = filteredSections.reduce((count, section) => count + section.visibleSubsections.length, 0);
    state.counts.notesSections = filteredSections.length;
    state.counts.notesSubsections = visibleSubsections;

    els.notesResultCount.textContent = `${filteredSections.length} sections · ${visibleSubsections} visible topics`;

    if (!filteredSections.length) {
      els.notesSections.innerHTML = `<div class="empty-card">No notes sections match the current filter or search.</div>`;
      return;
    }

    els.notesSections.innerHTML = filteredSections
      .map((section) => {
        const done = state.completedSections.has(section.id);
        const buttonLabel = done ? "Completed" : "Mark Section Done";
        return `
          <article class="section-card ${done ? "is-complete" : ""}" id="${escapeHtml(section.id)}">
            <div class="section-top">
              <div>
                <p class="mini-eyebrow">${escapeHtml(section.category)}</p>
                <h3>${escapeHtml(section.title)}</h3>
                <div class="section-meta">
                  <span class="pill">${section.visibleSubsections.length} topics</span>
                  <span class="pill">${data.tables.filter((table) => table.sectionId === section.id).length} tables</span>
                </div>
              </div>
              <button type="button" class="complete-button ${done ? "is-complete" : ""}" data-section-toggle="${escapeHtml(section.id)}">
                ${escapeHtml(buttonLabel)}
              </button>
            </div>
            <p class="section-summary">${escapeHtml(section.summary || "Open the topic cards below to study the details.")}</p>
            <div class="subsection-grid">
              ${section.visibleSubsections
                .map((subsection, index) => `
                  <details class="subsection-card" ${state.query || index === 0 ? "open" : ""}>
                    <summary>${escapeHtml(subsection.title)}</summary>
                    <div class="subsection-body">${subsection.html}</div>
                  </details>
                `)
                .join("")}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderFlashcards() {
    syncFlashcardPool(false);
    const currentCard = state.flashcardPool[state.flashcardIndex];
    const filteredStudiedCount = state.flashcardPool.filter((card) => state.studiedCards.has(card.id)).length;
    state.counts.flashcards = state.flashcardPool.length;

    els.flashcardShell.classList.toggle("is-flipped", state.flashcardFlipped && Boolean(currentCard));

    if (!currentCard) {
      els.flashcardMeta.textContent = "0 cards available for the current search/filter.";
      els.flashcardSectionTag.textContent = "No card";
      els.flashcardSectionBackTag.textContent = "No card";
      els.flashcardPrompt.textContent = "No flashcards match the current filters.";
      els.flashcardAnswer.innerHTML = `<div class="empty-card">Try clearing the search, changing the focus chip, or switching the flashcard section filter.</div>`;
      setFlashcardButtonsDisabled(true);
      return;
    }

    const currentSection = sectionLookup.get(currentCard.sectionId);
    const studied = state.studiedCards.has(currentCard.id);
    els.flashcardMeta.textContent = `${state.flashcardIndex + 1}/${state.flashcardPool.length} cards · ${filteredStudiedCount} marked done in this filtered deck`;
    els.flashcardSectionTag.textContent = stripNumber(currentSection?.title || currentCard.sectionTitle);
    els.flashcardSectionBackTag.textContent = stripNumber(currentSection?.title || currentCard.sectionTitle);
    els.flashcardPrompt.textContent = currentCard.prompt;
    els.flashcardAnswer.innerHTML = currentCard.answerHtml;
    els.markCardDone.textContent = studied ? "Marked Done" : "Mark Card Done";
    els.markCardDone.classList.toggle("hero-button-primary", !studied);
    setFlashcardButtonsDisabled(false);
  }

  function renderSources() {
    const activeDeck = data.pageDecks.find((deck) => deck.id === state.activeDeckId) || data.pageDecks[0];

    if (!activeDeck) {
      els.deckButtons.innerHTML = `<div class="empty-card">No lecture deck summaries found.</div>`;
      els.deckTitle.textContent = "No deck";
      els.deckDescription.textContent = "";
      els.pageCards.innerHTML = "";
      state.counts.sourcePages = 0;
      return;
    }

    state.activeDeckId = activeDeck.id;
    els.deckButtons.innerHTML = data.pageDecks
      .map(
        (deck) => `
          <button type="button" class="deck-button ${deck.id === activeDeck.id ? "active" : ""}" data-deck="${escapeHtml(deck.id)}">
            ${escapeHtml(deck.title)}
          </button>
        `
      )
      .join("");

    const visiblePages = activeDeck.pages.filter((page) => !state.query || matchesQuery(page.text));
    state.counts.sourcePages = visiblePages.length;
    els.deckStatus.textContent = `${visiblePages.length} visible pages in ${activeDeck.title}`;
    els.deckTitle.textContent = activeDeck.title;
    els.deckDescription.textContent = `${activeDeck.pages.length} total page snapshots from this lecture deck.`;

    els.pageCards.innerHTML = visiblePages.length
      ? visiblePages
          .map(
            (page) => `
              <article class="page-card">
                <div class="page-card-head">
                  <div>
                    <p class="mini-eyebrow">Page ${page.page ?? "?"}</p>
                    <h4>${escapeHtml(page.title)}</h4>
                  </div>
                  <div class="page-number">${escapeHtml(String(page.page ?? "?"))}</div>
                </div>
                <ul>
                  ${page.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
                </ul>
              </article>
            `
          )
          .join("")
      : `<div class="empty-card">No page summaries match the current search inside this deck.</div>`;
  }

  function updateViewPanels() {
    const panelMap = {
      dashboard: els.dashboardView,
      notes: els.notesView,
      flashcards: els.flashcardsView,
      sources: els.sourcesView,
    };

    Object.entries(panelMap).forEach(([view, node]) => {
      node.hidden = state.view !== view;
    });

    els.viewButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.viewTarget === state.view);
    });
  }

  function renderSearchStatus() {
    if (state.view === "notes") {
      els.searchStatus.textContent = `${state.counts.notesSections} sections and ${state.counts.notesSubsections} topics match.`;
      return;
    }

    if (state.view === "flashcards") {
      els.searchStatus.textContent = `${state.counts.flashcards} flashcards match the current search and filters.`;
      return;
    }

    if (state.view === "sources") {
      els.searchStatus.textContent = `${state.counts.sourcePages} lecture pages match in the current deck.`;
      return;
    }

    const revisionMatches = filterByQuery(data.revisionPoints, state.query).length;
    const promptMatches = filterByQuery(data.examPrompts, state.query).length;
    els.searchStatus.textContent = `${revisionMatches} revision cards and ${promptMatches} recall prompts are visible on the dashboard.`;
  }

  function populateFlashcardSelect() {
    const options = [
      `<option value="all">All sections</option>`,
      ...sections.map(
        (section) => `<option value="${escapeHtml(section.id)}">${escapeHtml(section.title)}</option>`
      ),
    ];
    els.flashcardSectionSelect.innerHTML = options.join("");
    els.flashcardSectionSelect.value = state.flashcardSectionId;
  }

  function syncFlashcardPool(resetIndex) {
    state.flashcardPool = data.flashcards.filter((card) => {
      const section = sectionLookup.get(card.sectionId);
      if (!section) {
        return false;
      }
      if (!matchesCategory(card.sectionId)) {
        return false;
      }
      if (state.flashcardSectionId !== "all" && card.sectionId !== state.flashcardSectionId) {
        return false;
      }
      if (state.query && !matchesQuery(`${card.sectionTitle} ${card.prompt} ${card.answerText}`)) {
        return false;
      }
      return true;
    });

    if (resetIndex || state.flashcardIndex >= state.flashcardPool.length) {
      state.flashcardIndex = 0;
    }

    state.flashcardFlipped = false;
  }

  function moveCard(direction) {
    if (!state.flashcardPool.length) {
      return;
    }
    const nextIndex = state.flashcardIndex + direction;
    const total = state.flashcardPool.length;
    state.flashcardIndex = (nextIndex + total) % total;
    state.flashcardFlipped = false;
    renderFlashcards();
    renderSearchStatus();
  }

  function toggleSection(sectionId) {
    toggleSetItem(state.completedSections, sectionId);
    saveSet(STORAGE_KEYS.completedSections, state.completedSections);
    renderHero();
    renderSectionNav();
    renderNotes();
  }

  function getFilteredSections() {
    return sections
      .filter((section) => matchesCategory(section.id))
      .map((section) => {
        const subsectionMatches = state.query
          ? section.subsections.filter((subsection) => matchesQuery(`${subsection.title} ${subsection.text}`))
          : section.subsections;
        const sectionMatches = !state.query || matchesQuery(`${section.title} ${section.searchText}`);
        const visibleSubsections = state.query && sectionMatches && !subsectionMatches.length
          ? section.subsections
          : subsectionMatches;

        return {
          ...section,
          visibleSubsections,
        };
      })
      .filter((section) => section.visibleSubsections.length > 0 || !state.query);
  }

  function matchesCategory(sectionId) {
    if (state.activeCategory === "All") {
      return true;
    }
    return sectionLookup.get(sectionId)?.category === state.activeCategory;
  }

  function matchesQuery(text) {
    if (!state.query) {
      return true;
    }
    return String(text || "").toLowerCase().includes(state.query.toLowerCase());
  }

  function filterByQuery(items, query) {
    if (!query) {
      return items;
    }
    return items.filter((item) => String(item || "").toLowerCase().includes(query.toLowerCase()));
  }

  function setView(view) {
    state.view = view;
    updateViewPanels();
    renderSearchStatus();
  }

  function setFlashcardButtonsDisabled(disabled) {
    [els.prevCard, els.nextCard, els.revealCard, els.markCardDone].forEach((button) => {
      button.disabled = disabled;
      button.style.opacity = disabled ? "0.52" : "1";
      button.style.cursor = disabled ? "not-allowed" : "pointer";
    });
  }

  function loadSet(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return new Set();
      }
      return new Set(JSON.parse(raw));
    } catch (error) {
      return new Set();
    }
  }

  function saveSet(key, set) {
    try {
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch (error) {
      /* ignore localStorage write errors */
    }
  }

  function toggleSetItem(set, item) {
    if (set.has(item)) {
      set.delete(item);
    } else {
      set.add(item);
    }
  }

  function getCategory(title) {
    const lowered = title.toLowerCase();
    if (
      lowered.includes("concept of ai") ||
      lowered.includes("history and evolution") ||
      lowered.includes("foundation models")
    ) {
      return "Foundations";
    }

    if (
      lowered.includes("architectures") ||
      lowered.includes("transformers") ||
      lowered.includes("attention") ||
      lowered.includes("popular llm architectures")
    ) {
      return "Architectures";
    }

    if (
      lowered.includes("landscape") ||
      lowered.includes("ecosystem") ||
      lowered.includes("workflow")
    ) {
      return "Workflow";
    }

    if (
      lowered.includes("large language models") ||
      lowered.includes("llm") ||
      lowered.includes("foundation models")
    ) {
      return "Models";
    }

    if (
      lowered.includes("gan") ||
      lowered.includes("autoencoder")
    ) {
      return "GAN + AE";
    }

    if (
      lowered.startsWith("11.") ||
      lowered.startsWith("12.") ||
      lowered.startsWith("13.") ||
      lowered.startsWith("14.")
    ) {
      return "Exam";
    }

    return "Core";
  }

  function getSectionNumber(title) {
    const match = String(title).match(/^(\d+)\./);
    return match ? Number(match[1]) : 0;
  }

  function stripNumber(title) {
    return String(title).replace(/^\d+\.\s*/, "");
  }

  function decorateInline(text) {
    return escapeHtml(String(text || "")).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function shuffleArray(array) {
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }
  }
})();
