'use client'
import SiteHeader from '@/components/SiteHeader'
import { useEffect } from 'react'

export default function SellChoose() {
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
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }`}</style>
      <div id="twinkle-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
          DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
        </div>
        <SiteHeader activePage="verkopen" />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Wat wil je verkopen?</h1>
          <p style={{ color: '#aaaaaa', fontSize: '15px', marginBottom: '70px' }}>Kies een categorie om te beginnen</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', alignItems: 'flex-end', marginLeft: '-20px' }}>
            <a href="/listings/new" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img src="/kpgz1z1jbhrmy0cwk4etask7nw_preview_0-ezremove.png" alt="Raw card"
                style={{ width: '250px', height: '310px', objectFit: 'contain', borderRadius: '8px', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
              />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', letterSpacing: '2px' }}>RAW</span>
            </a>

            <a href="/listings/new-psa" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img src="/card-psa.webp" alt="PSA graded card"
                style={{ width: '185px', height: '310px', objectFit: 'cover', borderRadius: '8px', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
              />
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', letterSpacing: '2px' }}>PSA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
