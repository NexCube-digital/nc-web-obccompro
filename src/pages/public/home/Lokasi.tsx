import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import locationIcon from '../../../assets/icon/iconstack.io - (Location 05).svg'
import locationArrowIcon from '../../../assets/icon/iconstack.io - (Square Rounded Arrow Right).svg'

const locationCategories = ['Semua', 'Akomodasi', 'Sport', 'FnB', 'Lifestyle', 'Edukasi']

const locations = [
	{
		address: 'Jl. Rancabentang, No. 3A',
		category: 'Akomodasi',
		units: ['OBC Guest House & Penthouse'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		address: 'Jl. Rancabentang, No. 10',
		category: 'Akomodasi',
		units: ['OBC Villa'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		address: 'Jl. Rancabentang, No. 3A',
		category: 'Sport',
		units: ['OBC Sports Center', 'OBC Food Court', 'OBC Coffee', 'OBC Laundry'],
		info: [
			'Sport | Setiap hari 07.00 WIB - 00.00 WIB',
			'Coffee | Setiap hari 08.00 WIB - 22.00 WIB',
		],
	},
	{
		address: 'Jl. Tugulaksana, Wangunsari',
		category: 'Edukasi',
		units: ['OBC Agribisnis'],
		info: ['Kebun & Edukasi Pertanian'],
	},
]

export default function Lokasi() {
	const [activeCategory, setActiveCategory] = useState('Semua')
	const [mapZoom, setMapZoom] = useState(16)

	const filteredLocations =
		activeCategory === 'Semua'
			? locations
			: locations.filter(
					(l) =>
						l.category === activeCategory ||
						(activeCategory === 'FnB' && l.units.some((u) => u.includes('Food Court') || u.includes('Coffee'))) ||
						(activeCategory === 'Lifestyle' && l.units.some((u) => u.includes('Laundry')))
			  )

	return (
		<section
			className="mx-auto grid w-[calc(100%-32px)] max-w-[1246px] items-start gap-10 lg:gap-14 px-4 sm:px-6 py-10 pb-20 md:grid-cols-[1fr_1.15fr]"
			id="kontak"
		>
			{/* Panel kiri — daftar lokasi */}
			<div>
				<span className="mb-3 block h-[20px] w-full min-w-[412px] max-w-[856px] font-['Montserrat'] text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-[#000000CC]">
					LOKASI OBC GROUP
				</span>
				<h2 className="h-auto min-h-[28px] w-full max-w-[527px] font-['Montserrat'] text-[24px] font-bold leading-[27.5px] tracking-[1.5px] text-[#000000]">
					Temukan OBC di Berbagai Lokasi
				</h2>
				<p className="my-3 mb-5 h-auto min-h-[43px] w-full max-w-[527px] font-['Montserrat'] text-[13px] font-normal leading-[21.13px] tracking-normal text-justify text-[#000000]">
					Jelajahi berbagai destinasi OBC untuk menginap, berolahraga,
					bersantai, dan menikmati berbagai layanan kami.
				</p>

				{/* Kategori Filter Tabs */}
				<div className="mb-4 flex flex-wrap gap-4.5">
					{locationCategories.map((cat) => (
						<button
							key={cat}
							type="button"
							className={`rounded-full px-4 py-1.5 font-heading text-[13px] font-medium transition-colors cursor-pointer ${
								activeCategory === cat
									? 'bg-[#CDF178E5] text-[#000000]'
									: 'bg-[#f0f0f0] text-[#111111] hover:bg-[#e5e5e5]'
							}`}
							onClick={() => setActiveCategory(cat)}
						>
							{cat}
						</button>
					))}
				</div>

				<div>
					{filteredLocations.map((loc, i) => (
						<div className="border-t border-[#e5e5e5] py-4" key={i}>
							<div className="flex items-center justify-between">
								<span className="inline-flex h-auto min-h-[21px] w-[264px] max-w-full items-center gap-2 align-middle font-['Montserrat'] text-[15px] font-semibold leading-[20.63px] tracking-normal text-[#000000]">
									<span className="grid h-[32px] w-[32px] place-items-center rounded-[2px] bg-[#EDEDED]">
										<img src={locationIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
									</span>
									{loc.address}
								</span>
								<a
									href="https://maps.google.com"
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 font-heading text-[13px] font-semibold text-[#111111]"
								>
									Lihat Lokasi
									<span className="grid h-6 w-6 place-items-center">
										<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
									</span>
								</a>
							</div>

							{loc.units.length > 1 ? (
								<div className="my-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-[15px] font-semibold text-[#111111]">
									{loc.units.map((u, idx) => (
										<span className="flex items-center gap-2" key={u}>
											{idx > 0 && <i className="h-1 w-1 rounded-full bg-[#111111]" />}
											{u}
										</span>
									))}
								</div>
							) : (
								<p className="my-2.5 font-heading text-[15px] font-semibold text-[#111111]">
									{loc.units[0]}
								</p>
							)}

							{loc.info.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{loc.info.map((t) => (
										<span
											className="inline-flex min-h-[23px] w-fit max-w-full items-center rounded-[12px] bg-[#EDEDED] px-2 py-[2px] font-['Montserrat'] text-[10px] font-medium leading-[16.5px] tracking-normal text-[#000000]"
											key={t}
										>
											{t}
										</span>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Panel kanan — Peta */}
			<div className="box-border h-[580px] w-[613px] max-w-full overflow-hidden rounded-[8px] bg-[#EDEDED80] p-[14px] shadow-[0px_1px_2px_0px_#0000000D]">
				<div className="flex items-center justify-between gap-2 border-b border-[#e5e5e5] px-4 py-3 max-sm:px-2">
					<div className="flex min-w-0 items-center gap-2">
						<i className="h-2 w-2 shrink-0 rounded-full bg-[#111111]" />
						<span className="h-[20px] w-[204px] shrink-0 whitespace-nowrap font-['Montserrat'] text-[14px] font-semibold uppercase leading-[20px] tracking-[0.7px] text-[#000000] max-sm:w-[144px] max-sm:text-[10px] max-sm:tracking-[0.2px]">
							PETA LOKASI OBC GROUP
						</span>
					</div>
					<span className="pointer-events-none box-border flex h-[18px] w-[155px] shrink-0 items-center justify-center rounded-[12px] bg-[#CDF1784D] px-2 py-[2px] font-['Montserrat'] text-[11px] font-medium leading-[14px] tracking-[0.88px] text-[#000000] shadow-[0px_1px_1px_0px_#00000040] max-sm:w-[100px] max-sm:px-1 max-sm:text-[8px] max-sm:tracking-[0.2px]">
						Live Interactive Map
					</span>
				</div>

				<div className="relative h-[500px] w-full overflow-hidden bg-[#f2f4f8]">
					<iframe
						className="h-full w-full border-0"
						title="Peta Lokasi OBC Group di Rancabentang"
						src={`https://www.google.com/maps?q=Jl.+Rancabentang+No.+3A,+Bandung&output=embed&z=${mapZoom}`}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>

					<div className="absolute right-3 top-16 flex flex-col gap-1.5">
						<button
							className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5] cursor-pointer"
							type="button"
							aria-label="Zoom in"
							onClick={() => setMapZoom((z) => Math.min(z + 1, 19))}
						>
							<Plus size={16} />
						</button>
						<button
							className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5] cursor-pointer"
							type="button"
							aria-label="Zoom out"
							onClick={() => setMapZoom((z) => Math.max(z - 1, 12))}
						>
							<Minus size={16} />
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
