import apiClient from "../../../../services/api";
import type { CmsPage } from "../pages/pageService";

export type CmsSectionType = "hero" | "about" | "services" | "gallery" | "testimonials" | "contact" | "custom";
export type CmsLanguage = "id" | "en";
export type CmsSectionStatus = "active" | "inactive";

export interface CmsTranslation {
	id: string;
	sectionId: string;
	language: CmsLanguage;
	title: string;
	content: unknown;
	createdAt: string;
	updatedAt: string;
}

export interface CmsSection {
	id: string;
	pageId: string;
	sectionKey: string;
	title: string;
	sectionType: CmsSectionType;
	content: unknown;
	sortOrder: number;
	status: CmsSectionStatus;
	createdAt: string;
	updatedAt: string;
	translations: CmsTranslation[];
	page: Pick<CmsPage, "id" | "title" | "slug">;
}

export interface CmsSectionInput {
	pageId: string;
	sectionKey: string;
	title: string;
	sectionType: CmsSectionType;
	content: unknown;
	sortOrder: number;
	status?: CmsSectionStatus;
}

interface ApiSuccess<T> {
	data: T;
}

export const cmsSectionService = {
	async getSections(tenantId?: string): Promise<CmsSection[]> {
		const response = await apiClient.get<ApiSuccess<CmsSection[]>>("/admin/cms/sections", {
			params: tenantId ? { tenantId } : undefined,
		});
		return response.data.data;
	},

	async createSection(payload: Omit<CmsSectionInput, "status">): Promise<CmsSection> {
		const response = await apiClient.post<ApiSuccess<CmsSection>>("/admin/cms/sections", payload);
		return response.data.data;
	},

	async updateSection(id: string, payload: Partial<CmsSectionInput>): Promise<CmsSection> {
		const response = await apiClient.put<ApiSuccess<CmsSection>>(`/admin/cms/sections/${id}`, payload);
		return response.data.data;
	},

	async deleteSection(id: string): Promise<void> {
		await apiClient.delete(`/admin/cms/sections/${id}`);
	},

	async saveTranslation(sectionId: string, language: CmsLanguage, payload: { title: string; content: unknown }): Promise<CmsTranslation> {
		const response = await apiClient.put<ApiSuccess<CmsTranslation>>(
			`/admin/cms/sections/${sectionId}/translations/${language}`,
			payload,
		);
		return response.data.data;
	},
};
