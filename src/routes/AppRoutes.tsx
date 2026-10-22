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
const SportBookingPage = lazyPreload(() => import('../pages/dashboard/sport/SportBooking'))
const SportResourcePage = lazyPreload(() => import('../pages/dashboard/sport/SportResource'))
const SportHargaPage = lazyPreload(() => import('../pages/dashboard/sport/SportHarga'))
const SportMembershipPage = lazyPreload(() => import('../pages/dashboard/sport/SportMembership'))
const KalenderMasterPage = lazyPreload(() => import('../pages/dashboard/master/KalenderMaster'))
const EventPengajuanPage = lazyPreload(() => import('../pages/dashboard/event/EventPengajuan'))
const EventInvoicePage = lazyPreload(() => import('../pages/dashboard/event/EventInvoice'))
const GaleriPage = lazyPreload(() => import('../pages/dashboard/master/Galeri'))
const TestimoniPage = lazyPreload(() => import('../pages/dashboard/admin/testimonial/Testimoni'))
const KontakPage = lazyPreload(() => import('../pages/dashboard/master/Kontak'))
const PelangganPage = lazyPreload(() => import('../pages/dashboard/cms/customer/Management'))
const LaporanPage = lazyPreload(() => import('../pages/dashboard/admin/reports/Management'))
const InvoiceManagementPage = lazyPreload(() => import('../pages/dashboard/admin/invoices/InvoiceManagement'))
const SettingsPage = lazyPreload(() => import('../pages/dashboard/admin/Settings'))
const StaffPage = lazyPreload(() => import('../pages/dashboard/admin/staff/Management'))
const ContactsPage = lazyPreload(() => import('../pages/dashboard/admin/contact/Management'))
const FinancePage = lazyPreload(() => import('../pages/dashboard/admin/finance/Management'))
const PortfolioPage = lazyPreload(() => import('../pages/dashboard/admin/portfolio/Management'))
const PackageManagementPage = lazyPreload(() => import('../pages/dashboard/admin/package/Management'))
const RolePermissionsPage = lazyPreload(() => import('../pages/dashboard/admin/role/Management'))
const ReportsPage = LaporanPage
const ActivitiesPage = lazyPreload(() => import('../pages/dashboard/admin/logs/Management'))
const TeamsManagementPage = lazyPreload(() => import('../pages/dashboard/admin/teams/Management'))
const CustomersManagementPage = PelangganPage
const MediaManagementPage = lazyPreload(() => import('../pages/dashboard/cms/media/Management'))
const CmsPagesManagementPage = lazyPreload(() => import('../pages/dashboard/cms/pages/Management'))
const CmsSectionsManagementPage = lazyPreload(() => import('../pages/dashboard/cms/sections/Management'))

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
	'/sport/booking': SportBookingPage,
	'/sport/resource': SportResourcePage,
	'/sport/harga': SportHargaPage,
	'/sport/membership': SportMembershipPage,
	'/kalender': KalenderMasterPage,
	'/event/pengajuan': EventPengajuanPage,
	'/event/invoice': EventInvoicePage,
	'/dashboard/galeri': GaleriPage,
	'/testimoni': TestimoniPage,
	'/kontak': KontakPage,
	'/pelanggan': PelangganPage,
	'/admin/customers': CustomersManagementPage,
	'/admin/media': MediaManagementPage,
	'/admin/cms/pages': CmsPagesManagementPage,
	'/admin/cms/sections': CmsSectionsManagementPage,
	'/laporan': LaporanPage,
	'/admin/reports': ReportsPage,
	'/admin/activities': ActivitiesPage,
	'/admin/teams': TeamsManagementPage,
	'/pengaturan': SettingsPage,
	'/staff': StaffPage,
	'/admin/contacts': ContactsPage,
	'/admin/finance': FinancePage,
	'/admin/portfolio': PortfolioPage,
	'/admin/packages': PackageManagementPage,
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

		{/* dashboard */}
		<Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
		<Route path="/login" element={<LoginPage />} />
		<Route path="/lupa-password" element={<ForgetPasswordPage />} />
		<Route path="/settingaccount" element={<RequireAuth><SettingAccountPage /></RequireAuth>} />
		<Route path="/template/form" element={<RequireAuth><FormPage /></RequireAuth>} />
		<Route path="/template/tabel" element={<RequireAuth><TablePage /></RequireAuth>} />	
		
		{/* sport */}
		<Route path="/sport/booking" element={<RequireAuth><SportBookingPage /></RequireAuth>} />
		<Route path="/sport/resource" element={<RequireAuth><SportResourcePage /></RequireAuth>} />
		<Route path="/sport/harga" element={<RequireAuth><SportHargaPage /></RequireAuth>} />
		<Route path="/sport/membership" element={<RequireAuth><SportMembershipPage /></RequireAuth>} />
		
		{/* master */}
		<Route path="/kalender" element={<RequireAuth><KalenderMasterPage /></RequireAuth>} />
		<Route path="/galeri" element={<RequireAuth><GaleriPage /></RequireAuth>} />
		<Route path="/testimoni" element={<RequireAuth><TestimoniPage /></RequireAuth>} />
		<Route path="/kontak" element={<RequireAuth><KontakPage /></RequireAuth>} />
		<Route path="/pelanggan" element={<RequireAuth><PelangganPage /></RequireAuth>} />
		<Route path="/admin/customers" element={<RequireAuth><CustomersManagementPage /></RequireAuth>} />
		<Route path="/admin/media" element={<RequireAuth><MediaManagementPage /></RequireAuth>} />
		<Route path="/admin/cms/pages" element={<RequireAuth><CmsPagesManagementPage /></RequireAuth>} />
		<Route path="/admin/cms/sections" element={<RequireAuth><CmsSectionsManagementPage /></RequireAuth>} />
		<Route path="/laporan" element={<RequireAuth><LaporanPage /></RequireAuth>} />
		<Route path="/admin/reports" element={<RequireAuth><ReportsPage /></RequireAuth>} />
		<Route path="/admin/activities" element={<RequireAuth><ActivitiesPage /></RequireAuth>} />
		<Route path="/admin/teams" element={<RequireAuth><TeamsManagementPage /></RequireAuth>} />
		
		{/* event */}
		<Route path="/event/pengajuan" element={<RequireAuth><EventPengajuanPage /></RequireAuth>} />
		<Route path="/event/invoice" element={<RequireAuth><EventInvoicePage /></RequireAuth>} />
		
		{/* admin */}
		<Route path="/admin/invoices" element={<RequireAuth><InvoiceManagementPage /></RequireAuth>} />
		<Route path="/admin/contacts" element={<RequireAuth><ContactsPage /></RequireAuth>} />
		<Route path="/admin/finance" element={<RequireAuth><FinancePage /></RequireAuth>} />
		<Route path="/admin/portfolio" element={<RequireAuth><PortfolioPage /></RequireAuth>} />
		<Route path="/admin/packages" element={<RequireAuth><PackageManagementPage /></RequireAuth>} />
		<Route path="/admin/role-permissions" element={<RequireAuth><RolePermissionsPage /></RequireAuth>} />
		<Route path="/pengaturan" element={<RequireAuth><SettingsPage /></RequireAuth>} />
		<Route path="/staff" element={<RequireAuth><StaffPage /></RequireAuth>} />	</>
)

export default AppRoutes
