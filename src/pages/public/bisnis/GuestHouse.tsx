import {
	X,
	LogIn,
	LogOut,
	ExternalLink,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/common/UnitBisnis'
import { WhatsAppCard } from '../../../components/common/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
import roomIcon from '../../../assets/icon/kamar.svg'
import parkingIcon from '../../../assets/icon/parkir.svg'
import foodCourtIcon from '../../../assets/icon/sendokgarpu.svg'
import sportCenterIcon from '../../../assets/icon/barber.svg'
import sittingAreaIcon from '../../../assets/icon/area_duduk.svg'
import wifiIcon from '../../../assets/icon/wifi.svg'
import airConditioningIcon from '../../../assets/icon/ac.svg'
import televisionIcon from '../../../assets/icon/televisi.svg'
import galleryImage1 from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import galleryImage2 from '../../../assets/unit-bisnis/guest-house/6a3b9e7c6468ad26c8dd7db04e41a8af085cf07c.png'
import galleryImage3 from '../../../assets/unit-bisnis/guest-house/cd92feca5d086df44322cf32f9ffba37aed4d61d.png'
import galleryImage4 from '../../../assets/unit-bisnis/guest-house/d04b14ff8c58c89c1b536a6ac3a885785c68d003.png'
import galleryImage5 from '../../../assets/unit-bisnis/guest-house/ed96a44b2ee52e1c52adbdee104d644a71ed3461.png'
import galleryImage6 from '../../../assets/unit-bisnis/guest-house/fb58a940485f759e525012e5cee240ca9379a1db.png'
import galleryImage7 from '../../../assets/unit-bisnis/guest-house/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import galleryImage8 from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
import sportCenterThumb from '../../../assets/unit-bisnis/4086acc6319c22edd57799828a517da01ea58de7.png'
import villaThumb from '../../../assets/unit-bisnis/3f3b0cf46ed28fc2c0546f8d44a8e2a9977f0c43.jpg'
import laundryThumb from '../../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import foodCourtThumb from '../../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import coffeeThumb from '../../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import agribisnisThumb from '../../../assets/unit-bisnis/395bf2125ecb1a04ee7212871af8ece20326074d.jpg'

interface RoomType {
	name: string
	rooms: string[]
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
const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Jl.+Rancabentang+1+No.10,+Ciumbuleuit,+Bandung'

// Data kamar — sesuaikan dengan data unit kamar aktual dari admin/CMS
const ROOM_TYPES: RoomType[] = [
	{
		name: 'REDDOORZ ROOM',
		rooms: ['Room 1A', 'Room 1B', 'Room 1C', 'Room 1D', 'Room 1E', 'Room 1F', 'Room 2A', 'Room 2B', 'Room 2C', 'Room 2D', 'Room 2F', 'Room 2G'],
	},
	{
		name: 'PREMIUM',
		rooms: ['Room 2H', 'Room 2I', 'Room 23', 'Room 3A', 'Room 3C', 'Room 4A', 'Room 4B'],
	},
	{
		name: 'SINGLE ROOM',
		rooms: ['Room 1G', 'Room 2K', 'Room 2L', 'Room 3D', 'Room 3E', 'Room 4C', 'Room 5R1', 'Room 5R2'],
	},
	{
		name: 'SUITE ROOM',
		rooms: ['Penthouse 1', 'Penthouse 2'],
	},
]

// Total kamar dihitung otomatis dari data di atas, supaya badge & kapasitas tidak pernah selisih
const TOTAL_ROOMS = ROOM_TYPES.reduce((total, type) => total + type.rooms.length, 0)

const FACILITIES: Facility[] = [
	{ icon: parkingIcon, label: 'Parking IoT' },
	{ icon: foodCourtIcon, label: 'Food Court' },
	{ icon: sportCenterIcon, label: 'Sport Center' },
	{ icon: sittingAreaIcon, label: 'Area Duduk Bersama' },
	{ icon: wifiIcon, label: 'Free WiFi' },
	{ icon: airConditioningIcon, label: 'AC' },
	{ icon: televisionIcon, label: 'TV' },
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

// Unit bisnis lain untuk section "Jelajahi Unit Bisnis OBC Group Lainnya" (guest-house sengaja dikecualikan)
const OTHER_UNITS: OtherUnit[] = [
	{ slug: 'sport-center', category: 'Sport & Event Space', title: 'OBC Sports Center', image: sportCenterThumb },
	{ slug: 'villa', category: 'Hospitality & Accommodation', title: 'OBC Villa', image: villaThumb },
	{ slug: 'laundry', category: 'Laundry Services', title: 'OBC Laundry', image: laundryThumb },
	{ slug: 'food-court', category: 'Food & Beverage', title: 'OBC Food Court', image: foodCourtThumb },
	{ slug: 'coffee', category: 'Coffee & Lifestyle', title: 'OBC Coffee', image: coffeeThumb },
	{ slug: 'agribisnis', category: 'Agribisnis', title: 'OBC Agribisnis', image: agribisnisThumb },
]

function GuestHousePage() {
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
				<img
					src={heroImage}
					alt="Fasad OBC Guest House"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent" />
				<div className="absolute inset-y-0 right-0 h-full w-full sm:w-[92%] md:w-[72%] lg:w-[65%] xl:w-[58%] 2xl:w-[52%] bg-[linear-gradient(270deg,#FAFAF2_0%,#FAFAF2_45%,rgba(250,250,242,0.95)_60%,rgba(250,250,242,0.6)_80%,rgba(250,250,242,0)_100%)]" />

				<div className="relative z-10 flex min-h-[100svh] w-full items-center pt-24 pb-12">
					<div className="mx-auto flex w-[calc(100%-32px)] max-w-[1246px] justify-end px-4 sm:px-6">
						<div className="w-full max-w-[472px] text-black">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black">
								<span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
								Hospitality & Accommodation
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[38px] font-bold leading-[1.2] tracking-[1.5px] text-black sm:text-[46px] md:text-[56px] md:leading-[70px]">
								OBC Guest House
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[15px] font-normal leading-[26px] tracking-[0.18px] text-black sm:text-[16px] md:text-[18px] md:leading-[29.25px]">
								Penginapan yang nyaman untuk melengkapi pengalaman menginap Anda di kawasan Ciumbuleuit, Bandung.
							</p>
						</div>
					</div>
				</div>

				
			</section>

			{/* Tentang + CTA */}
			<section className="mx-auto max-w-[1200px] gap-10 px-5 py-14 md:flex md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">Tentang OBC Guest House</h2>
					<p className="mt-4 max-w-[653px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0px] text-black">
						OBC Guest House berada di kawasan OBC, Ciumbuleuit, Bandung, dan menjadi salah satu pilihan tempat
						menginap bagi kamu yang ingin beristirahat dengan nyaman. Lokasinya berada dalam satu kawasan dengan
						berbagai fasilitas OBC, sehingga kamu bisa dengan mudah menikmati Food Court, Sport Center, maupun
						fasilitas lainnya selama menginap.
					</p>

					<div className="mt-8 flex flex-wrap items-center justify-center gap-12 border-t border-obc-border pt-6">
						<div className="flex items-center justify-center gap-2 text-center">
							<img src={roomIcon} alt="" width={20} height={14} aria-hidden="true" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">Kapasitas</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">{TOTAL_ROOMS} Rooms</p>
							</div>
						</div>
						<div className="flex items-center justify-center gap-2 text-center">
							<LogIn size={18} className="text-[#222022]" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">Check-in</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">14.00 WIB</p>
							</div>
						</div>
						<div className="flex items-center justify-center gap-2 text-center">
							<LogOut size={18} className="text-[#222022]" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">Check-out</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">12.00 WIB</p>
							</div>
						</div>
					</div>
				</div>

				<WhatsAppCard
					title="Tertarik menginap di OBC Guest House?"
					description="Hubungi kami untuk mendapatkan informasi lebih lanjut mengenai OBC Guest House"
					link={WHATSAPP_LINK}
				/>
			</section>

			{/* Pilihan Kamar */}
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					<div className="flex items-center justify-between">
						<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">Pilihan Kamar</h2>
						<span className="inline-flex items-center rounded-[4px] bg-[#D7D7D7B2] px-[12px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black">
							Total {TOTAL_ROOMS} Ruangan
						</span>
					</div>
					<p className="mt-1 font-['Montserrat'] text-[15px] font-normal leading-[24px] tracking-[0.15px] text-black">Unit kamar yang terkelola di OBC Guest House.</p>

					<div className="mt-8 flex flex-col divide-y divide-obc-border">
						{ROOM_TYPES.map((type) => (
							<div key={type.name} className="py-6 first:pt-0">
								<div className="flex items-center justify-between">
										<h3 className="flex items-center gap-2 font-['Montserrat'] text-[18px] font-semibold leading-[28.8px] tracking-[0.15px] text-black">
											<span className="h-[10px] w-[10px] rounded-full bg-[#9C9C9C]" />
											{type.name}
										</h3>
									<span className="inline-flex items-center rounded-[4px] bg-[#D7D7D7B2] px-[12px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black">
										{type.rooms.length} Kamar
									</span>
								</div>
										<p className="mt-3 font-['Montserrat'] text-[13px] font-normal leading-[19.5px] tracking-[0.26px] text-[#222222]">Daftar unit nomor kamar:</p>
								<div className="mt-3 flex flex-wrap gap-2">
									{type.rooms.map((room) => (
										<span
											key={room}
											className="inline-flex items-center rounded-[2px] bg-[#EEEEE7] px-[10px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[1.65px] text-black"
										>
											{room}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Fasilitas */}
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[1px] text-[#222022]">Fasilitas yang Ditawarkan</h2>
					<div className="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
						{FACILITIES.map((facility) => {
							return (
								<div key={facility.label} className="flex items-center gap-3">
									<img src={facility.icon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<span className="font-['Montserrat'] text-[14px] font-medium leading-[19.6px] tracking-[0.56px] text-[#222022]">{facility.label}</span>
								</div>
							)
						})}
					</div>
				</div>
			</section>

			{/* Galeri */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="text-center">
					<span className="font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-black">
						Galeri
					</span>
					<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
						Momen dari OBC Guest House
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
							aria-label={`Buka gambar Momen OBC Guest House ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Guest House ${index + 1}`}
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
					aria-label="Pratinjau gambar galeri Guest House"
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
						<img
							className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
							src={selectedGalleryImage}
							alt="Pratinjau galeri OBC Guest House"
						/>
					</div>
				</div>
			)}

			{/* Lokasi */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="h-[30px] w-full max-w-[318px] font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
							Lokasi OBC Guest House
						</h2>
						<p className="mt-1 h-[24px] w-full max-w-[845px] font-['Montserrat'] text-[15px] font-normal leading-[24px] tracking-[0.15px] text-black">
							Jl. Rancabentang 1 No. 10, Ciumbuleuit, Bandung, Jawa Barat 40142
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
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Guest House */}
					<iframe
						title="Lokasi OBC Guest House"
						src="https://www.google.com/maps?q=Jl.+Rancabentang+1+No.10,+Ciumbuleuit,+Bandung&output=embed"
						className="h-full w-full border-0"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>

			<UnitBisnis items={OTHER_UNITS} />

			<LandingFooter />
		</div>
	)
}

export default GuestHousePage