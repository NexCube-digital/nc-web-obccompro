import apiClient from "../../../../services/api";
import { getPaginated, type ApiSuccess, type ListParams } from "./sportServiceUtils";
import type {
	ActiveStatus,
	Paginated,
	PricingPackage,
	PricingPackageUpdateInput,
	PricingRule,
	PricingRuleUpdateInput,
	StatusUpdate,
} from "./sportTypes";

export const sportPricingService = {
	getPricingRules(params: ListParams & { status?: ActiveStatus }): Promise<Paginated<PricingRule>> {
		return getPaginated("/admin/pricing/rules", params);
	},
	updatePricingRuleStatus(id: string, status: ActiveStatus): Promise<StatusUpdate<ActiveStatus>> {
		return apiClient.put<ApiSuccess<StatusUpdate<ActiveStatus>>>(`/admin/pricing/rules/${id}`, { status }).then((response) => response.data.data);
	},
	updatePricingRule(id: string, input: PricingRuleUpdateInput): Promise<PricingRule> {
		return apiClient.put<ApiSuccess<PricingRule>>(`/admin/pricing/rules/${id}`, input).then((response) => response.data.data);
	},
	deletePricingRule(id: string): Promise<void> {
		return apiClient.delete(`/admin/pricing/rules/${id}`).then(() => undefined);
	},
	getPricingPackages(params: ListParams & { status?: ActiveStatus }): Promise<Paginated<PricingPackage>> {
		return getPaginated("/admin/pricing/packages", params);
	},
	updatePricingPackageStatus(id: string, status: ActiveStatus): Promise<StatusUpdate<ActiveStatus>> {
		return apiClient.put<ApiSuccess<StatusUpdate<ActiveStatus>>>(`/admin/pricing/packages/${id}`, { status }).then((response) => response.data.data);
	},
	updatePricingPackage(id: string, input: PricingPackageUpdateInput): Promise<PricingPackage> {
		return apiClient.put<ApiSuccess<PricingPackage>>(`/admin/pricing/packages/${id}`, input).then((response) => response.data.data);
	},
	deletePricingPackage(id: string): Promise<void> {
		return apiClient.delete(`/admin/pricing/packages/${id}`).then(() => undefined);
	},
};