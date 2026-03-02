'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Welcome() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
  }, [])

  return (
    <div style={{
      backgroundColor: '#0a0a0c',
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(80px) rotate(5deg); }
          to { opacity: 1; transform: translateX(0) rotate(5deg); }
        }
        @keyframes bobRight {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-18px) rotate(5deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .clefairy {
          position: absolute;
          right: 6%;
          top: 50%;
          transform: translateY(-50%) rotate(5deg);
          width: clamp(180px, 22vw, 340px);
          opacity: 0;
          filter: drop-shadow(0 0 40px rgba(166,122,191,0.5));
          animation: slideInRight 1s cubic-bezier(0.22,1,0.36,1) 0.4s forwards,
                     bobRight 4.5s ease-in-out 1.4s infinite;
          z-index: 2;
        }
        .clefairy-glow {
          position: absolute;
          right: 3%;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(240px, 30vw, 460px);
          height: clamp(240px, 30vw, 460px);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(166,122,191,0.35) 0%, rgba(120,60,180,0.2) 40%, transparent 70%);
          filter: blur(30px);
          animation: pulseGlow 4s ease-in-out infinite;
          z-index: 1;
          pointer-events: none;
        }
        .star {
          position: absolute;
          animation: twinkle var(--dur) ease-in-out var(--delay) infinite;
          font-size: var(--size);
          color: var(--color);
          pointer-events: none;
          z-index: 0;
        }
        .title {
          font-family: 'Space Mono', monospace;
          font-size: clamp(26px, 3.6vw, 56px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 16px;
          animation: fadeUp 0.8s ease 0.8s both;
          letter-spacing: -1px;
        }
        .subtitle {
          font-family: 'Space Mono', monospace;
          font-size: clamp(12px, 1.2vw, 15px);
          color: #888;
          animation: fadeUp 0.8s ease 1s both;
          margin-bottom: 48px;
          letter-spacing: 0px;
          line-height: 1.7;
          max-width: 480px;
        }
        .wat-label {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #a67abf;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
          animation: fadeUp 0.8s ease 1.1s both;
        }
        .btn {
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          padding: 14px 32px;
          border-radius: 6px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s;
          letter-spacing: 0.5px;
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(166,122,191,0.4);
        }
        .btn-primary {
          background-color: #a67abf;
          color: #ffffff;
          border: 2px solid #a67abf;
          animation: fadeUp 0.8s ease 1.2s both;
        }
        .btn-primary:hover { background-color: #b98fd4; border-color: #b98fd4; }
        .btn-secondary {
          background-color: transparent;
          color: #ffffff;
          border: 2px solid #3a3a3d;
          animation: fadeUp 0.8s ease 1.3s both;
        }
        .btn-secondary:hover { border-color: #a67abf; }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
      `}</style>

      {/* Glow orbs */}
      <div className="glow-orb" style={{ width: 500, height: 500, backgroundColor: 'rgba(166,122,191,0.08)', top: '0%', left: '-5%', zIndex: 0 }} />
      <div className="glow-orb" style={{ width: 300, height: 300, backgroundColor: 'rgba(100,60,180,0.08)', bottom: '10%', left: '30%', zIndex: 0 }} />

      {/* Stars */}
      {[
        { top: '20%', left: '8%',  size: '16px', color: '#e0c8ff', delay: '0s',   dur: '2.2s' },
        { top: '35%', left: '22%', size: '12px', color: '#ffffff', delay: '0.7s', dur: '1.8s' },
        { top: '60%', left: '12%', size: '14px', color: '#c9a0f5', delay: '1s',   dur: '2s'   },
        { top: '75%', left: '35%', size: '10px', color: '#e0c8ff', delay: '0.3s', dur: '2.5s' },
        { top: '15%', left: '45%', size: '12px', color: '#ffffff', delay: '1.3s', dur: '2.1s' },
        { top: '80%', left: '55%', size: '14px', color: '#c9a0f5', delay: '0.5s', dur: '1.9s' },
        { top: '25%', right: '38%',size: '10px', color: '#e0c8ff', delay: '0.8s', dur: '2.3s' },
      ].map((s, i) => (
        <div key={i} className="star" style={{ top: s.top, left: s.left, right: s.right, bottom: s.bottom, '--size': s.size, '--color': s.color, '--delay': s.delay, '--dur': s.dur } as React.CSSProperties}>✦</div>
      ))}

      {/* Clefairy glow */}
      <div className="clefairy-glow" />

      {/* Clefairy */}
      <img
        className="clefairy"
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png"
        alt="Clefairy"
      />

      {/* Left content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        padding: '0 6% 0 7%',
        maxWidth: '55%',
      }}>
        <img src="/logo.png" alt="Tokyo TCG" style={{
          height: '70px',
          width: 'auto',
          marginBottom: '28px',
          animation: 'fadeUp 0.8s ease 0.5s both',
          filter: 'drop-shadow(0 4px 20px rgba(166,122,191,0.6))',
          alignSelf: 'flex-start',
        }} />

        <h1 className="title">Dé Japanse Pokémon<br />marktplaats van Nederland.</h1>
        <p className="subtitle">Koop en verkoop Japanse Pokémon kaarten eenvoudig en veilig. Van AR's tot zeldzame PSA-graded exemplaren.</p>

        <div className="wat-label">Wat wil je doen?</div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => router.push('/choose')}>
            Kopen
          </button>
          <button className="btn btn-secondary" onClick={() => router.push('/sell-choose')}>
            Verkopen
          </button>
        </div>
      </div>
    </div>
  )
}
