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

export type AdminBookingCustomer = { id: string; name: string; email: string; phone: string | null };

export type AdminFullDayBookingResult = {
	bookingId: string;
	bookingIds: string[];
	status: string;
	resource: { id: string; name: string };
	bookingDate: string;
	startTime: string;
	endTime: string;
	customer: AdminBookingCustomer | null;
	guest: { name: string; email: string | null; phone: string | null } | null;
	message: string;
};

export type ActiveStatus = "active" | "inactive";
export type StatusUpdate<T extends string> = { id: string; status: T };
export type PageMeta = { page: number; limit: number; total: number; totalPages: number };
export type Paginated<T> = { data: T[]; meta: PageMeta };

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
	guest: { name: string; email: string | null; phone: string | null } | null;
	staffCreator: { id: string; name: string; email: string; phone: string | null } | null;
	latestPayment: { status: string; method: string | null; paidAt: string | null } | null;
};

export type SportBookingDetails = {
	id: string;
	tenant: { id: string; name: string; slug: string };
	resource: {
		id: string;
		name: string;
		slug: string;
		resourceType: string;
		slotMinutes: number;
		location: { id: string; name: string; city: string } | null;
	};
	bookingDate: string;
	startTime: string;
	endTime: string;
	startMinute: number;
	endMinute: number;
	durationMinutes: number;
	sportType: SportType;
	bookingType: "regular" | "membership" | "event";
	status: BookingStatus;
	basePrice: number;
	discountAmount: number;
	adminFee: number;
	totalPrice: number;
	totalPriceFormatted: string;
	refundedAmount: number;
	refundedAmountFormatted: string;
	priceSnapshot: unknown;
	notes: string | null;
	cancellationReason: string | null;
	source: string;
	paidAt: string | null;
	cancelledAt: string | null;
	completedAt: string | null;
	createdAt: string;
	updatedAt: string;
	customer: { id: string; name: string; email: string; phone: string | null; status: string } | null;
	guest: { name: string; email: string | null; phone: string | null } | null;
	staffCreator: { id: string; name: string; email: string; role: string } | null;
	payments: {
		id: string;
		midtransOrderId: string | null;
		midtransTransactionId: string | null;
		paymentType: string;
		method: string | null;
		amount: number;
		amountFormatted: string;
		adminFee: number;
		totalAmount: number;
		totalAmountFormatted: string;
		refundedAmount: number;
		refundedAmountFormatted: string;
		status: string;
		paidAt: string | null;
		expiredAt: string | null;
		createdAt: string;
	}[];
	slotClaim: { id: string; startMinute: number; endMinute: number; lockId: string | null } | null;
	activeLock: { id: string; lockStatus: string; lockedUntil: string } | null;
	membershipSession: { id: string; sessionNumber: number; status: string } | null;
};

export type SportResource = {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	imageUrl: string | null;
	resourceType: "court" | "hall" | "field" | "room";
	sportTypes: SportType[];
	capacity: number;
	slotMinutes: number;
	amenities: string[];
	status: "active" | "maintenance" | "inactive";
	tenant: { id: string; name: string; slug: string };
	location: { id: string; name: string; city: string } | null;
	schedules: { dayOfWeek: string; openTime: string; closeTime: string; isClosed: boolean }[];
};

export type ResourceAvailability = {
	resourceId: string;
	resourceName: string;
	date: string;
	parallelUnits: number;
	dayOfWeek: string;
	slotMinutes: number;
	startIntervalMinutes: number;
	isClosed: boolean;
	operatingHours: { openTime: string; closeTime: string } | null;
	slots: {
		startTime: string;
		endTime: string;
		status: "available" | "booked" | "locked" | "maintenance" | "closed";
		available: boolean;
		price: number | null;
		priceFormatted?: string | null;
		lockExpiresAt: string | null;
	}[];
	counts: { total: number; available: number; booked: number; locked: number };
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
	status: ActiveStatus;
	resource: { id: string; name: string; slug: string } | null;
};

export type PricingRuleUpdateInput = {
	dayType: PricingRule["dayType"];
	tierStart: string;
	tierEnd: string;
	pricePerHour: number;
	minBookingPrice?: number;
	minDurationMinutes?: number;
	priority: number;
};

export type PricingPackageUpdateInput = {
	name: string;
	description: string;
	sportType?: SportType;
	durationMinutes: number;
	packagePrice: number;
	discountPercent?: number;
};

export type MembershipPackage = {
	id: string;
	name: string;
	nameEn: string | null;
	description: string | null;
	descriptionEn: string | null;
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

export type MembershipPackageUpdateInput = {
	name: string;
	nameEn?: string;
	description: string;
	descriptionEn?: string;
	sportType: SportType;
	totalSessions: number;
	validityDays: number;
	originalPrice: number;
	memberPrice: number;
	discountPercent: number;
};

export type SportResourceInput = {
	name: string;
	slug: string;
	description: string | null;
	imageUrl: string | null;
	resourceType: SportResource["resourceType"];
	sportTypes: SportType[];
	capacity: number;
	amenities: string[];
	slotMinutes: number;
	locationId?: string;
	status: SportResource["status"];
};