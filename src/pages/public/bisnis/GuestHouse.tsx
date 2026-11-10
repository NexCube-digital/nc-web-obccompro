import {
	LogIn,
	LogOut,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import LazySection from '../../../components/common/LazySectionHome'
import ScrollReveal from '../../../components/animation/ScrollReveal'
import { UnitBisnis } from '../../../components/ui/OtherUnitBisnis'
import { WhatsAppCard } from '../../../components/ui/WhatsAppCard'
import UnitLokasi from './UnitLokasi'
import UnitGallery from './UnitGallery'
import heroImage from '../../../assets/images/unit-bisnis/guesthouse.webp'
import roomIcon from '../../../assets/icon/kamar.svg'
import parkingIcon from '../../../assets/icon/parkir.svg'
import foodCourtIcon from '../../../assets/icon/sendokgarpu.svg'
import sportCenterIcon from '../../../assets/icon/barber.svg'
import sittingAreaIcon from '../../../assets/icon/area_duduk.svg'
import wifiIcon from '../../../assets/icon/wifi.svg'
import airConditioningIcon from '../../../assets/icon/ac.svg'
import televisionIcon from '../../../assets/icon/televisi.svg'
import galleryImage1 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas1.webp'
import galleryImage2 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas2.webp'
import galleryImage3 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas3.webp'
import galleryImage4 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas4.webp'
import galleryImage5 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas5.webp'
import galleryImage6 from '../../../assets/images/unit-bisnis/villa.webp'
import galleryImage7 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas7.webp'
import galleryImage8 from '../../../assets/images/unit-bisnis/fasilitas-guest/fas8.webp'

interface RoomType {
	name: string
	rooms: string[]
}

interface Facility {
	icon: string
	label: string
}

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

// Urutan disesuaikan dengan desain: Area Duduk Bersama di paling bawah
const FACILITIES: Facility[] = [
	{ icon: parkingIcon, label: 'Parking IoT' },
	{ icon: foodCourtIcon, label: 'Food Court' },
	{ icon: sportCenterIcon, label: 'Sport Center' },
	{ icon: wifiIcon, label: 'Free WiFi' },
	{ icon: airConditioningIcon, label: 'AC' },
	{ icon: televisionIcon, label: 'TV' },
	{ icon: sittingAreaIcon, label: 'Area Duduk Bersama' },
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

function GuestHousePage() {
	const { t } = useTranslation()

	return (
		// pb: ruang untuk bar WhatsApp fixed (tampil sampai < lg) supaya footer tidak tertutup
		<div className="min-h-screen bg-obc-ivory pb-[150px] lg:pb-0">
			<LandingNavbar />

			{/* Hero: mobile hanya foto (teks pindah ke bawah foto), md+ teks di atas foto.
			    Mobile 412px–767px: tinggi hero ditambah & posisi gambar digeser ke atas karena foto berukuran besar. */}
			<section
				id="guest-house-hero"
				className="hero-enter relative h-[360px] overflow-hidden min-[412px]:max-[767px]:h-[440px] md:h-svh md:min-h-svh"
			>
				<img
					src={heroImage}
					alt="Fasad OBC Guest House"
					className="hero-background-enter absolute inset-0 h-full w-full object-cover object-top min-[412px]:max-[499px]:object-[50%_35%] min-[500px]:max-[767px]:object-[50%_45%] md:object-center"
				/>

				{/* Overlay gelap tipis: hanya md+ */}
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />

				{/* Lengkungan kartu (mobile saja): strip ivory berradius di dasar foto.
				    Dibuat di dalam hero supaya tidak terpotong wrapper LazySection/ScrollReveal. */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-7 rounded-t-[28px] bg-obc-ivory md:hidden" />

				<div
					className="absolute right-0 top-0 hidden h-full w-[72%] max-w-[763.59px] md:block lg:w-[65%] xl:w-[58%] 2xl:w-[52%]"
					style={{
						opacity: 1,
						background:
							'linear-gradient(270deg, #FAFAF2 0%, rgba(250, 250, 242, 0.9) 40.87%, rgba(250, 250, 242, 0.592749) 65.38%, rgba(250, 250, 242, 0) 90.87%)',
					}}
				/>

				{/* Teks hero: md+, container rata kanan */}
				<div className="hero-content-enter relative z-10 hidden min-h-[100svh] w-full items-center pb-12 pt-24 md:flex">
					<div className="mx-auto flex w-full max-w-[1246px] justify-end px-8 md:px-10">
						<div className="w-full max-w-[472px] text-black md:max-w-[340px] lg:max-w-[420px] xl:max-w-[472px]">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black lg:text-[14px]">
								<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#000000]" />
								{t('units.guestHouse.category')}
							</span>
							<h1 className="mt-5 font-['Montserrat'] text-[40px] font-bold leading-[52px] tracking-[1.5px] text-black lg:text-[48px] lg:leading-[60px] xl:text-[56px] xl:leading-[70px]">
								{t('units.guestHouse.title')}
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.18px] text-black lg:text-[18px] lg:leading-[29.25px]">
								{t('units.guestHouse.desc')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<LazySection minHeight={1400}>
			<ScrollReveal>
			<div className="mx-auto max-w-[1200px] md:px-8 lg:flex lg:items-stretch lg:gap-10">
				{/* Kolom kiri */}
				<div className="min-w-0 lg:w-2/3">
					<section className="relative z-10 bg-obc-ivory px-5 pb-10 pt-4 min-[400px]:px-[30px] md:bg-transparent md:px-0 md:py-14">
						<div className="flex flex-col">
							{/* Judul: hanya mobile */}
							<h1 className="order-1 text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] text-black md:hidden">
								{t('units.guestHouse.title')}
							</h1>

							{/* Info singkat */}
							<div className="order-2 mb-8 mt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-3 min-[400px]:flex-nowrap md:order-3 md:mb-0 md:mt-8 md:grid md:max-w-[653px] md:grid-cols-3 md:gap-x-6 md:border-t md:border-obc-border md:pt-6 lg:gap-x-8">
								<div className="flex items-center gap-2 text-left">
									<img src={roomIcon} alt="" width={20} height={14} aria-hidden="true" />
									<div>
										<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15.4px] tracking-[1px] text-[#41493D] md:text-[11px] md:tracking-[1.65px]">{t('common.capacity')}</p>
										<p className="font-['Montserrat'] text-[13px] font-semibold leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">{t('units.guestHouse.totalRooms', { count: TOTAL_ROOMS })}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 text-left">
									<LogIn size={18} className="text-[#222022]" />
									<div>
										<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15.4px] tracking-[1px] text-[#41493D] md:text-[11px] md:tracking-[1.65px]">{t('common.checkIn')}</p>
										<p className="font-['Montserrat'] text-[13px] font-semibold leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">14.00 WIB</p>
									</div>
								</div>
								<div className="flex items-center gap-2 text-left">
									<LogOut size={18} className="text-[#222022]" />
									<div>
										<p className="font-['Montserrat'] text-[10px] font-semibold uppercase leading-[15.4px] tracking-[1px] text-[#41493D] md:text-[11px] md:tracking-[1.65px]">{t('common.checkOut')}</p>
										<p className="font-['Montserrat'] text-[13px] font-semibold leading-[19.6px] tracking-[0.3px] text-[#222022] md:text-[14px] md:tracking-[0.56px]">12.00 WIB</p>
									</div>
								</div>
							</div>

							<h2 className="order-3 font-['Montserrat'] text-[18px] font-semibold leading-[100%] tracking-[0%] text-black md:order-1 md:text-[25px]">{t('units.guestHouse.aboutTitle')}</h2>
							<p className="order-4 mt-3 max-w-[653px] text-justify font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
								{t('units.guestHouse.aboutText')}
							</p>
						</div>
					</section>

					{/* Pilihan Kamar */}
					<section className="px-5 pb-14 md:px-0">
						<div>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">{t('units.guestHouse.roomsTitle')}</h2>
								<span className="inline-flex items-center rounded-[4px] bg-[#D7D7D7B2] px-[12px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black">
									{t('units.guestHouse.totalRooms', { count: TOTAL_ROOMS })}
								</span>
							</div>
							<p className="mt-1 font-['Montserrat'] text-[16px] font-normal leading-[24px] tracking-[0.15px] text-black md:text-[15px]">{t('units.guestHouse.roomsDesc')}</p>

							<div className="mt-6 flex flex-col gap-8 md:mt-8 md:gap-0 md:divide-y md:divide-obc-border">
								{ROOM_TYPES.map((type) => {
									const isCompact = type.rooms.every((room) => room.length <= 8)
									return (
										<div key={type.name} className="md:py-6 md:first:pt-0">
											<div className="flex flex-wrap items-center justify-between gap-2">
												<h3 className="flex items-center gap-2 font-['Montserrat'] text-[18px] font-semibold uppercase leading-[28.8px] tracking-[0.15px] text-black md:normal-case">
													<span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#9C9C9C]" />
													{type.name}
												</h3>
												<span className="inline-flex items-center rounded-[4px] bg-[#D7D7D7B2] px-[12px] pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-black">
													{t('units.guestHouse.roomsCount', { count: type.rooms.length })}
												</span>
											</div>
											<p className="mt-3 hidden font-['Montserrat'] text-[13px] font-normal leading-[19.5px] tracking-[0.26px] text-[#222222] md:block">{t('units.guestHouse.roomList')}</p>
											<div
												className={`mt-4 gap-2 md:mt-3 ${
													isCompact
														? 'grid grid-cols-2 min-[360px]:grid-cols-4 md:flex md:flex-wrap'
														: 'flex flex-wrap'
												}`}
											>
												{type.rooms.map((room) => (
													<span
														key={room}
														className="inline-flex items-center justify-center rounded-[2px] bg-[#EEEEE7] px-1 pb-[4.39px] pt-[3px] font-['Montserrat'] text-[11px] font-medium leading-[15.4px] tracking-[0.8px] whitespace-nowrap text-black md:justify-start md:px-[10px] md:tracking-[1.65px]"
													>
														{room}
													</span>
												))}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</section>

					{/* Fasilitas */}
					<section className="px-5 pb-14 min-[400px]:px-[30px] md:px-0">
						<div>
							<h2 className="font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-normal text-[#222022] md:tracking-[1px]">{t('units.guestHouse.facilitiesTitle')}</h2>
							<div className="mt-7 grid grid-cols-1 gap-y-5 sm:grid-cols-2 md:mt-6 md:gap-y-4">
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
				</div>

				<aside className="hidden lg:block lg:w-1/3 lg:pt-14">
					<div className="sticky top-24 mb-12">
						<WhatsAppCard
							tenantSlug="guest-house"
							className="lg:!w-full"
							title={t('units.guestHouse.whatsappCardTitle')}
							description={t('units.guestHouse.whatsappCardDesc')}
						/>
					</div>
				</aside>
			</div>
			</ScrollReveal>
			</LazySection>

			<UnitGallery
				images={GALLERY_IMAGES}
				unitName="OBC Guest House"
				badge={t('units.guestHouse.galleryBadge')}
				title={t('units.guestHouse.galleryTitle')}
				variant="guest-house"
			/>

			<UnitLokasi
				title={t('units.guestHouse.locationTitle')}
				address={t('units.guestHouse.locationAddress')}
				mapLabel="OBC Guest House"
				latitude={-6.874237184358439}
				longitude={107.60757312883369}
			/>

			<LazySection minHeight={600}>
			<ScrollReveal>
			<UnitBisnis excludeSlug="guest-house" />
			</ScrollReveal>
			</LazySection>

			<LandingFooter />

			{/* Card WhatsApp */}
			<div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/95 px-4 pb-4 pt-3 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
				<div className="mx-auto w-full max-w-[720px]">
					<WhatsAppCard
						tenantSlug="guest-house"
						variant="bar"
						title={t('units.guestHouse.whatsappCardTitle')}
						description={t('units.guestHouse.whatsappCardDesc')}
					/>
				</div>
			</div>
		</div>
	)
}

export default GuestHousePage