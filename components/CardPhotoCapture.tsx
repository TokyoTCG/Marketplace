'use client'
import { useState } from 'react'

interface Props {
  onPhotosReady: (front: string, back: string, fromCamera: boolean) => void
}

export default function CardPhotoCapture({ onPhotosReady }: Props) {
  const [uploadFront, setUploadFront] = useState<string | null>(null)
  const [uploadBack, setUploadBack] = useState<string | null>(null)

  function handleUpload(side: 'front' | 'back', file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (side === 'front') setUploadFront(result)
      else setUploadBack(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {/* FRONT */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: uploadFront ? '#4ade80' : '#a67abf', marginBottom: '6px', letterSpacing: '1px' }}>
            {uploadFront ? '✓ VOORKANT' : '* VOORKANT'}
          </div>
          {uploadFront ? (
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4' }}>
              <img src={uploadFront} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Voorkant" />
              <button onClick={() => setUploadFront(null)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>×</button>
            </div>
          ) : (
            <div onClick={() => document.getElementById('upload-front')?.click()}
              style={{ border: '2px dashed #3a3a3d', borderRadius: '8px', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '12px', gap: '8px' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#a67abf'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#3a3a3d'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div>Voorkant</div>
            </div>
          )}
          <input id="upload-front" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleUpload('front', e.target.files[0])} />
        </div>

        {/* BACK */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: uploadBack ? '#4ade80' : '#a67abf', marginBottom: '6px', letterSpacing: '1px' }}>
            {uploadBack ? '✓ ACHTERKANT' : '* ACHTERKANT'}
          </div>
          {uploadBack ? (
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '3/4' }}>
              <img src={uploadBack} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Achterkant" />
              <button onClick={() => setUploadBack(null)} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>×</button>
            </div>
          ) : (
            <div onClick={() => document.getElementById('upload-back')?.click()}
              style={{ border: '2px dashed #3a3a3d', borderRadius: '8px', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', fontSize: '12px', gap: '8px' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#a67abf'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#3a3a3d'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div>Achterkant</div>
            </div>
          )}
          <input id="upload-back" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleUpload('back', e.target.files[0])} />
        </div>
      </div>

      <div style={{ fontSize: '10px', color: '#555', marginBottom: '10px' }}>
        Geüploade foto's worden ter verificatie naar Tokyo TCG gestuurd.
      </div>

      {uploadFront && uploadBack && (
        <button onClick={() => onPhotosReady(uploadFront, uploadBack, false)}
          style={{ width: '100%', background: '#4ade80', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: '#000', letterSpacing: '1px' }}>
          FOTO'S BEVESTIGEN
        </button>
      )}
    </div>
  )
}
