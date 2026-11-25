import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CourtResource } from "../../services/sport/courtService";
import {
  invoiceService,
  type AvailabilitySlot,
  type FacilityCalendarDate,
  type InvoiceBookingDetails,
  type PriceBreakdownItem,
} from "../../services/admin/invoiceService";
import { toLocalDateKey as toDateKey } from "../../../../utils/formatters";
import type { BookingInvoiceDraft } from "../../admin/invoices/Form";

const EMPTY_CALENDAR_DATES: FacilityCalendarDate[] = [];
const EMPTY_AVAILABILITY_SLOTS: AvailabilitySlot[] = [];

const timeToMinutes = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};

const minutesToTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

type Options = {
  initialBooking?: BookingInvoiceDraft | null;
  initialIssueDate: string;
  facilities: CourtResource[];
  setAmount: (value: number) => void;
  setServiceFee: (value: number) => void;
  setDiscountAmount: (value: number) => void;
  setItems: Dispatch<SetStateAction<PriceBreakdownItem[]>>;
};

export default function useInvoiceBookingSchedule({
  initialBooking,
  initialIssueDate,
  facilities,
  setAmount,
  setServiceFee,
  setDiscountAmount,
  setItems,
}: Options) {
  const initialDurationSlots = initialBooking
    ? Math.max(
        initialBooking.sportType === "sepakbola" ? 2 : 1,
        Math.ceil(
          (timeToMinutes(initialBooking.endTime) -
            timeToMinutes(initialBooking.startTime)) /
            60,
        ),
      )
    : 1;
  const [issueDate, setIssueDate] = useState(initialIssueDate);
  const [bookingCalendarMonth, setBookingCalendarMonth] = useState(() =>
    initialIssueDate ? new Date(`${initialIssueDate}T00:00:00`) : new Date(),
  );
  const [resourceId, setResourceId] = useState(initialBooking?.resourceId ?? "");
  const [startTime, setStartTime] = useState(initialBooking?.startTime ?? "");
  const [sportTypeOverride, setSportTypeOverride] = useState(initialBooking?.sportType ?? "");
  const [editingBookingSchedule, setEditingBookingSchedule] = useState<{
    bookingDate: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [endTime, setEndTime] = useState(() =>
    initialBooking
      ? minutesToTime(
          timeToMinutes(initialBooking.startTime) + 60 * initialDurationSlots,
        )
      : "",
  );
  const [durationSlots, setDurationSlots] = useState(initialDurationSlots);
  const selectedFacility = useMemo(
    () => facilities.find((facility) => facility.id === resourceId) ?? null,
    [facilities, resourceId],
  );
  const selectedSportType =
    sportTypeOverride &&
    selectedFacility?.sportTypes.includes(sportTypeOverride)
      ? sportTypeOverride
      : selectedFacility?.sportTypes.includes("sepakbola")
        ? "sepakbola"
        : (selectedFacility?.sportTypes[0] ?? "");
  const minimumDurationSlots = selectedFacility?.sportTypes.includes(
    "sepakbola",
  )
    ? 2
    : 1;
  const calendarRange = useMemo(
    () => ({
      from: toDateKey(
        new Date(
          bookingCalendarMonth.getFullYear(),
          bookingCalendarMonth.getMonth(),
          1,
        ),
      ),
      to: toDateKey(
        new Date(
          bookingCalendarMonth.getFullYear(),
          bookingCalendarMonth.getMonth() + 1,
          0,
        ),
      ),
    }),
    [bookingCalendarMonth],
  );
  const calendarQuery = useQuery({
    queryKey: [
      "invoice-facility-calendar",
      resourceId,
      calendarRange.from,
      calendarRange.to,
    ],
    queryFn: ({ signal }) =>
      invoiceService.getFacilityCalendar(
        resourceId,
        calendarRange.from,
        calendarRange.to,
        signal,
      ),
    enabled: Boolean(resourceId),
    staleTime: 30_000,
  });
  const availabilityQuery = useQuery({
    queryKey: [
      "invoice-facility-availability",
      resourceId,
      issueDate,
      selectedSportType,
    ],
    queryFn: ({ signal }) =>
      invoiceService.getFacilityAvailability(
        resourceId,
        issueDate,
        selectedSportType,
        false,
        signal,
      ),
    enabled: Boolean(resourceId && issueDate && selectedSportType),
    staleTime: 10_000,
  });
  const calendarDates = calendarQuery.data?.dates ?? EMPTY_CALENDAR_DATES;
  const loadingCalendarDates = Boolean(resourceId) && calendarQuery.isPending;
  const availabilitySlots =
    availabilityQuery.data?.slots ?? EMPTY_AVAILABILITY_SLOTS;
  const loadingAvailability =
    Boolean(resourceId && issueDate && selectedSportType) &&
    availabilityQuery.isPending;

  useEffect(() => {
    if (calendarQuery.error) {
      toast.error(
        calendarQuery.error instanceof Error
          ? calendarQuery.error.message
          : "Penanda jadwal gagal dimuat.",
      );
    }
  }, [calendarQuery.error]);

  useEffect(() => {
    if (availabilityQuery.error) {
      toast.error(
        availabilityQuery.error instanceof Error
          ? availabilityQuery.error.message
          : "Ketersediaan jadwal gagal dimuat.",
      );
    }
  }, [availabilityQuery.error]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);
  const currentTimeMinutes =
    new Date().getHours() * 60 + new Date().getMinutes();
  const bookedDateValues = useMemo(
    () =>
      calendarDates
        .filter((day) => day.hasBookings)
        .map((day) => new Date(`${day.date}T00:00:00`)),
    [calendarDates],
  );
  const unavailableDateValues = useMemo(
    () =>
      calendarDates
        .filter((day) => ["full", "closed", "maintenance"].includes(day.status))
        .map((day) => new Date(`${day.date}T00:00:00`)),
    [calendarDates],
  );
  const slotMinutes = 60;
  const durationMinutes = slotMinutes * durationSlots;
  const availabilityIntervalMinutes = availabilitySlots[0]
    ? timeToMinutes(availabilitySlots[0].endTime) -
      timeToMinutes(availabilitySlots[0].startTime)
    : 60;
  const scheduleOptions = useMemo(() => {
    const hourlySlots = availabilitySlots.filter(
      (slot) => timeToMinutes(slot.startTime) % 60 === 0,
    );
    const slotsByStart = new Map(
      availabilitySlots.map((slot) => [slot.startTime, slot]),
    );
    const isRangeAvailable = (start: string, duration: number) => {
      const isUnchangedBookingRange =
        editingBookingSchedule?.bookingDate === issueDate &&
        editingBookingSchedule.startTime === start &&
        timeToMinutes(editingBookingSchedule.endTime) ===
          timeToMinutes(start) + duration;
      if (isUnchangedBookingRange) return true;
      if (timeToMinutes(start) % 60 !== 0 || duration % 60 !== 0) return false;
      if (
        issueDate < todayKey ||
        (issueDate === todayKey && timeToMinutes(start) <= currentTimeMinutes)
      ) {
        return false;
      }
      const endMinute = timeToMinutes(start) + duration;
      for (
        let minute = timeToMinutes(start);
        minute < endMinute;
        minute += availabilityIntervalMinutes
      ) {
        const slot = slotsByStart.get(minutesToTime(minute));
        if (
          !slot?.available ||
          timeToMinutes(slot.endTime) < minute + availabilityIntervalMinutes
        ) {
          return false;
        }
      }
      return true;
    };
    const durationOptions = Array.from(
      { length: 5 - minimumDurationSlots },
      (_, index) => 60 * (minimumDurationSlots + index),
    ).filter((duration) =>
      hourlySlots.some(
        (slot) => slot.available && isRangeAvailable(slot.startTime, duration),
      ),
    );
    const availableStartSlots = hourlySlots.filter((slot) =>
      isRangeAvailable(slot.startTime, durationMinutes),
    );
    const timePeriods = [
      { label: "Pagi - Siang", from: 5 * 60, to: 17 * 60 },
      { label: "Malam", from: 17 * 60, to: 5 * 60 },
    ]
      .map((period) => ({
        ...period,
        slots: hourlySlots
          .filter((slot) => {
            const time = timeToMinutes(slot.startTime);
            return period.label === "Malam"
              ? time >= period.from || time < period.to
              : time >= period.from && time < period.to;
          })
          .sort((first, second) => {
            const sortTime = (time: string) => {
              const minutes = timeToMinutes(time);
              return period.label === "Malam" && minutes < period.to
                ? minutes + 24 * 60
                : minutes;
            };
            return sortTime(first.startTime) - sortTime(second.startTime);
          }),
      }))
      .filter((period) => period.slots.length > 0);

    return { isRangeAvailable, durationOptions, availableStartSlots, timePeriods };
  }, [
    availabilityIntervalMinutes,
    availabilitySlots,
    currentTimeMinutes,
    durationMinutes,
    editingBookingSchedule,
    issueDate,
    minimumDurationSlots,
    todayKey,
  ]);

  const clearSelectedTime = () => {
    setStartTime("");
    setEndTime("");
    setAmount(0);
    setServiceFee(0);
    setDiscountAmount(0);
    setItems([]);
  };

  const chooseFacility = (id: string) => {
    setResourceId(id);
    setSportTypeOverride("");
    setEditingBookingSchedule(null);
    setDurationSlots(
      facilities
        .find((facility) => facility.id === id)
        ?.sportTypes.includes("sepakbola")
        ? 2
        : 1,
    );
    clearSelectedTime();
  };

  const chooseBookingDate = (date: string) => {
    if (loadingCalendarDates) return;
    const dateAvailability = calendarDates.find((day) => day.date === date);
    if (
      dateAvailability &&
      ["full", "closed", "maintenance"].includes(dateAvailability.status) &&
      date !== editingBookingSchedule?.bookingDate
    ) {
      toast.error(
        dateAvailability.status === "full"
          ? "Tanggal ini sudah penuh."
          : "Lapangan tutup pada tanggal ini.",
      );
      return;
    }
    setIssueDate(date);
    if (date) setBookingCalendarMonth(new Date(`${date}T00:00:00`));
    setDurationSlots(minimumDurationSlots);
    clearSelectedTime();
  };

  const chooseDuration = (count: number) => {
    const nextDuration = slotMinutes * count;
    setDurationSlots(count);
    if (!startTime || !scheduleOptions.isRangeAvailable(startTime, nextDuration)) {
      clearSelectedTime();
      return;
    }
    setEndTime(minutesToTime(timeToMinutes(startTime) + nextDuration));
  };

  const chooseStartTime = (time: string) => {
    if (!scheduleOptions.isRangeAvailable(time, durationMinutes)) return;
    setStartTime(time);
    setEndTime(minutesToTime(timeToMinutes(time) + durationMinutes));
  };

  const loadExistingBooking = useCallback((booking: InvoiceBookingDetails) => {
    const bookingDate = booking.bookingDate.slice(0, 10);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDateValue = new Date(`${bookingDate}T00:00:00`);
    setResourceId(booking.resource.id);
    setIssueDate(bookingDate);
    setBookingCalendarMonth(bookingDateValue < today ? today : bookingDateValue);
    setStartTime(booking.startTime);
    setEndTime(booking.endTime);
    setDurationSlots(Math.max(1, Math.ceil(booking.durationMinutes / 60)));
    setSportTypeOverride(booking.sportType);
    setEditingBookingSchedule({ bookingDate, startTime: booking.startTime, endTime: booking.endTime });
  }, []);

  return {
    issueDate,
    bookingCalendarMonth,
    setBookingCalendarMonth,
    resourceId,
    startTime,
    endTime,
    durationSlots,
    selectedFacility,
    selectedSportType,
    calendarDates,
    loadingCalendarDates,
    loadingAvailability,
    availabilitySlots,
    bookedDateValues,
    unavailableDateValues,
    today,
    todayKey,
    slotMinutes,
    durationMinutes,
    isRangeAvailable: scheduleOptions.isRangeAvailable,
    durationOptions: scheduleOptions.durationOptions,
    availableStartSlots: scheduleOptions.availableStartSlots,
    timePeriods: scheduleOptions.timePeriods,
    chooseFacility,
    chooseBookingDate,
    chooseDuration,
    chooseStartTime,
    loadExistingBooking,
    clearSelectedTime,
  };
}
