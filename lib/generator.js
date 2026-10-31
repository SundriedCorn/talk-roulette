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
    const { item: scene, resetHistory } = RandomCycle.draw(pool.flatMap(set => set.situations), recent, random);
    const set = pool.find(set => set.situations.includes(scene));
    return { setId: set.id, name: set.name, context: scene.context, words: scene.words, scenario: scene.text,
      key: scene.id, answers: scene.answers, task: pick(tasks, random), style: 'explain', resetHistory };
  }
  window.LessonGenerator = { generate };
})();
