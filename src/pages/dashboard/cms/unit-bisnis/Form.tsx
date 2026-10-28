import { useEffect } from "react";
import { MapPin, Phone, X } from "lucide-react";
import { getMediaUrl } from "../media/mediaService";
import type { BusinessUnitDetail } from "./unitbisnisService";

type Props = { unit: BusinessUnitDetail; onClose: () => void };

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

export default function BusinessUnitDetails({ unit, onClose }: Props) {
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="business-unit-detail-title" className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
				<div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-obc-border bg-white px-5 py-4">
					<div>
						<p className="text-[12px] font-medium uppercase tracking-wide text-obc-muted">Detail unit bisnis</p>
						<h2 id="business-unit-detail-title" className="mt-1 font-heading text-xl font-semibold text-obc-charcoal">{unit.name}</h2>
						<p className="mt-1 text-[13px] text-obc-muted">/{unit.slug}</p>
					</div>
					<button type="button" onClick={onClose} aria-label="Tutup detail" className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-charcoal hover:bg-obc-hover-surface"><X size={17} /></button>
				</div>

				<div className="space-y-5 p-5">
					{imageUrl && <img src={getMediaUrl(imageUrl)} alt={unit.name} className="h-56 w-full rounded-lg object-cover" />}
					<dl className="grid gap-3 text-[13px] sm:grid-cols-2 lg:grid-cols-4">
						<div><dt className="text-obc-muted">ID</dt><dd className="mt-1 break-all font-medium">{unit.id}</dd></div>
						<div><dt className="text-obc-muted">Jenis unit</dt><dd className="mt-1 font-medium">{tenantTypeLabels[unit.tenantType]}</dd></div>
						<div><dt className="text-obc-muted">Status</dt><dd className="mt-1 font-medium">{unit.status === "active" ? "Aktif" : "Nonaktif"}</dd></div>
						<div><dt className="text-obc-muted">Jumlah lokasi / resource</dt><dd className="mt-1 font-medium">{unit.locations.length} / {unit.resources.length}</dd></div>
						<div><dt className="text-obc-muted">Dibuat</dt><dd className="mt-1 font-medium">{new Date(unit.createdAt).toLocaleString("id-ID")}</dd></div>
						<div><dt className="text-obc-muted">Terakhir diperbarui</dt><dd className="mt-1 font-medium">{new Date(unit.updatedAt).toLocaleString("id-ID")}</dd></div>
					</dl>
					<div className="rounded-lg border border-obc-border p-4"><h3 className="text-[13px] font-semibold">Informasi dasar</h3><p className="mt-2 text-[13px] leading-5 text-obc-charcoal">{unit.description || "Tidak ada deskripsi"}</p></div>

					<section className="rounded-lg border border-obc-border p-4">
						<h3 className="text-[13px] font-semibold">Konfigurasi CMS</h3>
						<dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">
							<div><dt className="text-obc-muted">Judul kartu</dt><dd className="mt-1">{typeof config.title === "string" ? config.title : "-"}</dd></div>
							<div><dt className="text-obc-muted">Kategori kartu</dt><dd className="mt-1">{typeof config.category === "string" ? config.category : "-"}</dd></div>
							<div><dt className="text-obc-muted">Tag</dt><dd className="mt-1">{tags.join(", ") || "-"}</dd></div>
							<div><dt className="text-obc-muted">Alamat lokasi</dt><dd className="mt-1">{typeof config.locationAddress === "string" ? config.locationAddress : "-"}</dd></div>
							<div><dt className="text-obc-muted">Link Google Maps</dt><dd className="mt-1 break-all">{typeof config.locationMapUrl === "string" && config.locationMapUrl ? <a href={config.locationMapUrl} target="_blank" rel="noreferrer" className="text-obc-green underline">{config.locationMapUrl}</a> : "-"}</dd></div>
							<div><dt className="text-obc-muted">Informasi lokasi</dt><dd className="mt-1 whitespace-pre-line">{locationInfo.join("\n") || "-"}</dd></div>
							<div className="sm:col-span-2"><dt className="text-obc-muted">Konfigurasi tambahan</dt><dd className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-obc-ivory p-3 font-mono text-[11px]">{formatJson(config)}</dd></div>
						</dl>
					</section>

					<section>
						<h3 className="mb-3 text-[13px] font-semibold">Lokasi ({unit.locations.length})</h3>
						{unit.locations.length ? <div className="grid gap-3 md:grid-cols-2">{unit.locations.map((location) => (
							<article key={location.id} className="rounded-lg border border-obc-border p-4">
								<p className="flex items-start gap-2 font-medium"><MapPin size={15} className="mt-0.5 shrink-0 text-obc-green" />{location.name}</p>
								<p className="mt-2 text-[12px] text-obc-muted">{[location.address, location.city, location.province, location.postalCode].filter(Boolean).join(", ") || "Alamat belum tersedia"}</p>
								{location.phone && <p className="mt-2 flex items-center gap-2 text-[12px] text-obc-muted"><Phone size={13} />{location.phone}</p>}
								<p className="mt-2 text-[11px] text-obc-muted">Koordinat: {location.latitude ?? "-"}, {location.longitude ?? "-"}</p>
								<p className="mt-1 text-[11px] text-obc-muted">Status: {location.status}</p>
								<p className="mt-1 text-[11px] text-obc-muted">Jam operasional: {formatJson(location.operatingHours)}</p>
								<p className="mt-1 break-all text-[10px] text-obc-muted">ID: {location.id}</p>
							</article>
						))}</div> : <p className="text-[13px] text-obc-muted">Belum ada lokasi aktif.</p>}
					</section>

					<section>
						<h3 className="mb-3 text-[13px] font-semibold">Resource ({unit.resources.length})</h3>
						{unit.resources.length ? <div className="space-y-3">{unit.resources.map((resource) => {
							const gallery = stringList(resource.gallery);
							const amenities = stringList(resource.amenities);
							return <article key={resource.id} className="grid gap-4 rounded-lg border border-obc-border p-4 sm:grid-cols-[180px_1fr]">
								{resource.imageUrl ? <img src={getMediaUrl(resource.imageUrl)} alt={resource.name} className="aspect-video w-full rounded-lg object-cover sm:aspect-square" /> : <div className="grid aspect-video place-items-center rounded-lg bg-obc-ivory text-[12px] text-obc-muted sm:aspect-square">Tidak ada gambar</div>}
								<div>
									<div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold text-obc-charcoal">{resource.name}</p><p className="text-[12px] text-obc-muted">/{resource.slug}</p></div><span className="rounded-full bg-obc-ivory px-2 py-1 text-[11px]">{resource.status}</span></div>
									<p className="mt-2 text-[13px] leading-5 text-obc-muted">{resource.description || "Tidak ada deskripsi"}</p>
									<div className="mt-3 grid grid-cols-2 gap-2 text-[12px] sm:grid-cols-3"><span>Jenis: {resourceTypeLabels[resource.resourceType]}</span><span>Olahraga: {resource.sportTypes.join(", ") || "-"}</span><span>Kapasitas: {resource.capacity}</span><span>Slot: {resource.slotMinutes} menit</span><span>Lokasi: {unit.locations.find((location) => location.id === resource.locationId)?.name ?? "-"}</span><span>Fasilitas: {amenities.join(", ") || "-"}</span></div>
									<p className="mt-2 text-[11px] text-obc-muted">Jam operasional: {formatJson(resource.operatingHours)}</p>
									{gallery.length > 0 && <p className="mt-2 text-[11px] text-obc-muted">Galeri: {gallery.map(getMediaUrl).join(", ")}</p>}
									{resource.schedules.length > 0 && <p className="mt-2 text-[11px] text-obc-muted">Jadwal: {resource.schedules.map((schedule) => `${schedule.dayOfWeek}: ${schedule.isClosed ? "Tutup" : `${minutesToTime(schedule.openMinute)}-${minutesToTime(schedule.closeMinute)}`}`).join(" · ")}</p>}
									<p className="mt-2 break-all text-[10px] text-obc-muted">ID: {resource.id}</p>
								</div>
							</article>;
						})}</div> : <p className="text-[13px] text-obc-muted">Belum ada resource aktif.</p>}
					</section>
				</div>
			</section>
		</div>
	);
}