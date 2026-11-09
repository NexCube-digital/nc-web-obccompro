import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Plus,
  Receipt,
} from "lucide-react";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import DeleteModal from "../../components/ui/DeleteModal";
import {
  invoiceService,
  type Invoice,
  type InvoiceBookingDetails,
  type InvoiceStatus,
} from "./invoiceService";
import { toast } from "sonner";
import InvoiceForm from "./Form";
import InvoiceTable from "./Table";
import InvoiceDetailModal from "./InvoiceDetailModal";

const statuses: InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "expired",
  "partial",
  "cancelled",
];
const statusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Pending",
  paid: "Success",
  overdue: "Pending",
  expired: "Gagal",
  partial: "Pending",
  cancelled: "Gagal",
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
        month: "short",
        year: "numeric",
      })
    : "-";

function Summary({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof Receipt;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-obc-border bg-white p-4 transition-shadow hover:shadow-[0_3px_14px_rgba(52,49,51,0.06)]">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}
        >
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] text-obc-muted">{label}</p>
          <p className="mt-0.5 truncate font-heading text-[18px] font-bold text-obc-charcoal sm:text-[20px]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [detailBooking, setDetailBooking] =
    useState<InvoiceBookingDetails | null>(null);
  const [loadingDetailBooking, setLoadingDetailBooking] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentTerm, setPaymentTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paying, setPaying] = useState(false);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const closeDeleteModal = useCallback(() => setDeletingInvoice(null), []);

  useEffect(() => {
    let cancelled = false;
    invoiceService
      .getInvoiceList()
      .then((data) => {
        if (!cancelled) setInvoices(data);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setInvoices([]);
          toast.error(
            error instanceof Error ? error.message : "Gagal memuat invoice.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        statuses.map((status) => [
          status,
          invoices.filter((invoice) => invoice.status === status).length,
        ]),
      ) as Record<InvoiceStatus, number>,
    [invoices],
  );
  const totalAmount = invoices.reduce(
    (total, invoice) => total + invoice.amount,
    0,
  );
  const paidCount = counts.paid;
  const followUpCount = counts.sent + counts.overdue + counts.partial;

  const openCreateForm = () => {
    setEditingInvoice(null);
    setFormOpen(true);
  };

  const openEditForm = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormOpen(true);
  };

  const openInvoiceDetails = (invoice: Invoice) => {
    setDetailInvoice(invoice);
    setDetailBooking(null);
    if (!invoice.bookingId) return;

    setLoadingDetailBooking(true);
    invoiceService
      .getBookingDetails(invoice.bookingId)
      .then(setDetailBooking)
      .catch((error: unknown) =>
        toast.error(
          error instanceof Error
            ? error.message
            : "Detail booking invoice gagal dimuat.",
        ),
      )
      .finally(() => setLoadingDetailBooking(false));
  };

  const handleSaved = (saved: Invoice) => {
    setInvoices((current) =>
      editingInvoice
        ? current.map((invoice) => (invoice.id === saved.id ? saved : invoice))
        : [saved, ...current],
    );
  };

  const deleteInvoice = (invoice: Invoice) => setDeletingInvoice(invoice);

  const confirmDeleteInvoice = async () => {
    if (!deletingInvoice) return;
    setDeleteLoading(true);
    try {
      await invoiceService.deleteInvoice(deletingInvoice.id);
      setInvoices((current) =>
        current.filter((item) => item.id !== deletingInvoice.id),
      );
      setDeletingInvoice(null);
      toast.success("Invoice berhasil dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus invoice.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const openPayment = (invoice: Invoice) => {
    const unpaidTerm = invoice.terms.find((term) => !term.paidAt);
    setPayingInvoice(invoice);
    setPaymentTerm(unpaidTerm ? String(unpaidTerm.termNumber) : "");
    setPaymentMethod("");
    setPaidAt("");
    setPaymentNotes("");
  };

  const submitPayment = async () => {
    if (!payingInvoice || !paymentTerm) {
      toast.error("Pilih termin yang dibayarkan.");
      return;
    }
    setPaying(true);
    try {
      const updated = await invoiceService.payInvoiceTerm(payingInvoice.id, {
        termNumber: Number(paymentTerm),
        paymentMethod: paymentMethod || undefined,
        paidAt: paidAt || undefined,
        notes: paymentNotes || undefined,
      });
      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === updated.id ? updated : invoice,
        ),
      );
      setPayingInvoice(null);
      toast.success("Pembayaran termin berhasil dicatat.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mencatat pembayaran termin.",
      );
    } finally {
      setPaying(false);
    }
  };

  const changeStatus = async (invoice: Invoice, status: InvoiceStatus) => {
    try {
      const updated = await invoiceService.updateInvoiceStatus(
        invoice.id,
        status,
      );
      setInvoices((current) =>
        current.map((item) =>
          item.id === updated.id
            ? { ...item, status: updated.status, paidAt: updated.paidAt }
            : item,
        ),
      );
      toast.success("Status invoice berhasil diperbarui.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status invoice.",
      );
    }
  };

  if (formOpen) {
    return (
      <DashboardPageLayout
        breadcrumb="Invoice"
        title="Manajemen invoice"
        description="Pantau tagihan, termin pembayaran, dan status invoice perusahaan."
      >
        <InvoiceForm
          invoice={editingInvoice}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      </DashboardPageLayout>
    );
  }

  return (
    <DashboardPageLayout
      breadcrumb="Invoice"
      title="Manajemen invoice"
      description="Pantau tagihan, termin pembayaran, dan status invoice perusahaan."
    >
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-obc-green-hover"
        >
          <Plus size={16} /> Buat invoice
        </button>
      </div>
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Summary
          label="Total invoice"
          value={invoices.length.toLocaleString("id-ID")}
          icon={Receipt}
          tone="bg-[#E7F5D0] text-obc-green"
        />
        <Summary
          label="Nilai invoice"
          value={rupiah(totalAmount)}
          icon={CircleDollarSign}
          tone="bg-[#CDF178] text-[#404F14]"
        />
        <Summary
          label="Invoice lunas"
          value={paidCount.toLocaleString("id-ID")}
          icon={BadgeCheck}
          tone="bg-[#E7F5D0] text-[#1F3320]"
        />
        <Summary
          label="Perlu ditindaklanjuti"
          value={followUpCount.toLocaleString("id-ID")}
          icon={Clock3}
          tone="bg-[#FBF0D3] text-[#8A6100]"
        />
      </section>

      <InvoiceTable
        invoices={invoices}
        loading={loading}
        counts={counts}
        onView={openInvoiceDetails}
        onEdit={openEditForm}
        onRecordPayment={openPayment}
        onDelete={deleteInvoice}
        onChangeStatus={changeStatus}
      />
      <DeleteModal
        isOpen={Boolean(deletingInvoice)}
        title="Hapus invoice?"
        description="Invoice yang dihapus tidak dapat dikembalikan."
        itemName={deletingInvoice?.invoiceNumber}
        isLoading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteInvoice}
      />
      {detailInvoice && (
        <InvoiceDetailModal
          invoice={detailInvoice}
          booking={detailBooking}
          loadingBooking={loadingDetailBooking}
          onClose={() => setDetailInvoice(null)}
        />
      )}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-obc-border px-5 py-4">
              <h2 className="font-heading text-lg font-bold">
                {selectedInvoice.invoiceNumber}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="size-9 rounded-lg text-obc-muted"
                aria-label="Tutup"
              >
                ×
              </button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <p className="text-[12px] text-obc-muted">Klien</p>
                <p className="font-medium">{selectedInvoice.clientName}</p>
                <p className="text-[13px] text-obc-muted">
                  {selectedInvoice.clientEmail}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-obc-muted">Nominal</p>
                <p className="font-semibold">
                  {rupiah(selectedInvoice.amount)}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-obc-muted">Layanan</p>
                <p>{selectedInvoice.service || "-"}</p>
              </div>
              <div>
                <p className="text-[12px] text-obc-muted">Status</p>
                <p>{statusLabels[selectedInvoice.status]}</p>
              </div>
              <div>
                <p className="text-[12px] text-obc-muted">Tanggal terbit</p>
                <p>{formatDate(selectedInvoice.issueDate)}</p>
              </div>
            </div>
            {selectedInvoice.description && (
              <p className="border-t border-obc-border px-5 py-4 text-[13px] text-obc-muted">
                {selectedInvoice.description}
              </p>
            )}
            <div className="border-t border-obc-border px-5 py-4">
              <h3 className="mb-2 font-heading text-[14px] font-semibold">
                Termin pembayaran
              </h3>
              {selectedInvoice.terms.length ? (
                selectedInvoice.terms.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between border-b border-obc-border py-2 text-[13px] last:border-0"
                  >
                    <span>Termin {term.termNumber}</span>
                    <span>{rupiah(term.amount)}</span>
                    <span
                      className={
                        term.paidAt ? "text-[#1F3320]" : "text-obc-muted"
                      }
                    >
                      {term.paidAt
                        ? `Lunas ${formatDate(term.paidAt)}`
                        : "Belum dibayar"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-obc-muted">
                  Invoice ini belum memiliki termin.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="border-b border-obc-border px-5 py-4">
              <h2 className="font-heading text-lg font-bold">
                Catat pembayaran termin
              </h2>
              <p className="mt-1 text-[12px] text-obc-muted">
                {payingInvoice.invoiceNumber}
              </p>
            </div>
            <div className="space-y-4 p-5">
              <label className="block text-[13px] font-medium">
                Termin
                <select
                  value={paymentTerm}
                  onChange={(event) => setPaymentTerm(event.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]"
                >
                  {payingInvoice.terms.map((term) => (
                    <option key={term.id} value={term.termNumber}>
                      Termin {term.termNumber} - {rupiah(term.amount)}
                      {term.paidAt ? " (sudah lunas)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[13px] font-medium">
                Metode pembayaran
                <input
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                  placeholder="Transfer bank, QRIS, tunai..."
                  className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]"
                />
              </label>
              <label className="block text-[13px] font-medium">
                Tanggal dibayar
                <input
                  type="date"
                  value={paidAt}
                  onChange={(event) => setPaidAt(event.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px]"
                />
              </label>
              <label className="block text-[13px] font-medium">
                Catatan
                <textarea
                  rows={3}
                  value={paymentNotes}
                  onChange={(event) => setPaymentNotes(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-obc-border p-3 text-[13px]"
                />
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="rounded-xl border border-obc-border px-4 py-2 text-[13px]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={paying}
                  onClick={submitPayment}
                  className="rounded-xl bg-obc-green px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                >
                  {paying ? "Menyimpan..." : "Simpan pembayaran"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
}
