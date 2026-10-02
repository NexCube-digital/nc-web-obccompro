import { Link } from 'react-router-dom'
import { ArrowRight, Heart } from 'lucide-react'

/* ---------------------------------------------------------------
 * Love: outline saat normal, terisi hijau gelap saat kursor diarahkan
 * --------------------------------------------------------------- */
export function FavoriteButton({
	className = '',
	onClick,
}: {
	className?: string
	onClick?: () => void
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Tambah ke favorit"
			className={`group/heart flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004000] motion-reduce:transition-none ${className}`}
		>
			<Heart
				size={22}
				strokeWidth={2}
				aria-hidden="true"
				className="fill-transparent text-[#004000] transition-[fill,transform] duration-300 ease-out group-hover/heart:fill-[#004000] group-hover/heart:scale-110 motion-reduce:transition-none"
			/>
		</button>
	)
}

/* ---------------------------------------------------------------
 * Booking Now: pill terang -> hijau gelap + teks putih saat hover
 * --------------------------------------------------------------- */
export function BookingButton({ href }: { href: string }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className="inline-flex items-center justify-center rounded-full border border-[#004000]/20 bg-[#F4F5E6] px-3 py-1 font-['Montserrat'] text-[13px] font-semibold leading-5 text-black shadow-[0px_1px_2px_0px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#004000] hover:bg-[#004000] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004000] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
		>
			Booking Now
		</a>
	)
}

/* ---------------------------------------------------------------
 * Detail Unit: teks biasa -> pill hijau muda saat hover, panah bergeser
 * --------------------------------------------------------------- */
export function DetailUnitLink({ to }: { to: string }) {
	return (
		<Link
			to={to}
			className="group/detail inline-flex items-center gap-1.5 rounded-full border border-transparent px-3 py-1 font-['Montserrat'] text-[14px] font-semibold leading-5 text-black transition-all duration-300 ease-out hover:border-[#B9D96A] hover:bg-[#E3F3B5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004000] motion-reduce:transition-none"
		>
			Detail Unit
			<ArrowRight
				size={14}
				aria-hidden="true"
				className="transition-transform duration-300 ease-out group-hover/detail:translate-x-1 motion-reduce:transition-none"
			/>
		</Link>
	)
}
