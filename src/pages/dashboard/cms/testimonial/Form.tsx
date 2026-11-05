import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, Save, Star, Trash2 } from "lucide-react";
import { getTestimonialAvatarUrl } from "../../../../services/Public/Testimonial";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { Testimonial } from "./testimonialService";
import type { TestimonialPayload } from "./testimonialService";

export type TestimonialFormValues = Omit<TestimonialPayload, "company" | "textEn" | "avatar"> & {
	company: string;
	textEn: string;
	avatar: string;
};

interface TestimonialFormProps {
	testimonial: Testimonial | null;
	onCancel: () => void;
	onSave: (values: TestimonialFormValues, avatarFile?: File, avatarRemoved?: boolean) => Promise<boolean>;
}

const fieldClass = "mt-1.5 h-11 w-full rounded-lg border border-obc-border bg-white px-3.5 text-[13px] text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";
const textAreaClass = "mt-1.5 w-full resize-y rounded-lg border border-obc-border bg-white p-3.5 text-[13px] leading-6 text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";

export default function TestimonialForm({ testimonial, onCancel, onSave }: TestimonialFormProps) {
	const [values, setValues] = useState<TestimonialFormValues>(() => ({
		name: testimonial?.name ?? "",
		company: testimonial?.company ?? "",
		text: testimonial?.text ?? "",
		textEn: testimonial?.textEn ?? "",
		rating: testimonial?.rating ?? 5,
		avatar: testimonial?.avatar ?? "",
		status: testimonial?.status ?? "draft",
	}));
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState(() => getTestimonialAvatarUrl(testimonial?.avatar ?? null) ?? "");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!avatarFile) {
			setAvatarPreview(getTestimonialAvatarUrl(values.avatar) ?? "");
			return;
		}
		const previewUrl = URL.createObjectURL(avatarFile);
		setAvatarPreview(previewUrl);
		return () => URL.revokeObjectURL(previewUrl);
	}, [avatarFile, values.avatar]);

	const updateValue = <K extends keyof TestimonialFormValues>(key: K, value: TestimonialFormValues[K]) => {
		setValues((current) => ({ ...current, [key]: value }));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		try {
			await onSave(values, avatarFile ?? undefined, !values.avatar && !avatarFile);
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<header className="flex flex-col gap-4 border-b border-obc-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
				<div className="flex items-center gap-3">
					<button type="button" onClick={onCancel} aria-label="Kembali ke daftar testimoni" className="grid size-10 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-muted transition hover:bg-[#F5F7F1] hover:text-obc-charcoal"><ArrowLeft size={17} /></button>
					<div><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-olive">{testimonial ? "Perbarui konten" : "Konten baru"}</p><h2 className="mt-0.5 font-heading text-lg font-bold text-obc-charcoal">{testimonial ? "Edit testimoni" : "Testimoni pelanggan"}</h2></div>
				</div>
				<span className="w-fit rounded-md bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-semibold capitalize text-obc-olive">{values.status}</span>
			</header>

			<div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
				<div className="space-y-6 p-5 sm:p-7">
					<section>
						<h3 className="font-heading text-[14px] font-semibold text-obc-charcoal">Identitas pelanggan</h3>
						<p className="mt-1 text-[12px] text-obc-muted">Nama dan peran yang akan terlihat bersama ulasan.</p>
						<div className="mt-4 grid gap-4 sm:grid-cols-2">
							<label className="block text-[12px] font-semibold text-obc-charcoal">Nama pelanggan<input required maxLength={120} value={values.name} onChange={(event) => updateValue("name", event.target.value)} placeholder="Nama lengkap" className={fieldClass} /></label>
							<label className="block text-[12px] font-semibold text-obc-charcoal">Perusahaan / peran <span className="font-normal text-obc-muted">(opsional)</span><input maxLength={160} value={values.company} onChange={(event) => updateValue("company", event.target.value)} placeholder="Contoh: CEO, PT Maju Jaya" className={fieldClass} /></label>
						</div>
						<div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.75fr)]">
							<div>
								<span className="block text-[12px] font-semibold text-obc-charcoal">Foto profil <span className="font-normal text-obc-muted">(opsional)</span></span>
								<div className="mt-1.5 flex min-h-17 items-center gap-3 rounded-lg border border-dashed border-obc-border bg-[#FAFBF8] p-3">
									{avatarPreview ? <img src={avatarPreview} alt="Pratinjau foto pelanggan" className="size-12 shrink-0 rounded-full object-cover" /> : <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#E7F5D0] text-obc-green"><ImagePlus size={18} /></span>}
									<label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-obc-border bg-white px-3 text-[12px] font-semibold text-obc-charcoal transition hover:bg-[#F5F7F1]">Pilih foto<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setAvatarFile(file); if (file) updateValue("avatar", ""); }} /></label>
									{(avatarPreview || values.avatar) && <button type="button" onClick={() => { setAvatarFile(null); updateValue("avatar", ""); }} aria-label="Hapus foto profil" className="grid size-9 place-items-center rounded-md text-red-600 transition hover:bg-red-50"><Trash2 size={15} /></button>}
								</div>
							</div>
							<div>
								<span className="block text-[12px] font-semibold text-obc-charcoal">Penilaian</span>
								<div className="mt-1.5 flex h-17 items-center gap-1 rounded-lg border border-obc-border bg-[#FAFBF8] px-3" role="group" aria-label="Pilih rating dari 1 sampai 5">
									{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" aria-label={`${rating} bintang`} aria-pressed={values.rating === rating} onClick={() => updateValue("rating", rating)} className={`grid size-9 place-items-center rounded-md transition ${rating <= values.rating ? "text-amber-500 hover:bg-amber-50" : "text-[#C7C9C0] hover:bg-white"}`}><Star size={19} fill={rating <= values.rating ? "currentColor" : "none"} /></button>)}
									<span className="ml-auto font-heading text-[18px] font-bold text-obc-charcoal">{values.rating}<span className="text-[12px] font-medium text-obc-muted"> / 5</span></span>
								</div>
							</div>
						</div>
					</section>

					<section className="border-t border-obc-border pt-5">
						<div className="flex flex-wrap items-end justify-between gap-2"><div><h3 className="font-heading text-[14px] font-semibold text-obc-charcoal">Isi testimoni</h3><p className="mt-1 text-[12px] text-obc-muted">Tulis ulasan dalam bahasa Indonesia dan terjemahan opsional.</p></div><span className="rounded-md bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-semibold text-obc-olive">ID + EN</span></div>
						<label className="mt-4 block text-[12px] font-semibold text-obc-charcoal">Bahasa Indonesia<textarea required maxLength={2000} rows={5} value={values.text} onChange={(event) => updateValue("text", event.target.value)} placeholder="Tuliskan pengalaman pelanggan..." className={`${textAreaClass} min-h-32`} /><span className="mt-1 block text-right text-[11px] font-normal text-obc-muted">{values.text.length} / 2.000 karakter</span></label>
						<label className="mt-4 block text-[12px] font-semibold text-obc-charcoal">English <span className="font-normal text-obc-muted">(optional)</span><textarea maxLength={2000} rows={4} value={values.textEn} onChange={(event) => updateValue("textEn", event.target.value)} placeholder="Write the English translation..." className={`${textAreaClass} min-h-28`} /></label>
					</section>
				</div>

				<aside className="border-t border-obc-border bg-[#F7F8F3] p-5 sm:p-7 lg:border-l lg:border-t-0">
					<h3 className="font-heading text-[14px] font-semibold text-obc-charcoal">Pengaturan publikasi</h3>
					<p className="mt-1 text-[12px] leading-5 text-obc-muted">Atur apakah testimoni langsung ditampilkan di situs.</p>
					<label className="mt-4 block text-[12px] font-semibold text-obc-charcoal">Status
						<ThemedSelect
							label="Status testimoni"
							value={values.status}
							options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "archived", label: "Archived" }]}
							onValueChange={(status) => updateValue("status", status as Testimonial["status"])}
							className="mt-1.5 h-11 w-full rounded-lg text-[13px]"
						/>
					</label>
					<div className="mt-7 border-t border-obc-border pt-5">
						<p className="text-[11px] font-semibold uppercase tracking-wide text-obc-muted">Pratinjau</p>
						<div className="mt-4 flex items-center gap-3">
							{avatarPreview ? <img src={avatarPreview} alt="" className="size-11 rounded-full object-cover" /> : <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#CDF178] font-heading text-[13px] font-bold text-obc-green">{values.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "OB"}</span>}
							<div className="min-w-0"><p className="truncate text-[13px] font-semibold text-obc-charcoal">{values.name || "Nama pelanggan"}</p><p className="truncate text-[11px] text-obc-muted">{values.company || "Perusahaan / peran"}</p></div>
						</div>
						<div className="mt-3 flex gap-0.5 text-amber-500">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill={star <= values.rating ? "currentColor" : "none"} className={star <= values.rating ? "" : "text-[#C7C9C0]"} />)}</div>
						<blockquote className="mt-3 border-l-2 border-[#A9C957] pl-3 text-[12px] leading-6 text-[#4D5548]">{values.text || "Isi testimoni akan tampil di sini."}</blockquote>
					</div>
				</aside>
			</div>

			<footer className="flex flex-col-reverse gap-2 border-t border-obc-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
				<button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-semibold text-obc-charcoal transition hover:bg-[#F5F7F1] disabled:opacity-50">Batal</button>
				<button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60"><Save size={15} />{saving ? "Menyimpan..." : testimonial ? "Simpan perubahan" : "Simpan testimoni"}</button>
			</footer>
		</form>
	);
}
