import {
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import type {
  Invoice,
  InvoiceBookingDetails,
  InvoiceStatus,
} from "./invoiceService";

const statusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Pending",
  paid: "Success",
  overdue: "Pending",
  expired: "Gagal",
  partial: "Pending",
  cancelled: "Gagal",
};

const statusClasses: Record<InvoiceStatus, string> = {
  draft: "bg-[#F1EFE8] text-[#404F14]",
  sent: "bg-[#FBF0D3] text-[#8A6100]",
  paid: "bg-[#E7F5D0] text-[#1F3320]",
  overdue: "bg-[#FBF0D3] text-[#8A6100]",
  expired: "bg-[#FDF2F2] text-[#B42318]",
  partial: "bg-[#FBF0D3] text-[#8A6100]",
  cancelled: "bg-[#FDF2F2] text-[#B42318]",
};

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

interface InvoiceDetailModalProps {
  invoice: Invoice;
  booking: InvoiceBookingDetails | null;
  loadingBooking: boolean;
  onClose: () => void;
}

export default function InvoiceDetailModal({
  invoice,
  booking,
  loadingBooking,
  onClose,
}: InvoiceDetailModalProps) {
  const breakdown = invoice.priceBreakdown ?? [];
  const baseAmount = breakdown
    .filter((item) => item.name !== "Biaya layanan" && item.name !== "Diskon")
    .reduce((total, item) => total + item.subtotal, 0);
  const discount =
    breakdown.find((item) => item.name === "Diskon")?.subtotal ?? 0;
  const serviceFee =
    breakdown.find((item) => item.name === "Biaya layanan")?.subtotal ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-detail-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-obc-border px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="invoice-detail-title"
                className="font-heading text-lg font-bold text-obc-charcoal"
              >
                {invoice.invoiceNumber}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[invoice.status]}`}
              >
                {statusLabels[invoice.status]}
              </span>
            </div>
            <p className="mt-1 text-xs text-obc-muted">
              Diterbitkan {formatDate(invoice.issueDate)}
              {invoice.paymentMethod
                ? ` · ${invoice.paymentMethod.replaceAll("_", " ")}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail invoice"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-obc-border p-4">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-obc-charcoal">
                <UserRound size={16} className="text-obc-green" />
                Data klien
              </h3>
              <dl className="mt-3 space-y-3 text-[13px]">
                <div>
                  <dt className="text-[11px] text-obc-muted">Nama</dt>
                  <dd className="mt-0.5 font-medium text-obc-charcoal">
                    {invoice.clientName}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-obc-muted">Email</dt>
                  <dd className="mt-0.5 break-all font-medium text-obc-charcoal">
                    {invoice.clientEmail}
                  </dd>
                </div>
                {invoice.phone && (
                  <div>
                    <dt className="text-[11px] text-obc-muted">Telepon</dt>
                    <dd className="mt-0.5 font-medium text-obc-charcoal">
                      {invoice.phone}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-lg border border-obc-border p-4">
              <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-obc-charcoal">
                <MapPin size={16} className="text-obc-green" />
                Detail booking
              </h3>
              {loadingBooking ? (
                <p role="status" className="mt-3 text-[13px] text-obc-muted">
                  Memuat booking...
                </p>
              ) : booking ? (
                <dl className="mt-3 space-y-3 text-[13px]">
                  <div>
                    <dt className="text-[11px] text-obc-muted">Lapangan</dt>
                    <dd className="mt-0.5 font-semibold text-obc-charcoal">
                      {booking.resource.name}
                    </dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <CalendarDays size={14} className="mt-0.5 text-obc-green" />
                    <div>
                      <dt className="text-[11px] text-obc-muted">Tanggal</dt>
                      <dd className="mt-0.5 font-medium text-obc-charcoal">
                        {formatDate(booking.bookingDate)}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock3 size={14} className="mt-0.5 text-obc-green" />
                    <div>
                      <dt className="text-[11px] text-obc-muted">
                        Waktu & durasi
                      </dt>
                      <dd className="mt-0.5 font-medium text-obc-charcoal">
                        {booking.startTime} - {booking.endTime} ·{" "}
                        {booking.durationMinutes / 60} jam
                      </dd>
                    </div>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-[13px] text-obc-muted">
                  {invoice.bookingId
                    ? "Detail booking tidak tersedia."
                    : "Invoice ini tidak tertaut ke booking."}
                </p>
              )}
            </section>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_250px]">
            <section className="rounded-lg border border-obc-border p-4">
              <h3 className="font-heading text-sm font-semibold text-obc-charcoal">
                Rincian harga
              </h3>
              {breakdown.length ? (
                <div className="mt-3 divide-y divide-obc-border">
                  {baseAmount > 0 && (
                    <div className="flex justify-between gap-3 py-2 text-[13px]">
                      <span className="text-obc-muted">Harga lapangan</span>
                      <span className="font-medium text-obc-charcoal">
                        {rupiah(baseAmount)}
                      </span>
                    </div>
                  )}
                  {discount !== 0 && (
                    <div className="flex justify-between gap-3 py-2 text-[13px]">
                      <span className="text-obc-muted">Diskon</span>
                      <span className="font-medium text-obc-green">
                        {rupiah(discount)}
                      </span>
                    </div>
                  )}
                  {serviceFee > 0 && (
                    <div className="flex justify-between gap-3 py-2 text-[13px]">
                      <span className="text-obc-muted">Biaya layanan</span>
                      <span className="font-medium text-obc-charcoal">
                        {rupiah(serviceFee)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-[13px] text-obc-muted">
                  Rincian harga belum tersedia.
                </p>
              )}
              {invoice.description && (
                <p className="mt-3 border-t border-obc-border pt-3 text-[12px] leading-5 text-obc-muted">
                  {invoice.description}
                </p>
              )}
            </section>

            <aside className="h-fit rounded-lg bg-[#F3F8E8] p-4">
              <p className="text-[11px] font-medium text-obc-muted">
                Total invoice
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-obc-green">
                {rupiah(invoice.amount)}
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-[#DDE8D2] pt-3 text-[12px] text-obc-muted">
                <CreditCard size={14} className="text-obc-green" />
                {invoice.paymentMethod?.replaceAll("_", " ") ??
                  "Metode belum dipilih"}
              </div>
              <p className="mt-2 text-[11px] text-obc-muted">
                Tanggal terbit: {formatDate(invoice.issueDate)}
              </p>
              {invoice.terms.length > 0 && (
                <div className="mt-4 border-t border-[#DDE8D2] pt-3">
                  <h4 className="text-[11px] font-semibold text-obc-charcoal">
                    Termin pembayaran
                  </h4>
                  {invoice.terms.map((term) => (
                    <div
                      key={term.id}
                      className="mt-2 flex justify-between gap-2 text-[11px]"
                    >
                      <span className="text-obc-muted">
                        Termin {term.termNumber}
                      </span>
                      <span
                        className={
                          term.paidAt
                            ? "font-medium text-obc-green"
                            : "text-obc-muted"
                        }
                      >
                        {term.paidAt
                          ? `Lunas · ${formatDate(term.paidAt)}`
                          : rupiah(term.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
