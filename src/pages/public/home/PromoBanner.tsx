import { useEffect, useState } from 'react'
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
	const [promoIndex, setPromoIndex] = useState(0)
	const [isPromoHovered, setIsPromoHovered] = useState(false)
	const [promoTouchStartX, setPromoTouchStartX] = useState<number | null>(null)

	// Auto-scroll untuk promo banner (pause saat hover atau touch)
	useEffect(() => {
		if (isPromoHovered || promoSlides.length <= 1) return
		const timer = setInterval(() => {
			setPromoIndex((prev) => (prev + 1) % promoSlides.length)
		}, 4500)
		return () => clearInterval(timer)
	}, [isPromoHovered, promoIndex])

	return (
		<section className="bg-[#fffff7] px-4 py-6 sm:px-6 md:py-8" aria-label="Promo OBC">
			<div
				className="group relative mx-auto aspect-[1200/450] w-[calc(100%-32px)] max-w-[1246px] overflow-hidden rounded-[20px] bg-[#0c2937] shadow-[0_8px_24px_rgba(0,64,0,0.12)] md:rounded-[22px]"
				onMouseEnter={() => setIsPromoHovered(true)}
				onMouseLeave={() => setIsPromoHovered(false)}
				onTouchStart={(e) => {
					setPromoTouchStartX(e.touches[0].clientX)
					setIsPromoHovered(true)
				}}
				onTouchEnd={(e) => {
					if (promoTouchStartX !== null) {
						const diff = promoTouchStartX - e.changedTouches[0].clientX
						if (Math.abs(diff) > 40) {
							if (diff > 0) {
								setPromoIndex((prev) => (prev + 1) % promoSlides.length)
							} else {
								setPromoIndex((prev) => (prev === 0 ? promoSlides.length - 1 : prev - 1))
							}
						}
						setPromoTouchStartX(null)
					}
					setIsPromoHovered(false)
				}}
			>
				{/* Slider Track with Smooth Horizontal Slide */}
				<div
					className="flex h-full w-full transition-transform duration-700 ease-in-out"
					style={{ transform: `translateX(-${promoIndex * 100}%)` }}
				>
					{promoSlides.map((slide, index) => (
						<div key={slide.id || index} className="relative h-full w-full shrink-0 overflow-hidden">
							{slide.isGraphic ? (
								<img
									className="h-full w-full object-cover"
									src={slide.image}
									alt={slide.alt}
								/>
							) : (
								<div className="relative h-full w-full flex flex-col items-center justify-center select-none overflow-hidden">
									<img
										className="absolute inset-0 h-full w-full object-cover"
										src={slide.image}
										alt={slide.alt}
									/>
									<div className="absolute inset-0 bg-gradient-to-b from-[#0c2937]/90 via-[#0c2937]/75 to-[#0c2937]/92" />
									<div className="relative z-10 flex flex-col items-center text-center px-4">
										<img
											src={obcLogoImage}
											alt="OBC Logo"
											className="h-6 sm:h-9 md:h-12 w-auto mb-1 sm:mb-2 drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]"
										/>
										<span className="font-['Montserrat'] font-extrabold uppercase tracking-[2px] sm:tracking-[4px] text-xl sm:text-3xl md:text-5xl lg:text-[54px] text-transparent [-webkit-text-stroke:1px_white] sm:[-webkit-text-stroke:2px_white] md:[-webkit-text-stroke:3px_white] leading-none">
											PROMO
										</span>
										<span className="font-['Montserrat'] font-extrabold uppercase tracking-[2px] sm:tracking-[4px] text-xl sm:text-3xl md:text-5xl lg:text-[54px] text-white leading-none mt-0.5 sm:mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
											{slide.title}
										</span>
										{slide.subtitle && (
											<p className="mt-1.5 sm:mt-3 max-w-[90%] sm:max-w-[520px] text-[9px] sm:text-xs md:text-sm font-medium text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] line-clamp-2">
												{slide.subtitle}
											</p>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Tombol Navigasi Kiri & Kanan */}
				<button
					className="absolute left-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-[#fffff7]/90 text-[#404f14] shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-[#fffff7] sm:left-5 sm:h-9 sm:w-9 md:left-7 md:h-10 md:w-10 cursor-pointer z-10"
					type="button"
					aria-label="Promo sebelumnya"
					onClick={() => setPromoIndex((index) => (index === 0 ? promoSlides.length - 1 : index - 1))}
				>
					<ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
				</button>
				<button
					className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-[#fffff7]/90 text-[#404f14] shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-[#fffff7] sm:right-5 sm:h-9 sm:w-9 md:right-7 md:h-10 md:w-10 cursor-pointer z-10"
					type="button"
					aria-label="Promo berikutnya"
					onClick={() => setPromoIndex((index) => (index + 1) % promoSlides.length)}
				>
					<ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
				</button>
			</div>

			{/* Indikator Titik Promo */}
			<div className="mt-3 flex justify-center gap-1.5" aria-label="Indikator promo">
				{promoSlides.map((slide, index) => (
					<button
						className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
							index === promoIndex ? 'w-7 bg-obc-green' : 'w-1.5 bg-[#d8d2c1] hover:bg-[#b0aa99]'
						}`}
						key={slide.id || index}
						type="button"
						aria-label={`Tampilkan promo ${index + 1}`}
						onClick={() => setPromoIndex(index)}
					/>
				))}
			</div>
		</section>
	)
}
