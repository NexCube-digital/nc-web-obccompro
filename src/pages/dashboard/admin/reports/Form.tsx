import { useState, type FormEvent } from "react";
import { FileText, Receipt, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { reportService, REPORT_TYPE_LABELS, type ReportRecord, type ReportType } from "./reportService";

type Props = {
	onGenerated: (report: ReportRecord) => void;
};

const REPORT_TYPES: { type: ReportType; icon: typeof Receipt; description: string }[] = [
	{ type: "invoices", icon: Receipt, description: "Data invoice dan termin pembayaran" },
	{ type: "finance", icon: Wallet, description: "Catatan pemasukan dan pengeluaran" },
	{ type: "clients", icon: Users, description: "Data klien beserta invoice" },
];

export default function ReportForm({ onGenerated }: Props) {
	const [type, setType] = useState<ReportType>("invoices");
	const [generating, setGenerating] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setGenerating(true);
		try {
			const report = await reportService.generateReport(type);
			onGenerated(report);
			toast.success(`${REPORT_TYPE_LABELS[type]} berhasil dibuat.`);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setGenerating(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><FileText size={18} /></span><div><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Buat laporan baru</h2><p className="text-[12px] text-obc-muted">Pilih sumber data untuk membuat snapshot laporan.</p></div></div>
			<div role="radiogroup" aria-label="Jenis laporan" className="grid gap-2 sm:grid-cols-3">
				{REPORT_TYPES.map(({ type: reportType, icon: Icon, description }) => <label key={reportType} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${type === reportType ? "border-[#9AAD3E] bg-[#F6F9E9]" : "border-obc-border hover:bg-[#FDFCF7]"}`}>
					<input type="radio" name="reportType" value={reportType} checked={type === reportType} onChange={() => setType(reportType)} className="sr-only" />
					<span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${type === reportType ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-[#F1EFE8] text-obc-muted"}`}><Icon size={16} /></span>
					<span><span className="block text-[13px] font-semibold text-obc-charcoal">{REPORT_TYPE_LABELS[reportType]}</span><span className="mt-0.5 block text-[11px] text-obc-muted">{description}</span></span>
				</label>)}
			</div>
			<div className="mt-4 flex justify-end"><button type="submit" disabled={generating} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{generating ? "Membuat laporan..." : "Generate laporan"}</button></div>
		</form>
	);
}
