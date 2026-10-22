import apiClient from "../../../../services/api";

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
		issueDate?: string | null;
		dueDate?: string | null;
	}): Promise<Invoice> {
		const response = await apiClient.post<ApiSuccess<Invoice>>("/admin/compro-invoices", payload);
		return response.data.data;
	},

	async updateInvoice(id: string, payload: Partial<Pick<Invoice, "clientName" | "clientEmail" | "phone" | "amount" | "status" | "service" | "description" | "issueDate" | "dueDate" | "paidAt">>): Promise<Invoice> {
		const response = await apiClient.put<ApiSuccess<Invoice>>(`/admin/compro-invoices/${id}`, payload);
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
