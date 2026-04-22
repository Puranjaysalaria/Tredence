// ============================================================================
// ExportPanel — Mode-based export panel: pick Photo OR Video first
// No browser alert(), no OS prompt(). Clean in-app UI only.
// ============================================================================

import { useState, useEffect, useRef } from 'react'
import { X, Image as ImageIcon, Video, Download, Square, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useWorkflowStore } from '@/store/workflowStore'
import { getRectOfNodes, getTransformForBounds } from 'reactflow'
import { toPng } from 'html-to-image'
import { showToast } from './ToastManager'

type Mode = 'pick' | 'photo' | 'video'
type ImgStatus = 'idle' | 'capturing' | 'ready' | 'error'
type VidStatus = 'idle' | 'recording' | 'recorded' | 'error'

export const ExportPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('pick')

  // Photo state
  const [imgStatus, setImgStatus] = useState<ImgStatus>('idle')
  const [imgDataUrl, setImgDataUrl] = useState<string | null>(null)
  const [imgError, setImgError] = useState('')

  // Video state
  const [vidStatus, setVidStatus] = useState<VidStatus>('idle')
  const [vidBlobUrl, setVidBlobUrl] = useState<string | null>(null)
  const [vidError, setVidError] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const nodes = useWorkflowStore(s => s.nodes)

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as Mode | undefined
      setMode(detail ?? 'pick')
      setIsOpen(true)
    }
    window.addEventListener('open_export_panel', handleOpen)
    return () => window.removeEventListener('open_export_panel', handleOpen)
  }, [])

  const reset = () => {
    if (recorderRef.current && vidStatus === 'recording') recorderRef.current.stop()
    setIsOpen(false)
    setMode('pick')
    setImgStatus('idle'); setImgDataUrl(null); setImgError('')
    setVidStatus('idle'); setVidBlobUrl(null); setVidError('')
  }

  const goBack = () => {
    if (recorderRef.current && vidStatus === 'recording') recorderRef.current.stop()
    setMode('pick')
    setImgStatus('idle'); setImgDataUrl(null); setImgError('')
    setVidStatus('idle'); setVidBlobUrl(null); setVidError('')
  }

  // ── Screenshot ──────────────────────────────────────────────────────────────
  const handleCaptureImage = () => {
    const nodesBounds = getRectOfNodes(nodes)
    const transform = getTransformForBounds(nodesBounds, nodesBounds.width, nodesBounds.height, 0.5, 2)
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!viewport) return
    setImgStatus('capturing')
    toPng(viewport, {
      backgroundColor: '#0b0c10',
      width: nodesBounds.width * 2,
      height: nodesBounds.height * 2,
      style: {
        width: `${nodesBounds.width}px`,
        height: `${nodesBounds.height}px`,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    })
      .then(dataUrl => { setImgDataUrl(dataUrl); setImgStatus('ready') })
      .catch(() => { setImgStatus('error'); setImgError('Failed to capture. Make sure nodes are on the canvas.') })
  }

  const handleDownloadImage = () => {
    if (!imgDataUrl) return
    const a = document.createElement('a')
    a.download = `workflow-${Date.now()}.png`
    a.href = imgDataUrl
    a.click()
    showToast('PNG downloaded!', 'success')
  }

  // ── Screen Recording ────────────────────────────────────────────────────────
  const handleStartRecording = async () => {
    try {
      setVidError('')
      // Request screen share first (needs user gesture context to be active)
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      // Only hide panel AFTER we have the stream
      setIsOpen(false)
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setVidBlobUrl(URL.createObjectURL(blob))
        setVidStatus('recorded')
        stream.getTracks().forEach(t => t.stop())
        // Reopen panel to show the result
        setIsOpen(true)
      }
      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') recorder.stop()
      }
      recorder.start()
      setVidStatus('recording')
    } catch {
      setVidError('Screen sharing was cancelled. Please click Start Recording and select a screen/tab to share.')
      setVidStatus('idle')
    }
  }

  const handleStopRecording = () => recorderRef.current?.stop()

  const handleSaveRecording = () => {
    if (!vidBlobUrl) return
    const a = document.createElement('a')
    a.href = vidBlobUrl
    a.download = `workflow-recording-${Date.now()}.webm`
    a.click()
    showToast('Recording saved!', 'success')
  }

  if (!isOpen) return null

  // ── Mode Picker ─────────────────────────────────────────────────────────────
  const modePicker = (
    <div className="p-5 grid grid-cols-2 gap-4">
      <button
        onClick={() => setMode('photo')}
        disabled={nodes.length === 0}
        className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
          <ImageIcon size={22} className="text-emerald-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">Photo</p>
          <p className="text-gray-500 text-xs mt-0.5">Export as PNG</p>
        </div>
      </button>

      <button
        onClick={() => setMode('video')}
        className="group flex flex-col items-center gap-3 p-6 rounded-xl bg-white/[0.03] border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/5 transition-all"
      >
        <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center group-hover:bg-rose-500/25 transition-colors">
          <Video size={22} className="text-rose-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">Video</p>
          <p className="text-gray-500 text-xs mt-0.5">Record screen</p>
        </div>
      </button>
    </div>
  )

  // ── Photo View ──────────────────────────────────────────────────────────────
  const photoView = (
    <div className="p-5 space-y-4">
      <p className="text-xs text-gray-500">Captures the current canvas as a high-resolution PNG image.</p>

      {imgError && (
        <div className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs">{imgError}</div>
      )}

      {imgStatus === 'idle' && (
        <button
          onClick={handleCaptureImage}
          disabled={nodes.length === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 hover:border-emerald-500/50 text-emerald-300 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ImageIcon size={15} />
          Capture Canvas
        </button>
      )}

      {imgStatus === 'capturing' && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
          <Loader2 size={15} className="animate-spin" />
          Rendering image…
        </div>
      )}

      {imgStatus === 'ready' && imgDataUrl && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-white/5 bg-black">
            <img src={imgDataUrl} alt="Workflow preview" className="w-full object-contain max-h-44" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadImage}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
            >
              <Download size={14} /> Download PNG
            </button>
            <button
              onClick={() => { setImgStatus('idle'); setImgDataUrl(null) }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-all"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {imgStatus === 'error' && (
        <button onClick={() => { setImgStatus('idle'); setImgError('') }} className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition-all">
          Try Again
        </button>
      )}
    </div>
  )

  // ── Video View ──────────────────────────────────────────────────────────────
  const videoView = (
    <div className="p-5 space-y-4">
      <p className="text-xs text-gray-500">Records your screen as a .webm video file. The panel will hide while recording so it doesn't appear in the capture.</p>

      {vidError && (
        <div className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs">{vidError}</div>
      )}

      {vidStatus === 'idle' && (
        <button
          onClick={handleStartRecording}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/50 text-rose-300 text-sm font-semibold transition-all"
        >
          <Video size={15} />
          Start Recording
        </button>
      )}

      {vidStatus === 'recording' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Recording in progress…
          </div>
          <button onClick={handleStopRecording} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all">
            <Square size={13} fill="white" /> Stop Recording
          </button>
        </div>
      )}

      {vidStatus === 'recorded' && vidBlobUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 size={15} /> Recording ready!
          </div>
          <video src={vidBlobUrl} controls className="w-full rounded-xl max-h-40 bg-black" />
          <div className="flex gap-2">
            <button onClick={handleSaveRecording} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all">
              <Download size={14} /> Save Recording
            </button>
            <button onClick={() => { setVidStatus('idle'); setVidBlobUrl(null) }} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-all">
              Discard
            </button>
          </div>
        </div>
      )}

      {vidStatus === 'error' && (
        <button
          onClick={() => { setVidStatus('idle'); setVidError('') }}
          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  )

  // ── Render ──────────────────────────────────────────────────────────────────
  const headerIcon = mode === 'photo' ? <ImageIcon size={16} className="text-emerald-400" /> : <Video size={16} className="text-rose-400" />
  const headerTitle = mode === 'pick' ? 'Export Workflow' : mode === 'photo' ? 'Export as PNG' : 'Record Screen'
  const headerBg = mode === 'photo' ? 'bg-emerald-500/20' : mode === 'video' ? 'bg-rose-500/20' : 'bg-white/10'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#151320] border border-white/10 rounded-2xl shadow-2xl w-[440px] animate-scaleIn overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/5">
          <div className="flex items-center gap-2 text-white">
            {mode !== 'pick' && (
              <button onClick={goBack} className="mr-1 p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={16} />
              </button>
            )}
            {mode !== 'pick' && (
              <div className={`p-2 ${headerBg} rounded-lg`}>
                {headerIcon}
              </div>
            )}
            <h2 className="text-base font-bold">{headerTitle}</h2>
          </div>
          <button onClick={reset} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {mode === 'pick' && modePicker}
        {mode === 'photo' && photoView}
        {mode === 'video' && videoView}
      </div>
    </div>
  )
}
