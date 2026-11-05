import apiClient from "../../../../services/api";
import { mediaService } from "../media/mediaService";

interface ApiSuccess<T> { data: T }
export interface HeroSlide { title: string; description: string; image: string; active: boolean }

export interface HeroContent { section: "hero"; slides: HeroSlide[] }

export const sliderService = {
	async uploadImage(file: File, tenantId?: string) {
		const uploaded = await mediaService.uploadMedia(file, tenantId ?? "");
		return uploaded.url;
	},
	async getContent(tenantId?: string) {
		const response = await apiClient.get<ApiSuccess<unknown>>("/admin/cms/content", { params: { section: "hero", tenantId } });
		const content = response.data.data as HeroContent;
		return { ...content, slides: content.slides.map((slide) => ({ ...slide, active: slide.active !== false })) };
	},
	async saveContent(payload: HeroContent, tenantId?: string) {
		const response = await apiClient.put<ApiSuccess<unknown>>("/admin/cms/content", payload, { params: { tenantId } });
		return response.data.data;
	},
};

export { cmsSectionService as cmsSliderSectionService } from "../sections/sectionService";
export type { CmsSection, CmsSectionInput, CmsSectionStatus, CmsSectionType } from "../sections/sectionService";
