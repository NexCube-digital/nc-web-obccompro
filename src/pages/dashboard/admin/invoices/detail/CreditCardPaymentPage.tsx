import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { invoiceService, type InvoiceBookingDetails } from "../../../services/admin/invoiceService";
import CreditCardPaymentForm from "../payment/CreditCardPaymentForm";

function isFinalPaymentStatus(details: InvoiceBookingDetails): boolean {
  const paymentStatus = details.payments[0]?.status ?? "";
  return (
    ["fully_paid", "completed", "cancelled", "expired", "refunded"].includes(details.status) ||
    ["paid", "settlement", "capture", "expired", "refunded"].includes(paymentStatus)
  );
}

function CreditCardPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = new URLSearchParams(location.search).get("bookingId") ?? "";
  const {
    data: booking,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["invoice-booking-details", bookingId],
    queryFn: ({ signal }) => invoiceService.getBookingDetails(bookingId, signal),
    enabled: Boolean(bookingId),
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data && isFinalPaymentStatus(query.state.data) ? false : 4000,
  });

  useEffect(() => {
    if (!bookingId) {
      navigate("/home", { replace: true });
      return;
    }

    if (!booking) return;

    const paymentStatus = booking.payments[0]?.status ?? "";
    if (["fully_paid", "completed"].includes(booking.status) || ["paid", "settlement", "capture"].includes(paymentStatus)) {
      navigate(`/invoice-payment/success?bookingId=${encodeURIComponent(bookingId)}`, { replace: true });
    } else if (["cancelled", "expired", "refunded"].includes(booking.status) || ["expired", "refunded"].includes(paymentStatus)) {
      navigate(`/invoice-payment/failed?bookingId=${encodeURIComponent(bookingId)}`, { replace: true });
    } else if (booking.payments[0]?.method !== "credit_card") {
      navigate(`/invoice-payment/finalizing?bookingId=${encodeURIComponent(bookingId)}`, { replace: true });
    }
  }, [booking, bookingId, navigate]);

  const errorMessage = error instanceof Error
    ? error.message
    : error
      ? "Booking tidak dapat dimuat."
      : "";

  const openInformationOrder = () => {
    navigate(
      `/invoice-payment/finalizing?bookingId=${encodeURIComponent(bookingId)}`,
      {
        replace: true,
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-obc-charcoal">
      <main className="mx-auto w-full max-w-140 flex-1 px-4 pt-6 pb-16">
        {errorMessage ? (
          <p
            role="alert"
            className="rounded-lg border border-[#F1B4B4] bg-[#FDF2F2] px-4 py-3 text-sm text-[#C00000]"
          >
            {errorMessage}
          </p>
        ) : booking && booking.payments[0]?.method === "credit_card" ? (
          <CreditCardPaymentForm
            bookingId={booking.id}
            amount={booking.payments[0]?.amount ?? booking.pricing.totalPrice}
            onPaymentStarted={openInformationOrder}
          />
        ) : (
          <p role="status" className="text-center text-sm text-obc-muted">
            {isFetching ? "Memeriksa status pembayaran kartu..." : "Memuat pembayaran kartu..."}
          </p>
        )}
      </main>
    </div>
  );
}

export default CreditCardPaymentPage;
