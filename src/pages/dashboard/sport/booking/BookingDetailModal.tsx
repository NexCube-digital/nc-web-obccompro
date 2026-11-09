import { useEffect, useState } from "react";
import { CalendarDays, Clock3, CreditCard, FileText, MapPin, UserRound, X } from "lucide-react";
import { sportService, type BookingStatus, type ResourceAvailability, type SportBooking, type SportBookingDetails } from "../SportService";
import type { CourtResource } from "../court/courtService";

type Props = {
	resource: CourtResource;
	slot: ResourceAvailability["slots"][number];
	bookings: SportBooking[];
	date: string;
	onClose: () => void;
};

type BookingDetailResult = {
	booking: SportBooking;
	detail: SportBookingDetails | null;
	error: string | null;
};

const bookingStatusLabels: Record<BookingStatus, string> = {
	unpaid: "Belum dibayar",
	dp_paid: "DP dibayar",
	fully_paid: "Lunas",
	completed: "Selesai",
	cancelled: "Dibatalkan",
	expired: "Kedaluwarsa",
	refund_requested: "Refund diajukan",
	refunded: "Direfund",
};

const bookingStatusClasses: Record<BookingStatus, string> = {
	unpaid: "bg-[#FBF0D3] text-[#8A6100]",
	dp_paid: "bg-[#EBEEDC] text-[#404F14]",
	fully_paid: "bg-[#E7F5D0] text-[#1F3320]",
	completed: "bg-[#CDF178] text-[#1F3320]",
	cancelled: "bg-[#FDF2F2] text-[#B42318]",
	expired: "bg-[#F1EFE8] text-obc-muted",
	refund_requested: "bg-[#FDF2F2] text-[#B42318]",
	refunded: "bg-[#F1EFE8] text-obc-muted",
};

const slotStatusLabels: Record<ResourceAvailability["slots"][number]["status"], string> = {
	available: "Tersedia",
	booked: "Terisi",
	locked: "Sedang diproses",
	maintenance: "Perawatan",
	closed: "Tutup",
};

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const formatDateTime = (value: string | null) => value ? new Date(value).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-";
const formatMoney = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const humanize = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function BookingDetailModal({ resource, slot, bookings, date, onClose }: Props) {
	const [details, setDetails] = useState<BookingDetailResult[]>([]);
	const [loading, setLoading] = useState(bookings.length > 0);

	useEffect(() => {
		let active = true;
		if (bookings.length === 0) return;
		Promise.all(bookings.map(async (booking): Promise<BookingDetailResult> => {
			try {
				const detail = await sportService.getBookingDetails(booking.id);
				return { booking, detail, error: null };
			} catch (error) {
				return { booking, detail: null, error: error instanceof Error ? error.message : "Detail booking gagal dimuat." };
			}
		})).then((results) => {
			if (active) setDetails(results);
		}).finally(() => {
			if (active) setLoading(false);
		});

		return () => { active = false; };
	}, [bookings]);

	return (
		<div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-3 sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="booking-detail-title" className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl">
				<header className="flex items-start justify-between gap-4 border-b border-obc-border px-5 py-4 sm:px-6">
					<div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">Detail booking</p><h2 id="booking-detail-title" className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal sm:text-xl">{resource.name}</h2><p className="mt-1 flex items-center gap-1.5 text-[12px] text-obc-muted"><MapPin size={13} />{resource.location?.name ?? "Lokasi belum diatur"}</p></div>
					<button type="button" aria-label="Tutup detail booking" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"><X size={18} /></button>
				</header>

				<div className="max-h-[calc(92vh-73px)] overflow-y-auto p-5 sm:p-6">
					<div className="grid gap-3 rounded-lg bg-[#F3F8E8] p-4 sm:grid-cols-3">
						<div className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0 text-obc-green" /><div><p className="text-[10px] text-obc-muted">Tanggal</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{formatDate(date)}</p></div></div>
						<div className="flex items-start gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-obc-green" /><div><p className="text-[10px] text-obc-muted">Waktu</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{slot.startTime}–{slot.endTime}</p></div></div>
						<div><p className="text-[10px] text-obc-muted">Status slot</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{slotStatusLabels[slot.status]}</p></div>
					</div>

					{loading ? <p role="status" className="py-10 text-center text-[13px] text-obc-muted">Memuat rincian booking dan pembayaran...</p> : details.length === 0 ? <div className="mt-4 rounded-lg border border-obc-border bg-[#FDFCF7] p-4"><p className="text-[13px] font-semibold text-obc-charcoal">{slotStatusLabels[slot.status]}</p><p className="mt-1 text-[12px] text-obc-muted">{slot.status === "available" ? "Belum ada booking pada jam ini." : slot.status === "locked" ? "Slot sedang diproses oleh pelanggan lain." : "Tidak ada detail booking yang tersedia untuk slot ini."}</p></div> : <div className="mt-5 space-y-6">
						{details.map(({ booking, detail, error }) => <article key={booking.id} className="space-y-4 border-b border-obc-border pb-5 last:border-0 last:pb-0">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div className="flex min-w-0 items-start gap-2.5"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-obc-ivory text-obc-green"><UserRound size={17} /></span><div className="min-w-0"><h3 className="truncate text-[14px] font-semibold text-obc-charcoal">{detail?.customer?.name ?? booking.customer?.name ?? detail?.guest?.name ?? booking.guest?.name ?? detail?.staffCreator?.name ?? booking.staffCreator?.name ?? "Walk-in / tanpa akun"}</h3><p className="mt-0.5 text-[11px] text-obc-muted">ID booking · {booking.id}</p></div></div>
								<span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${bookingStatusClasses[detail?.status ?? booking.status]}`}>{bookingStatusLabels[detail?.status ?? booking.status]}</span>
							</div>

							{error && <p role="alert" className="rounded-lg bg-[#FDF2F2] px-3 py-2 text-[12px] text-[#A53B3B]">{error}</p>}

							<section>
								<h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-obc-muted"><UserRound size={13} />Data pelanggan</h4>
									<dl className="mt-2 grid gap-x-4 gap-y-3 rounded-lg border border-obc-border p-3 text-[12px] sm:grid-cols-2">
										<div><dt className="text-[10px] text-obc-muted">Email</dt><dd className="mt-0.5 break-all font-medium text-obc-charcoal">{detail?.customer?.email ?? booking.customer?.email ?? detail?.guest?.email ?? booking.guest?.email ?? detail?.staffCreator?.email ?? booking.staffCreator?.email ?? "-"}</dd></div>
										<div><dt className="text-[10px] text-obc-muted">Telepon</dt><dd className="mt-0.5 font-medium text-obc-charcoal">{detail?.customer?.phone ?? booking.customer?.phone ?? detail?.guest?.phone ?? booking.guest?.phone ?? booking.staffCreator?.phone ?? "-"}</dd></div>
									<div><dt className="text-[10px] text-obc-muted">Dibuat oleh</dt><dd className="mt-0.5 font-medium text-obc-charcoal">{detail?.staffCreator?.name ?? booking.staffCreator?.name ?? "Pelanggan"}</dd></div>
									<div><dt className="text-[10px] text-obc-muted">Jenis booking</dt><dd className="mt-0.5 capitalize font-medium text-obc-charcoal">{humanize(detail?.sportType ?? booking.sportType)} · {humanize(detail?.bookingType ?? booking.bookingType)}</dd></div>
								</dl>
							</section>

							{detail && <>
								<section>
									<h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-obc-muted"><FileText size={13} />Informasi booking</h4>
									<dl className="mt-2 grid gap-x-4 gap-y-3 rounded-lg border border-obc-border p-3 text-[12px] sm:grid-cols-2">
										<div><dt className="text-[10px] text-obc-muted">Lapangan</dt><dd className="mt-0.5 font-medium text-obc-charcoal">{detail.resource.name}</dd></div>
										<div><dt className="text-[10px] text-obc-muted">Lokasi</dt><dd className="mt-0.5 font-medium text-obc-charcoal">{detail.resource.location ? `${detail.resource.location.name}, ${detail.resource.location.city}` : "-"}</dd></div>
										<div><dt className="text-[10px] text-obc-muted">Durasi</dt><dd className="mt-0.5 font-medium text-obc-charcoal">{detail.durationMinutes} menit</dd></div>
										<div><dt className="text-[10px] text-obc-muted">Sumber</dt><dd className="mt-0.5 capitalize font-medium text-obc-charcoal">{humanize(detail.source)}</dd></div>
										{detail.membershipSession && <div><dt className="text-[10px] text-obc-muted">Sesi membership</dt><dd className="mt-0.5 font-medium text-obc-charcoal">Sesi {detail.membershipSession.sessionNumber} · {humanize(detail.membershipSession.status)}</dd></div>}
										{detail.activeLock && <div><dt className="text-[10px] text-obc-muted">Batas proses pembayaran</dt><dd className="mt-0.5 font-medium text-obc-charcoal">{formatDateTime(detail.activeLock.lockedUntil)}</dd></div>}
									</dl>
								</section>

								<section>
									<h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-obc-muted"><CreditCard size={13} />Rincian biaya</h4>
									<div className="mt-2 divide-y divide-obc-border rounded-lg border border-obc-border px-3 text-[12px]">
										<div className="flex justify-between gap-3 py-2.5"><span className="text-obc-muted">Harga booking</span><span className="font-medium text-obc-charcoal">{formatMoney(detail.basePrice)}</span></div>
										{detail.discountAmount > 0 && <div className="flex justify-between gap-3 py-2.5"><span className="text-obc-muted">Diskon</span><span className="font-medium text-obc-green">- {formatMoney(detail.discountAmount)}</span></div>}
										<div className="flex justify-between gap-3 py-2.5"><span className="text-obc-muted">Biaya admin</span><span className="font-medium text-obc-charcoal">{formatMoney(detail.adminFee)}</span></div>
										<div className="flex justify-between gap-3 py-2.5 font-semibold"><span className="text-obc-charcoal">Total</span><span className="text-obc-charcoal">{detail.totalPriceFormatted || formatMoney(detail.totalPrice)}</span></div>
										{detail.refundedAmount > 0 && <div className="flex justify-between gap-3 py-2.5"><span className="text-obc-muted">Dana dikembalikan</span><span className="font-medium text-[#A53B3B]">{detail.refundedAmountFormatted || formatMoney(detail.refundedAmount)}</span></div>}
									</div>
								</section>

								<section>
									<h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-obc-muted"><CreditCard size={13} />Riwayat pembayaran</h4>
									{detail.payments.length ? <div className="mt-2 divide-y divide-obc-border rounded-lg border border-obc-border px-3">{detail.payments.map((payment) => <div key={payment.id} className="py-3 text-[12px]">
											<div className="flex flex-wrap justify-between gap-2"><span className="font-semibold text-obc-charcoal">{payment.totalAmountFormatted || formatMoney(payment.totalAmount)}</span><span className="rounded-full bg-obc-ivory px-2 py-0.5 text-[10px] font-medium capitalize text-obc-charcoal">{humanize(payment.status)}</span></div>
											<p className="mt-1 text-obc-muted">{humanize(payment.paymentType)}{payment.method ? ` · ${humanize(payment.method)}` : ""}</p>
											<p className="mt-1 text-[10px] text-obc-muted">Dibuat {formatDateTime(payment.createdAt)}{payment.paidAt ? ` · Dibayar ${formatDateTime(payment.paidAt)}` : ""}{payment.expiredAt ? ` · Kedaluwarsa ${formatDateTime(payment.expiredAt)}` : ""}</p>
											{payment.midtransOrderId && <p className="mt-1 break-all text-[10px] text-obc-muted">Order ID · {payment.midtransOrderId}</p>}
										</div>)}</div> : <p className="mt-2 rounded-lg border border-obc-border p-3 text-[12px] text-obc-muted">Belum ada catatan pembayaran.</p>}
								</section>

								<section className="grid gap-3 text-[11px] text-obc-muted sm:grid-cols-2">
									<p>Dibuat: {formatDateTime(detail.createdAt)}</p><p>Diperbarui: {formatDateTime(detail.updatedAt)}</p>
									{detail.paidAt && <p>Dilunasi: {formatDateTime(detail.paidAt)}</p>}{detail.completedAt && <p>Selesai: {formatDateTime(detail.completedAt)}</p>}
									{detail.cancelledAt && <p>Dibatalkan: {formatDateTime(detail.cancelledAt)}</p>}{detail.cancellationReason && <p className="sm:col-span-2">Alasan pembatalan: {detail.cancellationReason}</p>}
								</section>
								{detail.notes && <section><h4 className="text-[11px] font-bold uppercase tracking-wide text-obc-muted">Catatan</h4><p className="mt-2 whitespace-pre-line rounded-lg border border-obc-border bg-[#FDFCF7] p-3 text-[12px] leading-5 text-obc-charcoal">{detail.notes}</p></section>}
							</>}
						</article>)}
					</div>}
				</div>
			</section>
		</div>
	);
}