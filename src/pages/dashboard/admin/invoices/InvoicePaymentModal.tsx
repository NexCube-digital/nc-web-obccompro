import type { Invoice } from "../../services/admin/invoiceService";

type Props = {
  invoice: Invoice | null;
  paymentTerm: string;
  paymentMethod: string;
  paidAt: string;
  notes: string;
  saving: boolean;
  onTermChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onPaidAtChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function InvoicePaymentModal({
  invoice,
  paymentTerm,
  paymentMethod,
  paidAt,
  notes,
  saving,
  onTermChange,
  onMethodChange,
  onPaidAtChange,
  onNotesChange,
  onClose,
  onSubmit,
}: Props) {
  if (!invoice) return null;

  const money = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="border-b border-obc-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold">
            Catat pembayaran termin
          </h2>
          <p className="mt-1 text-[12px] text-obc-muted">{invoice.invoiceNumber}</p>
        </div>
        <div className="space-y-4 p-5">
          <label className="block text-[13px] font-medium">
            Termin
            <select
              value={paymentTerm}
              onChange={(event) => onTermChange(event.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]"
            >
              {invoice.terms.map((term) => (
                <option key={term.id} value={term.termNumber}>
                  Termin {term.termNumber} - {money(term.amount)}
                  {term.paidAt ? " (sudah lunas)" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[13px] font-medium">
            Metode pembayaran
            <input
              value={paymentMethod}
              onChange={(event) => onMethodChange(event.target.value)}
              placeholder="Transfer bank, QRIS, tunai..."
              className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]"
            />
          </label>
          <label className="block text-[13px] font-medium">
            Tanggal dibayar
            <input
              type="date"
              value={paidAt}
              onChange={(event) => onPaidAtChange(event.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]"
            />
          </label>
          <label className="block text-[13px] font-medium">
            Catatan
            <textarea
              rows={3}
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-obc-border p-3 text-[13px]"
            />
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-obc-border px-4 py-2 text-[13px]"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onSubmit}
              className="rounded-xl bg-obc-green px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan pembayaran"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
