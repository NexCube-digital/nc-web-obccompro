import { Languages, Pencil, Trash2 } from "lucide-react";
import type { CmsLanguage, CmsSection, CmsSectionStatus } from "./sectionService";

type Props = {
	sections: CmsSection[];
	loading: boolean;
	updatingId: string | null;
	onEdit: (section: CmsSection) => void;
	onDelete: (section: CmsSection) => void;
	onStatusChange: (section: CmsSection, status: CmsSectionStatus) => void;
	onTranslate: (section: CmsSection, language: CmsLanguage) => void;
};

export default function CmsSectionTable({ sections, loading, updatingId, onEdit, onDelete, onStatusChange, onTranslate }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar section</h2><p className="mt-0.5 text-[12px] text-obc-muted">{sections.length.toLocaleString("id-ID")} section</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Section</th><th className="px-5 py-3.5">Halaman</th><th className="px-5 py-3.5">Urutan</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Terjemahan</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Memuat section CMS...</td></tr> : sections.length ? sections.map((section) => <tr key={section.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
					<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{section.title}</p><p className="text-[11px] text-obc-muted">{section.sectionKey} · {section.sectionType}</p></td>
					<td className="px-5 py-3.5"><p className="text-obc-charcoal">{section.page.title}</p><p className="text-[11px] text-obc-muted">/{section.page.slug}</p></td>
					<td className="px-5 py-3.5 text-obc-muted">{section.sortOrder}</td>
					<td className="px-5 py-3.5"><select aria-label={`Status ${section.title}`} value={section.status} disabled={updatingId === section.id} onChange={(event) => onStatusChange(section, event.target.value as CmsSectionStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none disabled:opacity-50 ${section.status === "active" ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-[#F1EFE8] text-obc-muted"}`}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></td>
					<td className="px-5 py-3.5"><div className="flex gap-1.5">{(["id", "en"] as const).map((language) => { const translated = section.translations.some((item) => item.language === language); return <button key={language} type="button" onClick={() => onTranslate(section, language)} title={`${translated ? "Ubah" : "Tambah"} terjemahan ${language.toUpperCase()}`} className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-[11px] font-semibold ${translated ? "border-[#9AAD3E] bg-[#F6F9E9] text-[#404F14]" : "border-obc-border text-obc-muted hover:bg-[#FDFCF7]"}`}><Languages size={13} />{language.toUpperCase()}</button>; })}</div></td>
					<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onEdit(section)} aria-label={`Ubah section ${section.title}`} title="Ubah section" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(section)} aria-label={`Hapus section ${section.title}`} title="Hapus section" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
				</tr>) : <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Belum ada section yang sesuai.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
