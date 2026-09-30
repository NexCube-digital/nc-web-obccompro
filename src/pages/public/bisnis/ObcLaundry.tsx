import {
	ArrowRight,
	ExternalLink,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/common/UnitBisnis'
import { WhatsAppCard } from '../../../components/common/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
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
		<div className="min-h-screen bg-obc-ivory">
			<LandingNavbar />

			{/* Hero */}
			<section className="relative min-h-[100svh] overflow-hidden">
				<img src={heroImage} alt="OBC Laundry" className="absolute inset-0 h-full w-full object-cover" />
				<div className="absolute inset-0 bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent" />
				<div className="absolute inset-y-0 right-0 h-full w-full sm:w-[92%] md:w-[72%] lg:w-[65%] xl:w-[58%] 2xl:w-[52%] bg-[linear-gradient(270deg,#FAFAF2_0%,#FAFAF2_45%,rgba(250,250,242,0.95)_60%,rgba(250,250,242,0.6)_80%,rgba(250,250,242,0)_100%)]" />

				<div className="relative z-10 flex min-h-[100svh] w-full items-center pt-24 pb-12">
					<div className="mx-auto flex w-[calc(100%-32px)] max-w-[1246px] justify-end px-4 sm:px-6">
						<div className="w-full max-w-[472px] text-black">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black">
								<span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
								Laundry Services
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[38px] font-bold leading-[1.2] tracking-[1.5px] text-black sm:text-[46px] md:text-[56px] md:leading-[70px]">
								OBC Laundry
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[15px] font-normal leading-[26px] tracking-[0.18px] text-black sm:text-[16px] md:text-[18px] md:leading-[29.25px]">
								Nikmati layanan laundry kiloan dan satuan yang praktis untuk kebutuhan sehari-hari. Dengan free pick up
								& delivery serta layanan Quick 4 Jam Selesai, urusan laundry jadi lebih mudah tanpa mengganggu
								aktivitas Anda.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Tentang + CTA */}
			<section className="mx-auto max-w-[1200px] gap-10 px-5 py-14 md:flex md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-heading text-[25px] font-semibold text-[#000000]">Tentang OBC Laundry</h2>
					<p className="mt-4 max-w-2xl text-justify align-middle font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0px] text-black">
						OBC Laundry merupakan salah satu unit bisnis OBC Group yang menyediakan berbagai layanan perawatan
						pakaian dan perlengkapan, mulai dari cuci satu, cuci setrika, laundry satuan, hingga perawatan sepatu.
						Pilihan layanan dan durasi dibuat untuk menyesuaikan kebutuhan, baik untuk pakaian sehari-hari maupun
						barang yang membutuhkan penanganan khusus.
					</p>

					<div className="mt-8 flex flex-wrap items-center justify-center gap-12 border-t border-obc-border pt-6">
						<div className="flex items-center justify-center gap-2 text-center">
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
						<div className="flex items-center justify-center gap-2 text-center">
							<img src={clockIcon} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" aria-hidden="true" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
									Buka Setiap Hari
								</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
									07.00 WIB - 20.00 WIB
								</p>
							</div>
						</div>
					</div>
				</div>

				<WhatsAppCard
					title="Laundry Beres, Aktivitas Jalan Terus"
					description="Butuh laundry kiloan atau satuan? Hubungi OBC Laundry untuk mendapatkan informasi lebih lanjut mengenai pick up & delivery, maupun kebutuhan laundry lainnya."
					link={WHATSAPP_LINK}
				/>
			</section>

			{/* Layanan OBC Laundry */}
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					<div className="flex items-start justify-between gap-3">
						<h2 className="font-heading text-2xl font-semibold text-[25px] text-[#000000]">Layanan OBC Laundry</h2>
						<a
							href="#price-list"
							className="mt-7 inline-flex items-center gap-1 font-heading text-[12px] font-semibold text-obc-green hover:text-obc-green-hover"
						>
							Lihat  Price List Lengkap
							<ArrowRight size={14} />
						</a>
					</div>

					<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
						{LAUNDRY_SERVICES.map((service) => {
							return (
								<div
									key={service.title}
									className="rounded-2xl border border-obc-border bg-obc-white p-5 shadow-[0_4px_16px_rgba(52,49,51,0.05)]"
								>
									<div className="flex items-start justify-between">
										<span className="inline-flex items-center rounded-[2px] font-semibold bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.65px] text-black">
											{service.badge}
										</span>
										<img src={service.icon} alt="" className="h-5 w-5 object-contain" aria-hidden="true" />
									</div>
									<h3 className="mt-4 font-heading text-lg font-semibold text-obc-charcoal">{service.title}</h3>
									<p className="mt-4 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-[#000000E5]">
										Pilihan Durasi:
									</p>
									<div className="mt-2 flex flex-wrap gap-2">
										{service.durations.map((duration) => (
											<span
												key={duration}
												className="inline-flex items-center font-medium rounded-[2px] bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.65px] text-black"
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
			<section id="price-list" className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Price List OBC Laundry
					</h2>
					<p className="mt-1 font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.16px] text-[#615D5F]">
						Pilih layanan dan durasi yang sesuai dengan kebutuhanmu.
					</p>

					<div className="mt-6 grid grid-cols-1 gap-1 md:grid-cols-3">
						{PRICE_LIST.map((price) => (
							<div
								key={price.title}
								className="flex h-[303px] w-[240px] flex-col gap-4 rounded-[8px] border border-[#00000033] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
							>
								<div className={`flex items-center gap-2 ${price.favorit ? '' : 'justify-center'}`}>
									<span className="inline-flex items-center rounded-[2px] bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.65px] text-black">
										{price.badge}
									</span>
									{price.favorit && (
										<span className="inline-flex items-center rounded-[2px] bg-[#004000] px-2 py-[2px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[1.1px] text-white">
											Favorit
										</span>
									)}
								</div>
								<h3 className="text-center whitespace-nowrap font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[0px] text-black">
									{price.title}
								</h3>
								<div className=" flex flex-col divide-y divide-obc-border">
									{price.rows.map((row) => (
										<div key={row.duration} className="flex items-center justify-between py-2">
											<span className="font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-[0.14px] text-black">
												{row.duration}
											</span>
											<span className="font-['Montserrat'] text-[14px] font-semibold leading-[22px] tracking-[0.14px] text-black">
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
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					{/* Card pembungkus judul */}
						<h2 className="flex items-center gap-2 font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
							<img src={washAndIronServiceIcon} alt="" className="h-6 w-6 shrink-0 object-contain" aria-hidden="true" />
							Layanan Cuci Satuan
						</h2>
						<div className="mt-6 overflow-x-auto">
							<table className="w-full min-w-[480px] table-fixed border-collapse">
								<thead>
									<tr className="border-b border-black/[0.06] text-left">
										<th className="w-[32%] px-4 py-4 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.2px] text-black">
											Item
										</th>
										<th className="w-[30%] px-4 py-4 text-center font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.2px] text-black">
											Durasi Pengerjaan
										</th>
										<th className="w-[38%] px-4 py-4 text-center font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.2px] text-black">
											Harga Satuan
										</th>
									</tr>
								</thead>
								<tbody>
									{SATUAN_ITEMS.map((row) => (
										<tr key={row.item} className="border-b border-black/[0.06] last:border-b-0">
											<td className="px-4 py-[15px] font-['Montserrat'] text-[14px] font-medium leading-[20px] tracking-[0.56px] text-[#222022]">
												{row.item}
											</td>
											<td className="px-4 py-[15px] text-center">
												{/* Badge durasi abu-abu */}
												<span className="inline-flex items-center rounded-[4px] bg-[#F2F2F2] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.1px] text-[#222022]">
													{row.duration}
												</span>
											</td>
											<td className="px-4 py-[15px] font-['Montserrat'] text-[14px] font-semibold leading-[20px] tracking-[0.28px] text-black">
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
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					{/* Judul + garis tipis di bawahnya */}
					<h2 className="border-b border-black/[0.06] pb-3 font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Price List Laundry Sepatu
					</h2>

					{/* Label & chip bagian sepatu, rata kanan */}
					<div className="mt-4 flex flex-col items-end gap-2">
						<span className="font-['Montserrat'] text-[11px] font-bold uppercase leading-[15.4px] tracking-[0.55px] text-black">
							Detail Treatment
						</span>
						<div className="flex flex-wrap justify-end gap-2">
							{['Upper', 'Insole', 'Midsole', 'Outsole'].map((part) => (
								<span
									key={part}
									className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-1 font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.1px] text-black"
								>
									{part}
								</span>
							))}
						</div>
					</div>

					<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-[50px]">
						{SHOE_TREATMENTS.map((treatment) => {
							return (
								<div
									key={treatment.number}
									className={`flex h-full flex-col rounded-lg border border-[#D5E6CF] bg-white p-6 ${
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

									<h3 className="mt-5 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[0px] text-black">
										{treatment.title}
									</h3>
									<p className="mt-1 font-['Montserrat'] text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-black">
										{treatment.price}
									</p>
									<p className="mt-3 text-justify font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-[0.28px] text-[#41493D]">
										{treatment.description}
									</p>

									{/* Garis pemisah + tag, selalu menempel di bawah card */}
									<div className="mt-auto pt-5">
										<div className="border-t border-black/[0.06] pt-4">
											<div className="flex flex-wrap gap-2">
												{treatment.tags.map((tag) => (
													<span
														key={tag}
														className="inline-flex items-center rounded-[2px] bg-[#EEEEE7] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.1px] text-black"
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
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="w-full md:w-[709px]">
					<h2 className="h-[30px] w-full max-w-[610px] font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Aset & Alat
					</h2>
					<div className="mt-6 flex w-full flex-wrap gap-4 md:h-[77px] md:flex-nowrap">
						{ASSET_STATS.map((stat) => (
							<div
								key={stat.label}
								className="flex h-[77px] w-[129px] shrink-0 flex-col items-center justify-center gap-[11px] rounded-[8px] border border-[#EEEEE799] bg-[#F3F3F3] px-[5px] py-[10px] text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
							>
								<p className="font-['Montserrat'] text-[25px] font-medium leading-[100%] tracking-[0%] text-black">
									{stat.value}
								</p>
								<p className="w-[117px] whitespace-nowrap font-['Montserrat'] text-[11px] font-medium uppercase leading-[14px] tracking-[0.55px] text-[#303030]">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Fasilitas */}
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Fasilitas
					</h2>
					<div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
						{FACILITIES.map((facility) => {
							return (
								<div key={facility.label} className="flex items-center gap-3">
									<img src={facility.icon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<span className="font-['Montserrat'] text-[16px] font-semibold leading-[24px] tracking-[0.16px] text-black">
										{facility.label}
									</span>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Galeri — tetap full width */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="text-center">
					<span className="font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-black">
						Galeri
					</span>
					<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
						Momen dari OBC Laundry
					</h2>
					<div className="mx-auto mt-3 h-[2px] w-[396px] rounded-[2px] bg-[#0000004D]" />
				</div>

				<div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
					{GALLERY_IMAGES.map((image, index) => (
						<button
							key={index}
							type="button"
							onClick={() => setSelectedGalleryImage(image)}
							className="group h-[296px] w-[280px] overflow-hidden rounded-xl"
							aria-label={`Buka gambar Momen OBC Laundry ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Laundry ${index + 1}`}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</button>
					))}
				</div>
			</section>

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
						aria-label="Tutup gambar"
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
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="h-[30px] w-full max-w-[318px] font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
							Lokasi OBC Laundry
						</h2>
						<p className="mt-1 h-[24px] w-full max-w-[845px] font-['Montserrat'] text-[15px] font-normal leading-[24px] tracking-[0.15px] text-black">
							Jl. Rancabentang 1 No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat 40142
						</p>
					</div>
					<a
						href={GOOGLE_MAPS_LINK}
						target="_blank"
						rel="noreferrer"
						className="inline-flex h-[32px] w-[229px] items-center justify-center gap-[8px] rounded-full bg-[#E9E9E9] px-[20px] py-[12px] font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022] hover:bg-[#E1E1E1]"
					>
						<ExternalLink className="h-[13.5px] w-[13.5px] text-[#222022]" />
						Buka di Google Maps
					</a>
				</div>

				<div className="mt-6 h-[360px] overflow-hidden rounded-2xl border border-obc-border md:h-[420px]">
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Laundry */}
					<iframe
						title="Lokasi OBC Laundry"
						src="https://www.google.com/maps?q=Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung&output=embed"
						className="h-full w-full border-0"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>

			{/* Unit Bisnis lain — tetap full width */}
			<UnitBisnis items={OTHER_UNITS} title="Jelajahi Unit Bisnis OBC Group Lainnya" />

			<LandingFooter />
		</div>
	)
}

export default LaundryPage