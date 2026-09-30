import whatsappIcon from '../../assets/icon/whatsapp2.svg'

interface WhatsAppCardProps {
	title: string
	description: string
	link?: string
	className?: string
}

export function WhatsAppCard({
	title,
	description,
	link = 'https://wa.me/6280000000000',
	className = '',
}: WhatsAppCardProps) {
	return (
		<div className={`mt-8 w-full md:mt-0 md:w-[32%] ${className}`.trim()}>
			{/* Mobile: tanpa kartu/bayangan, lebar penuh. Desktop: kartu seperti semula */}
			<div className="flex min-h-[190px] w-full max-w-none flex-col items-center justify-center gap-3 rounded-[12px] bg-[#FFFFFF00] p-0 text-center shadow-none md:min-h-[206px] md:max-w-[372px] md:gap-[10px] md:p-[24px] md:shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)]">
				<p className="w-full font-['Montserrat'] text-[18px] font-semibold leading-[24px] tracking-[0%] text-black md:text-[16px] md:leading-[20px]">
					{title}
				</p>
				<p className="w-full font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-[0%] text-black md:text-[13px] md:leading-[20px]">
					{description}
				</p>
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					aria-label="Hubungi kami via WhatsApp"
					className="mt-2 inline-flex h-[52px] w-full max-w-none items-center justify-center gap-2 rounded-full bg-[#237D23] px-5 py-3 transition-colors hover:bg-[#1d681d] md:mt-0 md:h-[48px] md:max-w-[324px]"
				>
					<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#CDF178]/70 bg-[#C5F00533]">
						<img src={whatsappIcon} alt="" aria-hidden="true" className="h-[16px] w-[16.9235px] shrink-0 brightness-0 invert" />
					</span>
					<span className="font-['Montserrat'] text-[16px] font-medium leading-[20px] tracking-[0px] text-white">
						Pesan
					</span>
				</a>
			</div>
		</div>
	)
}

export default WhatsAppCard