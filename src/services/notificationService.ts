import apiClient from "./api";

export type AdminNotificationType = "info" | "promo" | "booking" | "payment" | "membership" | "system";

export interface AdminNotificationPayload {
	customerId: string | null;
	title: string;
	body: string;
	type: AdminNotificationType;
	actionUrl: string | null;
}

export interface AdminNotification {
	id: string;
	customerId: string | null;
	title: string;
	body: string;
	type: AdminNotificationType;
	actionUrl: string | null;
	isRead: boolean;
	createdAt: string;
}

interface ApiSuccess<T> {
	data: T;
}

export async function createAdminNotification(
	payload: AdminNotificationPayload,
): Promise<AdminNotification> {
	const response = await apiClient.post<ApiSuccess<AdminNotification>>(
		"/admin/notifications",
		payload,
	);
	return response.data.data;
}