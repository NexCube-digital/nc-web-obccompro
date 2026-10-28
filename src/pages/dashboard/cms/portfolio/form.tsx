import { useState, type ChangeEvent, type FormEvent } from "react";
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
const PORTFOLIO_CATEGORIES = ["sports", "hospitality", "laundry", "foodCourt", "coffee", "agribusiness"] as const;

export default function PortfolioForm({ portfolio, onCancel, onSaved }: Props) {
	const [title, setTitle] = useState(portfolio?.title ?? "");
	const [category, setCategory] = useState(portfolio?.category ?? "");

	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(getPortfolioImageUrl(portfolio?.imageUrl ?? null));
	const [saving, setSaving] = useState(false);


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
		if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
		setImage(file);
		setPreview(URL.createObjectURL(file));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const payload: PortfolioInput = {
			title: title.trim(),
			category: category.trim(),
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
				<label className={labelClass}>Kategori<select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)} required><option value="" disabled>Pilih kategori</option>{category && !PORTFOLIO_CATEGORIES.includes(category as (typeof PORTFOLIO_CATEGORIES)[number]) && <option value={category}>{category}</option>}{PORTFOLIO_CATEGORIES.map((item) => <option key={item} value={item}>{item === "foodCourt" ? "Food Court" : item === "agribusiness" ? "Agribusiness" : item.charAt(0).toUpperCase() + item.slice(1)}</option>)}</select></label>
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
