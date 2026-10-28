import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import { siteContentService, type LocationsContent, type SiteContactContent, type SiteLocation } from "./siteContentService";

const EMPTY_CONTACT: SiteContactContent = {
	section: "site-contact",
	email: "",
	whatsapp: "",
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

	return (
		<DashboardPageLayout breadcrumb="Kontak & Lokasi" title="Kontak & Lokasi" description="Kelola kontak footer dan daftar lokasi yang tampil pada website.">
			<form onSubmit={save} className="space-y-5">
				<section className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
					<h2 className="font-heading text-lg font-semibold text-obc-charcoal">Kontak footer</h2>
					<div className="mt-4 grid gap-4 md:grid-cols-2">
						<label className="text-[13px] font-medium">Email<input required type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
						<label className="text-[13px] font-medium">WhatsApp<input required value={contact.whatsapp} onChange={(event) => setContact({ ...contact, whatsapp: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
						<label className="text-[13px] font-medium">Instagram<input required value={contact.instagram} onChange={(event) => setContact({ ...contact, instagram: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
						<label className="text-[13px] font-medium">TikTok<input required value={contact.tiktok} onChange={(event) => setContact({ ...contact, tiktok: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
						<label className="text-[13px] font-medium md:col-span-2">Alamat<input required value={contact.address} onChange={(event) => setContact({ ...contact, address: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
						<label className="text-[13px] font-medium md:col-span-2">Link Google Maps<input required type="url" value={contact.maps} onChange={(event) => setContact({ ...contact, maps: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
					</div>
				</section>

				<section className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
					<div className="flex items-center justify-between gap-3">
						<h2 className="font-heading text-lg font-semibold text-obc-charcoal">Lokasi</h2>
						<button type="button" onClick={() => setLocations((current) => ({ ...current, locations: [...current.locations, { ...EMPTY_LOCATION }] }))} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1F3320] px-3 text-[12px] font-medium text-white"><Plus size={15} />Tambah lokasi</button>
					</div>
					{loading ? <p className="mt-4 text-[13px] text-obc-muted">Memuat data...</p> : locations.locations.length === 0 ? <p className="mt-4 text-[13px] text-obc-muted">Belum ada lokasi.</p> : (
						<div className="mt-4 space-y-4">
							{locations.locations.map((location, index) => (
								<div key={index} className="rounded-lg border border-obc-border p-4">
									<div className="grid gap-3 md:grid-cols-2">
										<label className="text-[13px] font-medium">Alamat<input value={location.address} onChange={(event) => updateLocation(index, { address: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
										<label className="text-[13px] font-medium">Link Google Maps<input type="url" value={location.mapUrl} onChange={(event) => updateLocation(index, { mapUrl: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
										<label className="text-[13px] font-medium md:col-span-2">Nama unit (satu per baris)<textarea rows={3} value={location.units.join("\n")} onChange={(event) => updateLocation(index, { units: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal" /></label>
										<label className="text-[13px] font-medium md:col-span-2">Informasi (satu per baris)<textarea rows={3} value={location.info.join("\n")} onChange={(event) => updateLocation(index, { info: event.target.value.split("\n").map((value) => value.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-obc-border p-3 font-normal" /></label>
									</div>
									<button type="button" onClick={() => setLocations((current) => ({ ...current, locations: current.locations.filter((_, locationIndex) => locationIndex !== index) }))} className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[12px] font-medium text-red-600 hover:bg-red-50"><Trash2 size={15} />Hapus lokasi</button>
								</div>
							))}
						</div>
					)}
				</section>

				<div className="flex justify-end"><button type="submit" disabled={saving || loading} className="h-10 rounded-lg bg-[#1F3320] px-5 text-[13px] font-medium text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button></div>
			</form>
		</DashboardPageLayout>
	);
}
