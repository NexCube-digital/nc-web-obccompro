import { useEffect } from "react";
import { Pencil, Star, Trash2, X } from "lucide-react";
import { getTestimonialAvatarUrl } from "../../../../services/Public/Testimonial";
import type { Testimonial } from "../../services/cms/testimonialService";

type Props = {
  testimonial: Testimonial;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const statusStyles: Record<Testimonial["status"], string> = {
  published: "!bg-[#E7F5D0] !text-[#1F3320]",
  draft: "!bg-[#FBF0D3] !text-[#8A6100]",
  archived: "!bg-[#F1EFE8] !text-[#5D6256]",
};

const statusLabels: Record<Testimonial["status"], string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

export default function TestimonialDetailModal({
  testimonial,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const avatarUrl = getTestimonialAvatarUrl(testimonial.avatar);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 grid place-items-center bg-obc-charcoal/55 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-detail-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-obc-border bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="size-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#CDF178] font-heading text-[13px] font-bold text-obc-green">
                {testimonial.name
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">
                Detail testimoni
              </p>
              <h2
                id="testimonial-detail-title"
                className="mt-0.5 truncate font-heading text-lg font-bold text-obc-charcoal"
              >
                {testimonial.name}
              </h2>
              <p className="text-[12px] text-obc-muted">
                {testimonial.company || "Pelanggan"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail testimoni"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"
          >
            <X size={17} />
          </button>
        </header>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${statusStyles[testimonial.status]}`}
            >
              {statusLabels[testimonial.status]}
            </span>
            <div
              className="flex items-center gap-1 text-amber-500"
              aria-label={`Rating ${testimonial.rating} dari 5`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  fill={star <= testimonial.rating ? "currentColor" : "none"}
                  className={star <= testimonial.rating ? "" : "text-[#C7C9C0]"}
                />
              ))}
              <span className="ml-1 text-[12px] font-semibold text-obc-charcoal">
                {testimonial.rating}/5
              </span>
            </div>
          </div>
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
              Bahasa Indonesia
            </h3>
            <blockquote className="mt-2 whitespace-pre-line rounded-lg border border-obc-border bg-[#FAFBF8] p-4 text-[13px] leading-6 text-obc-charcoal">
              {testimonial.text}
            </blockquote>
          </section>
          {testimonial.textEn && (
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
                English
              </h3>
              <blockquote className="mt-2 whitespace-pre-line rounded-lg border border-obc-border bg-[#FAFBF8] p-4 text-[13px] leading-6 text-obc-charcoal">
                {testimonial.textEn}
              </blockquote>
            </section>
          )}
        </div>
        <footer className="flex flex-col-reverse gap-2 border-t border-obc-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 text-[12px] font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
            Hapus
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover"
          >
            <Pencil size={14} />
            Edit testimoni
          </button>
        </footer>
      </section>
    </div>
  );
}
