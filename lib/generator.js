(() => {
  const tasks = [
    'What would you do, and why? Use the three phrases to explain your plan in your own words.',
    'How would you handle this? Use the three phrases and explain the reasons for your choices.',
    'Explain what needs to happen next using the three phrases. Add any details that help your answer.'
  ];
  const pick = (items, random) => items[Math.floor(random() * items.length)];
  function generate(sets, selected, recent = [], random = Math.random) {
    const pool = sets.filter(set => selected.includes(set.id) && set.situations.length);
    if (!pool.length) return null;
    const seen = new Set(recent);
    let available = pool.map(set => ({ set, scenes: set.situations.filter(scene => !seen.has(scene.id)) })).filter(group => group.scenes.length);
    const resetHistory = available.length === 0;
    if (resetHistory) {
      // Start a new cycle, keeping the last situation out when alternatives exist.
      available = pool.map(set => ({ set, scenes: set.situations.filter(scene => scene.id !== recent.at(-1)) })).filter(group => group.scenes.length);
      if (!available.length) available = pool.map(set => ({ set, scenes: set.situations }));
    }
    const { set, scenes } = pick(available, random);
    const scene = pick(scenes, random);
    return { setId: set.id, name: set.name, context: scene.context, words: scene.words, scenario: scene.text,
      key: scene.id, task: pick(tasks, random), style: 'explain', resetHistory };
  }
  window.LessonGenerator = { generate };
})();
