import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type ImageLightboxProps = {
	src: string
	alt: string
	caption?: string
	onClose: () => void
}

export default function ImageLightbox({ src, alt, caption, onClose }: ImageLightboxProps) {
	const closeButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		const previousOverflow = document.body.style.overflow
		const previouslyFocused = document.activeElement as HTMLElement | null
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleEscape)
		closeButtonRef.current?.focus()

		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleEscape)
			previouslyFocused?.focus?.()
		}
	}, [onClose])

	return createPortal(
		<div
			className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={caption ?? alt}
				className="relative flex max-h-[96svh] max-w-[96vw] flex-col items-center gap-3"
				onClick={(event) => event.stopPropagation()}
			>
				{/* Tombol X diposisikan absolut di pojok kanan atas, sedikit keluar dari gambar */}
				<button
					ref={closeButtonRef}
					type="button"
					aria-label="Tutup gambar"
					onClick={onClose}
					className="absolute -top-2 -right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-top-4 sm:-right-4"
				>
					<X size={22} />
				</button>
				<img
					className="max-h-[calc(96svh_-_5rem)] max-w-[96vw] rounded-xl object-contain shadow-2xl sm:max-w-[min(96vw,1400px)]"
					src={src}
					alt={alt}
					decoding="async"
				/>
				{caption && (
					<p className="max-w-[90vw] whitespace-normal break-words text-center font-['Montserrat'] text-sm font-medium leading-relaxed text-white sm:text-base">
						{caption}
					</p>
				)}
			</div>
		</div>,
		document.body,
	)
}