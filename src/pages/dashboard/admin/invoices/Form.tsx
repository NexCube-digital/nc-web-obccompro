import { CalendarDays, Clock3, MapPin, Timer } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { contactService, type Contact } from "../../cms/contact/ContactService";
import { courtService, type CourtResource } from "../../sport/court/courtService";
import { invoiceService, type AvailabilitySlot, type Invoice, type InvoiceStatus, type PriceBreakdownItem } from "./invoiceService";

const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue", "expired", "partial", "cancelled"];
const statusLabels: Record<InvoiceStatus, string> = {
	draft: "Draft",
	sent: "Terkirim",
	paid: "Lunas",
	overdue: "Jatuh tempo",
	expired: "Kedaluwarsa",
	partial: "Sebagian dibayar",
	cancelled: "Dibatalkan",
};

const generateInvoiceNumber = () => {
	const now = new Date();
	return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getTime()).slice(-6)}`;
};

const toDateInput = (value: string | null) => value ? value.slice(0, 10) : "";
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const timeToMinutes = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	return hour * 60 + minute;
};
const minutesToTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const availabilityIntervalMinutes = 15;

interface InvoiceFormProps {
	invoice?: Invoice | null;
	onClose: () => void;
	onSaved: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onClose, onSaved }: InvoiceFormProps) {
	const [saving, setSaving] = useState(false);
	const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? generateInvoiceNumber());
	const [clientName, setClientName] = useState(invoice?.clientName ?? "");
	const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
	const [phone, setPhone] = useState(invoice?.phone ?? "");
	const [amount, setAmount] = useState(invoice?.amount ?? 0);
	const [status, setStatus] = useState<InvoiceStatus>(invoice?.status ?? "draft");
	const [service, setService] = useState(invoice?.service ?? "");
	const [description, setDescription] = useState(invoice?.description ?? "");
	const [issueDate, setIssueDate] = useState(toDateInput(invoice?.issueDate ?? null));
	const [dueDate, setDueDate] = useState(toDateInput(invoice?.dueDate ?? null));
	const [items, setItems] = useState<PriceBreakdownItem[]>(invoice?.priceBreakdown?.length ? invoice.priceBreakdown : []);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [facilities, setFacilities] = useState<CourtResource[]>([]);
	const [contactId, setContactId] = useState(invoice?.contactId ?? "");
	const [resourceId, setResourceId] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [durationSlots, setDurationSlots] = useState(1);
	const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
	const [loadingAvailability, setLoadingAvailability] = useState(false);

	useEffect(() => {
		Promise.all([contactService.getContactList(), courtService.getResources()])
			.then(([contactItems, facilityItems]) => {
				setContacts(contactItems);
				setFacilities(facilityItems);
			})
			.catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Data pilihan gagal dimuat."))
			.finally(() => undefined);
	}, []);

	const selectedFacility = facilities.find((facility) => facility.id === resourceId) ?? null;
	const selectedSportType = selectedFacility?.sportTypes[0] ?? "";
	const slotMinutes = selectedFacility?.slotMinutes ?? 60;
	const durationMinutes = slotMinutes * durationSlots;
	const isRangeAvailable = (start: string, duration: number, slots = availabilitySlots) => {
		const slotsByStart = new Map(slots.map((slot) => [slot.startTime, slot]));
		const endMinute = timeToMinutes(start) + duration;
		for (let minute = timeToMinutes(start); minute < endMinute; minute += availabilityIntervalMinutes) {
			const slot = slotsByStart.get(minutesToTime(minute));
			if (!slot?.available || timeToMinutes(slot.endTime) < minute + availabilityIntervalMinutes) return false;
		}
		return true;
	};
	const durationOptions = Array.from({ length: Math.floor(240 / slotMinutes) }, (_, index) => slotMinutes * (index + 1))
		.filter((duration) => availabilitySlots.some((slot) => slot.available && isRangeAvailable(slot.startTime, duration)));

	useEffect(() => {
		setAvailabilitySlots([]);
		if (!resourceId || !issueDate || !selectedSportType) {
			setLoadingAvailability(false);
			return;
		}
		let active = true;
		setLoadingAvailability(true);
		invoiceService.getFacilityAvailability(resourceId, issueDate, selectedSportType)
			.then((availability) => { if (active) setAvailabilitySlots(availability.slots); })
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Ketersediaan jadwal gagal dimuat."); })
			.finally(() => { if (active) setLoadingAvailability(false); });
		return () => { active = false; };
	}, [resourceId, issueDate, selectedSportType]);

	useEffect(() => {
		if (!resourceId || !issueDate || !startTime || !endTime || !selectedSportType) return;
		let active = true;
		invoiceService.previewBookingPrice({ resourceId, bookingDate: issueDate, startTime, endTime, sportType: selectedSportType })
			.then((price) => {
				if (!active) return;
				setAmount(price.totalPrice);
				setItems([{
					name: `${selectedFacility?.name ?? "Lapangan"} - ${issueDate} (${startTime}-${endTime})`,
					price: price.totalPrice,
					quantity: 1,
					subtotal: price.totalPrice,
				}]);
			})
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Harga booking gagal dihitung."); });
		return () => { active = false; };
	}, [resourceId, issueDate, startTime, endTime, selectedSportType, selectedFacility?.name]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (!Number.isInteger(amount) || amount <= 0) {
			toast.error("Nominal invoice harus lebih dari 0.");
			return;
		}
		if (!isRangeAvailable(startTime, durationMinutes)) {
			toast.error("Rentang waktu ini tidak lagi tersedia. Silakan pilih slot lain.");
			return;
		}

		const breakdown = items.length ? items.map((item) => ({
			name: item.name.trim(),
			price: item.price,
			quantity: item.quantity,
			subtotal: item.price * item.quantity,
		})) : null;

		setSaving(true);
		try {
			let saved: Invoice;
			if (invoice) {
				 saved = await invoiceService.updateInvoice(invoice.id, {
					clientName,
					clientEmail,
					phone: phone || null,
					amount,
					status,
					service: service || null,
					description: description || null,
					priceBreakdown: breakdown,
					issueDate: issueDate || null,
					dueDate: dueDate || null,
				});
			} else {
				saved = await invoiceService.createInvoice({
					invoiceNumber,
					contactId: contactId || null,
					clientName,
					clientEmail,
					phone: phone || null,
					amount,
					status,
					service: service || null,
					description: description || null,
					priceBreakdown: breakdown,
					issueDate: issueDate || null,
					dueDate: dueDate || null,
				});
			}
			onSaved(saved);
			toast.success(invoice ? "Invoice berhasil diperbarui." : "Invoice berhasil dibuat.");
			onClose();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menyimpan invoice.");
		} finally {
			setSaving(false);
		}
	};

	const inputClass = "mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px] outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";

	const chooseContact = (id: string) => {
		setContactId(id);
		const contact = contacts.find((item) => item.id === id);
		if (!contact) return;
		setClientName(contact.name);
		setClientEmail(contact.email);
		setPhone(contact.phone ?? "");
	};

	const clearSelectedTime = () => {
		setStartTime("");
		setEndTime("");
		setAmount(0);
		setItems([]);
	};

	const chooseFacility = (id: string) => {
		setResourceId(id);
		setAvailabilitySlots([]);
		setDurationSlots(1);
		clearSelectedTime();
	};

	const chooseBookingDate = (date: string) => {
		setIssueDate(date);
		setAvailabilitySlots([]);
		setDurationSlots(1);
		clearSelectedTime();
	};

	const chooseDuration = (count: number) => {
		const nextDuration = slotMinutes * count;
		setDurationSlots(count);
		if (!startTime || !isRangeAvailable(startTime, nextDuration)) {
			clearSelectedTime();
			return;
		}
		setEndTime(minutesToTime(timeToMinutes(startTime) + nextDuration));
	};

	const chooseStartTime = (time: string) => {
		if (!isRangeAvailable(time, durationMinutes)) return;
		setStartTime(time);
		setEndTime(minutesToTime(timeToMinutes(time) + durationMinutes));
	};

	return (
		<div className="mx-auto max-w-6xl pb-8">
			<header className="mb-5 flex items-center justify-between border-b border-obc-border pb-4">
				<div><p className="text-[12px] text-obc-muted">Invoice / {invoice ? "Edit invoice" : "Pesanan manual"}</p><h2 className="mt-1 font-heading text-[24px] font-bold text-obc-charcoal">{invoice ? "Edit invoice" : "Buat invoice booking"}</h2></div>
				<button type="button" onClick={onClose} className="rounded-xl border border-obc-border px-4 py-2 text-[13px] font-medium">Kembali</button>
			</header>
			<form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="space-y-5">
					<section className="rounded-2xl border border-obc-border bg-white p-5">
						<h3 className="mb-4 font-heading text-[16px] font-semibold">Customer</h3>
						<label className="block text-[13px] font-medium">Pilih customer terdaftar<select value={contactId} onChange={(event) => chooseContact(event.target.value)} className={inputClass}><option value="">Isi manual</option>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name} - {contact.email}</option>)}</select></label>
						<div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-[13px] font-medium">Nama klien<input required value={clientName} onChange={(event) => setClientName(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Email klien<input required type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Telepon<input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Nomor invoice<input required disabled={Boolean(invoice)} value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className={inputClass} /></label></div>
					</section>
					<section className="rounded-2xl border border-obc-border bg-white p-5">
						<div className="flex items-start gap-3 border-b border-obc-border pb-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6EC] text-obc-green"><CalendarDays size={19} /></span><div><h3 className="font-heading text-[16px] font-semibold">Detail booking</h3><p className="mt-1 text-[12px] text-obc-muted">Pilih lapangan, tanggal, dan rentang waktu yang tersedia.</p></div></div>
						<div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-[13px] font-medium">Lapangan<select required value={resourceId} onChange={(event) => chooseFacility(event.target.value)} className={inputClass}><option value="">Pilih lapangan</option>{facilities.map((facility) => <option key={facility.id} value={facility.id}>{facility.name}</option>)}</select></label><label className="text-[13px] font-medium">Tanggal booking<input required type="date" value={issueDate} onChange={(event) => chooseBookingDate(event.target.value)} className={inputClass} /></label></div>
						{selectedFacility && <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#FDFCF7] p-4"><MapPin size={18} className="shrink-0 text-obc-green" /><div><p className="font-medium">{selectedFacility.name}</p><p className="text-[12px] text-obc-muted">{selectedFacility.location?.name ?? "OBC Sport Center"} · durasi slot {slotMinutes} menit</p></div></div>}
						{resourceId && issueDate && <div className="mt-5 border-t border-obc-border pt-4">
							<div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="flex items-center gap-2 text-[13px] font-semibold"><Clock3 size={16} className="text-obc-green" />Pilih waktu booking</h4><p className="mt-1 text-[12px] text-obc-muted">Slot terisi dan rentang yang berpotensi bentrok tidak dapat dipilih.</p></div><label className="flex items-center gap-2 text-[12px] font-medium"><Timer size={15} className="text-obc-green" />Durasi<select value={durationSlots} disabled={loadingAvailability || !durationOptions.length} onChange={(event) => chooseDuration(Number(event.target.value))} className="h-9 rounded-lg border border-obc-border bg-white px-2 text-[12px] outline-none focus:border-obc-green">{durationOptions.length ? durationOptions.map((minutes) => <option key={minutes} value={minutes / slotMinutes}>{minutes >= 60 ? `${minutes / 60} jam` : `${minutes} menit`}</option>) : <option value={durationSlots}>{loadingAvailability ? "Memuat..." : "Tidak tersedia"}</option>}</select></label></div>
							{loadingAvailability ? <p role="status" className="mt-4 rounded-lg bg-[#FDFCF7] px-4 py-3 text-[12px] text-obc-muted">Memeriksa ketersediaan jadwal...</p> : availabilitySlots.length > 0 ? <>
								<div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-obc-muted"><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#E7F5D0]" />Tersedia</span><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#FDE8E8]" />Terisi</span><span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-obc-green" />Dipilih</span></div>
								<div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{availabilitySlots.map((slot) => {
									const available = isRangeAvailable(slot.startTime, durationMinutes);
									const selected = startTime === slot.startTime;
									const unavailableStyle = slot.available ? "cursor-not-allowed border-obc-border bg-[#F4F4F1] text-obc-muted" : "cursor-not-allowed border-[#F3CACA] bg-[#FDE8E8] text-[#A53B3B]";
									return <button key={slot.startTime} type="button" disabled={!available} aria-pressed={selected} title={available ? `Pilih ${slot.startTime}` : slot.available ? "Tidak cukup slot kosong untuk durasi ini" : "Jadwal sudah terisi"} onClick={() => chooseStartTime(slot.startTime)} className={`h-10 rounded-lg border text-[12px] font-semibold transition-colors ${selected ? "border-obc-green bg-obc-green text-white" : available ? "border-obc-border bg-white text-obc-charcoal hover:border-obc-green hover:bg-[#F5FAF3]" : unavailableStyle}`}><Clock3 size={13} className="mr-1 inline" />{slot.startTime}</button>;
								})}</div>
							</> : <p className="mt-4 rounded-lg bg-[#FDFCF7] px-4 py-3 text-[12px] text-obc-muted">Tidak ada slot yang tersedia untuk tanggal ini.</p>}
							<div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-obc-border px-4 py-3"><p className="text-[11px] text-obc-muted">Jam mulai</p><p className="mt-1 font-heading text-[16px] font-semibold text-obc-charcoal">{startTime || "Pilih slot"}</p></div><div className="rounded-xl border border-obc-border px-4 py-3"><p className="text-[11px] text-obc-muted">Jam selesai · otomatis</p><p className="mt-1 font-heading text-[16px] font-semibold text-obc-charcoal">{endTime || "Mengikuti durasi"}</p></div></div>
						</div>}
					</section>
					<section className="rounded-2xl border border-obc-border bg-white p-5"><h3 className="font-heading text-[16px] font-semibold">Informasi invoice</h3><div className="mt-4 grid gap-4 md:grid-cols-3"><label className="text-[13px] font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value as InvoiceStatus)} className={inputClass}>{statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></label><label className="text-[13px] font-medium">Tanggal jatuh tempo<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Layanan<input value={service} onChange={(event) => setService(event.target.value)} className={inputClass} /></label></div><label className="mt-4 block text-[13px] font-medium">Catatan invoice<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-xl border border-obc-border p-3 text-[13px] outline-none" /></label></section>
				</div>
				<aside className="h-fit rounded-2xl border border-obc-border bg-white p-5 lg:sticky lg:top-5">
					<h3 className="flex items-center gap-2 font-heading text-[16px] font-semibold"><CalendarDays size={18} /> Ringkasan booking</h3>
					<div className="mt-4 space-y-3 border-y border-obc-border py-4 text-[13px]"><div><span className="text-obc-muted">Lapangan</span><p className="mt-1 font-medium">{selectedFacility?.name ?? "Belum dipilih"}</p></div><div><span className="text-obc-muted">Tanggal</span><p className="mt-1 font-medium">{issueDate || "Belum dipilih"}</p></div><div><span className="text-obc-muted">Waktu</span><p className="mt-1 font-medium">{startTime && endTime ? `${startTime} - ${endTime}` : "Belum dipilih"}</p></div></div>
					{items.map((item) => <div key={item.name} className="flex justify-between gap-3 py-4 text-[13px]"><span className="text-obc-muted">{item.name}</span><span className="shrink-0 font-medium">{rupiah(item.subtotal)}</span></div>)}
					<div className="border-t border-obc-border pt-4"><span className="text-[12px] text-obc-muted">Nominal invoice</span><p className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">{rupiah(amount)}</p></div>
					<button type="submit" disabled={saving || !resourceId || !issueDate || !startTime || !endTime} className="mt-5 h-11 w-full rounded-xl bg-obc-green text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : "Buat invoice"}</button><button type="button" onClick={onClose} className="mt-2 h-10 w-full rounded-xl border border-obc-border text-[13px]">Batal</button>
				</aside>
			</form>
		</div>
	);
}
