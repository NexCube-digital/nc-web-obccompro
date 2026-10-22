import apiClient from "../../../../services/api";

export type FinanceType = "income" | "expense";

export interface FinanceRecord {
	id: string;
	division: string;
	type: FinanceType;
	category: string | null;
	description: string | null;
	amount: number;
	date: string;
	invoiceId: string | null;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface FinanceSummary {
	division: string;
	totalIncome: number;
	totalExpense: number;
	netProfit: number;
	count: number;
}

export interface FinanceInput {
	division: string;
	type: FinanceType;
	category?: string | null;
	description?: string | null;
	amount: number;
	date: string;
	status?: string;
}

export interface FinanceFilters {
	division?: string;
	type?: FinanceType;
	category?: string;
	status?: string;
}

interface ApiSuccess<T> {
	data: T;
}

export const financeService = {
	async getFinances(filters: FinanceFilters = {}): Promise<FinanceRecord[]> {
		const response = await apiClient.get<ApiSuccess<FinanceRecord[]>>("/admin/finances", {
			params: filters,
		});
		return response.data.data;
	},

	async getSummary(): Promise<FinanceSummary> {
		const response = await apiClient.get<ApiSuccess<FinanceSummary>>("/admin/finances/summary/all");
		return response.data.data;
	},

	async createFinance(payload: FinanceInput): Promise<FinanceRecord> {
		const response = await apiClient.post<ApiSuccess<FinanceRecord>>("/admin/finances", payload);
		return response.data.data;
	},

	async bulkCreateFinances(items: Omit<FinanceInput, "division">[], division: string): Promise<{ count: number }> {
		const response = await apiClient.post<ApiSuccess<{ count: number }>>("/admin/finances/bulk", {
			items,
			division,
		});
		return response.data.data;
	},
};
