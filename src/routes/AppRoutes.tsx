import { lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import { Navigate, Route } from 'react-router-dom'
import { authService } from '../services/auth'

type PreloadablePage<T extends ComponentType> = LazyExoticComponent<T> & {
	preload: () => Promise<{ default: T }>
}

// eslint-disable-next-line react-refresh/only-export-components -- Helper preload route disimpan bersama definisi route.
export function lazyPreload<T extends ComponentType>(factory: () => Promise<{ default: T }>) {
	let modulePromise: Promise<{ default: T }> | undefined
	const load = () => {
		if (!modulePromise) {
			modulePromise = factory().catch((error: unknown) => {
				modulePromise = undefined
				throw error
			})
		}
		return modulePromise
	}

	const Component = lazy(load) as PreloadablePage<T>
	Component.preload = load
	return Component
}

function RequireAuth({ children }: { children: ReactNode }) {
	return authService.getCurrentSession() ? <>{children}</> : <Navigate to="/login" replace />
}

const HomePage = lazyPreload(() => import('../pages/public/HomePage'))
const AboutPage = lazyPreload(() => import('../pages/public/AboutPage'))
const BusinessUnitPage = lazyPreload(() => import('../pages/public/BusinesUnitPage'))
const GalleryPage = lazyPreload(() => import('../pages/public/GalleryPage'))
const GuestHousePage = lazyPreload(() => import('../pages/public/bisnis/GuestHouse'))
const ObcAgribisnis = lazyPreload(() => import('../pages/public/bisnis/ObcAgribisnis'))
const ObcCoffee = lazyPreload(() => import('../pages/public/bisnis/ObcCoffe'))
const ObcFoodcourt = lazyPreload(() => import('../pages/public/bisnis/ObcFoodcourt'))
const ObcLaundry = lazyPreload(() => import('../pages/public/bisnis/ObcLaundry'))
const ObcVilla = lazyPreload(() => import('../pages/public/bisnis/ObcVilla'))
const DashboardPage = lazyPreload(() => import('../pages/dashboard/admin/DashboardPage'))
const LoginPage = lazyPreload(() => import('../pages/dashboard/auth/Login'))
const ForgetPasswordPage = lazyPreload(() => import('../pages/dashboard/auth/ForgetPassword'))
const SettingAccountPage = lazyPreload(() => import('../pages/dashboard/auth/SettingAccount'))
const FormPage = lazyPreload(() => import('../pages/dashboard/template/Form'))
const TablePage = lazyPreload(() => import('../pages/dashboard/template/Tabel'))

const routeComponents: Record<string, PreloadablePage<ComponentType>> = {
	'/': HomePage,
	'/tentang-kami': AboutPage,
	'/unit-bisnis': BusinessUnitPage,
	'/galeri': GalleryPage,
	'/unit-bisnis/guest-house': GuestHousePage,
	'/unit-bisnis/villa': ObcVilla,
	'/unit-bisnis/laundry': ObcLaundry,
	'/unit-bisnis/food-court': ObcFoodcourt,
	'/unit-bisnis/coffee': ObcCoffee,
	'/unit-bisnis/agribisnis': ObcAgribisnis,
	'/dashboard': DashboardPage,
	'/login': LoginPage,
	'/lupa-password': ForgetPasswordPage,
	'/settingaccount': SettingAccountPage,
	'/template/form': FormPage,
	'/template/tabel': TablePage,
}

// eslint-disable-next-line react-refresh/only-export-components -- Dipakai TransitionLink sebelum navigasi.
export function preloadRoute(to: string): Promise<void> {
	const pathname = (to.split(/[?#]/, 1)[0] || '/').replace(/\/+$/, '') || '/'
	const route = routeComponents[pathname]
	return route ? route.preload().then(() => undefined) : Promise.resolve()
}


const AppRoutes = (
	<>

		{/* public */}
		<Route path="/" element={<HomePage />} />
		<Route path="/tentang-kami" element={<AboutPage />} />
		<Route path="/unit-bisnis" element={<BusinessUnitPage />} />
		<Route path="/galeri" element={<GalleryPage />} />
		<Route path="/unit-bisnis/guest-house" element={<GuestHousePage />} />
		<Route path="/unit-bisnis/villa" element={<ObcVilla />} />
		<Route path="/unit-bisnis/laundry" element={<ObcLaundry />} />
		<Route path="/unit-bisnis/food-court" element={<ObcFoodcourt />} />
		<Route path="/unit-bisnis/coffee" element={<ObcCoffee />} />
		<Route path="/unit-bisnis/agribisnis" element={<ObcAgribisnis />} />

		{/* dashboard */}
		<Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/lupa-password" element={<ForgetPasswordPage />} />
		<Route path="/settingaccount" element={<RequireAuth><SettingAccountPage /></RequireAuth>} />
		<Route path="/template/form" element={<RequireAuth><FormPage /></RequireAuth>} />
		<Route path="/template/tabel" element={<RequireAuth><TablePage /></RequireAuth>} />
	</>
)

export default AppRoutes
