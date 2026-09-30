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
		title: 'OBC Guest House & Penthouse',
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

	return (
		<section
			className="relative flex min-h-screen min-h-[100dvh] w-full flex-col justify-end overflow-hidden pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28 text-white"
			aria-label="Hero OBC Group"
		>
			{/* Crossfade background images */}
			{heroSlides.map((slide, index) => (
				<div
					key={index}
					className={`absolute inset-0 bg-cover bg-[center_72%] bg-no-repeat transition-opacity duration-1000 ease-in-out ${
						index === heroIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
					}`}
					style={{
						backgroundImage: `url(${slide.image})`,
					}}
					aria-hidden={index !== heroIndex}
				/>
			))}

			{/* Overlay gradient untuk kontras teks optimal */}
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45"
				aria-hidden="true"
			/>

			{/* Container Konten Hero */}
			<div className="relative z-10 mx-auto w-[calc(100%-32px)] max-w-[1246px] px-4 sm:px-6">
				<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					{/* Kolom Kiri: Judul, Deskripsi, Tombol CTA */}
					<div className="max-w-[680px] lg:max-w-[720px]">
						<h1 className="font-['Montserrat'] text-3xl font-bold tracking-[0.5px] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:text-4xl md:text-5xl lg:text-[56px] lg:leading-[68px] xl:text-[65px] xl:leading-[80px]">
							{activeHeroSlide.title}
						</h1>
						<p className="my-3.5 mb-6 max-w-[620px] font-['Montserrat'] text-xs font-semibold leading-relaxed tracking-[0.5px] text-white sm:text-[13px] md:text-[14px] lg:text-[15px] [text-shadow:0px_1px_4px_rgba(0,0,0,0.3)] text-left sm:text-justify">
							{activeHeroSlide.description}
						</p>
						<div className="flex max-w-[540px] flex-col gap-2.5 sm:flex-row sm:items-center">
							<a
								className="inline-flex flex-1 items-center justify-center rounded-full border border-white/90 bg-[#27282540] px-6 py-[11px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-obc-green hover:border-obc-green"
								href={activeHeroSlide.primaryBtn.link}
								target={activeHeroSlide.primaryBtn.link.startsWith('http') ? '_blank' : '_self'}
								rel="noreferrer"
							>
								{activeHeroSlide.primaryBtn.text}
							</a>
							<span aria-hidden="true" className="hidden sm:grid h-7 w-8 place-items-center text-white/85">
								<svg viewBox="0 0 24 24" className="h-6 w-6 mt-1" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6 8.5L12 15.5L18 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
							<a
								className="inline-flex flex-1 items-center justify-center rounded-full border border-white/90 bg-[#27282540] px-6 py-[11px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/30"
								href={activeHeroSlide.secondaryBtn.link}
							>
								{activeHeroSlide.secondaryBtn.text}
							</a>
						</div>
					</div>

					{/* Kolom Kanan: Navigasi Indikator & Panah Carousel */}
					<div className="hidden shrink-0 items-center gap-4 rounded-full px-3 py-1.5 text-white md:flex mb-1">
						<div className="flex items-center gap-2" aria-label="Indikator navigasi">
							{heroSlides.map((slide, index) => {
								const isActive = index === heroIndex
								return (
									<button
										key={index}
										type="button"
										className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
											isActive
												? 'w-12 lg:w-16 bg-white/25 backdrop-blur-xs'
												: 'w-6 lg:w-8 bg-[#AEAEAE99] hover:bg-white/70'
										}`}
										aria-label={`Tampilkan slide ${index + 1}: ${slide.title}`}
										onClick={() => setHeroIndex(index)}
									>
										{isActive && (
											<span
												key={heroIndex}
												className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-hero-progress"
											/>
										)}
									</button>
								)
							})}
						</div>
						<div className="flex gap-0.5">
							<button
								className="grid h-10 w-8 place-items-center text-3xl leading-none transition-opacity hover:opacity-70 cursor-pointer"
								type="button"
								aria-label="Navigasi sebelumnya"
								onClick={() => setHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
							>
								&larr;
							</button>
							<button
								className="grid h-10 w-8 place-items-center text-3xl leading-none transition-opacity hover:opacity-70 cursor-pointer"
								type="button"
								aria-label="Navigasi berikutnya"
								onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
							>
								&rarr;
							</button>
						</div>
					</div>
				</div>

				{/* Navigasi Mobile (<768px) */}
				<div className="mt-6 flex items-center justify-between md:hidden">
					<div className="flex items-center gap-1.5" aria-label="Indikator navigasi mobile">
						{heroSlides.map((slide, index) => {
							const isActive = index === heroIndex
							return (
								<button
									key={index}
									type="button"
									className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
										isActive ? 'w-10 bg-white/25 backdrop-blur-xs' : 'w-4 bg-white/40'
									}`}
									aria-label={`Tampilkan slide ${index + 1}: ${slide.title}`}
									onClick={() => setHeroIndex(index)}
								>
									{isActive && (
										<span
											key={heroIndex}
											className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-hero-progress"
										/>
									)}
								</button>
							)
						})}
					</div>
					<div className="flex items-center gap-1">
						<button
							className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-xl leading-none text-white backdrop-blur-sm active:scale-95 cursor-pointer"
							type="button"
							aria-label="Navigasi sebelumnya"
							onClick={() => setHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
						>
							&larr;
						</button>
						<button
							className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-xl leading-none text-white backdrop-blur-sm active:scale-95 cursor-pointer"
							type="button"
							aria-label="Navigasi berikutnya"
							onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
						>
							&rarr;
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
