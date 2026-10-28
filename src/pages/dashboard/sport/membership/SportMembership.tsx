import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { sportService, type ActiveStatus, type MembershipPackage, type MembershipPackageUpdateInput } from "../SportService";
import MembershipForm from "./Form";
import MembershipTable from "./Table";

const packageStatuses: ActiveStatus[] = ["active", "inactive"];
const statusLabels: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };

export default function SportMembership() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ActiveStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(0);
  const [editingItem, setEditingItem] = useState<MembershipPackage | null>(null);

  useEffect(() => {
    let cancelled = false;
    sportService.getMembershipPackages({ page, limit: 10, ...(status === "all" ? {} : { status }) })
      .then((result) => {
        if (!cancelled) {
          setPackages(result.data);
          setTotal(result.meta.total);
          setTotalPages(result.meta.totalPages);
        }
      })
      .catch((error: unknown) => { if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat paket membership."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, reload, status]);

  const updateStatus = async (item: MembershipPackage, nextStatus: ActiveStatus) => {
    try {
      await sportService.updateMembershipPackageStatus(item.id, nextStatus);
      setPackages((current) => current.map((membershipPackage) => membershipPackage.id === item.id ? { ...membershipPackage, status: nextStatus } : membershipPackage));
      toast.success("Status paket membership diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui status paket.");
    }
  };

  const saveItem = async (item: MembershipPackage, payload: MembershipPackageUpdateInput) => {
    await sportService.updateMembershipPackage(item.id, payload);
    toast.success("Paket membership berhasil diperbarui.");
    setReload((current) => current + 1);
  };

  const deactivateItem = async (item: MembershipPackage) => {
    if (!window.confirm(`Nonaktifkan paket "${item.name}"? Item tidak akan dihapus permanen.`)) return;
    try {
      await sportService.deleteMembershipPackage(item.id);
      toast.success("Paket membership berhasil dinonaktifkan.");
      setReload((current) => current + 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menonaktifkan paket membership.");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5"><p className="text-[13px] text-obc-muted">OBC Sport / Membership</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Paket membership</h1><p className="mt-1 text-[13px] text-obc-muted">Katalog paket sesi dan harga member yang tersedia di backend.</p></header>
        <section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] text-obc-muted">{total.toLocaleString("id-ID")} paket ditemukan</p><select aria-label="Filter status paket membership" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as ActiveStatus | "all"); setPage(1); }} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]"><option value="all">Semua status</option>{packageStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <MembershipTable packages={packages} loading={loading} onStatusChange={updateStatus} onEdit={setEditingItem} onDelete={deactivateItem} />
          <div className="flex items-center justify-between border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted"><span>Halaman {page} dari {Math.max(totalPages, 1)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>
        </section>
        {editingItem && <MembershipForm key={editingItem.id} item={editingItem} onClose={() => setEditingItem(null)} onSave={(payload) => saveItem(editingItem, payload)} />}
      </div>
    </DashboardLayout>
  );
}
