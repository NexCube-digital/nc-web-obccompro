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
const StaffAuthBridgePage = lazyPreload(() => import('../pages/dashboard/auth/StaffAuthBridge'))
const ForgetPasswordPage = lazyPreload(() => import('../pages/dashboard/auth/ForgetPassword'))
const SettingAccountPage = lazyPreload(() => import('../pages/dashboard/auth/SettingAccount'))
const SportBookingPage = lazyPreload(() => import('../pages/dashboard/sport/booking/SportBooking'))
const SportCourtPage = lazyPreload(() => import('../pages/dashboard/sport/court/Management'))
const SportHargaPage = lazyPreload(() => import('../pages/dashboard/sport/harga/SportHarga'))
const SportMembershipPage = lazyPreload(() => import('../pages/dashboard/sport/membership/SportMembership'))
const TestimoniPage = lazyPreload(() => import('../pages/dashboard/cms/testimonial/Testimoni'))
const KontakLokasiPage = lazyPreload(() => import('../pages/dashboard/cms/contact/SiteContactManagement'))
const PelangganPage = lazyPreload(() => import('../pages/dashboard/cms/customer/Management'))
const LaporanPage = lazyPreload(() => import('../pages/dashboard/admin/reports/Management'))
const InvoiceManagementPage = lazyPreload(() => import('../pages/dashboard/admin/invoices/InvoiceManagement'))
const InvoiceCardPaymentPage = lazyPreload(() => import('../pages/dashboard/admin/invoices/detail/CreditCardPaymentPage'))
const InvoiceFinalizingPage = lazyPreload(() => import('../pages/dashboard/admin/invoices/detail/FinalisasiOrder'))
const InvoiceSuccessPage = lazyPreload(() => import('../pages/dashboard/admin/invoices/detail/SuccessOrder'))
const InvoiceFailedPage = lazyPreload(() => import('../pages/dashboard/admin/invoices/detail/FailedOrder'))
const SettingsPage = lazyPreload(() => import('../pages/dashboard/admin/Settings'))
const StaffPage = lazyPreload(() => import('../pages/dashboard/admin/staff/Management'))
const ContactsPage = lazyPreload(() => import('../pages/dashboard/cms/contact/Management'))
const PortfolioPage = lazyPreload(() => import('../pages/dashboard/cms/portfolio/Management'))
const RolePermissionsPage = lazyPreload(() => import('../pages/dashboard/admin/role/Management'))
const ReportsPage = LaporanPage
const ActivitiesPage = lazyPreload(() => import('../pages/dashboard/admin/logs/Management'))
const CustomersManagementPage = PelangganPage
const CmsBusinessUnitsPage = lazyPreload(() => import('../pages/dashboard/cms/unit-bisnis/Management'))

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
	'/sport/booking': SportBookingPage,
	'/sport/court': SportCourtPage,
	'/sport/harga': SportHargaPage,
	'/sport/membership': SportMembershipPage,
	'/invoice-payment/card': InvoiceCardPaymentPage,
	'/invoice-payment/finalizing': InvoiceFinalizingPage,
	'/invoice-payment/success': InvoiceSuccessPage,
	'/invoice-payment/failed': InvoiceFailedPage,
	'/testimoni': TestimoniPage,
	'/kontak-lokasi': KontakLokasiPage,
	'/pelanggan': PelangganPage,
	'/admin/customers': CustomersManagementPage,
	'/admin/cms/unit-bisnis': CmsBusinessUnitsPage,
	'/laporan': LaporanPage,
	'/admin/reports': ReportsPage,
	'/admin/activities': ActivitiesPage,
	'/pengaturan': SettingsPage,
	'/staff': StaffPage,
	'/admin/contacts': ContactsPage,
	'/admin/portfolio': PortfolioPage,
	'/admin/role-permissions': RolePermissionsPage,
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
		<Route path="/invoice-payment/card" element={<InvoiceCardPaymentPage />} />
		<Route path="/invoice-payment/finalizing" element={<InvoiceFinalizingPage />} />
		<Route path="/invoice-payment/success" element={<InvoiceSuccessPage />} />
		<Route path="/invoice-payment/failed" element={<InvoiceFailedPage />} />

		{/* dashboard */}
		<Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
		<Route path="/auth/bridge" element={<StaffAuthBridgePage />} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/lupa-password" element={<ForgetPasswordPage />} />
		<Route path="/settingaccount" element={<RequireAuth><SettingAccountPage /></RequireAuth>} />
		{/* sport */}
		<Route path="/sport/booking" element={<RequireAuth><SportBookingPage /></RequireAuth>} />
		<Route path="/sport/court" element={<RequireAuth><SportCourtPage /></RequireAuth>} />
		<Route path="/sport/harga" element={<RequireAuth><SportHargaPage /></RequireAuth>} />
		<Route path="/sport/membership" element={<RequireAuth><SportMembershipPage /></RequireAuth>} />
		
		{/* master */}
		<Route path="/testimoni" element={<RequireAuth><TestimoniPage /></RequireAuth>} />
		<Route path="/kontak-lokasi" element={<RequireAuth><KontakLokasiPage /></RequireAuth>} />
		<Route path="/pelanggan" element={<RequireAuth><PelangganPage /></RequireAuth>} />
		<Route path="/admin/customers" element={<RequireAuth><CustomersManagementPage /></RequireAuth>} />
		<Route path="/admin/cms/unit-bisnis" element={<RequireAuth><CmsBusinessUnitsPage /></RequireAuth>} />
		<Route path="/laporan" element={<RequireAuth><LaporanPage /></RequireAuth>} />
		<Route path="/admin/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
		<Route path="/admin/activities" element={<RequireAuth><ActivitiesPage /></RequireAuth>} />
		
		{/* admin */}
		<Route path="/admin/invoices" element={<RequireAuth><InvoiceManagementPage /></RequireAuth>} />
		<Route path="/admin/contacts" element={<RequireAuth><ContactsPage /></RequireAuth>} />
		<Route path="/admin/portfolio" element={<RequireAuth><PortfolioPage /></RequireAuth>} />
		<Route path="/admin/role-permissions" element={<RequireAuth><RolePermissionsPage /></RequireAuth>} />
		<Route path="/pengaturan" element={<RequireAuth><SettingsPage /></RequireAuth>} />
		<Route path="/staff" element={<RequireAuth><StaffPage /></RequireAuth>} />	</>
)

export default AppRoutes
