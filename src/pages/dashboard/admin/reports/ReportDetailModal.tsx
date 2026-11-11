import { useState } from "react";
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import {
  REPORT_TYPE_LABELS,
  type ReportPeriod,
  type ReportRecord,
  type ReportType,
} from "../../services/admin/reportService";
import {
  downloadFinanceReportExcel,
  downloadFinanceReportPdf,
  downloadInvoiceReportExcel,
  downloadInvoiceReportPdf,
  getFinanceReportSnapshot,
  getInvoiceReportSnapshot,
} from "../../services/admin/reportDownloads";

type Props = {
  report: ReportRecord | null;
  onClose: () => void;
};

const PAGE_SIZE = 10;
const periodLabels: Record<ReportPeriod, string> = {
  day: "Harian",
  month: "Bulanan",
  year: "Tahunan",
  range: "Rentang tanggal",
};
const typeIcons: Record<ReportType, typeof Receipt> = {
  invoices: Receipt,
  finance: Wallet,
};
const rupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ReportDetailModal({ report, onClose }: Props) {
  const [detailPage, setDetailPage] = useState(1);
  if (!report) return null;

  const ReportIcon = typeIcons[report.type as ReportType] ?? FileText;
  const financeSnapshot =
    report.type === "finance"
      ? getFinanceReportSnapshot(report.data, report.parameters)
      : null;
  const invoiceSnapshot =
    report.type === "invoices"
      ? getInvoiceReportSnapshot(report.data, report.parameters)
      : null;
  const invoiceTotalPages = Math.max(
    1,
    Math.ceil((invoiceSnapshot?.rows.length ?? 0) / PAGE_SIZE),
  );
  const currentInvoicePage = Math.min(detailPage, invoiceTotalPages);
  const visibleInvoices =
    invoiceSnapshot?.rows.slice(
      (currentInvoicePage - 1) * PAGE_SIZE,
      currentInvoicePage * PAGE_SIZE,
    ) ?? [];
  const financePeriodDescription =
    financeSnapshot?.period === "range"
      ? `${financeSnapshot.range.from} - ${financeSnapshot.range.to}`
      : financeSnapshot
        ? `${periodLabels[financeSnapshot.period]} ${financeSnapshot.periodValue}`
        : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-obc-border p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]">
              <ReportIcon size={18} />
            </span>
            <div className="min-w-0">
              <h2
                id="report-dialog-title"
                className="truncate font-heading text-[16px] font-semibold text-obc-charcoal"
              >
                {report.title}
              </h2>
              <p className="mt-0.5 text-[12px] text-obc-muted">
                {REPORT_TYPE_LABELS[report.type as ReportType] ?? report.type} · {new Date(report.createdAt).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {financeSnapshot && (
              <>
                <button
                  type="button"
                  onClick={() => downloadFinanceReportPdf(report, financeSnapshot)}
                  title="Unduh PDF"
                  aria-label="Unduh laporan PDF"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-obc-border px-3 text-[12px] font-medium text-obc-charcoal hover:bg-[#FDFCF7]"
                >
                  <FileDown size={15} />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadFinanceReportExcel(report, financeSnapshot)}
                  title="Unduh Excel"
                  aria-label="Unduh laporan Excel"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-obc-border px-3 text-[12px] font-medium text-obc-charcoal hover:bg-[#FDFCF7]"
                >
                  <FileSpreadsheet size={15} />
                  <span>Excel</span>
                </button>
              </>
            )}
            {invoiceSnapshot && (
              <>
                <button
                  type="button"
                  onClick={() => downloadInvoiceReportPdf(report, invoiceSnapshot)}
                  title="Unduh PDF"
                  aria-label="Unduh laporan invoice PDF"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-obc-border px-3 text-[12px] font-medium text-obc-charcoal hover:bg-[#FDFCF7]"
                >
                  <FileDown size={15} />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadInvoiceReportExcel(report, invoiceSnapshot)}
                  title="Unduh Excel"
                  aria-label="Unduh laporan invoice Excel"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-obc-border px-3 text-[12px] font-medium text-obc-charcoal hover:bg-[#FDFCF7]"
                >
                  <FileSpreadsheet size={15} />
                  <span>Excel</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup pratinjau"
              className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"
            >
              <X size={17} />
            </button>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
          {financeSnapshot ? (
            <div>
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {[
                  ["Periode", financePeriodDescription],
                  ["Total pemasukan", rupiah(financeSnapshot.summary.totalIncome)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-obc-border bg-white p-3">
                    <p className="text-[11px] text-obc-muted">{label}</p>
                    <p className="mt-1 truncate text-[13px] font-semibold text-obc-charcoal">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mb-3 text-[12px] text-obc-muted">
                {financeSnapshot.range.from} sampai {financeSnapshot.range.to} · {financeSnapshot.summary.count} transaksi
              </p>
              <div className="overflow-x-auto rounded-lg border border-obc-border">
                <table className="w-full min-w-160 text-left text-[12px]">
                  <thead className="bg-[#FDFCF7] text-[11px] font-semibold uppercase text-obc-muted">
                    <tr>
                      <th className="px-3 py-2.5">Tanggal</th>
                      <th className="px-3 py-2.5">Kategori</th>
                      <th className="px-3 py-2.5">Divisi</th>
                      <th className="px-3 py-2.5 text-right">Nominal</th>
                      <th className="px-3 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeSnapshot.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t border-obc-border">
                        <td className="whitespace-nowrap px-3 py-2.5">
                          {new Date(transaction.date).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-3 py-2.5">{transaction.category || transaction.description || "-"}</td>
                        <td className="px-3 py-2.5 capitalize">{transaction.division}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium">{rupiah(transaction.amount)}</td>
                        <td className="px-3 py-2.5 capitalize">{transaction.status}</td>
                      </tr>
                    ))}
                    {!financeSnapshot.transactions.length && (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-obc-muted">
                          Tidak ada pemasukan pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : invoiceSnapshot ? (
            <div>
              <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Rentang tanggal", invoiceSnapshot.range ? `${invoiceSnapshot.range.from} - ${invoiceSnapshot.range.to}` : "Semua periode"],
                  ["Jumlah invoice", invoiceSnapshot.rows.length.toLocaleString("id-ID")],
                  ["Total nominal", rupiah(invoiceSnapshot.rows.reduce((total, item) => total + item.amount, 0))],
                  ["Total lunas", rupiah(invoiceSnapshot.rows.filter((item) => item.status.toLowerCase() === "paid").reduce((total, item) => total + item.amount, 0))],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-obc-border bg-white p-3">
                    <p className="text-[11px] text-obc-muted">{label}</p>
                    <p className="mt-1 truncate text-[13px] font-semibold text-obc-charcoal">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mb-3 text-[12px] text-obc-muted">
                {invoiceSnapshot.range ? `${invoiceSnapshot.range.from} sampai ${invoiceSnapshot.range.to} · ` : ""}
                {invoiceSnapshot.rows.length.toLocaleString("id-ID")} data invoice
              </p>
              <div className="overflow-x-auto rounded-lg border border-obc-border">
                <table className="w-full min-w-200 text-left text-[12px]">
                  <thead className="bg-[#FDFCF7] text-[11px] font-semibold uppercase text-obc-muted">
                    <tr>
                      <th className="px-3 py-2.5">Nomor invoice</th>
                      <th className="px-3 py-2.5">Klien</th>
                      <th className="px-3 py-2.5">Layanan</th>
                      <th className="px-3 py-2.5">Tanggal</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleInvoices.map((invoice) => (
                      <tr key={invoice.invoiceNumber} className="border-t border-obc-border">
                        <td className="whitespace-nowrap px-3 py-2.5 font-medium">{invoice.invoiceNumber}</td>
                        <td className="px-3 py-2.5">{invoice.clientName}</td>
                        <td className="px-3 py-2.5">{invoice.service}</td>
                        <td className="whitespace-nowrap px-3 py-2.5">{invoice.issueDate || "-"}</td>
                        <td className="px-3 py-2.5 capitalize">{invoice.status}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium">{rupiah(invoice.amount)}</td>
                      </tr>
                    ))}
                    {!invoiceSnapshot.rows.length && (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-obc-muted">
                          Tidak ada invoice pada laporan ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {invoiceSnapshot.rows.length > PAGE_SIZE && (
                <Pagination
                  page={currentInvoicePage}
                  totalPages={invoiceTotalPages}
                  onPageChange={setDetailPage}
                  totalItems={invoiceSnapshot.rows.length}
                  pageSize={PAGE_SIZE}
                  itemLabel="invoice"
                  className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                />
              )}
            </div>
          ) : (
            <pre className="overflow-x-auto rounded-lg bg-[#F7F7F2] p-4 text-[11px] leading-relaxed text-obc-charcoal">
              {JSON.stringify(report.data, null, 2) ?? "Tidak ada data pada laporan ini."}
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}
