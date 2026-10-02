import { MapPin, ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
				<img src={heroImage} alt="OBC Coffee" className="absolute inset-0 h-full w-full object-cover object-top md:object-center" />
				{/* Overlay: hanya md+. Lebar bertahap mengikuti breakpoint */}
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />
				<div className="absolute inset-y-0 right-0 hidden h-full md:block md:w-[72%] lg:w-[65%] xl:w-[58%] 2xl:w-[52%] bg-[linear-gradient(270deg,#FAFAF2_0%,#FAFAF2_45%,rgba(250,250,242,0.95)_60%,rgba(250,250,242,0.6)_80%,rgba(250,250,242,0)_100%)]" />

				{/* Teks hero: md+, container max-w 1246px, rata kanan */}
				<div className="relative z-10 hidden min-h-[100svh] w-full items-center pb-12 pt-24 md:flex">
					<div className="mx-auto flex w-full max-w-[1246px] justify-end px-8 md:px-10">
						<div className="w-full max-w-[472px] text-black md:max-w-[380px] lg:max-w-[440px] xl:max-w-[472px]">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black lg:text-[14px]">
								<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#000000]" />
								{t('units.coffee.category')}
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[40px] font-bold leading-[52px] tracking-[1.5px] text-black lg:text-[48px] lg:leading-[60px] xl:text-[56px] xl:leading-[70px]">
								{t('units.coffee.title')}
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.18px] text-black lg:text-[18px] lg:leading-[29.25px]">
								{t('units.coffee.desc')}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/*
				Wrapper dua kolom (Tentang + Fasilitas + Peralatan) — dua kolom baru mulai lg (>=1024px).
				Di bawah lg: satu kolom penuh, WhatsApp card memakai bar fixed di bawah layar.
				Kolom kanan berisi WhatsApp card yang sticky; card berhenti di ujung wrapper ini,
				yaitu tepat sebelum Galeri (lebar penuh).
				CATATAN: jangan beri overflow-hidden/overflow-auto pada elemen induk wrapper ini,
				karena akan mematikan position: sticky.
			*/}
			<div className="mx-auto max-w-[1200px] md:px-8 lg:flex lg:items-stretch lg:gap-10">
				{/* Kolom kiri */}
				<div className="min-w-0 lg:w-2/3">
					{/* Tentang */}
					<section className="relative z-10 -mt-7 rounded-t-[28px] bg-obc-ivory px-5 pb-10 pt-8 min-[400px]:px-[30px] md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:py-14">
						<div className="flex flex-col">
							<h1 className="order-1 text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] text-black md:hidden">
								{t('units.coffee.title')}
							</h1>
							<div className="order-2 mb-8 mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1.7fr_1fr] md:order-3 md:mb-0 md:mt-8 md:flex md:flex-wrap md:items-center md:gap-x-6 md:gap-y-4 md:border-t md:border-obc-border md:pt-6 lg:gap-x-12">
								<div className="flex min-w-0 items-center gap-3 rounded-lg bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
									<MapPin size={20} className="shrink-0 text-black" />
									<div>
										<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black/70">Lokasi</p>
										<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">Area OBC Cafe B2–B3</p>
									</div>
								</div>
								<div className="flex min-w-0 items-center gap-3 rounded-lg bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
									<img src={clockIcon} alt="" className="h-5 w-5 shrink-0 object-contain" aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black/70">{t('common.everyday')}</p>
										<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022]">08.00 WIB - 22.00 WIB</p>
									</div>
								</div>
							</div>

							<h2 className="order-3 mt-8 font-['Montserrat'] text-[18px] font-semibold leading-[100%] tracking-[0%] text-black md:order-1 md:mt-0 md:text-[25px]">
								{t('units.coffee.aboutTitle')}
							</h2>
							<p className="order-4 mt-3 max-w-[653px] text-justify font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
								{t('units.coffee.aboutText')}
							</p>
						</div>
					</section>

					{/* Fasilitas */}
					<section className="px-5 pb-14 min-[400px]:px-[30px] sm:px-5 md:px-0">
						<div className="max-w-[633px]">
							{/* Garis pemisah tipis di atas section */}
							<div className="border-t border-black/[0.06] pt-8">
								<h2 className="flex h-auto items-center px-2.5 font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:px-0 sm:text-[25px]">
									{t('common.facilities')} {t('units.coffee.title')}
								</h2>
								{/* 1 kolom (<360px), 2 kolom mulai 360px */}
								<div className="mt-4 grid max-w-[630px] grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:mt-6">
									{FACILITIES.map((facility) => {
										return (
											<div
												key={facility.label}
												className="flex min-h-[60px] min-w-0 items-center gap-[10px] rounded-xl border border-[#CFC4C54D] bg-[#F9F9F9] p-[10px] sm:min-h-[82px] sm:gap-4 sm:rounded-2xl sm:p-4"
											>
												<span className="flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
													<img src={facility.icon} alt="" className="h-[22px] w-[22px] object-contain" aria-hidden="true" />
												</span>
												<span className="font-['Montserrat'] text-[15px] font-medium leading-[24px] tracking-[0.16px] text-black sm:whitespace-nowrap sm:text-[16px] sm:font-semibold">
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
					<section className="px-5 pb-16 min-[400px]:px-[19px] sm:px-5 md:px-0">
						<div className="max-w-[633px]">
							<h2 className="flex h-auto w-[619px] max-w-full items-center font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:text-[25px]">
								Peralatan OBC Coffee
							</h2>
							{/* 1 kolom (<360px), 2 kolom (360-479px), 3 kolom mulai 480px */}
							<div className="mt-8 grid max-w-[633px] grid-cols-1 gap-[10px] min-[360px]:grid-cols-2 min-[480px]:grid-cols-3">
								{EQUIPMENT.map((equipment) => (
									<div
										key={equipment.number}
										className="flex min-h-[50px] min-w-0 items-center gap-[10px] rounded-xl border border-[#CFC4C54D] bg-[#F9F9F9] p-[10px] sm:min-h-[70px] sm:rounded-2xl"
									>
										{/* Badge angka hanya di sm ke atas; di mobile angka menyatu dengan teks */}
										<span className="hidden h-[47px] w-[47px] shrink-0 items-center justify-center rounded-lg bg-white font-['Montserrat'] text-[12px] font-bold leading-[16px] text-black shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:flex">
											{equipment.number}
										</span>
										<span className="font-['Montserrat'] text-[14px] font-medium leading-[20px] tracking-[0px] text-black sm:whitespace-nowrap sm:leading-[24px]">
											<span className="sm:hidden">{equipment.number} </span>
											{equipment.label}
										</span>
									</div>
								))}
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
							title={t('units.coffee.whatsappCardTitle')}
							description={t('units.coffee.whatsappCardDesc')}
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
						{t('gallerySection.momentsFrom', { unit: t('units.coffee.title') })}
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
										aria-label={t('common.close')}
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
			<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
				<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
					<div className="order-1 md:order-none">
						<h2 className="h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:h-auto md:max-w-none md:text-[25px]">
							{t('common.locationOf', { unit: t('units.coffee.title') })}
						</h2>
						<p className="mt-3 h-auto w-full max-w-[845px] font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.15px] text-black md:mt-1 md:h-auto md:text-[15px]">
							Area OBC Cafe B2-B3 - Jl. Rancabentang 1 No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat
							40142
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
					{/* Ganti src di bawah dengan embed link Google Maps resmi OBC Coffee */}
					<iframe
						title={t('common.locationOf', { unit: t('units.coffee.title') })}
						src="https://www.google.com/maps?q=Area+OBC+Cafe+B2-B3+Jl.+Rancabentang+1+No.12,+Ciumbuleuit,+Kec.+Cidadap,+Kota+Bandung&output=embed"
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
						title={t('units.coffee.whatsappCardTitle')}
						description={t('units.coffee.whatsappCardDesc')}
						link={WHATSAPP_LINK}
					/>
				</div>
			</div>
		</div>
	)
}

export default CoffeePage