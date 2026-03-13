'use client'
import SiteHeader from '@/components/SiteHeader'
import CardPhotoCapture from '@/components/CardPhotoCapture'
import { useState, useMemo, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cardData } from '@/lib/cardData'

const WORKING_CARDS = cardData.map(c => ({ name: c.name, set: c.set, src: c.image, slug: c.slug }))

export default function NewListing() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [condition, setCondition] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [photosConfirmed, setPhotosConfirmed] = useState(false)
  const [fromCamera, setFromCamera] = useState(false)
  const [successSlug, setSuccessSlug] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/listings/new')
    const container = document.getElementById('twinkle-raw')
    if (!container || container.childNodes.length > 0) return
    for (let i = 0; i < 80; i++) {
      const dot = document.createElement('div')
      const size = Math.random() * 2 + 1
      dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:white;border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:twinkle ${Math.random()*3+1}s ease-in-out ${Math.random()*2}s infinite;opacity:0`
      container.appendChild(dot)
    }
  }, [status])

  const suggestions = useMemo(() => {
    if (!searchTerm) return []
    return WORKING_CARDS.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
  }, [searchTerm])

  const handleSelect = (card: any) => {
    setSearchTerm(card.name)
    setSelectedCard(card)
    setShowDropdown(false)
  }

  async function handleSubmit() {
    if (!selectedCard) { setSubmitError('Selecteer eerst een kaart.'); return }
    if (!condition || !price) { setSubmitError('Vul alle verplichte velden in.'); return }
    if (!photosConfirmed || photos.length < 2) { setSubmitError("Maak minimaal 2 foto's (voor- en achterkant)."); return }
    setSubmitting(true)
    setSubmitError('')
    console.log('selectedCard:', JSON.stringify(selectedCard))
    const cardSlug = selectedCard.slug
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardSlug, cardName: selectedCard.name, cardSet: selectedCard.set, condition, price, quantity, notes, photos, graded: false, fromCamera })
    })
    const data = await res.json()
    console.log('API response:', data)
    if (!res.ok) { setSubmitError((data.error || 'Er is iets misgegaan.') + ' [' + res.status + ']'); setSubmitting(false); console.error('Listing error:', data) }
    else { setSuccessSlug('/cards/' + cardSlug) }
  }

  const inputStyle: React.CSSProperties = { width: '100%', backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '12px 16px', color: '#ffffff', fontSize: '14px', outline: 'none', marginTop: '8px', boxSizing: 'border-box' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#aaaaaa', letterSpacing: '1px' }

  if (successSlug) return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '16px', padding: '40px 32px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>Listing aangemaakt!</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '28px', lineHeight: '1.6' }}>Je kaart staat nu live op de marktplaats.</p>
        <button onClick={() => router.push(successSlug)}
          style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', letterSpacing: '1px', marginBottom: '10px' }}>
          BEKIJK LISTING →
        </button>
        <button onClick={() => { setSuccessSlug(''); setSelectedCard(null); setSearchTerm(''); setPhotos([]); setPhotosConfirmed(false); setPrice(''); setCondition(''); }}
          style={{ width: '100%', backgroundColor: 'transparent', color: '#888', border: '1px solid #2e2e31', borderRadius: '8px', padding: '14px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          Nog een listing aanmaken
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' }}>
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } } @media (max-width: 767px) { .listing-form { display: flex; flex-direction: column-reverse; } }`}</style>
      <div id="twinkle-raw" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
          DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
        </div>
        <SiteHeader activePage="verkopen" />
        <main style={{ maxWidth: '1050px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 4vw, 32px)' }}>
          <a href="/sell-choose" style={{ color: '#a67abf', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Terug</a>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Kaart verkopen</h1>
          <p style={{ color: '#aaaaaa', marginBottom: '40px' }}>Zoek een kaart op en vul de details in</p>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }} className="listing-form">
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '25px', position: 'relative' }}>
                <label style={labelStyle}>ZOEK KAART *</label>
                <input type="text" placeholder="Zoek kaart..." value={searchTerm}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); setSelectedCard(null) }}
                  style={{ ...inputStyle, borderColor: !selectedCard && searchTerm ? '#ff6b6b' : '#3a3a3d' }}
                />
                {showDropdown && suggestions.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '8px', marginTop: '4px', zIndex: 100, overflow: 'hidden' }}>
                    {suggestions.map(card => (
                      <div key={card.name + card.set} onClick={() => handleSelect(card)}
                        style={{ padding: '8px 16px', cursor: 'pointer', borderBottom: '1px solid #3a3a3d', display: 'flex', alignItems: 'center', gap: '12px' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3a3a3d'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <img src={card.src} style={{ width: '35px', borderRadius: '4px' }} alt="" />
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{card.name}</div>
                          <div style={{ fontSize: '11px', color: '#888' }}>{card.set}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCard && (
                <div style={{ background: '#1f1f21', border: '1px solid #a67abf40', borderRadius: '10px', padding: '12px', marginBottom: '25px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={selectedCard.src} style={{ width: '50px', borderRadius: '6px' }} alt="" />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{selectedCard.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{selectedCard.set}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '18px' }}>✓</div>
                </div>
              )}
              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>CONDITIE *</label>
                <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
                  <option value="">Selecteer conditie</option>
                  <option value="M">Mint</option>
                  <option value="NM">Near Mint</option>
                  <option value="EX">Excellent</option>
                  <option value="GD">Good</option>
                  <option value="PL">Played</option>
                </select>
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>PRIJS (€) *</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={labelStyle}>AANTAL</label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '40px' }}>
                <label style={labelStyle}>NOTITIES (OPTIONEEL)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Extra informatie..." style={{ ...inputStyle, height: '100px', resize: 'none' }} />
              </div>
              {submitError && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '12px' }}>{submitError}</p>}
              <button onClick={handleSubmit} disabled={submitting || !photosConfirmed}
                style={{ width: '100%', backgroundColor: photosConfirmed ? '#a67abf' : '#3a3a3d', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', cursor: submitting || !photosConfirmed ? 'not-allowed' : 'pointer', fontSize: '14px', letterSpacing: '1px', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'AANMAKEN...' : photosConfirmed ? 'LISTING AANMAKEN' : "MAAK EERST FOTO'S"}
              </button>
            </div>
            <div style={{ width: '100%', maxWidth: '360px' }}>
              <label style={labelStyle}>FOTO'S * (VOOR- EN ACHTERKANT VEREIST)</label>
              {!photosConfirmed ? (
                <CardPhotoCapture onPhotosReady={(front, back, isCamera) => {
                  setPhotos([front, back])
                  setPhotosConfirmed(true)
                  setFromCamera(isCamera)
                }} />
              ) : (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    {photos.map((src, i) => (
                      <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4' }}>
                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', color: '#fff', fontWeight: '700' }}>
                          {i === 0 ? 'VOOR' : 'ACHTER'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setPhotos([]); setPhotosConfirmed(false) }}
                    style={{ width: '100%', background: 'transparent', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '8px', color: '#888', fontSize: '12px', cursor: 'pointer' }}>
                    ↺ Opnieuw fotograferen
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
