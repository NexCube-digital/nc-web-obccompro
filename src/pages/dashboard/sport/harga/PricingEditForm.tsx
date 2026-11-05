import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, CircleDollarSign, Clock3, LoaderCircle, Package, SlidersHorizontal, X } from "lucide-react";
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
const inputClass = "mt-1 h-11 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[11px] font-semibold text-obc-charcoal";

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

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !saving) onClose(); };
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose, saving]);

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
			<form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="pricing-edit-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl">
				<header className="flex shrink-0 items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
					<div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">{isRule ? <Clock3 size={19} /> : <Package size={19} />}</span><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">Katalog harga / Edit</p><h2 id="pricing-edit-title" className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal">{isRule ? "Aturan tarif per jam" : name || "Paket durasi"}</h2><p className="mt-0.5 text-[11px] text-obc-muted">Perbarui detail penerapan dan nominal harga.</p></div></div>
					<button type="button" aria-label="Tutup" disabled={saving} onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal disabled:opacity-50"><X size={17} /></button>
				</header>
				<div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
					{isRule ? <>
						<section>
							<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><CalendarDays size={15} className="text-obc-green" />Waktu berlaku</h3>
							<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
								<label className={labelClass}>Jenis hari<select className={inputClass} value={dayType} onChange={(event) => setDayType(event.target.value as PricingRule["dayType"])}><option value="weekday">Hari kerja</option><option value="weekend">Akhir pekan</option><option value="holiday">Hari libur</option></select></label>
								<label className={labelClass}>Prioritas aturan<input className={inputClass} type="number" min="0" max="100" value={priority} onChange={(event) => setPriority(event.target.value)} required /></label>
								<label className={labelClass}>Jam mulai<input className={inputClass} type="time" value={tierStart} onChange={(event) => setTierStart(event.target.value)} required /></label>
								<label className={labelClass}>Jam selesai<input className={inputClass} type="time" value={tierEnd} onChange={(event) => setTierEnd(event.target.value)} required /></label>
							</div>
						</section>
						<section className="mt-6">
							<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><CircleDollarSign size={15} className="text-obc-green" />Tarif dan batas booking</h3>
							<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
								<label className={labelClass}>Tarif per jam (Rp)<input className={inputClass} type="number" min="0" step="1" value={pricePerHour} onChange={(event) => setPricePerHour(event.target.value)} required /></label>
								<label className={labelClass}>Harga minimum booking (Rp)<input className={inputClass} type="number" min="0" step="1" value={minBookingPrice} onChange={(event) => setMinBookingPrice(event.target.value)} /></label>
								<label className={labelClass}>Durasi minimum (menit)<input className={inputClass} type="number" min="15" max="720" step="1" value={minDurationMinutes} onChange={(event) => setMinDurationMinutes(event.target.value)} /></label>
							</div>
						</section>
					</> : <>
						<section>
							<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><Package size={15} className="text-obc-green" />Informasi paket</h3>
							<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
								<label className={`${labelClass} sm:col-span-2`}>Nama paket<input className={inputClass} minLength={3} maxLength={255} value={name} onChange={(event) => setName(event.target.value)} required /></label>
								<label className={`${labelClass} sm:col-span-2`}>Deskripsi<textarea className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 py-2.5 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]" rows={3} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
								<label className={labelClass}>Jenis olahraga<select className={inputClass} value={sportType} onChange={(event) => setSportType(event.target.value as SportType | "")}><option value="">Semua olahraga</option>{sports.map((sport) => <option key={sport} value={sport}>{sport.replaceAll("_", " ")}</option>)}</select></label>
								<label className={labelClass}>Durasi paket (menit)<input className={inputClass} type="number" min="30" step="1" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} required /></label>
							</div>
						</section>
						<section className="mt-6">
							<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><SlidersHorizontal size={15} className="text-obc-green" />Harga dan pengurutan</h3>
							<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
								<label className={labelClass}>Harga paket (Rp)<input className={inputClass} type="number" min="0" step="1" value={packagePrice} onChange={(event) => setPackagePrice(event.target.value)} required /></label>
								<label className={labelClass}>Diskon (%)<input className={inputClass} type="number" min="0" max="100" step="0.01" value={discountPercent} onChange={(event) => setDiscountPercent(event.target.value)} /></label>
								<label className={labelClass}>Prioritas paket<input className={inputClass} type="number" min="0" max="100" value={priority} onChange={(event) => setPriority(event.target.value)} required /></label>
							</div>
						</section>
					</>}
				</div>
				<footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-obc-border bg-[#FDFCF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p className="text-[10px] text-obc-muted">Pastikan waktu dan harga sesuai sebelum menyimpan.</p>
					<div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={onClose} className="h-10 rounded-lg border border-obc-border bg-white px-4 text-[12px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60">{saving ? <><LoaderCircle size={15} className="animate-spin" />Menyimpan...</> : <><CircleDollarSign size={15} />Simpan perubahan</>}</button></div>
				</footer>
			</form>
		</div>
	);
}