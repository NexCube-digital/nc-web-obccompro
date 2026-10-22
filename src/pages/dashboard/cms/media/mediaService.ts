import apiClient from "../../../../services/api";

export type MediaType = "image" | "video" | "document";

export interface MediaRecord {
	id: string;
	tenantId: string;
	filename: string;
	originalName: string;
	mimeType: string;
	fileSize: number;
	url: string;
	altText: string | null;
	mediaType: MediaType;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

interface ApiSuccess<T> {
	data: T;
}

export function getMediaUrl(url: string): string {
	try {
		const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
		const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;
		return new URL(url, apiOrigin).toString();
	} catch {
		return url;
	}
}

export function formatFileSize(size: number): string {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export const mediaService = {
	async getMedia(): Promise<MediaRecord[]> {
		const response = await apiClient.get<ApiSuccess<MediaRecord[]>>("/admin/media");
		return response.data.data;
	},

	async uploadMedia(file: File, tenantId: string): Promise<MediaRecord> {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("tenantId", tenantId);
		const response = await apiClient.post<ApiSuccess<MediaRecord>>(
			"/admin/media/upload",
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
		return response.data.data;
	},

	async deleteMedia(id: string): Promise<void> {
		await apiClient.delete(`/admin/media/${id}`);
	},
};
