import { MapPin, LayoutGrid, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from '../../../components/layouts/LandingNavbar'
import LandingFooter from '../../../components/layouts/LandingFooter'
import LazySection from '../../../components/common/LazySectionHome'
import ScrollReveal from '../../../components/animation/ScrollReveal'
import { UnitBisnis } from '../../../components/ui/OtherUnitBisnis'
import { WhatsAppCard } from '../../../components/ui/WhatsAppCard'
import ImageLightbox from '../../../components/ui/modal/ImageLightbox'
import heroImage from '../../../assets/images/unit-bisnis/agribisnis.webp'
import agricultureIcon from '../../../assets/icon/iconstack.io - (Agriculture Analytics).svg'
import galleryImage1 from '../../../assets/images/unit-bisnis/agribisnis/fas1.webp'
import galleryImage2 from '../../../assets/images/unit-bisnis/agribisnis/fas2.webp'
import galleryImage3 from '../../../assets/images/unit-bisnis/agribisnis/fas3.webp'
import galleryImage4 from '../../../assets/images/unit-bisnis/agribisnis/fas4.webp'
import galleryImage5 from '../../../assets/images/unit-bisnis/agribisnis/fas5.webp'

interface Area {
	name: string
	location: string
	size: number
}

const GOOGLE_MAPS_LINK = 'https://www.google.com/maps?q=-6.8398,107.6195+(OBC+Agribisnis)'

// Tiga area/plot lahan OBC Agribisnis — alamat & luas mengikuti desain
const AREAS: Area[] = [
	{ name: 'Tugu 1', size: 1000, location: 'Jl. Tugu Laksana No. 1, Wangunsari, Lembang' },
	{ name: 'Tugu 2', size: 1600, location: 'Jl. Tugu Laksana, Wangunsari, Lembang' },
	{ name: 'Tugu 3', size: 2000, location: 'Jl. Tugu Laksana, Wangunsari, Lembang' },
]

const GALLERY_IMAGES = [
	galleryImage1,
	galleryImage2,
	galleryImage3,
	galleryImage4,
	galleryImage5,
]

function AgribisnisPage() {
	const { t } = useTranslation()
	const waTitle = t('units.agribisnis.whatsappCardTitle')
	const waDescription = t('units.agribisnis.whatsappCardDesc')
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)

	return (
		// pb mobile: ruang untuk bar WhatsApp fixed supaya footer tidak tertutup
		<div className="min-h-screen bg-obc-ivory pb-[180px] md:pb-[100px] lg:pb-0">
			<LandingNavbar />

			{/* Hero: mobile hanya foto (teks pindah ke bawah foto), desktop mengikuti struktur dev */}
			<section className="hero-enter relative h-[360px] overflow-hidden min-[412px]:max-[767px]:h-[440px] md:h-auto md:min-h-[100svh]">
				<img src={heroImage} alt="OBC Agribisnis" className="hero-background-enter absolute inset-0 h-full w-full object-cover object-top min-[412px]:max-[499px]:object-[50%_35%] min-[500px]:max-[767px]:object-[50%_45%] md:object-center" />
				{/* Overlay: hanya desktop. Lebar bertahap mengikuti dev */}
				<div className="absolute inset-0 hidden bg-gradient-to-t from-obc-charcoal/60 via-obc-charcoal/10 to-transparent md:block" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-7 rounded-t-[28px] bg-obc-ivory md:hidden" />
				<div
					className="absolute right-0 top-0 hidden h-full w-[72%] max-w-[763.59px] md:block lg:w-[65%] xl:w-[58%] 2xl:w-[52%]"
					style={{
						background:
							'linear-gradient(270deg, #FAFAF2 0%, rgba(250, 250, 242, 0.9) 40.87%, rgba(250, 250, 242, 0.592749) 65.38%, rgba(250, 250, 242, 0) 90.87%)',
					}}
				/>

				{/* Teks hero: hanya desktop, container max-w 1246px, rata kanan */}
				<div className="hero-content-enter relative z-10 hidden min-h-[100svh] w-full items-center pb-12 pt-24 md:flex">
					<div className="mx-auto flex w-full max-w-[1246px] justify-end px-8 md:px-10 lg:pr-1">
						<div className="w-full max-w-[400px] text-black lg:max-w-[472px]">
							<span className="inline-flex items-center gap-2 font-['Montserrat'] text-[14px] font-semibold uppercase leading-[16px] tracking-[1.4px] text-black">
								<span className="h-1.5 w-1.5 rounded-full bg-[#000000]" />
								{t('units.agribisnis.category')}
							</span>
							<h1 className="mt-5 whitespace-pre-line font-['Montserrat'] text-[44px] font-bold leading-[56px] tracking-[1.5px] text-black lg:text-[56px] lg:leading-[70px]">
								{t('units.agribisnis.title')}
							</h1>
							<p className="mt-4 max-w-[400px] text-justify font-['Montserrat'] text-[16px] font-normal leading-[26px] tracking-[0.18px] text-black lg:text-[18px] lg:leading-[29.25px]">
								{t('units.agribisnis.desc')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<LazySection minHeight={1100}>
			<ScrollReveal>
			<div className="mx-auto max-w-[1200px] md:px-8 lg:flex lg:items-stretch lg:gap-10">
				{/* Kolom kiri */}
				<div className="min-w-0 lg:w-2/3">
					{/* Tentang */}
					<section className="relative z-10 -mt-7 rounded-t-[28px] bg-obc-ivory px-[30px] pb-10 pt-8 md:mt-0 md:rounded-none md:bg-transparent md:px-0 md:py-14">
						<div className="flex max-w-[653px] flex-col">
							<h1 className="order-1 text-center font-['Montserrat'] text-[22px] font-semibold leading-[30px] text-black md:hidden">
								{t('units.agribisnis.title')}
							</h1>
							<div className="order-2 mb-8 mt-4 grid grid-cols-2 gap-[15px] py-2 sm:grid-cols-3 md:order-3 md:mb-0 md:mt-8 lg:gap-3">
								{AREAS.map((area) => (
									<div
										key={area.name}
										className="flex min-w-0 items-center gap-3 rounded-lg bg-white p-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:gap-2 lg:p-3 xl:gap-3 xl:p-[14px]"
									>
										<img src={agricultureIcon} alt="" className="h-[22px] w-[22px] shrink-0 object-contain" aria-hidden="true" />
										<div className="min-w-0">
											<p className="font-['Montserrat'] text-[11px] font-semibold uppercase leading-[15.4px] tracking-[1.65px] text-[#41493D]">
												{area.name}
											</p>
											<p className="font-['Montserrat'] text-[14px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022] lg:text-[13px] lg:tracking-[0.3px] xl:text-[14px] xl:tracking-[0.56px]">
														{t('common.landArea')} : {area.size} m²
											</p>
										</div>
									</div>
								))}
							</div>

							<h2 className="order-3 mt-2 flex items-center font-['Montserrat'] text-[18px] font-semibold leading-[100%] tracking-[0%] text-black md:order-1 md:mt-0 md:min-h-[30px] md:text-[25px]">
								{t('units.agribisnis.aboutTitle')}
							</h2>
							<p className="order-4 mt-3 max-w-[653px] text-justify font-['Montserrat'] text-[13px] font-normal leading-[22px] tracking-[0px] text-black md:order-2 md:mt-4 md:text-[16px] md:leading-[26px]">
								{t('units.agribisnis.aboutText')}
							</p>
						</div>
					</section>

					{/* Area OBC Agribisnis */}
					<section className="px-4 pb-16 sm:px-5 md:px-0 md:pb-10 lg:pb-16">
						<div>
							{/* Garis pemisah tipis di atas & bawah section, sesuai desain */}
							<div className="border-y border-black/[0.06] py-8">
								{/* Badge + judul: mobile menjorok 17px dari tepi kartu, sm ke atas 26px */}
								<div className="pl-[17px] sm:pl-[26px]">
									<span className="inline-flex h-5 items-center gap-1 rounded-full bg-[#F3F3F3] px-4 py-1 font-['Montserrat'] text-[10px] font-medium uppercase leading-[14px] tracking-[0px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:h-[22px] sm:w-[210px] sm:text-[11px] sm:font-semibold sm:tracking-[0.55px]">
										<LayoutGrid size={12} className="shrink-0 text-black" />
										{t('units.agribisnis.areaBadge')}
									</span>
									<h2 className="mt-1 flex min-h-[30px] w-full items-center font-['Montserrat'] text-[20px] font-semibold uppercase leading-[100%] tracking-[0%] text-black sm:mt-4 sm:text-[25px] sm:normal-case">
										{t('units.agribisnis.areaTitle')}
									</h2>
								</div>

								{/* Mobile: kartu full width tanpa padding tambahan, jarak antar kartu 20px */}
								<div className="mt-[30px] flex max-w-[630px] flex-col gap-5 px-0 sm:mt-8 sm:gap-8 sm:px-4">
									{AREAS.map((area) => (
										<div
											key={area.name}
											className="h-auto min-h-[256px] w-full max-w-[598px] rounded-xl border border-[#0000004D] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
										>
											<h3 className="flex min-h-[22px] items-center font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black sm:min-h-[30px] sm:text-[25px]">
												{area.name}
											</h3>

											<p className="mt-7 font-['Montserrat'] text-[12px] font-semibold uppercase leading-[14px] tracking-[0.55px] text-[#727973] sm:mt-6 sm:text-[11px]">
															{t('common.location')}
											</p>
											<p className="mt-2.5 flex items-start gap-1 font-['Montserrat'] text-[13px] font-medium leading-[20.63px] tracking-[0px] text-[#1A1C19] sm:mt-1 sm:gap-1.5 sm:text-[15px]">
												{/* Pin di desain berwarna hitam solid */}
												<MapPin
													size={15}
													fill="currentColor"
													className="mt-[3px] h-[14px] w-[14px] shrink-0 text-[#1A1C19] sm:h-[15px] sm:w-[15px] [&_circle]:fill-white"
												/>
												<span className="min-w-0">{area.location}</span>
											</p>

											<div className="mt-5 flex min-h-[100px] flex-col justify-start gap-3 rounded-lg bg-[#F3F3F3] p-4 sm:min-h-[91px] sm:justify-center sm:gap-1">
												<p className="font-['Montserrat'] text-[18px] font-semibold uppercase leading-6 tracking-[0px] text-black sm:text-[11px] sm:leading-[14px] sm:tracking-[0.55px]">
																			{t('common.landArea')}
												</p>
												<p className="font-['Montserrat'] text-[20px] font-semibold leading-6 tracking-[0%] text-black sm:text-[25px] sm:leading-[100%]">
													{area.size} <span className="text-[20px] sm:text-[24px]">m²</span>
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</section>
				</div>

				{/* Kolom kanan (lg ke atas): WhatsApp card sticky, mengikuti scroll sampai sebelum Galeri */}
				<aside className="hidden lg:block lg:w-1/3 lg:pt-14">
					<div className="sticky top-24 mb-12">
						{/* md:!w-full menimpa md:w-[32%] bawaan WhatsAppCard supaya card memenuhi kolom kanan */}
						<WhatsAppCard className="md:!w-full" title={waTitle} description={waDescription} />
					</div>
				</aside>
			</div>
			</ScrollReveal>
			</LazySection>

			{/* Galeri */}
			<LazySection minHeight={600}>
			<section className="mx-auto max-w-[1200px] px-5 pb-16 md:px-8">
				<ScrollReveal>
				<div className="text-center">
					<span className="font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-black">
						{t('gallerySection.badge')}
					</span>
					<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
						{t('gallerySection.momentsFrom', { unit: t('units.agribisnis.title') })}
					</h2>
					<div className="mx-auto mt-3 h-[2px] w-full max-w-[396px] rounded-[2px] bg-[#0000004D]" />
				</div>
				</ScrollReveal>

				{/* Ukuran item mengikuti grid (bukan lebar tetap) supaya tidak saling menimpa di lebar tablet */}
				<div className="mt-6 grid grid-cols-2 gap-[10px] md:mt-8 md:grid-cols-4 md:gap-3">
					{GALLERY_IMAGES.slice(0, 8).map((image, index) => (
						<ScrollReveal
							key={`${image}-${index}`}
							className={`aspect-[4/3] w-full min-w-0 md:aspect-[280/296] ${
								index >= 4 ? 'hidden md:block' : ''
							}`}
							delay={index * 90}
							duration={700}
							distance={16}
							scale={0.98}
						>
							<button
								type="button"
								onClick={() => setSelectedGalleryImage(image)}
								className="group h-full w-full min-w-0 overflow-hidden rounded-[20px] md:rounded-xl"
								aria-label={`Buka gambar Momen OBC Agribisnis ${index + 1}`}
							>
								<img
									src={image}
									alt={`Momen OBC Agribisnis ${index + 1}`}
									loading="lazy"
									decoding="async"
									className={`h-full w-full object-cover ${index === 3 ? 'object-left' : 'object-center'} transition-transform duration-500 group-hover:scale-105`}
								/>
							</button>
						</ScrollReveal>
					))}
				</div>
			</section>
			</LazySection>

			{selectedGalleryImage && (
				<ImageLightbox
					src={selectedGalleryImage}
					alt="Pratinjau galeri OBC Agribisnis"
					onClose={() => setSelectedGalleryImage(null)}
				/>
			)}

			{/* Lokasi */}
			<LazySection minHeight={500}>
			<ScrollReveal>
			<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
				<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
					<div className="order-1 min-w-0 md:order-none">
						<h2 className="h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:min-h-[30px] md:text-[25px]">
							{t('common.locationOf', { unit: t('units.agribisnis.title') })}
						</h2>
						<p className="mt-3 h-auto w-full max-w-[845px] font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.15px] text-black md:mt-1 md:min-h-[24px] md:text-[15px]">
							{t('units.agribisnis.location')}
						</p>
					</div>
					<a
						href={GOOGLE_MAPS_LINK}
						target="_blank"
						rel="noreferrer"
						className="order-3 mt-4 inline-flex h-[40px] w-full shrink-0 items-center justify-center gap-[8px] rounded-full bg-[#E9E9E9] px-[20px] py-[12px] font-['Montserrat'] text-[16px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022] hover:bg-[#E1E1E1] md:order-none md:mt-0 md:h-[32px] md:w-[229px] md:text-[14px]"
					>
						<ExternalLink className="h-[16px] w-[16px] text-[#222022] md:h-[13.5px] md:w-[13.5px]" />
						{t('common.openGoogleMaps')}
					</a>
				</div>

				<div className="order-2 mt-4 h-[300px] overflow-hidden rounded-[24px] border border-obc-border md:order-none md:mt-6 md:h-[420px] md:rounded-2xl">
					<iframe
						title={t('common.locationOf', { unit: t('units.agribisnis.title') })}
						src="https://www.google.com/maps?q=-6.8398,107.6195+(OBC+Agribisnis)&hl=id&z=17&output=embed"
						className="h-full w-full border-0"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>
			</section>
			</ScrollReveal>
			</LazySection>

			<LazySection minHeight={600}>
			<ScrollReveal>
			<UnitBisnis excludeSlug="agribisnis" />
			</ScrollReveal>
			</LazySection>

			<LandingFooter />

			{/* Card WhatsApp fixed di bawah layar pada mobile dan tablet; desktop memakai sidebar sticky */}
			<div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/95 px-4 pb-4 pt-3 shadow-[0px_-4px_12px_0px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
				<div className="mx-auto w-full max-w-[720px]">
					<WhatsAppCard variant="bar" title={waTitle} description={waDescription} />
				</div>
			</div>
		</div>
	)
}

export default AgribisnisPage