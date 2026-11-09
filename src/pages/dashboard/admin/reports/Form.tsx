import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Minus,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/style.css";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import ThemedSelect from "../../components/common/ThemedSelect";
import {
  reportService,
  REPORT_TYPE_LABELS,
  type FinanceReportPeriod,
  type ReportRecord,
  type ReportPeriod,
  type ReportType,
} from "./reportService";

type Props = {
  onGenerated: (report: ReportRecord) => void;
};

const REPORT_TYPES: {
  type: ReportType;
  icon: typeof Receipt;
  description: string;
}[] = [
  {
    type: "invoices",
    icon: Receipt,
    description: "Invoice, nilai tagihan, dan status pembayaran",
  },
  {
    type: "finance",
    icon: Wallet,
    description: "Pemasukan tercatat berdasarkan periode",
  },
];

const reportMonths = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
    new Date(2024, month, 1),
  ),
);
const reportMonthOptions = reportMonths.map((label, month) => ({
  value: String(month),
  label,
}));

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function YearStepper({
  value,
  onChange,
  className = "",
}: {
  value: number;
  onChange: (year: number) => void;
  className?: string;
}) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const commitYear = () => {
    const parsedYear = Number(draft);
    if (!draft || !Number.isInteger(parsedYear)) {
      setDraft(String(value));
      return;
    }
    const nextYear = Math.min(9999, Math.max(2000, parsedYear));
    setDraft(String(nextYear));
    onChange(nextYear);
  };

  return (
    <div
      className={`flex h-9 min-w-0 items-center overflow-hidden rounded-lg border border-obc-border bg-[#FDFCF7] shadow-sm ${className}`}
    >
      <button
        type="button"
        aria-label="Kurangi tahun"
        disabled={value <= 2000}
        onClick={() => onChange(value - 1)}
        className="grid size-8 shrink-0 place-items-center text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-green disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={13} />
      </button>
      <input
        type="number"
        min={2000}
        max={9999}
        value={draft}
        aria-label="Tahun laporan"
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commitYear}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitYear();
          }
        }}
        className="h-full min-w-0 flex-1 border-0 bg-transparent px-1 text-center text-[12px] font-medium text-obc-charcoal outline-none focus:ring-0"
      />
      <button
        type="button"
        aria-label="Tambah tahun"
        disabled={value >= 9999}
        onClick={() => onChange(value + 1)}
        className="grid size-8 shrink-0 place-items-center text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-green disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function ReportPeriodPicker({
  period,
  value,
  onChange,
}: {
  period: FinanceReportPeriod;
  value: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const selectedDate =
    period === "day"
      ? new Date(`${value}T00:00:00`)
      : period === "month"
        ? new Date(`${value}-01T00:00:00`)
        : new Date(Number(value), 0, 1);
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = selectedDate.getMonth();
  const displayValue =
    period === "day"
      ? selectedDate.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : period === "month"
        ? selectedDate.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })
        : value;

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (
        containerRef.current?.contains(event.target) ||
        event.target.closest("[data-radix-popper-content-wrapper]")
      )
        return;
      setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const updateYear = (year: number) => {
    if (period === "day")
      setVisibleMonth((month) => new Date(year, month.getMonth(), 1));
    else if (period === "month")
      onChange(`${year}-${String(selectedMonth + 1).padStart(2, "0")}`);
    else onChange(String(year));
  };

  const updateMonth = (month: number) => {
    if (period === "day")
      setVisibleMonth((current) => new Date(current.getFullYear(), month, 1));
    else onChange(`${selectedYear}-${String(month + 1).padStart(2, "0")}`);
  };

  const openPicker = () => {
    if (!isOpen && period === "day")
      setVisibleMonth(new Date(selectedYear, selectedMonth, 1));
    setIsOpen((open) => !open);
  };

  return (
    <div ref={containerRef} className="relative mt-1">
      <button
        type="button"
        aria-label={`Pilih ${period === "day" ? "tanggal" : period === "month" ? "bulan" : "tahun"}`}
        aria-expanded={isOpen}
        onClick={openPicker}
        className={`flex h-[54px] w-full items-center gap-3 rounded-lg border bg-white px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178] ${isOpen ? "border-obc-green" : "border-obc-border hover:border-obc-green"}`}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
          <CalendarDays size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
            {period === "day"
              ? "Tanggal laporan"
              : period === "month"
                ? "Bulan laporan"
                : "Tahun laporan"}
          </span>
          <span className="mt-0.5 block truncate text-[13px] font-semibold text-obc-charcoal">
            {displayValue}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-obc-green transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-[60] mt-2 w-full min-w-[280px] rounded-xl border border-obc-border bg-white p-3 shadow-[0_12px_35px_rgba(31,49,32,0.16)] sm:p-4">
          {period === "day" ? (
            <>
              <div className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_minmax(0,0.85fr)_32px] items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Bulan sebelumnya"
                  onClick={() =>
                    setVisibleMonth(
                      (month) =>
                        new Date(month.getFullYear(), month.getMonth() - 1, 1),
                    )
                  }
                  className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"
                >
                  <ChevronLeft size={16} />
                </button>
                <ThemedSelect
                  label="Pilih bulan"
                  value={String(visibleMonth.getMonth())}
                  options={reportMonthOptions}
                  onValueChange={(month) =>
                    setVisibleMonth(
                      (current) =>
                        new Date(current.getFullYear(), Number(month), 1),
                    )
                  }
                  capitalize
                />
                <YearStepper
                  value={visibleMonth.getFullYear()}
                  onChange={(year) =>
                    setVisibleMonth(
                      (current) => new Date(year, current.getMonth(), 1),
                    )
                  }
                />
                <button
                  type="button"
                  aria-label="Bulan berikutnya"
                  onClick={() =>
                    setVisibleMonth(
                      (month) =>
                        new Date(month.getFullYear(), month.getMonth() + 1, 1),
                    )
                  }
                  className="grid size-8 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:border-obc-green hover:bg-obc-ivory hover:text-obc-green"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onChange(toDateKey(date));
                    setIsOpen(false);
                  }
                }}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                locale={id}
                weekStartsOn={1}
                hideNavigation
                showOutsideDays
                className="w-full"
                style={
                  {
                    "--rdp-accent-color": "#1F3320",
                    "--rdp-accent-background-color": "#E7F5D0",
                    "--rdp-day-height": "36px",
                    "--rdp-day-width": "34px",
                    "--rdp-day_button-border-radius": "0.5rem",
                    "--rdp-day_button-height": "31px",
                    "--rdp-day_button-width": "31px",
                  } as CSSProperties
                }
                classNames={{
                  root: "w-full",
                  months: "w-full",
                  month: "w-full",
                  month_caption: "sr-only",
                  caption_label: "sr-only",
                  month_grid: "w-full border-collapse",
                  weekdays: "grid grid-cols-7",
                  weekday:
                    "py-2 text-center text-[10px] font-semibold uppercase text-obc-muted",
                  weeks: "grid gap-y-1",
                  week: "grid grid-cols-7",
                  day: "grid place-items-center p-0",
                  day_button:
                    "grid size-9 place-items-center rounded-lg text-[12px] text-inherit transition-colors hover:bg-obc-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obc-green",
                  selected:
                    "rounded-lg !bg-obc-green !font-bold !text-white [&>button]:!bg-obc-green [&>button]:!text-white [&>button:hover]:!bg-obc-green-hover",
                  today:
                    "rounded-lg font-bold text-obc-green ring-1 ring-inset ring-obc-green/70",
                  outside: "text-obc-muted/40",
                }}
              />
              <div className="mt-2 flex items-center justify-between border-t border-obc-border pt-2">
                <p className="text-[10px] text-obc-muted">
                  Pilih tanggal laporan
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(toDateKey(new Date()));
                    setVisibleMonth(new Date());
                    setIsOpen(false);
                  }}
                  className="rounded-lg px-3 py-2 text-[12px] font-medium text-obc-green transition-colors hover:bg-obc-ivory"
                >
                  Hari ini
                </button>
              </div>
            </>
          ) : period === "month" ? (
            <div>
              <p className="mb-3 text-[12px] font-semibold text-obc-charcoal">
                Pilih bulan laporan
              </p>
              <div className="grid grid-cols-2 gap-3">
                <ThemedSelect
                  label="Pilih bulan"
                  value={String(selectedMonth)}
                  options={reportMonthOptions}
                  onValueChange={(month) => updateMonth(Number(month))}
                  capitalize
                />
                <YearStepper
                  value={selectedYear}
                  onChange={updateYear}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-[12px] font-semibold text-obc-charcoal">
                Pilih tahun laporan
              </p>
              <YearStepper
                value={selectedYear}
                onChange={updateYear}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function localDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return {
    day: `${year}-${month}-${day}`,
    month: `${year}-${month}`,
    year: String(year),
  };
}

export default function ReportForm({ onGenerated }: Props) {
  const [type, setType] = useState<ReportType>("invoices");
  const [period, setPeriod] = useState<ReportPeriod>("day");
  const [periodValue, setPeriodValue] = useState(() => localDateValue().day);
  const [rangeStart, setRangeStart] = useState(() => localDateValue().day);
  const [rangeEnd, setRangeEnd] = useState(() => localDateValue().day);
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (period === "range" && rangeStart > rangeEnd) {
      toast.error(
        "Tanggal akhir harus sama dengan atau setelah tanggal mulai.",
      );
      return;
    }
    setGenerating(true);
    try {
      const report = await reportService.generateReport(
        type,
        period === "range"
          ? { period, startDate: rangeStart, endDate: rangeEnd }
          : { period, value: periodValue },
      );
      onGenerated(report);
      toast.success(`${REPORT_TYPE_LABELS[type]} berhasil dibuat.`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]"
    >
      <div className="flex items-center gap-3 rounded-t-xl border-b border-obc-border px-4 py-4 sm:px-5">
        <span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
          <FileText size={18} />
        </span>
        <div>
          <h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">
            Buat laporan
          </h2>
          <p className="text-[12px] text-obc-muted">
            Pilih format laporan yang ingin dibuat.
          </p>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div
          role="radiogroup"
          aria-label="Jenis laporan"
          className="grid gap-3 sm:grid-cols-2"
        >
          {REPORT_TYPES.map(({ type: reportType, icon: Icon, description }) => {
            const selected = type === reportType;
            return (
              <button
                key={reportType}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setType(reportType)}
                className={`group flex min-h-24 w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors ${selected ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-white hover:border-obc-green hover:bg-[#FDFCF7]"}`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-lg ${selected ? "bg-obc-green text-white" : "bg-obc-ivory text-obc-muted group-hover:text-obc-green"}`}
                >
                  <Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-obc-charcoal">
                    {REPORT_TYPE_LABELS[reportType]}
                  </span>
                  <span className="mt-1 block text-[12px] leading-4 text-obc-muted">
                    {description}
                  </span>
                </span>
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-obc-green bg-obc-green text-white" : "border-obc-border text-transparent"}`}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-4">
          <div className="mb-3">
            <p className="text-[13px] font-semibold text-obc-charcoal">
              Periode {type === "finance" ? "pemasukan" : "invoice"}
            </p>
            <p className="mt-0.5 text-[11px] text-obc-muted">
              Tentukan rentang waktu laporan.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`block text-[12px] font-medium text-obc-charcoal ${period === "range" ? "sm:col-span-2" : ""}`}
            >
              Periode
              <ThemedSelect
                label="Periode laporan"
                value={period}
                options={[
                  { value: "day", label: "Per hari" },
                  { value: "month", label: "Per bulan" },
                  { value: "year", label: "Per tahun" },
                  { value: "range", label: "Rentang tanggal" },
                ]}
                onValueChange={(value) => {
                  const nextPeriod = value as ReportPeriod;
                  setPeriod(nextPeriod);
                  if (nextPeriod === "range") {
                    const today = localDateValue().day;
                    setRangeStart(today);
                    setRangeEnd(today);
                  } else {
                    setPeriodValue(localDateValue()[nextPeriod]);
                  }
                }}
                className="mt-1 h-10 w-full text-[13px]"
              />
            </label>
            {period === "range" ? (
              <>
                <div className="block text-[12px] font-medium text-obc-charcoal">
                  <span>Tanggal mulai</span>
                  <ReportPeriodPicker
                    period="day"
                    value={rangeStart}
                    onChange={setRangeStart}
                  />
                </div>
                <div className="block text-[12px] font-medium text-obc-charcoal">
                  <span>Tanggal akhir</span>
                  <ReportPeriodPicker
                    period="day"
                    value={rangeEnd}
                    onChange={setRangeEnd}
                  />
                </div>
              </>
            ) : (
              <div className="block text-[12px] font-medium text-obc-charcoal">
                <span>
                  {period === "day"
                    ? "Tanggal"
                    : period === "month"
                      ? "Bulan"
                      : "Tahun"}
                </span>
                <ReportPeriodPicker
                  key={period}
                  period={period}
                  value={periodValue}
                  onChange={setPeriodValue}
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={generating}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:opacity-60"
          >
            <FileText size={15} />
            {generating
              ? "Membuat laporan..."
              : `Generate ${REPORT_TYPE_LABELS[type].toLowerCase()}`}
          </button>
        </div>
      </div>
    </form>
  );
}
