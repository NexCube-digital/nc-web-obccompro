import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type ScrollRevealProps = {
	children: ReactNode
	// Jeda sebelum animasi mulai (ms)
	delay?: number
	duration?: number
	distance?: number
	scale?: number
	className?: string
}

type RevealState = 'hidden' | 'showing' | 'done'

/*
 * Fade + naik halus saat elemen masuk layar.
 * Animasi sengaja ditunda 2 frame setelah elemen terdeteksi, supaya
 * pekerjaan mount komponen berat selesai dulu dan animasi tidak patah.
 * Setelah selesai, class dilepas agar tidak mengganggu sticky/hover di dalamnya.
 */
export default function ScrollReveal({
	children,
	delay = 0,
	duration = 1000,
	distance = 24,
	scale = 1,
	className = '',
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [state, setState] = useState<RevealState>('hidden')

	useEffect(() => {
		const element = ref.current
		if (!element) return

		const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

		// Tanpa animasi: reduced motion atau browser tanpa IntersectionObserver
		if (prefersReduced || !('IntersectionObserver' in window)) {
			setState('done')
			return
		}

		let raf1 = 0
		let raf2 = 0

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return
				observer.disconnect()
				// Tunggu 2 frame supaya mount selesai sebelum animasi dimulai
				raf1 = requestAnimationFrame(() => {
					raf2 = requestAnimationFrame(() => setState('showing'))
				})
			},
			{ threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
		)

		observer.observe(element)

		return () => {
			observer.disconnect()
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
		}
	}, [])

	const stateClass =
		state === 'hidden' ? 'reveal-hidden' : state === 'showing' ? 'reveal-show' : ''
	const style = {
		'--reveal-distance': `${distance}px`,
		'--reveal-scale': scale,
		...(state === 'showing'
			? { animationDelay: delay ? `${delay}ms` : undefined, animationDuration: `${duration}ms` }
			: {}),
	} as CSSProperties

	return (
		<div
			ref={ref}
			className={`${stateClass} ${className}`}
			style={style}
			onAnimationEnd={(event) => {
				// Hanya hitung animasi milik wrapper ini, bukan anak-anaknya
				if (event.target === event.currentTarget) setState('done')
			}}
		>
			{children}
		</div>
	)
}