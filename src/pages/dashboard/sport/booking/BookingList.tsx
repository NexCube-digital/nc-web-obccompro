import { CalendarDays, Search } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ThemedSelect from "../../components/common/ThemedSelect";
import type { BookingStatus, SportBooking } from "../SportService";

type Props = {
	bookings: SportBooking[];
	loading: boolean;
	selectedDate: string;
	status: BookingStatus | "all";
	search: string;
	meta: { page: number; limit: number; total: number; totalPages: number };
	onSearchChange: (search: string) => void;
	onStatusChange: (status: BookingStatus | "all") => void;
	onPageChange: (page: number) => void;
};

const bookingStatuses: BookingStatus[] = ["unpaid", "dp_paid", "fully_paid", "completed", "cancelled", "expired", "refund_requested", "refunded"];
const statusLabels: Record<BookingStatus, string> = {
	unpaid: "Belum dibayar",
	dp_paid: "DP dibayar",
	fully_paid: "Lunas",
	completed: "Selesai",
	cancelled: "Dibatalkan",
	expired: "Kedaluwarsa",
	refund_requested: "Refund diajukan",
	refunded: "Direfund",
};
const statusClasses: Record<BookingStatus, string> = {
	unpaid: "bg-[#FBF0D3] text-[#8A6100]",
	dp_paid: "bg-[#EBEEDC] text-[#404F14]",
	fully_paid: "bg-[#E7F5D0] text-[#1F3320]",
	completed: "bg-[#CDF178] text-[#1F3320]",
	cancelled: "bg-[#FDF2F2] text-[#B42318]",
	expired: "bg-[#F1EFE8] text-obc-muted",
	refund_requested: "bg-[#FDF2F2] text-[#B42318]",
	refunded: "bg-[#F1EFE8] text-obc-muted",
};
const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
const formatMoney = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export default function BookingList({ bookings, loading, selectedDate, status, search, meta, onSearchChange, onStatusChange, onPageChange }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border p-4 sm:p-5">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
					<div><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar booking</h2><p className="mt-0.5 text-[12px] text-obc-muted">{selectedDate ? formatDate(selectedDate) : "Pilih tanggal untuk menampilkan jadwal"}</p></div>
					{selectedDate && <p className="text-[12px] text-obc-muted">{meta.total.toLocaleString("id-ID")} booking</p>}
				</div>
				<div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_190px]">
					<label className="block text-[12px] font-medium text-obc-charcoal">Cari booking<span className="relative mt-1 block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => onSearchChange(event.target.value)} disabled={!selectedDate} placeholder={selectedDate ? "Nama, email, catatan..." : "Pilih tanggal terlebih dahulu"} className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-obc-green focus:ring-2 focus:ring-[#CDF178] disabled:cursor-not-allowed disabled:opacity-60" /></span></label>
					<label className="block text-[12px] font-medium text-obc-charcoal">Status
						<ThemedSelect
							label="Filter status booking"
							value={status}
							options={[{ value: "all", label: "Semua status" }, ...bookingStatuses.map((item) => ({ value: item, label: statusLabels[item] }))]}
							onValueChange={(value) => onStatusChange(value as BookingStatus | "all")}
							disabled={!selectedDate}
							className="mt-1 h-10 w-full text-[13px]"
						/>
					</label>
				</div>
			</div>

			{!selectedDate ? <div className="grid min-h-56 place-items-center px-5 py-10 text-center"><div className="max-w-sm"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-obc-ivory text-obc-green"><CalendarDays size={20} /></span><p className="mt-3 text-[13px] font-medium text-obc-charcoal">Jadwal belum dipilih</p><p className="mt-1 text-[12px] leading-5 text-obc-muted">Pilih tanggal di panel sebelah kiri untuk melihat daftar booking.</p></div></div> : <>
				<div className="overflow-x-auto"><table className="w-full min-w-225 text-left text-[13px]">
					<thead><tr className="bg-[#FDFCF7] text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-4 py-3">Pelanggan</th><th className="px-4 py-3">Lapangan</th><th className="px-4 py-3">Jam</th><th className="px-4 py-3 text-right">Pembayaran</th><th className="px-4 py-3">Status</th></tr></thead>
					<tbody>
						{loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Memuat booking...</td></tr> : bookings.length ? bookings.map((booking) => <tr key={booking.id} className="border-t border-obc-border align-top transition-colors hover:bg-[#FDFCF7]">
							<td className="px-4 py-3"><p className="font-semibold text-obc-charcoal">{booking.customer?.name ?? "Walk-in / tanpa akun"}</p><p className="text-[11px] text-obc-muted">{booking.customer?.email ?? booking.staffCreator?.email ?? "-"}</p></td>
							<td className="px-4 py-3"><p className="font-medium text-obc-charcoal">{booking.resource.name}</p><p className="text-[11px] capitalize text-obc-muted">{booking.sportType.replaceAll("_", " ")} · {booking.bookingType}</p></td>
							<td className="whitespace-nowrap px-4 py-3"><p className="font-semibold text-obc-charcoal">{booking.startTime}–{booking.endTime}</p><p className="text-[11px] text-obc-muted">{booking.durationMinutes} menit</p></td>
							<td className="whitespace-nowrap px-4 py-3 text-right"><p className="font-semibold text-obc-charcoal">{booking.totalPriceFormatted || formatMoney(booking.totalPrice)}</p><p className="text-[11px] capitalize text-obc-muted">{booking.latestPayment?.status ?? booking.status}</p></td>
							<td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[booking.status]}`}>{statusLabels[booking.status]}</span></td>
						</tr>) : <tr><td colSpan={5} className="px-4 py-12 text-center text-obc-muted">Tidak ada booking pada tanggal dan filter ini.</td></tr>}
					</tbody>
				</table></div>
				<Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={onPageChange} totalItems={meta.total} pageSize={meta.limit} itemLabel="booking" disabled={loading} className="flex flex-col gap-3 border-t border-obc-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5" />
			</>}
		</section>
	);
}