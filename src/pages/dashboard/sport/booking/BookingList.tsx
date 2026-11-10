import { useState } from "react";
import { Clock3, MapPin } from "lucide-react";
import { sportOptions } from "../../services/sport/courtService";
import type { ResourceAvailability, SportBooking, SportType } from "../../services/sport/SportService";
import type { CourtResource } from "../../services/sport/courtService";
import BookingDetailModal from "./BookingDetailModal";
import FullDayBookingModal from "./FullDayBookingModal";

type SelectedSlot = {
	resource: CourtResource;
	slot: ResourceAvailability["slots"][number];
	bookings: SportBooking[];
};

type Props = {
	resources: CourtResource[];
	availability: Record<string, ResourceAvailability>;
	bookings: SportBooking[];
	loading: boolean;
	selectedDate: string;
	onBookingCreated: () => void;
};

const slotStatusLabels: Record<ResourceAvailability["slots"][number]["status"], string> = {
	available: "Tersedia",
	booked: "Terisi",
	locked: "Sedang diproses",
	maintenance: "Perawatan",
	closed: "Tutup",
};

const toMinutes = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	return hour * 60 + minute;
};

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const sportLabel = (value: string) => sportOptions.find((option) => option.value === value)?.label ?? value.replaceAll("_", " ");

export default function BookingList({ resources, availability, bookings, loading, selectedDate, onBookingCreated }: Props) {
	const [selectedSport, setSelectedSport] = useState("");
	const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
	const [fullDayTarget, setFullDayTarget] = useState<{ resource: CourtResource; startTime: string; endTime: string; sportType: SportType } | null>(null);
	const sports = Array.from(new Set(resources.flatMap((resource) => resource.sportTypes))).map((value) => ({ value, label: sportLabel(value) }));
	const activeSport = sports.find((sport) => sport.value === selectedSport)?.value ?? sports[0]?.value;
	const sportResources = resources.filter((resource) => activeSport && resource.sportTypes.includes(activeSport));

	const openSlot = (resource: CourtResource, slot: ResourceAvailability["slots"][number]) => {
		const slotStart = toMinutes(slot.startTime);
		const slotEnd = toMinutes(slot.endTime);
		const relatedBookings = bookings.filter((booking) => {
			if (booking.resource.id !== resource.id || ["cancelled", "expired", "refunded"].includes(booking.status)) return false;
			return toMinutes(booking.startTime) < slotEnd && toMinutes(booking.endTime) > slotStart;
		});
		setSelectedSlot({ resource, slot, bookings: relatedBookings });
	};

	return (
		<>
			<section className="space-y-4">
				<div className="flex flex-wrap items-end justify-between gap-3">
					<div><p className="text-[11px] font-semibold uppercase tracking-wide text-obc-green">Jadwal lapangan</p><h2 className="mt-1 font-heading text-lg font-bold text-obc-charcoal">{selectedDate ? formatDate(selectedDate) : "Pilih tanggal"}</h2></div>
					{selectedDate && <p className="text-[12px] text-obc-muted">{bookings.length.toLocaleString("id-ID")} booking pada tanggal ini</p>}
				</div>

				{sports.length > 0 && <div role="tablist" aria-label="Kategori olahraga" className="flex gap-2 overflow-x-auto border-b border-obc-border pb-2">
					{sports.map((sport) => <button key={sport.value} type="button" role="tab" aria-selected={activeSport === sport.value} onClick={() => setSelectedSport(sport.value)} className={`shrink-0 rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors ${activeSport === sport.value ? "border-obc-green bg-[#E7F5D0] text-obc-green" : "border-obc-border bg-white text-obc-muted hover:border-obc-green hover:text-obc-charcoal"}`}>{sport.label}</button>)}
				</div>}

				{loading ? <div role="status" className="rounded-xl border border-obc-border bg-white px-4 py-12 text-center text-[13px] text-obc-muted">Memuat jadwal lapangan...</div> : !selectedDate ? <div className="rounded-xl border border-obc-border bg-white px-4 py-12 text-center text-[13px] text-obc-muted">Pilih tanggal untuk melihat jadwal lapangan.</div> : !sportResources.length ? <div className="rounded-xl border border-obc-border bg-white px-4 py-12 text-center text-[13px] text-obc-muted">Belum ada lapang untuk kategori ini.</div> : <div className="space-y-3">
					{sportResources.map((resource) => {
						const schedule = availability[resource.id];
						const openingMinute = schedule?.operatingHours ? toMinutes(schedule.operatingHours.openTime) : 0;
						const interval = Math.max(resource.slotMinutes, 15);
						const slots = schedule?.slots.filter((slot) => (toMinutes(slot.startTime) - openingMinute) % interval === 0) ?? [];
						return <article key={resource.id} className="overflow-hidden rounded-xl border border-obc-border bg-white">
							<header className="flex flex-wrap items-center justify-between gap-2 border-b border-obc-border px-4 py-3 sm:px-5">
								<div className="min-w-0"><h3 className="truncate text-[14px] font-semibold text-obc-charcoal">{resource.name}</h3>{resource.location && <p className="mt-0.5 flex items-center gap-1 text-[11px] text-obc-muted"><MapPin size={12} />{resource.location.name}</p>}</div>
								<div className="flex flex-wrap items-center gap-2">{schedule?.operatingHours && <p className="whitespace-nowrap text-[11px] text-obc-muted">Jam operasional {schedule.operatingHours.openTime}–{schedule.operatingHours.closeTime}</p>}<button type="button" disabled={!schedule?.operatingHours || schedule.isClosed || !activeSport} onClick={() => schedule?.operatingHours && activeSport && setFullDayTarget({ resource, startTime: schedule.operatingHours.openTime, endTime: schedule.operatingHours.closeTime, sportType: activeSport as SportType })} className="h-8 rounded-lg border border-obc-green px-3 text-[11px] font-semibold text-obc-green transition-colors hover:bg-[#E7F5D0] disabled:cursor-not-allowed disabled:opacity-40">Full booking</button></div>
							</header>
							<div className="p-4 sm:px-5">
								{!schedule ? <p className="text-[12px] text-obc-muted">Jadwal lapangan tidak tersedia.</p> : schedule.isClosed || slots.length === 0 ? <p className="text-[12px] text-obc-muted">Tidak ada jadwal pada tanggal ini.</p> : <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
									{slots.map((slot) => <button key={slot.startTime} type="button" onClick={() => openSlot(resource, slot)} title={`${slotStatusLabels[slot.status]} · ${slot.startTime}–${slot.endTime}`} className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border text-[12px] font-semibold transition-colors ${slot.status === "available" ? "border-obc-border bg-[#F3F8E8] text-obc-green hover:border-obc-green hover:bg-obc-green hover:text-white" : slot.status === "booked" ? "border-[#EBCBC7] bg-[#FDF2F2] text-[#A53B3B] hover:border-[#B42318]" : "border-obc-border bg-[#F1EFE8] text-obc-muted hover:border-obc-green"}`}><Clock3 size={13} />{slot.startTime}</button>)}
								</div>}
								{schedule && <div className="mt-3 flex flex-wrap gap-3 border-t border-obc-border pt-3 text-[10px] text-obc-muted"><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#F3F8E8] ring-1 ring-obc-border" />Tersedia</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#FDF2F2] ring-1 ring-[#EBCBC7]" />Terisi</span><span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#F1EFE8] ring-1 ring-obc-border" />Diproses / tutup</span></div>}
							</div>
						</article>;
					})}
				</div>}
			</section>

			{selectedSlot && <BookingDetailModal resource={selectedSlot.resource} slot={selectedSlot.slot} bookings={selectedSlot.bookings} date={selectedDate} onClose={() => setSelectedSlot(null)} />}
			{fullDayTarget && <FullDayBookingModal resource={fullDayTarget.resource} date={selectedDate} startTime={fullDayTarget.startTime} endTime={fullDayTarget.endTime} sportType={fullDayTarget.sportType} onClose={() => setFullDayTarget(null)} onCreated={onBookingCreated} />}
		</>
	);
}