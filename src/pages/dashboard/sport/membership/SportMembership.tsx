import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, CalendarRange, Package } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import DeleteModal from "../../components/ui/DeleteModal";
import {
  sportService,
  type ActiveStatus,
  type MembershipPackage,
  type MembershipPackageUpdateInput,
} from "../../services/sport/SportService";
import MembershipForm from "./Form";
import MembershipTable from "./Table";

const packageStatuses: ActiveStatus[] = ["active", "inactive"];
const statusLabels: Record<ActiveStatus, string> = {
  active: "Aktif",
  inactive: "Nonaktif",
};

function SummaryMetric({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Package;
  tone: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)]">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-lg ${tone}`}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-obc-muted">{label}</p>
        <p className="mt-0.5 truncate font-heading text-[20px] font-bold text-obc-charcoal">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-obc-muted">{note}</p>
      </div>
    </div>
  );
}

export default function SportMembership() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ActiveStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(0);
  const [editingItem, setEditingItem] = useState<MembershipPackage | null>(
    null,
  );
  const [deletingItem, setDeletingItem] = useState<MembershipPackage | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const closeDeleteModal = useCallback(() => setDeletingItem(null), []);

  useEffect(() => {
    let cancelled = false;
    sportService
      .getMembershipPackages({
        page,
        limit: 10,
        ...(status === "all" ? {} : { status }),
      })
      .then((result) => {
        if (!cancelled) {
          setPackages(result.data);
          setTotal(result.meta.total);
          setTotalPages(result.meta.totalPages);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled)
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memuat paket membership.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, reload, status]);

  const updateStatus = async (
    item: MembershipPackage,
    nextStatus: ActiveStatus,
  ) => {
    try {
      await sportService.updateMembershipPackageStatus(item.id, nextStatus);
      setPackages((current) =>
        current.map((membershipPackage) =>
          membershipPackage.id === item.id
            ? { ...membershipPackage, status: nextStatus }
            : membershipPackage,
        ),
      );
      toast.success("Status paket membership diperbarui.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status paket.",
      );
    }
  };

  const saveItem = async (
    item: MembershipPackage,
    payload: MembershipPackageUpdateInput,
  ) => {
    await sportService.updateMembershipPackage(item.id, payload);
    toast.success("Paket membership berhasil diperbarui.");
    setReload((current) => current + 1);
  };

  const deactivateItem = (item: MembershipPackage) => setDeletingItem(item);

  const confirmDeactivate = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await sportService.deleteMembershipPackage(deletingItem.id);
      toast.success("Paket membership berhasil dinonaktifkan.");
      setDeletingItem(null);
      setReload((current) => current + 1);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menonaktifkan paket membership.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeOnPage = packages.filter(
    (item) => item.status === "active",
  ).length;
  const rangeStart = total === 0 ? 0 : (page - 1) * 10 + 1;
  const rangeEnd = Math.min(page * 10, total);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-screen-2xl px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">
            OBC Sport / Pengelolaan membership
          </p>
          <h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">
            Paket membership
          </h1>
          <p className="mt-1 max-w-2xl text-[13px] text-obc-muted">
            Tinjau manfaat sesi, masa berlaku, dan harga paket membership.
          </p>
        </header>
        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <SummaryMetric
            label="Paket sesuai filter"
            value={total.toLocaleString("id-ID")}
            note="Total hasil dari server"
            icon={Package}
            tone="bg-[#E7F5D0] text-obc-green"
          />
          <SummaryMetric
            label="Aktif di halaman ini"
            value={activeOnPage.toLocaleString("id-ID")}
            note={`Dari ${packages.length} paket dimuat`}
            icon={BadgeCheck}
            tone="bg-[#EAF4F0] text-[#296049]"
          />
          <SummaryMetric
            label="Rentang data"
            value={total ? `${rangeStart}–${rangeEnd}` : "0"}
            note={`Halaman ${page} dari ${totalPages}`}
            icon={CalendarRange}
            tone="bg-[#FBF0D3] text-[#8A6100]"
          />
        </section>
        <section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 shadow-[0_1px_3px_rgba(31,51,32,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Filter status paket membership"
            className="flex w-fit gap-1 rounded-lg border border-obc-border bg-[#F7F7F2] p-1"
          >
            {(["all", ...packageStatuses] as const).map((filterStatus) => {
              const selected = status === filterStatus;
              return (
                <button
                  key={filterStatus}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setLoading(true);
                    setStatus(filterStatus);
                    setPage(1);
                  }}
                  className={`h-9 rounded-md px-3 text-[11px] font-semibold transition-colors ${selected ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}
                >
                  {filterStatus === "all"
                    ? "Semua status"
                    : statusLabels[filterStatus]}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] text-obc-muted">
            {total.toLocaleString("id-ID")} paket ditemukan · 10 per halaman
          </span>
        </section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white shadow-[0_2px_12px_rgba(31,51,32,0.04)]">
          <MembershipTable
            packages={packages}
            loading={loading}
            onStatusChange={updateStatus}
            onEdit={setEditingItem}
            onDelete={deactivateItem}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => {
              setLoading(true);
              setPage(nextPage);
            }}
            totalItems={total}
            pageSize={10}
            itemLabel="paket"
            disabled={loading}
            className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          />
        </section>
        {editingItem && (
          <MembershipForm
            key={editingItem.id}
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={(payload) => saveItem(editingItem, payload)}
          />
        )}
        <DeleteModal
          isOpen={Boolean(deletingItem)}
          title="Nonaktifkan paket membership?"
          description="Paket ini tidak akan dihapus permanen dan dapat diaktifkan kembali nanti."
          itemName={deletingItem?.name}
          confirmLabel="Nonaktifkan"
          isLoading={deleteLoading}
          onClose={closeDeleteModal}
          onConfirm={confirmDeactivate}
        />
      </div>
    </DashboardLayout>
  );
}
