import { useState, useEffect } from 'react'

export default function CardSearch({ onSelect }: { onSelect: (card: any) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      // API disconnected — will be reconnected later
      setResults([])
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div style={{ position: 'relative' }}>
      <input
        placeholder="Zoek kaart..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '6px', padding: '10px 14px', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
      />
      {loading && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '6px', padding: '12px', textAlign: 'center', color: '#aaaaaa', fontSize: '13px', marginTop: '4px', zIndex: 100 }}>
          Zoeken...
        </div>
      )}
      {!loading && results.length > 0 && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '6px', maxHeight: '300px', overflowY: 'auto', zIndex: 100, marginTop: '4px', listStyle: 'none', padding: 0 }}>
          {results.map(card => (
            <li key={card.id} onClick={() => { onSelect(card); setResults([]) }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #3a3a3d' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3a3a3d')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <div style={{ width: '36px', height: '50px', backgroundColor: '#3a3a3d', borderRadius: '3px', flexShrink: 0, overflow: 'hidden' }}>
                {card.image && <img src={`${card.image}/low.png`} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="eager" />}
              </div>
              <span style={{ fontSize: '13px', color: '#ffffff' }}>{card.name} — {card.localId}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
