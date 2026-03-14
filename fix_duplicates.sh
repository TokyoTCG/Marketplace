#!/bin/bash
# Run from your project root: bash fix_duplicates.sh

node << 'NODESCRIPT'
const fs = require('fs');
let src = fs.readFileSync('lib/cardData.ts', 'utf8');

// Extract all card entries
const matches = [...src.matchAll(/\{ slug: '([^']+)'[^\}]+\},/g)];
console.log(`Total entries: ${matches.length}`);

// Find duplicates by slug (case-insensitive)
const seen = new Map(); // lowercase slug -> first occurrence
const duplicateSlugs = new Set();

for (const m of matches) {
  const slug = m[1].toLowerCase();
  if (seen.has(slug)) {
    duplicateSlugs.add(slug);
  } else {
    seen.set(slug, m[1]);
  }
}

console.log(`Duplicate slugs found: ${duplicateSlugs.size}`);
duplicateSlugs.forEach(s => console.log(' -', s));

// Also find duplicate set names (same set shown twice due to casing)
const sets = new Set();
const setMatches = [...src.matchAll(/set: '([^']+)'/g)];
const setCounts = {};
for (const m of setMatches) {
  const key = m[1].toLowerCase();
  setCounts[key] = setCounts[key] || new Set();
  setCounts[key].add(m[1]);
}
for (const [key, vals] of Object.entries(setCounts)) {
  if (vals.size > 1) console.log(`Set name conflict: ${[...vals].join(' vs ')}`);
}

// Remove duplicate entries — keep the FIRST occurrence of each slug
const seen2 = new Set();
let newSrc = src.replace(/\{ slug: '([^']+)'[^\}]+\},/g, (match, slug) => {
  const key = slug.toLowerCase();
  if (seen2.has(key)) {
    return ''; // remove duplicate
  }
  seen2.add(key);
  return match;
});

// Clean up any blank lines left behind
newSrc = newSrc.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync('lib/cardData.ts', newSrc);
console.log(`✅ Done! Kept ${seen2.size} unique cards, removed ${matches.length - seen2.size} duplicates`);
NODESCRIPT
