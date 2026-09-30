import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Menu, X } from 'lucide-react'
import logo from '../../assets/logo/LOGO-OBC.png'
import internetIcon from '../../assets/icon/internet.svg'
import userCircleIcon from '../../assets/icon/iconstack.io - (User Circle).svg'
import shareIcon from '../../assets/icon/bagikan.svg'

// Daftar menu utama
const menus = [
	{ label: 'Beranda', href: '/' },
	{ label: 'Tentang Kami', href: '/tentang-kami' },
	{ label: 'Unit Bisnis', href: '/unit-bisnis' },
	{ label: 'Galeri', href: '/galeri' },
	{ label: 'Kontak', href: '#kontak' },
]

// Kelas menu desktop: aktif = SemiBold (600) + garis bawah, non-aktif = Regular (400)
const menuClass = (isActive: boolean) =>
	`relative flex items-center whitespace-nowrap px-3 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0px] !text-[#000000] transition-colors after:absolute after:bottom-[14px] after:left-3 after:right-3 after:h-[2px] lg:px-4 lg:text-[20px] ${
		isActive
			? 'font-semibold after:bg-[#000000]'
			: 'font-normal hover:after:bg-[#000000]/40'
	}`

// Kelas menu mobile: aktif = bold + latar abu tipis, ada garis pemisah antar item
const mobileItemClass = (isActive: boolean) =>
	`block border-b border-black/[0.06] px-6 py-4 font-['Montserrat'] text-[16px] leading-6 tracking-[0px] !text-[#000000] ${
		isActive ? 'bg-black/[0.03] font-bold' : 'font-normal'
	}`

// Tombol bulat gradien (dipakai di mobile)
const circleBtnClass =
	'grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90'

// Tombol bulat putih untuk navbar halaman detail unit bisnis (mobile)
const detailBtnClass =
	'grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-white/90 text-[#000000] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform active:scale-95'

function LandingNavbar() {
	const [open, setOpen] = useState(false)
	const [lang, setLang] = useState<'ID' | 'EN'>('ID')
	const [liked, setLiked] = useState(false)
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const closeMenu = () => setOpen(false)

	// Halaman detail unit bisnis: /unit-bisnis/guest-house, /unit-bisnis/villa, dst.
	const isDetailPage = pathname.startsWith('/unit-bisnis/')

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		})
	}

	const handleHeaderClick = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement | null
		// Jangan scroll ke atas jika klik pada hash link (misal #kontak) atau button bahasa
		if (target?.closest('a[href^="#"]') || target?.closest('button')) {
			return
		}
		scrollToTop()
	}

	// Tombol kembali: selalu ke halaman Unit Bisnis
	const handleBack = () => {
		navigate('/unit-bisnis')
	}

	// Tombol bagikan: pakai Web Share API, fallback salin link
	const handleShare = async () => {
		const url = window.location.href
		try {
			if (navigator.share) {
				await navigator.share({ title: document.title, url })
			} else {
				await navigator.clipboard.writeText(url)
				alert('Tautan berhasil disalin')
			}
		} catch {
			// Pengguna membatalkan dialog bagikan, abaikan
		}
	}

	const handleLike = () => setLiked((v) => !v)

	return (
		<>
			{/* Navbar khusus halaman detail unit bisnis (hanya mobile) */}
			{isDetailPage && (
				<div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-4 pt-4 md:hidden">
					<button type="button" className={detailBtnClass} aria-label="Kembali ke Unit Bisnis" onClick={handleBack}>
						<ArrowLeft size={22} />
					</button>

					<div className="flex items-center gap-3">
						<button type="button" className={detailBtnClass} aria-label="Bagikan" onClick={handleShare}>
							<img src={shareIcon} alt="" aria-hidden="true" className="h-[15px] w-[13px]" />
						</button>
						<button
							type="button"
							className={detailBtnClass}
							aria-label={liked ? 'Hapus dari favorit' : 'Tambah ke favorit'}
							aria-pressed={liked}
							onClick={handleLike}
						>
							<Heart size={20} className={liked ? 'fill-red-500 text-red-500' : ''} />
						</button>
					</div>
				</div>
			)}

			{/* Navbar utama: di halaman detail hanya tampil di desktop */}
			<header
				onClick={handleHeaderClick}
				className={`fixed left-1/2 top-3 z-50 h-[60px] w-[1246px] max-w-[calc(100%-32px)] -translate-x-1/2 cursor-pointer rounded-[50px] border-b-2 border-b-[#000000CC] bg-[#FFFFFFCC] opacity-100 backdrop-blur-md ${
					isDetailPage ? 'hidden md:block' : ''
				}`}
			>
				<div className="relative flex h-full items-center justify-between gap-6 px-4 md:px-6">
					{/* Logo */}
					<NavLink
						className="shrink-0"
						to="/"
						aria-label="OBC beranda"
						onClick={() => {
							closeMenu()
							scrollToTop()
						}}
					>
						<img className="block h-[46px] w-[100px] object-contain" src={logo} alt="OBC" />
					</NavLink>

					{/* Menu tengah (desktop) */}
					<nav
						className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-stretch md:flex"
						aria-label="Navigasi utama"
					>
						{menus.map((menu) =>
							menu.href.startsWith('#') ? (
								<a
									key={menu.label}
									className={menuClass(false)}
									href={menu.href}
									onClick={(e) => {
										e.stopPropagation()
									}}
								>
									{menu.label}
								</a>
							) : (
								<NavLink
									key={menu.label}
									className={({ isActive }) => menuClass(isActive)}
									to={menu.href}
									end={menu.href === '/'}
									onClick={scrollToTop}
								>
									{menu.label}
								</NavLink>
							),
						)}
					</nav>

					{/* Kanan */}
					<div className="flex items-center gap-3">
						{/* Desktop: tombol bahasa */}
						<button
							className="hidden h-[40px] w-[40px] place-items-center rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90 md:grid"
							type="button"
							aria-label="Pilih bahasa"
							onClick={(e) => e.stopPropagation()}
						>
							<img src={internetIcon} alt="" className="h-[22px] w-[22px]" />
						</button>

						{/* Desktop: Login ikon + teks */}
						<NavLink
							className="hidden h-[40px] w-[135px] items-center justify-center gap-2 rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] px-5 py-[10px] font-['Montserrat'] text-[20px] font-semibold leading-[20px] tracking-[1px] !text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90 md:inline-flex"
							to="/kontak"
							onClick={scrollToTop}
						>
							<img src={userCircleIcon} alt="" className="h-[30px] w-[30px] shrink-0" />
							<span>Login</span>
						</NavLink>

						{/* Mobile: ikon login (hanya ikon) */}
						<NavLink
							className={`${circleBtnClass} md:hidden`}
							to="/kontak"
							aria-label="Login"
							onClick={closeMenu}
						>
							<img src={userCircleIcon} alt="" className="h-[26px] w-[26px]" />
						</NavLink>

						{/* Mobile: tombol hamburger */}
						<button
							type="button"
							className={`${circleBtnClass} md:hidden`}
							aria-label={open ? 'Tutup menu' : 'Buka menu'}
							aria-expanded={open}
							aria-controls="mobile-menu"
							onClick={() => setOpen((v) => !v)}
						>
							{open ? <X size={22} /> : <Menu size={22} />}
						</button>
					</div>
				</div>

				{/* Dropdown menu mobile */}
				{open && (
					<div
						id="mobile-menu"
						className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-[4px] bg-white shadow-[0px_10px_25px_0px_rgba(0,0,0,0.25)] md:hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<nav aria-label="Navigasi mobile">
							{menus.map((menu) =>
								menu.href.startsWith('#') ? (
									<a key={menu.label} className={mobileItemClass(false)} href={menu.href} onClick={closeMenu}>
										{menu.label}
									</a>
								) : (
									<NavLink
										key={menu.label}
										className={({ isActive }) => mobileItemClass(isActive)}
										to={menu.href}
										end={menu.href === '/'}
										onClick={closeMenu}
									>
										{menu.label}
									</NavLink>
								),
							)}
						</nav>

						{/* Pilih bahasa */}
						<div className="flex items-center justify-between bg-black/[0.03] px-6 py-4">
							<span className="font-['Montserrat'] text-[12px] font-bold leading-4 tracking-[0px] text-black">
								Pilih Bahasa / Language
							</span>
							<div className="flex items-center gap-2">
								{(['ID', 'EN'] as const).map((code) => (
									<button
										key={code}
										type="button"
										onClick={() => setLang(code)}
										aria-pressed={lang === code}
										className={`h-8 w-[43px] rounded-[4px] border font-['Montserrat'] text-[12px] font-bold leading-4 tracking-[0px] ${
											lang === code
												? 'border-black bg-black text-white'
												: 'border-black/[0.08] bg-white text-black'
										}`}
									>
										{code}
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</header>
		</>
	)
}

export default LandingNavbar