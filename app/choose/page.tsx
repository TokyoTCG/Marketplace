'use client'
import SiteHeader from '@/components/SiteHeader'
import { useEffect } from 'react'

export default function Choose() {
  useEffect(() => {
    const container = document.getElementById('twinkle-container')
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
      dot.style.animation = `twinkle ${Math.random() * 3 + 1}s ease-in-out ${Math.random() * 1}s infinite`
      dot.style.opacity = '0'
      container.appendChild(dot)
    }
  }, [])

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' }}>
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }
        .card-hover { transition: transform 0.2s; }
        .card-hover:hover { transform: translateY(-8px) scale(1.03); }
        .choose-grid { display: flex; justify-content: center; gap: 40px; align-items: flex-end; }
        @media (max-width: 600px) {
          .choose-grid { gap: 20px; }
        }
      `}</style>
      <div id="twinkle-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
          DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
        </div>
        <SiteHeader activePage="kopen" />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(24px, 6vw, 32px)', fontWeight: '800', marginBottom: '8px' }}>Waar zoek je naar?</h1>
          <p style={{ color: '#aaaaaa', fontSize: '15px', marginBottom: '48px' }}>Kies een categorie om te beginnen</p>
          <div className="choose-grid">
            <a href="/browse" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img src="/card-raw.png" alt="Raw card" className="card-hover"
                style={{ width: 'clamp(130px, 35vw, 210px)', aspectRatio: '2/3', objectFit: 'cover', objectPosition: 'center top', borderRadius: '12px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', letterSpacing: '2px' }}>RAW</span>
            </a>
            <a href="/graded" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img src="/card-psa.webp" alt="PSA graded card" className="card-hover"
                style={{ width: 'clamp(130px, 35vw, 210px)', aspectRatio: '2/3', objectFit: 'contain', objectPosition: 'center', borderRadius: '8px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', letterSpacing: '2px' }}>PSA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
