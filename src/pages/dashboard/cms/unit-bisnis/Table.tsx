import { Building2, Eye, Pencil, Power, PowerOff } from "lucide-react";
import { getMediaUrl } from "../media/mediaService";
import type { BusinessUnit } from "./unitbisnisService";

type Props = {
	units: BusinessUnit[];
	loading: boolean;
	selectedSlug: string | null;
	onView: (unit: BusinessUnit) => void;
	onEdit: (unit: BusinessUnit) => void;
	onDeactivate: (unit: BusinessUnit) => void;
	onActivate: (unit: BusinessUnit) => void;
};

function getConfigString(config: Record<string, unknown>, key: string): string {
	return typeof config[key] === "string" ? config[key] : "";
}

export default function BusinessUnitTable({ units, loading, selectedSlug, onView, onEdit, onDeactivate, onActivate }: Props) {
	return (
		<div className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="overflow-x-auto">
				<table className="w-full min-w-180 border-collapse text-left">
					<thead className="bg-obc-ivory text-[12px] font-semibold uppercase tracking-wide text-obc-muted">
						<tr>
							<th scope="col" className="px-4 py-3 text-center">Gambar</th>
							<th scope="col" className="px-4 py-3">Nama unit bisnis</th>
							<th scope="col" className="px-4 py-3">Slug</th>
							<th scope="col" className="px-4 py-3">Kategori</th>
							<th scope="col" className="px-4 py-3 text-center">Fasilitas</th>
						<th scope="col" className="px-4 py-3 text-center">Status</th>
						<th scope="col" className="px-4 py-3 text-right">Aksi</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-obc-border text-[13px] text-obc-charcoal">
						{loading ? (
							<tr><td colSpan={7} className="px-4 py-10 text-center text-obc-muted">Memuat unit bisnis dari backend...</td></tr>
						) : units.length ? units.map((unit) => (
							<tr key={unit.id} className={selectedSlug === unit.slug ? "bg-[#F4F8EC]" : "hover:bg-obc-hover-surface"}>
							<td className="px-4 py-3 text-center">
								{typeof unit.config.imageUrl === "string" && unit.config.imageUrl ? (
									<img src={getMediaUrl(unit.config.imageUrl)} alt="" className="mx-auto size-12 rounded-lg object-cover" />
								) : (
									<span className="mx-auto grid size-12 place-items-center rounded-lg bg-obc-ivory text-obc-muted"><Building2 size={18} /></span>
								)}
							</td>
							<td className="px-4 py-3 font-medium">{unit.name}</td>
							<td className="px-4 py-3 text-obc-muted">{unit.slug}</td>
							<td className="px-4 py-3">{getConfigString(unit.config, "category") || "-"}</td>
								<td className="px-4 py-3 text-center">{unit.resourceCount}</td>
								<td className="px-4 py-3 text-center">
									<span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${unit.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{unit.status === "active" ? "Aktif" : "Nonaktif"}</span>
								</td>
								<td className="px-4 py-3 text-right">
									<div className="inline-flex gap-1.5">
										<button type="button" title="Lihat detail" onClick={() => onView(unit)} className="grid size-8 place-items-center rounded-lg border border-obc-border hover:border-obc-green"><Eye size={14} /></button>
										<button type="button" title="Edit" onClick={() => onEdit(unit)} className="grid size-8 place-items-center rounded-lg border border-obc-border hover:border-obc-green"><Pencil size={14} /></button>
										<button type="button" title={unit.status === "active" ? "Nonaktifkan" : "Aktifkan"} onClick={() => unit.status === "active" ? onDeactivate(unit) : onActivate(unit)} className="grid size-8 place-items-center rounded-lg border border-obc-border hover:border-obc-green">
											{unit.status === "active" ? <PowerOff size={14} /> : <Power size={14} />}
										</button>
									</div>
								</td>
							</tr>
						)) : (
							<tr><td colSpan={7} className="px-4 py-10 text-center text-obc-muted">Tidak ada unit bisnis yang cocok dengan pencarian.</td></tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}