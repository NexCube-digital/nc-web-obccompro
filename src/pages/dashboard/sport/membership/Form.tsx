import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { MembershipPackage, MembershipPackageUpdateInput, SportType } from "../SportService";

type Props = {
	item: MembershipPackage;
	onClose: () => void;
	onSave: (payload: MembershipPackageUpdateInput) => Promise<void>;
};

const sports: SportType[] = ["futsal", "badminton", "basketball", "volleyball", "pickleball", "tennis", "billiard", "swimming", "event", "other"];
const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive";
const labelClass = "text-[12px] font-medium text-obc-charcoal";

export default function MembershipForm({ item, onClose, onSave }: Props) {
	const [name, setName] = useState(item.name);
	const [nameEn, setNameEn] = useState(item.nameEn ?? "");
	const [description, setDescription] = useState(item.description ?? "");
	const [descriptionEn, setDescriptionEn] = useState(item.descriptionEn ?? "");
	const [sportType, setSportType] = useState<SportType>(item.sportType);
	const [totalSessions, setTotalSessions] = useState(String(item.totalSessions));
	const [validityDays, setValidityDays] = useState(String(item.validityDays));
	const [originalPrice, setOriginalPrice] = useState(String(item.originalPrice));
	const [memberPrice, setMemberPrice] = useState(String(item.memberPrice));
	const [discountPercent, setDiscountPercent] = useState(String(item.discountPercent));
	const [saving, setSaving] = useState(false);

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const original = Number(originalPrice);
		const member = Number(memberPrice);
		if (member > original) {
			toast.error("Harga member tidak boleh lebih mahal dari harga normal.");
			return;
		}
		setSaving(true);
		try {
			await onSave({
				name: name.trim(),
				nameEn: nameEn.trim(),
				description: description.trim(),
				descriptionEn: descriptionEn.trim(),
				sportType,
				totalSessions: Number(totalSessions),
				validityDays: Number(validityDays),
				originalPrice: original,
				memberPrice: member,
				discountPercent: Number(discountPercent),
			});
			onClose();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui paket membership.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
			<form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="membership-form-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
				<div className="mb-5 flex items-start justify-between">
					<div><p className="text-[12px] text-obc-muted">Ubah item membership</p><h2 id="membership-form-title" className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{item.name}</h2></div>
					<button type="button" aria-label="Tutup" disabled={saving} onClick={onClose} className="grid size-9 place-items-center rounded-lg border border-obc-border text-obc-muted hover:text-obc-charcoal"><X size={17} /></button>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					<label className={`${labelClass} sm:col-span-2`}>Nama paket<input className={inputClass} minLength={3} maxLength={255} value={name} onChange={(event) => setName(event.target.value)} required /></label>
					<label className={`${labelClass} sm:col-span-2`}>Nama paket (English)<input className={inputClass} maxLength={255} value={nameEn} onChange={(event) => setNameEn(event.target.value)} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Deskripsi<textarea className="mt-1 w-full rounded-lg border border-obc-border px-3 py-2 text-[13px] outline-none focus:border-obc-olive" rows={3} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
					<label className={`${labelClass} sm:col-span-2`}>Deskripsi (English)<textarea className="mt-1 w-full rounded-lg border border-obc-border px-3 py-2 text-[13px] outline-none focus:border-obc-olive" rows={3} maxLength={1000} value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} /></label>
					<label className={labelClass}>Jenis olahraga<select className={inputClass} value={sportType} onChange={(event) => setSportType(event.target.value as SportType)}>{sports.map((sport) => <option key={sport} value={sport}>{sport}</option>)}</select></label>
					<label className={labelClass}>Jumlah sesi<input className={inputClass} type="number" min="1" max="50" step="1" value={totalSessions} onChange={(event) => setTotalSessions(event.target.value)} required /></label>
					<label className={labelClass}>Masa berlaku (hari)<input className={inputClass} type="number" min="1" max="365" step="1" value={validityDays} onChange={(event) => setValidityDays(event.target.value)} required /></label>
					<label className={labelClass}>Harga normal (Rp)<input className={inputClass} type="number" min="0" step="1" value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} required /></label>
					<label className={labelClass}>Harga member (Rp)<input className={inputClass} type="number" min="0" step="1" value={memberPrice} onChange={(event) => setMemberPrice(event.target.value)} required /></label>
					<label className={labelClass}>Diskon (%)<input className={inputClass} type="number" min="0" max="100" step="0.01" value={discountPercent} onChange={(event) => setDiscountPercent(event.target.value)} required /></label>
				</div>
				<div className="mt-5 flex justify-end gap-2">
					<button type="button" disabled={saving} onClick={onClose} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal disabled:opacity-60">Batal</button>
					<button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>
				</div>
			</form>
		</div>
	);
}
