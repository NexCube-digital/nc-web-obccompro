import { Calendar } from 'lucide-react'
import { WhatsAppLogo } from '../../../components/common/WhatsAppIcon'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../../assets/layanan/Lapang F2.png'

export default function GedungMultifungsi() {
	return (
		<section
			className="mx-auto grid w-[calc(100%-32px)] max-w-[1246px] gap-8 lg:gap-10 px-4 sm:px-6 py-16 sm:py-20 md:grid-cols-2"
			id="event-space"
		>
			{/* Kolom kiri — tombol ajukan sewa sejajar persis dengan foto di sebelah kanan */}
			<div className="flex flex-col min-w-0 h-full justify-between">
				<div
					className="relative h-[340px] sm:h-[380px] md:h-auto md:flex-1 min-h-[360px] xl:min-h-[440px] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] bg-cover bg-center"
					style={{ backgroundImage: `url(${lapangF1Image})` }}
				>
					<span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
						<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
							<Calendar size={13} strokeWidth={2} />
						</span>
						Lapang F1
					</span>
				</div>

				{/* Pill kategori — Wedding, Gathering, Acara Lainnya */}
				<div className="my-3.5 sm:my-4 flex w-full items-center justify-between gap-2 sm:gap-3 py-1">
					<span className="inline-flex h-[36px] sm:h-[40px] flex-1 items-center justify-center rounded-[100px] border border-[#00000080] bg-white px-2 sm:px-4 font-['Montserrat'] text-[15px] sm:text-[18px] xl:text-[20px] font-medium leading-none text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap">
						Wedding
					</span>
					<span className="inline-flex h-[36px] sm:h-[40px] flex-1 items-center justify-center rounded-[100px] border border-[#00000080] bg-white px-2 sm:px-4 font-['Montserrat'] text-[15px] sm:text-[18px] xl:text-[20px] font-medium leading-none text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap">
						Gathering
					</span>
					<span className="inline-flex h-[36px] sm:h-[40px] flex-1 items-center justify-center rounded-[100px] border border-[#00000080] bg-white px-2 sm:px-4 font-['Montserrat'] text-[15px] sm:text-[18px] xl:text-[20px] font-medium leading-none text-[#000000] shadow-[0px_2px_4px_0px_#00000040] whitespace-nowrap">
						Acara Lainnya
					</span>
				</div>

				{/* Tombol AJUKAN SEWA — sejajar rata bawah dengan foto di kanan */}
				<a
					className="relative flex h-[58px] sm:h-[64px] xl:h-[68px] w-full shrink-0 items-center justify-center gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-5 py-2 font-['Montserrat'] text-[17px] sm:text-[19px] font-semibold tracking-[0.08em] text-[#000000] shadow-[0px_5px_4px_0px_#00000040] transition-colors hover:bg-[#c8ec60]"
					href="https://wa.me/628886070900"
					target="_blank"
					rel="noreferrer"
				>
					<span className="whitespace-nowrap text-center">AJUKAN SEWA</span>
					<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#004000] text-[#CDF178]">
						<WhatsAppLogo className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
					</span>
				</a>
			</div>

			{/* Kolom kanan — teks di atas, foto di bawah */}
			<div className="flex flex-col min-w-0 h-full justify-between">
				<div>
					<span className="inline-flex h-[38px] sm:h-[40px] w-fit items-center justify-center gap-2 rounded-[100px] bg-[#ffffff33] px-5 sm:px-7 font-['Montserrat'] text-[15px] sm:text-[18px] xl:text-[20px] font-medium tracking-[1%] text-[#000000] uppercase whitespace-nowrap shadow-[0px_4px_4px_0px_#00000040,0px_2px_2px_0px_#00000040_inset]">
						GEDUNG MULTIFUNGSI
					</span>
					<h2 className="my-3 mb-2 w-full font-['Montserrat'] text-[28px] sm:text-[34px] xl:text-[40px] font-bold leading-[1.2] xl:leading-[45px] tracking-[1px] text-[#000000]">
						Ruang Serbaguna untuk Berbagai Acara
					</h2>
					<p className="w-full font-['Montserrat'] text-[15px] sm:text-[17px] xl:text-[20px] font-normal leading-[1.5] xl:leading-[30px] tracking-normal text-[#000000]">
						Lapang F1 &amp; F2 hadir sebagai ruang fleksibel untuk wedding,
						gathering, dan berbagai kebutuhan acara lainnya.
					</p>
				</div>

				<div
					className="relative mt-4 sm:mt-5 h-[320px] sm:h-[360px] md:h-auto md:flex-1 min-h-[320px] xl:min-h-[380px] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] bg-cover bg-center"
					style={{ backgroundImage: `url(${lapangF2Image})` }}
				>
					<span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md">
						<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
							<Calendar size={13} strokeWidth={2} />
						</span>
						Lapang F2
					</span>
				</div>
			</div>
		</section>
	)
}
