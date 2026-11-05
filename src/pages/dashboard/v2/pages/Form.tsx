import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { cmsPageService, type CmsPage, type CmsPageInput, type CmsPageStatus, type CmsPageType } from "./pageService";

type Props = {
	page: CmsPage | null;
	tenantId: string;
	tenantLocked: boolean;
	onTenantIdChange: (value: string) => void;
	onCancel: () => void;
	onSaved: () => void;
};

const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";

export default function CmsPageForm({ page, tenantId, tenantLocked, onTenantIdChange, onCancel, onSaved }: Props) {
	const [slug, setSlug] = useState(page?.slug ?? "");
	const [title, setTitle] = useState(page?.title ?? "");
	const [pageType, setPageType] = useState<CmsPageType>(page?.pageType ?? "custom");
	const [sortOrder, setSortOrder] = useState(String(page?.sortOrder ?? 0));
	const [status, setStatus] = useState<CmsPageStatus>(page?.status ?? "draft");
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const payload: CmsPageInput = {
			...(!page ? { tenantId: tenantId.trim() || undefined } : {}),
			slug: slug.trim().replace(/^\/+|\/+$/g, ""),
			title: title.trim(),
			pageType,
			sortOrder: Number(sortOrder),
			status,
		};
		setSaving(true);
		try {
			if (page) {
				await cmsPageService.updatePage(page.id, payload);
				toast.success("Halaman CMS berhasil diperbarui.");
			} else {
				await cmsPageService.createPage(payload);
				toast.success("Halaman CMS berhasil dibuat.");
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
			<div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{page ? "Ubah halaman CMS" : "Halaman CMS baru"}</h2><p className="mt-1 text-[12px] text-obc-muted">Kelola metadata halaman. Isi section dikelola terpisah.</p></div><button type="button" onClick={onCancel} aria-label="Tutup form halaman" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
			<div className="grid gap-4 sm:grid-cols-2">
				<label className={labelClass}>Judul halaman<input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} required /></label>
				<label className={labelClass}>Slug<input className={inputClass} value={slug} onChange={(event) => setSlug(event.target.value)} maxLength={255} required placeholder="tentang-kami" /></label>
				<label className={labelClass}>Tipe halaman<select className={inputClass} value={pageType} onChange={(event) => setPageType(event.target.value as CmsPageType)}><option value="home">Beranda</option><option value="about">Tentang</option><option value="services">Layanan</option><option value="contact">Kontak</option><option value="custom">Custom</option></select></label>
				<label className={labelClass}>Status<select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as CmsPageStatus)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
				<label className={labelClass}>Urutan tampil<input className={inputClass} type="number" min="0" step="1" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} required /></label>
				{!page && <label className={`${labelClass} sm:col-span-2`}>Tenant ID<input className={inputClass} value={tenantId} onChange={(event) => onTenantIdChange(event.target.value)} readOnly={tenantLocked} required pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" title="Masukkan UUID tenant yang valid." placeholder="UUID tenant" /></label>}
			</div>
			<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button><button type="submit" disabled={saving || (!page && !tenantId)} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : page ? "Simpan perubahan" : "Buat halaman"}</button></div>
		</form>
	);
}
