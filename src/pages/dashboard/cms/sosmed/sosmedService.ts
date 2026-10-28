import apiClient from "../../../../services/api";

interface ApiSuccess<T> { data: T }

export interface SocialMediaContent {
	section: "site-social";
	whatsapp: string;
	instagram: string;
	tiktok: string;
	facebook?: string;
}

export const sosmedService = {
	async getContent(): Promise<SocialMediaContent> {
		const response = await apiClient.get<ApiSuccess<SocialMediaContent>>("/admin/cms/content", { params: { section: "site-social" } });
		return response.data.data;
	},
	async saveContent(payload: SocialMediaContent): Promise<SocialMediaContent> {
		const response = await apiClient.put<ApiSuccess<SocialMediaContent>>("/admin/cms/content", payload);
		return response.data.data;
	},
};
