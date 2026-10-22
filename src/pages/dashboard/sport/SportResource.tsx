import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { sportService, type SportResource } from "./SportService";

const resourceStatuses: SportResource["status"][] = ["active", "maintenance", "inactive"];
const statusLabels: Record<SportResource["status"], string> = { active: "Aktif", maintenance: "Pemeliharaan", inactive: "Nonaktif" };
const statusClasses: Record<SportResource["status"], string> = {
  active: "bg-[#E7F5D0] text-[#1F3320]",
  maintenance: "bg-[#FBF0D3] text-[#8A6100]",
  inactive: "bg-[#F1EFE8] text-obc-muted",
};
const weekdays: Record<string, string> = { mon: "Sen", tue: "Sel", wed: "Rab", thu: "Kam", fri: "Jum", sat: "Sab", sun: "Min" };

export default function SportResource() {
  const [resources, setResources] = useState<SportResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SportResource["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let cancelled = false;
    sportService.getResources({ page, limit: 10, ...(status === "all" ? {} : { status }), ...(search.trim() ? { search: search.trim() } : {}) })
      .then((result) => {
        if (!cancelled) {
          setResources(result.data);
          setTotal(result.meta.total);
          setTotalPages(result.meta.totalPages);
        }
      })
      .catch((error: unknown) => { if (!cancelled) toast.error(error instanceof Error ? error.message : "Gagal memuat resource."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, search, status]);

  const changeStatus = async (resource: SportResource, nextStatus: SportResource["status"]) => {
    try {
      await sportService.updateResourceStatus(resource.id, nextStatus);
      setResources((current) => current.map((item) => item.id === resource.id ? { ...item, status: nextStatus } : item));
      toast.success("Status resource diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui status resource.");
    }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5"><p className="text-[13px] text-obc-muted">OBC Sport / Resource</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Resource & lapangan</h1><p className="mt-1 text-[13px] text-obc-muted">Daftar lapangan dan fasilitas dari data operasional backend.</p></header>
        <section className="mb-4 rounded-xl border border-obc-border bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] text-obc-muted">{total.toLocaleString("id-ID")} resource ditemukan</p><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); setPage(1); }} placeholder="Cari nama atau deskripsi..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive sm:w-72" /></label><select aria-label="Filter status resource" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as SportResource["status"] | "all"); setPage(1); }} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]"><option value="all">Semua status</option>{resourceStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></div></div>
        </section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <div className="overflow-x-auto"><table className="w-full min-w-212.5 text-left text-[13px]"><thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3">Resource</th><th className="px-4 py-3">Olahraga</th><th className="px-4 py-3">Lokasi</th><th className="px-4 py-3">Operasional</th><th className="px-4 py-3">Status</th></tr></thead><tbody>
            {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Memuat resource...</td></tr> : resources.length ? resources.map((resource) => {
              const openDays = resource.schedules.filter((schedule) => !schedule.isClosed).map((schedule) => weekdays[schedule.dayOfWeek] ?? schedule.dayOfWeek);
              return <tr key={resource.id} className="border-t border-obc-border align-top"><td className="px-4 py-3"><p className="font-semibold text-obc-charcoal">{resource.name}</p><p className="text-[11px] capitalize text-obc-muted">{resource.resourceType} · kapasitas {resource.capacity} · slot {resource.slotMinutes} menit</p>{resource.description && <p className="mt-1 max-w-64 text-[11px] text-obc-muted">{resource.description}</p>}</td><td className="px-4 py-3 capitalize">{resource.sportTypes.join(", ")}</td><td className="px-4 py-3">{resource.location ? <><p>{resource.location.name}</p><p className="text-[11px] text-obc-muted">{resource.location.city}</p></> : "-"}</td><td className="px-4 py-3"><p>{openDays.length ? openDays.join(", ") : "Jadwal belum diatur"}</p>{resource.schedules.find((schedule) => !schedule.isClosed) && <p className="text-[11px] text-obc-muted">{resource.schedules.find((schedule) => !schedule.isClosed)?.openTime}–{resource.schedules.find((schedule) => !schedule.isClosed)?.closeTime}</p>}</td><td className="px-4 py-3"><select aria-label={`Status ${resource.name}`} value={resource.status} onChange={(event) => changeStatus(resource, event.target.value as SportResource["status"])} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${statusClasses[resource.status]}`}>{resourceStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></td></tr>;
            }) : <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Tidak ada resource yang cocok.</td></tr>}
          </tbody></table></div>
          <div className="flex items-center justify-between border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted"><span>Halaman {page} dari {Math.max(totalPages, 1)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>
        </section>
      </div>
    </DashboardLayout>
  );
}
