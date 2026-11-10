import { useCallback, useEffect, useState } from "react";
import {
  BadgePercent,
  CalendarDays,
  CirclePlus,
  Layers3,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/ui/DeleteModal";
import PromoForm from "./Form";
import PromoTable from "./Table";
import {
  createPromo,
  deletePromo,
  getPromos,
  updatePromo,
  type Promo,
  type PromoInput,
  type PromoStatus,
} from "../../services/sport/promoService";

const PAGE_SIZE = 8;
const statuses: Array<PromoStatus | "all"> = ["all", "active", "inactive"];

function Metric({
  icon: Icon,
  label,
  value,
  note,
  className,
}: {
  icon: typeof BadgePercent;
  label: string;
  value: string;
  note: string;
  className: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-obc-border bg-white p-4 shadow-[0_1px_4px_rgba(31,51,32,0.04)]">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl ${className}`}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">
          {label}
        </p>
        <p className="mt-0.5 truncate font-heading text-[20px] font-bold text-obc-charcoal">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-obc-muted">{note}</p>
      </div>
    </div>
  );
}

export default function PromoManagement() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<PromoStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(0);
  const [editingItem, setEditingItem] = useState<Promo | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<Promo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [renderedAt] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    getPromos({
      page,
      limit: PAGE_SIZE,
      ...(status === "all" ? {} : { status }),
      ...(search.trim() ? { search: search.trim() } : {}),
    })
      .then((result) => {
        if (!cancelled) {
          setPromos(result.data);
          setTotal(result.meta.total);
          setTotalPages(Math.max(1, result.meta.totalPages));
        }
      })
      .catch((error: unknown) => {
        if (!cancelled)
          toast.error(
            error instanceof Error ? error.message : "Gagal memuat promo.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, reload, search, status]);

  const savePromo = async (payload: Partial<PromoInput>) => {
    if (editingItem) {
      await updatePromo(editingItem.id, payload);
      toast.success("Promo berhasil diperbarui.");
    } else {
      await createPromo(payload);
      toast.success("Promo berhasil dibuat.");
    }
    setFormOpen(false);
    setEditingItem(null);
    setReload((value) => value + 1);
  };

  const updateStatus = async (item: Promo, nextStatus: PromoStatus) => {
    try {
      await updatePromo(item.id, { status: nextStatus });
      setPromos((current) =>
        current.map((promo) =>
          promo.id === item.id ? { ...promo, status: nextStatus } : promo,
        ),
      );
      toast.success("Status promo berhasil diperbarui.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status promo.",
      );
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await deletePromo(deletingItem.id);
      toast.success("Promo berhasil dihapus.");
      setDeletingItem(null);
      setReload((value) => value + 1);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus promo.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };
  const openEdit = (item: Promo) => {
    setEditingItem(item);
    setFormOpen(true);
  };
  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingItem(null);
  }, []);
  const activeCount = promos.filter(
    (promo) => promo.status === "active",
  ).length;
  const expiringSoon = promos.filter((promo) => {
    const days = (new Date(promo.endDate).getTime() - renderedAt) / 86400000;
    return promo.status === "active" && days >= 0 && days <= 7;
  }).length;
  const totalUsage = promos.reduce((sum, promo) => sum + promo.usedCount, 0);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-7">
       
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={BadgePercent}
            label="Total promo"
            value={total.toLocaleString("id-ID")}
            note="Sesuai filter saat ini"
            className="bg-[#E7F5D0] text-obc-green"
          />
          <Metric
            icon={Layers3}
            label="Aktif"
            value={activeCount.toLocaleString("id-ID")}
            note="Pada halaman yang dimuat"
            className="bg-[#EAF4F0] text-[#296049]"
          />
          <Metric
            icon={CalendarDays}
            label="Segera berakhir"
            value={expiringSoon.toLocaleString("id-ID")}
            note="Dalam 7 hari ke depan"
            className="bg-[#FBF0D3] text-[#8A6100]"
          />
          <Metric
            icon={Sparkles}
            label="Total redemption"
            value={totalUsage.toLocaleString("id-ID")}
            note="Pemakaian pada halaman ini"
            className="bg-[#F4E9E1] text-[#A5502B]"
          />
        </section>
        <section className="mb-4 flex flex-col gap-3 rounded-2xl border border-obc-border bg-white p-3 shadow-[0_1px_4px_rgba(31,51,32,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div
            role="tablist"
            aria-label="Filter status promo"
            className="flex w-fit gap-1 rounded-lg border border-obc-border bg-[#F7F7F2] p-1"
          >
            {statuses.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={status === filter}
                onClick={() => {
                  setLoading(true);
                  setStatus(filter);
                  setPage(1);
                }}
                className={`h-9 rounded-md px-3 text-[11px] font-semibold transition-colors ${status === filter ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}
              >
                {filter === "all"
                  ? "Semua"
                  : filter === "active"
                    ? "Aktif"
                    : "Nonaktif"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setLoading(true);
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari promo..."
              className="h-9 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[11px] outline-none focus:border-obc-green sm:w-56"
            />
            <span className="hidden whitespace-nowrap text-[11px] text-obc-muted lg:inline">
              {total} promo ditemukan
            </span>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-obc-green px-3 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover"
            >
              <CirclePlus size={15} />
              Tambah promo
            </button>
          </div>
        </section>
        <PromoTable
          promos={promos}
          loading={loading}
          onStatusChange={updateStatus}
          onEdit={openEdit}
          onDelete={setDeletingItem}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setLoading(true);
          }}
          totalItems={total}
          pageSize={PAGE_SIZE}
          itemLabel="promo"
          disabled={loading}
          className="mt-3 flex flex-col gap-3 rounded-xl border border-obc-border bg-white px-4 py-4 shadow-[0_1px_4px_rgba(31,51,32,0.04)] sm:flex-row sm:items-center sm:justify-between sm:px-5"
        />
        {formOpen && (
          <PromoForm
            key={editingItem?.id ?? "new"}
            item={editingItem}
            onClose={closeForm}
            onSave={savePromo}
          />
        )}
        <DeleteModal
          isOpen={Boolean(deletingItem)}
          title="Hapus promo?"
          description="Promo akan dihapus permanen dan tidak dapat digunakan lagi."
          itemName={deletingItem?.code}
          confirmLabel="Hapus promo"
          isLoading={deleteLoading}
          onClose={() => setDeletingItem(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </DashboardLayout>
  );
}
