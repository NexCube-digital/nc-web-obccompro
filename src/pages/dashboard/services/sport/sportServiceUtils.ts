import apiClient from "../../../../services/api";
import type { PageMeta, Paginated } from "./sportTypes";

export interface ApiSuccess<T> {
	data: T;
	meta?: PageMeta;
}

export type ListParams = {
	page?: number;
	limit?: number;
	status?: string;
	search?: string;
	date?: string;
	resourceId?: string;
};

export async function getPaginated<T>(url: string, params: ListParams): Promise<Paginated<T>> {
	const response = await apiClient.get<ApiSuccess<T[]>>(url, { params });
	return {
		data: response.data.data,
		meta: response.data.meta ?? {
			page: params.page ?? 1,
			limit: params.limit ?? 20,
			total: response.data.data.length,
			totalPages: 1,
		},
	};
}