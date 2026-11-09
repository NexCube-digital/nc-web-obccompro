import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  MessageSquareQuote,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  ToggleRight,
  X,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ThemedSelect from "../../components/common/ThemedSelect";
import { getTestimonialAvatarUrl } from "../../../../services/Public/Testimonial";
import type { Testimonial } from "./testimonialService";

type StatusFilter = "all" | Testimonial["status"];
const PAGE_SIZE = 8;

interface TestimonialTableProps {
  testimonials: Testimonial[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
  onStatusChange: (
    testimonial: Testimonial,
    status: Testimonial["status"],
  ) => void;
}

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

function TestimonialDetailModal({
  testimonial,
  onClose,
  onEdit,
  onDelete,
}: {
  testimonial: Testimonial;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
      className="fixed inset-0 z-[60] grid place-items-center bg-obc-charcoal/55 p-3 backdrop-blur-sm sm:p-6"
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

function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof MessageSquareQuote;
  tone: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-r border-obc-border px-4 py-3 last:border-r-0 sm:px-5">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-lg ${tone}`}
      >
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-obc-muted">{label}</p>
        <p className="mt-0.5 truncate font-heading text-[17px] font-bold text-obc-charcoal">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function TestimonialTable({
  testimonials,
  loading,
  onCreate,
  onEdit,
  onDelete,
  onStatusChange,
}: TestimonialTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return testimonials.filter((testimonial) => {
      const matchesStatus =
        statusFilter === "all" || testimonial.status === statusFilter;
      const searchableText = [
        testimonial.name,
        testimonial.company,
        testimonial.text,
        testimonial.textEn,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && searchableText.includes(normalizedQuery);
    });
  }, [query, statusFilter, testimonials]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const publishedCount = testimonials.filter(
    (testimonial) => testimonial.status === "published",
  ).length;
  const averageRating = testimonials.length
    ? testimonials.reduce(
        (total, testimonial) => total + testimonial.rating,
        0,
      ) / testimonials.length
    : 0;
  const filters: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div>
      <section
        aria-label="Ringkasan testimoni"
        className="mb-4 grid grid-cols-1 divide-y divide-obc-border overflow-hidden rounded-xl border border-obc-border bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <Metric
          label="Total testimoni"
          value={testimonials.length.toLocaleString("id-ID")}
          icon={MessageSquareQuote}
          tone="bg-[#E7F5D0] text-obc-green"
        />
        <Metric
          label="Tayang di situs"
          value={publishedCount.toLocaleString("id-ID")}
          icon={ToggleRight}
          tone="bg-[#E9F1D8] text-[#404F14]"
        />
        <Metric
          label="Rating rata-rata"
          value={testimonials.length ? `${averageRating.toFixed(1)} / 5` : "-"}
          icon={Star}
          tone="bg-[#FBF0D3] text-amber-600"
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
        <header className="border-b border-obc-border p-4 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">
                Daftar testimoni
              </h2>
              <p className="mt-0.5 text-[12px] text-obc-muted">
                {filtered.length.toLocaleString("id-ID")} dari{" "}
                {testimonials.length.toLocaleString("id-ID")} testimoni
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative block w-full sm:w-68">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari nama atau isi ulasan..."
                  className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[12px] outline-none transition focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]/60"
                />
              </label>
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition hover:bg-obc-green-hover"
              >
                <Plus size={15} />
                Tambah testimoni
              </button>
            </div>
          </div>
          <div
            role="tablist"
            aria-label="Filter status testimoni"
            className="mt-4 flex gap-1 overflow-x-auto"
          >
            {filters.map((filter) => {
              const count =
                filter.value === "all"
                  ? testimonials.length
                  : testimonials.filter(
                      (testimonial) => testimonial.status === filter.value,
                    ).length;
              return (
                <button
                  key={filter.value}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === filter.value}
                  onClick={() => {
                    setStatusFilter(filter.value);
                    setPage(1);
                  }}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors ${statusFilter === filter.value ? "border-[#D9E7BB] bg-[#F3F8E8] text-obc-green" : "border-transparent text-obc-muted hover:border-obc-border hover:bg-[#FDFCF7]"}`}
                >
                  {filter.label}
                  <span className="ml-1.5 opacity-65">{count}</span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left">
            <thead>
              <tr className="border-b border-obc-border bg-[#F8F9F5] font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
                <th className="px-5 py-3.5">Pelanggan</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Testimoni</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14 text-center text-obc-muted"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-obc-border border-t-obc-green" />
                      Memuat data testimoni...
                    </span>
                  </td>
                </tr>
              ) : pageItems.length ? (
                pageItems.map((testimonial) => {
                  const avatarUrl = getTestimonialAvatarUrl(testimonial.avatar);
                  return (
                    <tr
                      key={testimonial.id}
                      className="border-t border-obc-border transition-colors hover:bg-[#FBFCF9]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-48 items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={testimonial.name}
                              className="size-10 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm"
                            />
                          ) : (
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#CDF178] font-heading text-[11px] font-bold text-obc-green">
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
                            <p className="truncate font-semibold text-obc-charcoal">
                              {testimonial.name}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-obc-muted">
                              {testimonial.company || "Pelanggan"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFF8E8] px-2 py-1 font-semibold text-[#8A6100]">
                          <Star size={12} fill="currentColor" />
                          {testimonial.rating}
                          <span className="font-normal text-[#9A8B67]">
                            / 5
                          </span>
                        </span>
                      </td>
                      <td className="max-w-sm px-5 py-4">
                        <p className="line-clamp-2 min-w-56 leading-5 text-[#596054]">
                          {testimonial.text}
                        </p>
                        {testimonial.textEn && (
                          <span className="mt-1 inline-block rounded bg-[#F1EFE8] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#626858]">
                            Terjemahan EN
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <ThemedSelect
                          label={`Status testimoni ${testimonial.name}`}
                          value={testimonial.status}
                          options={(
                            [
                              "published",
                              "draft",
                              "archived",
                            ] as Testimonial["status"][]
                          ).map((status) => ({
                            value: status,
                            label: statusLabels[status],
                          }))}
                          onValueChange={(status) =>
                            onStatusChange(
                              testimonial,
                              status as Testimonial["status"],
                            )
                          }
                          className={`h-8 w-fit rounded-md px-2.5 py-1 text-[10px] font-semibold ${statusStyles[testimonial.status]}`}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedTestimonial(testimonial)}
                            title={`Lihat detail ${testimonial.name}`}
                            aria-label={`Lihat detail testimoni ${testimonial.name}`}
                            className="grid size-9 place-items-center rounded-lg border border-obc-border text-obc-muted transition hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#F1EFE8] text-obc-olive">
                      <MessageSquareQuote size={20} />
                    </div>
                    <p className="mt-3 font-semibold text-obc-charcoal">
                      {testimonials.length
                        ? "Testimoni tidak ditemukan"
                        : "Belum ada testimoni"}
                    </p>
                    <p className="mt-1 text-[12px] text-obc-muted">
                      {testimonials.length
                        ? "Coba ubah kata kunci atau filter status."
                        : "Tambahkan cerita pelanggan pertama untuk ditampilkan di situs."}
                    </p>
                    {!testimonials.length && (
                      <button
                        type="button"
                        onClick={onCreate}
                        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-obc-green px-3.5 text-[12px] font-semibold text-white hover:bg-obc-green-hover"
                      >
                        <Plus size={14} />
                        Tambah testimoni
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          itemLabel="testimoni"
          className="flex flex-col gap-3 border-t border-obc-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        />
      </section>
      {selectedTestimonial && (
        <TestimonialDetailModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
          onEdit={() => {
            setSelectedTestimonial(null);
            onEdit(selectedTestimonial);
          }}
          onDelete={() => {
            setSelectedTestimonial(null);
            onDelete(selectedTestimonial);
          }}
        />
      )}
    </div>
  );
}
