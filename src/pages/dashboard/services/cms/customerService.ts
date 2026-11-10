import apiClient from "../../../../services/api";

export type CustomerStatus = "active" | "inactive" | "suspended";

export interface CustomerRecord {
	id: string;
	name: string;
	email: string;
	username: string | null;
	phone: string | null;
	status: CustomerStatus;
	avatarUrl: string | null;
	authProvider: string;
	createdAt: string;
	lastLoginAt: string | null;
	_count: {
		bookings: number;
		memberships: number;
		reviews: number;
	};
}

export interface CustomerPagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CustomerListResponse {
	items: CustomerRecord[];
	pagination: CustomerPagination;
}

interface ApiSuccess<T> {
	data: T;
}

export function getCustomerAvatarUrl(avatarUrl: string | null): string | null {
	if (!avatarUrl) return null;
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(avatarUrl, apiOrigin).toString();
	} catch {
		return avatarUrl;
	}
}

export const customerService = {
	async getCustomers(params: {
		page: number;
		limit: number;
		search?: string;
		status?: CustomerStatus | "all";
	}): Promise<CustomerListResponse> {
		const response = await apiClient.get<ApiSuccess<CustomerListResponse>>("/admin/customers", {
			params: {
				page: params.page,
				limit: params.limit,
				...(params.search ? { search: params.search } : {}),
				...(params.status && params.status !== "all" ? { status: params.status } : {}),
			},
		});
		return response.data.data;
	},

	async updateStatus(id: string, status: CustomerStatus): Promise<Pick<CustomerRecord, "id" | "name" | "email" | "status">> {
		const response = await apiClient.patch<ApiSuccess<Pick<CustomerRecord, "id" | "name" | "email" | "status">>>(
			`/admin/customers/${id}/status`,
			{ status },
		);
		return response.data.data;
	},
};
