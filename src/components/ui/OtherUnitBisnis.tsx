import TransitionLink from '../common/TransitionLink'
import { useTranslation } from 'react-i18next'

export interface UnitBisnisItem {
	slug: string
	category: string
	title: string
	image: string
}

interface UnitBisnisProps {
	items: UnitBisnisItem[]
	title?: string
	className?: string
}

export function UnitBisnis({ items, title = 'Jelajahi Unit Bisnis OBC Group Lainnya', className = '' }: UnitBisnisProps) {
	const { t } = useTranslation()
	const translationKeys: Record<string, string> = {
		'food-court': 'foodCourt',
		'guest-house': 'guestHouse',
		'sport-center': 'sportCenter',
		'agribisnis': 'agribisnis',
	}
	const translatedTitle = title === 'Jelajahi Unit Bisnis OBC Group Lainnya' ? t('units.otherUnitsHeading') : title
	return (
		<section className={`mx-auto max-w-[1216px] px-6 pb-10 md:px-8 md:pb-16 ${className}`.trim()}>
			<h2 className="w-full text-left font-['Montserrat'] text-[16px] font-semibold leading-[100%] tracking-[0%] text-black md:mx-auto md:w-[502px] md:max-w-full md:text-center md:text-[25px]">
				{translatedTitle}
			</h2>

			{/* Mobile: 2 kolom, jarak 10px horizontal & 16px vertikal. Desktop: 4 kolom (sesuai desain) */}
			<div className="mt-4 grid grid-cols-2 gap-x-[10px] gap-y-4 md:mt-6 md:grid-cols-4 md:gap-x-6 md:gap-y-[10px]">
				{items.map((unit) => {
					const key = translationKeys[unit.slug] ?? unit.slug
					return (
					<TransitionLink
						key={unit.slug}
						to={`/unit-bisnis/${unit.slug}`}
						className="group w-full overflow-hidden rounded-[15px] border border-[#0040004D] bg-[#FFFFF7]"
					>
						<div className="h-[120px] w-full overflow-hidden md:h-[187px]">
							<img
								src={unit.image}
								alt={unit.title}
								loading="lazy"
								decoding="async"
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						{/* Teks: pill kategori di atas, judul di bawah, rata kiri */}
						<div className="flex min-h-0 flex-col items-start gap-1 px-2 pb-3 pt-2 md:min-h-[68px] md:gap-3 md:px-[9px] md:pb-[17px] md:pt-[7px]">
							<span className="inline-flex w-fit max-w-full items-center rounded-full bg-[#E9E9E2] px-2 py-[1px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)] md:px-[10px] md:py-[2px]">
								<span className="block whitespace-normal text-left font-['Montserrat'] text-[8px] font-semibold uppercase leading-[12px] tracking-[0.3px] text-black md:text-[10px] md:leading-[15px] md:tracking-[0.5px]">
									{t(`units.${key}.category`, { defaultValue: unit.category })}
								</span>
							</span>
							<span className="ml-0 block text-left font-['Montserrat'] text-[12px] font-semibold normal-case leading-[100%] tracking-[0%] text-black md:ml-[5px] md:text-[16px] md:uppercase">
								{t(`units.${key}.title`, { defaultValue: unit.title })}
							</span>
						</div>
					</TransitionLink>
					)
				})}
			</div>
		</section>
	)
}

export default UnitBisnis