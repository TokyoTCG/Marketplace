'use client'
import { cardData } from '@/lib/cardData'
import SiteHeader from '@/components/SiteHeader'
import Link from 'next/link'
import { useState } from 'react'

const SET_COLORS: Record<string, string> = {
  "Nullifying Zero": "#a67abf",
  "Mega Dream EX": "#bf7a7a",
  "Inferno X": "#bf9e7a",
  "Mega Brave": "#a67abf",
  "Mega Symphonia": "#a67abf",
  "Tag All Stars": "#7abfbf",
  "GX Ultra Shiny": "#7a9bbf",
  "Dream League": "#bf7abf",
  "Miracle Twin": "#bf7a9b",
  "Night Unison": "#7abf9b",
  "GG End": "#9bbf7a",
  "Sky Legend": "#bfb77a",
  "Tag Bolt": "#bf8d7a",
  "Alter Genesis": "#8d7abf",
  "Full Metal Wall": "#7a8dbf",
  "Fairy Rise": "#bf7ab3",
  "Eevee Heroes": "#7abf7a",
  "Shiny Star V": "#bfaf7a",
  "Star Birth": "#bf7a7a",
  "Single Strike Master": "#bf7a7a",
  "Silver Lance": "#7aaabf",
  "Skyscraping Perfection": "#7abfbf",
  "Amazing Volt Tackle": "#bfbf7a",
  "Matchless Fighters": "#bf9a7a",
  "Triplet Beat": "#9abf7a",
  "Fusion Arts": "#bf7abf",
  "Paradigm Trigger": "#7a7abf",
  "Blue Sky Stream": "#7ab3bf",
  "Scarlet EX": "#bf7a7a",
  "Violet EX": "#9a7abf",
  "Shiny Treasure EX": "#bfb07a",
  "Clay Burst": "#aa9b7a",
  "Crimson Haze": "#bf7a7a",
  "Ruler of the Black Flame": "#bf7a7a",
  "Mask of Change": "#7abf9a",
  "Terastal Festival EX": "#bf9abf",
  "Paradise Dragona": "#7abfb0",
  "VSTAR Universe": "#7a9abf",
  "Pokémon Card 151": "#bf7a7a",
  "Black Bolt": "#7a7abf",
  "White Flare": "#bfbf9a",
  "Hot Air Arena": "#bf9a7a",
  "Battle Partners": "#bf7abf",
  "Mega Dream EX": "#bf7a7a",
  "Super Electric Breaker": "#bfbf7a",
  "The Glory of Team Rocket": "#bf7a7a",
  "Darkness that Consumes Light": "#7a7abf",
  "To Have Seen the Battle Rainbow": "#7abfbf",
  "GX Battle Boost": "#bf9a7a",
  "Shining Legends": "#bfbf7a",
  "Collection Sun": "#bf9a7a",
  "Collection Moon": "#7a9abf",
  "Shield": "#7a9abf",
  "Jet-Black Spirit": "#7a7abf",
  "Double Blaze": "#bf7a7a",
  "Remix Bout": "#7abf9a",
}

function getSetColor(set: string): string {
  return SET_COLORS[set] || "#aaaaaa"
}

export default function Browse() {
  const [search, setSearch] = useState('')

  const filtered = cardData.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.set.toLowerCase().includes(search.toLowerCase())
  )

  const bySet: Record<string, typeof cardData> = {}
  for (const card of filtered) {
    if (!bySet[card.set]) bySet[card.set] = []
    bySet[card.set].push(card)
  }

  const sets = Object.keys(bySet)

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px', display: 'flex', gap: '28px' }}>
        <aside style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '20px', backgroundColor: '#1f1f21', borderRadius: '8px', border: '1px solid #2e2e31', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2e2e31', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#aaaaaa' }}>SERIES</div>
            <div style={{ padding: '6px' }}>
              {sets.map(set => (
                <a key={set} href={"#" + set.replace(/[^a-z0-9]/gi, '-').toLowerCase()}
                  style={{ display: 'block', padding: '6px 8px', borderRadius: '4px', color: '#aaaaaa', textDecoration: 'none', fontSize: '12px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#aaaaaa')}>
                  {set}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <input
            placeholder="Zoek een Pokemon..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px', backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '10px 16px', color: '#ffffff', fontSize: '14px', outline: 'none', marginBottom: '32px', boxSizing: 'border-box' }}
          />

          {sets.map(set => (
            <div key={set} id={set.replace(/[^a-z0-9]/gi, '-').toLowerCase()} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #2e2e31' }}>{set}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {bySet[set].map(card => (
                  <Link key={card.slug} href={'/cards/' + card.slug} style={{ textDecoration: 'none' }}>
                    <div style={{ borderRadius: '12px', backgroundColor: '#1f1f21', border: '1px solid #2e2e31', overflow: 'hidden', cursor: 'pointer' }}>
                      <div style={{ padding: '6px' }}>
                        <img
                          src={card.image}
                          alt={card.name}
                          style={{ width: '100%', display: 'block', borderRadius: '8px' }}
                        />
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{card.name}</div>
                        <div style={{ fontSize: '11px', color: getSetColor(card.set), marginTop: '4px' }}>{card.set}</div>
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
  )
}
