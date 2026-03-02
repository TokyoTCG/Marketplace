'use client'
import SiteHeader from '@/components/SiteHeader'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

const nameCache: Record<number, string> = {}

async function getEnglishName(dexId: number): Promise<string> {
  if (nameCache[dexId]) return nameCache[dexId]
  try {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${dexId}`)
    if (!r.ok) return ''
    const data = await r.json()
    const en = data.names.find((n: any) => n.language.name === 'en')
    const name = en?.name || ''
    nameCache[dexId] = name
    return name
  } catch {
    return ''
  }
}

interface CardWithName {
  id: string
  localId: string
  name: string
  image?: string
  englishName?: string
}

export default function SetPage() {
  const params = useParams()
  const setId = decodeURIComponent(params.set as string)
  const [setData, setSetData] = useState<any>(null)
  const [cards, setCards] = useState<CardWithName[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!setId) return
    setLoading(true)
    setError(false)

    const load = async () => {
      try {
        // 1. Fetch set data
        const setRes = await fetch(`https://api.tcgdex.net/v2/ja/sets/${setId}`)
        if (!setRes.ok) throw new Error('Not found')
        const setJson = await setRes.json()
        setSetData(setJson)

        const rawCards: any[] = setJson.cards || []
        if (rawCards.length === 0) {
          setCards([])
          setLoading(false)
          return
        }

        // 2. Fetch full card details for all cards in parallel
        const cardDetails = await Promise.all(
          rawCards.map(async (card: any) => {
            try {
              const r = await fetch(`https://api.tcgdex.net/v2/ja/cards/${card.id}`)
              if (!r.ok) return { ...card }
              return await r.json()
            } catch {
              return { ...card }
            }
          })
        )

        // 3. Get unique dexIds
        const dexIds = [...new Set(
          cardDetails
            .flatMap((c: any) => c.dexId || [])
            .filter(Boolean)
        )] as number[]

        // 4. Fetch all English names in parallel
        await Promise.all(dexIds.map(id => getEnglishName(id)))

        // 5. Build final card list with English names
        const finalCards: CardWithName[] = cardDetails.map((card: any) => ({
          id: card.id,
          localId: card.localId,
          name: card.name,
          image: card.image,
          englishName: card.dexId?.[0] ? nameCache[card.dexId[0]] : undefined,
        }))

        setCards(finalCards)
        setLoading(false)
      } catch {
        setError(true)
        setLoading(false)
      }
    }

    load()
  }, [setId])

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <a href="/" style={{ color: '#aaaaaa', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#aaaaaa')}>
          ← Alle sets
        </a>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px', color: '#aaaaaa' }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>Kaarten laden...</div>
            <div style={{ fontSize: '12px', color: '#555' }}>Engelse namen worden opgehaald</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
            <div style={{ color: '#aaaaaa', fontSize: '14px' }}>Geen kaartdata beschikbaar voor deze set.</div>
          </div>
        )}

        {!loading && !error && setData && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', padding: '24px', backgroundColor: '#1f1f21', borderRadius: '12px', border: '1px solid #2e2e31' }}>
              {setData.logo && (
                <img src={setData.logo + '.png'} alt={setData.name} style={{ height: '80px', objectFit: 'contain' }} />
              )}
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '6px' }}>{setData.name}</h1>
                <div style={{ color: '#aaaaaa', fontSize: '13px' }}>
                  {setData.cardCount?.total || cards.length} kaarten
                  {setData.releaseDate && <span> · {setData.releaseDate}</span>}
                  <span style={{ marginLeft: '8px', color: '#555' }}>{setId}</span>
                </div>
              </div>
            </div>

            {cards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#aaaaaa' }}>Geen kaarten gevonden.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {cards.map((card) => {
                  const displayName = card.englishName || card.name
                  return (
                    <div key={card.id}
                      style={{ backgroundColor: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s, transform 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#a67abf'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2e31'; e.currentTarget.style.transform = 'translateY(0)' }}>
                      <div style={{ aspectRatio: '5/7', backgroundColor: '#2b2b2e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {card.image
                          ? <img src={card.image + '/low.png'} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ fontSize: '32px' }}>🃏</div>
                        }
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                        <div style={{ fontSize: '10px', color: '#aaaaaa', marginTop: '2px' }}>#{card.localId}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
