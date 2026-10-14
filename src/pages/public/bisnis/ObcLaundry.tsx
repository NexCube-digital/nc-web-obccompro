import {
	ArrowRight,
	ExternalLink,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import LazySection from '../../../components/common/LazySectionHome'
import ScrollReveal from '../../../components/animation/ScrollReveal'
import { UnitBisnis } from '../../../components/ui/OtherUnitBisnis'
import { WhatsAppCard } from '../../../components/ui/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/slider/laundry.webp'
import serviceTypeIcon from '../../../assets/icon/iconstack.io - (Ic Fluent Washer 24 Filled).svg'
import clockIcon from '../../../assets/icon/clock.svg'
import foldingServiceIcon from '../../../assets/icon/gantungan.svg'
import washAndIronServiceIcon from '../../../assets/icon/iconstack.io - (Ic Fluent Washer 24 Filled).svg'
import ironingServiceIcon from '../../../assets/icon/setrika_wangi.svg'
import individualLaundryIcon from '../../../assets/icon/setrika.svg'
import fastCleanIcon from '../../../assets/icon/speedmeeter.svg'
import deepCleanIcon from '../../../assets/icon/wastafel2.svg'
import whiteningIcon from '../../../assets/icon/3start.svg'
import unyellowingIcon from '../../../assets/icon/pinlukis.svg'
import deliveryIcon from '../../../assets/icon/motor.svg'
import waitingRoomIcon from '../../../assets/icon/kursi22.svg'
import quickLaundryIcon from '../../../assets/icon/speedmeeter.svg'
import galleryImage1 from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import galleryImage2 from '../../../assets/unit-bisnis/guest-house/6a3b9e7c6468ad26c8dd7db04e41a8af085cf07c.png'
import galleryImage3 from '../../../assets/unit-bisnis/guest-house/cd92feca5d086df44322cf32f9ffba37aed4d61d.png'
import galleryImage4 from '../../../assets/unit-bisnis/guest-house/d04b14ff8c58c89c1b536a6ac3a885785c68d003.png'
import galleryImage5 from '../../../assets/unit-bisnis/guest-house/ed96a44b2ee52e1c52adbdee104d644a71ed3461.png'
import galleryImage6 from '../../../assets/unit-bisnis/guest-house/fb58a940485f759e525012e5cee240ca9379a1db.png'
import galleryImage7 from '../../../assets/unit-bisnis/guest-house/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import sportCenterThumb from '../../../assets/unit-bisnis/4086acc6319c22edd57799828a517da01ea58de7.png'
import guestHouseThumb from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import villaThumb from '../../../assets/unit-bisnis/3f3b0cf46ed28fc2c0546f8d44a8e2a9977f0c43.jpg'
import foodCourtThumb from '../../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import coffeeThumb from '../../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import agribisnisThumb from '../../../assets/unit-bisnis/395bf2125ecb1a04ee7212871af8ece20326074d.jpg'

interface LaundryService {
	badge: string
	icon: string
	title: string
	durations: string[]
}

interface PriceListItem {
	badge: string
	favorit?: boolean
	title: string
	rows: { duration: string; price: string }[]
}

interface SatuanItem {
	item: string
	duration: string
	price: string
}

interface ShoeTreatment {
	number: string
	icon: string
	title: string
	favorit?: boolean
	price: string
	description: string
	tags: string[]
}

interface AssetStat {
	value: number
	label: string
}

interface Facility {
	icon: string
	label: string
}

interface OtherUnit {
	slug: string
	category: string
	title: string
	image: string
}

const WHATSAPP_LINK = 'https://wa.me/6280000000000'
const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung'

// Layanan utama — ditampilkan sebagai 4 card ringkas di section "Layanan OBC Laundry"
const LAUNDRY_SERVICES: LaundryService[] = [
	{ badge: 'Minimal 3 Kg', icon: foldingServiceIcon, title: 'Cuci Lipat Wangi', durations: ['4 Jam', '8 Jam', '1 Hari', '2 Hari'] },
	{ badge: 'Minimal 3 Kg', icon: individualLaundryIcon, title: 'Cuci Setrika Wangi', durations: ['4 Jam', '8 Jam', '1 Hari', '2 Hari'] },
	{ badge: 'Minimal 3 Kg', icon: ironingServiceIcon, title: 'Setrika Wangi', durations: ['4 Jam', '8 Jam', '1 Hari', '2 Hari'] },
	{ badge: 'Mulai Rp 5.000', icon: washAndIronServiceIcon, title: 'Laundry Satuan', durations: ['2 - 3 Hari', '5 - 7 Hari'] },
]

// Rincian harga per kg — 3 kartu, urutan & harga mengikuti mockup
const PRICE_LIST: PriceListItem[] = [
	{
		badge: 'Minimal 3 Kg',
		title: 'Cuci Lipat Wangi',
		rows: [
			{ duration: '4 Jam', price: 'Rp 16.000 / kg' },
			{ duration: '8 Jam', price: 'Rp 11.000 / kg' },
			{ duration: '1 Hari', price: 'Rp 9.000 / kg' },
			{ duration: '2 Hari', price: 'Rp 7.000 / kg' },
		],
	},
	{
		badge: 'Minimal 3 Kg',
		favorit: true,
		title: 'Cuci Setrika Wangi',
		rows: [
			{ duration: '4 Jam', price: 'Rp 21.000 / kg' },
			{ duration: '8 Jam', price: 'Rp 16.000 / kg' },
			{ duration: '1 Hari', price: 'Rp 13.000 / kg' },
			{ duration: '2 Hari', price: 'Rp 9.000 / kg' },
		],
	},
	{
		badge: 'Minimal 3 Kg',
		title: 'Setrika Wangi',
		rows: [
			{ duration: '4 Jam', price: 'Rp 15.000 / kg' },
			{ duration: '8 Jam', price: 'Rp 10.000 / kg' },
			{ duration: '1 Hari', price: 'Rp 8.000 / kg' },
			{ duration: '2 Hari', price: 'Rp 6.000 / kg' },
		],
	},
]

// Tabel "Layanan Cuci Satuan"
const SATUAN_ITEMS: SatuanItem[] = [
	{ item: 'Handuk', duration: '2 - 3 Hari', price: 'Rp 5.000' },
	{ item: 'Set Sprei', duration: '2 - 3 Hari', price: 'Rp 10.000' },
	{ item: 'Selimut', duration: '2 - 3 Hari', price: 'Rp 11.000 - 22.000' },
	{ item: 'Bantal/Guling', duration: '5 - 7 Hari', price: 'Rp 11.000' },
	{ item: 'Duve', duration: '2 - 3 Hari', price: 'Rp 10.000 - 15.000' },
	{ item: 'Bed Cover', duration: '2 - 3 Hari', price: 'Rp 22.000 - 25.000' },
	{ item: 'Karpet', duration: '5 - 7 Hari', price: 'Start From Rp 40.000' },
	{ item: 'Tas', duration: '2 - 3 Hari', price: 'Rp 11.000 - 15.000' },
	{ item: 'Tas Gunung', duration: '5 - 7 Hari', price: 'Rp 30.000' },
	{ item: 'Sleeping Bag', duration: '5 - 7 Hari', price: 'Rp 30.000' },
]

// "Price List Laundry Sepatu" — 4 treatment, tag = bagian sepatu yang ditangani
const SHOE_TREATMENTS: ShoeTreatment[] = [
	{
		number: '01',
		icon: fastCleanIcon,
		title: 'Fast Clean',
		price: 'Mulai Rp 35.000',
		description: 'Pembersihan cepat bagian luar dan sol untuk kebutuhan mendadak yang tetap rapi dan segar.',
		tags: ['Upper', 'Midsole', 'Outsole'],
	},
	{
		number: '02',
		icon: deepCleanIcon,
		title: 'Deep Clean',
		favorit: true,
		price: 'Mulai Rp 50.000',
		description: 'Pembersihan menyeluruh seluruh bagian luar, sol insole, hingga bagian dalam, hingga tali sepatu.',
		tags: ['Insole', 'Upper', 'Outsole', 'Midsole'],
	},
	{
		number: '03',
		icon: whiteningIcon,
		title: 'Whitening',
		price: 'Mulai Rp 65.000',
		description: 'Treatment khusus mencerahkan kembali material canvas atau kulit putih yang mulai kusam kotor.',
		tags: ['Treatment Upper'],
	},
	{
		number: '04',
		icon: unyellowingIcon,
		title: 'Unyellowing',
		price: 'Mulai Rp 70.000',
		description: 'Treatment khusus menghilangkan oksidasi kekuningan yang membandel pada karet sol sepatu Anda.',
		tags: ['Treatment Midsole'],
	},
]

const ASSET_STATS: AssetStat[] = [
	{ value: 4, label: 'Mesin Cuci' },
	{ value: 6, label: 'Mesin Pengering' },
	{ value: 1, label: 'Mesin Cuci Sepatu' },
	{ value: 3, label: 'Setrika Uap' },
	{ value: 2, label: 'Setrika Boiler' },
]

const FACILITIES: Facility[] = [
	{ icon: deliveryIcon, label: 'Delivery 1 km' },
	{ icon: waitingRoomIcon, label: 'Ruang Tunggu' },
	{ icon: quickLaundryIcon, label: 'Quick & Express Laundry' },
]

const GALLERY_IMAGES = [
	galleryImage1,
	galleryImage2,
	galleryImage3,
	galleryImage4,
	galleryImage5,
	galleryImage6,
	galleryImage7,
	galleryImage2,
]

// Unit bisnis lain untuk section "Jelajahi Unit Bisnis OBC Group Lainnya" (laundry sengaja dikecualikan)
const OTHER_UNITS: OtherUnit[] = [
	{ slug: 'sport-center', category: 'Sport & Event Space', title: 'OBC Sports Center', image: sportCenterThumb },
	{ slug: 'guest-house', category: 'Hospitality & Accommodation', title: 'OBC Guest House', image: guestHouseThumb },
	{ slug: 'villa', category: 'Hospitality & Accommodation', title: 'OBC Villa', image: villaThumb },
	{ slug: 'food-court', category: 'Food & Beverage', title: 'OBC Food Court', image: foodCourtThumb },
	{ slug: 'coffee', category: 'Coffee & Lifestyle', title: 'OBC Coffee', image: coffeeThumb },
	{ slug: 'agribisnis', category: 'Agribisnis', title: 'OBC Agribisnis', image: agribisnisThumb },
]

function LaundryPage() {
	const { t } = useTranslation()
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)

	useEffect(() => {
		if (!selectedGalleryImage) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedGalleryImage(null)
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [selectedGalleryImage])

	return (
		// pb: ruang untuk bar WhatsApp fixed (tampil sampai < lg) supaya footer tidak tertutup
		<div className="min-h-screen bg-obc-ivory pb-[130px] lg:pb-0">
			<LandingNavbar />

			{/* Hero: mobile hanya foto (teks pindah ke bawah foto), md+ teks di atas foto (rata kanan) */}
			<section className="relative h-[360px] overflow-hidden md:h-auto md:min-h-[100svh]">
				<img src={heroImage} alt="OBC Laundry" className="absolute inset-0 h-full w-full object-cover object-top md:object-center" />
				{/* Overlay: hanya md+. Lebar bertahap mengikuti breakpoint */}
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />
				<div
					className="absolute right-0 top-0 hidden h-full w-[72%] max-w-[763.59px] md:block lg:w-[65%] xl:w-[58%] 2xl:w-[52%]"
					style={{
						background:
							'linear-gradient(270deg, #FAFAF2 0%, rgba(250, 250, 242, 0.9) 40.87%, rgba(250, 250, 242, 0.592749) 65.38%, rgba(250, 250, 242, 0) 90.87%)',
					}}
				/>

				{/* Teks hero: md+, container max-w 1246px, rata kanan */}
				<div className="relative z-10 hidden min-h-[100svh] w-full items-center pb-12 pt-24 md:flex">
					<div className="mx-auto flex w-full max-w-[1246px] justify-end px-8 md:px-10">
						<div className="w-full max-w-[472px] text-black md:max-w-[380px] lg:max-w-[440px] xl:max-w-[472px]">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black lg:text-[14px]">
								<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#000000]" />
								{t('units.laundry.category')}
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[40px] font-bold leading-[52px] tracking-[1.5px] text-black lg:text-[48px] lg:leading-[60px] xl:text-[56px] xl:leading-[70px]">
								{t('units.laundry.title')}
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.18px] text-black lg:text-[18px] lg:leading-[29.25px]">
								{t('units.laundry.desc')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<LazySection minHeight={2800}>
			<ScrollReveal>
			<div className="mx-auto max-w-[1200px] md:px-8 lg:flex lg:items-stretch lg:gap-10">
				{/* Kolom kiri */}
				<div className="min-w-0 lg:w-2/3">
					{/* Tentang */}
					<section className="relative z-10 -mt-7 rounded-t-[28px] bg-obc-ivory px-5 pb-10 pt-8 min-[400px]:px-[30px] md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:py-14">
						<div className="flex flex-col">
							<h1 className="order-1 text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] text-black md:hidden">
								{t('units.laundry.title')}
							</h1>
							<h2 className="order-3 mt-8 font-heading text-[18px] font-semibold text-[#000000] md:order-1 md:mt-0 md:text-[25px]">{t('units.laundry.aboutTitle')}</h2>
							<p className="order-4 mt-3 max-w-2xl text-justify align-middle font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
								{t('units.laundry.aboutText')}
							</p>

							<div className="order-2 mb-8 mt-4 grid grid-cols-1 gap-4 md:order-3 md:mb-0 md:mt-8 md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-12 md:gap-y-4 md:border-t md:border-obc-border md:pt-6">
								<div className="flex items-center justify-start gap-2 text-left md:justify-center md:text-center">
									<img src={serviceTypeIcon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
											Jenis Layanan
										</p>
										<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
											Cuci Setrika · Satuan · Laundry Sepatu
										</p>
									</div>
								</div>
								<div className="flex items-center justify-start gap-2 text-left md:justify-center md:text-center">
									<img src={clockIcon} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
												{t('common.everyday')}
										</p>
										<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
											{t('units.laundry.workingHours')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Layanan OBC Laundry */}
					<section className="px-4 pb-14 md:px-0">
						<div>
							<div className="flex flex-col items-end gap-1 px-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3 sm:px-0">
								<h2 className="self-start font-heading text-[20px] font-semibold text-[#000000] sm:text-[25px]">
									Layanan OBC Laundry
								</h2>
								<a
									href="#price-list"
									className="mt-0 inline-flex items-center gap-1 font-heading text-[12px] font-semibold text-obc-green hover:text-obc-green-hover sm:mt-7"
								>
									Lihat  Price List Lengkap
									<ArrowRight size={14} />
								</a>
							</div>

							{/* 1 kolom di layar sangat kecil (<360px), 2 kolom mulai 360px */}
							<div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 min-[360px]:grid-cols-2 min-[360px]:gap-y-10 sm:gap-4">
								{LAUNDRY_SERVICES.map((service) => {
									return (
										<div
											key={service.title}
											className="rounded-2xl border border-obc-border bg-obc-white p-3 shadow-[0_4px_16px_rgba(52,49,51,0.05)] sm:p-5"
										>
											<div className="flex items-start justify-between gap-2">
												<span className="inline-flex items-center rounded-[2px] font-semibold bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1px] text-black sm:tracking-[1.65px]">
													{service.badge}
												</span>
												<img src={service.icon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
											</div>
											<h3 className="mt-4 font-heading text-base font-semibold text-obc-charcoal sm:text-lg">{service.title}</h3>
											<p className="mt-4 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-[#000000E5]">
												Pilihan Durasi:
											</p>
											<div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
												{service.durations.map((duration) => (
													<span
														key={duration}
														className="inline-flex items-center font-medium rounded-[2px] bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1px] text-black sm:tracking-[1.65px]"
													>
														{duration}
													</span>
												))}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</section>

					{/* Price List OBC Laundry */}
					<section id="price-list" className="px-5 pb-14 min-[400px]:px-6 md:px-0">
						<div>
							<h2 className="text-center font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:text-left sm:text-[25px]">
								Price List OBC Laundry
							</h2>
							<p className="mx-auto mt-2 max-w-[300px] text-center font-['Montserrat'] text-[13px] font-normal leading-[20px] tracking-[0.16px] text-[#615D5F] sm:mx-0 sm:mt-1 sm:max-w-none sm:text-left sm:text-[16px] sm:leading-[26px]">
								Pilih layanan dan durasi yang sesuai dengan kebutuhanmu.
							</p>

							{/* 1 kolom (<360px), 2 kolom (mobile), 3 kolom (md+) */}
							<div className="mt-6 grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:gap-4 md:grid-cols-3">
								{PRICE_LIST.map((price) => (
									<div
										key={price.title}
										className={`flex h-auto min-w-0 w-full flex-col gap-4 rounded-[8px] border border-[#00000033] bg-white p-2.5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] sm:min-h-[303px] sm:p-5 ${
											price.favorit
												? 'order-first min-[360px]:col-span-2 md:order-none md:col-span-1'
												: 'order-2 md:order-none'
										}`}
									>
										<div
											className={`flex items-center gap-2 ${
												price.favorit ? 'relative justify-center sm:static sm:justify-start' : 'justify-center'
											}`}
										>
											<span
												className={`inline-flex items-center rounded-[2px] bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1px] text-black sm:tracking-[1.65px] ${
													price.favorit ? '' : 'w-full justify-center sm:w-auto'
												}`}
											>
												{price.badge}
											</span>
											{price.favorit && (
												<span className="absolute left-2 inline-flex items-center rounded-[2px] bg-[#004000] px-2 py-[2px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[1.1px] text-white sm:static">
													Favorit
												</span>
											)}
										</div>
										<h3 className="text-center whitespace-nowrap font-['Montserrat'] text-[clamp(13px,3.7vw,16px)] font-semibold leading-[28px] tracking-[0px] text-black sm:text-[20px]">
											{price.title}
										</h3>
										<div className="flex flex-col divide-y divide-obc-border">
											{price.rows.map((row) => (
												<div
													key={row.duration}
													className={`flex items-center justify-between gap-2 py-3 sm:py-2 ${
														price.favorit ? 'min-[360px]:px-[22%] sm:px-0' : ''
													}`}
												>
													<span className="whitespace-nowrap font-['Montserrat'] text-[clamp(11px,3vw,13px)] font-normal leading-[22px] tracking-[0.14px] text-black sm:text-[14px]">
														{row.duration}
													</span>
													<span className="whitespace-nowrap font-['Montserrat'] text-[clamp(11px,3vw,13px)] font-semibold leading-[22px] tracking-[0.14px] text-black sm:text-[14px]">
														{row.price}
													</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* Layanan Cuci Satuan */}
					<section className="px-5 pb-14 md:px-0">
						<div>
							<h2 className="flex items-center gap-1.5 font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:gap-2 sm:text-[25px]">
								<img
									src={washAndIronServiceIcon}
									alt=""
									className="h-5 w-5 shrink-0 object-contain sm:h-6 sm:w-6"
									aria-hidden="true"
								/>
								Layanan Cuci Satuan
							</h2>
							<div className="mt-6 overflow-x-auto">
								<table className="w-full table-fixed border-collapse sm:min-w-[480px]">
									<thead>
										<tr className="border-b border-black/[0.06] text-left">
											<th className="w-[34%] py-4 pl-4 pr-1 font-['Montserrat'] text-[11px] font-semibold uppercase leading-[16px] tracking-[1px] text-black sm:w-[32%] sm:px-4 sm:text-[12px] sm:tracking-[1.2px]">
												Item
											</th>
											<th className="w-[24%] px-0 py-4 text-center font-['Montserrat'] text-[11px] font-semibold uppercase leading-[16px] tracking-[1px] text-black sm:w-[30%] sm:px-4 sm:text-[12px] sm:tracking-[1.2px]">
												Durasi Pengerjaan
											</th>
											<th className="w-[42%] px-2 py-4 text-left font-['Montserrat'] text-[11px] font-semibold uppercase leading-[16px] tracking-[1px] text-black sm:w-[38%] sm:px-4 sm:text-center sm:text-[12px] sm:tracking-[1.2px]">
												Harga Satuan
											</th>
										</tr>
									</thead>
									<tbody>
										{SATUAN_ITEMS.map((row) => (
											<tr key={row.item} className="border-b border-black/[0.06] last:border-b-0">
												<td className="py-[15px] pl-4 pr-1 font-['Montserrat'] text-[clamp(12px,3.3vw,14px)] font-medium leading-[20px] tracking-[0.56px] text-[#222022] sm:px-4 sm:text-[14px]">
													{row.item}
												</td>
												<td className="px-1 py-[15px] text-center sm:px-4">
													{/* Badge durasi abu-abu */}
													<span className="inline-flex items-center whitespace-nowrap rounded-[4px] bg-[#F2F2F2] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1px] text-[#222022] sm:tracking-[1.1px]">
														{row.duration}
													</span>
												</td>
												<td className="px-4 py-[15px] font-['Montserrat'] text-[clamp(12px,3.3vw,14px)] font-semibold leading-[20px] tracking-[0.28px] text-black sm:text-[14px]">
													{row.price}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</section>

					{/* Price List Laundry Sepatu */}
					<section className="px-5 pb-14 md:px-0">
						<div>
							{/* Judul + garis tipis di bawahnya */}
							<h2 className="border-b border-black/[0.06] px-2 pb-3 font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:px-0 sm:text-[25px]">
								Price List Laundry Sepatu
							</h2>

							{/* Label & chip bagian sepatu, rata kanan */}
							<div className="mt-4 flex flex-col items-end gap-2 px-2 sm:px-0">
								<span className="font-['Montserrat'] text-[11px] font-bold uppercase leading-[15.4px] tracking-[0.55px] text-black">
									Detail Treatment
								</span>
								<div className="flex flex-wrap justify-end gap-2">
									{['Upper', 'Insole', 'Midsole', 'Outsole'].map((part) => (
										<span
											key={part}
											className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1px] text-black sm:px-4 sm:tracking-[1.1px]"
										>
											{part}
										</span>
									))}
								</div>
							</div>

							{/* 1 kolom (<360px), 2 kolom mulai 360px; jarak antar kartu bertahap */}
							<div className="mt-5 grid grid-cols-1 gap-2.5 px-2 min-[360px]:grid-cols-2 sm:mt-6 sm:gap-6 sm:px-0 lg:gap-[50px]">
								{SHOE_TREATMENTS.map((treatment) => {
									return (
										<div
											key={treatment.number}
											className={`flex h-full min-w-0 flex-col rounded-lg border border-[#D5E6CF] bg-white p-2.5 sm:p-6 ${
												treatment.favorit ? 'shadow-[0_2px_6px_rgba(0,0,0,0.15)]' : ''
											}`}
										>
											{/* Ikon + badge nomor / Favorit */}
											<div className="flex items-start justify-between">
												<span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#EEEEE7] text-black">
													<img src={treatment.icon} alt="" className="h-5 w-5 object-contain" aria-hidden="true" />
												</span>
												{treatment.favorit ? (
													<span className="inline-flex items-center rounded-[2px] bg-black px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-semibold leading-[15.4px] tracking-[1.1px] text-white">
														Favorit
													</span>
												) : (
													<span className="inline-flex items-center rounded-[2px] bg-[#EEEEE7] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-semibold leading-[15.4px] tracking-[1.1px] text-black">
														{treatment.number}
													</span>
												)}
											</div>

											<h3 className="mt-3.5 font-['Montserrat'] text-base font-semibold leading-6 tracking-[0px] text-black sm:mt-5 sm:text-[20px] sm:leading-[28px]">
												{treatment.title}
											</h3>
											<p className="mt-0.5 font-['Montserrat'] text-[11px] font-bold uppercase leading-[15px] tracking-[0.5px] text-black sm:mt-1 sm:text-[12px] sm:leading-[16px] sm:tracking-[0.6px]">
												{treatment.price}
											</p>
											<p className="mt-1.5 text-justify font-['Montserrat'] text-[12px] font-normal leading-[18px] tracking-[0.1px] text-[#41493D] sm:mt-3 sm:text-[14px] sm:leading-[22px] sm:tracking-[0.28px]">
												{treatment.description}
											</p>

											{/* Garis pemisah + tag, selalu menempel di bawah card */}
											<div className="mt-auto pt-1 sm:pt-5">
												<div className="border-t border-black/[0.06] pt-2 sm:pt-4">
													<p className="mb-1 font-['Montserrat'] text-[11px] font-bold uppercase leading-[15.4px] tracking-[0.55px] text-black sm:hidden">
														Fokus Treatment:
													</p>
													<div className="flex flex-wrap gap-1.5 sm:gap-2">
														{treatment.tags.map((tag) => (
															<span
																key={tag}
																className="inline-flex items-center rounded-[2px] bg-[#EEEEE7] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1px] text-black sm:tracking-[1.1px]"
															>
																{tag}
															</span>
														))}
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</section>

					{/* Aset & Alat */}
					<section className="px-5 pb-14 md:px-0">
						<div className="w-full md:w-[709px] md:max-w-full">
							<h2 className="h-auto w-full max-w-[610px] pl-5 font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black md:pl-0">
								Aset & Alat
							</h2>
							<div className="mt-6 flex w-full flex-wrap gap-4 md:flex-nowrap">
								{ASSET_STATS.map((stat) => (
									<div
										key={stat.label}
										className="flex h-[77px] flex-1 flex-col items-center justify-center gap-[11px] rounded-[8px] border border-[#EEEEE799] bg-[#F3F3F3] px-[5px] py-[10px] text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] md:w-[129px] md:flex-none md:shrink-0"
									>
										<p className="font-['Montserrat'] text-[25px] font-medium leading-[100%] tracking-[0%] text-black">
											{stat.value}
										</p>
										<p className="w-auto whitespace-nowrap font-['Montserrat'] text-[11px] font-medium uppercase leading-[14px] tracking-[0.55px] text-[#303030] md:w-[117px]">
											{stat.label}
										</p>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* Fasilitas */}
					<section className="px-5 pb-14 md:px-0">
						<div>
							<h2 className="font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
								Fasilitas
							</h2>
							<div className="mt-6 flex flex-wrap gap-x-9 gap-y-[26px] px-2 sm:gap-x-10 sm:gap-y-4 sm:px-0">
								{FACILITIES.map((facility) => {
									return (
										<div key={facility.label} className="flex items-center gap-3">
											<img
												src={facility.icon}
												alt=""
												className="h-6 w-6 shrink-0 object-contain sm:h-5 sm:w-5"
												aria-hidden="true"
											/>
											<span className="font-['Montserrat'] text-[16px] font-semibold leading-[24px] tracking-[0.16px] text-black">
												{facility.label}
											</span>
										</div>
									)
								})}
							</div>
						</div>
					</section>
				</div>

				{/* Kolom kanan (lg+): WhatsApp card sticky, mengikuti scroll sampai sebelum Galeri */}
				<aside className="hidden lg:block lg:w-1/3 lg:pt-14">
					<div className="sticky top-24">
						{/* lg:!w-full menimpa md:w-[32%] bawaan WhatsAppCard supaya card memenuhi kolom kanan */}
						<WhatsAppCard
							className="lg:!w-full"
							title={t('units.laundry.whatsappCardTitle')}
							description={t('units.laundry.whatsappCardDesc')}
							link={WHATSAPP_LINK}
						/>
					</div>
				</aside>
			</div>
			</ScrollReveal>
			</LazySection>

			{/* Galeri — tetap full width */}
			<LazySection minHeight={600}>
			<ScrollReveal>
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="text-center">
					<span className="font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-black">
						{t('gallerySection.badge')}
					</span>
					<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
						{t('gallerySection.momentsFrom', { unit: t('units.laundry.title') })}
					</h2>
					<div className="mx-auto mt-3 h-[2px] w-[396px] max-w-full rounded-[2px] bg-[#0000004D]" />
				</div>

				{/* Foto fleksibel mengikuti lebar kolom (tidak lagi ukuran tetap 280px) */}
				<div className="mt-6 grid grid-cols-2 gap-[10px] md:mt-8 md:grid-cols-4 md:gap-3">
					{GALLERY_IMAGES.slice(0, 8).map((image, index) => (
						<button
							key={index}
							type="button"
							onClick={() => setSelectedGalleryImage(image)}
							className={`group aspect-[4/3] w-full overflow-hidden rounded-[20px] md:aspect-[280/296] md:rounded-xl ${
								index >= 4 ? 'hidden md:block' : ''
							}`}
							aria-label={`Buka gambar Momen OBC Laundry ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Laundry ${index + 1}`}
								loading="lazy"
								decoding="async"
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</button>
					))}
				</div>
			</section>
			</ScrollReveal>
			</LazySection>

			{selectedGalleryImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-label="Pratinjau gambar galeri Laundry"
					onClick={() => setSelectedGalleryImage(null)}
				>
					<button
						className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-obc-green shadow-lg transition-transform hover:scale-105"
						type="button"
						aria-label={t('common.close')}
						onClick={() => setSelectedGalleryImage(null)}
					>
						<X size={22} />
					</button>
					<div className="relative max-h-[90vh] max-w-[92vw]" onClick={(event) => event.stopPropagation()}>
						<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC Laundry" />
					</div>
				</div>
			)}

			{/* Lokasi — tetap full width */}
			<LazySection minHeight={500}>
			<ScrollReveal>
			<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
				<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
					<div className="order-1 md:order-none">
						<h2 className="h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:h-auto md:max-w-none md:text-[25px]">
							{t('common.locationOf', { unit: t('units.laundry.title') })}
						</h2>
						<p className="mt-3 h-auto w-full max-w-[845px] font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.15px] text-black md:mt-1 md:h-auto md:text-[15px]">
							Jl. Rancabentang 1 No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat 40142
						</p>
					</div>
					<a
						href={GOOGLE_MAPS_LINK}
						target="_blank"
						rel="noreferrer"
						className="order-3 mt-4 inline-flex h-[40px] w-full items-center justify-center gap-[8px] rounded-full bg-[#E9E9E9] px-[20px] py-[12px] font-['Montserrat'] text-[16px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022] hover:bg-[#E1E1E1] md:order-none md:mt-0 md:h-[32px] md:w-[229px] md:shrink-0 md:text-[14px]"
					>
						<ExternalLink className="h-[16px] w-[16px] text-[#222022] md:h-[13.5px] md:w-[13.5px]" />
						{t('common.openGoogleMaps')}
					</a>
				</div>

				<div className="order-2 mt-4 h-[300px] overflow-hidden rounded-[24px] border border-obc-border md:order-none md:mt-6 md:h-[380px] md:rounded-2xl lg:h-[420px]">
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Laundry */}
					<iframe
						title={t('common.locationOf', { unit: t('units.laundry.title') })}
						src="https://www.google.com/maps?q=Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung&output=embed"
						className="h-full w-full border-0"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>
			</ScrollReveal>
			</LazySection>

			{/* Unit Bisnis lain — tetap full width */}
			<LazySection minHeight={600}>
			<ScrollReveal>
			<UnitBisnis items={OTHER_UNITS} title="Jelajahi Unit Bisnis OBC Group Lainnya" />
			</ScrollReveal>
			</LazySection>

			<LandingFooter />

			{/* Card WhatsApp (mobile & tablet, < lg): fixed di bawah layar, versi ringkas (variant="bar") */}
			<div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/95 px-4 pb-4 pt-3 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
				<div className="mx-auto w-full max-w-[720px]">
					<WhatsAppCard
						variant="bar"
						title={t('units.laundry.whatsappCardTitle')}
						description={t('units.laundry.whatsappCardDesc')}
						link={WHATSAPP_LINK}
					/>
				</div>
			</div>
		</div>
	)
}

export default LaundryPage