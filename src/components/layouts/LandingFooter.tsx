import { Link } from 'react-router-dom'
import { ArrowUp, Globe, Headphones, Mail, MapPin } from 'lucide-react'
import { WhatsAppLogo } from '../common/WhatsAppIcon'
import logo from '../../assets/logo/obclogo.png'
import lapangF1Image from '../../assets/layanan/Lapang F1.png'

const NAVIGASI_LINKS = [
	{ label: 'Beranda', to: '/' },
	{ label: 'Tentang Kami', to: '/tentang-kami' },
	{ label: 'Unit Bisnis', to: '/unit-bisnis' },
	{ label: 'OBC Sport Center', to: '/unit-bisnis/sport-center' },
	{ label: 'OBC Gedung Multifungsi', to: '/unit-bisnis/gedung-multifungsi' },
	{ label: 'Galeri', to: '/galeri' },
	{ label: 'Testimoni', to: '/testimoni' },
	{ label: 'Kontak', to: '#kontak' },
]

const UNIT_LINKS = [
	'OBC Sport Center',
	'OBC Guest House',
	'OBC Villa',
	'OBC Laundry',
	'OBC Food Court',
	'OBC Coffee',
	'OBC Agrobisnis',
]

/* Data kontak — ganti dengan data resmi OBC kalau sudah tersedia dari admin/CMS. */
const CONTACT = {
	email: 'obc.managementbdg@gmail.com',
	whatsapp: 'https://wa.me/6288860709000',
	instagram: 'https://instagram.com/obcgroup.bdg',
	tiktok: 'https://www.tiktok.com/@obcgroup.bdg',
	address: 'Jl. Rancabentang, No.12, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat 40142',
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

/* Kelas bersama */
const headingClass =
	"h-4 w-[169px] font-['Montserrat'] text-[15px] font-bold uppercase leading-4 tracking-[0px] text-white md:text-[14px]"
const linkClass =
	"font-['Montserrat'] text-[13px] font-medium leading-4 tracking-[0px] text-white! transition-colors hover:text-[#CDF178]! md:text-[12px]"

function LandingFooter() {
	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

	return (
		<footer id="kontak" className="bg-white p-2 md:p-[17px]">
			<div
				className="relative mx-auto w-full max-w-[1246px] overflow-hidden rounded-[20px] bg-cover bg-center bg-no-repeat md:min-h-[550px] md:rounded-[25px]"
				style={{
					backgroundColor: 'rgba(1, 38, 3, 0.84)',
					backgroundImage: `linear-gradient(180deg, rgba(1, 38, 3, 0.84) 0%, rgba(1, 38, 3, 0.84) 100%), url(${lapangF1Image})`,
				}}
			>
				{/* ===== Konten utama ===== */}
				<div className="mx-auto max-w-[1246px] px-4 pt-5 md:px-[89px] md:pt-[60px]">
					{/* Mobile: logo → hubungi kami → (perusahaan | unit bisnis). Desktop: 4 kolom */}
					<div className="grid grid-cols-[236fr_143fr] gap-y-8 md:grid-cols-[328fr_243fr_223fr_270fr] md:gap-0">
						{/* Logo + sosial media */}
						<div className="order-1 col-span-2 box-border flex w-full flex-col items-center md:order-none md:col-span-1 md:block md:h-[167px] md:w-[291px] md:min-w-[252px] md:pr-[43px]">
							<Link
								to="/"
								aria-label="OBC beranda"
								className="inline-flex h-[122px] w-[320px] max-w-full gap-[10px] p-[10px] md:h-[129px] md:w-[258px]"
							>
								<img src={logo} alt="OBC" className="h-full w-full object-contain" />
							</Link>
							<div className="mt-4 box-border flex h-[32px] items-center justify-center gap-8 md:mt-0 md:w-[248px] md:items-end md:gap-[30px] md:px-[15px] md:pt-[10px]">
								<a
									href={CONTACT.whatsapp}
									target="_blank"
									rel="noreferrer"
									aria-label="WhatsApp OBC Group"
									className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFFFF7] text-black shadow-[0px_1px_1px_0px_#00000040] transition-transform hover:scale-110"
								>
									<WhatsAppLogo className="h-4 w-[17px]" />
								</a>
								<a
									href={CONTACT.instagram}
									target="_blank"
									rel="noreferrer"
									aria-label="Instagram OBC Group"
									className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFFFF7] text-black shadow-[0px_1px_1px_0px_#00000040] transition-transform hover:scale-110"
								>
									<InstagramLogo className="h-4 w-[17px]" />
								</a>
								<a
									href={CONTACT.tiktok}
									target="_blank"
									rel="noreferrer"
									aria-label="TikTok OBC Group"
									className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFFFF7] text-black shadow-[0px_1px_1px_0px_#00000040] transition-transform hover:scale-110"
								>
									<TikTokLogo className="h-4 w-[17px]" />
								</a>
							</div>
						</div>

						{/* Perusahaan */}
						<div className="order-3 px-2 md:order-none md:px-0">
							<h3 className={headingClass}>Perusahaan</h3>
							<ul className="mt-[15px] flex flex-col gap-[15px] font-['Montserrat'] text-[13px] font-medium leading-4 tracking-[0px] text-white md:text-[12px]">
								{NAVIGASI_LINKS.map((link) => (
									<li key={link.label}>
										{link.to.startsWith('#') ? (
											<a href={link.to} className={linkClass}>
												{link.label}
											</a>
										) : (
											<Link to={link.to} className={linkClass}>
												{link.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</div>

						{/* Unit bisnis */}
						<div className="order-4 px-2 md:order-none md:px-0">
							<h3 className={headingClass}>Unit Bisnis</h3>
							<ul className="mt-[15px] flex flex-col gap-[15px] font-['Montserrat'] text-[13px] font-medium leading-4 tracking-[0px] text-white md:text-[12px]">
								{UNIT_LINKS.map((unit) => (
									<li key={unit} className={linkClass}>
										{unit}
									</li>
								))}
							</ul>
						</div>

						{/* Hubungi kami */}
						<div className="order-2 col-span-2 md:order-none md:col-span-1">
							<h3 className={`${headingClass} flex items-center gap-1`}>
								<Headphones size={14} />
								Hubungi Kami
							</h3>
							<ul className="mt-[15px] flex flex-col gap-[14px] font-['Montserrat'] text-[13px] font-medium leading-5 tracking-[0px] text-white md:text-[12px] md:leading-4">
								<li className="flex items-center gap-3 text-[15px] text-white md:gap-2 md:text-[12px]">
									<Mail size={15} className="shrink-0" />
									<a
										href={`mailto:${CONTACT.email}`}
										className="min-w-0 break-all transition-colors hover:text-[#CDF178]"
									>
										{CONTACT.email}
									</a>
								</li>
								<li className="flex items-start gap-2.5 text-white md:gap-2">
									<MapPin size={15} className="mt-[3px] shrink-0 md:mt-[3px]" />
									<span className="text-justify">
										{CONTACT.address}
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* ===== Teks besar "OBC GROUP" (memudar ke bawah) ===== */}
				<div className="mx-auto mt-10 flex h-[80px] w-full max-w-[1146px] justify-center overflow-hidden md:mt-[44px] md:h-[116px]">
					<span
						aria-hidden="true"
						className="mt-[6px] h-[65px] w-[678px] max-w-full select-none whitespace-nowrap bg-clip-text text-center font-['Montserrat'] text-[44px] font-black leading-[65px] text-transparent md:mt-[14.33px] md:h-[83px] md:text-[100px] md:leading-[83px]"
						style={{
							backgroundImage:
								'linear-gradient(180deg, #FFFFFF 0.24%, rgba(31, 51, 32, 0) 90%)',
						}}
					>
						OBC GROUP
					</span>
				</div>

				{/* Tombol kembali ke atas: tampil juga di mobile */}
				<button
					type="button"
					onClick={scrollToTop}
					aria-label="Kembali ke atas"
					className="absolute bottom-[124px] right-[72px] grid h-[52px] w-[48px] place-items-center rounded-full border-[0.5px] border-[#008C00] bg-[#004000] text-[#CDF178] transition-transform hover:-translate-y-1 md:bottom-auto md:right-[53px] md:top-[415px] md:h-[47px] md:w-[36px]"
				>
					<ArrowUp className="h-[26px] w-[20px] md:h-5 md:w-[15px]" />
				</button>

				{/* ===== Bar bawah ===== */}
				<div className="box-border mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[5px] px-6 pb-[10px] pt-0 text-center font-['Montserrat'] text-[12px] font-normal leading-4 tracking-[0px] text-white md:h-[70px] md:min-h-[70px] md:flex-row md:justify-between md:py-5 md:text-left">
					<p>© {new Date().getFullYear()} Onny Barber Center Group. Hak cipta dilindungi undang-undang.</p>

					<p>
						Dikembangkan oleh{' '}
						<a
							href="https://nexcube.digital"
							target="_blank"
							rel="noreferrer"
							className="underline transition-colors hover:text-[#CDF178]"
						>
							Nexcube Digital
						</a>
					</p>

					{/* Bahasa + ikon sosial hanya di desktop; di mobile tidak ada di desain */}
					<div className="hidden items-center gap-6 md:flex">
						<span className="flex items-center gap-2">
							<Globe width={15.5} height={15.5} className="text-white" />
							Bahasa Indonesia (ID)
						</span>
						<div className="flex items-center gap-5">
							<a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp OBC Group" className="text-white transition-colors hover:text-[#CDF178]">
								<WhatsAppLogo className="h-[16.5px] w-[16.5px]" />
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
		</footer>
	)
}

export default LandingFooter