import React from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
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
	hasVideo?: boolean // tombol play di tengah gambar
	imgHeight?: string // tinggi gambar, beda antar baris
}

function SportCard({ image, badge, icon, items, hasVideo, imgHeight = 'h-[230px]' }: SportCardProps) {
	return (
		<article className="relative flex flex-col rounded-2xl border border-[#e5e5e5] bg-white">
			{/* gambar + overlay badge & icon */}
			<div className={`relative w-full ${imgHeight}`}>
				<img className="h-full w-full rounded-t-2xl object-cover" src={image} alt={badge} />

				{/* lipatan badge kiri atas */}
				<span
					aria-hidden="true"
					className="absolute left-[-8px] top-[22px] h-[17px] w-[8px] rounded-bl-[8px] bg-[#7FA52B]"
				/>

				{/* Label pill: mobile 10px & boleh 2 baris (max 80% lebar gambar), desktop tetap */}
				<span className="absolute left-[-8px] top-3 max-w-[80%] rounded-full rounded-bl-none bg-[#CDF178] px-[10px] py-[3px] font-['Montserrat'] text-[10px] font-semibold leading-[13px] tracking-[0.3px] text-[#000000] md:max-w-none md:text-[11px] md:leading-[14px] md:tracking-[0.5px]">
					{badge}
				</span>

				{/* Ikon bulat kanan atas: mobile 24px */}
				<span className="absolute right-2 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#CDF178] text-[#1F3320] md:h-[22px] md:w-[22px]">
					{icon}
				</span>

				{/* Tombol play untuk kartu video */}
				{hasVideo && (
					<span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
						<Play size={18} fill="white" />
					</span>
				)}
			</div>

			{/* List fasilitas: mobile padding 12px, teks 12px, item melebar rata; desktop tetap */}
			<ul className="flex flex-wrap justify-between gap-x-3 gap-y-1 p-3 md:justify-start md:gap-x-4 md:gap-y-1.5 md:p-4">
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
	},
	{
		image: lapangF1Image,
		badge: 'Lapang F2 -  1 Olahraga di 1 waktu',
		icon: <img src={basketballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Futsal 2', 'Basket'],
	},
	{
		image: lapangF2Image,
		badge: 'Lapang Sepak Bola',
		icon: <img src={footballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Untuk flat 2jam Permainan'],
		hasVideo: true,
	},
]

const sportRow2: SportCardProps[] = [
	{
		image: academyTeamImage,
		badge: 'Ruang Tenis Meja',
		icon: <img src={tennisRacketIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['2 meja tenis', 'Bisa 2 booking paralel'],
		hasVideo: true,
	},
	{
		image: billiardImage,
		badge: 'Ruang Billiard',
		icon: <img src={billiardIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['2 meja billiard', 'Bisa 2 booking paralel'],
	},
	{
		image: academyRedImage,
		badge: 'OBC Academy',
		icon: <img src={baseballCapIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['L/P Usia 6-16 Tahun', 'Free Trial 2X'],
	},
	{
		image: lapangF1Image,
		badge: 'Coaching Class Pickleball',
		icon: <img src={bowlingBallIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ['Training Program ±3 bulan', 'Setiap Sabtu & Minggu'],
		hasVideo: true,
	},
]

export default function SportCenter() {
	return (
		<section className="bg-white px-0 py-[55px] pb-10 md:py-10 md:pb-14" id="fasilitas">
			<div className="mx-auto w-[calc(100%-40px)] max-w-[1280px] md:w-[calc(100%-48px)]">
				{/* Header: mobile teks di atas, tombol di bawah rata kanan */}
				<div className="mb-6 flex flex-col items-start justify-between gap-4 px-0 md:flex-row md:items-center md:gap-6 md:px-[15px]">
					<div>
						<h2 className="h-auto w-full max-w-[1180px] font-['Montserrat'] text-[24px] font-extrabold leading-[30px] tracking-[-0.6px] text-[#000000] md:h-[40px] md:text-[36px] md:leading-[40px] md:tracking-[-0.9px]">
							OBC SPORT CENTER
						</h2>
						<p className="mt-3 h-auto w-full max-w-[834px] align-middle font-['Montserrat'] text-[16px] font-normal leading-[24px] tracking-[0.5px] text-justify text-[#000000] md:mt-2 md:h-[48px] md:text-[20px] md:tracking-[1px]">
							Dari pertandingan kompetitif hingga permainan santai, temukan ruang
							olahraga yang sesuai untukmu.
						</p>
					</div>
					<a
						className="inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-3 self-end rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1.5 font-['Montserrat'] text-[16px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a] md:self-auto md:px-4 md:py-2 md:text-[20px]"
						href="https://sport.obcgroup.id/"
						target="_blank"
						rel="noreferrer"
					>
						<span className="flex-1 whitespace-nowrap text-center">Booking Sekarang</span>
						<span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] md:h-[52px] md:w-[52px]">
							<ArrowUpRight className="h-[18px] w-[18px] md:h-[25px] md:w-[25px]" />
						</span>
					</a>
				</div>

				{/* Baris 1: mobile 2 kolom, kartu pertama lebar penuh; sm ke atas seperti semula */}
				<div className="grid grid-cols-2 gap-[22px] sm:gap-4 lg:grid-cols-[422fr_420fr_337fr] [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
					{sportRow1.map((card, i) => (
						<SportCard key={`r1-${i}`} {...card} imgHeight="h-[120px] sm:h-[181px]" />
					))}
				</div>

				{/* Baris 2: mobile 2 kolom */}
				<div className="mt-[22px] grid grid-cols-2 gap-[22px] sm:mt-4 sm:gap-4 lg:grid-cols-4">
					{sportRow2.map((card, i) => (
						<SportCard key={`r2-${i}`} {...card} imgHeight="h-[120px] sm:h-[162px]" />
					))}
				</div>
			</div>
		</section>
	)
}