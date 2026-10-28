import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type {
	PricingPackage,
	PricingPackageUpdateInput,
	PricingRule,
	PricingRuleUpdateInput,
	SportType,
} from "../SportService";

type PricingItem = PricingRule | PricingPackage;
type Props = {
	item: PricingItem;
	onClose: () => void;
	onSave: (payload: PricingRuleUpdateInput | PricingPackageUpdateInput) => Promise<void>;
};

const sports: SportType[] = ["futsal", "badminton", "basketball", "volleyball", "pickleball", "tennis", "billiard", "swimming", "event", "other"];
const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive";
const labelClass = "text-[12px] font-medium text-obc-charcoal";

export default function PricingEditForm({ item, onClose, onSave }: Props) {
	const isRule = "dayType" in item;
	const [dayType, setDayType] = useState<PricingRule["dayType"]>(isRule ? item.dayType : "weekday");
	const [tierStart, setTierStart] = useState(isRule ? item.tierStartTime : "08:00");
	const [tierEnd, setTierEnd] = useState(isRule ? item.tierEndTime : "09:00");
	const [pricePerHour, setPricePerHour] = useState(isRule ? String(item.pricePerHour) : "");
	const [minBookingPrice, setMinBookingPrice] = useState(isRule && item.minBookingPrice != null ? String(item.minBookingPrice) : "");
	const [minDurationMinutes, setMinDurationMinutes] = useState(isRule && item.minDurationMinutes != null ? String(item.minDurationMinutes) : "");
	const [name, setName] = useState(!isRule ? item.name : "");
	const [description, setDescription] = useState(!isRule ? item.description ?? "" : "");
	const [sportType, setSportType] = useState<SportType | "">(!isRule ? item.sportType ?? "" : "");
	const [durationMinutes, setDurationMinutes] = useState(!isRule ? String(item.durationMinutes) : "30");
	const [packagePrice, setPackagePrice] = useState(!isRule ? String(item.packagePrice) : "");
	const [discountPercent, setDiscountPercent] = useState(!isRule && item.discountPercent != null ? String(item.discountPercent) : "");
	const [priority, setPriority] = useState(String(item.priority));
	const [saving, setSaving] = useState(false);

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		try {
			const payload: PricingRuleUpdateInput | PricingPackageUpdateInput = isRule
				? {
					dayType,
					tierStart,
					tierEnd,
					pricePerHour: Number(pricePerHour),
					...(minBookingPrice !== "" ? { minBookingPrice: Number(minBookingPrice) } : {}),
					...(minDurationMinutes !== "" ? { minDurationMinutes: Number(minDurationMinutes) } : {}),
					priority: Number(priority),
				}
				: {
					name: name.trim(),
					description,
					...(sportType ? { sportType } : {}),
					durationMinutes: Number(durationMinutes),
					packagePrice: Number(packagePrice),
					...(discountPercent !== "" ? { discountPercent: Number(discountPercent) } : {}),
					priority: Number(priority),
				};
			await onSave(payload);
			onClose();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui item harga.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
			<form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="pricing-edit-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
				<div className="mb-5 flex items-start justify-between">
					<div><p className="text-[12px] text-obc-muted">Ubah item harga</p><h2 id="pricing-edit-title" className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{isRule ? "Aturan per jam" : "Paket durasi"}</h2></div>
					<button type="button" aria-label="Tutup" disabled={saving} onClick={onClose} className="grid size-9 place-items-center rounded-lg border border-obc-border text-obc-muted hover:text-obc-charcoal"><X size={17} /></button>
				</div>
				{isRule ? <div className="grid gap-4 sm:grid-cols-2">
					<label className={labelClass}>Jenis hari<select className={inputClass} value={dayType} onChange={(event) => setDayType(event.target.value as PricingRule["dayType"])}><option value="weekday">Hari kerja</option><option value="weekend">Akhir pekan</option><option value="holiday">Hari libur</option></select></label>
					<label className={labelClass}>Prioritas<input className={inputClass} type="number" min="0" max="100" value={priority} onChange={(event) => setPriority(event.target.value)} required /></label>
					<label className={labelClass}>Mulai<input className={inputClass} type="time" value={tierStart} onChange={(event) => setTierStart(event.target.value)} required /></label>
					<label className={labelClass}>Selesai<input className={inputClass} type="time" value={tierEnd} onChange={(event) => setTierEnd(event.target.value)} required /></label>
					<label className={labelClass}>Tarif per jam (Rp)<input className={inputClass} type="number" min="0" step="1" value={pricePerHour} onChange={(event) => setPricePerHour(event.target.value)} required /></label>
					<label className={labelClass}>Harga minimum (Rp)<input className={inputClass} type="number" min="0" step="1" value={minBookingPrice} onChange={(event) => setMinBookingPrice(event.target.value)} /></label>
					<label className={labelClass}>Durasi minimum (menit)<input className={inputClass} type="number" min="15" max="720" step="1" value={minDurationMinutes} onChange={(event) => setMinDurationMinutes(event.target.value)} /></label>
				</div> : <div className="grid gap-4 sm:grid-cols-2">
					<label className={`${labelClass} sm:col-span-2`}>Nama paket<input className={inputClass} minLength={3} maxLength={255} value={name} onChange={(event) => setName(event.target.value)} required /></label>
					<label className={`${labelClass} sm:col-span-2`}>Deskripsi<textarea className="mt-1 w-full rounded-lg border border-obc-border px-3 py-2 text-[13px] outline-none focus:border-obc-olive" rows={3} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
					<label className={labelClass}>Jenis olahraga<select className={inputClass} value={sportType} onChange={(event) => setSportType(event.target.value as SportType | "")}><option value="">Semua olahraga</option>{sports.map((sport) => <option key={sport} value={sport}>{sport}</option>)}</select></label>
					<label className={labelClass}>Prioritas<input className={inputClass} type="number" min="0" max="100" value={priority} onChange={(event) => setPriority(event.target.value)} required /></label>
					<label className={labelClass}>Durasi (menit)<input className={inputClass} type="number" min="30" step="1" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} required /></label>
					<label className={labelClass}>Harga paket (Rp)<input className={inputClass} type="number" min="0" step="1" value={packagePrice} onChange={(event) => setPackagePrice(event.target.value)} required /></label>
					<label className={labelClass}>Diskon (%)<input className={inputClass} type="number" min="0" max="100" step="0.01" value={discountPercent} onChange={(event) => setDiscountPercent(event.target.value)} /></label>
				</div>}
				<div className="mt-5 flex justify-end gap-2">
					<button type="button" disabled={saving} onClick={onClose} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal disabled:opacity-60">Batal</button>
					<button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>
				</div>
			</form>
		</div>
	);
}