import LandingFooter from '../../components/layouts/LandingFooter'
import LandingNavbar from '../../components/layouts/LandingNavbar'
import { useTranslation } from 'react-i18next'
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

// Posisi tiap foto galeri.
// Mobile: kolom kanan (index 1 & 3) sama-sama turun 25px -> tidak tabrakan.
// Desktop: baris kedua naik 16px, kolom kanan turun lewat mt-6.
const STORY_IMAGE_POSITION = [
	'',
	'translate-y-[25px] md:mt-6 md:translate-y-0',
	'md:-translate-y-4',
	'translate-y-[25px] md:mt-6 md:-translate-y-4',
]

function AboutPage() {
	const { t } = useTranslation()
	const missions = Array.from({ length: 5 }, (_, index) => t(`aboutPage.missions.${index}`))
	return (
		<div className="landing-page">
			<LandingNavbar />
			<main className="bg-obc-ivory font-body text-obc-green">
			{/* ===== HERO ===== */}
			{/* Nilai maksimum clamp = ukuran di 1280x800; di layar lebih pendek hanya mengecil tipis */}
			<section className="relative flex h-[100svh] min-h-[540px] w-full items-end justify-center overflow-hidden pb-[100px] md:h-auto md:min-h-[100svh] md:items-center md:pb-8 md:pt-[clamp(112px,20svh,160px)]">
				<img
					src={heroImage}
					alt="Lapangan futsal OBC"
					className="absolute inset-0 h-full w-full object-cover"
				/>
				{/* Base overlay lembut agar foto tetap jernih & teks kontras */}
				<div className="absolute inset-0 bg-black/25" />

				{/* Shadow ujung atas */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-32 md:h-36 bg-gradient-to-b from-black/80 via-black/35 to-transparent" />

				{/* Shadow ujung bawah */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-32 md:h-36 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

				<div className="relative z-10 mx-auto max-w-[1136px] px-6 text-center text-white">
					<h1 className="font-heading text-[36px] font-bold leading-[40px] tracking-[0.5px] text-white drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] sm:text-[54px] sm:leading-[46px] md:text-[clamp(54px,8.125svh,65px)] md:leading-[clamp(54px,8.125svh,65px)]">
						{t('aboutPage.heroTitle')}
					</h1>
					<p className="mx-auto mt-2 max-w-[280px] font-heading text-[34px] font-bold leading-[38px] tracking-[0.5px] text-white drop-shadow-[0_6px_4px_rgba(0,0,0,0.25)] sm:max-w-none sm:text-[32px] sm:leading-[32px] md:mt-3 md:text-[clamp(34px,5svh,40px)] md:leading-[clamp(34px,5svh,40px)]">
						{t('aboutPage.heroSubtitle')}
					</p>
				</div>
			</section>

			{/* ===== CERITA KAMI ===== */}
			<section className="flex w-full items-center px-[50px] py-[62px] pb-[50px] md:min-h-[100svh] md:px-[60px] md:pb-10 md:pt-[clamp(80px,14svh,112px)]">
				<div className="mx-auto grid w-full max-w-[1280px] items-start gap-[30px] md:grid-cols-2 md:gap-[104px]">
					<div>
						<p className="font-heading text-[18px] font-semibold normal-case leading-[20px] tracking-normal text-black md:text-[clamp(16px,2.25svh,18px)] md:uppercase md:tracking-[1.4px]">
							{t('aboutPage.storyBadge')}
						</p>
						<h2 className="mt-4 max-w-[588px] font-heading text-[22px] font-bold leading-[32px] tracking-normal text-black md:mt-[clamp(18px,3svh,24px)] md:text-[clamp(30px,4.5svh,36px)] md:leading-[clamp(42px,6.25svh,50px)] md:tracking-[1.5px]">
							{t('aboutPage.storyTitle')}
						</h2>
						<p className="mt-5 max-w-[530px] text-justify text-[14px] font-normal leading-[25px] tracking-[0.5px] text-black md:mt-[clamp(26px,5svh,40px)] md:text-[clamp(14px,2svh,16px)] md:leading-[clamp(23px,3.25svh,26px)]">
							{t('aboutPage.storyText')}
						</p>
					</div>

					{/* Galeri 2x2. Desktop: 528px di tinggi 800, mengecil tipis di layar lebih pendek (min 440px) */}
					<div className="order-first grid grid-cols-2 gap-x-[15px] gap-y-[10px] pb-[25px] md:order-none md:w-[min(100%,max(440px,66svh))] md:justify-self-end md:gap-x-[10px] md:gap-y-[clamp(22px,3.75svh,30px)] md:pb-0">
						{STORY_IMAGES.map((img, i) => (
							<img
								key={img.src}
								src={img.src}
								alt={img.alt}
								loading="lazy"
								className={`aspect-square w-full rounded-2xl object-cover shadow-[0_4px_16px_rgba(52,49,51,0.12)] ${STORY_IMAGE_POSITION[i]}`}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ===== VISI & MISI (tidak diubah) ===== */}
			<section className="flex w-full items-center px-[50px] pb-10 md:min-h-[100svh] md:px-[50px] md:pb-10 md:pt-28">
				<div className="mx-auto w-full max-w-[1280px]">
					<h2 className="text-center font-heading text-[26px] font-semibold leading-[1.25] text-[#000000] md:text-[34px]">
						{t('aboutPage.visionMissionTitle')}
					</h2>

					<div className="mt-4 space-y-5 md:mt-10">
						{/* Kartu Visi */}
						<article className="rounded-2xl px-4 py-4 md:px-8 md:py-6">
							<div className="flex items-center gap-3 md:gap-4">
								<span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#E5E3E3] text-black shadow-[0_1px_1px_rgba(0,0,0,0.25)] md:h-11 md:w-11">
									<img src={targetArrowIcon} alt="" aria-hidden="true" className="h-[19px] w-[20px] md:h-[23px] md:w-[24px]" />
								</span>
								<h3 className="font-heading text-[16px] font-semibold text-black md:text-[22px]">{t('aboutPage.visionTitle')}</h3>
							</div>
							<p className="mt-3 text-justify text-[13px] leading-[22px] text-black md:mt-4 md:text-[15px] md:leading-[1.75]">
								{t('aboutPage.visionText')}
							</p>
						</article>

						{/* Kartu Misi */}
						<article className="rounded-2xl px-4 py-4 md:px-8 md:py-6">
							<div className="flex items-center gap-3 md:gap-4">
								<span className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#E5E3E3] text-black shadow-[0_1px_1px_rgba(0,0,0,0.25)] md:h-11 md:w-11">
									<img src={rosetteIcon} alt="" aria-hidden="true" className="h-[19px] w-[20px] md:h-[23px] md:w-[24px]" />
								</span>
								<h3 className="font-heading text-[16px] font-semibold text-black md:text-[22px]">{t('aboutPage.missionTitle')}</h3>
							</div>
							<ul className="mt-3 space-y-1 md:mt-4 md:space-y-1.5">
								{missions.map((misi) => (
									<li key={misi} className="flex gap-2 text-justify text-[13px] leading-[22px] text-black md:gap-3 md:text-[15px] md:leading-[1.75]">
										<span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-black md:mt-[11px]" aria-hidden="true" />
										<span>{misi}</span>
									</li>
								))}
							</ul>
						</article>
					</div>
				</div>
			</section>

			{/* ===== CTA: BERAGAM BISNIS ===== */}
			<section className="mt-10 w-full bg-[linear-gradient(135deg,#FFFFF7_0%,#FFFFFF_100%)] px-6 py-[50px] text-center text-[#000000] md:mt-[40px] md:py-[80px]">
				<div className="mx-auto max-w-[1280px]">
					{/* Judul: 24px di mobile, otomatis turun jadi 2 baris */}
					<h2 className="mx-auto max-w-[340px] font-['Montserrat'] text-[24px] font-semibold leading-[32px] tracking-[0.5px] text-[#000000] md:max-w-[655px] md:text-[36px] md:leading-[40px] md:tracking-[1.5px]">
						{t('aboutPage.ctaTitle')}
					</h2>
					{/* Deskripsi: 15px di mobile, rata kiri-kanan */}
					<p className="mx-auto mt-4 max-w-[848px] text-justify font-['Montserrat'] text-[15px] font-medium leading-[24px] tracking-[0.4px] text-[#000000CC] md:text-center md:text-[18px]">
						{t('aboutPage.ctaDesc')}
					</p>

					{/* Tombol: mobile lebih kecil */}
					<a
						className="group mt-6 inline-flex h-[44px] w-fit max-w-full items-center justify-between gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1 font-['Montserrat'] text-[15px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] shadow-none transition-all duration-300 hover:border-[#004000] hover:bg-[#004000] md:mt-8 md:h-[67px] md:w-[304px] md:px-4 md:py-2 md:text-[20px]"
						href="/unit-bisnis"
					>
						<span className="flex-1 whitespace-nowrap text-center text-[#1F3320] transition-all duration-300 group-hover:font-medium group-hover:tracking-[0.8px] group-hover:!text-[#CDF178]">{t('aboutPage.ctaBtn')}</span>
						<span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] transition-colors duration-300 group-hover:bg-[#CDF178] group-hover:text-[#004000] md:h-[52px] md:w-[52px]">
							<ArrowUpRight className="h-[16px] w-[16px] transition-transform duration-300 group-hover:rotate-45 md:h-[25px] md:w-[25px]" />
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