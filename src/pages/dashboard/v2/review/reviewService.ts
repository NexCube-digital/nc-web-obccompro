import apiClient from "../../../../services/api";

interface ApiSuccess<T> { data: T }

export type ReviewStatus = "published" | "draft" | "archived";
export interface ReviewItem {
	id: string;
	rating: number;
	category: string;
	comment: string;
	status: ReviewStatus;
	photos: string[] | null;
	createdAt: string;
	resource: { id: string; name: string } | null;
	customer: { id: string; name: string; email: string; avatarUrl: string | null } | null;
}

export interface ReviewList {
	items: ReviewItem[];
	pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const reviewService = {
	async getReviews(params: { page?: number; limit?: number; status?: ReviewStatus; resourceId?: string } = {}) {
		const response = await apiClient.get<ApiSuccess<ReviewList>>("/admin/reviews", { params });
		return response.data.data;
	},
	async updateStatus(id: string, status: ReviewStatus) {
		const response = await apiClient.patch<ApiSuccess<ReviewItem>>(`/admin/reviews/${id}/status`, { status });
		return response.data.data;
	},
};
