import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
	ArrowRight, Home,
	MapPin,
	type LucideIcon,
} from 'lucide-react'
import { WhatsAppLogo } from '../../components/common/WhatsAppIcon'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import heroSignpostImage from '../../assets/unit-bisnis/slider/a8068cd70eafb7bacbeca863ef32256ede57a5d0.png'
import lapangF2Image from '../../assets/layanan/Lapang F2.png'
import guestHouseLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import villaLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (3).png'
import laundryLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (4).png'
import foodCourtLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (5).png'
import coffeeLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (6).png'
import agribusinessLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (7).png'
import clockIcon from '../../assets/icon/clock.svg'
import guestHouseIcon from '../../assets/icon/iconstack.io - (House Door Fill).svg'
import villaIcon from '../../assets/icon/iconstack.io - (Ic Fluent Bed 24 Filled).svg'
import laundryIcon from '../../assets/icon/iconstack.io - (Ic Fluent Washer 24 Filled).svg'
import foodCourtIcon from '../../assets/icon/iconstack.io - (Food Fork Drink).svg'
import coffeeIcon from '../../assets/icon/iconstack.io - (Coffee).svg'
import agribusinessIcon from '../../assets/icon/iconstack.io - (Agriculture Analytics).svg'

interface BusinessUnit {
	slug: string
	icon: string
	category: string
	title: string
	description: string
	tags: UnitTag[]
	image: string
}

interface UnitTag {
	label: string
	icon: LucideIcon | string
}

const BUSINESS_UNITS: BusinessUnit[] = [
	{
		slug: 'guest-house',
		icon: guestHouseIcon,
		category: 'Hospitality & Accommodation',
		title: 'OBC Guest House',
		description: 'Penginapan yang nyaman untuk melengkapi pengalaman menginap Anda di kawasan Ciumbuleuit, Bandung.',
		tags: [
			{ label: 'Accommodation', icon: Home },
			{ label: 'Ciumbuleuit', icon: MapPin },
			{ label: 'Check-in 14.00 WIB', icon: clockIcon },
			{ label: 'Check-out 12.00 WIB', icon: clockIcon },
		],
		image: guestHouseLogo,
	},
	{
		slug: 'villa',
		icon: villaIcon,
		category: 'Hospitality & Accommodation',
		title: 'OBC Villa',
		description: 'Penginapan villa yang nyaman untuk kebutuhan menginap dan menikmati suasana kawasan Ciumbuleuit, Bandung.',
		tags: [
			{ label: 'Hospitality', icon: Home },
			{ label: 'Ciumbuleuit', icon: MapPin },
			{ label: 'Check-in 14.00 WIB', icon: clockIcon },
			{ label: 'Check-out 12.00 WIB', icon: clockIcon },
		],
		image: villaLogo,
	},
	{
		slug: 'laundry',
		icon: laundryIcon,
		category: 'Laundry Services',
		title: 'OBC Laundry',
		description: 'Layanan laundry untuk memenuhi kebutuhan perawatan pakaian dan kebutuhan laundry sehari-hari.',
		tags: [
			{ label: 'Quick 4 Jam Selesai', icon: Home },
			{ label: 'Ciumbuleuit', icon: MapPin },
			{ label: 'Setiap Hari', icon: clockIcon },
			{ label: '07.00 WIB - 20.00 WIB', icon: clockIcon },
		],
		image: laundryLogo,
	},
	{
		slug: 'food-court',
		icon: foodCourtIcon,
		category: 'Food & Beverage',
		title: 'OBC Food Court',
		description: 'Area kuliner yang menjadi bagian dari ekosistem OBC Group untuk memenuhi kebutuhan makan dan bersantai.',
		tags: [
			{ label: 'Food Court', icon: Home },
			{ label: 'Ciumbuleuit', icon: MapPin },
			{ label: 'Senin - Sabtu', icon: clockIcon },
			{ label: '08.00 WIB - 20.00 WIB', icon: clockIcon },
		],
		image: foodCourtLogo,
	},
	{
		slug: 'coffee',
		icon: coffeeIcon,
		category: 'Coffee & Lifestyle',
		title: 'OBC Coffee',
		description: 'Ruang untuk menikmati kopi dan bersantai yang menjadi bagian dari ekosistem OBC Group.',
		tags: [
			{ label: 'Coffee', icon: Home },
			{ label: 'Ciumbuleuit', icon: MapPin },
			{ label: 'Setiap Hari', icon: clockIcon },
			{ label: '08.00 WIB - 22.00 WIB', icon: clockIcon },
		],
		image: coffeeLogo,
	},
	{
		slug: 'agribisnis',
		icon: agribusinessIcon,
		category: 'Agribusiness',
		title: 'OBC Agribisnis',
		description: 'Unit bisnis OBC Group yang bergerak di bidang agrobisnis dan berlokasi di kawasan Lembang.',
		tags: [
			{ label: 'Agribusiness', icon: Home },
			{ label: 'Jl. Tugulaksana, Lembang, Kabupaten Bandung Barat', icon: MapPin },
			{ label: 'Check-in 14.00 WIB', icon: clockIcon },
			{ label: 'Check-out 12.00 WIB', icon: clockIcon },
		],
		image: agribusinessLogo,
	},
]

const WHATSAPP_LINK = 'https://wa.me/6280000000000'

function BusinessUnitPage() {
	const { t } = useTranslation()
	return (
		<div className="min-h-screen bg-obc-ivory">
			<LandingNavbar />

						{/* Hero slider */}
			<section className="relative min-h-[100svh] overflow-hidden">
				<img
					src={heroSignpostImage}
					alt="Papan penunjuk unit bisnis OBC Group"
					className="absolute inset-0 h-full w-full object-cover object-[25%_58%] md:object-[center_58%] md:translate-x-20 lg:translate-x-28 xl:translate-x-36"
				/>
				{/* Overlay: mobile vertikal (pekat di bawah), desktop horizontal (pekat di kiri, lebar mengikuti breakpoint dev) */}
				<div className="absolute inset-0 h-full w-full bg-[linear-gradient(0deg,#FAFAF2_0%,rgba(250,250,242,0.9)_30%,rgba(250,250,242,0.592749)_42%,rgba(250,250,242,0)_60%)] md:inset-y-0 md:left-0 md:right-auto md:w-[68%] md:bg-[linear-gradient(90deg,#FAFAF2_0%,#FAFAF2_38%,rgba(250,250,242,0.98)_46%,rgba(250,250,242,0.92)_54%,rgba(250,250,242,0.80)_64%,rgba(250,250,242,0.62)_74%,rgba(250,250,242,0.40)_84%,rgba(250,250,242,0.20)_92%,rgba(250,250,242,0.06)_97%,rgba(250,250,242,0)_100%)] lg:w-[62%] xl:w-[58%] 2xl:w-[55%]" />
				<div className="relative z-10 flex min-h-[100svh] w-full items-end pb-[70px] pt-24 md:items-center md:pb-12">
					<div className="mx-auto w-full max-w-[1246px] px-[30px] md:px-10">
						<div className="w-full max-w-[440px] text-black">
							<span className="inline-flex h-[24px] w-[99px] items-center justify-center rounded-full bg-white/20 px-[10px] py-[5px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
								<span className="font-['Montserrat'] text-[10px] font-bold leading-[14px] tracking-[1px] text-black uppercase">
									{t('businessUnitPage.badge')}
								</span>
							</span>
							{/* H1: tidak tampil di mobile (tidak ada di desain), tetap ada untuk screen reader/SEO */}
							<h1 className="sr-only font-['Montserrat'] font-bold tracking-[1.5px] text-black md:not-sr-only md:mt-5 md:text-[56px] md:leading-[70px]">
								{t('businessUnitPage.heroTitle')}
							</h1>
							{/* Subjudul: mobile tebal 24px, desktop 40px medium */}
							<p className="mt-4 font-['Montserrat'] text-[24px] font-bold leading-[32px] tracking-normal text-[#000000] sm:text-[30px] md:font-medium md:text-[40px] md:leading-[48px] md:tracking-[-0.8px]">
								{t('businessUnitPage.heroSubtitle')}
							</p>
							{/* Deskripsi: mobile 13px, desktop 18px */}
							<p className="mt-3 text-justify font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-[#000000] md:mt-5 md:text-[18px] md:leading-[28px]">
								{t('businessUnitPage.heroDesc')}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Unit unggulan */}
			<section className="mx-auto max-w-[1200px] px-10 py-14 md:px-8">
				<div className="mb-6 flex items-center gap-4">
					<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[20px] text-black">{t('businessUnitPage.featuredUnit')}</h2>
					<span className="h-px flex-1 border border-[#004000CC]" style={{ transform: 'rotate(0.16deg)' }} />
				</div>

				<div className="group relative overflow-hidden rounded-[20px] md:rounded-2xl">
					{/* Gambar: mobile tinggi 680px (hampir potret), desktop 420px */}
					<img
						src={lapangF2Image}
						alt="OBC Sport Center — lapangan indoor"
						className="h-[680px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[420px]"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-obc-charcoal/85 via-obc-charcoal/10 to-transparent" />

					<div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-[25px] md:p-8">
						{/* Tag: mobile ditumpuk vertikal, desktop sejajar */}
						<div className="flex flex-col items-start gap-2 md:flex-row md:flex-wrap">
							<span className="inline-flex h-[30px] items-center justify-center rounded-full bg-white/15 px-[10px] py-[5px] font-['Montserrat'] text-[15px] font-medium leading-[18px] text-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px] md:text-[13px]">
								{t('businessUnitPage.featuredUnit')}
							</span>
							<span className="inline-flex h-[30px] items-center justify-center rounded-full bg-white/15 px-[10px] py-[5px] font-['Montserrat'] text-[15px] font-medium leading-[18px] text-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px] md:text-[13px]">
								Sports & Event Space
							</span>
						</div>
						<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
							<div className="max-w-[520px]">
								{/* Judul: 24px di mobile */}
								<h3 className="font-['Montserrat'] text-[24px] font-bold leading-[30px] text-white md:text-[36px] md:leading-[40px]">OBC Sport Center</h3>
								<p className="mt-1 font-['Montserrat'] text-[15px] font-medium italic leading-[20px] text-[#D4FF32] md:text-[18px]">
									{t('businessUnitPage.featuredSlogan')}
								</p>
								<p className="mt-2 max-w-[506px] text-justify font-['Montserrat'] text-[13px] font-medium leading-[20px] text-white md:text-[16px]">
									{t('businessUnitPage.featuredDesc')}
								</p>
								<p className="mt-2 font-['Montserrat'] text-[11px] font-medium leading-[20px] text-white md:text-[13px]">
									{t('businessUnitPage.operationalHours')}
								</p>
							</div>
							{/* Tombol: disembunyikan di mobile (tidak ada di desain), tampil di md ke atas */}
							<Link
								to="/unit-bisnis/sport-center"
								className="hidden h-[30px] items-center justify-center gap-2 rounded-full bg-white/15 px-[10px] py-[5px] font-['Montserrat'] text-[18px] font-medium leading-[20px] text-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px] md:inline-flex"
							>
								<span className="text-white">{t('businessUnitPage.exploreSportCenter')}</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* 7 unit bisnis lainnya */}
			<section className="mx-auto max-w-[1200px] px-10 pb-[50px] md:px-8 md:pb-16">
				<div className="mb-6 flex items-center gap-4">
					<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[20px] text-black">{t('businessUnitPage.otherUnitsTitle')}</h2>
					<span className="h-px flex-1 border border-[#004000CC]" style={{ transform: 'rotate(0.16deg)' }} />
				</div>

				{/* Daftar: mobile melebar 16px ke kiri-kanan (-mx-4) supaya lebih lebar dari judul; jarak antar unit 20px */}
				<div className="-mx-4 flex flex-col gap-5 md:mx-0 md:gap-16">
					{BUSINESS_UNITS.map((unit, index) => {
						const isReversed = index % 2 === 1
						const translationKey = unit.slug === 'guest-house' ? 'guestHouse' : unit.slug

						return (
							// Mobile: tetap 1 baris (gambar & teks berdampingan, selang-seling); desktop sama seperti semula
							<article
								key={unit.slug}
								className={`flex items-center gap-0 md:gap-10 ${
									isReversed ? 'flex-row-reverse' : 'flex-row'
								}`}
							>
								<div
									className={`relative flex h-[200px] w-1/2 items-center justify-center overflow-hidden rounded-2xl bg-transparent p-4 md:h-[300px] md:p-6 ${
										isReversed ? 'md:justify-end' : 'md:justify-start'
									}`}
								>
									<img
										src={unit.image}
										alt={unit.title}
										className="h-full w-full object-contain md:w-[calc(100%-40px)]"
									/>
									{/* Ikon pojok: mobile lebih kecil & lebih dekat ke tepi */}
									<img
										src={unit.icon}
										alt=""
										width={34}
										height={36}
										className={`absolute top-2 h-[22px] w-[20px] object-contain md:top-6 md:h-9 md:w-[34px] ${
											isReversed ? 'right-3 md:right-6' : 'left-1.5 md:left-6'
										}`}
										aria-hidden="true"
									/>
								</div>

								<div className="w-1/2">
									<div className="w-full max-w-[520px]">
										<div className="flex items-center justify-between">
											{/* Kategori: mobile 9px, lebar penuh */}
											<span className="inline-flex h-auto w-full max-w-full font-['Montserrat'] text-[9px] font-semibold leading-4 tracking-normal text-black uppercase md:h-4 md:w-[256px] md:text-[12px] md:tracking-[1.2px]">
												{t(`units.${translationKey}.category`)}
											</span>
										</div>
										{/* Judul: 20px di mobile, tinggi otomatis */}
										<h3 className="mt-1 h-auto w-full max-w-full font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-normal text-black md:mt-2 md:h-9 md:w-[280px] md:text-[30px] md:leading-9 md:tracking-[0.6px]">
											{t(`units.${translationKey}.title`)}
										</h3>
										{/* Deskripsi & tag: disembunyikan di mobile (tidak ada di desain) */}
										<p className="mt-2 hidden max-w-[520px] font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-normal text-black md:block">
											{t(`units.${translationKey}.desc`)}
										</p>

										<div className="mt-4 hidden max-w-[590px] flex-wrap gap-2 md:flex">
											{unit.tags.map((tag) => {
												const TagIcon = tag.icon
												return (
													<span
														key={tag.label}
														className="inline-flex items-center gap-2 rounded-full border border-obc-border bg-obc-white px-3 py-1 font-['Montserrat'] text-[12px] font-medium leading-4 tracking-normal text-black"
													>
														{typeof TagIcon === 'string' ? (
															<img src={TagIcon} alt="" className="h-3 w-3 shrink-0" aria-hidden="true" />
														) : (
															<TagIcon size={12} className="shrink-0 text-black" strokeWidth={1.17} aria-hidden="true" />
														)}
														{tag.label.startsWith('Check-in')
															? t('common.checkIn')
															: tag.label.startsWith('Check-out')
																? t('common.checkOut')
																: tag.label === 'Setiap Hari'
																	? t('common.everyday')
																	: tag.label === 'Quick 4 Jam Selesai'
																		? t('units.laundry.quickService')
																		: tag.label}
													</span>
												)
											})}
										</div>

										{/* Aksi: mobile ditumpuk vertikal */}
										<div className="mt-3 flex max-w-[420px] flex-col items-start gap-3 md:mt-5 md:flex-row md:flex-wrap md:items-center md:gap-5">
											<a
												href={WHATSAPP_LINK}
												target="_blank"
												rel="noreferrer"
												className="group flex items-center gap-1.5 font-['Montserrat'] text-[11px] font-medium leading-5 tracking-normal text-black transition-colors duration-500 hover:text-obc-green md:text-[15px]"
											>
												<span className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full bg-[#25D366E5] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]">
													<WhatsAppLogo className="h-[16px] w-[16px] shrink-0 text-white" />
												</span>
												<span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-in-out group-hover:bg-[length:100%_1.5px]">
													{t('common.contactWhatsApp')}
												</span>
											</a>
											<Link
												to={`/unit-bisnis/${unit.slug}`}
												className="group flex items-center gap-1.5 font-['Montserrat'] text-[16px] font-semibold leading-6 tracking-normal text-black transition-colors duration-500 hover:text-obc-green-hover"
											>
												<span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-in-out group-hover:bg-[length:100%_1.5px]">
													{t('common.unitDetail')}
												</span>
												<ArrowRight size={14} />
											</Link>
										</div>
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</section>

			<LandingFooter />
		</div>
	)
}

export default BusinessUnitPage