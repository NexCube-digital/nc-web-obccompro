import { Suspense, lazy } from 'react'

import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'

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

const SectionFallback = () => <div className="h-[280px] w-full animate-pulse bg-[#f5f0e8]" />

function HomePage() {
	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main id="beranda">
				{/* 1. Hero Section */}
				<Suspense fallback={<SectionFallback />}>
					<Hero />
				</Suspense>

				{/* 2. Promo Banner */}
				<Suspense fallback={<SectionFallback />}>
					<PromoBanner />
				</Suspense>

				{/* 3. Tentang OBC Group */}
				<Suspense fallback={<SectionFallback />}>
					<TentangKami />
				</Suspense>

				{/* 4. Bisnis Kami (Unit Bisnis) */}
				<Suspense fallback={<SectionFallback />}>
					<UnitBisnis />
				</Suspense>

				{/* 5. OBC Sport Center */}
				<Suspense fallback={<SectionFallback />}>
					<SportCenter />
				</Suspense>

				{/* 6. Membership */}
				<Suspense fallback={<SectionFallback />}>
					<Membership />
				</Suspense>

				{/* 7. Gedung Multifungsi / Event Space */}
				<Suspense fallback={<SectionFallback />}>
					<GedungMultifungsi />
				</Suspense>

				{/* 8. Galeri */}
				<Suspense fallback={<SectionFallback />}>
					<Galeri />
				</Suspense>

				{/* 9. Testimoni */}
				<Suspense fallback={<SectionFallback />}>
					<Testimoni />
				</Suspense>

				{/* 10. Lokasi OBC Group */}
				<Suspense fallback={<SectionFallback />}>
					<Lokasi />
				</Suspense>
			</main>
			<LandingFooter />
		</div>
	)
}

export default HomePage