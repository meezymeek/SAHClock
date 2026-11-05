import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const expected = Date.parse('2026-12-11T05:00:00Z');
const files = ['index.html', 'sah-countdown-widget.js', 'sah-countdown-widget-animated.js', '.github/workflows/update-preview.yml'];
for (const file of files) {
  test(`${file}: countdown uses December 11 at a fixed Eastern-midnight instant`, () => {
    const source = readFileSync(new URL(file, root), 'utf8');
    const dates = [...source.matchAll(/new Date\('([0-9]{4}-[^']+)'\)/g)].map(m => m[1]);
    assert.ok(dates.length > 0, 'a countdown target must exist');
    for (const date of dates) {
      for (const TZ of ['UTC', 'America/Chicago', 'America/Los_Angeles', 'Asia/Tokyo']) {
        const result = spawnSync(process.execPath, ['-e', `process.stdout.write(String(new Date(${JSON.stringify(date)}).getTime()))`], { env: { ...process.env, TZ }, encoding: 'utf8' });
        assert.equal(result.status, 0);
        assert.equal(Number(result.stdout), expected, `${file} target in ${TZ}`);
      }
    }
  });
}

for (const file of files.filter(file => !file.startsWith('.github/'))) {
  test(`${file}: public copy distinguishes the main deadline and narrow exception`, () => {
    const source = readFileSync(new URL(file, root), 'utf8');
    assert.ok(source.includes('December 11, 2026</strong>'));
    assert.ok(source.includes('November 12'));
    assert.ok(source.includes('cannot naturally produce'));
    assert.ok(source.includes('Display convention: midnight Eastern'));
    assert.ok(source.includes('https://www.congress.gov/crs-product/IF13136'));
    assert.ok(!source.includes('Until Hemp is ILLEGAL'));
    assert.ok(!source.includes("but it's not final"));
  });
}

for (const [file, global] of [['sah-countdown-widget.js', 'SAHCountdown'], ['sah-countdown-widget-animated.js', 'SAHCountdownAnimated']]) {
  for (const [now, values] of [
    ['2026-11-04T18:00:00Z', [36, 11, 0, 0]],
    ['2026-12-11T04:59:59Z', [0, 0, 0, 1]],
    ['2026-12-11T05:00:00Z', [0, 0, 0, 0]],
    ['2026-12-11T05:00:01Z', [0, 0, 0, 0]],
  ]) {
    test(`${file}: actual countdown at ${now}`, () => {
      class ClockDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } }
      const context = { window: {}, Date: ClockDate, setInterval: () => 1, clearInterval() {} };
      vm.runInNewContext(readFileSync(new URL(file, root), 'utf8'), context);
      let actual;
      const widget = context.window[global];
      widget.updateDisplay = (_instance, ...parts) => { actual = parts; };
      widget.startCountdown({ interval: null });
      assert.deepEqual(actual, values);
    });
  }
}
