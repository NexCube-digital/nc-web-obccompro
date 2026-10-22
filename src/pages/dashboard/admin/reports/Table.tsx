import { Eye } from "lucide-react";
import { REPORT_TYPE_LABELS, type ReportRecord, type ReportType } from "./reportService";

type Props = {
	reports: ReportRecord[];
	loading: boolean;
	onView: (report: ReportRecord) => void;
};

function formatDate(value: string) {
	return new Date(value).toLocaleString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function ReportTable({ reports, loading, onView }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Riwayat laporan</h2><p className="mt-0.5 text-[12px] text-obc-muted">{reports.length.toLocaleString("id-ID")} laporan tersimpan</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Nama laporan</th><th className="px-5 py-3.5">Jenis</th><th className="px-5 py-3.5">Dibuat</th><th className="px-5 py-3.5 text-right">Data</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat riwayat laporan...</td></tr> : reports.length ? reports.map((report) => {
					const rowCount = Array.isArray(report.data) ? report.data.length : report.data ? 1 : 0;
					return <tr key={report.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
						<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{report.title}</p><p className="text-[11px] text-obc-muted">ID {report.id}</p></td>
						<td className="px-5 py-3.5"><span className="rounded-full bg-[#EBEEDC] px-2.5 py-1 text-[11px] font-medium text-[#404F14]">{REPORT_TYPE_LABELS[report.type as ReportType] ?? report.type}</span></td>
						<td className="whitespace-nowrap px-5 py-3.5 text-obc-muted">{formatDate(report.createdAt)}</td>
						<td className="px-5 py-3.5 text-right text-obc-muted">{rowCount.toLocaleString("id-ID")}</td>
						<td className="px-5 py-3.5 text-right"><button type="button" onClick={() => onView(report)} aria-label={`Lihat ${report.title}`} title="Lihat snapshot" className="inline-grid size-9 place-items-center rounded-lg border border-obc-border text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Eye size={16} /></button></td>
					</tr>;
				}) : <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Belum ada laporan. Buat laporan pertama untuk melihat riwayatnya.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
