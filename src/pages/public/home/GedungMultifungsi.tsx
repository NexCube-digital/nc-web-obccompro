import WhatsAppLogo from '../../../assets/icon/whatsapp2.svg'
import { useTranslation } from 'react-i18next'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../../assets/layanan/Lapang F2.png'
import eventIcon from '../../../assets/icon/iconstack.io - (Event).svg'

const eventCategories = ['wedding', 'gathering', 'otherEvents']

// Kelas badge foto: kelas asli + override di bawah lg
// <lg: badge di dalam foto (tengah bawah, tanpa translate-y), warna tetap seperti aslinya
// ≤460px: ukuran font & jarak lebih kecil
const photoBadgeBase =
	'absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/25 bg-white/15 py-1 pl-1 pr-3.5 font-heading text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] backdrop-blur-md max-lg:bottom-2 max-lg:translate-y-0 sm:max-lg:bottom-3 max-[460px]:gap-1.5 max-[460px]:pr-3 max-[460px]:text-[11px]'

export default function GedungMultifungsi() {
	const { t } = useTranslation()

	return (
		// Section full layar: min-h-svh + konten di-center vertikal.
		// Di desktop (lg+) padding vertikal dan tinggi foto mengikuti tinggi layar (clamp berbasis svh),
		// supaya seluruh konten (termasuk tombol WhatsApp di bawah) muat di satu layar, mis. 1280x800.
		<section className="flex items-center lg:h-[max(100svh,640px)]" id="event-space">
			{/* < lg: satu alur (grid 2 kolom hanya untuk baris foto). >= lg: dua kolom berdampingan. */}
			<div className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] grid-cols-2 gap-x-[10px] py-6 sm:w-[calc(100%-48px)] sm:gap-x-4 md:gap-x-5 md:py-8 lg:gap-x-10 lg:h-full lg:grid-rows-1 lg:pb-[clamp(16px,4svh,40px)] lg:pt-[clamp(80px,11svh,104px)]">
				{/* Kolom kiri: < lg "contents" (anak ikut grid & di-order), >= lg flex-col */}
				<div className="contents lg:flex lg:h-full lg:min-w-0 lg:flex-col lg:justify-between">
					{/* Foto Lapang F1 */}
					<div
						className="group relative order-4 mt-5 h-[140px] min-w-0 overflow-hidden rounded-[24px] sm:h-[200px] md:h-[260px] lg:order-none lg:mt-0 lg:h-auto lg:min-h-[200px] lg:w-full lg:flex-1 lg:rounded-[32px]"
					>
						<img src={lapangF1Image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
						{/* Label: < lg di dalam foto (tengah bawah), >= lg di kanan atas */}
						<span className={`${photoBadgeBase} lg:bottom-auto lg:left-auto lg:right-3 lg:top-3 lg:translate-x-0 lg:translate-y-0`}>
							<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white max-[460px]:h-5 max-[460px]:w-5">
								<img src={eventIcon} alt="" aria-hidden="true" className="h-[13px] w-[14px] max-[460px]:h-[11px] max-[460px]:w-[12px]" />
							</span>
							Lapang F1
						</span>
					</div>

					<div className="order-6 col-span-2 mb-4 mt-9 flex w-full max-w-full flex-wrap items-center justify-center gap-2 py-2 max-lg:mt-4 sm:justify-between sm:gap-3 sm:max-lg:justify-center sm:max-lg:gap-2 lg:order-none lg:my-[clamp(4px,calc(16px_+_(100svh_-_800px)_*_0.05),16px)] lg:py-1">
						{eventCategories.map((cat) => (
							<span
								key={cat}
								className="inline-flex min-h-[32px] shrink-0 items-center justify-center whitespace-nowrap rounded-[100px] border border-[#00000080] bg-white px-3 py-[5px] font-['Montserrat'] text-[13px] font-medium leading-[20px] tracking-normal text-[#000000] shadow-[0px_2px_4px_0px_#00000040] min-[400px]:text-[14px] sm:px-[18px] sm:text-[16px] lg:min-h-[40px] lg:flex-1 lg:px-3 lg:text-[15px] lg:leading-none xl:px-4 xl:text-[18px] 2xl:text-[20px]"
							>
								{t(`multipurposeSection.categories.${cat}`)}
							</span>
						))}
					</div>

					{/* Tombol: < lg lebar penuh, ikon di kiri teks. >= lg ikon di kanan teks */}
					<a
						className="relative order-7 col-span-2 flex min-h-[60px] w-full max-w-full shrink-0 flex-row-reverse items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-2 font-['Montserrat'] text-[14px] font-semibold leading-tight tracking-[0.04em] text-[#000000] shadow-[0px_5px_4px_0px_#00000040] transition-colors hover:bg-[#c8ec60] min-[400px]:text-[16px] sm:min-h-[64px] sm:px-[18px] sm:text-[17px] sm:tracking-[0.08em] lg:order-none lg:flex-row lg:gap-3 lg:px-5 lg:py-1 lg:text-[16px] lg:tracking-[0.05em] xl:min-h-[clamp(56px,8.5svh,68px)] xl:text-[19px] xl:tracking-[0.08em]"
						href="https://wa.me/628886070900"
						target="_blank"
						rel="noreferrer"
					>
						<span className="text-center sm:whitespace-nowrap">{t('multipurposeSection.contactToRent')}</span>
						<span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-[#004000] sm:h-[52px] sm:w-[52px]">
							<img src={WhatsAppLogo} alt="" aria-hidden="true" className="h-[26px] w-[26px] shrink-0 sm:h-[30px] sm:w-[30px]" />
						</span>
					</a>
				</div>

				{/* Kolom kanan */}
				<div className="contents lg:flex lg:h-full lg:min-w-0 lg:flex-col lg:justify-between">
					{/* Wrapper teks: < lg "contents" supaya badge/judul/deskripsi bisa di-order */}
					<div className="contents lg:block">
						{/* Badge: lebar mengikuti isi, title case di < lg, kapital di >= lg */}
						<span className="order-1 col-span-2 inline-flex h-[32px] w-fit items-center justify-center gap-[10px] justify-self-start whitespace-nowrap rounded-[100px] bg-[#ffffff33] px-5 py-0 font-['Montserrat'] text-[16px] font-medium normal-case leading-[100%] tracking-[1%] text-[#000000] shadow-[0px_4px_4px_0px_#00000040,0px_2px_2px_0px_#00000040_inset] md:h-[40px] md:px-7 md:text-[18px] lg:uppercase xl:text-[20px]">
							{t('multipurposeSection.badge')}
						</span>
						{/* Judul: bertahap 22 / 28 / 32 / 40 */}
						<h2 className="order-2 col-span-2 mb-3 mt-4 w-full max-w-full font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] sm:text-[28px] sm:leading-[36px] md:text-[32px] md:leading-[40px] lg:mb-2 lg:mt-3 lg:text-[28px] lg:leading-[1.2] lg:tracking-[0.5px] xl:text-[40px] xl:leading-[45px] xl:tracking-[1px]">
							{t('multipurposeSection.title')}
						</h2>
						{/* Deskripsi: bertahap 14 / 16 / 17 / 20 */}
						<p className="order-3 col-span-2 w-full max-w-full font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-[#000000] sm:text-[16px] sm:leading-[26px] lg:text-[16px] lg:leading-[1.5] xl:text-[20px] xl:leading-[30px]">
							{t('multipurposeSection.description')}
						</p>
					</div>

					{/* Foto Lapang F2 */}
					<div
						className="group relative order-5 mt-5 h-[140px] min-w-0 overflow-hidden rounded-[24px] sm:h-[200px] md:h-[260px] lg:order-none lg:mt-[clamp(6px,calc(20px_+_(100svh_-_800px)_*_0.05),20px)] lg:h-auto lg:min-h-[200px] lg:w-full lg:flex-1 lg:rounded-[32px]"
					>
						<img src={lapangF2Image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
						<span className={`${photoBadgeBase} lg:bottom-auto lg:left-3 lg:top-3 lg:translate-x-0 lg:translate-y-0`}>
							<span className="grid h-6 w-6 place-items-center rounded-full bg-[#0a730a] text-white max-[460px]:h-5 max-[460px]:w-5">
								<img src={eventIcon} alt="" aria-hidden="true" className="h-[13px] w-[14px] max-[460px]:h-[11px] max-[460px]:w-[12px]" />
							</span>
							Lapang F2
						</span>
					</div>
				</div>
			</div>
		</section>
	)
}