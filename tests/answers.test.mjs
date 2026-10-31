import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadContent } from '../scripts/content.mjs';

const { sets, generator } = await loadContent();
const targetForm = phrase => phrase.replace(/^let them know$/, 'let someone know')
  .replace(/^pick (?:me|us) up$/, 'pick up').replace(/^drop (?:me|us) off$/, 'drop off');

test('all 600 situations have two distinct, complete answers using their three target phrases', () => {
  const unique = new Set();
  for (const set of sets) for (const scene of set.situations) {
    assert.equal(scene.answers.length, 2, scene.id);
    for (const answer of scene.answers) {
      const phrases = [...answer.matchAll(/\[\[(.+?)\]\]/g)].map(match => targetForm(match[1]));
      assert.deepEqual(phrases.sort(), [...scene.terms].sort(), scene.id);
      assert.ok(answer.split(/\s+/).length >= 25, scene.id);
      assert.doesNotMatch(answer, /\{\d+\}|<[^>]*>|\u2014/, scene.id);
      assert.ok(!unique.has(answer), `Duplicate answer in ${scene.id}`);
      unique.add(answer);
    }
  }
  assert.equal(unique.size, 1200);
});

test('every remaining situation has an equal-sized random interval, even across unequal topics', () => {
  const small = [{ ...sets[0], situations: sets[0].situations.slice(0, 1) },
    { ...sets[1], situations: sets[1].situations.slice(0, 3) }];
  const expected = small.flatMap(set => set.situations);
  for (const [index, scene] of expected.entries()) {
    for (const offset of [0.01, 0.99]) {
      const item = generator.generate(small, small.map(set => set.id), [], () => (index + offset) / 4);
      assert.equal(item.key, scene.id);
      assert.equal(item.answers, scene.answers);
    }
  }
  const last = generator.generate(small, small.map(set => set.id), expected.slice(0, 3).map(scene => scene.id), () => 0);
  assert.equal(last.key, expected[3].id);
});
