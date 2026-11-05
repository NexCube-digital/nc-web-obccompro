import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { sportService, type BookingStatus, type SportBooking } from "../SportService";
import BookingCalendar from "./BookingCalendar";
import BookingList from "./BookingList";

const getTodayDateValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export default function SportBooking() {
  const [bookings, setBookings] = useState<SportBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDateValue);
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
    setPage(1);
    setLoading(Boolean(value));
    if (!value) {
      setBookings([]);
      setMeta({ page: 1, limit: 10, total: 0, totalPages: 0 });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setLoading(Boolean(selectedDate));
    setPage(1);
  };

  const handleStatusChange = (value: BookingStatus | "all") => {
    setStatus(value);
    setLoading(Boolean(selectedDate));
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
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
          <BookingCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
          <BookingList
            bookings={bookings}
            loading={loading}
            selectedDate={selectedDate}
            status={status}
            search={search}
            meta={meta}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
