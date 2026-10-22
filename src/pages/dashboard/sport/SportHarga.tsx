import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { sportService, type ActiveStatus, type PricingPackage, type PricingRule } from "./SportService";

type PricingView = "rules" | "packages";
type PricingRecord = PricingRule | PricingPackage;
const activeStatuses: ActiveStatus[] = ["active", "inactive"];
const activeLabel: Record<ActiveStatus, string> = { active: "Aktif", inactive: "Nonaktif" };
const activeStyle: Record<ActiveStatus, string> = { active: "bg-[#E7F5D0] text-[#1F3320]", inactive: "bg-[#F1EFE8] text-obc-muted" };
const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const dayLabel: Record<PricingRule["dayType"], string> = { weekday: "Hari kerja", weekend: "Akhir pekan", holiday: "Hari libur" };

export default function SportHarga() {
  const [view, setView] = useState<PricingView>("rules");
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ActiveStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const request = view === "rules"
      ? sportService.getPricingRules({ page, limit: 10, ...(status === "all" ? {} : { status }) })
      : sportService.getPricingPackages({ page, limit: 10, ...(status === "all" ? {} : { status }) });
    request.then((result) => {
      if (cancelled) return;
      if (view === "rules") setRules(result.data as PricingRule[]);
      else setPackages(result.data as PricingPackage[]);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
    }).catch((error: unknown) => {
      if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat data tarif.");
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, status, view]);

  const reloadState = () => setLoading(true);
  const changeStatus = async (item: PricingRecord, nextStatus: ActiveStatus) => {
    try {
      if (view === "rules") {
        await sportService.updatePricingRuleStatus(item.id, nextStatus);
        setRules((current) => current.map((rule) => rule.id === item.id ? { ...rule, status: nextStatus } : rule));
      } else {
        await sportService.updatePricingPackageStatus(item.id, nextStatus);
        setPackages((current) => current.map((pricingPackage) => pricingPackage.id === item.id ? { ...pricingPackage, status: nextStatus } : pricingPackage));
      }
      toast.success("Status harga berhasil diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui status harga.");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5"><p className="text-[13px] text-obc-muted">OBC Sport / Harga & Tarif</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Harga & tarif</h1><p className="mt-1 text-[13px] text-obc-muted">Aturan tarif per jam dan paket durasi dari backend.</p></header>
        <section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Jenis harga" className="flex gap-1 rounded-lg border border-obc-border bg-[#FDFCF7] p-1"><button type="button" role="tab" aria-selected={view === "rules"} onClick={() => { setLoading(true); setView("rules"); setPage(1); }} className={`rounded-md px-3 py-2 text-[12px] font-medium ${view === "rules" ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}>Aturan per jam</button><button type="button" role="tab" aria-selected={view === "packages"} onClick={() => { setLoading(true); setView("packages"); setPage(1); }} className={`rounded-md px-3 py-2 text-[12px] font-medium ${view === "packages" ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}>Paket durasi</button></div>
          <div className="flex items-center justify-between gap-3"><span className="text-[12px] text-obc-muted">{total.toLocaleString("id-ID")} data</span><select aria-label="Filter status harga" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as ActiveStatus | "all"); setPage(1); }} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]"><option value="all">Semua status</option>{activeStatuses.map((item) => <option key={item} value={item}>{activeLabel[item]}</option>)}</select></div>
        </section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <div className="overflow-x-auto"><table className="w-full min-w-190 text-left text-[13px]"><thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted">{view === "rules" ? <><th className="px-4 py-3">Resource</th><th className="px-4 py-3">Hari</th><th className="px-4 py-3">Rentang waktu</th><th className="px-4 py-3">Tarif / jam</th><th className="px-4 py-3">Min. durasi</th></> : <><th className="px-4 py-3">Paket</th><th className="px-4 py-3">Olahraga</th><th className="px-4 py-3">Resource</th><th className="px-4 py-3">Durasi</th><th className="px-4 py-3">Harga paket</th></>}<th className="px-4 py-3">Status</th></tr></thead><tbody>
            {loading ? <tr><td colSpan={6} className="px-4 py-12 text-center text-obc-muted">Memuat data tarif...</td></tr> : view === "rules" ? rules.length ? rules.map((rule) => <tr key={rule.id} className="border-t border-obc-border"><td className="px-4 py-3">{rule.resource?.name ?? "Semua resource"}</td><td className="px-4 py-3">{dayLabel[rule.dayType]}</td><td className="whitespace-nowrap px-4 py-3">{rule.tierStartTime}–{rule.tierEndTime}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{money(rule.pricePerHour)}</td><td className="px-4 py-3">{rule.minDurationMinutes ? `${rule.minDurationMinutes} menit` : "-"}</td><td className="px-4 py-3"><select aria-label={`Status aturan tarif ${rule.id}`} value={rule.status} onChange={(event) => changeStatus(rule, event.target.value as ActiveStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${activeStyle[rule.status]}`}>{activeStatuses.map((item) => <option key={item} value={item}>{activeLabel[item]}</option>)}</select></td></tr>) : <tr><td colSpan={6} className="px-4 py-12 text-center text-obc-muted">Belum ada aturan tarif.</td></tr> : packages.length ? packages.map((pricingPackage) => <tr key={pricingPackage.id} className="border-t border-obc-border"><td className="px-4 py-3"><p className="font-semibold">{pricingPackage.name}</p><p className="text-[11px] text-obc-muted">{pricingPackage.description || "-"}</p></td><td className="px-4 py-3 capitalize">{pricingPackage.sportType || "Semua"}</td><td className="px-4 py-3">{pricingPackage.resource?.name ?? "Semua resource"}</td><td className="px-4 py-3">{pricingPackage.durationMinutes} menit</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{money(pricingPackage.packagePrice)}{pricingPackage.discountPercent ? <span className="ml-2 text-[11px] font-normal text-obc-muted">Diskon {pricingPackage.discountPercent}%</span> : null}</td><td className="px-4 py-3"><select aria-label={`Status paket ${pricingPackage.name}`} value={pricingPackage.status} onChange={(event) => changeStatus(pricingPackage, event.target.value as ActiveStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${activeStyle[pricingPackage.status]}`}>{activeStatuses.map((item) => <option key={item} value={item}>{activeLabel[item]}</option>)}</select></td></tr>) : <tr><td colSpan={6} className="px-4 py-12 text-center text-obc-muted">Belum ada paket harga.</td></tr>}
            </tbody></table></div>
          <div className="flex items-center justify-between border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted"><span>Halaman {page} dari {Math.max(totalPages, 1)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { reloadState(); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= totalPages} onClick={() => { reloadState(); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>
        </section>
      </div>
    </DashboardLayout>
  );
}
