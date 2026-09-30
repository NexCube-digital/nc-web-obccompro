import { MapPin, ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/common/UnitBisnis'
import { WhatsAppCard } from '../../../components/common/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
import clockIcon from '../../../assets/icon/clock.svg'
import wifiIcon from '../../../assets/icon/wifi.svg'
import sittingAreaIcon from '../../../assets/icon/kursi22.svg'
import liveMusicIcon from '../../../assets/icon/musik.svg'
import movieIcon from '../../../assets/icon/televisi.svg'
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
import laundryThumb from '../../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import foodCourtThumb from '../../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import agribisnisThumb from '../../../assets/unit-bisnis/395bf2125ecb1a04ee7212871af8ece20326074d.jpg'

interface Facility {
	icon: string
	label: string
}

interface Equipment {
	number: string
	label: string
}

interface OtherUnit {
	slug: string
	category: string
	title: string
	image: string
}

const WHATSAPP_LINK = 'https://wa.me/6280000000000'
const GOOGLE_MAPS_LINK =
	'https://maps.google.com/?q=Area+OBC+Cafe+B2-B3+Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung'

const FACILITIES: Facility[] = [
	{ icon: wifiIcon, label: 'Free Wifi' },
	{ icon: sittingAreaIcon, label: 'Area Duduk' },
	{ icon: liveMusicIcon, label: 'Live Music' },
	{ icon: movieIcon, label: 'Nobar' },
]

// Peralatan ditampilkan sebagai badge nomor + label, tanpa ikon (mengikuti mockup)
const EQUIPMENT: Equipment[] = [
	{ number: '01', label: '1 Mesin Kopi' },
	{ number: '02', label: '2 Chiller' },
	{ number: '03', label: '2 Kulkas' },
	{ number: '04', label: '3 Mesin Grinder' },
	{ number: '05', label: '1 Soda Maker' },
	{ number: '06', label: '1 Dispenser' },
]

const GALLERY_IMAGES = [
	galleryImage1,
	galleryImage2,
	galleryImage3,
	galleryImage4,
	galleryImage5,
	galleryImage6,
	galleryImage7,
]

// Unit bisnis lain untuk section "Jelajahi Unit Bisnis OBC Group Lainnya" (coffee sengaja dikecualikan)
const OTHER_UNITS: OtherUnit[] = [
	{ slug: 'sport-center', category: 'Sport & Event Space', title: 'OBC Sports Center', image: sportCenterThumb },
	{ slug: 'guest-house', category: 'Hospitality & Accommodation', title: 'OBC Guest House', image: guestHouseThumb },
	{ slug: 'villa', category: 'Hospitality & Accommodation', title: 'OBC Villa', image: villaThumb },
	{ slug: 'laundry', category: 'Laundry Services', title: 'OBC Laundry', image: laundryThumb },
	{ slug: 'food-court', category: 'Food & Beverage', title: 'OBC Food Court', image: foodCourtThumb },
	{ slug: 'agribisnis', category: 'Agribisnis', title: 'OBC Agribisnis', image: agribisnisThumb },
]

function CoffeePage() {
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
				<img src={heroImage} alt="OBC Coffee" className="absolute inset-0 h-full w-full object-cover" />
				<div className="absolute inset-0 bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent" />
				<div className="absolute inset-y-0 right-0 h-full w-full sm:w-[92%] md:w-[72%] lg:w-[65%] xl:w-[58%] 2xl:w-[52%] bg-[linear-gradient(270deg,#FAFAF2_0%,#FAFAF2_45%,rgba(250,250,242,0.95)_60%,rgba(250,250,242,0.6)_80%,rgba(250,250,242,0)_100%)]" />

				<div className="relative z-10 flex min-h-[100svh] w-full items-center pt-24 pb-12">
					<div className="mx-auto flex w-[calc(100%-32px)] max-w-[1246px] justify-end px-4 sm:px-6">
						<div className="w-full max-w-[472px] text-black">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black">
								<span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
								Coffee & Lifestyle
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[38px] font-bold leading-[1.2] tracking-[1.5px] text-black sm:text-[46px] md:text-[56px] md:leading-[70px]">
								OBC Coffee
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[15px] font-normal leading-[26px] tracking-[0.18px] text-black sm:text-[16px] md:text-[18px] md:leading-[29.25px]">
								Nikmati pilihan kopi dan suasana nyaman di Ciumbuleuit. Baik untuk memulai hari, bertemu teman,
								menyelesaikan pekerjaan, maupun sekadar mengambil jeda, OBC Coffee siap menemani setiap momen Anda.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Tentang + CTA */}
			<section className="mx-auto max-w-[1200px] gap-10 px-5 py-14 md:flex md:px-8">
				<div className="max-w-[653px] md:w-2/3">
					<h2 className="font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Tentang OBC Coffee
					</h2>
					<p className="mt-4 max-w-[653px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0px] text-black">
						OBC Coffee merupakan bagian dari OBC Group yang berada di area OBC Cafe B2-B3. Dengan area duduk,
						free WiFi, live music, dan nobar, OBC Coffee dilengkapi berbagai fasilitas untuk menunjang aktivitas di
						dalamnya, mulai dari mesin kopi dan grinder hingga chiller, kulkas, soda maker, dan dispenser.
					</p>

					{/* Dua kartu info dengan shadow tipis */}
					<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[1.7fr_1fr]">
						<div className="flex items-center gap-3 rounded-lg bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
							<MapPin size={20} className="shrink-0 text-black" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black/70">
									Lokasi
								</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
									Area OBC Cafe B2–B3
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3 rounded-lg bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
							<img src={clockIcon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
							<div>
								<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black/70">
									Buka Setiap Hari
								</p>
								<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
									08.00 WIB - 22.00 WIB
								</p>
							</div>
						</div>
					</div>
				</div>

				<WhatsAppCard
					title="Temukan Mood yang Tepat untuk Harimu di OBC Coffee"
					description="Mau ngopi santai, bertemu teman, atau sekadar mencari tempat untuk beristirahat sejenak? OBC Coffee siap menemani."
					link={WHATSAPP_LINK}
				/>
			</section>

			{/* Fasilitas */}
			<section className="mx-auto max-w-[1200px] px-5 pb-14 md:px-8">
				<div className="max-w-[633px] md:w-2/3">
					{/* Garis pemisah tipis di atas section */}
					<div className="border-t border-black/[0.06] pt-8">
						<h2 className="flex h-[30px] items-center font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
							Fasilitas OBC Coffee
						</h2>
						<div className="mt-6 grid max-w-[630px] grid-cols-1 gap-4 sm:grid-cols-2">
							{FACILITIES.map((facility) => {
								return (
									<div
										key={facility.label}
										className="flex min-h-[82px] items-center gap-4 rounded-2xl border border-[#CFC4C54D] bg-[#F9F9F9] p-4"
									>
										<span className="flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
											<img src={facility.icon} alt="" className="h-[22px] w-[22px] object-contain" aria-hidden="true" />
										</span>
										<span className="font-['Montserrat'] text-[16px] font-semibold leading-[24px] tracking-[0.16px] text-black">
											{facility.label}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</section>

			{/* Peralatan */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="max-w-[633px] md:w-2/3">
					<h2 className="flex h-[30px] w-[619px] max-w-full items-center font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
						Peralatan OBC Coffee
					</h2>
					<div className="mt-8 grid max-w-[633px] grid-cols-1 gap-[10px] sm:grid-cols-2 md:grid-cols-3">
						{EQUIPMENT.map((equipment) => (
							<div
								key={equipment.number}
								className="flex h-[70px] items-center gap-[10px] rounded-2xl border border-[#CFC4C54D] bg-[#F9F9F9] p-[10px]"
							>
								<span className="flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-lg bg-white font-['Montserrat'] text-[12px] font-bold leading-[16px] text-black shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
									{equipment.number}
								</span>
								<span className="font-['Montserrat'] text-[14px] font-medium leading-[24px] tracking-[0px] text-black">
									{equipment.label}
								</span>
							</div>
						))}
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
						Momen dari OBC Coffee
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
							aria-label={`Buka gambar Momen OBC Coffee ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Coffee ${index + 1}`}
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
					aria-label="Pratinjau gambar galeri Coffee"
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
						<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC Coffee" />
					</div>
				</div>
			)}

			{/* Lokasi */}
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h2 className="h-[30px] w-full max-w-[318px] font-['Montserrat'] text-[25px] font-semibold leading-[100%] tracking-[0%] text-black">
							Lokasi OBC Coffee
						</h2>
						<p className="mt-1 h-[24px] w-full max-w-[845px] font-['Montserrat'] text-[15px] font-normal leading-[24px] tracking-[0.15px] text-black">
							Area OBC Cafe B2-B3 - Jl. Rancabentang 1 No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat
							40142
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
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Coffee */}
					<iframe
						title="Lokasi OBC Coffee"
						src="https://www.google.com/maps?q=Area+OBC+Cafe+B2-B3+Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung&output=embed"
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

export default CoffeePage