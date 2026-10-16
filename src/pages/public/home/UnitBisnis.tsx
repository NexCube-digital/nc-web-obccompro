import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import TransitionLink from '../../../components/common/TransitionLink'
import { Heart, ArrowRight } from 'lucide-react'
import sportCenterLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER.png'
import guestHouseLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import villaLogo from '../../../assets/logo/villa.png'
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
	const { t } = useTranslation()
	const [isHeartHovered, setIsHeartHovered] = useState(false)
	const stretchedClass = 'absolute inset-0 z-0 rounded-[14px] md:rounded-[20px]'

	// Tombol booking: kelas asli + override khusus layar ≤460px (lebar penuh, tinggi 32px)
	// Catatan: pakai "!" agar menimpa tinggi/padding bawaan .btn-booking-now jika ada
	const bookingClass =
		'btn-booking-now inline-flex h-[20px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2 font-heading text-[10px] font-semibold hover:!border-[#004000] hover:!bg-[#004000] hover:!text-white max-[460px]:!h-8 max-[460px]:w-full max-[460px]:!px-3 max-[460px]:text-[11px] md:h-7 md:px-3 md:text-[11px] lg:px-3.5'

	// Tombol detail: kelas asli + override khusus layar ≤460px (lebar penuh, border tipis agar jelas sebagai tombol)
	const detailClass =
		'relative inline-flex h-[20px] shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-transparent px-2 font-heading text-[10px] font-semibold text-[#111111] hover:border-[#B9D96A] hover:bg-[#E3F3B5] max-[460px]:!h-8 max-[460px]:w-full max-[460px]:justify-center max-[460px]:border-[#d9d9d9] max-[460px]:!px-3 max-[460px]:text-[11px] md:h-7 md:px-3 md:text-[11px]'

	return (
		<article
			className={`group relative flex cursor-pointer flex-col items-center rounded-[14px] border border-transparent bg-white p-3 pt-[22px] text-center shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b8e28a] hover:bg-[#f0f7e6] hover:shadow-[0_12px_28px_rgba(0,64,0,0.12)] md:rounded-[20px] md:border-[#e5e5e5] md:p-5 md:pt-6 md:shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${className}`}
		>
			{/* Stretched link ke halaman unit */}
			{unit.isExternal ? (
				<a
					className={stretchedClass}
					href={unit.link}
					target="_blank"
					rel="noreferrer"
					aria-label={t('common.openPage', { name: unit.name })}
				/>
			) : (
				<TransitionLink className={stretchedClass} to={unit.link} aria-label={t('common.openPage', { name: unit.name })} />
			)}

			{/* Tombol favorit: mobile tanpa lingkaran & border, desktop lingkaran */}
			<button
				type="button"
				className="absolute right-2 top-2 z-10 grid h-7 w-7 cursor-pointer place-items-center rounded-full bg-transparent text-[#111111] md:right-3 md:top-3 md:h-9 md:w-9 md:border md:border-[#e5e5e5] md:bg-white md:hover:bg-[#f5f5f5] md:group-hover:border-[#b8e28a]/60"
				onMouseEnter={() => setIsHeartHovered(true)}
				onMouseLeave={() => setIsHeartHovered(false)}
				onClick={(e) => {
					e.stopPropagation()
					onToggleFavorite(unit.name)
				}}
				aria-label={t(isFavorite ? 'common.removeFromFavorite' : 'common.addToFavorite', { name: unit.name })}
			>
				{/* Saat love di-hover: terisi hijau gelap. Kalau sudah difavoritkan tetap merah */}
				<Heart
					className={`h-[22px] w-[22px] md:h-[15px] md:w-[15px] ${
						isFavorite
							? 'fill-red-500 text-red-500'
							: isHeartHovered
								? 'fill-[#004000] text-[#004000]'
								: ''
					}`}
				/>
			</button>

			{/* Logo: mobile 78px, desktop maks 130px (mengecil mengikuti tinggi layar agar section tetap muat 1 layar;
			    di 1280x800 tetap 130px seperti semula) */}
			<div className="pointer-events-none relative z-10 grid h-[78px] w-[78px] place-items-center md:h-[clamp(72px,13.5svh,108px)] md:w-[clamp(72px,13.5svh,108px)]">
				<img
					className={`block max-h-[78px] max-w-[78px] object-contain transition-transform duration-300 md:max-h-full md:max-w-full ${
						unit.name === 'OBC Villa'
							? 'scale-[0.83] group-hover:scale-[0.86]'
							: 'group-hover:scale-105'
					}`}
					src={unit.image}
					alt={`Logo ${unit.name}`}
					loading="lazy"
					decoding="async"
				/>
			</div>

			{/* Info & tombol: ≤460px tombol bertumpuk, di atasnya sejajar seperti semula */}
			<div className="relative z-10 mt-2 w-full text-center md:mt-3 md:text-left">
				<h3 className="font-heading text-[15px] font-bold text-[#111111] max-[460px]:text-[14px] max-[460px]:leading-tight md:text-[16px]">{unit.name}</h3>
				<div className="mt-1.5 flex w-full items-center justify-center gap-1.5 max-[460px]:mt-2 max-[460px]:flex-col max-[460px]:items-stretch md:mt-2.5 md:justify-between md:gap-2">
					{unit.isExternal ? (
						<a className={bookingClass} href={unit.link} target="_blank" rel="noreferrer">
							{t('businessUnitsSection.bookingNow')}
						</a>
					) : (
						<TransitionLink className={bookingClass} to={unit.link}>
							{t('businessUnitsSection.bookingNow')}
						</TransitionLink>
					)}
					{unit.isExternal ? (
						<a className={detailClass} href={unit.link} target="_blank" rel="noreferrer">
							{t('businessUnitsSection.unitDetail')} <ArrowRight size={11} />
						</a>
					) : (
						<TransitionLink className={detailClass} to={unit.link}>
							{t('businessUnitsSection.unitDetail')} <ArrowRight size={11} />
						</TransitionLink>
					)}
				</div>
			</div>
		</article>
	)
}

export default function UnitBisnis() {
	const { t } = useTranslation()
	const [favorites, setFavorites] = useState<string[]>([])

	const toggleFavorite = (name: string) => {
		setFavorites((prev) =>
			prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
		)
	}

	return (
		<section
			className="home-section-gap mx-auto flex w-[calc(100%-44px)] max-w-[1280px] flex-col justify-center bg-[#fffff7] py-10 md:w-[calc(100%-48px)] md:py-14"
			id="layanan"
		>
			{/* Label: mobile title case & lebih tipis, desktop kapital */}
			<span className="mb-1 block text-center font-['Montserrat'] text-[16px] font-medium normal-case leading-[20px] tracking-normal text-[#000000] md:mb-3 md:text-[18px] md:font-semibold md:uppercase md:tracking-[1.4px] md:text-[#000000CC]">
				{t('businessUnitsSection.badge')}
			</span>
			{/* Judul: mobile 22px 2 baris, md 28px 1 baris (tinggi otomatis), lg ke atas 36px tinggi tetap */}
			<h2 className="mx-auto h-auto w-full max-w-[320px] text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] tracking-normal text-[#000000] opacity-100 md:h-auto md:max-w-[1098px] md:text-[28px] md:font-bold md:leading-[40px] md:tracking-[1px] lg:h-[45px] lg:text-[36px] lg:leading-[45px] lg:tracking-[1.5px]">
				{t('businessUnitsSection.title')}
			</h2>
			<div
				className="mx-auto mt-4 w-full max-w-full border-t border-[#00000080] md:mt-3 md:w-[812px] md:max-w-full md:border-t-2"
				aria-hidden="true"
			/>

			{/* Baris 1: 4 unit. Mobile & md 2 kolom, lg 4 kolom */}
			<div className="mt-6 grid grid-cols-2 gap-[14px] md:mt-[clamp(16px,3.5svh,28px)] md:gap-5 lg:grid-cols-4">
				{units.slice(0, 4).map((unit) => (
					<UnitCard
						key={unit.name}
						unit={unit}
						isFavorite={favorites.includes(unit.name)}
						onToggleFavorite={toggleFavorite}
					/>
				))}
			</div>

			<div className="mx-auto mt-[14px] grid w-full max-w-[calc(3*280px+2*1.5rem)] grid-cols-2 gap-[14px] md:mt-5 md:max-w-none md:gap-5 lg:max-w-[calc(3*280px+2*1.5rem)] lg:grid-cols-3">
				{units.slice(4).map((unit) => (
					<UnitCard
						key={unit.name}
						unit={unit}
						isFavorite={favorites.includes(unit.name)}
						onToggleFavorite={toggleFavorite}
						className="w-full max-w-[280px] justify-self-center last:col-span-2 last:w-[calc(50%-7px)] md:max-w-none md:last:w-[calc(50%-10px)] lg:max-w-[280px] lg:last:col-span-1 lg:last:w-full"
					/>
				))}
			</div>
		</section>
	)
}