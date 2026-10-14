import { useState, type ReactNode } from "react";
import {
  Camera,
  Check,
  Globe,
  KeyRound,
  Laptop,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  User,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../components/layouts/Sidebar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

/* ───────────── Helper ───────────── */
const cardCls =
  "rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]";

const inputCls =
  "h-11 w-full rounded-xl border border-obc-border bg-obc-ivory px-3.5 font-body text-[14px] text-obc-charcoal placeholder:text-obc-muted outline-none transition-colors focus:border-obc-green focus:bg-white focus:ring-2 focus:ring-[#CDF178]";

const btnPrimary =
  "flex h-10 items-center justify-center gap-2 rounded-xl bg-obc-green px-4 font-heading text-[13px] font-medium text-white transition-colors hover:bg-obc-green-hover";

const btnOutline =
  "flex h-10 items-center justify-center gap-2 rounded-xl border border-obc-border bg-white px-4 font-heading text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-hover-surface";

/* ───────────── Data contoh (ganti dengan data API) ───────────── */
const tabs = ["Profil", "Keamanan"] as const;
type Tab = (typeof tabs)[number];

type Sesi = {
  id: number;
  perangkat: string;
  lokasi: string;
  waktu: string;
  aktif?: boolean;
  icon: LucideIcon;
};

const sesiAwal: Sesi[] = [
  { id: 1, perangkat: "MacBook Pro · Chrome", lokasi: "Bandung, ID", waktu: "Aktif sekarang", aktif: true, icon: Laptop },
  { id: 2, perangkat: "iPhone 15 · Safari", lokasi: "Bandung, ID", waktu: "2 jam lalu", icon: Smartphone },
  { id: 3, perangkat: "Windows PC · Edge", lokasi: "Jakarta, ID", waktu: "3 hari lalu", icon: Globe },
];

/* ───────────── Komponen kecil ───────────── */
function CardTitle({
  title,
  sub,
  aside,
}: {
  title: string;
  sub?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{title}</h2>
        {aside}
      </div>
      {sub && <p className="mt-1 font-body text-[13px] text-obc-muted">{sub}</p>}
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1.5 font-heading text-[13px] font-medium text-obc-charcoal">
        {Icon && <Icon size={14} className="text-obc-muted" />}
        {label}
      </span>
      {children}
    </label>
  );
}

function Pill({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "lime" }) {
  const cls = tone === "lime" ? "bg-[#CDF178] text-[#1F3320]" : "bg-[#E7F5D0] text-[#0A730A]";
  return (
    <span className={`rounded-full px-2.5 py-1 font-heading text-[11px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

/* ───────────── Tab: Profil ───────────── */
function ProfilTab() {
  return (
    <section className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Kartu avatar */}
      <div className={`${cardCls} h-fit p-5 text-center sm:p-6`}>
        <div className="relative mx-auto h-[88px] w-[88px]">
          <div className="grid h-full w-full place-items-center rounded-2xl bg-[#1F3320] font-heading text-[30px] font-bold text-[#CDF178]">
            EP
          </div>
          <button
            type="button"
            aria-label="Ganti foto profil"
            className="absolute -bottom-1.5 -right-1.5 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-obc-green text-white transition-colors hover:bg-obc-green-hover"
          >
            <Camera size={14} />
          </button>
        </div>
        <p className="mt-4 font-heading text-[18px] font-semibold text-obc-charcoal">Elena Park</p>
        <p className="font-body text-[13px] text-obc-muted">Manajer Operasional</p>
        <div className="mt-3">
          <Pill tone="lime">Admin</Pill>
        </div>
        <p className="mt-4 border-t border-obc-border pt-4 font-body text-[12px] text-obc-muted">
          Format JPG atau PNG, maksimal 2 MB.
        </p>
      </div>

      {/* Form informasi pribadi */}
      <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
        <CardTitle title="Informasi pribadi" sub="Data ini tampil di akun admin OBC Sport." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama depan" icon={User}>
            <input className={inputCls} defaultValue="Elena" />
          </Field>
          <Field label="Nama belakang">
            <input className={inputCls} defaultValue="Park" />
          </Field>
          <Field label="Email" icon={Mail}>
            <input type="email" className={inputCls} defaultValue="elena@obc.id" />
          </Field>
          <Field label="No. telepon" icon={Phone}>
            <input type="tel" className={inputCls} defaultValue="+62 812 3456 7890" />
          </Field>
          <Field label="Bio" className="sm:col-span-2">
            <textarea
              rows={4}
              className={`${inputCls} h-auto resize-none py-3`}
              defaultValue="Mengelola booking lapangan, pengajuan sewa gedung, dan jadwal operasional OBC Sport."
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className={btnOutline}>Batal</button>
          <button className={btnPrimary}>Simpan perubahan</button>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Tab: Keamanan ───────────── */
function KeamananTab() {
  const [sesi, setSesi] = useState<Sesi[]>(sesiAwal);
  const [dua, setDua] = useState(true);

  return (
    <section className="grid max-w-[760px] gap-4">
      {/* Ubah kata sandi */}
      <div className={`${cardCls} p-4 sm:p-6`}>
        <CardTitle title="Ubah kata sandi" sub="Gunakan minimal 8 karakter dengan kombinasi huruf dan angka." />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kata sandi saat ini" icon={KeyRound} className="sm:col-span-2">
            <input type="password" className={inputCls} defaultValue="password123" />
          </Field>
          <Field label="Kata sandi baru">
            <input type="password" className={inputCls} placeholder="Minimal 8 karakter" />
          </Field>
          <Field label="Konfirmasi kata sandi">
            <input type="password" className={inputCls} placeholder="Ulangi kata sandi baru" />
          </Field>
        </div>
        <div className="mt-6">
          <button className={btnPrimary}>Perbarui kata sandi</button>
        </div>
      </div>

      {/* 2FA */}
      <div className={`${cardCls} p-4 sm:p-6`}>
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E7F5D0] text-[#0A730A]">
            <ShieldCheck size={20} strokeWidth={1.9} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">
                Autentikasi dua langkah
              </h2>
              <Pill>{dua ? "Aktif" : "Nonaktif"}</Pill>
            </div>
            <p className="mt-1 font-body text-[13px] text-obc-muted">
              Tambahkan lapisan keamanan dengan kode dari aplikasi autentikator saat masuk.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className={btnOutline}>Kelola 2FA</button>
              <button
                className={btnOutline}
                onClick={() => setDua((v) => !v)}
              >
                {dua ? "Nonaktifkan" : "Aktifkan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sesi aktif */}
      <div className={`${cardCls} p-4 sm:p-6`}>
        <CardTitle title="Sesi aktif" sub="Keluarkan perangkat yang tidak kamu kenali." />
        <ul className="divide-y divide-obc-border">
          {sesi.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <div
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                style={{ background: "#EBEEDC", color: "#404F14" }}
              >
                <s.icon size={18} strokeWidth={1.9} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-[14px] font-semibold text-obc-charcoal">
                  {s.perangkat}
                </p>
                <p className="truncate font-body text-[12px] text-obc-muted">
                  {s.lokasi} · {s.waktu}
                </p>
              </div>
              {s.aktif ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F5D0] px-2.5 py-1 font-heading text-[11px] font-semibold text-[#0A730A]">
                  <Check size={12} /> Perangkat ini
                </span>
              ) : (
                <button
                  className="h-8 rounded-lg border border-obc-border bg-white px-3 font-heading text-[12px] font-medium text-obc-red transition-colors hover:bg-obc-status-booked-bg"
                  onClick={() => setSesi((list) => list.filter((x) => x.id !== s.id))}
                >
                  Keluarkan
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────── Halaman ───────────── */
export default function SettingAccount() {
  const [collapsed, setCollapsed] = useState(false); // PC: rail ikon
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: drawer
  const [tab, setTab] = useState<Tab>("Profil");

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) setCollapsed((v) => !v);
    else setMobileOpen((v) => !v);
  };

  return (
    <div className="min-h-screen bg-obc-ivory font-body text-obc-charcoal">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onExpand={() => setCollapsed(false)}
      />

      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[margin] duration-200 ${
          collapsed ? "lg:ml-[76px]" : "lg:ml-[258px]"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 sm:py-6">
          {/* Judul halaman */}
          <div className="mb-5">
            <p className="font-body text-[13px] text-obc-muted">
              Akun <span className="mx-1">/</span>
              <span className="font-medium text-obc-charcoal">{tab}</span>
            </p>
            <h1 className="mt-2 font-heading text-[24px] font-semibold tracking-[-0.01em] text-obc-charcoal sm:text-[32px]">
              Pengaturan akun
            </h1>
            <p className="mt-1 font-body text-[14px] text-obc-muted">
              Kelola profil dan keamanan akun admin kamu.
            </p>
          </div>

          {/* Tab */}
          <div
            role="tablist"
            className="mb-5 flex gap-1 overflow-x-auto border-b border-obc-border"
          >
            {tabs.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t)}
                  className={`-mb-px shrink-0 border-b-2 px-4 py-3 font-heading text-[14px] font-medium transition-colors ${
                    active
                      ? "border-obc-green text-obc-green"
                      : "border-transparent text-obc-muted hover:text-obc-charcoal"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {tab === "Profil" ? <ProfilTab /> : <KeamananTab />}
        </main>

        <Footer />
      </div>
    </div>
  );
}