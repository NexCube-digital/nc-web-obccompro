import { ArrowLeft, CalendarDays, Receipt, UserRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ThemedSelect from "../../components/common/ThemedSelect";
import { courtService, type CourtResource } from "../../services/sport/courtService";
import { invoiceService, type AvailabilitySlot, type FacilityCalendarDate, type Invoice, type InvoiceContact, type InvoicePaymentMethod, type PriceBreakdownItem } from "../../services/admin/invoiceService";
import InvoiceBookingStep from "./InvoiceBookingStep";
import PaymentMethod, { getPaymentMethodLabel } from "./payment/PaymentMethod";

const generateInvoiceNumber = () => {
	const now = new Date();
	return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getTime()).slice(-6)}`;
};

const toDateInput = (value: string | null) => value ? value.slice(0, 10) : "";
const toDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const formatBookingDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const timeToMinutes = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	return hour * 60 + minute;
};
const minutesToTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const SERVICE_FEE_ITEM = "Biaya layanan";
const DISCOUNT_ITEM = "Diskon";

interface InvoiceFormProps {
	invoice?: Invoice | null;
	onClose: () => void;
	onSaved: (invoice: Invoice) => void;
}

export default function InvoiceForm({ invoice, onClose, onSaved }: InvoiceFormProps) {
	const navigate = useNavigate();
	const [saving, setSaving] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? generateInvoiceNumber());
	const [clientName, setClientName] = useState(invoice?.clientName ?? "");
	const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
	const [phone, setPhone] = useState(invoice?.phone ?? "");
	const [amount, setAmount] = useState(invoice?.amount ?? 0);
	const [paymentMethod, setPaymentMethod] = useState<InvoicePaymentMethod | "">(invoice?.paymentMethod ?? "");
	const service = invoice?.service ?? "";
	const description = invoice?.description ?? "";
	const [issueDate, setIssueDate] = useState(toDateInput(invoice?.issueDate ?? null));
	const [bookingCalendarMonth, setBookingCalendarMonth] = useState(() => invoice?.issueDate ? new Date(`${invoice.issueDate.slice(0, 10)}T00:00:00`) : new Date());
	const dueDate = toDateInput(invoice?.dueDate ?? null);
	const initialPriceBreakdown = invoice?.priceBreakdown ?? [];
	const [serviceFee, setServiceFee] = useState(() => initialPriceBreakdown.find((item) => item.name === SERVICE_FEE_ITEM)?.subtotal ?? 0);
	const [discountAmount, setDiscountAmount] = useState(() => initialPriceBreakdown.find((item) => item.name === DISCOUNT_ITEM)?.subtotal ?? 0);
	const [items, setItems] = useState<PriceBreakdownItem[]>(() => initialPriceBreakdown.filter((item) => item.name !== SERVICE_FEE_ITEM && item.name !== DISCOUNT_ITEM));
	const [contacts, setContacts] = useState<InvoiceContact[]>([]);
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
	const [invoiceBooking, setInvoiceBooking] = useState<Awaited<ReturnType<typeof invoiceService.getBookingDetails>> | null>(null);
	const [loadingInvoiceBooking, setLoadingInvoiceBooking] = useState(Boolean(invoice?.bookingId));

	useEffect(() => {
		Promise.all([invoiceService.getContacts(), courtService.getResources()])
			.then(([contactItems, facilityItems]) => {
				setContacts(contactItems);
				setFacilities(facilityItems);
			})
			.catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Data pilihan gagal dimuat."))
			.finally(() => setFacilitiesLoaded(true));
	}, []);

	useEffect(() => {
		if (!invoice?.bookingId) return;
		let active = true;
		invoiceService.getBookingDetails(invoice.bookingId)
			.then((booking) => { if (active) setInvoiceBooking(booking); })
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Detail booking invoice gagal dimuat."); })
			.finally(() => { if (active) setLoadingInvoiceBooking(false); });
		return () => { active = false; };
	}, [invoice?.bookingId]);

	const selectedFacility = facilities.find((facility) => facility.id === resourceId) ?? null;
	const selectedSportType = selectedFacility?.sportTypes[0] ?? "";
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayKey = toDateKey(today);
	const currentTimeMinutes = new Date().getHours() * 60 + new Date().getMinutes();
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
		if (issueDate < todayKey || (issueDate === todayKey && timeToMinutes(start) <= currentTimeMinutes)) return false;
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
		{ label: "Pagi - Siang", from: 5 * 60, to: 17 * 60 },
		{ label: "Malam", from: 17 * 60, to: 5 * 60 },
	].map((period) => ({
		...period,
		slots: hourlyAvailabilitySlots.filter((slot) => {
			const time = timeToMinutes(slot.startTime);
			return period.label === "Malam"
				? time >= period.from || time < period.to
				: time >= period.from && time < period.to;
		}).sort((first, second) => {
			const sortTime = (time: string) => {
				const minutes = timeToMinutes(time);
				return period.label === "Malam" && minutes < period.to ? minutes + 24 * 60 : minutes;
			};
			return sortTime(first.startTime) - sortTime(second.startTime);
		}),
	})).filter((period) => period.slots.length > 0);
	const formSteps = [
		{ id: 1, title: "Data klien", subtitle: "Penerima tagihan" },
		{ id: 2, title: "Detail booking", subtitle: "Lapangan dan jadwal" },
		{ id: 3, title: "Informasi pembayaran", subtitle: "Metode dan ketentuan" },
	];
	const visibleFormSteps = invoice ? formSteps.slice(0, 2) : formSteps;

	const validateStep = (step: number) => {
		if (step === 1 && (!clientName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim()) || !/^(?:08[1-9]\d{7,10}|628[1-9]\d{7,10})$/.test(phone))) {
			toast.error("Lengkapi nama, email yang valid, dan nomor telepon Indonesia yang valid.");
			return false;
		}
		if (step === 2) {
			if (invoice) return true;
			if (!resourceId || !issueDate || !startTime || !endTime) {
				toast.error("Pilih lapangan, tanggal, dan slot waktu terlebih dahulu.");
				return false;
			}
			if (!isRangeAvailable(startTime, durationMinutes)) {
				toast.error("Rentang waktu ini tidak lagi tersedia. Silakan pilih slot lain.");
				return false;
			}
		}
		if (step === 3) {
			if (!paymentMethod) {
				toast.error("Pilih metode pembayaran terlebih dahulu.");
				return false;
			}
			if (!Number.isInteger(amount) || amount <= 0) {
				toast.error("Nominal invoice harus lebih dari 0.");
				return false;
			}
		}
		return true;
	};

	const moveToStep = (nextStep: number) => {
		if (nextStep > activeStep) {
			for (let step = activeStep; step < nextStep && step < visibleFormSteps.length; step += 1) {
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
		if (!resourceId) return;
		let active = true;
		const from = toDateKey(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth(), 1));
		const to = toDateKey(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() + 1, 0));
		invoiceService.getFacilityCalendar(resourceId, from, to)
			.then((calendar) => { if (active) setCalendarDates(calendar.dates); })
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Penanda jadwal gagal dimuat."); })
			.finally(() => { if (active) setLoadingCalendarDates(false); });
		return () => { active = false; };
	}, [bookingCalendarMonth, resourceId]);

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
		invoiceService.previewBookingPrice({
			resourceId,
			bookingDate: issueDate,
			startTime,
			endTime,
			sportType: selectedSportType,
			...(paymentMethod && paymentMethod !== "cod" ? { paymentChannel: paymentMethod } : {}),
			...(paymentMethod === "qris" ? { paymentMethod: "qris" as const }
				: paymentMethod === "credit_card" ? { paymentMethod: "credit_card" as const }
					: ["gopay", "shopeepay", "ovo", "dana"].includes(paymentMethod) ? { paymentMethod: "ewallet" as const }
						: ["alfamart", "indomaret"].includes(paymentMethod) ? { paymentMethod: "convenience_store" as const }
							: paymentMethod && paymentMethod !== "cod" ? { paymentMethod: "bank_transfer" as const } : {}),
		})
			.then((price) => {
				if (!active) return;
				setAmount(price.totalPrice);
				setServiceFee(price.adminFee);
				setDiscountAmount(price.discountAmount);
				setItems([{
					name: `${selectedFacility?.name ?? "Lapangan"} - ${issueDate} (${startTime}-${endTime})`,
					price: price.basePrice,
					quantity: 1,
					subtotal: price.basePrice,
				}]);
			})
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Harga booking gagal dihitung."); });
		return () => { active = false; };
	}, [resourceId, issueDate, startTime, endTime, selectedSportType, selectedFacility?.name, paymentMethod]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		for (const step of visibleFormSteps.map((item) => item.id)) {
			if (!validateStep(step)) {
				setActiveStep(step);
				return;
			}
		}
		if (!invoice && !paymentMethod) return;
		const finalInvoiceNumber = invoice ? invoice.invoiceNumber : invoiceNumber.trim() || generateInvoiceNumber();
		if (!invoice) setInvoiceNumber(finalInvoiceNumber);

		const breakdown: PriceBreakdownItem[] = items.map((item) => ({
			name: item.name.trim(),
			price: item.price,
			quantity: item.quantity,
			subtotal: item.price * item.quantity,
		}));
		if (discountAmount > 0) breakdown.push({ name: DISCOUNT_ITEM, price: -discountAmount, quantity: 1, subtotal: -discountAmount });
		if (serviceFee > 0) breakdown.push({ name: SERVICE_FEE_ITEM, price: serviceFee, quantity: 1, subtotal: serviceFee });
		const savedBreakdown = breakdown.length ? breakdown : null;

		setSaving(true);
		try {
			if (invoice) {
				const saved = await invoiceService.updateInvoice(invoice.id, {
					clientName: clientName.trim(),
					clientEmail: clientEmail.trim(),
					phone,
					amount,
					service: service || null,
					description: description || null,
					priceBreakdown: savedBreakdown,
					issueDate: issueDate || null,
					dueDate: dueDate || null,
				});
				onSaved(saved);
				toast.success("Invoice berhasil diperbarui.");
				onClose();
				return;
			}

			const booking = await invoiceService.createBooking({
				resourceId: resourceId,
				bookingDate: issueDate,
				startTime,
				endTime,
				sportType: selectedSportType,
				bookingType: "regular",
				paymentChannel: paymentMethod as InvoicePaymentMethod,
				allowPastSlot: false,
				invoiceCheckout: true,
				notes: `Invoice ${finalInvoiceNumber} untuk ${clientName} (${clientEmail})${phone ? `, ${phone}` : ""}`,
				returnUrl: `${window.location.origin}/invoice-payment/finalizing`,
			});
			if (booking.payment && "unavailable" in booking.payment) throw new Error(booking.payment.message);

			const bookingDescription = `${selectedFacility?.name ?? "Lapangan"} - ${issueDate} (${startTime}-${endTime})`;
			const saved = await invoiceService.createInvoice({
				invoiceNumber: finalInvoiceNumber,
				contactId: contactId || null,
				bookingId: booking.bookingId,
				clientName: clientName.trim(),
				clientEmail: clientEmail.trim(),
				phone,
				amount: booking.totalPrice,
				status: "sent",
				paymentMethod: paymentMethod as InvoicePaymentMethod,
				service: selectedFacility?.name || service || "Booking lapangan",
				description: description || null,
				priceBreakdown: savedBreakdown ?? [{ name: bookingDescription, price: booking.totalPrice, quantity: 1, subtotal: booking.totalPrice }],
				issueDate: issueDate || null,
				dueDate: dueDate || null,
			});
			onSaved(saved);

			if (paymentMethod === "cod") {
				toast.success("Booking COD berhasil dikonfirmasi.");
				navigate(`/invoice-payment/success?bookingId=${encodeURIComponent(booking.bookingId)}`, { replace: true });
			} else if (paymentMethod === "credit_card" || (booking.payment && "cardPayment" in booking.payment)) {
				navigate(`/invoice-payment/card?bookingId=${encodeURIComponent(booking.bookingId)}`, { replace: true });
			} else if (booking.payment && "redirectUrl" in booking.payment) {
				window.location.assign(booking.payment.redirectUrl);
			} else {
				navigate(`/invoice-payment/finalizing?bookingId=${encodeURIComponent(booking.bookingId)}`, { replace: true });
			}
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
		setPhone(contact.phone?.replace(/\D/g, "") ?? "");
	};

	const clearSelectedTime = () => {
		setStartTime("");
		setEndTime("");
		setAmount(0);
		setServiceFee(0);
		setDiscountAmount(0);
		setItems([]);
	};

	const chooseFacility = (id: string) => {
		setResourceId(id);
		const nextFacility = facilities.find((facility) => facility.id === id);
		setLoadingAvailability(Boolean(id && issueDate && nextFacility?.sportTypes[0]));
		setCalendarDates([]);
		setLoadingCalendarDates(Boolean(id));
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

	const bookingStepProps = {
		isEditing: Boolean(invoice),
		invoiceBooking,
		loadingInvoiceBooking,
		facilities,
		facilitiesLoaded,
		resourceId,
		onChooseFacility: chooseFacility,
		issueDate,
		formatBookingDate,
		bookingCalendarMonth,
		onCalendarMonthChange: loadCalendarMonth,
		loadingCalendarDates,
		today,
		todayKey,
		onChooseBookingDate: chooseBookingDate,
		bookedDateValues,
		unavailableDateValues,
		loadingAvailability,
		availabilitySlots,
		availableStartSlots,
		durationOptions,
		durationSlots,
		slotMinutes,
		durationMinutes,
		onChooseDuration: chooseDuration,
		startTime,
		endTime,
		timePeriods,
		isRangeAvailable,
		onChooseStartTime: chooseStartTime,
	};

	return (
		<div className="mx-auto max-w-6xl pb-8">
			<header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
				<div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Receipt size={20} /></span><div><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">Invoice / {invoice ? "Edit" : "Baru"}</p><h2 className="mt-1 font-heading text-[21px] font-bold text-obc-charcoal sm:text-[24px]">{invoice ? "Edit invoice" : "Buat invoice booking"}</h2><p className="mt-0.5 text-[12px] text-obc-muted">Lengkapi detail klien dan jadwal lapangan.</p></div></div>
				<button type="button" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-border px-3 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory"><ArrowLeft size={15} />Kembali</button>
			</header>
			<form onSubmit={handleSubmit} className={`grid gap-5 ${!invoice && (activeStep === 2 || activeStep === 3) ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}>
				<div className="space-y-5">
					<div role="tablist" aria-label="Langkah pembuatan invoice" className="grid grid-cols-3 gap-1 rounded-xl border border-obc-border bg-white p-1.5">
							{visibleFormSteps.map((step) => {
							const active = activeStep === step.id;
							const complete = activeStep > step.id;
							return <button key={step.id} type="button" role="tab" aria-selected={active} onClick={() => moveToStep(step.id)} className={`min-w-0 rounded-lg px-2 py-2.5 text-left transition-colors sm:px-3 ${active ? "bg-[#F3F8E8] text-obc-green" : "text-obc-muted hover:bg-obc-ivory hover:text-obc-charcoal"}`}>
								<span className="flex items-center gap-2"><span className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${active || complete ? "bg-obc-green text-white" : "bg-obc-ivory text-obc-muted"}`}>{step.id}</span><span className="min-w-0"><span className="block truncate text-[11px] font-semibold sm:text-[13px]">{step.title}</span><span className="hidden truncate text-[10px] text-obc-muted sm:block">{step.subtitle}</span></span></span>
							</button>;
						})}
					</div>
					{activeStep === 1 && <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
						<div className="mb-4 flex items-center gap-3 border-b border-obc-border pb-4"><span className="grid size-9 place-items-center rounded-lg bg-obc-ivory text-obc-green"><UserRound size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Data klien</h3><p className="mt-0.5 text-[12px] text-obc-muted">Informasi penerima tagihan.</p></div></div>
						<label className="block text-[13px] font-medium text-obc-charcoal">Pilih klien terdaftar
							<ThemedSelect
								label="Pilih klien terdaftar"
								value={contactId || "manual"}
								options={[{ value: "manual", label: "Isi manual" }, ...contacts.map((contact) => ({ value: contact.id, label: `${contact.name} - ${contact.email}` }))]}
								onValueChange={(value) => chooseContact(value === "manual" ? "" : value)}
								className="mt-1 h-11 w-full text-[13px]"
							/>
						</label>
						<div className="mt-4 grid gap-4 md:grid-cols-2"><label className="text-[13px] font-medium">Nama klien<input required value={clientName} onChange={(event) => setClientName(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Email klien<input required type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} className={inputClass} /></label><label className="text-[13px] font-medium">Telepon<input required type="tel" inputMode="numeric" pattern="(?:08[1-9][0-9]{7,10}|628[1-9][0-9]{7,10})" title="Masukkan nomor telepon Indonesia yang valid menggunakan digit saja" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} className={inputClass} /></label><label className="text-[13px] font-medium">Nomor invoice<input disabled={Boolean(invoice)} placeholder={invoice ? "" : "Otomatis dibuat jika kosong"} value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className={inputClass} /></label></div>
					</section>}
					{activeStep === 2 && (
						<InvoiceBookingStep view="selection" {...bookingStepProps} />
					)}
						{activeStep === 3 && !invoice && <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />}
					<div className="flex items-center justify-between gap-3">
						<button type="button" onClick={() => moveToStep(activeStep - 1)} disabled={activeStep === 1} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:invisible">Kembali</button>
						{activeStep < visibleFormSteps.length ? <button type="button" onClick={() => moveToStep(activeStep + 1)} className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover">Lanjutkan</button> : invoice ? <button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan perubahan"}</button> : <p className="text-[12px] text-obc-muted">Periksa ringkasan sebelum menyimpan.</p>}
					</div>
				</div>
				{activeStep === 2 && !invoice && (
					<InvoiceBookingStep view="calendar" {...bookingStepProps} />
				)}
				{activeStep === 3 && !invoice && <aside className="h-fit overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)] lg:sticky lg:top-5">
					<div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5"><span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><CalendarDays size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Ringkasan booking</h3><p className="mt-0.5 text-[11px] text-obc-muted">Periksa detail sebelum menyimpan.</p></div></div>
					<div className="px-4 sm:px-5">
					<div className="space-y-3 border-b border-obc-border py-4 text-[13px]"><div><span className="text-[11px] text-obc-muted">Nomor invoice</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceNumber}</p></div><div><span className="text-[11px] text-obc-muted">Lapangan</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceBooking?.resource.name ?? selectedFacility?.name ?? "Belum dipilih"}</p></div><div><span className="text-[11px] text-obc-muted">Tanggal</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceBooking ? formatBookingDate(invoiceBooking.bookingDate) : issueDate || "Belum dipilih"}</p></div><div><span className="text-[11px] text-obc-muted">Waktu</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceBooking ? `${invoiceBooking.startTime} - ${invoiceBooking.endTime}` : startTime && endTime ? `${startTime} - ${endTime}` : "Belum dipilih"}</p></div></div>
					{items.map((item) => <div key={item.name} className="flex justify-between gap-3 py-3 text-[13px]"><span className="text-obc-muted">Harga lapangan</span><span className="shrink-0 font-medium">{rupiah(item.subtotal)}</span></div>)}
					{discountAmount > 0 && <div className="flex justify-between gap-3 py-2 text-[13px]"><span className="text-obc-muted">Diskon</span><span className="shrink-0 font-medium text-obc-green">- {rupiah(discountAmount)}</span></div>}
					<div className="flex justify-between gap-3 py-2 text-[13px]"><span className="text-obc-muted">Biaya layanan</span><span className="shrink-0 font-medium">{rupiah(serviceFee)}</span></div>
					<div className="rounded-lg bg-[#F3F8E8] p-4"><span className="text-[11px] font-medium text-obc-muted">Total invoice</span><p className="mt-1 font-heading text-[24px] font-bold text-obc-green">{rupiah(amount)}</p></div>
						{activeStep === 3 && !invoice && <div className="mt-3 rounded-lg border border-obc-border px-3 py-2.5"><p className="text-[11px] text-obc-muted">Metode pembayaran</p><p className="mt-1 text-[13px] font-semibold text-obc-charcoal">{getPaymentMethodLabel(paymentMethod)}</p></div>}
						{activeStep === visibleFormSteps.length && <button type="submit" disabled={saving || (invoice ? false : !resourceId || !issueDate || !startTime || !endTime || !paymentMethod)} className="mt-4 h-11 w-full rounded-lg bg-obc-green text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : invoice ? "Simpan perubahan" : "Buat invoice"}</button>}<button type="button" onClick={onClose} className="mb-4 mt-2 h-10 w-full rounded-lg border border-obc-border text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory">Batal</button>
					</div>
				</aside>}
			</form>
		</div>
	);
}
