const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('each tip button sets the percent its label shows', () => {
  const buttons = [...html.matchAll(/<button[^>]*data-tip="([^"]*)"[^>]*>\s*([\d.]+)%\s*<\/button>/g)];
  assert.ok(buttons.length > 0, 'no tip buttons found in index.html');
  for (const [, dataTip, label] of buttons) {
    assert.strictEqual(Number(dataTip), Number(label), `the ${label}% button sets data-tip="${dataTip}"`);
  }
});
