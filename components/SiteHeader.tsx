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

  useEffect(() => {
    setCachedLoggedIn(localStorage.getItem('wasLoggedIn') === 'true')
    setCachedInitial(localStorage.getItem('userInitial') || '')
    setCachedImage(localStorage.getItem('userImage') || '')
    setMounted(true)
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

  const renderNav = () => {
    if (alwaysLoggedOut) {
      return <a href="/login" style={{ color: '#aaaaaa', textDecoration: 'none', fontWeight: '500' }}>Login</a>
    }
    if (!mounted) {
      return <div style={{ width: '38px' }} />
    }
    const loggedIn = status === 'loading' ? cachedLoggedIn : !!session
    if (loggedIn) {
      return (
        <a href="/account" title={userName} style={avatarStyle}>
          {userImage
            ? <img src={userImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : userInitial}
        </a>
      )
    }
    return <a href="/login" style={{ color: '#aaaaaa', textDecoration: 'none', fontWeight: '500' }}>Login</a>
  }

  return (
    <header style={{ backgroundColor: '#1f1f21', borderBottom: '1px solid #2e2e31', padding: '0 32px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <a href="/"><img src="/logo.png" alt="Tokyo TCG" style={{ height: '64px', width: 'auto' }} /></a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '13px', fontWeight: '500' }}>
          <a href="/choose" style={linkStyle('kopen')}>Kopen</a>
          <a href="/sell-choose" style={linkStyle('verkopen')}>Verkopen</a>
          {renderNav()}
        </nav>
      </div>
    </header>
  )
}
