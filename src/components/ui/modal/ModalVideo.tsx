import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type ModalVideoProps = {
	isOpen: boolean
	videoUrl: string
	title: string
	onClose: () => void
}

function getYouTubeEmbedUrl(videoUrl: string) {
	try {
		const url = new URL(videoUrl)
		const hostname = url.hostname.replace(/^www\./, '')
		let videoId = ''

		if (hostname === 'youtu.be') {
			videoId = url.pathname.split('/').filter(Boolean)[0] ?? ''
		} else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(hostname)) {
			if (url.pathname === '/watch') videoId = url.searchParams.get('v') ?? ''
			else if (/^\/(embed|shorts)\//.test(url.pathname)) videoId = url.pathname.split('/')[2] ?? ''
		}

		if (!/^[\w-]{11}$/.test(videoId)) return null
		return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
	} catch {
		return null
	}
}

export default function ModalVideo({ isOpen, videoUrl, title, onClose }: ModalVideoProps) {
	const embedUrl = getYouTubeEmbedUrl(videoUrl)
	const closeButtonRef = useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!isOpen) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose()
		}

		const previousOverflow = document.body.style.overflow
		const previouslyFocused = document.activeElement as HTMLElement | null
		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleEscape)
		closeButtonRef.current?.focus()

		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleEscape)
			previouslyFocused?.focus?.()
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return createPortal(
		/*
			Overlay:
			- padding mengikuti safe-area (HP berponi / gesture bar)
			- mobile portrait: modal rata tengah, hampir selebar layar
		*/
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-3 py-4 backdrop-blur-md transition-opacity duration-200 starting:opacity-0 sm:px-6 sm:py-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
			onClick={onClose}
		>
			{/*
				Lebar modal dibatasi oleh TINGGI layar juga:
				(100svh - ruang header & padding) x 16/9 -> di HP landscape
				video tidak melebihi layar dan tidak perlu di-scroll.
			*/}
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className="w-full max-w-[min(64rem,calc((100svh-7.5rem)*16/9))] overflow-hidden rounded-2xl bg-[#0E1A0F] shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-all duration-300 ease-out starting:translate-y-3 starting:scale-95 starting:opacity-0 motion-reduce:transition-none sm:rounded-3xl"
				onClick={(event) => event.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 text-white sm:gap-4 sm:px-6 sm:py-3.5">
					<h2 className="min-w-0 truncate font-['Montserrat'] text-[13px] font-semibold tracking-[0.2px] sm:text-base">
						{title}
					</h2>
					<button
						ref={closeButtonRef}
						type="button"
						aria-label="Tutup video"
						onClick={onClose}
						className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition-all hover:rotate-90 hover:bg-[#CDF178] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CDF178] motion-reduce:hover:rotate-0 sm:h-10 sm:w-10"
					>
						<X size={20} />
					</button>
				</div>

				{/* Video 16:9 */}
				<div className="aspect-video w-full bg-black">
					{embedUrl ? (
						<iframe
							src={embedUrl}
							title={title}
							className="h-full w-full border-0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
					) : (
						<p className="grid h-full place-items-center px-6 text-center font-['Montserrat'] text-xs text-white/90 sm:text-sm">
							Tautan video YouTube tidak valid.
						</p>
					)}
				</div>
			</div>
		</div>,
		document.body,
	)
}