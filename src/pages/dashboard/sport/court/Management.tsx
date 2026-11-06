import { useEffect, useState } from "react";
import { Building2, CircleDollarSign, Clock3, ImageOff, MapPin, Pencil, Search, X } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getMediaUrl, mediaService } from "../../v2/media/mediaService";
import { courtService, sportOptions, tableSportTypes, type CourtResource, type CourtResourceUpdateInput } from "./courtService";
import CourtResourceForm from "./Form";
import ResourceTable from "./Table";

function ResourceDetailModal({ resource, onClose, onEdit }: { resource: CourtResource; onClose: () => void; onEdit: () => void }) {
  const image = resource.imageUrl ?? resource.gallery?.[0] ?? null;
  const hasTables = resource.sportTypes.some((sport) => tableSportTypes.includes(sport));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#152016]/65 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="court-detail-title" className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-obc-border bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-obc-border bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="min-w-0 pr-4"><p className="text-[10px] font-bold uppercase tracking-widest text-obc-green">Detail lapang</p><h2 id="court-detail-title" className="mt-1 truncate font-heading text-xl font-bold text-obc-charcoal sm:text-2xl">{resource.name}</h2><p className="mt-1 text-[12px] text-obc-muted">{resource.location?.name ?? "Lokasi belum diatur"}{resource.location?.city ? ` · ${resource.location.city}` : ""}</p></div>
          <button type="button" aria-label="Tutup detail" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"><X size={18} /></button>
        </header>

        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="min-w-0 border-b border-obc-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="relative grid aspect-16/10 place-items-center overflow-hidden rounded-lg bg-[#F1EFE8]">
              {image ? <img src={getMediaUrl(image)} alt={resource.name} fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : <div className="flex flex-col items-center gap-2 text-obc-muted"><ImageOff size={30} /><span className="text-[12px]">Belum ada gambar lapang</span></div>}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-[10px] font-semibold uppercase tracking-wider text-obc-muted">Jenis olahraga</p><div className="mt-2 flex flex-wrap gap-2">{resource.sportTypes.map((sport) => <span key={sport} className="rounded-md bg-[#E7F5D0] px-2.5 py-1.5 text-[11px] font-semibold text-[#1F3320]">{sportOptions.find((option) => option.value === sport)?.label ?? sport}</span>)}</div></div>
              <span className="rounded-md border border-obc-border bg-[#FDFCF7] px-2.5 py-1.5 text-[11px] font-medium capitalize text-obc-muted">{resource.resourceType}</span>
            </div>
            <section className="mt-6 border-t border-obc-border pt-5">
              <h3 className="font-heading text-[13px] font-semibold text-obc-charcoal">Tentang lapang</h3>
              <p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-obc-muted">{resource.description || "Belum ada deskripsi untuk lapang ini."}</p>
            </section>
          </div>

          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-obc-green">Ringkasan</p><h3 className="mt-1 font-heading text-[16px] font-bold text-obc-charcoal">Informasi fasilitas</h3></div><Building2 size={18} className="text-obc-green" /></div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-obc-border bg-[#FDFCF7] p-3"><p className="text-[10px] text-obc-muted">{hasTables ? "Jumlah meja" : "Kapasitas"}</p><p className="mt-1 font-heading text-[18px] font-bold text-obc-charcoal">{hasTables ? `${resource.parallelUnits} meja` : `${resource.capacity} orang`}</p></div>
              <div className="rounded-lg border border-obc-border bg-[#FDFCF7] p-3"><p className="text-[10px] text-obc-muted">Durasi slot</p><p className="mt-1 flex items-center gap-1.5 font-heading text-[18px] font-bold text-obc-charcoal"><Clock3 size={15} className="text-obc-green" />{resource.slotMinutes} menit</p></div>
              <div className="col-span-2 rounded-lg bg-[#1F3320] p-4 text-white"><p className="text-[10px] font-medium text-white/70">Harga mulai</p><p className="mt-1 flex items-center gap-2 font-heading text-[20px] font-bold"><CircleDollarSign size={18} className="text-[#CDF178]" />{resource.fromPriceFormatted ?? "Belum ada tarif"}</p></div>
            </div>
            <section className="mt-5 border-t border-obc-border pt-4">
              <h3 className="flex items-center gap-2 text-[12px] font-semibold text-obc-charcoal"><MapPin size={15} className="text-obc-green" />Lokasi</h3>
              <p className="mt-2 text-[13px] font-semibold text-obc-charcoal">{resource.location?.name ?? "Lokasi belum diatur"}</p>
              {resource.location && <p className="mt-0.5 text-[11px] leading-5 text-obc-muted">{resource.location.city}{resource.location.address ? ` · ${resource.location.address}` : ""}</p>}
            </section>
            <section className="mt-5 border-t border-obc-border pt-4">
              <h3 className="text-[12px] font-semibold text-obc-charcoal">Fasilitas tersedia</h3>
              <div className="mt-2 flex flex-wrap gap-2">{resource.amenities.length ? resource.amenities.map((amenity) => <span key={amenity} className="rounded-md border border-obc-border bg-white px-2.5 py-1.5 text-[11px] text-obc-charcoal">{amenity.replace(/[_-]/g, " ")}</span>) : <span className="text-[11px] text-obc-muted">Belum ada fasilitas tambahan.</span>}</div>
            </section>
          </div>
        </div>
        <footer className="sticky bottom-0 flex justify-end border-t border-obc-border bg-white/95 px-5 py-4 backdrop-blur sm:px-7"><button type="button" onClick={onEdit} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1F3320] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green"><Pencil size={15} />Perbarui lapang</button></footer>
      </section>
    </div>
  );
}

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
        if (active) toast.error(error instanceof Error ? error.message : "Data lapang gagal dimuat.");
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
    <DashboardPageLayout
      breadcrumb={editorResource ? "Daftar Lapangan / Edit" : "Daftar Lapangan"}
      title={editorResource ? "Perbarui lapang" : "Daftar Lapangan"}
      description={editorResource ? "Atur informasi, cabang olahraga, meja, dan fasilitas lapang." : "Kelola lapang olahraga dan informasi fasilitas."}
    >
      {editorResource ? (
        <CourtResourceForm resource={editorResource} onClose={() => setEditorResource(null)} onSave={saveResource} />
      ) : (
        <>
          <section className="mb-4 rounded-xl border border-obc-border bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-obc-muted">{filtered.length.toLocaleString("id-ID")} lapang ditemukan</p>
              <label className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari lapang atau olahraga..." className="h-10 w-full rounded-lg border border-obc-border pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive sm:w-72" />
              </label>
            </div>
          </section>
          <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
            <ResourceTable resources={filtered} loading={loading} onView={setSelectedResource} onEdit={setEditorResource} />
          </section>
          {selectedResource && <ResourceDetailModal resource={selectedResource} onClose={() => setSelectedResource(null)} onEdit={() => { setSelectedResource(null); setEditorResource(selectedResource); }} />}
        </>
      )}
    </DashboardPageLayout>
  );
}
