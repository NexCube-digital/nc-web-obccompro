import apiClient from "../../../services/api";

export type BookingStatus =
	| "unpaid"
	| "dp_paid"
	| "fully_paid"
	| "completed"
	| "cancelled"
	| "expired"
	| "refund_requested"
	| "refunded";

export type SportType =
	| "futsal"
	| "badminton"
	| "basketball"
	| "volleyball"
	| "pickleball"
	| "tennis"
	| "billiard"
	| "swimming"
	| "event"
	| "other";

export type ActiveStatus = "active" | "inactive";
export type StatusUpdate<T extends string> = { id: string; status: T };

export type PageMeta = { page: number; limit: number; total: number; totalPages: number };
export type Paginated<T> = { data: T[]; meta: PageMeta };

interface ApiSuccess<T> {
	data: T;
	meta?: PageMeta;
}

export type SportBooking = {
	id: string;
	bookingDate: string;
	startTime: string;
	endTime: string;
	durationMinutes: number;
	sportType: SportType;
	bookingType: "regular" | "membership" | "event";
	status: BookingStatus;
	totalPrice: number;
	totalPriceFormatted: string;
	refundedAmount: number;
	notes: string | null;
	createdAt: string;
	resource: { id: string; name: string; resourceType: string };
	customer: { id: string; name: string; email: string; phone: string | null } | null;
	staffCreator: { id: string; name: string; email: string; phone: string | null } | null;
	latestPayment: { status: string; method: string | null; paidAt: string | null } | null;
};

export type SportResource = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	resourceType: "court" | "hall" | "field" | "room";
	sportTypes: SportType[];
	capacity: number;
	slotMinutes: number;
	status: "active" | "maintenance" | "inactive";
	tenant: { id: string; name: string; slug: string };
	location: { id: string; name: string; city: string } | null;
	schedules: { dayOfWeek: string; openTime: string; closeTime: string; isClosed: boolean }[];
};

export type PricingRule = {
	id: string;
	dayType: "weekday" | "weekend" | "holiday";
	tierStartTime: string;
	tierEndTime: string;
	pricePerHour: number;
	minBookingPrice: number | null;
	minDurationMinutes: number | null;
	priority: number;
	status: ActiveStatus;
	resource: { id: string; name: string; slug: string } | null;
};

export type PricingPackage = {
	id: string;
	name: string;
	description: string | null;
	sportType: SportType | null;
	durationMinutes: number;
	packagePrice: number;
	discountPercent: number | null;
	priority: number;
	status: ActiveStatus;
	resource: { id: string; name: string; slug: string } | null;
};

export type MembershipPackage = {
	id: string;
	name: string;
	description: string | null;
	sportType: SportType;
	resourceId: string | null;
	totalSessions: number;
	validityDays: number;
	originalPrice: number;
	memberPrice: number;
	discountPercent: number;
	status: ActiveStatus;
	createdAt: string;
	resource: { id: string; name: string; slug: string } | null;
};

type ListParams = { page?: number; limit?: number; status?: string; search?: string };

async function getPaginated<T>(url: string, params: ListParams): Promise<Paginated<T>> {
	const response = await apiClient.get<ApiSuccess<T[]>>(url, { params });
	return {
		data: response.data.data,
		meta: response.data.meta ?? { page: params.page ?? 1, limit: params.limit ?? 20, total: response.data.data.length, totalPages: 1 },
	};
}

export const sportService = {
	getBookings(params: ListParams & { status?: BookingStatus }): Promise<Paginated<SportBooking>> {
		return getPaginated("/admin/bookings", params);
	},
	getResources(params: ListParams & { status?: SportResource["status"] }): Promise<Paginated<SportResource>> {
		return getPaginated("/admin/resources", params);
	},
	updateResourceStatus(id: string, status: SportResource["status"]): Promise<StatusUpdate<SportResource["status"]>> {
		return apiClient.put<ApiSuccess<StatusUpdate<SportResource["status"]>>>(`/admin/resources/${id}`, { status }).then((response) => response.data.data);
	},
	getPricingRules(params: ListParams & { status?: ActiveStatus }): Promise<Paginated<PricingRule>> {
		return getPaginated("/admin/pricing/rules", params);
	},
	updatePricingRuleStatus(id: string, status: ActiveStatus): Promise<StatusUpdate<ActiveStatus>> {
		return apiClient.put<ApiSuccess<StatusUpdate<ActiveStatus>>>(`/admin/pricing/rules/${id}`, { status }).then((response) => response.data.data);
	},
	getPricingPackages(params: ListParams & { status?: ActiveStatus }): Promise<Paginated<PricingPackage>> {
		return getPaginated("/admin/pricing/packages", params);
	},
	updatePricingPackageStatus(id: string, status: ActiveStatus): Promise<StatusUpdate<ActiveStatus>> {
		return apiClient.put<ApiSuccess<StatusUpdate<ActiveStatus>>>(`/admin/pricing/packages/${id}`, { status }).then((response) => response.data.data);
	},
	getMembershipPackages(params: ListParams & { status?: ActiveStatus }): Promise<Paginated<MembershipPackage>> {
		return getPaginated("/admin/membership-packages", params);
	},
	updateMembershipPackageStatus(id: string, status: ActiveStatus): Promise<StatusUpdate<ActiveStatus>> {
		return apiClient.put<ApiSuccess<StatusUpdate<ActiveStatus>>>(`/admin/membership-packages/${id}`, { status }).then((response) => response.data.data);
	},
};
