import apiClient from "../../../../services/api";

export type Testimonial = {
	id: string;
	name: string;
	company: string | null;
	text: string;
	textEn: string | null;
	rating: number;
	avatar: string | null;
	status: "published" | "draft" | "archived";
	createdAt: string;
	updatedAt: string;
};

export type TestimonialPayload = Pick<Testimonial, "name" | "company" | "text" | "rating" | "avatar" | "status">;

interface ApiSuccess<T> {
	data: T;
}

function testimonialFormData(payload: Partial<TestimonialPayload>, avatar?: File, avatarRemoved = false): FormData {
	const formData = new FormData();
	Object.entries(payload).forEach(([key, value]) => {
		if (key !== "avatar" && value !== undefined && value !== null) formData.append(key, String(value));
	});
	if (payload.avatar) formData.append("avatar", payload.avatar);
	if (avatar) formData.append("avatar", avatar);
	if (avatarRemoved) formData.append("avatarRemoved", "true");
	return formData;
}

export const testimonialService = {
	async getTestimonials(params?: { status?: "all" | Testimonial["status"]; rating?: number }): Promise<Testimonial[]> {
		const response = await apiClient.get<ApiSuccess<Testimonial[]>>("/admin/testimonials", {
			params: {
				...(params?.status && params.status !== "all" ? { status: params.status } : {}),
				...(params?.rating ? { rating: params.rating } : {}),
			},
		});
		return response.data.data;
	},

	async getTestimonialById(id: string): Promise<Testimonial> {
		const response = await apiClient.get<ApiSuccess<Testimonial>>(`/admin/testimonials/${id}`);
		return response.data.data;
	},

	async createTestimonial(payload: TestimonialPayload, avatar?: File): Promise<Testimonial> {
		const formData = testimonialFormData(payload, avatar);
		const response = await apiClient.post<ApiSuccess<Testimonial>>("/admin/testimonials", formData, { headers: { "Content-Type": "multipart/form-data" } });
		return response.data.data;
	},

	async updateTestimonial(id: string, payload: Partial<TestimonialPayload>, avatar?: File, avatarRemoved = false): Promise<Testimonial> {
		const formData = testimonialFormData(payload, avatar, avatarRemoved);
		const response = await apiClient.put<ApiSuccess<Testimonial>>(`/admin/testimonials/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
		return response.data.data;
	},

	async deleteTestimonial(id: string): Promise<void> {
		await apiClient.delete(`/admin/testimonials/${id}`);
	},

	async toggleTestimonialStatus(id: string): Promise<Testimonial> {
		const response = await apiClient.patch<ApiSuccess<Testimonial>>(`/admin/testimonials/${id}/toggle-status`);
		return response.data.data;
	},
};
