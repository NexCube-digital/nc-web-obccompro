import { useCallback, useEffect, useState } from "react";
import { CircleDollarSign, Clock3, Package } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/ui/DeleteModal";
import {
	sportService,
	type ActiveStatus,
	type PricingPackage,
	type PricingPackageUpdateInput,
	type PricingRule,
	type PricingRuleUpdateInput,
} from "../SportService";
import PricingEditForm from "./PricingEditForm";
import PricingTable, { type PricingRecord, type PricingView } from "./PricingTable";

const PAGE_SIZE = 10;
type PricingUpdate = PricingRuleUpdateInput | PricingPackageUpdateInput;

const dayLabel: Record<PricingRule["dayType"], string> = { weekday: "Hari kerja", weekend: "Akhir pekan", holiday: "Hari libur" };

function SummaryMetric({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof CircleDollarSign; tone: string }) {
	return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)]"><span className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}><Icon size={18} /></span><div className="min-w-0"><p className="text-[11px] text-obc-muted">{label}</p><p className="mt-0.5 truncate font-heading text-[20px] font-bold text-obc-charcoal">{value}</p><p className="mt-0.5 truncate text-[10px] text-obc-muted">{note}</p></div></div>;
}

export default function SportHarga() {
	const [view, setView] = useState<PricingView>("rules");
	const [rules, setRules] = useState<PricingRule[]>([]);
	const [packages, setPackages] = useState<PricingPackage[]>([]);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<ActiveStatus | "all">("all");
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [reload, setReload] = useState(0);
	const [editingItem, setEditingItem] = useState<PricingRecord | null>(null);
	const [deletingItem, setDeletingItem] = useState<PricingRecord | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const closeDeleteModal = useCallback(() => setDeletingItem(null), []);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		const request = view === "rules"
			? sportService.getPricingRules({ page, limit: PAGE_SIZE, ...(status === "all" ? {} : { status }) })
			: sportService.getPricingPackages({ page, limit: PAGE_SIZE, ...(status === "all" ? {} : { status }) });
		request.then((result) => {
			if (cancelled) return;
			if (view === "rules") setRules(result.data as PricingRule[]);
			else setPackages(result.data as PricingPackage[]);
			setTotal(result.meta.total);
			setTotalPages(result.meta.totalPages);
		}).catch((error: unknown) => {
			if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat data tarif.");
		}).finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, [page, reload, status, view]);

	const changeStatus = async (item: PricingRecord, nextStatus: ActiveStatus) => {
		try {
			if (view === "rules") {
				await sportService.updatePricingRuleStatus(item.id, nextStatus);
				setRules((current) => current.map((rule) => rule.id === item.id ? { ...rule, status: nextStatus } : rule));
			} else {
				await sportService.updatePricingPackageStatus(item.id, nextStatus);
				setPackages((current) => current.map((pricingPackage) => pricingPackage.id === item.id ? { ...pricingPackage, status: nextStatus } : pricingPackage));
			}
			toast.success("Status harga berhasil diperbarui.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status harga.");
		}
	};

	const saveItem = async (item: PricingRecord, payload: PricingUpdate) => {
		if ("dayType" in item) {
			await sportService.updatePricingRule(item.id, payload as PricingRuleUpdateInput);
		} else {
			await sportService.updatePricingPackage(item.id, payload as PricingPackageUpdateInput);
		}
		toast.success("Item harga berhasil diperbarui.");
		setReload((current) => current + 1);
	};

	const deactivateItem = (item: PricingRecord) => setDeletingItem(item);

	const confirmDeactivate = async () => {
		if (!deletingItem) return;
		setDeleteLoading(true);
		try {
			if ("dayType" in deletingItem) await sportService.deletePricingRule(deletingItem.id);
			else await sportService.deletePricingPackage(deletingItem.id);
			toast.success("Item harga berhasil dinonaktifkan.");
			setDeletingItem(null);
			setReload((current) => current + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menonaktifkan item harga.");
		} finally {
			setDeleteLoading(false);
		}
	};

	const changePage = (nextPage: number) => {
		setLoading(true);
		setPage(nextPage);
	};
	const visibleCount = view === "rules" ? rules.length : packages.length;
	const activeCount = (view === "rules" ? rules : packages).filter((item) => item.status === "active").length;
	const viewLabel = view === "rules" ? "aturan tarif" : "paket durasi";
	const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
	const rangeEnd = Math.min(page * PAGE_SIZE, total);

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-6">
				<header className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">OBC Sport / Pengelolaan tarif</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Harga & tarif</h1><p className="mt-1 max-w-2xl text-[13px] text-obc-muted">Kelola tarif lapangan dan paket durasi dalam satu katalog yang mudah dicari dan ditinjau.</p></header>
				<section className="mb-5 grid gap-3 sm:grid-cols-3">
					<SummaryMetric label={`Total ${viewLabel}`} value={total.toLocaleString("id-ID")} note="Hasil sesuai status yang dipilih" icon={CircleDollarSign} tone="bg-[#E7F5D0] text-obc-green" />
					<SummaryMetric label="Aktif di halaman ini" value={activeCount.toLocaleString("id-ID")} note={`Dari ${visibleCount} item yang dimuat`} icon={Clock3} tone="bg-[#EAF4F0] text-[#296049]" />
					<SummaryMetric label="Rentang data" value={total ? `${rangeStart}–${rangeEnd}` : "0"} note={`Halaman ${page} dari ${totalPages}`} icon={Package} tone="bg-[#FBF0D3] text-[#8A6100]" />
				</section>
				<section className="mb-4 flex flex-col gap-4 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] lg:flex-row lg:items-center lg:justify-between">
					<div role="tablist" aria-label="Jenis harga" className="grid grid-cols-2 gap-1 rounded-lg border border-obc-border bg-[#F7F7F2] p-1 sm:inline-flex">
						<button type="button" role="tab" aria-selected={view === "rules"} onClick={() => { setLoading(true); setView("rules"); setPage(1); }} className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-[12px] font-semibold transition-colors ${view === "rules" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}><Clock3 size={15} />Aturan per jam</button>
						<button type="button" role="tab" aria-selected={view === "packages"} onClick={() => { setLoading(true); setView("packages"); setPage(1); }} className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-[12px] font-semibold transition-colors ${view === "packages" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}><Package size={15} />Paket durasi</button>
					</div>
					<div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
						<span className="inline-flex h-10 items-center justify-between gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[11px] font-medium text-obc-muted"><span>Data per halaman</span><span className="font-semibold text-obc-charcoal">10</span></span>
						<label className="flex items-center justify-between gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[11px] font-medium text-obc-muted"><span>Status</span><select aria-label="Filter status harga" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as ActiveStatus | "all"); setPage(1); }} className="h-10 bg-transparent text-[12px] font-semibold text-obc-charcoal outline-none"><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>
					</div>
				</section>
				<PricingTable view={view} rules={rules} packages={packages} loading={loading} onStatusChange={changeStatus} onEdit={setEditingItem} onDeactivate={deactivateItem} />
				<Pagination page={page} totalPages={totalPages} onPageChange={changePage} totalItems={total} pageSize={PAGE_SIZE} itemLabel={view === "rules" ? "aturan tarif" : "paket harga"} disabled={loading} className="mt-3 flex flex-col gap-3 rounded-xl border border-obc-border bg-white px-4 py-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5" />
				{editingItem && <PricingEditForm key={editingItem.id} item={editingItem} onClose={() => setEditingItem(null)} onSave={(payload) => saveItem(editingItem, payload)} />}
				<DeleteModal
					isOpen={Boolean(deletingItem)}
					title="Nonaktifkan item harga?"
					description="Item ini tidak akan dihapus permanen dan dapat diaktifkan kembali nanti."
					itemName={deletingItem ? "dayType" in deletingItem ? `Aturan tarif ${dayLabel[deletingItem.dayType]}` : `Paket ${deletingItem.name}` : undefined}
					confirmLabel="Nonaktifkan"
					isLoading={deleteLoading}
					onClose={closeDeleteModal}
					onConfirm={confirmDeactivate}
				/>
			</div>
		</DashboardLayout>
	);
}