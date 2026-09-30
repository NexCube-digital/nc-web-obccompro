import { Check, ArrowUpRight } from 'lucide-react'
import member from '../../../assets/bfe838718c7f801119930d28d3d286f12b853b5e.jpg'

const membershipBenefits = [
	'20% OFF untuk 4x pertemuan',
	'Harga lebih hemat',
	'Slot lapangan terjamin',
	'Jadwal tetap untuk bermain',
]

export default function Membership() {
	return (
		<section className="relative overflow-hidden bg-white py-10">
			{/* tekstur lapangan samar dari asset untuk memberi nuansa olahraga */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
				style={{
					backgroundImage: `url(${member})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					filter: 'brightness(1.15)',
				}}
				aria-hidden="true"
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_20%,rgba(0,157,0,0.08)_0%,transparent_60%)]"
				aria-hidden="true"
			/>

			<div className="relative mx-auto grid w-[calc(100%-32px)] max-w-[1246px] px-4 sm:px-6 items-center gap-8 lg:gap-6 xl:gap-8 grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">
				{/* Kolom kiri — headline & benefit */}
				<div className="flex flex-col items-center text-center lg:items-start lg:text-left">
					<span className="mb-1.5 block font-['Montserrat'] text-[14px] xl:text-[15px] font-medium uppercase tracking-[1px] text-[#222222]">
						OBC SPORT CENTER
					</span>
					<h2 className="max-w-[340px] font-['Montserrat'] text-[28px] sm:text-[32px] xl:text-[36px] font-bold leading-[1.25] tracking-[1.5px] text-[#000000]">
						Siap Bermain di
						<br />
						OBC Sport ?
					</h2>
					<p className="mt-3 max-w-[320px] text-center lg:text-left font-['Montserrat'] text-[13.5px] xl:text-[14.5px] font-normal leading-[24px] text-[#444444]">
						Temukan fasilitas olahraga yang sesuai dengan kebutuhanmu, lalu nikmati
						keuntungan membership untuk pengalaman bermain yang lebih praktis dan
						hemat.
					</p>
					<ul className="mt-3 w-full max-w-[320px] text-left">
						{membershipBenefits.map((b) => (
							<li
								className="mb-2.5 flex items-center gap-2.5 font-body text-[12.5px] xl:text-[13px] text-[#1a1a1a]"
								key={b}
							>
								<span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] border-[#1a1a1a] text-[#1a1a1a]">
									<Check size={10} strokeWidth={3} />
								</span>
								{b}
							</li>
						))}
					</ul>
				</div>

				{/* Kartu membership 3D — ukuran proporsional & presisi */}
				<div className="grid place-items-center py-2">
					<div
						className="relative flex h-[195px] sm:h-[212px] lg:h-[200px] xl:h-[224px] w-[320px] sm:w-[350px] lg:w-[325px] xl:w-[365px] max-w-full flex-col justify-between rounded-[16px] border border-[#10B9814D] p-5 xl:p-6 [transform:rotate(2.5deg)] shadow-[0_0_30px_0_rgba(198,245,42,0.12),-12px_18px_36px_-10px_rgba(0,0,0,0.6)] transition-transform hover:scale-[1.02]"
						style={{
							background:
								'linear-gradient(132.33deg, #002400 0.9%, #009D00 49.99%, #004000 99.1%)',
						}}
						aria-hidden="true"
					>
						<div className="flex items-start justify-between">
							<div>
								<strong className="block font-['Montserrat'] text-[26px] xl:text-[28px] font-extrabold leading-none tracking-[-0.6px] text-[#FFFFFF]">
									OBC
								</strong>
								<span className="mt-1 block font-['Montserrat'] text-[7.5px] xl:text-[8px] font-semibold uppercase leading-tight tracking-[2px] text-[#FFFFFFF7]">
									SPORT CENTER
								</span>
							</div>
							<div
								className="relative grid place-items-center shadow"
								style={{
									width: '24px',
									height: '17px',
									transform: 'rotate(-2.5deg)',
									opacity: 1,
								}}
							>
								<span
									className="absolute inset-0 rounded-[3px] border border-[#FFF717] bg-white"
								/>
								<span
									className="absolute rounded-[2px] border border-[#FFF717] bg-transparent"
									style={{
										width: '12px',
										height: '8px',
										transform: 'rotate(-2.5deg)',
									}}
								/>
							</div>
						</div>

						<div className="flex flex-col items-center justify-center text-center">
							<p className="font-['Montserrat'] text-[14px] xl:text-[15px] font-extrabold leading-tight tracking-[0.5px] text-white whitespace-nowrap">
								SPORTS MEMBERSHIP
							</p>
							<p className="mt-1 font-['Montserrat'] text-[7.5px] xl:text-[8px] font-semibold uppercase leading-tight tracking-[2px] text-[#FFFFFFF7]">
								PLAY. MOVE. CONNECT.
							</p>
						</div>
					</div>
				</div>

				{/* Kolom kanan — brand & CTA */}
				<div className="flex flex-col items-center text-center lg:items-end lg:text-right gap-1.5 lg:gap-2">
					<div>
						<strong className="block font-heading text-[38px] xl:text-[46px] font-extrabold leading-none tracking-tight text-[#111111]">
							OBC
						</strong>
						<small className="block font-heading text-[10.5px] xl:text-[11.5px] font-semibold tracking-[0.35em] text-[#111111]">
							SPORT CENTER
						</small>
					</div>

					<p className="mt-2 text-center lg:text-right font-['Caveat'] text-[30px] xl:text-[36px] font-bold leading-tight tracking-[1px] text-[#222222]">
						Play. Move. Connect.
					</p>

					<a
						className="mt-1 inline-flex h-[52px] xl:h-[58px] w-full max-w-[320px] xl:max-w-[350px] shrink-0 items-center justify-between gap-3 rounded-[45px] border-[0.67px] border-[#CDF178] bg-[#CDF178] py-2 pl-5 pr-2 font-['Montserrat'] text-[15px] xl:text-[16px] font-semibold text-[#1F3320] transition-colors hover:bg-[#c2e86a]"
						href="https://sport.obcgroup.id/"
						target="_blank"
						rel="noreferrer"
					>
						<span className="text-left lg:text-center leading-[18px]">
							Booking &amp; Daftar Membership
						</span>
						<span className="grid h-[40px] w-[40px] xl:h-[46px] xl:w-[46px] shrink-0 place-items-center rounded-full bg-[#1F3320] text-[#CDF178]">
							<ArrowUpRight size={22} />
						</span>
					</a>
					<small className="mt-2 text-center lg:text-right font-body text-[10px] italic text-[#6b7280]">
						*Syarat dan Ketentuan Berlaku
					</small>
				</div>
			</div>
		</section>
	)
}
