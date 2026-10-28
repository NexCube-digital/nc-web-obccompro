import apiClient from "../../../../services/api";

export type PriceBreakdownItem = {
	name: string;
	price: number;
	quantity: number;
	subtotal: number;
};

export type Invoice = {
	id: string;
	invoiceNumber: string;
	contactId: string | null;
	clientName: string;
	clientEmail: string;
	phone: string | null;
	amount: number;
	status: InvoiceStatus;
	service: string | null;
	description: string | null;
	priceBreakdown: PriceBreakdownItem[] | null;
	issueDate: string | null;
	dueDate: string | null;
	paidAt: string | null;
	createdAt: string;
	terms: PaymentTerm[];
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "expired" | "partial" | "cancelled";

export type InvoiceStatusResult = {
	id: string;
	status: InvoiceStatus;
	paidAt: string | null;
};

export interface AvailabilitySlot {
	startTime: string;
	endTime: string;
	available: boolean;
	price: number | null;
	priceFormatted: string | null;
}

export interface FacilityAvailability {
	resourceId: string;
	resourceName: string;
	date: string;
	slotMinutes: number;
	operatingHours: { openTime: string; closeTime: string } | null;
	slots: AvailabilitySlot[];
}

export interface BookingPricePreview {
	basePrice: number;
	discountAmount: number;
	adminFee: number;
	totalPrice: number;
	durationMinutes: number;
	breakdown: Array<{ tierName: string; minutes: number; subtotal: number }>;
}

export type PaymentLink = {
	token: string;
	redirectUrl: string;
	invoiceNumber: string;
	amount: number;
};

export type PaymentTerm = {
	id: string;
	invoiceId: string;
	termNumber: number;
	amount: number;
	dueDate: string | null;
	paidAt: string | null;
	paymentMethod: string | null;
	notes: string | null;
};

interface ApiSuccess<T> {
	data: T;
}

export const invoiceService = {
	async getFacilityAvailability(resourceId: string, date: string, sportType?: string): Promise<FacilityAvailability> {
		const response = await apiClient.get<ApiSuccess<FacilityAvailability>>("/sports/availability", {
			params: { resourceId, date, ...(sportType ? { sportType } : {}) },
		});
		return response.data.data;
	},

	async previewBookingPrice(payload: {
		resourceId: string;
		bookingDate: string;
		startTime: string;
		endTime: string;
		sportType: string;
	}): Promise<BookingPricePreview> {
		const response = await apiClient.post<ApiSuccess<BookingPricePreview>>("/sports/pricing/calculate", payload);
		return response.data.data;
	},

	async getInvoiceList(): Promise<Invoice[]> {
		const response = await apiClient.get<ApiSuccess<Invoice[]>>("/admin/compro-invoices");
		return response.data.data;
	},

	async getInvoiceById(id: string): Promise<Invoice> {
		const response = await apiClient.get<ApiSuccess<Invoice>>(`/admin/compro-invoices/${id}`);
		return response.data.data;
	},

	async getPaymentTerms(id: string): Promise<PaymentTerm[]> {
		const invoice = await this.getInvoiceById(id);
		return invoice.terms;
	},

	async payInvoiceTerm(id: string, payload: { termId?: string; termNumber?: number; paymentMethod?: string; paidAt?: string; notes?: string }): Promise<Invoice> {
		const response = await apiClient.post<ApiSuccess<Invoice>>(`/admin/compro-invoices/${id}/pay-term`, payload);
		return response.data.data;
	},

	async createInvoice(payload: {
		invoiceNumber: string;
		contactId?: string | null;
		clientName: string;
		clientEmail: string;
		phone?: string | null;
		amount: number;
		status?: InvoiceStatus;
		service?: string | null;
		description?: string | null;
		priceBreakdown?: PriceBreakdownItem[] | null;
		issueDate?: string | null;
		dueDate?: string | null;
	}): Promise<Invoice> {
		const response = await apiClient.post<ApiSuccess<Invoice>>("/admin/compro-invoices", payload);
		return response.data.data;
	},

	async updateInvoice(id: string, payload: Partial<Pick<Invoice, "clientName" | "clientEmail" | "phone" | "amount" | "status" | "service" | "description" | "priceBreakdown" | "issueDate" | "dueDate" | "paidAt">>): Promise<Invoice> {
		const response = await apiClient.put<ApiSuccess<Invoice>>(`/admin/compro-invoices/${id}`, payload);
		return response.data.data;
	},

	async createPaymentLink(id: string): Promise<PaymentLink> {
		const response = await apiClient.post<ApiSuccess<PaymentLink>>(`/admin/compro-invoices/${id}/payment-link`);
		return response.data.data;
	},

	async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<InvoiceStatusResult> {
		const response = await apiClient.patch<ApiSuccess<InvoiceStatusResult>>(`/admin/compro-invoices/${id}/status`, { status });
		return response.data.data;
	},

	async deleteInvoice(id: string): Promise<void> {
		await apiClient.delete(`/admin/compro-invoices/${id}`);
	},
};
