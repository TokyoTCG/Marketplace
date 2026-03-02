'use client'
import SiteHeader from '@/components/SiteHeader'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const CONDITIONS = ['Alle', 'S', 'A', 'B', 'C', 'D']
const SORT_OPTIONS = ['Nieuwste eerst', 'Prijs: laag-hoog', 'Prijs: hoog-laag']

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [condition, setCondition] = useState('Alle')
  const [sort, setSort] = useState('Nieuwste eerst')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_sold', false)
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      if (data) { setListings(data); setFiltered(data) }
      setLoading(false)
    }
    fetchListings()
  }, [])

  useEffect(() => {
    let result = [...listings]
    if (search) result = result.filter(l => l.title?.toLowerCase().includes(search.toLowerCase()) || l.set_name?.toLowerCase().includes(search.toLowerCase()))
    if (condition !== 'Alle') result = result.filter(l => l.condition === condition)
    if (maxPrice) result = result.filter(l => parseFloat(l.price) <= parseFloat(maxPrice))
    if (sort === 'Prijs: laag-hoog') result.sort((a, b) => a.price - b.price)
    else if (sort === 'Prijs: hoog-laag') result.sort((a, b) => b.price - a.price)
    setFiltered(result)
  }, [search, condition, sort, maxPrice, listings])

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px', display: 'flex', gap: '28px' }}>
        <aside style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ backgroundColor: '#1f1f21', borderRadius: '8px', border: '1px solid #2e2e31', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #2e2e31', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', color: '#aaaaaa' }}>FILTERS</div>
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#aaaaaa', marginBottom: '10px' }}>CONDITIE</div>
                {CONDITIONS.map(c => (
                  <div key={c} onClick={() => setCondition(c)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', marginBottom: '2px', backgroundColor: condition === c ? '#2b2b2e' : 'transparent' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${condition === c ? '#a67abf' : '#555'}`, backgroundColor: condition === c ? '#a67abf' : 'transparent', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: condition === c ? '#ffffff' : '#aaaaaa' }}>{c === 'Alle' ? 'Alle condities' : `${c} - ${c === 'S' ? 'Mint' : c === 'A' ? 'Near Mint' : c === 'B' ? 'Excellent' : c === 'C' ? 'Good' : 'Played'}`}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#aaaaaa', marginBottom: '10px' }}>MAX PRIJS</div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaaaaa', fontSize: '13px' }}>€</span>
                  <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="0.00"
                    style={{ width: '100%', backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '4px', padding: '7px 10px 7px 24px', color: '#ffffff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: '#aaaaaa' }}>
              {loading ? 'Laden...' : <span><strong style={{ color: '#ffffff' }}>{filtered.length}</strong> kaarten gevonden</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#aaaaaa' }}>Sorteren:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '4px', color: '#ffffff', padding: '6px 10px', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {error && <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>Fout: {error}</p>}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaaaaa' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
              <p>Geen kaarten gevonden.</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {filtered.map((listing: any) => (
              <div key={listing.id}
                style={{ backgroundColor: '#1f1f21', borderRadius: '8px', border: '1px solid #2e2e31', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#a67abf'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2e31'; e.currentTarget.style.transform = 'translateY(0)' }}>
                {listing.image_url
                  ? <img src={listing.image_url} alt={listing.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#2b2b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '32px' }}>🃏</div>
                }
                <div style={{ padding: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.title || 'Onbekend'}</div>
                  <div style={{ fontSize: '11px', color: '#aaaaaa', marginBottom: '8px' }}>{listing.set_name || '—'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#a67abf' }}>€{listing.price}</div>
                      <div style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>Conditie: {listing.condition}</div>
                    </div>
                    <button style={{ backgroundColor: '#a67abf', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                      KOPEN
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
