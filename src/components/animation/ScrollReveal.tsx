import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

type ScrollRevealProps = {
	children: ReactNode
	className?: string
	delay?: number // ms
	duration?: number // ms
	distance?: number // px, jarak awal sebelum muncul
	direction?: Direction
	blur?: number // px, 0 untuk mematikan blur
	scale?: number // skala awal (mis. 0.96)
	threshold?: number
	rootMargin?: string
	once?: boolean
}

const EASING_MOVE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* Easing opacity dibuat lebih datar supaya fade-in tidak terlihat mendahului gerakan */
const EASING_FADE = 'cubic-bezier(0.33, 1, 0.68, 1)'

function getOffset(direction: Direction, distance: number) {
	switch (direction) {
		case 'up':
			return { x: 0, y: distance }
		case 'down':
			return { x: 0, y: -distance }
		case 'left':
			return { x: distance, y: 0 }
		case 'right':
			return { x: -distance, y: 0 }
		default:
			return { x: 0, y: 0 }
	}
}

function ScrollReveal({
	children,
	className,
	delay = 0,
	duration = 1000,
	distance = 28,
	direction = 'up',
	blur = 0,
	scale = 0.98,
	threshold = 0.1,
	rootMargin = '0px 0px -40px 0px',
	once = true,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const shouldSkipAnimation =
		typeof window !== 'undefined' &&
		(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window))
	const [isVisible, setIsVisible] = useState(shouldSkipAnimation)
	const [isDone, setIsDone] = useState(shouldSkipAnimation)

	useEffect(() => {
		const element = ref.current
		if (!element || shouldSkipAnimation) return

		let raf1 = 0
		let raf2 = 0

		const observer = new IntersectionObserver(
			([entry]) => {
				cancelAnimationFrame(raf1)
				cancelAnimationFrame(raf2)

				if (entry.isIntersecting) {
					/*
					 * Tunggu 2 frame supaya kondisi awal (tersembunyi) sempat dirender dulu.
					 * Tanpa ini, elemen yang sudah terlihat saat halaman dibuka bisa langsung "muncul"
					 * tanpa animasi atau terlihat patah-patah.
					 */
					raf1 = requestAnimationFrame(() => {
						raf2 = requestAnimationFrame(() => setIsVisible(true))
					})
					if (once) observer.disconnect()
				} else if (!once) {
					setIsVisible(false)
				}
			},
			{ threshold, rootMargin },
		)

		observer.observe(element)
		return () => {
			cancelAnimationFrame(raf1)
			cancelAnimationFrame(raf2)
			observer.disconnect()
		}
	}, [once, rootMargin, threshold, shouldSkipAnimation])

	/* Saat disembunyikan lagi (once=false), aktifkan kembali persiapan GPU untuk animasi berikutnya */
	useEffect(() => {
		if (!isVisible) setIsDone(false)
	}, [isVisible])

	const { x, y } = getOffset(direction, distance)
	const hiddenTransform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

	/*
	 * Setelah animasi selesai, transform & filter dilepas sepenuhnya (none).
	 * Ini menghindari teks terlihat sedikit blur dan mencegah anak elemen
	 * (position: fixed/sticky, dropdown, dll.) terjebak di stacking context baru.
	 */
	const settled = isVisible && isDone

	/* Delay hanya dipakai saat muncul; saat menghilang (once=false) langsung tanpa delay */
	const enterDelay = isVisible ? delay : 0

	const style: CSSProperties = {
		opacity: isVisible ? 1 : 0,
		transform: settled ? 'none' : isVisible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform,
		filter: blur > 0 && !settled ? (isVisible ? 'blur(0px)' : `blur(${blur}px)`) : undefined,
		transition: [
			`opacity ${duration * 0.7}ms ${EASING_FADE} ${enterDelay}ms`,
			`transform ${duration}ms ${EASING_MOVE} ${enterDelay}ms`,
			blur > 0 ? `filter ${duration * 0.7}ms ${EASING_FADE} ${enterDelay}ms` : null,
		]
			.filter(Boolean)
			.join(', '),
		// Aktifkan GPU hanya saat animasi berjalan, lalu dilepas supaya hemat memori
		willChange: settled ? 'auto' : blur > 0 ? 'opacity, transform, filter' : 'opacity, transform',
		backfaceVisibility: 'hidden',
	}

	return (
		<div
			ref={ref}
			className={className}
			style={style}
			onTransitionEnd={(e) => {
				
				if (e.target !== e.currentTarget) return
				if (e.propertyName === 'transform' && isVisible) setIsDone(true)
			}}
		>
			{children}
		</div>
	)
}

export default ScrollReveal