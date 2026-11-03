import apiClient from "../../../../services/api";

export type ReportType = "invoices" | "finance";
export type FinanceReportPeriod = "day" | "month" | "year";

export interface FinanceReportParameters {
	period: FinanceReportPeriod;
	value: string;
}

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
	finance: "Pemasukan",
};

export const reportService = {
	async getReports(): Promise<ReportRecord[]> {
		const response = await apiClient.get<ApiSuccess<ReportRecord[]>>("/admin/reports");
		return response.data.data;
	},

	async generateReport(type: ReportType, parameters?: FinanceReportParameters): Promise<ReportRecord> {
		const response = await apiClient.post<ApiSuccess<ReportRecord>>(
			`/admin/reports/generate/${type}`,
			parameters ?? {},
		);
		return response.data.data;
	},
};
