(() => {
  const { $, el } = UI;
  function render(answers = []) {
    const disclosure = $('sample-answers');
    disclosure.open = false;
    disclosure.hidden = !answers.length;
    const content = $('sample-content');
    content.replaceChildren();
    answers.forEach((answer, index) => {
      const section = el('section', '', 'sample-answer');
      section.append(el('h3', `Sample answer ${index + 1}`));
      const paragraph = el('p');
      for (const part of answer.split(/(\[\[.+?\]\])/g)) {
        paragraph.append(part.startsWith('[[') ? el('strong', part.slice(2, -2)) : document.createTextNode(part));
      }
      section.append(paragraph);
      content.append(section);
    });
  }
  window.SampleAnswers = { render };
})();
