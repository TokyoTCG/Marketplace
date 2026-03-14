#!/bin/bash
# Run from project root: bash check_dupes.sh

node << 'NODESCRIPT'
const fs = require('fs');
const src = fs.readFileSync('lib/cardData.ts', 'utf8');

// Extract every card entry
const entries = [...src.matchAll(/\{ slug: '([^']+)'[^\n]+\}/g)];
console.log(`Total entries: ${entries.length}`);

// Find dupes by set+number
const seen = new Map();
const dupes = [];
for (const entry of entries) {
  const setMatch = entry[0].match(/set: '([^']+)'/);
  const numMatch = entry[0].match(/number: '([^']+)'/);
  const slug = entry[1];
  if (!setMatch || !numMatch) continue;
  const key = `${setMatch[1].toLowerCase()}|${numMatch[1]}`;
  if (seen.has(key)) {
    dupes.push(`DUPE: ${slug} (${setMatch[1]} ${numMatch[1]}) conflicts with ${seen.get(key)}`);
  } else {
    seen.set(key, slug);
  }
}

console.log(`\nDuplicates by set+number: ${dupes.length}`);
dupes.forEach(d => console.log(' ', d));

// Also check raw slug dupes
const slugs = entries.map(e => e[1]);
const slugSeen = new Set();
const slugDupes = [];
for (const s of slugs) {
  if (slugSeen.has(s)) slugDupes.push(s);
  slugSeen.add(s);
}
console.log(`\nExact slug duplicates: ${slugDupes.length}`);
slugDupes.forEach(s => console.log(' ', s));

// Show dedenne specifically
const dedenne = entries.filter(e => e[1].includes('dedenne'));
console.log('\nDedenne entries:', dedenne.map(e => e[1]));
const talonflame = entries.filter(e => e[1].includes('talonflame'));
console.log('Talonflame entries:', talonflame.map(e => e[1]));
NODESCRIPT
