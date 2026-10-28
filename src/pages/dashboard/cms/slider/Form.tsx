import { useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { getMediaUrl } from "../media/mediaService";
import { sliderService, type HeroSlide } from "./sliderService";

type Props = { slide: HeroSlide | null; tenantId?: string; onClose: () => void; onSubmit: (slide: HeroSlide) => void | Promise<void>; saving?: boolean };
const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";

export default function SliderForm({ slide, tenantId, onClose, onSubmit, saving = false }: Props) {
	const [title, setTitle] = useState(slide?.title ?? "");
	const [description, setDescription] = useState(slide?.description ?? "");
	const [image, setImage] = useState(slide?.image ?? "");
	const [preview, setPreview] = useState(slide?.image ?? "");
	const [uploading, setUploading] = useState(false);

	const selectImage = async (file: File | undefined) => {
		if (!file) return;
		setPreview(URL.createObjectURL(file));
		setUploading(true);
		try {
			const url = await sliderService.uploadImage(file, tenantId);
			setImage(url);
			setPreview(url);
		} catch (error) { toast.error(getApiErrorMessage(error)); }
		finally { setUploading(false); }
	};

	const submit = (event: FormEvent) => {
		event.preventDefault();
		if (!image) { toast.error("Pilih gambar slide terlebih dahulu."); return; }
		void onSubmit({ title, description, image, active: slide?.active ?? true });
	};

	return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-obc-border px-5 py-4"><div><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{slide ? "Ubah slide" : "Tambah slide"}</h2><p className="mt-0.5 text-[12px] text-obc-muted">Judul, deskripsi, dan gambar slider.</p></div><button type="button" onClick={onClose} aria-label="Tutup form" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
		<div className="grid gap-4 p-5"><label className={labelClass}>Judul<input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} required /></label><label className={labelClass}>Deskripsi<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className={`${inputClass} h-auto py-2`} required /></label>
		<label className={labelClass}>Gambar slide<input className="mt-1 block w-full text-[13px] text-obc-muted file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-[#E7F5D0] file:px-4 file:text-[13px] file:font-semibold file:text-[#1F3320]" type="file" accept="image/*" onChange={(event) => void selectImage(event.target.files?.[0])} required={!slide?.image} /></label>
		{preview && <div className="relative overflow-hidden rounded-lg border border-obc-border bg-[#FDFCF7]" style={{ aspectRatio: "16 / 7" }}><img src={preview.startsWith("blob:") || preview.startsWith("http") ? preview : getMediaUrl(preview)} alt="Preview slider" className="h-full w-full object-cover" />{uploading && <div className="absolute inset-0 grid place-items-center bg-white/70 text-[13px] font-semibold"><ImagePlus className="mr-2 inline" size={18} />Mengunggah gambar...</div>}</div>}</div>
		<div className="flex justify-end gap-2 border-t border-obc-border px-5 py-4"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium">Batal</button><button type="submit" disabled={uploading || saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan slide"}</button></div></form></div>;
}
