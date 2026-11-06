import { useMemo, useState } from "react";
import { Eye, Pencil, Search, Trash2, WalletCards } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { Invoice, InvoiceStatus } from "./invoiceService";

const PAGE_SIZE = 8;
type StatusFilter = "all" | "draft" | "pending" | "success" | "failed";

const statusClasses: Record<Exclude<StatusFilter, "all">, string> = {
	draft: "!bg-[#F1EFE8] !text-[#404F14]",
	pending: "!bg-[#FBF0D3] !text-[#8A6100]",
	success: "!bg-[#E7F5D0] !text-[#1F3320]",
	failed: "!bg-[#FDF2F2] !text-[#B42318]",
};

const displayStatus = (status: InvoiceStatus): Exclude<StatusFilter, "all"> => {
	if (status === "draft") return "draft";
	if (status === "paid") return "success";
	if (status === "cancelled" || status === "expired") return "failed";
	return "pending";
};

const statusLabel: Record<Exclude<StatusFilter, "all">, string> = {
	draft: "Draft",
	pending: "Pending",
	success: "Success",
	failed: "Gagal",
};

const editableStatus: Record<Exclude<StatusFilter, "all">, InvoiceStatus> = {
	draft: "draft",
	pending: "sent",
	success: "paid",
	failed: "cancelled",
};

const rupiah = (value: number) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
}).format(value);

const formatDate = (value: string | null) => value
	? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
	: "-";

interface InvoiceTableProps {
	invoices: Invoice[];
	loading: boolean;
	counts: Record<InvoiceStatus, number>;
	onView: (invoice: Invoice) => void;
	onEdit: (invoice: Invoice) => void;
	onRecordPayment: (invoice: Invoice) => void;
	onDelete: (invoice: Invoice) => void;
	onChangeStatus: (invoice: Invoice, status: InvoiceStatus) => void;
}

export default function InvoiceTable({ invoices, loading, counts, onView, onEdit, onRecordPayment, onDelete, onChangeStatus }: InvoiceTableProps) {
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [page, setPage] = useState(1);
	const filtered = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return invoices.filter((invoice) => {
			const matchesStatus = statusFilter === "all" || displayStatus(invoice.status) === statusFilter;
			const searchText = [invoice.invoiceNumber, invoice.clientName, invoice.clientEmail, invoice.phone, invoice.service]
				.filter(Boolean).join(" ").toLowerCase();
			return matchesStatus && searchText.includes(normalizedQuery);
		});
	}, [invoices, query, statusFilter]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border p-4 sm:p-5">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar invoice</h2><p className="mt-0.5 text-[12px] text-obc-muted">{filtered.length.toLocaleString("id-ID")} invoice sesuai pencarian dan status</p></div>
					<label className="relative block w-full sm:max-w-70">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari nomor, klien, layanan..." className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]" />
					</label>
				</div>
				<div role="tablist" aria-label="Filter status invoice" className="mt-4 flex gap-1 overflow-x-auto pb-0.5">
					{(["all", "draft", "pending", "success", "failed"] as StatusFilter[]).map((status) => (
						<button key={status} type="button" role="tab" aria-selected={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(1); }} className={`shrink-0 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors ${statusFilter === status ? "border-obc-green bg-[#F3F8E8] text-obc-green" : "border-transparent text-obc-muted hover:border-obc-border hover:bg-[#FDFCF7]"}`}>
							{status === "all" ? "Semua" : statusLabel[status]} <span className="ml-1 opacity-70">{status === "all" ? invoices.length : status === "draft" ? counts.draft : status === "pending" ? counts.sent + counts.overdue + counts.partial : status === "success" ? counts.paid : counts.cancelled + counts.expired}</span>
						</button>
					))}
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-180 text-left">
					<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
						<th className="px-5 py-3.5">Invoice</th><th className="px-5 py-3.5">Klien</th><th className="px-5 py-3.5">Nominal</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Aksi</th>
					</tr></thead>
					<tbody className="text-[13px]">
						{loading ? (
							<tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat invoice...</td></tr>
						) : rows.length ? rows.map((invoice) => {
							return (
								<tr key={invoice.id} className="border-t border-obc-border transition-colors hover:bg-[#FDFCF7]">
									<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{invoice.invoiceNumber}</p><p className="text-[11px] text-obc-muted">Dibuat {formatDate(invoice.createdAt)}</p></td>
									<td className="px-5 py-3.5"><p className="font-medium">{invoice.clientName}</p><p className="text-[11px] text-obc-muted">{invoice.phone || "-"}</p></td>
									<td className="whitespace-nowrap px-5 py-3.5 font-semibold">{rupiah(invoice.amount)}</td>
									<td className="px-5 py-3.5"><ThemedSelect label={`Status invoice ${invoice.invoiceNumber}`} value={editableStatus[displayStatus(invoice.status)]} options={[{ value: "draft", label: "Draft" }, { value: "sent", label: "Pending" }, { value: "paid", label: "Success" }, { value: "cancelled", label: "Gagal" }]} onValueChange={(value) => onChangeStatus(invoice, value as InvoiceStatus)} className={`h-8 w-fit max-w-40 rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${statusClasses[displayStatus(invoice.status)]}`} /></td>
									<td className="px-5 py-3.5"><div className="flex justify-end gap-1"><button type="button" onClick={() => onView(invoice)} className="grid size-9 place-items-center rounded-lg hover:bg-[#F1EFE8]" title="Lihat detail" aria-label={`Lihat ${invoice.invoiceNumber}`}><Eye size={16} /></button><button type="button" onClick={() => onEdit(invoice)} className="grid size-9 place-items-center rounded-lg hover:bg-[#F1EFE8]" title="Edit" aria-label={`Edit ${invoice.invoiceNumber}`}><Pencil size={16} /></button>{invoice.terms.length > 0 && <button type="button" onClick={() => onRecordPayment(invoice)} className="grid size-9 place-items-center rounded-lg hover:bg-[#F1EFE8]" title="Catat pembayaran" aria-label={`Bayar ${invoice.invoiceNumber}`}><WalletCards size={16} /></button>}<button type="button" onClick={() => onDelete(invoice)} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50" title="Hapus" aria-label={`Hapus ${invoice.invoiceNumber}`}><Trash2 size={16} /></button></div></td>
								</tr>
							);
						}) : (
							<tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Tidak ada invoice yang cocok.</td></tr>
						)}
					</tbody>
				</table>
			</div>

			<Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} itemLabel="invoice" className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5" />
		</section>
	);
}
