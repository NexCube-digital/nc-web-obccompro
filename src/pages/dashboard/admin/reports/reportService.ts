import apiClient from "../../../../services/api";

export type ReportType = "invoices" | "finance" | "clients";

export interface ReportRecord {
	id: string;
	type: string;
	title: string;
	parameters: unknown;
	data: unknown;
	createdBy: string | null;
	createdAt: string;
}

interface ApiSuccess<T> {
	data: T;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
	invoices: "Invoice",
	finance: "Keuangan",
	clients: "Klien",
};

export const reportService = {
	async getReports(): Promise<ReportRecord[]> {
		const response = await apiClient.get<ApiSuccess<ReportRecord[]>>("/admin/reports");
		return response.data.data;
	},

	async generateReport(type: ReportType): Promise<ReportRecord> {
		const response = await apiClient.post<ApiSuccess<ReportRecord>>(
			`/admin/reports/generate/${type}`,
			{},
		);
		return response.data.data;
	},
};
