import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import type { CmsPage } from "../pages/pageService";
import { cmsSectionService, type CmsLanguage, type CmsSection, type CmsSectionInput, type CmsSectionStatus, type CmsSectionType } from "./sectionService";

type SectionFormProps = {
	section: CmsSection | null;
	pages: CmsPage[];
	onCancel: () => void;
	onSaved: () => void;
};

type TranslationFormProps = {
	section: CmsSection;
	language: CmsLanguage;
	onCancel: () => void;
	onSaved: (translation: Awaited<ReturnType<typeof cmsSectionService.saveTranslation>>) => void;
};

const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";

function stringifyContent(content: unknown): string {
	if (content === null || content === undefined) return "";
	return JSON.stringify(content, null, 2) ?? "";
}

function parseContent(content: string): unknown {
	if (!content.trim()) return null;
	return JSON.parse(content) as unknown;
}

export default function CmsSectionForm({ section, pages, onCancel, onSaved }: SectionFormProps) {
	const [pageId, setPageId] = useState(section?.pageId ?? "");
	const [sectionKey, setSectionKey] = useState(section?.sectionKey ?? "");
	const [title, setTitle] = useState(section?.title ?? "");
	const [sectionType, setSectionType] = useState<CmsSectionType>(section?.sectionType ?? "custom");
	const [sortOrder, setSortOrder] = useState(String(section?.sortOrder ?? 0));
	const [status, setStatus] = useState<CmsSectionStatus>(section?.status ?? "active");
	const [contentText, setContentText] = useState(stringifyContent(section?.content));
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let content: unknown;
		try {
			content = parseContent(contentText);
		} catch {
			toast.error("Content harus berupa JSON yang valid.");
			return;
		}

		const payload: CmsSectionInput = {
			pageId,
			sectionKey: sectionKey.trim(),
			title: title.trim(),
			sectionType,
			content,
			sortOrder: Number(sortOrder),
			...(section ? { status } : {}),
		};
		setSaving(true);
		try {
			if (section) {
				await cmsSectionService.updateSection(section.id, payload);
				toast.success("Section berhasil diperbarui.");
			} else {
				const { status: _status, ...createPayload } = payload;
				await cmsSectionService.createSection(createPayload);
				toast.success("Section berhasil dibuat.");
			}
			onSaved();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{section ? "Ubah section" : "Section baru"}</h2><p className="mt-1 text-[12px] text-obc-muted">Content disimpan sebagai JSON.</p></div><button type="button" onClick={onCancel} aria-label="Tutup form section" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
			<div className="grid gap-4 sm:grid-cols-2">
				<label className={labelClass}>Halaman<select className={inputClass} value={pageId} onChange={(event) => setPageId(event.target.value)} required><option value="">Pilih halaman</option>{pages.map((page) => <option key={page.id} value={page.id}>{page.title} (/{page.slug})</option>)}</select></label>
				<label className={labelClass}>Section key<input className={inputClass} value={sectionKey} onChange={(event) => setSectionKey(event.target.value)} maxLength={100} required placeholder="hero_main" /></label>
				<label className={labelClass}>Judul<input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} required /></label>
				<label className={labelClass}>Tipe section<select className={inputClass} value={sectionType} onChange={(event) => setSectionType(event.target.value as CmsSectionType)}><option value="hero">Hero</option><option value="about">Tentang</option><option value="services">Layanan</option><option value="gallery">Galeri</option><option value="testimonials">Testimoni</option><option value="contact">Kontak</option><option value="custom">Custom</option></select></label>
				<label className={labelClass}>Urutan tampil<input className={inputClass} type="number" min="0" step="1" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} required /></label>
				{section && <label className={labelClass}>Status<select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as CmsSectionStatus)}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>}
				<label className={`${labelClass} sm:col-span-2`}>Content JSON<textarea className={`${inputClass} h-48 resize-y py-2 font-mono text-[12px]`} value={contentText} onChange={(event) => setContentText(event.target.value)} placeholder={'{\n  "headline": "..."\n}'} /></label>
			</div>
			<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button><button type="submit" disabled={saving || pages.length === 0} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : section ? "Simpan perubahan" : "Tambah section"}</button></div>
		</form>
	);
}

export function CmsTranslationForm({ section, language, onCancel, onSaved }: TranslationFormProps) {
	const existing = section.translations.find((translation) => translation.language === language);
	const [title, setTitle] = useState(existing?.title ?? section.title);
	const [contentText, setContentText] = useState(stringifyContent(existing?.content ?? section.content));
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let content: unknown;
		try {
			content = parseContent(contentText);
		} catch {
			toast.error("Content harus berupa JSON yang valid.");
			return;
		}

		setSaving(true);
		try {
			const translation = await cmsSectionService.saveTranslation(section.id, language, { title: title.trim(), content });
			toast.success(`Terjemahan ${language.toUpperCase()} berhasil disimpan.`);
			onSaved(translation);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">Terjemahan {language.toUpperCase()}</h2><p className="mt-1 text-[12px] text-obc-muted">{section.page.title} · {section.sectionKey}</p></div><button type="button" onClick={onCancel} aria-label="Tutup terjemahan" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
			<label className={labelClass}>Judul terjemahan<input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} required /></label>
			<label className={`${labelClass} mt-4 block`}>Content JSON<textarea className={`${inputClass} h-48 resize-y py-2 font-mono text-[12px]`} value={contentText} onChange={(event) => setContentText(event.target.value)} /></label>
			<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan terjemahan"}</button></div>
		</form>
	);
}
