import LandingFooter from '../../components/layouts/LandingFooter'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import heroImage from '../../assets/layanan/Lapang F1.png'
import storyImageOne from '../../assets/layanan/galeri-cones.png'
import storyImageTwo from '../../assets/layanan/Lapang F2.png'
import storyImageThree from '../../assets/layanan/galeri-villa-1.png'
import storyImageFour from '../../assets/layanan/galeri-villa-2.png'
import { ArrowUpRight } from 'lucide-react'
import targetArrowIcon from '../../assets/icon/iconstack.io - (Target Arrow).svg'
import rosetteIcon from '../../assets/icon/iconstack.io - (Rosette Discount Check).svg'

// Foto galeri "Cerita Kami" (ganti path sesuai aset di /public atau src/assets)
const STORY_IMAGES: { src: string; alt: string }[] = [
	{ src: storyImageOne, alt: 'Perlengkapan olahraga di unit layanan OBC' },
	{ src: storyImageTwo, alt: 'Lapangan futsal OBC' },
	{ src: storyImageThree, alt: 'Area villa OBC' },
	{ src: storyImageFour, alt: 'Fasilitas villa OBC' },
]

const MISSIONS: string[] = [
	'Menghadirkan layanan prima yang aman, nyaman, berkualitas, dan terjangkau di seluruh unit OBC Group.',
	'Membangun sinergi antarunit sebagai satu jaringan usaha terpadu yang memberi kemudahan, nilai tambah, dan layanan satu pintu bagi pelanggan.',
	'Memberdayakan saudara dan masyarakat sekitar,UMKM, petani, pelaku lokal, dan komunitas melalui akses pasar, kemitraan, serta promosi berkelanjutan.',
	'Mengembangkan SDM yang profesional, berintegritas, dan Menjiwai dalam memberikan pelayanan.',
	'Menjalankan usaha secara inovatif, etis, berkelanjutan, dan bertanggung jawab sosial.',
]

function AboutPage() {
	return (
		<div className="landing-page">
			<LandingNavbar />
			<main className="bg-obc-ivory font-body text-obc-green">
			{/* ===== HERO ===== */}
			<section className="relative flex h-[100svh] min-h-[540px] w-full items-end justify-center overflow-hidden pb-[100px] md:h-auto md:min-h-screen md:items-center md:pb-12 md:pt-16">
				<img
					src={heroImage}
					alt="Lapangan futsal OBC"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				{/* Base overlay lembut agar foto tetap jernih & teks kontras */}
				<div className="absolute inset-0 bg-black/25" />

				{/* Shadow ujung atas (tidak terlalu lebar) */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-32 md:h-36 bg-gradient-to-b from-black/80 via-black/35 to-transparent" />

				{/* Shadow ujung bawah (tidak terlalu lebar) */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32 md:h-36 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

				<div className="relative z-10 mx-auto max-w-[1136px] px-6 text-center text-white">
					{/* Judul: 36px di mobile */}
					<h1 className="font-heading text-[36px] font-bold leading-[40px] tracking-[0.5px] text-white drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] sm:text-[54px] sm:leading-[46px] md:text-[65px] md:leading-[65px]">
						Tentang Kami
					</h1>
					{/* Subjudul: mobile dibatasi lebarnya supaya turun jadi 2 baris ("Onny Barber / Center Group") */}
					<p className="mx-auto mt-2 max-w-[280px] font-heading text-[34px] font-bold leading-[38px] tracking-[0.5px] text-white drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] sm:max-w-none sm:text-[32px] sm:leading-[32px] md:mt-3 md:text-[40px] md:leading-[40px]">
						Onny Barber Center Group
					</p>
					{/* <p className="mt-2 font-body text-[12px] font-medium uppercase leading-[15px] tracking-[1px] text-white md:mt-3 md:text-[13px]">
						Connecting People | Creating Experiences
					</p> */}
				</div>
			</section>

			{/* ===== CERITA KAMI ===== */}
			<section className="mx-auto max-w-[1280px] px-[50px] py-[62px] pb-[50px] md:px-[60px] md:py-[100px]">
				<div className="grid items-start gap-[30px] md:grid-cols-2 md:gap-[104px]">
					{/* Kolom teks: di mobile tampil setelah galeri */}
					<div>
						{/* Label: mobile title case, desktop tetap kapital */}
						<p className="font-heading text-[18px] font-semibold normal-case leading-[20px] tracking-normal text-black md:uppercase md:tracking-[1.4px]">
							Cerita Kami
						</p>
						{/* Judul: 22px di mobile */}
						<h2 className="mt-4 max-w-[588px] font-heading text-[22px] font-bold leading-[32px] tracking-normal text-black md:mt-6 md:text-[36px] md:leading-[50px] md:tracking-[1.5px]">
							Satu Ekosistem, Beragam Layanan, Satu Tujuan
						</h2>
						{/* Paragraf: 14px di mobile */}
						<p className="mt-5 max-w-[530px] text-justify text-[14px] font-normal leading-[25px] tracking-[0.5px] text-black md:mt-10 md:text-[16px] md:leading-[26px]">
							mulai dikenal luas sebagai destinasi wisata di Indonesia pada era 1990-an, PT.Onny Barber
							Center (OBC) resmi berdiri pada 7 Mei 1999 di Jawa Barat, tepatnya di kota Bandung. Onny
							Barber Center (OBC) hadir sebagai perusahaan yang bergerak di bidang jasa, yang berdedikasi
							untuk memberikan layanan yang bermanfaat bagi masyarakat dan memenuhi kebutuhan publik
							secara luas. Selain itu PT.OBC juga mengelola sejumlah unit bisnis yang semakin memperluas
							layanan dan cakupan usaha perusahaan.
						</p>
					</div>

					{/* Galeri 2x2: mobile tampil di atas (order-first), kolom kanan turun 25px lewat translate */}
					<div className="order-first grid grid-cols-2 gap-x-[15px] gap-y-[10px] pb-[25px] md:order-none md:gap-x-[10px] md:gap-y-[30px] md:pb-0">
						{STORY_IMAGES.map((img, i) => (
							<img
								key={img.src}
								src={img.src}
								alt={img.alt}
								loading="lazy"
								className={`aspect-square w-full rounded-2xl object-cover shadow-[0_4px_16px_rgba(52,49,51,0.12)] ${
									i % 2 === 1 ? 'translate-y-[25px] md:mt-6 md:translate-y-0' : ''
								}`}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ===== VISI & MISI ===== */}
			<section className="mx-auto max-w-[1280px] px-[50px] pb-10 md:px-[50px] md:pb-[40px]">
				{/* Judul: 26px di mobile */}
				<h2 className="text-center font-heading text-[26px] font-semibold leading-[1.25] text-[#000000] md:text-[34px]">
					Visi &amp; Misi OBC Group
				</h2>

				<div className="mt-4 space-y-5 md:mt-10">
					{/* Kartu Visi: padding lebih kecil di mobile */}
					<article className="rounded-2xl px-4 py-4 md:px-8 md:py-6">
						<div className="flex items-center gap-3 md:gap-4">
							<span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#E5E3E3] text-black shadow-[0_1px_1px_rgba(0,0,0,0.25)] md:h-11 md:w-11">
								<img src={targetArrowIcon} alt="" aria-hidden="true" className="h-[19px] w-[20px] md:h-[23px] md:w-[24px]" />
							</span>
							<h3 className="font-heading text-[16px] font-semibold text-black md:text-[22px]">Visi Kami</h3>
						</div>
						<p className="mt-3 text-justify text-[13px] leading-[22px] text-black md:mt-4 md:text-[15px] md:leading-[1.75]">
							OBC sebagai wadah untuk membantu keluarga dan juga masyarakat sekitar agar bisa mandiri
							secara financial dan berkembang menjadi SDM yang berkualitas. OBC Menjadi platform layanan
							terintegrasi yang terdepan, terpercaya dan berkelanjutan di Indonesia, yang menghadirkan
							pengalaman hidup lebih nyaman, sehat, dan bermakna melalui beragam unit usaha OBC Group yang
							mencakup layanan hospitality, rekreasi, olahraga, kuliner, laundry, dan agribisnis,
							sekaligus menjadi penggerak pertumbuhan ekonomi dengan memberdayakan UMKM, pelaku lokal, dan
							potensi daerah Bandung.
						</p>
					</article>

					{/* Kartu Misi */}
					<article className="rounded-2xl px-4 py-4 md:px-8 md:py-6">
						<div className="flex items-center gap-3 md:gap-4">
							<span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#E5E3E3] text-black shadow-[0_1px_1px_rgba(0,0,0,0.25)] md:h-11 md:w-11">
								<img src={rosetteIcon} alt="" aria-hidden="true" className="h-[19px] w-[20px] md:h-[23px] md:w-[24px]" />
							</span>
							<h3 className="font-heading text-[16px] font-semibold text-black md:text-[22px]">Misi Kami</h3>
						</div>
						<ul className="mt-3 space-y-1 md:mt-4 md:space-y-1.5">
							{MISSIONS.map((misi) => (
								<li key={misi} className="flex gap-2 text-justify text-[13px] leading-[22px] text-black md:gap-3 md:text-[15px] md:leading-[1.75]">
									<span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-black md:mt-[11px]" aria-hidden="true" />
									<span>{misi}</span>
								</li>
							))}
						</ul>
					</article>
				</div>
			</section>

			{/* ===== CTA: BERAGAM BISNIS ===== */}
			<section className="mt-10 w-full bg-[linear-gradient(135deg,#FFFFF7_0%,#FFFFFF_100%)] px-6 py-[50px] text-center text-[#000000] md:mt-[40px] md:py-[80px]">
				<div className="mx-auto max-w-[1280px]">
					{/* Judul: 24px di mobile, otomatis turun jadi 2 baris */}
					<h2 className="mx-auto max-w-[340px] font-['Montserrat'] text-[24px] font-semibold leading-[32px] tracking-[0.5px] text-[#000000] md:max-w-[655px] md:text-[36px] md:leading-[40px] md:tracking-[1.5px]">
						Beragam Bisnis, Satu OBC Group
					</h2>
					{/* Deskripsi: 15px di mobile, rata kiri-kanan */}
					<p className="mx-auto mt-4 max-w-[848px] text-justify font-['Montserrat'] text-[15px] font-medium leading-[24px] tracking-[0.4px] text-[#000000CC] md:text-center md:text-[18px]">
						Jelajahi berbagai unit bisnis yang hadir untuk memenuhi beragam kebutuhan dan menciptakan
						pengalaman bagi masyarakat.
					</p>

					{/* Tombol: mobile lebih kecil */}
					<a
						className="mt-6 inline-flex h-[44px] w-fit max-w-full items-center justify-between gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1 font-['Montserrat'] text-[15px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] shadow-none transition-colors hover:bg-[#c2e86a] md:mt-8 md:h-[67px] md:w-[304px] md:px-4 md:py-2 md:text-[20px]"
						href="/unit-bisnis"
					>
						<span className="flex-1 whitespace-nowrap text-center text-[#1F3320]">Jelajahi Bisnis Kami</span>
						<span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] md:h-[52px] md:w-[52px]">
							<ArrowUpRight className="h-[16px] w-[16px] md:h-[25px] md:w-[25px]" />
						</span>
					</a>
				</div>
			</section>
			</main>
			<LandingFooter />
		</div>
	)
}

export default AboutPage