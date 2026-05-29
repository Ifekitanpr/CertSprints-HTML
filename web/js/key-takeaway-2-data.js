window.KT2_DATA = {
  sections: [
    {
      id: "pm",
      step: 1,
      title: "Understanding Project Management",
      tagline: "Core concepts and principles",
      items: [
        { id: "pm-1", text: "Projects are temporary endeavors with specific objectives" },
        { id: "pm-2", text: "Project management involves balancing scope, time, and cost" },
        { id: "pm-3", text: "Stakeholder management is critical for success" },
      ],
    },
    {
      id: "agile",
      step: 2,
      title: "Agile Methodology",
      tagline: "Adaptive approach to project management",
      items: [
        { id: "agile-1", text: "Projects are temporary endeavors with specific objectives" },
        { id: "agile-2", text: "Project management involves balancing scope, time, and cost" },
        { id: "agile-3", text: "Stakeholder management is critical for success" },
      ],
    },
  ],

  storageKey: "cs-kt2-checked",

  readChecked() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* ignore */
    }
    return {};
  },

  writeChecked(map) {
    localStorage.setItem(this.storageKey, JSON.stringify(map));
  },

  allItemIds() {
    return this.sections.flatMap(function (section) {
      return section.items.map(function (item) {
        return item.id;
      });
    });
  },

  percentFromChecked(checkedMap) {
    const ids = this.allItemIds();
    const total = ids.length;
    const done = ids.filter(function (id) {
      return checkedMap[id];
    }).length;
    if (!total) return 0;
    const raw = Math.round((done / total) * 100);
    if (done === 0) return 0;
    if (raw >= 100) return 100;
    const display = [17, 33, 50, 67, 83];
    const idx = Math.min(done - 1, display.length - 1);
    return display[idx];
  },
};
