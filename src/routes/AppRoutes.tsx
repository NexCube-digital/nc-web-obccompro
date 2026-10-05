import { lazy } from 'react'
import { Route } from 'react-router-dom'

const HomePage = lazy(() => import('../pages/public/HomePage'))
const AboutPage = lazy(() => import('../pages/public/AboutPage'))
const BusinessUnitPage = lazy(() => import('../pages/public/BusinesUnitPage'))
const GalleryPage = lazy(() => import('../pages/public/GalleryPage'))
const GuestHousePage = lazy(() => import('../pages/public/bisnis/GuestHouse'))
const ObcAgribisnis = lazy(() => import('../pages/public/bisnis/ObcAgribisnis'))
const ObcCoffee = lazy(() => import('../pages/public/bisnis/ObcCoffe'))
const ObcFoodcourt = lazy(() => import('../pages/public/bisnis/ObcFoodcourt'))
const ObcLaundry = lazy(() => import('../pages/public/bisnis/ObcLaundry'))
const ObcVilla = lazy(() => import('../pages/public/bisnis/ObcVilla'))
const DashboardPage = lazy(() => import('../pages/dashboard/admin/DashboardPage'))
const FormPage = lazy(() => import('../pages/dashboard/template/Form'))
const TablePage = lazy(() => import('../pages/dashboard/template/Tabel'))


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
		<Route path="/dashboard" element={<DashboardPage />} />
		<Route path="/template/form" element={<FormPage />} />
		<Route path="/template/tabel" element={<TablePage />} />
	</>
)

export default AppRoutes
