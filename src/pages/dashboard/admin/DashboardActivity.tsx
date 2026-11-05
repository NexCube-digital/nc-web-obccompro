import { LayoutDashboard } from "lucide-react";
import type { DashboardSummary } from "./DashboardService";

type Props = {
	bookings: DashboardSummary["recentBookings"];
	resourceDistribution: { sport: string; count: number }[] | null;
	loading: boolean;
};

const cardClass = "rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]";
const rupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
const dateLabel = (value: string) => new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
const statusLabel = (value: string) => value.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
const statusClass = (value: string) => {
	if (["fully_paid", "completed", "active"].includes(value)) return "bg-[#E7F5D0] text-[#1F3320]";
	if (["dp_paid", "pending"].includes(value)) return "bg-[#FBF0D3] text-[#8A6100]";
	if (["cancelled", "refunded", "suspended"].includes(value)) return "bg-obc-status-booked-bg text-obc-red";
	return "bg-[#EBEEDC] text-[#404F14]";
};


export default function DashboardActivity({ bookings, resourceDistribution, loading }: Props) {
	return (
		<section className="mt-4 grid gap-4 xl:grid-cols-2">
			<div className={`${cardClass} min-w-0 p-4 sm:p-6`}>
				<div className="mb-4"><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">Booking terbaru</h2><p className="mt-1 font-body text-[12px] text-obc-muted">10 booking terakhir dari OBC Sport</p></div>
				{bookings.length ? <ul className="divide-y divide-obc-border">{bookings.map((booking) => <li key={booking.id} className="flex items-center gap-3 py-3">
					<span className="grid size-10 shrink-0 place-items-center rounded-lg bg-obc-status-locked-bg text-obc-olive"><LayoutDashboard size={17} /></span>
					<div className="min-w-0 flex-1"><p className="truncate font-body text-[13px] font-semibold">{booking.customer?.name ?? "Customer tanpa akun"}</p><p className="truncate font-body text-[11px] text-obc-muted">{booking.sportType} · {booking.resource.name} · {dateLabel(booking.createdAt)}</p></div>
					<div className="shrink-0 text-right"><p className="font-body text-[12px] font-semibold">{rupiah(booking.totalPrice)}</p><span className={`mt-1 inline-block rounded-full px-2 py-0.5 font-heading text-[10px] font-semibold ${statusClass(booking.status)}`}>{statusLabel(booking.status)}</span></div>
				</li>)}</ul> : <p className="py-10 text-center font-body text-[13px] text-obc-muted">{loading ? "Memuat data..." : "Belum ada booking."}</p>}
			</div>
			<div className={`${cardClass} min-w-0 p-4 sm:p-6`}>
				<div className="mb-4"><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">Lapangan aktif per olahraga</h2><p className="mt-1 font-body text-[12px] text-obc-muted">Jumlah lapangan yang mendukung tiap jenis olahraga</p></div>
				<div className="overflow-x-auto"><table className="w-full text-left text-[12px]">
					<thead><tr className="border-b border-obc-border text-[10px] font-semibold uppercase tracking-wide text-obc-muted"><th className="pb-3">Jenis olahraga</th><th className="pb-3 text-right">Lapangan aktif</th></tr></thead>
					<tbody>{resourceDistribution?.length ? resourceDistribution.map((row) => <tr key={row.sport} className="border-b border-obc-border last:border-0"><td className="py-3 font-medium capitalize text-obc-charcoal">{row.sport.replaceAll("_", " ")}</td><td className="py-3 text-right"><span className="inline-flex min-w-8 justify-center rounded-md bg-[#F3F8E8] px-2.5 py-1 font-heading text-[12px] font-bold text-obc-green">{row.count}</span></td></tr>) : <tr><td colSpan={2} className="py-12 text-center text-[12px] text-obc-muted">{loading ? "Memuat data..." : "Belum ada lapangan aktif."}</td></tr>}</tbody>
				</table></div>
				<p className="mt-3 text-[10px] text-obc-muted">Satu lapangan dapat mendukung lebih dari satu jenis olahraga.</p>
			</div>
		</section>
	);
}