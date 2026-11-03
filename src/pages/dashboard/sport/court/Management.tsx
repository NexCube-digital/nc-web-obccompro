import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { getMediaUrl, mediaService } from "../../cms/media/mediaService";
import { courtService, type CourtResource, type CourtResourceUpdateInput } from "./courtService";
import CourtResourceForm from "./Form";
import ResourceTable from "./Table";

export default function CourtManagement() {
  const [resources, setResources] = useState<CourtResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedResource, setSelectedResource] = useState<CourtResource | null>(null);
  const [editorResource, setEditorResource] = useState<CourtResource | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    courtService.getResources()
      .then((items) => { if (active) setResources(items); })
      .catch((error: unknown) => {
        if (active) toast.error(error instanceof Error ? error.message : "Data resource lapangan gagal dimuat.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);

  const saveResource = async (input: CourtResourceUpdateInput, image?: File) => {
    if (!editorResource) return;
    try {
      const saved = await courtService.updateResource(editorResource.id, input);
      if (image) {
        const media = await mediaService.uploadMedia(image, editorResource.tenant.id);
        await courtService.updateResource(saved.id, { ...input, imageUrl: media.url });
      }
      setReload((current) => current + 1);
      toast.success("Data lapangan berhasil diperbarui.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui data lapangan.");
      throw error;
    }
  };

  const filtered = resources.filter((resource) =>
    `${resource.name} ${resource.description ?? ""} ${resource.sportTypes.join(" ")}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="px-3 py-5 sm:px-6 sm:py-6">
        <header className="mb-5">
          <p className="text-[13px] text-obc-muted">OBC Sport / Daftar Lapangan</p>
          <h1 className="mt-1 font-heading text-[26px] font-bold text-obc-charcoal">Daftar Lapangan</h1>
          <p className="mt-1 text-[13px] text-obc-muted">Tampilan data langsung dari API `/api/v1/sports/resources`.</p>
        </header>
        <section className="mb-4 rounded-xl border border-obc-border bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-obc-muted">{filtered.length.toLocaleString("id-ID")} resource ditemukan</p>
            <label className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari resource atau olahraga..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive sm:w-72" />
            </label>
          </div>
        </section>
        <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
          <ResourceTable resources={filtered} loading={loading} onView={setSelectedResource} onEdit={setEditorResource} />
        </section>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedResource(null); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="court-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
              <div className="flex items-start justify-between border-b border-obc-border px-5 py-4">
                <div><p className="text-[12px] text-obc-muted">Detail lapangan</p><h2 id="court-detail-title" className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{selectedResource.name}</h2></div>
                <button type="button" aria-label="Tutup modal" onClick={() => setSelectedResource(null)} className="rounded-lg border border-obc-border px-3 py-1.5 text-[13px]">Tutup</button>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-[220px_1fr]">
                {selectedResource.imageUrl ? <img src={getMediaUrl(selectedResource.imageUrl)} alt={selectedResource.name} className="aspect-square w-full rounded-lg object-cover" /> : <div className="grid aspect-square place-items-center rounded-lg bg-obc-ivory text-obc-muted">Tidak ada gambar</div>}
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                  <div><dt className="text-obc-muted">Jenis</dt><dd className="font-medium capitalize">{selectedResource.resourceType}</dd></div>
                  <div><dt className="text-obc-muted">Olahraga</dt><dd className="font-medium capitalize">{selectedResource.sportTypes.join(", ") || "-"}</dd></div>
                  <div><dt className="text-obc-muted">Kapasitas</dt><dd className="font-medium">{selectedResource.capacity} orang</dd></div>
                  <div><dt className="text-obc-muted">Durasi slot</dt><dd className="font-medium">{selectedResource.slotMinutes} menit</dd></div>
                  <div><dt className="text-obc-muted">Lokasi</dt><dd className="font-medium">{selectedResource.location?.name ?? "-"}</dd></div>
                  <div><dt className="text-obc-muted">Harga mulai</dt><dd className="font-medium">{selectedResource.fromPriceFormatted ?? "Belum ada tarif"}</dd></div>
                  <div className="col-span-2"><dt className="text-obc-muted">Deskripsi</dt><dd className="mt-1 leading-5">{selectedResource.description || "Tidak ada deskripsi"}</dd></div>
                  {selectedResource.location?.address && <div className="col-span-2"><dt className="text-obc-muted">Alamat</dt><dd className="mt-1">{selectedResource.location.address}</dd></div>}
                </dl>
              </div>
            </section>
          </div>
        )}
        {editorResource && <CourtResourceForm resource={editorResource} onClose={() => setEditorResource(null)} onSave={saveResource} />}
      </div>
    </DashboardLayout>
  );
}
