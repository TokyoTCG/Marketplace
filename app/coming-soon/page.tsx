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
      document.cookie = 'tcg_bypass=true; path=/; max-age=31536000; domain=.tokyotcg.nl';
      window.location.href = '/';
    } else {
      setError('Ongeldig wachtwoord');
      setInput('');
    }
  };

  return (
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Courier New', Courier, monospace", overflow: 'hidden', position: 'relative', padding: '24px' }}>
      <style>{`
        @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.9; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
        @keyframes glow { 0%, 100% { text-shadow: 0 0 20px rgba(166,122,191,0.5), 0 0 40px rgba(166,122,191,0.2); } 50% { text-shadow: 0 0 30px rgba(166,122,191,0.8), 0 0 60px rgba(166,122,191,0.4); } }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(166,122,191,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(166,122,191,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)', pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: s.x + '%', top: s.y + '%', width: s.size + 'px', height: s.size + 'px', borderRadius: '50%', backgroundColor: '#a67abf', opacity: 0, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,122,191,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <img src="/logo.png" alt="TokyoTCG" style={{ height: '64px', width: 'auto', marginBottom: '40px', position: 'relative', zIndex: 3, filter: 'drop-shadow(0 0 12px rgba(166,122,191,0.5))' }} />

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '600px', width: '100%', animation: 'flicker 8s infinite' }}>
        <div style={{ fontSize: '10px', letterSpacing: '6px', color: '#a67abf', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase' }}>
          // JAPANSE POKEMON MARKTPLAATS
        </div>

        <h1 style={{ fontSize: 'clamp(48px, 12vw, 96px)', fontWeight: '700', color: '#ffffff', margin: '0 0 4px', lineHeight: 1, animation: 'glow 3s ease-in-out infinite' }}>
          COMING
        </h1>
        <h1 style={{ fontSize: 'clamp(48px, 12vw, 96px)', fontWeight: '700', color: 'transparent', margin: '0 0 28px', lineHeight: 1, WebkitTextStroke: '1.5px #a67abf' }}>
          SOON_
        </h1>

        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #a67abf, transparent)', marginBottom: '28px' }} />

        <p style={{ fontSize: '14px', color: '#555', lineHeight: 2, marginBottom: '48px', letterSpacing: '1px' }}>
          &gt; Iets moois wordt gebouwd...<br />
          &gt; De grootste Japanse Pokemon marktplaats van NL
        </p>

        {!showInput ? (
          <button onClick={() => setShowInput(true)}
            style={{ background: 'transparent', border: '1px solid #a67abf44', borderRadius: '2px', color: '#a67abf88', fontSize: '11px', cursor: 'pointer', letterSpacing: '4px', padding: '12px 28px', fontFamily: "'Courier New', monospace", transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#a67abf'; e.currentTarget.style.color = '#a67abf'; e.currentTarget.style.boxShadow = '0 0 20px rgba(166,122,191,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#a67abf44'; e.currentTarget.style.color = '#a67abf88'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            [ UNLOCK ]
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <input autoFocus type="password" value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="ACCESS_CODE"
              style={{ backgroundColor: '#0e0e15', border: '1px solid #a67abf', borderRadius: '2px', padding: '14px 20px', color: '#a67abf', fontSize: '14px', outline: 'none', width: '100%', maxWidth: '300px', textAlign: 'center', boxSizing: 'border-box', fontFamily: "'Courier New', monospace", letterSpacing: '3px', boxShadow: '0 0 20px rgba(166,122,191,0.15)' }} />
            {error && <p style={{ color: '#ff6b6b', fontSize: '12px', margin: 0, letterSpacing: '2px' }}>{error}</p>}
            <button onClick={handleUnlock}
              style={{ backgroundColor: '#a67abf', color: '#0a0a0f', border: 'none', borderRadius: '2px', padding: '14px 40px', fontSize: '12px', fontWeight: '700', letterSpacing: '4px', cursor: 'pointer', fontFamily: "'Courier New', monospace", boxShadow: '0 0 24px rgba(166,122,191,0.5)' }}>
              [ ENTER ]
            </button>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '24px', fontSize: '10px', color: '#2a2a2a', letterSpacing: '4px', zIndex: 3 }}>
        TOKYOTCG.NL_
      </div>
    </div>
  );
}
