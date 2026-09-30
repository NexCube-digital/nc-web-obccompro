import WhatsAppLogo from '../../../assets/icon/whatsapp2.svg'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../../assets/layanan/Lapang F2.png'
import eventIcon from '../../../assets/icon/iconstack.io - (Event).svg'

const eventCategories = ['Wedding', 'Gathering', 'Acara Lainnya']

export default function GedungMultifungsi() {
	return (
		<section
			className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] grid-cols-2 gap-x-[10px] py-[55px] md:w-[calc(100%-48px)] md:gap-10 md:py-20"
			id="event-space"
		>
			{/* Kolom kiri: mobile "contents" (anak ikut grid & di-order), desktop flex-col */}
			<div className="contents md:flex md:h-full md:min-w-0 md:flex-col md:justify-between">
				{/* Foto Lapang F1: mobile di baris gambar (kiri) tinggi 140px */}
				<div
					className="relative order-4 mt-5 h-[140px] rounded-[24px] bg-cover bg-center md:order-none md:mt-0 md:h-auto md:min-h-[360px] md:w-full md:flex-1 md:overflow-hidden md:rounded-[32px] xl:min-h-[440px]"
					style={{ backgroundImage: `url(${lapangF1Image})` }}
				>
					{/* Label: mobile di tengah bawah foto, desktop di kanan atas */}
					<span className="absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md md:bottom-auto md:left-auto md:right-3 md:top-3 md:translate-x-0 md:translate-y-0">
						<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
							<img src={eventIcon} alt="" aria-hidden="true" className="h-[13px] w-[14px]" />
						</span>
						Lapang F1
					</span>
				</div>

				{/* Pill kategori: mobile lebar penuh di bawah foto */}
				<div className="order-6 col-span-2 mb-4 mt-9 flex h-[48px] w-full max-w-full items-center justify-between py-2 md:order-none md:my-4 md:h-auto md:gap-3 md:py-1">
					{eventCategories.map((cat) => (
						<span
							key={cat}
							className="inline-flex h-[32px] w-auto shrink-0 items-center justify-center gap-[5px] whitespace-nowrap rounded-[100px] border border-[#00000080] bg-white px-[14px] py-[5px] font-['Montserrat'] text-[16px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] md:h-[40px] md:flex-1 md:px-4 md:text-[18px] md:leading-none xl:text-[20px]"
						>
							{cat}
						</span>
					))}
				</div>

				{/* Tombol: mobile lebar penuh, ikon di kiri teks. Desktop sejajar rata bawah dengan foto kanan */}
				<a
					className="relative order-7 col-span-2 flex h-[60px] w-full max-w-full shrink-0 flex-row-reverse items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-[18px] py-0 font-['Montserrat'] text-[17px] font-semibold leading-none tracking-[0.08em] text-[#000000] shadow-[0px_5px_4px_0px_#00000040] transition-colors hover:bg-[#c8ec60] md:order-none md:h-[64px] md:flex-row md:gap-3 md:px-5 md:py-1 md:text-[19px] xl:h-[68px] xl:py-1"
					href="https://wa.me/628886070900"
					target="_blank"
					rel="noreferrer"
				>
					<span className="whitespace-nowrap text-center md:hidden">Hubungi Kami Untuk Sewa</span>
					<span className="hidden whitespace-nowrap text-center md:inline">Hubungi Kami Untuk Sewa</span>
					<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#004000]">
						<img src={WhatsAppLogo} alt="" aria-hidden="true" className="h-[30px] w-[30px] shrink-0" />
					</span>
				</a>
			</div>

			{/* Kolom kanan */}
			<div className="contents md:flex md:h-full md:min-w-0 md:flex-col md:justify-between">
				{/* Wrapper teks: mobile "contents" supaya badge/judul/deskripsi bisa di-order */}
				<div className="contents md:block">
					{/* Badge: mobile title case, desktop kapital */}
					<span className="order-1 col-span-2 inline-flex h-[32px] w-[208px] items-center justify-center gap-[10px] justify-self-start whitespace-nowrap rounded-[100px] bg-[#ffffff33] px-[20px] py-0 font-['Montserrat'] text-[16px] font-medium normal-case leading-[100%] tracking-[1%] text-[#000000] shadow-[0px_4px_4px_0px_#00000040,0px_2px_2px_0px_#00000040_inset] md:h-[40px] md:w-fit md:px-7 md:text-[18px] md:uppercase xl:text-[20px]">
						Gedung multifungsi
					</span>
					{/* Judul: mobile 22px */}
					<h2 className="order-2 col-span-2 mb-3 mt-4 w-full max-w-full font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] md:mb-2 md:mt-3 md:text-[34px] md:leading-[1.2] md:tracking-[1px] xl:text-[40px] xl:leading-[45px]">
						Ruang Serbaguna untuk Berbagai Acara
					</h2>
					{/* Deskripsi: mobile 14px */}
					<p className="order-3 col-span-2 w-full max-w-full font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-[#000000] md:text-[17px] md:leading-[1.5] xl:text-[20px] xl:leading-[30px]">
						Lapang F1 &amp; F2 hadir sebagai ruang fleksibel untuk wedding,
						gathering, dan berbagai kebutuhan acara lainnya.
					</p>
				</div>

				{/* Foto Lapang F2: mobile di baris gambar (kanan) tinggi 140px */}
				<div
					className="relative order-5 mt-5 h-[140px] rounded-[24px] bg-cover bg-center md:order-none md:mt-5 md:h-auto md:min-h-[320px] md:w-full md:flex-1 md:overflow-hidden md:rounded-[32px] xl:min-h-[380px]"
					style={{ backgroundImage: `url(${lapangF2Image})` }}
				>
					<span className="absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md md:bottom-auto md:left-3 md:top-3 md:translate-x-0 md:translate-y-0">
						<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white">
							<img src={eventIcon} alt="" aria-hidden="true" className="h-[13px] w-[14px]" />
						</span>
						Lapang F2
					</span>
				</div>
			</div>
		</section>
	)
}