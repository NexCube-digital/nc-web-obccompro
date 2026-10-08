import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Quote, Star, BadgeCheck } from 'lucide-react'
import laundryLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (4).png'
import villaLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (3).png'
import sportCenterLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER.png'
import guestHouseLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import coffeeLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (6).png'
import agribusinessLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (7).png'
import reviewIcon from '../../../assets/icon/iconstack.io - (Pen New Square).svg'
import ModalTestimoni, { type TestimoniFormData } from '../../../components/ui/modal/ModalTestimoni'

const testimonials = [
	{
		name: 'Hyena Ktlyn',
		unit: 'Customer OBC Laundry',
		avatar: 'H',
		stars: 5,
		logo: laundryLogo,
		text: 'Hasil laundry-nya rapi dan prosesnya cukup cepat. Saya coba laundry kiloan dan pakaian sudah selesai sesuai waktu yang diinformasikan. Pelayanannya juga ramah.',
	},
	{
		name: 'Rayna Lynz',
		unit: 'Guest OBC Villa',
		avatar: 'R',
		stars: 5,
		logo: villaLogo,
		text: 'Enak untuk kumpul keluarga karena ada ruang keluarga dan area yang cukup luas. Fasilitas seperti kitchen juga membantu kalau mau menyiapkan makanan sendiri. Overall nyaman untuk short getaway.',
	},
	{
		name: 'Laurnz Raihana',
		unit: 'Sport Center Member',
		avatar: 'L',
		stars: 5,
		logo: sportCenterLogo,
		text: 'Fasilitas olahraganya cukup lengkap dan areanya nyaman. Saya biasanya main futsal dan badminton di sini, booking-nya juga cukup praktis. Cocok kalau mau olahraga bareng teman.',
	},
	{
		name: 'Nadia Citra',
		unit: 'Guest House Customer',
		avatar: 'N',
		stars: 5,
		logo: guestHouseLogo,
		text: 'Tempatnya sangat santai dan nyaman untuk istirahat. Suasana tenang, kebersihannya terjaga, dan proses check-in juga mudah.',
	},
	{
		name: 'Bima Putra',
		unit: 'OBC Coffee Member',
		avatar: 'B',
		stars: 5,
		logo: coffeeLogo,
		text: 'Kopinya enak, tempatnya nyaman, dan cocok untuk nongkrong sambil kerja ringan. Pelayanannya cepat dan ramah.',
	},
	{
		name: 'Salsabila',
		unit: 'OBC Agribisnis Visitor',
		avatar: 'S',
		stars: 5,
		logo: agribusinessLogo,
		text: 'Pengalaman di OBC sangat menyenangkan. Lingkungannya asri, edukasinya menarik, dan cocok untuk keluarga belajar sambil bersantai.',
	},
]

export default function Testimoni() {
	const { t } = useTranslation()
	const [activeTestimonial, setActiveTestimonial] = useState(0)
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

	const goToTestimonial = (direction: number) => {
		setActiveTestimonial((current) => (current + direction + testimonials.length) % testimonials.length)
	}

	const handleSubmitReview = async (data: TestimoniFormData) => {
		// TODO: kirim ke backend, contoh:
		// await fetch('/api/testimoni', {
		// 	method: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	body: JSON.stringify(data),
		// })
		console.log('Testimoni baru:', data)
	}

	// Auto-scroll untuk card testimoni setiap 10 detik
	useEffect(() => {
		const timer = setInterval(() => {
			setActiveTestimonial((current) => (current + 1) % testimonials.length)
		}, 10000)
		return () => clearInterval(timer)
	}, [])

	return (
		<section className="py-[40px] md:py-[60px]">
			<div className="mx-auto flex w-[calc(100%-40px)] max-w-[1280px] flex-col md:block md:w-[calc(100%-48px)]">
				{/* Header: mobile "contents" supaya anak-anaknya bisa di-order; desktop flex */}
				<div className="contents md:flex md:flex-wrap md:items-start md:justify-between md:gap-6">
					{/* Judul: mobile rata tengah */}
					<div className="order-1 flex w-full flex-col items-center justify-start pt-[4px] text-center md:order-none md:w-auto md:items-start md:text-left">
						<span className="mb-2 flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase tracking-[1px] text-[#000000CC] md:text-[13px] md:tracking-[1.4px]">
							{t('testimonialsSection.badge')}
						</span>
						{/* Di md judul 36px agar muat sebaris dengan deskripsi; 46px mulai lg */}
						<h2 className="h-auto min-h-[40px] w-full min-w-0 max-w-[520px] gap-1 py-1 whitespace-pre-line font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-[0px] text-[#000000] md:min-w-[274px] md:text-[36px] md:font-medium md:leading-[42px] lg:text-[46px] lg:leading-[46px]">
							{t('testimonialsSection.title')}
						</h2>
					</div>

					<div className="contents md:flex md:flex-col md:items-end md:gap-3 md:text-right">
						{/* Deskripsi: mobile rata tengah, 13px. Di md lebar dibatasi 320px agar tidak turun ke bawah judul */}
						<p className="order-2 mt-1 max-w-full text-center font-['Montserrat'] text-[13px] leading-[1.5] text-[#4b5563] md:order-none md:mt-0 md:max-w-[320px] md:text-right md:text-[15px] lg:max-w-[420px]">
							{t('testimonialsSection.subtitle')}
						</p>
						{/* Panah: mobile pindah ke bawah carousel, rata kanan, lebih kecil */}
						<div className="order-5 mt-3 flex gap-2.5 self-end md:order-none md:mt-0 md:self-auto">
							<button
								className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] md:h-[50px] md:w-[50px]"
								type="button"
								aria-label={t('testimonialsSection.prevAria')}
								onClick={() => goToTestimonial(-1)}
							>
								<ChevronLeft className="h-4 w-4 translate-x-[-1px] md:h-5 md:w-5" />
							</button>
							<button
								className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] md:h-[50px] md:w-[50px]"
								type="button"
								aria-label={t('testimonialsSection.nextAria')}
								onClick={() => goToTestimonial(1)}
							>
								<ChevronRight className="h-4 w-4 translate-x-[1px] md:h-5 md:w-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Carousel: mobile melebar sampai tepi layar (-mx-5) supaya kartu kiri/kanan terlihat sebagian */}
				<div className="relative order-3 -mx-5 mt-6 h-[460px] overflow-hidden md:order-none md:mx-0 md:mt-8 md:h-[470px]">
					{testimonials.map((t, i) => {
						const offset = (i - activeTestimonial + testimonials.length) % testimonials.length
						const normalizedOffset = offset > testimonials.length / 2 ? offset - testimonials.length : offset
						const isVisible = normalizedOffset >= -2 && normalizedOffset <= 2
						if (!isVisible) return null

						const isActive = normalizedOffset === 0
						const scale = isActive ? 1 : 0.9
						const opacity = isActive ? 1 : 0.55
						const blur = isActive ? 0 : 0.2

						return (
							<article
								key={t.name + i}
								// --step controls the partial outer cards on desktop.
								className={`absolute left-1/2 top-3 w-[300px] -translate-x-1/2 rounded-[25px] border border-[#ececec] bg-[#ffffff] p-[22px] text-left shadow-[0_5px_80px_0_#EEEEE7] transition-[transform,opacity,filter] duration-700 ease-in-out [--step:320px] md:w-[344px] md:[--step:360px] ${
									isActive ? 'h-[420px] md:h-[451px]' : 'h-[375px]'
								}`}
								style={{
									transform: `translateX(calc(${normalizedOffset} * var(--step))) scale(${scale})`,
									opacity,
									filter: `blur(${blur}px)`,
									zIndex: isActive ? 30 : 10 - Math.abs(normalizedOffset),
								}}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-[#CDF178] font-['Montserrat'] text-[27px] font-semibold leading-[35px] tracking-[0px] text-[#004000]">
											{t.avatar}
										</span>
										<div>
											<strong className="block font-['Montserrat'] text-[20px] font-bold leading-[20px] tracking-[0px] text-[#1F3320]">
												{t.name}
											</strong>
											<small className="mt-1 block font-['Montserrat'] text-[14px] font-normal italic leading-[16px] tracking-[0px] text-[#555555]">
												{t.unit}
											</small>
										</div>
									</div>
									<span className="font-['Montserrat'] text-[42px] font-normal leading-[42px] tracking-[-1px] text-[#1F3320]">
										5.0
									</span>
								</div>

								<Quote className="mt-3 rotate-180 text-[#d1d5db]" width={36} height={26} preserveAspectRatio="none" fill="currentColor" strokeWidth={0} />
								{/* Teks: mobile lebar penuh kartu, desktop 292px */}
								<p className="mt-3 h-[190px] w-full font-['Montserrat'] text-[16px] font-normal leading-[27px] tracking-[0px] text-[#000000] md:h-[210px] md:w-[292px] md:text-[18px] md:leading-[30px]">
									{t.text}
								</p>

								<div className="mt-6 flex items-center justify-between">
									<img src={t.logo} alt={t.unit} className="h-auto w-auto max-h-[36px] max-w-[36px] object-contain" />
									<div className="flex items-center gap-1.5">
										<div className="flex gap-0.5 text-[#f5a623]">
											{Array.from({ length: 5 }).map((_, s) => (
												<Star key={s} size={15} fill="currentColor" strokeWidth={0} />
											))}
										</div>
										<BadgeCheck className="text-white" size={17} fill="#3b82f6" stroke="white" />
									</div>
								</div>
							</article>
						)
					})}
				</div>

				{/* Indikator titik slide testimoni */}
				<div className="order-4 mt-5 flex items-center justify-center gap-2 md:order-none">
					{testimonials.map((_, i) => (
						<button
							key={i}
							type="button"
							aria-label={t('testimonialsSection.goToSlide', { number: i + 1 })}
							onClick={() => setActiveTestimonial(i)}
							className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
								i === activeTestimonial ? 'w-7 bg-[#004000]' : 'w-2 bg-[#00000033] hover:bg-[#00000066]'
							}`}
						/>
					))}
				</div>

				{/* Tombol ulasan: membuka modal */}
				<div className="order-6 mt-8 flex justify-center md:order-none">
					<button
						type="button"
						className="flex h-[44px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1 font-['Montserrat'] text-[16px] font-semibold leading-[17px] tracking-[0px] text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a] md:h-[69.33px] md:w-[438px] md:px-4 md:py-[8px] md:text-[17px]"
						onClick={() => setIsReviewModalOpen(true)}
					>
						<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#004000] text-[#CDF178] md:h-9 md:w-9">
							<img src={reviewIcon} alt="" aria-hidden="true" className="h-[18px] w-[17px]" />
						</span>
						<span className="block h-[17px] w-auto whitespace-nowrap text-center text-[12px] leading-[17px] md:w-[332px] md:text-[17px]">
							{t('testimonialsSection.writeReview')}
						</span>
					</button>
				</div>
			</div>

			<ModalTestimoni
				isOpen={isReviewModalOpen}
				onClose={() => setIsReviewModalOpen(false)}
				onSubmit={handleSubmitReview}
			/>
		</section>
	)
}