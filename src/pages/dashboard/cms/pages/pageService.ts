import apiClient from "../../../../services/api";

export type CmsPageType = "home" | "about" | "services" | "contact" | "custom";
export type CmsPageStatus = "published" | "draft" | "archived";

export interface CmsPageSection {
	id: string;
	sectionKey: string;
	title: string;
	sectionType: string;
	sortOrder: number;
	status: "active" | "inactive";
}

export interface CmsPage {
	id: string;
	tenantId: string;
	slug: string;
	title: string;
	pageType: CmsPageType;
	sortOrder: number;
	status: CmsPageStatus;
	createdAt: string;
	updatedAt: string;
	sections: CmsPageSection[];
}

export interface CmsPageInput {
	tenantId?: string;
	slug: string;
	title: string;
	pageType: CmsPageType;
	sortOrder: number;
	status: CmsPageStatus;
}

interface ApiSuccess<T> {
	data: T;
}

export const cmsPageService = {
	async getPages(tenantId?: string): Promise<CmsPage[]> {
		const response = await apiClient.get<ApiSuccess<CmsPage[]>>("/admin/cms/pages", {
			params: tenantId ? { tenantId } : undefined,
		});
		return response.data.data;
	},

	async createPage(payload: CmsPageInput): Promise<CmsPage> {
		const response = await apiClient.post<ApiSuccess<CmsPage>>("/admin/cms/pages", payload);
		return response.data.data;
	},

	async updatePage(id: string, payload: Partial<CmsPageInput>): Promise<CmsPage> {
		const response = await apiClient.put<ApiSuccess<CmsPage>>(`/admin/cms/pages/${id}`, payload);
		return response.data.data;
	},

	async deletePage(id: string): Promise<void> {
		await apiClient.delete(`/admin/cms/pages/${id}`);
	},
};
