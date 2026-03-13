#!/bin/bash
# Run from your project root
node << 'NODESCRIPT'
const fs = require('fs');
const file = 'app/browse/page.tsx';
let src = fs.readFileSync(file, 'utf8');

const inner = `<div style={{ borderRadius: '12px', backgroundColor: '#1f1f21', border: '1px solid #2e2e31', overflow: 'hidden', cursor: card.noLink ? 'default' : 'pointer' }}>
                      <div style={{ padding: '6px' }}>
                        <img src={card.image} alt={card.name} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{card.name}</div>
                        <div style={{ fontSize: '11px', color: SET_COLORS[card.set] || '#aaa', marginTop: '4px' }}>{card.set}</div>
                        <div style={{ fontSize: '10px', color: '#666', marginTop: '6px' }}>{getCardNumber(card.number)}</div>
                      </div>
                    </div>`;

// Replace everything between .map( and the closing ))} with correct JSX
src = src.replace(
  /\{bySet\[set\]\.map\(card => \([\s\S]*?\)\)}/,
  `{bySet[set].map(card => (
                  card.noLink ? (
                    <div key={card.slug}>${inner}</div>
                  ) : (
                    <Link key={card.slug} href={'/cards/' + card.slug} style={{ textDecoration: 'none' }}>${inner}</Link>
                  )
                ))}`
);

fs.writeFileSync(file, src);
console.log('✅ browse/page.tsx fixed');
NODESCRIPT
