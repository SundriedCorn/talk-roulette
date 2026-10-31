(() => {
  const names = { home: 'Home', restaurant: 'Restaurant', travel: 'Travel', everyday: 'Everyday conversations' };
  window.STARTER_SETS = Object.entries(names).map(([id, name]) => {
    const words = PracticeContent.vocabulary[id].map(([term, meaning, example]) => ({ term, meaning, example }));
    const byTerm = new Map(words.map(word => [word.term, word]));
    if (byTerm.size !== words.length) throw new Error(`Duplicate vocabulary in ${name}.`);
    const seen = new Set();
    const situations = PracticeContent.situations[id].map(scene => {
      if (!scene.text?.trim() || !scene.context?.trim() || seen.has(scene.id)) throw new Error(`Invalid situation in ${name}.`);
      if (scene.terms.length !== 3 || new Set(scene.terms).size !== 3) throw new Error(`${scene.id} needs three different phrases.`);
      if (scene.answers?.length !== 2 || scene.answers.some(answer => !answer.trim() || (answer.match(/\[\[.+?\]\]/g) || []).length !== 3)) {
        throw new Error(`${scene.id} needs two sample answers using three highlighted phrases.`);
      }
      seen.add(scene.id);
      const targets = scene.terms.map(term => {
        if (!byTerm.has(term)) throw new Error(`Unknown phrase “${term}” in ${scene.id}.`);
        return byTerm.get(term);
      });
      return { ...scene, words: targets };
    });
    return { id, name, words, situations };
  });
})();
