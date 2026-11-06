import { useMemo, useState } from "react";
import { Clock3, Eye, Search, Trash2 } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { ActiveStatus, PricingRule } from "../SportService";
import type { CourtResource } from "../court/courtService";

type Props = {
	resources: CourtResource[];
	rules: PricingRule[];
	loading: boolean;
	onStatusChange: (item: PricingRule, status: ActiveStatus) => void;
	onView: (item: PricingRule, resource: CourtResource | null) => void;
	onDelete: (item: PricingRule) => void;
};

const PAGE_SIZE = 10;
const dayLabels: Record<PricingRule["dayType"], string> = { weekday: "Hari kerja", weekend: "Akhir pekan", holiday: "Hari libur" };
const statusLabels: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const statusClasses: Record<ActiveStatus, string> = { active: "!bg-[#E7F5D0] !text-[#1F3320]", inactive: "!bg-[#F1EFE8] !text-obc-muted" };
const timePeriods = [
	{ label: "Pagi", from: 0, to: 12 * 60, style: "bg-[#FBF0D3] text-[#8A6100]" },
	{ label: "Siang", from: 12 * 60, to: 17 * 60, style: "bg-[#E7F5D0] text-[#1F3320]" },
	{ label: "Malam", from: 17 * 60, to: 24 * 60, style: "bg-[#EAF4F0] text-[#296049]" },
];
const money = (value: number | null) => value == null ? "-" : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const toMinutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));

const getTimePeriods = (rule: PricingRule) => {
	const start = toMinutes(rule.tierStartTime);
	const end = toMinutes(rule.tierEndTime);
	return timePeriods.filter((period) => start < period.to && end > period.from);
};

export default function PricingTable({ resources, rules, loading, onStatusChange, onView, onDelete }: Props) {
	const [selectedResourceId, setSelectedResourceId] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? resources[0] ?? null;
	const rateUnitLabel = selectedResource?.sportTypes.includes("sepakbola") ? "2 jam" : "jam";
	const resourceRules = useMemo(() => rules.filter((rule) => selectedResource ? !rule.resource || rule.resource.id === selectedResource.id : !rule.resource), [rules, selectedResource?.id]);
	const filteredRules = useMemo(() => {
		const query = search.trim().toLowerCase();
		return resourceRules.filter((rule) => !query || [
			rule.id,
			dayLabels[rule.dayType],
			rule.tierStartTime,
			rule.tierEndTime,
			String(rule.pricePerHour),
			String(rule.minBookingPrice ?? ""),
			String(rule.minDurationMinutes ?? ""),
			String(rule.priority),
		].join(" ").toLowerCase().includes(query));
	}, [resourceRules, search]);
	const totalPages = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filteredRules.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const changeResource = (resourceId: string) => {
		setSelectedResourceId(resourceId);
		setPage(1);
	};

	const statusSelect = (rule: PricingRule) => <ThemedSelect label={`Status tarif ${rule.tierStartTime} ${dayLabels[rule.dayType]}`} value={rule.status} options={(["active", "inactive"] as ActiveStatus[]).map((status) => ({ value: status, label: statusLabels[status] }))} onValueChange={(value) => onStatusChange(rule, value as ActiveStatus)} className={`h-8 w-fit rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold ${statusClasses[rule.status]}`} />;

	return (
		<div className="space-y-3">
			{resources.length > 0 && <div role="tablist" aria-label="Filter lapang" className="flex gap-1 overflow-x-auto rounded-xl border border-obc-border bg-white p-1.5">
				{resources.map((resource) => <button key={resource.id} type="button" role="tab" aria-selected={selectedResource?.id === resource.id} onClick={() => changeResource(resource.id)} className={`shrink-0 rounded-lg px-3.5 py-2.5 text-[12px] font-semibold transition-colors ${selectedResource?.id === resource.id ? "bg-[#E7F5D0] text-[#1F3320]" : "text-obc-muted hover:bg-obc-ivory hover:text-obc-charcoal"}`}>{resource.name}</button>)}
			</div>}

			<section className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_2px_12px_rgba(31,51,32,0.04)]">
				<header className="flex flex-col gap-3 border-b border-obc-border bg-[#FDFCF7] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<div><h2 className="font-heading text-[14px] font-semibold text-obc-charcoal">{selectedResource?.name ?? "Aturan tarif umum"}</h2><p className="mt-0.5 text-[11px] text-obc-muted">{filteredRules.length} aturan tarif{selectedResource && rules.some((rule) => !rule.resource) ? " termasuk aturan umum" : ""}</p></div>
					<label className="relative block w-full sm:w-75"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Cari jam, hari, tarif..." aria-label="Cari aturan tarif lapang" className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[12px] outline-none transition-colors focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]" /></label>
				</header>
				<div className="overflow-x-auto"><table className="w-full min-w-230 text-left text-[12px]">
					<thead><tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3.5">Jam & hari</th><th className="px-4 py-3.5">Periode</th><th className="px-4 py-3.5">Tarif / {rateUnitLabel}</th><th className="px-4 py-3.5">Batas booking</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5 text-right">Aksi</th></tr></thead>
					<tbody>
						{loading ? <tr><td colSpan={6} className="px-4 py-16 text-center text-obc-muted"><span className="inline-flex items-center gap-2"><span className="size-4 animate-spin rounded-full border-2 border-obc-border border-t-obc-green" />Memuat tarif lapang...</span></td></tr> : rows.length ? rows.map((rule) => <tr key={rule.id} className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]">
							<td className="whitespace-nowrap px-4 py-4"><p className="inline-flex items-center gap-1.5 font-semibold text-obc-charcoal"><Clock3 size={14} className="text-obc-green" />{rule.tierStartTime}–{rule.tierEndTime}</p><p className="mt-1"><span className="rounded-md bg-[#F1EFE8] px-2 py-1 text-[10px] font-medium text-obc-charcoal">{dayLabels[rule.dayType]}</span></p>{!rule.resource && <p className="mt-1 text-[9px] text-obc-muted">Berlaku untuk semua lapang</p>}</td>
							<td className="px-4 py-4"><div className="flex flex-wrap gap-1">{getTimePeriods(rule).map((period) => <span key={period.label} className={`rounded-md px-2 py-1 text-[10px] font-semibold ${period.style}`}>{period.label}</span>)}</div></td>
							<td className="whitespace-nowrap px-4 py-4"><p className="font-heading text-[14px] font-bold text-obc-charcoal">{money(rule.pricePerHour)}</p></td>
							<td className="px-4 py-4"><p className="font-medium text-obc-charcoal">{rule.minBookingPrice == null ? "Tanpa minimum" : `Min. ${money(rule.minBookingPrice)}`}</p><p className="mt-1 text-[10px] text-obc-muted">Durasi {rule.minDurationMinutes == null ? "bebas" : `${rule.minDurationMinutes} menit`}</p></td>
							<td className="px-4 py-4">{statusSelect(rule)}</td>
							<td className="px-4 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => onView(rule, selectedResource)} title="Lihat detail" aria-label={`Detail tarif ${rule.tierStartTime} ${dayLabels[rule.dayType]}`} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green"><Eye size={14} /></button><button type="button" onClick={() => onDelete(rule)} title="Hapus aturan tarif" aria-label={`Hapus tarif ${rule.tierStartTime} ${dayLabels[rule.dayType]}`} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-red hover:bg-red-50 hover:text-obc-red"><Trash2 size={14} /></button></div></td>
						</tr>) : <tr><td colSpan={6} className="px-4 py-16 text-center"><span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F3F8E8] text-obc-green"><Search size={18} /></span><p className="mt-3 text-[13px] font-semibold text-obc-charcoal">{search.trim() ? "Tidak ada hasil pada lapang ini" : "Belum ada aturan tarif untuk lapang ini"}</p><p className="mt-1 text-[11px] text-obc-muted">{search.trim() ? "Coba kata kunci lain." : "Pilih lapang lain atau tambahkan aturan tarif."}</p></td></tr>}
					</tbody>
				</table></div>
				<Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filteredRules.length} pageSize={PAGE_SIZE} itemLabel="aturan tarif" disabled={loading} className="flex flex-col gap-3 border-t border-obc-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5" />
			</section>
		</div>
	);
}