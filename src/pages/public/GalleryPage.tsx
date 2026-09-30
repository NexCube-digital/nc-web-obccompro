import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import lapangF2Image from '../../assets/layanan/Lapang F2.png'
import pickleballImage from '../../assets/layanan/pickleball-mockup.png'
import tenisMejaImage from '../../assets/layanan/tenis-meja-mockup.png'
import guestHouseImage from '../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import villaImage from '../../assets/unit-bisnis/3f3b0cf46ed28fc2c0546f8d44a8e2a9977f0c43.jpg'
import laundryImage from '../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import foodCourtImage from '../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import coffeeImage from '../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import agribusinessImage from '../../assets/unit-bisnis/395bf2125ecb1a04ee7212871af8ece20326074d.jpg'
import sliderGalleryImage from '../../assets/slider-gallery.jpg'

interface GalleryPhoto {
	src: string
	alt: string
	category: string
}

const CATEGORIES = ['Semua', 'Sports & Event Space', 'Hospitality & Accommodation', 'Laundry', 'Food Court', 'Coffee', 'Agribisnis']

const GALLERY_PHOTOS: GalleryPhoto[] = [
	{ src: guestHouseImage, alt: 'OBC Guest House', category: 'Hospitality & Accommodation' },
	{ src: villaImage, alt: 'OBC Villa', category: 'Hospitality & Accommodation' },
	{ src: laundryImage, alt: 'OBC Laundry', category: 'Laundry' },
	{ src: foodCourtImage, alt: 'OBC Food Court', category: 'Food Court' },
	{ src: coffeeImage, alt: 'OBC Coffee', category: 'Coffee' },
	{ src: agribusinessImage, alt: 'OBC Agribisnis', category: 'Agribisnis' },
	{ src: lapangF2Image, alt: 'Lapangan OBC Sport Center', category: 'Sports & Event Space' },
	{ src: pickleballImage, alt: 'Fasilitas pickleball OBC Sport Center', category: 'Sports & Event Space' },
	{ src: tenisMejaImage, alt: 'Fasilitas tenis meja OBC Sport Center', category: 'Sports & Event Space' },
]


function GalleryPage() {
	const [activeCategory, setActiveCategory] = useState('Semua')
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		if (!selectedGalleryImage) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedGalleryImage(null)
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [selectedGalleryImage])

	const visiblePhotos = useMemo(
		() => (activeCategory === 'Semua' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory)),
		[activeCategory],
	)

	return (
		<div className="min-h-screen bg-obc-ivory">
			<LandingNavbar />

			{/* Hero slider image */}
			<section className="relative h-[100svh] min-h-[560px] max-h-none overflow-hidden md:max-h-[820px]">
				<img
					src={sliderGalleryImage}
					alt="Kolase fasilitas dan aktivitas OBC"
					className="absolute inset-0 h-full w-full origin-top scale-[1.15] object-cover object-top md:origin-center md:scale-100 md:object-center"
				/>

				{/* Overlay MOBILE: gradient vertikal (transparan di atas → krem di bawah) */}
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,250,242,0)_0%,rgba(250,250,242,0)_55%,rgba(250,250,242,0.75)_78%,rgba(250,250,242,0.95)_100%)] md:hidden" />

				{/* Overlay DESKTOP: gradient horizontal, lebar mengikuti breakpoint dev */}
				<div className="absolute inset-y-0 left-0 hidden h-full md:block md:w-[72%] lg:w-[65%] xl:w-[58%] 2xl:w-[52%] bg-[linear-gradient(90deg,#FAFAF2_0%,#FAFAF2_45%,rgba(250,250,242,0.95)_60%,rgba(250,250,242,0.6)_80%,rgba(250,250,242,0)_100%)]" />

				<div className="relative z-10 flex h-full w-full items-end pb-[68px] pt-12 md:items-center md:pb-12 md:pt-24">
					<div className="mx-auto w-full max-w-[1246px] px-8 md:px-10">
						<div className="w-full max-w-[472px] text-black">
							<span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
							<h1 className="mt-5 font-['Montserrat'] text-[24px] font-bold leading-[1.2] tracking-[1.5px] text-black md:text-[56px] md:leading-[70px]">
								Cerita di Setiap Sudut OBC
							</h1>
							<p className="mt-4 max-w-[472px] font-['Montserrat'] text-[14px] font-medium leading-[1.625] tracking-[0.18px] text-justify text-black md:text-[18px] md:leading-[29.25px]">
								Jelajahi berbagai momen, fasilitas, aktivitas, dan pengalaman yang menjadi bagian dari perjalanan OBC.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Filter kategori */}
			<section className="mx-auto max-w-[1200px] px-5 pt-10 md:px-8">
				<div className="flex flex-wrap justify-center gap-x-2 gap-y-3 md:flex-nowrap md:gap-y-0">
					{CATEGORIES.map((category) => {
						const isActive = category === activeCategory
						return (
							<button
								key={category}
								type="button"
								onClick={() => setActiveCategory(category)}
								className={`flex h-[33px] w-auto shrink-0 items-center justify-center rounded-[20px] border px-[10px] font-['Montserrat'] text-[16px] font-normal leading-none whitespace-nowrap transition-colors md:text-[18px] ${
									isActive
										? 'border-black bg-black text-white'
										: 'border-black bg-white text-black hover:bg-black hover:text-white'
								}`}
							>
								{category}
							</button>
						)
					})}
				</div>
			</section>

			{/* Grid galeri */}
			<section className="mx-auto max-w-[1200px] px-10 py-10 md:px-8">
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					{visiblePhotos.map((photo) => (
						<button
							key={photo.src}
							type="button"
							onClick={() => setSelectedGalleryImage(photo.src)}
							className="group aspect-square overflow-hidden rounded-[24px] md:rounded-xl"
							aria-label={`Buka gambar ${photo.alt}`}
						>
							<img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
						</button>
					))}
				</div>
			</section>

			{selectedGalleryImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-label="Pratinjau gambar galeri"
					onClick={() => setSelectedGalleryImage(null)}
				>
					<button
						className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-obc-green shadow-lg transition-transform hover:scale-105"
						type="button"
						aria-label="Tutup gambar"
						onClick={() => setSelectedGalleryImage(null)}
					>
						<X size={22} />
					</button>
					<div className="relative max-h-[90vh] max-w-[92vw]" onClick={(event) => event.stopPropagation()}>
						<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC" />
					</div>
				</div>
			)}

			<LandingFooter />
		</div>
	)
}

export default GalleryPage