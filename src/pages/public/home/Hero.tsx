import { useEffect, useState } from 'react'
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

export default function Hero() {
	const [heroIndex, setHeroIndex] = useState(0)
	const activeHeroSlide = heroSlides[heroIndex]

	useEffect(() => {
		const timer = setInterval(() => {
			setHeroIndex((prev) => (prev + 1) % heroSlides.length)
		}, 7000)
		return () => clearInterval(timer)
	}, [heroIndex])

	const goPrev = () => setHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
	const goNext = () => setHeroIndex((prev) => (prev + 1) % heroSlides.length)

	return (
		<section
			className="relative flex h-[100svh] min-h-[540px] items-end overflow-hidden pb-[140px] text-white md:h-[82vh] md:min-h-[640px] md:pb-[70px]"
			aria-label="Hero OBC Group"
		>
			{/* Crossfade background images */}
			{heroSlides.map((slide, index) => (
				<div
					key={index}
					className={`absolute inset-0 bg-cover bg-[8%_77%] bg-no-repeat transition-opacity duration-1000 ease-in-out md:bg-[center_72%] ${
						index === heroIndex ? 'opacity-100' : 'pointer-events-none opacity-0'
					}`}
					style={{ backgroundImage: `url(${slide.image})` }}
					aria-hidden={index !== heroIndex}
				/>
			))}

			{/* Overlay gradient (temanmu) */}
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45"
				aria-hidden="true"
			/>

			{/* Konten: mobile rata kiri 18px, desktop di tengah */}
			<div className="relative z-10 ml-[18px] w-[calc(100%-56px)] max-w-[1280px] md:mx-auto md:w-[calc(100%-48px)]">
				<h1 className="whitespace-pre-line font-['Montserrat'] text-[34px] font-bold leading-[42px] tracking-[0.5px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:text-[65px] md:leading-[80px]">
					{activeHeroSlide.title}
				</h1>

				<p className="my-[14px] mb-3 max-w-[620px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[0.5px] text-white [text-align:justify] [text-shadow:0px_1px_4px_rgba(0,0,0,0.3)] md:mb-6 md:text-[12px] md:leading-[15px]">
					{activeHeroSlide.description}
				</p>

				{/* Tombol: sejajar horizontal di mobile (2 tombol + chevron di tengah) */}
				<div className="flex max-w-[520px] flex-row gap-0 md:gap-1">
					<a
						className="inline-flex flex-none items-center justify-center rounded-full border border-white/90 bg-[#27282540] px-[10px] py-[4px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-[1.02] hover:border-obc-green hover:bg-obc-green md:flex-1 md:px-6 md:py-[11px]"
						href={activeHeroSlide.primaryBtn.link}
						target={activeHeroSlide.primaryBtn.link.startsWith('http') ? '_blank' : '_self'}
						rel="noreferrer"
					>
						{activeHeroSlide.primaryBtn.text}
					</a>
					<span aria-hidden="true" className="grid h-7 w-[35px] translate-y-1 place-items-center text-white/85 md:w-8">
						<svg viewBox="0 0 24 24" className="mt-3 h-6 w-6 md:mt-4 md:h-9 md:w-9" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 8.5L12 15.5L18 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</span>
					<a
						className="inline-flex flex-1 items-center justify-center rounded-full border border-white/90 bg-[#27282540] px-4 py-[4px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/30 md:px-6 md:py-[11px]"
						href={activeHeroSlide.secondaryBtn.link}
					>
						{activeHeroSlide.secondaryBtn.text}
					</a>
				</div>
			</div>

			{/* Indikator + panah: mobile di kiri bawah, desktop di kanan */}
			<div className="absolute bottom-[104px] left-[18px] right-[23px] z-10 flex items-center justify-between gap-4 rounded-full text-white md:bottom-[132px] md:left-auto md:right-[max(113px,calc((100%-1280px)/2))] md:justify-start md:px-3 md:py-1.5">
				<div className="flex items-center gap-[10px] md:gap-1.5" aria-label="Indikator navigasi">
					{heroSlides.map((slide, index) => {
						const isActive = index === heroIndex
						return (
							<button
								key={index}
								type="button"
								className={`relative h-[7px] w-[60px] cursor-pointer overflow-hidden rounded-full transition-all duration-300 md:h-2 md:w-19 ${
									isActive ? 'bg-white/25 backdrop-blur-xs' : 'bg-[#AEAEAE99] hover:bg-white/70'
								}`}
								aria-label={`Tampilkan slide ${index + 1}: ${slide.title}`}
								onClick={() => setHeroIndex(index)}
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
						aria-label="Navigasi sebelumnya"
						onClick={goPrev}
					>
						&larr;
					</button>
					<button
						className="grid h-6 w-5 cursor-pointer place-items-center text-2xl leading-none transition-opacity hover:opacity-70 md:h-10 md:w-7 md:text-3xl"
						type="button"
						aria-label="Navigasi berikutnya"
						onClick={goNext}
					>
						&rarr;
					</button>
				</div>
			</div>
		</section>
	)
}