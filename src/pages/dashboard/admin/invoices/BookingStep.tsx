import {
  CalendarDays,
  Check,
  Clock3,
  Timer,
} from "lucide-react";
import ThemedSelect from "../../components/common/ThemedSelect";
import BookingCalendar from "../../sport/booking/BookingCalendar";
import type { CourtResource } from "../../services/sport/courtService";
import type {
  AvailabilitySlot,
  InvoiceBookingDetails,
} from "../../services/admin/invoiceService";
import { toLocalDateKey as toDateKey } from "../../../../utils/formatters";

type TimePeriod = {
  label: string;
  slots: AvailabilitySlot[];
};

type InvoiceBookingStepProps = {
  view: "selection" | "calendar";
  isEditing: boolean;
  invoiceBooking: InvoiceBookingDetails | null;
  loadingInvoiceBooking: boolean;
  facilities: CourtResource[];
  facilitiesLoaded: boolean;
  resourceId: string;
  onChooseFacility: (id: string) => void;
  issueDate: string;
  formatBookingDate: (value: string) => string;
  bookingCalendarMonth: Date;
  onCalendarMonthChange: (month: Date) => void;
  loadingCalendarDates: boolean;
  today: Date;
  todayKey: string;
  onChooseBookingDate: (date: string) => void;
  bookedDateValues: Date[];
  unavailableDateValues: Date[];
  loadingAvailability: boolean;
  availabilitySlots: AvailabilitySlot[];
  availableStartSlots: AvailabilitySlot[];
  durationOptions: number[];
  durationSlots: number;
  slotMinutes: number;
  durationMinutes: number;
  onChooseDuration: (duration: number) => void;
  startTime: string;
  endTime: string;
  timePeriods: TimePeriod[];
  isRangeAvailable: (start: string, duration: number) => boolean;
  onChooseStartTime: (time: string) => void;
};

export default function InvoiceBookingStep({
  view,
  isEditing,
  invoiceBooking,
  loadingInvoiceBooking,
  facilities,
  facilitiesLoaded,
  resourceId,
  onChooseFacility,
  issueDate,
  formatBookingDate,
  bookingCalendarMonth,
  onCalendarMonthChange,
  loadingCalendarDates,
  today,
  todayKey,
  onChooseBookingDate,
  bookedDateValues,
  unavailableDateValues,
  loadingAvailability,
  availabilitySlots,
  availableStartSlots,
  durationOptions,
  durationSlots,
  slotMinutes,
  durationMinutes,
  onChooseDuration,
  startTime,
  endTime,
  timePeriods,
  isRangeAvailable,
  onChooseStartTime,
}: InvoiceBookingStepProps) {
  const calendarUnavailableDates = invoiceBooking
    ? unavailableDateValues.filter(
        (date) => toDateKey(date) !== invoiceBooking.bookingDate.slice(0, 10),
      )
    : unavailableDateValues;
  const loadCalendarMonth = (month: Date) => onCalendarMonthChange(month);

  return (
    <>
      {view !== "calendar" && (
        <section className="rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-5">
        <div className="flex items-start gap-3 border-b border-obc-border pb-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6EC] text-obc-green">
            <CalendarDays size={19} />
          </span>
          <div>
            <h3 className="font-heading text-[16px] font-semibold">Detail booking</h3>
            <p className="mt-1 text-[12px] text-obc-muted">
              Pilih lapangan dan rentang waktu yang tersedia.
            </p>
          </div>
        </div>
        {isEditing && (
          <div className="mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-4">
            {loadingInvoiceBooking ? (
              <p role="status" className="text-[13px] text-obc-muted">
                Memuat detail booking...
              </p>
            ) : invoiceBooking ? (
              <dl className="grid gap-3 text-[13px] sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] text-obc-muted">Lapangan</dt>
                  <dd className="mt-1 font-semibold text-obc-charcoal">
                    {invoiceBooking.resource.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-obc-muted">Tanggal</dt>
                  <dd className="mt-1 font-semibold text-obc-charcoal">
                    {formatBookingDate(invoiceBooking.bookingDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-obc-muted">Waktu</dt>
                  <dd className="mt-1 font-semibold text-obc-charcoal">
                    {invoiceBooking.startTime} - {invoiceBooking.endTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] text-obc-muted">Durasi</dt>
                  <dd className="mt-1 font-semibold text-obc-charcoal">
                    {invoiceBooking.durationMinutes / 60} jam
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-[13px] text-obc-muted">
                Booking terkait tidak tersedia. Detail jadwal tidak dapat diubah dari invoice.
              </p>
            )}
          </div>
        )}

        <div>
          {!isEditing && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-obc-charcoal">
                Pilih lapangan
              </span>
              <span className="text-[11px] text-obc-muted">
                {facilities.length} tersedia
              </span>
            </div>
            {facilities.length ? (
              <div
                role="group"
                aria-label="Pilihan lapangan"
                className="grid max-h-52 gap-2 overflow-y-auto pr-1 sm:grid-cols-3"
              >
                {facilities.map((facility) => {
                  const selected = resourceId === facility.id;
                  return (
                    <button
                      key={facility.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onChooseFacility(facility.id)}
                      className={`flex min-h-12 min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${selected ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-white hover:border-obc-green hover:bg-[#FDFCF7]"}`}
                    >
                      <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-obc-charcoal">
                        {facility.name}
                      </span>
                      {selected && <Check size={16} className="shrink-0 text-obc-green" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-obc-border px-4 py-6 text-center text-[12px] text-obc-muted">
                {facilitiesLoaded ? "Belum ada lapangan yang tersedia." : "Memuat pilihan lapangan..."}
              </p>
            )}
          </div>
          )}

          {resourceId && issueDate && (
            <div className="mt-5 border-t border-obc-border pt-4 lg:col-start-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="flex items-center gap-2 text-[13px] font-semibold text-obc-charcoal">
                    <Clock3 size={16} className="text-obc-green" />
                    Pilih waktu booking
                  </h4>
                  <p className="mt-1 text-[12px] text-obc-muted">
                    Jam yang tidak tersedia atau tidak cukup untuk durasi dipilih akan dinonaktifkan.
                  </p>
                </div>
                <label className="flex items-center gap-2 text-[12px] font-medium text-obc-charcoal">
                  <Timer size={15} className="text-obc-green" />
                  Durasi
                  <ThemedSelect
                    label="Durasi booking"
                    value={String(durationSlots)}
                    options={durationOptions.length
                      ? durationOptions.map((minutes) => ({
                          value: String(minutes / slotMinutes),
                          label: minutes >= 60 ? `${minutes / 60} jam` : `${minutes} menit`,
                        }))
                      : [{ value: String(durationSlots), label: loadingAvailability ? "Memuat..." : "Tidak tersedia" }]}
                    disabled={loadingAvailability || !durationOptions.length}
                    onValueChange={(value) => onChooseDuration(Number(value))}
                    className="h-9 min-w-27.5 text-[12px]"
                  />
                </label>
              </div>

              {loadingAvailability ? (
                <p role="status" className="mt-4 rounded-lg bg-[#FDFCF7] px-4 py-3 text-[12px] text-obc-muted">
                  Memeriksa ketersediaan jadwal...
                </p>
              ) : availabilitySlots.length > 0 ? (
                <>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-obc-muted">
                    <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#E7F5D0]" />Kosong</span>
                    <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#F1EFE8]" />Tidak tersedia</span>
                    <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-obc-green" />Jam mulai</span>
                    <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[#D9DDD5]" />Dalam durasi</span>
                    <span className="ml-auto font-semibold text-obc-green">{availableStartSlots.length} jam tersedia</span>
                  </div>
                  {availableStartSlots.length === 0 && (
                    <p className="mt-3 rounded-lg border border-[#F3CACA] bg-[#FDF2F2] px-3 py-2.5 text-[12px] text-[#A53B3B]">
                      Tidak ada slot kosong untuk durasi ini. Coba ubah durasi atau tanggal.
                    </p>
                  )}
                  <div className="mt-4 space-y-4">
                    {timePeriods.map((period) => {
                      const periodAvailableCount = period.slots.filter((slot) =>
                        isRangeAvailable(slot.startTime, durationMinutes),
                      ).length;
                      return (
                        <div key={period.label}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-obc-charcoal">{period.label}</span>
                            <span className={`text-[11px] ${periodAvailableCount ? "text-obc-green" : "text-obc-muted"}`}>
                              {periodAvailableCount} dari {period.slots.length} kosong
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                            {period.slots.map((slot) => {
                              const available = isRangeAvailable(slot.startTime, durationMinutes);
                              const selected = startTime === slot.startTime;
                              const slotMinute = Number(slot.startTime.slice(0, 2)) * 60 + Number(slot.startTime.slice(3, 5));
                              const selectedStartMinute = startTime
                                ? Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5))
                                : -1;
                              const withinSelectedDuration = Boolean(
                                selectedStartMinute >= 0 &&
                                slotMinute > selectedStartMinute &&
                                slotMinute < selectedStartMinute + durationMinutes,
                              );
                              const unavailableStyle = slot.available
                                ? "cursor-not-allowed border-obc-border bg-[#F4F4F1] text-obc-muted"
                                : "cursor-not-allowed border-[#F3CACA] bg-[#FDF2F2] text-[#A53B3B]";
                              const selectedDurationStyle = "border-[#C9CEC5] bg-[#D9DDD5] text-[#465043] hover:border-obc-green hover:bg-[#E5E8E2]";
                              return (
                                <button
                                  key={slot.startTime}
                                  type="button"
                                  disabled={!available}
                                  aria-pressed={selected}
                                  title={available ? withinSelectedDuration ? `${slot.startTime} berada dalam rentang terpilih. Klik untuk memulai booking dari jam ini.` : `Pilih ${slot.startTime}` : slot.available ? "Tidak cukup slot kosong untuk durasi ini" : "Jadwal sudah terisi"}
                                  onClick={() => onChooseStartTime(slot.startTime)}
                                  className={`h-10 rounded-lg border text-[12px] font-semibold transition-colors ${selected ? "border-obc-green bg-obc-green text-white shadow-sm" : available && withinSelectedDuration ? selectedDurationStyle : available ? "border-obc-border bg-white text-obc-charcoal hover:border-obc-green hover:bg-[#F3F8E8]" : unavailableStyle}`}
                                >
                                  <Clock3 size={13} className="mr-1 inline" />
                                  {slot.startTime}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="mt-4 rounded-lg bg-[#FDFCF7] px-4 py-3 text-[12px] text-obc-muted">
                  Tidak ada slot yang tersedia untuk lapangan dan tanggal ini.
                </p>
              )}
              <div className={`mt-4 flex items-center justify-between gap-4 rounded-lg border px-4 py-3 ${startTime ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-[#FDFCF7]"}`}>
                <div>
                  <p className="text-[11px] text-obc-muted">Waktu dipilih</p>
                  <p className="mt-1 font-heading text-[16px] font-semibold text-obc-charcoal">
                    {startTime && endTime ? `${startTime} – ${endTime}` : "Pilih jam kosong"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-obc-muted">Durasi</p>
                  <p className="mt-1 text-[13px] font-semibold text-obc-charcoal">{durationSlots} jam</p>
                </div>
              </div>
            </div>
          )}
        </div>
        </section>
      )}

      {view !== "selection" && (!isEditing || invoiceBooking) && (
        <BookingCalendar
          selectedDate={issueDate}
          onDateChange={onChooseBookingDate}
          visibleMonth={bookingCalendarMonth}
          onVisibleMonthChange={loadCalendarMonth}
          minDate={today}
          disabledDates={calendarUnavailableDates}
          bookedDates={bookedDateValues}
          loadingDates={loadingCalendarDates}
          todayDisabled={calendarUnavailableDates.some((date) => toDateKey(date) === todayKey)}
          showAvailabilityLegend
          showClearAction={false}
          emptyDateLabel="Pilih tanggal yang tersedia."
        />
      )}
    </>
  );
}
