import { useEffect, type ReactNode } from "react";
import { Building2, CalendarDays, Clock3, ExternalLink, MapPin, Pencil, Phone, Power, PowerOff, X } from "lucide-react";
import { getMediaUrl } from "../../v2/media/mediaService";
import type { BusinessUnitDetail } from "./unitbisnisService";

type Props = { unit: BusinessUnitDetail; onClose: () => void; onEdit: () => void; onToggleStatus: () => void };

const tenantTypeLabels = { sport: "Sport", event: "Event", fnb: "Food & Beverage", other: "Lainnya" };
const resourceTypeLabels = { court: "Lapangan", hall: "Aula", field: "Field", room: "Ruangan" };

function stringList(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function minutesToTime(minutes: number) {
	const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
	const mins = (minutes % 60).toString().padStart(2, "0");
	return `${hours}:${mins}`;
}

function formatJson(value: unknown) {
	if (value === null || value === undefined || value === "") return "-";
	if (typeof value === "string") return value;
	try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
	return <div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">{label}</dt><dd className="mt-1 break-words text-[12px] font-medium leading-5 text-obc-charcoal">{children}</dd></div>;
}

export default function BusinessUnitDetails({ unit, onClose, onEdit, onToggleStatus }: Props) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const config = typeof unit.config === "object" && unit.config !== null ? unit.config as Record<string, unknown> : {};
	const tags = stringList(config.tags);
	const locationInfo = stringList(config.locationInfo);
	const imageUrl = typeof config.imageUrl === "string" ? config.imageUrl : "";

	return (
		<div className="fixed inset-0 z-[70] grid place-items-center bg-[#172119]/65 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="business-unit-detail-title" className="flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(24,28,24,0.3)]">
				<header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-obc-border bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
					<div className="flex min-w-0 items-center gap-3">
						<span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Building2 size={18} /></span>
						<div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-widest text-obc-olive">CMS / Unit bisnis</p><h2 id="business-unit-detail-title" className="mt-0.5 truncate font-heading text-lg font-bold text-obc-charcoal">{unit.name}</h2><p className="mt-0.5 truncate font-mono text-[10px] text-obc-muted">/{unit.slug}</p></div>
					</div>
					<button type="button" onClick={onClose} aria-label="Tutup detail" className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal"><X size={17} /></button>
				</header>

				<div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#FAFBF8] p-4 sm:p-5">
					<div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
						<div className="relative aspect-[16/10] min-h-40 overflow-hidden rounded-lg bg-[#172119]">
							{imageUrl ? <img src={getMediaUrl(imageUrl)} alt={unit.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-white/60"><div className="text-center"><Building2 size={30} className="mx-auto" /><p className="mt-2 text-[10px] font-semibold uppercase tracking-widest">Gambar belum tersedia</p></div></div>}
							<div className="absolute inset-0 bg-gradient-to-t from-[#101812]/85 via-transparent to-transparent" />
							<div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-3.5">
								<div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-widest text-white/70">{tenantTypeLabels[unit.tenantType]}</p><p className="mt-0.5 truncate font-heading text-[15px] font-bold text-white">{typeof config.title === "string" && config.title ? config.title : unit.name}</p></div>
								<span className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-bold ${unit.status === "active" ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-white/90 text-obc-muted"}`}>{unit.status === "active" ? "Aktif" : "Nonaktif"}</span>
							</div>
						</div>
						<div className="flex flex-col gap-3 rounded-lg border border-obc-border bg-white p-4">
							<div><p className="text-[10px] font-semibold uppercase tracking-widest text-obc-muted">Informasi dasar</p><p className="mt-2 text-[12px] leading-5 text-obc-charcoal">{unit.description || "Tidak ada deskripsi"}</p></div>
							<div className="grid grid-cols-2 gap-2 border-t border-obc-border pt-3">
								<div className="rounded-md bg-[#F7F8F3] p-2.5"><p className="text-[10px] text-obc-muted">Lokasi</p><p className="mt-0.5 font-heading text-[17px] font-bold text-obc-charcoal">{unit.locations.length}</p></div>
								<div className="rounded-md bg-[#F7F8F3] p-2.5"><p className="text-[10px] text-obc-muted">Resource</p><p className="mt-0.5 font-heading text-[17px] font-bold text-obc-charcoal">{unit.resources.length}</p></div>
							</div>
							<dl className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-obc-border pt-3">
								<DetailField label="Jenis unit">{tenantTypeLabels[unit.tenantType]}</DetailField>
								<DetailField label="ID unit"><span className="font-mono text-[10px]">{unit.id}</span></DetailField>
								<DetailField label="Dibuat">{new Date(unit.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</DetailField>
								<DetailField label="Diperbarui">{new Date(unit.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</DetailField>
							</dl>
						</div>
					</div>

					<section className="rounded-lg border border-obc-border bg-white p-4">
						<div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-obc-muted">Konten publik</p><h3 className="mt-0.5 font-heading text-[14px] font-semibold text-obc-charcoal">Konfigurasi kartu</h3></div><span className="rounded-md bg-[#F1EFE8] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-obc-olive">CMS</span></div>
						<dl className="mt-3 grid gap-x-4 gap-y-3 border-t border-obc-border pt-3 sm:grid-cols-2">
							<DetailField label="Judul kartu">{typeof config.title === "string" ? config.title || "-" : "-"}</DetailField>
							<DetailField label="Kategori kartu">{typeof config.category === "string" ? config.category || "-" : "-"}</DetailField>
							<div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">Tag</dt><dd className="mt-1 flex flex-wrap gap-1.5">{tags.length ? tags.map((tag) => <span key={tag} className="rounded-md bg-[#F3F8E8] px-2 py-1 text-[10px] font-medium text-obc-green">{tag}</span>) : <span className="text-[12px] text-obc-charcoal">-</span>}</dd></div>
							<DetailField label="Alamat lokasi">{typeof config.locationAddress === "string" ? config.locationAddress || "-" : "-"}</DetailField>
							<div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">Google Maps</dt><dd className="mt-1 break-all text-[12px] font-medium">{typeof config.locationMapUrl === "string" && config.locationMapUrl ? <a href={config.locationMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-obc-green hover:underline"><span className="truncate">Buka tautan peta</span><ExternalLink size={12} /></a> : "-"}</dd></div>
							<div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">Tampil di situs</dt><dd className="mt-1 flex flex-wrap gap-1.5">{config.showOnSport !== false && <span className="rounded-md bg-[#E7F5D0] px-2 py-1 text-[10px] font-semibold text-[#1F3320]">Sport OBC</span>}{config.showOnCompro !== false && <span className="rounded-md bg-[#E8F0F3] px-2 py-1 text-[10px] font-semibold text-[#31556C]">Compro OBC</span>}{config.showOnSport === false && config.showOnCompro === false && <span className="text-[12px] text-obc-charcoal">Tidak ditampilkan</span>}</dd></div>
							<div className="sm:col-span-2"><dt className="text-[10px] font-semibold uppercase tracking-wide text-obc-muted">Informasi lokasi</dt><dd className="mt-1 whitespace-pre-line text-[12px] leading-5 text-obc-charcoal">{locationInfo.join("\n") || "-"}</dd></div>
						</dl>
						<details className="mt-3 border-t border-obc-border pt-3">
							<summary className="cursor-pointer text-[11px] font-semibold text-obc-green">Lihat konfigurasi tambahan</summary>
							<pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-[#F7F8F3] p-3 font-mono text-[10px] leading-4 text-obc-charcoal">{formatJson(config)}</pre>
						</details>
					</section>

					<section>
						<div className="mb-2 flex items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-obc-muted">Lokasi</p><h3 className="mt-0.5 font-heading text-[14px] font-semibold text-obc-charcoal">{unit.locations.length} titik lokasi</h3></div></div>
						{unit.locations.length ? <div className="grid gap-2 sm:grid-cols-2">{unit.locations.map((location) => (
							<article key={location.id} className="rounded-lg border border-obc-border bg-white p-3.5">
								<div className="flex items-start justify-between gap-2"><p className="flex min-w-0 items-start gap-2 text-[12px] font-semibold text-obc-charcoal"><MapPin size={14} className="mt-0.5 shrink-0 text-obc-green" /><span className="break-words">{location.name}</span></p><span className="shrink-0 rounded-md bg-[#F3F8E8] px-1.5 py-0.5 text-[9px] font-semibold capitalize text-obc-green">{location.status}</span></div>
								<p className="mt-2 text-[11px] leading-4 text-obc-muted">{[location.address, location.city, location.province, location.postalCode].filter(Boolean).join(", ") || "Alamat belum tersedia"}</p>
								{location.phone && <p className="mt-2 flex items-center gap-1.5 text-[11px] text-obc-muted"><Phone size={12} />{location.phone}</p>}
								<div className="mt-2 grid grid-cols-2 gap-2 border-t border-obc-border pt-2 text-[10px] text-obc-muted"><span>Koordinat: {location.latitude ?? "-"}, {location.longitude ?? "-"}</span><span className="inline-flex items-center gap-1"><Clock3 size={11} />{formatJson(location.operatingHours)}</span></div>
								<p className="mt-1 break-all font-mono text-[9px] text-obc-muted">ID {location.id}</p>
							</article>
						))}</div> : <p className="rounded-lg border border-dashed border-obc-border bg-white px-4 py-6 text-center text-[12px] text-obc-muted">Belum ada lokasi aktif.</p>}
					</section>

					<section>
						<div className="mb-2 flex items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-widest text-obc-muted">Fasilitas</p><h3 className="mt-0.5 font-heading text-[14px] font-semibold text-obc-charcoal">{unit.resources.length} resource</h3></div></div>
						{unit.resources.length ? <div className="grid gap-3 md:grid-cols-2">{unit.resources.map((resource) => {
							const gallery = stringList(resource.gallery);
							const amenities = stringList(resource.amenities);
							return <article key={resource.id} className="overflow-hidden rounded-lg border border-obc-border bg-white">
								<div className="relative aspect-[16/8] overflow-hidden bg-[#172119]">
									{resource.imageUrl ? <img src={getMediaUrl(resource.imageUrl)} alt={resource.name} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-[11px] text-white/60"><Building2 size={20} /><span className="mt-1">Tidak ada gambar</span></div>}
									<span className="absolute right-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[9px] font-semibold capitalize text-obc-charcoal">{resource.status}</span>
								</div>
								<div className="p-3.5">
									<div className="flex items-start justify-between gap-2"><div className="min-w-0"><h4 className="truncate font-heading text-[13px] font-semibold text-obc-charcoal">{resource.name}</h4><p className="mt-0.5 truncate font-mono text-[9px] text-obc-muted">/{resource.slug}</p></div><span className="shrink-0 rounded-md bg-[#F3F8E8] px-2 py-1 text-[9px] font-semibold text-obc-green">{resourceTypeLabels[resource.resourceType]}</span></div>
									<p className="mt-2 line-clamp-2 min-h-8 text-[11px] leading-4 text-obc-muted">{resource.description || "Tidak ada deskripsi"}</p>
									<dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-obc-border pt-2.5 text-[10px]">
										<DetailField label="Olahraga">{resource.sportTypes.join(", ") || "-"}</DetailField>
										<DetailField label="Kapasitas / slot">{resource.capacity ?? "-"} · {resource.slotMinutes} mnt</DetailField>
										<DetailField label="Lokasi">{unit.locations.find((location) => location.id === resource.locationId)?.name ?? "-"}</DetailField>
										<DetailField label="Fasilitas">{amenities.join(", ") || "-"}</DetailField>
									</dl>
									{resource.schedules.length > 0 && <p className="mt-2 text-[10px] leading-4 text-obc-muted">Jadwal: {resource.schedules.map((schedule) => `${schedule.dayOfWeek}: ${schedule.isClosed ? "Tutup" : `${minutesToTime(schedule.openMinute)}-${minutesToTime(schedule.closeMinute)}`}`).join(" · ")}</p>}
									{gallery.length > 0 && <div className="mt-2 flex gap-1.5 overflow-x-auto">{gallery.map((image, index) => <img key={`${image}-${index}`} src={getMediaUrl(image)} alt={`${resource.name} galeri ${index + 1}`} loading="lazy" decoding="async" className="size-12 shrink-0 rounded-md object-cover" />)}</div>}
									<p className="mt-2 break-all font-mono text-[9px] text-obc-muted">ID {resource.id}</p>
								</div>
							</article>;
						})}</div> : <p className="rounded-lg border border-dashed border-obc-border bg-white px-4 py-6 text-center text-[12px] text-obc-muted">Belum ada resource aktif.</p>}
					</section>
				</div>
				<footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-obc-border bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
					<button type="button" onClick={onToggleStatus} className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-[12px] font-semibold transition-colors ${unit.status === "active" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-obc-border text-obc-charcoal hover:bg-obc-ivory"}`}>{unit.status === "active" ? <><PowerOff size={14} />Nonaktifkan unit</> : <><Power size={14} />Aktifkan unit</>}</button>
					<button type="button" onClick={onEdit} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-obc-green-hover"><Pencil size={14} />Edit unit</button>
				</footer>
			</section>
		</div>
	);
}