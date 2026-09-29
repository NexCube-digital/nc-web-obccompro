import { MapPin, LayoutGrid, ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import { UnitBisnis } from '../../../components/common/UnitBisnis'
import { WhatsAppCard } from '../../../components/common/WhatsAppCard'
import heroImage from '../../../assets/unit-bisnis/guest-house/12d1c85d7f0fe13573efb94223e873dfd22cbee5.png'
import agricultureIcon from '../../../assets/icon/iconstack.io - (Agriculture Analytics).svg'
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
import foodCourtThumb from '../../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import coffeeThumb from '../../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'

interface Area {
	name: string
	location: string
	size: number
}

interface OtherUnit {
	slug: string
	category: string
	title: string
	image: string
}

const WHATSAPP_LINK = 'https://wa.me/6280000000000'
const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Jl.+Tugulaksana,+Lembang,+Kabupaten+Bandung+Barat'

// Tiga area/plot lahan OBC Agribisnis — alamat & luas mengikuti desain
const AREAS: Area[] = [
	{ name: 'Tugu 1', size: 1000, location: 'Jl. Tugu Laksana No. 1, Wangunsari, Lembang' },
	{ name: 'Tugu 2', size: 1600, location: 'Jl. Tugu Laksana, Wangunsari, Lembang' },
	{ name: 'Tugu 3', size: 2000, location: 'Jl. Tugu Laksana, Wangunsari, Lembang' },
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

// Unit bisnis lain untuk section "Jelajahi Unit Bisnis OBC Group Lainnya" (agribisnis sengaja dikecualikan)
const OTHER_UNITS: OtherUnit[] = [
	{ slug: 'sport-center', category: 'Sport & Event Space', title: 'OBC Sports Center', image: sportCenterThumb },
	{ slug: 'guest-house', category: 'Hospitality & Accommodation', title: 'OBC Guest House', image: guestHouseThumb },
	{ slug: 'villa', category: 'Hospitality & Accommodation', title: 'OBC Villa', image: villaThumb },
	{ slug: 'laundry', category: 'Laundry Services', title: 'OBC Laundry', image: laundryThumb },
	{ slug: 'food-court', category: 'Food & Beverage', title: 'OBC Food Court', image: foodCourtThumb },
	{ slug: 'coffee', category: 'Coffee & Lifestyle', title: 'OBC Coffee', image: coffeeThumb },
]

function AgribisnisPage() {
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
			<section className="relative h-[360px] overflow-hidden md:h-auto md:min-h-[100svh]">
				<img src={heroImage} alt="OBC Agribisnis" className="absolute inset-0 h-full w-full object-cover object-top md:object-center" />
				<div className="absolute inset-y-0 right-0 hidden w-[92%] bg-[linear-gradient(90deg,rgba(250,250,242,0)_0%,rgba(250,250,242,0.6)_18%,rgba(250,250,242,0.9)_52.98%,rgba(250,250,242,0.592749)_73.8%,#FAFAF2_100%)] md:block md:w-[58%]" />
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />

				<div className="relative hidden min-h-[100svh] items-center justify-end px-4 py-24 sm:px-6 md:flex md:px-8">
					<div className="w-full max-w-[472px] text-black md:mr-6">
						<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black">
							<span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
							Agribusiness
						</span>
						<h1 className="mt-5 max-w-[400px] font-['Montserrat'] text-[56px] font-bold leading-[70px] tracking-[1.5px] text-black">
							OBC Agribisnis
						</h1>
						<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[18px] font-medium leading-[29.25px] tracking-[0.18px] text-black">
							OBC Agrobisnis terdiri dari tiga area yang berada di kawasan Wangunsari, Lembang, yaitu Tugu 1, Tugu
							2, dan Tugu 3. Setiap area memiliki lokasi dan luas yang berbeda, mulai dari 1.000 m² hingga 2.000
							m².
						</p>
					</div>
				</div>
			</section>

			{/* Tentang + CTA */}
			<section className="relative z-10 mx-auto -mt-7 max-w-[1200px] rounded-t-[28px] bg-obc-ivory px-[30px] pb-10 pt-8 md:mt-0 md:flex md:gap-10 md:rounded-none md:bg-transparent md:px-8 md:py-14">
				<div className="flex max-w-[653px] flex-col md:w-2/3">
					<h1 className="order-1 text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] text-black md:hidden">
						OBC Agribisnis
					</h1>
					<div className="order-2 mb-8 mt-4 grid grid-cols-2 gap-[15px] py-2 sm:grid-cols-3 md:order-3 md:mb-0 md:mt-8">
						{AREAS.map((area) => (
							<div
								key={area.name}
								className="flex items-center gap-3 rounded-lg bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
							>
								<img src={agricultureIcon} alt="" className="h-[22px] w-[22px] shrink-0 object-contain" aria-hidden="true" />
								<div className="min-w-0">
									<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
										{area.name}
									</p>
									<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">
										Luas area : {area.size} m²
									</p>
								</div>
							</div>
						))}
					</div>

					<h2 className="order-3 mt-2 flex items-center font-['Montserrat'] text-[18px] font-semibold leading-[100%] tracking-[0%] text-black md:order-1 md:mt-0 md:h-[30px] md:text-[25px]">
						Tentang OBC Agribisnis
					</h2>
					<p className="order-4 mt-3 max-w-[653px] text-justify font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
						OBC Agribisnis merupakan salah satu unit bisnis OBC Group yang hadir untuk mengembangkan potensi
						agribisnis sekaligus menghadirkan ruang yang dekat dengan alam. Berada di kawasan yang asri, OBC
						Agribisnis menjadi bagian dari perjalanan OBC Group dalam menciptakan peluang dan pengalaman baru.
					</p>
				</div>

				<WhatsAppCard
					className="hidden md:block"
					title="Mari Terhubung dan Mengenal OBC Agribisnis Lebih Dekat"
					description="Ingin tahu lebih banyak tentang OBC Agribisnis atau berkunjung langsung? Hubungi kami untuk mendapatkan informasi selengkapnya."
					link={WHATSAPP_LINK}
				/>
			</section>

			{/* Area OBC Agribisnis */}
			<section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-5 md:px-8">
				<div className="md:w-2/3">
					{/* Garis pemisah tipis di atas & bawah section, sesuai desain */}
					<div className="border-y border-black/[0.06] py-8">
						{/* Badge + judul: mobile menjorok 17px dari tepi kartu, sm ke atas 26px */}
						<div className="pl-[17px] sm:pl-[26px]">
							<span className="inline-flex h-5 items-center gap-1 rounded-full bg-[#F3F3F3] px-4 py-1 font-['Montserrat'] text-[10px] font-medium uppercase leading-[14px] tracking-[0px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:h-[22px] sm:w-[210px] sm:text-[11px] sm:font-semibold sm:tracking-[0.55px]">
								<LayoutGrid size={12} className="shrink-0 text-black" />
								Kawasan & Plot Lahan
							</span>
							<h2 className="mt-1 flex h-[30px] w-[260px] items-center font-['Montserrat'] text-[20px] font-semibold uppercase leading-[100%] tracking-[0%] text-black sm:mt-4 sm:text-[25px] sm:normal-case">
								Area OBC Agribisnis
							</h2>
						</div>

						{/* Mobile: kartu full width tanpa padding tambahan, jarak antar kartu 20px */}
						<div className="mt-[30px] flex max-w-[630px] flex-col gap-5 px-0 sm:mt-8 sm:gap-8 sm:px-4">
							{AREAS.map((area) => (
								<div
									key={area.name}
									className="h-auto min-h-[256px] w-full max-w-[598px] rounded-xl border border-[#0000004D] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)] md:h-[256px]"
								>
									<h3 className="flex h-[22px] items-center font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:h-[30px] sm:text-[25px]">
										{area.name}
									</h3>

									<p className="mt-7 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[14px] tracking-[0.55px] text-[#727973] sm:mt-6 sm:text-[11px]">
										Lokasi
									</p>
									<p className="mt-2.5 flex items-center gap-1 font-['Montserrat'] text-[13px] font-medium leading-[20.63px] tracking-[0px] text-[#1A1C19] sm:mt-1 sm:gap-1.5 sm:text-[15px]">
										{/* Pin di desain berwarna hitam solid */}
										<MapPin
											size={15}
											fill="currentColor"
											className="h-[14px] w-[14px] shrink-0 text-[#1A1C19] sm:h-[15px] sm:w-[15px] [&_circle]:fill-white"
										/>
										{area.location}
									</p>

									<div className="mt-5 flex h-[100px] flex-col justify-start gap-3 rounded-lg bg-[#F3F3F3] p-4 sm:h-[91px] sm:justify-center sm:gap-1">
										<p className="font-['Montserrat'] text-[18px] font-semibold uppercase leading-6 tracking-[0px] text-black sm:text-[11px] sm:leading-[14px] sm:tracking-[0.55px]">
											Luas Area
										</p>
										<p className="font-['Montserrat'] text-[20px] font-semibold leading-6 tracking-[0%] text-black sm:text-[25px] sm:leading-[100%]">
											{area.size} <span className="text-[20px] sm:text-[24px]">m²</span>
										</p>
									</div>
								</div>
							))}
						</div>
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
						Momen dari OBC Agribisnis
					</h2>
					<div className="mx-auto mt-3 h-[2px] w-[396px] rounded-[2px] bg-[#0000004D]" />
				</div>

				<div className="mt-6 grid grid-cols-2 gap-[10px] md:mt-8 md:grid-cols-4 md:gap-3">
					{GALLERY_IMAGES.slice(0, 8).map((image, index) => (
						<button
							key={index}
							type="button"
							onClick={() => setSelectedGalleryImage(image)}
							className={`group aspect-[4/3] w-full overflow-hidden rounded-[20px] md:aspect-auto md:h-[296px] md:w-[280px] md:rounded-xl ${
								index >= 4 ? 'hidden md:block' : ''
							}`}
							aria-label={`Buka gambar Momen OBC Agribisnis ${index + 1}`}
						>
							<img
								src={image}
								alt={`Momen OBC Agribisnis ${index + 1}`}
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
					aria-label="Pratinjau gambar galeri Agribisnis"
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
						<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC Agribisnis" />
					</div>
				</div>
			)}

			{/* Lokasi */}
			<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
				<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
					<div className="order-1 md:order-none">
						<h2 className="h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:h-[30px] md:max-w-[318px] md:text-[25px]">
							Lokasi OBC Agribisnis
						</h2>
						<p className="mt-3 h-auto w-full max-w-[845px] font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.15px] text-black md:mt-1 md:h-[24px] md:text-[15px]">
							Jl. Tugulaksana, Lembang, Kabupaten Bandung Barat
						</p>
					</div>
					<a
						href={GOOGLE_MAPS_LINK}
						target="_blank"
						rel="noreferrer"
						className="order-3 mt-4 inline-flex h-[40px] w-full items-center justify-center gap-[8px] rounded-full bg-[#E9E9E9] px-[20px] py-[12px] font-['Montserrat'] text-[16px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022] hover:bg-[#E1E1E1] md:order-none md:mt-0 md:h-[32px] md:w-[229px] md:text-[14px]"
					>
						<ExternalLink className="h-[16px] w-[16px] text-[#222022] md:h-[13.5px] md:w-[13.5px]" />
						Buka di Google Maps
					</a>
				</div>

				<div className="order-2 mt-4 h-[300px] overflow-hidden rounded-[24px] border border-obc-border md:order-none md:mt-6 md:h-[420px] md:rounded-2xl">
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Agribisnis */}
					<iframe
						title="Lokasi OBC Agribisnis"
						src="https://www.google.com/maps?q=Jl.+Tugulaksana,+Lembang,+Kabupaten+Bandung+Barat&output=embed"
						className="h-full w-full border-0"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>

			<UnitBisnis items={OTHER_UNITS} />

			<LandingFooter />

			<div className="px-4 pb-8 pt-8 md:hidden">
				<WhatsAppCard
					className="!mt-0"
					title="Mari Terhubung dan Mengenal OBC Agribisnis Lebih Dekat"
					description="Ingin tahu lebih banyak tentang OBC Agribisnis atau berkunjung langsung? Hubungi kami untuk mendapatkan informasi selengkapnya."
					link={WHATSAPP_LINK}
				/>
			</div>
		</div>
	)
}

export default AgribisnisPage