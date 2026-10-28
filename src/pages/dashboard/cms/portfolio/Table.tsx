import { Pencil, Trash2 } from "lucide-react";
import { getPortfolioImageUrl, type Portfolio } from "./portfolioService";

type Props = {
	portfolios: Portfolio[];
	loading: boolean;
	onEdit: (portfolio: Portfolio) => void;
	onDelete: (portfolio: Portfolio) => void;
};

export default function PortfolioTable({ portfolios, loading, onEdit, onDelete }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5">
				<h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar portfolio</h2>
				<p className="mt-0.5 text-[12px] text-obc-muted">{portfolios.length.toLocaleString("id-ID")} proyek</p>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full min-w-[620px] text-left">
					<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Gambar & Judul</th><th className="px-5 py-3.5">Kategori</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
					<tbody className="text-[13px]">
						{loading ? <tr><td colSpan={3} className="px-5 py-12 text-center text-obc-muted">Memuat portfolio...</td></tr> : portfolios.length ? portfolios.map((portfolio) => {
							const imageUrl = getPortfolioImageUrl(portfolio.imageUrl);
							return <tr key={portfolio.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
								<td className="px-5 py-3.5"><div className="flex items-center gap-3">{imageUrl ? <img src={imageUrl} alt={portfolio.title} className="size-12 shrink-0 rounded-lg object-cover" /> : <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#EBEEDC] text-[11px] font-semibold text-[#404F14]">OBC</span>}<p className="font-semibold text-obc-charcoal">{portfolio.title}</p></div></td>
								<td className="px-5 py-3.5"><span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium text-obc-muted">{portfolio.category}</span></td>
								<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onEdit(portfolio)} aria-label={`Ubah ${portfolio.title}`} title="Ubah" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(portfolio)} aria-label={`Hapus ${portfolio.title}`} title="Hapus" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
							</tr>;
						}) : <tr><td colSpan={3} className="px-5 py-12 text-center text-obc-muted">Belum ada portfolio.</td></tr>}
					</tbody>
				</table>
			</div>
		</section>
	);
}
