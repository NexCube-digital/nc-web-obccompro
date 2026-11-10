import { CalendarDays, Clock3, Pencil, X } from "lucide-react";
import type { PricingRule } from "../../services/sport/SportService";

type Props = {
  rule: PricingRule;
  rateUnitLabel: "jam" | "2 jam";
  onClose: () => void;
  onEdit: () => void;
};

const dayLabels: Record<PricingRule["dayType"], string> = {
  weekday: "Hari kerja",
  weekend: "Akhir pekan",
  holiday: "Hari libur",
};

const money = (value: number | null) =>
  value == null
    ? "Tidak ditentukan"
    : new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(value);

const getPeriods = (rule: PricingRule) => {
  const start =
    Number(rule.tierStartTime.slice(0, 2)) * 60 +
    Number(rule.tierStartTime.slice(3, 5));
  const end =
    Number(rule.tierEndTime.slice(0, 2)) * 60 +
    Number(rule.tierEndTime.slice(3, 5));
  return [
    { label: "Pagi", from: 0, to: 12 * 60 },
    { label: "Siang", from: 12 * 60, to: 17 * 60 },
    { label: "Malam", from: 17 * 60, to: 24 * 60 },
  ]
    .filter((period) => start < period.to && end > period.from)
    .map((period) => period.label);
};

export default function PricingRuleDetailModal({
  rule,
  rateUnitLabel,
  onClose,
  onEdit,
}: Props) {
  const closeOnEscape = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") onClose();
  };
  const periods = getPeriods(rule);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={closeOnEscape}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-rule-detail-title"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-obc-green">
              Detail aturan tarif
            </p>
            <h2
              id="pricing-rule-detail-title"
              className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal"
            >
              {rule.resource?.name ?? "Semua lapang"}
            </h2>
            <p className="mt-1 text-[12px] text-obc-muted">
              {dayLabels[rule.dayType]} · {rule.tierStartTime}–
              {rule.tierEndTime}
            </p>
          </div>
          <button
            type="button"
            aria-label="Tutup detail"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"
          >
            <X size={17} />
          </button>
        </header>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#F3F8E8] p-4">
              <p className="text-[10px] font-medium text-obc-muted">
                Tarif per {rateUnitLabel}
              </p>
              <p className="mt-1 font-heading text-[20px] font-bold text-obc-green">
                {money(rule.pricePerHour)}
              </p>
            </div>
            <div className="rounded-lg border border-obc-border bg-[#FDFCF7] p-4">
              <p className="text-[10px] font-medium text-obc-muted">Status</p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${rule.status === "active" ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-[#F1EFE8] text-obc-muted"}`}
              >
                {rule.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
            </div>
          </div>
          <section>
            <h3 className="flex items-center gap-2 text-[12px] font-semibold text-obc-charcoal">
              <CalendarDays size={15} className="text-obc-green" />
              Penerapan waktu
            </h3>
            <dl className="mt-3 grid gap-3 rounded-lg border border-obc-border p-4 text-[12px] sm:grid-cols-2">
              <div>
                <dt className="text-[10px] text-obc-muted">Hari berlaku</dt>
                <dd className="mt-1 font-medium text-obc-charcoal">
                  {dayLabels[rule.dayType]}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] text-obc-muted">Jam berlaku</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-medium text-obc-charcoal">
                  <Clock3 size={13} className="text-obc-green" />
                  {rule.tierStartTime}–{rule.tierEndTime}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] text-obc-muted">Periode hari</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {periods.length ? (
                    periods.map((period) => (
                      <span
                        key={period}
                        className="rounded-md bg-[#F1EFE8] px-2 py-1 text-[10px] font-medium text-obc-charcoal"
                      >
                        {period}
                      </span>
                    ))
                  ) : (
                    <span className="text-obc-muted">-</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
          <div className="flex justify-end border-t border-obc-border pt-4">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover"
            >
              <Pencil size={14} />
              Edit aturan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
