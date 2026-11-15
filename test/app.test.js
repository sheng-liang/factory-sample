const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Runs app.js against a minimal stand-in for the page's DOM, so a test can
// type into a field and read what the page would show.
function loadPage(query) {
  const listeners = new Map();
  const el = (id, value = '') => ({
    id, value, textContent: '', dataset: {},
    classList: { toggle() {} },
    addEventListener(type, fn) { listeners.set(`${id}:${type}`, fn); },
  });
  const els = { bill: el('bill', '50.00'), people: el('people', '3'), custom: el('custom'),
    tip: el('tip'), total: el('total'), each: el('each') };
  const document = {
    getElementById: (id) => els[id],
    querySelectorAll: () => [],
  };
  const Tip = require('../tip.js');
  const src = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  vm.runInNewContext(src, { document, Tip, URLSearchParams, location: { search: query } });
  return {
    els,
    type(id, value) {
      els[id].value = value;
      const fn = listeners.get(`${id}:input`);
      if (fn) fn();
    },
  };
}

test('typing a new number of people updates each share', () => {
  const { money } = require('../tip.js');
  const page = loadPage('?bill=100&tip=20&people=1');
  assert.strictEqual(page.els.each.textContent, money(120));
  page.type('people', '4');
  assert.strictEqual(page.els.each.textContent, money(30));
});
