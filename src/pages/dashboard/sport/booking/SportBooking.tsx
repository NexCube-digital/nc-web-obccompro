import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { courtService, type CourtResource } from "../court/courtService";
import { sportService, type ResourceAvailability, type SportBooking } from "../SportService";
import BookingCalendar from "./BookingCalendar";
import BookingList from "./BookingList";

const getTodayDateValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export default function SportBooking() {
  const [resources, setResources] = useState<CourtResource[]>([]);
  const [bookings, setBookings] = useState<SportBooking[]>([]);
  const [availability, setAvailability] = useState<Record<string, ResourceAvailability>>({});
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDateValue);

  useEffect(() => {
    let active = true;
    courtService.getResources()
      .then((items) => { if (active) setResources(items); })
      .catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Data lapang gagal dimuat."); })
      .finally(() => { if (active) setResourcesLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (resourcesLoading) return;
    if (!selectedDate || resources.length === 0) {
      setBookings([]);
      setAvailability({});
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    const loadBookings = async () => {
      const firstPage = await sportService.getBookings({ page: 1, limit: 100, date: selectedDate });
      const remainingPages = await Promise.all(Array.from({ length: Math.max(0, firstPage.meta.totalPages - 1) }, (_, index) =>
        sportService.getBookings({ page: index + 2, limit: 100, date: selectedDate }),
      ));
      return [...firstPage.data, ...remainingPages.flatMap((page) => page.data)];
    };
    Promise.all([
      loadBookings(),
      Promise.all(resources.map((resource) => sportService.getResourceAvailability(resource.id, selectedDate))),
    ])
      .then(([bookingItems, availabilityItems]) => {
        if (!active) return;
        setBookings(bookingItems);
        setAvailability(Object.fromEntries(availabilityItems.map((item) => [item.resourceId, item])));
      })
      .catch((error: unknown) => {
        if (active) toast.error(error instanceof Error ? error.message : "Jadwal booking gagal dimuat.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resources, resourcesLoading, selectedDate]);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setLoading(Boolean(value));
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13px] text-obc-muted">OBC Sport / Booking</p>
            <h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Booking olahraga</h1>
            <p className="mt-1 text-[13px] text-obc-muted">Pilih tanggal dan olahraga untuk melihat jadwal lapang.</p>
          </div>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <BookingCalendar selectedDate={selectedDate} onDateChange={handleDateChange} />
          <BookingList
				resources={resources}
				availability={availability}
            bookings={bookings}
            loading={loading}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
