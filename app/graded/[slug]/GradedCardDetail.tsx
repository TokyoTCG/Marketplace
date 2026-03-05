'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PSA_GRADES = ['PSA 10', 'PSA 9', 'PSA 8', 'PSA 7', 'PSA 6', 'PSA 5', 'PSA 4', 'PSA 3', 'PSA 2', 'PSA 1'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
        <p style={{ color: '#aaa', margin: '0 0 4px' }}>{label}</p>
        <p style={{ color: '#a67abf', margin: 0, fontWeight: 700 }}>€{payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function GradedCardDetail({ card }: { card: any }) {
  const [activeGrade, setActiveGrade] = useState('All');
  const [hovered, setHovered] = useState<number | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [priceData, setPriceData] = useState<{ date: string; raw: number }[]>([]);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings?cardSlug=' + card.slug + '&graded=true')
      .then(r => r.json())
      .then(d => setListings(d.listings || []))
      .catch(() => setListings([]));
  }, [card.slug]);

  useEffect(() => {
    setPriceLoading(true);
    const gradeParam = activeGrade !== 'All' ? `&grade=${encodeURIComponent(activeGrade)}` : '';
    fetch(`/api/ebay/sold-prices?card=${encodeURIComponent(card.name)}&set=${encodeURIComponent(card.set)}&slug=${card.slug}-graded&graded=true${gradeParam}`)
      .then(r => r.json())
      .then(d => {
        const prices = d.prices || [];
        if (prices.length === 0) {
          setPriceData([]);
          setPriceLoading(false);
          return;
        }

        // Group by month and average
        const grouped: Record<string, number[]> = {};
        prices.forEach((p: any) => {
          const date = new Date(p.sold_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(p.price);
        });

        const chartData = Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, vals]) => {
            const [year, month] = key.split('-').map(Number);
            const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
            return { date: MONTH_LABELS[month], raw: parseFloat(avg.toFixed(2)) };
          });

        setPriceData(chartData);
        setPriceLoading(false);
      })
      .catch(() => setPriceLoading(false));
  }, [card.slug, activeGrade]);

  const firstPrice = priceData[0]?.raw ?? 0;
  const lastPrice = priceData[priceData.length - 1]?.raw ?? 0;
  const priceDiff = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice * 100).toFixed(1) : '0.0';
  const priceUp = lastPrice >= firstPrice;

  const filtered = activeGrade === 'All' ? listings : listings.filter(l => l.condition === activeGrade);
  const sorted = [...filtered].sort((a, b) => a.price - b.price);
  const lowestPrice = sorted.length > 0 ? Math.min(...sorted.map((l: any) => l.price)) : null;
  const numberOnly = card.number ? card.number.split(' ')[0] : '';

  return (
    <div style={{ background: '#1a1a1c', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: '#a67abf', padding: 7, textAlign: 'center', fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>
        DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
      </div>
      <header style={{ background: '#1f1f21', borderBottom: '1px solid #2e2e31', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <a href="/"><img src="/logo.png" alt="Tokyo TCG" style={{ height: 64 }} /></a>
          <nav style={{ display: 'flex', gap: 28, fontSize: 13, fontWeight: 500 }}>
            <a href="/choose" style={{ color: '#a67abf', textDecoration: 'none', borderBottom: '2px solid #a67abf', paddingBottom: 4 }}>Kopen</a>
            <a href="/sell-choose" style={{ color: '#aaa', textDecoration: 'none' }}>Verkopen</a>
            <a href="/login" style={{ color: '#aaa', textDecoration: 'none' }}>Login</a>
          </nav>
        </div>
      </header>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '14px 32px', fontSize: 12, color: '#666', display: 'flex', gap: 6 }}>
        <a href="/graded" style={{ color: '#aaa', textDecoration: 'none' }}>Graded</a>
        <span>›</span>
        <a href={'/graded#' + card.set.toLowerCase().replace(/ /g, '-')} style={{ color: '#aaa', textDecoration: 'none' }}>{card.set}</a>
        <span>›</span>
        <span style={{ color: '#a67abf' }}>{card.name}</span>
      </div>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px 64px', display: 'flex', gap: 28 }}>
        {/* Left */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <div style={{ borderRadius: 12, background: '#1f1f21', border: '1px solid #2e2e31', overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ padding: 8 }}>
              <img src={card.image} alt={card.name} style={{ width: '100%', display: 'block', borderRadius: 8 }} />
            </div>
          </div>
          <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Kaartinfo</div>
            {[
              ['Set', card.set],
              ['Nummer', numberOnly],
              ['Type', card.type],
              ['Fase', card.stage],
              ['Herkomst', 'Japan'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 7 }}>
                <span style={{ color: '#666' }}>{label}</span>
                <span style={{ color: '#ddd', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: '#a67abf', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                {card.set} · PSA Graded
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 3px', letterSpacing: '-0.01em' }}>{card.name}</h1>
              <div style={{ fontSize: 12, color: '#555' }}>{card.nameJP} · {card.nameRoman}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>Laagste prijs</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{lowestPrice !== null ? '€' + lowestPrice.toFixed(2) : '—'}</div>
              <div style={{ fontSize: 11, color: priceUp ? '#4ade80' : '#f87171', marginTop: 2 }}>
                {priceUp ? '▲' : '▼'} {priceUp ? '+' : ''}{priceDiff}% afgelopen maand
              </div>
            </div>
          </div>
          <div style={{ background: '#1f1f21', border: '1px solid #2e2e31', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Prijsontwikkeling</div>
              <div style={{ fontSize: 11, color: '#666' }}>
                {activeGrade === 'All' ? 'Alle PSA grades · eBay' : `${activeGrade} · eBay`} · 12 maanden
              </div>
            </div>
            {priceLoading ? (
              <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 12 }}>
                Prijzen laden...
              </div>
            ) : priceData.length === 0 ? (
              <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 12 }}>
                Nog geen verkoopdata beschikbaar.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={priceData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e31" />
                  <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#555', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => '€' + v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="raw" stroke="#a67abf" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                Aanbiedingen <span style={{ color: '#666', fontWeight: 400, fontSize: 12 }}>({sorted.length})</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['All', ...PSA_GRADES].map(g => (
                  <button key={g} onClick={() => setActiveGrade(g)} style={{
                    background: activeGrade === g ? '#a67abf' : '#1f1f21',
                    border: '1px solid',
                    borderColor: activeGrade === g ? '#a67abf' : '#2e2e31',
                    borderRadius: 6, color: activeGrade === g ? '#fff' : '#888',
                    fontSize: 11, fontWeight: 600, padding: '4px 10px', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 120px', padding: '7px 12px', fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid #2e2e31' }}>
              <span>Verkoper</span><span>Grade</span><span>Prijs</span><span></span>
            </div>
            {sorted.length === 0 ? (
              <div style={{ padding: '32px 12px', textAlign: 'center', color: '#555', fontSize: 13 }}>
                Nog geen aanbiedingen voor deze kaart.
              </div>
            ) : (
              sorted.map((l, i) => (
                <div key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 140px 120px 120px', padding: '11px 12px', borderBottom: '1px solid #1f1f21', alignItems: 'center', borderRadius: 8, background: hovered === i ? '#1f1f21' : 'transparent', transition: 'background 0.1s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'hsl(' + ((l.username || 'A').charCodeAt(0) * 17 % 360) + ', 30%, 28%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#ccc', flexShrink: 0 }}>
                      {(l.username || '?')[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {l.username || 'Onbekend'}
                      {l.verified && <span style={{ marginLeft: 5, fontSize: 10, color: '#a67abf' }}>✓</span>}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a67abf', background: '#a67abf18', border: '1px solid #a67abf40', borderRadius: 5, padding: '2px 10px', display: 'inline-block', whiteSpace: 'nowrap', width: 'fit-content' }}>
                    {l.condition}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>€{l.price.toFixed(2)}</span>
                  <button style={{ background: '#a67abf', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, padding: '7px 0', cursor: 'pointer', width: '100%' }}>
                    Kopen →
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
