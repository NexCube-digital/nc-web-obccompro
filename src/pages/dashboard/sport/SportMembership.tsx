import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { sportService, type ActiveStatus, type MembershipPackage } from "./SportService";

const packageStatuses: ActiveStatus[] = ["active", "inactive"];
const statusLabels: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const statusClasses: Record<ActiveStatus, string> = { active: "bg-[#E7F5D0] text-[#1F3320]", inactive: "bg-[#F1EFE8] text-obc-muted" };
const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function SportMembership() {
  const [packages, setPackages] = useState<MembershipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ActiveStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
  }, [page, status]);

  const updateStatus = async (item: MembershipPackage, nextStatus: ActiveStatus) => {
    try {
      await sportService.updateMembershipPackageStatus(item.id, nextStatus);
      setPackages((current) => current.map((membershipPackage) => membershipPackage.id === item.id ? { ...membershipPackage, status: nextStatus } : membershipPackage));
      toast.success("Status paket membership diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui status paket.");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5"><p className="text-[13px] text-obc-muted">OBC Sport / Membership</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Paket membership</h1><p className="mt-1 text-[13px] text-obc-muted">Katalog paket sesi dan harga member yang tersedia di backend.</p></header>
        <section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] text-obc-muted">{total.toLocaleString("id-ID")} paket ditemukan</p><select aria-label="Filter status paket membership" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as ActiveStatus | "all"); setPage(1); }} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]"><option value="all">Semua status</option>{packageStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-[13px]"><thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3">Paket</th><th className="px-4 py-3">Cabang / resource</th><th className="px-4 py-3">Sesi & masa berlaku</th><th className="px-4 py-3">Harga</th><th className="px-4 py-3">Status</th></tr></thead><tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Memuat paket membership...</td></tr> : packages.length ? packages.map((item) => <tr key={item.id} className="border-t border-obc-border align-top"><td className="px-4 py-3"><p className="font-semibold text-obc-charcoal">{item.name}</p><p className="max-w-80 text-[11px] text-obc-muted">{item.description || "-"}</p></td><td className="px-4 py-3 capitalize"><p>{item.sportType}</p><p className="text-[11px] text-obc-muted">{item.resource?.name || "Semua resource"}</p></td><td className="px-4 py-3">{item.totalSessions} sesi<p className="text-[11px] text-obc-muted">Berlaku {item.validityDays} hari</p></td><td className="whitespace-nowrap px-4 py-3"><p className="font-semibold">{money(item.memberPrice)}</p><p className="text-[11px] text-obc-muted">Harga normal {money(item.originalPrice)} · diskon {item.discountPercent}%</p></td><td className="px-4 py-3"><select aria-label={`Status paket ${item.name}`} value={item.status} onChange={(event) => updateStatus(item, event.target.value as ActiveStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${statusClasses[item.status]}`}>{packageStatuses.map((entry) => <option key={entry} value={entry}>{statusLabels[entry]}</option>)}</select></td></tr>) : <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Belum ada paket membership.</td></tr>}
            </tbody></table></div>
          <div className="flex items-center justify-between border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted"><span>Halaman {page} dari {Math.max(totalPages, 1)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>
        </section>
      </div>
    </DashboardLayout>
  );
}
