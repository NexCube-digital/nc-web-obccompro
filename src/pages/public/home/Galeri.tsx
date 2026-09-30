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
		<section className="mx-auto w-[calc(100%-32px)] max-w-[1246px] px-4 sm:px-6 py-[30px] pb-[70px]" id="galeri">
			{/* Header: judul di kiri, tombol di kanan */}
			<div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
				<div>
					<span className="block font-['Montserrat'] text-[16px] font-semibold uppercase leading-[20px] tracking-[1.6px] text-[#333333]">
						Galeri
					</span>
					<h2 className="mt-1 font-['Montserrat'] text-[28px] font-bold leading-[40px] tracking-[1.5px] text-black md:text-[36px]">
						Momen yang Menjadi Bagian dari OBC
					</h2>
					<p className="mt-2 font-['Montserrat'] text-[16px] font-normal leading-[32px] tracking-[0.72px] text-black md:text-[20px]">
						Jelajahi berbagai momen, fasilitas, dan aktivitas dari seluruh unit usaha OBC.
					</p>
				</div>

				{/* Tombol hijau limau + lingkaran gelap berisi panah */}
				<Link
					className="inline-flex h-[67px] w-[304px] shrink-0 items-center justify-between gap-4 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-2 pl-6 pr-2 font-['Montserrat'] text-[20px] font-semibold leading-[17px] tracking-[0px] text-[#1F3320] transition-colors hover:bg-[#c2e86a]"
					to="/galeri"
				>
					<span className="w-[195px] whitespace-nowrap text-center">Lihat Semua Galeri</span>
					<span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
						<ArrowUpRight size={25} />
					</span>
				</Link>
			</div>

			{/* Grid: mobile 2 kolom tinggi tetap, desktop 4 kolom (275 / 100 / 275) */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-[275px_100px_275px] md:gap-[25px] md:px-[27px]">
				{GALLERY_ITEMS.map((item) => (
					<button
						key={item.label}
						className={`relative h-[200px] cursor-pointer overflow-hidden rounded-[20px] border-0 bg-cover bg-center p-0 transition-transform hover:scale-[1.01] md:h-auto ${item.className}`}
						style={{ backgroundImage: `url(${item.image})` }}
						type="button"
						aria-label={`Buka gambar ${item.label}`}
						onClick={() => setSelectedGalleryImage(item.image)}
					>
						<span className="absolute bottom-[6px] left-[8px] rounded-full bg-white px-[22px] py-[8px] font-['Montserrat'] text-[14px] font-normal leading-[22px] text-[#222222] md:text-[17px]">
							{item.label}
						</span>
					</button>
				))}
			</div>

			{selectedGalleryImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
					role="dialog"
					aria-modal="true"
					aria-label="Pratinjau gambar galeri"
					onClick={() => setSelectedGalleryImage(null)}
				>
					<button
						className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-obc-green shadow-lg transition-transform hover:scale-105 cursor-pointer"
						type="button"
						aria-label="Tutup gambar"
						onClick={() => setSelectedGalleryImage(null)}
					>
						<X size={22} />
					</button>
					<div className="relative max-h-[90vh] max-w-[92vw]" onClick={(event) => event.stopPropagation()}>
						<img className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" src={selectedGalleryImage} alt="Pratinjau galeri OBC" />
					</div>
				</div>
			)}
		</section>
	)
}
