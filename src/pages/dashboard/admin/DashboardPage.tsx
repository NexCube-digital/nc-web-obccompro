import { useEffect, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  BriefcaseBusiness,
  FileImage,
  FileText,
  Image,
  LayoutDashboard,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../components/layouts/Sidebar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import {
  dashboardService,
  type CmsPage,
  type CmsSection,
  type ComproDashboardSummary,
  type CustomerList,
  type DashboardSummary,
} from "./DashboardService";
import { toast } from "sonner";

/* ───────────── Helper ───────────── */
const rupiah = (n: number) =>
  "Rp" + new Intl.NumberFormat("id-ID").format(n);

const cardCls =
  "rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]";

const chartColors = ["#004000", "#7FA52B", "#E0A526", "#BF0021", "#404F14"];

const compactRupiah = (value?: number) => value === undefined
  ? "—"
  : new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

const dateLabel = (value: string) => new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(value));

const statusLabel = (value: string) => value
  .split("_")
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(" ");

const statusClass = (value: string) => {
  if (["fully_paid", "completed", "active"].includes(value)) return "bg-[#E7F5D0] text-[#1F3320]";
  if (["dp_paid", "pending"].includes(value)) return "bg-[#FBF0D3] text-[#8A6100]";
  if (["cancelled", "refunded", "suspended"].includes(value)) return "bg-obc-status-booked-bg text-obc-red";
  return "bg-[#EBEEDC] text-[#404F14]";
};

/* ───────────── Komponen kecil ───────────── */
function IconTile({
  icon: Icon,
  bg,
  fg,
  size = 44,
}: {
  icon: LucideIcon;
  bg: string;
  fg: string;
  size?: number;
}) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-xl"
      style={{ width: size, height: size, background: bg, color: fg }}
    >
      <Icon size={size * 0.45} strokeWidth={1.9} />
    </div>
  );
}

function StatCard(p: {
  icon: LucideIcon;
  bg: string;
  fg: string;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className={`${cardCls} p-4 sm:p-5`}>
      <IconTile icon={p.icon} bg={p.bg} fg={p.fg} />
      <p className="mt-4 font-heading text-[12px] font-semibold uppercase tracking-wide text-obc-charcoal">
        {p.label}
      </p>
      <p className="mt-1 font-heading text-[24px] font-bold leading-tight text-obc-charcoal sm:text-[28px]">
        {p.value}
      </p>
      <p className="mt-0.5 font-body text-[12px] text-obc-muted">{p.note}</p>
    </div>
  );
}

function MiniCard(p: {
  icon: LucideIcon;
  bg: string;
  fg: string;
  label: string;
  value: string;
  note: string;
  valueClass?: string;
  className?: string;
}) {
  return (
    <div className={`${cardCls} flex items-center gap-4 p-4 sm:p-5 ${p.className ?? ""}`}>
      <IconTile icon={p.icon} bg={p.bg} fg={p.fg} size={48} />
      <div>
        <p className="font-body text-[13px] text-obc-muted">{p.label}</p>
        <p className={`font-heading text-[24px] font-bold leading-tight ${p.valueClass ?? "text-obc-charcoal"}`}>
          {p.value}
        </p>
        <p className="font-body text-[12px] text-obc-muted">{p.note}</p>
      </div>
    </div>
  );
}

function CardTitle({
  title,
  aside,
  sub,
}: {
  title: string;
  aside?: ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{title}</h2>
        {aside}
      </div>
      {sub && <p className="mt-1 font-body text-[13px] text-obc-muted">{sub}</p>}
    </div>
  );
}

/* ───────────── Halaman ───────────── */
export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [comproSummary, setComproSummary] = useState<ComproDashboardSummary | null>(null);
  const [cmsPages, setCmsPages] = useState<CmsPage[] | null>(null);
  const [cmsSections, setCmsSections] = useState<CmsSection[] | null>(null);
  const [mediaCount, setMediaCount] = useState<number | null>(null);
  const [customerList, setCustomerList] = useState<CustomerList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const results = await Promise.allSettled([
        dashboardService.getSummary(),
        dashboardService.getComproSummary(),
        dashboardService.getCmsPages(),
        dashboardService.getCmsSections(),
        dashboardService.getMedia(),
        dashboardService.getCustomers(),
      ]);
      if (cancelled) return;

      const [sport, compro, pages, sections, media, customers] = results;
      if (sport.status === "fulfilled") setSummary(sport.value);
      if (compro.status === "fulfilled") setComproSummary(compro.value);
      if (pages.status === "fulfilled") setCmsPages(pages.value);
      if (sections.status === "fulfilled") setCmsSections(sections.value);
      if (media.status === "fulfilled") setMediaCount(media.value.length);
      if (customers.status === "fulfilled") setCustomerList(customers.value);
      if (results.some((result) => result.status === "rejected")) {
        toast.error("Sebagian data dashboard gagal dimuat");
      }
      setLoading(false);
    }
    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) setCollapsed((v) => !v);
    else setMobileOpen((v) => !v);
  };
  const sportDistribution = summary?.sportDistribution ?? [];
  const recentBookings = summary?.recentBookings ?? [];
  const recentContacts = comproSummary?.recentContacts ?? [];
  const revenueMonths = summary?.kpi.revenueTrend ?? comproSummary?.kpi.invoiceRevenueTrend ?? [];
  const revenueChartData = revenueMonths.map(({ month }) => ({
    month,
    sportRevenue: summary?.kpi.revenueTrend.find((item) => item.month === month)?.revenue,
    invoiceRevenue: comproSummary?.kpi.invoiceRevenueTrend.find((item) => item.month === month)?.revenue,
  }));

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
          <div className="mb-6">
            <div>
              <p className="font-body text-[13px] text-obc-muted">
                Dashboard <span className="mx-1">/</span>
                <span className="font-medium text-obc-charcoal">Ringkasan</span>
              </p>
              <h1 className="mt-2 font-heading text-[24px] font-semibold tracking-[-0.01em] text-obc-charcoal sm:text-[32px]">
                Ringkasan operasional
              </h1>
              <p className="mt-1 font-body text-[14px] text-obc-muted">
                Data operasional terbaru dari OBC Sport dan website perusahaan.
              </p>
            </div>
          </div>

          {/* Ringkasan olahraga */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Wallet} bg="#E7F5D0" fg="#0A730A" label="Pendapatan olahraga" value={compactRupiah(summary?.kpi.totalRevenue)} note="Akumulasi booking terbayar" />
            <StatCard icon={LayoutDashboard} bg="#EBEEDC" fg="#404F14" label="Total booking" value={summary?.kpi.totalBookings.toLocaleString("id-ID") ?? "—"} note="Seluruh booking tercatat" />
            <StatCard icon={BriefcaseBusiness} bg="#FBF0D3" fg="#8A6100" label="Customer aktif" value={summary?.kpi.activeCustomers.toLocaleString("id-ID") ?? "—"} note="Status aktif" />
            <StatCard icon={FileImage} bg="#F0F0D4" fg="#1F3320" label="Resource aktif" value={summary?.kpi.totalResources.toLocaleString("id-ID") ?? "—"} note="Resource tersedia" />
          </section>

          {/* Ringkasan website dan periode berjalan */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MiniCard icon={LayoutDashboard} bg="#E7F5D0" fg="#0A730A" label="Booking bulan ini" value={summary?.kpi.monthBookings.toLocaleString("id-ID") ?? "—"} note="Berdasarkan waktu pembuatan" />
            <MiniCard icon={FileText} bg="#FBF0D3" fg="#8A6100" label="Invoice terbayar" value={compactRupiah(comproSummary?.kpi.paidInvoiceAmount)} note={`${comproSummary?.kpi.totalInvoices.toLocaleString("id-ID") ?? "—"} invoice tercatat`} />
            <MiniCard icon={BriefcaseBusiness} bg="#EBEEDC" fg="#404F14" label="Kas bersih website" value={compactRupiah(comproSummary?.kpi.netCash)} note={`${comproSummary?.kpi.totalContacts.toLocaleString("id-ID") ?? "—"} kontak tercatat`} valueClass="text-obc-green" />
          </section>

          <section className="mt-4">
            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle
                title="Tren pendapatan bulanan"
                sub={`Tahun ${new Date().getFullYear()} · berdasarkan tanggal pembayaran`}
              />
              <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2">
                {summary && (
                  <p className="flex items-center gap-2 font-body text-[12px] text-obc-muted">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#004000]" /> Booking olahraga
                  </p>
                )}
                {comproSummary && (
                  <p className="flex items-center gap-2 font-body text-[12px] text-obc-muted">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#E0A526]" /> Invoice perusahaan
                  </p>
                )}
              </div>
              {revenueChartData.length ? (
                <div className="h-[240px] sm:h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#004000" stopOpacity={0.24} />
                          <stop offset="100%" stopColor="#004000" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="invoiceRevenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#E0A526" stopOpacity={0.24} />
                          <stop offset="100%" stopColor="#E0A526" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#E2DFD2" strokeDasharray="3 3" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6F6B6E" }} />
                      <Tooltip
                        formatter={(value, name) => [rupiah(Number(value)), name === "sportRevenue" ? "Booking olahraga" : "Invoice perusahaan"]}
                        contentStyle={{ borderRadius: 12, border: "1px solid #E2DFD2", fontSize: 12 }}
                      />
                      {summary && (
                        <Area type="monotone" dataKey="sportRevenue" name="Booking olahraga" stroke="#004000" strokeWidth={2.5} fill="url(#sportRevenueFill)" connectNulls />
                      )}
                      {comproSummary && (
                        <Area type="monotone" dataKey="invoiceRevenue" name="Invoice perusahaan" stroke="#E0A526" strokeWidth={2.5} fill="url(#invoiceRevenueFill)" connectNulls />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-16 text-center font-body text-[13px] text-obc-muted">
                  {loading ? "Memuat data..." : "Belum ada data pendapatan untuk tahun ini."}
                </p>
              )}
            </div>
          </section>

          {/* Distribusi booking dan inventaris CMS */}
          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle title="Booking per cabang olahraga" sub="Jumlah booking berdasarkan jenis olahraga" />
              {sportDistribution.length ? (
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  <div className="relative h-[190px] w-[190px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sportDistribution} dataKey="count" nameKey="sport" innerRadius={58} outerRadius={88} paddingAngle={2} stroke="none">
                          {sportDistribution.map((item, index) => (
                            <Cell key={item.sport} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                      <div>
                        <p className="font-heading text-[20px] font-bold">{summary?.kpi.totalBookings.toLocaleString("id-ID") ?? "—"}</p>
                        <p className="font-body text-[11px] text-obc-muted">Booking</p>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 font-body text-[13px]">
                    {sportDistribution.map((item, index) => (
                      <li key={item.sport} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: chartColors[index % chartColors.length] }} />
                        <span className="text-obc-muted">{item.sport}</span>
                        <span className="font-semibold">{item.count.toLocaleString("id-ID")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="py-16 text-center font-body text-[13px] text-obc-muted">
                  {loading ? "Memuat data..." : "Belum ada data booking olahraga."}
                </p>
              )}
            </div>

            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle title="Konten website" sub="Jumlah data yang tersedia di backend" />
              <ul className="divide-y divide-obc-border">
                {[
                  { label: "Halaman CMS", value: cmsPages?.length, icon: FileText },
                  { label: "Section CMS", value: cmsSections?.length, icon: LayoutDashboard },
                  { label: "Media", value: mediaCount ?? undefined, icon: Image },
                  { label: "Customer terdaftar", value: customerList?.pagination.total, icon: BriefcaseBusiness },
                  { label: "Portfolio", value: comproSummary?.kpi.totalPortfolios, icon: FileImage },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3 py-3">
                    <item.icon size={17} className="text-obc-green" />
                    <span className="flex-1 font-body text-[13px] text-obc-muted">{item.label}</span>
                    <span className="font-heading text-[15px] font-semibold">
                      {loading && item.value === undefined ? "..." : item.value?.toLocaleString("id-ID") ?? "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Aktivitas terbaru dari backend */}
          <section className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle title="Booking terbaru" sub="10 booking terakhir dari OBC Sport" />
              {recentBookings.length ? (
                <ul className="divide-y divide-obc-border">
                  {recentBookings.map((booking) => (
                    <li key={booking.id} className="flex items-center gap-3 py-3">
                      <IconTile icon={LayoutDashboard} bg="#EBEEDC" fg="#404F14" size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-[13px] font-semibold">{booking.customer.name}</p>
                        <p className="truncate font-body text-[11px] text-obc-muted">
                          {booking.sportType} · {booking.resource.name} · {dateLabel(booking.createdAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-body text-[12px] font-semibold">{rupiah(booking.totalPrice)}</p>
                        <span className={`mt-1 inline-block rounded-full px-2 py-0.5 font-heading text-[10px] font-semibold ${statusClass(booking.status)}`}>
                          {statusLabel(booking.status)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center font-body text-[13px] text-obc-muted">
                  {loading ? "Memuat data..." : "Belum ada booking."}
                </p>
              )}
            </div>

            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle title="Kontak terbaru" sub="5 kontak terbaru dari website perusahaan" />
              {recentContacts.length ? (
                <ul className="divide-y divide-obc-border">
                  {recentContacts.map((contact) => (
                    <li key={contact.id} className="flex items-center gap-3 py-3">
                      <IconTile icon={BriefcaseBusiness} bg="#FBF0D3" fg="#8A6100" size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-[13px] font-semibold">{contact.name}</p>
                        <p className="truncate font-body text-[11px] text-obc-muted">
                          {contact.company || contact.email} · {dateLabel(contact.createdAt)}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 font-heading text-[10px] font-semibold ${statusClass(contact.status)}`}>
                        {statusLabel(contact.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-10 text-center font-body text-[13px] text-obc-muted">
                  {loading ? "Memuat data..." : "Belum ada kontak terbaru."}
                </p>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}