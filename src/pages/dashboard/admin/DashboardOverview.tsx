import type { ReactNode } from "react";
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
import { BriefcaseBusiness, Building2, Clock3, FileImage, FileText, Image, LayoutDashboard, Users, Wallet, type LucideIcon } from "lucide-react";
import type { ComproDashboardSummary, DashboardSummary } from "./DashboardService";

type Props = {
	summary: DashboardSummary | null;
	comproSummary: ComproDashboardSummary | null;
	mediaCount: number | null;
	customerCount: number | null;
	activeStaffCount: number | null;
	activeBusinessUnitCount: number | null;
	loading: boolean;
};

const cardClass = "rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]";
const chartColors = ["#004000", "#7FA52B", "#E0A526", "#BF0021", "#404F14"];
const rupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
const compactRupiah = (value?: number) => value === undefined
	? "—"
	: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1 }).format(value);

function IconTile({ icon: Icon, bg, fg, size = 44 }: { icon: LucideIcon; bg: string; fg: string; size?: number }) {
	return <div className="grid shrink-0 place-items-center rounded-xl" style={{ width: size, height: size, background: bg, color: fg }}><Icon size={size * 0.45} strokeWidth={1.9} /></div>;
}

function StatCard({ icon, bg, fg, label, value, note }: { icon: LucideIcon; bg: string; fg: string; label: string; value: string; note: string }) {
	return <div className={`${cardClass} p-4 sm:p-5`}><IconTile icon={icon} bg={bg} fg={fg} /><p className="mt-4 font-heading text-[12px] font-semibold uppercase tracking-wide text-obc-charcoal">{label}</p><p className="mt-1 font-heading text-[24px] font-bold leading-tight text-obc-charcoal sm:text-[28px]">{value}</p><p className="mt-0.5 font-body text-[12px] text-obc-muted">{note}</p></div>;
}

function MiniCard({ icon, bg, fg, label, value, note, valueClass }: { icon: LucideIcon; bg: string; fg: string; label: string; value: string; note: string; valueClass?: string }) {
	return <div className={`${cardClass} flex min-w-0 items-center gap-4 p-4 sm:p-5`}><IconTile icon={icon} bg={bg} fg={fg} size={48} /><div className="min-w-0"><p className="font-body text-[12px] text-obc-muted">{label}</p><p className={`truncate font-heading text-[22px] font-bold leading-tight ${valueClass ?? "text-obc-charcoal"}`}>{value}</p><p className="truncate font-body text-[11px] text-obc-muted">{note}</p></div></div>;
}

function CardTitle({ title, sub, aside }: { title: string; sub?: string; aside?: ReactNode }) {
	return <div className="mb-4"><div className="flex items-center justify-between gap-3"><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{title}</h2>{aside}</div>{sub && <p className="mt-1 font-body text-[12px] text-obc-muted">{sub}</p>}</div>;
}

export default function DashboardOverview({ summary, comproSummary, mediaCount, customerCount, activeStaffCount, activeBusinessUnitCount, loading }: Props) {
	const sportDistribution = summary?.sportDistribution ?? [];
	const revenueMonths = summary?.kpi.revenueTrend ?? comproSummary?.kpi.invoiceRevenueTrend ?? [];
	const revenueChartData = revenueMonths.map(({ month }) => ({
		month,
		sportRevenue: summary?.kpi.revenueTrend.find((item) => item.month === month)?.revenue,
		invoiceRevenue: comproSummary?.kpi.invoiceRevenueTrend.find((item) => item.month === month)?.revenue,
	}));
	const websiteItems = [
		{ label: "Media", value: mediaCount ?? undefined, icon: Image },
		{ label: "Customer terdaftar", value: customerCount ?? undefined, icon: BriefcaseBusiness },
		{ label: "Portfolio", value: comproSummary?.kpi.totalPortfolios, icon: FileImage },
		{ label: "Staff aktif", value: activeStaffCount ?? undefined, icon: Users },
		{ label: "Unit bisnis aktif", value: activeBusinessUnitCount ?? undefined, icon: Building2 },
	];

	return (
		<>
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard icon={Wallet} bg="#E7F5D0" fg="#0A730A" label="Pendapatan olahraga" value={compactRupiah(summary?.kpi.totalRevenue)} note="Akumulasi booking terbayar" />
				<StatCard icon={LayoutDashboard} bg="#EBEEDC" fg="#404F14" label="Total booking" value={summary?.kpi.totalBookings.toLocaleString("id-ID") ?? "—"} note="Seluruh booking tercatat" />
				<StatCard icon={BriefcaseBusiness} bg="#FBF0D3" fg="#8A6100" label="Customer aktif" value={summary?.kpi.activeCustomers.toLocaleString("id-ID") ?? "—"} note="Status aktif" />
				<StatCard icon={FileImage} bg="#F0F0D4" fg="#1F3320" label="Lapangan aktif" value={summary?.kpi.totalResources.toLocaleString("id-ID") ?? "—"} note="Lapangan tersedia" />
			</section>

			<section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<MiniCard icon={LayoutDashboard} bg="#E7F5D0" fg="#0A730A" label="Booking bulan ini" value={summary?.kpi.monthBookings.toLocaleString("id-ID") ?? "—"} note="Berdasarkan waktu pembuatan" />
				<MiniCard icon={FileText} bg="#FBF0D3" fg="#8A6100" label="Invoice terbayar" value={compactRupiah(comproSummary?.kpi.paidInvoiceAmount)} note={`${comproSummary?.kpi.totalInvoices.toLocaleString("id-ID") ?? "—"} invoice tercatat`} />
				<MiniCard icon={Clock3} bg="#EBEEDC" fg="#404F14" label="Invoice tertunda" value={compactRupiah(comproSummary?.kpi.pendingInvoiceAmount)} note="Tagihan yang belum lunas" valueClass="text-obc-green" />
			</section>

			<section className="mt-4">
				<div className={`${cardClass} min-w-0 p-4 sm:p-6`}>
					<CardTitle title="Tren pendapatan bulanan" sub={`Tahun ${new Date().getFullYear()} · berdasarkan tanggal pembayaran`} />
					<div className="mb-3 flex flex-wrap gap-x-6 gap-y-2">
						{summary && <p className="flex items-center gap-2 font-body text-[12px] text-obc-muted"><span className="size-2.5 rounded-sm bg-[#004000]" />Booking olahraga</p>}
						{comproSummary && <p className="flex items-center gap-2 font-body text-[12px] text-obc-muted"><span className="size-2.5 rounded-sm bg-[#E0A526]" />Invoice perusahaan</p>}
					</div>
					{revenueChartData.length ? <div className="h-[240px] sm:h-[280px]">
						<ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueChartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
							<defs><linearGradient id="sportRevenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#004000" stopOpacity={0.24} /><stop offset="100%" stopColor="#004000" stopOpacity={0} /></linearGradient><linearGradient id="invoiceRevenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E0A526" stopOpacity={0.24} /><stop offset="100%" stopColor="#E0A526" stopOpacity={0} /></linearGradient></defs>
							<CartesianGrid vertical={false} stroke="#E2DFD2" strokeDasharray="3 3" />
							<XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6F6B6E" }} />
							<Tooltip formatter={(value, name) => [rupiah(Number(value)), name === "sportRevenue" ? "Booking olahraga" : "Invoice perusahaan"]} contentStyle={{ borderRadius: 12, border: "1px solid #E2DFD2", fontSize: 12 }} />
							{summary && <Area type="monotone" dataKey="sportRevenue" name="Booking olahraga" stroke="#004000" strokeWidth={2.5} fill="url(#sportRevenueFill)" connectNulls />}
							{comproSummary && <Area type="monotone" dataKey="invoiceRevenue" name="Invoice perusahaan" stroke="#E0A526" strokeWidth={2.5} fill="url(#invoiceRevenueFill)" connectNulls />}
						</AreaChart></ResponsiveContainer>
					</div> : <p className="py-16 text-center font-body text-[13px] text-obc-muted">{loading ? "Memuat data..." : "Belum ada data pendapatan untuk tahun ini."}</p>}
				</div>
			</section>

			<section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
				<div className={`${cardClass} min-w-0 p-4 sm:p-6`}>
					<CardTitle title="Booking per cabang olahraga" sub="Jumlah booking berdasarkan jenis olahraga" />
					{sportDistribution.length ? <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
						<div className="relative h-[190px] w-[190px] shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sportDistribution} dataKey="count" nameKey="sport" innerRadius={58} outerRadius={88} paddingAngle={2} stroke="none">{sportDistribution.map((item, index) => <Cell key={item.sport} fill={chartColors[index % chartColors.length]} />)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="font-heading text-[20px] font-bold">{summary?.kpi.totalBookings.toLocaleString("id-ID") ?? "—"}</p><p className="font-body text-[11px] text-obc-muted">Booking</p></div></div></div>
						<ul className="space-y-3 font-body text-[13px]">{sportDistribution.map((item, index) => <li key={item.sport} className="flex items-center gap-2"><span className="size-2.5 rounded-sm" style={{ background: chartColors[index % chartColors.length] }} /><span className="text-obc-muted">{item.sport}</span><span className="font-semibold">{item.count.toLocaleString("id-ID")}</span></li>)}</ul>
					</div> : <p className="py-16 text-center font-body text-[13px] text-obc-muted">{loading ? "Memuat data..." : "Belum ada data booking olahraga."}</p>}
				</div>
				<div className={`${cardClass} min-w-0 p-4 sm:p-6`}>
					<CardTitle title="Data website" sub="Aset dan akun yang tersedia" />
					<ul className="divide-y divide-obc-border">{websiteItems.map((item) => <li key={item.label} className="flex items-center gap-3 py-3"><item.icon size={17} className="text-obc-green" /><span className="flex-1 font-body text-[13px] text-obc-muted">{item.label}</span><span className="font-heading text-[15px] font-semibold">{loading && item.value === undefined ? "..." : item.value?.toLocaleString("id-ID") ?? "—"}</span></li>)}</ul>
				</div>
			</section>
		</>
	);
}