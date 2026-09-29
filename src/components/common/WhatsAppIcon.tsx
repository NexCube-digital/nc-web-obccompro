import whatsappIcon from '../../assets/icon/whatsapp.svg'

export function WhatsAppLogo({ className = 'h-8 w-8' }: { className?: string }) {
	return <img src={whatsappIcon} alt="" aria-hidden="true" className={className} />
}

function WhatsAppIcon() {
	return (
		<a
			href="https://wa.me/6281234567890"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Hubungi kami via WhatsApp"
			// Mobile: bawah 24px, kanan 19px. Desktop (md): bawah 40px, kanan 80px seperti semula
			className="fixed bottom-6 right-[19px] z-50 flex h-[62px] w-[62px] items-center justify-center rounded-[9999px] bg-[#22C55E] text-[#F7F7FA] shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E] md:bottom-10 md:right-20"
		>
			{/* Ikon: 36px di mobile, 32px (h-8 w-8) di desktop */}
			<WhatsAppLogo className="h-9 w-9 md:h-8 md:w-8" />
		</a>
	)
}

export default WhatsAppIcon