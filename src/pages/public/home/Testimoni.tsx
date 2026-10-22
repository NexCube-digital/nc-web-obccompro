import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import laundryLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (4).png'
import villaLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (3).png'
import sportCenterLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER.png'
import guestHouseLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import coffeeLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (6).png'
import agribusinessLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (7).png'
import reviewIcon from '../../../assets/icon/iconstack.io - (Pen New Square).svg'
import ModalTestimoni, { type TestimoniFormData } from '../../../components/ui/modal/ModalTestimoni'
import { getApiErrorMessage } from '../../../services/api'
import { getTestimonialAvatarUrl, publicTestimonialService, type PublicTestimonial } from '../../../services/Public/Testimonial'

function getCompanyLogo(company: string | null) {
	const normalizedCompany = company?.toLowerCase() ?? ''
	if (normalizedCompany.includes('laundry')) return laundryLogo
	if (normalizedCompany.includes('villa')) return villaLogo
	if (normalizedCompany.includes('sport')) return sportCenterLogo
	if (normalizedCompany.includes('guest house')) return guestHouseLogo
	if (normalizedCompany.includes('coffee')) return coffeeLogo
	if (normalizedCompany.includes('agribisnis')) return agribusinessLogo
	return null
}

export default function Testimoni() {
	const { t } = useTranslation()
	const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState('')
	const [activeTestimonial, setActiveTestimonial] = useState(0)
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

	useEffect(() => {
		let isMounted = true
		publicTestimonialService.getPublished()
			.then((data) => {
				if (isMounted) setTestimonials(data)
			})
			.catch((error: unknown) => {
				if (isMounted) setLoadError(getApiErrorMessage(error))
			})
			.finally(() => {
				if (isMounted) setIsLoading(false)
			})
		return () => {
			isMounted = false
		}
	}, [])

	const goToTestimonial = (direction: number) => {
		if (!testimonials.length) return
		setActiveTestimonial((current) => (current + direction + testimonials.length) % testimonials.length)
	}

	const handleSubmitReview = async (data: TestimoniFormData) => {
		await publicTestimonialService.submit({
			name: data.name,
			company: `${data.unit} · ${data.role}`,
			text: data.text,
			rating: data.rating,
		})
	}

	useEffect(() => {
		if (testimonials.length < 2) return
		const timer = setInterval(() => {
			setActiveTestimonial((current) => (current + 1) % testimonials.length)
		}, 10000)
		return () => clearInterval(timer)
	}, [testimonials.length])

	return (

		<section className="flex flex-col justify-center overflow-hidden py-6 md:pb-[clamp(8px,calc(100px_+_(100svh_-_800px)_*_0.3),120px)] md:pt-[clamp(44px,calc(72px_+_(100svh_-_800px)_*_0.1),84px)]">
			<div className="mx-auto flex w-[calc(100%-40px)] max-w-[1280px] flex-col md:block md:w-[calc(100%-48px)]">
				{/* Header: mobile "contents" supaya anak-anaknya bisa di-order; desktop flex */}
				<div className="contents md:flex md:flex-wrap md:items-start md:justify-between md:gap-6">
					{/* Judul: mobile rata tengah */}
					<div className="order-1 flex w-full flex-col items-center justify-start pt-[4px] text-center md:order-none md:w-auto md:items-start md:text-left">
						<span className="mb-2 flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase tracking-[1px] text-[#000000CC] md:text-[13px] md:tracking-[1.4px]">
							{t('testimonialsSection.badge')}
						</span>
						{/* Di md judul 36px agar muat sebaris dengan deskripsi; 46px mulai lg */}
						<h2 className="h-auto min-h-[40px] w-full min-w-0 max-w-[520px] gap-1 py-1 whitespace-pre-line font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-[0px] text-[#000000] md:min-w-[274px] md:text-[clamp(26px,4.5svh,36px)] md:font-medium md:leading-[clamp(30px,5.25svh,42px)] lg:text-[clamp(30px,5.75svh,46px)] lg:leading-[clamp(32px,5.75svh,46px)]">
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
								disabled={testimonials.length < 2}
								className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] md:h-[clamp(40px,6svh,50px)] md:w-[clamp(40px,6svh,50px)]"
								type="button"
								aria-label={t('testimonialsSection.prevAria')}
								onClick={() => goToTestimonial(-1)}
							>
								<ChevronLeft className="h-4 w-4 translate-x-[-1px] md:h-5 md:w-5" />
							</button>
							<button
								disabled={testimonials.length < 2}
								className="grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] md:h-[clamp(40px,6svh,50px)] md:w-[clamp(40px,6svh,50px)]"
								type="button"
								aria-label={t('testimonialsSection.nextAria')}
								onClick={() => goToTestimonial(1)}
							>
								<ChevronRight className="h-4 w-4 translate-x-[1px] md:h-5 md:w-5" />
							</button>
						</div>
					</div>
				</div>

				{/* Carousel: mobile melebar sampai tepi layar (-mx-5) supaya kartu kiri/kanan terlihat sebagian.
				    Tinggi mengikuti tinggi layar (svh) di desktop agar seluruh section muat dalam satu layar. */}
				<div className="relative order-3 -mx-5 mt-6 h-[clamp(430px,58svh,460px)] overflow-hidden md:order-none md:mx-0 md:mt-[clamp(16px,3svh,32px)] md:h-[clamp(320px,calc(400px_+_(100svh_-_800px)_*_1.1),470px)]">
					{isLoading ? (
						<div className="absolute inset-0 grid place-items-center font-['Montserrat'] text-[14px] text-[#555555]">Memuat testimoni...</div>
					) : loadError ? (
						<div className="absolute inset-0 grid place-items-center px-6 text-center font-['Montserrat'] text-[14px] text-[#555555]">Testimoni belum dapat dimuat. {loadError}</div>
					) : testimonials.length === 0 ? (
						<div className="absolute inset-0 grid place-items-center px-6 text-center font-['Montserrat'] text-[14px] text-[#555555]">Belum ada testimoni yang dipublikasikan.</div>
					) : testimonials.map((item, i) => {
						const offset = (i - activeTestimonial + testimonials.length) % testimonials.length
						const normalizedOffset = offset > testimonials.length / 2 ? offset - testimonials.length : offset
						const isVisible = normalizedOffset >= -2 && normalizedOffset <= 2
						if (!isVisible) return null

						const isActive = normalizedOffset === 0
						const scale = isActive ? 1 : 0.9
						const opacity = isActive ? 1 : 0.55
						const blur = isActive ? 0 : 0.2
						const avatarUrl = getTestimonialAvatarUrl(item.avatar)
						const companyLogo = getCompanyLogo(item.company)
						const initials = item.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

						return (
							<article
								key={item.id}
								className="absolute left-1/2 top-3 flex h-[calc(100%-12px)] w-[300px] -translate-x-1/2 flex-col rounded-[25px] border border-[#ececec] bg-[#ffffff] p-[22px] text-left shadow-[0_5px_80px_0_#EEEEE7] transition-[transform,opacity,filter] duration-700 ease-in-out [--step:320px] md:w-[344px] md:[--step:360px]"
								style={{
									transform: `translateX(calc(${normalizedOffset} * var(--step))) scale(${scale})`,
									opacity,
									filter: `blur(${blur}px)`,
									zIndex: isActive ? 30 : 10 - Math.abs(normalizedOffset),
								}}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										{avatarUrl ? (
											<img src={avatarUrl} alt="" className="h-[44px] w-[44px] shrink-0 rounded-full object-cover" />
										) : (
											<span className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-[#CDF178] font-['Montserrat'] text-[27px] font-semibold leading-[35px] tracking-[0px] text-[#004000]">{initials || '?'}</span>
										)}
										<div>
											<strong className="block font-['Montserrat'] text-[20px] font-bold leading-[20px] tracking-[0px] text-[#1F3320]">
												{item.name}
											</strong>
											<small className="mt-1 block font-['Montserrat'] text-[14px] font-normal italic leading-[16px] tracking-[0px] text-[#555555]">
												{item.company || 'Pelanggan OBC'}
											</small>
										</div>
									</div>
									<span className="font-['Montserrat'] text-[42px] font-normal leading-[42px] tracking-[-1px] text-[#1F3320]">
										{item.rating.toFixed(1)}
									</span>
								</div>

								<Quote className="mt-3 shrink-0 rotate-180 text-[#d1d5db]" width={36} height={26} preserveAspectRatio="none" fill="currentColor" strokeWidth={0} />
								{/* Teks: mengisi sisa tinggi kartu (flex-1) sehingga logo/bintang selalu menempel di bawah */}
								<p className="mt-3 min-h-0 w-full flex-1 overflow-hidden font-['Montserrat'] text-[16px] font-normal leading-[27px] tracking-[0px] text-[#000000] md:text-[clamp(14px,2.25svh,18px)] md:leading-[clamp(24px,3.75svh,30px)]">
									{item.text}
								</p>

								<div className="mt-4 flex shrink-0 items-center justify-between">
									{companyLogo && <img src={companyLogo} alt={item.company ?? ''} loading="lazy" decoding="async" className="h-auto w-auto max-h-[36px] max-w-[36px] object-contain" />}
									<div className="flex items-center gap-1.5">
										<div className="flex gap-0.5 text-[#f5a623]">
											{Array.from({ length: 5 }).map((_, s) => (
												<Star key={s} size={15} fill={s < item.rating ? 'currentColor' : 'none'} strokeWidth={s < item.rating ? 0 : 1.5} />
											))}
										</div>
									</div>
								</div>
							</article>
						)
					})}
				</div>

				{/* Indikator titik slide testimoni */}
				<div className="order-4 mt-5 flex items-center justify-center gap-2 md:order-none md:mt-[clamp(12px,2svh,20px)]">
					{testimonials.map((item, i) => (
						<button
								key={item.id}
							type="button"
								disabled={testimonials.length < 2}
							aria-label={t('testimonialsSection.goToSlide', { number: i + 1 })}
							onClick={() => setActiveTestimonial(i)}
							className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
								i === activeTestimonial ? 'w-7 bg-[#004000]' : 'w-2 bg-[#00000033] hover:bg-[#00000066]'
							}`}
						/>
					))}
				</div>

				{/* Tombol ulasan: membuka modal */}
				<div className="order-6 mt-8 flex justify-center md:order-none md:mt-[clamp(16px,3svh,32px)]">
					<button
						type="button"
						className="flex h-[44px] w-fit max-w-full cursor-pointer items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-3 py-1 font-['Montserrat'] text-[16px] font-semibold leading-[17px] tracking-[0px] text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a] md:h-[clamp(52px,8svh,69px)] md:w-fit md:px-4 md:py-[8px] md:text-[17px]"
						onClick={() => setIsReviewModalOpen(true)}
					>
						<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#004000] text-[#CDF178] md:h-9 md:w-9">
							<img src={reviewIcon} alt="" aria-hidden="true" className="h-[18px] w-[17px]" />
						</span>
						<span className="block h-[17px] w-auto whitespace-nowrap text-center text-[12px] leading-[17px] md:text-[17px]">
							{t('testimonialsSection.writeReview')}
						</span>
					</button>
				</div>
			</div>

			{isReviewModalOpen && (
				<ModalTestimoni
					isOpen
					onClose={() => setIsReviewModalOpen(false)}
					onSubmit={handleSubmitReview}
				/>
			)}
		</section>
	)
}