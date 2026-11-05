import apiClient from '../api'
import { getMediaUrl } from '../../pages/dashboard/v2/media/mediaService'

interface PortfolioRecord {
	id: string
	title: string
	category: string
	imageUrl: string | null
}

interface ApiSuccess<T> {
	data: T
}

export interface GalleryPhoto {
	src: string
	alt: string
	category: string
}

export async function getPublicGalleryPhotos(): Promise<GalleryPhoto[]> {
	const response = await apiClient.get<ApiSuccess<PortfolioRecord[]>>('/public/portfolios')

	return response.data.data.flatMap((portfolio) => {
		if (!portfolio.imageUrl?.trim()) return []

		return [{
			src: getMediaUrl(portfolio.imageUrl),
			alt: portfolio.title,
			category: portfolio.category,
		}]
	})
}
