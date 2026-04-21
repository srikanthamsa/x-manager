import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

interface HlsVideoProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

export default function HlsVideo({ src, className = '', style }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: false })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("Video play failed:", e))
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
    }

    return () => { if (hls) hls.destroy() }
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      style={{
        ...style,
        opacity: ready ? 1 : 0,
        transition: 'opacity 1.5s ease',
      }}
      autoPlay
      loop
      muted
      playsInline
      crossOrigin="anonymous"
      onCanPlay={() => setReady(true)}
    />
  )
}
