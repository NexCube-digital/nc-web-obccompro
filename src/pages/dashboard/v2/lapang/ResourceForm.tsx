import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { getMediaUrl } from "../media/mediaService";
import type { SportResource, SportResourceInput, SportType } from "../../sport/SportService";

export type LocationOption = { id: string; name: string };
type Props = { resource: SportResource | null; locations: LocationOption[]; onClose: () => void; onSave: (input: SportResourceInput, image?: File) => Promise<void> };
const sports: SportType[] = ["futsal", "badminton", "basketball", "volleyball", "pickleball", "tennis", "billiard", "swimming", "event", "other"];
const types: SportResource["resourceType"][] = ["court", "hall", "field", "room"];
const statuses: SportResource["status"][] = ["active", "maintenance", "inactive"];

export default function ResourceForm({ resource, locations, onClose, onSave }: Props) {
  const [name, setName] = useState(resource?.name ?? "");
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const [description, setDescription] = useState(resource?.description ?? "");
  const [resourceType, setResourceType] = useState(resource?.resourceType ?? "court");
  const [sportTypes, setSportTypes] = useState<SportType[]>(resource?.sportTypes ?? ["futsal"]);
  const [capacity, setCapacity] = useState(resource?.capacity ?? 10);
  const [slotMinutes, setSlotMinutes] = useState(resource?.slotMinutes ?? 60);
  const [locationId, setLocationId] = useState(resource?.location?.id ?? "");
  const [status, setStatus] = useState(resource?.status ?? "active");
  const [amenities, setAmenities] = useState(Array.isArray(resource?.amenities) ? resource.amenities.join("\n") : "");
  const existingImage = typeof resource?.imageUrl === "string" ? resource.imageUrl : "";
  const [imageUrl, setImageUrl] = useState(existingImage);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(existingImage ? getMediaUrl(existingImage) : "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, slug, description: description || null, imageUrl: image ? null : imageUrl || null, resourceType, sportTypes, capacity, amenities: amenities.split("\n").map((item) => item.trim()).filter(Boolean), slotMinutes, ...(locationId ? { locationId } : {}), status }, image ?? undefined);
      onClose();
    } finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5"><div className="mb-5 flex justify-between"><h2 className="font-heading text-xl font-semibold">{resource ? "Edit resource" : "Tambah resource"}</h2><button type="button" aria-label="Tutup" onClick={onClose}><X size={18}/></button></div><div className="grid gap-4 sm:grid-cols-2">
    <label className="text-[13px] font-medium">Nama<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal"/></label>
    <label className="text-[13px] font-medium">Slug<input required pattern="[a-z0-9-]+" value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase())} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal"/></label>
    <label className="text-[13px] font-medium sm:col-span-2">Deskripsi<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal"/></label>
    <label className="text-[13px] font-medium">Jenis resource<select value={resourceType} onChange={(event) => setResourceType(event.target.value as SportResource["resourceType"])} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal">{types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
    <label className="text-[13px] font-medium">Lokasi<select value={locationId} onChange={(event) => setLocationId(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal"><option value="">Tanpa lokasi</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label>
    <fieldset className="sm:col-span-2"><legend className="text-[13px] font-medium">Jenis olahraga</legend><div className="mt-2 flex flex-wrap gap-2">{sports.map((sport) => <label key={sport} className="inline-flex items-center gap-2 rounded-lg border border-obc-border px-3 py-2 text-[12px] capitalize"><input type="checkbox" checked={sportTypes.includes(sport)} onChange={(event) => setSportTypes((current) => event.target.checked ? [...current, sport] : current.filter((item) => item !== sport))}/>{sport}</label>)}</div></fieldset>
    <label className="text-[13px] font-medium">Kapasitas<input required type="number" min={1} max={1000} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal"/></label>
    <label className="text-[13px] font-medium">Durasi slot<select value={slotMinutes} onChange={(event) => setSlotMinutes(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal">{[30,45,60,90,120].map((minutes) => <option key={minutes} value={minutes}>{minutes} menit</option>)}</select></label>
    <label className="text-[13px] font-medium sm:col-span-2">Fasilitas (satu per baris)<textarea rows={3} value={amenities} onChange={(event) => setAmenities(event.target.value)} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal"/></label>
    <div className="sm:col-span-2"><span className="text-[13px] font-medium">Gambar resource</span><div className="mt-1 flex items-center gap-3 rounded-lg border border-obc-border p-3">{preview && <img src={preview} alt="Pratinjau resource" className="size-16 rounded-lg object-cover"/>}<button type="button" onClick={() => inputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-border px-3 text-[13px]"><ImagePlus size={16}/>Pilih gambar</button>{preview && <button type="button" onClick={() => { setImage(null); setPreview(""); setImageUrl(""); }} className="text-[13px] text-red-600">Hapus</button>}<input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setImage(file); setPreview(file ? URL.createObjectURL(file) : existingImage ? getMediaUrl(existingImage) : ""); }}/></div></div>
    <label className="text-[13px] font-medium">Status<select value={status} onChange={(event) => setStatus(event.target.value as SportResource["status"])} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
  </div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-obc-border px-4 text-[13px]">Batal</button><button type="submit" disabled={saving} className="h-10 rounded-lg bg-[#1F3320] px-4 text-[13px] text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan"}</button></div></form></div>;
}
