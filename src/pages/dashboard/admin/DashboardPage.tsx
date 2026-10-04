import { useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CalendarRange,
  Download,
  MessageCircle,
  PartyPopper,
  Plus,
  Repeat,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "../components/layouts/Sidebar";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";

/* ───────────── Helper ───────────── */
const rupiah = (n: number) =>
  "Rp" + new Intl.NumberFormat("id-ID").format(n);

const cardCls =
  "rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]";

/* ───────────── Data contoh (ganti dengan data API) ───────────── */
const LIME = "#CDF178";
const FOREST = "#1F3320";

const trend = [
  { bulan: "Jan", olahraga: 18.2, event: 6.0 },
  { bulan: "Feb", olahraga: 20.5, event: 8.5 },
  { bulan: "Mar", olahraga: 22.1, event: 5.5 },
  { bulan: "Apr", olahraga: 25.4, event: 12.0 },
  { bulan: "Mei", olahraga: 24.0, event: 9.0 },
  { bulan: "Jun", olahraga: 27.8, event: 14.5 },
  { bulan: "Jul", olahraga: 30.2, event: 11.0 },
  { bulan: "Agu", olahraga: 29.5, event: 16.0 },
  { bulan: "Sep", olahraga: 33.1, event: 18.5 },
];

const cabang = [
  { nama: "Futsal", persen: 38, nilai: 52_400_000, warna: "#004000" },
  { nama: "Badminton", persen: 22, nilai: 30_300_000, warna: "#7FA52B" },
  { nama: "Pickleball", persen: 17, nilai: 23_400_000, warna: "#404F14" },
  { nama: "Biliard", persen: 12, nilai: 16_500_000, warna: "#E0A526" },
  { nama: "Tenis Meja & lainnya", persen: 11, nilai: 15_200_000, warna: "#BF0021" },
];

const okupansi = [
  { nama: "Lapang F1", info: "Futsal, Badminton, Voli, Pickleball", pakai: 92, jam: "414 / 450 jam", warna: "#E0A526" },
  { nama: "Lapang F2", info: "Basket, Sepak Bola", pakai: 84, jam: "378 / 450 jam", warna: "#E0A526" },
  { nama: "Ruang Biliard", info: "2 meja", pakai: 61, jam: "549 / 900 jam", warna: "#009D00" },
  { nama: "Ruang Tenis Meja", info: "2 meja", pakai: 47, jam: "423 / 900 jam", warna: "#404F14" },
];

type Status = "DP Dibayar" | "Lunas" | "Menunggu Nego" | "Aktif" | "Refund";

const transaksi: {
  nama: string;
  kategori: string;
  tanggal: string;
  jumlah: number;
  status: Status;
  icon: LucideIcon;
}[] = [
  { nama: "Rizky Pratama", kategori: "Futsal · Lapang F1", tanggal: "4 Okt 2026", jumlah: 175000, status: "Lunas", icon: CalendarCheck },
  { nama: "Wedding Sari & Dimas", kategori: "Sewa Gedung · F1", tanggal: "3 Okt 2026", jumlah: 12500000, status: "DP Dibayar", icon: PartyPopper },
  { nama: "Komunitas Pickle Bdg", kategori: "Membership · Pickleball", tanggal: "3 Okt 2026", jumlah: 240000, status: "Aktif", icon: Repeat },
  { nama: "PT Mitra Sejahtera", kategori: "Gathering · F2", tanggal: "2 Okt 2026", jumlah: 0, status: "Menunggu Nego", icon: PartyPopper },
  { nama: "Dewi Anggraini", kategori: "Badminton · Lapang F1", tanggal: "1 Okt 2026", jumlah: 80000, status: "Refund", icon: CalendarCheck },
  { nama: "Budi Santoso", kategori: "Biliard · Meja 2", tanggal: "30 Sep 2026", jumlah: 50000, status: "Lunas", icon: CalendarCheck },
];

const statusStyle: Record<Status, string> = {
  Lunas: "bg-[#E7F5D0] text-[#1F3320]",
  "DP Dibayar": "bg-[#EBEEDC] text-[#404F14]",
  Aktif: "bg-[#CDF178] text-[#1F3320]",
  "Menunggu Nego": "bg-[#FBF0D3] text-[#8A6100]",
  Refund: "bg-obc-status-booked-bg text-obc-red",
};

/* ───────────── Komponen kecil ───────────── */
function Trend({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 font-heading text-[11px] font-semibold ${
        up ? "bg-[#E7F5D0] text-[#0A730A]" : "bg-obc-status-booked-bg text-obc-red"
      }`}
    >
      <Icon size={12} />
      {up ? "+" : ""}
      {value}%
    </span>
  );
}

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
  change: number;
}) {
  return (
    <div className={`${cardCls} p-4 sm:p-5`}>
      <div className="flex items-start justify-between">
        <IconTile icon={p.icon} bg={p.bg} fg={p.fg} />
        <Trend value={p.change} />
      </div>
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
  const [collapsed, setCollapsed] = useState(false); // PC: rail ikon
  const [mobileOpen, setMobileOpen] = useState(false); // mobile: drawer

  // Tombol hamburger: di PC ciut/lebarkan, di mobile buka/tutup drawer
  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) setCollapsed((v) => !v);
    else setMobileOpen((v) => !v);
  };
  const totalOlahraga = trend.reduce((a, b) => a + b.olahraga, 0);
  const totalEvent = trend.reduce((a, b) => a + b.event, 0);

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
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-body text-[13px] text-obc-muted">
                Dashboard <span className="mx-1">/</span>
                <span className="font-medium text-obc-charcoal">Ringkasan</span>
              </p>
              <h1 className="mt-2 font-heading text-[24px] font-semibold tracking-[-0.01em] text-obc-charcoal sm:text-[32px]">
                Ringkasan operasional
              </h1>
              <p className="mt-1 font-body text-[14px] text-obc-muted">
                Booking OBC Sport, pengajuan sewa gedung, dan aktivitas website, periode Jan – Sep 2026.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:w-[320px]">
              <button className="flex h-10 min-w-0 items-center justify-center gap-2 rounded-xl border border-obc-border bg-white px-2 font-heading text-[13px] font-medium transition-colors hover:bg-obc-hover-surface sm:px-3">
                <CalendarRange size={15} /> Jan – Sep 2026
              </button>
              <button className="flex h-10 min-w-0 items-center justify-center gap-2 rounded-xl border border-obc-border bg-white px-2 font-heading text-[13px] font-medium transition-colors hover:bg-obc-hover-surface sm:px-3">
                <Download size={15} /> Ekspor
              </button>
              <button className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-xl bg-obc-green px-4 font-heading text-[13px] font-medium text-white transition-colors hover:bg-obc-green-hover">
                <Plus size={15} /> Booking Baru
              </button>
            </div>
          </div>

          {/* Baris 1: 4 kartu statistik */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Wallet} bg="#E7F5D0" fg="#0A730A" label="Total pendapatan" value="Rp138 jt" note="Olahraga + sewa gedung" change={18.2} />
            <StatCard icon={CalendarCheck} bg="#EBEEDC" fg="#404F14" label="Total booking" value="1.284" note="Booking olahraga tahun ini" change={12.4} />
            <StatCard icon={PartyPopper} bg="#FBF0D3" fg="#8A6100" label="Pengajuan event" value="37" note="9 menunggu follow-up admin" change={24.6} />
            <StatCard icon={Repeat} bg="#F0F0D4" fg={FOREST} label="Membership aktif" value="58" note="Paket 4x sesi, diskon 20%" change={6.8} />
          </section>

          {/* Baris 2: 3 kartu ringkas */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <MiniCard icon={TrendingUp} bg="#E7F5D0" fg="#0A730A" label="Pendapatan olahraga" value={`Rp${totalOlahraga.toFixed(1)} jt`} note="1.284 booking" />
            <MiniCard icon={PartyPopper} bg="#FBF0D3" fg="#8A6100" label="Pendapatan sewa gedung" value={`Rp${totalEvent.toFixed(1)} jt`} note="22 acara terkonfirmasi" />
            <MiniCard icon={MessageCircle} bg="#EBEEDC" fg="#404F14" label="Klik WhatsApp (website)" value="3.416" note="vs 2.980 bulan lalu" valueClass="text-obc-green" className="sm:col-span-2 xl:col-span-1" />
          </section>

          {/* Baris 3: grafik */}
          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle
                title="Pendapatan olahraga vs sewa gedung"
                aside={
                  <span className="rounded-full bg-[#E7F5D0] px-2.5 py-1 font-heading text-[11px] font-semibold text-[#0A730A]">
                    +18% dari periode lalu
                  </span>
                }
              />
              <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { l: "Olahraga", v: `Rp${totalOlahraga.toFixed(1)} jt`, c: "#004000" },
                  { l: "Sewa gedung", v: `Rp${totalEvent.toFixed(1)} jt`, c: "#E0A526" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="flex items-center gap-1.5 font-body text-[12px] text-obc-muted">
                      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.c }} />
                      {s.l}
                    </p>
                    <p className="font-heading text-[18px] font-semibold">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="h-[220px] sm:h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gOlahraga" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#004000" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#CDF178" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6F6B6E" }} />
                    <Tooltip
                      formatter={(v) => [`Rp${v} jt`]}
                      contentStyle={{ borderRadius: 12, border: "1px solid #E2DFD2", fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="olahraga" name="Olahraga" stroke="#004000" strokeWidth={2.5} fill="url(#gOlahraga)" />
                    <Area type="monotone" dataKey="event" name="Sewa gedung" stroke="#E0A526" strokeWidth={2.5} fill="transparent" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle title="Pendapatan per cabang" aside={<span className="font-body text-[12px] text-obc-muted">Sep 2026</span>} sub="Kontribusi tiap cabang olahraga" />
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <div className="relative h-[160px] w-[160px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={cabang} dataKey="persen" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                        {cabang.map((c) => (
                          <Cell key={c.nama} fill={c.warna} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                    <div>
                      <p className="font-heading text-[18px] font-bold">Rp138jt</p>
                      <p className="font-body text-[11px] text-obc-muted">Total</p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 font-body text-[12px]">
                  {cabang.slice(0, 5).map((c) => (
                    <li key={c.nama} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: c.warna }} />
                      <span className="text-obc-muted">{c.nama.split(" ")[0]}</span>
                      <span className="font-semibold">{c.persen}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="mt-5 space-y-3 font-body text-[13px]">
                {cabang.map((c) => (
                  <li key={c.nama} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.warna }} />
                    <span className="flex-1">{c.nama}</span>
                    <span className="font-semibold">{rupiah(c.nilai)}</span>
                    <span className="w-9 text-right text-[12px] text-obc-muted">{c.persen}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Baris 4: okupansi + transaksi */}
          <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle
                title="Okupansi resource"
                aside={
                  <span className="rounded-full bg-[#FBF0D3] px-2.5 py-1 font-heading text-[11px] font-semibold text-[#8A6100]">
                    2 di atas 80%
                  </span>
                }
              />
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                {okupansi.map((o) => (
                  <div key={o.nama}>
                    <div className="mb-1.5 flex items-center justify-between font-body text-[14px]">
                      <span className="font-medium">{o.nama}</span>
                      <span className="flex items-center gap-1.5 font-semibold">
                        {o.pakai > 80 && <AlertTriangle size={14} className="text-[#E0A526]" />}
                        {o.pakai}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-obc-hover-surface">
                      <div className="h-full rounded-full" style={{ width: `${o.pakai}%`, background: o.warna }} />
                    </div>
                    <p className="mt-1.5 font-body text-[11px] text-obc-muted">
                      {o.jam} · {o.info}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${cardCls} min-w-0 p-4 sm:p-6`}>
              <CardTitle
                title="Booking & pengajuan terbaru"
                aside={
                  <a href="/sport/booking" className="font-heading text-[13px] font-medium text-obc-green hover:underline">
                    Lihat semua
                  </a>
                }
              />
              <div className="hidden overflow-x-auto rounded-xl border border-obc-border md:block">
                <table className="w-full min-w-[620px] text-left">
                  <thead>
                    <tr className="bg-obc-ivory font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
                      <th className="px-4 py-3">Pelanggan</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="font-body text-[13px]">
                    {transaksi.map((t) => (
                      <tr key={t.nama} className="border-t border-obc-border">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <IconTile
                              icon={t.status === "Refund" ? BadgeCheck : t.icon}
                              bg={t.status === "Refund" ? "#FDECEE" : "#EBEEDC"}
                              fg={t.status === "Refund" ? "#BF0021" : "#404F14"}
                              size={36}
                            />
                            <span className="font-semibold">{t.nama}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-obc-muted">{t.kategori}</td>
                        <td className="px-4 py-3 text-obc-muted">{t.tanggal}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 font-heading text-[11px] font-semibold ${statusStyle[t.status]}`}>
                            {t.status}
                          </span>
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold ${
                            t.status === "Refund" ? "text-obc-red" : t.jumlah ? "text-[#0A730A]" : "text-obc-muted"
                          }`}
                        >
                          {t.status === "Refund" ? "-" : t.jumlah ? "+" : ""}
                          {t.jumlah ? rupiah(t.jumlah) : "Belum ada harga"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tampilan mobile: daftar ringkas */}
              <ul className="divide-y divide-obc-border rounded-xl border border-obc-border md:hidden">
                {transaksi.map((t) => (
                  <li key={t.nama} className="flex items-center gap-3 p-3">
                    <IconTile
                      icon={t.icon}
                      bg={t.status === "Refund" ? "#FDECEE" : "#EBEEDC"}
                      fg={t.status === "Refund" ? "#BF0021" : "#404F14"}
                      size={38}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-[13px] font-semibold">{t.nama}</p>
                      <p className="truncate font-body text-[11px] text-obc-muted">
                        {t.kategori} · {t.tanggal}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`font-body text-[12px] font-semibold ${
                          t.status === "Refund" ? "text-obc-red" : t.jumlah ? "text-[#0A730A]" : "text-obc-muted"
                        }`}
                      >
                        {t.status === "Refund" ? "-" : t.jumlah ? "+" : ""}
                        {t.jumlah ? rupiah(t.jumlah) : "Nego"}
                      </p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 font-heading text-[10px] font-semibold ${statusStyle[t.status]}`}>
                        {t.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}