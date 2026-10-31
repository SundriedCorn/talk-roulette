// Content files register vocabulary separately from complete, matching situations.
window.PracticeContent = {
  vocabulary: {},
  situations: { home: [], restaurant: [], travel: [], everyday: [] },
  add(set, context, terms, scenes) {
    const target = this.situations[set];
    for (const text of scenes) {
      target.push({ id: `${set}-${target.length + 1}`, context, terms, text });
    }
  },
  addAnswers(set, first, templates, rows) {
    if (templates.length !== 2 || rows.length !== 5) throw new Error('Each answer group needs two models for five situations.');
    rows.forEach((values, offset) => {
      const scene = this.situations[set][first - 1 + offset];
      if (!scene || scene.answers) throw new Error(`Invalid answer group: ${set}-${first + offset}.`);
      scene.answers = templates.map(template => template.replace(/\{(\d+)\}/g, (_, index) => {
        if (typeof values[index] !== 'string') throw new Error(`Missing answer detail in ${scene.id}.`);
        return values[index];
      }));
    });
  }
};
