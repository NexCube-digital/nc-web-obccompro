import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import sportCenterLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER.png'
import guestHouseLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import villaLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (3).png'
import laundryLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (4).png'
import foodCourtLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (5).png'
import coffeeLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (6).png'
import agribusinessLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (7).png'

type Unit = {
	name: string
	image: string
	link: string
	isExternal: boolean
}

const units: Unit[] = [
	{ name: 'OBC Sport Center', image: sportCenterLogo, link: 'https://sport.obcgroup.id/', isExternal: true },
	{ name: 'OBC Guest House', image: guestHouseLogo, link: '/unit-bisnis/guest-house', isExternal: false },
	{ name: 'OBC Villa', image: villaLogo, link: '/unit-bisnis/villa', isExternal: false },
	{ name: 'OBC Laundry', image: laundryLogo, link: '/unit-bisnis/laundry', isExternal: false },
	{ name: 'OBC Food Court', image: foodCourtLogo, link: '/unit-bisnis/food-court', isExternal: false },
	{ name: 'OBC Coffee', image: coffeeLogo, link: '/unit-bisnis/coffee', isExternal: false },
	{ name: 'OBC Agribisnis', image: agribusinessLogo, link: '/unit-bisnis/agribisnis', isExternal: false },
]

type UnitCardProps = {
	unit: Unit
	isFavorite: boolean
	onToggleFavorite: (name: string) => void
	className?: string
}

function UnitCard({ unit, isFavorite, onToggleFavorite, className = '' }: UnitCardProps) {
	const stretchedClass = 'absolute inset-0 z-0 rounded-[14px] md:rounded-[20px]'
	const bookingClass =
		'btn-booking-now inline-flex h-[20px] items-center justify-center rounded-full px-2 font-heading text-[10px] font-semibold md:h-7 md:px-3.5 md:text-[11px]'

	return (
		<article
			className={`group relative flex cursor-pointer flex-col items-center rounded-[14px] border border-transparent bg-white p-3 pt-[22px] text-center shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b8e28a] hover:bg-[#f0f7e6] hover:shadow-[0_12px_28px_rgba(0,64,0,0.12)] md:rounded-[20px] md:border-[#e5e5e5] md:p-6 md:pt-8 md:shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${className}`}
		>
			{/* Stretched link ke halaman unit */}
			{unit.isExternal ? (
				<a
					className={stretchedClass}
					href={unit.link}
					target="_blank"
					rel="noreferrer"
					aria-label={`Buka halaman ${unit.name}`}
				/>
			) : (
				<Link className={stretchedClass} to={unit.link} aria-label={`Buka halaman ${unit.name}`} />
			)}

			{/* Tombol favorit: mobile tanpa lingkaran & border, desktop lingkaran */}
			<button
				type="button"
				className="absolute right-2 top-2 z-10 grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-transparent text-[#111111] transition-all hover:text-red-500 md:right-3 md:top-3 md:h-9 md:w-9 md:border md:border-[#e5e5e5] md:bg-white md:hover:bg-[#f5f5f5] md:group-hover:border-[#b8e28a]/60"
				onClick={(e) => {
					e.stopPropagation()
					onToggleFavorite(unit.name)
				}}
				aria-label={`Favoritkan ${unit.name}`}
			>
				<Heart
					className={`h-[22px] w-[22px] md:h-[15px] md:w-[15px] ${
						isFavorite ? 'fill-red-500 text-red-500' : ''
					}`}
				/>
			</button>

			{/* Logo: mobile 78px, desktop 130px */}
			<div className="pointer-events-none relative z-10 grid h-[78px] w-[78px] place-items-center md:h-[130px] md:w-[130px]">
				<img
					className="block max-h-[78px] max-w-[78px] object-contain transition-transform duration-300 group-hover:scale-105 md:max-h-[130px] md:max-w-[130px]"
					src={unit.image}
					alt={`Logo ${unit.name}`}
				/>
			</div>

			{/* Info & tombol: mobile rata tengah, desktop rata kiri */}
			<div className="relative z-10 mt-2 w-full text-center md:mt-3 md:text-left">
				<h3 className="font-heading text-[15px] font-bold text-[#111111] md:text-[16px]">{unit.name}</h3>
				<div className="mt-1.5 flex w-full items-center justify-center gap-1.5 md:mt-2.5 md:justify-between md:gap-2">
					{unit.isExternal ? (
						<a className={bookingClass} href={unit.link} target="_blank" rel="noreferrer">
							Booking Now
						</a>
					) : (
						<Link className={bookingClass} to={unit.link}>
							Booking Now
						</Link>
					)}
					<span className="inline-flex shrink-0 items-center gap-1 font-heading text-[10px] font-semibold text-[#111111] transition-[gap] group-hover:gap-2 md:text-[11px]">
						Detail Unit <ArrowRight size={11} />
					</span>
				</div>
			</div>
		</article>
	)
}

export default function UnitBisnis() {
	const [favorites, setFavorites] = useState<string[]>([])

	const toggleFavorite = (name: string) => {
		setFavorites((prev) =>
			prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
		)
	}

	return (
		<section
			className="mx-auto w-[calc(100%-44px)] max-w-[1280px] bg-[#fffff7] py-[55px] pb-[50px] md:w-[calc(100%-48px)] md:py-[70px] md:pb-[90px]"
			id="layanan"
		>
			{/* Label: mobile title case & lebih tipis, desktop kapital */}
			<span className="mb-1 block text-center font-['Montserrat'] text-[16px] font-medium normal-case leading-[20px] tracking-normal text-[#000000] md:mb-3 md:text-[18px] md:font-semibold md:uppercase md:tracking-[1.4px] md:text-[#000000CC]">
				Bisnis Kami
			</span>
			{/* Judul: mobile 22px 2 baris, desktop 36px */}
			<h2 className="mx-auto h-auto w-full max-w-[320px] text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] tracking-normal text-[#000000] opacity-100 md:h-[45px] md:max-w-[1098px] md:text-[36px] md:font-bold md:leading-[45px] md:tracking-[1.5px]">
				Beragam Layanan dalam Satu Ekosistem
			</h2>
			<div
				className="mx-auto mt-4 w-full max-w-full border-t border-[#00000080] md:mt-3 md:w-[812px] md:border-t-2"
				aria-hidden="true"
			/>

			{/* Baris 1: 4 unit. Mobile 2 kolom */}
			<div className="mt-6 grid grid-cols-2 gap-[14px] md:mt-9 md:gap-6 lg:grid-cols-4">
				{units.slice(0, 4).map((unit) => (
					<UnitCard
						key={unit.name}
						unit={unit}
						isFavorite={favorites.includes(unit.name)}
						onToggleFavorite={toggleFavorite}
					/>
				))}
			</div>

			{/* Baris 2: 3 unit. Mobile 2 kolom, kartu terakhir di tengah */}
			<div className="mx-auto mt-[14px] grid max-w-[calc(3*280px+2*1.5rem)] grid-cols-2 gap-[14px] md:mt-6 md:gap-6 lg:grid-cols-3">
				{units.slice(4).map((unit) => (
					<UnitCard
						key={unit.name}
						unit={unit}
						isFavorite={favorites.includes(unit.name)}
						onToggleFavorite={toggleFavorite}
						className="w-full max-w-[280px] justify-self-center last:col-span-2 last:w-[calc(50%-7px)] md:last:col-span-1 md:last:w-full"
					/>
				))}
			</div>
		</section>
	)
}