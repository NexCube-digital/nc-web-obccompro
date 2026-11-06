import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, CalendarRange, Package } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/ui/DeleteModal";
import { sportService, type ActiveStatus, type PricingPackage, type PricingPackageUpdateInput } from "../SportService";
import PaketForm from "./Form";
import PaketTable from "./Table";

const STATUSES: ActiveStatus[] = ["active", "inactive"];
const STATUS_LABELS: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const PAGE_SIZE = 10;

function SummaryMetric({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof Package; tone: string }) {
	return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)]"><span className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}><Icon size={18} /></span><div className="min-w-0"><p className="text-[11px] text-obc-muted">{label}</p><p className="mt-0.5 truncate font-heading text-[20px] font-bold text-obc-charcoal">{value}</p><p className="mt-0.5 truncate text-[10px] text-obc-muted">{note}</p></div></div>;
}

export default function PaketManagement() {
	const [packages, setPackages] = useState<PricingPackage[]>([]);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<ActiveStatus | "all">("all");
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [reload, setReload] = useState(0);
	const [editingItem, setEditingItem] = useState<PricingPackage | null>(null);
	const [deletingItem, setDeletingItem] = useState<PricingPackage | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const closeDeleteModal = useCallback(() => setDeletingItem(null), []);

	useEffect(() => {
		let cancelled = false;
		sportService.getPricingPackages({ page, limit: PAGE_SIZE, ...(status === "all" ? {} : { status }) })
			.then((result) => {
				if (cancelled) return;
				setPackages(result.data);
				setTotal(result.meta.total);
				setTotalPages(result.meta.totalPages);
			})
			.catch((error: unknown) => { if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat paket durasi."); })
			.finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, [page, reload, status]);

	const updateStatus = async (item: PricingPackage, nextStatus: ActiveStatus) => {
		try {
			await sportService.updatePricingPackageStatus(item.id, nextStatus);
			setPackages((current) => current.map((pricingPackage) => pricingPackage.id === item.id ? { ...pricingPackage, status: nextStatus } : pricingPackage));
			toast.success("Status paket durasi berhasil diperbarui.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status paket.");
		}
	};

	const saveItem = async (payload: PricingPackageUpdateInput) => {
		if (!editingItem) return;
		await sportService.updatePricingPackage(editingItem.id, payload);
		toast.success("Paket durasi berhasil diperbarui.");
		setReload((current) => current + 1);
	};

	const confirmDeactivate = async () => {
		if (!deletingItem) return;
		setDeleteLoading(true);
		try {
			await sportService.deletePricingPackage(deletingItem.id);
			toast.success("Paket durasi berhasil dinonaktifkan.");
			setDeletingItem(null);
			setReload((current) => current + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menonaktifkan paket durasi.");
		} finally {
			setDeleteLoading(false);
		}
	};

	const activeOnPage = packages.filter((item) => item.status === "active").length;
	const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
	const rangeEnd = Math.min(page * PAGE_SIZE, total);

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-6">
				<header className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">OBC Sport / Operasional</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Paket durasi</h1><p className="mt-1 max-w-2xl text-[13px] text-obc-muted">Kelola durasi dan harga paket booking olahraga.</p></header>
				<section className="mb-5 grid gap-3 sm:grid-cols-3">
					<SummaryMetric label="Paket sesuai filter" value={total.toLocaleString("id-ID")} note="Total hasil dari server" icon={Package} tone="bg-[#E7F5D0] text-obc-green" />
					<SummaryMetric label="Aktif di halaman ini" value={activeOnPage.toLocaleString("id-ID")} note={`Dari ${packages.length} paket dimuat`} icon={BadgeCheck} tone="bg-[#EAF4F0] text-[#296049]" />
					<SummaryMetric label="Rentang data" value={total ? `${rangeStart}–${rangeEnd}` : "0"} note={`Halaman ${page} dari ${totalPages}`} icon={CalendarRange} tone="bg-[#FBF0D3] text-[#8A6100]" />
				</section>
				<section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] sm:flex-row sm:items-center sm:justify-between">
					<div role="tablist" aria-label="Filter status paket durasi" className="flex w-fit gap-1 rounded-lg border border-obc-border bg-[#F7F7F2] p-1">
						{(["all", ...STATUSES] as const).map((filterStatus) => {
							const selected = status === filterStatus;
							return <button key={filterStatus} type="button" role="tab" aria-selected={selected} onClick={() => { setLoading(true); setStatus(filterStatus); setPage(1); }} className={`h-9 rounded-md px-3 text-[11px] font-semibold transition-colors ${selected ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}>{filterStatus === "all" ? "Semua status" : STATUS_LABELS[filterStatus]}</button>;
						})}
					</div>
					<span className="text-[11px] text-obc-muted">{total.toLocaleString("id-ID")} paket ditemukan · {PAGE_SIZE} per halaman</span>
				</section>
				<PaketTable packages={packages} loading={loading} onStatusChange={updateStatus} onEdit={setEditingItem} onDeactivate={setDeletingItem} />
				<Pagination page={page} totalPages={totalPages} onPageChange={(nextPage) => { setLoading(true); setPage(nextPage); }} totalItems={total} pageSize={PAGE_SIZE} itemLabel="paket" disabled={loading} className="mt-3 flex flex-col gap-3 rounded-xl border border-obc-border bg-white px-4 py-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5" />
				{editingItem && <PaketForm key={editingItem.id} item={editingItem} onClose={() => setEditingItem(null)} onSave={saveItem} />}
				<DeleteModal isOpen={Boolean(deletingItem)} title="Nonaktifkan paket durasi?" description="Paket ini tidak akan dihapus permanen dan dapat diaktifkan kembali nanti." itemName={deletingItem?.name} confirmLabel="Nonaktifkan" isLoading={deleteLoading} onClose={closeDeleteModal} onConfirm={confirmDeactivate} />
			</div>
		</DashboardLayout>
	);
}
