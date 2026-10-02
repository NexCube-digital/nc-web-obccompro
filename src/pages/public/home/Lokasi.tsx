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

	return (
		// Layout: di bawah lg 1 kolom (daftar lokasi di atas, peta di bawah). Mulai lg 2 kolom.
		// minmax(0, ...) mencegah kolom melebar melebihi ruang karena isi (penyebab kolom kiri tertekan sebelumnya).
		<section
			className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] items-start gap-[28px] py-[40px] pb-[50px] md:w-[calc(100%-48px)] md:gap-10 md:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-15"
			id="kontak"
		>
			{/* Panel kiri: daftar lokasi */}
			<div className="min-w-0">
				{/* Label: min-w hanya untuk desktop supaya tidak melebar di mobile */}
				<span className="mb-3 block h-[20px] w-full min-w-0 max-w-[856px] font-['Montserrat'] text-[13px] font-semibold uppercase leading-[20px] tracking-[2px] text-[#000000CC] md:min-w-[412px] md:text-[18px] md:tracking-[1.4px]">
					{t('locationSection.badge')}
				</span>
				<h2 className="h-auto min-h-[28px] w-full max-w-[527px] font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] md:text-[24px] md:leading-[27.5px] md:tracking-[1.5px]">
					{t('locationSection.title')}
				</h2>
				<p className="my-3 mb-5 h-auto min-h-[43px] w-full max-w-[527px] font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-justify text-[#000000] md:text-[13px] md:leading-[21.13px]">
					{t('locationSection.description')}
				</p>

				{/* Filter tabs: mobile gap lebih kecil, teks 12px */}
				<div className="mb-4 flex flex-wrap gap-x-[12px] gap-y-[10px] md:gap-4.5">
					{locationCategories.map((cat) => (
						<button
							key={cat}
							type="button"
							className={`cursor-pointer rounded-full px-4 py-1.5 font-heading text-[12px] font-medium transition-colors md:text-[13px] ${
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

				<div>
					{filteredLocations.map((loc, i) => (
						// Mobile: tiap lokasi jadi kartu ber-border; desktop: garis atas
						<div
							className="mt-3 rounded-[6px] border border-[#e5e5e5] px-3 py-4 first:mt-0 md:mt-0 md:rounded-none md:border-0 md:border-t md:px-0"
							key={i}
						>
							{/* Alamat + tombol lihat lokasi: mobile ditumpuk */}
							<div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-0">
								<span className="inline-flex h-auto min-h-[21px] w-full max-w-full items-center gap-2 align-middle font-['Montserrat'] text-[17px] font-semibold leading-[22px] tracking-normal text-[#000000] md:w-[264px] md:text-[15px] md:leading-[20.63px]">
									<span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[2px] bg-[#EDEDED]">
										<img src={locationIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
									</span>{' '}
									{loc.address}
								</span>
								<a
									href="https://maps.google.com"
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 self-end font-heading text-[13px] font-semibold text-[#111111] md:self-auto"
								>
									{t('common.viewLocation')}
									<span className="grid h-6 w-6 place-items-center">
										<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
									</span>
								</a>
							</div>

							{loc.units.length > 1 ? (
								<div className="my-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-[13px] font-semibold text-[#111111] md:gap-x-2 md:text-[15px]">
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

							{/* Info jam / check-in */}
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

			{/* Panel kanan: peta. Lebar fluid mengikuti kolom (maksimal 613px mulai lg), bukan lagi lebar tetap 613px */}
			<div className="box-border h-auto w-full min-w-0 max-w-full overflow-hidden rounded-[8px] bg-[#EDEDED80] p-[14px] shadow-[0px_1px_2px_0px_#0000000D] md:h-[580px] lg:max-w-[613px]">
				{/* Header peta */}
				<div className="flex items-center justify-between gap-2 border-b border-[#e5e5e5] px-4 py-3 max-sm:px-2">
					<div className="flex min-w-0 items-center gap-2">
						<i className="h-2 w-2 shrink-0 rounded-full bg-[#111111]" />
						<span className="h-[20px] w-[204px] shrink-0 whitespace-nowrap font-['Montserrat'] text-[14px] font-semibold uppercase leading-[20px] tracking-[0.7px] text-[#000000] max-sm:w-[144px] max-sm:text-[10px] max-sm:tracking-[0.2px]">
							{t('locationSection.mapTitle')}
						</span>
					</div>
					<span className="pointer-events-none box-border flex h-[18px] w-[155px] shrink-0 items-center justify-center rounded-[12px] bg-[#CDF1784D] px-2 py-[2px] font-['Montserrat'] text-[11px] font-medium leading-[14px] tracking-[0.88px] text-[#000000] shadow-[0px_1px_1px_0px_#00000040] max-sm:w-[100px] max-sm:px-1 max-sm:text-[8px] max-sm:tracking-[0.2px]">
						Live Interactive Map
					</span>
				</div>

				{/* Area peta: tinggi 210px di mobile, 500px di desktop */}
				<div className="relative h-[210px] w-full overflow-hidden bg-[#f2f4f8] md:h-[500px]">
					<iframe
						className="h-full w-full border-0"
						title="Peta Lokasi OBC Group di Rancabentang"
						src={`https://www.google.com/maps?q=Jl.+Rancabentang+No.+3A,+Bandung&output=embed&z=${mapZoom}`}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>

					{/* Kontrol zoom */}
					<div className="absolute right-3 top-16 flex flex-col gap-1.5">
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
		</section>
	)
}