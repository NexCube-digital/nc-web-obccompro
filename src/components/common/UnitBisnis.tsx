import { Link } from 'react-router-dom'

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
	return (
		<section className={`mx-auto max-w-[1216px] px-5 pb-16 md:px-8 ${className}`.trim()}>
			<h2 className="mx-auto w-[502px] max-w-full text-center font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
				{title}
			</h2>

			{/* Jarak antar kartu: 24px horizontal, 10px vertikal (sesuai desain) */}
			<div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-[10px] md:grid-cols-4 md:gap-x-6">
				{items.map((unit) => (
					<Link
						key={unit.slug}
						to={`/unit-bisnis/${unit.slug}`}
						className="group w-full overflow-hidden rounded-[15px] border border-[#0040004D] bg-[#FFFFF7]"
					>
						<div className="h-[187px] w-full overflow-hidden">
							<img
								src={unit.image}
								alt={unit.title}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						{/* Teks: pill kategori di atas, judul di bawah, rata kiri */}
						<div className="flex min-h-[68px] flex-col items-start gap-3 px-[9px] pb-[17px] pt-[7px]">
							<span className="inline-flex w-fit max-w-full items-center rounded-full bg-[#E9E9E2] px-[10px] py-[2px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)]">
								<span className="block whitespace-normal text-left font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15px] tracking-[0.5px] text-black">
									{unit.category}
								</span>
							</span>
							<span className="ml-[5px] block text-left font-['Montserrat'] text-[16px] font-semibold uppercase leading-[100%] tracking-[0%] text-black">
								{unit.title}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}

export default UnitBisnis