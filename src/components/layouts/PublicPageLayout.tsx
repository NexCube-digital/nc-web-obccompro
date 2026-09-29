import type { ReactNode } from 'react'
import LandingFooter from './LandingFooter'
import LandingNavbar from './LandingNavbar'

type PublicPageLayoutProps = {
	eyebrow: string
	title: string
	description: string
	children: ReactNode
}

function PublicPageLayout({ eyebrow, title, description, children }: PublicPageLayoutProps) {
	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main>
				<section className="bg-gradient-to-br from-[#002d00] to-obc-green px-6 pb-[72px] pt-40 text-white">
					<div className="mx-auto w-full max-w-[1280px]">
						<span className="mb-3 block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c6f52a]">{eyebrow}</span>
						<h1 className="max-w-[760px] font-heading text-[34px] font-bold leading-tight text-white md:text-5xl">{title}</h1>
						<p className="mt-4 max-w-[650px] font-body text-sm leading-[1.7] text-white/85">{description}</p>
					</div>
				</section>
				<section className="mx-auto min-h-[420px] w-[calc(100%-48px)] max-w-[1280px] pb-[90px] pt-[72px]">{children}</section>
			</main>
			<LandingFooter />
		</div>
	)
}

export default PublicPageLayout