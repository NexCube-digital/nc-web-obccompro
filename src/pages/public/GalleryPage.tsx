import { useEffect, useMemo, useRef, useState, type ImgHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import LazySection from '../../components/common/LazySectionHome'
import ScrollReveal from '../../components/animation/ScrollReveal'
import ImageLightbox from '../../components/ui/modal/ImageLightbox'
import sliderGalleryImage from '../../assets/images/slider-gallery.webp'
import { getPublicGalleryPhotos, type GalleryPhoto } from '../../services/Public/GalleryService'

const CATEGORIES = ['all', 'sports', 'hospitality', 'laundry', 'foodCourt', 'coffee', 'agribusiness'] as const

const FADE_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

// FadeImage hanya dipakai untuk hero & pratinjau (lightbox), bukan untuk grid galeri
function FadeImage({ className, style, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
	const ref = useRef<HTMLImageElement>(null)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		const img = ref.current
		if (!img) return

		let cancelled = false
		const show = () => {
			if (!cancelled) setLoaded(true)
		}
		const reveal = () => {
			if (typeof img.decode === 'function') img.decode().then(show, show)
			else show()
		}

		// Gambar dari cache sudah complete, tetap lewat reveal agar fade-in-nya terlihat
		if (img.complete && img.naturalWidth > 0) {
			reveal()
		} else {
			img.addEventListener('load', reveal, { once: true })
			img.addEventListener('error', show, { once: true })
		}

		return () => {
			cancelled = true
			img.removeEventListener('load', reveal)
			img.removeEventListener('error', show)
		}
	}, [])

	const prefersReduced =
		typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

	return (
		<img
			ref={ref}
			className={className}
			style={{
				...style,
				opacity: loaded ? 1 : 0,
				transition: prefersReduced
					? 'none'
					: `opacity 700ms ${FADE_EASING}, transform 500ms ${FADE_EASING}`,
			}}
			{...props}
		/>
	)
}

function GalleryPage() {
	const { t } = useTranslation()
	const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('all')
	const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([])
	const [isLoadingGallery, setIsLoadingGallery] = useState(true)
	const [galleryLoadFailed, setGalleryLoadFailed] = useState(false)
	const [galleryLoadAttempt, setGalleryLoadAttempt] = useState(0)
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryPhoto | null>(null)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		let active = true

		getPublicGalleryPhotos()
			.then((photos) => {
				if (active) setGalleryPhotos(photos)
			})
			.catch(() => {
				if (active) {
					setGalleryPhotos([])
					setGalleryLoadFailed(true)
				}
			})
			.finally(() => {
				if (active) setIsLoadingGallery(false)
			})

		return () => {
			active = false
		}
	}, [galleryLoadAttempt])

	const visiblePhotos = useMemo(
		() => (activeCategory === 'all' ? galleryPhotos : galleryPhotos.filter((photo) => photo.category === activeCategory)),
		[activeCategory, galleryPhotos],
	)

	return (
		<div className="min-h-screen bg-obc-ivory">
			<LandingNavbar />

			{/* Hero slider image */}
			<section className="hero-enter relative min-h-[100svh] overflow-hidden">
				<FadeImage
					src={sliderGalleryImage}
					alt="Kolase fasilitas dan aktivitas OBC"
					decoding="async"
					className="absolute inset-0 h-full w-full origin-top scale-[1.15] object-cover object-top md:origin-center md:scale-100 md:object-center"
				/>

				{/* Overlay MOBILE: gradient vertikal (transparan di atas → krem di bawah) */}
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,242,0)_0%,rgba(250,250,242,0)_55%,rgba(250,250,242,0.75)_78%,rgba(250,250,242,0.95)_100%)] md:hidden" />

				{/* Overlay DESKTOP: gradient horizontal, lebar mengikuti breakpoint dev (md dipersempit agar gambar lebih terlihat) */}
				<div className="absolute inset-y-0 left-0 hidden h-full md:block md:w-[60%] lg:w-[62%] xl:w-[58%] 2xl:w-[52%] bg-[linear-gradient(90deg,#FAFAF2_0%,#FAFAF2_45%,rgba(250,250,242,0.95)_60%,rgba(250,250,242,0.6)_80%,rgba(250,250,242,0)_100%)]" />

				<div className="relative z-10 flex min-h-[100svh] w-full items-end pb-[68px] pt-12 md:items-center md:pb-12 md:pt-24">
					<div className="hero-content-enter mx-auto w-full max-w-[1246px] px-8 md:px-10">
						<div className="w-full max-w-[472px] text-black md:max-w-[400px] lg:max-w-[440px] xl:max-w-[472px]">
							<span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
							<h1 className="mt-5 font-['Montserrat'] text-[24px] font-bold leading-[1.2] tracking-[1.5px] text-black md:text-[40px] md:leading-[52px] lg:text-[48px] lg:leading-[60px] xl:text-[56px] xl:leading-[70px]">
								{t('gallerySection.pageTitle')}
							</h1>
							<p className="mt-4 max-w-[472px] font-['Montserrat'] text-[14px] font-medium leading-[1.625] tracking-[0.18px] text-justify text-black md:text-[16px] md:leading-[26px] lg:text-[18px] lg:leading-[29.25px]">
								{t('gallerySection.pageSubtitle')}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Filter kategori: wrap & rata tengah sampai xl, satu baris mulai xl (>=1280px) */}
			<LazySection minHeight={100} rootMargin="0px">
			<ScrollReveal>
			<section className="mx-auto max-w-[1200px] px-5 pt-10 md:px-8">
				<div className="flex flex-wrap justify-center gap-x-2 gap-y-3 xl:flex-nowrap xl:gap-y-0">
					{CATEGORIES.map((category) => {
						const isActive = category === activeCategory
						return (
							<button
								key={category}
								type="button"
								onClick={() => setActiveCategory(category)}
								className={`flex h-[33px] w-auto shrink-0 items-center justify-center rounded-[20px] border px-[10px] font-['Montserrat'] text-[14px] font-normal leading-none whitespace-nowrap transition-colors md:h-[36px] md:px-3 md:text-[16px] xl:h-[33px] xl:px-[10px] xl:text-[18px] ${
									isActive
										? 'border-black bg-black text-white'
										: 'border-black bg-white text-black hover:bg-black hover:text-white'
								}`}
							>
								{t(`gallerySection.categories.${category}`)}
							</button>
						)
					})}
				</div>
			</section>
			</ScrollReveal>
			</LazySection>

			<LazySection minHeight={900} rootMargin="0px">
			<section className="mx-auto max-w-[1200px] px-10 py-10 md:px-8">
				{isLoadingGallery ? (
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">
						{Array.from({ length: 8 }, (_, index) => (
							<div key={index} className="aspect-square animate-pulse rounded-[24px] bg-black/5 md:rounded-xl" />
						))}
					</div>
				) : galleryLoadFailed ? (
					<div className="py-10 text-center" role="alert">
						<p className="font-['Montserrat'] text-sm text-black">{t('errorStates.failedToLoad.description')}</p>
						<button
							type="button"
							onClick={() => {
								setIsLoadingGallery(true)
								setGalleryLoadFailed(false)
								setGalleryLoadAttempt((attempt) => attempt + 1)
							}}
							className="mt-4 rounded-full border border-black px-4 py-2 font-['Montserrat'] text-sm text-black transition-colors hover:bg-black hover:text-white"
						>
							{t('errorStates.failedToLoad.button')}
						</button>
					</div>
				) : visiblePhotos.length > 0 ? (
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
						{visiblePhotos.map((photo, index) => (
							<ScrollReveal
								key={photo.src}
								className="aspect-square w-full"
								delay={(index % 4) * 90}
								duration={700}
								distance={16}
								scale={0.98}
							>
								<button
									type="button"
									onClick={() => setSelectedGalleryImage(photo)}
									className="group h-full w-full overflow-hidden rounded-[24px] bg-black/5 md:rounded-xl"
									aria-label={`Buka gambar ${photo.alt}`}
								>
									<img
										src={photo.src}
										alt={photo.alt}
										loading="lazy"
										decoding="async"
										className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</button>
							</ScrollReveal>
						))}
					</div>
				) : (
					<p className="py-10 text-center font-['Montserrat'] text-sm text-black">
						{t('errorStates.emptyState.description')}
					</p>
				)}
			</section>
			</LazySection>

			{selectedGalleryImage && (
				<ImageLightbox
					src={selectedGalleryImage.src}
					alt={selectedGalleryImage.alt}
					onClose={() => setSelectedGalleryImage(null)}
				/>
			)}

			<LandingFooter />
		</div>
	)
}

export default GalleryPage