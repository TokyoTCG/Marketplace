export default function SuccessPage() {
  return (
    <main style={{maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center'}}>
      <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>🎉 Payment Successful!</h1>
      <p style={{color: '#6b7280', marginBottom: '2rem'}}>Your order has been placed. The seller will be in touch shortly.</p>
      <a href="/listings" style={{backgroundColor: '#1d4ed8', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>Back to Listings</a>
    </main>
  )
}