import { useEffect, useState, type FormEvent } from "react";
import {
  AtSign,
  Camera,
  CheckCircle2,
  LoaderCircle,
  Mail,
  MessageCircle,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import whatsappIcon from "../../../../assets/icon/whatsapp2.svg";
import { siteContentService, type SiteContactContent } from "./siteContentService";
import Form from "./Form";

const EMPTY_CONTACT: SiteContactContent = {
  section: "site-contact",
  email: "",
  whatsapp: "",
  instagram: "",
  tiktok: "",
  address: "",
  maps: "",
};

export default function SiteContactManagement() {
  const [contact, setContact] = useState<SiteContactContent>(EMPTY_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    siteContentService.getContact()
      .then((contactData) => {
        if (!active) return;
        setContact(contactData);
      })
      .catch((error) => {
        if (active)
          toast.error(`Gagal memuat data: ${getApiErrorMessage(error)}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await siteContentService.saveContact(contact);
      toast.success("Kontak berhasil disimpan.");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  const channelCount = [
    contact.email,
    contact.whatsapp,
    contact.instagram,
    contact.tiktok,
  ].filter(Boolean).length;

  return (
    <DashboardPageLayout
      breadcrumb="Kontak Situs"
      title="Kontak Situs"
      description="Kelola kanal kontak yang ditampilkan pada website OBC."
    >
      <form onSubmit={save} className="mx-auto max-w-6xl space-y-5 pb-6">
        <section className="overflow-hidden rounded-xl border border-[#263C29] bg-[#1F3320] text-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#CDF178] text-[#1F3320]">
                <MessageCircle size={22} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#CDF178]">
                  Website OBC · Informasi publik
                </p>
                <h2 className="mt-1 font-heading text-xl font-bold sm:text-2xl">
                  Kontak yang selalu mudah ditemukan
                </h2>
                <p className="mt-1 max-w-xl text-[13px] leading-5 text-white/75">
                  {loading
                    ? "Memuat konfigurasi website..."
                    : "Data ini digunakan pada footer website OBC."}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3">
              <span className="grid size-9 place-items-center rounded-lg bg-white/10">
                <CheckCircle2 size={18} className="text-[#CDF178]" />
              </span>
              <div>
                <p className="text-[11px] text-white/65">Kanal terisi</p>
                <p className="font-heading text-lg font-bold">
                  {channelCount}{" "}
                  <span className="text-[12px] font-medium text-white/65">
                    / 4
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
            {[
              { icon: <Mail size={15} />, label: "Email", ready: Boolean(contact.email) },
              {
                icon: <img src={whatsappIcon} alt="" aria-hidden="true" className="size-4 object-contain" />,
                label: "WhatsApp utama",
                ready: Boolean(contact.whatsapp),
              },
              {
                icon: <Camera size={15} />,
                label: "Instagram",
                ready: Boolean(contact.instagram),
              },
              { icon: <AtSign size={15} />, label: "TikTok", ready: Boolean(contact.tiktok) },
            ].map(({ icon, label, ready }, index) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 px-4 py-3 ${index % 2 === 1 ? "border-l border-white/10" : ""} ${index >= 2 ? "border-t border-white/10" : ""} ${index > 0 ? "sm:border-l" : ""} sm:border-t-0`}
              >
                <span className={ready ? "text-[#CDF178]" : "text-white/40"}>{icon}</span>
                <span className="truncate text-[11px] text-white/75">
                  {label}
                </span>
                <span
                  className={`ml-auto size-1.5 shrink-0 rounded-full ${ready ? "bg-[#CDF178]" : "bg-white/25"}`}
                />
              </div>
            ))}
          </div>
        </section>

        <Form contact={contact} onChange={setContact} />

        <div className="mt-5 flex flex-col gap-3 border-t border-obc-border pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <span className="text-[12px] text-obc-muted">
              Perubahan akan tampil setelah disimpan.
          </span>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex h-11 w-full min-w-48 items-center justify-center gap-2 rounded-xl bg-[#1F3320] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(31,51,32,0.18)] transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-obc-green hover:shadow-[0_7px_18px_rgba(31,51,32,0.2)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178] focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none sm:w-auto"
            >
              {saving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Menyimpan..." : "Simpan perubahan"}
            </button>
        </div>
      </form>
    </DashboardPageLayout>
  );
}
