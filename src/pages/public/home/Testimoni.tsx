import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star, BadgeCheck } from 'lucide-react'
import laundryLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (4).png'
import villaLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (3).png'
import sportCenterLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER.png'
import guestHouseLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (1).png'
import coffeeLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (6).png'
import agribusinessLogo from '../../../assets/logo/unit bisnis/LOGO OBC SPORT CENTER (7).png'
import reviewIcon from '../../../assets/icon/iconstack.io - (Pen New Square).svg'

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
	const [activeTestimonial, setActiveTestimonial] = useState(0)
	const [isTestimonialHovered, setIsTestimonialHovered] = useState(false)

	const goToTestimonial = (direction: number) => {
		setActiveTestimonial((current) => (current + direction + testimonials.length) % testimonials.length)
	}

	// Auto-scroll untuk card testimoni (pause saat hover atau touch)
	useEffect(() => {
		if (isTestimonialHovered) return
		const timer = setInterval(() => {
			setActiveTestimonial((current) => (current + 1) % testimonials.length)
		}, 4000)
		return () => clearInterval(timer)
	}, [isTestimonialHovered])

	return (
		<section className="py-[60px]">
			<div className="mx-auto w-[calc(100%-32px)] max-w-[1246px] px-4 sm:px-6">
				<div className="flex flex-wrap items-start justify-between gap-6">
					<div className="flex flex-col justify-start pt-[4px] text-left">
						<span className="mb-2 flex items-center gap-2 font-['Montserrat'] text-[13px] font-semibold uppercase tracking-[1.4px] text-[#000000CC]">
							TESTIMONI
						</span>
						<h2 className=" gap-1 py-1 h-auto min-h-[40px] w-full min-w-[274px] max-w-[520px] font-['Montserrat'] text-[46px] font-medium leading-[46px] tracking-[0px] text-[#000000]">
							Apa Kata Mereka
							<br />
							Tentang OBC Group
						</h2>
					</div>

					<div className="flex flex-col items-end gap-3 text-right">
						<p className="max-w-[420px] font-['Montserrat'] text-[15px] leading-[1.5] text-[#4b5563]">
							Pengalaman Menginap, Berolahraga, dan Beraktivitas di OBC Group
						</p>
						<div className="flex gap-2.5">
							<button
								className="grid h-[50px] w-[50px] place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] cursor-pointer"
								type="button"
								aria-label="Testimoni sebelumnya"
								onClick={() => goToTestimonial(-1)}
							>
								<ChevronLeft size={20} className="translate-x-[-1px]" />
							</button>
							<button
								className="grid h-[50px] w-[50px] place-items-center rounded-full border-[0.67px] border-[#1F3320] bg-white text-[#1F3320] transition-colors hover:bg-[#f5f5f5] cursor-pointer"
								type="button"
								aria-label="Testimoni berikutnya"
								onClick={() => goToTestimonial(1)}
							>
								<ChevronRight size={20} className="translate-x-[1px]" />
							</button>
						</div>
					</div>
				</div>

				<div
					className="relative mt-8 h-[470px] overflow-hidden"
					onMouseEnter={() => setIsTestimonialHovered(true)}
					onMouseLeave={() => setIsTestimonialHovered(false)}
					onTouchStart={() => setIsTestimonialHovered(true)}
					onTouchEnd={() => setIsTestimonialHovered(false)}
				>
					{testimonials.map((t, i) => {
						const offset = ((i - activeTestimonial + testimonials.length) % testimonials.length)
						const normalizedOffset = offset > testimonials.length / 2 ? offset - testimonials.length : offset
						const isVisible = Math.abs(normalizedOffset) <= 2
						if (!isVisible) return null

						const isActive = normalizedOffset === 0
						const translateX = normalizedOffset * 360
						const scale = isActive ? 1 : 0.9
						const opacity = isActive ? 1 : 0.55
						const blur = isActive ? 0 : 0.2

						return (
							<article
								key={t.name + i}
								className="absolute left-1/2 top-3 -translate-x-1/2 rounded-[25px] border border-[#ececec] bg-[#ffffff] p-[26px] text-left shadow-[0_5px_80px_0_#EEEEE7] transition-all duration-500 ease-out"
								style={{
									height: isActive ? '451px' : '391px',
									width: '344px',
									transform: `translateX(${translateX}px) scale(${scale})`,
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
								<p className="mt-3 font-['Montserrat'] text-[18px] font-normal leading-[30px] tracking-[0px] text-[#000000]" style={{ width: '292px', height: '210px' }}>
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
				<div className="mt-5 flex justify-center items-center gap-2">
					{testimonials.map((_, i) => (
						<button
							key={i}
							type="button"
							aria-label={`Pindah ke testimoni ${i + 1}`}
							onClick={() => setActiveTestimonial(i)}
							className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
								i === activeTestimonial ? 'w-7 bg-[#004000]' : 'w-2 bg-[#00000033] hover:bg-[#00000066]'
							}`}
						/>
					))}
				</div>

				<div className="mt-8 flex justify-center">
					<a
						className="flex h-[69.33px] w-[438px] items-center justify-center gap-[10px] rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] px-4 py-[8px] font-['Montserrat'] text-[17px] font-semibold leading-[17px] tracking-[0px] text-[#000000] shadow-[0px_3px_5.8px_0px_#0000004D] transition-colors hover:bg-[#c0e85a]"
						href="#kontak"
					>
						<span className="grid h-9 w-9 place-items-center rounded-full bg-[#004000] text-[#CDF178]">
							<img src={reviewIcon} alt="" aria-hidden="true" className="h-[18px] w-[17px]" />
						</span>
						<span className="block h-[17px] w-[332px] text-center leading-[17px]">
							Tulis Ulasan Pengalaman Kamu Disini
						</span>
					</a>
				</div>
			</div>
		</section>
	)
}
