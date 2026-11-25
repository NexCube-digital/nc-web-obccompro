import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, Clock3, MapPin, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { sportService, type BookingCalendarItem, type ResourceAvailability, type SportBookingDetails } from "../../services/sport/SportService";
import type { CourtResource } from "../../services/sport/courtService";
import { formatBookingDate, toLocalDateKey } from "../../../../utils/formatters";
import BookingCalendar from "./BookingCalendar";

type Props = {
	resource: CourtResource;
	booking: BookingCalendarItem;
	detail: SportBookingDetails;
	slotStatusLabel: string;
	bookingStatusLabel: string;
	onClose: () => void;
	onUpdated: () => void;
};

const toMinutes = (value: string) => {
	const [hour, minute] = value.split(":").map(Number);
	return hour * 60 + minute;
};

const toTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function getAvailableStartTimes(availability: ResourceAvailability, durationMinutes: number, selectedDate: string, detail: SportBookingDetails) {
	const interval = Math.max(availability.startIntervalMinutes, 1);
	const slotsByStart = new Map(availability.slots.map((item) => [toMinutes(item.startTime), item]));
	return availability.slots
		.filter((item) => {
			const start = toMinutes(item.startTime);
			if (selectedDate === detail.bookingDate && item.startTime === detail.startTime) return true;
			const end = start + durationMinutes;
			if (end > 24 * 60) return false;
			for (let minute = start; minute < end; minute += interval) {
				if (slotsByStart.get(minute)?.status !== "available") return false;
			}
			return true;
		})
		.map((item) => item.startTime);
}

function isPastStartTime(time: string, selectedDate: string, now: Date) {
	return selectedDate === toLocalDateKey(now) && toMinutes(time) <= now.getHours() * 60 + now.getMinutes();
}

export default function BookingUpdateModal({ resource, booking, detail, slotStatusLabel, bookingStatusLabel, onClose, onUpdated }: Props) {
	const [selectedDate, setSelectedDate] = useState(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const originalDate = new Date(`${detail.bookingDate}T00:00:00`);
		return toLocalDateKey(originalDate < today ? today : originalDate);
	});
	const [visibleMonth, setVisibleMonth] = useState(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const originalDate = new Date(`${detail.bookingDate}T00:00:00`);
		return originalDate < today ? today : originalDate;
	});
	const [startTime, setStartTime] = useState(detail.startTime);
	const [reason, setReason] = useState("");
	const [error, setError] = useState("");
	const [availabilityError, setAvailabilityError] = useState("");
	const [availability, setAvailability] = useState<ResourceAvailability | null>(null);
	const [loadingAvailability, setLoadingAvailability] = useState(true);
	const [saving, setSaving] = useState(false);
	const [now, setNow] = useState(() => new Date());
	const availableTimes = availability
		? getAvailableStartTimes(availability, detail.durationMinutes, selectedDate, detail)
		: [];
	const selectableTimes = availableTimes.filter((time) => !isPastStartTime(time, selectedDate, now));
	const selectedStartTime = selectableTimes.includes(startTime) ? startTime : selectableTimes[0] ?? "";

	useEffect(() => {
		const timer = window.setInterval(() => setNow(new Date()), 30_000);
		return () => window.clearInterval(timer);
	}, []);

	useEffect(() => {
		let active = true;
		sportService.getResourceAvailability(resource.id, selectedDate, false)
			.then((result) => {
				if (!active) return;
				setAvailability(result);
				const startTimes = getAvailableStartTimes(result, detail.durationMinutes, selectedDate, detail);
				setStartTime((current) => startTimes.includes(current) ? current : startTimes[0] ?? "");
			})
			.catch((loadError: unknown) => {
				if (active) setAvailabilityError(loadError instanceof Error ? loadError.message : "Jadwal pada tanggal tersebut gagal dimuat.");
			})
			.finally(() => {
				if (active) setLoadingAvailability(false);
			});
		return () => { active = false; };
	}, [detail, resource.id, selectedDate]);

	const changeDate = (value: string) => {
		setSelectedDate(value);
		setAvailability(null);
		setLoadingAvailability(true);
		setAvailabilityError("");
	};

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");
		const currentTime = new Date();
		const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
		if (!selectedStartTime || (selectedDate === toLocalDateKey(currentTime) && toMinutes(selectedStartTime) <= currentMinutes)) {
			setNow(currentTime);
			setError("Pilih jam yang akan datang dan masih tersedia.");
			return;
		}
		setSaving(true);
		try {
			const result = await sportService.rescheduleBooking(booking.id, {
				bookingDate: selectedDate,
				startTime: selectedStartTime,
				endTime: toTime(toMinutes(selectedStartTime) + detail.durationMinutes),
				reason: reason.trim() || undefined,
			});
			toast.success(result.message);
			onUpdated();
			onClose();
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Jadwal booking gagal diperbarui.");
		} finally {
			setSaving(false);
		}
	};

	const customerName = detail.customer?.name ?? detail.guest?.name ?? detail.staffCreator?.name ?? "Walk-in / tanpa akun";
	const location = resource.location
		? `${resource.location.name} (${resource.location.address || resource.location.city})`
		: detail.resource.location?.name ?? "Lokasi belum diatur";

	return (
		<div className="fixed inset-0 z-60 flex justify-center overflow-y-auto bg-transparent p-3 sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="booking-update-title" className="my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
				<header className="flex shrink-0 items-start justify-between gap-4 border-b border-obc-border px-5 py-4 sm:px-6">
					<div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">Detail booking</p><h2 id="booking-update-title" className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal sm:text-xl">{resource.name}</h2><p className="mt-1 flex items-center gap-1.5 text-[12px] text-obc-muted"><MapPin size={13} />{location}</p></div>
					<button type="button" aria-label="Tutup jadwalkan ulang" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"><X size={18} /></button>
				</header>

				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
					<div className="grid gap-3 rounded-lg bg-[#F3F8E8] p-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="flex items-start gap-2"><CalendarDays size={15} className="mt-0.5 shrink-0 text-obc-green" /><div><p className="text-[10px] text-obc-muted">Tanggal</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{formatBookingDate(detail.bookingDate)}</p></div></div>
						<div className="flex items-start gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-obc-green" /><div><p className="text-[10px] text-obc-muted">Waktu</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{detail.startTime}–{detail.endTime}</p></div></div>
						<div><p className="text-[10px] text-obc-muted">Status slot</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{slotStatusLabel}</p></div>
						<div><p className="text-[10px] text-obc-muted">Status booking</p><p className="mt-0.5 text-[12px] font-semibold text-obc-charcoal">{bookingStatusLabel}</p></div>
					</div>
					<div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-obc-border px-3 py-2.5">
						<div className="flex items-center gap-2 text-[12px] font-semibold text-obc-charcoal"><UserRound size={15} className="text-obc-green" />{customerName}</div>
						<p className="break-all text-[11px] text-obc-muted">ID booking · {booking.id}</p>
					</div>

					<form onSubmit={(event) => { void submit(event); }} className="mt-5 space-y-4 border-t border-obc-border pt-4">
						<div className="flex items-center gap-2"><CalendarDays size={16} className="text-obc-green" /><h3 className="text-[13px] font-semibold text-obc-charcoal">Jadwalkan ulang</h3></div>
						<div className="grid items-start gap-4 lg:grid-cols-[minmax(260px,0.85fr)_minmax(0,1.15fr)]">
							<div><BookingCalendar selectedDate={selectedDate} onDateChange={changeDate} visibleMonth={visibleMonth} onVisibleMonthChange={setVisibleMonth} minDate={new Date(new Date().setHours(0, 0, 0, 0))} showClearAction={false} compact emptyDateLabel="Pilih tanggal baru" /></div>
							<div className="min-w-0 overflow-hidden rounded-xl border border-obc-border bg-white">
								<div className="flex items-center justify-between gap-3 border-b border-obc-border bg-[#FDFCF7] px-3 py-2.5">
									<div className="flex min-w-0 items-center gap-2"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Clock3 size={15} /></span><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">Pilih jam mulai</p><p className="text-[10px] text-obc-muted">Durasi {detail.durationMinutes} menit</p></div></div>
									{selectedStartTime && <span className="shrink-0 rounded-md bg-obc-green px-2.5 py-1 text-[12px] font-bold text-white">{selectedStartTime}</span>}
								</div>
								<div className="p-3">
									{loadingAvailability ? <p role="status" className="rounded-lg bg-[#FDFCF7] px-3 py-8 text-center text-[12px] text-obc-muted">Memeriksa slot tersedia...</p> : availabilityError ? <p role="alert" className="rounded-lg bg-[#FDF2F2] px-3 py-3 text-[12px] text-[#A53B3B]">{availabilityError}</p> : !availableTimes.length ? <p className="rounded-lg bg-[#FDFCF7] px-3 py-8 text-center text-[12px] text-obc-muted">Tidak ada jam mulai yang tersedia untuk durasi ini.</p> : <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">{availableTimes.map((time) => { const isPast = isPastStartTime(time, selectedDate, now); const isSelected = selectedStartTime === time; return <button key={time} type="button" disabled={isPast} aria-pressed={isSelected} aria-label={isPast ? `${time}, sudah lewat` : time} onClick={() => setStartTime(time)} className={`h-9 rounded-lg border text-[11px] font-semibold transition-colors ${isPast ? "cursor-not-allowed border-red-300 bg-red-50 text-red-600" : isSelected ? "border-obc-green bg-obc-green text-white shadow-sm" : "border-obc-border bg-white text-obc-charcoal hover:border-obc-green hover:bg-[#F3F8E8]"}`}>{time}</button>; })}</div>}
								</div>
							</div>
						</div>
						<label className="block text-[11px] font-medium text-obc-charcoal">Alasan (opsional)<input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} className="mt-1 h-9 w-full rounded-md border border-obc-border bg-white px-2 text-[12px] outline-none focus:border-obc-green" /></label>
						{error && <p role="alert" className="rounded-md bg-[#FDF2F2] px-3 py-2 text-[11px] text-[#A53B3B]">{error}</p>}
						<div className="flex justify-end gap-2 border-t border-obc-border pt-4">
							<button type="button" disabled={saving} onClick={onClose} className="h-9 rounded-lg border border-obc-border px-3 text-[11px] font-semibold text-obc-muted disabled:opacity-50">Batal</button>
							<button type="submit" disabled={saving || loadingAvailability || !selectedStartTime} className="h-9 rounded-lg bg-obc-green px-3 text-[11px] font-semibold text-white hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan jadwal"}</button>
						</div>
					</form>
				</div>
			</section>
		</div>
	);
}
