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
			<section className="relative flex h-[420px] items-center justify-center overflow-hidden md:h-[640px]">
				<img
					src={heroImage}
					alt="Lapangan futsal OBC"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				{/* Overlay gelap supaya teks tetap terbaca */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/50" />

				<div className="relative z-10 mx-auto max-w-[1136px] px-6 text-center text-white">
					<h1 className="font-heading text-[42px] font-bold leading-[46px] tracking-[0.5px] text-white drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] sm:text-[54px] md:text-[65px] md:leading-[65px]">
						Tentang Kami
					</h1>
					<p className="mt-3 font-heading text-[28px] font-bold leading-[32px] tracking-[0.5px] text-white drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] sm:text-[32px] md:text-[40px] md:leading-[40px]">
						Onny Barber Center Group
					</p>
					<p className="mt-3 font-body text-[11px] font-medium uppercase leading-[15px] tracking-[1px] text-white sm:text-[12px] md:text-[13px]">
						Connecting People | Creating Experiences
					</p>
				</div>
			</section>

			
			{/* ===== CERITA KAMI ===== */}
			<section className="mx-auto max-w-[1280px] px-6 py-16 md:px-[60px] md:py-[100px]">
				<div className="grid items-start gap-12 md:grid-cols-2 md:gap-[104px]">
					{/* Kolom teks */}
					<div>
							<p className="font-heading text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-black">
								Cerita Kami
							</p>
							<h2 className="mt-6 max-w-[588px] font-heading text-[36px] font-bold leading-[50px] tracking-[1.5px] text-black">
								Satu Ekosistem, Beragam Layanan, Satu Tujuan
							</h2>
							<p className="mt-10 max-w-[530px] text-justify text-[16px] font-normal leading-[26px] tracking-[0.5px] text-black">
							mulai dikenal luas sebagai destinasi wisata di Indonesia pada era 1990-an, PT.Onny Barber
							Center (OBC) resmi berdiri pada 7 Mei 1999 di Jawa Barat, tepatnya di kota Bandung. Onny
							Barber Center (OBC) hadir sebagai perusahaan yang bergerak di bidang jasa, yang berdedikasi
							untuk memberikan layanan yang bermanfaat bagi masyarakat dan memenuhi kebutuhan publik
							secara luas. Selain itu PT.OBC juga mengelola sejumlah unit bisnis yang semakin memperluas
							layanan dan cakupan usaha perusahaan.
						</p>
					</div>

					{/* Kolom galeri 2x2, kolom kanan turun sedikit (staggered) */}
					<div className="grid grid-cols-2 gap-x-[10px] gap-y-[30px]">
						{STORY_IMAGES.map((img, i) => (
							<img
								key={img.src}
								src={img.src}
								alt={img.alt}
								loading="lazy"
								className={`aspect-square w-full rounded-2xl object-cover shadow-[0_4px_16px_rgba(52,49,51,0.12)] ${
									i % 2 === 1 ? 'mt-6' : ''
								}`}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ===== VISI & MISI ===== */}
			<section className="mx-auto max-w-[1280px] px-6 pb-16 md:px-[50px] md:pb-[40px]">
				<h2 className="text-center font-heading text-[30px] font-semibold leading-[1.25] text-[#000000] md:text-[34px]">
					Visi &amp; Misi OBC Group
				</h2>

				<div className="mt-10 space-y-5">
					{/* Kartu Visi */}
					<article className="rounded-2xl px-8 py-6">
						<div className="flex items-center gap-4">
							<span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E5E3E3] text-black shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
								<img src={targetArrowIcon} alt="" aria-hidden="true" className="h-[23px] w-[24px]" />
							</span>
							<h3 className="font-heading text-[22px] font-semibold text-black">Visi Kami</h3>
						</div>
						<p className="mt-4 text-justify text-[15px] leading-[1.75] text-black">
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
					<article className="rounded-2xl px-8 py-6">
						<div className="flex items-center gap-4">
							<span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E5E3E3] text-black shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
								<img src={rosetteIcon} alt="" aria-hidden="true" className="h-[23px] w-[24px]" />
							</span>
							<h3 className="font-heading text-[22px] font-semibold text-black">Misi Kami</h3>
						</div>
						<ul className="mt-4 space-y-1.5">
							{MISSIONS.map((misi) => (
								<li key={misi} className="flex gap-3 text-justify text-[15px] leading-[1.75] text-black">
									<span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-black" aria-hidden="true" />
									<span>{misi}</span>
								</li>
							))}
						</ul>
					</article>
				</div>
			</section>

			{/* ===== CTA: BERAGAM BISNIS ===== */}
			<section className="mt-16 w-full bg-[linear-gradient(135deg,#FFFFF7_0%,#FFFFFF_100%)] px-6 py-[80px] text-center text-[#000000] md:mt-[40px]">
				<div className="mx-auto max-w-[1280px]">
					<h2 className="mx-auto max-w-[655px] font-['Montserrat'] text-[36px] font-semibold leading-[40px] tracking-[1.5px] text-[#000000]">
						Beragam Bisnis, Satu OBC Group
					</h2>
					<p className="mx-auto mt-4 max-w-[848px] text-center font-['Montserrat'] text-[18px] font-medium leading-[24px] tracking-[0.4px] text-[#000000CC]">
						Jelajahi berbagai unit bisnis yang hadir untuk memenuhi beragam kebutuhan dan menciptakan
						pengalaman bagi masyarakat.
					</p>

					<a
						className="mt-8 inline-flex h-[67px] w-[304px] max-w-full items-center justify-between gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-4 py-2 font-['Montserrat'] text-[20px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] shadow-none transition-colors hover:bg-[#c2e86a]"
						href="/unit-bisnis"
					>
						<span className="flex-1 whitespace-nowrap text-center text-[#1F3320]">Jelajahi Bisnis Kami</span>
						<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
							<ArrowUpRight size={25} />
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

