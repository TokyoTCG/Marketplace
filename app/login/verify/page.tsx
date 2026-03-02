'use client'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>
      <div style={{ textAlign: 'center', maxWidth: '420px', padding: '0 24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '24px' }}>📬</div>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>Check je inbox!</h1>
        <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.7', marginBottom: '32px' }}>
          We hebben een inloglink gestuurd naar je e-mailadres. Klik op de link in de e-mail om in te loggen.
        </p>
        <p style={{ fontSize: '11px', color: '#555' }}>
          Geen e-mail ontvangen? Check je spam folder.
        </p>
        <button
          onClick={() => router.push('/login')}
          style={{ marginTop: '24px', background: 'none', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '10px 24px', color: '#aaa', fontSize: '12px', cursor: 'pointer', fontFamily: "'Space Mono', monospace" }}
        >
          ← Terug naar login
        </button>
      </div>
    </div>
  )
}
