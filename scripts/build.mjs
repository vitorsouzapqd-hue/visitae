import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pageComponents } from '../src/page.mjs';
import { clientOrder, styleOrder } from '../src/build-order.mjs';
import { tours } from '../src/data/tours.mjs';
import { testimonialTopics } from '../src/data/testimonials.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const write = (path, contents) => writeFileSync(new URL(path, root), contents);
const scriptData = data => JSON.stringify(data, null, 2).replaceAll('<', '\\u003c');
const replaceSlots = (template, components) => template.replace(/\{\{(\w+)\}\}/g, (_, name) => {
  if (!Object.hasOwn(components, name)) throw new Error(`Unknown component: ${name}`);
  return typeof components[name] === 'function' ? components[name]() : components[name];
});

// HTML/CSS/JS output keeps the original static hosting contract. No runtime framework.
// Only owned files are written; public assets and hosting metadata remain untouched.
mkdirSync(new URL('dist/ui/', root), { recursive: true });
write('dist/index.html', replaceSlots(read('src/index.html'), pageComponents));
write('dist/styles.css', styleOrder.map(name => read(`src/styles/${name}`)).join(''));
write('dist/testimonials.css', read('src/styles/Testimonials.css'));
write('dist/activation-magazine.css', read('src/styles/ActivationMagazine.css'));
write('dist/app.js', replaceSlots(clientOrder.map(name => read(`src/client/${name}`)).join(''), { tours: scriptData(tours) }));
write('dist/testimonials.js', replaceSlots(read('src/client/Testimonials.js.in'), { testimonialTopics: scriptData(testimonialTopics) }));
write('dist/locations.js', read('src/client/Locations.js'));
write('dist/config.js', read('src/config.js'));
for (const name of readdirSync(new URL('src/ui/', root))) {
  if (name.endsWith('.mjs')) write(`dist/ui/${name}`, read(`src/ui/${name}`));
}
console.log(`Build OK: ${Object.keys(pageComponents).length - 1} components, native HTML/CSS/JavaScript → ${fileURLToPath(new URL('dist/', root))}`);
