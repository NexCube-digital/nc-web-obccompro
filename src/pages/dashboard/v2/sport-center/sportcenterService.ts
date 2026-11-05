import apiClient from "../../../../services/api";

interface ApiSuccess<T> { data: T }
export interface SportCenterCard { badge: string; image: string; icon: string; items: string[]; price?: string | null; videoUrl?: string | null }
export interface SportCenterContent { section: "sport-center"; title: string; subtitle: string; cards: SportCenterCard[] }

export const sportCenterService = {
	async getContent(tenantId?: string) {
		const response = await apiClient.get<ApiSuccess<unknown>>("/admin/cms/content", { params: { section: "sport-center", tenantId } });
		return response.data.data;
	},
	async saveContent(payload: SportCenterContent, tenantId?: string) {
		const response = await apiClient.put<ApiSuccess<unknown>>("/admin/cms/content", payload, { params: { tenantId } });
		return response.data.data;
	},
};

export { cmsSectionService as cmsSportCenterSectionService } from "../sections/sectionService";
export type { CmsSection, CmsSectionInput, CmsSectionStatus, CmsSectionType } from "../sections/sectionService";
