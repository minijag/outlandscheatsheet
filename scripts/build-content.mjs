import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { bosses, sources } from '../src/data.js'

const origin = 'https://www.outlandscheatsheet.com'
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const paths = ['/']
const nav = '<a href="/">Encounter search</a><a href="/encounters/">All encounters</a><a href="/guide/">Using the guide</a><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a>'
const css = 'body{margin:0;background:#090d10;color:#e7e5df;font:16px/1.75 system-ui,sans-serif}header,main,footer{max-width:900px;margin:auto;padding:24px}header,footer{border-bottom:1px solid #30383c}nav{display:flex;flex-wrap:wrap;gap:18px}a{color:#e4c479}h1,h2,h3{line-height:1.25}h1{font-size:clamp(28px,5vw,44px)}h2{margin-top:36px}article{padding:12px 0 24px;border-bottom:1px solid #30383c}p,li{overflow-wrap:anywhere}.note{color:#aab1b3}.boss-image{max-width:240px;max-height:240px;object-fit:contain}footer{margin-top:40px;font-size:14px}blockquote{margin:12px 0;padding-left:18px;border-left:2px solid #c9a55d}'

async function page(path, title, description, body) {
  paths.push(path)
  await mkdir(`dist${path}`, { recursive: true })
  await writeFile(`dist${path}index.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | Outlands Cheat Sheet</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${origin}${path}"><meta name="robots" content="index,follow"><style>${css}</style></head><body><header><a href="/">OUTLANDS CHEAT SHEET</a><nav aria-label="Main navigation">${nav}</nav></header><main><h1>${escape(title)}</h1>${body}</main><footer><p>Independent UO Outlands fan reference. Not affiliated with or endorsed by UO Outlands.</p><nav aria-label="Site information">${nav}</nav></footer></body></html>`)
}

// Render the same React UI at build time; the client attaches its interactions normally.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const html = await readFile('dist/index.html', 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error('Expected empty Vite root for prerender')
  await writeFile('dist/index.html', html.replace('<div id="root"></div>', `<div id="root">${renderToString(React.createElement(App))}</div>`))
} finally {
  await server.close()
}

await page('/about/', 'About this reference', 'How Outlands Cheat Sheet organizes encounter mechanics and journal evidence.', `
<p>Outlands Cheat Sheet is an independent fan reference for UO Outlands encounters. It brings boss locations, combat profiles, mechanic descriptions, and field notes into a searchable index for players preparing for a fight.</p>
<h2>How the information is assembled</h2><p>The roster and combat archetypes reference the official Outlands wiki. The encounter entries combine community reference material with reviewed game-journal callouts. The site distinguishes a recorded phrase from an interpretation of what that phrase means.</p>
<h2>What “verified” means</h2><p>A verified mechanic has a matching callout in the journal evidence reviewed for this project. This confirms that the phrase was recorded. It does not independently confirm damage, timing, range, targeting, or the proposed association with a mechanic. An unverified entry has no matching callout in that evidence; it is not proof that the mechanic never occurs.</p>
<h2>Corrections and attribution</h2><p>Game updates can change encounters. Please <a href="/contact/">report corrections</a> with the boss name, the wording or behavior observed, and any supporting evidence. UO Outlands, game names, artwork, and other third-party materials belong to their respective owners.</p>
<h2>References</h2><ul>${sources.map((source) => `<li><a href="${escape(source.url)}">${escape(source.label)}</a></li>`).join('')}</ul>`)

await page('/contact/', 'Contact and corrections', 'Report an encounter correction or contact the Outlands Cheat Sheet community.', `
<p>Use the site's existing <a href="https://discord.gg/TmtPheKF2v">Discord community</a> to report an error, share encounter evidence, or ask how to reach the site maintainer about privacy or content rights.</p>
<h2>Reporting a mechanic</h2><p>Include the boss name, dungeon, mechanic name, and the exact callout or behavior you observed. Explain whether the report is based on a journal phrase, a screenshot, or direct play. Damage and timing claims are easier to assess when the evidence shows the surrounding encounter context.</p>
<p>Please remove player names and unrelated private chat from evidence before sharing it. Do not send passwords, account details, or full unedited journal archives.</p>
<h2>Privacy and content concerns</h2><p>For a privacy or attribution request, identify the page or image concerned and explain the issue. Discord is a separate service governed by its own policies.</p>`)

await page('/guide/', 'Using the encounter guide', 'Find encounters and interpret mechanics, callouts, and verification labels.', `
<p>Use this reference before a pull to identify the encounter, read its mechanics, and choose which observations your group needs to watch for. Keep the game's current behavior as the final source of truth.</p>
<h2>Find the right encounter</h2><p>The home-page search matches boss names, locations, and encounter types. Type filters separate main bosses, mini-bosses, Omni Bosses, and treasure encounters. Sort by dungeon when planning a route, or by name when you already know the target. Compact view reduces each entry to its name and location.</p>
<h2>Read the evidence before the counterplay</h2><p>Open an encounter to compare the description with its recorded callouts. A callout is an exact phrase associated with the entry. A description interprets the encounter; it may be incomplete. When an entry only describes a journal phrase, avoid treating it as a tested prediction of damage or targeting.</p>
<h2>Plan around uncertainty</h2><p>Use the field notes as a preparation checklist. Identify the hazards described in the entry, agree who will watch for summons or floor changes, and leave room to adjust if the fight behaves differently. An unverified mechanic deserves observation rather than an assumption that it is safe to ignore.</p>
<h2>Debuff labels and details</h2><p>On the interactive guide, hover or focus a debuff label to read its mitigation note. Expand mechanic details to view available examples. These examples illustrate the entry; a single screenshot or phrase does not establish every condition under which an ability occurs.</p>
<h2>Help improve an entry</h2><p>If a description conflicts with play, report the observed behavior through the <a href="/contact/">contact page</a>. Separate what you saw from what you inferred, and include the exact callout when possible.</p>`)

await page('/privacy/', 'Privacy policy', 'Storage, hosting, analytics, and planned advertising disclosures for Outlands Cheat Sheet.', `
<p class="note">Updated October 8, 2026.</p><p>This policy describes the site at www.outlandscheatsheet.com. For privacy questions, use the contact route on our <a href="/contact/">contact page</a>.</p>
<h2>Preferences and search</h2><p>The interactive guide stores your selected encounter type, sort order, and display mode in your browser's local storage. Search text is processed in the page and is not submitted to a site search server. You can remove saved preferences by clearing this site's browser storage. The site does not require a visitor account or provide a file-upload form.</p>
<h2>Hosting and analytics</h2><p>The site is hosted on GitHub Pages and delivered through Cloudflare. These providers process request information, such as IP addresses and browser or request details, to deliver and protect the site. The home page uses Cloudflare Web Analytics to measure visits and performance. See <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare's privacy policy</a> and <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub's privacy statement</a> for their practices.</p>
<h2>External fonts and links</h2><p>The home page requests fonts from Google Fonts, which receives the network information needed to serve those files. Links to the Outlands wiki, Discord, and other external services take you to independently operated sites with their own privacy policies. Information you choose to post in Discord is handled by Discord and the community receiving it.</p>
<h2>Advertising</h2><p>We are preparing to use Google AdSense. This version of the site contains an account-verification meta tag and ads.txt, but does not load Google's advertising script or request ads. When advertising is enabled, Google and third-party advertising vendors may place or read cookies, use web beacons, and process IP addresses or other identifiers for ad delivery, measurement, fraud prevention, and, where permitted, personalized advertising.</p>
<p>Google's advertising cookies can allow Google and its partners to personalize ads using prior visits to this site and other websites. Read <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites using its services</a>. You can manage personalization through <a href="https://myadcenter.google.com/">Google My Ad Center</a>, and participating vendors' choices through <a href="https://optout.aboutads.info/">YourAdChoices</a>. These choices may be specific to your browser or account and do not necessarily stop all advertising.</p>
<h2>Consent and choices</h2><p>Before enabling ads, we will configure the required consent messages and applicable regional privacy choices. Where consent is required, the advertising setup must respect your selection. You may also use browser controls to manage cookies and local storage. Disabling storage can prevent preferences from being remembered.</p>
<h2>Requests and updates</h2><p>Contact the maintainer through the contact page to ask about site-managed personal information or raise a privacy concern. Information held independently by a hosting, analytics, or advertising provider is also subject to that provider's request process. We will update this policy when the site's practices change.</p>`)

await page('/encounters/', 'All encounter guides', 'Browse boss and miniboss locations, mechanics, and field notes.', `<p>Choose an encounter to read its mechanics and evidence in a dedicated page. The <a href="/">interactive index</a> provides filters and compact view.</p><ul>${bosses.map((boss) => `<li><a href="/encounters/${slug(boss.name)}/">${escape(boss.name)}</a> — ${escape(boss.location)} · ${escape(boss.type)}</li>`).join('')}</ul>`)

for (const boss of bosses) {
  await page(`/encounters/${slug(boss.name)}/`, boss.name, `${boss.name}: ${boss.type} in ${boss.location}. ${boss.summary}`, `
<p class="note">${escape(boss.type)} · ${escape(boss.location)} · Slayer: ${escape(boss.slayer)} · ${escape(boss.role)}</p>
${boss.image ? `<img class="boss-image" src="${escape(boss.image)}" alt="${escape(boss.name)}" loading="lazy">` : ''}<p>${escape(boss.summary)}</p>
<h2>Encounter mechanics</h2><p>Verified means a matching callout was recorded in the reviewed journal evidence. It does not confirm damage, timing, effects, or the interpretation of that callout. <a href="/about/">Read our evidence methodology.</a></p>
${boss.abilities.length ? boss.abilities.map((item) => `<article><h3>${escape(item.name)}</h3><p class="note">${escape(item.verification)}${item.action ? ` · ${escape(item.action)}` : ''}</p>${item.callouts.map((entry) => `<blockquote>${escape(entry.phrase)}</blockquote>`).join('')}${!item.callouts.length && item.callout ? `<blockquote>Prior callout (unverified): ${escape(item.callout)}</blockquote>` : ''}<p>${escape(item.text)}</p>${item.detail ? `<p>${escape(item.detail)}</p>` : ''}</article>`).join('') : '<p>A dependable unique move list is not yet established in this reference.</p>'}
<h2>Field notes</h2><ul>${boss.tips.map((tip) => `<li>${escape(tip)}</li>`).join('')}</ul><p><a href="/contact/">Report a correction</a> with the behavior and evidence observed.</p>
<h2>Source references</h2><ul>${sources.map((source) => `<li><a href="${escape(source.url)}">${escape(source.label)}</a></li>`).join('')}</ul>`)
}

await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>\n`)
console.log(`Rendered homepage and ${paths.length - 1} content pages. Ad serving is disabled.`)
