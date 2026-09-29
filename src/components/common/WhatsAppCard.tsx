import { WhatsAppLogo } from './WhatsAppIcon'

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
			<div className="flex min-h-0 w-full max-w-none flex-col items-center justify-center gap-3 rounded-[12px] bg-[#FFFFFF00] p-0 text-center shadow-none md:min-h-[206px] md:max-w-[372px] md:gap-[10px] md:p-[24px] md:shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)]">
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
					<span className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#C5F00533]">
						<WhatsAppLogo className="h-[16.9235px] w-[16px] text-white" />
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