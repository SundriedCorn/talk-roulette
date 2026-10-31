(() => {
  const { $ } = UI;
  const sets = STARTER_SETS;
  let selected = sets.map(set => set.id), round = 0;
  let recent = [], classicRecent = [];
  const classic = [...QUESTIONS.map(item => ({ ...item, kind: 'Question' })), ...WORDS.map(item => ({ ...item, kind: 'Word' }))]
    .map((item, id) => ({ ...item, id }));

  function next() {
    const item = LessonGenerator.generate(sets, selected, recent);
    if (item) { round++; recent = item.resetHistory ? [item.key] : [...recent, item.key]; }
    PracticeView.challenge(item, round);
  }

  PracticeView.sets(sets, selected, (id, checked) => {
    selected = checked ? [...selected, id] : selected.filter(value => value !== id);
    PracticeView.vocabulary(sets, selected);
    $('next').disabled = !selected.length;
    next();
  });
  $('next').onclick = next;
  function nextClassic() {
    const { item, resetHistory } = RandomCycle.draw(classic, classicRecent);
    classicRecent = resetHistory ? [item.id] : [...classicRecent, item.id];
    $('classic-label').textContent = `${item.kind} · ${item.theme}`;
    $('classic-prompt').textContent = item.text;
  }
  $('classic-next').onclick = nextClassic;
  function mode(lesson) {
    $('lesson-panel').hidden = !lesson;
    $('roulette-panel').hidden = lesson;
    $('lesson-mode').setAttribute('aria-pressed', String(lesson));
    $('roulette-mode').setAttribute('aria-pressed', String(!lesson));
  }
  $('lesson-mode').onclick = () => mode(true);
  $('roulette-mode').onclick = () => mode(false);
  document.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.repeat || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.target.closest('input,textarea,select,button,a,summary,[contenteditable]')) return;
    event.preventDefault();
    if ($('lesson-panel').hidden) $('classic-next').click();
    else if (!$('next').disabled) next();
  });
  PracticeView.vocabulary(sets, selected);
  nextClassic();
  next();
})();
