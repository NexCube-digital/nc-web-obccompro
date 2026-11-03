import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import { getMediaUrl } from "../../cms/media/mediaService";
import type { CourtResource, CourtResourceUpdateInput } from "./courtService";

type Props = {
  resource: CourtResource;
  onClose: () => void;
  onSave: (input: CourtResourceUpdateInput, image?: File) => Promise<void>;
};

const sports = ["futsal", "badminton", "basketball", "volleyball", "pickleball", "tennis", "billiard", "swimming", "sepakbola", "event", "other"];
const facilityOptions = [
  { value: "parkir_luas", label: "Parkir luas" },
  { value: "musholla", label: "Musholla" },
  { value: "shower", label: "Shower" },
  { value: "loker", label: "Loker" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "foodcourt", label: "Food court" },
];

export default function CourtResourceForm({ resource, onClose, onSave }: Props) {
  const [name, setName] = useState(resource.name);
  const [description, setDescription] = useState(resource.description ?? "");
  const [sportTypes, setSportTypes] = useState(resource.sportTypes);
  const [capacity, setCapacity] = useState(resource.capacity);
  const [slotMinutes, setSlotMinutes] = useState(resource.slotMinutes);
  const [amenities, setAmenities] = useState(resource.amenities);
  const [customFacilities, setCustomFacilities] = useState(() => resource.amenities
    .filter((value) => !facilityOptions.some((facility) => facility.value === value))
    .map((value) => ({ value, label: value.replace(/[_-]/g, " ") })));
  const [newFacility, setNewFacility] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(resource.imageUrl ?? "");
  const [preview, setPreview] = useState(resource.imageUrl ? getMediaUrl(resource.imageUrl) : "");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const facilities = [...facilityOptions, ...customFacilities];

  const addFacility = () => {
    const label = newFacility.trim().replace(/\s+/g, " ");
    const normalized = label.toLowerCase().replace(/[\s_-]/g, "");
    if (!label || facilities.some((facility) => facility.label.toLowerCase().replace(/[\s_-]/g, "") === normalized || facility.value.toLowerCase().replace(/[\s_-]/g, "") === normalized)) return;

    setCustomFacilities((current) => [...current, { value: label, label }]);
    setAmenities((current) => [...current, label]);
    setNewFacility("");
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sportTypes.length === 0) return;

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
        sportTypes,
        capacity,
        amenities,
        slotMinutes,
        ...(image ? {} : { imageUrl: imageUrl || null }),
      }, image ?? undefined);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div><p className="text-[12px] text-obc-muted">Perbarui data lapangan</p><h2 className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{resource.name}</h2></div>
          <button type="button" aria-label="Tutup" onClick={onClose} disabled={saving} className="rounded-lg border border-obc-border p-2 text-obc-muted hover:text-obc-charcoal"><X size={17} /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-[13px] font-medium text-obc-charcoal">Nama lapangan<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal outline-none focus:border-obc-olive" /></label>
          <label className="text-[13px] font-medium text-obc-charcoal">Kapasitas<input required type="number" min={1} max={1000} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal outline-none focus:border-obc-olive" /></label>
          <label className="text-[13px] font-medium text-obc-charcoal">Durasi slot<select value={slotMinutes} onChange={(event) => setSlotMinutes(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 font-normal outline-none focus:border-obc-olive">{[30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} menit</option>)}</select></label>
          <label className="text-[13px] font-medium text-obc-charcoal sm:col-span-2">Deskripsi<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal outline-none focus:border-obc-olive" /></label>
          <fieldset className="sm:col-span-2">
            <legend className="text-[13px] font-medium text-obc-charcoal">Jenis olahraga</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sports.map((sport) => {
                const checked = sportTypes.includes(sport);
                return (
                  <label key={sport} className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[12px] capitalize transition-colors ${checked ? "border-obc-green bg-obc-ivory text-obc-charcoal" : "border-obc-border bg-white text-obc-muted hover:border-obc-green"}`}>
                    <input type="checkbox" checked={checked} onChange={(event) => setSportTypes((current) => event.target.checked ? [...current, sport] : current.filter((item) => item !== sport))} className="size-3.5 accent-obc-green" />
                    {sport === "sepakbola" ? "Sepak bola" : sport}
                  </label>
                );
              })}
            </div>
            {sportTypes.length === 0 && <p className="mt-1 text-[12px] text-red-600">Pilih minimal satu jenis olahraga.</p>}
          </fieldset>
          <fieldset className="sm:col-span-2">
            <legend className="text-[13px] font-medium text-obc-charcoal">Fasilitas</legend>
            <p className="mt-1 text-[12px] text-obc-muted">Pilih fasilitas yang tersedia di lapangan.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => {
                const checked = amenities.includes(facility.value);
                return (
                  <label key={facility.value} className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[12px] transition-colors ${checked ? "border-obc-green bg-obc-ivory text-obc-charcoal" : "border-obc-border bg-white text-obc-muted hover:border-obc-green"}`}>
                    <input type="checkbox" checked={checked} onChange={(event) => setAmenities((current) => event.target.checked ? [...current, facility.value] : current.filter((value) => value !== facility.value))} className="size-3.5 accent-obc-green" />
                    <span className="capitalize">{facility.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={newFacility}
                onChange={(event) => setNewFacility(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addFacility(); } }}
                placeholder="Contoh: Ruang tunggu"
                aria-label="Nama fasilitas baru"
                className="h-10 min-w-0 flex-1 rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none transition-colors placeholder:text-obc-muted focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
              />
              <button type="button" onClick={addFacility} disabled={!newFacility.trim()} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-medium text-white transition-colors hover:bg-obc-green-hover disabled:cursor-not-allowed disabled:opacity-50">
                <Plus size={15} />Tambah
              </button>
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <span className="text-[13px] font-medium text-obc-charcoal">Gambar lapangan</span>
            <div className="mt-1 flex flex-wrap items-center gap-3 rounded-lg border border-obc-border p-3">
              {preview && <img src={preview} alt="Pratinjau gambar lapangan" className="size-16 rounded-lg object-cover" />}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-border px-3 text-[13px]"><ImagePlus size={16} />Pilih gambar</button>
              {preview && <button type="button" onClick={() => { setImage(null); setImageUrl(""); setPreview(""); }} className="text-[13px] text-red-600">Hapus gambar</button>}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setImage(file); setImageUrl(""); setPreview(file ? URL.createObjectURL(file) : ""); }} />
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-obc-border pt-4">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px]">Batal</button>
          <button type="submit" disabled={saving || sportTypes.length === 0} className="h-10 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>
        </div>
      </form>
    </div>
  );
}

export type CourtResourceDetails = CourtResource;
