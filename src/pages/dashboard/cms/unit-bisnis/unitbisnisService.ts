import apiClient from "../../../../services/api";

export interface BusinessUnit {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	tenantType: "sport" | "event" | "fnb" | "other";
	config: Record<string, unknown>;
	status: "active" | "inactive";
	locationCount: number;
	resourceCount: number;
}

export interface BusinessUnitInput {
	name: string;
	slug: string;
	description: string | null;
	tenantType: BusinessUnit["tenantType"];
	config: {
		title?: string;
		category?: string;
		tags?: string[];
		imageUrl?: string;
		locationAddress?: string;
		locationMapUrl?: string;
		locationInfo?: string[];
		[key: string]: unknown;
	};
	status: BusinessUnit["status"];
}

export interface BusinessUnitLocation {
	id: string;
	name: string;
	address: string;
	city: string | null;
	province: string | null;
	postalCode: string | null;
	phone: string | null;
	latitude: number | string | null;
	longitude: number | string | null;
	operatingHours: unknown;
	status: "active" | "inactive";
	createdAt: string;
	updatedAt: string;
}

export interface BusinessUnitResource {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	resourceType: "court" | "hall" | "field" | "room";
	sportTypes: string[];
	capacity: number;
	amenities: unknown;
	slotMinutes: number;
	operatingHours: unknown;
	status: "active" | "maintenance" | "inactive";
	imageUrl: string | null;
	gallery: unknown;
	locationId: string | null;
	createdAt: string;
	updatedAt: string;
	schedules: BusinessUnitResourceSchedule[];
}

export interface BusinessUnitResourceSchedule {
	id: string;
	dayOfWeek: string;
	openMinute: number;
	closeMinute: number;
	isClosed: boolean;
}

export interface BusinessUnitDetail extends Omit<BusinessUnit, "locationCount" | "resourceCount" | "config"> {
	config: unknown;
	locations: BusinessUnitLocation[];
	resources: BusinessUnitResource[];
	createdAt: string;
	updatedAt: string;
}

interface ApiSuccess<T> {
	data: T;
}

export const unitbisnisService = {
	async getUnits(): Promise<BusinessUnit[]> {
		const response = await apiClient.get<ApiSuccess<BusinessUnit[]>>("/admin/tenants");
		return response.data.data;
	},

	async getUnit(slug: string): Promise<BusinessUnitDetail> {
		const response = await apiClient.get<ApiSuccess<BusinessUnitDetail>>(`/public/tenants/${encodeURIComponent(slug)}`);
		return response.data.data;
	},

	async createUnit(input: BusinessUnitInput): Promise<BusinessUnit> {
		const response = await apiClient.post<ApiSuccess<BusinessUnit>>("/admin/tenants", input);
		return response.data.data;
	},

	async updateUnit(id: string, input: Partial<BusinessUnitInput>): Promise<BusinessUnit> {
		const response = await apiClient.put<ApiSuccess<BusinessUnit>>(`/admin/tenants/${encodeURIComponent(id)}`, input);
		return response.data.data;
	},

	async deleteUnit(id: string): Promise<void> {
		await apiClient.delete(`/admin/tenants/${encodeURIComponent(id)}`);
	},
};