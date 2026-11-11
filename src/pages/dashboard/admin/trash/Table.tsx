import { useMemo, useState } from "react";
import {
	ArchiveRestore,
	CalendarClock,
	Clock3,
	FileSearch,
	RotateCcw,
	Search,
	Trash2,
} from "lucide-react";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { TrashItem } from "../../services/admin/trashService";

type Props = {
	items: TrashItem[];
	loading: boolean;
	processingId: string | null;
	onRestore: (item: TrashItem) => void;
	onDelete: (item: TrashItem) => void;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const ENTITY_LABELS: Record<string, string> = {
	Tenant: "Unit bisnis",
	User: "User",
	Resource: "Lapangan / fasilitas",
	PricingRule: "Aturan harga",
	PricingPackage: "Paket harga",
	SportsMembershipPackage: "Paket membership",
	CmsPage: "Halaman CMS",
	CmsSection: "Section CMS",
	Media: "Media",
	Promotion: "Promo",
	Contact: "Kontak",
	ComproInvoice: "Invoice",
	Finance: "Keuangan",
	Portfolio: "Portfolio",
	ServicePackage: "Paket layanan",
	Testimonial: "Testimoni",
	Team: "Tim",
	Report: "Laporan",
};

function daysRemaining(deletedAt: string): number {
	const expiresAt = new Date(deletedAt).getTime() + 30 * DAY_MS;
	return Math.max(0, Math.ceil((expiresAt - Date.now()) / DAY_MS));
}

function formatDate(value: string): string {
	return new Date(value).toLocaleString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function TrashTable({
	items,
	loading,
	processingId,
	onRestore,
	onDelete,
}: Props) {
	const [query, setQuery] = useState("");
	const [entityFilter, setEntityFilter] = useState("all");
	const entityTypes = useMemo(
		() => [...new Set(items.map((item) => item.entityType))].sort(),
		[items],
	);
	const filteredItems = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return items.filter((item) => {
			const matchesType = entityFilter === "all" || item.entityType === entityFilter;
			const matchesQuery = `${item.title} ${ENTITY_LABELS[item.entityType] ?? item.entityType}`
				.toLowerCase()
				.includes(normalizedQuery);
			return matchesType && matchesQuery;
		});
	}, [entityFilter, items, query]);

	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_3px_14px_rgba(31,51,32,0.05)]">
			<div className="flex flex-col gap-4 border-b border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<div>
					<h2 className="font-heading text-[15px] font-bold text-obc-charcoal">Item di Sampah</h2>
					<p className="mt-1 text-[11px] text-obc-muted">
						{loading ? "Memuat data..." : `${filteredItems.length.toLocaleString("id-ID")} dari ${items.length.toLocaleString("id-ID")} item`}
					</p>
				</div>
				<div className="grid gap-2 sm:flex sm:items-center">
					<label className="relative block">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input
							type="search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Cari item..."
							aria-label="Cari item di Sampah"
								className="h-9 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[12px] text-obc-charcoal outline-none transition focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178] sm:w-56"
						/>
					</label>
						<ThemedSelect
							label="Filter jenis item"
							value={entityFilter}
							options={[
								{ value: "all", label: "Semua jenis" },
								...entityTypes.map((type) => ({
									value: type,
									label: ENTITY_LABELS[type] ?? type,
								})),
							]}
							onValueChange={setEntityFilter}
							className="w-full sm:w-48"
						/>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-190 text-left text-[12px]">
					<thead>
						<tr className="bg-[#F7F8F3] font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
							<th className="px-4 py-3.5 sm:px-5">Item</th>
							<th className="px-4 py-3.5">Jenis</th>
							<th className="px-4 py-3.5">Tanggal dihapus</th>
							<th className="px-4 py-3.5">Sisa retensi</th>
							<th className="px-4 py-3.5 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							Array.from({ length: 4 }, (_, index) => (
								<tr key={index} className="border-t border-obc-border">
									<td colSpan={5} className="px-5 py-4">
										<div className="h-5 w-full animate-pulse rounded bg-[#F0F2EC]" />
									</td>
								</tr>
							))
						) : filteredItems.length === 0 ? (
							<tr>
								<td colSpan={5} className="px-5 py-16 text-center">
									<span className="mx-auto grid size-12 place-items-center rounded-full bg-[#F0F5E8] text-obc-green">
										{items.length ? <FileSearch size={20} /> : <ArchiveRestore size={20} />}
									</span>
									<p className="mt-3 font-heading text-[14px] font-bold text-obc-charcoal">
										{items.length ? "Item tidak ditemukan" : "Sampah kosong"}
									</p>
									<p className="mt-1 text-[11px] text-obc-muted">
										{items.length ? "Ubah kata kunci atau jenis filter." : "Belum ada data yang dipindahkan ke Sampah."}
									</p>
								</td>
							</tr>
						) : filteredItems.map((item) => {
							const key = `${item.entityType}:${item.entityId}`;
							const remaining = daysRemaining(item.deletedAt);
							const urgent = remaining <= 3;
							const soon = remaining <= 7;
							return (
								<tr key={key} className="border-t border-obc-border transition-colors hover:bg-[#FAFBF7]">
									  <td className="max-w-90 px-4 py-4 sm:px-5">
										<div className="flex min-w-0 items-center gap-3">
											<span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#E4EBCF] bg-[#F2F6E8] text-obc-green">
												<ArchiveRestore size={17} />
											</span>
											<span className="min-w-0">
												<span className="block truncate font-semibold text-obc-charcoal">{item.title}</span>
												<span className="mt-1 block truncate font-mono text-[10px] text-obc-muted">{item.entityType}</span>
											</span>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-4">
										<span className="rounded-md border border-obc-border bg-white px-2.5 py-1.5 text-[10px] font-semibold text-obc-charcoal">
											{ENTITY_LABELS[item.entityType] ?? item.entityType}
										</span>
									</td>
									<td className="whitespace-nowrap px-4 py-4">
										<span className="inline-flex items-center gap-2 text-[11px] text-obc-charcoal">
											<CalendarClock size={14} className="text-obc-muted" />
											{formatDate(item.deletedAt)}
										</span>
									</td>
									<td className="min-w-40 px-4 py-4">
										<div className="flex items-center justify-between gap-3">
											<span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] ${urgent ? "font-semibold text-obc-red" : soon ? "font-semibold text-[#9A6B00]" : "text-obc-charcoal"}`}>
												<Clock3 size={13} />
												{remaining === 0 ? "Hari ini" : `${remaining} hari`}
											</span>
											<span className="h-1.5 w-16 overflow-hidden rounded-full bg-[#EEF0E9]">
												<span
													className={`block h-full rounded-full ${urgent ? "bg-obc-red" : soon ? "bg-[#D6A53D]" : "bg-obc-green"}`}
													style={{ width: `${Math.min(100, (remaining / 30) * 100)}%` }}
												/>
											</span>
										</div>
									</td>
									<td className="px-4 py-4">
										<div className="flex justify-end gap-1.5">
											<button
												type="button"
												title="Pulihkan"
												aria-label={`Pulihkan ${item.title}`}
												disabled={processingId === key}
												onClick={() => onRestore(item)}
												className="grid size-9 place-items-center rounded-lg border border-[#DDE8C8] bg-[#F5F9EE] text-obc-green transition-colors hover:bg-[#E9F2D8] disabled:opacity-50"
											>
												<RotateCcw size={15} />
											</button>
											<button
												type="button"
												title="Hapus permanen"
												aria-label={`Hapus permanen ${item.title}`}
												disabled={processingId === key}
												onClick={() => onDelete(item)}
												className="grid size-9 place-items-center rounded-lg border border-[#F0D8D8] bg-[#FFF9F8] text-obc-red transition-colors hover:bg-red-50 disabled:opacity-50"
											>
												<Trash2 size={15} />
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{!loading && filteredItems.length > 0 && (
				<footer className="flex items-center justify-between border-t border-obc-border bg-[#FDFCF7] px-4 py-3 text-[10px] text-obc-muted sm:px-5">
					<span>Urut berdasarkan tanggal dihapus</span>
					<span>{filteredItems.length.toLocaleString("id-ID")} item ditampilkan</span>
				</footer>
			)}
		</section>
	);
}
