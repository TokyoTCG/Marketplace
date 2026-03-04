'use client';
import { useState, useEffect } from 'react';

const BYPASS_PASSWORD = 'Fabienne10!';

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

  useEffect(() => {
    const s: Star[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
      dur: Math.random() * 3 + 2,
    }));
    setStars(s);
  }, []);

  const handleUnlock = () => {
    if (input === BYPASS_PASSWORD) {
      document.cookie = 'tcg_bypass=true; path=/; max-age=31536000; domain=.tokyotcg.nl';
      window.location.href = '/';
    } else {
      setError('Incorrect');
      setInput('');
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0c', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Courier New', monospace", overflow: 'hidden', position: 'relative', padding: '24px' }}>
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.6; } }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(166,122,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(166,122,191,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: s.x + '%', top: s.y + '%', width: s.size + 'px', height: s.size + 'px', borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      <img src="/logo.png" alt="TokyoTCG" style={{ height: '56px', width: 'auto', marginBottom: '48px', position: 'relative', zIndex: 3, opacity: 0.9 }} />

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '500px', width: '100%' }}>

        <div style={{ fontSize: '10px', letterSpacing: '4px', color: '#a67abf', marginBottom: '20px', opacity: 0.7 }}>
          // DÉ JAPANSE POKÉMON MARKTPLAATS VAN NL
        </div>

        <h1 style={{ fontSize: 'clamp(52px, 13vw, 110px)', fontWeight: '700', color: '#ffffff', margin: '0 0 6px', lineHeight: 1, letterSpacing: '-2px' }}>
          COMING
        </h1>
        <h1 style={{ fontSize: 'clamp(52px, 13vw, 110px)', fontWeight: '700', color: 'transparent', margin: '0 0 40px', lineHeight: 1, letterSpacing: '-2px', WebkitTextStroke: '1px rgba(166,122,191,0.8)' }}>
          SOON_
        </h1>

        <div style={{ width: '32px', height: '1px', backgroundColor: '#a67abf', margin: '0 auto 40px', opacity: 0.6 }} />

        {!showInput ? (
          <button onClick={() => setShowInput(true)}
            style={{ background: 'transparent', border: '1px solid #a67abf33', color: '#a67abf66', fontSize: '10px', cursor: 'pointer', letterSpacing: '5px', padding: '12px 24px', fontFamily: "'Courier New', monospace", transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#a67abf99'; e.currentTarget.style.color = '#a67abf'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#a67abf33'; e.currentTarget.style.color = '#a67abf66'; }}
          >
            UNLOCK
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <input autoFocus type="password" value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="——————"
              style={{ backgroundColor: 'transparent', border: '1px solid #a67abf66', padding: '12px 20px', color: '#ffffff', fontSize: '18px', outline: 'none', width: '100%', maxWidth: '260px', textAlign: 'center', boxSizing: 'border-box', fontFamily: "'Courier New', monospace", letterSpacing: '6px' }} />
            {error && <p style={{ color: '#ff6b6b', fontSize: '11px', margin: 0, letterSpacing: '3px' }}>{error}</p>}
            <button onClick={handleUnlock}
              style={{ backgroundColor: '#a67abf', color: '#0a0a0c', border: 'none', padding: '12px 36px', fontSize: '11px', fontWeight: '700', letterSpacing: '4px', cursor: 'pointer', fontFamily: "'Courier New', monospace" }}>
              ENTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
