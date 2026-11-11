import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgePercent,
  CalendarClock,
  ImagePlus,
  LoaderCircle,
  Save,
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getMediaUrl, mediaService } from "../../v2/media/mediaService";
import type {
  Promo,
  PromoDiscountType,
  PromoInput,
  PromoSport,
  PromoStatus,
} from "../../services/sport/promoService";

type Props = {
  item: Promo | null;
  onClose: () => void;
  onSave: (payload: Partial<PromoInput>) => Promise<void>;
};

const sports: PromoSport[] = [
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
  "mt-1 h-11 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] text-obc-charcoal outline-none transition focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[11px] font-semibold text-obc-charcoal";
const toLocalDateTime = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export default function PromoForm({ item, onClose, onSave }: Props) {
  const [code, setCode] = useState(item?.code ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [discountType, setDiscountType] = useState<PromoDiscountType>(
    item?.discountType ?? "percentage",
  );
  const [discountValue, setDiscountValue] = useState(
    String(item?.discountValue ?? ""),
  );
  const [maxDiscount, setMaxDiscount] = useState(
    item?.maxDiscount == null ? "" : String(item.maxDiscount),
  );
  const [minOrderAmount, setMinOrderAmount] = useState(
    String(item?.minOrderAmount ?? 0),
  );
  const [startDate, setStartDate] = useState(toLocalDateTime(item?.startDate));
  const [endDate, setEndDate] = useState(toLocalDateTime(item?.endDate));
  const [quota, setQuota] = useState(
    item?.quota == null ? "" : String(item.quota),
  );
  const [applicableSports, setApplicableSports] = useState<PromoSport[]>(
    item?.applicableSports ?? [],
  );
  const [bannerUrl, setBannerUrl] = useState(item?.bannerUrl ?? "");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState(item?.bannerUrl ?? "");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [terms, setTerms] = useState(
    Array.isArray(item?.termsConditions)
      ? item.termsConditions.join("\n")
      : item?.termsConditions ?? "",
  );
  const [status, setStatus] = useState<PromoStatus>(item?.status ?? "active");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bannerFile) return;
    const previewUrl = URL.createObjectURL(bannerFile);
    setBannerPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [bannerFile]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (discountType === "percentage" && Number(discountValue) > 100) {
      toast.error("Diskon persentase maksimal 100%.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("Tanggal berakhir harus setelah tanggal mulai.");
      return;
    }
    setSaving(true);
    try {
      let savedBannerUrl = bannerUrl.trim() || null;
      if (bannerFile) {
        setUploadingBanner(true);
        const uploadedMedia = await mediaService.uploadMedia(
          bannerFile,
          item?.tenantId ?? undefined,
        );
        savedBannerUrl = uploadedMedia.url;
        setBannerUrl(uploadedMedia.url);
        setBannerFile(null);
        setBannerPreview(uploadedMedia.url);
      }
      await onSave({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || null,
        discountType,
        discountValue: Number(discountValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        minOrderAmount: Number(minOrderAmount || 0),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        quota: quota ? Number(quota) : null,
        applicableSports: applicableSports.length ? applicableSports : null,
        bannerUrl: savedBannerUrl,
        termsConditions: terms
          .split("\n")
          .map((term) => term.trim())
          .filter(Boolean),
        status,
      });
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan promo.",
      );
    } finally {
      setUploadingBanner(false);
      setSaving(false);
    }
  };

  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-obc-border bg-white shadow-[0_2px_16px_rgba(31,51,32,0.05)]">
      <form
        onSubmit={submit}
        aria-labelledby="promo-form-title"
        className="flex flex-col"
      >
        <header className="flex items-start justify-between gap-4 bg-[#1F3320] px-5 py-5 text-white sm:px-7">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-[#CDF178] text-[#1F3320]">
              <BadgePercent size={21} />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#CDF178]">
                Promo engine
              </p>
              <h2
                id="promo-form-title"
                className="mt-1 font-heading text-xl font-bold"
              >
                {item ? "Edit promo" : "Buat promo baru"}
              </h2>
              <p className="mt-0.5 text-[11px] text-[#D8E5D2]">
                Atur penawaran yang akan dipakai saat checkout.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/25 px-3 text-[12px] font-semibold text-white/90 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft size={15} />
            Kembali
          </button>
        </header>
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          <div className="mb-5 grid gap-4 border-b border-obc-border pb-5 sm:grid-cols-2">
            <label className={labelClass}>
              Gambar banner promo
              <input
                className="mt-1 block w-full text-[12px] text-obc-muted file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-[#E7F5D0] file:px-4 file:text-[12px] file:font-semibold file:text-[#1F3320]"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setBannerFile(event.target.files?.[0] ?? null)
                }
              />
            </label>
            {bannerPreview && (
              <div className="relative overflow-hidden rounded-lg border border-obc-border bg-[#FDFCF7] sm:col-span-2">
                <img
                  src={getMediaUrl(bannerPreview)}
                  alt={`Banner ${name || "promo"}`}
                  className="aspect-[16/7] w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 via-transparent to-transparent p-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white">
                    <ImagePlus size={14} />
                    Pratinjau banner
                  </span>
                  <button
                    type="button"
                    aria-label="Hapus banner promo"
                    title="Hapus banner"
                    onClick={() => {
                      setBannerFile(null);
                      setBannerUrl("");
                      setBannerPreview("");
                    }}
                    className="grid size-8 place-items-center rounded-lg bg-white/90 text-obc-charcoal hover:bg-white"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <section className="space-y-4">
              <div>
                <h3 className="flex items-center gap-2 font-heading text-[13px] font-bold text-obc-charcoal">
                  <Tag size={15} className="text-obc-green" />
                  Identitas promo
                </h3>
                <div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
                  <label className={`${labelClass} sm:col-span-2`}>
                    Nama promo
                    <input
                      className={inputClass}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      minLength={3}
                      maxLength={255}
                      required
                      placeholder="Weekend Court Sale"
                    />
                  </label>
                  <label className={labelClass}>
                    Kode promo
                    <input
                      className={`${inputClass} font-mono uppercase tracking-wider`}
                      value={code}
                      onChange={(event) =>
                        setCode(event.target.value.toUpperCase())
                      }
                      minLength={3}
                      maxLength={50}
                      pattern="[A-Z0-9_-]+"
                      required
                      placeholder="WEEKEND20"
                    />
                  </label>
                  <label className={labelClass}>
                    Status
                    <select
                      className={inputClass}
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as PromoStatus)
                      }
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </label>
                  <label className={`${labelClass} sm:col-span-2`}>
                    Deskripsi
                    <textarea
                      className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 py-2.5 text-[13px] outline-none focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
                      rows={3}
                      maxLength={2000}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      placeholder="Jelaskan benefit promo untuk customer."
                    />
                  </label>
                </div>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-heading text-[13px] font-bold text-obc-charcoal">
                  <BadgePercent size={15} className="text-obc-green" />
                  Aturan potongan
                </h3>
                <div className="mt-3 grid gap-4 border-t border-obc-border pt-4 sm:grid-cols-2">
                  <label className={labelClass}>
                    Tipe diskon
                    <select
                      className={inputClass}
                      value={discountType}
                      onChange={(event) =>
                        setDiscountType(event.target.value as PromoDiscountType)
                      }
                    >
                      <option value="percentage">Persentase (%)</option>
                      <option value="fixed">Nominal tetap (Rp)</option>
                    </select>
                  </label>
                  <label className={labelClass}>
                    Nilai diskon
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      max={discountType === "percentage" ? 100 : undefined}
                      value={discountValue}
                      onChange={(event) => setDiscountValue(event.target.value)}
                      required
                    />
                  </label>
                  <label className={labelClass}>
                    Maksimal potongan (Rp)
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      value={maxDiscount}
                      onChange={(event) => setMaxDiscount(event.target.value)}
                      placeholder="Opsional"
                    />
                  </label>
                  <label className={labelClass}>
                    Minimal order (Rp)
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      value={minOrderAmount}
                      onChange={(event) =>
                        setMinOrderAmount(event.target.value)
                      }
                    />
                  </label>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div>
                <h3 className="flex items-center gap-2 font-heading text-[13px] font-bold text-obc-charcoal">
                  <CalendarClock size={15} className="text-obc-green" />
                  Masa berlaku & kuota
                </h3>
                <div className="mt-3 grid gap-4 border-t border-obc-border pt-4">
                  <label className={labelClass}>
                    Mulai
                    <input
                      className={inputClass}
                      type="datetime-local"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      required
                    />
                  </label>
                  <label className={labelClass}>
                    Berakhir
                    <input
                      className={inputClass}
                      type="datetime-local"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      required
                    />
                  </label>
                  <label className={labelClass}>
                    Kuota penggunaan
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      value={quota}
                      onChange={(event) => setQuota(event.target.value)}
                      placeholder="Tanpa batas"
                    />
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-heading text-[13px] font-bold text-obc-charcoal">
                  Cakupan olahraga
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-obc-border pt-4 sm:grid-cols-3">
                  {sports.map((sport) => (
                    <label
                      key={sport}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] capitalize transition-colors ${applicableSports.includes(sport) ? "border-[#9AAD3E] bg-[#F3F8E8] font-semibold text-obc-green" : "border-obc-border text-obc-muted hover:bg-[#FDFCF7]"}`}
                    >
                      <input
                        type="checkbox"
                        checked={applicableSports.includes(sport)}
                        onChange={(event) =>
                          setApplicableSports((current) =>
                            event.target.checked
                              ? [...current, sport]
                              : current.filter((value) => value !== sport),
                          )
                        }
                        className="accent-obc-green"
                      />
                      {sport}
                    </label>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="mt-5 grid gap-4 border-t border-obc-border pt-5 sm:grid-cols-2">
            <label className={labelClass}>
              Syarat & ketentuan
              <textarea
                className="mt-1 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 py-2.5 text-[13px] outline-none focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]"
                rows={2}
                value={terms}
                onChange={(event) => setTerms(event.target.value)}
                placeholder="Satu syarat per baris"
              />
            </label>
          </div>
        </div>
        <footer className="flex flex-col-reverse gap-2 border-t border-obc-border bg-[#FDFCF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-[10px] text-obc-muted">
            Promo tersimpan akan langsung mengikuti status dan tanggal aktifnya.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="h-10 rounded-lg border border-obc-border bg-white px-4 text-[12px] font-medium text-obc-charcoal hover:bg-obc-ivory"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}{" "}
              {saving
                ? uploadingBanner
                  ? "Mengunggah gambar..."
                  : "Menyimpan..."
                : item
                  ? "Simpan perubahan"
                  : "Terbitkan promo"}
            </button>
          </div>
        </footer>
      </form>
    </section>
  );
}
