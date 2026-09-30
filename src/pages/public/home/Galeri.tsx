import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
	const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)

	useEffect(() => {
		if (!selectedGalleryImage) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedGalleryImage(null)
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [selectedGalleryImage])

	return (
		<section
			className="mx-auto w-[calc(100%-60px)] max-w-[1280px] py-[55px] pb-[50px] md:w-[calc(100%-48px)] md:py-[30px] md:pb-[70px]"
			id="galeri"
		>
			{/* Header: mobile teks di atas, tombol di bawah rata kanan */}
			<div className="mb-5 flex flex-col items-start justify-between gap-4 md:mb-10 md:flex-row md:items-center md:gap-6">
				<div>
					{/* Label: mobile title case, desktop kapital */}
					<span className="block font-['Montserrat'] text-[16px] font-semibold normal-case leading-[20px] tracking-normal text-[#333333] md:uppercase md:tracking-[1.6px]">
						Galeri
					</span>
					<h2 className="mt-3 font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-black md:mt-1 md:text-[36px] md:leading-[40px] md:tracking-[1.5px]">
						Momen yang Menjadi Bagian dari OBC
					</h2>
					<p className="mt-3 font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.5px] text-black md:mt-2 md:text-[20px] md:leading-[32px] md:tracking-[0.72px]">
						Jelajahi berbagai momen, fasilitas, dan aktivitas dari seluruh unit usaha OBC.
					</p>
				</div>

				{/* Tombol: mobile lebih kecil & rata kanan */}
				<Link
					className="inline-flex h-[40px] w-fit shrink-0 items-center justify-between gap-3 self-end rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-1 pl-4 pr-1 font-['Montserrat'] text-[15px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a] md:h-[67px] md:w-[304px] md:gap-4 md:self-auto md:py-2 md:pl-6 md:pr-2 md:text-[20px]"
					to="/galeri"
				>
					<span className="whitespace-nowrap text-center md:w-[195px]">Lihat Semua Galeri</span>
					<span className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178] md:h-[52px] md:w-[52px]">
						<ArrowUpRight className="h-[16px] w-[16px] md:h-[25px] md:w-[25px]" />
					</span>
				</Link>
			</div>

			{/* Grid: mobile 2x2 (hanya 4 gambar pertama), desktop 4 kolom (275 / 100 / 275) */}
			<div className="grid grid-cols-2 gap-[15px] md:grid-cols-4 md:grid-rows-[275px_100px_275px] md:gap-[25px] md:px-[27px] [&>*:nth-child(n+5)]:hidden md:[&>*:nth-child(n+5)]:block">
				{GALLERY_ITEMS.map((item) => (
					<button
						key={item.label}
						className={`relative h-[140px] cursor-pointer overflow-hidden rounded-[20px] border-0 bg-cover bg-center p-0 transition-transform hover:scale-[1.01] md:h-auto ${item.className}`}
						style={{ backgroundImage: `url(${item.image})` }}
						type="button"
						aria-label={`Buka gambar ${item.label}`}
						onClick={() => setSelectedGalleryImage(item.image)}
					>
						{/* Label pil: disembunyikan di mobile, tampil di md ke atas */}
						<span className="absolute bottom-[6px] left-[8px] hidden rounded-full bg-white px-[22px] py-[8px] font-['Montserrat'] text-[14px] font-normal leading-[22px] text-[#222222] md:block md:text-[17px]">
							{item.label}
						</span>
					</button>
				))}
			</div>

			{/* Lightbox */}
			{selectedGalleryImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-label="Pratinjau gambar galeri"
					onClick={() => setSelectedGalleryImage(null)}
				>
					<button
						className="absolute right-5 top-5 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-obc-green shadow-lg transition-transform hover:scale-105"
						type="button"
						aria-label="Tutup gambar"
						onClick={() => setSelectedGalleryImage(null)}
					>
						<X size={22} />
					</button>
					<div className="relative max-h-[90vh] max-w-[92vw]" onClick={(event) => event.stopPropagation()}>
						<img
							className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
							src={selectedGalleryImage}
							alt="Pratinjau galeri OBC"
						/>
					</div>
				</div>
			)}
		</section>
	)
}