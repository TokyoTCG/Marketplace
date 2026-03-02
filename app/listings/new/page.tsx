'use client'
import SiteHeader from '@/components/SiteHeader'
import { useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const WORKING_CARDS = [
  { name: "Aurorus", set: "Nullifying Zero", src: "/cards/aurorus-nullifying-zero.webp" },
  { name: "Beautifly", set: "Mega Dream EX", src: "/cards/beautifly-mega-dream-ex.webp" },
  { name: "Budew", set: "Mega Dream EX", src: "/cards/budew-mega-dream-ex.webp" },
  { name: "Canari", set: "Mega Dream EX", src: "/cards/canari-mega-dream-ex.webp" },
  { name: "Charcadet", set: "Inferno X", src: "/cards/charcadet-inferno-x.webp" },
  { name: "Clefairy", set: "Nullifying Zero", src: "/cards/clefairy-nullifying-zero.webp" },
  { name: "Cynthia's Spiritomb", set: "Mega Dream EX", src: "/cards/cynthias-spiritomb-mega-dream-ex.webp" },
  { name: "Dedenne", set: "Nullifying Zero", src: "/cards/dedenne-nullifying-zero.webp" },
  { name: "Dewgong", set: "Inferno X", src: "/cards/dewgong-inferno-x.webp" },
  { name: "Doublade", set: "Nullifying Zero", src: "/cards/doublade-nullifying-zero.webp" },
  { name: "Drakloak", set: "Mega Dream EX", src: "/cards/drakloak-mega-dream-ex.webp" },
  { name: "Drapion", set: "Nullifying Zero", src: "/cards/drapion-nullifying-zero.webp" },
  { name: "Dreepy", set: "Mega Dream EX", src: "/cards/dreepy-mega-dream-ex.webp" },
  { name: "Dustox", set: "Mega Dream EX", src: "/cards/dustox-mega-dream-ex.webp" },
  { name: "Espurr", set: "Nullifying Zero", src: "/cards/espurr-nullifying-zero.webp" },
  { name: "Ethan's Magcargo", set: "Mega Dream EX", src: "/cards/ethans-magcargo-mega-dream-ex.webp" },
  { name: "Fan Rotom", set: "Mega Dream EX", src: "/cards/fan-rotom-mega-dream-ex.webp" },
  { name: "Fezandipiti EX", set: "Mega Dream EX", src: "/cards/fezandipiti-ex-mega-dream-ex.webp" },
  { name: "Galarian Obstagoon", set: "Mega Dream EX", src: "/cards/galarian-obstagoon-mega-dream-ex.webp" },
  { name: "Heliolisk", set: "Mega Dream EX", src: "/cards/heliolisk-mega-dream-ex.webp" },
  { name: "Hop's Trevenant", set: "Mega Dream EX", src: "/cards/hops-trevenant-mega-dream-ex.webp" },
  { name: "Iono's Bellibolt EX", set: "Mega Dream EX", src: "/cards/ionos-bellibolt-ex-mega-dream-ex.webp" },
  { name: "Iris's Fighting Spirit", set: "Mega Dream EX", src: "/cards/iriss-fighting-spirit-mega-dream-ex.webp" },
  { name: "Jacinthe", set: "Nullifying Zero", src: "/cards/jacinthe-nullifying-zero.webp" },
  { name: "Ludicolo", set: "Inferno X", src: "/cards/ludicolo-inferno-x.webp" },
  { name: "Marnie's Grimmsnarl EX", set: "Mega Dream EX", src: "/cards/marnies-grimmsnarl-ex-mega-dream-ex.webp" },
  { name: "Medicham", set: "Mega Dream EX", src: "/cards/medicham-mega-dream-ex.webp" },
  { name: "Mega Clefable EX", set: "Nullifying Zero", src: "/cards/mega-clefable-ex-nullifying-zero.webp" },
  { name: "Mega Diancie EX", set: "Mega Dream EX", src: "/cards/mega-diancie-ex-mega-dream-ex.webp" },
  { name: "Mega Dragonite EX", set: "Mega Dream EX", src: "/cards/mega-dragonite-ex-mega-dream-ex.webp" },
  { name: "Mega Eelektross EX", set: "Mega Dream EX", src: "/cards/mega-eelektross-ex-mega-dream-ex.webp" },
  { name: "Mega Froslass EX", set: "Mega Dream EX", src: "/cards/mega-froslass-ex-mega-dream-ex.webp" },
  { name: "Mega Gengar EX", set: "Mega Dream EX", src: "/cards/mega-gengar-ex-mega-dream-ex.webp" },
  { name: "Mega Hawlucha EX", set: "Mega Dream EX", src: "/cards/mega-hawlucha-ex-mega-dream-ex.webp" },
  { name: "Mega Scrafty EX", set: "Mega Dream EX", src: "/cards/mega-scrafty-ex-mega-dream-ex.webp" },
  { name: "Mega Starmie EX", set: "Nullifying Zero", src: "/cards/mega-starmie-ex-nullifying-zero.webp" },
  { name: "Mega Zygarde EX", set: "Nullifying Zero", src: "/cards/mega-zygarde-ex-nullifying-zero.webp" },
  { name: "Meowth EX", set: "Nullifying Zero", src: "/cards/meowth-ex-nullifying-zero.webp" },
  { name: "Misdreavus", set: "Mega Dream EX", src: "/cards/misdreavus-mega-dream-ex.webp" },
  { name: "N's Zekrom", set: "Mega Dream EX", src: "/cards/ns-zekrom-mega-dream-ex.webp" },
  { name: "N's Zoroark EX", set: "Mega Dream EX", src: "/cards/ns-zoroark-ex-mega-dream-ex.webp" },
  { name: "Numel", set: "Mega Dream EX", src: "/cards/numel-mega-dream-ex.webp" },
  { name: "Nymble", set: "Inferno X", src: "/cards/nymble-inferno-x.webp" },
  { name: "Pikachu EX", set: "Mega Dream EX", src: "/cards/pikachu-ex-mega-dream-ex.webp" },
  { name: "Piplup", set: "Inferno X", src: "/cards/piplup-inferno-x.webp" },
  { name: "Probopass", set: "Nullifying Zero", src: "/cards/probopass-nullifying-zero.webp" },
  { name: "Psyduck", set: "Mega Dream EX", src: "/cards/psyduck-mega-dream-ex.webp" },
  { name: "Raticate", set: "Nullifying Zero", src: "/cards/raticate-nullifying-zero.webp" },
  { name: "Rosa's Encouragement", set: "Nullifying Zero", src: "/cards/rosas-encouragement-nullifying-zero.webp" },
  { name: "Rowlet", set: "Nullifying Zero", src: "/cards/rowlet-nullifying-zero.webp" },
  { name: "Snorunt", set: "Mega Dream EX", src: "/cards/snorunt-mega-dream-ex.webp" },
  { name: "Spewpa", set: "Nullifying Zero", src: "/cards/spewpa-nullifying-zero.webp" },
  { name: "Steven's Metagross EX", set: "Mega Dream EX", src: "/cards/stevens-metagross-ex-mega-dream-ex.webp" },
  { name: "Surfer", set: "Mega Dream EX", src: "/cards/surfer-mega-dream-ex.webp" },
  { name: "Talonflame", set: "Nullifying Zero", src: "/cards/talonflame-nullifying-zero.webp" },
  { name: "Team Rocket's Dugtrio", set: "Mega Dream EX", src: "/cards/team-rockets-dugtrio-mega-dream-ex.webp" },
  { name: "Team Rocket's Mewtwo EX", set: "Mega Dream EX", src: "/cards/team-rockets-mewtwo-ex-mega-dream-ex.webp" },
  { name: "Team Rocket's Mimikyu", set: "Mega Dream EX", src: "/cards/team-rockets-mimikyu-mega-dream-ex.webp" },
  { name: "Togekiss", set: "Mega Dream EX", src: "/cards/togekiss-mega-dream-ex.webp" },
  { name: "Tyrunt", set: "Nullifying Zero", src: "/cards/tyrunt-nullifying-zero.webp" }
]

export default function NewListing() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectedCard, setSelectedCard] = useState({ name: '', set: '' })
  const [showDropdown, setShowDropdown] = useState(false)
  const [condition, setCondition] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [notes, setNotes] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

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

  async function handleSubmit() {
    if (!selectedCard.name || !condition || !price) {
      setSubmitError('Vul alle verplichte velden in.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    const cardEntry = WORKING_CARDS.find(c => c.name === selectedCard.name && c.set === selectedCard.set)
    const slug = cardEntry?.src.replace('/cards/', '').replace('.webp', '') || ''
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardSlug: slug, cardName: selectedCard.name, cardSet: selectedCard.set, condition, price, quantity, notes })
    })
    const data = await res.json()
    if (!res.ok) {
      setSubmitError(data.error || 'Er is iets misgegaan.')
      setSubmitting(false)
    } else {
      router.push('/cards/' + slug)
    }
  }

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* PURPLE ANNOUNCEMENT BAR */}
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>

      {/* HEADER WITH LOGO */}
      <SiteHeader activePage="verkopen" />

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1050px', margin: '0 auto', padding: '40px 32px' }}>
        <a href="/sell-choose" style={{ color: '#a67abf', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Terug</a>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Kaart verkopen</h1>
        <p style={{ color: '#aaaaaa', marginBottom: '40px' }}>Zoek een kaart op en vul de details in</p>

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
              <label style={labelStyle}>CONDITIE</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={inputStyle}>
                <option value="">Selecteer conditie</option>
                <option value="M">Mint</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Played">Played</option>
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

            {submitError && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '12px' }}>{submitError}</p>}
            <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', backgroundColor: '#a67abf', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', letterSpacing: '1px', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'AANMAKEN...' : 'LISTING AANMAKEN'}
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
