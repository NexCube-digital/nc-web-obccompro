import { useMemo, useState } from "react";
import {
  CalendarDays,
  CirclePercent,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { Promo, PromoStatus } from "../../services/sport/promoService";

type Props = {
  promos: Promo[];
  loading: boolean;
  onStatusChange: (item: Promo, status: PromoStatus) => void;
  onEdit: (item: Promo) => void;
  onDelete: (item: Promo) => void;
};
const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const statuses: PromoStatus[] = ["active", "inactive"];

export default function PromoTable({
  promos,
  loading,
  onStatusChange,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");
  const visiblePromos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return promos.filter(
      (item) =>
        !query ||
        [
          item.code,
          item.name,
          item.description,
          ...(item.applicableSports ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
    );
  }, [promos, search]);
  return (
    <section className="overflow-hidden rounded-2xl border border-obc-border bg-white shadow-[0_2px_16px_rgba(31,51,32,0.05)]">
      <header className="flex flex-col gap-3 border-b border-obc-border bg-[#FDFCF7] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h2 className="font-heading text-[15px] font-bold text-obc-charcoal">
            Katalog promo
          </h2>
          <p className="mt-0.5 text-[11px] text-obc-muted">
            {search.trim()
              ? `${visiblePromos.length} hasil dari ${promos.length} promo`
              : `${promos.length} promo di halaman ini`}
          </p>
        </div>
        <label className="relative block w-full sm:w-80">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari kode atau nama promo..."
            aria-label="Cari promo"
            className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[12px] outline-none focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
          />
        </label>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-obc-border bg-white font-heading text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
              <th className="px-4 py-3.5">Promo</th>
              <th className="px-4 py-3.5">Potongan</th>
              <th className="px-4 py-3.5">Periode</th>
              <th className="px-4 py-3.5">Pemakaian</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-16 text-center text-obc-muted"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-obc-border border-t-obc-green" />
                    Memuat promo...
                  </span>
                </td>
              </tr>
            ) : visiblePromos.length ? (
              visiblePromos.map((item) => {
                const usage = item.quota
                  ? Math.min(100, (item.usedCount / item.quota) * 100)
                  : 0;
                return (
                  <tr
                    key={item.id}
                    className="border-t border-obc-border transition-colors hover:bg-[#F8FAF4]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#E7F5D0] text-obc-green">
                          <CirclePercent size={18} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] font-bold tracking-wider text-obc-green">
                            {item.code}
                          </p>
                          <p className="mt-0.5 max-w-64 truncate font-semibold text-obc-charcoal">
                            {item.name}
                          </p>
                          <p className="mt-0.5 max-w-72 truncate text-[10px] text-obc-muted">
                            {item.description || "Tanpa deskripsi"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-heading text-[14px] font-bold text-obc-charcoal">
                        {item.discountType === "percentage"
                          ? `${item.discountValue}%`
                          : money(item.discountValue)}
                      </p>
                      <p className="mt-0.5 text-[10px] text-obc-muted">
                        Min. {money(item.minOrderAmount)}
                        {item.maxDiscount
                          ? ` · Maks. ${money(item.maxDiscount)}`
                          : ""}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-start gap-2 text-[11px] text-obc-charcoal">
                        <CalendarDays
                          size={14}
                          className="mt-0.5 text-obc-green"
                        />
                        <span>
                          {dateLabel(item.startDate)}
                          <br />
                          <span className="text-obc-muted">
                            s/d {dateLabel(item.endDate)}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-obc-charcoal">
                        {item.usedCount.toLocaleString("id-ID")}{" "}
                        <span className="font-normal text-obc-muted">
                          /{" "}
                          {item.quota == null
                            ? "∞"
                            : item.quota.toLocaleString("id-ID")}
                        </span>
                      </p>
                      {item.quota != null && (
                        <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-[#EAF0E4]">
                          <span
                            className={`block h-full rounded-full ${usage >= 90 ? "bg-obc-red" : "bg-obc-green"}`}
                            style={{ width: `${usage}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <ThemedSelect
                        label={`Status promo ${item.code}`}
                        value={item.status}
                        options={statuses.map((status) => ({
                          value: status,
                          label: status === "active" ? "Aktif" : "Nonaktif",
                        }))}
                        onValueChange={(value) =>
                          onStatusChange(item, value as PromoStatus)
                        }
                        className={`h-8 w-fit rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold ${item.status === "active" ? "!bg-[#E7F5D0] !text-[#1F3320]" : "!bg-[#F1EFE8] !text-obc-muted"}`}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          title="Edit promo"
                          aria-label={`Edit promo ${item.code}`}
                          onClick={() => onEdit(item)}
                          className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          title="Hapus promo"
                          aria-label={`Hapus promo ${item.code}`}
                          onClick={() => onDelete(item)}
                          className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted hover:border-obc-red hover:bg-red-50 hover:text-obc-red"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F3F8E8] text-obc-green">
                    <CirclePercent size={19} />
                  </span>
                  <p className="mt-3 text-[13px] font-semibold text-obc-charcoal">
                    {search.trim()
                      ? "Promo tidak ditemukan"
                      : "Belum ada promo"}
                  </p>
                  <p className="mt-1 text-[11px] text-obc-muted">
                    {search.trim()
                      ? "Coba kode atau nama lain."
                      : "Buat promo pertama untuk mulai mengatur penawaran."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
