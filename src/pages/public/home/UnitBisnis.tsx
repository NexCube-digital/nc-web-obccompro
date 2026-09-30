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

const units = [
	{
		name: 'OBC Sport Center',
		image: sportCenterLogo,
		link: 'https://sport.obcgroup.id/',
		isExternal: true,
	},
	{
		name: 'OBC Guest House',
		image: guestHouseLogo,
		link: '/unit-bisnis/guest-house',
		isExternal: false,
	},
	{
		name: 'OBC Villa',
		image: villaLogo,
		link: '/unit-bisnis/villa',
		isExternal: false,
	},
	{
		name: 'OBC Laundry',
		image: laundryLogo,
		link: '/unit-bisnis/laundry',
		isExternal: false,
	},
	{
		name: 'OBC Food Court',
		image: foodCourtLogo,
		link: '/unit-bisnis/food-court',
		isExternal: false,
	},
	{
		name: 'OBC Coffee',
		image: coffeeLogo,
		link: '/unit-bisnis/coffee',
		isExternal: false,
	},
	{
		name: 'OBC Agribisnis',
		image: agribusinessLogo,
		link: '/unit-bisnis/agribisnis',
		isExternal: false,
	},
]

export default function UnitBisnis() {
	const [favorites, setFavorites] = useState<string[]>([])

	const toggleFavorite = (name: string) => {
		setFavorites((prev) =>
			prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
		)
	}

	return (
		<section
			className="mx-auto w-[calc(100%-32px)] max-w-[1246px] px-4 sm:px-6 bg-[#fffff7] py-[70px] pb-[90px]"
			id="layanan"
		>
			<span className="mb-3 block text-center font-['Montserrat'] text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-[#000000CC]">
				Bisnis Kami
			</span>
			<h2 className="mx-auto h-[45px] w-full max-w-[1098px] text-center font-['Montserrat'] text-[36px] font-bold leading-[45px] tracking-[1.5px] text-[#000000] opacity-100">
				Beragam Layanan dalam Satu Ekosistem
			</h2>
			<div
				className="mx-auto mt-3 w-[812px] max-w-full border-t-2 border-[#00000080]"
				aria-hidden="true"
			/>

			{/* Baris 1: 4 Unit Bisnis */}
			<div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{units.slice(0, 4).map((unit) => (
					<article
						className="group relative flex flex-col items-center rounded-[20px] border border-[#e5e5e5] bg-white p-6 pt-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f0f7e6] hover:border-[#b8e28a] hover:shadow-[0_12px_28px_rgba(0,64,0,0.12)] cursor-pointer"
						key={unit.name}
					>
						{/* Stretched link ke halaman unit */}
						{unit.isExternal ? (
							<a
								className="absolute inset-0 z-0 rounded-[20px]"
								href={unit.link}
								target="_blank"
								rel="noreferrer"
								aria-label={`Buka halaman ${unit.name}`}
							/>
						) : (
							<Link
								className="absolute inset-0 z-0 rounded-[20px]"
								to={unit.link}
								aria-label={`Buka halaman ${unit.name}`}
							/>
						)}

						{/* Tombol Favorit */}
						<button
							type="button"
							className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-[#e5e5e5] bg-white text-[#111111] transition-all hover:bg-[#f5f5f5] hover:text-red-500 group-hover:border-[#b8e28a]/60 cursor-pointer"
							onClick={(e) => {
								e.stopPropagation()
								toggleFavorite(unit.name)
							}}
							aria-label={`Favoritkan ${unit.name}`}
						>
							<Heart
								size={15}
								className={favorites.includes(unit.name) ? 'fill-red-500 text-red-500' : ''}
							/>
						</button>

						{/* Logo Unit */}
						<div className="relative z-10 pointer-events-none grid h-[130px] w-[130px] place-items-center">
							<img
								className="block max-h-[130px] max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
								src={unit.image}
								alt={`Logo ${unit.name}`}
							/>
						</div>

						{/* Info & Tombol */}
						<div className="relative z-10 mt-3 w-full text-left">
							<h3 className="font-heading text-[16px] font-bold text-[#111111]">
								{unit.name}
							</h3>
							<div className="mt-2.5 flex w-full items-center justify-between gap-2">
								{unit.isExternal ? (
									<a
										className="btn-booking-now inline-flex h-7 items-center justify-center rounded-full px-3.5 font-heading text-[11px] font-semibold"
										href={unit.link}
										target="_blank"
										rel="noreferrer"
									>
										Booking Now
									</a>
								) : (
									<Link
										className="btn-booking-now inline-flex h-7 items-center justify-center rounded-full px-3.5 font-heading text-[11px] font-semibold"
										to={unit.link}
									>
										Booking Now
									</Link>
								)}
								<span className="inline-flex shrink-0 items-center gap-1 font-heading text-[11px] font-semibold text-[#111111] transition-[gap] group-hover:gap-2">
									Detail Unit <ArrowRight size={11} />
								</span>
							</div>
						</div>
					</article>
				))}
			</div>

			{/* Baris 2: 3 Unit Bisnis */}
			<div className="mt-6 mx-auto grid max-w-[calc(3*280px+2*1.5rem)] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{units.slice(4).map((unit) => (
					<article
						className="group relative flex w-full max-w-[280px] flex-col items-center justify-self-center rounded-[20px] border border-[#e5e5e5] bg-white p-6 pt-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f0f7e6] hover:border-[#b8e28a] hover:shadow-[0_12px_28px_rgba(0,64,0,0.12)] cursor-pointer"
						key={unit.name}
					>
						{/* Stretched link ke halaman unit */}
						{unit.isExternal ? (
							<a
								className="absolute inset-0 z-0 rounded-[20px]"
								href={unit.link}
								target="_blank"
								rel="noreferrer"
								aria-label={`Buka halaman ${unit.name}`}
							/>
						) : (
							<Link
								className="absolute inset-0 z-0 rounded-[20px]"
								to={unit.link}
								aria-label={`Buka halaman ${unit.name}`}
							/>
						)}

						{/* Tombol Favorit */}
						<button
							type="button"
							className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-[#e5e5e5] bg-white text-[#111111] transition-all hover:bg-[#f5f5f5] hover:text-red-500 group-hover:border-[#b8e28a]/60 cursor-pointer"
							onClick={(e) => {
								e.stopPropagation()
								toggleFavorite(unit.name)
							}}
							aria-label={`Favoritkan ${unit.name}`}
						>
							<Heart
								size={15}
								className={favorites.includes(unit.name) ? 'fill-red-500 text-red-500' : ''}
							/>
						</button>

						{/* Logo Unit */}
						<div className="relative z-10 pointer-events-none grid h-[130px] w-[130px] place-items-center">
							<img
								className="block max-h-[130px] max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-105"
								src={unit.image}
								alt={`Logo ${unit.name}`}
							/>
						</div>

						{/* Info & Tombol */}
						<div className="relative z-10 mt-3 w-full text-left">
							<h3 className="font-heading text-[16px] font-bold text-[#111111]">
								{unit.name}
							</h3>
							<div className="mt-2.5 flex w-full items-center justify-between gap-2">
								{unit.isExternal ? (
									<a
										className="btn-booking-now inline-flex h-7 items-center justify-center rounded-full px-3.5 font-heading text-[11px] font-semibold"
										href={unit.link}
										target="_blank"
										rel="noreferrer"
									>
										Booking Now
									</a>
								) : (
									<Link
										className="btn-booking-now inline-flex h-7 items-center justify-center rounded-full px-3.5 font-heading text-[11px] font-semibold"
										to={unit.link}
									>
										Booking Now
									</Link>
								)}
								<span className="inline-flex shrink-0 items-center gap-1 font-heading text-[11px] font-semibold text-[#111111] transition-[gap] group-hover:gap-2">
									Detail Unit <ArrowRight size={11} />
								</span>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}
