import { Link } from 'react-router-dom'
import {
	ArrowRight, Home,
	MapPin, Clock, CalendarDays, Zap,
	type LucideIcon,
} from 'lucide-react'
import { WhatsAppLogo } from '../../components/common/WhatsAppIcon'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import lapangF1Image from '../../assets/layanan/Lapang F1.png'
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
	return (
		<div className="min-h-screen bg-obc-ivory">
			<LandingNavbar />

			{/* Hero slider */}
			<section className="relative min-h-[100svh] overflow-hidden">
				<img
					src={lapangF1Image}
					alt="Papan penunjuk unit bisnis OBC Group"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-y-0 left-[0.32px] h-[724px] w-[763.5928344726562px] bg-[linear-gradient(90deg,#FAFAF2_0%,rgba(250,250,242,0.9)_52.98%,rgba(250,250,242,0.592749)_73.8%,rgba(250,250,242,0)_100%)] opacity-100" />
				<div className="relative flex min-h-[100svh] items-center px-6 py-24 md:-translate-y-8 md:px-10 mt-4">
					<div className="w-full max-w-[443px] text-black">
						<span className="inline-flex h-[24px] w-[99px] items-center justify-center rounded-full bg-white/20 px-[10px] py-[5px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]">
							<span className="font-['Montserrat'] text-[10px] font-bold leading-[14px] tracking-[1px] text-black uppercase">
								UNIT BISNIS
							</span>
						</span>
						<h1 className="mt-5 max-w-[400px] font-['Montserrat'] text-[56px] font-bold leading-[70px] tracking-[1.5px] text-black">
							Bisnis Kami
						</h1>
						<p className="mt-4 h-[96px] w-[443px] max-w-full font-['Montserrat'] text-[40px] font-medium leading-[48px] tracking-[-0.8px] text-[#000000]">
							Satu Ekosistem, Beragam Layanan
						</p>
						<p className="mt-5 h-[168px] w-[443px] max-w-full text-justify font-['Montserrat'] text-[18px] font-normal leading-[28px] tracking-[0px] text-[#000000]">
							OBC Group menghadirkan beragam unit bisnis dalam satu ekosistem yang saling melengkapi. Setiap unit
							memiliki layanan dan karakteristiknya masing-masing untuk memberikan pengalaman yang sesuai dengan
							kebutuhan pelanggan.
						</p>
					</div>
				</div>
			</section>

			{/* Unit unggulan */}
			<section className="mx-auto max-w-[1200px] px-5 py-14 md:px-8">
				<div className="mb-6 flex items-center gap-4">
					<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[20px] text-black">Unit Unggulan</h2>
					<span className="h-px flex-1 border border-[#004000CC]" style={{ transform: 'rotate(0.16deg)' }} />
				</div>

				<div className="group relative overflow-hidden rounded-2xl">
					<img
						src={lapangF2Image}
						alt="OBC Sport Center — lapangan indoor"
						className="h-[280px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[420px]"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-obc-charcoal/85 via-obc-charcoal/10 to-transparent" />

					<div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
						<div className="flex flex-wrap gap-2">
							<span className="inline-flex h-[30px] items-center justify-center rounded-full bg-white/15 px-[10px] py-[5px] font-['Montserrat'] text-[13px] font-medium leading-[18px] text-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px]">
								Unit Unggulan
							</span>
							<span className="inline-flex h-[30px] items-center justify-center rounded-full bg-white/15 px-[10px] py-[5px] font-['Montserrat'] text-[13px] font-medium leading-[18px] text-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px]">
								Sports & Event Space
							</span>
						</div>
						<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
							<div className="max-w-[520px]">
								<h3 className="font-['Montserrat'] text-[36px] font-bold leading-[40px] text-white">OBC Sport Center</h3>
								<p className="mt-1 font-['Montserrat'] text-[18px] font-medium italic leading-[20px] text-[#D4FF32]">
									Ruang untuk Bergerak, Bermain, dan Berkegiatan
								</p>
								<p className="mt-2 max-w-[506px] text-justify font-['Montserrat'] text-[16px] font-medium leading-[20px] text-white">
									OBC Sport Center menghadirkan fasilitas olahraga dan ruang serbaguna untuk berbagai aktivitas,
									komunitas, dan kegiatan.
								</p>
								<p className="mt-2 font-['Montserrat'] text-[13px] font-medium leading-[20px] text-white">
									Jam Operasional: Setiap hari / 07.00 WIB – 00.00 WIB
								</p>
							</div>
							<Link
								to="/unit-bisnis/sport-center"
								className="inline-flex h-[30px] items-center justify-center gap-2 rounded-full bg-white/15 px-[10px] py-[5px] font-['Montserrat'] text-[18px] font-medium leading-[20px] text-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2px]"
							>
								<span className="text-white">Jelajahi OBC Sport Center</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* 7 unit bisnis lainnya */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="mb-6 flex items-center gap-4">
					<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[20px] text-black">7 Unit Bisnis Lainnya</h2>
					<span className="h-px flex-1 border border-[#004000CC]" style={{ transform: 'rotate(0.16deg)' }} />
				</div>

				<div className="flex flex-col gap-16">
					{BUSINESS_UNITS.map((unit, index) => {
						const isReversed = index % 2 === 1

						return (
							<article
								key={unit.slug}
								className={`flex flex-col gap-6 md:items-center md:gap-10 ${
									isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
								}`}
							>
								<div
									className={`relative flex h-[220px] w-full items-center justify-center overflow-hidden rounded-2xl bg-transparent p-4 md:h-[300px] md:w-1/2 md:p-6 ${
										isReversed ? 'md:justify-end' : 'md:justify-start'
									}`}
								>
									<img
										src={unit.image}
										alt={unit.title}
										className="h-full w-full object-contain md:w-[calc(100%-40px)]"
									/>
									<img
										src={unit.icon}
										alt=""
										width={34}
										height={36}
										className={`absolute top-4 h-9 w-[34px] object-contain md:top-6 ${
											isReversed ? 'right-4 md:right-6' : 'left-4 md:left-6'
										}`}
									aria-hidden="true"
									/>
								</div>

								<div className="w-full md:w-1/2">
									<div className="w-full max-w-[520px]">
										<div className="flex items-center justify-between">
											<span className="inline-flex h-4 w-[256px] max-w-full font-['Montserrat'] text-[12px] font-semibold leading-4 tracking-[1.2px] text-black uppercase">
												{unit.category}
											</span>
										</div>
										<h3 className="mt-2 h-9 w-[280px] max-w-full font-['Montserrat'] text-[30px] font-semibold leading-9 tracking-[0.6px] text-black">
											{unit.title}
										</h3>
										<p className="mt-2 max-w-[520px] font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-normal text-black">
											{unit.description}
										</p>

										
										<div className="mt-4 flex max-w-[590px] flex-wrap gap-2">
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
														{tag.label}
													</span>
												)
											})}
										</div>

										<div className="mt-5 flex max-w-[420px] flex-wrap items-center gap-5">
											<a
												href={WHATSAPP_LINK}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-1.5 font-['Montserrat'] text-[15px] font-medium leading-5 tracking-normal text-black hover:text-obc-green"
											>
												<span className="flex h-[23px] w-[23px] items-center justify-center rounded-full bg-[#25D366E5] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]">
													<WhatsAppLogo className="h-[16px] w-[16px] shrink-0 text-white" />
												</span>
												Hubungi WhatsApp Kami
											</a>
											<Link
												to={`/unit-bisnis/${unit.slug}`}
												className="flex items-center gap-1.5 font-['Montserrat'] text-[16px] font-semibold leading-6 tracking-normal text-black hover:text-obc-green-hover"
											>
												Detail Unit
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