import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentInstructionCard, {
  type PaymentBookingItem,
} from "../payment/PaymentInstructionCard";
import { invoiceService, type InvoiceBookingDetails } from "../../../services/admin/invoiceService";
import { parsePersistedDirectPayment } from "../../../../../services/paymentService";

function isFinalPaymentStatus(details: InvoiceBookingDetails): boolean {
  const paymentStatus = details.payments[0]?.status ?? "";
  return (
    ["fully_paid", "completed", "cancelled", "expired", "refunded"].includes(details.status) ||
    ["paid", "settlement", "capture", "failed", "expired", "refunded"].includes(paymentStatus)
  );
}

function FinalisasiOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = new URLSearchParams(location.search).get("bookingId") ?? "";
  const {
    data: booking,
    error,
    isFetching: isChecking,
    refetch,
  } = useQuery({
    queryKey: ["invoice-booking-details", bookingId],
    queryFn: ({ signal }) => invoiceService.getBookingDetails(bookingId, signal),
    enabled: Boolean(bookingId),
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: (query) =>
      query.state.data && isFinalPaymentStatus(query.state.data) ? false : 4000,
  });

  useEffect(() => {
    if (!bookingId) {
      navigate("/admin/invoices", { replace: true });
    }
    if (!booking) return;

    const paymentStatus = booking.payments[0]?.status ?? "";
    if (["fully_paid", "completed"].includes(booking.status) || ["paid", "settlement", "capture"].includes(paymentStatus)) {
      navigate(`/invoice-payment/success?bookingId=${encodeURIComponent(bookingId)}`, { replace: true });
    } else if (["cancelled", "expired", "refunded"].includes(booking.status) || ["failed", "expired", "refunded"].includes(paymentStatus)) {
      navigate(`/invoice-payment/failed?bookingId=${encodeURIComponent(bookingId)}`, { replace: true });
    }
  }, [booking, bookingId, navigate]);

  const errorMessage = error instanceof Error
    ? error.message
    : error
      ? "Status pembayaran belum dapat dimuat."
      : "";

  const payment = booking?.payments[0];
  const paymentDetails = payment?.paymentDetails;
  const directInfo = parsePersistedDirectPayment(paymentDetails);
  const paymentChannel =
    typeof paymentDetails?.obc_payment_channel === "string"
      ? paymentDetails.obc_payment_channel
      : (payment?.method ?? "Pembayaran online");
  const bookings: PaymentBookingItem[] = booking
    ? [
        {
          id: booking.id,
          facilityName: booking.resource.name,
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-[#343133]">
      <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pt-6 pb-16">
        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {errorMessage}
          </p>
        )}
        {!booking && !errorMessage && (
          <p role="status" className="py-10 text-center text-sm text-[#6F6B6E]">
            Memeriksa status pembayaran...
          </p>
        )}
        {booking && (
          <PaymentInstructionCard
            info={directInfo}
            totalLabel={`Rp ${(payment?.amount ?? booking.pricing.totalPrice).toLocaleString("id-ID")}`}
            channelLabel={paymentChannel}
            bookings={bookings}
            onCheckStatus={() => {
              void refetch();
            }}
          />
        )}
        {isChecking && (
          <p role="status" className="mt-3 text-center text-xs text-[#6F6B6E]">
            Memperbarui status...
          </p>
        )}
      </main>
    </div>
  );
}

export default FinalisasiOrder;
