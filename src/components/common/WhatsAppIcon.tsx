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
			className="fixed bottom-10 right-20 z-50 flex h-[62px] w-[62px] items-center justify-center rounded-[9999px] bg-[#22C55E] text-[#F7F7FA] shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]"
		>
			<WhatsAppLogo />
		</a>
	)
}

export default WhatsAppIcon