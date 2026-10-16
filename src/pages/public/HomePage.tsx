import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react'

import LandingNavbar from '../../components/layouts/LandingNavbar'
import LandingFooter from '../../components/layouts/LandingFooter'
import LazySection from '../../components/common/LazySectionHome'
import ScrollReveal from '../../components/animation/ScrollReveal'

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

// Urutan preload sesuai urutan section di halaman
const sectionLoaders = [
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

const IMAGE_FADE_MS = 500
const IMAGE_FADE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'

const HeroFallback = () => (
	<div className="h-[600px] w-full animate-pulse bg-[#f5f0e8]" />
)

/*
 * Memuat chunk section satu per satu saat browser idle (setelah hero tampil),
 * supaya saat user scroll, chunk sudah siap dan tidak ada jeda loading.
 */
function usePreloadSections() {
	useEffect(() => {
		let cancelled = false
		let handle = 0

		const schedule = (fn: () => void) => {
			if (typeof window.requestIdleCallback === 'function') {
				handle = window.requestIdleCallback(fn, { timeout: 2000 })
			} else {
				handle = window.setTimeout(fn, 300)
			}
		}

		const run = async () => {
			// Tunggu hero selesai dimuat dulu supaya tidak berebut bandwidth
			await loadHero().catch(() => {})
			for (const load of sectionLoaders) {
				if (cancelled) return
				await new Promise<void>((resolve) => schedule(resolve))
				await load().catch(() => {})
			}
		}

		run()

		return () => {
			cancelled = true
			if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(handle)
			else window.clearTimeout(handle)
		}
	}, [])
}

/*
 * Membuat gambar di dalam section muncul dengan halus.
 * Gambar yang belum siap disembunyikan, lalu di-fade-in setelah selesai di-decode.
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

/*
 * Satu pembungkus untuk semua section:
 * LazySection (render saat mendekati layar)
 *  -> Suspense (loading chunk tidak menyembunyikan halaman lain)
 *  -> ScrollReveal (fade + naik halus saat masuk layar)
 *  -> SmoothImages (gambar fade-in setelah di-decode)
 */
function Section({ minHeight, children }: { minHeight: number; children: ReactNode }) {
	return (
		<LazySection minHeight={minHeight}>
			<Suspense fallback={<div aria-hidden="true" style={{ minHeight }} />}>
				<ScrollReveal>
					<SmoothImages>{children}</SmoothImages>
				</ScrollReveal>
			</Suspense>
		</LazySection>
	)
}

function HomePage() {
	usePreloadSections()

	return (
		<div className="min-h-screen overflow-x-hidden bg-[#fffff7] font-body text-[#343133]">
			<LandingNavbar />
			<main id="beranda">
				{/* 1. Hero Section: langsung load (above the fold), muncul dengan fade-in */}
				<Suspense fallback={<HeroFallback />}>
					<div className="hero-enter">
						<Hero />
					</div>
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