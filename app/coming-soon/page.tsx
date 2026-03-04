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
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Rajdhani', sans-serif", overflow: 'hidden', position: 'relative', padding: '24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@400;700;900&display=swap');
        @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.3); } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.8; } 94% { opacity: 1; } }
      `}</style>

      {/* Scanline effect */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(166,122,191,0.015) 2px, rgba(166,122,191,0.015) 4px)', pointerEvents: 'none', zIndex: 2 }} />

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: 'absolute', left: s.x + '%', top: s.y + '%', width: s.size + 'px', height: s.size + 'px', borderRadius: '50%', backgroundColor: '#a67abf', opacity: 0, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        ))}
      </div>

      {/* Glow orb */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,122,191,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Grid lines */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(166,122,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(166,122,191,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

      <img src="/logo.png" alt="TokyoTCG" style={{ height: '64px', width: 'auto', marginBottom: '40px', position: 'relative', zIndex: 3, filter: 'drop-shadow(0 0 12px rgba(166,122,191,0.4))' }} />

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '600px', width: '100%', animation: 'flicker 8s infinite' }}>
        <div style={{ fontSize: '11px', letterSpacing: '6px', color: '#a67abf', fontFamily: "'Orbitron', sans-serif", fontWeight: '400', marginBottom: '16px', textTransform: 'uppercase' }}>
          Japanse Pokemon Marktplaats
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 10vw, 80px)', fontWeight: '900', color: '#ffffff', margin: '0 0 8px', lineHeight: 1, fontFamily: "'Orbitron', sans-serif", textShadow: '0 0 30px rgba(166,122,191,0.5), 0 0 60px rgba(166,122,191,0.2)' }}>
          COMING
        </h1>
        <h1 style={{ fontSize: 'clamp(40px, 10vw, 80px)', fontWeight: '900', color: 'transparent', margin: '0 0 24px', lineHeight: 1, fontFamily: "'Orbitron', sans-serif", WebkitTextStroke: '1px #a67abf' }}>
          SOON
        </h1>

        <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #a67abf, transparent)', margin: '0 auto 28px' }} />

        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '48px', fontFamily: "'Rajdhani', sans-serif", letterSpacing: '1px' }}>
          We bouwen iets moois voor jou.<br />
          De grootste Japanse Pokemon marktplaats van Nederland.
        </p>

        {!showInput ? (
          <button onClick={() => setShowInput(true)} style={{ background: 'transparent', border: '1px solid #a67abf33', borderRadius: '4px', color: '#a67abf66', fontSize: '11px', cursor: 'pointer', letterSpacing: '4px', padding: '10px 24px', fontFamily: "'Orbitron', sans-serif", transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#a67abf'; e.currentTarget.style.color = '#a67abf'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#a67abf33'; e.currentTarget.style.color = '#a67abf66'; }}
          >
            UNLOCK
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <input autoFocus type="password" value={input} onChange={e => { setInput(e.target.value); setError(''); }} onKeyDown={e => e.key === 'Enter' && handleUnlock()} placeholder="ACCESS CODE" style={{ backgroundColor: '#0e0e15', border: '1px solid #a67abf', borderRadius: '4px', padding: '14px 20px', color: '#ffffff', fontSize: '14px', outline: 'none', width: '100%', maxWidth: '300px', textAlign: 'center', boxSizing: 'border-box', fontFamily: "'Orbitron', sans-serif", letterSpacing: '3px', boxShadow: '0 0 20px rgba(166,122,191,0.2)' }} />
            {error && <p style={{ color: '#ff6b6b', fontSize: '12px', margin: 0, fontFamily: "'Rajdhani', sans-serif", letterSpacing: '2px' }}>{error}</p>}
            <button onClick={handleUnlock} style={{ backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '4px', padding: '14px 40px', fontSize: '12px', fontWeight: '700', letterSpacing: '4px', cursor: 'pointer', fontFamily: "'Orbitron', sans-serif", boxShadow: '0 0 20px rgba(166,122,191,0.4)' }}>
              ENTER
            </button>
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '24px', fontSize: '10px', color: '#333', letterSpacing: '3px', zIndex: 3, fontFamily: "'Orbitron', sans-serif" }}>
        TOKYOTCG.NL
      </div>
    </div>
  );
}
