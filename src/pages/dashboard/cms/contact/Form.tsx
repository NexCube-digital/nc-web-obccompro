import { MapPin, MessageCircle } from "lucide-react";
import type { SiteContactContent } from "../../services/cms/siteContentService";

type Props = {
  contact: SiteContactContent;
  onChange: (contact: SiteContactContent) => void;
};

const labelClass = "block text-[12px] font-semibold text-obc-charcoal";
const inputClass =
  "mt-1.5 h-11 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] font-normal text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";

export default function Form({ contact, onChange }: Props) {
  return (
    <>
      <section className="overflow-hidden rounded-xl border border-obc-border bg-white">
        <div className="flex items-start gap-3 border-b border-obc-border px-4 py-4 sm:px-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]">
            <MessageCircle size={18} />
          </span>
          <div>
            <h2 className="font-heading text-[15px] font-semibold">
              Kanal kontak
            </h2>
            <p className="mt-0.5 text-[12px] text-obc-muted">
              Kanal kontak utama untuk kebutuhan pengunjung.
            </p>
          </div>
        </div>
        <div className="grid gap-x-5 gap-y-4 p-4 sm:grid-cols-2 sm:p-5">
          <label className={labelClass}>
            Email resmi
            <input
              required
              type="email"
              autoComplete="email"
              value={contact.email}
              onChange={(event) =>
                onChange({ ...contact, email: event.target.value })
              }
              placeholder="nama@domain.com"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            WhatsApp utama
            <input
              required
              type="tel"
              autoComplete="tel"
              value={contact.whatsapp}
              onChange={(event) =>
                onChange({ ...contact, whatsapp: event.target.value })
              }
              placeholder="https://wa.me/628... atau 628..."
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Instagram
            <input
              required
              value={contact.instagram}
              onChange={(event) =>
                onChange({ ...contact, instagram: event.target.value })
              }
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            TikTok
            <input
              required
              value={contact.tiktok}
              onChange={(event) =>
                onChange({ ...contact, tiktok: event.target.value })
              }
              placeholder="https://tiktok.com/@..."
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Alamat utama
            <input
              required
              value={contact.address}
              onChange={(event) =>
                onChange({ ...contact, address: event.target.value })
              }
              placeholder="Alamat kantor atau unit utama"
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Tautan Google Maps
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
              />
              <input
                required
                type="url"
                value={contact.maps}
                onChange={(event) =>
                  onChange({ ...contact, maps: event.target.value })
                }
                placeholder="https://maps.google.com/..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </label>
        </div>
      </section>
    </>
  );
}
