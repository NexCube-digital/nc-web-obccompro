import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import ThemedSelect from "../../components/common/ThemedSelect";
import { getMediaUrl } from "../../v2/media/mediaService";
import { sportOptions, tableSportTypes, type CourtResource, type CourtResourceUpdateInput } from "./courtService";

type Props = {
  resource: CourtResource;
  onClose: () => void;
  onSave: (input: CourtResourceUpdateInput, image?: File) => Promise<void>;
};

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
  const [parallelUnits, setParallelUnits] = useState(resource.parallelUnits);
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
  const hasTableUnits = sportTypes.some((sport) => tableSportTypes.includes(sport));

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
        parallelUnits: hasTableUnits ? parallelUnits : 1,
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
    <section className="max-w-5xl">
      <form onSubmit={submit} className="space-y-4">
        <div className="mb-5 flex items-center justify-between">
          <div><p className="text-[12px] text-obc-muted">Perbarui data lapangan</p><h2 className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{resource.name}</h2></div>
          <button type="button" aria-label="Tutup" onClick={onClose} disabled={saving} className="rounded-lg border border-obc-border p-2 text-obc-muted hover:text-obc-charcoal"><X size={17} /></button>
        </div>
        <div className="grid gap-4 rounded-xl border border-obc-border bg-white p-4 sm:grid-cols-2 sm:p-5">
          <div className="grid gap-3 rounded-lg border border-obc-border bg-[#FDFCF7] p-3 sm:col-span-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
            <div className="relative aspect-[4/3] w-full max-w-[160px] overflow-hidden rounded-lg border border-obc-border bg-[#ECEFE7]">
              {preview ? <img src={preview} alt="Pratinjau gambar lapangan" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-obc-muted"><ImagePlus size={22} /></div>}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-obc-charcoal">Gambar lapangan</p>
              <p className="mt-1 text-[11px] leading-4 text-obc-muted">Gunakan foto lanskap yang jelas. Preview dibatasi agar form tetap ringkas.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-9 items-center gap-2 rounded-lg border border-obc-border bg-white px-3 text-[12px] font-medium text-obc-charcoal transition-colors hover:border-obc-green hover:bg-obc-ivory"><ImagePlus size={14} />{preview ? "Ganti gambar" : "Pilih gambar"}</button>
                {preview && <button type="button" onClick={() => { setImage(null); setImageUrl(""); setPreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-50"><X size={14} />Hapus</button>}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setImage(file); setImageUrl(""); setPreview(file ? URL.createObjectURL(file) : ""); }} />
              </div>
            </div>
          </div>
          <label className="text-[13px] font-medium text-obc-charcoal sm:col-span-2">Nama lapangan<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal outline-none focus:border-obc-olive" /></label>
          <label className="text-[13px] font-medium text-obc-charcoal">Kapasitas<input required type="number" min={1} max={1000} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal outline-none focus:border-obc-olive" /></label>
          <label className="text-[13px] font-medium text-obc-charcoal">Durasi slot (jam)
            <ThemedSelect
              label="Durasi slot dalam jam"
              value={String(slotMinutes)}
              options={[60, 120].map((minutes) => ({ value: String(minutes), label: `${minutes / 60} jam` }))}
              onValueChange={(value) => setSlotMinutes(Number(value))}
              className="mt-1 h-10 w-full"
            />
          </label>
          <label className="text-[13px] font-medium text-obc-charcoal sm:col-span-2">Deskripsi<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal outline-none focus:border-obc-olive" /></label>
          <fieldset className="sm:col-span-2">
            <legend className="text-[13px] font-medium text-obc-charcoal">Jenis olahraga</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {sportOptions.map(({ value: sport, label }) => {
                const checked = sportTypes.includes(sport);
                return (
                  <label key={sport} className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[12px] capitalize transition-colors ${checked ? "border-obc-green bg-obc-ivory text-obc-charcoal" : "border-obc-border bg-white text-obc-muted hover:border-obc-green"}`}>
                    <input type="checkbox" checked={checked} onChange={(event) => setSportTypes((current) => event.target.checked ? [...current, sport] : current.filter((item) => item !== sport))} className="size-3.5 accent-obc-green" />
                    {label}
                  </label>
                );
              })}
            </div>
            {sportTypes.length === 0 && <p className="mt-1 text-[12px] text-red-600">Pilih minimal satu jenis olahraga.</p>}
            {hasTableUnits && <div className="mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-3 sm:max-w-sm">
              <label className="block text-[12px] font-medium text-obc-charcoal">Jumlah meja
                <input required type="number" min={1} max={100} value={parallelUnits} onChange={(event) => setParallelUnits(Number(event.target.value))} className="mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-green" />
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5" aria-label={`${parallelUnits} meja dapat dipesan paralel`}>
                {Array.from({ length: Math.min(parallelUnits, 20) }, (_, index) => <span key={index} className="rounded-md bg-[#E7F5D0] px-2 py-1 text-[11px] font-medium text-[#1F3320]">Meja {index + 1}</span>)}
                {parallelUnits > 20 && <span className="px-1 py-1 text-[11px] text-obc-muted">+{parallelUnits - 20} meja</span>}
              </div>
            </div>}
          </fieldset>
          <fieldset className="sm:col-span-2">
            <legend className="text-[13px] font-medium text-obc-charcoal">Fasilitas</legend>
            <p className="mt-1 text-[12px] text-obc-muted">Pilih fasilitas yang tersedia di lapangan.</p>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
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
        </div>
        <div className="flex justify-end gap-2 border-t border-obc-border pt-4">
          <button type="button" onClick={onClose} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px]">Batal</button>
          <button type="submit" disabled={saving || sportTypes.length === 0} className="h-10 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>
        </div>
      </form>
    </section>
  );
}

export type CourtResourceDetails = CourtResource;
