# Talk Roulette

Live site: https://sundriedcorn.github.io/talk-roulette/

For offline use, open `talk-roulette-local.html` directly in a browser.

Each of the four sets has **25 phrases and 150 situations**: Home, Restaurant, Travel, Everyday conversations. Every situation uses three matching phrases and asks the learner to explain. Selected situations cycle without repeats until that pool is exhausted.

The first situation and each new situation are chosen randomly, with equal chances for every remaining situation. Classic roulette also starts randomly and cycles without repeats. Each lesson situation has two tailored sample answers behind **Show sample answers (2)**, with the target phrases in bold. The answers close when the situation changes.

## Content files

- `data/vocabulary/`: one file per set, containing phrases, meanings, and examples.
- `data/situations/`: one folder per set, split into three files of 50 situations each. Each group specifies a setting, three vocabulary phrases, and five complete situations.
- `data/answers/`: matching topic files with two answer patterns per group and details for each individual situation. `{0}`, `{1}`, etc. insert those details; `[[phrase]]` marks the target language for bold display. `addAnswers` links each group to its first situation number and the next four.
- `data/catalog.js`: registers content; `lib/sets.js` links and validates it.
- `data.js`: the original classic roulette prompts.

To update vocabulary, edit its set file and update any situation groups referencing a renamed phrase. Add situations to the relevant topic file. The page lists these scripts in `index.html`; include a new script there if you create another file.

Rebuild the self-contained file: `node scripts/build.mjs`

Check content and behavior: `node --test tests/*.test.mjs`

Learners can choose sets and generate situations. There are no editing controls, answer fields, or practice settings. GitHub Pages publishes the repository root from `main`.
