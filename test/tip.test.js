const test = require('node:test');
const assert = require('node:assert');
const { parseAmount, split } = require('../tip.js');

test('parseAmount reads what people type', () => {
  assert.strictEqual(parseAmount('50'), 50);
  assert.strictEqual(parseAmount('$1,234.50'), 1234.5);
  assert.strictEqual(parseAmount(''), 0);
});

test('split adds the tip and shares the total', () => {
  assert.deepStrictEqual(split(100, 10, 2), { tip: 10, total: 110, each: 55 });
  assert.deepStrictEqual(split(80, 25, 4), { tip: 20, total: 100, each: 25 });
});

test('money shows dollars and cents', () => {
  const { money } = require('../tip.js');
  assert.strictEqual(money(split(50, 15, 3).each), '$19.17');
  assert.strictEqual(money(57.5), '$57.50');
});

test('splitting between no one does not show Infinity or NaN', () => {
  const { money } = require('../tip.js');
  for (const people of [0, NaN]) {
    const shown = money(split(50, 15, people).each);
    assert.doesNotMatch(shown, /Infinity|NaN/);
  }
});

test('money shows a dash for an amount that is not a number', () => {
  const { money } = require('../tip.js');
  assert.strictEqual(money(Infinity), '—');
  assert.strictEqual(money(NaN), '—');
  assert.strictEqual(money(0), '$0.00');
});
