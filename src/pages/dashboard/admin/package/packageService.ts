import apiClient from "../../../../services/api";

export type PackageStatus = "active" | "inactive";

export interface PackageImage {
	id: string;
	packageId: string;
	url: string;
	sortOrder: number;
	createdAt: string;
}

export interface ServicePackage {
	id: string;
	name: string;
	type: string;
	tier: string | null;
	price: number;
	description: string | null;
	features: string[] | null;
	isPopular: boolean;
	status: PackageStatus;
	images: PackageImage[];
	createdAt: string;
	updatedAt: string;
}

export interface PackageInput {
	name: string;
	type: string;
	tier: string | null;
	price: number;
	description: string | null;
	features: string[];
	isPopular: boolean;
	status: PackageStatus;
}

interface ApiSuccess<T> {
	data: T;
}

export function getPackageImageUrl(imageUrl: string): string {
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(imageUrl, apiOrigin).toString();
	} catch {
		return imageUrl;
	}
}

export const packageService = {
	async getPackages(type?: string): Promise<ServicePackage[]> {
		const response = await apiClient.get<ApiSuccess<ServicePackage[]>>("/admin/packages", {
			params: type ? { type } : undefined,
		});
		return response.data.data;
	},

	async createPackage(payload: PackageInput): Promise<ServicePackage> {
		const response = await apiClient.post<ApiSuccess<ServicePackage>>("/admin/packages", payload);
		return response.data.data;
	},

	async updatePackage(id: string, payload: Partial<PackageInput>): Promise<ServicePackage> {
		const response = await apiClient.put<ApiSuccess<ServicePackage>>(`/admin/packages/${id}`, payload);
		return response.data.data;
	},

	async deletePackage(id: string): Promise<void> {
		await apiClient.delete(`/admin/packages/${id}`);
	},

	async addImages(id: string, files: File[]): Promise<PackageImage[]> {
		const formData = new FormData();
		files.forEach((file) => formData.append("images", file));
		const response = await apiClient.post<ApiSuccess<PackageImage[]>>(
			`/admin/packages/${id}/images`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return response.data.data;
	},
};
