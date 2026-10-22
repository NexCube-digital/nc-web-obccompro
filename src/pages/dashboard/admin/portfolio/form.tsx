import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { getPortfolioImageUrl, portfolioService, type Portfolio, type PortfolioInput } from "./portfolioService";

type Props = {
	portfolio: Portfolio | null;
	onCancel: () => void;
	onSaved: () => void;
};

const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";

export default function PortfolioForm({ portfolio, onCancel, onSaved }: Props) {
	const [title, setTitle] = useState(portfolio?.title ?? "");
	const [category, setCategory] = useState(portfolio?.category ?? "");
	const [description, setDescription] = useState(portfolio?.description ?? "");
	const [client, setClient] = useState(portfolio?.client ?? "");
	const [technologies, setTechnologies] = useState(portfolio?.technologies ?? "");
	const [link, setLink] = useState(portfolio?.link ?? "");
	const [featured, setFeatured] = useState(portfolio?.featured ?? false);
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(getPortfolioImageUrl(portfolio?.imageUrl ?? null));
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!image) return;
		const objectUrl = URL.createObjectURL(image);
		setPreview(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("File harus berupa gambar.");
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("Ukuran gambar maksimal 10 MB.");
			return;
		}
		setImage(file);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const payload: PortfolioInput = {
			title: title.trim(),
			category: category.trim(),
			description: description.trim() || null,
			client: client.trim() || null,
			technologies: technologies.trim() || null,
			link: link.trim() || null,
			featured,
		};
		setSaving(true);
		try {
			if (portfolio) {
				await portfolioService.updatePortfolio(portfolio.id, payload, image ?? undefined);
				toast.success("Portfolio berhasil diperbarui.");
			} else {
				await portfolioService.createPortfolio(payload, image ?? undefined);
				toast.success("Portfolio berhasil ditambahkan.");
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
			<div className="mb-5 flex items-center justify-between gap-3">
				<h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{portfolio ? "Ubah portfolio" : "Portfolio baru"}</h2>
				<button type="button" onClick={onCancel} aria-label="Tutup form" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<label className={labelClass}>Judul<input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} required /></label>
				<label className={labelClass}>Kategori<input className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)} maxLength={100} required placeholder="Contoh: Website" /></label>
				<label className={labelClass}>Klien<input className={inputClass} value={client} onChange={(event) => setClient(event.target.value)} maxLength={255} /></label>
				<label className={labelClass}>Teknologi<input className={inputClass} value={technologies} onChange={(event) => setTechnologies(event.target.value)} maxLength={1000} placeholder="Contoh: React, Node.js" /></label>
				<label className={labelClass}>Link proyek<input className={inputClass} value={link} onChange={(event) => setLink(event.target.value)} maxLength={500} placeholder="https://..." /></label>
				<label className="flex items-center gap-2 self-end pb-2 text-[13px] font-medium text-obc-charcoal"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="size-4 accent-[#404F14]" />Tampilkan sebagai unggulan</label>
				<label className={`${labelClass} sm:col-span-2`}>Deskripsi<textarea className={`${inputClass} h-24 resize-y py-2`} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} /></label>
				<div className="sm:col-span-2">
					<span className={labelClass}>Gambar</span>
					<div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start">
						<label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-obc-border px-3 text-[13px] text-obc-charcoal hover:bg-[#FDFCF7]"><ImagePlus size={16} />Pilih gambar<input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" /></label>
						{preview && <img src={preview} alt="Pratinjau gambar portfolio" className="h-28 w-full rounded-lg border border-obc-border object-cover sm:w-48" />}
					</div>
					<p className="mt-1 text-[11px] text-obc-muted">Opsional, maksimal 10 MB. Mengganti gambar akan mengunggah file baru.</p>
				</div>
			</div>

			<div className="mt-5 flex justify-end gap-2">
				<button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button>
				<button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : portfolio ? "Simpan perubahan" : "Tambah portfolio"}</button>
			</div>
		</form>
	);
}
