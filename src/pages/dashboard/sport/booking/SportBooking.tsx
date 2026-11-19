import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { courtService, type CourtResource } from "../../services/sport/courtService";
import { sportService } from "../../services/sport/SportService";
import BookingCalendar from "./BookingCalendar";
import BookingList from "./BookingList";

const getTodayDateValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export default function SportBooking() {
  const [resources, setResources] = useState<CourtResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDateValue);

  useEffect(() => {
    let active = true;
    courtService.getResources()
      .then((items) => { if (active) setResources(items); })
      .catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Data lapang gagal dimuat."); })
      .finally(() => { if (active) setResourcesLoading(false); });
    return () => { active = false; };
  }, []);

  const resourceKey = resources.map((resource) => resource.id).sort().join(",");
  const dayQuery = useQuery({
    queryKey: ["sport-booking-day", selectedDate, resourceKey],
    queryFn: async () => {
      const [bookings, availabilityItems] = await Promise.all([
        sportService.getBookingCalendar(selectedDate),
        Promise.all(resources.map((resource) =>
          sportService.getResourceAvailability(resource.id, selectedDate, false),
        )),
      ]);
      return {
        bookings,
        availability: Object.fromEntries(availabilityItems.map((item) => [item.resourceId, item])),
      };
    },
    enabled: !resourcesLoading && Boolean(selectedDate) && resources.length > 0,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (dayQuery.error) {
      toast.error(dayQuery.error instanceof Error ? dayQuery.error.message : "Jadwal booking gagal dimuat.");
    }
  }, [dayQuery.error]);

  const bookings = dayQuery.data?.bookings ?? [];
  const availability = dayQuery.data?.availability ?? {};
  const loading = resourcesLoading || (Boolean(selectedDate) && resources.length > 0 && dayQuery.isPending);

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
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
            onBookingCreated={() => { void dayQuery.refetch(); }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
