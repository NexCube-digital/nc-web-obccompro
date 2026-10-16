import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import TransitionLink from '../../../components/common/TransitionLink'
import { useTranslation } from 'react-i18next'
import { ArrowUpRight, X } from 'lucide-react'
import guestHouseGalleryImage from '../../../assets/unit-bisnis/guest-house/4dfc9c1b31ccba420b81032601d73bd5d713286b.png'
import coffeeGalleryImage from '../../../assets/unit-bisnis/213fd83a6a5b24b44a156bf5b8fce2b06410ed48.png'
import foodCourtGalleryImage from '../../../assets/unit-bisnis/0873dc839902dcf8ebac8ee04d6e42f7f07c6a50.jpg'
import laundryGalleryImage from '../../../assets/unit-bisnis/2f8d082612cddd916d6e7f0c3823d1db3a6d30dc.png'
import sportsCenterGalleryImage from '../../../assets/unit-bisnis/4086acc6319c22edd57799828a517da01ea58de7.png'

const GALLERY_ITEMS = [
	{
		label: 'OBC Guest House',
		image: guestHouseGalleryImage,
		className: 'md:col-span-1 md:row-span-2 md:row-start-1 md:col-start-1',
	},
	{
		label: 'OBC Coffee',
		image: coffeeGalleryImage,
		className: 'md:col-span-1 md:row-span-2 md:row-start-1 md:col-start-2',
	},
	{
		label: 'OBC Food Court',
		image: foodCourtGalleryImage,
		className: 'md:col-span-2 md:row-start-1 md:col-start-3',
	},
	{
		label: 'OBC Laundry',
		image: laundryGalleryImage,
		className: 'md:col-span-2 md:row-start-3 md:col-start-1',
	},
	{
		label: 'OBC Sports Center',
		image: sportsCenterGalleryImage,
		className: 'md:col-span-2 md:row-span-2 md:row-start-2 md:col-start-3',
	},
]

export default function Galeri() {
	const { t } = useTranslation()
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)
	const selectedGalleryItem = GALLERY_ITEMS.find((item) => item.image === selectedGalleryImage)

	useEffect(() => {
		if (!selectedGalleryImage) return

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedGalleryImage(null)
		}

		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = previousOverflow
		}
	}, [selectedGalleryImage])

	return (
		
		<section
			className="mx-auto flex w-[calc(100%-60px)] max-w-[1280px] flex-col justify-center py-6 md:w-[calc(100%-48px)] md:pb-6 md:pt-8 lg:min-h-[100svh] lg:pb-[clamp(16px,3svh,40px)] lg:pt-[clamp(52px,7svh,80px)]"
			id="galeri"
		>
			{/* Header: mobile teks di atas, tombol di bawah rata kanan */}
			<div className="mb-5 flex flex-col items-start justify-between gap-4 md:mb-[clamp(16px,3.5svh,32px)] md:flex-row md:items-center md:gap-6">
				<div>
					{/* Label: mobile title case, desktop kapital */}
					<span className="block font-['Montserrat'] text-[16px] font-semibold normal-case leading-[20px] tracking-normal text-[#333333] md:uppercase md:tracking-[1.6px]">
						{t('gallerySection.badge')}
					</span>
					<h2 className="mt-3 font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-black md:mt-1 md:text-[36px] md:leading-[40px] md:tracking-[1.5px]">
						{t('gallerySection.homeTitle')}
					</h2>
					<p className="mt-3 font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.5px] text-black md:mt-2 md:text-[20px] md:leading-[32px] md:tracking-[0.72px]">
						{t('gallerySection.homeSubtitle')}
					</p>
				</div>

				{/* Tombol: mobile lebih kecil & rata kanan */}
				<TransitionLink
					className="group inline-flex h-[48px] w-fit shrink-0 items-center justify-center gap-2 self-end rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-1 pl-5 pr-1.5 font-['Montserrat'] text-[15px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-all duration-300 hover:border-[#004000] hover:bg-[#004000] md:mr-8 md:h-[clamp(60px,9svh,78px)] md:w-fit md:gap-3 md:self-auto md:py-2 md:pl-7 md:pr-2 md:text-[20px]"
					to="/galeri"
				>
					<span className="whitespace-nowrap text-center text-[#1F3320] transition-all duration-300 group-hover:font-medium group-hover:tracking-[0.8px] group-hover:!text-[#CDF178]">
						{t('gallerySection.viewAll')}
					</span>
					<span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] transition-colors duration-300 group-hover:bg-[#CDF178] group-hover:text-[#004000] md:h-[clamp(44px,7svh,58px)] md:w-[clamp(44px,7svh,58px)]">
						<ArrowUpRight className="h-[16px] w-[16px] transition-transform duration-300 group-hover:rotate-45 md:h-[25px] md:w-[25px]" />
					</span>
				</TransitionLink>
			</div>

			{/* Grid: mobile 2x2 (hanya 4 gambar pertama), desktop 4 kolom dengan rasio baris 11 : 4 : 11 (asli 275 / 100 / 275) */}
			<div className="grid grid-cols-2 gap-[15px] md:h-[clamp(260px,calc(100svh_-_clamp(52px,7svh,80px)_-_clamp(16px,3svh,40px)_-_140px),675px)] md:grid-cols-4 md:grid-rows-[11fr_4fr_11fr] md:gap-[clamp(12px,3svh,25px)] md:px-[27px] [&>*:nth-child(n+5)]:hidden md:[&>*:nth-child(n+5)]:block">
				{GALLERY_ITEMS.map((item) => (
					<button
						key={item.label}
						className={`relative h-[140px] cursor-pointer overflow-hidden rounded-[20px] border-0 p-0 transition-transform hover:scale-[1.01] md:h-auto ${item.className}`}
						type="button"
						aria-label={`Buka gambar ${item.label}`}
						onClick={() => setSelectedGalleryImage(item.image)}
					>
						<img src={item.image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
						{/* Label pil: disembunyikan di mobile, tampil di md ke atas */}
						<span className="absolute bottom-[6px] left-[8px] z-10 hidden rounded-full bg-white px-[22px] py-[8px] font-['Montserrat'] text-[14px] font-normal leading-[22px] text-[#222222] md:block md:text-[17px]">
							{item.label}
						</span>
					</button>
				))}
			</div>

			{/* Lightbox */}
			{selectedGalleryImage && (
				createPortal(
					<div
						className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#07110b]/90 p-4 backdrop-blur-md sm:p-8"
						role="dialog"
						aria-modal="true"
						aria-label={selectedGalleryItem?.label ?? 'Pratinjau gambar galeri'}
						onClick={() => setSelectedGalleryImage(null)}
					>
						<button
							className="absolute right-4 top-4 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur transition-colors hover:bg-[#CDF178] hover:text-[#004000] sm:right-6 sm:top-6"
							type="button"
							aria-label={t('common.close')}
							onClick={() => setSelectedGalleryImage(null)}
						>
							<X size={24} />
						</button>
						<div className="flex max-h-[92svh] max-w-[94vw] flex-col items-center gap-3" onClick={(event) => event.stopPropagation()}>
							<img
								className="max-h-[84svh] max-w-[94vw] rounded-xl border border-white/15 bg-black/20 object-contain shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
								src={selectedGalleryImage}
								alt={selectedGalleryItem?.label ?? 'Pratinjau galeri OBC'}
							/>
							<p className="max-w-[90vw] truncate font-['Montserrat'] text-sm font-medium text-white sm:text-base">
								{selectedGalleryItem?.label}
							</p>
						</div>
					</div>,
					document.body,
				)
			)}
		</section>
	)
}