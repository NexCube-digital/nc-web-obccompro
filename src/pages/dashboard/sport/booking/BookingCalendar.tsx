import { useState, type CSSProperties } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import ThemedSelect from "../../components/common/ThemedSelect";
import { formatBookingDate as formatLongDate, toLocalDateKey as toDateValue } from "../../../../utils/formatters";
import "react-day-picker/style.css";

type Props = {
	selectedDate: string;
	onDateChange: (date: string) => void;
	visibleMonth?: Date;
	onVisibleMonthChange?: (month: Date) => void;
	minDate?: Date;
	disabledDates?: Date[];
	bookedDates?: Date[];
	loadingDates?: boolean;
	todayDisabled?: boolean;
	showAvailabilityLegend?: boolean;
	showClearAction?: boolean;
	compact?: boolean;
	sticky?: boolean;
	emptyDateLabel?: string;
};

const monthLabels = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(2024, month, 1)));
const monthOptions = monthLabels.map((label, month) => ({ value: String(month), label }));

export default function BookingCalendar({
	selectedDate,
	onDateChange,
	visibleMonth: controlledMonth,
	onVisibleMonthChange,
	minDate,
	disabledDates = [],
	bookedDates = [],
	loadingDates = false,
	todayDisabled = false,
	showAvailabilityLegend = false,
	showClearAction = true,
	compact = false,
	sticky = true,
	emptyDateLabel = "Pilih hari untuk mulai",
}: Props) {
	const [internalMonth, setInternalMonth] = useState(() => new Date());
	const visibleMonth = controlledMonth ?? internalMonth;
	const firstYear = minDate?.getFullYear() ?? 1990;
	const lastYear = Math.max(new Date().getFullYear() + 10, firstYear);
	const yearOptions = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
		const year = firstYear + index;
		return { value: String(year), label: String(year) };
	});
	const visibleMonthOptions = monthOptions.filter((_, month) =>
		!minDate || visibleMonth.getFullYear() !== minDate.getFullYear() || month >= minDate.getMonth(),
	);
	const canGoToPreviousMonth = !minDate ||
		new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1) >
		new Date(minDate.getFullYear(), minDate.getMonth(), 1);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const disabledMatchers = minDate ? [{ before: minDate }, ...disabledDates] : disabledDates;

	const changeVisibleMonth = (month: Date) => {
		setInternalMonth(month);
		onVisibleMonthChange?.(month);
	};

	const changeVisibleYear = (year: number) => {
		const month = minDate && year === minDate.getFullYear()
			? Math.max(visibleMonth.getMonth(), minDate.getMonth())
			: visibleMonth.getMonth();
		changeVisibleMonth(new Date(year, month, 1));
	};

	const selectDate = (date: Date | undefined) => {
		if (date) changeVisibleMonth(date);
		onDateChange(date ? toDateValue(date) : "");
	};

	const selectToday = () => {
		changeVisibleMonth(today);
		onDateChange(toDateValue(today));
	};

	return (
		<aside className={`h-fit self-start overflow-hidden rounded-xl border border-obc-border bg-white ${sticky && !compact ? "lg:sticky lg:top-4" : ""}`}>
			{compact ? <div className="flex items-center justify-between gap-3 border-b border-obc-border bg-[#FDFCF7] px-3 py-2.5">
				<div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-wide text-obc-muted">Tanggal dipilih</p><p className="mt-0.5 truncate text-[12px] font-semibold text-obc-charcoal">{selectedDate ? formatLongDate(selectedDate) : emptyDateLabel}</p></div>
				<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><CalendarDays size={15} /></span>
			</div> : <div className="bg-[#1F3320] p-5 text-white">
				<div className="flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-wide text-[#CDF178]">Kalender booking</p><CalendarDays size={18} className="text-[#CDF178]" /></div>
				<p className="mt-5 text-[12px] text-white/70">Tanggal terpilih</p>
				<p className="mt-1 min-h-14 font-heading text-[19px] font-semibold leading-6">{selectedDate ? formatLongDate(selectedDate) : emptyDateLabel}</p>
			</div>}
			<div className={compact ? "p-3" : "p-4"}>
				<div className="mb-2 grid grid-cols-[32px_minmax(0,1.3fr)_minmax(0,0.9fr)_32px] items-center gap-1.5">
					<button type="button" aria-label="Bulan sebelumnya" title="Bulan sebelumnya" disabled={!canGoToPreviousMonth} onClick={() => changeVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} /></button>
					<ThemedSelect
						label="Pilih bulan"
						value={String(visibleMonth.getMonth())}
						options={visibleMonthOptions}
						onValueChange={(value) => changeVisibleMonth(new Date(visibleMonth.getFullYear(), Number(value), 1))}
						capitalize
					/>
					<ThemedSelect
						label="Pilih tahun"
						value={String(visibleMonth.getFullYear())}
						options={yearOptions}
						onValueChange={(value) => changeVisibleYear(Number(value))}
					/>
					<button type="button" aria-label="Bulan berikutnya" title="Bulan berikutnya" onClick={() => changeVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronRight size={16} /></button>
				</div>
				<DayPicker
					mode="single"
					selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
					onSelect={selectDate}
					month={visibleMonth}
					onMonthChange={changeVisibleMonth}
					locale={id}
					weekStartsOn={1}
					hideNavigation
					showOutsideDays
					disabled={loadingDates ? true : disabledMatchers.length ? disabledMatchers : undefined}
					modifiers={{ booked: bookedDates }}
					modifiersClassNames={{ booked: "relative after:absolute after:bottom-0 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-obc-red [&>button]:font-semibold" }}
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
						day_button: `grid ${compact ? "size-8 text-[11px]" : "size-9 text-[12px]"} place-items-center rounded-lg text-inherit transition-colors hover:bg-obc-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green`,
						selected: "rounded-lg !bg-obc-green !font-bold !text-white [&>button]:!bg-obc-green [&>button]:!text-white [&>button:hover]:!bg-obc-green-hover",
						today: "rounded-lg font-bold text-obc-green ring-1 ring-inset ring-obc-green/70",
						outside: "text-obc-muted/40",
						disabled: "cursor-not-allowed opacity-35",
					}}
				/>
				{!compact && <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-obc-border pt-3">
					{showAvailabilityLegend && (
						<div className="flex items-center gap-3 text-[10px] text-obc-muted">
							<span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-obc-red" />Ada booking</span>
							<span>{loadingDates ? "Memeriksa tanggal..." : "Tanggal penuh nonaktif"}</span>
						</div>
					)}
					<button type="button" disabled={loadingDates || todayDisabled} aria-pressed={selectedDate === toDateValue(today)} onClick={selectToday} className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selectedDate === toDateValue(today) ? "bg-[#F3F8E8] text-obc-green" : "text-obc-green hover:bg-obc-ivory"}`}>Hari ini</button>
					{!showAvailabilityLegend && showClearAction && selectedDate && <button type="button" onClick={() => onDateChange("")} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal">Hapus pilihan</button>}
				</div>}
			</div>
		</aside>
	);
}