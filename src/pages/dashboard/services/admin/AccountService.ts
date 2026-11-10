import apiClient from "../../../../services/api";

export type StaffRole = "super_admin" | "admin" | "marketing" | "sport";
export type StaffStatus = "active" | "inactive" | "suspended";

export type Staff = {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	role: StaffRole;
	status: StaffStatus;
	avatarUrl: string | null;
	bio: string | null;
	lastLoginAt: string | null;
	createdAt: string;
	teamProfile: {
		id: string;
		position: string | null;
		expertise: string | null;
	} | null;
};

export type CreatedStaff = Pick<Staff, "id" | "name" | "email" | "phone" | "role" | "status" | "createdAt">;
export type UpdatedStaff = Pick<Staff, "id" | "name" | "email" | "phone" | "role" | "status" | "avatarUrl"> & { updatedAt: string };

export type StaffPayload = {
	name: string;
	email: string;
	password: string;
	role: StaffRole;
	phone?: string | null;
	team?: { position?: string | null; expertise?: string | null };
};

interface ApiSuccess<T> {
	data: T;
}

export const accountService = {
	async getStaffList(): Promise<Staff[]> {
		const response = await apiClient.get<ApiSuccess<Staff[]>>("/admin/users");
		return response.data.data;
	},

	async getStaffById(id: string): Promise<Staff> {
		const response = await apiClient.get<ApiSuccess<Staff>>(`/admin/users/${id}`);
		return response.data.data;
	},

	async createStaff(payload: StaffPayload): Promise<CreatedStaff> {
		const response = await apiClient.post<ApiSuccess<CreatedStaff>>("/admin/users", payload);
		return response.data.data;
	},

	async updateStaff(id: string, payload: Partial<StaffPayload> & { status?: StaffStatus }): Promise<UpdatedStaff> {
		const response = await apiClient.put<ApiSuccess<UpdatedStaff>>(`/admin/users/${id}`, payload);
		return response.data.data;
	},

	async deleteStaff(id: string): Promise<void> {
		await apiClient.delete(`/admin/users/${id}`);
	},
};
