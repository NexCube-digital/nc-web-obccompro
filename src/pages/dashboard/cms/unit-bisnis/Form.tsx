import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Building2,
  ImagePlus,
  LoaderCircle,
  Save,
  X,
} from "lucide-react";
import ThemedSelect from "../../components/common/ThemedSelect";
import { mediaService, getMediaUrl } from "../../v2/media/mediaService";
import {
  unitbisnisService,
  type BusinessUnit,
  type BusinessUnitInput,
} from "../../services/cms/unitbisnisService";
import BusinessUnitEditorFields from "./UnitEditorFields";

type Props = {
  unit: BusinessUnit | null;
  onClose: () => void;
  onSubmit: (input: BusinessUnitInput) => Promise<BusinessUnit>;
};

const EMPTY_UNIT: BusinessUnitInput = {
  name: "",
  slug: "",
  description: null,
  tenantType: "other",
  config: {},
  picName: null,
  picWhatsapp: null,
  status: "active",
};

function getConfigString(
  config: Record<string, unknown> | undefined,
  key: string,
): string {
  return typeof config?.[key] === "string" ? config[key] : "";
}

function BusinessUnitImagePanel({
  imagePreview,
  imageFile,
  onImageChange,
  onRemoveImage,
}: {
  imagePreview: string;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  onRemoveImage: () => void;
}) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const removeImage = () => {
    onRemoveImage();
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <section>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
            Media utama
          </p>
          <h3 className="mt-0.5 font-heading text-[14px] font-semibold text-obc-charcoal">
            Gambar kartu
          </h3>
        </div>
        {(imageFile || imagePreview) && (
          <button
            type="button"
            onClick={removeImage}
            className="text-[10px] font-semibold text-obc-red hover:underline"
          >
            Hapus
          </button>
        )}
      </div>
      <div className="relative mt-3 aspect-4/3 overflow-hidden rounded-lg border border-obc-border bg-[#E8ECE3]">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Pratinjau gambar kartu"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#737D67]">
            <span className="grid size-11 place-items-center rounded-lg bg-white/80 text-obc-olive shadow-sm">
              <ImagePlus size={20} />
            </span>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide">
              Belum ada gambar
            </p>
          </div>
        )}
        <label className="absolute inset-x-2.5 bottom-2.5 flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 text-[11px] font-semibold text-obc-charcoal shadow-sm transition hover:bg-white">
          <ImagePlus size={14} />
          {imageFile || imagePreview ? "Ganti gambar" : "Pilih gambar"}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="sr-only"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onImageChange(event.target.files?.[0] ?? null)
            }
          />
        </label>
      </div>
      <p className="mt-2 text-[10px] leading-4 text-obc-muted">
        JPG, PNG, WebP, atau SVG. Gunakan gambar lanskap untuk hasil terbaik.
      </p>
    </section>
  );
}

export default function BusinessUnitEditor({ unit, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<BusinessUnitInput>(() =>
    unit
      ? {
          name: unit.name,
          slug: unit.slug,
          description: unit.description,
          tenantType: unit.tenantType,
          config: unit.config ?? {},
          status: unit.status,
        }
      : EMPTY_UNIT,
  );
  const [title, setTitle] = useState(() =>
    getConfigString(unit?.config, "title"),
  );
  const [category, setCategory] = useState(() =>
    getConfigString(unit?.config, "category"),
  );
  const [tags, setTags] = useState(() =>
    Array.isArray(unit?.config?.tags)
      ? unit.config.tags
          .filter((tag): tag is string => typeof tag === "string")
          .join("\n")
      : "",
  );
  const [locationAddress, setLocationAddress] = useState(() =>
    getConfigString(unit?.config, "locationAddress"),
  );
  const [locationMapUrl, setLocationMapUrl] = useState(() =>
    getConfigString(unit?.config, "locationMapUrl"),
  );
  const [locationInfo, setLocationInfo] = useState(() =>
    Array.isArray(unit?.config?.locationInfo)
      ? unit.config.locationInfo
          .filter((info): info is string => typeof info === "string")
          .join("\n")
      : "",
  );
  const [picName, setPicName] = useState(unit?.picName ?? "");
  const [picWhatsapp, setPicWhatsapp] = useState(unit?.picWhatsapp ?? "");
  const [showOnSport, setShowOnSport] = useState(
    () => unit?.config?.showOnSport !== false,
  );
  const [showOnCompro, setShowOnCompro] = useState(
    () => unit?.config?.showOnCompro !== false,
  );
  const existingImageUrl = getConfigString(unit?.config, "imageUrl");
  const [imageUrl, setImageUrl] = useState(existingImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    existingImageUrl ? getMediaUrl(existingImageUrl) : "",
  );
  const [saving, setSaving] = useState(false);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setImagePreview(
      file ? URL.createObjectURL(file) : imageUrl ? getMediaUrl(imageUrl) : "",
    );
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const updateFormField = (
    field: "name" | "slug" | "description",
    value: string,
  ) => {
    if (field === "description") {
      setForm((current) => ({ ...current, description: value || null }));
      return;
    }
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const savedUnit = await onSubmit({
        ...form,
        config: {
          ...form.config,
          title: title.trim() || undefined,
          category: category.trim() || undefined,
          tags: tags
            .split("\n")
            .map((tag) => tag.trim())
            .filter(Boolean),
          imageUrl: imageFile ? undefined : imageUrl.trim() || undefined,
          locationAddress: locationAddress.trim() || undefined,
          locationMapUrl: locationMapUrl.trim() || undefined,
          locationInfo: locationInfo
            .split("\n")
            .map((info) => info.trim())
            .filter(Boolean),
          showOnSport,
          showOnCompro,
        },
        picName: picName.trim() || null,
        picWhatsapp: picWhatsapp.trim() || null,
      });
      if (imageFile) {
        const media = await mediaService.uploadMedia(imageFile, savedUnit.id);
        await unitbisnisService.updateUnit(savedUnit.id, {
          config: {
            ...form.config,
            title: title.trim() || undefined,
            category: category.trim() || undefined,
            tags: tags
              .split("\n")
              .map((tag) => tag.trim())
              .filter(Boolean),
            imageUrl: media.url,
            locationAddress: locationAddress.trim() || undefined,
            locationMapUrl: locationMapUrl.trim() || undefined,
            locationInfo: locationInfo
              .split("\n")
              .map((info) => info.trim())
              .filter(Boolean),
            showOnSport,
            showOnCompro,
          },
          picName: picName.trim() || null,
          picWhatsapp: picWhatsapp.trim() || null,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 grid place-items-center bg-[#172119]/65 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-unit-editor-title"
        aria-busy={saving}
        className="flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(24,28,24,0.3)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-obc-border bg-[#F8FAF4] px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-obc-green text-white">
              <Building2 size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-obc-olive">
                Unit bisnis
              </p>
              <h2
                id="business-unit-editor-title"
                className="mt-0.5 truncate font-heading text-lg font-bold text-obc-charcoal"
              >
                {unit ? "Edit unit bisnis" : "Tambah unit bisnis"}
              </h2>
              <p className="mt-0.5 text-[11px] text-obc-muted">
                Informasi publik, gambar, lokasi, dan status penayangan.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup editor unit bisnis"
            disabled={saving}
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_300px]">
          <BusinessUnitEditorFields
            form={form}
            title={title}
            category={category}
            tags={tags}
            locationAddress={locationAddress}
            locationMapUrl={locationMapUrl}
            locationInfo={locationInfo}
            picName={picName}
            picWhatsapp={picWhatsapp}
            onFormChange={updateFormField}
            onTitleChange={setTitle}
            onCategoryChange={setCategory}
            onTagsChange={setTags}
            onLocationAddressChange={setLocationAddress}
            onLocationMapUrlChange={setLocationMapUrl}
            onLocationInfoChange={setLocationInfo}
            onPicNameChange={setPicName}
            onPicWhatsappChange={setPicWhatsapp}
          />

          <aside className="space-y-5 border-t border-obc-border bg-[#F7F8F3] p-5 sm:p-7 lg:border-l lg:border-t-0">
            <BusinessUnitImagePanel
              imagePreview={imagePreview}
              imageFile={imageFile}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
            />

            <section className="border-t border-obc-border pt-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
                Penayangan
              </p>
              <label className="mt-3 block text-[11px] font-semibold text-obc-charcoal">
                Status
                <ThemedSelect
                  label="Status unit bisnis"
                  value={form.status}
                  options={[
                    { value: "active", label: "Aktif" },
                    { value: "inactive", label: "Nonaktif" },
                  ]}
                  onValueChange={(status) =>
                    setForm({
                      ...form,
                      status: status as BusinessUnitInput["status"],
                    })
                  }
                  className="mt-1.5 h-10 w-full text-[12px]"
                />
              </label>
              <fieldset className="mt-4">
                <legend className="text-[11px] font-semibold text-obc-charcoal">
                  Tampilkan unit di
                </legend>
                <div className="mt-2 grid gap-2">
                  <label
                    className={`flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-[11px] font-medium transition-colors ${showOnSport ? "border-obc-green bg-[#F3F8E8] text-obc-green" : "border-obc-border bg-white text-obc-muted"}`}
                  >
                    <input
                      type="checkbox"
                      checked={showOnSport}
                      onChange={(event) => setShowOnSport(event.target.checked)}
                      className="size-3.5 accent-obc-green"
                    />
                    Sport OBC
                  </label>
                  <label
                    className={`flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-[11px] font-medium transition-colors ${showOnCompro ? "border-obc-green bg-[#F3F8E8] text-obc-green" : "border-obc-border bg-white text-obc-muted"}`}
                  >
                    <input
                      type="checkbox"
                      checked={showOnCompro}
                      onChange={(event) =>
                        setShowOnCompro(event.target.checked)
                      }
                      className="size-3.5 accent-obc-green"
                    />
                    Compro OBC
                  </label>
                </div>
              </fieldset>
            </section>
          </aside>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-obc-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-lg border border-obc-border px-5 text-[12px] font-semibold text-obc-charcoal transition hover:bg-obc-ivory disabled:opacity-50"
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
                Simpan unit
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}
