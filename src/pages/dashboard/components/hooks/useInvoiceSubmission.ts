import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  invoiceService,
  type Invoice,
  type InvoiceBookingDetails,
  type InvoicePaymentMethod,
  type PriceBreakdownItem,
} from "../../services/admin/invoiceService";
import { sportService } from "../../services/sport/SportService";

export const SERVICE_FEE_ITEM = "Biaya layanan";
export const DISCOUNT_ITEM = "Diskon";

export function generateInvoiceNumber() {
  const now = new Date();
  return `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getTime()).slice(-6)}`;
}

type UseInvoiceSubmissionOptions = {
  invoice?: Invoice | null;
  invoiceNumber: string;
  setInvoiceNumber: (value: string) => void;
  visibleFormSteps: { id: number }[];
  validateStep: (step: number) => boolean;
  setActiveStep: (step: number) => void;
  clientName: string;
  clientEmail: string;
  phone: string;
  contactId: string;
  amount: number;
  setAmount: (value: number) => void;
  serviceFee: number;
  setServiceFee: (value: number) => void;
  discountAmount: number;
  setDiscountAmount: (value: number) => void;
  items: PriceBreakdownItem[];
  setItems: Dispatch<SetStateAction<PriceBreakdownItem[]>>;
  service: string;
  description: string;
  issueDate: string;
  dueDate: string;
  resourceId: string;
  startTime: string;
  endTime: string;
  selectedSportType: string;
  selectedFacilityName?: string;
  paymentMethod: InvoicePaymentMethod | "";
  invoiceBooking: InvoiceBookingDetails | null;
  loadingInvoiceBooking: boolean;
  onSaved: (invoice: Invoice) => void;
  onClose: () => void;
};

export default function useInvoiceSubmission({
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
  selectedFacilityName,
  paymentMethod,
  invoiceBooking,
  loadingInvoiceBooking,
  onSaved,
  onClose,
}: UseInvoiceSubmissionOptions) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (invoice) return;
    if (!resourceId || !issueDate || !startTime || !endTime || !selectedSportType)
      return;

    let active = true;
    invoiceService
      .previewBookingPrice({
        resourceId,
        bookingDate: issueDate,
        startTime,
        endTime,
        sportType: selectedSportType,
        ...(paymentMethod && paymentMethod !== "cod"
          ? { paymentChannel: paymentMethod }
          : {}),
        ...(paymentMethod === "qris"
          ? { paymentMethod: "qris" as const }
          : paymentMethod === "credit_card"
            ? { paymentMethod: "credit_card" as const }
            : ["gopay", "shopeepay", "ovo", "dana"].includes(paymentMethod)
              ? { paymentMethod: "ewallet" as const }
              : ["alfamart", "indomaret"].includes(paymentMethod)
                ? { paymentMethod: "convenience_store" as const }
                : paymentMethod && paymentMethod !== "cod"
                  ? { paymentMethod: "bank_transfer" as const }
                  : {}),
      })
      .then((price) => {
        if (!active) return;
        setAmount(price.totalPrice);
        setServiceFee(price.adminFee);
        setDiscountAmount(price.discountAmount);
        setItems([
          {
            name: `${selectedFacilityName ?? "Lapangan"} - ${issueDate} (${startTime}-${endTime})`,
            price: price.basePrice,
            quantity: 1,
            subtotal: price.basePrice,
          },
        ]);
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Harga booking gagal dihitung.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [
    resourceId,
    issueDate,
    startTime,
    endTime,
    selectedSportType,
    selectedFacilityName,
    paymentMethod,
    invoice,
    setAmount,
    setServiceFee,
    setDiscountAmount,
    setItems,
  ]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    for (const step of visibleFormSteps.map((item) => item.id)) {
      if (!validateStep(step)) {
        setActiveStep(step);
        return;
      }
    }
    if (!invoice && !paymentMethod) return;

    const finalInvoiceNumber = invoice
      ? invoice.invoiceNumber
      : invoiceNumber.trim() || generateInvoiceNumber();
    if (!invoice) setInvoiceNumber(finalInvoiceNumber);

    const breakdown: PriceBreakdownItem[] = items.map((item) => ({
      name: item.name.trim(),
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));
    if (discountAmount > 0) {
      breakdown.push({
        name: DISCOUNT_ITEM,
        price: -discountAmount,
        quantity: 1,
        subtotal: -discountAmount,
      });
    }
    if (serviceFee > 0) {
      breakdown.push({
        name: SERVICE_FEE_ITEM,
        price: serviceFee,
        quantity: 1,
        subtotal: serviceFee,
      });
    }
    const savedBreakdown = breakdown.length ? breakdown : null;

    setSaving(true);
    try {
      if (invoice) {
        if (invoice.bookingId && loadingInvoiceBooking) {
          throw new Error("Tunggu detail booking selesai dimuat.");
        }
        if (
          invoiceBooking &&
          (issueDate !== invoiceBooking.bookingDate.slice(0, 10) ||
            startTime !== invoiceBooking.startTime ||
            endTime !== invoiceBooking.endTime)
        ) {
          await sportService.rescheduleBooking(invoiceBooking.id, {
            bookingDate: issueDate,
            startTime,
            endTime,
            reason: `Jadwal diperbarui melalui edit invoice ${invoice.invoiceNumber}`,
          });
        }
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
        resourceId,
        bookingDate: issueDate,
        startTime,
        endTime,
        sportType: selectedSportType,
        bookingType: "regular",
        paymentChannel: paymentMethod as InvoicePaymentMethod,
        allowPastSlot: false,
        invoiceCheckout: true,
        guestName: clientName.trim(),
        guestEmail: clientEmail.trim(),
        guestPhone: phone.trim() || undefined,
        notes: `Invoice ${finalInvoiceNumber} untuk ${clientName} (${clientEmail})${phone ? `, ${phone}` : ""}`,
        returnUrl: `${window.location.origin}/invoice-payment/finalizing`,
      });
      void queryClient.invalidateQueries({ queryKey: ["sport-booking-day"] });
      if (booking.payment && "unavailable" in booking.payment) {
        throw new Error(booking.payment.message);
      }

      const bookingDescription = `${selectedFacilityName ?? "Lapangan"} - ${issueDate} (${startTime}-${endTime})`;
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
        service: selectedFacilityName || service || "Booking lapangan",
        description: description || null,
        priceBreakdown: savedBreakdown ?? [
          {
            name: bookingDescription,
            price: booking.totalPrice,
            quantity: 1,
            subtotal: booking.totalPrice,
          },
        ],
        issueDate: issueDate || null,
        dueDate: dueDate || null,
      });
      onSaved(saved);

      if (paymentMethod === "cod") {
        toast.success("Booking COD berhasil dikonfirmasi.");
        navigate(
          `/invoice-payment/success?bookingId=${encodeURIComponent(booking.bookingId)}`,
          { replace: true },
        );
      } else if (
        paymentMethod === "credit_card" ||
        (booking.payment && "cardPayment" in booking.payment)
      ) {
        navigate(
          `/invoice-payment/card?bookingId=${encodeURIComponent(booking.bookingId)}`,
          { replace: true },
        );
      } else if (booking.payment && "redirectUrl" in booking.payment) {
        window.location.assign(booking.payment.redirectUrl);
      } else {
        navigate(
          `/invoice-payment/finalizing?bookingId=${encodeURIComponent(booking.bookingId)}`,
          { replace: true },
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan invoice.",
      );
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSubmit };
}
