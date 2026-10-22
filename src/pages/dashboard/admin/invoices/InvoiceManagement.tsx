import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CircleDollarSign, Clock3, Receipt, Search } from "lucide-react";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { invoiceService, type Invoice, type InvoiceStatus } from "./invoiceService";
import { toast } from "sonner";

const PAGE_SIZE = 8;
const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue", "expired", "partial", "cancelled"];
type StatusFilter = "all" | InvoiceStatus;

const statusLabels: Record<InvoiceStatus, string> = {
	draft: "Draft",
	sent: "Terkirim",
	paid: "Lunas",
	overdue: "Jatuh tempo",
	expired: "Kedaluwarsa",
	partial: "Sebagian dibayar",
	cancelled: "Dibatalkan",
};
const statusClasses: Record<InvoiceStatus, string> = {
	draft: "bg-[#F1EFE8] text-[#404F14]",
	sent: "bg-[#FBF0D3] text-[#8A6100]",
	paid: "bg-[#E7F5D0] text-[#1F3320]",
	overdue: "bg-[#FDF2F2] text-[#B42318]",
	expired: "bg-[#F1EFE8] text-obc-muted",
	partial: "bg-[#EBEEDC] text-[#404F14]",
	cancelled: "bg-[#FDF2F2] text-[#B42318]",
};

const rupiah = (value: number) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
}).format(value);

const formatDate = (value: string | null) => value
	? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
	: "-";

function Summary({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Receipt; tone: string }) {
	return (
		<div className="rounded-xl border border-obc-border bg-white p-4">
			<div className="flex items-center gap-3">
				<span className={`grid size-10 place-items-center rounded-lg ${tone}`}><Icon size={18} /></span>
				<div><p className="text-[12px] text-obc-muted">{label}</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{value}</p></div>
			</div>
		</div>
	);
}

export default function InvoiceManagement() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [page, setPage] = useState(1);

	useEffect(() => {
		let cancelled = false;
		invoiceService.getInvoiceList()
			.then((data) => { if (!cancelled) setInvoices(data); })
			.catch((error: unknown) => {
				if (!cancelled) {
					setInvoices([]);
					toast.error(error instanceof Error ? error.message : "Gagal memuat invoice.");
				}
			})
			.finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, []);

	const counts = useMemo(() => Object.fromEntries(
		statuses.map((status) => [status, invoices.filter((invoice) => invoice.status === status).length]),
	) as Record<InvoiceStatus, number>, [invoices]);
	const totalAmount = invoices.reduce((total, invoice) => total + invoice.amount, 0);
	const paidCount = counts.paid;
	const followUpCount = counts.sent + counts.overdue + counts.partial;

	const filtered = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return invoices.filter((invoice) => {
			const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
			const searchText = [invoice.invoiceNumber, invoice.clientName, invoice.clientEmail, invoice.service]
				.filter(Boolean).join(" ").toLowerCase();
			return matchesStatus && searchText.includes(normalizedQuery);
		});
	}, [invoices, query, statusFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const changeStatus = async (invoice: Invoice, status: InvoiceStatus) => {
		try {
			const updated = await invoiceService.updateInvoiceStatus(invoice.id, status);
			setInvoices((current) => current.map((item) => item.id === updated.id
				? { ...item, status: updated.status, paidAt: updated.paidAt }
				: item));
			toast.success("Status invoice berhasil diperbarui.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status invoice.");
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Invoice" title="Manajemen invoice" description="Pantau tagihan, termin pembayaran, dan status invoice perusahaan.">
			<section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Summary label="Total invoice" value={invoices.length.toLocaleString("id-ID")} icon={Receipt} tone="bg-[#E7F5D0] text-obc-green" />
				<Summary label="Nilai invoice" value={rupiah(totalAmount)} icon={CircleDollarSign} tone="bg-[#CDF178] text-[#404F14]" />
				<Summary label="Invoice lunas" value={paidCount.toLocaleString("id-ID")} icon={BadgeCheck} tone="bg-[#E7F5D0] text-[#1F3320]" />
				<Summary label="Perlu ditindaklanjuti" value={followUpCount.toLocaleString("id-ID")} icon={Clock3} tone="bg-[#FBF0D3] text-[#8A6100]" />
			</section>

			<section className="overflow-hidden rounded-2xl border border-obc-border bg-white">
				<div className="flex flex-col gap-3 border-b border-obc-border p-4 sm:flex-row sm:items-center sm:justify-between">
					<div role="tablist" aria-label="Filter status invoice" className="flex gap-1 overflow-x-auto rounded-xl border border-obc-border bg-[#FDFCF7] p-1">
						{(["all", ...statuses] as StatusFilter[]).map((status) => (
							<button key={status} type="button" role="tab" aria-selected={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(1); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium ${statusFilter === status ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}>
								{status === "all" ? "Semua" : statusLabels[status]} <span className="ml-1">{status === "all" ? invoices.length : counts[status]}</span>
							</button>
						))}
					</div>
					<label className="relative block w-full sm:max-w-70">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari nomor, klien, layanan..." className="h-10 w-full rounded-xl border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]" />
					</label>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-220 text-left">
						<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
							<th className="px-5 py-3.5">Invoice</th><th className="px-5 py-3.5">Klien</th><th className="px-5 py-3.5">Nominal</th><th className="px-5 py-3.5">Termin</th><th className="px-5 py-3.5">Jatuh tempo</th><th className="px-5 py-3.5">Status</th>
						</tr></thead>
						<tbody className="text-[13px]">
							{loading ? (
								<tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Memuat invoice...</td></tr>
							) : rows.length ? rows.map((invoice) => {
								const terms = invoice.terms ?? [];
								const paidTerms = terms.filter((term) => term.paidAt).length;
								return (
									<tr key={invoice.id} className="border-t border-obc-border">
										<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{invoice.invoiceNumber}</p><p className="text-[11px] text-obc-muted">Dibuat {formatDate(invoice.createdAt)}</p></td>
										<td className="px-5 py-3.5"><p className="font-medium">{invoice.clientName}</p><p className="text-[11px] text-obc-muted">{invoice.clientEmail}</p></td>
										<td className="whitespace-nowrap px-5 py-3.5 font-semibold">{rupiah(invoice.amount)}</td>
										<td className="px-5 py-3.5 text-obc-muted">{terms.length ? `${paidTerms}/${terms.length} dibayar` : "Tanpa termin"}</td>
										<td className="whitespace-nowrap px-5 py-3.5 text-obc-muted">{formatDate(invoice.dueDate)}</td>
										<td className="px-5 py-3.5"><select aria-label={`Status invoice ${invoice.invoiceNumber}`} value={invoice.status} onChange={(event) => changeStatus(invoice, event.target.value as InvoiceStatus)} className={`max-w-40 rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${statusClasses[invoice.status]}`}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td>
									</tr>
								);
							}) : (
								<tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Tidak ada invoice yang cocok.</td></tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="text-[12px] text-obc-muted">Menampilkan {rows.length} dari {filtered.length} invoice</p>
					<div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Sebelumnya</button><span className="text-[12px] text-obc-muted">{currentPage} / {totalPages}</span><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Berikutnya</button></div>
				</div>
			</section>
		</DashboardPageLayout>
	);
}
