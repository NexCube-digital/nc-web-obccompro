import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo/LOGO-OBC.png'
import internetIcon from '../../assets/icon/internet.svg'
import userCircleIcon from '../../assets/icon/iconstack.io - (User Circle).svg'

// Daftar menu utama
const menus = [
	{ label: 'Beranda', href: '/' },
	{ label: 'Tentang Kami', href: '/tentang-kami' },
	{ label: 'Unit Bisnis', href: '/unit-bisnis' },
	{ label: 'Galeri', href: '/galeri' },
	{ label: 'Kontak', href: '#kontak' },
]

// Kelas menu: aktif = SemiBold (600) + garis bawah, non-aktif = Regular (400)
const menuClass = (isActive: boolean) =>
	`relative flex items-center whitespace-nowrap px-3 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0px] !text-[#000000] transition-colors after:absolute after:bottom-[14px] after:left-3 after:right-3 after:h-[2px] lg:px-4 lg:text-[20px] ${
		isActive
			? 'font-semibold after:bg-[#000000]'
			: 'font-normal hover:after:bg-[#000000]/40'
	}`

function LandingNavbar() {
	return (
		<header className="fixed left-1/2 top-3 z-50 h-[60px] w-[1150px] max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[50px] border-b-2 border-b-[#000000CC] bg-[#FFFFFFCC] opacity-100 backdrop-blur-md">
			<div className="relative flex h-full items-center justify-between gap-6 px-6">
				{/* Logo */}
				<NavLink className="shrink-0" to="/" aria-label="OBC beranda">
					<img className="block h-[46px] w-[100px] object-contain" src={logo} alt="OBC" />
				</NavLink>

				{/* Menu tengah */}
				<nav
					className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-stretch md:flex"
					aria-label="Navigasi utama"
				>
					{menus.map((menu) =>
						menu.href.startsWith('#') ? (
							<a key={menu.label} className={menuClass(false)} href={menu.href}>
								{menu.label}
							</a>
						) : (
							<NavLink
								key={menu.label}
								className={({ isActive }) => menuClass(isActive)}
								to={menu.href}
								end={menu.href === '/'}
							>
								{menu.label}
							</NavLink>
						),
					)}
				</nav>

				{/* Kanan: bahasa + login */}
				<div className="flex items-center gap-3">
					{/* Tombol bahasa */}
					<button
						className="grid h-[40px] w-[40px] place-items-center rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90"
						type="button"
						aria-label="Pilih bahasa"
					>
						<img src={internetIcon} alt="" className="h-[22px] w-[22px]" />
					</button>

					{/* Login: ikon + teks dalam satu background */}
					<NavLink
						className="inline-flex h-[40px] w-[135px] items-center justify-center gap-2 rounded-[999px] border border-white/70 bg-[linear-gradient(180deg,#EDEDED_0%,#D9D9D9_100%)] px-5 py-[10px] font-['Montserrat'] text-[20px] font-semibold leading-[20px] tracking-[1px] !text-[#000000] shadow-[0px_3px_4px_0px_#00000040] transition-opacity hover:opacity-90"
						to="/kontak"
					>
						<img src={userCircleIcon} alt="" className="h-[30px] w-[30px] shrink-0" />
						<span>Login</span>
					</NavLink>
				</div>
			</div>
		</header>
	)
}

export default LandingNavbar