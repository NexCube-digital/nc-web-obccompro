import apiClient from "../../../../services/api";

export type PromoStatus = "active" | "inactive";
export type PromoDiscountType = "percentage" | "fixed";
export type PromoSport = "futsal" | "badminton" | "basketball" | "volleyball" | "pickleball" | "tennis" | "billiard" | "swimming" | "event" | "other";

export interface Promo {
	id: string;
	tenantId: string | null;
	code: string;
	name: string;
	description: string | null;
	discountType: PromoDiscountType;
	discountValue: number;
	maxDiscount: number | null;
	minOrderAmount: number;
	startDate: string;
	endDate: string;
	quota: number | null;
	usedCount: number;
	applicableSports: PromoSport[] | null;
	bannerUrl: string | null;
	termsConditions: string[] | string | null;
	status: PromoStatus;
	createdAt: string;
	updatedAt: string;
}

export type PromoInput = Omit<Promo, "id" | "tenantId" | "usedCount" | "createdAt" | "updatedAt"> & { tenantId?: string | null };

interface ApiSuccess<T> {
	data: T;
	meta?: { total: number; totalPages: number; page: number; limit: number };
}

interface PromoListPayload {
	items: Promo[];
	pagination: { total: number; totalPages: number; page: number; limit: number };
}

export interface PromoPage {
	data: Promo[];
	meta: NonNullable<ApiSuccess<Promo[]>["meta"]>;
}

export async function getPromos(params: { page: number; limit: number; status?: PromoStatus; search?: string }): Promise<PromoPage> {
	const response = await apiClient.get<ApiSuccess<PromoListPayload | Promo[]>>("/admin/promos", { params });
	const payload = response.data.data;
	if (Array.isArray(payload)) {
		return { data: payload, meta: response.data.meta ?? { total: payload.length, totalPages: 1, page: params.page, limit: params.limit } };
	}
	return { data: payload.items ?? [], meta: payload.pagination ?? { total: 0, totalPages: 0, page: params.page, limit: params.limit } };
}

export async function createPromo(payload: Partial<PromoInput>): Promise<Promo> {
	const response = await apiClient.post<ApiSuccess<Promo>>("/admin/promos", payload);
	return response.data.data;
}

export async function updatePromo(id: string, payload: Partial<PromoInput>): Promise<Promo> {
	const response = await apiClient.put<ApiSuccess<Promo>>(`/admin/promos/${id}`, payload);
	return response.data.data;
}

export async function deletePromo(id: string): Promise<void> {
	await apiClient.delete(`/admin/promos/${id}`);
}
