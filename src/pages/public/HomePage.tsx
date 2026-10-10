import { Suspense, lazy } from 'react'

import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import LazySection from '../../components/common/LazySectionHome'
import ScrollReveal from '../../components/animation/ScrollReveal'

const Hero = lazy(() => import('./home/Hero'))
const PromoBanner = lazy(() => import('./home/PromoBanner'))
const TentangKami = lazy(() => import('./home/TentangKami'))
const UnitBisnis = lazy(() => import('./home/UnitBisnis'))
const SportCenter = lazy(() => import('./home/SportCenter'))
const Membership = lazy(() => import('./home/Membership'))
const GedungMultifungsi = lazy(() => import('./home/GedungMultifungsi'))
const Galeri = lazy(() => import('./home/Galeri'))
const Testimoni = lazy(() => import('./home/Testimoni'))
const Lokasi = lazy(() => import('./home/Lokasi'))

const HeroFallback = () => (
	<div className="h-[600px] w-full animate-pulse bg-[#f5f0e8]" />
)

function HomePage() {
	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main id="beranda">
				{/* 1. Hero Section: langsung load (above the fold) */}
				<Suspense fallback={<HeroFallback />}>
					<Hero />
				</Suspense>

				{/* 2. Promo Banner */}
				<LazySection minHeight={200}>
					<ScrollReveal><PromoBanner /></ScrollReveal>
				</LazySection>

				{/* 3. Tentang OBC Group */}
				<LazySection minHeight={500}>
					<ScrollReveal><TentangKami /></ScrollReveal>
				</LazySection>

				{/* 4. Bisnis Kami (Unit Bisnis) */}
				<LazySection minHeight={500}>
					<ScrollReveal><UnitBisnis /></ScrollReveal>
				</LazySection>

				{/* 5. OBC Sport Center */}
				<LazySection minHeight={500}>
					<ScrollReveal><SportCenter /></ScrollReveal>
				</LazySection>

				{/* 6. Membership */}
				<LazySection minHeight={500}>
					<ScrollReveal><Membership /></ScrollReveal>
				</LazySection>

				{/* 7. Gedung Multifungsi / Event Space */}
				<LazySection minHeight={500}>
					<ScrollReveal><GedungMultifungsi /></ScrollReveal>
				</LazySection>

				{/* 8. Galeri */}
				<LazySection minHeight={500}>
					<ScrollReveal><Galeri /></ScrollReveal>
				</LazySection>

				{/* 9. Testimoni */}
				<LazySection minHeight={400}>
					<ScrollReveal><Testimoni /></ScrollReveal>
				</LazySection>

				{/* 10. Lokasi OBC Group */}
				<LazySection minHeight={500}>
					<ScrollReveal><Lokasi /></ScrollReveal>
				</LazySection>
			</main>
			<LandingFooter />
		</div>
	)
}

export default HomePage