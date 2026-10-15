import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react'

import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import LazySection from '../../components/common/LazySectionHome'
import ScrollReveal from '../../components/animation/ScrollReveal'

/*
 * Loader dipisah dari lazy() supaya chunk bisa di-prefetch saat browser idle.
 * Dengan begitu chunk section tidak baru diunduh ketika animasi reveal sedang berjalan.
 */
const loadHero = () => import('./home/Hero')
const loadPromoBanner = () => import('./home/PromoBanner')
const loadTentangKami = () => import('./home/TentangKami')
const loadUnitBisnis = () => import('./home/UnitBisnis')
const loadSportCenter = () => import('./home/SportCenter')
const loadMembership = () => import('./home/Membership')
const loadGedungMultifungsi = () => import('./home/GedungMultifungsi')
const loadGaleri = () => import('./home/Galeri')
const loadTestimoni = () => import('./home/Testimoni')
const loadLokasi = () => import('./home/Lokasi')

const Hero = lazy(loadHero)
const PromoBanner = lazy(loadPromoBanner)
const TentangKami = lazy(loadTentangKami)
const UnitBisnis = lazy(loadUnitBisnis)
const SportCenter = lazy(loadSportCenter)
const Membership = lazy(loadMembership)
const GedungMultifungsi = lazy(loadGedungMultifungsi)
const Galeri = lazy(loadGaleri)
const Testimoni = lazy(loadTestimoni)
const Lokasi = lazy(loadLokasi)

const SECTION_LOADERS = [
	loadPromoBanner,
	loadTentangKami,
	loadUnitBisnis,
	loadSportCenter,
	loadMembership,
	loadGedungMultifungsi,
	loadGaleri,
	loadTestimoni,
	loadLokasi,
]

const IMAGE_FADE_MS = 700
const IMAGE_FADE_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

const HeroFallback = () => (
	<div className="h-[600px] w-full animate-pulse bg-[#f5f0e8]" />
)

/*
 * Membuat gambar di dalam section muncul dengan halus.
 * Masalah sebelumnya: gambar (terutama yang loading="lazy") baru selesai diunduh setelah animasi
 * reveal berjalan, jadi gambar "muncul tiba-tiba" di tengah animasi dan terlihat patah-patah.
 * Solusinya:
 *  1. Gambar langsung diunduh (eager) begitu section dirender, karena section sendiri
 *     sudah dirender malas oleh LazySection.
 *  2. Gambar yang belum siap disembunyikan, lalu di-fade-in setelah selesai di-decode.
 */
function SmoothImages({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const root = ref.current
		if (!root) return

		const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		const handled = new WeakSet<HTMLImageElement>()
		const timers: number[] = []

		const prepare = (img: HTMLImageElement) => {
			if (handled.has(img)) return
			handled.add(img)

			img.loading = 'eager'
			img.decoding = 'async'

			// Gambar yang sudah siap tidak perlu diapa-apakan
			if (prefersReduced || (img.complete && img.naturalWidth > 0)) return

			img.style.opacity = '0'
			img.style.transition = `opacity ${IMAGE_FADE_MS}ms ${IMAGE_FADE_EASING}`

			let shown = false
			const show = () => {
				if (shown) return
				shown = true
				// Frame berikutnya supaya opacity 0 sempat dirender sebelum fade dimulai
				requestAnimationFrame(() => {
					img.style.opacity = ''
					// Kembalikan transition bawaan (mis. hover scale) setelah fade selesai
					timers.push(
						window.setTimeout(() => {
							img.style.transition = ''
						}, IMAGE_FADE_MS + 50),
					)
				})
			}

			img.addEventListener('load', () => {
				if (typeof img.decode === 'function') img.decode().then(show, show)
				else show()
			}, { once: true })
			img.addEventListener('error', show, { once: true })
		}

		root.querySelectorAll('img').forEach(prepare)

		// Tangkap gambar yang baru muncul belakangan (komponen lazy / render ulang)
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node instanceof HTMLImageElement) prepare(node)
					else if (node instanceof Element) node.querySelectorAll('img').forEach(prepare)
				})
			})
		})
		observer.observe(root, { childList: true, subtree: true })

		return () => {
			observer.disconnect()
			timers.forEach((id) => window.clearTimeout(id))
		}
	}, [])

	// display: contents agar wrapper ini tidak mengubah layout section
	return (
		<div ref={ref} className="contents">
			{children}
		</div>
	)
}

/* Satu pembungkus untuk semua section: lazy render + reveal + gambar halus */
function Section({ minHeight, children }: { minHeight: number; children: ReactNode }) {
	return (
		<LazySection minHeight={minHeight}>
			<ScrollReveal>
				<SmoothImages>{children}</SmoothImages>
			</ScrollReveal>
		</LazySection>
	)
}

function HomePage() {
	// Prefetch chunk semua section saat browser idle, kecuali pengguna menghemat data
	useEffect(() => {
		const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
		if (connection?.saveData) return

		const run = () => SECTION_LOADERS.forEach((load) => load().catch(() => undefined))

		if (typeof window.requestIdleCallback === 'function' && typeof window.cancelIdleCallback === 'function') {
			const id = window.requestIdleCallback(run, { timeout: 3000 })
			return () => window.cancelIdleCallback(id)
		}
		const timer = window.setTimeout(run, 1500)
		return () => window.clearTimeout(timer)
	}, [])

	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main id="beranda">
				{/* 1. Hero Section: langsung load (above the fold) */}
				<Suspense fallback={<HeroFallback />}>
					<Hero />
				</Suspense>

				{/* 2. Promo Banner */}
				<Section minHeight={200}>
					<PromoBanner />
				</Section>

				{/* 3. Tentang OBC Group */}
				<Section minHeight={500}>
					<TentangKami />
				</Section>

				{/* 4. Bisnis Kami (Unit Bisnis) */}
				<Section minHeight={500}>
					<UnitBisnis />
				</Section>

				{/* 5. OBC Sport Center */}
				<Section minHeight={500}>
					<SportCenter />
				</Section>

				{/* 6. Membership */}
				<Section minHeight={500}>
					<Membership />
				</Section>

				{/* 7. Gedung Multifungsi / Event Space */}
				<Section minHeight={500}>
					<GedungMultifungsi />
				</Section>

				{/* 8. Galeri */}
				<Section minHeight={500}>
					<Galeri />
				</Section>

				{/* 9. Testimoni */}
				<Section minHeight={400}>
					<Testimoni />
				</Section>

				{/* 10. Lokasi OBC Group */}
				<Section minHeight={500}>
					<Lokasi />
				</Section>
			</main>
			<LandingFooter />
		</div>
	)
}

export default HomePage