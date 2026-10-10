import { Check, ArrowUpRight, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import member from '../../../assets/bfe838718c7f801119930d28d3d286f12b853b5e.jpg'

const membershipBenefits = [
	'20% OFF untuk 4x pertemuan',
	'Harga lebih hemat',
	'Slot lapangan terjamin',
	'Jadwal tetap untuk bermain',
]

export default function Membership() {
	const { t } = useTranslation()
	return (
		<section className="relative overflow-hidden bg-white py-10">
			{/* tekstur lapangan samar dari asset untuk memberi nuansa olahraga */}
			<img
				className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-multiply"
				src={member}
				alt=""
				aria-hidden="true"
				loading="lazy"
				decoding="async"
				style={{ filter: 'brightness(1.15)' }}
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(0,157,0,0.08)_0%,transparent_60%)]"
				aria-hidden="true"
			/>

			{/* Layout:
			    - Mobile (<md): 1 kolom, lebar dibatasi 520px agar tidak melebar aneh di layar 480-767px
			    - md sampai <xl: 2 kolom (teks | kartu), blok brand & tombol di baris bawah selebar penuh dan di tengah
			    - xl ke atas: 3 kolom (teks | kartu | brand & tombol) */}
			<div className="relative mx-auto grid w-[calc(100%-60px)] max-w-[520px] grid-cols-1 items-center gap-8 md:w-[calc(100%-32px)] md:max-w-[1246px] md:grid-cols-2 md:gap-x-8 md:gap-y-6 md:px-6 xl:grid-cols-[1fr_auto_1fr] xl:gap-8">
				{/* Kolom kiri: headline & benefit */}
				<div className="flex min-w-0 flex-col items-start text-left">
					<span className="mb-1.5 block font-['Montserrat'] text-[12px] font-bold uppercase tracking-[1px] text-[#222222] md:text-[14px] md:font-medium xl:text-[15px]">
						{t('membershipSection.badge')}
					</span>
					<h2 className="whitespace-pre-line font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-normal text-[#000000] md:text-[30px] md:font-bold md:leading-[1.25] md:tracking-[1.5px] lg:text-[32px] xl:text-[36px]">
						{t('membershipSection.title')}
					</h2>
					<p className="mt-2 w-full text-justify font-['Montserrat'] text-[13px] font-normal leading-[20px] text-[#444444] md:mt-3 md:max-w-[360px] md:text-left md:text-[13.5px] md:leading-[24px] xl:text-[14.5px]">
						{t('membershipSection.description')}
					</p>
					<ul className="mt-4 w-full text-left md:mt-3 md:max-w-[360px]">
						{membershipBenefits.map((_, index) => (
							<li
								className="mb-2.5 flex items-center gap-3 font-body text-[14px] text-[#1a1a1a] md:gap-2.5 md:text-[13px]"
								key={index}
							>
								<span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] border-[#1a1a1a] text-[#1a1a1a] md:h-[18px] md:w-[18px]">
									<Check className="h-3 w-3 md:h-2.5 md:w-2.5" strokeWidth={3} />
								</span>
								{t(`membershipSection.benefits.${index}`)}
							</li>
						))}
					</ul>
				</div>

				{/* Kartu membership 3D */}
				<div className="grid min-w-0 place-items-center py-2 md:py-0">
					<div
						className="relative flex h-[168px] w-[305px] max-w-full flex-col justify-between rounded-[16px] border border-[#10B9814D] p-5 shadow-[0_0_30px_0_rgba(198,245,42,0.12),-12px_18px_36px_-10px_rgba(0,0,0,0.6)] transition-transform [transform:rotate(3deg)] hover:scale-[1.02] md:h-[196px] md:w-[320px] md:[transform:rotate(2.5deg)] lg:h-[212px] lg:w-[350px] xl:h-[224px] xl:w-[365px] xl:p-6"
						style={{
							background:
								'linear-gradient(132.33deg, #002400 0.9%, #009D00 49.99%, #004000 99.1%)',
						}}
						aria-hidden="true"
					>
						<div className="flex items-start justify-between">
							<div>
								<strong className="block font-['Montserrat'] text-[17px] font-extrabold leading-none tracking-[-0.6px] text-[#FFFFFF] md:text-[26px] xl:text-[28px]">
									OBC
								</strong>
								<span className="mt-1 block font-['Montserrat'] text-[8px] font-semibold uppercase leading-tight tracking-[2px] text-[#FFFFFFF7] md:text-[7.5px] xl:text-[8px]">
									SPORT CENTER
								</span>
							</div>
							{/* Chip */}
							<div
								className="relative grid h-[19px] w-[26px] place-items-center shadow md:h-[17px] md:w-[24px]"
								style={{ transform: 'rotate(-2.5deg)' }}
							>
								<span className="absolute inset-0 rounded-[3px] border border-[#FFF717] bg-white" />
								<span
									className="absolute h-[9px] w-[13px] rounded-[2px] border border-[#FFF717] bg-transparent md:h-2 md:w-3"
									style={{ transform: 'rotate(-2.5deg)' }}
								/>
							</div>
						</div>

						<div className="-translate-y-8 flex flex-col items-center justify-center text-center md:-translate-y-14">
							<p className="whitespace-nowrap font-['Montserrat'] text-[16px] font-extrabold leading-tight tracking-[0.5px] text-white md:text-[14px] xl:text-[15px]">
								{t('membershipSection.cardSubtitle')}
							</p>
							<p className="mt-1 font-['Montserrat'] text-[7.5px] font-semibold uppercase leading-tight tracking-[2px] text-[#FFFFFFF7] xl:text-[8px]">
								{t('membershipSection.tagline')}
							</p>
						</div>
					</div>
				</div>

				{/* Kolom kanan: brand & CTA.
				    md sampai <xl: baris sendiri selebar 2 kolom, rata tengah. xl ke atas: kolom ketiga rata kanan. */}
				<div className="flex min-w-0 flex-col items-end gap-1.5 pr-1.5 text-right md:col-span-2 md:items-center md:pr-0 md:text-center xl:col-span-1 xl:items-end xl:gap-2 xl:text-right">
					<div className="text-center xl:text-right">
						<strong className="block font-heading text-[40px] font-extrabold leading-none tracking-tight text-[#111111] md:text-[38px] xl:text-[46px]">
							OBC
						</strong>
						<small className="mt-1 block font-heading text-[13px] font-semibold tracking-[0.35em] text-[#111111] md:mt-0 md:text-[10.5px] xl:text-[11.5px]">
							SPORT CENTER
						</small>
					</div>

					<p className="mt-3 -rotate-2 text-right font-['Caveat'] text-[30px] font-bold leading-tight tracking-[1px] text-[#222222] md:mt-2 md:rotate-0 md:text-center xl:text-right xl:text-[36px]">
						Play. Move. Connect.
					</p>


					<a
						className="group mt-3 inline-flex h-[56px] w-[302px] max-w-full shrink-0 items-center justify-between gap-3 self-start rounded-full border-[0.67px] border-[#CDF178] bg-[#CDF178] py-1.5 pl-[15px] pr-[6px] font-['Montserrat'] text-[13px] font-semibold text-[#1F3320] transition-colors duration-300 hover:border-[#004000] hover:bg-[#004000] md:mt-1 md:h-[52px] md:w-full md:max-w-[340px] md:gap-3 md:self-auto md:py-2 md:pl-5 md:pr-2 md:text-[15px] xl:h-[58px] xl:max-w-[350px] xl:text-[16px]"
						href="https://sport.obcgroup.id/"
						target="_blank"
						rel="noreferrer"
					>
						{/* Mobile: tanpa perubahan tracking/weight saat hover agar tidak turun baris */}
						<span className="min-w-0 flex-1 text-justify leading-[20px] tracking-[0.02em] text-[#1F3320] transition-colors duration-300 group-hover:!text-[#CDF178] md:hidden">
							{t('membershipSection.ctaMobile')}
						</span>
						{/* Desktop/tablet: satu baris, tidak boleh turun */}
						<span className="hidden whitespace-nowrap text-left leading-[18px] text-[#1F3320] transition-all duration-300 group-hover:font-medium group-hover:tracking-[0.8px] group-hover:!text-[#CDF178] md:inline">
							{t('membershipSection.ctaDesktop')}
						</span>
						<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] transition-colors duration-300 group-hover:bg-[#CDF178] group-hover:text-[#004000] md:h-[40px] md:w-[40px] xl:h-[46px] xl:w-[46px]">
							<ArrowRight size={22} className="transition-transform duration-300 group-hover:rotate-45 md:hidden" />
							<ArrowUpRight size={22} className="hidden transition-transform duration-300 group-hover:rotate-45 md:block" />
						</span>
					</a>

					<small className="mt-11 text-right font-body text-[13px] italic text-[#6b7280] md:mt-2 md:text-center md:text-[10px] xl:text-right">
						{t('membershipSection.terms')}
					</small>
				</div>
			</div>
		</section>
	)
}