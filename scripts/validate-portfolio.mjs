import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('main.js', 'utf8');
const page = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const projects = { innerHTML: '' };
const menu = { addEventListener() {}, setAttribute() {} };
const nav = { classList: { toggle: () => true, remove() {} }, querySelectorAll: () => [] };
const year = { textContent: '' };
const mockDocument = { querySelector(selector) {
  return { '#projects': projects, '.menu-button': menu, '#nav': nav, '#year': year }[selector] ?? null;
}};
runInNewContext(source, { document: mockDocument, Date }, { filename: 'main.js', timeout: 1000 });

const output = projects.innerHTML;
assert.equal((output.match(/<article class="project /g) ?? []).length, 7, 'Expected all seven project cards');
assert.equal((output.match(/class="featured-label"/g) ?? []).length, 3, 'Expected three featured projects');
assert.match(output, /Ops Atlas/);
assert.match(output, /SignalForge 720/);
assert.match(output, /Casefile Zero/);
assert.match(output, /casefile-zero\//);
assert.match(output, /https:\/\/aounali720\.github\.io\/ops-atlas\//);
assert.match(output, /https:\/\/github\.com\/aounali720\/ops-atlas/);
assert.match(output, /https:\/\/github\.com\/aounali720\/signalforge-720/);
assert.match(output, /View walkthrough/);
assert.doesNotMatch(output, /undefined|null<\/svg>/);
assert.equal((output.match(/<svg viewBox=/g) ?? []).length, 7, 'Every project needs an illustration');
assert.equal((output.match(/rel="noopener noreferrer"/g) ?? []).length, 10, 'External project links must have safe rel');
assert.match(page, /id="projects"/);
assert.match(page, /<script src="main\.js" defer>/);
assert.match(css, /\.project-featured/);
assert.match(css, /\.project-demo/);
console.log('Portfolio validation passed: 7 projects, 3 featured, live/code links, SVGs, and semantics.');
