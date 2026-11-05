import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { FinanceReportPeriod, ReportPeriod, ReportRecord } from "./reportService";

export interface FinanceReportSnapshot {
	period: ReportPeriod;
	periodValue: string;
	range: { from: string; to: string };
	summary: { totalIncome: number; count: number };
	transactions: {
		id: string;
		division: string;
		category: string | null;
		description: string | null;
		amount: number;
		date: string;
		status: string;
	}[];
}

export interface InvoiceReportSnapshot {
	period?: ReportPeriod;
	periodValue?: string;
	range?: { from: string; to: string };
	summary: { totalAmount: number; paidAmount: number; count: number };
	rows: {
		invoiceNumber: string;
		clientName: string;
		service: string;
		amount: number;
		status: string;
		issueDate: string;
		dueDate: string;
	}[];
}

const periodLabels: Record<ReportPeriod, string> = { day: "Harian", month: "Bulanan", year: "Tahunan", range: "Rentang tanggal" };
const rupiah = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

function isPeriod(value: unknown): value is ReportPeriod {
	return value === "day" || value === "month" || value === "year" || value === "range";
}

export function getFinanceReportSnapshot(data: unknown, parameters?: unknown): FinanceReportSnapshot | null {
	if (Array.isArray(data)) {
		const transactions = data.filter((item) => item && typeof item === "object" && (item as { type?: string }).type === "income") as FinanceReportSnapshot["transactions"];
		const dates = transactions.map((item) => item.date.slice(0, 10)).sort();
		return {
			period: "year",
			periodValue: dates.length ? `${dates[0]} - ${dates.at(-1)}` : "Semua periode",
			range: { from: dates[0] ?? "-", to: dates.at(-1) ?? "-" },
			summary: { totalIncome: transactions.reduce((total, item) => total + item.amount, 0), count: transactions.length },
			transactions,
		};
	}
	if (!data || typeof data !== "object") return null;
	const candidate = data as Partial<FinanceReportSnapshot>;
	if (!candidate.summary || !Array.isArray(candidate.transactions) || !candidate.range) return null;
	const params = parameters && typeof parameters === "object" ? parameters as { period?: unknown; value?: unknown } : {};
	const period = isPeriod(candidate.period) ? candidate.period : isPeriod(params.period) ? params.period : "year";
	const transactions = candidate.transactions.filter((item) => item && (item as { type?: string }).type === "income");
	return {
		period,
		periodValue: typeof candidate.periodValue === "string" ? candidate.periodValue : typeof params.value === "string" ? params.value : "Semua periode",
		range: candidate.range,
		summary: {
			totalIncome: Number(candidate.summary.totalIncome ?? transactions.reduce((total, item) => total + item.amount, 0)),
			count: transactions.length,
		},
		transactions,
	};
}


export function getInvoiceReportSnapshot(data: unknown, parameters?: unknown): InvoiceReportSnapshot | null {
	const candidate = Array.isArray(data) ? null : data && typeof data === "object" ? data as Record<string, unknown> : null;
	const invoices = Array.isArray(data) ? data : candidate?.invoices;
	if (!Array.isArray(invoices)) return null;
	const rows = invoices.map((item) => {
		const invoice = item as Record<string, unknown>;
		return {
			invoiceNumber: String(invoice.invoiceNumber ?? invoice.id ?? "-"),
			clientName: String(invoice.clientName ?? "-"),
			service: String(invoice.service ?? invoice.description ?? "-"),
			amount: Number(invoice.amount ?? 0),
			status: String(invoice.status ?? "-"),
			issueDate: invoice.issueDate ? String(invoice.issueDate).slice(0, 10) : String(invoice.createdAt ?? "").slice(0, 10),
			dueDate: invoice.dueDate ? String(invoice.dueDate).slice(0, 10) : "-",
		};
	});
	const params = parameters && typeof parameters === "object" ? parameters as { period?: unknown; value?: unknown } : {};
	const summary = candidate?.summary && typeof candidate.summary === "object" ? candidate.summary as Record<string, unknown> : {};
	return {
		period: isPeriod(candidate?.period) ? candidate.period : isPeriod(params.period) ? params.period : undefined,
		periodValue: typeof candidate?.periodValue === "string" ? candidate.periodValue : typeof params.value === "string" ? params.value : undefined,
		range: candidate?.range && typeof candidate.range === "object" ? candidate.range as { from: string; to: string } : undefined,
		summary: {
			totalAmount: Number(summary.totalAmount ?? rows.reduce((total, item) => total + item.amount, 0)),
			paidAmount: Number(summary.paidAmount ?? rows.filter((item) => item.status.toLowerCase() === "paid").reduce((total, item) => total + item.amount, 0)),
			count: Number(summary.count ?? rows.length),
		},
		rows,
	};
}

function fileName(report: ReportRecord, extension: "pdf" | "xlsx") {
	const name = report.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	return `${name || "laporan-obc"}.${extension}`;
}

function saveWorkbook(report: ReportRecord, summaryRows: (string | number)[][], detailRows: (string | number)[][], widths: number[]) {
	const workbook = XLSX.utils.book_new();
	const summarySheet = XLSX.utils.aoa_to_sheet([[report.title], ...summaryRows]);
	const detailSheet = XLSX.utils.aoa_to_sheet(detailRows);
	summarySheet["!cols"] = [{ wch: 26 }, { wch: 42 }];
	detailSheet["!cols"] = widths.map((wch) => ({ wch }));
	if (detailRows.length > 1) detailSheet["!autofilter"] = { ref: `A1:${XLSX.utils.encode_col(detailRows[0].length - 1)}${detailRows.length}` };
	XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");
	XLSX.utils.book_append_sheet(workbook, detailSheet, "Rincian");
	XLSX.writeFile(workbook, fileName(report, "xlsx"));
}

export function downloadFinanceReportExcel(report: ReportRecord, snapshot: FinanceReportSnapshot) {
	saveWorkbook(report, [
		["Periode", snapshot.period === "range" ? `${snapshot.range.from} - ${snapshot.range.to}` : `${periodLabels[snapshot.period]} ${snapshot.periodValue}`],
		["Rentang tanggal", `${snapshot.range.from} - ${snapshot.range.to}`],
		["Total pemasukan", snapshot.summary.totalIncome],
		["Jumlah transaksi", snapshot.summary.count],
	], [
		["Tanggal", "Kategori", "Keterangan", "Divisi", "Nominal", "Status"],
		...snapshot.transactions.map((item) => [item.date.slice(0, 10), item.category ?? "", item.description ?? "", item.division, item.amount, item.status]),
	], [14, 24, 42, 18, 18, 16]);
}

export function downloadInvoiceReportExcel(report: ReportRecord, snapshot: InvoiceReportSnapshot) {
	const total = snapshot.rows.reduce((sum, item) => sum + item.amount, 0);
	const paid = snapshot.rows.filter((item) => item.status.toLowerCase() === "paid").reduce((sum, item) => sum + item.amount, 0);
	saveWorkbook(report, [
		["Rentang tanggal", snapshot.range ? `${snapshot.range.from} - ${snapshot.range.to}` : "-"],
		["Jumlah invoice", snapshot.rows.length],
		["Total nominal", total],
		["Total lunas", paid],
	], [
		["Nomor invoice", "Klien", "Layanan", "Tanggal terbit", "Jatuh tempo", "Status", "Nominal"],
		...snapshot.rows.map((item) => [item.invoiceNumber, item.clientName, item.service, item.issueDate, item.dueDate, item.status, item.amount]),
	], [22, 28, 36, 16, 16, 16, 18]);
}

interface PdfColumn {
	label: string;
	weight: number;
	align?: "left" | "right";
}

function createStyledPdf(report: ReportRecord, subtitle: string, cards: [string, string][], columns: PdfColumn[], rows: string[][]) {
	const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();
	const margin = 14;
	const contentWidth = pageWidth - margin * 2;
	const weightTotal = columns.reduce((total, column) => total + column.weight, 0);
	const columnWidths = columns.map((column) => contentWidth * column.weight / weightTotal);
	let cursorY = 0;

	const drawTableHeader = (y: number) => {
		pdf.setFillColor(31, 51, 32);
		pdf.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, "F");
		let x = margin + 3;
		pdf.setFont("helvetica", "bold");
		pdf.setFontSize(7.5);
		pdf.setTextColor(255, 255, 255);
		columns.forEach((column, index) => {
			pdf.text(column.label, x, y + 5.8, { align: column.align ?? "left", maxWidth: columnWidths[index] - 4 });
			x += columnWidths[index];
		});
		return y + 9;
	};

	const drawPageHeading = (firstPage: boolean) => {
		pdf.setFillColor(31, 51, 32);
		pdf.rect(0, 0, pageWidth, 14, "F");
		pdf.setFillColor(205, 241, 120);
		pdf.rect(0, 14, pageWidth, 1.2, "F");
		pdf.setFont("helvetica", "bold");
		pdf.setTextColor(255, 255, 255);
		pdf.setFontSize(8);
		pdf.text("OBC GROUP  /  LAPORAN ADMIN", margin, 9);
		pdf.setTextColor(38, 45, 37);
		pdf.setFontSize(firstPage ? 17 : 12);
		pdf.text(firstPage ? report.title : `${report.title} (lanjutan)`, margin, firstPage ? 27 : 26, { maxWidth: contentWidth });
		pdf.setFont("helvetica", "normal");
		pdf.setFontSize(8);
		pdf.setTextColor(102, 110, 101);
		pdf.text(`${subtitle}  |  Dibuat ${new Date(report.createdAt).toLocaleString("id-ID")}`, margin, firstPage ? 34 : 32, { maxWidth: contentWidth });

		if (firstPage) {
			const gap = 3;
			const cardWidth = (contentWidth - gap * (cards.length - 1)) / cards.length;
			cards.forEach(([label, value], index) => {
				const x = margin + index * (cardWidth + gap);
				pdf.setFillColor(index === 0 ? 243 : 248, index === 0 ? 248 : 249, index === 0 ? 233 : 245);
				pdf.roundedRect(x, 42, cardWidth, 19, 2, 2, "F");
				pdf.setFont("helvetica", "normal");
				pdf.setFontSize(7);
				pdf.setTextColor(102, 110, 101);
				pdf.text(label, x + 3, 48);
				pdf.setFont("helvetica", "bold");
				pdf.setFontSize(9);
				pdf.setTextColor(31, 51, 32);
				pdf.text(value, x + 3, 55, { maxWidth: cardWidth - 6 });
			});
			return drawTableHeader(68);
		}
		return drawTableHeader(39);
	};

	cursorY = drawPageHeading(true);
	rows.forEach((row, rowIndex) => {
		const textRows = row.map((value, index) => pdf.splitTextToSize(value || "-", Math.max(12, columnWidths[index] - 5)) as string[]);
		const rowHeight = Math.max(9, ...textRows.map((lines) => lines.length * 3.6 + 4));
		if (cursorY + rowHeight > pageHeight - 15) {
			pdf.addPage();
			cursorY = drawPageHeading(false);
		}
		pdf.setFillColor(rowIndex % 2 === 0 ? 248 : 255, rowIndex % 2 === 0 ? 249 : 255, rowIndex % 2 === 0 ? 245 : 255);
		pdf.rect(margin, cursorY, contentWidth, rowHeight, "F");
		pdf.setDrawColor(229, 232, 224);
		pdf.line(margin, cursorY + rowHeight, pageWidth - margin, cursorY + rowHeight);
		let x = margin + 3;
		textRows.forEach((lines, index) => {
			pdf.setFont("helvetica", index === row.length - 1 ? "bold" : "normal");
			pdf.setFontSize(7.5);
			pdf.setTextColor(48, 54, 46);
			const align = columns[index].align ?? "left";
			const textX = align === "right" ? x + columnWidths[index] - 5 : x;
			pdf.text(lines, textX, cursorY + 5.5, { align, lineHeightFactor: 1.15 });
			x += columnWidths[index];
		});
		cursorY += rowHeight;
	});

	const pageCount = pdf.getNumberOfPages();
	for (let page = 1; page <= pageCount; page += 1) {
		pdf.setPage(page);
		pdf.setFont("helvetica", "normal");
		pdf.setFontSize(7);
		pdf.setTextColor(102, 110, 101);
		pdf.text("Laporan internal OBC Group", margin, pageHeight - 6);
		pdf.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: "right" });
	}
	pdf.save(fileName(report, "pdf"));
}

export function downloadFinanceReportPdf(report: ReportRecord, snapshot: FinanceReportSnapshot) {
	const periodDescription = snapshot.period === "range" ? `${snapshot.range.from} - ${snapshot.range.to}` : `${periodLabels[snapshot.period]} ${snapshot.periodValue}`;
	createStyledPdf(report, `${periodDescription}  |  ${snapshot.range.from} - ${snapshot.range.to}`, [
		["Total pemasukan", rupiah(snapshot.summary.totalIncome)],
		["Jumlah transaksi", snapshot.summary.count.toLocaleString("id-ID")],
	], [
		{ label: "Tanggal", weight: 1.1 },
		{ label: "Kategori / keterangan", weight: 2.4 },
		{ label: "Divisi", weight: 1.1 },
		{ label: "Status", weight: 1 },
		{ label: "Nominal", weight: 1.4, align: "right" },
	], snapshot.transactions.map((item) => [item.date.slice(0, 10), item.category || item.description || "-", item.division, item.status, rupiah(item.amount)]));
}

export function downloadInvoiceReportPdf(report: ReportRecord, snapshot: InvoiceReportSnapshot) {
	const total = snapshot.rows.reduce((sum, item) => sum + item.amount, 0);
	const paid = snapshot.rows.filter((item) => item.status.toLowerCase() === "paid").reduce((sum, item) => sum + item.amount, 0);
	const rangeDescription = snapshot.range ? `${snapshot.range.from} - ${snapshot.range.to}` : "Semua periode";
	createStyledPdf(report, `Rentang ${rangeDescription}  |  Dokumen administrasi OBC Group`, [
		["Jumlah invoice", snapshot.rows.length.toLocaleString("id-ID")],
		["Total nominal", rupiah(total)],
		["Total lunas", rupiah(paid)],
	], [
		{ label: "No. invoice", weight: 1.2 },
		{ label: "Klien", weight: 1.45 },
		{ label: "Layanan", weight: 1.7 },
		{ label: "Terbit", weight: 0.9 },
		{ label: "Jatuh tempo", weight: 1 },
		{ label: "Status", weight: 0.8 },
		{ label: "Nominal", weight: 1.2, align: "right" },
	], snapshot.rows.map((item) => [item.invoiceNumber, item.clientName, item.service, item.issueDate, item.dueDate, item.status, rupiah(item.amount)]));
}
