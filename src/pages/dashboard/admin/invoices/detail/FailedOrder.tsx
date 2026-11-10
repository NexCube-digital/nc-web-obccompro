import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react";
import { invoiceService, type InvoiceBookingDetails } from "../../../services/admin/invoiceService";

function FailedOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = new URLSearchParams(location.search).get("bookingId") ?? "";
  const [booking, setBooking] = useState<InvoiceBookingDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!bookingId) {
      navigate("/admin/invoices", { replace: true });
      return;
    }
    let active = true;
    invoiceService
      .getBookingDetails(bookingId)
      .then((details) => {
        if (!active) return;
        if (
          ["fully_paid", "completed"].includes(details.status) ||
          ["paid", "settlement", "capture"].includes(
            details.payments[0]?.status ?? "",
          )
        ) {
          navigate(
            `/invoice-payment/success?bookingId=${encodeURIComponent(bookingId)}`,
            { replace: true },
          );
          return;
        }
        if (
          !["cancelled", "expired", "refunded"].includes(details.status) &&
          !["failed", "expired", "refunded"].includes(
            details.payments[0]?.status ?? "",
          )
        ) {
          navigate(
            `/invoice-payment/finalizing?bookingId=${encodeURIComponent(bookingId)}`,
            { replace: true },
          );
          return;
        }
        setBooking(details);
      })
      .catch((error: unknown) => {
        if (active)
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Status booking tidak dapat dimuat.",
          );
      });
    return () => {
      active = false;
    };
  }, [bookingId, navigate]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[560px] flex-col justify-center px-4 py-10 text-obc-charcoal">
      <section className="rounded-xl border border-obc-border bg-white p-5 text-center sm:p-8">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#FDF2F2] text-[#B42318]">
          <CircleX size={32} />
        </span>
        <h1 className="mt-4 font-heading text-xl font-bold">
          Pembayaran belum berhasil
        </h1>
        <p className="mt-2 text-sm leading-6 text-obc-muted">
          {errorMessage ||
            "Pembayaran tidak selesai atau sudah kedaluwarsa. Slot ini tidak lagi ditahan."}
        </p>
        {booking && (
          <p className="mt-4 text-xs text-obc-muted">
            Kode booking:{" "}
            <span className="font-semibold text-obc-charcoal">
              {booking.id.slice(-8).toUpperCase()}
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate("/admin/invoices")}
          className="mt-6 h-11 w-full rounded-lg border border-obc-green bg-white text-sm font-semibold text-obc-green transition-colors hover:bg-[#F3F8E8]"
        >
          Kembali ke manajemen invoice
        </button>
      </section>
    </main>
  );
}

export default FailedOrder;
