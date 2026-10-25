// Content files register vocabulary separately from complete, matching situations.
window.PracticeContent = {
  vocabulary: {},
  situations: { home: [], restaurant: [], travel: [], everyday: [] },
  add(set, context, terms, scenes) {
    const target = this.situations[set];
    for (const text of scenes) {
      target.push({ id: `${set}-${target.length + 1}`, context, terms, text });
    }
  }
};
