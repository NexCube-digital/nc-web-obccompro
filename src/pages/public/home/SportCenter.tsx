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
	badge: string
	icon: React.ReactNode
	items: string[]
	hasVideo?: boolean
	imgHeight?: string
}

function SportCard({ image, badge, icon, items, hasVideo, imgHeight = 'h-[230px]' }: SportCardProps) {
	return (
		<article className="relative flex flex-col rounded-2xl border border-[#e5e5e5] bg-white">
			{/* gambar + overlay badge & icon */}
			<div className={`relative w-full ${imgHeight}`}>
				<img
					className="h-full w-full rounded-t-2xl object-cover"
					src={image}
					alt={badge}
				/>
				<span
					aria-hidden="true"
					className="absolute left-[-8px] top-[22px] h-[17px] w-[8px] rounded-bl-[8px] bg-[#7FA52B]"
				/>
				<span className="absolute left-[-8px] top-3 rounded-full rounded-bl-none bg-[#CDF178] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[0.5px] text-[#000000]">
					{badge}
				</span>
				<span className="absolute right-2 top-3 grid h-[22px] w-[22px] place-items-center rounded-full bg-[#CDF178] text-[#1F3320]">
					{icon}
				</span>
				{hasVideo && (
					<span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
						<Play size={18} fill="white" />
					</span>
				)}
			</div>

			<ul className="flex flex-wrap gap-x-4 gap-y-1.5 p-4">
				{items.map((item) => (
					<li
						className="flex items-center gap-2 font-body text-[15px] font-medium text-[#1a1a1a]"
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
		<section className="bg-white px-0 py-10 pb-14" id="fasilitas">
			<div className="mx-auto w-[calc(100%-32px)] max-w-[1246px] px-4 sm:px-6">
				{/* Header */}
				<div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div>
						<h2 className="h-[40px] w-full max-w-[1180px] font-['Montserrat'] text-[36px] font-extrabold leading-[40px] tracking-[-0.9px] text-[#000000]">
							OBC SPORT CENTER
						</h2>
						<p className="mt-2 h-[48px] w-full max-w-[834px] align-middle font-['Montserrat'] text-[20px] font-normal leading-[24px] tracking-[1px] text-justify text-[#000000]">
							Dari pertandingan kompetitif hingga permainan santai, temukan ruang
							olahraga yang sesuai untukmu.
						</p>
					</div>
					<a
						className="inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-4 py-2 font-['Montserrat'] text-[20px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a]"
						href="https://sport.obcgroup.id/"
						target="_blank"
						rel="noreferrer"
					>
						<span className="flex-1 whitespace-nowrap text-center">Booking Sekarang</span>
						<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
							<ArrowUpRight size={25} />
						</span>
					</a>
				</div>

				{/* Baris 1 — 2 kartu lebar + 1 kartu sempit (rasio 422 : 420 : 337) */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[422fr_420fr_337fr]">
					{sportRow1.map((card, i) => (
						<SportCard key={`r1-${i}`} {...card} imgHeight="h-[181px]" />
					))}
				</div>

				{/* Baris 2 — 4 kartu sama lebar */}
				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{sportRow2.map((card, i) => (
						<SportCard key={`r2-${i}`} {...card} imgHeight="h-[162px]" />
					))}
				</div>
			</div>
		</section>
	)
}
