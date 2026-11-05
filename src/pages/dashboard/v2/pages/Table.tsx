import { Pencil, Trash2 } from "lucide-react";
import type { CmsPage, CmsPageStatus } from "./pageService";

type Props = {
	pages: CmsPage[];
	loading: boolean;
	onEdit: (page: CmsPage) => void;
	onDelete: (page: CmsPage) => void;
	onStatusChange: (page: CmsPage, status: CmsPageStatus) => void;
	updatingId: string | null;
};

const statusClasses: Record<CmsPageStatus, string> = {
	draft: "bg-[#F1EFE8] text-obc-muted",
	published: "bg-[#E7F5D0] text-[#1F3320]",
	archived: "bg-[#FDF2F2] text-[#B42318]",
};

export default function CmsPageTable({ pages, loading, onEdit, onDelete, onStatusChange, updatingId }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar halaman CMS</h2><p className="mt-0.5 text-[12px] text-obc-muted">{pages.length.toLocaleString("id-ID")} halaman</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Halaman</th><th className="px-5 py-3.5">Tipe</th><th className="px-5 py-3.5">Section</th><th className="px-5 py-3.5">Urutan</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Memuat halaman CMS...</td></tr> : pages.length ? pages.map((page) => <tr key={page.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
					<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{page.title}</p><p className="text-[11px] text-obc-muted">/{page.slug}</p></td>
					<td className="px-5 py-3.5 capitalize text-obc-muted">{page.pageType}</td>
					<td className="px-5 py-3.5 text-obc-muted">{page.sections?.length ?? 0}</td>
					<td className="px-5 py-3.5 text-obc-muted">{page.sortOrder}</td>
					<td className="px-5 py-3.5"><select aria-label={`Status halaman ${page.title}`} value={page.status} disabled={updatingId === page.id} onChange={(event) => onStatusChange(page, event.target.value as CmsPageStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none disabled:opacity-50 ${statusClasses[page.status]}`}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></td>
					<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onEdit(page)} aria-label={`Ubah ${page.title}`} title="Ubah halaman" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(page)} aria-label={`Hapus ${page.title}`} title="Hapus halaman" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
				</tr>) : <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Belum ada halaman CMS.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
