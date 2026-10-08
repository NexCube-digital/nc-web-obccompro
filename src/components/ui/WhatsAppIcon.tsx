import whatsappIcon from '../../assets/icon/whatsapp.svg'
import { useLocation } from 'react-router-dom'

export function WhatsAppLogo({ className = 'h-8 w-8' }: { className?: string }) {
	return <img src={whatsappIcon} alt="" aria-hidden="true" className={className} />
}

function WhatsAppIcon() {
	const { pathname } = useLocation()
	const isBusinessDetailPage = pathname.replace(/\/$/, '').startsWith('/unit-bisnis/')

	return (
		<a
			href="https://wa.me/6281234567890"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Hubungi kami via WhatsApp"
			className={`group fixed bottom-6 right-[19px] z-50 h-[62px] w-[62px] items-center justify-center rounded-[9999px] bg-[#22C55E] text-[#F7F7FA] shadow-lg transition-all duration-300 ease-out hover:scale-105 hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E] motion-reduce:transition-none md:bottom-10 md:right-20 ${
				isBusinessDetailPage ? 'hidden lg:flex' : 'flex'
			}`}
		>
			{/* Tooltip: muncul di atas tombol saat hover / focus (disembunyikan di mobile) */}
			<span
				role="tooltip"
				className="pointer-events-none absolute bottom-full right-1/2 mb-3 hidden translate-x-1/2 translate-y-2 scale-95 whitespace-nowrap rounded-full bg-[#3F6B35] px-4 py-2 text-[10px] font-normal text-white opacity-0 shadow-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none md:block"
			>
				Chat Via Whatsapp
				{/* Panah kecil menuju tombol */}
				<span
					aria-hidden="true"
					className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#3F6B35]"
				/>
			</span>

			{/* Border hover: hanya sisi serong kanan atas & kiri bawah */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rotate-45 rounded-full border border-transparent border-b-white border-t-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
			/>

			{/* Ikon: 36px di mobile, 32px (h-8 w-8) di desktop */}
			<WhatsAppLogo className="h-9 w-9 md:h-8 md:w-8" />
		</a>
	)
}

export default WhatsAppIcon