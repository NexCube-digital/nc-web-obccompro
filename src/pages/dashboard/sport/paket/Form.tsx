import { useEffect, useState, type FormEvent } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  LoaderCircle,
  Package,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type {
  PricingPackage,
  PricingPackageUpdateInput,
  SportType,
} from "../SportService";

type Props = {
  item: PricingPackage;
  onClose: () => void;
  onSave: (payload: PricingPackageUpdateInput) => Promise<void>;
};

const sports: SportType[] = [
  "futsal",
  "badminton",
  "basketball",
  "volleyball",
  "pickleball",
  "tennis",
  "billiard",
  "swimming",
  "event",
  "other",
];
const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[11px] font-semibold text-obc-charcoal";

export default function PaketForm({ item, onClose, onSave }: Props) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [sportType, setSportType] = useState<SportType | "">(
    item.sportType ?? "",
  );
  const [durationHours, setDurationHours] = useState(
    String(item.durationMinutes / 60),
  );
  const [packagePrice, setPackagePrice] = useState(String(item.packagePrice));
  const [discountPercent, setDiscountPercent] = useState(
    item.discountPercent == null ? "" : String(item.discountPercent),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        ...(sportType ? { sportType } : {}),
        durationMinutes: Math.round(Number(durationHours) * 60),
        packagePrice: Number(packagePrice),
        ...(discountPercent !== ""
          ? { discountPercent: Number(discountPercent) }
          : {}),
      });
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui paket durasi.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paket-form-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
              <Package size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">
                Katalog paket durasi
              </p>
              <h2
                id="paket-form-title"
                className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal"
              >
                {name || "Ubah paket durasi"}
              </h2>
              <p className="mt-0.5 text-[11px] text-obc-muted">
                Atur durasi, cakupan olahraga, dan harga paket.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            disabled={saving}
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </header>
        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <section>
            <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal">
              <Package size={15} className="text-obc-green" />
              Informasi paket
            </h3>
            <div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>
                Nama paket
                <input
                  className={inputClass}
                  minLength={3}
                  maxLength={255}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Deskripsi
                <textarea
                  className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 py-2.5 text-[13px] text-obc-charcoal outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]"
                  rows={3}
                  maxLength={1000}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
              <label className={labelClass}>
                Jenis olahraga
                <select
                  className={inputClass}
                  value={sportType}
                  onChange={(event) =>
                    setSportType(event.target.value as SportType | "")
                  }
                >
                  <option value="">Semua olahraga</option>
                  {sports.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Durasi paket (jam)
                <input
                  className={inputClass}
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={durationHours}
                  onChange={(event) => setDurationHours(event.target.value)}
                  required
                />
              </label>
            </div>
          </section>
          <section className="mt-6">
            <h3 className="flex items-center gap-2 font-heading text-[13px] font-semibold text-obc-charcoal">
              <SlidersHorizontal size={15} className="text-obc-green" />
              Harga dan promo
            </h3>
            <div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
              <label className={labelClass}>
                Harga paket (Rp)
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="1"
                  value={packagePrice}
                  onChange={(event) => setPackagePrice(event.target.value)}
                  required
                />
              </label>
              <label className={labelClass}>
                Diskon (%)
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={discountPercent}
                  onChange={(event) => setDiscountPercent(event.target.value)}
                />
              </label>
            </div>
          </section>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#F3F8E8] p-3 text-[11px] text-obc-muted">
            <CalendarDays size={15} className="shrink-0 text-obc-green" />
            <span>
              Durasi paket berlaku untuk sesi booking sesuai olahraga yang
              dipilih.
            </span>
          </div>
        </div>
        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-obc-border bg-[#FDFCF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[10px] text-obc-muted">
            Periksa durasi dan harga sebelum menyimpan.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="h-10 rounded-lg border border-obc-border bg-white px-4 text-[12px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CircleDollarSign size={15} />
                  Simpan perubahan
                </>
              )}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
