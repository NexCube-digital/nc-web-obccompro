import apiClient from "../../../../services/api";
import fallbackImage from "../../../../assets/no-image.webp";
import { getPaginated, type ApiSuccess, type ListParams } from "./sportServiceUtils";
import type {
	Paginated,
	ResourceAvailability,
	SportResource,
	SportResourceInput,
	StatusUpdate,
} from "./sportTypes";

export function getSportResourceImage(resource: Pick<SportResource, "imageUrl">): string {
	return resource.imageUrl || fallbackImage;
}

export const sportResourceService = {
	getResourceAvailability(resourceId: string, date: string): Promise<ResourceAvailability> {
		return apiClient.get<ApiSuccess<ResourceAvailability>>("/sports/availability", { params: { resourceId, date } })
			.then((response) => response.data.data);
	},
	getResources(params: ListParams & { status?: SportResource["status"] }): Promise<Paginated<SportResource>> {
		return getPaginated("/admin/resources", params);
	},
	createResource(tenantId: string, input: SportResourceInput): Promise<SportResource> {
		return apiClient.post<ApiSuccess<SportResource>>("/admin/resources", input, { params: { tenantId } }).then((response) => response.data.data);
	},
	updateResource(id: string, input: Partial<SportResourceInput>): Promise<SportResource> {
		return apiClient.put<ApiSuccess<SportResource>>(`/admin/resources/${id}`, input).then((response) => response.data.data);
	},
	deleteResource(id: string): Promise<void> {
		return apiClient.delete(`/admin/resources/${id}`).then(() => undefined);
	},
	updateResourceStatus(id: string, status: SportResource["status"]): Promise<StatusUpdate<SportResource["status"]>> {
		return apiClient.put<ApiSuccess<StatusUpdate<SportResource["status"]>>>(`/admin/resources/${id}`, { status }).then((response) => response.data.data);
	},
};