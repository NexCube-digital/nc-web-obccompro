import { Pencil, Star, Trash2 } from "lucide-react";
import { getPackageImageUrl, type ServicePackage } from "./packageService";

type Props = {
	packages: ServicePackage[];
	loading: boolean;
	onEdit: (packageItem: ServicePackage) => void;
	onDelete: (packageItem: ServicePackage) => void;
	onTogglePopular: (packageItem: ServicePackage) => void;
	onToggleStatus: (packageItem: ServicePackage) => void;
};

const rupiah = (price: number) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
}).format(price);

export default function PackageTable({ packages, loading, onEdit, onDelete, onTogglePopular, onToggleStatus }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar paket</h2><p className="mt-0.5 text-[12px] text-obc-muted">{packages.length.toLocaleString("id-ID")} paket</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Paket</th><th className="px-5 py-3.5">Tipe / Tier</th><th className="px-5 py-3.5 text-right">Harga</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Populer</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Memuat paket...</td></tr> : packages.length ? packages.map((packageItem) => {
					const image = packageItem.images[0];
					return <tr key={packageItem.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
						<td className="px-5 py-3.5"><div className="flex items-center gap-3">{image ? <img src={getPackageImageUrl(image.url)} alt="" className="size-11 shrink-0 rounded-lg object-cover" /> : <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#EBEEDC] text-[11px] font-semibold text-[#404F14]">OBC</span>}<div className="min-w-0"><p className="truncate font-semibold text-obc-charcoal">{packageItem.name}</p><p className="max-w-[300px] truncate text-[11px] text-obc-muted">{packageItem.description || `${packageItem.features?.length ?? 0} fitur`}</p></div></div></td>
						<td className="px-5 py-3.5"><p className="capitalize text-obc-charcoal">{packageItem.type}</p><p className="text-[11px] text-obc-muted">{packageItem.tier || "Tanpa tier"}</p></td>
						<td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold">{rupiah(packageItem.price)}</td>
						<td className="px-5 py-3.5"><button type="button" onClick={() => onToggleStatus(packageItem)} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${packageItem.status === "active" ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-[#F1EFE8] text-obc-muted"}`}>{packageItem.status === "active" ? "Aktif" : "Nonaktif"}</button></td>
						<td className="px-5 py-3.5"><button type="button" onClick={() => onTogglePopular(packageItem)} aria-label={packageItem.isPopular ? "Hapus tanda populer" : "Tandai populer"} title={packageItem.isPopular ? "Hapus tanda populer" : "Tandai populer"} className={`grid size-8 place-items-center rounded-lg ${packageItem.isPopular ? "text-amber-600 hover:bg-amber-50" : "text-obc-muted hover:bg-[#F1EFE8]"}`}><Star size={16} fill={packageItem.isPopular ? "currentColor" : "none"} /></button></td>
						<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onEdit(packageItem)} aria-label={`Ubah ${packageItem.name}`} title="Ubah paket" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(packageItem)} aria-label={`Hapus ${packageItem.name}`} title="Hapus paket" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
					</tr>;
				}) : <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Belum ada paket yang sesuai.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
