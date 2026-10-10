import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'

type LazySectionProps = {
	children: ReactNode
	/** Tinggi placeholder sebelum section tampil (cegah layout loncat) */
	minHeight?: number
	/** Mulai load sebelum section benar-benar terlihat */
	rootMargin?: string
	id?: string
}

const Skeleton = ({ minHeight }: { minHeight: number }) => (
	<div
		style={{ minHeight }}
		className="w-full animate-pulse bg-[#f5f0e8]"
	/>
)

function LazySection({
	children,
	minHeight = 280,
	rootMargin = '200px 0px',
	id,
}: LazySectionProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el || visible) return

		// Fallback untuk browser lama tanpa IntersectionObserver
		if (!('IntersectionObserver' in window)) {
			setVisible(true)
			return
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true)
					observer.disconnect() // sekali saja, tidak perlu mengamati lagi
				}
			},
			{ rootMargin },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [visible, rootMargin])

	return (
		<div ref={ref} id={id}>
			{visible ? (
				<Suspense fallback={<Skeleton minHeight={minHeight} />}>
					{children}
				</Suspense>
			) : (
				<Skeleton minHeight={minHeight} />
			)}
		</div>
	)
}

export default LazySection