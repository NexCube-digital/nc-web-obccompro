import {
	LogIn,
	LogOut,
	ExternalLink,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/common/UnitBisnis'
import { WhatsAppCard } from '../../../components/common/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
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
				<img src={heroImage} alt="OBC Villa" className="absolute inset-0 h-full w-full object-cover" />
				<div className="absolute inset-y-0 left-0 w-[92%] bg-[linear-gradient(90deg,#FAFAF2_0%,rgba(250,250,242,0.94)_26%,rgba(250,250,242,0.7)_52%,rgba(250,250,242,0.2)_72%,rgba(250,250,242,0)_100%)] md:w-[58%]" />
				<div className="absolute inset-0 bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent" />

				

				<div className="relative flex min-h-[100svh] items-center justify-start px-4 py-24 sm:px-6 md:px-8">
					<div className="w-full max-w-[472px] text-black md:ml-6">
						<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black">
							<span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
							Hospitality & Accommodation
						</span>
						<h1 className="mt-5 max-w-[400px] font-['Montserrat'] text-[56px] font-bold leading-[70px] tracking-[1.5px] text-black">
							OBC Villa
						</h1>
						<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[18px] font-medium leading-[29.25px] tracking-[0.18px] text-black">
							Nikmati kenyamanan dan ketenangan dalam pengalaman menginap di OBC Villa, dengan suasana asri yang
							memberikan ruang untuk beristirahat, menikmati waktu bersama, dan menciptakan momen berkesan di
							Ciumbuleuit, Bandung.
						</p>
						<p className="mt-4 font-['Montserrat'] text-[13px] font-medium leading-[18px] tracking-[0.52px] text-black">
							{QUICK_FACTS.join(' · ')}
						</p>
					</div>
				</div>
			</section>

			{/* Tentang + CTA */}
			<section className="mx-auto max-w-[1200px] gap-10 px-5 py-14 md:flex md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Tentang OBC Villa
					</h2>
					<p className="mt-4 max-w-[653px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0px] text-black">
						Nikmati waktu bersama keluarga atau teman di OBC Villa, dengan ruang yang dirancang untuk beristirahat
						sekaligus berkumpul dengan nyaman. Tersedia tiga kamar tidur, tiga kamar mandi, ruang keluarga, dan dua
						ruang santai, serta taman dan balkon untuk menikmati waktu bersama. OBC Villa juga dilengkapi kitchen
						dengan kulkas, kompor, dan microwave, ditambah AC, TV, serta free WiFi untuk menunjang kebutuhan
						selama menginap.
					</p>

					<div className="mt-8 flex flex-wrap items-center justify-center gap-12 border-t border-obc-border pt-6">
						<div className="flex items-center justify-center gap-2 text-center">
							<img src={roomIcon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
									Kapasitas
								</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
									3 Kamar Tidur
								</p>
							</div>
						</div>
						<div className="flex items-center justify-center gap-2 text-center">
							<LogIn size={18} className="text-[#222022]" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
									Check-in
								</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
									14.00 WIB
								</p>
							</div>
						</div>
						<div className="flex items-center justify-center gap-2 text-center">
							<LogOut size={18} className="text-[#222022]" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
									Check-out
								</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
									12.00 WIB
								</p>
							</div>
						</div>
					</div>
				</div>

				<WhatsAppCard
					title="Tertarik menginap di OBC Villa?"
					description="Hubungi kami untuk mendapatkan informasi lebih lanjut mengenai OBC Villa"
					link={WHATSAPP_LINK}
				/>
			</section>

			{/* Fasilitas */}
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="md:w-2/3">
					<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[1px] text-[#222022]">
						Fasilitas yang Ditawarkan
					</h2>
					<div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
						{FACILITIES.map((facility) => {
							return (
								<div key={facility.label} className="flex items-center gap-3">
									<img src={facility.icon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<span className="font-['Montserrat'] text-[14px] font-medium leading-[19.6px] tracking-[0.56px] text-[#222022]">
										{facility.label}
									</span>
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
						Momen dari OBC Villa
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
						aria-label="Tutup gambar"
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
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="h-[30px] w-full max-w-[318px] font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
							Lokasi OBC Villa
						</h2>
						<p className="mt-1 h-[24px] w-full max-w-[845px] font-['Montserrat'] text-[15px] font-normal leading-[24px] tracking-[0.15px] text-black">
							Jl. Rancabentang 1 No.10, Kec. Cidadap, Kota Bandung, Jawa Barat 40142
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
		</div>
	)
}

export default VillaPage