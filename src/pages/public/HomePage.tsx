import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import {
	Hero,
	PromoBanner,
	TentangKami,
	UnitBisnis,
	SportCenter,
	Membership,
	GedungMultifungsi,
	Galeri,
	Testimoni,
	Lokasi,
} from './home'

function HomePage() {
	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main id="beranda">
				{/* 1. Hero Section */}
				<Hero />

				{/* 2. Promo Banner */}
				<PromoBanner />

				{/* 3. Tentang OBC Group */}
				<TentangKami />

				{/* 4. Bisnis Kami (Unit Bisnis) */}
				<UnitBisnis />

				{/* 5. OBC Sport Center */}
				<SportCenter />

				{/* 6. Membership */}
				<Membership />

				{/* 7. Gedung Multifungsi / Event Space */}
				<GedungMultifungsi />

				{/* 8. Galeri */}
				<Galeri />

				{/* 9. Testimoni */}
				<Testimoni />

				{/* 10. Lokasi OBC Group */}
				<Lokasi />
			</main>
			<LandingFooter />
		</div>
	)
}

export default HomePage