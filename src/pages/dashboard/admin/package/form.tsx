import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { getPackageImageUrl, packageService, type PackageInput, type PackageStatus, type ServicePackage } from "./packageService";

type Props = {
	packageItem: ServicePackage | null;
	onCancel: () => void;
	onSaved: () => void;
};

const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";

export default function PackageForm({ packageItem, onCancel, onSaved }: Props) {
	const [name, setName] = useState(packageItem?.name ?? "");
	const [type, setType] = useState(packageItem?.type ?? "");
	const [tier, setTier] = useState(packageItem?.tier ?? "");
	const [price, setPrice] = useState(String(packageItem?.price ?? ""));
	const [description, setDescription] = useState(packageItem?.description ?? "");
	const [featuresText, setFeaturesText] = useState(packageItem?.features?.join("\n") ?? "");
	const [isPopular, setIsPopular] = useState(packageItem?.isPopular ?? false);
	const [status, setStatus] = useState<PackageStatus>(packageItem?.status ?? "active");
	const [images, setImages] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const urls = images.map((file) => URL.createObjectURL(file));
		setPreviews(urls);
		return () => urls.forEach(URL.revokeObjectURL);
	}, [images]);

	const handleImagesChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selected = Array.from(event.target.files ?? []);
		event.target.value = "";
		if (selected.some((file) => !file.type.startsWith("image/"))) {
			toast.error("Semua file harus berupa gambar.");
			return;
		}
		if (selected.some((file) => file.size > 10 * 1024 * 1024)) {
			toast.error("Ukuran setiap gambar maksimal 10 MB.");
			return;
		}
		setImages((current) => [...current, ...selected]);
	};

	const payload = (): PackageInput => ({
		name: name.trim(),
		type: type.trim(),
		tier: tier.trim() || null,
		price: Number(price),
		description: description.trim() || null,
		features: featuresText.split("\n").map((feature) => feature.trim()).filter(Boolean),
		isPopular,
		status,
	});

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		try {
			const savedPackage = packageItem
				? await packageService.updatePackage(packageItem.id, payload())
				: await packageService.createPackage(payload());

			if (images.length) {
				try {
					await packageService.addImages(savedPackage.id, images);
				} catch (error) {
					toast.error(`Paket tersimpan, tetapi gambar gagal diunggah: ${getApiErrorMessage(error)}`);
					onSaved();
					return;
				}
			}

			toast.success(packageItem ? "Paket berhasil diperbarui." : "Paket berhasil ditambahkan.");
			onSaved();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{packageItem ? "Ubah paket" : "Paket baru"}</h2><button type="button" onClick={onCancel} aria-label="Tutup form" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
			<div className="grid gap-4 sm:grid-cols-2">
				<label className={labelClass}>Nama paket<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} maxLength={255} required /></label>
				<label className={labelClass}>Tipe<input className={inputClass} value={type} onChange={(event) => setType(event.target.value)} maxLength={100} required placeholder="Contoh: website" /></label>
				<label className={labelClass}>Tier<input className={inputClass} value={tier} onChange={(event) => setTier(event.target.value)} maxLength={50} placeholder="Contoh: premium" /></label>
				<label className={labelClass}>Harga (Rp)<input className={inputClass} type="number" min="0" step="1" value={price} onChange={(event) => setPrice(event.target.value)} required /></label>
				<label className={labelClass}>Status<select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as PackageStatus)}><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></label>
				<label className="flex items-center gap-2 self-end pb-2 text-[13px] font-medium text-obc-charcoal"><input type="checkbox" checked={isPopular} onChange={(event) => setIsPopular(event.target.checked)} className="size-4 accent-[#404F14]" />Paket populer</label>
				<label className={`${labelClass} sm:col-span-2`}>Deskripsi<textarea className={`${inputClass} h-24 resize-y py-2`} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={5000} /></label>
				<label className={`${labelClass} sm:col-span-2`}>Fitur <span className="font-normal text-obc-muted">(satu fitur per baris)</span><textarea className={`${inputClass} h-28 resize-y py-2`} value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} /></label>
				<div className="sm:col-span-2"><span className={labelClass}>Galeri gambar</span><div className="mt-1 flex flex-wrap items-start gap-2">
					{packageItem?.images.map((image) => <img key={image.id} src={getPackageImageUrl(image.url)} alt="Gambar paket" className="h-20 w-28 rounded-lg border border-obc-border object-cover" />)}
					{previews.map((preview, index) => <img key={`${preview}-${index}`} src={preview} alt={`Pratinjau gambar ${index + 1}`} className="h-20 w-28 rounded-lg border border-obc-border object-cover" />)}
					<label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-obc-border text-[11px] text-obc-muted hover:border-obc-olive"><ImagePlus size={18} />Tambah foto<input type="file" accept="image/*" multiple onChange={handleImagesChange} className="sr-only" /></label>
				</div><p className="mt-1 text-[11px] text-obc-muted">Gambar baru akan ditambahkan ke galeri; gambar yang sudah ada tidak dihapus.</p></div>
			</div>
			<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : packageItem ? "Simpan perubahan" : "Tambah paket"}</button></div>
		</form>
	);
}
