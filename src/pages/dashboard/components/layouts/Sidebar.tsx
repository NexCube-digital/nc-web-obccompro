import { useState } from "react";
import TransitionLink from "../../../../components/common/TransitionLink";
import obcLogo from "../../../../assets/logo/obclogo.webp";
import {
  Building2,
  ChevronDown,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  FileBarChart,
  Globe,
  Image,
  LayoutGrid,
  MapPin,
  MessageSquareQuote,
  PartyPopper,
  Settings,
  TableProperties,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type MenuItem = {
  label: string;
  icon: LucideIcon;
  to?: string;
  children?: { label: string; to: string }[];
};

const MENU: MenuItem[] = [
  { label: "Dashboard", icon: LayoutGrid, to: "/dashboard" },
  { label: "Form", icon: ClipboardList, to: "/template/form" },
  { label: "Tabel", icon: TableProperties, to: "/template/tabel" },
  {
    label: "OBC Sport",
    icon: Dumbbell,
    children: [
      { label: "Booking", to: "/sport/booking" },
      { label: "Resource & Lapangan", to: "/sport/resource" },
      { label: "Harga & Tarif", to: "/sport/harga" },
      { label: "Membership", to: "/sport/membership" },
    ],
  },
  { label: "Kalender Master", icon: CalendarDays, to: "/kalender" },
  {
    label: "Sewa Gedung / Event",
    icon: PartyPopper,
    children: [
      { label: "Pengajuan Masuk", to: "/event/pengajuan" },
      { label: "Invoice & DP", to: "/event/invoice" },
    ],
  },
  {
    label: "Unit Bisnis",
    icon: Building2,
    children: [
      { label: "OBC Guest House", to: "/unit/guest-house" },
      { label: "OBC Villa", to: "/unit/villa" },
      { label: "OBC Penthouse", to: "/unit/penthouse" },
      { label: "OBC Laundry", to: "/unit/laundry" },
      { label: "OBC Food Court", to: "/unit/food-court" },
      { label: "OBC Coffee", to: "/unit/coffee" },
      { label: "OBC Agrobisnis", to: "/unit/agrobisnis" },
    ],
  },
  {
    label: "Konten Website",
    icon: Globe,
    children: [
      { label: "Beranda", to: "/konten/beranda" },
      { label: "Tentang Kami", to: "/konten/tentang" },
      { label: "Layanan OBC", to: "/konten/layanan" },
    ],
  },
  { label: "Galeri", icon: Image, to: "/galeri" },
  { label: "Testimoni", icon: MessageSquareQuote, to: "/testimoni" },
  { label: "Kontak & Lokasi", icon: MapPin, to: "/kontak" },
  { label: "Pelanggan", icon: Users, to: "/pelanggan" },
  { label: "Laporan", icon: FileBarChart, to: "/laporan" },
  { label: "Pengaturan", icon: Settings, to: "/pengaturan" },
];

type Props = {
  /** Mode PC: sidebar ciut menjadi rail ikon */
  collapsed: boolean;
  /** Mode mobile/tablet: drawer terbuka */
  mobileOpen: boolean;
  onCloseMobile: () => void;
  /** Dipanggil saat menu bercabang diklik ketika sidebar sedang ciut */
  onExpand: () => void;
};

const isDesktop = () =>
  typeof window !== "undefined" && window.innerWidth >= 1024;

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onExpand,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>("OBC Sport");

  // Semua kelas "ciut" hanya berlaku di layar PC (lg ke atas).
  // Di mobile drawer selalu tampil penuh.
  const hide = collapsed ? "lg:hidden" : "";
  const center = collapsed ? "lg:justify-center lg:gap-0 lg:px-0" : "";

  const itemCls = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors ${center}`;
  const idle = "text-obc-charcoal hover:bg-obc-hover-surface";
  const active = "bg-[#CDF178] text-[#1F3320]";

  const handleGroup = (label: string) => {
    if (collapsed && isDesktop()) {
      onExpand();
      setExpanded(label);
      return;
    }
    setExpanded(expanded === label ? null : label);
  };

  return (
    <>
      {/* Overlay (khusus mobile/tablet) */}
      <div
        onClick={onCloseMobile}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[258px] max-w-[85vw] flex-col border-r border-obc-border bg-white transition-[width,transform] duration-200 lg:max-w-none lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[76px]" : "lg:w-[258px]"}`}
      >
        {/* Logo */}
        <div
          className={`flex h-[76px] shrink-0 items-center justify-between px-5 ${
            collapsed ? "lg:justify-center lg:px-0" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src={obcLogo}
              alt="Logo OBC Onny Barber Center"
              className={`h-10 shrink-0 object-contain ${collapsed ? "lg:w-12" : "w-14"}`}
            />
            
            <div className={`leading-tight ${hide}`}>
              <p className="font-heading text-[18px] font-bold text-obc-charcoal">
                Panel Admin
              </p>
              <p className="font-body text-[11px] text-obc-muted">
                Compro & Sport
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 text-obc-muted hover:bg-obc-hover-surface lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 ${
            collapsed ? "lg:px-3" : ""
          }`}
        >
          <p
            className={`px-3 pb-2 pt-1 font-heading text-[11px] font-semibold tracking-[0.12em] text-obc-muted ${hide}`}
          >
            MENU
          </p>
          {collapsed && <div className="mb-2 hidden border-t border-obc-border lg:block" />}

          <ul className="space-y-0.5">
            {MENU.map((item) => {
              const Icon = item.icon;
              const tip = collapsed ? item.label : undefined;

              if (!item.children) {
                return (
                  <li key={item.label}>
                    <TransitionLink
                      to={item.to!}
                      title={tip}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `${itemCls} ${isActive ? active : idle}`
                      }
                    >
                      <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                      <span className={`truncate ${hide}`}>{item.label}</span>
                    </TransitionLink>
                  </li>
                );
              }

              const isOpen = expanded === item.label;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleGroup(item.label)}
                    aria-expanded={isOpen}
                    title={tip}
                    className={`${itemCls} ${idle} w-full`}
                  >
                    <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                    <span className={`flex-1 truncate text-left ${hide}`}>
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-obc-muted transition-transform ${hide} ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <ul
                      className={`ml-[21px] mt-0.5 space-y-0.5 border-l border-obc-border pl-3 ${hide}`}
                    >
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <TransitionLink
                            to={c.to}
                            onClick={onCloseMobile}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                                isActive
                                  ? active
                                  : "text-obc-muted hover:bg-obc-hover-surface hover:text-obc-charcoal"
                              }`
                            }
                          >
                            {c.label}
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        
      </aside>
    </>
  );
}