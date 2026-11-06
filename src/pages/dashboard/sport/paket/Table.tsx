import { useMemo, useState } from "react";
import { CalendarDays, CircleDollarSign, Package, Pencil, Search, Trash2 } from "lucide-react";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { ActiveStatus, PricingPackage } from "../SportService";

type Props = {
	packages: PricingPackage[];
	loading: boolean;
	onStatusChange: (item: PricingPackage, status: ActiveStatus) => void;
	onEdit: (item: PricingPackage) => void;
	onDeactivate: (item: PricingPackage) => void;
};

const statuses: ActiveStatus[] = ["active", "inactive"];
const statusLabels: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const statusClasses: Record<ActiveStatus, string> = { active: "!bg-[#E7F5D0] !text-[#1F3320]", inactive: "!bg-[#F1EFE8] !text-obc-muted" };
const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const durationLabel = (minutes: number) => `${(minutes / 60).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jam`;

export default function PaketTable({ packages, loading, onStatusChange, onEdit, onDeactivate }: Props) {
	const [search, setSearch] = useState("");
	const visiblePackages = useMemo(() => {
		const query = search.trim().toLowerCase();
		return packages.filter((item) => !query || [
			item.id,
			item.name,
			item.description,
			item.sportType,
			item.resource?.name,
			item.resource?.slug,
			String(item.durationMinutes),
			String(item.packagePrice),
		].filter(Boolean).join(" ").toLowerCase().includes(query));
	}, [packages, search]);

	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_2px_12px_rgba(31,51,32,0.04)]">
			<header className="flex flex-col gap-3 border-b border-obc-border bg-[#FDFCF7] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<div><h2 className="font-heading text-[14px] font-semibold text-obc-charcoal">Daftar paket durasi</h2><p className="mt-0.5 text-[11px] text-obc-muted">{search.trim() ? `${visiblePackages.length} hasil dari ${packages.length} paket pada halaman ini` : `${packages.length} paket pada halaman ini`}</p></div>
				<label className="relative block w-full sm:w-75"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari paket pada halaman ini..." aria-label="Cari paket durasi" className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[12px] outline-none transition-colors focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]" /></label>
			</header>
			<div className="overflow-x-auto"><table className="w-full min-w-225 text-left text-[12px]">
				<thead><tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3.5">Nama paket</th><th className="px-4 py-3.5">Olahraga / lapang</th><th className="px-4 py-3.5">Durasi paket</th><th className="px-4 py-3.5">Harga</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody>
					{loading ? <tr><td colSpan={6} className="px-4 py-16 text-center text-obc-muted"><span className="inline-flex items-center gap-2"><span className="size-4 animate-spin rounded-full border-2 border-obc-border border-t-obc-green" />Memuat paket durasi...</span></td></tr> : visiblePackages.length ? visiblePackages.map((item) => <tr key={item.id} className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]">
						<td className="px-4 py-4"><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Package size={16} /></span><div className="min-w-0"><p className="max-w-64 truncate font-semibold text-obc-charcoal" title={item.name}>{item.name}</p><p className="mt-0.5 max-w-64 truncate text-[10px] text-obc-muted" title={item.description ?? "-"}>{item.description || "Tanpa deskripsi"}</p></div></div></td>
						<td className="px-4 py-4"><p className="capitalize font-medium text-obc-charcoal">{item.sportType?.replaceAll("_", " ") ?? "Semua olahraga"}</p><p className="mt-0.5 text-[10px] text-obc-muted">{item.resource?.name ?? "Semua lapang"}</p></td>
						<td className="whitespace-nowrap px-4 py-4"><span className="inline-flex items-center gap-1.5 rounded-md bg-[#F3F8E8] px-2.5 py-1.5 font-semibold text-obc-green"><CalendarDays size={13} />{durationLabel(item.durationMinutes)}</span></td>
						<td className="whitespace-nowrap px-4 py-4"><p className="font-heading text-[13px] font-bold text-obc-charcoal">{money(item.packagePrice)}</p>{item.discountPercent != null && item.discountPercent > 0 && <p className="mt-0.5 text-[10px] font-medium text-obc-green">Diskon {item.discountPercent}%</p>}</td>
						<td className="px-4 py-4"><ThemedSelect label={`Status paket ${item.name}`} value={item.status} options={statuses.map((status) => ({ value: status, label: statusLabels[status] }))} onValueChange={(value) => onStatusChange(item, value as ActiveStatus)} className={`h-8 w-fit rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold ${statusClasses[item.status]}`} /></td>
						<td className="px-4 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => onEdit(item)} title="Ubah paket durasi" aria-label={`Ubah paket ${item.name}`} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green"><Pencil size={14} /></button><button type="button" onClick={() => onDeactivate(item)} title="Nonaktifkan paket durasi" aria-label={`Nonaktifkan paket ${item.name}`} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-red hover:bg-red-50 hover:text-obc-red"><Trash2 size={14} /></button></div></td>
					</tr>) : <tr><td colSpan={6} className="px-5 py-16 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F3F8E8] text-obc-green"><CircleDollarSign size={19} /></span><p className="mt-3 text-[13px] font-semibold text-obc-charcoal">{search.trim() ? "Paket tidak ditemukan" : "Belum ada paket durasi"}</p><p className="mt-1 text-[11px] text-obc-muted">{search.trim() ? "Coba kata kunci lain pada halaman ini." : "Paket durasi yang tersedia akan muncul di sini."}</p></td></tr>}
				</tbody>
			</table></div>
		</section>
	);
}
