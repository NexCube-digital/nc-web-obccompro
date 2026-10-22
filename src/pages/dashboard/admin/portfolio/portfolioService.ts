import apiClient from "../../../../services/api";

export interface Portfolio {
	id: string;
	title: string;
	category: string;
	description: string | null;
	client: string | null;
	technologies: string | null;
	link: string | null;
	imageUrl: string | null;
	featured: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PortfolioInput {
	title: string;
	category: string;
	description: string | null;
	client: string | null;
	technologies: string | null;
	link: string | null;
	featured: boolean;
}

interface ApiSuccess<T> {
	data: T;
}

export function getPortfolioImageUrl(imageUrl: string | null): string | null {
	if (!imageUrl) return null;
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(imageUrl, apiOrigin).toString();
	} catch {
		return imageUrl;
	}
}

function toFormData(payload: PortfolioInput, image?: File): FormData {
	const data = new FormData();
	Object.entries(payload).forEach(([key, value]) => data.append(key, value === null ? "" : String(value)));
	if (image) data.append("image", image);
	return data;
}

export const portfolioService = {
	async getPortfolios(filters: { category?: string; featured?: boolean } = {}): Promise<Portfolio[]> {
		const response = await apiClient.get<ApiSuccess<Portfolio[]>>("/admin/portfolios", { params: filters });
		return response.data.data;
	},

	async createPortfolio(payload: PortfolioInput, image?: File): Promise<Portfolio> {
		const response = image
			? await apiClient.post<ApiSuccess<Portfolio>>("/admin/portfolios", toFormData(payload, image), {
				headers: { "Content-Type": "multipart/form-data" },
			})
			: await apiClient.post<ApiSuccess<Portfolio>>("/admin/portfolios", payload);
		return response.data.data;
	},

	async updatePortfolio(id: string, payload: PortfolioInput, image?: File): Promise<Portfolio> {
		const response = image
			? await apiClient.put<ApiSuccess<Portfolio>>(`/admin/portfolios/${id}`, toFormData(payload, image), {
				headers: { "Content-Type": "multipart/form-data" },
			})
			: await apiClient.put<ApiSuccess<Portfolio>>(`/admin/portfolios/${id}`, payload);
		return response.data.data;
	},

	async deletePortfolio(id: string): Promise<void> {
		await apiClient.delete(`/admin/portfolios/${id}`);
	},
};
