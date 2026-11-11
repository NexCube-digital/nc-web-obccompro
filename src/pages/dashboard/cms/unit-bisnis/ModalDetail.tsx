import { useEffect, type ReactNode } from "react";
import {
  Building2,
  Pencil,
  Power,
  PowerOff,
  X,
} from "lucide-react";
import { getMediaUrl } from "../../v2/media/mediaService";
import { WhatsAppLogo } from "../../../../components/ui/WhatsAppIcon";
import type { BusinessUnitDetail } from "../../services/cms/unitbisnisService";

type Props = {
  unit: BusinessUnitDetail;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
};

const tenantTypeLabels = {
  sport: "Sport",
  event: "Event",
  fnb: "Food & Beverage",
  other: "Lainnya",
};
function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
        {label}
      </dt>
      <dd className="mt-1 wrap-break-word text-[12px] font-medium leading-5 text-obc-charcoal">
        {children}
      </dd>
    </div>
  );
}

export default function BusinessUnitDetails({
  unit,
  onClose,
  onEdit,
  onToggleStatus,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const config =
    typeof unit.config === "object" && unit.config !== null
      ? (unit.config as Record<string, unknown>)
      : {};
  const imageUrl = typeof config.imageUrl === "string" ? config.imageUrl : "";

  return (
    <div
      className="fixed inset-0 z-70 grid place-items-center bg-[#172119]/65 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-unit-detail-title"
        className="flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(24,28,24,0.3)]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-obc-border bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
              <Building2 size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-obc-olive">
                Unit bisnis
              </p>
              <h2
                id="business-unit-detail-title"
                className="mt-0.5 truncate font-heading text-lg font-bold text-obc-charcoal"
              >
                {unit.name}
              </h2>
              <p className="mt-0.5 truncate font-mono text-[10px] text-obc-muted">
                /{unit.slug}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"
          >
            <X size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#FAFBF8] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative aspect-16/10 min-h-40 overflow-hidden rounded-lg bg-[#172119]">
              {imageUrl ? (
                <img
                  src={getMediaUrl(imageUrl)}
                  alt={unit.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white/60">
                  <div className="text-center">
                    <Building2 size={30} className="mx-auto" />
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest">
                      Gambar belum tersedia
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-[#101812]/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-3.5">
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-white/70">
                    {tenantTypeLabels[unit.tenantType]}
                  </p>
                  <p className="mt-0.5 truncate font-heading text-[15px] font-bold text-white">
                    {typeof config.title === "string" && config.title
                      ? config.title
                      : unit.name}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold ${unit.status === "active" ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-white/90 text-obc-muted"}`}
                >
                  {unit.status === "active" ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border border-obc-border bg-white p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-obc-muted">
                  Informasi dasar
                </p>
                <p className="mt-2 text-[12px] leading-5 text-obc-charcoal">
                  {unit.description || "Tidak ada deskripsi"}
                </p>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-obc-border pt-3">
                <DetailField label="Jenis unit">
                  {tenantTypeLabels[unit.tenantType]}
                </DetailField>
                <DetailField label="Dibuat">
                  {new Date(unit.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </DetailField>
                <DetailField label="Diperbarui">
                  {new Date(unit.updatedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </DetailField>
              </dl>
            </div>
          </div>

          <section className="rounded-lg border border-obc-border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-obc-muted">
                  Kontak layanan
                </p>
                <h3 className="mt-0.5 flex items-center gap-2 font-heading text-[14px] font-semibold text-obc-charcoal">
                  <span className="grid size-6 place-items-center rounded-full bg-[#25D366]">
                    <WhatsAppLogo className="size-4" />
                  </span>
                  PIC WhatsApp
                </h3>
              </div>
              <span className="rounded-md bg-[#E8F7EC] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#16803C]">
                WhatsApp
              </span>
            </div>
            <dl className="mt-3 grid gap-x-4 gap-y-3 border-t border-obc-border pt-3 sm:grid-cols-2">
              <DetailField label="Nama PIC">{unit.picName || "-"}</DetailField>
              <DetailField label="Nomor WhatsApp">
                {unit.picWhatsapp || "-"}
              </DetailField>
            </dl>
          </section>

        </div>
        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-obc-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onToggleStatus}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-[12px] font-semibold transition-colors ${unit.status === "active" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-obc-border text-obc-charcoal hover:bg-obc-ivory"}`}
          >
            {unit.status === "active" ? (
              <>
                <PowerOff size={14} />
                Nonaktifkan unit
              </>
            ) : (
              <>
                <Power size={14} />
                Aktifkan unit
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-obc-green-hover"
          >
            <Pencil size={14} />
            Edit unit
          </button>
        </footer>
      </section>
    </div>
  );
}
