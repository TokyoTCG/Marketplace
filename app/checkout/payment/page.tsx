'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'

export default function PaymentPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    const id = localStorage.getItem('tokyotcg_pending_order')
    const stored = localStorage.getItem('tokyotcg_cart')
    if (!id) { router.push('/cart'); return }
    setOrderId(id)
    if (stored) setCart(JSON.parse(stored))
  }, [])

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '16px', padding: '40px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>💜</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Betaling</h1>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>Order #{orderId.slice(0, 8).toUpperCase()}</p>
          <div style={{ background: '#2b2b2e', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Totaalbedrag</div>
            <div style={{ fontSize: '32px', fontWeight: '800' }}>€{total.toFixed(2)}</div>
          </div>
          <div style={{ background: '#a67abf18', border: '1px solid #a67abf40', borderRadius: '10px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: '#a67abf' }}>
            🔧 Confirmo betaling wordt binnenkort gekoppeld
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('tokyotcg_cart')
              localStorage.removeItem('tokyotcg_pending_order')
              router.push('/checkout/success')
            }}
            style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', letterSpacing: '1px' }}
          >
            SIMULEER BETALING (TEST)
          </button>
        </div>
      </main>
    </div>
  )
}
