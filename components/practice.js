(() => {
  const { $, el } = UI;
  function sets(sets, selected, onSelect) {
    $('set-list').replaceChildren();
    if (!sets.length) $('set-list').append(el('p', 'No practice sets are available yet.', 'muted'));
    for (const set of sets) {
      const row = el('div', '', 'set-row');
      const label = el('label');
      const input = el('input');
      input.type = 'checkbox';
      input.checked = selected.includes(set.id);
      input.onchange = () => onSelect(set.id, input.checked);
      const info = el('span');
      info.append(el('strong', set.name), el('small', `${set.words.length} phrases · ${set.situations.length} situations`));
      label.append(input, info);
      row.append(label);
      $('set-list').append(row);
    }
  }
  function vocabulary(sets, selected) {
    const chosen = sets.filter(set => selected.includes(set.id));
    const count = chosen.reduce((total, set) => total + set.words.length, 0);
    $('vocabulary-summary').textContent = `Your vocabulary list · ${count} words & phrases`;
    $('vocabulary-list').replaceChildren();
    for (const set of chosen) {
      const group = el('section', '', 'vocab-group');
      group.append(el('h3', set.name));
      for (const word of set.words) {
        const row = el('div', '', 'vocab-word');
        row.append(el('strong', word.term), el('span', word.meaning || word.example));
        group.append(row);
      }
      $('vocabulary-list').append(group);
    }
  }
  function challenge(item, round) {
    SampleAnswers.render(item?.answers);
    $('hints').open = false;
    $('scene-events').replaceChildren();
    $('target-words').replaceChildren();
    $('hint-content').replaceChildren();
    $('context-label').textContent = item?.name || 'CHOOSE YOUR PRACTICE';
    $('round-label').textContent = item ? `Situation ${round}` : '';
    $('scene-intro').textContent = item?.context || 'Select a set with the vocabulary you want to practice.';
    $('task').textContent = item?.task || 'Choose at least one set to get a new situation.';
    $('hints').hidden = !item;
    if (!item) return;
    $('scene-events').append(el('p', item.scenario));
    item.words.forEach(word => {
      $('target-words').append(el('span', word.term, 'chip'));
      const hint = el('div', '', 'hint-entry');
      hint.append(el('strong', word.term));
      if (word.meaning) hint.append(el('p', word.meaning));
      if (word.example) hint.append(el('p', `Example: ${word.example}`));
      $('hint-content').append(hint);
    });
    $('hint-content').append(el('p', 'Start with what you would do, then explain why. You can change the tense, pronouns, or word order of each phrase to fit your answer.', 'small muted'));
  }
  window.PracticeView = { sets, vocabulary, challenge };
})();
