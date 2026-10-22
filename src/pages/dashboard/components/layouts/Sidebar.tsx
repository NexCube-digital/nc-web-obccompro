import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import TransitionLink from "../../../../components/common/TransitionLink";
import obcLogo from "../../../../assets/logo/obclogo.webp";
import {
  Building2,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  FileBarChart,
  Globe,
  LayoutGrid,
  Receipt,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type MenuItem = {
  label: string;
  icon: LucideIcon;
  to?: string;
  category?: string;
  children?: { label: string; to: string }[];
};

const MENU: MenuItem[] = [
  { label: "Dashboard", icon: LayoutGrid, to: "/dashboard" },
  {
    label: "Operasional",
    category: "OPERASIONAL",
    icon: Dumbbell,
    children: [
      { label: "Booking", to: "/sport/booking" },
      { label: "Resource & Lapangan", to: "/sport/resource" },
      { label: "Harga & Tarif", to: "/sport/harga" },
      { label: "Membership", to: "/sport/membership" },
      { label: "Kalender Master", to: "/kalender" },
      { label: "Pengajuan Event", to: "/event/pengajuan" },
      { label: "Invoice & DP Event", to: "/event/invoice" },
    ],
  },
  {
    label: "Transaksi & Pelanggan",
    category: "TRANSAKSI",
    icon: Receipt,
    children: [
      { label: "Invoice Management", to: "/admin/invoices" },
      { label: "Keuangan", to: "/admin/finance" },
      { label: "Pelanggan", to: "/admin/customers" },
      { label: "Permintaan Kontak", to: "/admin/contacts" },
    ],
  },
  {
    label: "Konten Website",
    category: "CONTENT",
    icon: Globe,
    children: [
      { label: "Manajemen Halaman", to: "/admin/cms/pages" },
      { label: "Manajemen Section", to: "/admin/cms/sections" },
      { label: "Portfolio", to: "/admin/portfolio" },
      { label: "Paket Layanan", to: "/admin/packages" },
      { label: "Pustaka Media", to: "/admin/media" },
      { label: "Galeri", to: "/galeri" },
      { label: "Testimoni", to: "/testimoni" },
      { label: "Kontak & Lokasi", to: "/kontak" },
    ],
  },
  {
    label: "Unit Bisnis",
    icon: Building2,
    children: [
      { label: "OBC Guest House", to: "/unit-bisnis/guest-house" },
      { label: "OBC Villa", to: "/unit-bisnis/villa" },
      { label: "OBC Laundry", to: "/unit-bisnis/laundry" },
      { label: "OBC Food Court", to: "/unit-bisnis/food-court" },
      { label: "OBC Coffee", to: "/unit-bisnis/coffee" },
      { label: "OBC Agribisnis", to: "/unit-bisnis/agribisnis" },
    ],
  },
  {
    label: "Tim & Administrasi",
    category: "ADMINISTRASI",
    icon: Users,
    children: [
      { label: "Staff", to: "/staff" },
      { label: "Tim", to: "/admin/teams" },
      { label: "Role & Permission", to: "/admin/role-permissions" },
      { label: "Audit Log", to: "/admin/activities" },
      { label: "Pengaturan", to: "/pengaturan" },
    ],
  },
  { label: "Laporan", category: "LAPORAN", icon: FileBarChart, to: "/laporan" },
  {
    label: "Utilitas",
    category: "UTILITAS",
    icon: ClipboardList,
    children: [
      { label: "Form", to: "/template/form" },
      { label: "Tabel", to: "/template/tabel" },
    ],
  },
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
  const location = useLocation();
  const activeGroup = MENU.find((item) => item.children?.some((child) =>
    location.pathname === child.to || location.pathname.startsWith(`${child.to}/`),
  ))?.label ?? null;
  const [expanded, setExpanded] = useState<string | null>(() => activeGroup);

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
            {MENU.map((item, index) => {
              const Icon = item.icon;
              const tip = collapsed ? item.label : undefined;
              const previousCategory = MENU[index - 1]?.category;
              const showCategory = item.category && item.category !== previousCategory;

              if (!item.children) {
                return (
                  <Fragment key={item.label}>
                    {showCategory && <li className={`px-3 pb-1 pt-4 font-heading text-[10px] font-semibold tracking-[0.1em] text-obc-muted ${hide}`}>{item.category}</li>}
                    <li>
                      <TransitionLink
                        to={item.to!}
                        title={tip}
                        onClick={onCloseMobile}
                        className={({ isActive }) => `${itemCls} ${isActive ? active : idle}`}
                      >
                        <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                        <span className={`truncate ${hide}`}>{item.label}</span>
                      </TransitionLink>
                    </li>
                  </Fragment>
                );
              }

              const isOpen = expanded === item.label;
              const hasActiveChild = item.children.some((child) =>
                location.pathname === child.to || location.pathname.startsWith(`${child.to}/`),
              );
              const groupLabelId = `sidebar-group-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return (
                <Fragment key={item.label}>
                  {showCategory && <li className={`px-3 pb-1 pt-4 font-heading text-[10px] font-semibold tracking-[0.1em] text-obc-muted ${hide}`}>{item.category}</li>}
                  <li>
                    <button
                      type="button"
                      onClick={() => handleGroup(item.label)}
                      aria-expanded={isOpen}
                      aria-controls={groupLabelId}
                      title={tip}
                      className={`${itemCls} w-full ${isOpen || hasActiveChild ? "bg-[#F6F9E9] text-[#1F3320]" : idle}`}
                    >
                      <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                      <span className={`flex-1 truncate text-left ${hide}`}>{item.label}</span>
                      <ChevronDown size={16} className={`shrink-0 text-obc-muted transition-transform ${hide} ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <ul id={groupLabelId} aria-label={item.label} className={`ml-[21px] mt-0.5 space-y-0.5 border-l border-obc-border pl-3 ${hide}`}>
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <TransitionLink
                              to={child.to}
                              onClick={onCloseMobile}
                              className={({ isActive }) => `block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${isActive ? active : "text-obc-muted hover:bg-obc-hover-surface hover:text-obc-charcoal"}`}
                            >
                              {child.label}
                            </TransitionLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </nav>

        
      </aside>
    </>
  );
}