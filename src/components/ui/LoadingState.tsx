import { useEffect, useRef } from 'react'
import frame1 from '../../assets/loading-state/Frame1.png'
import frame2 from '../../assets/loading-state/Frame2.png'
import frame3 from '../../assets/loading-state/Frame3.png'
import frame4 from '../../assets/loading-state/Frame4.png'
import frame5 from '../../assets/loading-state/Frame5.png'
import frame6 from '../../assets/loading-state/Frame6.png'
import logo from '../../assets/logo/obclogo.png'

const CIRCLE = 300 // width/height lingkaran di Figma
const RING = 10 // tebal cincin yang terlihat di sekitar disc logo
const CANVAS_H = 340 // tinggi semua PNG
const CIRCLE_TOP = 20 // posisi top lingkaran di dalam PNG
const GLOW_SIZE = 560 // area glow (lebih besar dari lingkaran)

/**
 * cx  = posisi X pusat lingkaran di dalam file PNG
 * rgb = warna glow di luar lingkaran
 */
const frames = [
  { src: frame1, cx: 250, rgb: [212, 220, 40] },
  { src: frame2, cx: 250, rgb: [44, 200, 60] },
  { src: frame3, cx: 250, rgb: [50, 150, 200] },
  { src: frame4, cx: 250, rgb: [70, 45, 195] },
  { src: frame5, cx: 170, rgb: [170, 35, 195] },
  { src: frame6, cx: 250, rgb: [215, 45, 45] },
]

const STEP_DURATION = 1000 // animation-duration Figma per frame (linear)
const DISPLAY_DURATION = 6000 // 6 frame x 1000ms
const FADE_DURATION = 350

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Glow berupa radial-gradient: tepi lingkaran berada di 150 / 280 = ~53.5%
const glowBackground = (r: number, g: number, b: number) =>
  `radial-gradient(circle closest-side, rgba(${r},${g},${b},0) 0%, rgba(${r},${g},${b},0.6) 53%, rgba(${r},${g},${b},0.32) 63%, rgba(${r},${g},${b},0.12) 78%, rgba(${r},${g},${b},0) 100%)`

type LoadingStateProps = {
  onComplete: () => void
}

export default function LoadingState({ onComplete }: LoadingStateProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let rafId = 0
    let exitTimer = 0
    let completeTimer = 0
    let cancelled = false

    const apply = (time: number) => {
      const progress = time / STEP_DURATION
      const whole = Math.floor(progress)
      const base = whole % frames.length
      const top = (base + 1) % frames.length
      const amount = progress - whole // linear 0 -> 1

      // Gambar: frame lama tetap 100% di bawah, frame baru naik di atasnya
      layerRefs.current.forEach((layer, i) => {
        if (!layer) return
        if (i === base) {
          layer.style.opacity = '1'
          layer.style.zIndex = '1'
        } else if (i === top) {
          layer.style.opacity = String(amount)
          layer.style.zIndex = '2'
        } else {
          layer.style.opacity = '0'
          layer.style.zIndex = '0'
        }
      })

      // Glow: satu elemen, warnanya diinterpolasi (tidak ada tumpukan / pop)
      if (glowRef.current) {
        const a = frames[base].rgb
        const b = frames[top].rgb
        glowRef.current.style.background = glowBackground(
          Math.round(lerp(a[0], b[0], amount)),
          Math.round(lerp(a[1], b[1], amount)),
          Math.round(lerp(a[2], b[2], amount)),
        )
      }
    }

    apply(0)

    // Tunggu semua gambar ter-decode agar tidak ada kedip di tengah animasi
    const preload = Promise.all(
      [...frames.map((f) => f.src), logo].map((src) => {
        const img = new Image()
        img.src = src
        return img.decode().catch(() => undefined)
      }),
    )

    preload.then(() => {
      if (cancelled) return
      const start = performance.now()

      const tick = (now: number) => {
        apply(now - start)
        rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)

      exitTimer = window.setTimeout(() => {
        if (rootRef.current) rootRef.current.style.opacity = '0'
      }, DISPLAY_DURATION)
      completeTimer = window.setTimeout(onComplete, DISPLAY_DURATION + FADE_DURATION)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.clearTimeout(exitTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] grid place-items-center overflow-hidden bg-white"
      style={{ opacity: 1, transition: `opacity ${FADE_DURATION}ms linear` }}
      role="status"
      aria-label="Memuat OBC Group"
    >
      <div
        className="relative max-sm:scale-[0.8]"
        style={{ width: CIRCLE, height: CIRCLE }}
        aria-hidden="true"
      >
        {/* Glow tunggal di belakang semua frame */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute"
          style={{
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            left: (CIRCLE - GLOW_SIZE) / 2,
            top: (CIRCLE - GLOW_SIZE) / 2,
            background: glowBackground(...(frames[0].rgb as [number, number, number])),
          }}
        />

        {/* Frame gradien, di-clip jadi lingkaran 300px */}
        {frames.map((frame, index) => (
          <div
            key={frame.src}
            ref={(el) => {
              layerRefs.current[index] = el
            }}
            className="absolute inset-0 overflow-hidden rounded-full bg-white will-change-[opacity]"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <img
              src={frame.src}
              alt=""
              draggable={false}
              decoding="async"
              className="absolute max-w-none"
              style={{
                top: -CIRCLE_TOP,
                left: -(frame.cx - CIRCLE / 2),
                height: CANVAS_H,
                width: 'auto',
              }}
            />
          </div>
        ))}

        {/* Disc logo 280px: cincin 10px dari frame tetap terlihat */}
        <div
          className="absolute z-10 grid place-items-center rounded-full bg-[#fffff7]"
          style={{ inset: RING }}
        >
          <img src={logo} alt="" className="h-auto w-[216px] object-contain" />
        </div>
      </div>
    </div>
  )
}