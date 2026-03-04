'use client'
import { useSession } from 'next-auth/react'
import { useInactivityLogout } from './useInactivityLogout'
import { useState, useEffect } from 'react'

interface SiteHeaderProps {
  activePage?: 'kopen' | 'verkopen' | 'account'
  alwaysLoggedOut?: boolean
}

export default function SiteHeader({ activePage, alwaysLoggedOut }: SiteHeaderProps) {
  const { data: session, status } = useSession()
  useInactivityLogout()
  const [mounted, setMounted] = useState(false)
  const [cachedLoggedIn, setCachedLoggedIn] = useState(false)
  const [cachedInitial, setCachedInitial] = useState('')
  const [cachedImage, setCachedImage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setCachedLoggedIn(localStorage.getItem('wasLoggedIn') === 'true')
    setCachedInitial(localStorage.getItem('userInitial') || '')
    setCachedImage(localStorage.getItem('userImage') || '')
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const name = session.user.name || 'Gebruiker'
      localStorage.setItem('wasLoggedIn', 'true')
      localStorage.setItem('userInitial', name.charAt(0).toUpperCase())
      localStorage.setItem('userImage', session.user.image || '')
    }
    if (status === 'unauthenticated') {
      localStorage.removeItem('wasLoggedIn')
      localStorage.removeItem('userInitial')
      localStorage.removeItem('userImage')
    }
  }, [status, session])

  const user = session?.user
  const userName = user?.name || 'Gebruiker'
  const userImage = user?.image || cachedImage || null
  const userInitial = user ? userName.charAt(0).toUpperCase() : cachedInitial
  const loggedIn = !mounted ? cachedLoggedIn : (status === 'loading' ? cachedLoggedIn : !!session)

  const linkStyle = (page: string): React.CSSProperties => ({
    color: activePage === page ? '#a67abf' : '#aaaaaa',
    textDecoration: 'none',
    borderBottom: activePage === page ? '2px solid #a67abf' : 'none',
    paddingBottom: activePage === page ? '4px' : '0',
  })

  const avatarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#a67abf33',
    border: '2px solid #a67abf',
    fontSize: '15px',
    fontWeight: '800',
    color: '#a67abf',
    textDecoration: 'none',
    overflow: 'hidden',
    flexShrink: 0,
    outline: activePage === 'account' ? '2px solid #a67abf' : 'none',
    outlineOffset: '2px',
  }

  const renderAvatar = () => {
    if (alwaysLoggedOut) return <a href="/login" style={{ color: '#aaaaaa', textDecoration: 'none', fontWeight: '500' }}>Login</a>
    if (!mounted) return <div style={{ width: '38px' }} />
    if (loggedIn) {
      return (
        <a href="/account" title={userName} style={avatarStyle}>
          {userImage ? <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userInitial}
        </a>
      )
    }
    return <a href="/login" style={{ color: '#aaaaaa', textDecoration: 'none', fontWeight: '500' }}>Login</a>
  }

  return (
    <>
      <header style={{ backgroundColor: '#1f1f21', borderBottom: '1px solid #2e2e31', padding: '0 20px', position: 'relative', zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <a href="/"><img src="/logo.png" alt="Tokyo TCG" style={{ height: '48px', width: 'auto' }} /></a>

          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '13px', fontWeight: '500' }}>
              <a href="/choose" style={linkStyle('kopen')}>Kopen</a>
              <a href="/sell-choose" style={linkStyle('verkopen')}>Verkopen</a>
              {renderAvatar()}
            </nav>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#aaaaaa' }}>
              {menuOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      {isMobile && menuOpen && (
        <div style={{ backgroundColor: '#1f1f21', borderBottom: '1px solid #2e2e31', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '15px', fontWeight: '500', zIndex: 99, position: 'relative' }}>
          <a href="/choose" style={{ color: activePage === 'kopen' ? '#a67abf' : '#aaaaaa', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Kopen</a>
          <a href="/sell-choose" style={{ color: activePage === 'verkopen' ? '#a67abf' : '#aaaaaa', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Verkopen</a>
          {loggedIn
            ? <a href="/account" style={{ color: '#a67abf', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Mijn Account</a>
            : <a href="/login" style={{ color: '#aaaaaa', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Login</a>
          }
        </div>
      )}
    </>
  )
}
