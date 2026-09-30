import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import lapangF1Image from '../../../assets/layanan/Lapang F1.png'
import lapangF2Image from '../../../assets/layanan/Lapang F2.png'
import medalIcon from '../../../assets/icon/iconstack.io - (Medal Ribbons Star).svg'
import targetArrowIcon from '../../../assets/icon/iconstack.io - (Target Arrow).svg'
import rosetteIcon from '../../../assets/icon/iconstack.io - (Rosette Discount Check).svg'

export default function TentangKami() {
	return (
		<section
			className="mx-auto grid w-[calc(100%-60px)] max-w-[1280px] gap-[28px] py-[55px] md:w-[calc(100%-48px)] md:grid-cols-[1.15fr_1fr] md:items-center md:gap-[60px] md:py-[90px]"
			id="tentang"
		>
			<div>
				{/* Label: mobile title case, desktop kapital */}
				<span className="mb-3 block font-['Montserrat'] text-[16px] font-semibold leading-[20px] tracking-normal text-black opacity-100 md:text-[18px] md:uppercase md:tracking-[1.4px] md:text-[#000000CC] md:opacity-80">
					Tentang OBC Group
				</span>
				<h2 className="max-w-[580px] font-['Montserrat'] text-[22px] font-semibold leading-[32px] tracking-normal text-[#000000] md:text-[36px] md:font-bold md:leading-[50px] md:tracking-[1.5px]">
					Satu Ekosistem, Beragam Layanan, Satu Tujuan
				</h2>

				{/* Paragraf: mobile hitam, justify, line-height 26px */}
				<p className="my-4 mb-3 max-w-[560px] font-body text-[13px] leading-[26px] text-justify text-black md:my-5 md:mb-3 md:leading-[1.7] md:text-[#6f6b6e]">
					OBC Group merupakan perusahaan yang berdiri sejak 7 Mei 1999 di Bandung, Jawa Barat. Berawal dari Onny Barber Center, OBC terus berkembang dan mengelola berbagai unit usaha untuk menghadirkan layanan yang bermanfaat serta memenuhi beragam kebutuhan masyarakat. Kini, OBC menaungi berbagai bidang usaha, mulai dari personal care, olahraga, hospitality, makanan & minuman, laundry, agrobisnis, hingga ruang multifungsi.
				</p>
				

				{/* Visi & Misi: disembunyikan di mobile, tampil di md ke atas */}
				<div className="mb-7 hidden max-w-[560px] grid-cols-1 gap-6 md:grid md:grid-cols-2">
					<div className="flex flex-col items-start">
						<span className="mb-2 grid h-11 w-11 place-items-center rounded-lg bg-[#CDF178] text-[#000000] shadow-[0px_1px_1px_0px_#00000040]">
							<img src={targetArrowIcon} alt="" aria-hidden="true" className="h-[23px] w-[24px]" />
						</span>
						<h4 className="mb-1.5 font-heading text-[13px] font-semibold text-[#000000]">Visi Kami</h4>
						<p className="align-middle font-['Montserrat'] text-[12px] font-normal leading-[26px] tracking-[0px] text-[#6f6b6e] [text-align:justify]">
							OBC sebagai wadah untuk membantu keluarga dan juga masyarakat sekitar agar bisa mandiri
							secara financial dan berkembang menjadi SDM yang berkualitas.
						</p>
					</div>
					<div className="flex flex-col items-start">
						<span className="mb-2 grid h-11 w-11 place-items-center rounded-lg bg-[#CDF178] text-[#000000] shadow-[0px_1px_1px_0px_#00000040]">
							<img src={rosetteIcon} alt="" aria-hidden="true" className="h-[23px] w-[24px]" />
						</span>
						<h4 className="mb-1.5 font-heading text-[13px] font-semibold text-[#000000]">Misi Kami</h4>
						<p className="align-middle font-['Montserrat'] text-[12px] font-normal leading-[26px] tracking-[0px] text-[#6f6b6e] [text-align:justify]">
							Menghadirkan layanan prima, nyaman, berkualitas, dan terjangkau di setiap unit OBC
							Group.
						</p>
					</div>
				</div>

				{/* Link: mobile lebar penuh & rata kanan, desktop 600px */}
				<Link
					to="/tentang-kami"
					className="inline-flex h-[25px] w-full items-center justify-end gap-2 font-['Montserrat'] text-right text-[16px] font-semibold leading-[25px] tracking-[0px] text-[#000000] opacity-100 transition-[gap] hover:gap-3 md:w-[600px] md:text-[19px]"
				>
					Lihat Lebih Lanjut tentang Kami <ArrowRight size={20} />
				</Link>
			</div>

			{/* Gambar: mobile di atas (order-first) tinggi 175px; desktop di kanan */}
			<div className="relative order-first h-[175px] md:order-none md:h-[480px] md:min-h-[460px]">
				<div
					className="absolute left-0 top-0 h-[62%] w-[78%] rounded-full bg-cover bg-center shadow-[0_8px_24px_rgba(52,49,51,0.08)] md:left-[18%] md:h-[78%] md:w-[45%]"
					style={{ backgroundImage: `url(${lapangF1Image})` }}
				/>
				<div
					className="absolute bottom-0 right-[7%] h-[53%] w-[78%] rounded-full border-[4px] border-[#fffff7] bg-cover bg-center shadow-[0_12px_36px_rgba(52,49,51,0.14)] md:bottom-[10%] md:right-[20%] md:h-[60%] md:w-[38%] md:border-[7px]"
					style={{ backgroundImage: `url(${lapangF2Image})` }}
				/>
				<div className="absolute left-[52%] top-[53px] inline-flex items-center gap-2 rounded-[100px] bg-[#0040001A] p-1.5 text-black backdrop-blur md:top-5 md:p-2.5">
					<span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#004000] to-[#009D00] text-white md:h-9 md:w-9">
						<img src={medalIcon} alt="" aria-hidden="true" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]" />
					</span>
					<span className="font-body text-[14px] font-bold leading-[1.2] tracking-[0%] text-black md:text-[16px]">EST 7 MEI 1999</span>
				</div>
			</div>
		</section>
	)
}