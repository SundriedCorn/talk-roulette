import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadContent } from './content.mjs';
await loadContent(); // Validate every situation and vocabulary reference before packaging.
const root = new URL('../', import.meta.url);
let html = await readFile(new URL('index.html', root), 'utf8');
const style = await readFile(new URL('styles/app.css', root), 'utf8');
const hash = text => `'sha256-${createHash('sha256').update(text).digest('base64')}'`;
const scriptHashes = [];
html = html.replace('<link rel="stylesheet" href="styles/app.css">', () => `<style>\n${style}\n</style>`);
for (const match of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)]) {
  const source = await readFile(new URL(match[1], root), 'utf8');
  const escaped = `\n${source.replace(/<\/script/gi, '<\\/script')}\n`;
  scriptHashes.push(hash(escaped));
  html = html.replace(match[0], () => `<script>${escaped}</script>`);
}
html = html.replace("script-src 'self'", () => `script-src ${scriptHashes.join(' ')}`);
html = html.replace("style-src 'self'", () => `style-src ${hash(`\n${style}\n`)}`);
const output = new URL('talk-roulette-local.html', root);
await writeFile(output, html);
console.log(fileURLToPath(output));
