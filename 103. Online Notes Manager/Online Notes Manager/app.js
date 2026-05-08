(() => {
  const form = document.getElementById("noteForm");
  const grid = document.getElementById("noteGrid");
  const stats = document.getElementById("stats");
  const search = document.getElementById("search");
  const tagFilter = document.getElementById("tagFilter");
  const sortSelect = document.getElementById("sort");
  const clearAllBtn = document.getElementById("clearAll");
  const resetFormBtn = document.getElementById("resetForm");
  const exportBtn = document.getElementById("exportNotes");
  const submitBtn = document.getElementById("submitBtn");

  const storageKey = "notes-data-v1";

  const readNotes = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Could not read notes", err);
      return [];
    }
  };

  const writeNotes = (notes) => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  };

  const state = {
    notes: readNotes(),
    filterText: "",
    filterTag: "",
    sort: "newest",
  };

  const resetForm = () => {
    form.reset();
    form.noteId.value = "";
    form.color.value = "#ff9950";
    form.title.focus();
    submitBtn.textContent = "Save note";
  };

  const parseTags = (value) =>
    value
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

  const formatDate = (iso) => new Date(iso).toLocaleString();

  const upsertNote = (note) => {
    const existingIndex = state.notes.findIndex((n) => n.id === note.id);
    if (existingIndex >= 0) {
      state.notes[existingIndex] = note;
    } else {
      state.notes.unshift(note);
    }
    writeNotes(state.notes);
  };

  const deleteNote = (id) => {
    state.notes = state.notes.filter((n) => n.id !== id);
    writeNotes(state.notes);
    render();
  };

  const loadForEdit = (note) => {
    form.noteId.value = note.id;
    form.title.value = note.title;
    form.body.value = note.body;
    form.tags.value = note.tags.join(", ");
    form.color.value = note.color;
    form.pinned.checked = Boolean(note.pinned);
    submitBtn.textContent = "Update note";
    form.title.focus();
  };

  const matchesFilters = (note) => {
    const text = state.filterText.toLowerCase();
    const tag = state.filterTag.toLowerCase();

    const textMatch =
      !text ||
      note.title.toLowerCase().includes(text) ||
      note.body.toLowerCase().includes(text);

    const tagMatch = !tag || note.tags.includes(tag);

    return textMatch && tagMatch;
  };

  const sortNotes = (notes) => {
    const sorted = [...notes];
    switch (state.sort) {
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "pinned":
        return sorted.sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.createdAt) - new Date(a.createdAt));
      case "newest":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const render = () => {
    const filtered = state.notes.filter(matchesFilters);
    const ordered = sortNotes(filtered);

    stats.textContent = `${ordered.length} of ${state.notes.length} notes visible`;

    if (!ordered.length) {
      grid.innerHTML = '<div class="empty">No notes yet. Create one on the left.</div>';
      return;
    }

    grid.innerHTML = ordered
      .map(
        (note) => `
        <article class="note" style="border-color:${note.color}">
          ${note.pinned ? '<span class="pin"></span>' : ""}
          <h3 class="title">${note.title}</h3>
          <p class="body">${note.body.replace(/</g, "&lt;")}</p>
          <div class="tags">
            ${note.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
          </div>
          <div class="meta">
            <span>${formatDate(note.updatedAt || note.createdAt)}</span>
            <div class="actions">
              <button data-id="${note.id}" class="ghost edit">Edit</button>
              <button data-id="${note.id}" class="ghost delete">Delete</button>
            </div>
          </div>
        </article>`
      )
      .join("");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = form.noteId.value || crypto.randomUUID();
    const now = new Date().toISOString();

    const nextNote = {
      id,
      title: form.title.value.trim() || "Untitled",
      body: form.body.value.trim(),
      tags: parseTags(form.tags.value),
      color: form.color.value,
      pinned: form.pinned.checked,
      createdAt: form.noteId.value
        ? state.notes.find((n) => n.id === id)?.createdAt || now
        : now,
      updatedAt: form.noteId.value ? now : null,
    };

    upsertNote(nextNote);
    render();
    resetForm();
  });

  grid.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    if (!id) return;

    if (target.classList.contains("delete")) {
      if (confirm("Delete this note?")) deleteNote(id);
      return;
    }

    if (target.classList.contains("edit")) {
      const note = state.notes.find((n) => n.id === id);
      if (note) loadForEdit(note);
    }
  });

  search.addEventListener("input", (e) => {
    state.filterText = e.target.value;
    render();
  });

  tagFilter.addEventListener("input", (e) => {
    state.filterTag = e.target.value.trim().toLowerCase();
    render();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  clearAllBtn.addEventListener("click", () => {
    if (!state.notes.length) return;
    if (confirm("Clear all notes?")) {
      state.notes = [];
      writeNotes(state.notes);
      render();
    }
  });

  resetFormBtn.addEventListener("click", () => resetForm());

  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.notes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes-export.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  render();
})();
