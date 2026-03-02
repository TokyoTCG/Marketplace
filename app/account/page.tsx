'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/SiteHeader'
import { useInactivityLogout } from '@/components/useInactivityLogout'

type Section = 'overview' | 'profile' | 'adres' | 'betalingen' | 'bestellingen' | 'verkopen' | 'beveiliging' | 'notificaties'

export default function Account() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  useInactivityLogout()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const container = document.getElementById('twinkle-container')
    if (!container) return
    container.innerHTML = ''
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
  }, [status])

  if (status === 'loading') return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }`}</style>
      <div id="twinkle-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
      <div style={{ color: '#a67abf', fontSize: '14px', letterSpacing: '2px', position: 'relative', zIndex: 1 }}>LADEN...</div>
    </div>
  )

  if (!session) return null

  const user = session.user
  const userName = user?.name || 'Gebruiker'
  const userEmail = user?.email || ''
  const userImage = user?.image || null
  const userInitial = userName.charAt(0).toUpperCase()
  const isGoogleUser = !!userImage

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setProfileImage(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: '#aaaaaa',
    letterSpacing: '1px',
    marginBottom: '6px',
  }

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

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1f1f21',
    border: '1px solid #2e2e31',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#aaaaaa',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #2e2e31',
  }

  const badgeStyle = (color: string): React.CSSProperties => ({
    display: 'inline-block',
    backgroundColor: color + '22',
    color: color,
    border: '1px solid ' + color + '44',
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  })

  const navItems: { id: Section; label: string }[] = [
    { id: 'overview',     label: 'Overzicht'     },
    { id: 'profile',      label: 'Profiel'        },
    { id: 'adres',        label: 'Adres'          },
    { id: 'betalingen',   label: 'Betalingen'     },
    { id: 'bestellingen', label: 'Bestellingen'   },
    { id: 'verkopen',     label: 'Mijn verkopen'  },
    { id: 'beveiliging',  label: 'Beveiliging'    },
    { id: 'notificaties', label: 'Notificaties'   },
  ]

  return (
    <div style={{ backgroundColor: '#1a1a1c', minHeight: '100vh', color: '#ffffff', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative' }}>
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }`}</style>
      <div id="twinkle-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ backgroundColor: '#a67abf', padding: '7px', textAlign: 'center', fontSize: '11px', letterSpacing: '2px', fontWeight: '700' }}>
          DE JAPANSE POKÉMON MARKTPLAATS VAN NEDERLAND
        </div>

        <SiteHeader activePage="account" />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px', display: 'flex', gap: '28px' }}>

          {/* SIDEBAR */}
          <aside style={{ width: '200px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '20px', backgroundColor: '#1f1f21', borderRadius: '12px', border: '1px solid #2e2e31', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #2e2e31', textAlign: 'center' }}>
                <div
                  style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#a67abf33', border: '2px solid #a67abf', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: '#a67abf', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => document.getElementById('profile-pic-input')?.click()}
                >
                  {profileImage
                    ? <img src={profileImage} alt="Profielfoto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : userImage
                      ? <img src={userImage} alt="Profielfoto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span>{userInitial}</span>}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', fontSize: '8px', color: '#fff', textAlign: 'center', padding: '2px 0', letterSpacing: '0.5px' }}>EDIT</div>
                  <input id="profile-pic-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileImageChange} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px', wordBreak: 'break-all' }}>{userEmail}</div>
                <div style={{ marginTop: '8px' }}>
                  <span style={badgeStyle('#64b5f6')}>
                    {isGoogleUser ? '✓ Ingelogd met Google' : '✓ Ingelogd via e-mail'}
                  </span>
                </div>
              </div>
              <div style={{ padding: '6px' }}>
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActiveSection(item.id)}
                    style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '9px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeSection === item.id ? '700' : '400', backgroundColor: activeSection === item.id ? '#a67abf22' : 'transparent', color: activeSection === item.id ? '#a67abf' : '#aaaaaa', textAlign: 'left' }}>
                    {item.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '12px', borderTop: '1px solid #2e2e31' }}>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #3a3a3d', backgroundColor: 'transparent', color: '#ff6b6b', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                  Uitloggen
                </button>
              </div>
            </div>
          </aside>

          <main style={{ flex: 1, minWidth: 0 }}>

            {/* OVERZICHT */}
            {activeSection === 'overview' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Welkom terug, {userName} <span style={{ color: '#a67abf', fontSize: '20px' }}>ᯓ★</span></h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Hier is een overzicht van je account.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
                  {[
                    { label: 'Actieve listings', value: '0' },
                    { label: 'Verkopen totaal', value: '0' },
                    { label: 'Aankopen totaal', value: '0' },
                    { label: 'Beoordeling', value: '—' },
                  ].map(stat => (
                    <div key={stat.label} style={{ backgroundColor: '#1f1f21', border: '1px solid #2e2e31', borderRadius: '12px', padding: '18px' }}>
                      <div style={{ fontSize: '24px', fontWeight: '800', color: (stat.value !== '0' && stat.value !== '—') ? '#a67abf' : '#555' }}>{stat.value}</div>
                      <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>RECENTE ACTIVITEIT</div>
                  <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>Nog geen activiteit. Begin met kopen of verkopen!</div>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>ACCOUNT INFO</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#888' }}>Gebruikersnaam</span>
                      <span>{userName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#888' }}>E-mail</span>
                      <span>{userEmail}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#888' }}>Inlogmethode</span>
                      <span style={badgeStyle('#64b5f6')}>{isGoogleUser ? '✓ Google' : '✓ E-mail'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFIEL */}
            {activeSection === 'profile' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Profiel</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Je publieke profielinformatie.</p>
                <div style={cardStyle}>
                  <div style={sectionTitle}>PERSOONLIJKE GEGEVENS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div><label style={labelStyle}>VOORNAAM</label><input style={inputStyle} placeholder="Jan" /></div>
                    <div><label style={labelStyle}>ACHTERNAAM</label><input style={inputStyle} placeholder="de Vries" /></div>
                    <div><label style={labelStyle}>GEBRUIKERSNAAM</label><input style={inputStyle} defaultValue={userName} /></div>
                    <div><label style={labelStyle}>GEBOORTEDATUM</label><input type="date" style={inputStyle} /></div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>BIO (OPTIONEEL)</label>
                      <textarea style={{ ...inputStyle, height: '80px', resize: 'none' }} placeholder="Vertel iets over jezelf als TCG-handelaar..." />
                    </div>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>CONTACT</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div>
                      <label style={labelStyle}>E-MAILADRES</label>
                      <input type="email" style={{ ...inputStyle, color: '#888' }} value={userEmail} readOnly />
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                        {isGoogleUser ? 'Beheerd via Google' : 'Inloggen via e-mail'}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>TELEFOONNUMMER</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ ...inputStyle, width: '80px', flexShrink: 0, backgroundColor: '#1f1f21', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>NL +31</div>
                        <input type="tel" style={inputStyle} placeholder="6 12345678" />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' }}>OPSLAAN</button>
                  <button style={{ backgroundColor: 'transparent', color: '#aaa', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '12px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Annuleren</button>
                </div>
              </div>
            )}

            {/* ADRES */}
            {activeSection === 'adres' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Adres</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Wordt gebruikt voor verzending en facturatie. Alleen Nederland.</p>
                <div style={cardStyle}>
                  <div style={sectionTitle}>VERZENDADRES</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>STRAATNAAM</label><input style={inputStyle} placeholder="Kalverstraat" /></div>
                    <div><label style={labelStyle}>HUISNUMMER</label><input style={inputStyle} placeholder="12" /></div>
                    <div><label style={labelStyle}>TOEVOEGING (OPTIONEEL)</label><input style={inputStyle} placeholder="A" /></div>
                    <div><label style={labelStyle}>POSTCODE</label><input style={inputStyle} placeholder="1234 AB" /></div>
                    <div><label style={labelStyle}>STAD</label><input style={inputStyle} placeholder="Amsterdam" /></div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>LAND</label>
                      <div style={{ ...inputStyle, backgroundColor: '#1f1f21', color: '#aaa', display: 'flex', alignItems: 'center' }}>Nederland</div>
                    </div>
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={sectionTitle}>FACTURATIEADRES</div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#aaa', cursor: 'pointer', marginBottom: '10px' }}>
                      <input type="checkbox" defaultChecked /> Zelfde als verzendadres
                    </label>
                  </div>
                  <div style={{ color: '#555', fontSize: '13px' }}>Vink uit om een apart facturatieadres in te vullen.</div>
                </div>
                <button style={{ backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' }}>OPSLAAN</button>
              </div>
            )}

            {/* BETALINGEN */}
            {activeSection === 'betalingen' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Betalingen</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Beheer je betaalmethoden en bankgegevens voor uitbetalingen.</p>
                <div style={cardStyle}>
                  <div style={sectionTitle}>BETAALMETHODEN (KOPER)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { symbol: 'iD', name: 'iDEAL', desc: 'Directe bankoverschrijving' },
                      { symbol: 'CC', name: 'Creditcard', desc: 'Visa / Mastercard' },
                      { symbol: 'PP', name: 'PayPal', desc: 'Snel en veilig betalen' },
                    ].map(method => (
                      <div key={method.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#2b2b2e', borderRadius: '8px', padding: '14px 16px', border: '1px solid #3a3a3d' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#3a3a3d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#aaa', flexShrink: 0 }}>{method.symbol}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>{method.name}</div>
                          <div style={{ fontSize: '11px', color: '#888' }}>{method.desc}</div>
                        </div>
                        <span style={badgeStyle('#64b5f6')}>Beschikbaar</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>UITBETALINGEN (VERKOPER)</div>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>Vul je IBAN in om verkoopontvangsten te ontvangen.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>IBAN</label><input style={inputStyle} placeholder="NL91 ABNA 0417 1643 00" /></div>
                    <div><label style={labelStyle}>NAAM REKENINGHOUDER</label><input style={inputStyle} placeholder="Jan de Vries" /></div>
                    <div><label style={labelStyle}>BIC / SWIFT</label><input style={inputStyle} placeholder="ABNANL2A" /></div>
                  </div>
                  <div style={{ marginTop: '16px', backgroundColor: '#a67abf11', border: '1px solid #a67abf33', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: '#a67abf' }}>
                    Uitbetalingen worden verwerkt binnen 3-5 werkdagen na bevestiging van de bestelling.
                  </div>
                  <button style={{ marginTop: '16px', backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' }}>OPSLAAN</button>
                </div>
              </div>
            )}

            {/* BESTELLINGEN */}
            {activeSection === 'bestellingen' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Bestellingen</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Een overzicht van al je aankopen.</p>
                <div style={cardStyle}>
                  <div style={sectionTitle}>ACTIEVE BESTELLINGEN</div>
                  <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>Je hebt nog geen bestellingen geplaatst.</div>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>BESTELHISTORIE</div>
                  <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>Geen eerdere bestellingen gevonden.</div>
                </div>
              </div>
            )}

            {/* VERKOPEN */}
            {activeSection === 'verkopen' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Mijn verkopen</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Beheer je actieve listings en verkoophistorie.</p>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <a href="/listings/new" style={{ backgroundColor: '#a67abf', color: '#fff', borderRadius: '8px', padding: '10px 20px', fontWeight: '700', fontSize: '13px', textDecoration: 'none', letterSpacing: '1px' }}>+ KAART VERKOPEN</a>
                  <a href="/listings/new-psa" style={{ backgroundColor: '#2b2b2e', color: '#fff', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '13px', textDecoration: 'none' }}>+ PSA KAART VERKOPEN</a>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>ACTIEVE LISTINGS</div>
                  <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>Je hebt nog geen actieve listings.</div>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>VERKOOPHISTORIE</div>
                  <div style={{ color: '#555', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>Geen eerdere verkopen gevonden.</div>
                </div>
                <div style={cardStyle}>
                  <div style={sectionTitle}>VAKANTIE MODUS</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Tijdelijk stoppen met verkopen</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>Je listings blijven bewaard maar zijn niet zichtbaar voor kopers.</div>
                    </div>
                    <button style={{ backgroundColor: '#2b2b2e', color: '#aaa', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '10px 18px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Activeren</button>
                  </div>
                </div>
              </div>
            )}

            {/* BEVEILIGING */}
            {activeSection === 'beveiliging' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Beveiliging</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Houd je account veilig.</p>
                <div style={cardStyle}>
                  <div style={sectionTitle}>INLOGMETHODE</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{isGoogleUser ? 'Google Account' : 'E-mail (verificatiecode)'}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{userEmail}</div>
                    </div>
                    <span style={badgeStyle('#64b5f6')}>✓ Actief</span>
                  </div>
                  <div style={{ marginTop: '14px', backgroundColor: '#2b2b2e', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: '#888' }}>
                    {isGoogleUser
                      ? 'Je account is beveiligd via Google. Wachtwoordbeheer loopt via je Google account.'
                      : 'Je logt in via een verificatiecode per e-mail. Geen wachtwoord nodig.'}
                  </div>
                </div>
                <div style={{ ...cardStyle, borderColor: '#ff6b6b44' }}>
                  <div style={{ ...sectionTitle, color: '#ff6b6b', borderBottomColor: '#ff6b6b22' }}>GEVAARZONE</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Account verwijderen</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>Dit kan niet ongedaan worden gemaakt. Al je listings worden verwijderd.</div>
                    </div>
                    <button style={{ backgroundColor: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '8px', padding: '10px 18px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>Verwijderen</button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIES */}
            {activeSection === 'notificaties' && (
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>Notificaties</h1>
                <p style={{ color: '#aaaaaa', marginBottom: '28px', fontSize: '14px' }}>Bepaal wanneer en hoe je berichten ontvangt.</p>
                <div style={cardStyle}>
                  <div style={sectionTitle}>E-MAIL NOTIFICATIES</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: 'Nieuwe bestelling ontvangen', desc: 'Als een koper een van jouw listings koopt.', on: true },
                      { label: 'Bestelling verzonden', desc: 'Als een verkoper je bestelling heeft verzonden.', on: true },
                      { label: 'Betaling ontvangen', desc: 'Als een betaling op je rekening is bijgeschreven.', on: true },
                      { label: 'Nieuwe beoordeling', desc: 'Als iemand je beoordeeld heeft.', on: true },
                      { label: 'Nieuw bericht', desc: 'Als iemand je een bericht stuurt.', on: true },
                      { label: 'Aanbiedingen & nieuws', desc: 'Updates over Tokyo TCG en nieuwe kaarten.', on: false },
                    ].map((item, i, arr) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #2e2e31' : 'none' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600' }}>{item.label}</div>
                          <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.desc}</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', flexShrink: 0, marginLeft: '16px' }}>
                          <input type="checkbox" defaultChecked={item.on} style={{ opacity: 0, width: 0, height: 0 }} />
                          <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: item.on ? '#a67abf' : '#3a3a3d', borderRadius: '22px' }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <button style={{ backgroundColor: '#a67abf', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' }}>OPSLAAN</button>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
