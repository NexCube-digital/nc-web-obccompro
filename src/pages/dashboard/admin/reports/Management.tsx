import { useEffect, useState } from "react";
import { FileText, Receipt, Users, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import ReportForm from "./Form";
import ReportTable from "./Table";
import { reportService, REPORT_TYPE_LABELS, type ReportRecord, type ReportType } from "./reportService";

const typeIcons: Record<ReportType, typeof Receipt> = {
	invoices: Receipt,
	finance: Wallet,
	clients: Users,
};

export default function Management() {
	const [reports, setReports] = useState<ReportRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);

	useEffect(() => {
		let active = true;
		reportService.getReports()
			.then((data) => { if (active) setReports(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, []);

	const handleGenerated = (report: ReportRecord) => {
		setReports((current) => [report, ...current.filter((item) => item.id !== report.id)]);
		setSelectedReport(report);
	};

	const ReportIcon = selectedReport ? typeIcons[selectedReport.type as ReportType] ?? FileText : FileText;

	return (
		<DashboardPageLayout breadcrumb="Laporan" title="Manajemen laporan" description="Generate dan tinjau snapshot laporan invoice, keuangan, serta klien.">
			<div className="mb-4"><ReportForm onGenerated={handleGenerated} /></div>
			<ReportTable reports={reports} loading={loading} onView={setSelectedReport} />

			{selectedReport && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedReport(null); }}>
				<section role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
					<header className="flex items-start justify-between gap-4 border-b border-obc-border p-4 sm:p-5"><div className="flex min-w-0 items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><ReportIcon size={18} /></span><div className="min-w-0"><h2 id="report-dialog-title" className="truncate font-heading text-[16px] font-semibold text-obc-charcoal">{selectedReport.title}</h2><p className="mt-0.5 text-[12px] text-obc-muted">{REPORT_TYPE_LABELS[selectedReport.type as ReportType] ?? selectedReport.type} · {new Date(selectedReport.createdAt).toLocaleString("id-ID")}</p></div></div><button type="button" onClick={() => setSelectedReport(null)} aria-label="Tutup pratinjau" className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></header>
					<div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5"><pre className="overflow-x-auto rounded-lg bg-[#F7F7F2] p-4 text-[11px] leading-relaxed text-obc-charcoal">{JSON.stringify(selectedReport.data, null, 2) ?? "Tidak ada data pada laporan ini."}</pre></div>
				</section>
			</div>}
		</DashboardPageLayout>
	);
}
