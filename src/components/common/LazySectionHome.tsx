import { useEffect, useRef, useState, type ReactNode } from 'react'

type LazySectionProps = {
	minHeight?: number
	// Jarak sebelum masuk layar saat section mulai di-render
	rootMargin?: string
	children: ReactNode
}

/*
 * Section baru di-render ketika sudah dekat dengan layar (default 700px lebih awal),
 * jadi saat user tiba di sana kontennya sudah siap dan tinggal fade-in.
 * Setelah ter-render, tidak pernah di-unmount lagi (sekali saja).
 */
export default function LazySection({
	minHeight = 400,
	rootMargin = '700px 0px',
	children,
}: LazySectionProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [shouldRender, setShouldRender] = useState(false)

	useEffect(() => {
		const element = ref.current
		if (!element) return

		// Browser lama tanpa IntersectionObserver: langsung render
		if (!('IntersectionObserver' in window)) {
			setShouldRender(true)
			return
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setShouldRender(true)
					observer.disconnect()
				}
			},
			{ rootMargin },
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [rootMargin])

	return (
		<div ref={ref} style={shouldRender ? undefined : { minHeight }}>
			{shouldRender ? children : null}
		</div>
	)
}