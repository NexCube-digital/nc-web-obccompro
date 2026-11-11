import type { CSSProperties } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Timer,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/style.css";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { CourtResource } from "../../services/sport/courtService";
import type {
  AvailabilitySlot,
  InvoiceBookingDetails,
} from "../../services/admin/invoiceService";

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

const calendarMonths = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
    new Date(2024, month, 1),
  ),
);
const calendarYears = Array.from(
  { length: new Date().getFullYear() + 8 - 2019 },
  (_, index) => 2019 + index,
);

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

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

        <div className={isEditing ? "hidden" : ""}>
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
                    <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-obc-green" />Dipilih</span>
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
                              const unavailableStyle = slot.available
                                ? "cursor-not-allowed border-obc-border bg-[#F4F4F1] text-obc-muted"
                                : "cursor-not-allowed border-[#F3CACA] bg-[#FDF2F2] text-[#A53B3B]";
                              return (
                                <button
                                  key={slot.startTime}
                                  type="button"
                                  disabled={!available}
                                  aria-pressed={selected}
                                  title={available ? `Pilih ${slot.startTime}` : slot.available ? "Tidak cukup slot kosong untuk durasi ini" : "Jadwal sudah terisi"}
                                  onClick={() => onChooseStartTime(slot.startTime)}
                                  className={`h-10 rounded-lg border text-[12px] font-semibold transition-colors ${selected ? "border-obc-green bg-obc-green text-white shadow-sm" : available ? "border-obc-border bg-white text-obc-charcoal hover:border-obc-green hover:bg-[#F3F8E8]" : unavailableStyle}`}
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

      {view !== "selection" && !isEditing && (
        <aside className="h-fit overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)] lg:sticky lg:top-5">
          <div className="flex items-center gap-3 border-b border-obc-border px-4 py-4 sm:px-5">
            <span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><CalendarDays size={17} /></span>
            <div>
              <h3 className="font-heading text-[15px] font-semibold text-obc-charcoal">Tanggal booking</h3>
              <p className="mt-0.5 text-[11px] text-obc-muted">{issueDate ? formatBookingDate(issueDate) : "Pilih tanggal yang tersedia."}</p>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div id="invoice-booking-calendar" className="w-full rounded-lg border border-obc-border bg-[#FDFCF7] p-2.5 sm:p-3">
              <div className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_32px] items-center gap-1.5">
                <button type="button" aria-label="Bulan sebelumnya" onClick={() => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronLeft size={16} /></button>
                <ThemedSelect
                  label="Pilih bulan"
                  value={String(bookingCalendarMonth.getMonth())}
                  options={calendarMonths.map((month, index) => ({ value: String(index), label: month }))}
                  onValueChange={(value) => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), Number(value), 1))}
                  capitalize
                />
                <ThemedSelect
                  label="Pilih tahun"
                  value={String(bookingCalendarMonth.getFullYear())}
                  options={calendarYears.map((year) => ({ value: String(year), label: String(year) }))}
                  onValueChange={(value) => loadCalendarMonth(new Date(Number(value), bookingCalendarMonth.getMonth(), 1))}
                />
                <button type="button" aria-label="Bulan berikutnya" onClick={() => loadCalendarMonth(new Date(bookingCalendarMonth.getFullYear(), bookingCalendarMonth.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronRight size={16} /></button>
              </div>
              <DayPicker
                mode="single"
                selected={issueDate ? new Date(`${issueDate}T00:00:00`) : undefined}
                onSelect={(date) => onChooseBookingDate(date ? toDateKey(date) : "")}
                month={bookingCalendarMonth}
                onMonthChange={loadCalendarMonth}
                locale={id}
                weekStartsOn={1}
                hideNavigation
                showOutsideDays
                disabled={loadingCalendarDates ? true : [{ before: today }, ...unavailableDateValues]}
                modifiers={{ booked: bookedDateValues }}
                modifiersClassNames={{ booked: "relative after:absolute after:bottom-0 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-obc-red [&>button]:font-semibold", disabled: "cursor-not-allowed opacity-45" }}
                className="w-full"
                style={{ "--rdp-accent-color": "#1F3320", "--rdp-accent-background-color": "#E7F5D0", "--rdp-day-height": "36px", "--rdp-day-width": "34px", "--rdp-day_button-border-radius": "0.5rem", "--rdp-day_button-height": "31px", "--rdp-day_button-width": "31px" } as CSSProperties}
                classNames={{ root: "w-full", months: "w-full", month: "w-full", month_caption: "sr-only", caption_label: "sr-only", month_grid: "w-full border-collapse", weekdays: "grid grid-cols-7", weekday: "py-2 text-center text-[10px] font-semibold uppercase text-obc-muted", weeks: "grid gap-y-1", week: "grid grid-cols-7", day: "grid place-items-center p-0", day_button: "grid size-8 place-items-center rounded-lg text-[12px] text-inherit transition-colors hover:bg-obc-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green", selected: "rounded-lg !bg-obc-green !font-bold !text-white [&>button]:!bg-obc-green [&>button]:!text-white [&>button:hover]:!bg-obc-green-hover", today: "rounded-lg font-bold text-obc-green ring-1 ring-inset ring-obc-green/70", outside: "text-obc-muted/40" }}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-obc-border pt-2">
                <div className="flex items-center gap-3 text-[10px] text-obc-muted">
                  <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-obc-red" />Ada booking</span>
                  <span>{loadingCalendarDates ? "Memeriksa tanggal..." : "Tanggal penuh nonaktif"}</span>
                </div>
                <button type="button" disabled={loadingCalendarDates || unavailableDateValues.some((date) => toDateKey(date) === todayKey)} onClick={() => onChooseBookingDate(todayKey)} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-green transition-colors hover:bg-obc-ivory disabled:cursor-not-allowed disabled:opacity-40">Hari ini</button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
