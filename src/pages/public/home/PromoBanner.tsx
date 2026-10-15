import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import promoPelajarImage from '../../../assets/OBC Guest House.png'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import guestHouseGalleryImage from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import academyTeamImage from '../../../assets/layanan/OBC ACADEMY/sae-375.JPEG'
import obcLogoImage from '../../../assets/logo/LOGO-OBC.png'

const promoSlides = [
	{
		id: 'pelajar',
		image: promoPelajarImage,
		alt: 'Promo pelajar OBC',
		isGraphic: true,
	},
	{
		id: 'membership',
		image: lapangF1Image,
		alt: 'Promo Membership OBC Sport Center',
		title: 'MEMBERSHIP',
		subtitle: 'Hemat 20% untuk 4x pertemuan & prioritas slot lapangan di OBC Sport Center',
		isGraphic: false,
	},
	{
		id: 'guesthouse',
		image: guestHouseGalleryImage,
		alt: 'Promo Staycation OBC Guest House',
		title: 'GUEST HOUSE',
		subtitle: 'Penginapan asri dan tenang di kawasan Rancabentang untuk liburan keluarga',
		isGraphic: false,
	},
	{
		id: 'academy',
		image: academyTeamImage,
		alt: 'Promo OBC Academy',
		title: 'OBC ACADEMY',
		subtitle: 'Free Trial 2x sesi pelatihan olahraga untuk anak usia 6-16 tahun',
		isGraphic: false,
	},
]

export default function PromoBanner() {
	const { t } = useTranslation()
	const [promoIndex, setPromoIndex] = useState(0)
	const [previousPromoIndex, setPreviousPromoIndex] = useState<number | null>(null)
	const [preloadPromoIndex, setPreloadPromoIndex] = useState<number | null>(null)
	const [isPromoHovered, setIsPromoHovered] = useState(false)
	const [promoTouchStartX, setPromoTouchStartX] = useState<number | null>(null)
	const nextPromoIndex = (promoIndex + 1) % promoSlides.length

	const selectPromo = (index: number) => {
		if (index === promoIndex) return
		setPreviousPromoIndex(promoIndex)
		setPromoIndex(index)
		setPreloadPromoIndex(null)
	}
	const goPrev = () => selectPromo((promoIndex - 1 + promoSlides.length) % promoSlides.length)
	const goNext = () => selectPromo(nextPromoIndex)

	// Preload slide berikutnya menjelang perpindahan; pause saat hover atau touch.
	useEffect(() => {
		if (isPromoHovered || promoSlides.length <= 1) return
		const nextIndex = (promoIndex + 1) % promoSlides.length
		const preloadTimer = window.setTimeout(() => setPreloadPromoIndex(nextIndex), 3800)
		const advanceTimer = window.setTimeout(() => {
			setPreviousPromoIndex(promoIndex)
			setPromoIndex(nextIndex)
			setPreloadPromoIndex(null)
		}, 4500)

		return () => {
			window.clearTimeout(preloadTimer)
			window.clearTimeout(advanceTimer)
		}
	}, [isPromoHovered, promoIndex])

	useEffect(() => {
		if (previousPromoIndex === null) return
		const timer = window.setTimeout(() => setPreviousPromoIndex(null), 700)
		return () => window.clearTimeout(timer)
	}, [promoIndex, previousPromoIndex])

	return (
		// PC (md+): padding sama seperti file awal (px-6, py-8)
		<section className="bg-[#fffff7] py-6 md:px-6 md:py-8" aria-label="Promo OBC">
			{/* Mobile: lebar penuh dikurangi 40px. PC: w-[calc(100%-32px)] max-w-[1246px] seperti awal */}
			<div className="mx-auto w-[calc(100%-40px)] max-w-[1246px] md:w-[calc(100%-32px)]">
				{/* Judul (dari screenshot) */}
				<h2 className="mb-3 font-['Montserrat'] text-[18px] font-bold leading-[26px] tracking-normal text-black md:mb-4 md:px-[6px] md:text-[28px] md:leading-[38px] lg:text-[36px] lg:leading-[44px]">
					{t('promoBanner.title')}
				</h2>

				{/* Banner: mobile 2:1, PC rasio awal 1200/450 */}
				<div
					className="group relative aspect-[2/1] w-full overflow-hidden rounded-[20px] bg-[#0c2937] shadow-[0_8px_24px_rgba(0,64,0,0.12)] md:aspect-[1200/450] md:rounded-[22px]"
					onMouseEnter={() => {
						setIsPromoHovered(true)
						setPreloadPromoIndex(null)
					}}
					onMouseLeave={() => setIsPromoHovered(false)}
					onTouchStart={(e) => {
						setPromoTouchStartX(e.touches[0].clientX)
						setIsPromoHovered(true)
						setPreloadPromoIndex(null)
					}}
					onTouchEnd={(e) => {
						if (promoTouchStartX !== null) {
							const diff = promoTouchStartX - e.changedTouches[0].clientX
							if (Math.abs(diff) > 40) {
								if (diff > 0) goNext()
								else goPrev()
							}
							setPromoTouchStartX(null)
						}
						setIsPromoHovered(false)
					}}
				>
					{/* Slider track */}
					<div
						className="flex h-full w-full transition-transform duration-700 ease-in-out"
						style={{ transform: `translateX(-${promoIndex * 100}%)` }}
					>
						{promoSlides.map((slide, index) => {
							const shouldRenderImage =
								index === promoIndex || index === previousPromoIndex || index === preloadPromoIndex
							return (
							<div key={slide.id || index} className="relative h-full w-full shrink-0 overflow-hidden">
								{shouldRenderImage && (slide.isGraphic ? (
									<img className="h-full w-full object-cover" src={slide.image} alt={slide.alt} loading={index === promoIndex || index === preloadPromoIndex ? 'eager' : 'lazy'} decoding="async" />
								) : (
									<div className="relative flex h-full w-full select-none flex-col items-center justify-center overflow-hidden">
										<img
											className="absolute inset-0 h-full w-full object-cover"
											src={slide.image}
											alt={slide.alt}
											loading={index === promoIndex || index === preloadPromoIndex ? 'eager' : 'lazy'}
											decoding="async"
										/>
										<div className="absolute inset-0 bg-gradient-to-b from-[#0c2937]/90 via-[#0c2937]/75 to-[#0c2937]/92" />
										{/* px-14/px-20 hanya mobile supaya tidak ketutup panah, PC tetap px-4 */}
										<div className="relative z-10 flex flex-col items-center px-14 text-center sm:px-20 md:px-4">
											<img
												src={obcLogoImage}
												alt="OBC Logo"
													className="mb-1 h-6 w-auto drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] sm:mb-2 sm:h-9 md:h-12"
											/>
											<span className="font-['Montserrat'] text-xl font-extrabold uppercase leading-none tracking-[2px] text-transparent [-webkit-text-stroke:1px_white] sm:text-3xl sm:tracking-[4px] sm:[-webkit-text-stroke:2px_white] md:text-5xl md:[-webkit-text-stroke:3px_white] lg:text-[54px]">
												PROMO
											</span>
											<span className="mt-0.5 font-['Montserrat'] text-xl font-extrabold uppercase leading-none tracking-[2px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:mt-1 sm:text-3xl sm:tracking-[4px] md:text-5xl lg:text-[54px]">
												{slide.title ? t(`promoBanner.slides.${slide.id}Title`) : null}
											</span>
											{slide.subtitle && (
												<p className="mt-1.5 line-clamp-2 max-w-[90%] text-[9px] font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] sm:mt-3 sm:max-w-[520px] sm:text-xs md:text-sm">
													{t(`promoBanner.slides.${slide.id}Subtitle`)}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
							)
						})}
					</div>

					{/* Tombol navigasi: ukuran & warna sama seperti awal */}
					<button
						className="absolute left-3 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#fffff7]/90 text-[#404f14] shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-[#fffff7] sm:left-5 sm:h-9 sm:w-9 md:left-7 md:h-10 md:w-10"
						type="button"
						aria-label="Promo sebelumnya"
						onClick={goPrev}
					>
						<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
					</button>
					<button
						className="absolute right-3 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-[#fffff7]/90 text-[#404f14] shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-[#fffff7] sm:right-5 sm:h-9 sm:w-9 md:right-7 md:h-10 md:w-10"
						type="button"
						aria-label="Promo berikutnya"
						onClick={goNext}
					>
						<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
					</button>
				</div>

				{/* Indikator titik: sama seperti awal */}
				<div className="mt-3 flex justify-center gap-1.5" aria-label="Indikator promo">
					{promoSlides.map((slide, index) => (
						<button
							className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
								index === promoIndex ? 'w-7 bg-obc-green' : 'w-1.5 bg-[#d8d2c1] hover:bg-[#b0aa99]'
							}`}
							key={slide.id || index}
							type="button"
							aria-label={`Tampilkan promo ${index + 1}`}
							onClick={() => selectPromo(index)}
						/>
					))}
				</div>
			</div>
		</section>
	)
}