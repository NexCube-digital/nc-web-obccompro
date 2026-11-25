import { ArrowLeft, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  courtService,
  type CourtResource,
} from "../../services/sport/courtService";
import {
  customerService,
  type CustomerRecord,
} from "../../services/cms/customerService";
import {
  invoiceService,
  type Invoice,
  type InvoicePaymentMethod,
  type PriceBreakdownItem,
} from "../../services/admin/invoiceService";
import InvoiceBookingStep from "./BookingStep";
import InvoiceClientDetails from "./ClientDetails";
import InvoiceSummary from "./Summary";
import PaymentMethod from "./payment/PaymentMethod";
import useInvoiceSubmission, {
  DISCOUNT_ITEM,
  generateInvoiceNumber,
  SERVICE_FEE_ITEM,
} from "../../components/hooks/useInvoiceSubmission";
import useInvoiceBookingSchedule from "../../components/hooks/useInvoiceBookingSchedule";
import { formatBookingDate } from "../../../../utils/formatters";

const EMPTY_CUSTOMERS: CustomerRecord[] = [];
const EMPTY_FACILITIES: CourtResource[] = [];

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

export default function InvoiceForm({
  invoice,
  initialBooking,
  onClose,
  onSaved,
}: InvoiceFormProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [invoiceNumber, setInvoiceNumber] = useState(
    invoice?.invoiceNumber ?? generateInvoiceNumber(),
  );
  const [clientName, setClientName] = useState(invoice?.clientName ?? "");
  const [clientEmail, setClientEmail] = useState(invoice?.clientEmail ?? "");
  const [phone, setPhone] = useState(invoice?.phone ?? "");
  const [manualClientDraft, setManualClientDraft] = useState(() => ({
    clientName: invoice?.clientName ?? "",
    clientEmail: invoice?.clientEmail ?? "",
    phone: invoice?.phone ?? "",
  }));
  const [amount, setAmount] = useState(invoice?.amount ?? 0);
  const [paymentMethod, setPaymentMethod] = useState<InvoicePaymentMethod | "">(
    invoice?.paymentMethod ?? "",
  );
  const service = invoice?.service ?? "";
  const description = invoice?.description ?? "";
  const initialIssueDate =
    initialBooking?.bookingDate ?? (invoice?.issueDate ? invoice.issueDate.slice(0, 10) : "");
  const dueDate = invoice?.dueDate ? invoice.dueDate.slice(0, 10) : "";
  const initialPriceBreakdown = invoice?.priceBreakdown ?? [];
  const [serviceFee, setServiceFee] = useState(
    () => initialPriceBreakdown.find((item) => item.name === SERVICE_FEE_ITEM)?.subtotal ?? 0,
  );
  const [discountAmount, setDiscountAmount] = useState(
    () => initialPriceBreakdown.find((item) => item.name === DISCOUNT_ITEM)?.subtotal ?? 0,
  );
  const [items, setItems] = useState<PriceBreakdownItem[]>(() =>
    initialPriceBreakdown.filter(
      (item) => item.name !== SERVICE_FEE_ITEM && item.name !== DISCOUNT_ITEM,
    ),
  );
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
  const facilities = choicesQuery.data ?? EMPTY_FACILITIES;
  const facilitiesLoaded = !choicesQuery.isPending;
  const bookingSchedule = useInvoiceBookingSchedule({
    initialBooking,
    initialIssueDate,
    facilities,
    setAmount,
    setServiceFee,
    setDiscountAmount,
    setItems,
  });
  const {
    issueDate,
    bookingCalendarMonth,
    setBookingCalendarMonth,
    resourceId,
    startTime,
    endTime,
    durationSlots,
    selectedFacility,
    selectedSportType,
    loadingCalendarDates,
    loadingAvailability,
    availabilitySlots,
    bookedDateValues,
    unavailableDateValues,
    today,
    todayKey,
    slotMinutes,
    durationMinutes,
    isRangeAvailable,
    durationOptions,
    availableStartSlots,
    timePeriods,
    chooseFacility,
    chooseBookingDate,
    chooseDuration,
    chooseStartTime,
    loadExistingBooking,
  } = bookingSchedule;
  const [contactId, setContactId] = useState(invoice?.contactId ?? "");
  const [clientMode, setClientMode] = useState<"manual" | "registered">(
    "manual",
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const selectedRegisteredCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const [invoiceBooking, setInvoiceBooking] = useState<Awaited<
    ReturnType<typeof invoiceService.getBookingDetails>
  > | null>(null);
  const [loadingInvoiceBooking, setLoadingInvoiceBooking] = useState(
    Boolean(invoice?.bookingId),
  );

  useEffect(() => {
    if (choicesQuery.error) {
      toast.error(
        choicesQuery.error instanceof Error
          ? choicesQuery.error.message
          : "Data pilihan gagal dimuat.",
      );
    }
  }, [choicesQuery.error]);

  useEffect(() => {
    if (customersQuery.error) {
      toast.error(
        customersQuery.error instanceof Error
          ? customersQuery.error.message
          : "Daftar pelanggan gagal dimuat.",
      );
    }
  }, [customersQuery.error]);

  useEffect(() => {
    if (!invoice?.bookingId) return;
    let active = true;
    invoiceService
      .getBookingDetails(invoice.bookingId)
      .then((booking) => {
        if (active) setInvoiceBooking(booking);
      })
      .catch((error: unknown) => {
        if (active)
          toast.error(
            error instanceof Error
              ? error.message
              : "Detail booking invoice gagal dimuat.",
          );
      })
      .finally(() => {
        if (active) setLoadingInvoiceBooking(false);
      });
    return () => {
      active = false;
    };
  }, [invoice?.bookingId]);

  useEffect(() => {
    if (invoiceBooking) loadExistingBooking(invoiceBooking);
  }, [invoiceBooking, loadExistingBooking]);

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
      const phoneIsValid =
        clientMode === "registered"
          ? !phone || /^(?:08[1-9]\d{7,10}|628[1-9]\d{7,10})$/.test(phone)
          : /^(?:08[1-9]\d{7,10}|628[1-9]\d{7,10})$/.test(phone);
      if (
        !clientName.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim()) ||
        !phoneIsValid
      ) {
        toast.error(
          "Lengkapi nama, email yang valid, dan nomor telepon Indonesia yang valid.",
        );
        return false;
      }
    }
    if (step === 2) {
      if (invoice) {
        if (invoice.bookingId && loadingInvoiceBooking) {
          toast.error("Tunggu detail booking selesai dimuat.");
          return false;
        }
        if (invoiceBooking && (!resourceId || !issueDate || !startTime || !endTime)) {
          toast.error("Pilih lapangan, tanggal, dan waktu booking terlebih dahulu.");
          return false;
        }
        if (invoiceBooking && !isRangeAvailable(startTime, durationMinutes)) {
          toast.error("Rentang waktu ini tidak lagi tersedia. Silakan pilih slot lain.");
          return false;
        }
        return true;
      }
      if (!resourceId || !issueDate || !startTime || !endTime) {
        toast.error("Pilih lapangan, tanggal, dan slot waktu terlebih dahulu.");
        return false;
      }
      if (!isRangeAvailable(startTime, durationMinutes)) {
        toast.error(
          "Rentang waktu ini tidak lagi tersedia. Silakan pilih slot lain.",
        );
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
      for (
        let step = activeStep;
        step < nextStep && step < visibleFormSteps.length;
        step += 1
      ) {
        if (!validateStep(step)) return;
      }
    }
    setActiveStep(nextStep);
  };

  const loadCalendarMonth = (month: Date) => {
    setBookingCalendarMonth(month);
  };

  const { saving, handleSubmit } = useInvoiceSubmission({
    invoice,
    invoiceNumber,
    setInvoiceNumber,
    visibleFormSteps,
    validateStep,
    setActiveStep,
    clientName,
    clientEmail,
    phone,
    contactId,
    amount,
    setAmount,
    serviceFee,
    setServiceFee,
    discountAmount,
    setDiscountAmount,
    items,
    setItems,
    service,
    description,
    issueDate,
    dueDate,
    resourceId,
    startTime,
    endTime,
    selectedSportType,
    selectedFacilityName: selectedFacility?.name,
    paymentMethod,
    invoiceBooking,
    loadingInvoiceBooking,
    onSaved,
    onClose,
  });

  const inputClass =
    "mt-1 h-11 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";

  const chooseContact = (id: string) => {
    const customer = customers.find((item) => item.id === id);
    if (!customer) return;
    setClientMode("registered");
    setSelectedCustomerId(customer.id);
    setContactId("");
    setClientName(customer.name);
    setClientEmail(customer.email);
    setPhone(customer.phone?.replace(/\D/g, "") ?? "");
  };

  const updateManualClientName = (value: string) => {
    setManualClientDraft((current) => ({ ...current, clientName: value }));
    setClientName(value);
  };

  const updateManualClientEmail = (value: string) => {
    setManualClientDraft((current) => ({ ...current, clientEmail: value }));
    setClientEmail(value);
  };

  const updateManualClientPhone = (value: string) => {
    setManualClientDraft((current) => ({ ...current, phone: value }));
    setPhone(value);
  };

  const chooseClientMode = (mode: "manual" | "registered") => {
    if (mode === clientMode) return;
    if (mode === "manual") {
      setClientName(manualClientDraft.clientName);
      setClientEmail(manualClientDraft.clientEmail);
      setPhone(manualClientDraft.phone);
    } else if (selectedRegisteredCustomer) {
      setClientName(selectedRegisteredCustomer.name);
      setClientEmail(selectedRegisteredCustomer.email);
      setPhone(selectedRegisteredCustomer.phone?.replace(/\D/g, "") ?? "");
    }
    setClientMode(mode);
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
  const showBookingCalendar = activeStep === 2 &&
    (!invoice || Boolean(invoice.bookingId && invoiceBooking));

  return (
    <div className="mx-auto max-w-6xl pb-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
            <Receipt size={20} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">
              Invoice / {invoice ? "Edit" : "Baru"}
            </p>
            <h2 className="mt-1 font-heading text-[21px] font-bold text-obc-charcoal sm:text-[24px]">
              {invoice ? "Edit invoice" : "Buat invoice booking"}
            </h2>
            <p className="mt-0.5 text-[12px] text-obc-muted">
              Lengkapi detail klien dan jadwal lapangan.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-border px-3 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory"
        >
          <ArrowLeft size={15} />
          Kembali
        </button>
      </header>
      <form
        onSubmit={handleSubmit}
        className={`grid gap-5 ${showBookingCalendar || (!invoice && activeStep === 3) ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}
      >
        <div className="space-y-5">
          <div
            role="tablist"
            aria-label="Langkah pembuatan invoice"
            className="grid grid-cols-3 gap-1 rounded-xl border border-obc-border bg-white p-1.5"
          >
            {visibleFormSteps.map((step) => {
              const active = activeStep === step.id;
              const complete = activeStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => moveToStep(step.id)}
                  className={`min-w-0 rounded-lg px-2 py-2.5 text-left transition-colors sm:px-3 ${active ? "bg-[#F3F8E8] text-obc-green" : "text-obc-muted hover:bg-obc-ivory hover:text-obc-charcoal"}`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${active || complete ? "bg-obc-green text-white" : "bg-obc-ivory text-obc-muted"}`}
                    >
                      {step.id}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold sm:text-[13px]">
                        {step.title}
                      </span>
                      <span className="hidden truncate text-[10px] text-obc-muted sm:block">
                        {step.subtitle}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {activeStep === 1 && (
            <InvoiceClientDetails
              clientMode={clientMode}
              onClientModeChange={chooseClientMode}
              customers={customers}
              customersLoading={customersQuery.isPending}
              selectedCustomerId={selectedCustomerId}
              selectedRegisteredCustomer={selectedRegisteredCustomer}
              onChooseContact={chooseContact}
              clientName={clientName}
              onClientNameChange={updateManualClientName}
              clientEmail={clientEmail}
              onClientEmailChange={updateManualClientEmail}
              phone={phone}
              onPhoneChange={updateManualClientPhone}
              invoiceNumber={invoiceNumber}
              onInvoiceNumberChange={setInvoiceNumber}
              invoiceExists={Boolean(invoice)}
              inputClass={inputClass}
            />
          )}
          {activeStep === 2 && (
            <InvoiceBookingStep view="selection" {...bookingStepProps} />
          )}
          {activeStep === 3 && !invoice && (
            <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
          )}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => moveToStep(activeStep - 1)}
              disabled={activeStep === 1}
              className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:invisible"
            >
              Kembali
            </button>
            {activeStep < visibleFormSteps.length ? (
              <button
                type="button"
                onClick={() => moveToStep(activeStep + 1)}
                className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover"
              >
                Lanjutkan
              </button>
            ) : invoice ? (
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-lg bg-obc-green px-5 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan perubahan"}
              </button>
            ) : (
              <p className="text-[12px] text-obc-muted">
                Periksa ringkasan sebelum menyimpan.
              </p>
            )}
          </div>
        </div>
        {showBookingCalendar && (
          <InvoiceBookingStep view="calendar" {...bookingStepProps} />
        )}
        {activeStep === 3 && !invoice && (
          <InvoiceSummary
            invoiceNumber={invoiceNumber}
            invoiceBooking={invoiceBooking}
            selectedFacilityName={selectedFacility?.name ?? null}
            issueDate={issueDate}
            formatBookingDate={formatBookingDate}
            startTime={startTime}
            endTime={endTime}
            items={items}
            discountAmount={discountAmount}
            serviceFee={serviceFee}
            amount={amount}
            paymentMethod={paymentMethod}
            saving={saving}
            invoiceExists={Boolean(invoice)}
            canSubmit={Boolean(resourceId && issueDate && startTime && endTime && paymentMethod)}
            onClose={onClose}
          />
        )}
      </form>
    </div>
  );
}
