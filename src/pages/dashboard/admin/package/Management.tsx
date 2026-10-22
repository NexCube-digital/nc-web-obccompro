import { useEffect, useMemo, useState } from "react";
import { Package, Plus, Search, Star } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import { packageService, type PackageStatus, type ServicePackage } from "./packageService";
import PackageForm from "./form";
import PackageTable from "./Table";

export default function Management() {
	const [packages, setPackages] = useState<ServicePackage[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState<"all" | PackageStatus>("all");
	const [showForm, setShowForm] = useState(false);
	const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		packageService.getPackages()
			.then((data) => { if (active) setPackages(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [reload]);

	const types = useMemo(() => Array.from(new Set(packages.map((item) => item.type))).sort(), [packages]);
	const filteredPackages = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return packages.filter((item) => {
			const typeMatches = typeFilter === "all" || item.type === typeFilter;
			const statusMatches = statusFilter === "all" || item.status === statusFilter;
			const searchMatches = [item.name, item.type, item.tier, item.description, ...(item.features ?? [])]
				.filter(Boolean)
				.join(" ")
				.toLowerCase()
				.includes(normalizedQuery);
			return typeMatches && statusMatches && searchMatches;
		});
	}, [packages, query, statusFilter, typeFilter]);
	const refresh = () => setReload((value) => value + 1);

	const editPackage = (packageItem: ServicePackage) => {
		setEditingPackage(packageItem);
		setShowForm(true);
	};

	const deletePackage = async (packageItem: ServicePackage) => {
		if (!window.confirm(`Hapus paket "${packageItem.name}"?`)) return;
		try {
			await packageService.deletePackage(packageItem.id);
			toast.success("Paket berhasil dihapus.");
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	const updatePackage = async (packageItem: ServicePackage, patch: { isPopular?: boolean; status?: PackageStatus }) => {
		try {
			await packageService.updatePackage(packageItem.id, patch);
			toast.success("Paket berhasil diperbarui.");
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Paket layanan" title="Manajemen paket" description="Atur paket layanan, harga, fitur, status, dan galeri gambar.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Package size={18} /></span><div><p className="text-[12px] text-obc-muted">Total paket</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{packages.length.toLocaleString("id-ID")}</p></div></div></div>
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#FBF0D3] text-[#8A6100]"><Star size={18} /></span><div><p className="text-[12px] text-obc-muted">Paket populer</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{packages.filter((item) => item.isPopular).length.toLocaleString("id-ID")}</p></div></div></div>
			</section>

			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2 sm:flex-row">
					<select aria-label="Filter tipe paket" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua tipe</option>{types.map((type) => <option key={type} value={type}>{type}</option>)}</select>
					<select aria-label="Filter status paket" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | PackageStatus)} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua status</option><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select>
					<label className="relative block w-full sm:w-[280px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari paket..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label>
				</div>
				{!showForm && <button type="button" onClick={() => { setEditingPackage(null); setShowForm(true); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Tambah paket</button>}
			</section>

			{showForm && <div className="mb-4"><PackageForm key={editingPackage?.id ?? "new"} packageItem={editingPackage} onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} /></div>}
			<PackageTable packages={filteredPackages} loading={loading} onEdit={editPackage} onDelete={deletePackage} onTogglePopular={(packageItem) => updatePackage(packageItem, { isPopular: !packageItem.isPopular })} onToggleStatus={(packageItem) => updatePackage(packageItem, { status: packageItem.status === "active" ? "inactive" : "active" })} />
		</DashboardPageLayout>
	);
}
