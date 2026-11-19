import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedValue } from "../../components/hooks/useDebouncedValue";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Pagination from "../../components/common/Pagination";
import { getMediaUrl } from "../media/mediaService";
import { mediaService } from "../media/mediaService";
import { unitbisnisService } from "../../services/cms/unitbisnisService";
import { sportService, type SportResource, type SportResourceInput } from "../../services/sport/SportService";
import ResourceForm, { type LocationOption } from "./ResourceForm";
import ResourceTable from "./Table";

const resourceStatuses: SportResource["status"][] = ["active", "maintenance", "inactive"];
const statusLabels: Record<SportResource["status"], string> = { active: "Aktif", maintenance: "Pemeliharaan", inactive: "Nonaktif" };

export default function SportResource() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [status, setStatus] = useState<SportResource["status"] | "all">("all");
  const [page, setPage] = useState(1);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorResource, setEditorResource] = useState<SportResource | null>(null);
  const [selectedResource, setSelectedResource] = useState<SportResource | null>(null);
  const resourcesQuery = useQuery({
    queryKey: ["v2-sport-resources", page, status, debouncedSearch],
    queryFn: () => sportService.getResources({
      page,
      limit: 10,
      ...(status === "all" ? {} : { status }),
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    }),
  });
  const resources = resourcesQuery.data?.data ?? [];
  const total = resourcesQuery.data?.meta.total ?? 0;
  const totalPages = resourcesQuery.data?.meta.totalPages ?? 1;
  const loading = resourcesQuery.isPending;
  const tenantQuery = useQuery({
    queryKey: ["v2-sport-tenant-locations"],
    queryFn: async () => {
      const units = await unitbisnisService.getUnits();
      const sportUnit = units.find((unit) => unit.slug === "obc-sport") ?? units.find((unit) => unit.tenantType === "sport");
      if (!sportUnit) return { id: "", locations: [] as LocationOption[] };
      const detail = await unitbisnisService.getUnit(sportUnit.slug);
      return {
        id: sportUnit.id,
        locations: detail.locations.map((location) => ({ id: location.id, name: location.name })),
      };
    },
  });
  const tenantId = tenantQuery.data?.id ?? "";
  const locations = tenantQuery.data?.locations ?? [];

  useEffect(() => {
    if (resourcesQuery.error) {
      toast.error(resourcesQuery.error instanceof Error ? resourcesQuery.error.message : "Gagal memuat resource.");
    }
    if (tenantQuery.error) {
      toast.error(tenantQuery.error instanceof Error ? tenantQuery.error.message : "Gagal memuat tenant olahraga.");
    }
  }, [resourcesQuery.error, tenantQuery.error]);

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
      void queryClient.invalidateQueries({ queryKey: ["v2-sport-resources"] });
      toast.success(editorResource ? "Resource berhasil diperbarui." : "Resource berhasil ditambahkan.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menyimpan resource."); throw error; }
  };

  const deleteResource = async (resource: SportResource) => {
    if (!window.confirm(`Hapus resource ${resource.name}?`)) return;
    try { await sportService.deleteResource(resource.id); void queryClient.invalidateQueries({ queryKey: ["v2-sport-resources"] }); toast.success("Resource dipindahkan ke Sampah."); } catch (error) { toast.error(error instanceof Error ? error.message : "Gagal menghapus resource."); }
  };

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5 flex items-start justify-between gap-3"><div><p className="text-[13px] text-obc-muted">OBC Sport / Resource</p><h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Resource & lapangan</h1><p className="mt-1 text-[13px] text-obc-muted">Kelola data, gambar, jadwal, dan status lapangan dari backend.</p></div><button type="button" onClick={() => { setEditorResource(null); setEditorOpen(true); }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white"><Plus size={16}/>Tambah resource</button></header>
        <section className="mb-4 rounded-xl border border-obc-border bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] text-obc-muted">{total.toLocaleString("id-ID")} resource ditemukan</p><div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Cari nama atau deskripsi..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive sm:w-72" /></label><select aria-label="Filter status resource" value={status} onChange={(event) => { setStatus(event.target.value as SportResource["status"] | "all"); setPage(1); }} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px]"><option value="all">Semua status</option>{resourceStatuses.map((item) => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></div></div>
        </section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <ResourceTable resources={resources} loading={loading} onView={setSelectedResource} onEdit={(resource) => { setEditorResource(resource); setEditorOpen(true); }} onDelete={deleteResource}/>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} pageSize={10} itemLabel="resource" disabled={loading} />
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
