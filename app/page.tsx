'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BYPASS_PASSWORD = 'tokyotcg2025';
const BYPASS_KEY = 'tcg_bypass';

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  dur: number;
}

export default function ComingSoon() {
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');
  const [stars, setStars] = useState<Star[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(BYPASS_KEY) === 'true') {
      router.replace('/');
    }
    const s: Star[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
      dur: Math.random() * 3 + 2,
    }));
    setStars(s);
  }, []);

  const handleUnlock = () => {
    if (input === BYPASS_PASSWORD) {
      localStorage.setItem(BYPASS_KEY, 'true');
      router.replace('/');
    } else {
      setError('Ongeldig wachtwoord');
      setInput('');
    }
  };

  return (
    <div style={{ backgroundColor: '#0e0e10', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif", overflow: 'hidden', position: 'relative', padding: '24px' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: s.x + '%', top: s.y + '%', width: s.size + 'px', height: s.size + 'px', borderRadius: '50%', backgroundColor: 'white', opacity: 0, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,122,191,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <img src="/logo.png" alt="TokyoTCG" style={{ height: '72px', width: 'auto', marginBottom: '48px', position: 'relative', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '560px', width: '100%' }}>
        <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#a67abf', fontFamily: "'Segoe UI', sans-serif", fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase' }}>
          De Japanse Pokemon Marktplaats
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: '400', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-1px' }}>
          Komt Eraan
        </h1>
        <div style={{ width: '48px', height: '2px', backgroundColor: '#a67abf', margin: '0 auto 28px' }} />
        <p style={{ fontSize: '15px', color: '#888', lineHeight: 1.7, fontFamily: "'Segoe UI', sans-serif", marginBottom: '48px' }}>
          We bouwen iets moois voor jou.<br />
          De grootste Japanse Pokemon marktplaats van Nederland is bijna klaar.
        </p>
        {!showInput ? (
          <button onClick={() => setShowInput(true)} style={{ background: 'none', border: 'none', color: '#333', fontSize: '11px', cursor: 'pointer', letterSpacing: '2px', fontFamily: "'Segoe UI', sans-serif", padding: '8px' }}>
            ✦
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <input autoFocus type="password" value={input} onChange={e => { setInput(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleUnlock()} placeholder="Wachtwoord" style={{ backgroundColor: '#1f1f21', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '12px 20px', color: '#ffffff', fontSize: '14px', outline: 'none', width: '100%', maxWidth: '280px', textAlign: 'center', fontFamily: "'Segoe UI', sans-serif", boxSizing: 'border-box' }} />
            {error && <p style={{ color: '#ff6b6b', fontSize: '12px', margin: 0 }}>{error}</p>}
            <button onClick={handleUnlock} style={{ backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 32px', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer' }}>
              ENTER
            </button>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: '24px', fontSize: '11px', color: '#444', letterSpacing: '1px', fontFamily: "'Segoe UI', sans-serif", zIndex: 1 }}>
        2025 TokyoTCG - tokyotcg.nl
      </div>
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.3); } }`}</style>
    </div>
  );
}
