import { CalendarDays } from "lucide-react";
import type {
  InvoiceBookingDetails,
  InvoicePaymentMethod,
  PriceBreakdownItem,
} from "../../services/admin/invoiceService";
import { formatIdr as rupiah } from "../../../../utils/formatters";
import { getPaymentMethodLabel } from "./payment/PaymentMethod";

type Props = {
  invoiceNumber: string;
  invoiceBooking: InvoiceBookingDetails | null;
  selectedFacilityName: string | null;
  issueDate: string;
  formatBookingDate: (value: string) => string;
  startTime: string;
  endTime: string;
  items: PriceBreakdownItem[];
  discountAmount: number;
  serviceFee: number;
  amount: number;
  paymentMethod: InvoicePaymentMethod | "";
  saving: boolean;
  invoiceExists: boolean;
  canSubmit: boolean;
  onClose: () => void;
};

export default function InvoiceSummary({
  invoiceNumber,
  invoiceBooking,
  selectedFacilityName,
  issueDate,
  formatBookingDate,
  startTime,
  endTime,
  items,
  discountAmount,
  serviceFee,
  amount,
  paymentMethod,
  saving,
  invoiceExists,
  canSubmit,
  onClose,
}: Props) {
  return (
    <aside className="h-fit overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)] lg:sticky lg:top-5">
      <div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5">
        <span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
          <CalendarDays size={17} />
        </span>
        <div>
          <h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">
            Ringkasan booking
          </h3>
          <p className="mt-0.5 text-[11px] text-obc-muted">
            Periksa detail sebelum menyimpan.
          </p>
        </div>
      </div>
      <div className="px-4 sm:px-5">
        <div className="space-y-3 border-b border-obc-border py-4 text-[13px]">
          <div>
            <span className="text-[11px] text-obc-muted">Nomor invoice</span>
            <p className="mt-1 font-medium text-obc-charcoal">{invoiceNumber}</p>
          </div>
          <div>
            <span className="text-[11px] text-obc-muted">Lapangan</span>
            <p className="mt-1 font-medium text-obc-charcoal">
              {invoiceBooking?.resource.name ?? selectedFacilityName ?? "Belum dipilih"}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-obc-muted">Tanggal</span>
            <p className="mt-1 font-medium text-obc-charcoal">
              {invoiceBooking
                ? formatBookingDate(invoiceBooking.bookingDate)
                : issueDate || "Belum dipilih"}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-obc-muted">Waktu</span>
            <p className="mt-1 font-medium text-obc-charcoal">
              {invoiceBooking
                ? `${invoiceBooking.startTime} - ${invoiceBooking.endTime}`
                : startTime && endTime
                  ? `${startTime} - ${endTime}`
                  : "Belum dipilih"}
            </p>
          </div>
        </div>
        {items.map((item) => (
          <div key={item.name} className="flex justify-between gap-3 py-3 text-[13px]">
            <span className="text-obc-muted">Harga lapangan</span>
            <span className="shrink-0 font-medium">{rupiah(item.subtotal)}</span>
          </div>
        ))}
        {discountAmount > 0 && (
          <div className="flex justify-between gap-3 py-2 text-[13px]">
            <span className="text-obc-muted">Diskon</span>
            <span className="shrink-0 font-medium text-obc-green">- {rupiah(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-3 py-2 text-[13px]">
          <span className="text-obc-muted">Biaya layanan</span>
          <span className="shrink-0 font-medium">{rupiah(serviceFee)}</span>
        </div>
        <div className="rounded-lg bg-[#F3F8E8] p-4">
          <span className="text-[11px] font-medium text-obc-muted">Total invoice</span>
          <p className="mt-1 font-heading text-[24px] font-bold text-obc-green">{rupiah(amount)}</p>
        </div>
        {!invoiceExists && (
          <div className="mt-3 rounded-lg border border-obc-border px-3 py-2.5">
            <p className="text-[11px] text-obc-muted">Metode pembayaran</p>
            <p className="mt-1 text-[13px] font-semibold text-obc-charcoal">
              {getPaymentMethodLabel(paymentMethod)}
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={saving || !canSubmit}
          className="mt-4 h-11 w-full rounded-lg bg-obc-green text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : invoiceExists ? "Simpan perubahan" : "Buat invoice"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mb-4 mt-2 h-10 w-full rounded-lg border border-obc-border text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory"
        >
          Batal
        </button>
      </div>
    </aside>
  );
}
