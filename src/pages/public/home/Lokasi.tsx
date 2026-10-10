import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Minus } from 'lucide-react'
import locationIcon from '../../../assets/icon/iconstack.io - (Location 05).svg'
import locationArrowIcon from '../../../assets/icon/iconstack.io - (Square Rounded Arrow Right).svg'

const locationCategories = ['all', 'accommodation', 'sport', 'fnb', 'lifestyle', 'education'] as const

const locations = [
	{
		address: 'Jl. Rancabentang, No. 3A',
		category: 'accommodation',
		units: ['OBC Guest House & Penthouse'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		address: 'Jl. Rancabentang, No. 10',
		category: 'accommodation',
		units: ['OBC Villa'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		address: 'Jl. Rancabentang, No. 3A',
		category: 'sport',
		units: ['OBC Sports Center', 'OBC Food Court', 'OBC Coffee', 'OBC Laundry'],
		info: [
			'Sport | Setiap hari 07.00 WIB - 00.00 WIB',
			'Coffee | Setiap hari 08.00 WIB - 22.00 WIB',
		],
	},
	{
		address: 'Jl. Tugulaksana, Wangunsari',
		category: 'education',
		units: ['OBC Agribisnis'],
		info: ['Kebun & Edukasi Pertanian'],
	},
]

type Location = (typeof locations)[number]

export default function Lokasi() {
	const { t } = useTranslation()
	const [activeCategory, setActiveCategory] = useState<(typeof locationCategories)[number]>('all')
	const [mapZoom, setMapZoom] = useState(16)

	const filteredLocations =
		activeCategory === 'all'
			? locations
			: locations.filter(
					(l) =>
						l.category === activeCategory ||
						(activeCategory === 'fnb' && l.units.some((u) => u.includes('Food Court') || u.includes('Coffee'))) ||
						(activeCategory === 'lifestyle' && l.units.some((u) => u.includes('Laundry')))
			  )

	// Satu kartu lokasi. placeholder=true dipakai untuk salinan tak terlihat (pengunci tinggi),
	// jadi tombol "lihat lokasi" dirender sebagai span agar tidak bisa difokus.
	const renderLocation = (loc: Location, i: number, placeholder = false) => (
		<div
			className="mt-3 rounded-[6px] border border-[#e5e5e5] px-3 py-4 first:mt-0 md:mt-0 md:rounded-none md:border-0 md:border-t md:px-0 lg:py-[clamp(8px,1.6svh,14px)]"
			key={i}
		>
			{/* Alamat + tombol lihat lokasi */}
			<div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-3">
				<span className="inline-flex min-w-0 flex-1 items-center gap-2 font-['Montserrat'] text-[17px] font-semibold leading-[22px] tracking-normal text-[#000000] md:text-[15px] md:leading-[20.63px]">
					<span className="grid h-8 w-8 shrink-0 place-items-center rounded-[2px] bg-[#EDEDED] lg:h-[clamp(26px,4svh,32px)] lg:w-[clamp(26px,4svh,32px)]">
						<img src={locationIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
					</span>
					<span className="min-w-0">{loc.address}</span>
				</span>
				{placeholder ? (
					<span className="inline-flex shrink-0 items-center gap-1.5 self-end font-heading text-[13px] font-semibold text-[#111111] md:self-auto">
						{t('common.viewLocation')}
						<span className="grid h-6 w-6 place-items-center">
							<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
						</span>
					</span>
				) : (
					<a
						href="https://maps.google.com"
						target="_blank"
						rel="noreferrer"
						className="inline-flex shrink-0 items-center gap-1.5 self-end font-heading text-[13px] font-semibold text-[#111111] md:self-auto"
					>
						{t('common.viewLocation')}
						<span className="grid h-6 w-6 place-items-center">
							<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
						</span>
					</a>
				)}
			</div>

			{loc.units.length > 1 ? (
				<div className="my-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-[13px] font-semibold text-[#111111] md:gap-x-2 md:text-[15px] lg:my-[clamp(4px,1svh,10px)] lg:text-[clamp(12px,1.9svh,15px)]">
					{loc.units.map((u, idx) => (
						<span className="flex items-center gap-2" key={u}>
							{idx > 0 && <i className="h-1 w-1 rounded-full bg-[#111111]" />}
							{u}
						</span>
					))}
				</div>
			) : (
				<p className="my-2.5 font-heading text-[15px] font-semibold text-[#111111] lg:my-[clamp(4px,1svh,10px)] lg:text-[clamp(13px,1.9svh,15px)]">
					{loc.units[0]}
				</p>
			)}

			{/* Info jam / check-in */}
			{loc.info.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{loc.info.map((text) => (
						<span
							className="inline-flex min-h-[23px] w-fit max-w-full items-center rounded-[12px] bg-[#EDEDED] px-2 py-[2px] font-['Montserrat'] text-[10px] font-medium leading-[16.5px] tracking-normal text-[#000000]"
							key={text}
						>
							{text}
						</span>
					))}
				</div>
			)}
		</div>
	)

	return (
		// Rata tengah vertikal. Karena tinggi daftar dikunci (lihat bagian daftar lokasi),
		// posisi section tidak bergeser saat pindah kategori.
		<section
			id="kontak"
			className="flex flex-col justify-center overflow-hidden py-10 md:py-12"
		>
			<div className="mx-auto grid w-[calc(100%-40px)] max-w-[1280px] gap-7 md:w-[calc(100%-48px)] md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-[clamp(32px,4vw,64px)]">
				{/* Panel kiri */}
				<div className="min-w-0">
					<span className="mb-2 block w-full max-w-[856px] font-['Montserrat'] text-[13px] font-semibold uppercase leading-[20px] tracking-[2px] text-[#000000CC] md:text-[16px] md:tracking-[1.4px] lg:mb-[clamp(4px,1svh,10px)] lg:text-[clamp(13px,2.25svh,18px)]">
						{t('locationSection.badge')}
					</span>
					<h2 className="w-full max-w-[527px] font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] md:text-[24px] md:leading-[27.5px] md:tracking-[1.5px] lg:text-[clamp(20px,3.25svh,26px)] lg:leading-[clamp(24px,3.75svh,30px)]">
						{t('locationSection.title')}
					</h2>
					<p className="my-3 w-full max-w-[527px] text-justify font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-[#000000] md:text-[13px] md:leading-[21.13px] lg:my-[clamp(6px,1.2svh,12px)] lg:text-[clamp(12px,1.75svh,14px)] lg:leading-[clamp(18px,2.7svh,22px)]">
						{t('locationSection.description')}
					</p>

					{/* Filter tabs: satu baris sejajar (nowrap). Mobile: bisa digeser horizontal */}
					<div className="-mx-1 mb-4 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:gap-2.5 lg:mb-[clamp(6px,1.2svh,14px)] lg:overflow-visible [&::-webkit-scrollbar]:hidden">
						{locationCategories.map((cat) => (
							<button
								key={cat}
								type="button"
								className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 font-heading text-[12px] font-medium transition-colors md:px-4 md:text-[13px] lg:px-[clamp(10px,1.2vw,16px)] lg:py-[clamp(4px,0.8svh,6px)] ${
									activeCategory === cat
										? 'bg-[#CDF178E5] text-[#000000]'
										: 'bg-[#f0f0f0] text-[#111111] hover:bg-[#e5e5e5]'
								}`}
								onClick={() => setActiveCategory(cat)}
							>
								{t(`locationSection.categories.${cat}`)}
							</button>
						))}
					</div>

					{/* Daftar lokasi.
					    Di md+: dua lapisan di sel grid yang sama.
					    - Lapisan 1 (invisible): SEMUA lokasi, hanya untuk mengunci tinggi.
					    - Lapisan 2: daftar sesuai filter, rata atas.
					    Sehingga tinggi kolom kiri (dan peta) tetap sama di semua kategori. */}
					<div className="md:grid">
						<div className="hidden md:invisible md:col-start-1 md:row-start-1 md:block" aria-hidden="true">
							{locations.map((loc, i) => renderLocation(loc, i, true))}
						</div>
						<div className="md:col-start-1 md:row-start-1 md:self-start">
							{filteredLocations.map((loc, i) => renderLocation(loc, i))}
						</div>
					</div>
				</div>

				{/* Panel kanan: peta. Di lg tinggi mengikuti kolom kiri (stretch) */}
				<div className="box-border flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[8px] bg-[#EDEDED80] p-[14px] shadow-[0px_1px_2px_0px_#0000000D] md:h-[420px] lg:h-auto lg:min-h-[420px]">
					{/* Header peta */}
					<div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#e5e5e5] px-4 py-3 max-sm:px-2 lg:py-[clamp(6px,1.5svh,12px)]">
						<div className="flex min-w-0 items-center gap-2">
							<i className="h-2 w-2 shrink-0 rounded-full bg-[#111111]" />
							<span className="truncate font-['Montserrat'] text-[14px] font-semibold uppercase leading-[20px] tracking-[0.7px] text-[#000000] max-sm:text-[10px] max-sm:tracking-[0.2px]">
								{t('locationSection.mapTitle')}
							</span>
						</div>
						<span className="pointer-events-none box-border inline-flex h-[18px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] bg-[#CDF1784D] px-3 py-[2px] font-['Montserrat'] text-[11px] font-medium leading-[14px] tracking-[0.88px] text-[#000000] shadow-[0px_1px_1px_0px_#00000040] max-sm:px-2 max-sm:text-[8px] max-sm:tracking-[0.2px]">
							Live Interactive Map
						</span>
					</div>

					{/* Area peta: mobile 260px, md+ mengisi sisa tinggi panel */}
					<div className="relative mt-3 h-[260px] w-full overflow-hidden bg-[#f2f4f8] md:h-auto md:min-h-0 md:flex-1">
						<iframe
							className="absolute inset-0 h-full w-full border-0"
							title="Peta Lokasi OBC Group di Rancabentang"
							src={`https://www.google.com/maps?q=Jl.+Rancabentang+No.+3A,+Bandung&output=embed&z=${mapZoom}`}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						/>

						{/* Kontrol zoom */}
						<div className="absolute right-3 top-3 flex flex-col gap-1.5">
							<button
								className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
								type="button"
								aria-label="Zoom in"
								onClick={() => setMapZoom((z) => Math.min(z + 1, 19))}
							>
								<Plus size={16} />
							</button>
							<button
								className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
								type="button"
								aria-label="Zoom out"
								onClick={() => setMapZoom((z) => Math.max(z - 1, 12))}
							>
								<Minus size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}