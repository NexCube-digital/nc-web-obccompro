import { Building2, Eye, ImageOff, MapPin, Pencil } from "lucide-react";
import { getMediaUrl } from "../../v2/media/mediaService";
import { sportOptions, tableSportTypes, type CourtResource } from "../../services/sport/courtService";

interface Props {
  resources: CourtResource[];
  loading: boolean;
  onView: (resource: CourtResource) => void;
  onEdit: (resource: CourtResource) => void;
}

export default function ResourceTable({ resources, loading, onView, onEdit }: Props) {
  if (loading) {
    return <div className="px-5 py-12 text-center text-[13px] text-obc-muted">Memuat data lapang...</div>;
  }

  if (!resources.length) {
    return <div className="px-5 py-12 text-center text-[13px] text-obc-muted">Belum ada lapang.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-245 text-left text-[13px]">
        <thead>
          <tr className="border-b border-obc-border bg-[#F5F7F1] text-[10px] font-bold uppercase tracking-wider text-obc-muted">
            <th className="px-5 py-4">Foto</th>
            <th className="px-5 py-4">Informasi lapang</th>
            <th className="px-5 py-4">Olahraga</th>
            <th className="px-5 py-4">Lokasi</th>
            <th className="px-5 py-4">Harga mulai</th>
            <th className="px-5 py-4">Kapasitas</th>
            <th className="px-5 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => {
            const image = resource.imageUrl ?? resource.gallery?.[0];
            const hasTables = resource.sportTypes.some((sport) => tableSportTypes.includes(sport));
            return (
              <tr key={resource.id} className="border-t border-obc-border align-middle transition-colors hover:bg-[#F8FAF4]">
                <td className="px-5 py-4">
                  {image ? (
                    <img src={getMediaUrl(image)} alt={resource.name} loading="lazy" decoding="async" className="size-17 rounded-lg border border-obc-border bg-[#F1EFE8] object-cover shadow-sm" />
                  ) : (
                    <div className="grid size-17 place-items-center rounded-lg border border-obc-border bg-[#F1EFE8] text-obc-muted"><ImageOff size={20} /></div>
                  )}
                </td>
                <td className="max-w-80 px-5 py-4">
                  <p className="font-heading text-[14px] font-bold text-obc-charcoal">{resource.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-[#F1EFE8] px-2 py-1 text-[10px] font-semibold capitalize text-obc-charcoal">{resource.resourceType}</span>
                    <span className="text-[10px] text-obc-muted">Slot {resource.slotMinutes} menit</span>
                  </div>
                  {resource.description && <p className="mt-2 line-clamp-2 max-w-80 text-[11px] leading-4 text-obc-muted">{resource.description}</p>}
                </td>
                <td className="px-5 py-4">
                  <div className="flex max-w-52 flex-wrap gap-1.5">{resource.sportTypes.length ? resource.sportTypes.map((sport) => <span key={sport} className="rounded-md border border-[#DDE8D2] bg-[#F3F8E8] px-2 py-1 text-[10px] font-semibold text-[#1F3320]">{sportOptions.find((option) => option.value === sport)?.label ?? sport}</span>) : <span className="text-[11px] text-obc-muted">-</span>}</div>
                </td>
                <td className="px-5 py-4">
                  {resource.location ? <div className="flex min-w-32 items-start gap-2"><span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#F3F8E8] text-obc-green"><MapPin size={13} /></span><div><p className="font-semibold text-obc-charcoal">{resource.location.name}</p><p className="mt-0.5 text-[10px] text-obc-muted">{resource.location.city}</p></div></div> : <span className="text-[11px] text-obc-muted">Lokasi belum diatur</span>}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-heading text-[14px] font-bold text-obc-green">{resource.fromPriceFormatted ?? "Belum ada tarif"}</p>
                  {resource.fromPriceFormatted && <p className="mt-0.5 text-[10px] text-obc-muted">per jam</p>}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-lg border border-obc-border bg-white px-2.5 py-2"><Building2 size={14} className="text-obc-green" /><span className="font-semibold text-obc-charcoal">{hasTables ? `${resource.parallelUnits} meja` : `${resource.capacity} orang`}</span></span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" title="Lihat detail" aria-label={`Lihat detail ${resource.name}`} onClick={() => onView(resource)} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178]">
                      <Eye size={15} />
                    </button>
                    <button type="button" title="Edit lapangan" aria-label={`Edit ${resource.name}`} onClick={() => onEdit(resource)} className="grid size-9 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:border-obc-green hover:bg-[#F3F8E8] hover:text-obc-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178]">
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
