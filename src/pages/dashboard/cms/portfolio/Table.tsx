import { useState } from "react";
import {
  BriefcaseBusiness,
  ImageOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { getPortfolioImageUrl, type Portfolio } from "../../services/cms/portfolioService";

type Props = {
  portfolios: Portfolio[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (portfolio: Portfolio) => void;
};

const PAGE_SIZE = 8;

export default function PortfolioTable({
  portfolios,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(portfolios.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = portfolios.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section>
      <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-obc-olive">
            Karya pilihan
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-obc-charcoal">
            Galeri portfolio
          </h2>
        </div>
        <p className="text-[12px] text-obc-muted">
          {portfolios.length.toLocaleString("id-ID")} proyek
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-obc-border bg-white"
            >
              <div className="aspect-4/3 animate-pulse bg-[#ECEFE7]" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-[#ECEFE7]" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#ECEFE7]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#ECEFE7]" />
              </div>
            </div>
          ))}
        </div>
      ) : portfolios.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {pageItems.map((portfolio) => {
            const imageUrl = getPortfolioImageUrl(portfolio.imageUrl);
            const category = portfolio.category.replace(/([A-Z])/g, " $1");
            return (
              <article
                key={portfolio.id}
                className="group overflow-hidden rounded-xl border border-obc-border bg-white transition duration-200 hover:-translate-y-0.5 hover:border-obc-status-locked-border hover:shadow-[0_12px_28px_rgba(52,49,51,0.1)]"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#ECEFE7]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#7C856E]">
                    <ImageOff size={25} strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">
                      Belum ada gambar
                    </span>
                  </div>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={portfolio.title}
                      loading="lazy"
                      onError={(event) => event.currentTarget.remove()}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                    />
                  )}
                  <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-md border border-white/70 bg-white/90 px-2.5 py-1 text-[10px] font-bold capitalize text-obc-charcoal shadow-sm backdrop-blur">
                    {category}
                  </span>
                  <div className="absolute right-3 top-3 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(portfolio)}
                      aria-label={`Ubah ${portfolio.title}`}
                      title="Ubah portfolio"
                      className="grid size-9 place-items-center rounded-lg border border-white/70 bg-white/95 text-obc-charcoal shadow-sm transition hover:bg-obc-green hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(portfolio)}
                      aria-label={`Hapus ${portfolio.title}`}
                      title="Hapus portfolio"
                      className="grid size-9 place-items-center rounded-lg border border-white/70 bg-white/95 text-obc-red shadow-sm transition hover:bg-obc-red hover:text-white"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p
                    className="line-clamp-1 font-heading text-[15px] font-semibold text-obc-charcoal"
                    title={portfolio.title}
                  >
                    {portfolio.title}
                  </p>
                  <p className="mt-1 line-clamp-2 min-h-9 text-[11px] leading-4.5 text-obc-muted">
                    {portfolio.client ||
                      portfolio.description ||
                      "Portfolio OBC"}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-obc-border pt-3">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-obc-olive">
                      <BriefcaseBusiness size={12} />
                      {category}
                    </span>
                    <span className="text-[10px] text-obc-muted">
                      {portfolio.featured ? "Unggulan" : "Koleksi"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-obc-status-locked-border bg-[#FAFBF7] px-5 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-[#E7F5D0] text-obc-green">
            <BriefcaseBusiness size={21} />
          </span>
          <h3 className="mt-4 font-heading text-[16px] font-semibold text-obc-charcoal">
            Belum ada portfolio
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-[12px] leading-5 text-obc-muted">
            Tambahkan proyek pertama untuk mulai membangun galeri karya OBC.
          </p>
          <button
            type="button"
            onClick={onCreate}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition hover:bg-obc-green-hover"
          >
            <Plus size={15} />
            Tambah portfolio
          </button>
        </div>
      )}
      {!loading && portfolios.length > 0 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={portfolios.length}
          pageSize={PAGE_SIZE}
          itemLabel="proyek"
          className="mt-5 flex flex-col gap-3 border-t border-obc-border pt-4 sm:flex-row sm:items-center sm:justify-between"
        />
      )}
    </section>
  );
}
