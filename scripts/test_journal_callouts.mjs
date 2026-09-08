import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { bosses } from '../src/data.js'
import journal from '../src/journal-callouts.json' with { type: 'json' }

test('every evidence group attaches exactly once and every mechanic has the correct status', () => {
  assert.deepEqual(Object.keys(journal.bosses).sort(), bosses.map(b => b.name).sort())
  for (const boss of bosses) {
    assert.equal(new Set(boss.abilities.map(a => a.name)).size, boss.abilities.length)
    for (const [name, evidence] of Object.entries(journal.bosses[boss.name])) {
      const ability = boss.abilities.find(a => a.name === name)
      assert.ok(ability, `${boss.name}: ${name}`)
      assert.deepEqual(ability.callouts, evidence.callouts)
    }
    for (const ability of boss.abilities) {
      assert.equal(ability.verification, ability.callouts.length ? 'verified' : 'unverified')
      if (ability.journalDerived) assert.ok(ability.text && ability.detail)
      for (const callout of ability.callouts) {
        assert.ok(callout.count > 0 && callout.line > 0 && callout.timestamp)
        assert.ok(!/[\\/]/.test(callout.source), 'Publish only the source filename')
      }
    }
  }
})

// The private report is optional in fresh checkouts, but checked when available.
test('all recorded boss phrases and counts survive the reviewed import', (t) => {
  let report
  try {
    report = JSON.parse(readFileSync(new URL('../reports/boss-callouts/report.json', import.meta.url), 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return t.skip('Local journal report is not present')
    throw error
  }
  const source = report.phrases.filter(r => r.category === 'boss speech')
    .map(r => JSON.stringify([r.boss === 'Aegis High Priest' ? 'Aegis High Priestess' : r.boss, r.phrase, r.count])).sort()
  const attached = bosses.flatMap(b => b.abilities.flatMap(a => a.callouts
    .map(r => JSON.stringify([b.name, r.phrase, r.count])))).sort()
  assert.deepEqual(attached, source)
})
