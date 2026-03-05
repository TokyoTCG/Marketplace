'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cart, setCart] = useState<any[]>([])
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', postal: '', country: 'NL'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/checkout')
    const stored = localStorage.getItem('tokyotcg_cart')
    if (stored) setCart(JSON.parse(stored))
  }, [status])

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({ ...f, email: session.user?.email || '', name: session.user?.name || '' }))
    }
  }, [session])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit() {
    if (!form.name || !form.email || !form.address || !form.city || !form.postal) {
      setError('Vul alle verplichte velden in.')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart, shipping: form, total })
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Er is iets misgegaan.')
      setSubmitting(false)
      return
    }

    // Store order id for payment page
    localStorage.setItem('tokyotcg_pending_order', data.orderId)
    router.push('/checkout/payment')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#2b2b2e', border: '1px solid #3a3a3d',
    borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px',
    outline: 'none', marginTop: '8px', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '11px', fontWeight: '700', color: '#aaa', letterSpacing: '1px',
  }

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <SiteHeader activePage="kopen" />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <a href="/cart" style={{ color: '#a67abf', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' }}>← Terug naar winkelwagen</a>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Bezorggegevens</h1>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* FORM */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>NAAM</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Voor- en achternaam" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>E-MAILADRES</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jouw@email.nl" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>STRAAT + HUISNUMMER</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Straatnaam 12" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>POSTCODE</label>
                <input value={form.postal} onChange={e => setForm(f => ({ ...f, postal: e.target.value }))} placeholder="1234 AB" style={inputStyle} />
              </div>
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>STAD</label>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Amsterdam" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>LAND</label>
              <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={inputStyle}>
                <option value="NL">Nederland</option>
                <option value="BE">België</option>
                <option value="DE">Duitsland</option>
                <option value="FR">Frankrijk</option>
                <option value="GB">Verenigd Koninkrijk</option>
                <option value="OTHER">Anders</option>
              </select>
            </div>
            {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
            <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '16px', fontWeight: '700', fontSize: '15px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1, letterSpacing: '1px' }}>
              {submitting ? 'LADEN...' : 'NAAR BETALING →'}
            </button>
          </div>

          {/* ORDER SUMMARY */}
          <div style={{ width: '280px' }}>
            <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '12px', padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#666', letterSpacing: '1px', marginBottom: '16px' }}>OVERZICHT</div>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.cardName} style={{ width: '40px', borderRadius: '6px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{item.cardName}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>{item.condition}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>€{item.price.toFixed(2)}</div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #2e2e31', marginTop: '12px', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
                  <span>Totaal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
