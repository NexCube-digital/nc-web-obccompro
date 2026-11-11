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
} from "../../services/admin/invoiceService";
import { toast } from "sonner";
import InvoiceForm from "./Form";
import InvoiceTable from "./Table";
import InvoiceDetailModal from "./InvoiceDetailModal";
import InvoicePaymentModal from "./InvoicePaymentModal";

const statuses: InvoiceStatus[] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "expired",
  "partial",
  "cancelled",
];
const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

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
      toast.success("Invoice dipindahkan ke Sampah.");
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
        description="Invoice dipindahkan ke Sampah dan dapat dipulihkan admin selama 30 hari."
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
      <InvoicePaymentModal
        invoice={payingInvoice}
        paymentTerm={paymentTerm}
        paymentMethod={paymentMethod}
        paidAt={paidAt}
        notes={paymentNotes}
        saving={paying}
        onTermChange={setPaymentTerm}
        onMethodChange={setPaymentMethod}
        onPaidAtChange={setPaidAt}
        onNotesChange={setPaymentNotes}
        onClose={() => setPayingInvoice(null)}
        onSubmit={submitPayment}
      />
    </DashboardPageLayout>
  );
}
