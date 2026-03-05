'use client'
import { useRef, useState } from 'react'

interface Props {
  onPhotosReady: (front: string, back: string, fromCamera: boolean) => void
}

export default function CardPhotoCapture({ onPhotosReady }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [step, setStep] = useState<'idle' | 'front' | 'back' | 'review'>('idle')
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null)
  const [backPhoto, setBackPhoto] = useState<string | null>(null)
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null)
  const [uploadFront, setUploadFront] = useState<string | null>(null)
  const [uploadBack, setUploadBack] = useState<string | null>(null)

  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setStream(s)
      if (videoRef.current) videoRef.current.srcObject = s
      setStep('front')
    } catch {
      alert('Kan camera niet openen. Geef camera toegang in je browser.')
    }
  }

  function capture() {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    if (step === 'front') { setFrontPhoto(dataUrl); setStep('back') }
    else if (step === 'back') { setBackPhoto(dataUrl); setStep('review'); stream?.getTracks().forEach(t => t.stop()); setStream(null) }
  }

  function handleUpload(side: 'front' | 'back', file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (side === 'front') setUploadFront(result)
      else setUploadBack(result)
    }
    reader.readAsDataURL(file)
  }

  function reset() {
    setStep('idle'); setMode(null); setFrontPhoto(null); setBackPhoto(null)
    setUploadFront(null); setUploadBack(null)
    stream?.getTracks().forEach(t => t.stop()); setStream(null)
  }

  // IDLE
  if (step === 'idle' && !mode) {
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => { setMode('camera'); startCamera(); }}
            style={{ background: '#a67abf18', border: '1px solid #a67abf40', borderRadius: '10px', padding: '24px 8px', cursor: 'pointer', color: '#fff', textAlign: 'center' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#a67abf'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#a67abf40'}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>Camera</div>
          </button>
          <button
            onClick={() => setMode('upload')}
            style={{ background: '#1f1f21', border: '1px solid #3a3a3d', borderRadius: '10px', padding: '24px 8px', cursor: 'pointer', color: '#fff', textAlign: 'center' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#a67abf'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#3a3a3d'}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>Uploaden</div>
          </button>
        </div>
      </div>
    )
  }

  // UPLOAD MODE
  if (mode === 'upload') {
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
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
        {uploadFront && uploadBack && (
          <button onClick={() => onPhotosReady(uploadFront, uploadBack, false)}
            style={{ width: '100%', background: '#4ade80', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: '#000', letterSpacing: '1px', marginBottom: '8px' }}>
            FOTO'S BEVESTIGEN
          </button>
        )}
        <button onClick={reset} style={{ width: '100%', background: 'transparent', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '8px', color: '#666', fontSize: '12px', cursor: 'pointer' }}>
          Terug
        </button>
      </div>
    )
  }

  // CAMERA - shooting
  if (step === 'front' || step === 'back') {
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          Stap {step === 'front' ? '1' : '2'} van 2 — <strong style={{ color: '#a67abf' }}>{step === 'front' ? 'Voorkant' : 'Achterkant'}</strong>
        </div>
        <div style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#000' }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', display: 'block', borderRadius: '12px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
            {step === 'front' ? 'VOORKANT' : 'ACHTERKANT'}
          </div>
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)' }}>
            <button onClick={capture} style={{ background: '#a67abf', border: '3px solid #fff', borderRadius: '50%', width: '64px', height: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>
        </div>
        <button onClick={reset} style={{ width: '100%', background: 'transparent', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '8px', color: '#666', fontSize: '12px', cursor: 'pointer', marginTop: '8px' }}>
          Terug
        </button>
      </div>
    )
  }

  // CAMERA - review
  if (step === 'review' && frontPhoto && backPhoto) {
    return (
      <div style={{ marginTop: '8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img src={frontPhoto} style={{ width: '100%', borderRadius: '8px', aspectRatio: '3/4', objectFit: 'cover' }} alt="Voorkant" />
            <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', color: '#fff', fontWeight: '700' }}>VOORKANT</div>
            <button onClick={() => { setFrontPhoto(null); setStep('front'); startCamera(); }} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>↺</button>
          </div>
          <div style={{ position: 'relative' }}>
            <img src={backPhoto} style={{ width: '100%', borderRadius: '8px', aspectRatio: '3/4', objectFit: 'cover' }} alt="Achterkant" />
            <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', color: '#fff', fontWeight: '700' }}>ACHTERKANT</div>
            <button onClick={() => { setBackPhoto(null); setStep('back'); startCamera(); }} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: '#fff', fontSize: '12px' }}>↺</button>
          </div>
        </div>
        <button onClick={() => onPhotosReady(frontPhoto, backPhoto, true)}
          style={{ width: '100%', background: '#4ade80', border: 'none', borderRadius: '8px', padding: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', color: '#000', letterSpacing: '1px', marginBottom: '8px' }}>
          FOTO'S BEVESTIGEN
        </button>
        <button onClick={reset} style={{ width: '100%', background: 'transparent', border: '1px solid #3a3a3d', borderRadius: '8px', padding: '8px', color: '#666', fontSize: '12px', cursor: 'pointer' }}>
          Opnieuw beginnen
        </button>
      </div>
    )
  }

  return <canvas ref={canvasRef} style={{ display: 'none' }} />
}
