import { useEffect, useState, type FormEvent } from "react";
import { AtSign, Building2, Camera, CheckCircle2, ExternalLink, LoaderCircle, Mail, MapPin, MapPinned, MessageCircle, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import { siteContentService, type LocationsContent, type SiteContactContent, type SiteLocation } from "./siteContentService";

const EMPTY_CONTACT: SiteContactContent = {
	section: "site-contact",
	email: "",
	whatsapp: "",
		whatsappPic: "",
	instagram: "",
	tiktok: "",
	address: "",
	maps: "",
};

const EMPTY_LOCATION: SiteLocation = {
	address: "",
	mapUrl: "",
	units: [],
	info: [],
};

const labelClass = "block text-[12px] font-semibold text-obc-charcoal";
const inputClass = "mt-1.5 h-11 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] font-normal text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";
const textareaClass = "mt-1.5 w-full rounded-lg border border-obc-border bg-white p-3 text-[13px] font-normal text-obc-charcoal outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#CDF178]/60";

export default function SiteContactManagement() {
	const [contact, setContact] = useState<SiteContactContent>(EMPTY_CONTACT);
	const [locations, setLocations] = useState<LocationsContent>({ section: "locations", locations: [] });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let active = true;
		Promise.all([siteContentService.getContact(), siteContentService.getLocations()])
			.then(([contactData, locationsData]) => {
				if (!active) return;
				setContact(contactData);
				setLocations(locationsData);
			})
			.catch((error) => { if (active) toast.error(`Gagal memuat data: ${getApiErrorMessage(error)}`); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, []);

	const updateLocation = (index: number, patch: Partial<SiteLocation>) => {
		setLocations((current) => ({
			...current,
			locations: current.locations.map((location, locationIndex) => locationIndex === index ? { ...location, ...patch } : location),
		}));
	};

	const save = async (event: FormEvent) => {
		event.preventDefault();
		setSaving(true);
		try {
			await Promise.all([siteContentService.saveContact(contact), siteContentService.saveLocations(locations)]);
			toast.success("Kontak dan lokasi berhasil disimpan.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};
	const channelCount = [contact.email, contact.whatsapp, contact.whatsappPic, contact.instagram, contact.tiktok].filter(Boolean).length;

	return (
		<DashboardPageLayout breadcrumb="Kontak & Lokasi" title="Kontak & Lokasi" description="Kelola kanal kontak dan alamat unit bisnis OBC.">
			<form onSubmit={save} className="mx-auto max-w-6xl space-y-5 pb-20">
				<section className="overflow-hidden rounded-xl border border-[#263C29] bg-[#1F3320] text-white shadow-sm">
					<div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
						<div className="flex items-start gap-4">
							<span className="grid size-12 shrink-0 place-items-center rounded-lg bg-[#CDF178] text-[#1F3320]"><MapPinned size={22} /></span>
							<div><p className="text-[11px] font-semibold uppercase tracking-wider text-[#CDF178]">Website OBC · Informasi publik</p><h2 className="mt-1 font-heading text-xl font-bold sm:text-2xl">Kontak yang selalu mudah ditemukan</h2><p className="mt-1 max-w-xl text-[13px] leading-5 text-white/75">{loading ? "Memuat konfigurasi website..." : "Data kontak ini digunakan pada footer dan halaman lokasi website."}</p></div>
						</div>
						<div className="flex shrink-0 items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3">
							<span className="grid size-9 place-items-center rounded-lg bg-white/10"><CheckCircle2 size={18} className="text-[#CDF178]" /></span>
							<div><p className="text-[11px] text-white/65">Kanal terisi</p><p className="font-heading text-lg font-bold">{channelCount} <span className="text-[12px] font-medium text-white/65">/ 5</span></p></div>
						</div>
					</div>
					<div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-5">
						{[
							{ icon: Mail, label: "Email", ready: Boolean(contact.email) },
							{ icon: MessageCircle, label: "WhatsApp utama", ready: Boolean(contact.whatsapp) },
							{ icon: MessageCircle, label: "WhatsApp PIC", ready: Boolean(contact.whatsappPic) },
							{ icon: Camera, label: "Instagram", ready: Boolean(contact.instagram) },
							{ icon: AtSign, label: "TikTok", ready: Boolean(contact.tiktok) },
						].map(({ icon: Icon, label, ready }, index) => <div key={label} className={`flex items-center gap-2.5 px-4 py-3 ${index % 2 === 1 ? "border-l border-white/10" : ""} ${index >= 2 ? "border-t border-white/10" : ""} ${index > 0 ? "sm:border-l" : ""} sm:border-t-0`}><Icon size={15} className={ready ? "text-[#CDF178]" : "text-white/40"} /><span className="truncate text-[11px] text-white/75">{label}</span><span className={`ml-auto size-1.5 shrink-0 rounded-full ${ready ? "bg-[#CDF178]" : "bg-white/25"}`} /></div>)}
					</div>
				</section>

				<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
					<div className="flex items-start gap-3 border-b border-obc-border px-4 py-4 sm:px-5">
						<span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><MessageCircle size={18} /></span>
						<div><h2 className="font-heading text-[15px] font-semibold">Kanal kontak</h2><p className="mt-0.5 text-[12px] text-obc-muted">Kontak utama dan PIC untuk kebutuhan pengunjung.</p></div>
					</div>
					<div className="grid gap-x-5 gap-y-4 p-4 sm:grid-cols-2 sm:p-5">
						<label className={labelClass}>Email resmi<input required type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} placeholder="nama@domain.com" className={inputClass} /></label>
						<label className={labelClass}>WhatsApp utama<input required type="tel" autoComplete="tel" value={contact.whatsapp} onChange={(event) => setContact({ ...contact, whatsapp: event.target.value })} placeholder="https://wa.me/628... atau 628..." className={inputClass} /></label>
						<label className={labelClass}>WhatsApp PIC <span className="ml-1 font-normal text-obc-muted">(opsional)</span><input type="tel" autoComplete="tel" value={contact.whatsappPic ?? ""} onChange={(event) => setContact({ ...contact, whatsappPic: event.target.value })} placeholder="Nomor atau link WhatsApp PIC" className={inputClass} /></label>
						<label className={labelClass}>Instagram<input required value={contact.instagram} onChange={(event) => setContact({ ...contact, instagram: event.target.value })} placeholder="https://instagram.com/..." className={inputClass} /></label>
						<label className={labelClass}>TikTok<input required value={contact.tiktok} onChange={(event) => setContact({ ...contact, tiktok: event.target.value })} placeholder="https://tiktok.com/@..." className={inputClass} /></label>
						<label className={labelClass}>Alamat utama<input required value={contact.address} onChange={(event) => setContact({ ...contact, address: event.target.value })} placeholder="Alamat kantor atau unit utama" className={inputClass} /></label>
						<label className={`${labelClass} sm:col-span-2`}>Tautan Google Maps<div className="relative"><MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input required type="url" value={contact.maps} onChange={(event) => setContact({ ...contact, maps: event.target.value })} placeholder="https://maps.google.com/..." className={`${inputClass} pl-9`} /></div></label>
					</div>
				</section>

				<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-obc-border px-4 py-4 sm:px-5">
						<div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Building2 size={18} /></span><div><h2 className="font-heading text-[15px] font-semibold">Lokasi unit</h2><p className="mt-0.5 text-[12px] text-obc-muted">{locations.locations.length} lokasi terdaftar</p></div></div>
						<button type="button" onClick={() => setLocations((current) => ({ ...current, locations: [...current.locations, { ...EMPTY_LOCATION }] }))} className="inline-flex h-10 items-center gap-2 rounded-lg border border-obc-green px-3 text-[12px] font-semibold text-obc-green transition-colors hover:bg-[#F3F8E8]"><Plus size={15} />Tambah lokasi</button>
					</div>
					{loading ? <div className="space-y-3 p-5"><div className="h-10 animate-pulse rounded-lg bg-obc-ivory" /><div className="h-24 animate-pulse rounded-lg bg-obc-ivory" /></div> : locations.locations.length === 0 ? <div className="grid justify-items-center gap-2 px-5 py-10 text-center"><MapPin size={24} className="text-obc-muted" /><p className="text-[13px] font-medium">Belum ada lokasi</p><p className="text-[12px] text-obc-muted">Tambahkan lokasi untuk ditampilkan pada website.</p></div> : (
						<div className="divide-y divide-obc-border">
							{locations.locations.map((location, index) => (
								<div key={index} className="p-4 sm:p-5">
									<div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-md bg-[#F3F8E8] text-[11px] font-bold text-obc-green">{String(index + 1).padStart(2, "0")}</span><h3 className="text-[13px] font-semibold">Lokasi {index + 1}</h3></div><button type="button" title="Hapus lokasi" aria-label={`Hapus lokasi ${index + 1}`} onClick={() => setLocations((current) => ({ ...current, locations: current.locations.filter((_, locationIndex) => locationIndex !== index) }))} className="grid size-9 place-items-center rounded-lg text-red-600 transition-colors hover:bg-red-50"><Trash2 size={16} /></button></div>
									<div className="grid gap-4 md:grid-cols-2">
										<label className={labelClass}>Alamat lokasi<input value={location.address} onChange={(event) => updateLocation(index, { address: event.target.value })} placeholder="Alamat lengkap lokasi" className={inputClass} /></label>
										<label className={labelClass}>Link Google Maps<input type="url" value={location.mapUrl} onChange={(event) => updateLocation(index, { mapUrl: event.target.value })} placeholder="https://maps.google.com/..." className={inputClass} /></label>
										<label className={labelClass}>Nama unit <span className="font-normal text-obc-muted">· satu per baris</span><textarea rows={3} value={location.units.join("\n")} onChange={(event) => updateLocation(index, { units: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean) })} placeholder="OBC Sport Center\nOBC Guest House" className={textareaClass} /></label>
										<label className={labelClass}>Informasi lokasi <span className="font-normal text-obc-muted">· satu per baris</span><textarea rows={3} value={location.info.join("\n")} onChange={(event) => updateLocation(index, { info: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean) })} placeholder="Jam operasional\nKontak lokasi" className={textareaClass} /></label>
									</div>
									{location.mapUrl && <a href={location.mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-obc-green hover:underline"><ExternalLink size={13} />Buka peta</a>}
								</div>
							))}
						</div>
					)}
				</section>

				<div className="sticky bottom-0 z-20 -mx-3 border-t border-obc-border bg-white/95 px-3 py-3 backdrop-blur sm:-mx-6 sm:px-6">
					<div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><span className="hidden text-[12px] text-obc-muted sm:block">Perubahan akan tampil setelah disimpan.</span><button type="submit" disabled={saving || loading} className="ml-auto inline-flex h-11 items-center gap-2 rounded-lg bg-[#1F3320] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-obc-green disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Menyimpan..." : "Simpan perubahan"}</button></div>
				</div>
			</form>
		</DashboardPageLayout>
	);
}
