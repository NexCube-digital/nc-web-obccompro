import { useEffect, useState, type FormEvent } from "react";
import { BadgePercent, CalendarDays, CircleDollarSign, LoaderCircle, Package, Users, X } from "lucide-react";
import { toast } from "sonner";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { MembershipPackage, MembershipPackageUpdateInput, SportType } from "../SportService";

type Props = {
	item: MembershipPackage;
	onClose: () => void;
	onSave: (payload: MembershipPackageUpdateInput) => Promise<void>;
};

const sports: SportType[] = ["futsal", "badminton", "basketball", "volleyball", "pickleball", "tennis", "billiard", "swimming", "event", "other"];
const inputClass = "mt-1 h-11 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[11px] font-semibold text-obc-charcoal";

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

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !saving) onClose(); };
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose, saving]);

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
			<form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="membership-form-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl">
				<header className="flex shrink-0 items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
					<div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Package size={19} /></span><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">Katalog membership / Edit</p><h2 id="membership-form-title" className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal">{name || item.name}</h2><p className="mt-0.5 text-[11px] text-obc-muted">Perbarui informasi paket, manfaat sesi, dan harga member.</p></div></div>
					<button type="button" aria-label="Tutup" disabled={saving} onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal disabled:opacity-50"><X size={17} /></button>
				</header>
				<div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
					<section>
						<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><Package size={15} className="text-obc-green" />Informasi paket</h3>
						<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
							<label className={labelClass}>Nama paket<input className={inputClass} minLength={3} maxLength={255} value={name} onChange={(event) => setName(event.target.value)} required /></label>
							<label className={labelClass}>Nama paket (English)<input className={inputClass} maxLength={255} value={nameEn} onChange={(event) => setNameEn(event.target.value)} /></label>
							<label className={labelClass}>Deskripsi<textarea className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 py-2.5 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]" rows={3} maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
							<label className={labelClass}>Deskripsi (English)<textarea className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 py-2.5 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]" rows={3} maxLength={1000} value={descriptionEn} onChange={(event) => setDescriptionEn(event.target.value)} /></label>
						</div>
					</section>
					<section className="mt-6">
						<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><Users size={15} className="text-obc-green" />Manfaat membership</h3>
						<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-3">
							<label className={labelClass}>Jenis olahraga
								<ThemedSelect
									label="Jenis olahraga"
									value={sportType}
									options={sports.map((sport) => ({ value: sport, label: sport.replaceAll("_", " ") }))}
									onValueChange={(value) => setSportType(value as SportType)}
									className="mt-1 h-11 w-full text-[13px]"
								/>
							</label>
							<label className={labelClass}>Jumlah sesi<input className={inputClass} type="number" min="1" max="50" step="1" value={totalSessions} onChange={(event) => setTotalSessions(event.target.value)} required /></label>
							<label className={labelClass}>Masa berlaku (hari)<input className={inputClass} type="number" min="1" max="365" step="1" value={validityDays} onChange={(event) => setValidityDays(event.target.value)} required /></label>
						</div>
					</section>
					<section className="mt-6">
						<h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal"><CircleDollarSign size={15} className="text-obc-green" />Harga dan diskon</h3>
						<div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-3">
							<label className={labelClass}>Harga normal (Rp)<input className={inputClass} type="number" min="0" step="1" value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} required /></label>
							<label className={labelClass}>Harga member (Rp)<input className={inputClass} type="number" min="0" step="1" value={memberPrice} onChange={(event) => setMemberPrice(event.target.value)} required /></label>
							<label className={labelClass}>Diskon (%)<span className="relative mt-1 block"><input className={`${inputClass} pr-10`} type="number" min="0" max="100" step="0.01" value={discountPercent} onChange={(event) => setDiscountPercent(event.target.value)} required /><BadgePercent size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-obc-muted" /></span></label>
						</div>
						<div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F3F8E8] p-3 text-[11px] text-obc-muted"><CalendarDays size={14} className="mt-0.5 shrink-0 text-obc-green" /><span>Paket berlaku selama <strong className="font-semibold text-obc-charcoal">{validityDays || 0} hari</strong> dan mencakup <strong className="font-semibold text-obc-charcoal">{totalSessions || 0} sesi</strong>.</span></div>
					</section>
				</div>
				<footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-obc-border bg-[#FDFCF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p className="text-[10px] text-obc-muted">Harga member tidak boleh melebihi harga normal.</p>
					<div className="flex justify-end gap-2"><button type="button" disabled={saving} onClick={onClose} className="h-10 rounded-lg border border-obc-border bg-white px-4 text-[12px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60">{saving ? <><LoaderCircle size={15} className="animate-spin" />Menyimpan...</> : <><CircleDollarSign size={15} />Simpan perubahan</>}</button></div>
				</footer>
			</form>
		</div>
	);
}
