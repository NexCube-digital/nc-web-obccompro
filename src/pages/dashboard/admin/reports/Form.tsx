import { useState, type FormEvent } from "react";
import { Check, FileText, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { reportService, REPORT_TYPE_LABELS, type FinanceReportPeriod, type ReportRecord, type ReportType } from "./reportService";

type Props = {
	onGenerated: (report: ReportRecord) => void;
};

const REPORT_TYPES: { type: ReportType; icon: typeof Receipt; description: string }[] = [
	{ type: "invoices", icon: Receipt, description: "Invoice, nilai tagihan, dan status pembayaran" },
	{ type: "finance", icon: Wallet, description: "Pemasukan tercatat berdasarkan periode" },
];

function localDateValue() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");
	return { day: `${year}-${month}-${day}`, month: `${year}-${month}`, year: String(year) };
}

export default function ReportForm({ onGenerated }: Props) {
	const [type, setType] = useState<ReportType>("invoices");
	const [period, setPeriod] = useState<FinanceReportPeriod>("day");
	const [periodValue, setPeriodValue] = useState(() => localDateValue().day);
	const [generating, setGenerating] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setGenerating(true);
		try {
			const report = await reportService.generateReport(type, type === "finance" ? { period, value: periodValue } : undefined);
			onGenerated(report);
			toast.success(`${REPORT_TYPE_LABELS[type]} berhasil dibuat.`);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setGenerating(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
			<div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><FileText size={18} /></span><div><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Buat laporan</h2><p className="text-[12px] text-obc-muted">Pilih format laporan yang ingin dibuat.</p></div></div>
			<div className="p-4 sm:p-5">
			<div role="radiogroup" aria-label="Jenis laporan" className="grid gap-3 sm:grid-cols-2">
				{REPORT_TYPES.map(({ type: reportType, icon: Icon, description }) => {
					const selected = type === reportType;
					return <button key={reportType} type="button" role="radio" aria-checked={selected} onClick={() => setType(reportType)} className={`group flex min-h-24 w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors ${selected ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-white hover:border-obc-green hover:bg-[#FDFCF7]"}`}>
						<span className={`grid size-11 shrink-0 place-items-center rounded-lg ${selected ? "bg-obc-green text-white" : "bg-obc-ivory text-obc-muted group-hover:text-obc-green"}`}><Icon size={19} /></span>
						<span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold text-obc-charcoal">{REPORT_TYPE_LABELS[reportType]}</span><span className="mt-1 block text-[12px] leading-4 text-obc-muted">{description}</span></span>
						<span className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-obc-green bg-obc-green text-white" : "border-obc-border text-transparent"}`}><Check size={12} strokeWidth={3} /></span>
					</button>;
				})}
			</div>
			{type === "finance" && <div className="mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-4">
				<div className="mb-3"><p className="text-[13px] font-semibold text-obc-charcoal">Periode pemasukan</p><p className="mt-0.5 text-[11px] text-obc-muted">Tentukan rentang waktu laporan.</p></div>
				<div className="grid gap-3 sm:grid-cols-2">
				<label className="block text-[12px] font-medium text-obc-charcoal">Periode
					<select value={period} onChange={(event) => {
						const nextPeriod = event.target.value as FinanceReportPeriod;
						setPeriod(nextPeriod);
						setPeriodValue(localDateValue()[nextPeriod]);
					}} className="mt-1 h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive">
						<option value="day">Per hari</option><option value="month">Per bulan</option><option value="year">Per tahun</option>
					</select>
				</label>
				<label className="block text-[12px] font-medium text-obc-charcoal">{period === "day" ? "Tanggal" : period === "month" ? "Bulan" : "Tahun"}
					<input required type={period === "day" ? "date" : period === "month" ? "month" : "number"} min={period === "year" ? 2000 : undefined} max={period === "year" ? 9999 : undefined} value={periodValue} onChange={(event) => setPeriodValue(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive" />
				</label>
				</div>
			</div>}
			<div className="mt-4 flex justify-end"><button type="submit" disabled={generating} className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:opacity-60"><FileText size={15} />{generating ? "Membuat laporan..." : `Generate ${REPORT_TYPE_LABELS[type].toLowerCase()}`}</button></div>
			</div>
		</form>
	);
}
