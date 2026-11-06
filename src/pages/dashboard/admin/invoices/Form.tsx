import { ArrowLeft, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Receipt, Timer, UserRound, WalletCards } from "lucide-react";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/style.css";
import { toast } from "sonner";
import ThemedSelect from "../../components/common/ThemedSelect";
import alfamartIcon from "../../../../assets/images/payment/alfamart.webp";
import bcaIcon from "../../../../assets/images/payment/bca.webp";
import bniIcon from "../../../../assets/images/payment/bni.webp";
import briIcon from "../../../../assets/images/payment/bri.webp";
import codIcon from "../../../../assets/images/payment/cod.webp";
import creditCardIcon from "../../../../assets/images/payment/creditcard.webp";
import danaIcon from "../../../../assets/images/payment/dana.webp";
import gopayIcon from "../../../../assets/images/payment/gopay.webp";
import indomaretIcon from "../../../../assets/images/payment/indomaret.webp";
import mandiriIcon from "../../../../assets/images/payment/mandiri.webp";
import ovoIcon from "../../../../assets/images/payment/ovo.webp";
import permataIcon from "../../../../assets/images/payment/permata.webp";
import qrisIcon from "../../../../assets/images/payment/qris.webp";
import shopeepayIcon from "../../../../assets/images/payment/shopepay.webp";
import { contactService, type Contact } from "../../cms/contact/ContactService";
import { courtService, type CourtResource } from "../../sport/court/courtService";
import { invoiceService, type AvailabilitySlot, type FacilityCalendarDate, type Invoice, type InvoicePaymentMethod, type PriceBreakdownItem } from "./invoiceService";

const paymentMethodGroups: { label: string; methods: { id: InvoicePaymentMethod; name: string; description: string; image: string }[] }[] = [
	{
		label: "QRIS & E-WALLET",
		methods: [
			{ id: "qris", name: "QRIS", description: "Pembayaran dengan scan kode QR", image: qrisIcon },
			{ id: "gopay", name: "GoPay", description: "Konfirmasi melalui aplikasi GoPay", image: gopayIcon },
			{ id: "shopeepay", name: "ShopeePay", description: "Bayar melalui saldo ShopeePay", image: shopeepayIcon },
			{ id: "ovo", name: "OVO", description: "Konfirmasi melalui aplikasi OVO", image: ovoIcon },
			{ id: "dana", name: "DANA", description: "Bayar melalui saldo DANA", image: danaIcon },
		],
	},
	{
		label: "KARTU",
		methods: [{ id: "credit_card", name: "Kartu kredit / debit", description: "Pembayaran aman dengan kartu", image: creditCardIcon }],
	},
	{
		label: "VIRTUAL ACCOUNT",
		methods: [
			{ id: "bca_va", name: "BCA Virtual Account", description: "Transfer ke nomor VA BCA", image: bcaIcon },
			{ id: "bni_va", name: "BNI Virtual Account", description: "Transfer ke nomor VA BNI", image: bniIcon },
			{ id: "bri_va", name: "BRI Virtual Account", description: "Transfer ke nomor VA BRI", image: briIcon },
			{ id: "mandiri_va", name: "Mandiri Virtual Account", description: "Transfer ke nomor VA Mandiri", image: mandiriIcon },
			{ id: "permata_va", name: "Permata Virtual Account", description: "Transfer ke nomor VA Permata", image: permataIcon },
		],
	},
	{
		label: "GERAI RETAIL",
		methods: [
			{ id: "alfamart", name: "Alfamart", description: "Bayar melalui kasir Alfamart", image: alfamartIcon },
			{ id: "indomaret", name: "Indomaret", description: "Bayar melalui kasir Indomaret", image: indomaretIcon },
		],
	},
	{
		label: "PEMBAYARAN LANGSUNG",
		methods: [{ id: "cod", name: "Cash on Delivery (COD)", description: "Pembayaran dilakukan langsung di lokasi saat kedatangan.", image: codIcon }],
	},
];

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
	const [invoiceBooking, setInvoiceBooking] = useState<Awaited<ReturnType<typeof invoiceService.getBookingDetails>> | null>(null);
	const [loadingInvoiceBooking, setLoadingInvoiceBooking] = useState(Boolean(invoice?.bookingId));

	useEffect(() => {
		Promise.all([contactService.getContactList(), courtService.getResources()])
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
					{activeStep === 2 && <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
						<div className="flex items-start gap-3 border-b border-obc-border pb-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6EC] text-obc-green"><CalendarDays size={19} /></span><div><h3 className="font-heading text-[16px] font-semibold">Detail booking</h3><p className="mt-1 text-[12px] text-obc-muted">Pilih lapangan dan rentang waktu yang tersedia.</p></div></div>
						{invoice && <div className="mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-4">
							{loadingInvoiceBooking ? <p role="status" className="text-[13px] text-obc-muted">Memuat detail booking...</p> : invoiceBooking ? <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
								<div><dt className="text-[11px] text-obc-muted">Lapangan</dt><dd className="mt-1 font-semibold text-obc-charcoal">{invoiceBooking.resource.name}</dd></div>
								<div><dt className="text-[11px] text-obc-muted">Tanggal</dt><dd className="mt-1 font-semibold text-obc-charcoal">{formatBookingDate(invoiceBooking.bookingDate)}</dd></div>
								<div><dt className="text-[11px] text-obc-muted">Waktu</dt><dd className="mt-1 font-semibold text-obc-charcoal">{invoiceBooking.startTime} - {invoiceBooking.endTime}</dd></div>
								<div><dt className="text-[11px] text-obc-muted">Durasi</dt><dd className="mt-1 font-semibold text-obc-charcoal">{invoiceBooking.durationMinutes / 60} jam</dd></div>
							</dl> : <p className="text-[13px] text-obc-muted">Booking terkait tidak tersedia. Detail jadwal tidak dapat diubah dari invoice.</p>}
						</div>}
						<div className={invoice ? "hidden" : ""}>
						<div className="mt-4">
							<div className="mb-2 flex items-center justify-between gap-3"><span className="text-[13px] font-semibold text-obc-charcoal">Pilih lapangan</span><span className="text-[11px] text-obc-muted">{facilities.length} tersedia</span></div>
							{facilities.length ? <div role="group" aria-label="Pilihan lapangan" className="grid max-h-52 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
								{facilities.map((facility) => {
									const selected = resourceId === facility.id;
									return <button key={facility.id} type="button" aria-pressed={selected} onClick={() => chooseFacility(facility.id)} className={`flex min-h-12 min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${selected ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-white hover:border-obc-green hover:bg-[#FDFCF7]"}`}>
										<span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-obc-charcoal">{facility.name}</span>
										{selected && <Check size={16} className="shrink-0 text-obc-green" />}
									</button>;
								})}
							</div> : <p className="rounded-lg border border-dashed border-obc-border px-4 py-6 text-center text-[12px] text-obc-muted">{facilitiesLoaded ? "Belum ada lapangan yang tersedia." : "Memuat pilihan lapangan..."}</p>}
						</div>
						{resourceId && issueDate && <div className="mt-5 border-t border-obc-border pt-4 lg:col-start-1">
							<div className="flex flex-wrap items-center justify-between gap-3"><div><h4 className="flex items-center gap-2 text-[13px] font-semibold text-obc-charcoal"><Clock3 size={16} className="text-obc-green" />Pilih waktu booking</h4><p className="mt-1 text-[12px] text-obc-muted">Jam yang tidak tersedia atau tidak cukup untuk durasi dipilih akan dinonaktifkan.</p></div><label className="flex items-center gap-2 text-[12px] font-medium text-obc-charcoal"><Timer size={15} className="text-obc-green" />Durasi<ThemedSelect label="Durasi booking" value={String(durationSlots)} options={durationOptions.length ? durationOptions.map((minutes) => ({ value: String(minutes / slotMinutes), label: minutes >= 60 ? `${minutes / 60} jam` : `${minutes} menit` })) : [{ value: String(durationSlots), label: loadingAvailability ? "Memuat..." : "Tidak tersedia" }]} disabled={loadingAvailability || !durationOptions.length} onValueChange={(value) => chooseDuration(Number(value))} className="h-9 min-w-27.5 text-[12px]" /></label></div>
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
						</div>
					</section>}
						{activeStep === 3 && !invoice && <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
						<div className="mb-4 flex items-center gap-3 border-b border-obc-border pb-4">
							<span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><WalletCards size={17} /></span>
							<div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Informasi pembayaran</h3><p className="mt-0.5 text-[12px] text-obc-muted">Pilih metode pembayaran yang akan dicantumkan pada invoice.</p></div>
						</div>
						<div role="radiogroup" aria-label="Metode pembayaran invoice" className="space-y-4">
							{paymentMethodGroups.map((group) => <div key={group.label}>
								<h4 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-obc-green">{group.label}</h4>
								<div className="grid gap-2 sm:grid-cols-2">
									{group.methods.map(({ id, name, description, image }) => {
										const selected = paymentMethod === id;
										return <button key={id} type="button" role="radio" aria-checked={selected} onClick={() => setPaymentMethod(id)} className={`flex min-h-19 min-w-0 items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-left transition-colors ${selected ? "border-2 border-obc-green bg-[#F3F8E8]" : "border-obc-border hover:border-obc-green hover:bg-[#FDFCF7]"}`}>
											<span className="grid h-10 w-14 shrink-0 place-items-center"><img src={image} alt="" aria-hidden="true" className="block h-8 w-full object-contain" /></span>
											<span className="min-w-0 flex-1"><span className="wrap-break-word block text-[13px] font-semibold text-obc-charcoal">{name}</span><span className="mt-1 block text-[11px] leading-4 text-obc-muted">{description}</span></span>
											<span aria-hidden="true" className={`grid size-4 shrink-0 place-items-center rounded-full ${selected ? "border-2 border-obc-green" : "border border-obc-border"}`}>{selected && <span className="size-2 rounded-full bg-obc-green" />}</span>
										</button>;
									})}
								</div>
							</div>)}
						</div>
					</section>}
					<div className="flex items-center justify-between gap-3">
						<button type="button" onClick={() => moveToStep(activeStep - 1)} disabled={activeStep === 1} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:invisible">Kembali</button>
						{activeStep < visibleFormSteps.length ? <button type="button" onClick={() => moveToStep(activeStep + 1)} className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover">Lanjutkan</button> : invoice ? <button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan perubahan"}</button> : <p className="text-[12px] text-obc-muted">Periksa ringkasan sebelum menyimpan.</p>}
					</div>
				</div>
				{activeStep === 2 && !invoice && <aside className="h-fit overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)] lg:sticky lg:top-5">
					<div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5"><span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><CalendarDays size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Tanggal booking</h3><p className="mt-0.5 text-[11px] text-obc-muted">{issueDate ? formatBookingDate(issueDate) : "Pilih tanggal yang tersedia."}</p></div></div>
					<div className="p-3 sm:p-4">
						<div id="invoice-booking-calendar" className="w-full rounded-lg border border-obc-border bg-[#FDFCF7] p-2.5 sm:p-3">
							<div className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-1.5">
								<button type="button" aria-label="Bulan sebelumnya" onClick={() => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronLeft size={16} /></button>
								<ThemedSelect
									label="Pilih bulan"
									value={String(bookingCalendarMonth.getMonth())}
									options={calendarMonths.map((month, index) => ({ value: String(index), label: month }))}
									onValueChange={(value) => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), Number(value), 1))}
									capitalize
								/>
								<ThemedSelect
									label="Pilih tahun"
									value={String(bookingCalendarMonth.getFullYear())}
									options={calendarYears.map((year) => ({ value: String(year), label: String(year) }))}
									onValueChange={(value) => loadCalendarMonth(new Date(Number(value), bookingCalendarMonth.getMonth(), 1))}
								/>
								<button type="button" aria-label="Bulan berikutnya" onClick={() => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronRight size={16} /></button>
							</div>
							<DayPicker mode="single" selected={issueDate ? new Date(`${issueDate}T00:00:00`) : undefined} onSelect={(date) => chooseBookingDate(date ? toDateKey(date) : "")} month={bookingCalendarMonth} onMonthChange={loadCalendarMonth} locale={id} weekStartsOn={1} hideNavigation showOutsideDays disabled={loadingCalendarDates ? true : [{ before: today }, ...unavailableDateValues]} modifiers={{ booked: bookedDateValues }} modifiersClassNames={{ booked: "relative after:absolute after:bottom-0 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-obc-red [&>button]:font-semibold", disabled: "cursor-not-allowed opacity-45" }} className="w-full" style={{ "--rdp-accent-color": "#1F3320", "--rdp-accent-background-color": "#E7F5D0", "--rdp-day-height": "36px", "--rdp-day-width": "34px", "--rdp-day_button-border-radius": "0.5rem", "--rdp-day_button-height": "31px", "--rdp-day_button-width": "31px" } as CSSProperties} classNames={{ root: "w-full", months: "w-full", month: "w-full", month_caption: "sr-only", caption_label: "sr-only", month_grid: "w-full border-collapse", weekdays: "grid grid-cols-7", weekday: "py-2 text-center text-[10px] font-semibold uppercase text-obc-muted", weeks: "grid gap-y-1", week: "grid grid-cols-7", day: "grid place-items-center p-0", day_button: "grid size-8 place-items-center rounded-lg text-[12px] text-inherit transition-colors hover:bg-obc-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green", selected: "rounded-lg !bg-obc-green !font-bold !text-white [&>button]:!bg-obc-green [&>button]:!text-white [&>button:hover]:!bg-obc-green-hover", today: "rounded-lg font-bold text-obc-green ring-1 ring-inset ring-obc-green/70", outside: "text-obc-muted/40" }} />
							<div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-obc-border pt-2"><div className="flex items-center gap-3 text-[10px] text-obc-muted"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-obc-red" />Ada booking</span><span>{loadingCalendarDates ? "Memeriksa tanggal..." : "Tanggal penuh nonaktif"}</span></div><button type="button" disabled={loadingCalendarDates || unavailableDateValues.some((date) => toDateKey(date) === todayKey)} onClick={() => chooseBookingDate(todayKey)} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-green transition-colors hover:bg-obc-ivory disabled:cursor-not-allowed disabled:opacity-40">Hari ini</button></div>
						</div>
					</div>
				</aside>}
				{activeStep === 3 && !invoice && <aside className="h-fit overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)] lg:sticky lg:top-5">
					<div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5"><span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><CalendarDays size={17} /></span><div><h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Ringkasan booking</h3><p className="mt-0.5 text-[11px] text-obc-muted">Periksa detail sebelum menyimpan.</p></div></div>
					<div className="px-4 sm:px-5">
					<div className="space-y-3 border-b border-obc-border py-4 text-[13px]"><div><span className="text-[11px] text-obc-muted">Nomor invoice</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceNumber}</p></div><div><span className="text-[11px] text-obc-muted">Lapangan</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceBooking?.resource.name ?? selectedFacility?.name ?? "Belum dipilih"}</p></div><div><span className="text-[11px] text-obc-muted">Tanggal</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceBooking ? formatBookingDate(invoiceBooking.bookingDate) : issueDate || "Belum dipilih"}</p></div><div><span className="text-[11px] text-obc-muted">Waktu</span><p className="mt-1 font-medium text-obc-charcoal">{invoiceBooking ? `${invoiceBooking.startTime} - ${invoiceBooking.endTime}` : startTime && endTime ? `${startTime} - ${endTime}` : "Belum dipilih"}</p></div></div>
					{items.map((item) => <div key={item.name} className="flex justify-between gap-3 py-3 text-[13px]"><span className="text-obc-muted">Harga lapangan</span><span className="shrink-0 font-medium">{rupiah(item.subtotal)}</span></div>)}
					{discountAmount > 0 && <div className="flex justify-between gap-3 py-2 text-[13px]"><span className="text-obc-muted">Diskon</span><span className="shrink-0 font-medium text-obc-green">- {rupiah(discountAmount)}</span></div>}
					<div className="flex justify-between gap-3 py-2 text-[13px]"><span className="text-obc-muted">Biaya layanan</span><span className="shrink-0 font-medium">{rupiah(serviceFee)}</span></div>
					<div className="rounded-lg bg-[#F3F8E8] p-4"><span className="text-[11px] font-medium text-obc-muted">Total invoice</span><p className="mt-1 font-heading text-[24px] font-bold text-obc-green">{rupiah(amount)}</p></div>
						{activeStep === 3 && !invoice && <div className="mt-3 rounded-lg border border-obc-border px-3 py-2.5"><p className="text-[11px] text-obc-muted">Metode pembayaran</p><p className="mt-1 text-[13px] font-semibold text-obc-charcoal">{paymentMethodGroups.flatMap((group) => group.methods).find((method) => method.id === paymentMethod)?.name ?? "Belum dipilih"}</p></div>}
						{activeStep === visibleFormSteps.length && <button type="submit" disabled={saving || (invoice ? false : !resourceId || !issueDate || !startTime || !endTime || !paymentMethod)} className="mt-4 h-11 w-full rounded-lg bg-obc-green text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Menyimpan..." : invoice ? "Simpan perubahan" : "Buat invoice"}</button>}<button type="button" onClick={onClose} className="mb-4 mt-2 h-10 w-full rounded-lg border border-obc-border text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory">Batal</button>
					</div>
				</aside>}
			</form>
		</div>
	);
}
