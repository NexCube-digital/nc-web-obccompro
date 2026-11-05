import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Pencil, Search, Trash2 } from "lucide-react";
import type { ActiveStatus, PricingPackage, PricingRule } from "../SportService";

export type PricingView = "rules" | "packages";
export type PricingRecord = PricingRule | PricingPackage;

type Props = {
	view: PricingView;
	rules: PricingRule[];
	packages: PricingPackage[];
	loading: boolean;
	onStatusChange: (item: PricingRecord, status: ActiveStatus) => void;
	onEdit: (item: PricingRecord) => void;
	onDeactivate: (item: PricingRecord) => void;
};

const dayLabels: Record<PricingRule["dayType"], string> = {
	weekday: "Hari kerja",
	weekend: "Akhir pekan",
	holiday: "Hari libur",
};
const timePeriods = [
	{ label: "Pagi", from: 0, to: 12 * 60, style: "bg-[#FBF0D3] text-[#8A6100]" },
	{ label: "Siang", from: 12 * 60, to: 17 * 60, style: "bg-[#E7F5D0] text-[#1F3320]" },
	{ label: "Malam", from: 17 * 60, to: 24 * 60, style: "bg-[#EAF4F0] text-[#296049]" },
];
const statusLabels: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const statusClasses: Record<ActiveStatus, string> = {
	active: "bg-[#E7F5D0] text-[#1F3320]",
	inactive: "bg-[#F1EFE8] text-obc-muted",
};
const money = (value: number) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
}).format(value);
const toMinutes = (time: string) => {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
};
const getTimePeriods = (rule: PricingRule) => {
	const start = toMinutes(rule.tierStartTime);
	const end = toMinutes(rule.tierEndTime);
	return timePeriods.filter((period) => start < period.to && end > period.from);
};

export default function PricingTable({ view, rules, packages, loading, onStatusChange, onEdit, onDeactivate }: Props) {
	const [search, setSearch] = useState("");
	const columnCount = view === "rules" ? 8 : 7;
	const visibleItems = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (view === "rules") {
			return rules.filter((rule) => !query || [
				rule.id,
				rule.resource?.name,
				rule.resource?.slug,
				dayLabels[rule.dayType],
				rule.tierStartTime,
				rule.tierEndTime,
				String(rule.pricePerHour),
				String(rule.priority),
			].filter(Boolean).join(" ").toLowerCase().includes(query));
		}
		return packages.filter((pricingPackage) => !query || [
			pricingPackage.id,
			pricingPackage.name,
			pricingPackage.description,
			pricingPackage.sportType,
			pricingPackage.resource?.name,
			resourceSlug(pricingPackage.resource?.slug),
			String(pricingPackage.durationMinutes),
			String(pricingPackage.packagePrice),
			String(pricingPackage.priority),
		].filter(Boolean).join(" ").toLowerCase().includes(query));
	}, [packages, rules, search, view]);

	const statusSelect = (item: PricingRecord, label: string) => <select aria-label={`Status ${label}`} value={item.status} onChange={(event) => onStatusChange(item, event.target.value as ActiveStatus)} className={`cursor-pointer rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold outline-none focus:ring-2 focus:ring-[#CDF178] ${statusClasses[item.status]}`}>
		{(Object.keys(statusLabels) as ActiveStatus[]).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
	</select>;

	const actions = (item: PricingRecord, label: string) => <div className="flex justify-end gap-1">
		<button type="button" onClick={() => onEdit(item)} title={`Ubah ${label}`} aria-label={`Ubah ${label}`} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178]"><Pencil size={14} /></button>
		<button type="button" onClick={() => onDeactivate(item)} title={`Nonaktifkan ${label}`} aria-label={`Nonaktifkan ${label}`} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-red hover:bg-red-50 hover:text-obc-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"><Trash2 size={14} /></button>
	</div>;

	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_2px_12px_rgba(31,51,32,0.04)]">
			<header className="flex flex-col gap-3 border-b border-obc-border bg-[#FDFCF7] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<div><h2 className="font-heading text-[14px] font-semibold text-obc-charcoal">{view === "rules" ? "Aturan harga per jam" : "Paket harga durasi"}</h2><p className="mt-0.5 text-[11px] text-obc-muted">{search.trim() ? `${visibleItems.length} hasil pada halaman ini` : `${visibleItems.length} item pada halaman ini`}</p></div>
				<label className="relative block w-full sm:w-75"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari pada halaman ini..." aria-label="Cari harga pada halaman ini" className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[12px] outline-none transition-colors focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]" /></label>
			</header>
			<div className="overflow-x-auto"><table className={`w-full ${view === "rules" ? "min-w-275" : "min-w-250"} text-left text-[12px]`}>
				<thead><tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
					{view === "rules" ? <><th className="px-4 py-3.5">Resource</th><th className="px-4 py-3.5">Hari</th><th className="px-4 py-3.5">Jam berlaku</th><th className="px-4 py-3.5">Periode</th><th className="px-4 py-3.5">Tarif / jam</th><th className="px-4 py-3.5">Prioritas</th></> : <><th className="px-4 py-3.5">Nama paket</th><th className="px-4 py-3.5">Olahraga / resource</th><th className="px-4 py-3.5">Durasi</th><th className="px-4 py-3.5">Harga</th><th className="px-4 py-3.5">Prioritas</th></>}
					<th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5 text-right">Aksi</th>
				</tr></thead>
				<tbody>
					{loading ? <tr><td colSpan={columnCount} className="px-4 py-16 text-center text-obc-muted"><span className="inline-flex items-center gap-2"><span className="size-4 animate-spin rounded-full border-2 border-obc-border border-t-obc-green" />Memuat data tarif...</span></td></tr> : visibleItems.length ? view === "rules" ? (visibleItems as PricingRule[]).map((rule) => <tr key={rule.id} className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]">
						<td className="px-4 py-4"><p className="font-semibold text-obc-charcoal">{rule.resource?.name ?? "Semua resource"}</p>{rule.resource?.slug && <p className="mt-0.5 text-[10px] text-obc-muted">{rule.resource.slug}</p>}</td>
						<td className="px-4 py-4"><span className="inline-flex rounded-md bg-[#F1EFE8] px-2.5 py-1 text-[10px] font-medium text-obc-charcoal">{dayLabels[rule.dayType]}</span></td>
						<td className="whitespace-nowrap px-4 py-4"><span className="inline-flex items-center gap-1.5 font-medium text-obc-charcoal"><Clock3 size={13} className="text-obc-green" />{rule.tierStartTime}–{rule.tierEndTime}</span></td>
						<td className="px-4 py-4"><div className="flex flex-wrap gap-1">{getTimePeriods(rule).map((period) => <span key={period.label} className={`rounded-md px-2 py-1 text-[10px] font-semibold ${period.style}`}>{period.label}</span>)}</div></td>
						<td className="whitespace-nowrap px-4 py-4 font-heading text-[13px] font-bold text-obc-charcoal">{money(rule.pricePerHour)}</td>
						<td className="px-4 py-4"><span className="inline-flex min-w-8 justify-center rounded-md bg-[#F3F8E8] px-2 py-1 font-semibold text-obc-green">{rule.priority}</span></td>
						<td className="px-4 py-4">{statusSelect(rule, `aturan tarif ${rule.id}`)}</td>
						<td className="px-4 py-4">{actions(rule, "aturan tarif")}</td>
					</tr>) : (visibleItems as PricingPackage[]).map((pricingPackage) => <tr key={pricingPackage.id} className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]">
						<td className="px-4 py-4"><p className="max-w-64 truncate font-semibold text-obc-charcoal" title={pricingPackage.name}>{pricingPackage.name}</p><p className="mt-0.5 max-w-64 truncate text-[10px] text-obc-muted" title={pricingPackage.description ?? "-"}>{pricingPackage.description || "Tanpa deskripsi"}</p></td>
						<td className="px-4 py-4"><p className="capitalize font-medium text-obc-charcoal">{pricingPackage.sportType?.replaceAll("_", " ") ?? "Semua olahraga"}</p><p className="mt-0.5 text-[10px] text-obc-muted">{pricingPackage.resource?.name ?? "Semua resource"}</p></td>
						<td className="whitespace-nowrap px-4 py-4"><span className="inline-flex items-center gap-1.5 rounded-md bg-[#F3F8E8] px-2.5 py-1.5 font-semibold text-obc-green"><CalendarDays size={13} />{pricingPackage.durationMinutes} menit</span></td>
						<td className="whitespace-nowrap px-4 py-4"><p className="font-heading text-[13px] font-bold text-obc-charcoal">{money(pricingPackage.packagePrice)}</p>{pricingPackage.discountPercent != null && pricingPackage.discountPercent > 0 && <p className="mt-0.5 text-[10px] font-medium text-obc-green">Diskon {pricingPackage.discountPercent}%</p>}</td>
						<td className="px-4 py-4"><span className="inline-flex min-w-8 justify-center rounded-md bg-[#F3F8E8] px-2 py-1 font-semibold text-obc-green">{pricingPackage.priority}</span></td>
						<td className="px-4 py-4">{statusSelect(pricingPackage, `paket ${pricingPackage.name}`)}</td>
						<td className="px-4 py-4">{actions(pricingPackage, `paket ${pricingPackage.name}`)}</td>
					</tr>) : <tr><td colSpan={columnCount} className="px-4 py-16 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F3F8E8] text-obc-green"><Search size={18} /></span><p className="mt-3 text-[13px] font-semibold text-obc-charcoal">{search.trim() ? "Tidak ada hasil pada halaman ini" : view === "rules" ? "Belum ada aturan tarif" : "Belum ada paket harga"}</p><p className="mt-1 text-[11px] text-obc-muted">{search.trim() ? "Coba kata kunci lain atau pindah halaman." : "Ubah filter status atau tambahkan data harga."}</p></td></tr>}
				</tbody>
			</table></div>
		</section>
	);
}

function resourceSlug(value: string | undefined) {
	return value ?? "";
}