import { useEffect, useState } from "react";
import { CalendarRange, CircleDollarSign, Clock3 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ThemedSelect from "../../components/common/ThemedSelect";
import DeleteModal from "../../components/ui/DeleteModal";
import { courtService, type CourtResource } from "../court/courtService";
import {
	sportService,
	type ActiveStatus,
	type PricingRule,
	type PricingRuleUpdateInput,
} from "../SportService";
import PricingEditForm from "./PricingEditForm";
import PricingTable from "./PricingTable";
import PricingRuleDetailModal from "./PricingRuleDetailModal";

const FETCH_LIMIT = 100;
type PricingUpdate = PricingRuleUpdateInput;
type PricingDetail = { rule: PricingRule; rateUnitLabel: "jam" | "2 jam" };

function SummaryMetric({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof CircleDollarSign; tone: string }) {
	return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)]"><span className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}><Icon size={18} /></span><div className="min-w-0"><p className="text-[11px] text-obc-muted">{label}</p><p className="mt-0.5 truncate font-heading text-[20px] font-bold text-obc-charcoal">{value}</p><p className="mt-0.5 truncate text-[10px] text-obc-muted">{note}</p></div></div>;
}

export default function SportHarga() {
	const [resources, setResources] = useState<CourtResource[]>([]);
	const [rules, setRules] = useState<PricingRule[]>([]);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState<ActiveStatus | "all">("all");
	const [reload, setReload] = useState(0);
	const [editingItem, setEditingItem] = useState<PricingRule | null>(null);
	const [detailItem, setDetailItem] = useState<PricingDetail | null>(null);
	const [editingRateUnitLabel, setEditingRateUnitLabel] = useState<PricingDetail["rateUnitLabel"]>("jam");
	const [deletingItem, setDeletingItem] = useState<PricingRule | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;
		const loadAllRules = async () => {
			const firstPage = await sportService.getPricingRules({ page: 1, limit: FETCH_LIMIT, ...(status === "all" ? {} : { status }) });
			const remainingPages = await Promise.all(Array.from({ length: Math.max(0, firstPage.meta.totalPages - 1) }, (_, index) =>
				sportService.getPricingRules({ page: index + 2, limit: FETCH_LIMIT, ...(status === "all" ? {} : { status }) }),
			));
			return [...firstPage.data, ...remainingPages.flatMap((result) => result.data)];
		};
		Promise.all([courtService.getResources(), loadAllRules()]).then(([resourceItems, ruleItems]) => {
			if (cancelled) return;
			setResources(resourceItems);
			setRules(ruleItems);
		}).catch((error: unknown) => {
			if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat data tarif dan lapang.");
		}).finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, [reload, status]);

	const changeStatus = async (item: PricingRule, nextStatus: ActiveStatus) => {
		try {
			await sportService.updatePricingRuleStatus(item.id, nextStatus);
			setRules((current) => current.map((rule) => rule.id === item.id ? { ...rule, status: nextStatus } : rule));
			toast.success("Status harga berhasil diperbarui.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status harga.");
		}
	};

	const saveItem = async (item: PricingRule, payload: PricingUpdate) => {
		await sportService.updatePricingRule(item.id, payload);
		toast.success("Item harga berhasil diperbarui.");
		setLoading(true);
		setReload((current) => current + 1);
	};

	const confirmDeactivate = async () => {
		if (!deletingItem) return;
		setDeleteLoading(true);
		try {
			await sportService.deletePricingRule(deletingItem.id);
			toast.success("Aturan tarif berhasil dinonaktifkan.");
			setDeletingItem(null);
			setLoading(true);
			setReload((current) => current + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menonaktifkan aturan tarif.");
		} finally {
			setDeleteLoading(false);
		}
	};

	const activeCount = rules.filter((item) => item.status === "active").length;

	return (
		<DashboardLayout>
			<div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-6">
				<header className="mb-6"><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">OBC Sport / Operasional</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Harga & tarif</h1><p className="mt-1 max-w-2xl text-[13px] text-obc-muted">Kelola aturan tarif lapangan per jam.</p></header>
				<section className="mb-5 grid gap-3 sm:grid-cols-3">
					<SummaryMetric label="Aturan tarif" value={rules.length.toLocaleString("id-ID")} note="Sesuai status yang dipilih" icon={CircleDollarSign} tone="bg-[#E7F5D0] text-obc-green" />
					<SummaryMetric label="Aktif di halaman ini" value={activeCount.toLocaleString("id-ID")} note={`Dari ${rules.length} item yang dimuat`} icon={Clock3} tone="bg-[#EAF4F0] text-[#296049]" />
					<SummaryMetric label="Lapang" value={resources.length.toLocaleString("id-ID")} note="Lapang tersedia" icon={CalendarRange} tone="bg-[#FBF0D3] text-[#8A6100]" />
				</section>
				<section className="mb-4 flex flex-col gap-4 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[13px] font-semibold text-obc-charcoal">Tarif berdasarkan lapang</p><p className="mt-0.5 text-[11px] text-obc-muted">Pilih tab lapang untuk melihat aturannya.</p></div><label className="flex items-center gap-2 text-[11px] font-medium text-obc-muted"><span>Status</span><ThemedSelect label="Filter status harga" value={status} options={[{ value: "all", label: "Semua status" }, { value: "active", label: "Aktif" }, { value: "inactive", label: "Nonaktif" }]} onValueChange={(value) => { setLoading(true); setStatus(value as ActiveStatus | "all"); }} className="h-10 min-w-36" /></label></div>
				</section>
				<PricingTable resources={resources} rules={rules} loading={loading} onStatusChange={changeStatus} onView={(rule, resource) => setDetailItem({ rule, rateUnitLabel: resource?.sportTypes.includes("sepakbola") ? "2 jam" : "jam" })} onDelete={setDeletingItem} />
				{detailItem && <PricingRuleDetailModal rule={detailItem.rule} rateUnitLabel={detailItem.rateUnitLabel} onClose={() => setDetailItem(null)} onEdit={() => { setEditingItem(detailItem.rule); setEditingRateUnitLabel(detailItem.rateUnitLabel); setDetailItem(null); }} />}
				{editingItem && <PricingEditForm key={editingItem.id} item={editingItem} rateUnitLabel={editingRateUnitLabel} onClose={() => setEditingItem(null)} onSave={(payload) => "dayType" in payload ? saveItem(editingItem, payload) : Promise.resolve()} />}
				<DeleteModal isOpen={Boolean(deletingItem)} title="Nonaktifkan aturan tarif?" description="Aturan ini tidak akan dihapus permanen dan dapat diaktifkan kembali nanti." itemName={deletingItem ? `${deletingItem.tierStartTime}–${deletingItem.tierEndTime}` : undefined} confirmLabel="Nonaktifkan" isLoading={deleteLoading} onClose={() => setDeletingItem(null)} onConfirm={confirmDeactivate} />
			</div>
		</DashboardLayout>
	);
}