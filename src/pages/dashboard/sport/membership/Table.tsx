import { Pencil, Trash2 } from "lucide-react";
import type { ActiveStatus, MembershipPackage } from "../SportService";

type Props = {
	packages: MembershipPackage[];
	loading: boolean;
	onStatusChange: (item: MembershipPackage, status: ActiveStatus) => void;
	onEdit: (item: MembershipPackage) => void;
	onDelete: (item: MembershipPackage) => void;
};

const packageStatuses: ActiveStatus[] = ["active", "inactive"];
const statusLabels: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const statusClasses: Record<ActiveStatus, string> = { active: "bg-[#E7F5D0] text-[#1F3320]", inactive: "bg-[#F1EFE8] text-obc-muted" };
const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function MembershipTable({ packages, loading, onStatusChange, onEdit, onDelete }: Props) {
	return (
		<div className="overflow-x-auto"><table className="w-full min-w-212.5 text-left text-[13px]">
			<thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3">Paket</th><th className="px-4 py-3">Cabang / resource</th><th className="px-4 py-3">Sesi & masa berlaku</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
			<tbody>
				{loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-obc-muted">Memuat paket membership...</td></tr> : packages.length ? packages.map((item) => <tr key={item.id} className="border-t border-obc-border align-top">
					<td className="px-4 py-3"><p className="font-semibold text-obc-charcoal">{item.name}</p><p className="max-w-80 text-[11px] text-obc-muted">{item.description || "-"}</p></td>
					<td className="px-4 py-3 capitalize"><p>{item.sportType}</p><p className="text-[11px] text-obc-muted">{item.resource?.name || "Semua resource"}</p></td>
					<td className="px-4 py-3">{item.totalSessions} sesi<p className="text-[11px] text-obc-muted">Berlaku {item.validityDays} hari</p></td>
					<td className="whitespace-nowrap px-4 py-3"><p className="font-semibold">{money(item.memberPrice)}</p><p className="text-[11px] text-obc-muted">Harga normal {money(item.originalPrice)} · diskon {item.discountPercent}%</p></td>
					<td className="px-4 py-3"><select aria-label={`Status paket ${item.name}`} value={item.status} onChange={(event) => onStatusChange(item, event.target.value as ActiveStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${statusClasses[item.status]}`}>{packageStatuses.map((entry) => <option key={entry} value={entry}>{statusLabels[entry]}</option>)}</select></td>
					<td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => onEdit(item)} title="Ubah paket membership" aria-label={`Ubah paket ${item.name}`} className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-obc-status-locked-bg hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(item)} title="Nonaktifkan paket membership" aria-label={`Nonaktifkan paket ${item.name}`} className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
				</tr>) : <tr><td colSpan={6} className="px-4 py-12 text-center text-obc-muted">Belum ada paket membership.</td></tr>}
			</tbody>
		</table></div>
	);
}
