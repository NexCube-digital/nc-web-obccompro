import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { mediaService } from "../../cms/media/mediaService";
import { unitbisnisService } from "../../cms/unit-bisnis/unitbisnisService";
import { sportService, type SportResource, type SportResourceInput } from "../SportService";
import ResourceForm, { type LocationOption } from "./ResourceForm";
import ResourceTable from "./Table";

const resourceStatuses: SportResource["status"][] = ["active", "maintenance", "inactive"];
const statusLabels: Record<SportResource["status"], string> = { active: "Aktif", maintenance: "Pemeliharaan", inactive: "Nonaktif" };

export default function SportResource() {
  const [resources, setResources] = useState<SportResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SportResource["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tenantId, setTenantId] = useState("");
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorResource, setEditorResource] = useState<SportResource | null>(null);
  const [selectedResource, setSelectedResource] = useState<SportResource | null>(null);
  const [reload, setReload] = useState(0);

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
  }, [page, search, status, reload]);

  useEffect(() => {
    unitbisnisService.getUnits().then((units) => {
      const sportUnit = units.find((unit) => unit.slug === "obc-sport") ?? units.find((unit) => unit.tenantType === "sport");
      if (!sportUnit) return;
      setTenantId(sportUnit.id);
      unitbisnisService.getUnit(sportUnit.slug).then((detail) => setLocations(detail.locations.map((location) => ({ id: location.id, name: location.name }))));
    }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Gagal memuat tenant olahraga."));
  }, []);

  const saveResource = async (input: SportResourceInput, image?: File) => {
    if (!tenantId && !editorResource) throw new Error("Tenant OBC Sport Center belum ditemukan.");
    try {
      const saved = editorResource
        ? await sportService.updateResource(editorResource.id, input)
        : await sportService.createResource(tenantId, input);
      if (image) {
        const media = await mediaService.uploadMedia(image, saved.tenant.id);
        await sportService.updateResource(saved.id, { imageUrl: media.url });
      }
      setReload((value) => value + 1);
      toast.success(editorResource ? "Resource berhasil diperbarui." : "Resource berhasil ditambahkan.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menyimpan resource."); throw error; }
  };

  const deleteResource = async (resource: SportResource) => {
    if (!window.confirm(`Hapus resource ${resource.name}?`)) return;
    try { await sportService.deleteResource(resource.id); setReload((value) => value + 1); toast.success("Resource berhasil dinonaktifkan."); } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menghapus resource."); }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[13px] text-obc-muted">OBC Sport / Resource</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Resource & lapangan</h1><p className="mt-1 text-[13px] text-obc-muted">Kelola data, gambar, jadwal, dan status lapangan dari backend.</p></div><button type="button" onClick={() => { setEditorResource(null); setEditorOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white"><Plus size={16}/>Tambah resource</button></header>
        <section className="mb-4 rounded-xl border border-obc-border bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] text-obc-muted">{total.toLocaleString("id-ID")} resource ditemukan</p><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); setPage(1); }} placeholder="Cari nama atau deskripsi..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive sm:w-72" /></label><select aria-label="Filter status resource" value={status} onChange={(event) => { setLoading(true); setStatus(event.target.value as SportResource["status"] | "all"); setPage(1); }} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]"><option value="all">Semua status</option>{resourceStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></div></div>
        </section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <ResourceTable resources={resources} loading={loading} onView={setSelectedResource} onEdit={(resource) => { setEditorResource(resource); setEditorOpen(true); }} onDelete={deleteResource}/>
          <div className="flex items-center justify-between border-t border-obc-border px-4 py-3 text-[12px] text-obc-muted"><span>Halaman {page} dari {Math.max(totalPages, 1)}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Sebelumnya</button><button type="button" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }} className="rounded-lg border border-obc-border px-3 py-2 disabled:opacity-40">Berikutnya</button></div></div>
        </section>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedResource(null); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="resource-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="flex items-start justify-between border-b border-obc-border px-5 py-4">
                <div><p className="text-[12px] text-obc-muted">Detail resource</p><h2 id="resource-detail-title" className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{selectedResource.name}</h2></div>
                <button type="button" aria-label="Tutup modal" onClick={() => setSelectedResource(null)} className="rounded-lg border border-obc-border px-3 py-1.5 text-[13px]">Tutup</button>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-[220px_1fr]">
                {selectedResource.imageUrl ? <img src={getMediaUrl(selectedResource.imageUrl)} alt={selectedResource.name} className="aspect-square w-full rounded-lg object-cover" /> : <div className="grid aspect-square place-items-center rounded-lg bg-obc-ivory text-obc-muted">Tidak ada gambar</div>}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                  <div><dt className="text-obc-muted">Jenis</dt><dd className="font-medium capitalize">{selectedResource.resourceType}</dd></div>
                  <div><dt className="text-obc-muted">Status</dt><dd className="font-medium">{statusLabels[selectedResource.status]}</dd></div>
                  <div><dt className="text-obc-muted">Olahraga</dt><dd className="font-medium capitalize">{selectedResource.sportTypes.join(", ") || "-"}</dd></div>
                  <div><dt className="text-obc-muted">Kapasitas</dt><dd className="font-medium">{selectedResource.capacity} orang</dd></div>
                  <div><dt className="text-obc-muted">Durasi slot</dt><dd className="font-medium">{selectedResource.slotMinutes} menit</dd></div>
                  <div><dt className="text-obc-muted">Lokasi</dt><dd className="font-medium">{selectedResource.location?.name ?? "-"}</dd></div>
                  <div className="col-span-2"><dt className="text-obc-muted">Fasilitas</dt><dd className="mt-1">{selectedResource.amenities.length ? selectedResource.amenities.join(", ") : "Tidak ada fasilitas"}</dd></div>
                  <div className="col-span-2"><dt className="text-obc-muted">Deskripsi</dt><dd className="mt-1 leading-5">{selectedResource.description || "Tidak ada deskripsi"}</dd></div>
                  <div className="col-span-2"><dt className="text-obc-muted">Jadwal</dt><dd className="mt-1">{selectedResource.schedules.length ? selectedResource.schedules.map((schedule) => `${schedule.dayOfWeek}: ${schedule.isClosed ? "Tutup" : `${schedule.openTime} - ${schedule.closeTime}`}`).join(" · ") : "Belum ada jadwal"}</dd></div>
                </dl>
              </div>
            </section>
          </div>
        )}
        {editorOpen && <ResourceForm resource={editorResource} locations={locations} onClose={() => setEditorOpen(false)} onSave={saveResource}/>}
      </div>
    </DashboardLayout>
  );
}
