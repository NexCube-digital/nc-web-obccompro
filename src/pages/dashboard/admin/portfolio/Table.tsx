import { Pencil, Star, Trash2 } from "lucide-react";
import { getPortfolioImageUrl, type Portfolio } from "./portfolioService";

type Props = {
	portfolios: Portfolio[];
	loading: boolean;
	onEdit: (portfolio: Portfolio) => void;
	onDelete: (portfolio: Portfolio) => void;
	onToggleFeatured: (portfolio: Portfolio) => void;
};

export default function PortfolioTable({ portfolios, loading, onEdit, onDelete, onToggleFeatured }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5">
				<h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar portfolio</h2>
				<p className="mt-0.5 text-[12px] text-obc-muted">{portfolios.length.toLocaleString("id-ID")} proyek</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[820px] text-left">
					<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Proyek</th><th className="px-5 py-3.5">Kategori</th><th className="px-5 py-3.5">Klien</th><th className="px-5 py-3.5">Unggulan</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
					<tbody className="text-[13px]">
						{loading ? <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat portfolio...</td></tr> : portfolios.length ? portfolios.map((portfolio) => {
							const imageUrl = getPortfolioImageUrl(portfolio.imageUrl);
							return <tr key={portfolio.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
								<td className="px-5 py-3.5"><div className="flex items-center gap-3">{imageUrl ? <img src={imageUrl} alt="" className="size-12 shrink-0 rounded-lg object-cover" /> : <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#EBEEDC] text-[11px] font-semibold text-[#404F14]">OBC</span>}<div className="min-w-0"><p className="truncate font-semibold text-obc-charcoal">{portfolio.title}</p><p className="max-w-[360px] truncate text-[11px] text-obc-muted">{portfolio.description || portfolio.technologies || "-"}</p></div></div></td>
								<td className="px-5 py-3.5"><span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium text-obc-muted">{portfolio.category}</span></td>
								<td className="px-5 py-3.5 text-obc-muted">{portfolio.client || "-"}</td>
								<td className="px-5 py-3.5"><button type="button" onClick={() => onToggleFeatured(portfolio)} aria-label={portfolio.featured ? "Hapus dari unggulan" : "Jadikan unggulan"} title={portfolio.featured ? "Hapus dari unggulan" : "Jadikan unggulan"} className={`grid size-8 place-items-center rounded-lg transition-colors ${portfolio.featured ? "text-amber-600 hover:bg-amber-50" : "text-obc-muted hover:bg-[#F1EFE8]"}`}><Star size={17} fill={portfolio.featured ? "currentColor" : "none"} /></button></td>
								<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onEdit(portfolio)} aria-label={`Ubah ${portfolio.title}`} title="Ubah" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(portfolio)} aria-label={`Hapus ${portfolio.title}`} title="Hapus" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
							</tr>;
						}) : <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Belum ada portfolio.</td></tr>}
					</tbody>
				</table>
			</div>
		</section>
	);
}
