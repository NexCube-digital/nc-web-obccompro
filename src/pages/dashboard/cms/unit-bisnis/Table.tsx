import { Building2, Eye, ImageOff } from "lucide-react";
import { getMediaUrl } from "../../v2/media/mediaService";
import type { BusinessUnit } from "./unitbisnisService";

type Props = {
	units: BusinessUnit[];
	loading: boolean;
	selectedSlug: string | null;
	onView: (unit: BusinessUnit) => void;
};

function getConfigString(config: Record<string, unknown>, key: string): string {
	return typeof config[key] === "string" ? config[key] : "";
}

export default function BusinessUnitTable({ units, loading, selectedSlug, onView }: Props) {
	return (
		<section>
			{loading ? (
				<div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 8 }, (_, index) => <div key={index} className="overflow-hidden rounded-xl border border-obc-border bg-white"><div className="aspect-[4/3] animate-pulse bg-[#ECEFE7]" /><div className="space-y-2.5 p-3.5"><div className="h-3 w-1/3 animate-pulse rounded bg-[#ECEFE7]" /><div className="h-4 w-2/3 animate-pulse rounded bg-[#ECEFE7]" /><div className="h-3 w-1/2 animate-pulse rounded bg-[#ECEFE7]" /></div></div>)}
				</div>
			) : units.length ? (
				<div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-4">
					{units.map((unit) => {
						const imageUrl = getConfigString(unit.config, "imageUrl");
						const category = getConfigString(unit.config, "category").replace(/([A-Z])/g, " $1") || "Unit bisnis";
						const isActive = unit.status === "active";
						return (
							<article key={unit.id} className={`group min-w-0 overflow-hidden rounded-xl border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(52,49,51,0.1)] ${selectedSlug === unit.slug ? "border-obc-green ring-2 ring-[#CDF178]/50" : "border-obc-border hover:border-obc-status-locked-border"}`}>
								<div className="relative aspect-[4/3] overflow-hidden bg-[#ECEFE7]">
									<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[#7C856E]"><ImageOff size={22} strokeWidth={1.5} /><span className="text-[9px] font-semibold uppercase tracking-widest">Belum ada gambar</span></div>
									{imageUrl && <img src={getMediaUrl(imageUrl)} alt={unit.name} loading="lazy" decoding="async" onError={(event) => event.currentTarget.remove()} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />}
									<span className="absolute left-2.5 top-2.5 max-w-[65%] truncate rounded-md border border-white/70 bg-white/90 px-2 py-1 text-[9px] font-bold capitalize text-obc-charcoal shadow-sm backdrop-blur">{category}</span>
									<span className={`absolute bottom-2.5 left-2.5 rounded-md px-2 py-1 text-[9px] font-bold ${isActive ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-white/90 text-obc-muted"}`}>{isActive ? "Aktif" : "Nonaktif"}</span>
									<div className="absolute right-2.5 top-2.5 flex gap-1">
										<button type="button" title="Lihat detail" aria-label={`Lihat detail ${unit.name}`} onClick={() => onView(unit)} className="grid size-8 place-items-center rounded-lg border border-white/70 bg-white/95 text-obc-charcoal shadow-sm transition hover:bg-obc-green hover:text-white"><Eye size={14} /></button>
									</div>
								</div>
								<div className="p-3.5">
									<p className="truncate font-heading text-[14px] font-semibold text-obc-charcoal" title={unit.name}>{unit.name}</p>
									<p className="mt-0.5 truncate font-mono text-[10px] text-obc-muted">/{unit.slug}</p>
									<p className="mt-2 line-clamp-2 min-h-8 text-[11px] leading-4 text-obc-muted">{unit.description || "Unit bisnis OBC Group"}</p>
									<div className="mt-3 flex items-center justify-between border-t border-obc-border pt-2.5 text-[10px]">
										<span className="font-medium text-obc-olive">{category}</span>
										<span className="inline-flex items-center gap-1 text-obc-muted"><Building2 size={12} />{unit.resourceCount} resource</span>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			) : (
				<div className="rounded-xl border border-dashed border-obc-status-locked-border bg-[#FAFBF7] px-5 py-12 text-center">
					<span className="mx-auto grid size-11 place-items-center rounded-xl bg-[#E7F5D0] text-obc-green"><Building2 size={19} /></span>
					<h3 className="mt-3 font-heading text-[15px] font-semibold text-obc-charcoal">Unit bisnis belum ditemukan</h3>
					<p className="mt-1 text-[12px] text-obc-muted">Tambahkan unit baru atau ubah kata kunci pencarian.</p>
				</div>
			)}
		</section>
	);
}