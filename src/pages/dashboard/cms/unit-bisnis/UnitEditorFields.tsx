import { WhatsAppLogo } from "../../../../components/ui/WhatsAppIcon";
import type { BusinessUnitInput } from "../../services/cms/unitbisnisService";

type EditableField = "name" | "slug" | "description";

type Props = {
  form: BusinessUnitInput;
  title: string;
  category: string;
  tags: string;
  locationAddress: string;
  locationMapUrl: string;
  locationInfo: string;
  picName: string;
  picWhatsapp: string;
  onFormChange: (field: EditableField, value: string) => void;
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onLocationAddressChange: (value: string) => void;
  onLocationMapUrlChange: (value: string) => void;
  onLocationInfoChange: (value: string) => void;
  onPicNameChange: (value: string) => void;
  onPicWhatsappChange: (value: string) => void;
};

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] font-normal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";

export default function BusinessUnitEditorFields({
  form,
  title,
  category,
  tags,
  locationAddress,
  locationMapUrl,
  locationInfo,
  picName,
  picWhatsapp,
  onFormChange,
  onTitleChange,
  onCategoryChange,
  onTagsChange,
  onLocationAddressChange,
  onLocationMapUrlChange,
  onLocationInfoChange,
  onPicNameChange,
  onPicWhatsappChange,
}: Props) {
  return (
    <div className="space-y-5 p-5 sm:p-7">
      <section>
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
            Informasi utama
          </p>
          <h3 className="mt-0.5 font-heading text-[14px] font-semibold text-obc-charcoal">
            Identitas unit bisnis
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-semibold text-obc-charcoal">
            Nama unit
            <input
              required
              value={form.name}
              onChange={(event) => onFormChange("name", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal">
            Slug
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={form.slug}
              onChange={(event) => onFormChange("slug", event.target.value.toLowerCase())}
              className={`${inputClass} font-mono text-[12px]`}
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal sm:col-span-2">
            Deskripsi
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(event) => onFormChange("description", event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-obc-border bg-white p-3 text-[13px] font-normal leading-5 outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60"
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal">
            Judul kartu
            <input
              required
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="OBC Villa"
              className={inputClass}
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal">
            Kategori kartu
            <input
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              placeholder="Hospitality & Accommodation"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="border-t border-obc-border pt-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
            Kontak layanan
          </p>
          <h3 className="mt-0.5 flex items-center gap-2 font-heading text-[14px] font-semibold text-obc-charcoal">
            <span className="grid size-6 place-items-center rounded-full bg-[#25D366]">
              <WhatsAppLogo className="size-4" />
            </span>
            PIC WhatsApp
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-semibold text-obc-charcoal">
            Nama PIC
            <input
              value={picName}
              onChange={(event) => onPicNameChange(event.target.value)}
              maxLength={100}
              placeholder="Nama penanggung jawab"
              className={inputClass}
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal">
            Nomor WhatsApp
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={picWhatsapp}
              onChange={(event) => onPicWhatsappChange(event.target.value.replace(/\D/g, ""))}
              maxLength={30}
              placeholder="6281234567890"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="hidden border-t border-obc-border pt-5">
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-obc-muted">
            Informasi publik
          </p>
          <h3 className="mt-0.5 font-heading text-[14px] font-semibold text-obc-charcoal">
            Lokasi dan konten
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-semibold text-obc-charcoal sm:col-span-2">
            Tag <span className="font-normal text-obc-muted">(satu per baris)</span>
            <textarea
              rows={3}
              value={tags}
              onChange={(event) => onTagsChange(event.target.value)}
              placeholder="Accommodation\nCiumbuleuit\nCheck-in 14.00 WIB"
              className="mt-1.5 w-full rounded-lg border border-obc-border bg-white p-3 text-[12px] font-normal leading-5 outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60"
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal sm:col-span-2">
            Alamat lokasi
            <input
              value={locationAddress}
              onChange={(event) => onLocationAddressChange(event.target.value)}
              placeholder="Jl. Rancabentang No. 10, Bandung"
              className={inputClass}
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal sm:col-span-2">
            Link Google Maps
            <input
              type="url"
              value={locationMapUrl}
              onChange={(event) => onLocationMapUrlChange(event.target.value)}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </label>
          <label className="block text-[12px] font-semibold text-obc-charcoal sm:col-span-2">
            Informasi lokasi <span className="font-normal text-obc-muted">(satu per baris)</span>
            <textarea
              rows={3}
              value={locationInfo}
              onChange={(event) => onLocationInfoChange(event.target.value)}
              placeholder="Check-in 14.00 WIB\nCheck-out 12.00 WIB"
              className="mt-1.5 w-full rounded-lg border border-obc-border bg-white p-3 text-[12px] font-normal leading-5 outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
