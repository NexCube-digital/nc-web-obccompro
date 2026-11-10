import apiClient from "../../../../services/api";
import { getPaginated, type ApiSuccess, type ListParams } from "./sportServiceUtils";
import type {
	ActiveStatus,
	MembershipPackage,
	MembershipPackageUpdateInput,
	Paginated,
	StatusUpdate,
} from "./sportTypes";

export const sportMembershipService = {
	getMembershipPackages(params: ListParams & { status?: ActiveStatus }): Promise<Paginated<MembershipPackage>> {
		return getPaginated("/admin/membership-packages", params);
	},
	updateMembershipPackageStatus(id: string, status: ActiveStatus): Promise<StatusUpdate<ActiveStatus>> {
		return apiClient.put<ApiSuccess<StatusUpdate<ActiveStatus>>>(`/admin/membership-packages/${id}`, { status }).then((response) => response.data.data);
	},
	updateMembershipPackage(id: string, input: MembershipPackageUpdateInput): Promise<MembershipPackage> {
		return apiClient.put<ApiSuccess<MembershipPackage>>(`/admin/membership-packages/${id}`, input).then((response) => response.data.data);
	},
	deleteMembershipPackage(id: string): Promise<void> {
		return apiClient.delete(`/admin/membership-packages/${id}`).then(() => undefined);
	},
};