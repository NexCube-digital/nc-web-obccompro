import {
	ExternalLink,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/common/UnitBisnis'
import { WhatsAppCard } from '../../../components/common/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
import foodCourtIcon from '../../../assets/icon/iconstack.io - (Food Fork Drink).svg'
import clockIcon from '../../../assets/icon/clock.svg'
import tableIcon from '../../../assets/icon/meja.svg'
import lightIcon from '../../../assets/icon/lampu.svg'
import trashIcon from '../../../assets/icon/tong_sampah.svg'
import sinkIcon from '../../../assets/icon/wastafel.svg'
import fanIcon from '../../../assets/icon/kipas.svg'
import parkingIcon from '../../../assets/icon/parkir.svg'
import wifiFacilityIcon from '../../../assets/icon/wifi.svg'
import toiletIcon from '../../../assets/icon/toilet.svg'
import mosqueIcon from '../../../assets/icon/mesjid.svg'
import fallbackFacilityIcon from '../../../assets/icon/iconstack.io - (Location 05).svg'
import galleryImage1 from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import galleryImage2 from '../../../assets/unit-bisnis/guest-house/6a3b9e7c6468ad26c8dd7db04e41a8af085cf07c.png'
import galleryImage3 from '../../../assets/unit-bisnis/guest-house/cd92feca5d086df44322cf32f9ffba37aed4d61d.png'
import galleryImage4 from '../../../assets/unit-bisnis/guest-house/d04b14ff8c58c89c1b536a6ac3a885785c68d003.png'
import galleryImage5 from '../../../assets/unit-bisnis/guest-house/ed96a44b2ee52e1c52adbdee104d644a71ed3461.png'
import galleryImage6 from '../../../assets/unit-bisnis/guest-house/fb58a940485f759e525012e5cee240ca9379a1db.png'
import galleryImage7 from '../../../assets/unit-bisnis/guest-house/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import galleryImage8 from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
import sportCenterThumb from '../../../assets/unit-bisnis/4086acc6319c22edd57799828a517da01ea58de7.png'
import guestHouseThumb from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import villaThumb from '../../../assets/unit-bisnis/3f3b0cf46ed28fc2c0546f8d44a8e2a9977f0c43.jpg'
import laundryThumb from '../../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import coffeeThumb from '../../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import agribisnisThumb from '../../../assets/unit-bisnis/395bf2125ecb1a04ee7212871af8ece20326074d.jpg'

interface Blok {
	name: string
	operationalHours?: string
	tenants: string[]
	facilities: string[]
}

interface OtherUnit {
	slug: string
	category: string
	title: string
	image: string
}

const WHATSAPP_LINK = 'https://wa.me/6280000000000'
const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung'

// Daftar area food court untuk kartu info di section "Tentang" (tanda titik ditambahkan saat render)
const AREA_LIST = ['Blok A&B', 'Blok C', 'Blok D', 'Blok E', 'Blok F']

// Data tiap blok — teks tenant & fasilitas disamakan persis dengan desain.
// Tenant bertuliskan "Vacant" (belum terisi) ditampilkan dengan gaya miring abu-abu.
const BLOKS: Blok[] = [
	{
		name: 'BLOK A & B',
		operationalHours: '08:00–20:00',
		tenants: [
			'A7a',
			'A7',
			'A8',
			'A12',
			'A13',
			'B6 Kwetiaw medan',
			'B7 Pablo Burito',
			'B8 Smoke bandit',
			'B9 Mabin sei sapi',
			'B10 Darderdor',
			'B11 Ayam Tumpah Bawang',
			'B12 Jus Jadoel',
			'B13 Vacant',
			'B14 Jajan Yuk',
			'B15 Beja Cuanki',
			'B16 Dim sum',
			'B17 Kedai Rasa',
			'B18 Seblak Bu Neneng',
			'B19 Mie Timie',
			'B20 Sempol',
			'B21 Vacant',
			'B22 Crepecter',
		],
		facilities: [
			'Meja dan kursi makan',
			'Penerangan',
			'Toilet T1 (dibelakang A7a)',
			'Tong sampah (depan B6 dan samping B12)',
			'Free Wifi',
		],
	},
	{
		name: 'BLOK C',
		tenants: ['C1 Ayam goreng Madu', 'C2 Oppo Wae', 'C3 Nasi goreng', 'C4 Warung populer', 'C5 Kios Dewi', 'C6 Kapal Api'],
		facilities: ['Meja dan kursi makan', 'Wastafel depan gate Sport', 'Kipas angin', 'Penerangan', 'Parkir'],
	},
	{
		name: 'BLOK D',
		tenants: [
			'D1 Fortune Cookies',
			'D2 Ayam Tiga Djaya',
			'D3 Vacant',
			'D4 Kedai Apa Ya?',
			'D5 Meet The humble',
			'D6 Ayam Serundeng Ny. Oey',
			'D7 Si Paman',
			'D8 Sambal Overdose',
			'D9 Little Korea',
			'D10 Little Korea',
			'D11 Kedai Sinchi',
			'D12 Billiard',
			'D13 Vacant',
		],
		facilities: [
			'Meja Kursi makan',
			'Tong sampah (bawah tangga area umum D2,area umum D8)',
			'Wastafel (area umum D6&7)',
			'Toilet T2 (area umum D9&10 little Korea)',
			'Penerangan',
		],
	},
	{
		name: 'BLOK E',
		tenants: ['E1 Arsi Juice', 'E2 Lee Snack & Bakery', 'E3 OBC Kitchen', 'E4 Ayam Kangkung', 'E5 Vacant'],
		facilities: [
			'Toilet T3,4,5 (disamping lapangan Futsal 1)',
			'Tong sampah (diarea umum E2)',
			'Meja Kursi makan',
			'Lampu',
		],
	},
	{
		name: 'BLOK F',
		tenants: ['F1 Florist', 'F3 Katsu'],
		facilities: [
			'Mushola & tempat wudhu',
			'Toilet T1 (Belakang A7a)',
			'Tong sampah (diarea umum belakang lapangan Futsal 2)',
			'Meja Kursi makan',
			'Lampu',
		],
	},
]

const GALLERY_IMAGES = [
	galleryImage1,
	galleryImage2,
	galleryImage3,
	galleryImage4,
	galleryImage5,
	galleryImage6,
	galleryImage7,
	galleryImage8,
]

// Unit bisnis lain untuk section "Jelajahi Unit Bisnis OBC Group Lainnya" (food court sengaja dikecualikan)
const OTHER_UNITS: OtherUnit[] = [
	{ slug: 'sport-center', category: 'Sport & Event Space', title: 'OBC Sports Center', image: sportCenterThumb },
	{ slug: 'guest-house', category: 'Hospitality & Accommodation', title: 'OBC Guest House', image: guestHouseThumb },
	{ slug: 'villa', category: 'Hospitality & Accommodation', title: 'OBC Villa', image: villaThumb },
	{ slug: 'laundry', category: 'Laundry Services', title: 'OBC Laundry', image: laundryThumb },
	{ slug: 'coffee', category: 'Coffee & Lifestyle', title: 'OBC Coffee', image: coffeeThumb },
	{ slug: 'agribisnis', category: 'Agribisnis', title: 'OBC Agribisnis', image: agribisnisThumb },
]

function getFacilityIcon(label: string) {
	const text = label.toLowerCase()
	if (text.includes('meja') || text.includes('kursi')) return tableIcon
	if (text.includes('penerangan') || text.includes('lampu')) return lightIcon
	if (text.includes('tong sampah')) return trashIcon
	if (text.includes('wastafel')) return sinkIcon
	if (text.includes('kipas')) return fanIcon
	if (text.includes('parkir')) return parkingIcon
	if (text.includes('wifi')) return wifiFacilityIcon
	if (text.includes('toilet')) return toiletIcon
	if (text.includes('mushola')) return mosqueIcon
	return fallbackFacilityIcon
}

function BlokSection({ blok, index }: { blok: Blok; index: number }) {
	const { t } = useTranslation()
	// Tenant dibagi 2 kolom: kolom kiri terisi dulu, lalu kanan (sesuai desain)
	const half = Math.ceil(blok.tenants.length / 2)
	const columns = [blok.tenants.slice(0, half), blok.tenants.slice(half)]

	return (
		// Garis pemisah baru muncul mulai sebelum Blok D (index >= 2)
		<div
			className={`py-[19px] sm:py-6 ${
				index >= 2 ? 'mt-2 border-t border-black/[0.06] pt-[38px] sm:mt-0 sm:pt-6' : ''
			}`}
		>
			{/* Judul blok: titik hitam + nama */}
			<h3 className="flex items-center gap-2 font-['Montserrat'] text-[20px] font-semibold uppercase leading-[32px] tracking-[-0.6px] text-black sm:text-[24px]">
				<span className="h-[8px] w-[8px] shrink-0 rounded-full bg-black" />
				{blok.name}
			</h3>

			{blok.operationalHours && (
				<p className="mt-1 font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-black sm:text-[11px] sm:leading-[16.5px] sm:tracking-[1.1px]">
					{t('common.operationalHours')}: {blok.operationalHours}
				</p>
			)}

			<p className="mt-3 font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#41493D] sm:mt-4 sm:text-[11px] sm:leading-[16.5px] sm:tracking-[1.1px]">
				{t('common.areaInformation')}
			</p>

			{/* Card tenant: 1 kolom (<360px), 2 kolom mulai 360px */}
			<div className="mt-2 w-full rounded-lg border border-[#E2E2E2] bg-white px-3.5 py-3 sm:mt-3 sm:px-4">
				<div className="grid grid-cols-1 items-start gap-x-2 min-[360px]:grid-cols-2 sm:gap-x-4">
					{columns.map((column, colIndex) => (
						<div key={colIndex} className="flex min-w-0 flex-col">
							{column.map((tenant) => {
								const isVacant = tenant.toLowerCase().includes('vacant')
								return (
									<span
										key={tenant}
										className={`border-b border-black/[0.06] py-2 font-['Montserrat'] text-[13px] leading-[18px] tracking-[0px] last:border-b-0 sm:text-[14px] sm:leading-5 ${
											isVacant ? 'font-normal text-[#8A8A8A]' : 'font-medium text-black'
										}`}
									>
										{tenant}
									</span>
								)
							})}
						</div>
					))}
				</div>
			</div>

			{/* Card fasilitas */}
			<div className="mt-4 rounded-lg border border-[#E2E2E2B2] bg-[#F3F3F3] px-4 py-3.5 sm:p-5">
				<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15px] tracking-[1px] text-[#363636] sm:text-[11px] sm:leading-[16.5px] sm:tracking-[1.1px]">
					{t('common.facilities')}
				</p>
				<div className="mt-1.5 flex flex-col gap-1 sm:mt-5 sm:gap-2">
					{blok.facilities.map((facility) => {
						const icon = getFacilityIcon(facility)
						return (
							<div key={facility} className="flex items-center gap-1.5 sm:gap-2">
								<img
									src={icon}
									alt=""
									className="h-[14px] w-[14px] shrink-0 object-contain sm:h-[18px] sm:w-[18px]"
									aria-hidden="true"
								/>
								<span className="font-['Montserrat'] text-[12px] font-normal leading-[18px] tracking-[0px] text-black sm:text-[13px] sm:leading-[19.5px]">
									{facility}
								</span>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

function FoodCourtPage() {
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
				<img src={heroImage} alt="OBC Food Court" className="absolute inset-0 h-full w-full object-cover object-top md:object-center" />
				{/* Overlay: hanya md+. Lebar bertahap mengikuti breakpoint */}
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />
				<div
					className="absolute right-0 top-0 hidden h-full w-[72%] max-w-[763.59px] md:block lg:w-[65%] xl:w-[58%] 2xl:w-[52%] min-[1280px]:h-[724px] min-[1280px]:max-h-full"
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
								{t('units.foodCourt.category')}
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[40px] font-bold leading-[52px] tracking-[1.5px] text-black lg:text-[48px] lg:leading-[60px] xl:text-[56px] xl:leading-[70px]">
								{t('units.foodCourt.title')}
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.18px] text-black lg:text-[18px] lg:leading-[29.25px]">
								{t('units.foodCourt.desc')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-[1200px] md:px-8 lg:flex lg:items-stretch lg:gap-10">
				{/* Kolom kiri */}
				<div className="min-w-0 lg:w-2/3">
					{/* Tentang */}
					<section className="relative z-10 -mt-7 rounded-t-[28px] bg-obc-ivory px-5 pb-10 pt-8 min-[400px]:px-[30px] md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:py-14">
						<div className="flex flex-col">
							<h1 className="order-1 text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] text-black md:hidden">
								{t('units.foodCourt.title')}
							</h1>
							<h2 className="order-3 mt-8 font-heading text-[18px] font-semibold text-[#000000] md:order-1 md:mt-0 md:text-[25px]">
								{t('units.foodCourt.aboutTitle')}
							</h2>
							<p className="order-4 mt-3 max-w-2xl text-justify align-middle font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
								{t('units.foodCourt.aboutText')}
							</p>

							<div className="order-2 mb-8 mt-4 grid grid-cols-1 gap-4 md:order-3 md:mb-0 md:mt-8 md:flex md:flex-wrap md:items-center md:justify-start md:gap-x-12 md:gap-y-4 md:border-t md:border-obc-border md:pt-6">
								<div className="flex items-center justify-start gap-2 text-left">
									<img src={foodCourtIcon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
											{t('common.location')} Food Court
										</p>
										<p className="flex flex-wrap justify-start gap-x-2 font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
											{AREA_LIST.map((area) => (
												<span key={area}>·{area}</span>
											))}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-start gap-2 text-left">
									<img src={clockIcon} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
											{t('units.foodCourt.schedule')}
										</p>
										<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
											{t('units.foodCourt.workingHours')}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Blok per blok */}
					<section className="px-5 pb-14 min-[400px]:px-8 md:px-0">
						<div className="w-full">
							{BLOKS.map((blok, index) => (
								<BlokSection key={blok.name} blok={blok} index={index} />
							))}
						</div>
					</section>
				</div>

				{/* Kolom kanan (lg+): WhatsApp card sticky, mengikuti scroll sampai sebelum Galeri */}
				<aside className="hidden lg:block lg:w-1/3 lg:pt-14">
					<div className="sticky top-24">
						{/* lg:!w-full menimpa md:w-[32%] bawaan WhatsAppCard supaya card memenuhi kolom kanan */}
						<WhatsAppCard
							className="lg:!w-full"
							title={t('units.foodCourt.whatsappCardTitle')}
							description={t('units.foodCourt.whatsappCardDesc')}
							link={WHATSAPP_LINK}
						/>
					</div>
				</aside>
			</div>

			{/* Galeri */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="text-center">
					<span className="font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-black">
						{t('gallerySection.badge')}
					</span>
					<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
						{t('gallerySection.momentsFrom', { unit: t('units.foodCourt.title') })}
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
							aria-label={`Buka gambar Momen OBC Food Court ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Food Court ${index + 1}`}
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
					aria-label="Pratinjau gambar galeri Food Court"
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
						<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC Food Court" />
					</div>
				</div>
			)}

			{/* Lokasi */}
			<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
				<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
					<div className="order-1 md:order-none">
						<h2 className="h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:h-auto md:max-w-none md:text-[25px]">
							{t('common.locationOf', { unit: t('units.foodCourt.title') })}
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
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Food Court */}
					<iframe
						title={t('common.locationOf', { unit: t('units.foodCourt.title') })}
						src="https://www.google.com/maps?q=Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung&output=embed"
						className="h-full w-full border-0"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>

			<UnitBisnis items={OTHER_UNITS} />

			<LandingFooter />

			{/* Card WhatsApp (mobile & tablet, < lg): fixed di bawah layar, versi ringkas (variant="bar") */}
			<div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/95 px-4 pb-4 pt-3 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
				<div className="mx-auto w-full max-w-[720px]">
					<WhatsAppCard
						variant="bar"
						title={t('units.foodCourt.whatsappCardTitle')}
						description={t('units.foodCourt.whatsappCardDesc')}
						link={WHATSAPP_LINK}
					/>
				</div>
			</div>
		</div>
	)
}

export default FoodCourtPage