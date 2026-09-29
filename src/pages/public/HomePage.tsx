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

				{/* lipatan badge kiri atas */}
				<span
					aria-hidden="true"
					className="absolute left-[-8px] top-[22px] h-[17px] w-[8px] rounded-bl-[8px] bg-[#7FA52B]"
				/>

				{/* Label pill: mobile teks 10px & boleh 2 baris (max 80% lebar gambar), desktop tetap */}
				<span className="absolute left-[-8px] top-3 max-w-[80%] rounded-full rounded-bl-none bg-[#CDF178] px-[10px] py-[3px] font-['Montserrat'] text-[10px] font-semibold leading-[13px] tracking-[0.3px] text-[#000000] md:max-w-none md:text-[11px] md:leading-[14px] md:tracking-[0.5px]">
					{badge}
				</span>

				{/* ikon bulat kanan atas: mobile 24px */}
				<span className="absolute right-2 top-3 grid h-6 w-6 place-items-center rounded-full bg-[#CDF178] text-[#1F3320] md:h-[22px] md:w-[22px]">
					{icon}
				</span>

				{/* tombol play untuk kartu video */}
				{hasVideo && (
					<span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm">
						<Play size={18} fill="white" />
					</span>
				)}
			</div>

			{/* List fasilitas: mobile padding 12px, teks 12px, item melebar rata (justify-between); desktop tetap */}
			<ul className="flex flex-wrap justify-between gap-x-3 gap-y-1 p-3 md:justify-start md:gap-x-4 md:gap-y-1.5 md:p-4">
				{items.map((item) => (
					<li
						className="flex items-center gap-2 font-body text-[12px] font-medium text-[#1a1a1a] md:text-[15px]"
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
						className="relative flex h-[100svh] min-h-[540px] items-end bg-cover bg-[8%_77%] bg-no-repeat pb-[140px] text-white md:h-[82vh] md:min-h-[640px] md:bg-[center_72%] md:pb-[70px]"
						style={{
							backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.78) 100%), url(${billiardImage})`,
						}}
					>
					{/* Mobile: rata kiri 18px, lebar konten 374px pada layar 430px */}
					<div className="ml-[18px] w-[calc(100%-56px)] max-w-[1280px] md:mx-auto md:w-[calc(100%-48px)]">
						{/* Judul: 34px di mobile, 65px di desktop */}
						<h1 className="align-middle font-['Montserrat'] text-[34px] font-bold leading-[42px] tracking-[0.5px] text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] [text-shadow:0_0_18px_rgba(0,0,0,0.45),0px_6px_8px_0px_#00000040] text-black [text-shadow:0_0_2px_currentColor] md:text-[65px] md:leading-[80px]">Onny Barber Center</h1>

						{/* Deskripsi: 11px di mobile, 12px di desktop */}
						<p className="my-[14px] mb-3 max-w-[620px] font-['Montserrat'] text-[11px] font-semibold leading-[14px] tracking-[0.5px] text-white [text-align:justify] [text-shadow:0px_6px_4px_#00000040] md:mb-6 md:text-[12px] md:leading-[15px]">
							OBC Group adalah ekosistem usaha yang menghadirkan beragam layanan, fasilitas, dan ruang
							untuk berbagai kebutuhan. Mulai dari personal care, olahraga, hospitality, makanan &amp;
							minuman, hingga event space.
						</p>

						{/* Tombol: mobile sejajar horizontal (2 tombol + chevron di tengah) */}
						<div className="flex max-w-[520px] flex-row gap-0 md:gap-1">
							<a
								className="inline-flex flex-none items-center justify-center rounded-full border border-white bg-[#27282526] px-[10px] py-[4px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_4px_#00000040] backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-obc-green md:flex-1 md:px-6 md:py-[11px]"
								href="https://sport.obc.center"
								target="_blank"
								rel="noreferrer"
							>
								Booking OBC Sport
							</a>
							{/* Chevron tampil juga di mobile (sebelumnya hidden) */}
							<span aria-hidden="true" className="grid h-7 w-[35px] translate-y-1 place-items-center text-white/85 md:w-8">
								<svg viewBox="0 0 24 24" className="mt-3 h-6 w-6 md:mt-4 md:h-9 md:w-9" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M6 8.5L12 15.5L18 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</span>
							<a className="inline-flex flex-1 items-center justify-center rounded-full border border-white bg-[#27282526] px-4 py-[4px] text-center font-heading text-[13px] font-semibold text-white shadow-[0px_4px_4px_#00000040] backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-white/25 md:px-6 md:py-[11px]" href="#layanan">
								Jelajahi Bisnis Kami
							</a>
						</div>
					</div>

					{/* Indikator + panah: mobile di kiri bawah (5 bar), desktop tetap di kanan (4 bar) */}
					<div className="absolute bottom-[104px] left-[18px] right-[23px] flex items-center justify-between gap-4 rounded-full text-white md:bottom-[132px] md:left-auto md:right-[max(113px,calc((100%-1280px)/2))] md:justify-start md:px-3 md:py-1.5">
						<div className="flex items-center gap-[10px] md:gap-1.5" aria-label="Indikator navigasi">
							<span className="h-[7px] w-[60px] rounded-full bg-white md:h-2 md:w-19" />
							<span className="h-[7px] w-[60px] rounded-full bg-[#AEAEAE99] md:h-2 md:w-19" />
							<span className="h-[7px] w-[60px] rounded-full bg-[#AEAEAE99] md:h-2 md:w-19" />
							<span className="h-[7px] w-[60px] rounded-full bg-[#AEAEAE99] md:h-2 md:w-19" />
							{/* Bar ke-5 hanya untuk mobile */}
							<span className="h-[7px] w-[60px] rounded-full bg-[#AEAEAE99] md:hidden" />
						</div>
						<div className="flex gap-0">
							<button className="grid h-6 w-5 place-items-center text-2xl leading-none transition-opacity hover:opacity-70 md:h-10 md:w-7 md:text-3xl" type="button" aria-label="Navigasi sebelumnya">&larr;</button>
							<button className="grid h-6 w-5 place-items-center text-2xl leading-none transition-opacity hover:opacity-70 md:h-10 md:w-7 md:text-3xl" type="button" aria-label="Navigasi berikutnya">&rarr;</button>
						</div>
					</div>

					{/* Tagline: hanya tampil di mobile (tidak ada di kode asli, ditambahkan sesuai desain) */}
					{/* <p className="absolute bottom-[86px] left-[18px] font-['Montserrat'] text-[11px] font-medium tracking-[1px] text-white md:hidden">
						CONNECTING PEOPLE | CREATING EXPERIENCES
					</p> */}
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
				<section className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] gap-[28px] py-[55px] md:w-[calc(100%-48px)] md:grid-cols-[1.15fr_1fr] md:items-center md:gap-[60px] md:py-[90px]" id="tentang">
					<div>
						{/* Label: mobile title case (bukan kapital), desktop tetap kapital lewat md:uppercase */}
						<span className="mb-3 block font-['Montserrat'] text-[16px] font-semibold leading-[20px] tracking-normal text-black opacity-100 md:text-[18px] md:uppercase md:tracking-[1.4px] md:text-[#000000CC] md:opacity-80">Tentang OBC Grup</span>
						<h2 className="max-w-[480px] font-['Montserrat'] text-[22px] font-semibold leading-[32px] tracking-normal md:text-[36px] md:font-bold md:leading-[50px] md:tracking-[1.5px]">Satu Ekosistem, Beragam Layanan, Satu Tujuan</h2>
						{/* Paragraf: mobile hitam, justify, line-height 26px */}
						<p className="my-4 mb-5 max-w-[560px] font-body text-[13px] leading-[26px] text-black [text-align:justify] md:my-5 md:mb-7 md:leading-[1.7] md:text-[#6f6b6e] md:[text-align:initial]">
							OBC Group merupakan perusahaan yang berdiri sejak 7 Mei 1999 di Bandung, Jawa Barat.
							Berawal dari Onny Barber Center, OBC terus berkembang dan mengelola beragam unit usaha
							untuk menghadirkan layanan yang bermanfaat serta memenuhi beragam kebutuhan masyarakat.
							Kini, OBC menaungi berbagai bidang usaha, mulai dari personal care, olahraga, hospitality,
							makanan &amp; minuman, laundry, agribisnis, hingga ruang multifungsi.
						</p>
						{/* Visi & Misi: disembunyikan di mobile (tidak ada di desain), tampil di md ke atas */}
						<div className="mb-7 hidden max-w-[560px] grid-cols-1 gap-6 md:grid md:grid-cols-2">
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
						{/* Link: mobile lebar penuh & rata kanan, desktop tetap 600px */}
						<a className="inline-flex h-[25px] w-full items-center justify-end gap-2 font-['Montserrat'] text-right text-[16px] font-semibold leading-[25px] tracking-[0px] text-[#000000] opacity-100 transition-[gap] hover:gap-3 md:w-[600px] md:text-[19px]" href="#kontak">
							Lihat Lebih Lanjut tentang Kami <ArrowRight size={20} />
						</a>
					</div>

					{/* Gambar: mobile tampil di atas (order-first) dengan tinggi 175px; desktop tetap di kanan */}
					<div className="relative order-first h-[175px] md:order-none md:h-[480px] md:min-h-[460px]">
						{/* Pill 1: mobile di kiri atas, lebar 78% */}
						<div
							className="absolute left-0 top-0 h-[62%] w-[78%] rounded-full bg-cover bg-center shadow-[0_8px_24px_rgba(52,49,51,0.08)] md:left-[18%] md:h-[78%] md:w-[45%]"
							style={{ backgroundImage: `url(${lapangF1Image})` }}
						/>
						{/* Pill 2: mobile di kanan bawah, menumpuk di pill 1 */}
						<div
							className="absolute bottom-0 right-[7%] h-[53%] w-[78%] rounded-full border-[4px] border-[#fffff7] bg-cover bg-center shadow-[0_12px_36px_rgba(52,49,51,0.14)] md:bottom-[10%] md:right-[20%] md:h-[60%] md:w-[38%] md:border-[7px]"
							style={{ backgroundImage: `url(${lapangF2Image})` }}
						/>
						{/* Badge: mobile lebih kecil, di kanan tengah */}
						<div className="absolute left-[52%] top-[53px] inline-flex items-center gap-2 rounded-[100px] bg-[#0040001A] p-1.5 text-black backdrop-blur md:top-5 md:p-2.5">
							<span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#004000] to-[#009D00] text-white md:h-9 md:w-9">
								<img src={medalIcon} alt="" aria-hidden="true" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]" />
							</span>
							<span className="font-body text-[14px] font-bold leading-[1.2] tracking-[0%] text-black md:text-[16px]">EST 7 MEI 1999</span>
						</div>
					</div>
				</section>

				{/* ===== 3. BISNIS KAMI (UNIT BISNIS) ===== */}
				<section
					className="mx-auto w-[calc(100%-44px)] max-w-[1280px] bg-[#fffff7] py-[55px] pb-[50px] md:w-[calc(100%-48px)] md:py-[70px] md:pb-[90px]"
					id="layanan"
				>
					{/* Label: mobile title case & lebih tipis, desktop tetap kapital */}
					<span className="mb-1 block text-center font-['Montserrat'] text-[16px] font-medium normal-case leading-[20px] tracking-normal text-[#000000] md:mb-3 md:text-[18px] md:font-semibold md:uppercase md:tracking-[1.4px] md:text-[#000000CC]">
						Bisnis Kami
					</span>
					{/* Judul: mobile 22px, 2 baris (max-w 320px), desktop tetap 36px dengan tinggi 45px */}
					<h2 className="mx-auto h-auto w-full max-w-[320px] text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] tracking-normal text-[#000000] opacity-100 md:h-[45px] md:max-w-[1098px] md:text-[36px] md:font-bold md:leading-[45px] md:tracking-[1.5px]">
						Beragam Layanan dalam Satu Ekosistem
					</h2>
					{/* Garis: mobile lebar penuh & tipis, desktop tetap 812px */}
					<div
						className="mx-auto mt-4 w-full max-w-full border-t border-[#00000080] md:mt-3 md:w-[812px] md:border-t-2"
						aria-hidden="true"
					/>

					{/* Grid 1: mobile 2 kolom, gap 14px */}
					<div className="mt-6 grid grid-cols-2 gap-[14px] md:mt-9 md:gap-6 lg:grid-cols-4">
						{units.slice(0, 4).map((unit) => (
							<article
								className="relative flex flex-col items-center rounded-[14px] border border-transparent bg-white p-3 pt-[22px] text-center shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-[3px] md:rounded-[20px] md:border-[#e5e5e5] md:p-6 md:pt-8 md:shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
								key={unit.name}
							>
								{/* Ikon hati: mobile tanpa lingkaran & border, ukuran 22px */}
								<a
									className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-transparent text-[#111111] transition-colors md:right-3 md:top-3 md:h-9 md:w-9 md:border md:border-[#e5e5e5] md:bg-white md:hover:bg-[#f5f5f5]"
									href={unit.link}
									target={unit.link.startsWith('http') ? '_blank' : '_self'}
									rel="noreferrer"
									aria-label={`Buka ${unit.name}`}
								>
									<Heart className="h-[22px] w-[22px] md:h-[15px] md:w-[15px]" />
								</a>
								{/* Logo: mobile 78px, desktop 130px */}
								<div className="grid h-[78px] w-[78px] place-items-center md:h-[130px] md:w-[130px]">
									<img
										className="block max-h-[78px] max-w-[78px] object-contain md:max-h-[130px] md:max-w-[130px]"
										src={unit.image}
										alt={`Logo ${unit.name}`}
									/>
								</div>
								{/* Teks: mobile rata tengah */}
								<div className="mt-2 w-full text-center md:mt-3 md:text-left">
									<h3 className="font-heading text-[15px] font-bold text-[#111111] md:text-[16px]">
										{unit.name}
									</h3>
									<div className="mt-1.5 flex w-full items-center justify-center gap-1.5 md:mt-2.5 md:justify-between md:gap-2">
										<a
											className="inline-flex h-[20px] items-center justify-center rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-2 font-heading text-[10px] font-semibold text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#eaeaea] md:h-7 md:px-3 md:text-[11px] md:shadow-none"
											href={unit.link}
											target={unit.link.startsWith('http') ? '_blank' : '_self'}
											rel="noreferrer"
										>
											Booking Now
										</a>
										<a
											className="inline-flex shrink-0 items-center gap-1 font-heading text-[10px] font-semibold text-[#111111] transition-[gap] hover:gap-2 md:text-[11px]"
											href="#kontak"
										>
											Detail Unit <ArrowRight size={11} />
										</a>
									</div>
								</div>
							</article>
						))}
					</div>

					{/* Grid 2: mobile 2 kolom, kartu terakhir di tengah dengan lebar sama seperti kartu lain */}
					<div className="mx-auto mt-[14px] grid max-w-[calc(3*280px+2*1.5rem)] grid-cols-2 gap-[14px] md:mt-6 md:gap-6 lg:grid-cols-3">
						{units.slice(4).map((unit) => (
							<article
								className="relative flex w-full max-w-[280px] flex-col items-center justify-self-center rounded-[14px] border border-transparent bg-white p-3 pt-[22px] text-center shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-[3px] last:col-span-2 last:w-[calc(50%-7px)] md:rounded-[20px] md:border-[#e5e5e5] md:p-6 md:pt-8 md:shadow-[0_4px_12px_rgba(0,0,0,0.06)] md:hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] md:last:col-span-1 md:last:w-full"
								key={unit.name}
							>
								<a
									className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-transparent text-[#111111] transition-colors md:right-3 md:top-3 md:h-9 md:w-9 md:border md:border-[#e5e5e5] md:bg-white md:hover:bg-[#f5f5f5]"
									href={unit.link}
									target={unit.link.startsWith('http') ? '_blank' : '_self'}
									rel="noreferrer"
									aria-label={`Buka ${unit.name}`}
								>
									<Heart className="h-[22px] w-[22px] md:h-[15px] md:w-[15px]" />
								</a>
								<div className="grid h-[78px] w-[78px] place-items-center md:h-[130px] md:w-[130px]">
									<img
										className="block max-h-[78px] max-w-[78px] object-contain md:max-h-[130px] md:max-w-[130px]"
										src={unit.image}
										alt={`Logo ${unit.name}`}
									/>
								</div>
								<div className="mt-2 w-full text-center md:mt-3 md:text-left">
									<h3 className="font-heading text-[15px] font-bold text-[#111111] md:text-[16px]">
										{unit.name}
									</h3>
									<div className="mt-1.5 flex w-full items-center justify-center gap-1.5 md:mt-2.5 md:justify-between md:gap-2">
										<a
											className="inline-flex h-[20px] items-center justify-center rounded-full border border-[#e5e5e5] bg-[#f5f5f5] px-2 font-heading text-[10px] font-semibold text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#eaeaea] md:h-7 md:px-3 md:text-[11px] md:shadow-none"
											href={unit.link}
											target={unit.link.startsWith('http') ? '_blank' : '_self'}
											rel="noreferrer"
										>
											Booking Now
										</a>
										<a
											className="inline-flex shrink-0 items-center gap-1 font-heading text-[10px] font-semibold text-[#111111] transition-[gap] hover:gap-2 md:text-[11px]"
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
				<section className="bg-white px-0 py-[55px] pb-10 md:py-10 md:pb-14" id="fasilitas">
					<div className="mx-auto w-[calc(100%-40px)] max-w-[1280px] md:w-[calc(100%-48px)]">
						{/* Header: mobile teks di atas, tombol di bawah rata kanan */}
						<div className="mb-6 flex flex-col items-start justify-between gap-4 px-0 md:flex-row md:items-center md:gap-6 md:px-[15px]">
							<div>
								{/* Judul: 24px di mobile, tinggi otomatis */}
								<h2 className="h-auto w-full max-w-[1180px] font-['Montserrat'] text-[24px] font-extrabold leading-[30px] tracking-[-0.6px] text-[#000000] md:h-[40px] md:text-[36px] md:leading-[40px] md:tracking-[-0.9px]">
									OBC SPORT CENTER
								</h2>
								{/* Deskripsi: 16px di mobile, tinggi otomatis */}
								<p className="mt-3 h-auto w-full max-w-[834px] align-middle font-['Montserrat'] text-[16px] font-normal leading-[24px] tracking-[0.5px] text-justify text-[#000000] md:mt-2 md:h-[48px] md:text-[20px] md:tracking-[1px]">
									Dari pertandingan kompetitif hingga permainan santai, temukan ruang
									olahraga yang sesuai untukmu.
								</p>
							</div>
							{/* Tombol: mobile rata kanan, lebih kecil */}
							<a
								className="inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-3 self-end rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1.5 font-['Montserrat'] text-[16px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a] md:self-auto md:px-4 md:py-2 md:text-[20px]"
								href="https://sport.obc.center"
								target="_blank"
								rel="noreferrer"
							>
								<span className="flex-1 whitespace-nowrap text-center">Booking Sekarang</span>
								<span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] md:h-[52px] md:w-[52px]">
									<ArrowUpRight className="h-[18px] w-[18px] md:h-[25px] md:w-[25px]" />
								</span>
							</a>
						</div>

						{/* Baris 1: mobile 2 kolom, kartu pertama (Lapang F1) lebar penuh; sm ke atas kembali seperti semula */}
						<div className="grid grid-cols-2 gap-[22px] sm:gap-4 lg:grid-cols-[422fr_420fr_337fr] [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
							{sportRow1.map((card, i) => (
								<SportCard key={`r1-${i}`} {...card} imgHeight="h-[120px] sm:h-[181px]" />
							))}
						</div>

						{/* Baris 2: mobile 2 kolom */}
						<div className="mt-[22px] grid grid-cols-2 gap-[22px] sm:mt-4 sm:gap-4 lg:grid-cols-4">
							{sportRow2.map((card, i) => (
								<SportCard key={`r2-${i}`} {...card} imgHeight="h-[120px] sm:h-[162px]" />
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
					className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] grid-cols-2 gap-x-[10px] py-[55px] md:w-[calc(100%-48px)] md:gap-9 md:py-20"
					id="event-space"
				>
					{/* Kolom kiri */}
					<div className="contents md:block">
						{/* Gambar Lapang F1: mobile di baris gambar (kiri), tinggi 140px */}
						<div
							className="relative order-4 mt-5 h-[140px] rounded-[24px] bg-cover bg-center md:order-none md:mt-0 md:h-[440px] md:overflow-hidden md:rounded-[32px]"
							style={{ backgroundImage: `url(${lapangF1Image})` }}
						>
							{/* Label: mobile di tengah bawah gambar, desktop tetap di kanan atas. Warna sama seperti semula */}
							<span className="absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md md:bottom-auto md:left-auto md:right-3 md:top-3 md:translate-x-0 md:translate-y-0">
								<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
									<Calendar size={13} strokeWidth={2} />
								</span>
								Lapang F1
							</span>
						</div>

						{/* Pill kategori: mobile lebar penuh, di bawah gambar */}
						<div className="order-6 col-span-2 mb-4 mt-9 flex h-[48px] w-full max-w-full items-center justify-between py-2 md:my-[18px] md:w-[528px]">
							<span className="inline-flex h-[32px] w-auto min-w-0 shrink-0 items-center justify-center gap-[5px] rounded-[100px] border border-[#00000080] bg-white px-[14px] py-[5px] font-['Montserrat'] text-[16px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap md:min-w-[116px] md:px-[10px] md:text-[20px]">
								Wedding
							</span>
							<span className="inline-flex h-[32px] w-auto min-w-0 shrink-0 items-center justify-center gap-[5px] rounded-[100px] border border-[#00000080] bg-white px-[14px] py-[5px] font-['Montserrat'] text-[16px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap md:min-w-[116px] md:px-[10px] md:text-[20px]">
								Gathering
							</span>
							<span className="inline-flex h-[32px] w-auto min-w-0 shrink-0 items-center justify-center gap-[5px] rounded-[100px] border border-[#00000080] bg-white px-[14px] py-[5px] font-['Montserrat'] text-[16px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap md:min-w-[116px] md:px-[10px] md:text-[20px]">
								Acara Lainnya
							</span>
						</div>

						{/* Tombol: mobile lebar penuh, ikon di kiri teks. Warna sama seperti semula (hijau muda + ikon hijau tua) */}
						<a
							className="relative order-7 col-span-2 flex h-[46px] w-full max-w-full flex-row-reverse items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-[18px] py-[8px] font-['Montserrat'] text-[17px] font-semibold leading-none tracking-[0.08em] text-[#000000] shadow-[0px_5px_4px_0px_#00000040] transition-colors hover:bg-[#c8ec60] md:h-[69.33px] md:w-[528px] md:flex-row md:text-[19px]"
							href="https://wa.me/628886070900"
							target="_blank"
							rel="noreferrer"
						>
							<span className="whitespace-nowrap text-center md:hidden">Hubungi Kami Untuk Sewa</span>
							<span className="hidden whitespace-nowrap text-center md:inline">AJUKAN SEWA</span>
							<span className="grid h-9 w-9 place-items-center rounded-full bg-[#004000] text-[#CDF178]">
								<WhatsAppLogo className="h-6 w-6 shrink-0" />
							</span>
						</a>
					</div>

					{/* Kolom kanan */}
					<div className="contents md:block">
						{/* Badge: warna sama seperti semula */}
						<span className="order-1 col-span-2 inline-flex h-[32px] w-[208px] items-center justify-center gap-[10px] justify-self-start rounded-[100px] bg-[#ffffff33] px-[20px] py-0 font-['Montserrat'] text-[16px] font-medium normal-case leading-[100%] tracking-[1%] text-[#000000] whitespace-nowrap shadow-[0px_4px_4px_0px_#00000040,0px_2px_2px_0px_#00000040_inset] md:h-[40px] md:w-[271px] md:px-[30px] md:py-4 md:text-[20px] md:uppercase">
							Gedung multifungsi
						</span>
						{/* Judul: mobile 22px, tinggi otomatis */}
						<h2 className="order-2 col-span-2 mb-3 mt-4 h-auto w-full max-w-full font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] md:mb-2 md:mt-3 md:h-[90px] md:w-[610px] md:text-[40px] md:leading-[45px] md:tracking-[1px]">
							Ruang Serbaguna untuk Berbagai Acara
						</h2>
						{/* Deskripsi: mobile 14px, tinggi otomatis */}
						<p className="order-3 col-span-2 h-auto w-full max-w-full font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-[#000000] md:h-[60px] md:w-[610px] md:text-[20px] md:leading-[30px]">
							Lapang F1 &amp; F2 hadir sebagai ruang fleksibel untuk wedding,
							gathering, dan berbagai kebutuhan acara lainnya.
						</p>

						{/* Gambar Lapang F2: mobile di baris gambar (kanan), tinggi 140px */}
						<div
							className="relative order-5 mt-5 h-[140px] rounded-[24px] bg-cover bg-center md:order-none md:mt-[18px] md:h-[400px] md:overflow-hidden md:rounded-[32px]"
							style={{ backgroundImage: `url(${lapangF2Image})` }}
						>
							<span className="absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md md:bottom-auto md:left-3 md:top-3 md:translate-x-0 md:translate-y-0">
								<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
									<Calendar size={13} strokeWidth={2} />
								</span>
								Lapang F2
							</span>
						</div>
					</div>
				</section>

				{/* ===== 7. GALERI ===== */}
				<section className="mx-auto w-[calc(100%-60px)] max-w-[1280px] py-[55px] pb-[50px] md:w-[calc(100%-48px)] md:py-[30px] md:pb-[70px]" id="galeri">
					{/* Header: mobile teks di atas, tombol di bawah rata kanan */}
					<div className="mb-5 flex flex-col items-start justify-between gap-4 md:mb-10 md:flex-row md:items-center md:gap-6">
						<div>
							{/* Label: mobile title case, desktop tetap kapital */}
							<span className="block font-['Montserrat'] text-[16px] font-semibold normal-case leading-[20px] tracking-normal text-[#333333] md:uppercase md:tracking-[1.6px]">
								Galeri
							</span>
							{/* Judul: 22px di mobile */}
							<h2 className="mt-3 font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-black md:mt-1 md:text-[36px] md:leading-[40px] md:tracking-[1.5px]">
								Momen yang Menjadi Bagian dari OBC
							</h2>
							{/* Deskripsi: 14px di mobile */}
							<p className="mt-3 font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.5px] text-black md:mt-2 md:text-[20px] md:leading-[32px] md:tracking-[0.72px]">
								Jelajahi berbagai momen, fasilitas, dan aktivitas dari seluruh unit usaha OBC.
							</p>
						</div>

						{/* Tombol: mobile lebih kecil & rata kanan, warna tetap */}
						<a
							className="inline-flex h-[40px] w-fit shrink-0 items-center justify-between gap-3 self-end rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-1 pl-4 pr-1 font-['Montserrat'] text-[15px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a] md:h-[67px] md:w-[304px] md:gap-4 md:self-auto md:py-2 md:pl-6 md:pr-2 md:text-[20px]"
							href="#galeri"
						>
							<span className="whitespace-nowrap text-center md:w-[195px]">Lihat Semua Galeri</span>
							<span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] md:h-[52px] md:w-[52px]">
								<ArrowUpRight className="h-[16px] w-[16px] md:h-[25px] md:w-[25px]" />
							</span>
						</a>
					</div>

					{/* Grid: mobile 2 kolom x 2 baris (hanya 4 gambar pertama), desktop tetap 4 kolom (275 / 100 / 275) */}
					<div className="grid grid-cols-2 gap-[15px] md:grid-cols-4 md:grid-rows-[275px_100px_275px] md:gap-[25px] md:px-[27px] [&>*:nth-child(n+5)]:hidden md:[&>*:nth-child(n+5)]:block">
						{GALLERY_ITEMS.map((item) => (
							<button
								key={item.label}
								className={`relative h-[140px] cursor-pointer overflow-hidden rounded-[20px] border-0 bg-cover bg-center p-0 transition-transform hover:scale-[1.01] md:h-auto ${item.className}`}
								style={{ backgroundImage: `url(${item.image})` }}
								type="button"
								aria-label={`Buka gambar ${item.label}`}
								onClick={() => setSelectedGalleryImage(item.image)}
							>
								{/* Label pil: disembunyikan di mobile (tidak ada di desain), tampil di md ke atas */}
								<span className="absolute bottom-[6px] left-[8px] hidden rounded-full bg-white px-[22px] py-[8px] font-['Montserrat'] text-[14px] font-normal leading-[22px] text-[#222222] md:block md:text-[17px]">
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
				<section className="py-[40px] md:py-[60px]">
					<div className="mx-auto flex w-[calc(100%-40px)] max-w-[1280px] flex-col md:block md:w-[calc(100%-48px)]">
						{/* Header: mobile di-"contents" agar anak-anaknya bisa diurutkan dengan order-*; desktop flex seperti semula */}
						<div className="contents md:flex md:flex-wrap md:items-start md:justify-between md:gap-6">
							{/* Judul: mobile rata tengah. md:order-none supaya urutan desktop tetap (judul di kiri) */}
							<div className="order-1 flex w-full flex-col items-center justify-start pt-[4px] text-center md:order-none md:w-auto md:items-start md:text-left">
								<span className="mb-2 flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase tracking-[1px] text-[#000000CC] md:text-[13px] md:tracking-[1.4px]">
									TESTIMONI
								</span>
								<h2 className="h-auto min-h-[40px] w-full min-w-0 max-w-[520px] gap-1 py-1 font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-[0px] text-[#000000] md:min-w-[274px] md:text-[46px] md:font-medium md:leading-[46px]">
									Apa Kata Mereka
									<br />
									Tentang OBC Group
								</h2>
							</div>

							<div className="contents md:flex md:flex-col md:items-end md:gap-3 md:text-right">
								{/* Deskripsi: mobile rata tengah, 13px */}
								<p className="order-2 mt-1 max-w-full text-center font-['Montserrat'] text-[13px] leading-[1.5] text-[#4b5563] md:order-none md:mt-0 md:max-w-[420px] md:text-right md:text-[15px]">
									Pengalaman Menginap, Berolahraga, dan Beraktivitas di OBC Group
								</p>
								{/* Panah: mobile pindah ke bawah carousel, rata kanan, lebih kecil */}
								<div className="order-4 mt-4 flex gap-2.5 self-end md:order-none md:mt-0 md:self-auto">
									<button
										className="grid h-[30px] w-[30px] place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] md:h-[50px] md:w-[50px]"
										type="button"
										aria-label="Testimoni sebelumnya"
										onClick={() => goToTestimonial(-1)}
									>
										<ChevronLeft className="h-4 w-4 translate-x-[-1px] md:h-5 md:w-5" />
									</button>
									<button
										className="grid h-[30px] w-[30px] place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] md:h-[50px] md:w-[50px]"
										type="button"
										aria-label="Testimoni berikutnya"
										onClick={() => goToTestimonial(1)}
									>
										<ChevronRight className="h-4 w-4 translate-x-[1px] md:h-5 md:w-5" />
									</button>
								</div>
							</div>
						</div>

						{/* Carousel: mobile melebar sampai tepi layar (-mx-5) supaya kartu kiri/kanan terlihat sebagian */}
						<div className="relative order-3 -mx-5 mt-6 h-[460px] overflow-hidden md:order-none md:mx-0 md:mt-8 md:h-[470px]">
							{testimonials.map((t, i) => {
								const offset = ((i - activeTestimonial + testimonials.length) % testimonials.length)
								const normalizedOffset = offset > testimonials.length / 2 ? offset - testimonials.length : offset
								const isVisible = Math.abs(normalizedOffset) <= 2
								if (!isVisible) return null

								const isActive = normalizedOffset === 0
								const scale = isActive ? 1 : 0.9
								const opacity = isActive ? 1 : 0.55
								const blur = isActive ? 0 : 0.2

								return (
									<article
										key={t.name + i}
										// --step = jarak antar kartu: 338px di mobile, 360px di desktop
										// Lebar & tinggi kartu dipindah dari inline style ke class supaya bisa responsive
										className={`absolute left-1/2 top-3 -translate-x-1/2 rounded-[25px] border border-[#ececec] bg-[#ffffff] p-[26px] text-left shadow-[0_5px_80px_0_#EEEEE7] transition-all duration-500 ease-out [--step:338px] md:[--step:360px] w-[318px] md:w-[344px] ${isActive ? 'h-[437px] md:h-[451px]' : 'h-[391px]'}`}
										style={{
											transform: `translateX(calc(${normalizedOffset} * var(--step))) scale(${scale})`,
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

										<Quote className="mt-3 rotate-180 text-[#d1d5db]" width={36} height={26} preserveAspectRatio="none" fill="currentColor" strokeWidth={0} />
										{/* Teks: mobile lebar penuh kartu, desktop tetap 292px */}
										<p className="mt-3 h-[210px] w-full font-['Montserrat'] text-[18px] font-normal leading-[30px] tracking-[0px] text-[#000000] md:w-[292px]">{t.text}</p>

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

						{/* Tombol ulasan: mobile lebar penuh, tinggi 44px; desktop tetap 438px */}
						<div className="order-5 mt-8 flex justify-center md:order-none md:mt-10">
							<a
								className="flex h-[44px] w-full items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1 font-['Montserrat'] text-[16px] font-semibold leading-[17px] tracking-[0px] text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a] md:h-[69.33px] md:w-[438px] md:px-4 md:py-[8px] md:text-[17px]"
								href="#kontak"
							>
								<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#004000] text-[#CDF178] md:h-9 md:w-9">
									<img src={reviewIcon} alt="" aria-hidden="true" className="h-[18px] w-[17px]" />
								</span>
								<span className="block h-[17px] w-auto text-center leading-[17px] md:w-[332px]">
									Tulis Ulasan Pengalaman Kamu Disini
								</span>
							</a>
						</div>
					</div>
				</section>

				{/* ===== 9. LOKASI OBC GROUP ===== */}
				<section
					className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] items-start gap-[28px] py-[40px] pb-[50px] md:w-[calc(100%-48px)] md:grid-cols-[1fr_1.15fr] md:gap-15 md:pb-20"
					id="kontak"
				>
					{/* Panel kiri: daftar lokasi */}
					<div>
						{/* Label: min-w hanya untuk desktop supaya tidak melebar di mobile */}
						<span className="mb-3 block h-[20px] w-full min-w-0 max-w-[856px] font-['Montserrat'] text-[13px] font-semibold uppercase leading-[20px] tracking-[2px] text-[#000000CC] md:min-w-[412px] md:text-[18px] md:tracking-[1.4px]">
							LOKASI OBC GROUP
						</span>
						{/* Judul: 22px di mobile */}
						<h2 className="h-auto min-h-[28px] w-full max-w-[527px] font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] md:text-[24px] md:leading-[27.5px] md:tracking-[1.5px]">
							Temukan OBC di Berbagai Lokasi
						</h2>
						{/* Deskripsi: 14px di mobile */}
						<p className="my-3 mb-5 h-auto min-h-[43px] w-full max-w-[527px] font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-justify text-[#000000] md:text-[13px] md:leading-[21.13px]">
							Jelajahi berbagai destinasi OBC untuk menginap, berolahraga,
							bersantai, dan menikmati berbagai layanan kami.
						</p>

						{/* Filter tabs: mobile gap lebih kecil, teks 12px */}
						<div className="mb-4 flex flex-wrap gap-x-[12px] gap-y-[10px] md:gap-4.5">
							{locationCategories.map((cat) => (
								<button
									key={cat}
									type="button"
									className={`rounded-full px-4 py-1.5 font-heading text-[12px] font-medium transition-colors md:text-[13px] ${
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
								// Mobile: tiap lokasi jadi kartu dengan border (warna border sama seperti semula); desktop: garis atas seperti semula
								<div
									className="mt-3 rounded-[6px] border border-[#e5e5e5] px-3 py-4 first:mt-0 md:mt-0 md:rounded-none md:border-0 md:border-t md:px-0"
									key={i}
								>
									{/* Alamat + tombol lihat lokasi: mobile ditumpuk (alamat di atas, tombol di bawah rata kanan) */}
									<div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-0">
										<span className="inline-flex h-auto min-h-[21px] w-full max-w-full items-center gap-2 align-middle font-['Montserrat'] text-[17px] font-semibold leading-[22px] tracking-normal text-[#000000] md:w-[264px] md:text-[15px] md:leading-[20.63px]">
											<span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[2px] bg-[#EDEDED]">
												<img src={locationIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
											</span> {loc.address}
										</span>
										<a
											href="https://maps.google.com"
											target="_blank"
											rel="noreferrer"
											className="inline-flex items-center gap-1.5 self-end font-heading text-[13px] font-semibold text-[#111111] md:self-auto"
										>
											Lihat Lokasi
											<span className="grid h-6 w-6 place-items-center">
												<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
											</span>
										</a>
									</div>

									{loc.units.length > 1 ? (
										<div className="my-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-[13px] font-semibold text-[#111111] md:gap-x-2 md:text-[15px]">
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

									{/* Info jam/check-in */}
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

					{/* Panel kanan: peta. Mobile lebar penuh, tinggi menyesuaikan isi */}
					<div className="box-border h-auto w-full max-w-full overflow-hidden rounded-[8px] bg-[#EDEDED80] p-[14px] shadow-[0px_1px_2px_0px_#0000000D] md:h-[580px] md:w-[613px]">
						{/* Header peta */}
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

						{/* Area peta: tinggi 210px di mobile, 500px di desktop */}
						<div className="relative h-[210px] w-full overflow-hidden bg-[#f2f4f8] md:h-[500px]">
							<iframe
								className="h-full w-full border-0"
								title="Peta Lokasi OBC Group di Rancabentang"
								src={`https://www.google.com/maps?q=Jl.+Rancabentang+No.+3A,+Bandung&output=embed&z=${mapZoom}`}
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>

							{/* Kontrol zoom */}
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