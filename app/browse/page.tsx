'use client';
import { cardData } from '@/lib/cardData';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function getCardNumber(number: string): string {
  const match = number.match(/(\d+\/\d+)/);
  return match ? match[1] : number;
}

const SET_COLORS: Record<string, string> = {
  'Nullifying Zero': '#a67abf',
  'Mega Dream EX': '#bf7a7a',
  'Inferno X': '#bf9e7a',
  'Tag Bolt': '#bf8d7a',
  'Tag All Stars': '#7abfbf',
  'Eevee Heroes': '#7abf7a',
  'Lost Abyss': '#aaaaaa',
  'GX Battle Boost': '#bf9a7a',
  'Paradigm Trigger': '#7a7abf',
  'Blue Sky Stream': '#7ab3bf',
  'Miracle Twin': '#bf7a9b',
  'Night Unison': '#7abf9b',
  'Mega Brave': '#a67abf',
  'Shining Legends': '#bfbf7a',
  'Mega Symphonia': '#a67abf',
  'Shield': '#7a9abf',
  'Shiny Treasure ex': '#bfb07a',
  'Terastal Festival ex': '#bf9abf',
  'Sky Legend': '#bfb77a',
  'Remix Bout': '#7abf9a',
  'Fusion Arts': '#bf7abf',
  'Collection Moon': '#7a9abf',
  'Clay Burst': '#aa9b7a',
  'The Glory of Team Rocket': '#bf7a7a',
  'Dream League': '#bf7abf',
  'Pokemon Card 151': '#bf7a7a',
  'Double Blaze': '#bf7a7a',
  'Jet-Black Spirit': '#7a7abf',
  'Black Bolt': '#7a7abf',
  'To Have Seen the Battle Rainbow': '#7abfbf',
  'GG End': '#9bbf7a',
  'White Flare': '#bfbf9a',
  'GX Ultra Shiny': '#7a9bbf',
  'Matchless Fighters': '#bf9a7a',
  'Darkness that Consumes Light': '#7a7abf',
  'Super Electric Breaker': '#bfbf7a',
  'Crimson Haze': '#bf7a7a',
};

export default function Browse() {
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showSeries, setShowSeries] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const allCards = cardData.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase())
  );

  const bySet: Record<string, typeof cardData> = {};
  for (const card of allCards) {
    if (!bySet[card.set]) bySet[card.set] = [];
    bySet[card.set].push(card);
  }

  const sets = Array.from(new Set(cardData.map(c => c.set)));

  const slugify = (s: string) => s.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700', color: '#ffffff' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px', display: 'flex', gap: '28px' }}>

        {!isMobile && (
          <aside style={{ width: '180px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '20px', backgroundColor: '#1f1f21', borderRadius: '8px', border: '1px solid #2e2e31', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #2e2e31', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#aaaaaa' }}>
                SERIES
              </div>
              <div style={{ padding: '6px' }}>
                {sets.map(set => (
                  <a key={set} href={'#' + slugify(set)} style={{ display: 'block', padding: '6px 8px', borderRadius: '4px', color: '#aaaaaa', textDecoration: 'none', fontSize: '12px' }}>
                    {set}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        )}

        <main style={{ flex: 1, minWidth: 0 }}>
          {isMobile && (
            <div style={{ marginBottom: '12px' }}>
              <button onClick={() => setShowSeries(s => !s)}
                style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#aaa', cursor: 'pointer', marginBottom: '8px' }}>
                Series {showSeries ? '▲' : '▼'}
              </button>
              {showSeries && (
                <div style={{ backgroundColor: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '8px', padding: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sets.map(set => (
                    <a key={set} href={'#' + slugify(set)} onClick={() => setShowSeries(false)}
                      style={{ color: '#aaa', textDecoration: 'none', fontSize: '12px', padding: '4px 8px', background: '#2b2b2e', borderRadius: '4px' }}>
                      {set}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          <input
            placeholder="Zoek een Pokemon..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: isMobile ? '100%' : '400px', backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '10px 16px', color: '#ffffff', fontSize: '14px', outline: 'none', marginBottom: '24px', boxSizing: 'border-box' }}
          />

          {sets.filter(set => bySet[set]).map(set => (
            <div key={set} id={slugify(set)} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #2e2e31' }}>
                {set}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {bySet[set].map(card => (
                  <Link key={card.slug} href={'/cards/' + card.slug} style={{ textDecoration: 'none' }}>
                    <div style={{ borderRadius: '12px', backgroundColor: '#1f1f21', border: '1px solid #2e2e31', overflow: 'hidden', cursor: 'pointer' }}>
                      <div style={{ padding: '6px' }}>
                        <img src={card.image} alt={card.name} style={{ width: '100%', display: 'block', borderRadius: '8px' }} />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{card.name}</div>
                        <div style={{ fontSize: '11px', color: SET_COLORS[card.set] || '#aaa', marginTop: '4px' }}>{card.set}</div>
                        <div style={{ fontSize: '10px', color: '#666', marginTop: '6px' }}>{getCardNumber(card.number)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
