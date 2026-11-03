import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CircleDollarSign, Clock3, Eye, Pencil, Plus, Receipt, Search, Trash2, WalletCards } from "lucide-react";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { invoiceService, type Invoice, type InvoiceStatus } from "./invoiceService";
import { toast } from "sonner";
import InvoiceForm from "./Form";

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
		<div className="rounded-xl border border-obc-border bg-white p-4 transition-shadow hover:shadow-[0_3px_14px_rgba(52,49,51,0.06)]">
			<div className="flex min-w-0 items-center gap-3">
				<span className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}><Icon size={18} /></span>
				<div className="min-w-0"><p className="text-[12px] text-obc-muted">{label}</p><p className="mt-0.5 truncate font-heading text-[18px] font-bold text-obc-charcoal sm:text-[20px]">{value}</p></div>
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
	const [formOpen, setFormOpen] = useState(false);
	const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
	const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
	const [paymentTerm, setPaymentTerm] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [paidAt, setPaidAt] = useState("");
	const [paymentNotes, setPaymentNotes] = useState("");
	const [paying, setPaying] = useState(false);

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

	const openCreateForm = () => {
		setEditingInvoice(null);
		setFormOpen(true);
	};

	const openEditForm = (invoice: Invoice) => {
		setEditingInvoice(invoice);
		setFormOpen(true);
	};

	const handleSaved = (saved: Invoice) => {
		setInvoices((current) => editingInvoice
			? current.map((invoice) => invoice.id === saved.id ? saved : invoice)
			: [saved, ...current]);
	};

	const deleteInvoice = async (invoice: Invoice) => {
		if (!window.confirm(`Hapus invoice ${invoice.invoiceNumber}?`)) return;
		try {
			await invoiceService.deleteInvoice(invoice.id);
			setInvoices((current) => current.filter((item) => item.id !== invoice.id));
			toast.success("Invoice berhasil dihapus.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menghapus invoice.");
		}
	};

	const openPayment = (invoice: Invoice) => {
		const unpaidTerm = invoice.terms.find((term) => !term.paidAt);
		setPayingInvoice(invoice);
		setPaymentTerm(unpaidTerm ? String(unpaidTerm.termNumber) : "");
		setPaymentMethod("");
		setPaidAt("");
		setPaymentNotes("");
	};

	const submitPayment = async () => {
		if (!payingInvoice || !paymentTerm) {
			toast.error("Pilih termin yang dibayarkan.");
			return;
		}
		setPaying(true);
		try {
			const updated = await invoiceService.payInvoiceTerm(payingInvoice.id, {
				termNumber: Number(paymentTerm),
				paymentMethod: paymentMethod || undefined,
				paidAt: paidAt || undefined,
				notes: paymentNotes || undefined,
			});
			setInvoices((current) => current.map((invoice) => invoice.id === updated.id ? updated : invoice));
			setPayingInvoice(null);
			toast.success("Pembayaran termin berhasil dicatat.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal mencatat pembayaran termin.");
		} finally {
			setPaying(false);
		}
	};

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

	if (formOpen) {
		return (
			<DashboardPageLayout breadcrumb="Invoice" title="Manajemen invoice" description="Pantau tagihan, termin pembayaran, dan status invoice perusahaan.">
				<InvoiceForm invoice={editingInvoice} onClose={() => setFormOpen(false)} onSaved={handleSaved} />
			</DashboardPageLayout>
		);
	}

	return (
		<DashboardPageLayout breadcrumb="Invoice" title="Manajemen invoice" description="Pantau tagihan, termin pembayaran, dan status invoice perusahaan.">
			<div className="mb-4 flex justify-end">
				<button type="button" onClick={openCreateForm} className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-obc-green-hover"><Plus size={16} /> Buat invoice</button>
			</div>
			<section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Summary label="Total invoice" value={invoices.length.toLocaleString("id-ID")} icon={Receipt} tone="bg-[#E7F5D0] text-obc-green" />
				<Summary label="Nilai invoice" value={rupiah(totalAmount)} icon={CircleDollarSign} tone="bg-[#CDF178] text-[#404F14]" />
				<Summary label="Invoice lunas" value={paidCount.toLocaleString("id-ID")} icon={BadgeCheck} tone="bg-[#E7F5D0] text-[#1F3320]" />
				<Summary label="Perlu ditindaklanjuti" value={followUpCount.toLocaleString("id-ID")} icon={Clock3} tone="bg-[#FBF0D3] text-[#8A6100]" />
			</section>

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
						{(["all", ...statuses] as StatusFilter[]).map((status) => (
							<button key={status} type="button" role="tab" aria-selected={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(1); }} className={`shrink-0 rounded-lg border px-3 py-2 text-[12px] font-medium transition-colors ${statusFilter === status ? "border-obc-green bg-[#F3F8E8] text-obc-green" : "border-transparent text-obc-muted hover:border-obc-border hover:bg-[#FDFCF7]"}`}>
								{status === "all" ? "Semua" : statusLabels[status]} <span className="ml-1 opacity-70">{status === "all" ? invoices.length : counts[status]}</span>
							</button>
						))}
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-220 text-left">
						<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
							<th className="px-5 py-3.5">Invoice</th><th className="px-5 py-3.5">Klien</th><th className="px-5 py-3.5">Nominal</th><th className="px-5 py-3.5">Termin</th><th className="px-5 py-3.5">Jatuh tempo</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Aksi</th>
						</tr></thead>
						<tbody className="text-[13px]">
							{loading ? (
								<tr><td colSpan={7} className="px-5 py-12 text-center text-obc-muted">Memuat invoice...</td></tr>
							) : rows.length ? rows.map((invoice) => {
								const terms = invoice.terms ?? [];
								const paidTerms = terms.filter((term) => term.paidAt).length;
								return (
									<tr key={invoice.id} className="border-t border-obc-border transition-colors hover:bg-[#FDFCF7]">
										<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{invoice.invoiceNumber}</p><p className="text-[11px] text-obc-muted">Dibuat {formatDate(invoice.createdAt)}</p></td>
										<td className="px-5 py-3.5"><p className="font-medium">{invoice.clientName}</p><p className="text-[11px] text-obc-muted">{invoice.clientEmail}</p></td>
										<td className="whitespace-nowrap px-5 py-3.5 font-semibold">{rupiah(invoice.amount)}</td>
										<td className="px-5 py-3.5 text-obc-muted">{terms.length ? `${paidTerms}/${terms.length} dibayar` : "Tanpa termin"}</td>
										<td className="whitespace-nowrap px-5 py-3.5 text-obc-muted">{formatDate(invoice.dueDate)}</td>
										<td className="px-5 py-3.5"><select aria-label={`Status invoice ${invoice.invoiceNumber}`} value={invoice.status} onChange={(event) => changeStatus(invoice, event.target.value as InvoiceStatus)} className={`max-w-40 rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${statusClasses[invoice.status]}`}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td>
								<td className="px-5 py-3.5"><div className="flex justify-end gap-1"><button type="button" onClick={() => setSelectedInvoice(invoice)} className="grid size-9 place-items-center rounded-lg hover:bg-[#F1EFE8]" title="Lihat detail" aria-label={`Lihat ${invoice.invoiceNumber}`}><Eye size={16} /></button><button type="button" onClick={() => openEditForm(invoice)} className="grid size-9 place-items-center rounded-lg hover:bg-[#F1EFE8]" title="Edit" aria-label={`Edit ${invoice.invoiceNumber}`}><Pencil size={16} /></button>{invoice.terms.length > 0 && <button type="button" onClick={() => openPayment(invoice)} className="grid size-9 place-items-center rounded-lg hover:bg-[#F1EFE8]" title="Catat pembayaran" aria-label={`Bayar ${invoice.invoiceNumber}`}><WalletCards size={16} /></button>}<button type="button" onClick={() => deleteInvoice(invoice)} className="grid size-9 place-items-center rounded-lg text-red-600 hover:bg-red-50" title="Hapus" aria-label={`Hapus ${invoice.invoiceNumber}`}><Trash2 size={16} /></button></div></td>
									</tr>
								);
							}) : (
								<tr><td colSpan={7} className="px-5 py-12 text-center text-obc-muted">Tidak ada invoice yang cocok.</td></tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="text-[12px] text-obc-muted">Menampilkan {rows.length} dari {filtered.length} invoice</p>
					<div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Sebelumnya</button><span className="text-[12px] text-obc-muted">{currentPage} / {totalPages}</span><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Berikutnya</button></div>
				</div>
			</section>
			{selectedInvoice && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-obc-border px-5 py-4"><h2 className="font-heading text-lg font-bold">{selectedInvoice.invoiceNumber}</h2><button type="button" onClick={() => setSelectedInvoice(null)} className="size-9 rounded-lg text-obc-muted" aria-label="Tutup">×</button></div><div className="grid gap-4 p-5 sm:grid-cols-2"><div><p className="text-[12px] text-obc-muted">Klien</p><p className="font-medium">{selectedInvoice.clientName}</p><p className="text-[13px] text-obc-muted">{selectedInvoice.clientEmail}</p></div><div><p className="text-[12px] text-obc-muted">Nominal</p><p className="font-semibold">{rupiah(selectedInvoice.amount)}</p></div><div><p className="text-[12px] text-obc-muted">Layanan</p><p>{selectedInvoice.service || "-"}</p></div><div><p className="text-[12px] text-obc-muted">Status</p><p>{statusLabels[selectedInvoice.status]}</p></div><div><p className="text-[12px] text-obc-muted">Tanggal terbit</p><p>{formatDate(selectedInvoice.issueDate)}</p></div><div><p className="text-[12px] text-obc-muted">Jatuh tempo</p><p>{formatDate(selectedInvoice.dueDate)}</p></div></div>{selectedInvoice.description && <p className="border-t border-obc-border px-5 py-4 text-[13px] text-obc-muted">{selectedInvoice.description}</p>}<div className="border-t border-obc-border px-5 py-4"><h3 className="mb-2 font-heading text-[14px] font-semibold">Termin pembayaran</h3>{selectedInvoice.terms.length ? selectedInvoice.terms.map((term) => <div key={term.id} className="flex items-center justify-between border-b border-obc-border py-2 text-[13px] last:border-0"><span>Termin {term.termNumber}</span><span>{rupiah(term.amount)}</span><span className={term.paidAt ? "text-[#1F3320]" : "text-obc-muted"}>{term.paidAt ? `Lunas ${formatDate(term.paidAt)}` : "Belum dibayar"}</span></div>) : <p className="text-[13px] text-obc-muted">Invoice ini belum memiliki termin.</p>}</div></div></div>}
			{payingInvoice && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-2xl bg-white shadow-xl"><div className="border-b border-obc-border px-5 py-4"><h2 className="font-heading text-lg font-bold">Catat pembayaran termin</h2><p className="mt-1 text-[12px] text-obc-muted">{payingInvoice.invoiceNumber}</p></div><div className="space-y-4 p-5"><label className="block text-[13px] font-medium">Termin<select value={paymentTerm} onChange={(event) => setPaymentTerm(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]">{payingInvoice.terms.map((term) => <option key={term.id} value={term.termNumber}>Termin {term.termNumber} - {rupiah(term.amount)}{term.paidAt ? " (sudah lunas)" : ""}</option>)}</select></label><label className="block text-[13px] font-medium">Metode pembayaran<input value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} placeholder="Transfer bank, QRIS, tunai..." className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]" /></label><label className="block text-[13px] font-medium">Tanggal dibayar<input type="date" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]" /></label><label className="block text-[13px] font-medium">Catatan<textarea rows={3} value={paymentNotes} onChange={(event) => setPaymentNotes(event.target.value)} className="mt-1 w-full rounded-xl border border-obc-border p-3 text-[13px]" /></label><div className="flex justify-end gap-3"><button type="button" onClick={() => setPayingInvoice(null)} className="rounded-xl border border-obc-border px-4 py-2 text-[13px]">Batal</button><button type="button" disabled={paying} onClick={submitPayment} className="rounded-xl bg-obc-green px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50">{paying ? "Menyimpan..." : "Simpan pembayaran"}</button></div></div></div></div>}
		</DashboardPageLayout>
	);
}
