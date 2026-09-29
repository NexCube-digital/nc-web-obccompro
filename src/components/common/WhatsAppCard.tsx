import { WhatsAppLogo } from './WhatsAppIcon'

interface WhatsAppCardProps {
	title: string
	description: string
	link?: string
}

export function WhatsAppCard({
	title,
	description,
	link = 'https://wa.me/6280000000000',
}: WhatsAppCardProps) {
	return (
		<div className="mt-8 w-full md:mt-0 md:w-[32%]">
			<div className="flex min-h-[206px] w-full max-w-[372px] flex-col items-center justify-center gap-[10px] rounded-[12px] bg-[#FFFFFF00] p-[24px] text-center shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)]">
				<p className="w-full font-['Montserrat'] text-[16px] font-semibold leading-[20px] tracking-[0%] text-black">
					{title}
				</p>
				<p className="w-full font-['Montserrat'] text-[13px] font-normal leading-[20px] tracking-[0%] text-black">
					{description}
				</p>
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					aria-label="Hubungi kami via WhatsApp"
					className="inline-flex h-[48px] w-full max-w-[324px] items-center justify-center gap-2 rounded-full bg-[#237D23] px-5 py-3 transition-colors hover:bg-[#1d681d]"
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
