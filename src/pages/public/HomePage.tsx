import { useEffect, useState } from 'react'
import {
	ArrowRight,
	ArrowUpRight,
	BadgeCheck,
	Calendar,
	Check,
	ChevronLeft,
	ChevronRight,
	Heart,
	Play,
	Plus,
	Minus,
	Quote,
	Star,
	X,
} from 'lucide-react'
import LandingFooter from '../../components/layouts/LandingFooter'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import { WhatsAppLogo } from '../../components/common/WhatsAppIcon'
import medalIcon from '../../assets/icon/iconstack.io - (Medal Ribbons Star).svg'
import rosetteIcon from '../../assets/icon/iconstack.io - (Rosette Discount Check).svg'
import targetArrowIcon from '../../assets/icon/iconstack.io - (Target Arrow).svg'
import volleyballIcon from '../../assets/icon/iconstack.io - (Volleyball 2).svg'
import basketballIcon from '../../assets/icon/iconstack.io - (Ic Fluent Sport Basketball 24 Filled).svg'
import footballIcon from '../../assets/icon/iconstack.io - (Play Football).svg'
import tennisRacketIcon from '../../assets/icon/iconstack.io - (Tennis Racket).svg'
import billiardIcon from '../../assets/icon/iconstack.io - (Billiard 02).svg'
import bowlingBallIcon from '../../assets/icon/iconstack.io - (Bowling Ball Fill).svg'
import baseballCapIcon from '../../assets/icon/iconstack.io - (Baseball Cap Fill).svg'
import reviewIcon from '../../assets/icon/iconstack.io - (Pen New Square).svg'
import locationIcon from '../../assets/icon/iconstack.io - (Location 05).svg'
import locationArrowIcon from '../../assets/icon/iconstack.io - (Square Rounded Arrow Right).svg'

// Layanan & Fasilitas Images
import lapangF1Image from '../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../assets/layanan/Lapang F2.png'
import member from '../../assets/bfe838718c7f801119930d28d3d286f12b853b5e.jpg'
import billiardImage from '../../assets/layanan/Meja Billiard.png'
import academyTeamImage from '../../assets/layanan/OBC ACADEMY/sae-375.JPEG'
import academyRedImage from '../../assets/layanan/OBC ACADEMY/sae-371.JPEG'
import guestHouseGalleryImage from '../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import coffeeGalleryImage from '../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import foodCourtGalleryImage from '../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import laundryGalleryImage from '../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import sportsCenterGalleryImage from '../../assets/unit-bisnis/4086acc6319c22edd57799828a517da01ea58de7.png'

// Unit Bisnis Logos
import sportCenterLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER.png'
import guestHouseLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import villaLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (3).png'
import laundryLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (4).png'
import foodCourtLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (5).png'
import coffeeLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (6).png'
import agribusinessLogo from '../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (7).png'
import promoPelajarImage from '../../assets/OBC Guest House.png'

// 8 Unit Bisnis OBC
const units = [
	{ name: 'OBC Sport Center', image: sportCenterLogo, link: 'https://sport.obc.center' },
	{ name: 'OBC Guest House', image: guestHouseLogo, link: '#kontak' },
	{ name: 'OBC Villa', image: villaLogo, link: '#kontak' },
	{ name: 'OBC Laundry', image: laundryLogo, link: '#kontak' },
	{ name: 'OBC Food Court', image: foodCourtLogo, link: '#kontak' },
	{ name: 'OBC Coffee', image: coffeeLogo, link: '#kontak' },
	{ name: 'OBC Agribisnis', image: agribusinessLogo, link: '#kontak' },
]

// Fasilitas OBC Sport Center
const sportRow1: SportCardProps[] = [
	{
		image: lapangF2Image,
		badge: "Lapang F2 -  1 Olahraga di 1 waktu",
		icon: <img src={volleyballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ["Futsal 1", "Badminton", "Voli", "Pickleball"],
	},
	{
		image: lapangF1Image,
		badge: "Lapang F2 -  1 Olahraga di 1 waktu",
		icon: <img src={basketballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />, // basket
		items: ["Futsal 2", "Basket"],
	},
	{
		image: lapangF2Image,
		badge: "Lapang Sepak Bola",
		icon: <img src={footballIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ["Untuk flat 2jam Permainan"],
		hasVideo: true,
	},
];

const sportRow2: SportCardProps[] = [
	{
		image: academyTeamImage,
		badge: "Ruang Tenis Meja",
		icon: <img src={tennisRacketIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ["2 meja tenis", "Bisa 2 booking paralel"],
		hasVideo: true,
	},
	{
		image: billiardImage,
		badge: "Ruang Billiard",
		icon: <img src={billiardIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ["2 meja billiard", "Bisa 2 booking paralel"],
	},
	{
		image: academyRedImage,
		badge: "OBC Academy",
		icon: <img src={baseballCapIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ["L/P Usia 6-16 Tahun", "Free Trial 2X"],
	},
	{
		image: lapangF1Image,
		badge: "Coaching Class Pickleball",
		icon: <img src={bowlingBallIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" />,
		items: ["Training Program ±3 bulan", "Setiap Sabtu & Minggu"],
		hasVideo: true,
	},
];

const membershipBenefits = [
	'20% OFF untuk 4x pertemuan',
	'Harga lebih hemat',
	'Slot lapangan terjamin',
	'Jadwal tetap untuk bermain',
]

// Testimoni data
const testimonials = [
	{
		name: 'Hyena Ktlyn',
		unit: 'Customer OBC Laundry',
		avatar: 'H',
		stars: 5,
		logo: laundryLogo,
		text: 'Hasil laundry-nya rapi dan prosesnya cukup cepat. Saya coba laundry kiloan dan pakaian sudah selesai sesuai waktu yang diinformasikan. Pelayanannya juga ramah.',
	},
	{
		name: 'Rayna Lynz',
		unit: 'Guest OBC Villa',
		avatar: 'R',
		stars: 5,
		logo: villaLogo,
		text: 'Enak untuk kumpul keluarga karena ada ruang keluarga dan area yang cukup luas. Fasilitas seperti kitchen juga membantu kalau mau menyiapkan makanan sendiri. Overall nyaman untuk short getaway.',
	},
	{
		name: 'Laurnz Raihana',
		unit: 'Sport Center Member',
		avatar: 'L',
		stars: 5,
		logo: sportCenterLogo,
		text: 'Fasilitas olahraganya cukup lengkap dan areanya nyaman. Saya biasanya main futsal dan badminton di sini, booking-nya juga cukup praktis. Cocok kalau mau olahraga bareng teman.',
	},
	{
		name: 'Nadia Citra',
		unit: 'Guest House Customer',
		avatar: 'N',
		stars: 5,
		logo: guestHouseLogo,
		text: 'Tempatnya sangat santai dan nyaman untuk istirahat. Suasana tenang, kebersihannya terjaga, dan proses check-in juga mudah.',
	},
	{
		name: 'Bima Putra',
		unit: 'OBC Coffee Member',
		avatar: 'B',
		stars: 5,
		logo: coffeeLogo,
		text: 'Kopinya enak, tempatnya nyaman, dan cocok untuk nongkrong sambil kerja ringan. Pelayanannya cepat dan ramah.',
	},
	{
		name: 'Salsabila',
		unit: 'OBC Agribisnis Visitor',
		avatar: 'S',
		stars: 5,
		logo: agribusinessLogo,
		text: 'Pengalaman di OBC sangat menyenangkan. Lingkungannya asri, edukasinya menarik, dan cocok untuk keluarga belajar sambil bersantai.',
	},
]

// Kategori & Lokasi
const locationCategories = ['Semua', 'Akomodasi', 'Sport', 'FnB', 'Lifestyle', 'Edukasi']

const locations = [
	{
		address: 'Jl. Rancabentang, No. 3A',
		category: 'Akomodasi',
		units: ['OBC Guest House & Penthouse'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		address: 'Jl. Rancabentang, No. 10',
		category: 'Akomodasi',
		units: ['OBC Villa'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		address: 'Jl. Rancabentang, No. 3A',
		category: 'Sport',
		units: ['OBC Sports Center', 'OBC Food Court', 'OBC Coffee', 'OBC Laundry'],
		info: [
			'Sport | Setiap hari 07.00 WIB - 00.00 WIB',
			'Coffee | Setiap hari 08.00 WIB - 22.00 WIB',
		],
	},
	{
		address: 'Jl. Tugulaksana, Wangunsari',
		category: 'Edukasi',
		units: ['OBC Agribisnis'],
		info: ['Kebun & Edukasi Pertanian'],
	},
]

// Komponen Kartu Olahraga
type SportCardProps = {
	image: string;
	badge: string; // label kiri atas, mis. "Lapang F2 -  1 Olahraga di 1 waktu"
	icon: React.ReactNode; // ikon kecil kanan atas
	items: string[]; // list bullet di bawah gambar
	hasVideo?: boolean; // tampilkan tombol play di tengah gambar
	imgHeight?: string; // tinggi gambar, beda antar baris 1 & 2
};

const GALLERY_ITEMS = [
	{
		label: 'OBC Guest House',
		image: guestHouseGalleryImage,
		className: 'md:col-span-1 md:row-span-2 md:row-start-1 md:col-start-1',
	},
	{
		label: 'OBC Coffee',
		image: coffeeGalleryImage,
		className: 'md:col-span-1 md:row-span-2 md:row-start-1 md:col-start-2',
	},
	{
		label: 'OBC Food Court',
		image: foodCourtGalleryImage,
		className: 'md:col-span-2 md:row-start-1 md:col-start-3',
	},
	{
		label: 'OBC Laundry',
		image: laundryGalleryImage,
		className: 'md:col-span-2 md:row-start-3 md:col-start-1',
	},
	{
		label: 'OBC Sports Center',
		image: sportsCenterGalleryImage,
		className: 'md:col-span-2 md:row-span-2 md:row-start-2 md:col-start-3',
	},
]

function SportCard({ image, badge, icon, items, hasVideo, imgHeight = "h-[230px]" }: SportCardProps) {
	return (
		<article className="relative flex flex-col rounded-2xl border border-[#e5e5e5] bg-white">
			{/* gambar + overlay badge & icon */}
			<div className={`relative w-full ${imgHeight}`}>
				{/* radius hanya di sudut atas, karena kartu tidak pakai overflow-hidden */}
				<img
					className="h-full w-full rounded-t-2xl object-cover"
					src={image}
					alt={badge}
				/>

				{/* badge kiri atas */}
				<span
					aria-hidden="true"
					className="absolute left-[-8px] top-[22px] h-[17px] w-[8px] rounded-bl-[8px] bg-[#7FA52B]"
				/>

				{/* Label pill (sedikit keluar di sisi kiri kartu) */}
				<span className="absolute left-[-8px] top-3 rounded-full rounded-bl-none bg-[#CDF178] px-[10px] py-[3px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[0.5px] text-[#000000]">
					{badge}
				</span>

				{/* ikon bulat kanan atas */}
				<span className="absolute right-2 top-3 grid h-[22px] w-[22px] place-items-center rounded-full bg-[#CDF178] text-[#1F3320]">
					{icon}
				</span>

				{/* tombol play untuk kartu video */}
				{hasVideo && (
					<span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
						<Play size={18} fill="white" />
					</span>
				)}
			</div>

			{/* list fasilitas */}
			<ul className="flex flex-wrap gap-x-4 gap-y-1.5 p-4">
				{items.map((item) => (
					<li
						className="flex items-center gap-2 font-body text-[15px] font-medium text-[#1a1a1a]"
						key={item}
					>
						<span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8a8a6b]" />
						{item}
					</li>
				))}
			</ul>
		</article>
	)
}

function HomePage() {
	const [activeCategory, setActiveCategory] = useState('Semua')
	const [mapZoom, setMapZoom] = useState(16)
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)
	const [promoIndex, setPromoIndex] = useState(0)
	const [activeTestimonial, setActiveTestimonial] = useState(0)

	const goToTestimonial = (direction: number) => {
		setActiveTestimonial((current) => (current + direction + testimonials.length) % testimonials.length)
	}

	const promoSlides = [{ image: promoPelajarImage, alt: 'Promo pelajar OBC' }]

	useEffect(() => {
		if (!selectedGalleryImage) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedGalleryImage(null)
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [selectedGalleryImage])

	const filteredLocations =
		activeCategory === 'Semua'
			? locations
			: locations.filter(
					(l) =>
						l.category === activeCategory ||
						(activeCategory === 'FnB' && l.units.some((u) => u.includes('Food Court') || u.includes('Coffee'))) ||
						(activeCategory === 'Lifestyle' && l.units.some((u) => u.includes('Laundry')))
			  )

	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main id="beranda">
				{/* ===== 1. HERO SECTION ===== */}
				<section
					className="relative flex h-[85vh] min-h-[540px] items-end bg-cover bg-[center_72%] bg-no-repeat pb-[50px] text-white md:h-[82vh] md:min-h-[640px] md:pb-[70px]"
					style={{
						backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.78) 100%), url(${billiardImage})`,
					}}
				>
					<div className="mx-auto w-[calc(100%-48px)] max-w-[1280px]">
						<h1 className="align-middle font-['Montserrat'] text-[65px] font-bold leading-[80px] tracking-[0.5px] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] [text-shadow:0_0_18px_rgba(0,0,0,0.45),0px_6px_8px_0px_#00000040] text-black [text-shadow:0_0_2px_currentColor]">Onny Barber Center</h1>
						<p className="my-[14px] mb-6 max-w-[620px] font-['Montserrat'] text-[12px] font-semibold leading-[15px] tracking-[0.5px] text-white [text-align:justify] [text-shadow:0px_6px_4px_#00000040]">
							OBC Group adalah ekosistem usaha yang menghadirkan beragam layanan, fasilitas, dan ruang
							untuk berbagai kebutuhan. Mulai dari personal care, olahraga, hospitality, makanan &amp;
							minuman, hingga event space.
						</p>
						<div className="flex max-w-[520px] flex-col gap-1 md:flex-row">
							<a
								className="inline-flex flex-1 items-center justify-center rounded-full border border-white bg-[#27282526] px-6 py-[11px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_4px_#00000040] backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-obc-green"
								href="https://sport.obc.center"
								target="_blank"
								rel="noreferrer"
							>
								Booking OBC Sport
							</a>
							<span aria-hidden="true" className="hidden md:grid h-7 w-8 translate-y-1 place-items-center text-white/85">
								<svg viewBox="0 0 24 24" className="h-9 w-9 mt-4" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6 8.5L12 15.5L18 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
							<a className="inline-flex flex-1 items-center justify-center rounded-full border border-white bg-[#27282526] px-6 py-[11px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_4px_#00000040] backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-white/25" href="#layanan">
								Jelajahi Bisnis Kami
							</a>
						</div>
					</div>
					<div className="absolute bottom-[132px] right-[max(113px,calc((100%-1280px)/2))] hidden items-center gap-4 rounded-full px-3 py-1.5 text-white md:flex">
						<div className="flex items-center gap-1.5" aria-label="Indikator navigasi">
							<span className="h-2 w-19 rounded-full bg-white" />
							<span className="h-2 w-19 rounded-full bg-[#AEAEAE99]" />
							<span className="h-2 w-19 rounded-full bg-[#AEAEAE99]" />
							<span className="h-2 w-19 rounded-full bg-[#AEAEAE99]" />
						</div>
						<div className="flex gap-0">
							<button className="grid h-10 w-7 place-items-center text-3xl leading-none transition-opacity hover:opacity-70" type="button" aria-label="Navigasi sebelumnya">&larr;</button>
							<button className="grid h-10 w-7 place-items-center text-3xl leading-none transition-opacity hover:opacity-70" type="button" aria-label="Navigasi berikutnya">&rarr;</button>
						</div>
					</div>
				</section>

				{/* ===== 2. PROMO BANNER ===== */}
				<section className="bg-[#fffff7] px-4 py-6 sm:px-6 md:py-8" aria-label="Promo OBC">
					<div className="relative mx-auto aspect-[1200/450] max-w-[1200px] overflow-hidden rounded-[20px] bg-[#0c2937] shadow-[0_8px_24px_rgba(0,64,0,0.12)] md:rounded-[22px]">
						<img className="absolute inset-0 h-full w-full object-cover" src={promoSlides[promoIndex].image} alt={promoSlides[promoIndex].alt} />
						<button
							className="absolute left-5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#fffff7] text-[#404f14] shadow-md transition-transform hover:scale-110 sm:left-7 sm:h-8 sm:w-8 md:left-8"
							type="button"
							aria-label="Promo sebelumnya"
							onClick={() => setPromoIndex((index) => (index === 0 ? promoSlides.length - 1 : index - 1))}
						>
							<ChevronLeft size={25} />
						</button>
						<button
							className="absolute right-5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#fffff7] text-[#404f14] shadow-md transition-transform hover:scale-110 sm:right-7 sm:h-8 sm:w-8 md:right-8"
							type="button"
							aria-label="Promo berikutnya"
							onClick={() => setPromoIndex((index) => (index + 1) % promoSlides.length)}
						>
							<ChevronRight size={25} />
						</button>
					</div>
					<div className="mt-3 flex justify-center gap-1.5" aria-label="Indikator promo">
						{promoSlides.map((slide, index) => (
							<button
								className={`h-1.5 rounded-full transition-all ${index === promoIndex ? 'w-7 bg-obc-green' : 'w-1.5 bg-[#d8d2c1]'}`}
								key={slide.alt}
								type="button"
								aria-label={`Tampilkan promo ${index + 1}`}
								onClick={() => setPromoIndex(index)}
							/>
						))}
					</div>
				</section>

				{/* ===== 3. TENTANG OBC GRUP ===== */}
				<section className="mx-auto grid w-[calc(100%-48px)] max-w-[1280px] gap-[60px] py-[90px] md:grid-cols-[1.15fr_1fr] md:items-center" id="tentang">
					<div>
						<span className="mb-3 block font-['Montserrat'] text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-[#000000CC] opacity-80">TENTANG OBC GRUP</span>
						<h2 className="max-w-[480px] font-['Montserrat'] text-[36px] font-bold leading-[50px] tracking-[1.5px]">Satu Ekosistem, Beragam Layanan, Satu Tujuan</h2>
						<p className="my-5 mb-7 max-w-[560px] font-body text-[13px] leading-[1.7] text-[#6f6b6e]">
							OBC Group merupakan perusahaan yang berdiri sejak 7 Mei 1999 di Bandung, Jawa Barat.
							Berawal dari Onny Barber Center, OBC terus berkembang dan mengelola beragam unit usaha
							untuk menghadirkan layanan yang bermanfaat serta memenuhi beragam kebutuhan masyarakat.
							Kini, OBC menaungi berbagai bidang usaha, mulai dari personal care, olahraga, hospitality,
							makanan &amp; minuman, laundry, agribisnis, hingga ruang multifungsi.
						</p>
						<div className="mb-7 grid max-w-[560px] grid-cols-1 gap-6 md:grid-cols-2">
							<div className="flex flex-col items-start">
								<span className="mb-2 grid h-11 w-11 place-items-center rounded-lg bg-[#CDF178] text-[#000000] shadow-[0px_1px_1px_0px_#00000040]">
									<img src={targetArrowIcon} alt="" aria-hidden="true" className="h-[23px] w-[24px]" />
								</span>
								<h4 className="mb-1.5 font-heading text-[13px] font-semibold text-[#000000]">Visi Kami</h4>
								<p className="align-middle font-['Montserrat'] text-[12px] font-normal leading-[26px] tracking-[0px] text-[#6f6b6e] [text-align:justify]">
									OBC sebagai wadah untuk membantu keluarga dan juga masyarakat sekitar agar bisa mandiri
									secara financial dan berkembang menjadi SDM yang berkualitas.
								</p>
							</div>
							<div className="flex flex-col items-start">
								<span className="mb-2 grid h-11 w-11 place-items-center rounded-lg bg-[#CDF178] text-[#000000] shadow-[0px_1px_1px_0px_#00000040]">
									<img src={rosetteIcon} alt="" aria-hidden="true" className="h-[23px] w-[24px]" />
								</span>
								<h4 className="mb-1.5 font-heading text-[13px] font-semibold text-[#000000]">Misi Kami</h4>
								<p className="align-middle font-['Montserrat'] text-[12px] font-normal leading-[26px] tracking-[0px] text-[#6f6b6e] [text-align:justify]">
									Menghadirkan layanan prima, nyaman, berkualitas, dan terjangkau di setiap unit OBC
									Group.
								</p>
							</div>
						</div>
						<a className="inline-flex h-[25px] w-[600px] items-center justify-end gap-2 font-['Montserrat'] text-right text-[19px] font-semibold leading-[25px] tracking-[0px] text-[#000000] opacity-100 transition-[gap] hover:gap-3" href="#kontak">
							Lihat Lebih Lanjut tentang Kami <ArrowRight size={20} />
						</a>
					</div>
					<div className="relative min-h-[360px] h-[360px] md:h-[480px] md:min-h-[460px]">
						<div
							className="absolute left-[18%] top-0 h-[78%] w-[45%] rounded-full bg-cover bg-center shadow-[0_8px_24px_rgba(52,49,51,0.08)]"
							style={{ backgroundImage: `url(${lapangF1Image})` }}
						/>
						<div
							className="absolute bottom-[10%] right-[20%] h-[60%] w-[38%] rounded-full border-[7px] border-[#fffff7] bg-cover bg-center shadow-[0_12px_36px_rgba(52,49,51,0.14)]"
							style={{ backgroundImage: `url(${lapangF2Image})` }}
						/>
						<div className="absolute left-[52%] top-5 inline-flex items-center gap-2 rounded-[100px] bg-[#0040001A] p-2.5 text-black backdrop-blur">
							<span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#004000] to-[#009D00] text-white">
								<img src={medalIcon} alt="" aria-hidden="true" className="h-[22px] w-[22px]" />
							</span>
							<span className="font-body text-[16px] font-bold leading-[1.2] tracking-[0%] text-black">EST 7 MEI 1999</span>
						</div>
					</div>
				</section>

				{/* ===== 3. BISNIS KAMI (UNIT BISNIS) ===== */}
				<section
					className="mx-auto w-[calc(100%-48px)] max-w-[1280px] bg-[#fffff7] py-[70px] pb-[90px]"
					id="layanan"
				>
					<span className="mb-3 block text-center font-['Montserrat'] text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-[#000000CC]">
						Bisnis Kami
					</span>
					<h2 className="mx-auto h-[45px] w-full max-w-[1098px] text-center font-['Montserrat'] text-[36px] font-bold leading-[45px] tracking-[1.5px] text-[#000000] opacity-100">
						Beragam Layanan dalam Satu Ekosistem
					</h2>
					<div
						className="mx-auto mt-3 w-[812px] max-w-full border-t-2 border-[#00000080]"
						aria-hidden="true"
					/>

					<div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{units.slice(0, 4).map((unit) => (
							<article
								className="relative flex flex-col items-center rounded-[20px] border border-[#e5e5e5] bg-white p-6 pt-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
								key={unit.name}
							>
								<a
									className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[#e5e5e5] bg-white text-[#111111] transition-colors hover:bg-[#f5f5f5]"
									href={unit.link}
									target={unit.link.startsWith('http') ? '_blank' : '_self'}
									rel="noreferrer"
									aria-label={`Buka ${unit.name}`}
								>
									<Heart size={15} />
								</a>
								<div className="grid h-[130px] w-[130px] place-items-center">
									<img
										className="block max-h-[130px] max-w-[130px] object-contain"
										src={unit.image}
										alt={`Logo ${unit.name}`}
									/>
								</div>
								<div className="mt-3 w-full text-left">
									<h3 className="font-heading text-[16px] font-bold text-[#111111]">
										{unit.name}
									</h3>
									<div className="mt-2.5 flex w-full items-center justify-between gap-2">
										<a
											className="inline-flex h-7 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-3 font-heading text-[11px] font-semibold text-[#111111] transition-colors hover:bg-[#eaeaea]"
											href={unit.link}
											target={unit.link.startsWith('http') ? '_blank' : '_self'}
											rel="noreferrer"
										>
											Booking Now
										</a>
										<a
											className="inline-flex shrink-0 items-center gap-1 font-heading text-[11px] font-semibold text-[#111111] transition-[gap] hover:gap-2"
											href="#kontak"
										>
											Detail Unit <ArrowRight size={11} />
										</a>
									</div>
								</div>
							</article>
						))}
					</div>

					<div className="mt-6 mx-auto grid max-w-[calc(3*280px+2*1.5rem)] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{units.slice(4).map((unit) => (
							<article
								className="relative flex w-full max-w-[280px] flex-col items-center justify-self-center rounded-[20px] border border-[#e5e5e5] bg-white p-6 pt-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-[3px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
								key={unit.name}
							>
								<a
									className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-[#e5e5e5] bg-white text-[#111111] transition-colors hover:bg-[#f5f5f5]"
									href={unit.link}
									target={unit.link.startsWith('http') ? '_blank' : '_self'}
									rel="noreferrer"
									aria-label={`Buka ${unit.name}`}
								>
									<Heart size={15} />
								</a>
								<div className="grid h-[130px] w-[130px] place-items-center">
									<img
										className="block max-h-[130px] max-w-[130px] object-contain"
										src={unit.image}
										alt={`Logo ${unit.name}`}
									/>
								</div>
								<div className="mt-3 w-full text-left">
									<h3 className="font-heading text-[16px] font-bold text-[#111111]">
										{unit.name}
									</h3>
									<div className="mt-2.5 flex w-full items-center justify-between gap-2">
										<a
											className="inline-flex h-7 items-center justify-center rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-3 font-heading text-[11px] font-semibold text-[#111111] transition-colors hover:bg-[#eaeaea]"
											href={unit.link}
											target={unit.link.startsWith('http') ? '_blank' : '_self'}
											rel="noreferrer"
										>
											Booking Now
										</a>
										<a
											className="inline-flex shrink-0 items-center gap-1 font-heading text-[11px] font-semibold text-[#111111] transition-[gap] hover:gap-2"
											href="#kontak"
										>
											Detail Unit <ArrowRight size={11} />
										</a>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				{/* ===== 4. OBC SPORT CENTER ===== */}
				<section className="bg-white px-0 py-10 pb-14" id="fasilitas">
					<div className="mx-auto w-[calc(100%-48px)] max-w-[1280px]">
						{/* Header */}
						<div className="mb-6 flex flex-col items-start justify-between gap-6 px-[15px] md:flex-row md:items-center">
							<div>
								<h2 className="h-[40px] w-full max-w-[1180px] font-['Montserrat'] text-[36px] font-extrabold leading-[40px] tracking-[-0.9px] text-[#000000]">
									OBC SPORT CENTER
								</h2>
								<p className="mt-2 h-[48px] w-full max-w-[834px] align-middle font-['Montserrat'] text-[20px] font-normal leading-[24px] tracking-[1px] text-justify text-[#000000]">
									Dari pertandingan kompetitif hingga permainan santai, temukan ruang
									olahraga yang sesuai untukmu.
								</p>
							</div>
							<a
								className="inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-4 py-2 font-['Montserrat'] text-[20px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a]"
								href="https://sport.obc.center"
								target="_blank"
								rel="noreferrer"
							>
								<span className="flex-1 whitespace-nowrap text-center">Booking Sekarang</span>
								<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
									<ArrowUpRight size={25} />
								</span>
							</a>
						</div>

						{/* Baris 1 — 2 kartu lebar + 1 kartu sempit (rasio 422 : 420 : 337) */}
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[422fr_420fr_337fr]">
							{sportRow1.map((card, i) => (
								<SportCard key={`r1-${i}`} {...card} imgHeight="h-[181px]" />
							))}
						</div>

						{/* Baris 2 — 4 kartu sama lebar */}
						<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{sportRow2.map((card, i) => (
								<SportCard key={`r2-${i}`} {...card} imgHeight="h-[162px]" />
							))}
						</div>
					</div>
				</section>

				{/* ===== 5. MEMBERSHIP ===== */}
				<section className="relative overflow-hidden bg-white py-10">
					{/* tekstur lapangan samar dari asset untuk memberi nuansa olahraga */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
						style={{
							backgroundImage: `url(${member})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							filter: 'brightness(1.15)',
						}}
						aria-hidden="true"
					/>
					<div
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(0,157,0,0.08)_0%,transparent_60%)]"
						aria-hidden="true"
					/>

					<div className="relative mx-auto grid w-[calc(100%-40px)] max-w-[1280px] items-center gap-8 md:grid-cols-[1.1fr_0.95fr_1.1fr]">
						{/* Kolom kiri — headline & benefit */}
						<div>
							<span className="mb-1.5 block h-[16px] w-[180px] font-['Montserrat'] text-[15px] font-medium uppercase leading-[16px] tracking-[1px] text-[#222222]">
								OBC SPORT CENTER
							</span>
							<h2 className="h-[96px] w-[334px] max-w-full font-['Montserrat'] text-[36px] font-bold leading-[48px] tracking-[1.5px] text-[#000000]">
								Siap Bermain di
								<br />
								OBC Sport ?
							</h2>
							<p className="mt-3 h-[125px] w-[306px] max-w-full text-justify font-['Montserrat'] text-[15px] font-normal leading-[25px] tracking-[0px] text-[#000000]">
								Temukan fasilitas olahraga yang sesuai dengan kebutuhanmu, lalu nikmati
								keuntungan membership untuk pengalaman bermain yang lebih praktis dan
								hemat.
							</p>
							<ul>
								{membershipBenefits.map((b) => (
									<li
										className="mb-2.5 mt-3.5 flex items-center gap-2.5 font-body text-[13px] text-[#1a1a1a]"
										key={b}
									>
										<span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] border-[#1a1a1a] text-[#1a1a1a]">
											<Check size={10} strokeWidth={3} />
										</span>
										{b}
									</li>
								))}
							</ul>
						</div>

						{/* Kartu membership 3D — sesuai spec figma */}
						<div className="grid place-items-center">
							<div
								className="relative flex h-[257px] w-[430px] max-w-full flex-col justify-between gap-[18px] rounded-[16px] border border-[#10B9814D] p-[24px_32px] [transform:rotate(3.1deg)] shadow-[0_0_40px_0_rgba(198,245,42,0.15),-20px_25px_50px_-12px_rgba(0,0,0,0.7)]"
								style={{
									background:
										"linear-gradient(132.33deg, #002400 0.9%, #009D00 49.99%, #004000 99.1%)",
								}}
								aria-hidden="true"
							>
								<div className="flex items-start justify-between">
									<div>
										<strong className="block font-['Montserrat'] text-[32px] font-extrabold leading-[32px] tracking-[-0.6px] text-[#FFFFFF]">
											OBC
										</strong>
										<span className="mt-0.5 block font-['Montserrat'] text-[8px] font-semibold uppercase leading-[12px] tracking-[2px] text-[#FFFFFFF7]">
											SPORT CENTER
										</span>
									</div>
									<div
														className="relative grid place-items-center shadow"
														style={{
															width: '28.287094726806686px',
															height: '19.867083635046928px',
															transform: 'rotate(-3.1deg)',
															opacity: 1,
														}}
													>
														<span
															className="absolute inset-0 rounded-[4px] border border-[#FFF717] bg-white"
														/>
														<span
															className="absolute rounded-[2px] border border-[#FFF717] bg-transparent"
															style={{
																width: '14.155374479094007px',
																height: '9.95828192246003px',
																transform: 'rotate(-3.1deg)',
															}}
														/>
													</div>
								</div>

								<div className="mt-7 flex h-full flex-col items-center justify-start pt-0 text-center">
									<p className="h-[32px] w-[367px] max-w-full font-['Montserrat'] text-[16px] font-extrabold leading-[32px] tracking-[-0.6px] text-white">
										SPORTS MEMBERSHIP
									</p>
									<p className="mt-[-2px] h-[12px] w-[367px] max-w-full font-['Montserrat'] text-[8px] font-semibold uppercase leading-[12px] tracking-[2px] text-[#FFFFFFF7]">
										PLAY. MOVE. CONNECT.
									</p>
								</div>
							</div>
						</div>

						{/* Kolom kanan — brand & CTA */}
						<div className="flex flex-col items-end gap-2 text-right">
							<div>
								<strong className="block font-heading text-[48px] font-extrabold leading-none tracking-tight text-[#111111]">
									OBC
								</strong>
								<small className="block font-heading text-[12px] font-semibold tracking-[0.35em] text-[#111111]">
									SPORT CENTER
								</small>
							</div>

							<p className="mt-5 h-[48px] w-[363px] -translate-y-5 rotate-[-2deg] text-right font-['Caveat'] text-[40px] font-bold leading-[48px] tracking-[1.2px] text-[#222222]">
								Play. Move. Connect.
							</p>

							<a
								className="inline-flex h-[60px] w-[418px] max-w-full shrink-0 items-center justify-between gap-4 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-2 pl-6 pr-2 font-['Montserrat'] text-[20px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a]"
								href="https://sport.obc.center"
								target="_blank"
								rel="noreferrer"
							>
								<span className="text-center leading-[16px]">
									Booking &amp; Daftar Membership
								</span>
								<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
									<ArrowUpRight size={25} />
								</span>
							</a>
							<small className="mt-5 origin-left rotate-[-3deg] font-body text-[10px] italic text-[#6b7280]">
								*Syarat dan Ketentuan Berlaku
							</small>
						</div>
					</div>
				</section>

				{/* ===== 6. GEDUNG MULTIFUNGSI / EVENT SPACE ===== */}
				<section
					className="mx-auto grid w-[calc(100%-48px)] max-w-[1280px] gap-9 py-20 md:grid-cols-2"
					id="event-space"
				>
					{/* Kolom kiri */}
					<div>
						<div
							className="relative h-[440px] overflow-hidden rounded-[32px] bg-cover bg-center"
							style={{ backgroundImage: `url(${lapangF1Image})` }}
						>
							<span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
								<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
									<Calendar size={13} strokeWidth={2} />
								</span>
								Lapang F1
							</span>
						</div>

						{/* Pill kategori — tidak full width, ada gap */}
						<div className="my-[18px] flex h-[48px] w-[528px] max-w-full items-center justify-between py-2">
							<span className="inline-flex h-[32px] w-auto min-w-[116px] shrink-0 items-center justify-center gap-[5px] rounded-[100px] border border-[#00000080] bg-white px-[10px] py-[5px] font-['Montserrat'] text-[20px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap">
								Wedding
							</span>
							<span className="inline-flex h-[32px] w-auto min-w-[116px] shrink-0 items-center justify-center gap-[5px] rounded-[100px] border border-[#00000080] bg-white px-[10px] py-[5px] font-['Montserrat'] text-[20px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap">
								Gathering
							</span>
							<span className="inline-flex h-[32px] w-auto min-w-[116px] shrink-0 items-center justify-center gap-[5px] rounded-[100px] border border-[#00000080] bg-white px-[10px] py-[5px] font-['Montserrat'] text-[20px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap">
								Acara Lainnya
							</span>
						</div>

						{/* Tombol "tiket" — ada cutout bulat kiri-kanan */}
						<a
							className="relative flex h-[69.33px] w-[528px] max-w-full items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-[18px] py-[8px] font-['Montserrat'] text-[19px] font-semibold leading-none tracking-[0.08em] text-[#000000] shadow-[0px_5px_4px_0px_#00000040] transition-colors hover:bg-[#c8ec60]"
							href="https://wa.me/628886070900"
							target="_blank"
							rel="noreferrer"
						>
							<span className="whitespace-nowrap text-center">AJUKAN SEWA</span>
							<span className="grid h-9 w-9 place-items-center rounded-full bg-[#004000] text-[#CDF178]">
								<WhatsAppLogo className="h-6 w-6 shrink-0" />
							</span>
						</a>
					</div>

					{/* Kolom kanan */}
					<div>
						<span className="inline-flex h-[40px] w-[271px] items-center justify-center gap-[10px] rounded-[100px] bg-[#ffffff33] px-[30px] py-4 font-['Montserrat'] text-[20px] font-medium leading-[100%] tracking-[1%] text-[#000000] uppercase whitespace-nowrap shadow-[0px_4px_4px_0px_#00000040,0px_2px_2px_0px_#00000040_inset]">
							GEDUNG MULTIFUNGSI
						</span>
						<h2 className="my-3 mb-2 h-[90px] w-[610px] max-w-full font-['Montserrat'] text-[40px] font-bold leading-[45px] tracking-[1px] text-[#000000]">
							Ruang Serbaguna untuk Berbagai Acara
						</h2>
						<p className="h-[60px] w-[610px] max-w-full font-['Montserrat'] text-[20px] font-normal leading-[30px] tracking-normal text-[#000000]">
							Lapang F1 &amp; F2 hadir sebagai ruang fleksibel untuk wedding,
							gathering, dan berbagai kebutuhan acara lainnya.
						</p>

						<div
							className="relative mt-[18px] h-[400px] overflow-hidden rounded-[32px] bg-cover bg-center"
							style={{ backgroundImage: `url(${lapangF2Image})` }}
						>
							<span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
								<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
									<Calendar size={13} strokeWidth={2} />
								</span>
								Lapang F2
							</span>
						</div>
					</div>
				</section>

								{/* ===== 7. GALERI ===== */}
				<section className="mx-auto w-[calc(100%-48px)] max-w-[1280px] py-[30px] pb-[70px]" id="galeri">
					{/* Header: judul di kiri, tombol di kanan */}
					<div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
						<div>
							<span className="block font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.6px] text-[#333333]">
								Galeri
							</span>
							<h2 className="mt-1 font-['Montserrat'] text-[28px] font-bold leading-[40px] tracking-[1.5px] text-black md:text-[36px]">
								Momen yang Menjadi Bagian dari OBC
							</h2>
							<p className="mt-2 font-['Montserrat'] text-[16px] font-normal leading-[32px] tracking-[0.72px] text-black md:text-[20px]">
								Jelajahi berbagai momen, fasilitas, dan aktivitas dari seluruh unit usaha OBC.
							</p>
						</div>

						{/* Tombol hijau limau + lingkaran gelap berisi panah */}
						<a
							className="inline-flex h-[67px] w-[304px] shrink-0 items-center justify-between gap-4 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-2 pl-6 pr-2 font-['Montserrat'] text-[20px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a]"
							href="#galeri"
						>
							<span className="w-[195px] whitespace-nowrap text-center">Lihat Semua Galeri</span>
							<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
								<ArrowUpRight size={25} />
							</span>
						</a>
					</div>

					{/* Grid: mobile 2 kolom tinggi tetap, desktop 4 kolom (275 / 100 / 275) */}
					<div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[275px_100px_275px] md:gap-[25px] md:px-[27px]">
						{GALLERY_ITEMS.map((item) => (
							<button
								key={item.label}
								className={`relative h-[200px] cursor-pointer overflow-hidden rounded-[20px] border-0 bg-cover bg-center p-0 transition-transform hover:scale-[1.01] md:h-auto ${item.className}`}
								style={{ backgroundImage: `url(${item.image})` }}
								type="button"
								aria-label={`Buka gambar ${item.label}`}
								onClick={() => setSelectedGalleryImage(item.image)}
							>
								{/* Label putih berbentuk pil di pojok kiri bawah */}
								<span className="absolute bottom-[6px] left-[8px] rounded-full bg-white px-[22px] py-[8px] font-['Montserrat'] text-[14px] font-normal leading-[22px] text-[#222222] md:text-[17px]">
									{item.label}
								</span>
							</button>
						))}
					</div>
				</section>

				{selectedGalleryImage && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
						role="dialog"
						aria-modal="true"
						aria-label="Pratinjau gambar galeri"
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
							<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC" />
						</div>
					</div>
				)}

				{/* ===== 8. TESTIMONI ===== */}
				<section className="py-[60px]">
					<div className="mx-auto w-[calc(100%-48px)] max-w-[1280px]">
						<div className="flex flex-wrap items-start justify-between gap-6">
							<div className="flex flex-col justify-start pt-[4px] text-left">
								<span className="mb-2 flex items-center gap-2 font-['Montserrat'] text-[13px] font-semibold uppercase tracking-[1.4px] text-[#000000CC]">
									TESTIMONI
								</span>
								<h2 className=" gap-1 py-1 h-auto min-h-[40px] w-full min-w-[274px] max-w-[520px] font-['Montserrat'] text-[46px] font-medium leading-[46px] tracking-[0px] text-[#000000]">
									Apa Kata Mereka
									<br />
									Tentang OBC Group
								</h2>
							</div>

							<div className="flex flex-col items-end gap-3 text-right">
								<p className="max-w-[420px] font-['Montserrat'] text-[15px] leading-[1.5] text-[#4b5563]">
									Pengalaman Menginap, Berolahraga, dan Beraktivitas di OBC Group
								</p>
								<div className="flex gap-2.5">
									<button
										className="grid h-[50px] w-[50px] place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5]"
										type="button"
										aria-label="Testimoni sebelumnya"
										onClick={() => goToTestimonial(-1)}
									>
										<ChevronLeft size={20} className="translate-x-[-1px]" />
									</button>
									<button
										className="grid h-[50px] w-[50px] place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5]"
										type="button"
										aria-label="Testimoni berikutnya"
										onClick={() => goToTestimonial(1)}
									>
										<ChevronRight size={20} className="translate-x-[1px]" />
									</button>
								</div>
							</div>
						</div>

						<div className="relative mt-8 h-[470px] overflow-hidden">
							{testimonials.map((t, i) => {
								const offset = ((i - activeTestimonial + testimonials.length) % testimonials.length)
								const normalizedOffset = offset > testimonials.length / 2 ? offset - testimonials.length : offset
								const isVisible = Math.abs(normalizedOffset) <= 2
								if (!isVisible) return null

								const isActive = normalizedOffset === 0
								const translateX = normalizedOffset * 360
								const scale = isActive ? 1 : 0.9
								const opacity = isActive ? 1 : 0.55
								const blur = isActive ? 0 : 0.2

								return (
									<article
										key={t.name + i}
										className="absolute left-1/2 top-3 -translate-x-1/2 rounded-[25px] border border-[#ececec] bg-[#ffffff] p-[26px] text-left shadow-[0_5px_80px_0_#EEEEE7] transition-all duration-500 ease-out"
										style={{
													height: isActive ? '451px' : '391px',
													width: '344px',
											transform: `translateX(${translateX}px) scale(${scale})`,
											opacity,
											filter: `blur(${blur}px)`,
											zIndex: isActive ? 30 : 10 - Math.abs(normalizedOffset),
										}}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
														<span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-[#CDF178] font-['Montserrat'] text-[27px] font-semibold leading-[35px] tracking-[0px] text-[#004000]">
													{t.avatar}
												</span>
												<div>
															<strong className="block font-['Montserrat'] text-[20px] font-bold leading-[20px] tracking-[0px] text-[#1F3320]">
														{t.name}
													</strong>
															<small className="mt-1 block font-['Montserrat'] text-[14px] font-normal italic leading-[16px] tracking-[0px] text-[#555555]">
														{t.unit}
													</small>
												</div>
											</div>
													<span className="font-['Montserrat'] text-[42px] font-normal leading-[42px] tracking-[-1px] text-[#1F3320]">
												5.0
											</span>
										</div>

										<Quote className="mt-3 rotate-180 text-[#d1d5db]" width={36} height={26} preserveAspectRatio="none" fill="currentColor" strokeWidth={0} />								<p className="mt-3 font-['Montserrat'] text-[18px] font-normal leading-[30px] tracking-[0px] text-[#000000]" style={{ width: '292px', height: '210px' }}>{t.text}</p>

										<div className="mt-6 flex items-center justify-between">
												<img src={t.logo} alt={t.unit} className="h-auto w-auto max-h-[36px] max-w-[36px] object-contain" />
											
											<div className="flex items-center gap-1.5">
												<div className="flex gap-0.5 text-[#f5a623]">
													{Array.from({ length: 5 }).map((_, s) => (
														<Star key={s} size={15} fill="currentColor" strokeWidth={0} />
													))}
												</div>	
												<BadgeCheck className="text-white" size={17} fill="#3b82f6" stroke="white" />
											</div>
										</div>
									</article>
								)
								})}
						</div>

						<div className="mt-10 flex justify-center">
							<a
								className="flex h-[69.33px] w-[438px] items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-4 py-[8px] font-['Montserrat'] text-[17px] font-semibold leading-[17px] tracking-[0px] text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a]"
								href="#kontak"
							>
								<span className="grid h-9 w-9 place-items-center rounded-full bg-[#004000] text-[#CDF178]">
									<img src={reviewIcon} alt="" aria-hidden="true" className="h-[18px] w-[17px]" />
								</span>
								<span className="block h-[17px] w-[332px] text-center leading-[17px]">
									Tulis Ulasan Pengalaman Kamu Disini
								</span>
							</a>
						</div>
					</div>
				</section>

				{/* ===== 9. LOKASI OBC GROUP ===== */}
				<section
					className="mx-auto grid w-[calc(100%-48px)] max-w-[1280px] items-start gap-15 py-10 pb-20 md:grid-cols-[1fr_1.15fr]"
					id="kontak"
				>
					{/* Panel kiri — daftar lokasi, background putih nyatu dengan section */}
					<div>
						<span className="mb-3 block h-[20px] w-full min-w-[412px] max-w-[856px] font-['Montserrat'] text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-[#000000CC]">
							LOKASI OBC GROUP
						</span>
						<h2 className="h-auto min-h-[28px] w-full max-w-[527px] font-['Montserrat'] text-[24px] font-bold leading-[27.5px] tracking-[1.5px] text-[#000000]">
							Temukan OBC di Berbagai Lokasi
						</h2>
						<p className="my-3 mb-5 h-auto min-h-[43px] w-full max-w-[527px] font-['Montserrat'] text-[13px] font-normal leading-[21.13px] tracking-normal text-justify text-[#000000]">
							Jelajahi berbagai destinasi OBC untuk menginap, berolahraga,
							bersantai, dan menikmati berbagai layanan kami.
						</p>

						{/* Kategori Filter Tabs — pill hitam untuk aktif, abu-abu untuk lainnya */}
						<div className="mb-4 flex flex-wrap gap-4.5">
							{locationCategories.map((cat) => (
								<button
									key={cat}
									type="button"
									className={`rounded-full px-4 py-1.5 font-heading text-[13px] font-medium transition-colors ${
										activeCategory === cat
											? 'bg-[#CDF178E5] text-[#000000]'
											: 'bg-[#f0f0f0] text-[#111111] hover:bg-[#e5e5e5]'
									}`}
									onClick={() => setActiveCategory(cat)}
								>
									{cat}
								</button>
							))}
						</div>

						<div>
							{filteredLocations.map((loc, i) => (
								<div className="border-t border-[#e5e5e5] py-4" key={i}>
									{/* alamat + tombol lihat lokasi */}
									<div className="flex items-center justify-between">
										<span className="inline-flex h-auto min-h-[21px] w-[264px] max-w-full items-center gap-2 align-middle font-['Montserrat'] text-[15px] font-semibold leading-[20.63px] tracking-normal text-[#000000]">
											<span className="grid h-[32px] w-[32px] place-items-center rounded-[2px] bg-[#EDEDED]">
																								<img src={locationIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
																					</span> {loc.address}
										</span>
										<a
											href="https://maps.google.com"
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 font-heading text-[13px] font-semibold text-[#111111]"
										>
											Lihat Lokasi
											<span className="grid h-6 w-6 place-items-center">
												<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
											</span>
										</a>
									</div>

									{loc.units.length > 1 ? (
										<div className="my-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-[15px] font-semibold text-[#111111]">
											{loc.units.map((u, idx) => (
												<span className="flex items-center gap-2" key={u}>
													{idx > 0 && <i className="h-1 w-1 rounded-full bg-[#111111]" />}
													{u}
												</span>
											))}
										</div>
									) : (
										<p className="my-2.5 font-heading text-[15px] font-semibold text-[#111111]">
											{loc.units[0]}
										</p>
									)}

									{/* info jam/check-in — pill abu-abu */}
									{loc.info.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{loc.info.map((t) => (
												<span
													className="inline-flex min-h-[23px] w-fit max-w-full items-center rounded-[12px] bg-[#EDEDED] px-2 py-[2px] font-['Montserrat'] text-[10px] font-medium leading-[16.5px] tracking-normal text-[#000000]"
													key={t}
												>
													{t}
												</span>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Panel kanan — Peta */}
					<div className="box-border h-[580px] w-[613px] max-w-full overflow-hidden rounded-[8px] bg-[#EDEDED80] p-[14px] shadow-[0px_1px_2px_0px_#0000000D]">
						{/* header peta */}
						<div className="flex items-center justify-between gap-2 border-b border-[#e5e5e5] px-4 py-3 max-sm:px-2">
							<div className="flex min-w-0 items-center gap-2">
								<i className="h-2 w-2 shrink-0 rounded-full bg-[#111111]" />
								<span className="h-[20px] w-[204px] shrink-0 whitespace-nowrap font-['Montserrat'] text-[14px] font-semibold uppercase leading-[20px] tracking-[0.7px] text-[#000000] max-sm:w-[144px] max-sm:text-[10px] max-sm:tracking-[0.2px]">
									PETA LOKASI OBC GROUP
								</span>
							</div>
							<span className="pointer-events-none box-border flex h-[18px] w-[155px] shrink-0 items-center justify-center rounded-[12px] bg-[#CDF1784D] px-2 py-[2px] font-['Montserrat'] text-[11px] font-medium leading-[14px] tracking-[0.88px] text-[#000000] shadow-[0px_1px_1px_0px_#00000040] max-sm:w-[100px] max-sm:px-1 max-sm:text-[8px] max-sm:tracking-[0.2px]">
								Live Interactive Map
							</span>
						</div>

						{/* area peta + kontrol floating */}
						<div className="relative h-[500px] w-full overflow-hidden bg-[#f2f4f8]">
							<iframe
								className="h-full w-full border-0"
								title="Peta Lokasi OBC Group di Rancabentang"
								src={`https://www.google.com/maps?q=Jl.+Rancabentang+No.+3A,+Bandung&output=embed&z=${mapZoom}`}
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>

							{/* kontrol zoom — floating vertikal, pojok kanan */}
							<div className="absolute right-3 top-16 flex flex-col gap-1.5">
								<button
									className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
									type="button"
									aria-label="Zoom in"
									onClick={() => setMapZoom((z) => Math.min(z + 1, 19))}
								>
									<Plus size={16} />
								</button>
								<button
									className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
									type="button"
									aria-label="Zoom out"
									onClick={() => setMapZoom((z) => Math.max(z - 1, 12))}
								>
									<Minus size={16} />
								</button>
							</div>
						</div>
					</div>
				</section>
				
			</main>
			<LandingFooter />
		</div>
	)
}

export default HomePage