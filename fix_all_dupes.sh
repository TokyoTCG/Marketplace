#!/bin/bash
# Run from project root: bash fix_all_dupes.sh

node << 'NODESCRIPT'
const fs = require('fs');
let src = fs.readFileSync('lib/cardData.ts', 'utf8');

// Extract every card entry as a block
const entries = [...src.matchAll(/\{ slug: '[^']+',.*?\},/gs)];
console.log(`Total entries before: ${entries.length}`);

// Deduplicate by set+number (the true unique key), keeping FIRST occurrence
const seen = new Map(); // "set|number" -> true
const dupes = [];

for (const entry of entries) {
  const slugMatch = entry[0].match(/slug: '([^']+)'/);
  const setMatch = entry[0].match(/set: '([^']+)'/);
  const numMatch = entry[0].match(/number: '([^']+)'/);
  if (!slugMatch || !setMatch || !numMatch) continue;

  const key = `${setMatch[1].toLowerCase()}|${numMatch[1]}`;
  if (seen.has(key)) {
    dupes.push({ slug: slugMatch[1], set: setMatch[1], number: numMatch[1] });
  } else {
    seen.set(key, true);
  }
}

console.log(`Duplicates found: ${dupes.length}`);
dupes.forEach(d => console.log(`  - ${d.slug} (${d.set} ${d.number})`));

// Remove duplicate entries — for each duplicate slug, remove that specific entry
for (const dupe of dupes) {
  const escaped = dupe.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`  \\{ slug: '${escaped}'[\\s\\S]*?\\},\\n`, '');
  src = src.replace(re, '');
}

// Clean up extra blank lines
src = src.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync('lib/cardData.ts', src);

// Verify
const remaining = [...src.matchAll(/slug: '[^']+'/g)].length;
console.log(`Total entries after: ${remaining}`);
console.log(`✅ Removed ${dupes.length} duplicates`);
NODESCRIPT
