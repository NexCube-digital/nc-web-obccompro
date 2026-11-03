import { ArrowLeft, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, FileText, MapPin, Receipt, Timer, UserRound } from "lucide-react";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/style.css";
import { toast } from "sonner";
import { contactService, type Contact } from "../../cms/contact/ContactService";
import { courtService, type CourtResource } from "../../sport/court/courtService";
import { invoiceService, type AvailabilitySlot, type FacilityCalendarDate, type Invoice, type InvoiceStatus, type PriceBreakdownItem } from "./invoiceService";

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
const toDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const formatBookingDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const calendarMonths = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(2024, month, 1)));
const calendarYears = Array.from({ length: new Date().getFullYear() + 8 - 2019 }, (_, index) => 2019 + index);
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const timeToMinutes = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	return hour * 60 + minute;
};
const minutesToTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

interface InvoiceFormProps {
	invoice?: Invoice | null;
	onClose: () => void;
	onSaved: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onClose, onSaved }: InvoiceFormProps) {
	const [saving, setSaving] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? generateInvoiceNumber());
	const [clientName, setClientName] = useState(invoice?.clientName ?? "");
	const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
	const [phone, setPhone] = useState(invoice?.phone ?? "");
	const [amount, setAmount] = useState(invoice?.amount ?? 0);
	const [status, setStatus] = useState<InvoiceStatus>(invoice?.status ?? "draft");
	const [service, setService] = useState(invoice?.service ?? "");
	const [description, setDescription] = useState(invoice?.description ?? "");
	const [issueDate, setIssueDate] = useState(toDateInput(invoice?.issueDate ?? null));
	const [bookingCalendarOpen, setBookingCalendarOpen] = useState(false);
	const [bookingCalendarMonth, setBookingCalendarMonth] = useState(() => invoice?.issueDate ? new Date(`${invoice.issueDate.slice(0, 10)}T00:00:00`) : new Date());
	const [dueDate, setDueDate] = useState(toDateInput(invoice?.dueDate ?? null));
	const [items, setItems] = useState<PriceBreakdownItem[]>(invoice?.priceBreakdown?.length ? invoice.priceBreakdown : []);
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [facilities, setFacilities] = useState<CourtResource[]>([]);
	const [facilitiesLoaded, setFacilitiesLoaded] = useState(false);
	const [contactId, setContactId] = useState(invoice?.contactId ?? "");
	const [resourceId, setResourceId] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [durationSlots, setDurationSlots] = useState(1);
	const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
	const [loadingAvailability, setLoadingAvailability] = useState(false);
	const [calendarDates, setCalendarDates] = useState<FacilityCalendarDate[]>([]);
	const [loadingCalendarDates, setLoadingCalendarDates] = useState(false);

	useEffect(() => {
		Promise.all([contactService.getContactList(), courtService.getResources()])
			.then(([contactItems, facilityItems]) => {
				setContacts(contactItems);
				setFacilities(facilityItems);
			})
			.catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Data pilihan gagal dimuat."))
			.finally(() => setFacilitiesLoaded(true));
	}, []);

	const selectedFacility = facilities.find((facility) => facility.id === resourceId) ?? null;
	const selectedSportType = selectedFacility?.sportTypes[0] ?? "";
	const bookedDateValues = calendarDates.filter((day) => day.hasBookings).map((day) => new Date(`${day.date}T00:00:00`));
	const unavailableDateValues = calendarDates.filter((day) => ["full", "closed", "maintenance"].includes(day.status)).map((day) => new Date(`${day.date}T00:00:00`));
	const slotMinutes = 60;
	const durationMinutes = slotMinutes * durationSlots;
	const availabilityIntervalMinutes = availabilitySlots[0]
		? timeToMinutes(availabilitySlots[0].endTime) - timeToMinutes(availabilitySlots[0].startTime)
		: 60;
	const hourlyAvailabilitySlots = availabilitySlots.filter((slot) => timeToMinutes(slot.startTime) % 60 === 0);
	const isRangeAvailable = (start: string, duration: number, slots = availabilitySlots) => {
		if (timeToMinutes(start) % 60 !== 0 || duration % 60 !== 0) return false;
		const slotsByStart = new Map(slots.map((slot) => [slot.startTime, slot]));
		const endMinute = timeToMinutes(start) + duration;
		for (let minute = timeToMinutes(start); minute < endMinute; minute += availabilityIntervalMinutes) {
			const slot = slotsByStart.get(minutesToTime(minute));
			if (!slot?.available || timeToMinutes(slot.endTime) < minute + availabilityIntervalMinutes) return false;
		}
		return true;
	};
	const durationOptions = Array.from({ length: 4 }, (_, index) => 60 * (index + 1))
		.filter((duration) => hourlyAvailabilitySlots.some((slot) => slot.available && isRangeAvailable(slot.startTime, duration)));
	const availableStartSlots = hourlyAvailabilitySlots.filter((slot) => isRangeAvailable(slot.startTime, durationMinutes));
	const timePeriods = [
		{ label: "Pagi", from: 0, to: 12 * 60 },
		{ label: "Siang", from: 12 * 60, to: 17 * 60 },
		{ label: "Malam", from: 17 * 60, to: 24 * 60 },
	].map((period) => ({
		...period,
		slots: hourlyAvailabilitySlots.filter((slot) => {
			const time = timeToMinutes(slot.startTime);
			return time >= period.from && time < period.to;
		}),
	})).filter((period) => period.slots.length > 0);
	const formSteps = [
		{ id: 1, title: "Data klien", subtitle: "Penerima tagihan" },
		{ id: 2, title: "Detail booking", subtitle: "Lapangan dan jadwal" },
		{ id: 3, title: "Informasi invoice", subtitle: "Status dan catatan" },
	];

	const validateStep = (step: number) => {
		if (step === 1 && (!clientName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail) || !invoiceNumber.trim())) {
			toast.error("Lengkapi nama, email, dan nomor invoice terlebih dahulu.");
			return false;
		}
		if (step === 2) {
			if (!resourceId || !issueDate || !startTime || !endTime) {
				toast.error("Pilih lapangan, tanggal, dan slot waktu terlebih dahulu.");
				return false;
			}
			if (!isRangeAvailable(startTime, durationMinutes)) {
				toast.error("Rentang waktu ini tidak lagi tersedia. Silakan pilih slot lain.");
				return false;
			}
		}
		if (step === 3 && (!Number.isInteger(amount) || amount <= 0)) {
			toast.error("Nominal invoice harus lebih dari 0.");
			return false;
		}
		return true;
	};

	const moveToStep = (nextStep: number) => {
		if (nextStep > activeStep) {
			for (let step = activeStep; step < nextStep; step += 1) {
				if (!validateStep(step)) return;
			}
		}
		setActiveStep(nextStep);
	};

	const loadCalendarMonth = (month: Date) => {
		setBookingCalendarMonth(month);
		setCalendarDates([]);
		setLoadingCalendarDates(Boolean(resourceId));
	};

	useEffect(() => {
		if (!bookingCalendarOpen || !resourceId) return;
		let active = true;
		const from = toDateKey(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth(), 1));
		const to = toDateKey(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() + 1, 0));
		invoiceService.getFacilityCalendar(resourceId, from, to)
			.then((calendar) => { if (active) setCalendarDates(calendar.dates); })
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Penanda jadwal gagal dimuat."); })
			.finally(() => { if (active) setLoadingCalendarDates(false); });
		return () => { active = false; };
	}, [bookingCalendarMonth, bookingCalendarOpen, resourceId]);

	useEffect(() => {
		if (!resourceId || !issueDate || !selectedSportType) return;
		let active = true;
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
		for (const step of [1, 2, 3]) {
			if (!validateStep(step)) {
				setActiveStep(step);
				return;
			}
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

	const inputClass = "mt-1 h-11 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";

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
		const nextFacility = facilities.find((facility) => facility.id === id);
		setLoadingAvailability(Boolean(id && issueDate && nextFacility?.sportTypes[0]));
		setCalendarDates([]);
		setLoadingCalendarDates(Boolean(id && bookingCalendarOpen));
		setAvailabilitySlots([]);
		setDurationSlots(1);
		clearSelectedTime();
	};

	const chooseBookingDate = (date: string) => {
		if (loadingCalendarDates) return;
		const dateAvailability = calendarDates.find((day) => day.date === date);
		if (dateAvailability && ["full", "closed", "maintenance"].includes(dateAvailability.status)) {
			toast.error(dateAvailability.status === "full" ? "Tanggal ini sudah penuh." : "Lapangan tutup pada tanggal ini.");
			return;
		}
		setIssueDate(date);
		if (date) setBookingCalendarMonth(new Date(`${date}T00:00:00`));
		setBookingCalendarOpen(false);
		setLoadingAvailability(Boolean(resourceId && date && selectedSportType));
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
			<header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
				<div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Receipt size={20} /></span><div><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">Invoice / {invoice ? "Edit" : "Baru"}</p><h2 className="mt-1 font-heading text-[21px] font-bold text-obc-charcoal sm:text-[24px]">{invoice ? "Edit invoice" : "Buat invoice booking"}</h2><p className="mt-0.5 text-[12px] text-obc-muted">Lengkapi detail klien dan jadwal lapangan.</p></div></div>
				<button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-border px-3 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory"><ArrowLeft size={15} />Kembali</button>
			</header>
			<form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="space-y-5">
					<div role="tablist" aria-label="Langkah pembuatan invoice" className="grid grid-cols-3 gap-1 rounded-xl border border-obc-border bg-white p-1.5">
						{formSteps.map((step) => {
							const active = activeStep === step.id;
							const complete = activeStep > step.id;
							return <button key={step.id} type="button" role="tab" aria-selected={active} onClick={() => moveToStep(step.id)} className={`min-w-0 rounded-lg px-2 py-2.5 text-left transition-colors sm:px-3 ${active ? "bg-[#F3F8E8] text-obc-green" : "text-obc-muted hover:bg-obc-ivory hover:text-obc-charcoal"}`}>
								<span className="flex items-center gap-2"><span className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${active || complete ? "bg-obc-green text-white" : "bg-obc-ivory text-obc-muted"}`}>{step.id}</span><span className="min-w-0"><span className="block truncate text-[11px] font-semibold sm:text-[13px]">{step.title}</span><span className="hidden truncate text-[10px] text-obc-muted sm:block">{step.subtitle}</span></span></span>
							</button>;
						})}
					</div>
					{activeStep === 1 && <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
						<div className="mb-4 flex items-center gap-3 border-b border-obc-border pb-4"><span className="grid size-9 place-items-center rounded-lg bg-obc-ivory text-obc-green"><UserRound size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Data klien</h3><p className="mt-0.5 text-[12px] text-obc-muted">Informasi penerima tagihan.</p></div></div>
						<label className="block text-[13px] font-medium text-obc-charcoal">Pilih klien terdaftar<select value={contactId} onChange={(event) => chooseContact(event.target.value)} className={inputClass}><option value="">Isi manual</option>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name} - {contact.email}</option>)}</select></label>
						<div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-[13px] font-medium">Nama klien<input required value={clientName} onChange={(event) => setClientName(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Email klien<input required type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Telepon<input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Nomor invoice<input required disabled={Boolean(invoice)} value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className={inputClass} /></label></div>
					</section>}
					{activeStep === 2 && <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
						<div className="flex items-start gap-3 border-b border-obc-border pb-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6EC] text-obc-green"><CalendarDays size={19} /></span><div><h3 className="font-heading text-[16px] font-semibold">Detail booking</h3><p className="mt-1 text-[12px] text-obc-muted">Pilih lapangan, tanggal, dan rentang waktu yang tersedia.</p></div></div>
						<div className="mt-4">
							<div className="mb-2 flex items-center justify-between gap-3"><span className="text-[13px] font-semibold text-obc-charcoal">Pilih lapangan</span><span className="text-[11px] text-obc-muted">{facilities.length} tersedia</span></div>
							{facilities.length ? <div role="group" aria-label="Pilihan lapangan" className="grid max-h-52 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
								{facilities.map((facility) => {
									const selected = resourceId === facility.id;
									return <button key={facility.id} type="button" aria-pressed={selected} onClick={() => chooseFacility(facility.id)} className={`flex min-h-16 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${selected ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-white hover:border-obc-green hover:bg-[#FDFCF7]"}`}>
										<span className={`grid size-9 shrink-0 place-items-center rounded-lg ${selected ? "bg-obc-green text-white" : "bg-obc-ivory text-obc-muted"}`}><MapPin size={16} /></span>
										<span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold text-obc-charcoal">{facility.name}</span><span className="mt-0.5 block truncate text-[11px] capitalize text-obc-muted">{facility.location?.name ?? "OBC Sport Center"} · {facility.sportTypes[0]?.replaceAll("_", " ") ?? "Lapangan"}</span></span>
										{selected && <Check size={16} className="shrink-0 text-obc-green" />}
									</button>;
								})}
							</div> : <p className="rounded-lg border border-dashed border-obc-border px-4 py-6 text-center text-[12px] text-obc-muted">{facilitiesLoaded ? "Belum ada lapangan yang tersedia." : "Memuat pilihan lapangan..."}</p>}
						</div>
						<div className="relative mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-3 sm:p-4">
							<div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[13px] font-semibold text-obc-charcoal">Tanggal booking</p><p className="mt-0.5 text-[11px] text-obc-muted">Pilih tanggal untuk memeriksa slot lapangan.</p></div><button type="button" aria-expanded={bookingCalendarOpen} aria-controls="invoice-booking-calendar" onClick={() => { const opening = !bookingCalendarOpen; setBookingCalendarOpen(opening); if (opening && resourceId) { setCalendarDates([]); setLoadingCalendarDates(true); } }} className={`flex h-10 min-w-52 items-center justify-between gap-3 rounded-lg border bg-white px-3 text-left text-[12px] transition-colors ${bookingCalendarOpen ? "border-obc-green ring-2 ring-[#CDF178]" : "border-obc-border hover:border-obc-green"}`}><span className="flex min-w-0 items-center gap-2"><CalendarDays size={16} className="shrink-0 text-obc-green" /><span className={`truncate ${issueDate ? "font-semibold text-obc-charcoal" : "text-obc-muted"}`}>{issueDate ? formatBookingDate(issueDate) : "Pilih tanggal"}</span></span><ChevronDown size={15} className={`shrink-0 text-obc-muted transition-transform ${bookingCalendarOpen ? "rotate-180" : ""}`} /></button></div>
							{bookingCalendarOpen && <div id="invoice-booking-calendar" className="absolute right-0 top-full z-30 mt-2 w-full max-w-85 rounded-xl border border-obc-border bg-white p-3 shadow-[0_12px_35px_rgba(31,49,32,0.16)] sm:p-4">
								<div className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-1.5">
									<button type="button" aria-label="Bulan sebelumnya" onClick={() => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronLeft size={16} /></button>
									<select aria-label="Pilih bulan" value={bookingCalendarMonth.getMonth()} onChange={(event) => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), Number(event.target.value), 1))} className="h-9 min-w-0 rounded-lg border border-obc-border bg-[#FDFCF7] px-2 text-[12px] font-medium capitalize text-obc-charcoal outline-none focus:border-obc-green">{calendarMonths.map((month, index) => <option key={month} value={index}>{month}</option>)}</select>
									<select aria-label="Pilih tahun" value={bookingCalendarMonth.getFullYear()} onChange={(event) => loadCalendarMonth(new Date(Number(event.target.value), bookingCalendarMonth.getMonth(), 1))} className="h-9 min-w-0 rounded-lg border border-obc-border bg-[#FDFCF7] px-2 text-[12px] font-medium text-obc-charcoal outline-none focus:border-obc-green">{calendarYears.map((year) => <option key={year} value={year}>{year}</option>)}</select>
									<button type="button" aria-label="Bulan berikutnya" onClick={() => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronRight size={16} /></button>
								</div>
								<DayPicker mode="single" selected={issueDate ? new Date(`${issueDate}T00:00:00`) : undefined} onSelect={(date) => chooseBookingDate(date ? toDateKey(date) : "")} month={bookingCalendarMonth} onMonthChange={loadCalendarMonth} locale={id} weekStartsOn={1} hideNavigation showOutsideDays disabled={loadingCalendarDates ? true : unavailableDateValues} modifiers={{ booked: bookedDateValues }} modifiersClassNames={{ booked: "relative after:absolute after:bottom-0 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-obc-red [&>button]:font-semibold", disabled: "cursor-not-allowed opacity-45" }} className="w-full" style={{ "--rdp-accent-color": "#1F3320", "--rdp-accent-background-color": "#E7F5D0", "--rdp-day-height": "36px", "--rdp-day-width": "34px", "--rdp-day_button-border-radius": "0.5rem", "--rdp-day_button-height": "31px", "--rdp-day_button-width": "31px" } as CSSProperties} classNames={{ root: "w-full", months: "w-full", month: "w-full", month_caption: "sr-only", caption_label: "sr-only", month_grid: "w-full border-collapse", weekdays: "grid grid-cols-7", weekday: "py-2 text-center text-[10px] font-semibold uppercase text-obc-muted", weeks: "grid gap-y-1", week: "grid grid-cols-7", day: "grid place-items-center p-0", day_button: "grid size-8 place-items-center rounded-lg text-[12px] text-inherit transition-colors hover:bg-obc-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green", selected: "rounded-lg !bg-obc-green !font-bold !text-white [&>button]:!bg-obc-green [&>button]:!text-white [&>button:hover]:!bg-obc-green-hover", today: "rounded-lg font-bold text-obc-green ring-1 ring-inset ring-obc-green/70", outside: "text-obc-muted/40" }} />
								<div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-obc-border pt-2"><div className="flex items-center gap-3 text-[10px] text-obc-muted"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-obc-red" />Ada booking</span><span>{loadingCalendarDates ? "Memeriksa tanggal..." : "Tanggal penuh nonaktif"}</span></div><div className="flex"><button type="button" disabled={loadingCalendarDates || unavailableDateValues.some((date) => toDateKey(date) === toDateKey(new Date()))} onClick={() => chooseBookingDate(toDateKey(new Date()))} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-green transition-colors hover:bg-obc-ivory disabled:cursor-not-allowed disabled:opacity-40">Hari ini</button><button type="button" onClick={() => setBookingCalendarOpen(false)} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-muted transition-colors hover:bg-obc-ivory">Tutup</button></div></div>
							</div>}
						</div>
						{selectedFacility && <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#DDE8D2] bg-[#F3F8E8] p-3"><MapPin size={17} className="shrink-0 text-obc-green" /><div><p className="text-[13px] font-semibold text-obc-charcoal">{selectedFacility.name}</p><p className="text-[11px] text-obc-muted">{selectedFacility.location?.name ?? "OBC Sport Center"} · durasi slot {slotMinutes} menit</p></div></div>}
						{resourceId && issueDate && <div className="mt-5 border-t border-obc-border pt-4">
							<div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="flex items-center gap-2 text-[13px] font-semibold text-obc-charcoal"><Clock3 size={16} className="text-obc-green" />Pilih waktu booking</h4><p className="mt-1 text-[12px] text-obc-muted">Jam yang tidak tersedia atau tidak cukup untuk durasi dipilih akan dinonaktifkan.</p></div><label className="flex items-center gap-2 text-[12px] font-medium text-obc-charcoal"><Timer size={15} className="text-obc-green" />Durasi<select value={durationSlots} disabled={loadingAvailability || !durationOptions.length} onChange={(event) => chooseDuration(Number(event.target.value))} className="h-9 rounded-lg border border-obc-border bg-white px-2 text-[12px] outline-none focus:border-obc-green disabled:cursor-not-allowed disabled:opacity-50">{durationOptions.length ? durationOptions.map((minutes) => <option key={minutes} value={minutes / slotMinutes}>{minutes >= 60 ? `${minutes / 60} jam` : `${minutes} menit`}</option>) : <option value={durationSlots}>{loadingAvailability ? "Memuat..." : "Tidak tersedia"}</option>}</select></label></div>
							{loadingAvailability ? <p role="status" className="mt-4 rounded-lg bg-[#FDFCF7] px-4 py-3 text-[12px] text-obc-muted">Memeriksa ketersediaan jadwal...</p> : availabilitySlots.length > 0 ? <>
								<div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-obc-muted"><span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#E7F5D0]" />Kosong</span><span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#F1EFE8]" />Tidak tersedia</span><span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-obc-green" />Dipilih</span><span className="ml-auto font-semibold text-obc-green">{availableStartSlots.length} jam tersedia</span></div>
								{availableStartSlots.length === 0 && <p className="mt-3 rounded-lg border border-[#F3CACA] bg-[#FDF2F2] px-3 py-2.5 text-[12px] text-[#A53B3B]">Tidak ada slot kosong untuk durasi ini. Coba ubah durasi atau tanggal.</p>}
								<div className="mt-4 space-y-4">{timePeriods.map((period) => {
									const periodAvailableCount = period.slots.filter((slot) => isRangeAvailable(slot.startTime, durationMinutes)).length;
									return <div key={period.label}>
										<div className="mb-2 flex items-center justify-between"><span className="text-[12px] font-semibold text-obc-charcoal">{period.label}</span><span className={`text-[11px] ${periodAvailableCount ? "text-obc-green" : "text-obc-muted"}`}>{periodAvailableCount} dari {period.slots.length} kosong</span></div>
										<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{period.slots.map((slot) => {
											const available = isRangeAvailable(slot.startTime, durationMinutes);
											const selected = startTime === slot.startTime;
											const unavailableStyle = slot.available ? "cursor-not-allowed border-obc-border bg-[#F4F4F1] text-obc-muted" : "cursor-not-allowed border-[#F3CACA] bg-[#FDF2F2] text-[#A53B3B]";
											return <button key={slot.startTime} type="button" disabled={!available} aria-pressed={selected} title={available ? `Pilih ${slot.startTime}` : slot.available ? "Tidak cukup slot kosong untuk durasi ini" : "Jadwal sudah terisi"} onClick={() => chooseStartTime(slot.startTime)} className={`h-10 rounded-lg border text-[12px] font-semibold transition-colors ${selected ? "border-obc-green bg-obc-green text-white shadow-sm" : available ? "border-obc-border bg-white text-obc-charcoal hover:border-obc-green hover:bg-[#F3F8E8]" : unavailableStyle}`}><Clock3 size={13} className="mr-1 inline" />{slot.startTime}</button>;
										})}</div>
									</div>;
								})}</div>
							</> : <p className="mt-4 rounded-lg bg-[#FDFCF7] px-4 py-3 text-[12px] text-obc-muted">Tidak ada slot yang tersedia untuk lapangan dan tanggal ini.</p>}
							<div className={`mt-4 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${startTime ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-[#FDFCF7]"}`}><div><p className="text-[11px] text-obc-muted">Waktu dipilih</p><p className="mt-1 font-heading text-[16px] font-semibold text-obc-charcoal">{startTime && endTime ? `${startTime} – ${endTime}` : "Pilih jam kosong"}</p></div><div className="text-right"><p className="text-[11px] text-obc-muted">Durasi</p><p className="mt-1 text-[13px] font-semibold text-obc-charcoal">{durationSlots} jam</p></div></div>
						</div>}
					</section>}
					{activeStep === 3 && <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5"><div className="mb-4 flex items-center gap-3 border-b border-obc-border pb-4"><span className="grid size-9 place-items-center rounded-lg bg-obc-ivory text-obc-green"><FileText size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Informasi invoice</h3><p className="mt-0.5 text-[12px] text-obc-muted">Status dan ketentuan pembayaran.</p></div></div><div className="grid gap-4 md:grid-cols-3"><label className="text-[13px] font-medium text-obc-charcoal">Status<select value={status} onChange={(event) => setStatus(event.target.value as InvoiceStatus)} className={inputClass}>{statuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></label><label className="text-[13px] font-medium text-obc-charcoal">Tanggal jatuh tempo<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium text-obc-charcoal">Layanan<input value={service} onChange={(event) => setService(event.target.value)} className={inputClass} /></label></div><label className="mt-4 block text-[13px] font-medium text-obc-charcoal">Catatan invoice<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] p-3 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]" /></label></section>}
					<div className="flex items-center justify-between gap-3">
						<button type="button" onClick={() => moveToStep(activeStep - 1)} disabled={activeStep === 1} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:invisible">Kembali</button>
						{activeStep < 3 ? <button type="button" onClick={() => moveToStep(activeStep + 1)} className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover">Lanjutkan</button> : <p className="text-[12px] text-obc-muted">Periksa ringkasan sebelum menyimpan.</p>}
					</div>
				</div>
				<aside className="h-fit overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)] lg:sticky lg:top-5">
					<div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5"><span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><CalendarDays size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Ringkasan booking</h3><p className="mt-0.5 text-[11px] text-obc-muted">Periksa detail sebelum menyimpan.</p></div></div>
					<div className="px-4 sm:px-5">
					<div className="space-y-3 border-b border-obc-border py-4 text-[13px]"><div><span className="text-[11px] text-obc-muted">Nomor invoice</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceNumber}</p></div><div><span className="text-[11px] text-obc-muted">Lapangan</span><p className="mt-1 font-medium text-obc-charcoal">{selectedFacility?.name ?? "Belum dipilih"}</p></div><div><span className="text-[11px] text-obc-muted">Tanggal</span><p className="mt-1 font-medium text-obc-charcoal">{issueDate || "Belum dipilih"}</p></div><div><span className="text-[11px] text-obc-muted">Waktu</span><p className="mt-1 font-medium text-obc-charcoal">{startTime && endTime ? `${startTime} - ${endTime}` : "Belum dipilih"}</p></div></div>
					{items.map((item) => <div key={item.name} className="flex justify-between gap-3 py-4 text-[13px]"><span className="text-obc-muted">{item.name}</span><span className="shrink-0 font-medium">{rupiah(item.subtotal)}</span></div>)}
					<div className="rounded-lg bg-[#F3F8E8] p-4"><span className="text-[11px] font-medium text-obc-muted">Total invoice</span><p className="mt-1 font-heading text-[24px] font-bold text-obc-green">{rupiah(amount)}</p></div>
					{activeStep === 3 && <button type="submit" disabled={saving || !resourceId || !issueDate || !startTime || !endTime} className="mt-4 h-11 w-full rounded-lg bg-obc-green text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : invoice ? "Simpan perubahan" : "Buat invoice"}</button>}<button type="button" onClick={onClose} className="mb-4 mt-2 h-10 w-full rounded-lg border border-obc-border text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory">Batal</button>
					</div>
				</aside>
			</form>
		</div>
	);
}
