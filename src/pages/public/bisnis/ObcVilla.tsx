import {
	LogIn,
	LogOut,
	ExternalLink,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/ui/OtherUnitBisnis'
import { WhatsAppCard } from '../../../components/ui/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/slider/villa.webp'
import roomIcon from '../../../assets/icon/kamar.svg'
import bathroomIcon from '../../../assets/icon/kamarmandi.svg'
import livingRoomIcon from '../../../assets/icon/kursi.svg'
import loungeIcon from '../../../assets/icon/kursi22.svg'
import parkingIcon from '../../../assets/icon/parkir.svg'
import gardenIcon from '../../../assets/icon/bunga.svg'
import kitchenIcon from '../../../assets/icon/kitchen.svg'
import driverIcon from '../../../assets/icon/user.svg'
import balconyIcon from '../../../assets/icon/balkon.svg'
import airConditioningIcon from '../../../assets/icon/ac.svg'
import televisionIcon from '../../../assets/icon/televisi.svg'
import wifiIcon from '../../../assets/icon/wifi.svg'
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
import laundryThumb from '../../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import foodCourtThumb from '../../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import coffeeThumb from '../../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import agribisnisThumb from '../../../assets/unit-bisnis/395bf2125ecb1a04ee7212871af8ece20326074d.jpg'

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
const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Jl.+Rancabentang+1+No.10,+Kec.+Cidadap,+Kota+Bandung'

// Ringkasan cepat yang tampil di bawah deskripsi hero — sesuaikan dengan data villa aktual
const QUICK_FACTS = ['3 kamar tidur', '3 kamar mandi', '1 ruang keluarga', '2 ruang santai']

// Fasilitas villa — urutan mengikuti tampilan 3 kolom di mockup
const FACILITIES: Facility[] = [
	{ icon: roomIcon, label: '3 Kamar Tidur' },
	{ icon: bathroomIcon, label: '3 Kamar Mandi' },
	{ icon: livingRoomIcon, label: '1 Ruang Keluarga' },
	{ icon: loungeIcon, label: '2 Ruang Santai' },
	{ icon: parkingIcon, label: 'Lapangan Parkir IoT' },
	{ icon: gardenIcon, label: 'Taman' },
	{ icon: kitchenIcon, label: 'Kitchen (Kulkas, Kompor, Microwave)' },
	{ icon: driverIcon, label: 'Ruang Driver' },
	{ icon: balconyIcon, label: 'Balkon' },
	{ icon: airConditioningIcon, label: 'AC' },
	{ icon: televisionIcon, label: 'TV' },
	{ icon: wifiIcon, label: 'Free Wi-Fi' },
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

// Unit bisnis lain untuk section "Jelajahi Unit Bisnis OBC Group Lainnya" (villa sengaja dikecualikan)
const OTHER_UNITS: OtherUnit[] = [
	{ slug: 'sport-center', category: 'Sport & Event Space', title: 'OBC Sports Center', image: sportCenterThumb },
	{ slug: 'guest-house', category: 'Hospitality & Accommodation', title: 'OBC Guest House', image: guestHouseThumb },
	{ slug: 'laundry', category: 'Laundry Services', title: 'OBC Laundry', image: laundryThumb },
	{ slug: 'food-court', category: 'Food & Beverage', title: 'OBC Food Court', image: foodCourtThumb },
	{ slug: 'coffee', category: 'Coffee & Lifestyle', title: 'OBC Coffee', image: coffeeThumb },
	{ slug: 'agribisnis', category: 'Agribisnis', title: 'OBC Agribisnis', image: agribisnisThumb },
]

function VillaPage() {
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
		<div className="min-h-screen bg-obc-ivory pb-[130px] lg:pb-0">
			<LandingNavbar />

			{/* Hero: mobile hanya foto (teks pindah ke bawah foto), md+ teks di atas foto (rata kiri) */}
			<section className="relative h-[360px] overflow-hidden md:h-auto md:min-h-[100svh]">
				<img src={heroImage} alt="OBC Villa" className="absolute inset-0 h-full w-full object-cover object-top md:object-center" />
				{/* Overlay: hanya md+. Lebar bertahap mengikuti breakpoint */}
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />
				<div
					className="absolute left-0 top-0 hidden h-full w-[72%] max-w-[763.59px] md:block lg:w-[65%] xl:w-[58%] 2xl:w-[52%]"
					style={{
						background:
							'linear-gradient(90deg, #FAFAF2 0%, rgba(250, 250, 242, 0.9) 40.87%, rgba(250, 250, 242, 0.592749) 65.38%, rgba(250, 250, 242, 0) 90.87%)',
					}}
				/>

				<div className="relative z-10 hidden min-h-[100svh] w-full items-center pb-12 pt-24 md:flex">
					<div className="mx-auto w-full max-w-[1246px] px-8 md:px-10">
						<div className="w-full max-w-[472px] text-black md:max-w-[380px] lg:max-w-[440px] xl:max-w-[472px]">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black lg:text-[14px]">
								<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#000000]" />
								{t('units.villa.category')}
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[40px] font-bold leading-[52px] tracking-[1.5px] text-black lg:text-[48px] lg:leading-[60px] xl:text-[56px] xl:leading-[70px]">
								{t('units.villa.title')}
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.18px] text-black lg:text-[18px] lg:leading-[29.25px]">
								{t('units.villa.desc')}
							</p>
							<p className="mt-4 font-['Montserrat'] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-black">
								{QUICK_FACTS.join(' · ')}
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
								{t('units.villa.title')}
							</h1>

							{/* Info singkat: boleh wrap di layar sangat kecil */}
							<div className="order-2 mb-8 mt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-3 min-[400px]:flex-nowrap md:order-4 md:mb-0 md:mt-8 md:flex-wrap md:justify-center md:gap-x-12 md:gap-y-4 md:border-t md:border-obc-border md:pt-6">
								<div className="flex items-center justify-center gap-2 text-left md:text-center">
									<img src={roomIcon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15.4px] tracking-[1px] text-[#41493D] md:text-[11px] md:tracking-[1.65px]">Kapasitas</p>
										<p className="font-['Montserrat'] text-[13px] font-semibold leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">3 Kamar Tidur</p>
									</div>
								</div>
								<div className="flex items-center justify-center gap-2 text-left md:text-center">
									<LogIn size={18} className="shrink-0 text-[#222022]" />
									<div>
										<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15.4px] tracking-[1px] text-[#41493D] md:text-[11px] md:tracking-[1.65px]">Check-in</p>
										<p className="font-['Montserrat'] text-[13px] font-semibold leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">14.00 WIB</p>
									</div>
								</div>
								<div className="flex items-center justify-center gap-2 text-left md:text-center">
									<LogOut size={18} className="shrink-0 text-[#222022]" />
									<div>
										<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15.4px] tracking-[1px] text-[#41493D] md:text-[11px] md:tracking-[1.65px]">Check-out</p>
										<p className="font-['Montserrat'] text-[13px] font-semibold leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">12.00 WIB</p>
									</div>
								</div>
							</div>

							<h2 className="order-5 mt-8 font-['Montserrat'] text-[18px] font-semibold leading-[100%] tracking-[0%] text-black md:order-1 md:mt-0 md:text-[25px]">
								{t('units.villa.aboutTitle')}
							</h2>
							<p className="order-6 mt-3 max-w-[653px] text-justify font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
								{t('units.villa.aboutText')}
							</p>
						</div>
					</section>

					{/* Fasilitas: 1 kolom (<360px), 2 kolom (mobile), 3 kolom (md+) */}
					<section className="px-5 pb-14 min-[400px]:px-[30px] md:px-0">
						<div>
							<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[1px] text-[#222022]">
								{t('units.villa.facilitiesTitle')}
							</h2>
							<div className="mt-7 grid grid-cols-1 gap-x-3 gap-y-5 min-[360px]:grid-cols-2 md:mt-6 md:grid-cols-3 md:gap-x-6 md:gap-y-4">
								{FACILITIES.map((facility) => {
									return (
										<div key={facility.label} className="flex items-center gap-3">
											<img
												src={facility.icon}
												alt=""
												className="h-6 w-6 shrink-0 object-contain md:h-5 md:w-5"
												aria-hidden="true"
											/>
											<span className="font-['Montserrat'] text-[13px] font-medium leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">
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
							title={t('units.villa.whatsappCardTitle')}
							description={t('units.villa.whatsappCardDesc')}
							link={WHATSAPP_LINK}
						/>
					</div>
				</aside>
			</div>

			{/* Galeri */}
			<section className="mx-auto max-w-[1200px] px-6 pb-10 md:px-8 md:pb-16">
				<div className="text-center">
					<span className="font-['Montserrat'] text-[16px] font-semibold normal-case leading-[20px] tracking-[1.4px] text-black md:uppercase">
						Galeri
					</span>
					<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
						{t('units.villa.galleryTitle')}
					</h2>
					<div className="mx-auto mt-3 hidden h-[2px] w-[396px] max-w-full rounded-[2px] bg-[#0000004D] md:block" />
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
							aria-label={`Buka gambar Momen OBC Villa ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Villa ${index + 1}`}
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
					aria-label="Pratinjau gambar galeri Villa"
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
						<img
							className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
							src={selectedGalleryImage}
							alt="Pratinjau galeri OBC Villa"
						/>
					</div>
				</div>
			)}

			{/* Lokasi */}
			<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
				<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
					<div className="order-1 md:order-none">
						<h2 className="h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:h-auto md:max-w-none md:text-[25px]">
							{t('units.villa.locationTitle')}
						</h2>
						<p className="mt-3 h-auto w-full max-w-[845px] font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.15px] text-black md:mt-1 md:h-auto md:text-[15px]">
							Jl. Rancabentang 1 No.10, Kec. Cidadap, Kota Bandung, Jawa Barat 40142
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
					<iframe
						title="Lokasi OBC Villa"
						src="https://www.google.com/maps?q=Jl.+Rancabentang+1+No.10,+Kec.+Cidadap,+Kota+Bandung&output=embed"
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
						title={t('units.villa.whatsappCardTitle')}
						description={t('units.villa.whatsappCardDesc')}
						link={WHATSAPP_LINK}
					/>
				</div>
			</div>
		</div>
	)
}

export default VillaPage