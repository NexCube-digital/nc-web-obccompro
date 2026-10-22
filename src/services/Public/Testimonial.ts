import apiClient from "../api";

export interface PublicTestimonial {
	id: string;
	name: string;
	company: string | null;
	text: string;
	rating: number;
	avatar: string | null;
	createdAt: string;
}

interface ApiSuccess<T> {
	data: T;
}

export function getTestimonialAvatarUrl(avatar: string | null): string | null {
	if (!avatar || (!avatar.startsWith("/") && !/^https?:\/\//i.test(avatar))) return null;
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(avatar, apiOrigin).toString();
	} catch {
		return avatar;
	}
}

export const publicTestimonialService = {
	async getPublished(): Promise<PublicTestimonial[]> {
		const response = await apiClient.get<ApiSuccess<PublicTestimonial[]>>("/public/testimonials");
		return response.data.data;
	},

	async submit(payload: {
		name: string;
		company: string;
		text: string;
		rating: number;
	}): Promise<PublicTestimonial> {
		const response = await apiClient.post<ApiSuccess<PublicTestimonial>>("/public/testimonials", payload);
		return response.data.data;
	},
};
