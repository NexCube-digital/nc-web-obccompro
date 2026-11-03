import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { mediaService, getMediaUrl } from "../media/mediaService";
import { unitbisnisService, type BusinessUnit, type BusinessUnitInput } from "./unitbisnisService";

type Props = {
	unit: BusinessUnit | null;
	onClose: () => void;
	onSubmit: (input: BusinessUnitInput) => Promise<BusinessUnit>;
};

const EMPTY_UNIT: BusinessUnitInput = {
	name: "",
	slug: "",
	description: null,
	tenantType: "other",
	config: {},
	status: "active",
};

function getConfigString(config: Record<string, unknown> | undefined, key: string): string {
	return typeof config?.[key] === "string" ? config[key] : "";
}

export default function BusinessUnitEditor({ unit, onClose, onSubmit }: Props) {
	const [form, setForm] = useState<BusinessUnitInput>(() => unit ? {
		name: unit.name,
		slug: unit.slug,
		description: unit.description,
		tenantType: unit.tenantType,
		config: unit.config ?? {},
		status: unit.status,
	} : EMPTY_UNIT);
	const [title, setTitle] = useState(() => getConfigString(unit?.config, "title"));
	const [category, setCategory] = useState(() => getConfigString(unit?.config, "category"));
	const [tags, setTags] = useState(() => Array.isArray(unit?.config?.tags) ? unit.config.tags.filter((tag): tag is string => typeof tag === "string").join("\n") : "");
	const [locationAddress, setLocationAddress] = useState(() => getConfigString(unit?.config, "locationAddress"));
	const [locationMapUrl, setLocationMapUrl] = useState(() => getConfigString(unit?.config, "locationMapUrl"));
	const [locationInfo, setLocationInfo] = useState(() => Array.isArray(unit?.config?.locationInfo) ? unit.config.locationInfo.filter((info): info is string => typeof info === "string").join("\n") : "");
	const [showOnSport, setShowOnSport] = useState(() => unit?.config?.showOnSport !== false);
	const [showOnCompro, setShowOnCompro] = useState(() => unit?.config?.showOnCompro !== false);
	const existingImageUrl = getConfigString(unit?.config, "imageUrl");
	const [imageUrl, setImageUrl] = useState(existingImageUrl);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState(existingImageUrl ? getMediaUrl(existingImageUrl) : "");
	const [saving, setSaving] = useState(false);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const submit = async (event: FormEvent) => {
		event.preventDefault();
		setSaving(true);
		try {
			const savedUnit = await onSubmit({
				...form,
				config: {
					...form.config,
					title: title.trim() || undefined,
					category: category.trim() || undefined,
					tags: tags.split("\n").map((tag) => tag.trim()).filter(Boolean),
					imageUrl: imageFile ? undefined : imageUrl.trim() || undefined,
					locationAddress: locationAddress.trim() || undefined,
					locationMapUrl: locationMapUrl.trim() || undefined,
					locationInfo: locationInfo.split("\n").map((info) => info.trim()).filter(Boolean),
					showOnSport,
					showOnCompro,
				},
			});
			if (imageFile) {
				const media = await mediaService.uploadMedia(imageFile, savedUnit.id);
				await unitbisnisService.updateUnit(savedUnit.id, {
					config: {
						...form.config,
						title: title.trim() || undefined,
						category: category.trim() || undefined,
						tags: tags.split("\n").map((tag) => tag.trim()).filter(Boolean),
						imageUrl: media.url,
					locationAddress: locationAddress.trim() || undefined,
					locationMapUrl: locationMapUrl.trim() || undefined,
					locationInfo: locationInfo.split("\n").map((info) => info.trim()).filter(Boolean),
						showOnSport,
						showOnCompro,
					},
				});
			}
			onClose();
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
			<form onSubmit={submit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
				<div className="mb-5 flex items-center justify-between gap-3">
					<h2 className="font-heading text-xl font-semibold text-obc-charcoal">{unit ? "Edit unit bisnis" : "Tambah unit bisnis"}</h2>
					<button type="button" aria-label="Tutup" onClick={onClose} className="grid size-9 place-items-center rounded-lg border border-obc-border"><X size={17} /></button>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<label className="text-[13px] font-medium">Nama
						<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium">Slug
						<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value.toLowerCase() })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium sm:col-span-2">Deskripsi
						<textarea rows={3} value={form.description ?? ""} onChange={(event) => setForm({ ...form, description: event.target.value || null })} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium sm:col-span-2">Judul kartu
						<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="OBC Villa" className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium sm:col-span-2">Kategori kartu
						<input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Hospitality & Accommodation" className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" />
					</label>
					<div className="sm:col-span-2">
						<span className="text-[13px] font-medium">Gambar kartu</span>
						<div className="mt-1 flex items-center gap-3 rounded-lg border border-obc-border p-3">
							{imagePreview && <img src={imagePreview} alt="Pratinjau gambar kartu" className="size-16 rounded-lg object-cover" />}
							<button type="button" onClick={() => imageInputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-border px-3 text-[13px] font-medium"><ImagePlus size={16} />{imageFile || imagePreview ? "Ganti gambar" : "Pilih gambar"}</button>
							{(imageFile || imagePreview) && <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); setImageUrl(""); if (imageInputRef.current) imageInputRef.current.value = ""; }} className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-red-600"><X size={16} />Hapus</button>}
							<input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setImageFile(file); setImagePreview(file ? URL.createObjectURL(file) : imageUrl ? getMediaUrl(imageUrl) : ""); }} />
						</div>
					</div>
					<label className="text-[13px] font-medium sm:col-span-2">Tag (satu per baris)
						<textarea rows={4} value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Accommodation\nCiumbuleuit\nCheck-in 14.00 WIB" className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium sm:col-span-2">Alamat lokasi
						<input value={locationAddress} onChange={(event) => setLocationAddress(event.target.value)} placeholder="Jl. Rancabentang No. 10, Bandung" className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium sm:col-span-2">Link Google Maps
						<input type="url" value={locationMapUrl} onChange={(event) => setLocationMapUrl(event.target.value)} placeholder="https://maps.google.com/..." className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" />
					</label>
					<label className="text-[13px] font-medium sm:col-span-2">Informasi lokasi (satu per baris)
						<textarea rows={3} value={locationInfo} onChange={(event) => setLocationInfo(event.target.value)} placeholder="Check-in 14.00 WIB\nCheck-out 12.00 WIB" className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal" />
					</label>
					<fieldset className="sm:col-span-2">
						<legend className="text-[13px] font-medium">Tampilkan unit di</legend>
						<div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
							<label className="inline-flex items-center gap-2 text-[13px]">
								<input type="checkbox" checked={showOnSport} onChange={(event) => setShowOnSport(event.target.checked)} className="size-4 accent-[#1F3320]" />
								Sport OBC
							</label>
							<label className="inline-flex items-center gap-2 text-[13px]">
								<input type="checkbox" checked={showOnCompro} onChange={(event) => setShowOnCompro(event.target.checked)} className="size-4 accent-[#1F3320]" />
								Compro OBC
							</label>
						</div>
					</fieldset>
					<label className="text-[13px] font-medium">Status
						<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as BusinessUnitInput["status"] })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal">
							<option value="active">Aktif</option><option value="inactive">Nonaktif</option>
					</select>
					</label>
				</div>
				<div className="mt-5 flex justify-end gap-2">
					<button type="button" onClick={onClose} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium">Batal</button>
					<button type="submit" disabled={saving} className="h-10 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan"}</button>
				</div>
			</form>
		</div>
	);
}
