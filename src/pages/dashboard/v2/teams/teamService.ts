import apiClient from "../../../../services/api";

export interface TeamMember {
	id: string;
	name: string;
	position: string | null;
	bio: string | null;
	expertise: string | null;
	photoUrl: string | null;
	bankName: string | null;
	bankAccount: string | null;
	sortOrder: number;
	userId: string | null;
	user?: { email: string; role: string } | null;
	createdAt: string;
	updatedAt: string;
}

export interface TeamInput {
	name: string;
	position: string | null;
	bio: string | null;
	expertise: string | null;
	photoUrl: string | null;
	bankName: string | null;
	bankAccount: string | null;
	sortOrder: number;
	userId: string | null;
}

interface ApiSuccess<T> {
	data: T;
}

export function getTeamPhotoUrl(photoUrl: string): string {
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(photoUrl, apiOrigin).toString();
	} catch {
		return photoUrl;
	}
}

export const teamService = {
	async getTeams(): Promise<TeamMember[]> {
		const response = await apiClient.get<ApiSuccess<TeamMember[]>>("/admin/teams");
		return response.data.data;
	},

	async createTeam(payload: TeamInput): Promise<TeamMember> {
		const response = await apiClient.post<ApiSuccess<TeamMember>>("/admin/teams", payload);
		return response.data.data;
	},

	async updateTeam(id: string, payload: TeamInput): Promise<TeamMember> {
		const response = await apiClient.put<ApiSuccess<TeamMember>>(`/admin/teams/${id}`, payload);
		return response.data.data;
	},

	async deleteTeam(id: string): Promise<void> {
		await apiClient.delete(`/admin/teams/${id}`);
	},
};
