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

// Easing halus: cepat di awal, melambat lembut di akhir (easeOutExpo-ish)
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

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
	duration = 900,
	distance = 32,
	direction = 'up',
	blur = 6,
	scale = 0.98,
	threshold = 0.15,
	rootMargin = '0px 0px -40px 0px',
	once = true,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)
	const [isDone, setIsDone] = useState(false)

	useEffect(() => {
		const element = ref.current
		if (!element) return

		// Hormati pengaturan "reduce motion" dari pengguna
		const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced || !('IntersectionObserver' in window)) {
			setIsVisible(true)
			setIsDone(true)
			return
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting)
				if (entry.isIntersecting && once) observer.disconnect()
			},
			{ threshold, rootMargin },
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [once, rootMargin, threshold])

	const { x, y } = getOffset(direction, distance)

	const hiddenTransform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
	const visibleTransform = 'translate3d(0, 0, 0) scale(1)'

	const style: CSSProperties = {
		opacity: isVisible ? 1 : 0,
		transform: isVisible ? visibleTransform : hiddenTransform,
		filter: blur > 0 ? (isVisible ? 'blur(0px)' : `blur(${blur}px)`) : undefined,
		transition: [
			`opacity ${duration * 0.8}ms ${EASING} ${delay}ms`,
			`transform ${duration}ms ${EASING} ${delay}ms`,
			blur > 0 ? `filter ${duration * 0.8}ms ${EASING} ${delay}ms` : null,
		]
			.filter(Boolean)
			.join(', '),
		// Aktifkan GPU hanya saat animasi berjalan, lalu dilepas supaya hemat memori
		willChange: isDone ? 'auto' : 'opacity, transform, filter',
		backfaceVisibility: 'hidden',
	}

	return (
		<div
			ref={ref}
			className={className}
			style={style}
			onTransitionEnd={(e) => {
				// Tandai selesai setelah transform tuntas (hanya jika sudah tampil)
				if (e.propertyName === 'transform' && isVisible) setIsDone(true)
			}}
			onTransitionStart={() => {
				if (!isVisible) setIsDone(false)
			}}
		>
			{children}
		</div>
	)
}

export default ScrollReveal