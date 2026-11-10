import apiClient from "../../../../services/api";

export interface ActivityActor {
	id: string;
	name: string;
	email: string;
	role?: string;
}

export interface ActivityRecord {
	id: string;
	actorType: string;
	userId: string | null;
	customerId: string | null;
	entityType: string;
	entityId: string;
	action: string;
	oldValues: unknown;
	newValues: unknown;
	ipAddress: string | null;
	userAgent: string | null;
	requestId: string | null;
	createdAt: string;
	user: ActivityActor | null;
	customer: ActivityActor | null;
}

interface ApiSuccess<T> {
	data: T;
}

export const logsService = {
	async getActivities(limit = 20): Promise<ActivityRecord[]> {
		const response = await apiClient.get<ApiSuccess<ActivityRecord[]>>("/admin/activities", {
			params: { limit },
		});
		return response.data.data;
	},
};
