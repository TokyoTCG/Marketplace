'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'

export default function SuccessPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('tokyotcg_pending_order')
    if (id) {
      setOrderId(id.slice(0, 8).toUpperCase())
      localStorage.removeItem('tokyotcg_pending_order')
      localStorage.removeItem('tokyotcg_cart')
    }
  }, [])

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '16px', padding: '40px 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Betaling geslaagd!</h1>
          {orderId && (
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>Order #{orderId}</p>
          )}
          <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6', marginBottom: '32px' }}>
            Je bestelling is geplaatst. De verkoper neemt binnenkort contact met je op over de verzending.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => router.push('/browse')}
              style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', letterSpacing: '1px' }}
            >
              VERDER WINKELEN
            </button>
            <button
              onClick={() => router.push('/account')}
              style={{ width: '100%', backgroundColor: 'transparent', color: '#888', border: '1px solid #2e2e31', borderRadius: '8px', padding: '14px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              Mijn bestellingen
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
