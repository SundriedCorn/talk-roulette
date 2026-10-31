import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

export async function loadContent() {
  const root = new URL('../', import.meta.url);
  const html = await readFile(new URL('index.html', root), 'utf8');
  const context = vm.createContext({});
  context.window = context;
  for (const [, path] of html.matchAll(/<script src="([^"]+)"><\/script>/g)) {
    if (!path.startsWith('data/') && !['lib/sets.js', 'lib/random.js', 'lib/generator.js'].includes(path)) continue;
    vm.runInContext(await readFile(new URL(path, root), 'utf8'), context, { filename: path });
  }
  return { sets: context.STARTER_SETS, generator: context.LessonGenerator };
}
