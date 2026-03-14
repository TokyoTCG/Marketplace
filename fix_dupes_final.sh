#!/bin/bash
# Run from project root: bash fix_dupes_final.sh

node << 'NODESCRIPT'
const fs = require('fs');
let src = fs.readFileSync('lib/cardData.ts', 'utf8');

const entries = [...src.matchAll(/\{ slug: '([^']+)'[^\n]+\},/g)];
console.log(`Total before: ${entries.length}`);

// Slugs that end in a number pattern like -085-080 are the "good" ones
// Slugs without a trailing -NNN-NNN are the old duplicates — but only remove
// them if a numbered version of the same card already exists

// Build a set of "base slugs" that have a numbered version
const numberedSlugs = new Set();
for (const e of entries) {
  const slug = e[1];
  // Match slugs ending in -NNN-NNN (e.g. -085-080 or -240-193)
  if (/\-\d{3}-\d{3}$/.test(slug)) {
    // Strip the trailing -NNN-NNN to get the base
    const base = slug.replace(/-\d{3}-\d{3}$/, '');
    numberedSlugs.add(base);
  }
  // Also match slugs ending in just -NNN (e.g. -240)
  if (/\-\d{3}$/.test(slug) && !/\-\d{3}-\d{3}$/.test(slug)) {
    const base = slug.replace(/-\d{3}$/, '');
    numberedSlugs.add(base);
  }
}

// Now find entries whose slug is a base (no number suffix) AND has a numbered version
const toRemove = [];
for (const e of entries) {
  const slug = e[1];
  const hasNumber = /\-\d{3}(-\d{3})?$/.test(slug);
  if (!hasNumber && numberedSlugs.has(slug)) {
    toRemove.push(slug);
  }
}

console.log(`Slugs to remove (old unnumbered duplicates): ${toRemove.length}`);
toRemove.forEach(s => console.log(' -', s));

for (const slug of toRemove) {
  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`  \\{ slug: '${escaped}'[^\\n]+\\},\\n`);
  src = src.replace(re, '');
}

src = src.replace(/\n{3,}/g, '\n\n');
fs.writeFileSync('lib/cardData.ts', src);

const after = [...src.matchAll(/slug: '[^']+'/g)].length;
console.log(`Total after: ${after}`);
console.log(`✅ Removed ${toRemove.length} old duplicate entries`);
NODESCRIPT
