import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  BriefcaseBusiness,
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import ThemedSelect from "../../components/common/ThemedSelect";
import {
  getPortfolioImageUrl,
  portfolioService,
  type Portfolio,
  type PortfolioInput,
} from "./portfolioService";

type Props = {
  portfolio: Portfolio | null;
  onCancel: () => void;
  onSaved: () => void;
};

const inputClass =
  "mt-1.5 h-11 w-full rounded-lg border border-obc-border bg-white px-3.5 text-[13px] text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";
const PORTFOLIO_CATEGORIES = [
  "sports",
  "hospitality",
  "laundry",
  "foodCourt",
  "coffee",
  "agribusiness",
] as const;

export default function PortfolioForm({ portfolio, onCancel, onSaved }: Props) {
  const [title, setTitle] = useState(portfolio?.title ?? "");
  const [category, setCategory] = useState(portfolio?.category ?? "");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    getPortfolioImageUrl(portfolio?.imageUrl ?? null),
  );
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef<HTMLFormElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(saving);
  savingRef.current = saving;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    titleInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !savingRef.current) {
        onCancel();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input:not(:disabled):not([type=hidden]):not([tabindex='-1']), select:not(:disabled), [href], [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement?.isConnected) previousActiveElement.focus();
    };
  }, [onCancel]);

  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 10 MB.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category) {
      toast.error("Pilih kategori portfolio.");
      return;
    }
    const payload: PortfolioInput = {
      title: title.trim(),
      category: category.trim(),
    };
    setSaving(true);
    try {
      if (portfolio) {
        await portfolioService.updatePortfolio(
          portfolio.id,
          payload,
          image ?? undefined,
        );
        toast.success("Portfolio berhasil diperbarui.");
      } else {
        await portfolioService.createPortfolio(payload, image ?? undefined);
        toast.success("Portfolio berhasil ditambahkan.");
      }
      onSaved();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-obc-charcoal/65 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onCancel();
      }}
    >
      <form
        ref={dialogRef}
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-form-title"
        aria-describedby="portfolio-form-description"
        aria-busy={saving}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(24,28,24,0.3)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-obc-border bg-[#F8FAF4] px-5 py-5 sm:px-7">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-obc-green text-white shadow-sm">
              <BriefcaseBusiness size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-obc-olive">
                Portfolio / CMS
              </p>
              <h2
                id="portfolio-form-title"
                className="mt-0.5 truncate font-heading text-lg font-bold text-obc-charcoal"
              >
                {portfolio ? "Perbarui portfolio" : "Tambah portfolio"}
              </h2>
              <p
                id="portfolio-form-description"
                className="mt-0.5 text-[11px] text-obc-muted"
              >
                Lengkapi informasi proyek dan gambar utama.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            aria-label="Tutup form portfolio"
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition hover:bg-obc-hover-surface hover:text-obc-charcoal disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-5 p-5 sm:p-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
                Informasi proyek
              </p>
              <div className="mt-4 space-y-4">
                <label className={labelClass}>
                  Judul portfolio
                  <input
                    ref={titleInputRef}
                    className={inputClass}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={255}
                    placeholder="Contoh: Renovasi OBC Sport Center"
                    required
                  />
                </label>
                <label className={labelClass}>
                  Kategori
                  <ThemedSelect
                    label="Kategori portfolio"
                    value={category || "unselected"}
                    options={[
                      { value: "unselected", label: "Pilih kategori proyek" },
                      ...(category &&
                      !PORTFOLIO_CATEGORIES.includes(
                        category as (typeof PORTFOLIO_CATEGORIES)[number],
                      )
                        ? [{ value: category, label: category }]
                        : []),
                      ...PORTFOLIO_CATEGORIES.map((item) => ({
                        value: item,
                        label:
                          item === "foodCourt"
                            ? "Food Court"
                            : item === "agribusiness"
                              ? "Agribusiness"
                              : item.charAt(0).toUpperCase() + item.slice(1),
                      })),
                    ]}
                    onValueChange={(value) =>
                      setCategory(value === "unselected" ? "" : value)
                    }
                    className="mt-1.5 h-11 w-full rounded-lg text-[13px]"
                  />
                </label>
              </div>
            </div>
            <div className="rounded-xl border border-obc-border bg-[#FAFBF8] p-4">
              <p className="text-[11px] font-semibold text-obc-charcoal">
                Publikasi visual
              </p>
              <p className="mt-1 text-[11px] leading-5 text-obc-muted">
                Gambar ditampilkan sebagai sampul proyek. Gunakan foto lanskap
                yang tajam.
              </p>
              {image && (
                <p
                  className="mt-3 truncate text-[11px] font-medium text-obc-olive"
                  title={image.name}
                >
                  {image.name} · {(image.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              )}
              <p className="mt-3 text-[10px] text-obc-muted">
                JPG, PNG, atau WebP · Maksimal 10 MB
              </p>
            </div>
          </section>

          <section className="border-t border-obc-border bg-[#FCFCFA] p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
                  Preview sampul
                </p>
                <p className="mt-1 text-[11px] text-obc-muted">
                  Rasio tampilan 4:3
                </p>
              </div>
              {image && (
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(
                      getPortfolioImageUrl(portfolio?.imageUrl ?? null),
                    );
                  }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[11px] font-semibold text-obc-red transition hover:bg-[#FDE8E8]"
                >
                  <Trash2 size={13} />
                  Hapus gambar baru
                </button>
              )}
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-obc-border bg-[#E8ECE3] shadow-inner">
              {preview ? (
                <img
                  src={preview}
                  alt="Pratinjau sampul portfolio"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-[#737D67]">
                  <span className="grid size-14 place-items-center rounded-2xl bg-white/80 text-obc-olive shadow-sm">
                    <ImagePlus size={25} />
                  </span>
                  <p className="mt-3 font-heading text-[13px] font-semibold text-obc-charcoal">
                    Pilih gambar sampul
                  </p>
                  <p className="mt-1 max-w-xs text-[11px] leading-5">
                    Preview gambar akan tampil di area ini.
                  </p>
                </div>
              )}
              <label className="absolute inset-x-3 bottom-3 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 text-[12px] font-semibold text-obc-charcoal shadow-sm transition hover:bg-white">
                {preview ? (
                  <>
                    <ImagePlus size={15} />
                    Ganti gambar
                  </>
                ) : (
                  <>
                    <ImagePlus size={15} />
                    Pilih gambar
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  tabIndex={-1}
                  className="sr-only"
                />
              </label>
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-obc-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="h-10 rounded-lg border border-obc-border px-5 text-[12px] font-semibold text-obc-charcoal transition hover:bg-obc-hover-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={15} />
                {portfolio ? "Simpan perubahan" : "Tambah portfolio"}
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}
