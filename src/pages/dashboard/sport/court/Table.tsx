import { Building2, Eye, ImageOff, MapPin, Pencil } from "lucide-react";
import { getMediaUrl } from "../../cms/media/mediaService";
import type { CourtResource } from "./courtService";

interface Props {
  resources: CourtResource[];
  loading: boolean;
  onView: (resource: CourtResource) => void;
  onEdit: (resource: CourtResource) => void;
}

export default function ResourceTable({ resources, loading, onView, onEdit }: Props) {
  if (loading) {
    return <div className="px-5 py-12 text-center text-[13px] text-obc-muted">Memuat resource lapangan...</div>;
  }

  if (!resources.length) {
    return <div className="px-5 py-12 text-center text-[13px] text-obc-muted">Belum ada resource lapangan.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-245 text-left text-[13px]">
        <thead>
          <tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
            <th className="px-4 py-3">Gambar</th>
            <th className="px-4 py-3">Resource</th>
            <th className="px-4 py-3">Jenis Olahraga</th>
            <th className="px-4 py-3">Lokasi</th>
            <th className="px-4 py-3">Harga Mulai</th>
            <th className="px-4 py-3">Kapasitas</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => {
            const image = resource.imageUrl ?? resource.gallery?.[0];
            return (
              <tr key={resource.id} className="border-t border-obc-border align-top">
                <td className="px-4 py-3">
                  {image ? (
                    <img src={getMediaUrl(image)} alt={resource.name} className="size-14 rounded-lg border border-obc-border object-cover" />
                  ) : (
                    <div className="grid size-14 place-items-center rounded-lg bg-obc-ivory text-obc-muted"><ImageOff size={18} /></div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-obc-charcoal">{resource.name}</p>
                  <p className="mt-0.5 text-[11px] text-obc-muted">{resource.resourceType} · slot {resource.slotMinutes} menit</p>
                  {resource.description && <p className="mt-1 max-w-90 text-[11px] leading-4 text-obc-muted">{resource.description}</p>}
                </td>
                <td className="px-4 py-3 capitalize">{resource.sportTypes.join(", ") || "-"}</td>
                <td className="px-4 py-3">
                  {resource.location ? <><p className="flex items-center gap-1"><MapPin size={13} />{resource.location.name}</p><p className="mt-1 text-[11px] text-obc-muted">{resource.location.city}</p></> : <span className="text-obc-muted">-</span>}
                </td>
                <td className="px-4 py-3 font-semibold text-obc-charcoal">{resource.fromPriceFormatted ?? "Belum ada tarif"}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1"><Building2 size={14} />{resource.capacity} orang</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button type="button" title="Lihat detail" aria-label={`Lihat detail ${resource.name}`} onClick={() => onView(resource)} className="rounded-lg border border-obc-border p-2 text-obc-muted hover:border-obc-olive hover:text-obc-charcoal">
                      <Eye size={15} />
                    </button>
                    <button type="button" title="Edit lapangan" aria-label={`Edit ${resource.name}`} onClick={() => onEdit(resource)} className="rounded-lg border border-obc-border p-2 text-obc-muted hover:border-obc-olive hover:text-obc-charcoal">
                      <Pencil size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
