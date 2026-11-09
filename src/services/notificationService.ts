import apiClient from "./api";

export interface AdminNotification {
	id: string;
	customerId: string | null;
	title: string;
	body: string;
	type: string;
	actionUrl: string | null;
	isRead: boolean;
	createdAt: string;
}

interface ApiSuccess<T> {
	data: T;
	meta?: {
		total: number;
		totalPages: number;
		page: number;
		limit: number;
	};
}

export async function getAdminNotifications(limit = 8): Promise<AdminNotification[]> {
	const response = await apiClient.get<ApiSuccess<AdminNotification[]>>("/admin/notifications", {
		params: { page: 1, limit },
	});
	return response.data.data;
}
