import { useEffect, useState } from "react";
import { Building2, CircleDollarSign, Clock3, ImageOff, MapPin, Pencil, Search, X } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getMediaUrl, mediaService } from "../../v2/media/mediaService";
import { courtService, sportOptions, tableSportTypes, type CourtResource, type CourtResourceUpdateInput } from "./courtService";
import CourtResourceForm from "./Form";
import ResourceTable from "./Table";

function ResourceDetailModal({ resource, onClose, onEdit }: { resource: CourtResource; onClose: () => void; onEdit: () => void }) {
  const images = Array.from(new Set([resource.imageUrl, ...(resource.gallery ?? [])].filter((image): image is string => Boolean(image))));
  const [activeImage, setActiveImage] = useState(0);
  const hasTables = resource.sportTypes.some((sport) => tableSportTypes.includes(sport));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#152016]/65 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="court-detail-title" className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between border-b border-obc-border bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="min-w-0 pr-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-obc-muted">Detail resource</p><h2 id="court-detail-title" className="mt-1 truncate font-heading text-xl font-bold text-obc-charcoal sm:text-2xl">{resource.name}</h2></div>
          <button type="button" aria-label="Tutup detail" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"><X size={17} /></button>
        </header>

        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0">
            <div className="relative grid aspect-16/10 place-items-center overflow-hidden rounded-lg bg-[#172119]">
              {images.length ? <img src={getMediaUrl(images[activeImage])} alt={`${resource.name} ${images.length > 1 ? `foto ${activeImage + 1}` : ""}`} className="h-full w-full object-contain" /> : <div className="flex flex-col items-center gap-2 text-white/60"><ImageOff size={28} /><span className="text-[12px]">Belum ada gambar resource</span></div>}
              {images.length > 1 && <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">{activeImage + 1} / {images.length}</span>}
            </div>
            {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{images.map((image, index) => <button key={image} type="button" onClick={() => setActiveImage(index)} aria-label={`Tampilkan foto ${index + 1}`} aria-pressed={activeImage === index} className={`size-17 shrink-0 overflow-hidden rounded-md border-2 ${activeImage === index ? "border-obc-green" : "border-transparent opacity-70 hover:opacity-100"}`}><img src={getMediaUrl(image)} alt="" className="h-full w-full object-cover" /></button>)}</div>}
            <div className="mt-4 flex flex-wrap gap-2">{resource.sportTypes.map((sport) => <span key={sport} className="rounded-md bg-[#E7F5D0] px-2.5 py-1 text-[11px] font-semibold text-[#1F3320]">{sportOptions.find((option) => option.value === sport)?.label ?? sport}</span>)}</div>
          </div>

          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-obc-muted">Informasi fasilitas</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#F5F7F1] p-3"><p className="text-[11px] text-obc-muted">{hasTables ? "Jumlah meja" : "Kapasitas"}</p><p className="mt-1 flex items-center gap-1.5 font-heading text-[17px] font-bold text-obc-charcoal"><Building2 size={16} />{hasTables ? `${resource.parallelUnits} meja` : `${resource.capacity} orang`}</p></div>
              <div className="rounded-lg bg-[#F5F7F1] p-3"><p className="text-[11px] text-obc-muted">Durasi slot</p><p className="mt-1 flex items-center gap-1.5 font-heading text-[17px] font-bold text-obc-charcoal"><Clock3 size={16} />{resource.slotMinutes} menit</p></div>
              <div className="col-span-2 rounded-lg bg-[#F5F7F1] p-3"><p className="text-[11px] text-obc-muted">Harga mulai</p><p className="mt-1 flex items-center gap-1.5 font-heading text-[17px] font-bold text-obc-charcoal"><CircleDollarSign size={17} />{resource.fromPriceFormatted ?? "Belum ada tarif"}</p></div>
            </div>
            <div className="mt-4 flex items-start gap-2 text-[13px] text-obc-charcoal"><MapPin size={16} className="mt-0.5 shrink-0 text-obc-green" /><div><p className="font-semibold">{resource.location?.name ?? "Lokasi belum diatur"}</p>{resource.location && <p className="mt-0.5 text-[12px] text-obc-muted">{resource.location.city}{resource.location.address ? ` · ${resource.location.address}` : ""}</p>}</div></div>
            <div className="mt-5 border-t border-obc-border pt-4"><h3 className="text-[12px] font-semibold uppercase tracking-wider text-obc-muted">Deskripsi</h3><p className="mt-2 whitespace-pre-line text-[13px] leading-6 text-obc-charcoal">{resource.description || "Belum ada deskripsi untuk resource ini."}</p></div>
            <div className="mt-5 border-t border-obc-border pt-4"><h3 className="text-[12px] font-semibold uppercase tracking-wider text-obc-muted">Fasilitas tersedia</h3><div className="mt-2 flex flex-wrap gap-2">{resource.amenities.length ? resource.amenities.map((amenity) => <span key={amenity} className="rounded-md border border-obc-border px-2.5 py-1 text-[11px] text-obc-charcoal">{amenity.replace(/[_-]/g, " ")}</span>) : <span className="text-[12px] text-obc-muted">Belum ada fasilitas tambahan.</span>}</div></div>
          </div>
        </div>
        <footer className="flex justify-end border-t border-obc-border px-5 py-4 sm:px-7"><button type="button" onClick={onEdit} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1F3320] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green"><Pencil size={15} />Perbarui resource</button></footer>
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
    <DashboardPageLayout
      breadcrumb={editorResource ? "Daftar Lapangan / Edit" : "Daftar Lapangan"}
      title={editorResource ? "Perbarui resource" : "Daftar Lapangan"}
      description={editorResource ? "Atur informasi, cabang olahraga, meja, dan fasilitas resource." : "Kelola resource olahraga dan informasi fasilitas."}
    >
      {editorResource ? (
        <CourtResourceForm resource={editorResource} onClose={() => setEditorResource(null)} onSave={saveResource} />
      ) : (
        <>
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
          {selectedResource && <ResourceDetailModal resource={selectedResource} onClose={() => setSelectedResource(null)} onEdit={() => { setSelectedResource(null); setEditorResource(selectedResource); }} />}
        </>
      )}
    </DashboardPageLayout>
  );
}
