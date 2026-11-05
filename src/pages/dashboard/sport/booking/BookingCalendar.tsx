import { useState, type CSSProperties } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import ThemedSelect from "../../components/common/ThemedSelect";
import "react-day-picker/style.css";

type Props = {
	selectedDate: string;
	onDateChange: (date: string) => void;
};

const formatLongDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const toDateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const monthLabels = Array.from({ length: 12 }, (_, month) => new Intl.DateTimeFormat("id-ID", { month: "long" }).format(new Date(2024, month, 1)));
const calendarYears = Array.from({ length: new Date().getFullYear() + 11 - 1990 }, (_, index) => 1990 + index);
const monthOptions = monthLabels.map((label, month) => ({ value: String(month), label }));
const yearOptions = calendarYears.map((year) => ({ value: String(year), label: String(year) }));

export default function BookingCalendar({ selectedDate, onDateChange }: Props) {
	const [visibleMonth, setVisibleMonth] = useState(() => new Date());

	const selectDate = (date: Date | undefined) => {
		if (date) setVisibleMonth(date);
		onDateChange(date ? toDateValue(date) : "");
	};

	const selectToday = () => {
		const today = new Date();
		setVisibleMonth(today);
		onDateChange(toDateValue(today));
	};

	return (
		<aside className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="bg-[#1F3320] p-5 text-white">
				<div className="flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-wide text-[#CDF178]">Kalender booking</p><CalendarDays size={18} className="text-[#CDF178]" /></div>
				<p className="mt-5 text-[12px] text-white/70">Tanggal terpilih</p>
				<p className="mt-1 min-h-14 font-heading text-[19px] font-semibold leading-6">{selectedDate ? formatLongDate(selectedDate) : "Pilih hari untuk mulai"}</p>
			</div>
			<div className="p-4">
				<div className="mb-2 grid grid-cols-[32px_minmax(0,1.3fr)_minmax(0,0.9fr)_32px] items-center gap-1.5">
					<button type="button" aria-label="Bulan sebelumnya" title="Bulan sebelumnya" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronLeft size={16} /></button>
					<ThemedSelect
						label="Pilih bulan"
						value={String(visibleMonth.getMonth())}
						options={monthOptions}
						onValueChange={(value) => setVisibleMonth((month) => new Date(month.getFullYear(), Number(value), 1))}
						capitalize
					/>
					<ThemedSelect
						label="Pilih tahun"
						value={String(visibleMonth.getFullYear())}
						options={yearOptions}
						onValueChange={(value) => setVisibleMonth((month) => new Date(Number(value), month.getMonth(), 1))}
					/>
					<button type="button" aria-label="Bulan berikutnya" title="Bulan berikutnya" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"><ChevronRight size={16} /></button>
				</div>
				<DayPicker
					mode="single"
					selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
					onSelect={selectDate}
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
					<button type="button" aria-pressed={selectedDate === toDateValue(new Date())} onClick={selectToday} className={`rounded-lg px-3 py-2 text-[12px] font-medium transition-colors ${selectedDate === toDateValue(new Date()) ? "bg-[#F3F8E8] text-obc-green" : "text-obc-green hover:bg-obc-ivory"}`}>Hari ini</button>
					{selectedDate && <button type="button" onClick={() => onDateChange("")} className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal">Hapus pilihan</button>}
				</div>
			</div>
		</aside>
	);
}