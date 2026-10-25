import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { loadContent } from '../scripts/content.mjs';
const root = new URL('../', import.meta.url);
const { sets, generator } = await loadContent();
let seed = 2048;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

test('four sets each contain 25 phrases and 150 distinct, correctly linked situations', () => {
  assert.equal(sets.length, 4);
  const allIds = new Set(), allText = new Set();
  for (const set of sets) {
    assert.equal(set.words.length, 25, set.name);
    assert.equal(set.situations.length, 150, set.name);
    const used = new Set();
    for (const scene of set.situations) {
      assert.ok(!allIds.has(scene.id), scene.id);
      assert.ok(!allText.has(scene.text), scene.text);
      allIds.add(scene.id); allText.add(scene.text);
      assert.ok(scene.context.length > 10);
      assert.ok(scene.text.length > 60, scene.id);
      assert.equal(scene.words.length, 3, scene.id);
      assert.equal(new Set(scene.terms).size, 3, scene.id);
      for (const word of scene.words) {
        assert.ok(set.words.includes(word), scene.id);
        assert.ok(word.meaning && word.example, word.term);
        used.add(word.term);
      }
    }
    assert.equal(used.size, set.words.length, `Unused vocabulary in ${set.name}`);
  }
  assert.equal(allIds.size, 600);
});

test('each selected set cycles through all 150 situations before repeating', () => {
  for (const set of sets) {
    let recent = [];
    for (let i = 0; i < 150; i++) {
      const item = generator.generate(sets, [set.id], recent, random);
      assert.equal(item.setId, set.id);
      assert.equal(item.words.length, 3);
      assert.equal(item.style, 'explain');
      assert.equal(item.resetHistory, false);
      assert.ok(!recent.includes(item.key));
      recent.push(item.key);
    }
    const next = generator.generate(sets, [set.id], recent, random);
    assert.equal(next.resetHistory, true);
    assert.notEqual(next.key, recent.at(-1));
  }
});

test('mixed practice preserves each complete scenario and its three intended phrases', () => {
  let recent = [];
  const selected = sets.map(set => set.id);
  for (let i = 0; i < 1200; i++) {
    const item = generator.generate(sets, selected, recent, random);
    const set = sets.find(set => set.id === item.setId);
    const scene = set.situations.find(scene => scene.id === item.key);
    assert.equal(item.scenario, scene.text);
    assert.equal(item.context, scene.context);
    assert.equal(item.words, scene.words);
    assert.equal(item.words.length, 3);
    assert.equal(item.style, 'explain');
    if (item.resetHistory) {
      assert.equal(recent.length, 600);
      recent = [];
    }
    assert.ok(!recent.includes(item.key));
    recent.push(item.key);
  }
});

test('empty selections and a one-situation library finish safely', () => {
  assert.equal(generator.generate(sets, [], []), null);
  const small = [{ ...sets[0], situations: [sets[0].situations[0]] }];
  const first = generator.generate(small, ['home'], [], () => 0);
  const next = generator.generate(small, ['home'], [first.key], () => 0);
  assert.equal(next.words.length, 3);
  assert.equal(next.resetHistory, true);
});

test('standalone output has no editing, answer fields, settings selectors, or network dependencies', () => {
  const html = readFileSync(new URL('talk-roulette-local.html', root), 'utf8');
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=|unsafe-inline|<select/);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /Classic roulette/);
  assert.doesNotMatch(html, /localStorage|SetEditor|SetStore|import-file|download-answer|answer-text|set-editor|practice-style|word-count|scene-events p\+p/);
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    assert.doesNotThrow(() => new vm.Script(match[1]));
    assert.ok(html.includes(createHash('sha256').update(match[1]).digest('base64')));
  }
  const style = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  assert.ok(html.includes(createHash('sha256').update(style).digest('base64')));
});
