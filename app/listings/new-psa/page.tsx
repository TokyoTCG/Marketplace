'use client'
import SiteHeader from '@/components/SiteHeader'
import { useState, useMemo, useEffect } from 'react'
import { cardData } from '@/lib/cardData'

const WORKING_CARDS = cardData.map(c => ({ name: c.name, set: c.set, src: c.image }))

export default function NewPsaListing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCard, setSelectedCard] = useState({ name: '', set: '' })
  const [showDropdown, setShowDropdown] = useState(false)
  const [condition, setCondition] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  useEffect(() => {
    const container = document.getElementById('twinkle-psa')
    if (!container) return
    for (let i = 0; i < 80; i++) {
      const dot = document.createElement('div')
      const size = Math.random() * 2 + 1
      dot.style.position = 'absolute'
      dot.style.width = size + 'px'
      dot.style.height = size + 'px'
      dot.style.background = 'white'
      dot.style.borderRadius = '50%'
      dot.style.left = Math.random() * 100 + '%'
      dot.style.top = Math.random() * 100 + '%'
      dot.style.animation = `twinkle ${Math.random() * 3 + 1}s ease-in-out ${Math.random() * 2}s infinite`
      dot.style.opacity = '0'
      container.appendChild(dot)
    }
  }, [])

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

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const newFiles = [...photos, ...files].slice(0, 4)
    setPhotos(newFiles)
    setPreviews(newFiles.map(f => URL.createObjectURL(f)))
  }

  function removePhoto(index: number) {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPreviews(newPhotos.map(f => URL.createObjectURL(f)))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#2b2b2e',
    border: '1px solid #3a3a3d',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    marginTop: '8px',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#aaaaaa',
    letterSpacing: '1px',
  }

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' }}>
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }`}</style>
<div id="twinkle-psa" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
      {/* PURPLE ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>

      {/* HEADER */}
      <SiteHeader activePage="verkopen" />

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1050px', margin: '0 auto', padding: '40px 32px' }}>
        <a href="/sell-choose" style={{ color: '#a67abf', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Terug</a>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>PSA kaart verkopen</h1>
        <p style={{ color: '#aaaaaa', marginBottom: '40px' }}>Zoek een kaart op en vul de PSA details in</p>

        <div style={{ display: 'flex', gap: '40px' }}>
          <div style={{ flex: 1 }}>
            {/* SEARCH */}
            <div style={{ marginBottom: '25px', position: 'relative' }}>
              <label style={labelStyle}>ZOEK KAART</label>
              <input
                type="text"
                placeholder="Zoek kaart..."
                value={searchTerm}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true) }}
                style={inputStyle}
              />
              {showDropdown && suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d', borderRadius: '8px', marginTop: '4px', zIndex: 100, overflow: 'hidden' }}>
                  {suggestions.map(card => (
                    <div key={card.name} onClick={() => handleSelect(card)}
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

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>KAARTNAAM</label>
              <input value={selectedCard.name} readOnly placeholder="Naam van de kaart" style={{ ...inputStyle, backgroundColor: '#1f1f21', color: '#888' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>SET</label>
              <input value={selectedCard.set} readOnly placeholder="Set naam" style={{ ...inputStyle, backgroundColor: '#1f1f21', color: '#888' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>PSA GRADE</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
                <option value="">Selecteer PSA grade</option>
                {[10,9,8,7,6,5,4,3,2,1].map(g => (
                  <option key={g} value={'PSA ' + g}>
                    PSA {g}{g === 10 ? ' — Gem Mint' : g === 9 ? ' — Mint' : g === 8 ? ' — Near Mint/Mint' : g === 7 ? ' — Near Mint' : g === 6 ? ' — Excellent/Mint' : g === 5 ? ' — Excellent' : g === 4 ? ' — Very Good/Excellent' : g === 3 ? ' — Very Good' : g === 2 ? ' — Good' : ' — Poor'}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>PRIJS (€)</label>
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

            <button style={{ width: '100%', backgroundColor: '#a67abf', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', letterSpacing: '1px' }}>
              LISTING AANMAKEN
            </button>
          </div>

          {/* UPLOAD BOX */}
          <div style={{ width: '360px' }}>
            <label style={labelStyle}>FOTO'S (MAX 4)</label>
            {previews.length === 0 ? (
              <div
                style={{ marginTop: '8px', width: '100%', aspectRatio: '1.5/1', border: '1px dashed #3a3a3d', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#1f1f21', color: '#888' }}
                onClick={() => document.getElementById('photo-input')?.click()}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#a67abf')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#3a3a3d')}
              >
                <img src="https://img.icons8.com/ios/50/888888/camera--v1.png" style={{ width: '40px', marginBottom: '15px', opacity: 0.5 }} alt="" />
                <div style={{ fontSize: '14px', fontWeight: '500' }}>Klik om foto's te uploaden</div>
                <div style={{ fontSize: '11px', marginTop: '5px' }}>JPG, PNG — max 4 foto's</div>
                <input id="photo-input" type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
              </div>
            ) : (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4' }}>
                      <img src={src} alt={'foto ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removePhoto(i)}
                        style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {previews.length < 4 && (
                  <div
                    style={{ border: '1px dashed #3a3a3d', borderRadius: '8px', padding: '12px', textAlign: 'center', cursor: 'pointer', color: '#888', fontSize: '13px', backgroundColor: '#1f1f21' }}
                    onClick={() => document.getElementById('photo-input')?.click()}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#a67abf')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#3a3a3d')}
                  >
                    + Nog {4 - previews.length} foto{4 - previews.length !== 1 ? "'s" : ''} toevoegen
                    <input id="photo-input" type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
