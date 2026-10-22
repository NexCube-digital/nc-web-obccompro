import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { sportService, type BookingStatus, type SportBooking } from "./SportService";

const bookingStatuses: BookingStatus[] = ["unpaid", "dp_paid", "fully_paid", "completed", "cancelled", "expired", "refund_requested", "refunded"];
const statusLabels: Record<BookingStatus, string> = {
  unpaid: "Belum dibayar",
  dp_paid: "DP dibayar",
  fully_paid: "Lunas",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
  refund_requested: "Refund diajukan",
  refunded: "Direfund",
};
const statusClasses: Record<BookingStatus, string> = {
  unpaid: "bg-[#FBF0D3] text-[#8A6100]",
  dp_paid: "bg-[#EBEEDC] text-[#404F14]",
  fully_paid: "bg-[#E7F5D0] text-[#1F3320]",
  completed: "bg-[#CDF178] text-[#1F3320]",
  cancelled: "bg-[#FDF2F2] text-[#B42318]",
  expired: "bg-[#F1EFE8] text-obc-muted",
  refund_requested: "bg-[#FDF2F2] text-[#B42318]",
  refunded: "bg-[#F1EFE8] text-obc-muted",
};
const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const formatMoney = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function SportBooking() {
  const [bookings, setBookings] = useState<SportBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    sportService.getBookings({ page, limit: 10, ...(status === "all" ? {} : { status }), ...(search.trim() ? { search: search.trim() } : {}) })
      .then((result) => {
        if (!cancelled) {
          setBookings(result.data);
          setMeta(result.meta);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat booking.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, search, status]);

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <div className="mb-5">
          <p className="text-[13px] text-obc-muted">OBC Sport / Booking</p>
          <h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Booking olahraga</h1>
          <p className="mt-1 text-[13px] text-obc-muted">Data booking aktual dari backend, termasuk jadwal, resource, dan status pembayaran.</p>
        </div>

        <section className="mb-4 rounded-xl border border-obc-border bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-obc-muted">{meta.total.toLocaleString("id-ID")} booking ditemukan</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); setPage(1); }} placeholder="Cari nama, email, catatan..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive sm:w-72" /></label>
              <select value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as BookingStatus | "all"); setPage(1); }} aria-label="Filter status booking" className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]">
                <option value="all">Semua status</option>{bookingStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-[13px]">
              <thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3">Pelanggan</th><th className="px-4 py-3">Resource & olahraga</th><th className="px-4 py-3">Tanggal / jam</th><th className="px-4 py-3">Pembayaran</th><th className="px-4 py-3">Status</th></tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Memuat booking...</td></tr> : bookings.length ? bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-obc-border align-top">
                    <td className="px-4 py-3"><p className="font-semibold text-obc-charcoal">{booking.customer?.name ?? "Walk-in / tanpa akun"}</p><p className="text-[11px] text-obc-muted">{booking.customer?.email ?? booking.staffCreator?.email ?? "-"}</p></td>
                    <td className="px-4 py-3"><p className="font-medium">{booking.resource.name}</p><p className="text-[11px] capitalize text-obc-muted">{booking.sportType.replaceAll("_", " ")} · {booking.bookingType}</p></td>
                    <td className="whitespace-nowrap px-4 py-3"><p>{formatDate(booking.bookingDate)}</p><p className="text-[11px] text-obc-muted">{booking.startTime}–{booking.endTime}</p></td>
                    <td className="whitespace-nowrap px-4 py-3"><p className="font-semibold">{booking.totalPriceFormatted || formatMoney(booking.totalPrice)}</p><p className="text-[11px] capitalize text-obc-muted">{booking.latestPayment?.status ?? booking.status}</p></td>
                    <td className="px-4 py-3"><span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[booking.status]}`}>{statusLabels[booking.status]}</span></td>
                  </tr>
                )) : <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Tidak ada booking pada filter ini.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted"><span>Halaman {meta.page} dari {Math.max(meta.totalPages, 1)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= meta.totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>
        </section>
      </div>
    </DashboardLayout>
  );
}
