import { ArrowLeft, CalendarDays, Check, ChevronDown, Receipt, Search, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { courtService, type CourtResource } from "../../services/sport/courtService";
import { customerService, type CustomerRecord } from "../../services/cms/customerService";
import { useDebouncedValue } from "../../components/hooks/useDebouncedValue";
import { invoiceService, type AvailabilitySlot, type FacilityCalendarDate, type Invoice, type InvoicePaymentMethod, type PriceBreakdownItem } from "../../services/admin/invoiceService";
import InvoiceBookingStep from "./InvoiceBookingStep";
import PaymentMethod, { getPaymentMethodLabel } from "./payment/PaymentMethod";
import { formatBookingDate, formatIdr as rupiah, toLocalDateKey as toDateKey } from "../../../../utils/formatters";

const generateInvoiceNumber = () => {
	const now = new Date();
	return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getTime()).slice(-6)}`;
};

const toDateInput = (value: string | null) => value ? value.slice(0, 10) : "";
const timeToMinutes = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	return hour * 60 + minute;
};
const minutesToTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
const SERVICE_FEE_ITEM = "Biaya layanan";
const DISCOUNT_ITEM = "Diskon";
const EMPTY_CUSTOMERS: CustomerRecord[] = [];
const EMPTY_FACILITIES: CourtResource[] = [];
const EMPTY_CALENDAR_DATES: FacilityCalendarDate[] = [];
const EMPTY_AVAILABILITY_SLOTS: AvailabilitySlot[] = [];

interface InvoiceFormProps {
	invoice?: Invoice | null;
	initialBooking?: BookingInvoiceDraft | null;
	onClose: () => void;
	onSaved: (invoice: Invoice) => void;
}

export type BookingInvoiceDraft = {
	resourceId: string;
	bookingDate: string;
	startTime: string;
	endTime: string;
	sportType: string;
};

export default function InvoiceForm({ invoice, initialBooking, onClose, onSaved }: InvoiceFormProps) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [saving, setSaving] = useState(false);
	const [activeStep, setActiveStep] = useState(1);
	const initialDurationSlots = initialBooking
		? Math.max(
			initialBooking.sportType === "sepakbola" ? 2 : 1,
			Math.ceil((timeToMinutes(initialBooking.endTime) - timeToMinutes(initialBooking.startTime)) / 60),
		)
		: 1;
	const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber ?? generateInvoiceNumber());
	const [clientName, setClientName] = useState(invoice?.clientName ?? "");
	const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
	const [phone, setPhone] = useState(invoice?.phone ?? "");
	const [amount, setAmount] = useState(invoice?.amount ?? 0);
	const [paymentMethod, setPaymentMethod] = useState<InvoicePaymentMethod | "">(invoice?.paymentMethod ?? "");
	const service = invoice?.service ?? "";
	const description = invoice?.description ?? "";
	const initialIssueDate = initialBooking?.bookingDate ?? toDateInput(invoice?.issueDate ?? null);
	const [issueDate, setIssueDate] = useState(initialIssueDate);
	const [bookingCalendarMonth, setBookingCalendarMonth] = useState(() => initialIssueDate ? new Date(`${initialIssueDate}T00:00:00`) : new Date());
	const dueDate = toDateInput(invoice?.dueDate ?? null);
	const initialPriceBreakdown = invoice?.priceBreakdown ?? [];
	const [serviceFee, setServiceFee] = useState(() => initialPriceBreakdown.find((item) => item.name === SERVICE_FEE_ITEM)?.subtotal ?? 0);
	const [discountAmount, setDiscountAmount] = useState(() => initialPriceBreakdown.find((item) => item.name === DISCOUNT_ITEM)?.subtotal ?? 0);
	const [items, setItems] = useState<PriceBreakdownItem[]>(() => initialPriceBreakdown.filter((item) => item.name !== SERVICE_FEE_ITEM && item.name !== DISCOUNT_ITEM));
	const choicesQuery = useQuery({
		queryKey: ["invoice-form-facilities"],
		queryFn: () => courtService.getResources(),
		staleTime: 5 * 60 * 1000,
	});
	const customersQuery = useQuery({
		queryKey: ["invoice-form-customers"],
		queryFn: () => customerService.getCustomers({ page: 1, limit: 100 }),
		staleTime: 5 * 60 * 1000,
	});
	const customers = customersQuery.data?.items ?? EMPTY_CUSTOMERS;
	const [customerSearch, setCustomerSearch] = useState("");
	const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
	const customerPickerRef = useRef<HTMLDivElement>(null);
	const debouncedCustomerSearch = useDebouncedValue(customerSearch, 300);
	const filteredCustomers = useMemo(() => {
		const query = debouncedCustomerSearch.trim().toLocaleLowerCase("id-ID");
		return customers.filter((customer) =>
			[customer.name, customer.email, customer.phone ?? ""]
				.join(" ")
				.toLocaleLowerCase("id-ID")
				.includes(query),
		);
	}, [customers, debouncedCustomerSearch]);
	const facilities = choicesQuery.data ?? EMPTY_FACILITIES;
	const facilitiesLoaded = !choicesQuery.isPending;
	const [contactId, setContactId] = useState(invoice?.contactId ?? "");
	const [clientMode, setClientMode] = useState<"manual" | "registered">("manual");
	const [selectedCustomerId, setSelectedCustomerId] = useState("");
	const selectedRegisteredCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;
	const [resourceId, setResourceId] = useState(initialBooking?.resourceId ?? "");
	const [startTime, setStartTime] = useState(initialBooking?.startTime ?? "");
	const [endTime, setEndTime] = useState(() => initialBooking ? minutesToTime(timeToMinutes(initialBooking.startTime) + 60 * initialDurationSlots) : "");
	const [durationSlots, setDurationSlots] = useState(initialDurationSlots);
	const [invoiceBooking, setInvoiceBooking] = useState<Awaited<ReturnType<typeof invoiceService.getBookingDetails>> | null>(null);
	const [loadingInvoiceBooking, setLoadingInvoiceBooking] = useState(Boolean(invoice?.bookingId));

	useEffect(() => {
		if (!customerPickerOpen) return;
		const closeOnOutsideClick = (event: PointerEvent) => {
			if (event.target instanceof Node && !customerPickerRef.current?.contains(event.target)) {
				setCustomerPickerOpen(false);
			}
		};
		document.addEventListener("pointerdown", closeOnOutsideClick);
		return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
	}, [customerPickerOpen]);

	useEffect(() => {
		if (choicesQuery.error) {
			toast.error(choicesQuery.error instanceof Error ? choicesQuery.error.message : "Data pilihan gagal dimuat.");
		}
	}, [choicesQuery.error]);

	useEffect(() => {
		if (customersQuery.error) {
			toast.error(customersQuery.error instanceof Error ? customersQuery.error.message : "Daftar pelanggan gagal dimuat.");
		}
	}, [customersQuery.error]);

	useEffect(() => {
		if (!invoice?.bookingId) return;
		let active = true;
		invoiceService.getBookingDetails(invoice.bookingId)
			.then((booking) => { if (active) setInvoiceBooking(booking); })
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Detail booking invoice gagal dimuat."); })
			.finally(() => { if (active) setLoadingInvoiceBooking(false); });
		return () => { active = false; };
	}, [invoice?.bookingId]);

	const selectedFacility = useMemo(
		() => facilities.find((facility) => facility.id === resourceId) ?? null,
		[facilities, resourceId],
	);
	const selectedSportType = initialBooking && selectedFacility?.sportTypes.includes(initialBooking.sportType)
		? initialBooking.sportType
		: selectedFacility?.sportTypes.includes("sepakbola")
			? "sepakbola"
			: selectedFacility?.sportTypes[0] ?? "";
	const minimumDurationSlots = selectedFacility?.sportTypes.includes("sepakbola") ? 2 : 1;
	const calendarRange = useMemo(() => ({
		from: toDateKey(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth(), 1)),
		to: toDateKey(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() + 1, 0)),
	}), [bookingCalendarMonth]);
	const calendarQuery = useQuery({
		queryKey: ["invoice-facility-calendar", resourceId, calendarRange.from, calendarRange.to],
		queryFn: ({ signal }) => invoiceService.getFacilityCalendar(resourceId, calendarRange.from, calendarRange.to, signal),
		enabled: Boolean(resourceId),
		staleTime: 30_000,
	});
	const availabilityQuery = useQuery({
		queryKey: ["invoice-facility-availability", resourceId, issueDate, selectedSportType],
		queryFn: ({ signal }) => invoiceService.getFacilityAvailability(resourceId, issueDate, selectedSportType, false, signal),
		enabled: Boolean(resourceId && issueDate && selectedSportType),
		staleTime: 10_000,
	});
	const calendarDates = calendarQuery.data?.dates ?? EMPTY_CALENDAR_DATES;
	const loadingCalendarDates = Boolean(resourceId) && calendarQuery.isPending;
	const availabilitySlots = availabilityQuery.data?.slots ?? EMPTY_AVAILABILITY_SLOTS;
	const loadingAvailability = Boolean(resourceId && issueDate && selectedSportType) && availabilityQuery.isPending;

	useEffect(() => {
		if (calendarQuery.error) {
			toast.error(calendarQuery.error instanceof Error ? calendarQuery.error.message : "Penanda jadwal gagal dimuat.");
		}
	}, [calendarQuery.error]);

	useEffect(() => {
		if (availabilityQuery.error) {
			toast.error(availabilityQuery.error instanceof Error ? availabilityQuery.error.message : "Ketersediaan jadwal gagal dimuat.");
		}
	}, [availabilityQuery.error]);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const todayKey = toDateKey(today);
	const currentTimeMinutes = new Date().getHours() * 60 + new Date().getMinutes();
	const bookedDateValues = useMemo(
		() => calendarDates.filter((day) => day.hasBookings).map((day) => new Date(`${day.date}T00:00:00`)),
		[calendarDates],
	);
	const unavailableDateValues = useMemo(
		() => calendarDates.filter((day) => ["full", "closed", "maintenance"].includes(day.status)).map((day) => new Date(`${day.date}T00:00:00`)),
		[calendarDates],
	);
	const slotMinutes = 60;
	const durationMinutes = slotMinutes * durationSlots;
	const availabilityIntervalMinutes = availabilitySlots[0]
		? timeToMinutes(availabilitySlots[0].endTime) - timeToMinutes(availabilitySlots[0].startTime)
		: 60;
	const scheduleOptions = useMemo(() => {
		const hourlySlots = availabilitySlots.filter((slot) => timeToMinutes(slot.startTime) % 60 === 0);
		const slotsByStart = new Map(availabilitySlots.map((slot) => [slot.startTime, slot]));
		const isRangeAvailable = (start: string, duration: number) => {
			if (timeToMinutes(start) % 60 !== 0 || duration % 60 !== 0) return false;
			if (issueDate < todayKey || (issueDate === todayKey && timeToMinutes(start) <= currentTimeMinutes)) return false;
			const endMinute = timeToMinutes(start) + duration;
			for (let minute = timeToMinutes(start); minute < endMinute; minute += availabilityIntervalMinutes) {
				const slot = slotsByStart.get(minutesToTime(minute));
				if (!slot?.available || timeToMinutes(slot.endTime) < minute + availabilityIntervalMinutes) return false;
			}
			return true;
		};
		const durationOptions = Array.from(
			{ length: 5 - minimumDurationSlots },
			(_, index) => 60 * (minimumDurationSlots + index),
		)
			.filter((duration) => hourlySlots.some((slot) => slot.available && isRangeAvailable(slot.startTime, duration)));
		const availableStartSlots = hourlySlots.filter((slot) => isRangeAvailable(slot.startTime, durationMinutes));
		const timePeriods = [
			{ label: "Pagi - Siang", from: 5 * 60, to: 17 * 60 },
			{ label: "Malam", from: 17 * 60, to: 5 * 60 },
		].map((period) => ({
			...period,
			slots: hourlySlots.filter((slot) => {
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
		return { isRangeAvailable, durationOptions, availableStartSlots, timePeriods };
	}, [availabilityIntervalMinutes, availabilitySlots, currentTimeMinutes, durationMinutes, issueDate, minimumDurationSlots, todayKey]);
	const { isRangeAvailable, durationOptions, availableStartSlots, timePeriods } = scheduleOptions;
	const formSteps = [
		{ id: 1, title: "Data klien", subtitle: "Penerima tagihan" },
		{ id: 2, title: "Detail booking", subtitle: "Lapangan dan jadwal" },
		{ id: 3, title: "Informasi pembayaran", subtitle: "Metode dan ketentuan" },
	];
	const visibleFormSteps = invoice ? formSteps.slice(0, 2) : formSteps;

	const validateStep = (step: number) => {
		if (step === 1) {
			if (clientMode === "registered" && !selectedCustomerId) {
				toast.error("Pilih pelanggan terdaftar terlebih dahulu.");
				return false;
			}
			const phoneIsValid = clientMode === "registered"
				? !phone || /^(?:08[1-9]\d{7,10}|628[1-9]\d{7,10})$/.test(phone)
				: /^(?:08[1-9]\d{7,10}|628[1-9]\d{7,10})$/.test(phone);
			if (!clientName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim()) || !phoneIsValid) {
				toast.error("Lengkapi nama, email yang valid, dan nomor telepon Indonesia yang valid.");
				return false;
			}
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
	};

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
			void queryClient.invalidateQueries({ queryKey: ["sport-booking-day"] });
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
		const customer = customers.find((item) => item.id === id);
		if (!customer) return;
		setClientMode("registered");
		setSelectedCustomerId(customer.id);
		setContactId("");
		setClientName(customer.name);
		setClientEmail(customer.email);
		setPhone(customer.phone?.replace(/\D/g, "") ?? "");
		setCustomerSearch("");
		setCustomerPickerOpen(false);
	};

	const chooseClientMode = (mode: "manual" | "registered") => {
		if (mode === clientMode) return;
		setClientMode(mode);
		setContactId("");
		setSelectedCustomerId("");
		setCustomerSearch("");
		setCustomerPickerOpen(false);
		setClientName("");
		setClientEmail("");
		setPhone("");
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
		setDurationSlots(facilities.find((facility) => facility.id === id)?.sportTypes.includes("sepakbola") ? 2 : 1);
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
		setDurationSlots(minimumDurationSlots);
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
						<div className="grid grid-cols-2 gap-1 rounded-lg bg-[#F1F3EE] p-1" role="group" aria-label="Sumber data klien">
							<button type="button" aria-pressed={clientMode === "registered"} onClick={() => chooseClientMode("registered")} className={`h-10 rounded-md px-3 text-[12px] font-semibold transition-colors ${clientMode === "registered" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}>Pelanggan terdaftar</button>
							<button type="button" aria-pressed={clientMode === "manual"} onClick={() => chooseClientMode("manual")} className={`h-10 rounded-md px-3 text-[12px] font-semibold transition-colors ${clientMode === "manual" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}>Isi manual</button>
						</div>
						{clientMode === "registered" && (
							<div ref={customerPickerRef} className="relative mt-4">
								<span className="text-[13px] font-medium text-obc-charcoal">Pilih pelanggan</span>
								<button
									type="button"
									aria-label="Cari dan pilih pelanggan terdaftar"
									aria-expanded={customerPickerOpen}
									aria-controls="invoice-customer-options"
									disabled={customersQuery.isPending || !customers.length}
									onClick={() => {
										setCustomerSearch("");
										setCustomerPickerOpen((open) => !open);
									}}
									className="mt-1 flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-left text-[13px] outline-none transition-colors hover:border-obc-green focus-visible:ring-2 focus-visible:ring-[#CDF178] disabled:cursor-not-allowed disabled:opacity-60"
								>
									<span className={`min-w-0 truncate ${selectedRegisteredCustomer ? "font-medium text-obc-charcoal" : "text-obc-muted"}`}>
										{customersQuery.isPending ? "Memuat pelanggan..." : selectedRegisteredCustomer ? `${selectedRegisteredCustomer.name} · ${selectedRegisteredCustomer.email}` : customers.length ? "Cari nama, email, atau telepon..." : "Belum ada pelanggan terdaftar"}
									</span>
									<ChevronDown size={16} className={`shrink-0 text-obc-green transition-transform ${customerPickerOpen ? "rotate-180" : ""}`} />
								</button>
								{customerPickerOpen && (
									<div id="invoice-customer-options" className="absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-obc-border bg-white shadow-[0_12px_30px_rgba(31,51,32,0.16)]">
										<label className="relative block border-b border-obc-border p-2">
											<Search size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-obc-muted" />
											<input
												autoFocus
												value={customerSearch}
												onChange={(event) => setCustomerSearch(event.target.value)}
												onKeyDown={(event) => { if (event.key === "Escape") setCustomerPickerOpen(false); }}
												placeholder="Cari nama, email, atau telepon..."
												className="h-10 w-full rounded-md border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[12px] outline-none focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
											/>
										</label>
										<div role="listbox" aria-label="Hasil pelanggan" className="max-h-60 overflow-y-auto p-1.5">
											{filteredCustomers.length ? filteredCustomers.map((customer) => (
												<button
													key={customer.id}
													type="button"
													role="option"
													aria-selected={selectedCustomerId === customer.id}
													onClick={() => chooseContact(customer.id)}
													className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-[#F3F8E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green"
												>
													<span className="min-w-0">
														<span className="block truncate text-[12px] font-semibold text-obc-charcoal">{customer.name}</span>
														<span className="mt-0.5 block truncate text-[11px] text-obc-muted">{customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</span>
													</span>
													{selectedCustomerId === customer.id && <Check size={15} className="shrink-0 text-obc-green" />}
												</button>
											)) : (
												<p className="px-3 py-6 text-center text-[12px] text-obc-muted">
													{customersQuery.isPending ? "Memuat pelanggan..." : debouncedCustomerSearch ? "Pelanggan tidak ditemukan." : "Belum ada pelanggan terdaftar."}
												</p>
											)}
										</div>
									</div>
								)}
							</div>
						)}
						{clientMode === "registered" && selectedCustomerId ? (
							<dl className="mt-4 grid gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] p-4 text-[12px] sm:grid-cols-3">
								<div><dt className="text-[10px] text-obc-muted">Nama</dt><dd className="mt-1 font-semibold text-obc-charcoal">{clientName}</dd></div>
								<div><dt className="text-[10px] text-obc-muted">Email</dt><dd className="mt-1 break-all font-semibold text-obc-charcoal">{clientEmail}</dd></div>
								<div><dt className="text-[10px] text-obc-muted">Telepon</dt><dd className="mt-1 font-semibold text-obc-charcoal">{phone || "-"}</dd></div>
							</dl>
						) : clientMode === "manual" ? (
							<div className="mt-4 grid gap-4 md:grid-cols-2">
								<label className="text-[13px] font-medium">Nama klien<input required value={clientName} onChange={(event) => setClientName(event.target.value)} className={inputClass} /></label>
								<label className="text-[13px] font-medium">Email klien<input required type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} className={inputClass} /></label>
								<label className="text-[13px] font-medium">Telepon<input required type="tel" inputMode="numeric" pattern="(?:08[1-9][0-9]{7,10}|628[1-9][0-9]{7,10})" title="Masukkan nomor telepon Indonesia yang valid menggunakan digit saja" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} className={inputClass} /></label>
							</div>
						) : (
							<p role="status" className="mt-4 rounded-lg border border-dashed border-obc-border px-4 py-6 text-center text-[12px] text-obc-muted">Pilih pelanggan terdaftar untuk mengisi data klien.</p>
						)}
						<label className="mt-4 block text-[13px] font-medium">Nomor invoice<input disabled={Boolean(invoice)} placeholder={invoice ? "" : "Otomatis dibuat jika kosong"} value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} className={inputClass} /></label>
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
