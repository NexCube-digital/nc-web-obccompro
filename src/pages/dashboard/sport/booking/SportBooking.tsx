import { useEffect, useState, type CSSProperties } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/style.css";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { sportService, type BookingStatus, type SportBooking } from "../SportService";

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
const formatLongDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const toDateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const monthLabels = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(2024, month, 1)));
const calendarYears = Array.from({ length: new Date().getFullYear() + 11 - 1990 }, (_, index) => 1990 + index);
const formatMoney = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function SportBooking() {
  const [bookings, setBookings] = useState<SportBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    sportService.getBookings({ page, limit: 10, date: selectedDate, ...(status === "all" ? {} : { status }), ...(search.trim() ? { search: search.trim() } : {}) })
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
  }, [page, search, selectedDate, status]);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    if (value) setVisibleMonth(new Date(`${value}T00:00:00`));
    setPage(1);
    setLoading(Boolean(value));
    if (!value) {
      setBookings([]);
      setMeta({ page: 1, limit: 10, total: 0, totalPages: 0 });
    }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] text-obc-muted">OBC Sport / Booking</p>
            <h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Booking olahraga</h1>
            <p className="mt-1 text-[13px] text-obc-muted">Atur tanggal, lalu tinjau jadwal dan pembayaran.</p>
          </div>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-xl border border-obc-border bg-white">
            <div className="bg-[#1F3320] p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#CDF178]">Kalender booking</p>
                <CalendarDays size={18} className="text-[#CDF178]" />
              </div>
              <p className="mt-5 text-[12px] text-white/70">Tanggal terpilih</p>
              <p className="mt-1 min-h-14 font-heading text-[19px] font-semibold leading-6">{selectedDate ? formatLongDate(selectedDate) : "Pilih hari untuk mulai"}</p>
            </div>
            <div className="p-4">
              <div className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-1.5">
                <button type="button" aria-label="Bulan sebelumnya" title="Bulan sebelumnya" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronLeft size={16} /></button>
                <select aria-label="Pilih bulan" value={visibleMonth.getMonth()} onChange={(event) => setVisibleMonth((month) => new Date(month.getFullYear(), Number(event.target.value), 1))} className="h-9 min-w-0 rounded-lg border border-obc-border bg-[#FDFCF7] px-2 text-[12px] font-medium capitalize text-obc-charcoal outline-none focus:border-obc-green">
                  {monthLabels.map((label, month) => <option key={label} value={month}>{label}</option>)}
                </select>
                <select aria-label="Pilih tahun" value={visibleMonth.getFullYear()} onChange={(event) => setVisibleMonth((month) => new Date(Number(event.target.value), month.getMonth(), 1))} className="h-9 min-w-0 rounded-lg border border-obc-border bg-[#FDFCF7] px-2 text-[12px] font-medium text-obc-charcoal outline-none focus:border-obc-green">
                  {calendarYears.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
                <button type="button" aria-label="Bulan berikutnya" title="Bulan berikutnya" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronRight size={16} /></button>
              </div>
              <DayPicker
                mode="single"
                selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
                onSelect={(date) => handleDateChange(date ? toDateValue(date) : "")}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                locale={id}
                weekStartsOn={1}
                hideNavigation
                showOutsideDays
                className="w-full"
                style={{
                  "--rdp-accent-color": "#1F3320",
                  "--rdp-accent-background-color": "#E7F5D0",
                  "--rdp-day-height": "36px",
                  "--rdp-day-width": "34px",
                  "--rdp-day_button-border-radius": "0.5rem",
                  "--rdp-day_button-height": "31px",
                  "--rdp-day_button-width": "31px",
                } as CSSProperties}
                classNames={{
                  root: "w-full",
                  months: "w-full",
                  month: "w-full",
                  month_caption: "sr-only",
                  caption_label: "sr-only",
                  month_grid: "w-full border-collapse",
                  weekdays: "grid grid-cols-7",
                  weekday: "py-2 text-center text-[10px] font-semibold uppercase text-obc-muted",
                  weeks: "grid gap-y-1",
                  week: "grid grid-cols-7",
                  day: "grid place-items-center p-0",
                  day_button: "grid size-9 place-items-center rounded-lg text-[12px] text-inherit transition-colors hover:bg-obc-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green",
                  selected: "rounded-lg !bg-obc-green !font-bold !text-white [&>button]:!bg-obc-green [&>button]:!text-white [&>button:hover]:!bg-obc-green-hover",
                  today: "rounded-lg font-bold text-obc-green ring-1 ring-inset ring-obc-green/70",
                  outside: "text-obc-muted/40",
                  disabled: "cursor-not-allowed opacity-35",
                }}
              />
              <div className="mt-3 flex items-center justify-between border-t border-obc-border pt-3">
                <button type="button" aria-pressed={selectedDate === toDateValue(new Date())} onClick={() => handleDateChange(toDateValue(new Date()))} className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${selectedDate === toDateValue(new Date()) ? "bg-[#F3F8E8] text-obc-green" : "text-obc-green hover:bg-obc-ivory"}`}>Hari ini</button>
                {selectedDate && <button type="button" onClick={() => handleDateChange("")} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal">Hapus pilihan</button>}
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
            <div className="border-b border-obc-border p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar booking</h2><p className="mt-0.5 text-[12px] text-obc-muted">{selectedDate ? formatDate(selectedDate) : "Pilih tanggal untuk menampilkan jadwal"}</p></div>
                {selectedDate && <p className="text-[12px] text-obc-muted">{meta.total.toLocaleString("id-ID")} booking</p>}
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_190px]">
                <label className="block text-[12px] font-medium text-obc-charcoal">Cari booking
                  <span className="relative mt-1 block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => { setSearch(event.target.value); setLoading(Boolean(selectedDate)); setPage(1); }} disabled={!selectedDate} placeholder={selectedDate ? "Nama, email, catatan..." : "Pilih tanggal terlebih dahulu"} className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-obc-green focus:ring-2 focus:ring-[#CDF178] disabled:cursor-not-allowed disabled:opacity-60" /></span>
                </label>
                <label className="block text-[12px] font-medium text-obc-charcoal">Status
                  <select value={status} disabled={!selectedDate} onChange={(event) => { setStatus(event.target.value as BookingStatus | "all"); setLoading(true); setPage(1); }} aria-label="Filter status booking" className="mt-1 h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none transition-colors focus:border-obc-green disabled:cursor-not-allowed disabled:opacity-60">
                    <option value="all">Semua status</option>{bookingStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}
                  </select>
                </label>
              </div>
            </div>

            {!selectedDate ? (
              <div className="grid min-h-56 place-items-center px-5 py-10 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto grid size-11 place-items-center rounded-xl bg-obc-ivory text-obc-green"><CalendarDays size={20} /></span>
                  <p className="mt-3 text-[13px] font-medium text-obc-charcoal">Jadwal belum dipilih</p>
                  <p className="mt-1 text-[12px] leading-5 text-obc-muted">Pilih tanggal di panel sebelah kiri untuk melihat daftar booking.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-225 text-left text-[13px]">
                    <thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3">Pelanggan</th><th className="px-4 py-3">Lapangan</th><th className="px-4 py-3">Jam</th><th className="px-4 py-3 text-right">Pembayaran</th><th className="px-4 py-3">Status</th></tr></thead>
                    <tbody>
                      {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Memuat booking...</td></tr> : bookings.length ? bookings.map((booking) => (
                        <tr key={booking.id} className="border-t border-obc-border align-top transition-colors hover:bg-[#FDFCF7]">
                          <td className="px-4 py-3"><p className="font-semibold text-obc-charcoal">{booking.customer?.name ?? "Walk-in / tanpa akun"}</p><p className="text-[11px] text-obc-muted">{booking.customer?.email ?? booking.staffCreator?.email ?? "-"}</p></td>
                          <td className="px-4 py-3"><p className="font-medium text-obc-charcoal">{booking.resource.name}</p><p className="text-[11px] capitalize text-obc-muted">{booking.sportType.replaceAll("_", " ")} · {booking.bookingType}</p></td>
                          <td className="whitespace-nowrap px-4 py-3"><p className="font-semibold text-obc-charcoal">{booking.startTime}–{booking.endTime}</p><p className="text-[11px] text-obc-muted">{booking.durationMinutes} menit</p></td>
                          <td className="whitespace-nowrap px-4 py-3 text-right"><p className="font-semibold text-obc-charcoal">{booking.totalPriceFormatted || formatMoney(booking.totalPrice)}</p><p className="text-[11px] capitalize text-obc-muted">{booking.latestPayment?.status ?? booking.status}</p></td>
                          <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[booking.status]}`}>{statusLabels[booking.status]}</span></td>
                        </tr>
                      )) : <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Tidak ada booking pada tanggal dan filter ini.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-3 border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <span>Menampilkan {bookings.length} dari {meta.total.toLocaleString("id-ID")} booking</span>
                  <div className="flex items-center justify-end gap-2"><span>Halaman {meta.page} dari {Math.max(meta.totalPages, 1)}</span><button type="button" disabled={page <= 1 || loading} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= meta.totalPages || loading} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
