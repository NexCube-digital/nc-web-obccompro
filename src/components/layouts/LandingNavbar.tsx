import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, Heart, Menu, X } from 'lucide-react'
import logo from '../../assets/logo/obclogo.webp'
import internetIcon from '../../assets/icon/internet.svg'
import userCircleIcon from '../../assets/icon/iconstack.io - (User Circle).svg'
import shareIcon from '../../assets/icon/bagikan.svg'

// Daftar menu utama
const menus = [
	{ label: 'nav.home', href: '/' },
	{ label: 'nav.about', href: '/tentang-kami' },
	{ label: 'nav.businessUnits', href: '/unit-bisnis' },
	{ label: 'nav.gallery', href: '/galeri' },
	{ label: 'nav.contact', href: '#kontak' },
]

// Daftar pilihan bahasa (dropdown desktop)
const languages = [
	{ code: 'id', label: 'nav.indonesian' },
	{ code: 'en', label: 'nav.english' },
] as const

// Kelas menu desktop: aktif = SemiBold (600) + garis bawah, non-aktif = Regular (400)
// Garis bawah selalu ada tapi di-scale 0; saat hover/aktif membesar pelan-pelan dari kiri ke kanan
const menuClass = (isActive: boolean) =>
	`relative flex items-center whitespace-nowrap px-3 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0px] !text-[#000000] transition-colors after:absolute after:bottom-[14px] after:left-3 after:right-3 after:h-[2px] after:origin-left after:transition-transform after:duration-300 after:ease-out lg:px-4 lg:text-[20px] ${
		isActive
			? 'font-semibold after:scale-x-100 after:bg-[#000000]'
			: 'font-normal after:scale-x-0 after:bg-[#000000]/40 hover:after:scale-x-100'
	}`

// Kelas menu mobile: aktif = bold + latar abu tipis, ada garis pemisah antar item
const mobileItemClass = (isActive: boolean) =>
	`block border-b border-black/[0.06] px-6 py-4 font-['Montserrat'] text-[16px] leading-6 tracking-[0px] !text-[#000000] ${
		isActive ? 'bg-black/[0.03] font-bold' : 'font-normal'
	}`

// Tombol bulat gradien (dipakai di mobile)
const circleBtnClass =
	'grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90'

// Tombol navbar halaman detail unit bisnis (mobile): 40x40, radius 20, abu transparan + blur 72px
const detailBtnClass =
	'grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[20px] bg-[#F0F0F080] text-[#000000] backdrop-blur-[72px] transition-transform active:scale-95'

function LandingNavbar() {
	const [open, setOpen] = useState(false)
	const [langOpen, setLangOpen] = useState(false)
	const [liked, setLiked] = useState(false)
	const { t, i18n } = useTranslation()
	const lang = i18n.resolvedLanguage?.toUpperCase().startsWith('EN') ? 'EN' : 'ID'
	const langRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()
	const { pathname } = useLocation()
	const closeMenu = () => setOpen(false)
	const changeLanguage = (language: string) => {
		void i18n.changeLanguage(language)
	}

	// Halaman detail unit bisnis: /unit-bisnis/guest-house, /unit-bisnis/villa, dst.
	const isDetailPage = pathname.startsWith('/unit-bisnis/')

	// Tutup dropdown bahasa saat klik di luar atau menekan Escape
	useEffect(() => {
		if (!langOpen) return

		const handleClickOutside = (e: MouseEvent) => {
			if (langRef.current && !langRef.current.contains(e.target as Node)) {
				setLangOpen(false)
			}
		}
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setLangOpen(false)
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [langOpen])

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
					<button type="button" className={detailBtnClass} aria-label={t('nav.backToUnits')} onClick={handleBack}>
						<ArrowLeft size={20} strokeWidth={1.5} color="#000000" />
					</button>

					<div className="flex items-center gap-3">
						<button type="button" className={detailBtnClass} aria-label={t('common.share')} onClick={handleShare}>
							<img src={shareIcon} alt="" aria-hidden="true" className="h-[13px] w-[11px] object-contain" />
						</button>
						<button
							type="button"
							className={detailBtnClass}
							aria-label={liked ? t('common.removeFromFavorite') : t('common.addToFavorite')}
							aria-pressed={liked}
							onClick={handleLike}
						>
							<Heart
								size={20}
								strokeWidth={1.5}
								className={liked ? 'fill-red-500 text-red-500' : ''}
								color={liked ? undefined : '#000000'}
							/>
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
						aria-label={t('nav.home')}
						onClick={() => {
							closeMenu()
							scrollToTop()
						}}
					>
						<img className="block h-[60px] w-[100px] object-contain" src={logo} alt="OBC" />
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
									{t(menu.label)}
								</a>
							) : (
								<NavLink
									key={menu.label}
									className={({ isActive }) => menuClass(isActive)}
									to={menu.href}
									end={menu.href === '/'}
									onClick={scrollToTop}
								>
									{t(menu.label)}
								</NavLink>
							),
						)}
					</nav>

					{/* Kanan */}
					<div className="flex items-center gap-3">
						{/* Desktop: tombol bahasa + dropdown pilihan bahasa */}
						<div ref={langRef} className="relative hidden md:block">
							<button
								className="flex h-[40px] w-auto items-center justify-center gap-1 rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] px-3 text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90"
								type="button"
								aria-label={t('nav.languageSelect')}
								aria-haspopup="listbox"
								aria-expanded={langOpen}
								onClick={(e) => {
									e.stopPropagation()
									setLangOpen((v) => !v)
								}}
							>
								<img src={internetIcon} alt="" className="h-[22px] w-[22px]" />
								<span className="font-['Montserrat'] text-[12px] font-bold leading-4 tracking-[0px] text-black">
									{lang}
								</span>
							</button>

							{langOpen && (
								<div
									className="absolute right-0 top-full mt-3 w-[220px] cursor-default overflow-hidden rounded-[12px] bg-white shadow-[0px_10px_25px_0px_rgba(0,0,0,0.25)]"
									onClick={(e) => e.stopPropagation()}
								>
									<p className="border-b border-black/[0.06] px-4 py-3 font-['Montserrat'] text-[12px] font-bold leading-4 tracking-[0px] text-black">
										{t('nav.languageSelect')}
									</p>
									<ul role="listbox" aria-label="Pilihan Bahasa">
										{languages.map((item) => (
											<li key={item.code} role="option" aria-selected={lang === item.code.toUpperCase()}>
												<button
													type="button"
													onClick={() => {
														changeLanguage(item.code)
														setLangOpen(false)
													}}
													className={`flex w-full items-center justify-between px-4 py-3 text-left font-['Montserrat'] text-[14px] leading-5 tracking-[0px] text-black transition-colors hover:bg-black/[0.05] ${
														lang === item.code.toUpperCase() ? 'bg-black/[0.03] font-bold' : 'font-normal'
													}`}
												>
													<span>{t(item.label)}</span>
													{lang === item.code.toUpperCase() && <Check size={16} />}
												</button>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>

						{/* Desktop: Login. Antara md–xl hanya ikon (agar tidak menabrak menu tengah), mulai xl ikon + teks */}
						<NavLink
							className="hidden h-[40px] w-[40px] items-center justify-center gap-0 rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] p-0 font-['Montserrat'] text-[20px] font-semibold leading-[20px] tracking-[1px] !text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90 md:inline-flex xl:w-[135px] xl:gap-2 xl:px-5 xl:py-[10px]"
							to="/kontak"
							aria-label={t('nav.login')}
							onClick={scrollToTop}
						>
							<img
								src={userCircleIcon}
								alt=""
								className="h-[26px] w-[26px] shrink-0 xl:h-[30px] xl:w-[30px]"
							/>
							<span className="hidden xl:inline">{t('nav.login')}</span>
						</NavLink>

						{/* Mobile: ikon login (hanya ikon) */}
						<NavLink
							className={`${circleBtnClass} md:hidden`}
							to="/kontak"
							aria-label={t('nav.login')}
							onClick={closeMenu}
						>
							<img src={userCircleIcon} alt="" className="h-[26px] w-[26px]" />
						</NavLink>

						{/* Mobile: tombol hamburger */}
						<button
							type="button"
							className={`${circleBtnClass} md:hidden`}
							aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
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
										{t(menu.label)}
									</a>
								) : (
									<NavLink
										key={menu.label}
										className={({ isActive }) => mobileItemClass(isActive)}
										to={menu.href}
										end={menu.href === '/'}
										onClick={closeMenu}
									>
										{t(menu.label)}
									</NavLink>
								),
							)}
						</nav>

						{/* Pilih bahasa */}
						<div className="flex items-center justify-between bg-black/[0.03] px-6 py-4">
							<span className="font-['Montserrat'] text-[12px] font-bold leading-4 tracking-[0px] text-black">
								{t('nav.chooseLanguage')}
							</span>
							<div className="flex items-center gap-2">
								{(['ID', 'EN'] as const).map((code) => (
									<button
										key={code}
										type="button"
										onClick={() => changeLanguage(code.toLowerCase())}
										aria-pressed={lang === code}
										className={`h-8 w-[43px] rounded-[4px] border font-['Montserrat'] text-[12px] font-bold leading-4 tracking-[0px] ${
												lang === code.toUpperCase()
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