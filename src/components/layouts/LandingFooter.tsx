import TransitionLink from '../common/TransitionLink'
import { scrollToContact } from '../common/scrollToContact'
import { ArrowUp, Globe, Headphones, Mail, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/logo/obclogo.webp'
import lapangF1Image from '../../assets/layanan/Lapang F1.webp'
import whatsappIcon from '../../assets/icon/whatsapp2.svg'

const NAVIGASI_LINKS = [
	{ label: 'nav.home', to: '/' },
	{ label: 'nav.about', to: '/tentang-kami' },
	{ label: 'nav.businessUnits', to: '/unit-bisnis' },
	{ label: 'nav.sportCenter', to: '/unit-bisnis/sport-center' },
	{ label: 'nav.multipurpose', to: '/unit-bisnis/gedung-multifungsi' },
	{ label: 'nav.gallery', to: '/galeri' },
	{ label: 'nav.testimonials', to: '/testimoni' },
	{ label: 'nav.contact', to: '#kontak' },
]

const UNIT_LINKS = [
	{ label: 'units.sportCenter.title', to: '/unit-bisnis' },
	{ label: 'units.guestHouse.title', to: '/unit-bisnis/guest-house' },
	{ label: 'units.villa.title', to: '/unit-bisnis/villa' },
	{ label: 'units.laundry.title', to: '/unit-bisnis/laundry' },
	{ label: 'units.foodCourt.title', to: '/unit-bisnis/food-court' },
	{ label: 'units.coffee.title', to: '/unit-bisnis/coffee' },
	{ label: 'units.agribisnis.title', to: '/unit-bisnis/agribisnis' },
]

/* Data kontak — ganti dengan data resmi OBC kalau sudah tersedia dari admin/CMS. */
const CONTACT = {
	email: 'obc.managementbdg@gmail.com',
	whatsapp: 'https://wa.me/6288860709000',
	instagram: 'https://instagram.com/obcgroup.bdg',
	tiktok: 'https://www.tiktok.com/@obcgroup.bdg',
	address: 'Jl. Rancabentang, No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat 40142',
	maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Jl. Rancabentang, No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat 40142')}`,
}

function InstagramLogo({ className = 'h-[16px] w-[16px]' }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-none stroke-current stroke-[1.8]`}>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
		</svg>
	)
}

function TikTokLogo({ className = 'h-[14px] w-[14px]' }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={`${className} fill-current`}>
			<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
		</svg>
	)
}

function WhatsAppSocialIcon({ className = 'h-[16px] w-[16px]' }: { className?: string }) {
	return (
		<svg viewBox="0 0 33 33" aria-hidden="true" className={`${className} fill-current`}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M25.8199 23.0456C25.4266 24.159 23.8631 25.08 22.6163 25.3494C21.7627 25.5306 20.6497 25.6739 16.8994 24.1199C12.6872 22.3747 6.83808 16.1584 6.83808 12.0217C6.83808 9.91575 8.05229 7.46353 10.1755 7.46353C11.1972 7.46353 11.4224 7.48345 11.7586 8.28989C12.1519 9.24 13.1115 11.5809 13.2257 11.8208C13.6974 12.8052 12.7459 13.3814 12.0556 14.2385C11.8353 14.4965 11.5856 14.7754 11.8647 15.2554C12.1421 15.7255 13.1017 17.2895 14.5117 18.5448C16.3331 20.1676 17.81 20.6856 18.3388 20.9061C18.7321 21.0693 19.2021 21.0312 19.4893 20.7244C19.8533 20.3309 20.3053 19.6781 20.7656 19.035C21.0903 18.5746 21.5032 18.5171 21.9357 18.6803C22.2278 18.7816 25.9406 20.5058 26.0973 20.7818C26.2132 20.9825 26.2132 21.9323 25.8199 23.0456ZM16.3233 0H16.3151C7.31787 0 0 7.32009 0 16.32C0 19.8886 1.15057 23.1994 3.10734 25.8849L1.07387 31.9491L7.34565 29.945C9.92584 31.6525 13.0054 32.64 16.3233 32.64C25.3205 32.64 32.64 25.3199 32.64 16.32C32.64 7.32009 25.3205 0 16.3233 0Z"
			/>
		</svg>
	)
}

/* Tautan pengembang, dipakai di versi mobile dan desktop */
function NexcubeLink() {
	return (
		<a
			href="https://nexcube-digital.com/"
			target="_blank"
			rel="noreferrer"
			className="underline transition-colors hover:text-[#CDF178]"
		>
			Nexcube Digital
		</a>
	)
}

/*
 * Kelas bersama.
 * Breakpoint: mobile (< md), tablet (md → < lg), desktop (lg+).
 * Nilai desktop dikembalikan lewat awalan lg: supaya tampilan desktop tidak berubah.
 */
const headingClass =
	"font-['Montserrat'] text-[14px] font-bold uppercase leading-4 tracking-[0px] text-white md:text-[15px] md:leading-5 lg:h-4 lg:w-[169px] lg:text-[14px] lg:leading-4"
const linkClass =
	"font-['Montserrat'] text-[clamp(11px,1.7svh,13px)] font-medium leading-[clamp(14px,2.2svh,16px)] tracking-[0px] text-white! transition-colors hover:text-[#CDF178]! md:text-[13px] md:leading-5 lg:text-[12px] lg:leading-4"

/*
 * Jarak antar daftar tautan di mobile dibuat fleksibel mengikuti tinggi layar (svh).
 * Tablet (md) memakai nilai tetap yang lebih lega, desktop (lg) kembali ke nilai aslinya.
 */
const listClass =
	"mt-[clamp(4px,calc(1.4svh_-_1px),16px)] flex flex-col gap-[clamp(3px,calc(1.6svh_-_4px),14px)] font-['Montserrat'] text-[clamp(11px,1.7svh,13px)] font-medium leading-[clamp(14px,2.2svh,16px)] tracking-[0px] text-white md:mt-4 md:gap-3 md:text-[13px] md:leading-5 lg:mt-[15px] lg:gap-[15px] lg:text-[12px] lg:leading-4"

/* Kelas tombol sosmed bulat di bagian atas (ukuran mengikuti tinggi layar di mobile, lebih besar di tablet) */
const socialButtonClass =
	'relative isolate grid h-[clamp(28px,4.5svh,36px)] w-[clamp(28px,4.5svh,36px)] shrink-0 place-items-center rounded-full bg-transparent text-black transition-transform before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-[#FFFFF7] before:scale-[0.82] before:shadow-[0px_1px_1px_0px_#00000040] hover:scale-110 md:h-10 md:w-10 md:before:scale-100 lg:h-8 lg:w-8'

/* Kelas dasar tombol kembali ke atas */
const backTopClass =
	'place-items-center rounded-full border-[0.5px] border-[#008C00] bg-[#004000] text-[#CDF178] shadow-lg transition-transform hover:-translate-y-1'

function Footer() {
	const { t } = useTranslation()
	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	return (
		<footer
			id="kontak"
			className="flex min-h-[100svh] flex-col bg-white p-0 sm:px-[34px] sm:py-[20px] sm:pb-[calc(var(--bottom-nav-height,64px)+20px)] md:block md:min-h-0 lg:pb-[20px]"
		>
			<div
				className="relative mx-auto flex min-h-[100svh] w-full flex-1 flex-col overflow-hidden rounded-none bg-cover bg-center bg-no-repeat sm:rounded-[20px] md:block md:min-h-[520px] md:rounded-[25px] lg:min-h-[550px]"
				style={{
					backgroundColor: 'rgba(1, 38, 3, 0.84)',
					backgroundImage: `linear-gradient(180deg, rgba(1, 38, 3, 0.84) 0%, rgba(1, 38, 3, 0.84) 100%), url(${lapangF1Image})`,
				}}
			>
				{/* Tablet (md): padding atas/bawah lebih lega, konten setinggi isinya (tidak dipaksa 100svh) */}
				<div className="mx-auto flex w-full max-w-[1246px] flex-1 flex-col justify-center px-4 pb-[clamp(10px,2.4svh,28px)] pt-[clamp(10px,2.8svh,26px)] md:block md:flex-none md:px-8 md:pb-8 md:pt-[56px] lg:px-12 lg:pb-0 lg:pt-[60px]">
					{/*
					 * Mobile: 2 kolom. Tablet (md): 3 kolom (Perusahaan | Unit Bisnis | Hubungi Kami) di bawah baris logo.
					 * Desktop (lg): 4 kolom seperti semula.
					 */}
					<div className="grid grid-cols-2 gap-x-4 gap-y-[clamp(16px,3.2svh,36px)] md:grid-cols-[1fr_1fr_1.3fr] md:gap-x-6 md:gap-y-9 lg:grid-cols-[1.3fr_0.9fr_1fr_1.1fr] lg:gap-8 xl:gap-12">
						{/* Logo + sosmed: tablet = satu baris (logo kiri, sosmed kanan) */}
						<div className="relative order-1 col-span-2 flex w-full flex-col items-center md:order-none md:col-span-3 md:flex-row md:items-center md:justify-between lg:col-span-1 lg:flex-col lg:items-start lg:justify-start lg:gap-3 [@media(max-width:1023px)_and_(max-height:640px)]:flex-row [@media(max-width:1023px)_and_(max-height:640px)]:justify-between [@media(max-width:1023px)_and_(max-height:640px)]:gap-2">
							<TransitionLink
								to="/"
								aria-label={t('nav.home')}
								className="inline-flex items-center justify-center md:h-[100px] md:justify-start lg:h-[95px]"
							>
								<img
									src={logo}
									alt="OBC"
									className="h-[clamp(56px,12.5svh,140px)] w-auto max-w-full origin-center scale-[1.8] object-contain object-center md:h-full md:w-auto md:origin-left md:scale-[1.2] md:object-left lg:scale-[1.25] lg:-translate-x-9 [@media(max-width:1023px)_and_(max-height:640px)]:h-[clamp(80px,15svh,110px)] [@media(max-width:1023px)_and_(max-height:640px)]:scale-[1.3]"
								/>
							</TransitionLink>
							<div className="mt-[clamp(10px,2svh,20px)] flex items-center justify-center gap-3 md:mt-0 md:justify-end md:gap-4 lg:justify-start lg:pt-1 [@media(max-width:1023px)_and_(max-height:640px)]:mt-0 [@media(max-width:1023px)_and_(max-height:640px)]:gap-2">
								<a
									href={CONTACT.whatsapp}
									target="_blank"
									rel="noreferrer"
									aria-label="WhatsApp OBC Group"
									className={socialButtonClass}
								>
									<img
										src={whatsappIcon}
										alt=""
										aria-hidden="true"
										className="h-4 w-4 md:h-5 md:w-5 lg:h-4 lg:w-4"
										style={{ filter: 'brightness(0)' }}
									/>
								</a>
								<a
									href={CONTACT.instagram}
									target="_blank"
									rel="noreferrer"
									aria-label="Instagram OBC Group"
									className={socialButtonClass}
								>
									<InstagramLogo className="h-4 w-4 md:h-5 md:w-5 lg:h-4 lg:w-4" />
								</a>
								<a
									href={CONTACT.tiktok}
									target="_blank"
									rel="noreferrer"
									aria-label="TikTok OBC Group"
									className={socialButtonClass}
								>
									<TikTokLogo className="h-4 w-4 md:h-5 md:w-5 lg:h-4 lg:w-4" />
								</a>
							</div>

							{/* Tombol kembali ke atas khusus layar pendek */}
							<button
								type="button"
								onClick={scrollToTop}
								aria-label={t('footer.backToTop')}
								className={`${backTopClass} hidden h-[clamp(32px,5svh,40px)] w-[clamp(32px,5svh,40px)] [@media(max-width:1023px)_and_(max-height:640px)]:grid`}
							>
								<ArrowUp className="h-4 w-4" />
							</button>
						</div>

						{/* Perusahaan */}
						<div className="order-3 px-2 md:order-none md:px-0">
							<h3 className={headingClass}>{t('footer.company')}</h3>
							<ul className={listClass}>
								{NAVIGASI_LINKS.map((link) => (
									<li key={link.to}>
										{link.to.startsWith('#') ? (
											<a
												href={link.to}
												className={linkClass}
												onClick={(event) => {
													event.preventDefault()
													scrollToContact()
												}}
											>
												{t(link.label)}
											</a>
										) : (
											<TransitionLink to={link.to} className={linkClass}>
												{t(link.label)}
											</TransitionLink>
										)}
									</li>
								))}
							</ul>
						</div>

						{/* Unit bisnis */}
						<div className="order-4 px-2 md:order-none md:px-0">
							<h3 className={headingClass}>{t('footer.businessUnits')}</h3>
							<ul className={listClass}>
								{UNIT_LINKS.map((unit) => (
									<li key={unit.to}>
										<TransitionLink to={unit.to} className={linkClass}>
											{t(unit.label)}
										</TransitionLink>
									</li>
								))}
							</ul>
						</div>

						{/* Hubungi kami */}
						<div className="order-2 col-span-2 px-2 md:order-none md:col-span-1 md:px-0">
							<h3 className={`${headingClass} flex items-center gap-2 lg:gap-1`}>
								<Headphones size={14} />
								{t('footer.contactUs')}
							</h3>
							<ul className="mt-[clamp(4px,calc(1.4svh_-_1px),16px)] flex flex-col gap-[clamp(3px,calc(1.6svh_-_4px),14px)] font-['Montserrat'] text-[clamp(11px,1.7svh,13px)] font-medium leading-[clamp(14px,2.3svh,20px)] tracking-[0px] text-white md:mt-4 md:gap-3 md:text-[13px] md:leading-5 lg:mt-[15px] lg:gap-[15px] lg:text-[12px] lg:leading-4">
								<li className="flex items-center gap-3 md:gap-2">
									<Mail size={15} className="shrink-0" />
									<a
										href={`mailto:${CONTACT.email}`}
										className="min-w-0 break-all transition-colors hover:text-[#CDF178]"
									>
										{CONTACT.email}
									</a>
								</li>
								<li className="flex items-start gap-3 md:gap-2">
									<MapPin size={15} className="mt-[3px] shrink-0" />
									<a
										href={CONTACT.maps}
										target="_blank"
										rel="noreferrer"
										className="text-left transition-colors hover:text-[#CDF178]"
									>
										{CONTACT.address}
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Tombol kembali ke atas versi desktop (posisi asli, tidak diubah) */}
				<div className="hidden lg:absolute lg:bottom-[105px] lg:right-12 lg:block">
					<button
						type="button"
						onClick={scrollToTop}
						aria-label={t('footer.backToTop')}
						className={`${backTopClass} grid h-[44px] w-[36px]`}
					>
						<ArrowUp className="h-5 w-[15px]" />
					</button>
				</div>

				{/* Tombol kembali ke atas versi mobile/tablet: tepat di atas teks "OBC GROUP", rata kanan */}
				<div className="flex shrink-0 justify-end px-4 md:px-8 lg:hidden [@media(max-width:1023px)_and_(max-height:640px)]:hidden">
					<button
						type="button"
						onClick={scrollToTop}
						aria-label="Kembali ke atas"
						className={`${backTopClass} grid h-[clamp(32px,5svh,40px)] w-[clamp(32px,5svh,40px)] md:h-11 md:w-11`}
					>
						<ArrowUp className="h-4 w-4 md:h-5 md:w-5" />
					</button>
				</div>

				{/* ===== Teks besar "OBC GROUP" (memudar ke bawah) ===== */}
				{/* Disembunyikan di layar sangat pendek (tinggi ≤ 640px) karena hanya dekorasi */}
				{/*
				 * Mobile: ukuran mengikuti lebar & tinggi layar (maks 44px).
				 * Tablet (md): ukuran mengikuti lebar layar (80-104px) supaya proporsional dengan footer yang lebar.
				 * Desktop (lg): tidak berubah.
				 */}
				<div className="mx-auto mb-[clamp(6px,1.6svh,18px)] mt-1 flex h-[1.22em] w-full max-w-[1246px] shrink-0 justify-center overflow-hidden text-[clamp(28px,min(9.5vw,6svh),44px)] md:mb-2 md:mt-4 md:text-[clamp(56px,10.5vw,104px)] lg:mb-0 lg:mt-[36px] lg:h-[110px] [@media(max-width:1023px)_and_(max-height:640px)]:hidden">
					<span
						aria-hidden="true"
						className="mt-[0.11em] h-[0.92em] w-auto max-w-full select-none whitespace-nowrap bg-clip-text text-center font-['Montserrat'] font-black leading-[0.92em] text-transparent lg:mt-[10px] lg:h-[83px] lg:text-[90px] lg:leading-[83px] xl:text-[105px]"
						style={{
							backgroundImage: 'linear-gradient(180deg, #FFFFFF 0.24%, rgba(31, 51, 32, 0) 90%)',
						}}
					>
						OBC GROUP
					</span>
				</div>

				{/* ===== Bar bawah ===== */}
				<div className="shrink-0 lg:border-t lg:border-white/10">
					<div className="mx-auto flex w-full max-w-[1246px] flex-col items-center gap-1 px-4 pb-[clamp(6px,1.8svh,20px)] pt-1 text-center font-['Montserrat'] text-[11px] font-normal leading-4 tracking-[0px] text-white md:gap-1.5 md:px-6 md:pb-6 md:pt-3 md:text-[13px] md:leading-5 lg:h-[70px] lg:min-h-[70px] lg:flex-row lg:justify-between lg:gap-4 lg:px-10 lg:py-5 lg:text-left lg:text-[12px] lg:leading-4 xl:px-12">
						{/* Mobile/tablet: teks hak cipta diringkas jadi satu baris, tanpa pilihan bahasa */}
						<p className="lg:hidden">{t('footer.mobileCopyright', { year: new Date().getFullYear() })}</p>
						<p className="lg:hidden">
							{t('footer.developedBy')} <NexcubeLink />
						</p>

						{/* Desktop: teks asli */}
						<p className="hidden lg:block">{t('footer.copyright', { year: new Date().getFullYear() })}</p>

						<p className="hidden lg:block">
							{t('footer.developedBy')} <NexcubeLink />
						</p>

						{/* Bahasa + ikon sosial versi desktop; di mobile/tablet ikon sosial sudah ada di bagian atas */}
						<div className="hidden items-center gap-6 lg:flex">
							<span className="flex items-center gap-2">
								<Globe width={15.5} height={15.5} className="text-white" />
								{t('footer.currentLanguage')}
							</span>
							<div className="flex items-center gap-5">
								<a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp OBC Group" className="text-white transition-colors hover:text-[#CDF178]">
									<WhatsAppSocialIcon className="h-[16.5px] w-[16.5px]" />
								</a>
								<a href={CONTACT.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok OBC Group" className="text-white transition-colors hover:text-[#CDF178]">
									<TikTokLogo className="h-[14px] w-[14px] bg-white text-black" />
								</a>
								<a href={CONTACT.instagram} target="_blank" rel="noreferrer" aria-label="Instagram OBC Group" className="text-white transition-colors hover:text-[#CDF178]">
									<InstagramLogo className="h-[16.5px] w-[16.5px]" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer