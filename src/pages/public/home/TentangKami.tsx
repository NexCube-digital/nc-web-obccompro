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
			className="mx-auto grid w-[calc(100%-32px)] max-w-[1246px] gap-[40px] lg:gap-[60px] px-4 sm:px-6 py-[90px] md:grid-cols-[1.15fr_1fr] md:items-center"
			id="tentang"
		>
			<div>
				<span className="mb-3 block font-['Montserrat'] text-[18px] font-semibold uppercase leading-[20px] tracking-[1.4px] text-[#000000CC]">
					Tentang OBC Group
				</span>
				<h2 className="h-auto w-full font-['Montserrat'] text-[32px] sm:text-[36px] font-bold leading-[42px] sm:leading-[45px] tracking-[1.5px] text-[#000000]">
					Sejarah Singkat &amp; Komitmen OBC
				</h2>
				<p className="my-3 mb-2 h-auto w-full font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0px] text-[#6f6b6e] [text-align:justify]">
					Berawal dari usaha potong rambut Onny Barber Center (OBC) yang didirikan pada
					7 Mei 1999 oleh Alm. Bpk. Djoni, OBC tumbuh dari langkah sederhana yang lahir
					dari rasa tanggung jawab keluarga. Dari satu unit kecil, OBC terus berproses,
					menjaga nilai kekeluargaan, dan bertransformasi menjadi OBC Group.
				</p>
				<p className="my-3 mb-5 h-auto w-full font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0px] text-[#6f6b6e] [text-align:justify]">
					Kini, OBC Group menaungi berbagai unit bisnis mulai dari sport center,
					hospitality, kuliner, hingga jasa dan agribisnis. Kami berkomitmen untuk terus
					memberikan pelayanan terbaik yang hangat, relevan, dan bermanfaat bagi
					masyarakat luas.
				</p>
				<div className="mb-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
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
				<Link
					to="/tentang-kami"
					className="inline-flex h-[25px] w-full items-center justify-end gap-2 font-['Montserrat'] text-right text-[19px] font-semibold leading-[25px] tracking-[0px] text-[#000000] opacity-100 transition-[gap] hover:gap-3 cursor-pointer"
				>
					Lihat Lebih Lanjut tentang Kami <ArrowRight size={20} />
				</Link>
			</div>
			<div className="relative min-h-[390px] h-[390px] md:h-[530px] md:min-h-[500px]">
				<div
					className="absolute left-[18%] top-0 h-[82%] w-[48%] rounded-full bg-cover bg-center shadow-[0_8px_24px_rgba(52,49,51,0.08)]"
					style={{ backgroundImage: `url(${lapangF1Image})` }}
				/>
				<div
					className="absolute bottom-[10%] right-[20%] h-[65%] w-[42%] rounded-full border-[7px] border-[#fffff7] bg-cover bg-center shadow-[0_12px_36px_rgba(52,49,51,0.14)]"
					style={{ backgroundImage: `url(${lapangF2Image})` }}
				/>
				<div className="absolute left-[52%] top-5 inline-flex items-center gap-2 rounded-[100px] bg-[#0040001A] p-2.5 text-black backdrop-blur">
					<span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#004000] to-[#009D00] text-white">
						<img src={medalIcon} alt="" aria-hidden="true" className="h-[22px] w-[22px]" />
					</span>
					<span className="font-body text-[16px] font-bold leading-[1.2] tracking-[0%] text-black">EST 7 MEI 1999</span>
				</div>
			</div>
		</section>
	)
}
