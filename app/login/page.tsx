'use client'
import SiteHeader from '@/components/SiteHeader'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

type Step = 'email' | 'code' | 'username'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [verifiedToken, setVerifiedToken] = useState('')

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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#2b2b2e',
    border: '1px solid #3a3a3d',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#aaaaaa',
    letterSpacing: '1px',
    marginBottom: '6px',
  }

  const handleSendCode = async () => {
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Er is iets misgegaan')
      setIsNewUser(data.isNewUser)
      setStep('code')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ongeldige code')
      setVerifiedToken(data.token)
      if (isNewUser) {
        setStep('username')
      } else {
        await signIn('credentials', { email, token: data.token, callbackUrl: '/account', redirect: true })
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSetUsername = async () => {
    if (!username.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Er is iets misgegaan')
      await signIn('credentials', { email, token: verifiedToken, callbackUrl: '/account', redirect: true })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/account' })
  }

  const titles: Record<Step, { title: string; sub: string }> = {
    email: { title: 'Welkom terug ᯓ★', sub: 'Log in of maak een account aan om door te gaan' },
    code: { title: 'Check je inbox', sub: `We hebben een code gestuurd naar ${email}` },
    username: { title: 'Kies een gebruikersnaam', sub: 'Hoe wil je gezien worden op TokyoTCG?' },
  }

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' }}>
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }
        input::placeholder { color: #555; }
        input:focus { border-color: #a67abf !important; }
        .google-btn:hover { background-color: #2b2b2e !important; border-color: #a67abf !important; }
        .primary-btn:hover:not(:disabled) { background-color: #b98fd0 !important; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .back-btn:hover { color: #a67abf !important; }
        .code-input { text-align: center; font-size: 28px !important; font-weight: 800 !important; letter-spacing: 12px !important; padding: 16px !important; }
      `}</style>

      <div id="twinkle-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
          DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
        </div>

        <SiteHeader />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 96px)', padding: '40px 16px' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>{step === 'code' && (<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='#a67abf' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' style={{margin: '0 auto 16px'}}><rect width='20' height='16' x='2' y='4' rx='2'/><path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'/></svg>)}
              <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>{titles[step].title}</div>
              <div style={{ fontSize: '14px', color: '#888' }}>{titles[step].sub}</div>
            </div>

            <div style={{ backgroundColor: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '16px', padding: '32px' }}>

              {step === 'email' && (
                <>
                  <button
                    className="google-btn"
                    onClick={handleGoogle}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#1a1a1c', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '13px', fontSize: '14px', fontWeight: '600', color: '#ffffff', cursor: 'pointer', marginBottom: '24px', transition: 'all 0.2s' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Doorgaan met Google
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#2e2e31' }} />
                    <span style={{ fontSize: '11px', color: '#555', letterSpacing: '1px' }}>OF</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#2e2e31' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>E-MAILADRES</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                        style={inputStyle}
                        placeholder="jan@email.nl"
                        autoFocus
                      />
                    </div>
                    {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0 }}>{error}</p>}
                    <button
                      className="primary-btn"
                      onClick={handleSendCode}
                      disabled={loading || !email}
                      style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px', transition: 'background-color 0.2s' }}
                    >
                      {loading ? 'VERSTUREN...' : 'DOORGAAN →'}
                    </button>
                  </div>
                </>
              )}

              {step === 'code' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ ...labelStyle, textAlign: 'center' }}>VERIFICATIECODE</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={e => e.key === 'Enter' && handleVerifyCode()}
                      className="code-input"
                      style={{ ...inputStyle }}
                      placeholder="······"
                      autoFocus
                    />
                  </div>
                  {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0, textAlign: 'center' }}>{error}</p>}
                  <button
                    className="primary-btn"
                    onClick={handleVerifyCode}
                    disabled={loading || code.length !== 6}
                    style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px', transition: 'background-color 0.2s' }}
                  >
                    {loading ? 'CONTROLEREN...' : 'BEVESTIGEN →'}
                  </button>
                  <button
                    className="back-btn"
                    onClick={() => { setStep('email'); setCode(''); setError('') }}
                    style={{ background: 'none', border: 'none', color: '#555', fontSize: '13px', cursor: 'pointer', transition: 'color 0.2s' }}
                  >
                    ← Ander e-mailadres gebruiken
                  </button>
                </div>
              )}

              {step === 'username' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>GEBRUIKERSNAAM</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value.replace(/\s/g, ''))}
                      onKeyDown={e => e.key === 'Enter' && handleSetUsername()}
                      style={inputStyle}
                      placeholder="PikachuTrainer99"
                      maxLength={30}
                      autoFocus
                    />
                    <p style={{ fontSize: '11px', color: '#555', marginTop: '6px' }}>Alleen letters, cijfers en underscores. Kan later gewijzigd worden.</p>
                  </div>
                  {error && <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0 }}>{error}</p>}
                  <button
                    className="primary-btn"
                    onClick={handleSetUsername}
                    disabled={loading || username.trim().length < 3}
                    style={{ width: '100%', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '13px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px', transition: 'background-color 0.2s' }}
                  >
                    {loading ? 'OPSLAAN...' : 'ACCOUNT AANMAKEN 🎉'}
                  </button>
                </div>
              )}

            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: '#555', lineHeight: '1.6' }}>
              Door verder te gaan ga je akkoord met onze{' '}
              <a href="/terms" style={{ color: '#a67abf', textDecoration: 'none' }}>Algemene voorwaarden</a>{' '}
              en{' '}
              <a href="/privacy" style={{ color: '#a67abf', textDecording: 'none' }}>Privacybeleid</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
