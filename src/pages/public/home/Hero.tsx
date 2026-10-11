import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import billiardImage from '../../../assets/layanan/Meja Billiard.png'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../../assets/layanan/Lapang F2.png'
import guestHouseGalleryImage from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'

const heroSlides = [
	{
		title: 'Onny Barber Center',
		description:
			'OBC Group adalah ekosistem usaha yang menghadirkan beragam layanan, fasilitas, dan ruang untuk berbagai kebutuhan. Mulai dari personal care, olahraga, hospitality, makanan & minuman, hingga event space.',
		image: billiardImage,
		primaryBtn: { text: 'Booking OBC Sport', link: 'https://sport.obcgroup.id/' },
		secondaryBtn: { text: 'Jelajahi Bisnis Kami', link: '#layanan' },
	},
	{
		title: 'OBC Sport Center',
		description:
			'Fasilitas lapangan olahraga modern untuk futsal, badminton, voli, pickleball, dan meja billiard. Slot terjamin, booking praktis, dan hemat dengan paket membership.',
		image: lapangF1Image,
		primaryBtn: { text: 'Booking Lapangan', link: 'https://sport.obcgroup.id/' },
		secondaryBtn: { text: 'Lihat Fasilitas', link: '#fasilitas' },
	},
	{
		title: 'OBC Event Space',
		description:
			'Ruang serbaguna luas dan representatif di Bandung untuk kebutuhan wedding, gathering komunitas, turnamen olahraga, dan acara spesial keluarga.',
		image: lapangF2Image,
		primaryBtn: { text: 'Booking Event Space', link: '#event-space' },
		secondaryBtn: { text: 'Hubungi Kami', link: '#kontak' },
	},
	{
		title: 'OBC Guest House &\nPenthouse',
		description:
			'Pilihan akomodasi nyaman dan asri di kawasan Rancabentang untuk istirahat keluarga dan liburan dengan suasana tenang dan fasilitas lengkap.',
		image: guestHouseGalleryImage,
		primaryBtn: { text: 'Reservasi Kamar', link: '#kontak' },
		secondaryBtn: { text: 'Jelajahi Bisnis', link: '#layanan' },
	},

]

const heroSlideKeys = ['obc', 'sportCenter', 'eventSpace', 'guestHouse'] as const

export default function Hero() {
	const { t } = useTranslation()
	const [heroIndex, setHeroIndex] = useState(0)
	const [previousHeroIndex, setPreviousHeroIndex] = useState<number | null>(null)
	const translatedHeroSlides = heroSlides.map((slide, index) => {
		const key = `hero.slides.${heroSlideKeys[index]}`
		return {
			...slide,
			title: t(`${key}.title`),
			description: t(`${key}.description`),
			primaryBtn: { ...slide.primaryBtn, text: t(`${key}.primaryBtn`) },
			secondaryBtn: { ...slide.secondaryBtn, text: t(`${key}.secondaryBtn`) },
		}
	})
	const activeHeroSlide = translatedHeroSlides[heroIndex]
	const nextHeroIndex = (heroIndex + 1) % heroSlides.length

	useEffect(() => {
		const advanceTimer = window.setTimeout(() => {
			setPreviousHeroIndex(heroIndex)
			setHeroIndex(nextHeroIndex)
		}, 7000)

		return () => window.clearTimeout(advanceTimer)
	}, [heroIndex, nextHeroIndex])

	useEffect(() => {
		if (previousHeroIndex === null) return
		const timer = window.setTimeout(() => setPreviousHeroIndex(null), 1000)
		return () => window.clearTimeout(timer)
	}, [heroIndex, previousHeroIndex])

	const selectHero = (index: number) => {
		if (index === heroIndex) return
		setPreviousHeroIndex(heroIndex)
		setHeroIndex(index)
	}
	const goPrev = () => selectHero((heroIndex - 1 + heroSlides.length) % heroSlides.length)
	const goNext = () => selectHero((heroIndex + 1) % heroSlides.length)

	// Scroll halus ke footer (fallback: dasar halaman)
	const scrollToFooter = () => {
		const footer = document.querySelector('footer')
		if (footer) {
			footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
		} else {
			window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
		}
	}

	return (
		<section
			className="relative flex h-screen supports-[height:100svh]:h-svh min-h-[540px] items-end overflow-hidden pb-[140px] text-white md:h-auto md:min-h-screen md:pb-[120px] xl:pb-[70px]"
				aria-label={t('nav.home')}
		>
			{/* Crossfade background images */}
			{translatedHeroSlides.map((slide, index) => {
				const isActive = index === heroIndex
				const shouldLoad = isActive || index === previousHeroIndex || index === nextHeroIndex

				return (
					<img
						key={index}
						src={shouldLoad ? slide.image : undefined}
						alt=""
						loading={shouldLoad ? 'eager' : 'lazy'}
						decoding="async"
						fetchPriority={isActive && heroIndex === 0 ? 'high' : 'auto'}
						className={`absolute inset-0 h-full w-full object-cover object-[center_68%] transition-opacity duration-1000 ease-in-out ${
							isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
						}`}
						aria-hidden={!isActive}
					/>
				)
			})}

			{/* Overlay gradient */}
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/35 to-transparent sm:h-32 md:h-36"
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/35 to-transparent sm:h-32 md:h-36"
				aria-hidden="true"
			/>

			{/* Konten: mobile rata kiri 18px, tablet & desktop di tengah */}
			<div className="relative z-10 ml-[18px] w-[calc(100%-56px)] max-w-[1280px] md:mx-auto md:w-[calc(100%-48px)]">
				{/*
					Trik "grid stacking": semua judul ditumpuk di 1 sel grid yang sama.
					Tinggi sel otomatis = judul TERTINGGI, jadi tinggi blok selalu tetap
					di semua slide dan semua ukuran layar -> teks & tombol tidak naik-turun.
					Judul yang tidak aktif hanya disembunyikan (invisible), bukan dihapus.
				*/}
				<h1 className="grid items-end whitespace-pre-line font-['Montserrat'] text-[34px] font-bold leading-[42px] tracking-[0.5px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:text-[46px] md:leading-[56px] lg:text-[56px] lg:leading-[68px] xl:text-[65px] xl:leading-[80px]">
					{translatedHeroSlides.map((slide, index) => (
						<span
							key={index}
							className={`col-start-1 row-start-1 block ${index === heroIndex ? '' : 'invisible'}`}
							aria-hidden={index !== heroIndex}
						>
							{slide.title}
						</span>
					))}
				</h1>

				{/* Deskripsi: cara yang sama, tinggi mengikuti deskripsi terpanjang */}
				<p className="my-[14px] mb-3 grid max-w-[620px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[0.5px] text-white [text-align:justify] [text-shadow:0px_1px_4px_rgba(0,0,0,0.3)] md:mb-5 md:max-w-[560px] md:text-[12px] md:leading-[16px] xl:mb-6 xl:max-w-[620px] xl:leading-[15px]">
					{translatedHeroSlides.map((slide, index) => (
						<span
							key={index}
							className={`col-start-1 row-start-1 block ${index === heroIndex ? '' : 'invisible'}`}
							aria-hidden={index !== heroIndex}
						>
							{slide.description}
						</span>
					))}
				</p>

				{/* Tombol: sejajar horizontal (2 tombol + chevron di tengah) */}
				<div className="flex max-w-[520px] flex-row gap-0 md:gap-1">
					<a
						className="inline-flex flex-none items-center justify-center rounded-full border border-white/90 bg-[#27282540] px-[10px] py-[4px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-[1.02] hover:border-obc-green hover:bg-obc-green md:flex-1 md:px-6 md:py-[11px]"
						href={activeHeroSlide.primaryBtn.link}
						target={activeHeroSlide.primaryBtn.link.startsWith('http') ? '_blank' : '_self'}
						rel="noreferrer"
					>
						{activeHeroSlide.primaryBtn.text}
					</a>

					{/* Ikon chevron: klik untuk scroll ke footer */}
					<button
						type="button"
						onClick={scrollToFooter}
						aria-label={t('common.scrollToFooter')}
						className="grid h-7 w-[35px] translate-y-1 cursor-pointer place-items-center text-white/85 transition-colors hover:text-white md:w-8"
					>
						<svg
							viewBox="0 0 24 24"
							className="mt-3 h-6 w-6 md:mt-4 md:h-9 md:w-9"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path d="M6 8.5L12 15.5L18 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>

					<a
						className="inline-flex flex-1 items-center justify-center rounded-full border border-white/90 bg-[#27282540] px-4 py-[4px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/30 md:px-6 md:py-[11px]"
						href={activeHeroSlide.secondaryBtn.link}
					>
						{activeHeroSlide.secondaryBtn.text}
					</a>
				</div>
			</div>

			{/*
				Indikator + panah:
				- mobile  : kiri bawah (bottom 104px)
				- md-lg   : (768-1279px) kiri bawah, sejajar dengan konten -> tidak menabrak
				- xl      : (>=1280px) di kanan, seperti desain awal
			*/}
			<div className="absolute bottom-[104px] left-[18px] right-[23px] z-10 flex items-center justify-between gap-4 rounded-full text-white md:bottom-[44px] md:left-6 md:right-auto md:justify-start md:px-0 md:py-1.5 xl:bottom-[132px] xl:left-auto xl:right-[max(113px,calc((100%-1280px)/2))] xl:px-3">
				<div className="flex items-center gap-[10px] md:gap-1.5" aria-label={t('common.slideNavigation')}>
					{translatedHeroSlides.map((slide, index) => {
						const isActive = index === heroIndex
						return (
							<button
								key={index}
								type="button"
								className={`relative h-[7px] w-[60px] cursor-pointer overflow-hidden rounded-full transition-all duration-300 md:h-2 md:w-16 xl:w-19 ${
									isActive ? 'bg-white/25 backdrop-blur-xs' : 'bg-[#AEAEAE99] hover:bg-white/70'
								}`}
								aria-label={t('common.showSlide', { number: index + 1, title: slide.title })}
								onClick={() => selectHero(index)}
							>
								{isActive && (
									<span
										key={heroIndex}
										className="absolute inset-y-0 left-0 animate-hero-progress rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
									/>
								)}
							</button>
						)
					})}
				</div>
				<div className="flex gap-0">
					<button
						className="grid h-6 w-5 cursor-pointer place-items-center text-2xl leading-none transition-opacity hover:opacity-70 md:h-10 md:w-7 md:text-3xl"
						type="button"
						aria-label={t('common.previous')}
						onClick={goPrev}
					>
						&larr;
					</button>
					<button
						className="grid h-6 w-5 cursor-pointer place-items-center text-2xl leading-none transition-opacity hover:opacity-70 md:h-10 md:w-7 md:text-3xl"
						type="button"
						aria-label={t('common.next')}
						onClick={goNext}
					>
						&rarr;
					</button>
				</div>
			</div>
		</section>
	)
}