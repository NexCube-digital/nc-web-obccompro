import apiClient from "../../../services/api";

interface ApiSuccess<T> {
	data: T;
}

export interface DashboardSummary {
	kpi: {
		totalBookings: number;
		monthBookings: number;
		totalRevenue: number;
		monthRevenue: number;
		revenueTrend: { month: string; revenue: number }[];
		activeCustomers: number;
		totalResources: number;
	};
	sportDistribution: { sport: string; count: number }[];
	recentBookings: {
		id: string;
		status: string;
		sportType: string;
		totalPrice: number;
		createdAt: string;
		customer: { name: string };
		resource: { name: string };
	}[];
}

export interface ComproDashboardSummary {
	kpi: {
		totalInvoices: number;
		totalInvoiceAmount: number;
		paidInvoiceAmount: number;
		pendingInvoiceAmount: number;
		totalIncome: number;
		totalExpense: number;
		netCash: number;
		invoiceRevenueTrend: { month: string; revenue: number }[];
		totalContacts: number;
		totalPortfolios: number;
	};
	recentContacts: {
		id: string;
		name: string;
		company: string | null;
		email: string;
		status: string;
		createdAt: string;
	}[];
}

export interface CmsPage {
	id: string;
	title: string;
	status: string;
}

export interface CmsSection {
	id: string;
	title: string;
	status: string;
}

export interface CustomerList {
	items: { id: string; name: string; status: string }[];
	pagination: { total: number };
}

export const dashboardService = {
	async getSummary() {
		const response = await apiClient.get<ApiSuccess<DashboardSummary>>("/admin/dashboard/summary");
		return response.data.data;
	},

	async getComproSummary() {
		const response = await apiClient.get<ApiSuccess<ComproDashboardSummary>>("/admin/dashboard/compro-summary");
		return response.data.data;
	},

	async getCmsPages() {
		const response = await apiClient.get<ApiSuccess<CmsPage[]>>("/admin/cms/pages");
		return response.data.data;
	},

	async getCmsSections() {
		const response = await apiClient.get<ApiSuccess<CmsSection[]>>("/admin/cms/sections");
		return response.data.data;
	},

	async getMedia() {
		const response = await apiClient.get<ApiSuccess<unknown[]>>("/admin/media");
		return response.data.data;
	},

	async getCustomers() {
		const response = await apiClient.get<ApiSuccess<CustomerList>>("/admin/customers?limit=1");
		return response.data.data;
	},

	async updateCustomerStatus(id: string, status: "active" | "inactive" | "suspended") {
		const response = await apiClient.patch<ApiSuccess<{ id: string; name: string; status: string }>>(
			`/admin/customers/${id}/status`,
			{ status },
		);
		return response.data.data;
	},
};
