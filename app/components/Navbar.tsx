'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <nav style={{backgroundColor: '#1d4ed8', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <a href="/" style={{color: 'white', fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none'}}>🎴 TokyoTCG</a>
      <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
        <a href="/listings" style={{color: 'white', textDecoration: 'none'}}>Kopen</a>
        {user ? (
          <>
            <a href="/sell-choose" style={{color: 'white', textDecoration: 'none'}}>Verkopen</a>
            <button onClick={handleLogout} style={{backgroundColor: 'white', color: '#1d4ed8', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Uitloggen</button>
          </>
        ) : (
          <a href="/login" style={{backgroundColor: 'white', color: '#1d4ed8', padding: '0.4rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold'}}>Inloggen</a>
        )}
      </div>
    </nav>
  )
}