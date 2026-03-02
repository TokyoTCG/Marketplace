'use client'
import { useState } from 'react'

const CARD_IMAGES: Record<string, { src: string; set: string }> = {
  "Aurorus": { src: "/cards/aurorus-nullifying-zero.webp", set: "Nullifying Zero" },
  "Beautifly": { src: "/cards/beautifly-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Budew": { src: "/cards/budew-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Canari": { src: "/cards/canari-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Charcadet": { src: "/cards/charcadet-inferno-x.webp", set: "Inferno X" },
  "Clefairy": { src: "/cards/clefairy-nullifying-zero.webp", set: "Nullifying Zero" },
  "Cynthia's Spiritomb": { src: "/cards/cynthias-spiritomb-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Dedenne": { src: "/cards/dedenne-nullifying-zero.webp", set: "Nullifying Zero" },
  "Dewgong": { src: "/cards/dewgong-inferno-x.webp", set: "Inferno X" },
  "Doublade": { src: "/cards/doublade-nullifying-zero.webp", set: "Nullifying Zero" },
  "Drakloak": { src: "/cards/drakloak-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Drapion": { src: "/cards/drapion-nullifying-zero.webp", set: "Nullifying Zero" },
  "Dreepy": { src: "/cards/dreepy-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Dustox": { src: "/cards/dustox-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Espurr": { src: "/cards/espurr-nullifying-zero.webp", set: "Nullifying Zero" },
  "Ethan's Magcargo": { src: "/cards/ethans-magcargo-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Fan Rotom": { src: "/cards/fan-rotom-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Fezandipiti EX": { src: "/cards/fezandipiti-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Galarian Obstagoon": { src: "/cards/galarian-obstagoon-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Heliolisk": { src: "/cards/heliolisk-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Hop's Trevenant": { src: "/cards/hops-trevenant-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Iono's Bellibolt EX": { src: "/cards/ionos-bellibolt-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Iris's Fighting Spirit": { src: "/cards/iriss-fighting-spirit-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Jacinthe": { src: "/cards/jacinthe-nullifying-zero.webp", set: "Nullifying Zero" },
  "Ludicolo": { src: "/cards/ludicolo-inferno-x.webp", set: "Inferno X" },
  "Marnie's Grimmsnarl EX": { src: "/cards/marnies-grimmsnarl-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Medicham": { src: "/cards/medicham-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Clefable EX": { src: "/cards/mega-clefable-ex-nullifying-zero.webp", set: "Nullifying Zero" },
  "Mega Diancie EX": { src: "/cards/mega-diancie-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Dragonite EX": { src: "/cards/mega-dragonite-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Eelektross EX": { src: "/cards/mega-eelektross-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Froslass EX": { src: "/cards/mega-froslass-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Gengar EX": { src: "/cards/mega-gengar-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Hawlucha EX": { src: "/cards/mega-hawlucha-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Scrafty EX": { src: "/cards/mega-scrafty-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Mega Starmie EX": { src: "/cards/mega-starmie-ex-nullifying-zero.webp", set: "Nullifying Zero" },
  "Mega Zygarde EX": { src: "/cards/mega-zygarde-ex-nullifying-zero.webp", set: "Nullifying Zero" },
  "Meowth EX": { src: "/cards/meowth-ex-nullifying-zero.webp", set: "Nullifying Zero" },
  "Misdreavus": { src: "/cards/misdreavus-mega-dream-ex.webp", set: "Mega Dream EX" },
  "N's Zekrom": { src: "/cards/ns-zekrom-mega-dream-ex.webp", set: "Mega Dream EX" },
  "N's Zoroark EX": { src: "/cards/ns-zoroark-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Numel": { src: "/cards/numel-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Nymble": { src: "/cards/nymble-inferno-x.webp", set: "Inferno X" },
  "Pikachu EX": { src: "/cards/pikachu-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Piplup": { src: "/cards/piplup-inferno-x.webp", set: "Inferno X" },
  "Probopass": { src: "/cards/probopass-nullifying-zero.webp", set: "Nullifying Zero" },
  "Psyduck": { src: "/cards/psyduck-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Raticate": { src: "/cards/raticate-nullifying-zero.webp", set: "Nullifying Zero" },
  "Rosa's Encouragement": { src: "/cards/rosas-encouragement-nullifying-zero.webp", set: "Nullifying Zero" },
  "Rowlet": { src: "/cards/rowlet-nullifying-zero.webp", set: "Nullifying Zero" },
  "Snorunt": { src: "/cards/snorunt-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Spewpa": { src: "/cards/spewpa-nullifying-zero.webp", set: "Nullifying Zero" },
  "Steven's Metagross EX": { src: "/cards/stevens-metagross-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Surfer": { src: "/cards/surfer-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Talonflame": { src: "/cards/talonflame-nullifying-zero.webp", set: "Nullifying Zero" },
  "Team Rocket's Dugtrio": { src: "/cards/team-rockets-dugtrio-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Team Rocket's Mewtwo EX": { src: "/cards/team-rockets-mewtwo-ex-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Team Rocket's Mimikyu": { src: "/cards/team-rockets-mimikyu-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Togekiss": { src: "/cards/togekiss-mega-dream-ex.webp", set: "Mega Dream EX" },
  "Tyrunt": { src: "/cards/tyrunt-nullifying-zero.webp", set: "Nullifying Zero" },
  "Milotic": { src: "/pokemon-cards/milotic-incandescent-arcana-070-068.jpg", set: "Incandescent Arcana" },
  "Jynx": { src: "/pokemon-cards/jynx-incandescent-arcana-071-068.jpg", set: "Incandescent Arcana" },
  "Gardevoir": { src: "/pokemon-cards/gardevoir-incandescent-arcana-072-068.jpg", set: "Incandescent Arcana" },
  "Smeargle": { src: "/pokemon-cards/smeargle-incandescent-arcana-073-068.jpg", set: "Incandescent Arcana" },
  "Altaria": { src: "/pokemon-cards/altaria-incandescent-arcana-074-068.jpg", set: "Incandescent Arcana" },
  "Parasect": { src: "/pokemon-cards/parasect-dark-phantasma-072-071.jpg", set: "Dark Phantasma" },
  "Pikachu": { src: "/pokemon-cards/pikachu-dark-phantasma-073-071.jpg", set: "Dark Phantasma" },
  "Gengar": { src: "/pokemon-cards/gengar-dark-phantasma-074-071.jpg", set: "Dark Phantasma" },
  "Hisuian Arcanine": { src: "/pokemon-cards/hisuian-arcanine-dark-phantasma-075-071.jpg", set: "Dark Phantasma" },
  "Spiritomb": { src: "/pokemon-cards/spiritomb-dark-phantasma-076-071.jpg", set: "Dark Phantasma" },
  "Snorlax": { src: "/pokemon-cards/snorlax-dark-phantasma-077-071.jpg", set: "Dark Phantasma" },
}

const SET_COLORS: Record<string, string> = {
  "Nullifying Zero": "#a67abf",
  "Mega Dream EX": "#bf7a7a",
  "Inferno X": "#bf9e7a",
  "Incandescent Arcana": "#a67abf",
  "Dark Phantasma": "#a67abf",
}

export default function Browse() {
  const [search, setSearch] = useState('')

  const allCards = Object.entries(CARD_IMAGES)
    .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b))

  const bySet: Record<string, [string, { src: string; set: string }][]> = {}
  for (const entry of allCards) {
    const set = entry[1].set
    if (!bySet[set]) bySet[set] = []
    bySet[set].push(entry)
  }

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <header style={{ backgroundColor: '#1f1f21', borderBottom: '1px solid #2e2e31', padding: '0 32px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <a href="/"><img src="/logo.png" alt="Tokyo TCG" style={{ height: '64px', width: 'auto' }} /></a>
          <nav style={{ display: 'flex', gap: '28px', fontSize: '13px', fontWeight: '500' }}>
            <a href="/choose" style={{ color: '#a67abf', textDecoration: 'none', borderBottom: '2px solid #a67abf', paddingBottom: '4px' }}>Kopen</a>
            <a href="/sell-choose" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Verkopen</a>
            <a href="/account" style={{ color: '#aaaaaa', textDecoration: 'none' }}>Account</a>
          </nav>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px', display: 'flex', gap: '28px' }}>
        <aside style={{ width: '180px', flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: '20px', backgroundColor: '#1f1f21', borderRadius: '8px', border: '1px solid #2e2e31', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #2e2e31', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#aaaaaa' }}>SERIES</div>
            <div style={{ padding: '6px' }}>
              {Object.keys(SET_COLORS).map(set => (
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

          {Object.entries(bySet).map(([set, cards]) => (
            <div key={set} id={set.replace(/[^a-z0-9]/gi, '-').toLowerCase()} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #2e2e31' }}>{set}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                {cards.map(([name, { src, set: cardSet }]) => (
                  <div key={name} style={{ borderRadius: '12px', backgroundColor: '#1f1f21', border: '1px solid #2e2e31', overflow: 'hidden' }}>
                    <div style={{ padding: '6px' }}>
                      <img
                        src={src}
                        alt={name}
                        style={{ width: '100%', display: 'block', borderRadius: '8px' }}
                      />
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{name}</div>
                      <div style={{ fontSize: '11px', color: SET_COLORS[cardSet], marginTop: '4px' }}>{cardSet}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
