'use client'
import { useEffect, useState } from 'react'
import SiteHeader from '@/components/SiteHeader'

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '16px', padding: '40px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Bestelling geplaatst!</h1>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px', lineHeight: '1.6' }}>
            Bedankt voor je aankoop! Je ontvangt een bevestigingsmail zodra de verkoper je bestelling heeft verwerkt.
          </p>
          <a href="/browse" style={{ display: 'block', width: '100%', backgroundColor: '#a67abf', color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', fontSize: '15px', letterSpacing: '1px', boxSizing: 'border-box' }}>
            VERDER WINKELEN
          </a>
          <a href="/" style={{ display: 'block', marginTop: '16px', color: '#666', fontSize: '13px', textDecoration: 'none' }}>
            Terug naar home
          </a>
        </div>
      </main>
    </div>
  )
}
