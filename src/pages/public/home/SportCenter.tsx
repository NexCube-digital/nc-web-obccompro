import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, Play, X } from 'lucide-react'
import ModalVideo from '../../../components/ui/modal/ModalVideo'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../../assets/layanan/Lapang F2.png'
import billiardImage from '../../../assets/layanan/Meja Billiard.png'
import academyTeamImage from '../../../assets/layanan/OBC ACADEMY/sae-375.JPEG'
import academyRedImage from '../../../assets/layanan/OBC ACADEMY/sae-371.JPEG'
import volleyballIcon from '../../../assets/icon/iconstack.io - (Volleyball 2).svg'
import basketballIcon from '../../../assets/icon/iconstack.io - (Ic Fluent Sport Basketball 24 Filled).svg'
import footballIcon from '../../../assets/icon/iconstack.io - (Play Football).svg'
import tennisRacketIcon from '../../../assets/icon/iconstack.io - (Tennis Racket).svg'
import billiardIcon from '../../../assets/icon/iconstack.io - (Billiard 02).svg'
import bowlingBallIcon from '../../../assets/icon/iconstack.io - (Bowling Ball Fill).svg'
import baseballCapIcon from '../../../assets/icon/iconstack.io - (Baseball Cap Fill).svg'

export type SportCardProps = {
	image: string
	badge: string // label kiri atas
	icon: React.ReactNode // ikon kecil kanan atas
	items: string[] // list bullet di bawah gambar
	videoUrl?: string // tautan YouTube untuk video kartu
	onCardClick?: () => void
	imgHeight?: string // tinggi gambar, beda antar baris
	price?: string // teks harga yang muncul saat hover (opsional)
}

function SportCard({ image, badge, icon, items, videoUrl, onCardClick, imgHeight = 'h-[230px]', price }: SportCardProps) {
	const { t } = useTranslation()
	return (
		// Hover: kartu membesar tipis (scale 1.025) + bayangan melembut, smooth 500ms.
		// Gambar diberi scale kebalikan (1.025 -> 1) sehingga ukurannya TIDAK terlihat membesar (tanpa efek zoom).
		<article
			role="button"
			tabIndex={0}
			aria-label={`Buka ${badge}`}
			onClick={onCardClick}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					onCardClick?.()
				}
			}}
			className="group relative flex min-w-0 cursor-pointer flex-col rounded-2xl border border-[#eeeeee] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transform-gpu transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.025] hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004000]"
		>
			{/* gambar + overlay badge & icon */}
			<div className={`relative w-full ${imgHeight}`}>
				{/* Pembungkus overflow-hidden hanya untuk gambar, supaya lipatan badge tidak terpotong */}
				<div className="h-full w-full overflow-hidden rounded-t-2xl">
					<img
						className="h-full w-full scale-[1.025] object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
						src={image}
						alt={badge}
						loading="lazy"
						decoding="async"
					/>
				</div>

				{/* Lipatan badge kiri atas (versi asli): disembunyikan di ≤460px,
				    di sana lipatan dipindah ke dalam badge supaya ikut tinggi badge multi-baris */}
				<span
					aria-hidden="true"
					className="absolute left-[-8px] top-[22px] h-[17px] w-[8px] rounded-bl-[8px] bg-[#7FA52B] max-[460px]:hidden"
				/>

				{/* Label pill: kelas asli + override khusus ≤460px:
				    - sudut 10px (bukan full) supaya rapi saat teks 2-3 baris
				    - padding & line-height lebih rapat, teks rata kiri
				    - lebar maks dibatasi agar tidak menabrak ikon bulat di kanan atas
				    Catatan: pakai "!" agar menimpa rounded-full & rounded-bl-none bawaan */}
				<span className="absolute left-[-8px] top-3 max-w-[80%] rounded-full rounded-bl-none bg-[#CDF178] px-[10px] py-[3px] font-['Montserrat'] text-[10px] font-semibold leading-[13px] tracking-[0.3px] text-[#000000] max-[460px]:max-w-[calc(100%-28px)] max-[460px]:!rounded-[10px] max-[460px]:!rounded-bl-none max-[460px]:px-2 max-[460px]:py-[3px] max-[460px]:text-left max-[460px]:leading-[12px] max-[460px]:tracking-[0.2px] sm:max-w-[calc(100%-28px)] md:text-[11px] md:leading-[14px] md:tracking-[0.5px]">
					{badge}
					{/* Lipatan baru: menempel di bawah kiri badge, hanya tampil ≤460px */}
					<span
						aria-hidden="true"
						className="absolute left-0 top-full hidden h-2 w-2 rounded-bl-[8px] bg-[#7FA52B] max-[460px]:block"
					/>
				</span>

				{/* Ikon bulat kanan atas: mobile 24px */}
				<span className="absolute right-2 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#CDF178] text-[#1F3320] md:h-[22px] md:w-[22px]">
					{icon}
				</span>

				{/* Penanda play untuk kartu video */}
				{videoUrl && (
					<span aria-hidden="true" className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
						<Play size={18} fill="white" />
					</span>
				)}

				{/* Pill harga: hanya muncul saat hover, naik pelan sambil fade-in.
				    Hanya dirender kalau prop price diisi. */}
				{price && (
					<span className="pointer-events-none absolute bottom-3 left-1/2 w-[calc(100%-24px)] -translate-x-1/2 translate-y-2 truncate rounded-full border border-white/70 bg-black/35 px-3 py-1 text-center font-['Montserrat'] text-[10px] font-bold tracking-[0.5px] text-white opacity-0 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 sm:text-[12px] md:text-[14px] lg:text-[16px]">
						{t('common.startingFrom')} {price?.replace(/^Mulai dari /, '').replace('/jam', '')} {t('common.perHour')}
					</span>
				)}
			</div>

			{/* List fasilitas: mobile padding 12px, teks 12px, item melebar rata (justify-between);
			    mulai sm rata kiri supaya item yang wrap di kartu sempit tidak renggang aneh. */}
			<ul className="flex flex-wrap justify-between gap-x-3 gap-y-1 p-3 sm:justify-start sm:gap-x-4 md:gap-y-1.5 md:p-4">
				{items.map((item) => (
					<li
						className="flex items-center gap-2 font-body text-[12px] font-medium text-[#1a1a1a] md:text-[15px]"
						key={item}
					>
						<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a8a6b]" />
						{item}
					</li>
				))}
			</ul>
		</article>
	)
}

const sportRow1: SportCardProps[] = [
	{
		image: lapangF2Image,
		badge: 'Lapang F2 -  1 Olahraga di 1 waktu',
		icon: <img src={volleyballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Futsal 1', 'Badminton', 'Voli', 'Pickleball'],
		price: 'Mulai dari Rp120.000/jam',
	},
	{
		image: lapangF1Image,
		badge: 'Lapang F2 -  1 Olahraga di 1 waktu',
		icon: <img src={basketballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Futsal 2', 'Basket'],
		price: 'Mulai dari Rp100.000/jam',
	},
	{
		image: lapangF2Image,
		badge: 'Lapang Sepak Bola',
		icon: <img src={footballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Untuk flat 2jam Permainan'],
		price: 'Mulai dari Rp250.000/jam',
		videoUrl: 'https://youtu.be/IMg-w8g8Ekk?si=PJFi08CA4CaQGyhX',
	},
]

const sportRow2: SportCardProps[] = [
	{
		image: academyTeamImage,
		badge: 'Ruang Tenis Meja',
		icon: <img src={tennisRacketIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['2 meja tenis', 'Bisa 2 booking paralel'],
		price: 'Mulai dari Rp50.000/jam',
		videoUrl: 'https://youtu.be/IMg-w8g8Ekk?si=PJFi08CA4CaQGyhX',
	},
	{
		image: billiardImage,
		badge: 'Ruang Billiard',
		icon: <img src={billiardIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['2 meja billiard', 'Bisa 2 booking paralel'],
		price: 'Mulai dari Rp60.000/jam',
	},
	{
		image: academyRedImage,
		badge: 'OBC Academy',
		icon: <img src={baseballCapIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['L/P Usia 6-16 Tahun', 'Free Trial 2X'],
		price: 'Mulai dari Rp75.000/jam',
	},
	{
		image: lapangF1Image,
		badge: 'Coaching Class Pickleball',
		icon: <img src={bowlingBallIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Training Program ±3 bulan', 'Setiap Sabtu & Minggu'],
		price: 'Mulai dari Rp150.000/jam',
		videoUrl: 'https://youtu.be/IMg-w8g8Ekk?si=PJFi08CA4CaQGyhX',
	},
]

export default function SportCenter() {
	const { t } = useTranslation()
	const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null)
	const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null)
	const imageCloseButtonRef = useRef<HTMLButtonElement>(null)
	const row1TranslationKeys = [
		{ badge: 'sportCenterSection.courtF2_1', items: ['futsal1', 'badminton', 'voli', 'pickleball'] },
		{ badge: 'sportCenterSection.courtF1_1', items: ['futsal2', 'basket'] },
		{ badge: 'sportCenterSection.footballCourt', items: ['flat2Hours'] },
	]
	const row2TranslationKeys = [
		{ badge: 'sportCenterSection.tableTennisRoom', items: ['twoTables', 'parallelBooking'] },
		{ badge: 'sportCenterSection.billiardRoom', items: ['twoBilliardTables', 'parallelBooking'] },
		{ badge: 'sportCenterSection.academy', items: ['academyAge', 'freeTrial2x'] },
		{ badge: 'sportCenterSection.pickleballClass', items: ['pickleballDuration', 'pickleballSchedule'] },
	]

	useEffect(() => {
		if (!activeImage) return

		const previousOverflow = document.body.style.overflow
		const previouslyFocused = document.activeElement as HTMLElement | null
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setActiveImage(null)
		}

		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleEscape)
		imageCloseButtonRef.current?.focus()

		return () => {
			document.body.style.overflow = previousOverflow
			document.removeEventListener('keydown', handleEscape)
			previouslyFocused?.focus?.()
		}
	}, [activeImage])

	const openCardMedia = (card: SportCardProps, title: string) => {
		if (card.videoUrl) {
			setActiveVideo({ url: card.videoUrl, title })
			return
		}

		setActiveImage({ src: card.image, title })
	}

	return (
		<section className="flex flex-col justify-center bg-white px-0 py-10 md:py-14" id="fasilitas">
			<div className="mx-auto w-[calc(100%-40px)] max-w-[1280px] md:w-[calc(100%-48px)]">
				
				<div className="mb-6 flex flex-col items-start justify-between gap-4 px-0 sm:px-[15px] md:flex-row md:items-center md:gap-6">
					<div className="min-w-0">
						<h2 className="h-auto w-full max-w-[1180px] font-['Montserrat'] text-[24px] font-extrabold leading-[30px] tracking-[-0.6px] text-[#000000] sm:text-[28px] sm:leading-[36px] md:min-h-[40px] md:text-[32px] md:leading-[40px] md:tracking-[-0.9px] lg:text-[36px]">
							{t('sportCenterSection.title')}
						</h2>
						<p className="mt-3 h-auto w-full max-w-[834px] align-middle font-['Montserrat'] text-[16px] font-normal leading-[24px] tracking-[0.5px] text-justify text-[#000000] md:mt-2 md:h-auto md:text-[16px] lg:min-h-[48px] lg:text-[20px] lg:tracking-[1px]">
							{t('sportCenterSection.subtitle')}
						</p>
					</div>
					<a
						className="group inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-3 self-end rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1.5 font-['Montserrat'] text-[16px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-all duration-300 hover:border-[#004000] hover:bg-[#004000] md:self-auto md:px-4 md:py-2 lg:text-[20px]"
						href="https://sport.obcgroup.id/"
						target="_blank"
						rel="noreferrer"
					>
						<span className="flex-1 whitespace-nowrap text-center text-[#1F3320] transition-all duration-300 group-hover:font-medium group-hover:tracking-[0.8px] group-hover:!text-[#CDF178]">
							{t('sportCenterSection.bookingNow')}
						</span>
						<span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] transition-colors duration-300 group-hover:bg-[#CDF178] group-hover:text-[#004000] md:h-[44px] md:w-[44px] lg:h-[52px] lg:w-[52px]">
							<ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45 md:h-[22px] md:w-[22px] lg:h-[25px] lg:w-[25px]" />
						</span>
					</a>
				</div>

				
				<div className="grid grid-cols-2 gap-[22px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-[422fr_420fr_337fr] [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
					{sportRow1.map((card, i) => (
						<SportCard
							key={`r1-${i}`}
							{...card}
							badge={t(row1TranslationKeys[i].badge)}
							onCardClick={() => openCardMedia(card, t(row1TranslationKeys[i].badge))}
							items={row1TranslationKeys[i].items.map((item) => t(`sportCenterSection.items.${item}`))}
							imgHeight="h-[120px] sm:h-[clamp(120px,22.6svh,181px)]"
						/>
					))}
				</div>

				{/* Baris 2: 2 kolom sampai lg, 4 kolom mulai lg */}
				<div className="mt-[22px] grid grid-cols-2 gap-[22px] sm:mt-4 sm:gap-4 lg:grid-cols-4">
					{sportRow2.map((card, i) => (
						<SportCard
							key={`r2-${i}`}
							{...card}
							badge={t(row2TranslationKeys[i].badge)}
							onCardClick={() => openCardMedia(card, t(row2TranslationKeys[i].badge))}
							items={row2TranslationKeys[i].items.map((item) => t(`sportCenterSection.items.${item}`))}
							imgHeight="h-[120px] sm:h-[clamp(120px,20.25svh,162px)]"
						/>
					))}
				</div>
			</div>
			<ModalVideo
				isOpen={activeVideo !== null}
				videoUrl={activeVideo?.url ?? ''}
				title={activeVideo?.title ?? t('sportCenterSection.title')}
				onClose={() => setActiveVideo(null)}
			/>
			{activeImage &&
				createPortal(
					<div
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
						onClick={() => setActiveImage(null)}
					>
						<div
							role="dialog"
							aria-modal="true"
							aria-label={activeImage.title}
							className="relative grid max-h-[94svh] max-w-[96vw] place-items-center"
							onClick={(event) => event.stopPropagation()}
						>
							<button
								ref={imageCloseButtonRef}
								type="button"
								aria-label="Tutup gambar"
								onClick={() => setActiveImage(null)}
								className="absolute -right-2 -top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-right-4 sm:-top-4"
							>
								<X size={22} />
							</button>
							<img
								className="max-h-[92svh] max-w-[96vw] rounded-xl object-contain shadow-2xl"
								src={activeImage.src}
								alt={activeImage.title}
							/>
						</div>
					</div>,
					document.body,
				)}
		</section>
	)
}