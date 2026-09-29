import { Route } from 'react-router-dom'
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import BusinessUnitPage from '../pages/public/BusinesUnitPage'
import GalleryPage from '../pages/public/GalleryPage'
import GuestHousePage from '../pages/public/bisnis/GuestHouse'
import ObcAgribisnis from '../pages/public/bisnis/ObcAgribisnis'
import ObcCoffee from '../pages/public/bisnis/ObcCoffe'
import ObcFoodcourt from '../pages/public/bisnis/ObcFoodcourt'
import ObcLaundry from '../pages/public/bisnis/ObcLaundry'
import ObcVilla from '../pages/public/bisnis/ObcVilla'

const AppRoutes = (
	<>
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
	</>
)

export default AppRoutes
