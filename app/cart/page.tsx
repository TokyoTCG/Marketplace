'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('tokyotcg_cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  function removeItem(index: number) {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem('tokyotcg_cart', JSON.stringify(updated))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function handleCheckout() {
    if (!session) {
      router.push('/login?callbackUrl=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Winkelwagen</h1>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '32px' }}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#555' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
            <div style={{ fontSize: '16px', marginBottom: '24px' }}>Je winkelwagen is leeg</div>
            <a href="/browse" style={{ color: '#a67abf', textDecoration: 'none', fontSize: '14px' }}>← Verder winkelen</a>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              {cart.map((item, i) => (
                <div key={i} style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '12px', padding: '16px', marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.cardName} style={{ width: '60px', borderRadius: '8px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>{item.cardName}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{item.cardSet}</div>
                    <div style={{ fontSize: '11px', color: '#a67abf', background: '#a67abf18', border: '1px solid #a67abf40', borderRadius: '4px', padding: '2px 8px', display: 'inline-block' }}>
                      {item.condition}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>€{(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(i)} style={{ background: 'transparent', border: '1px solid #3a3a3d', borderRadius: '6px', color: '#666', fontSize: '11px', padding: '4px 10px', cursor: 'pointer' }}>
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#888' }}>
                <span>Subtotaal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#888' }}>
                <span>Verzendkosten</span>
                <span>Wordt berekend</span>
              </div>
              <div style={{ borderTop: '1px solid #2e2e31', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
                <span>Totaal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', letterSpacing: '1px' }}>
              AFREKENEN →
            </button>
            <a href="/browse" style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: '#666', fontSize: '13px', textDecoration: 'none' }}>← Verder winkelen</a>
          </>
        )}
      </main>
    </div>
  )
}
