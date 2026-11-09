import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Search, UserRound, X } from "lucide-react";
import { sportService, type AdminBookingCustomer, type AdminFullDayBookingResult, type SportType } from "../SportService";
import type { CourtResource } from "../court/courtService";

type Props = {
	resource: CourtResource;
	date: string;
	startTime: string;
	endTime: string;
	sportType: SportType;
	onClose: () => void;
	onCreated: () => void;
};

export default function FullDayBookingModal({ resource, date, startTime, endTime, sportType, onClose, onCreated }: Props) {
	const [mode, setMode] = useState<"customer" | "walkin">("customer");
	const [search, setSearch] = useState("");
	const [customers, setCustomers] = useState<AdminBookingCustomer[]>([]);
	const [selectedCustomer, setSelectedCustomer] = useState<AdminBookingCustomer | null>(null);
	const [guestName, setGuestName] = useState("");
	const [guestEmail, setGuestEmail] = useState("");
	const [guestPhone, setGuestPhone] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState<AdminFullDayBookingResult | null>(null);

	useEffect(() => {
		const query = search.trim();
		if (mode !== "customer" || query.length < 2) return;
		let active = true;
		const timer = window.setTimeout(() => {
			void sportService.searchAdminCustomers(query)
				.then((items) => { if (active) setCustomers(items); })
				.catch((searchError: unknown) => { if (active) setError(searchError instanceof Error ? searchError.message : "Pencarian pelanggan gagal."); });
		}, 250);
		return () => { active = false; window.clearTimeout(timer); };
	}, [mode, search]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (mode === "customer" && !selectedCustomer) {
			setError("Pilih pelanggan dari hasil pencarian.");
			return;
		}
		setError("");
		setIsSubmitting(true);
		try {
			const booking = await sportService.createAdminFullDayBooking({
				resourceId: resource.id,
				bookingDate: date,
				startTime,
				endTime,
				sportType,
				...(mode === "customer" && selectedCustomer ? { customerId: selectedCustomer.id } : {
					guestName: guestName.trim(),
					guestEmail: guestEmail.trim() || undefined,
					guestPhone: guestPhone.trim() || undefined,
				}),
			});
			setResult(booking);
			onCreated();
		} catch (submitError: unknown) {
			setError(submitError instanceof Error ? submitError.message : "Booking seharian gagal dibuat.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-[70] grid place-items-center bg-[#162017]/55 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
			<section role="dialog" aria-modal="true" aria-labelledby="full-day-booking-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#DCE5D8] bg-white shadow-[0_24px_80px_rgba(16,32,18,0.28)]">
				<header className="bg-[#1F3320] px-5 py-5 text-white sm:px-7 sm:py-6">
					<div className="flex items-start gap-4">
						<span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#CDF178] text-[#1F3320]"><CalendarDays size={23} aria-hidden="true" /></span>
						<div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#CDF178]">OBC Sport · Admin</p><h2 id="full-day-booking-title" className="mt-1 font-heading text-xl font-bold sm:text-2xl">Reservasi seharian</h2><p className="mt-1 text-xs text-white/70">Catat pemesanan untuk seluruh jam operasional.</p></div>
						<button type="button" onClick={onClose} aria-label="Tutup" className="grid size-9 shrink-0 place-items-center rounded-lg text-white/75 transition-colors hover:bg-white/10 hover:text-white"><X size={19} aria-hidden="true" /></button>
					</div>
					<div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4">
						<div className="min-w-0"><p className="text-[9px] uppercase tracking-wide text-white/55">Lapangan</p><p className="mt-1 truncate text-xs font-semibold">{resource.name}</p></div>
						<div className="min-w-0"><p className="text-[9px] uppercase tracking-wide text-white/55">Tanggal</p><p className="mt-1 truncate text-xs font-semibold">{date}</p></div>
						<div className="min-w-0"><p className="text-[9px] uppercase tracking-wide text-white/55">Jam operasional</p><p className="mt-1 truncate text-xs font-semibold">{startTime}–{endTime}</p></div>
					</div>
				</header>

				{result ? <div className="space-y-5 p-5 sm:p-7">
					<div role="status" className="flex items-start gap-3 rounded-xl border border-[#CFE0C7] bg-[#F3F8E8] p-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#DDF0C6] text-[#315D2C]"><CheckCircle2 size={22} aria-hidden="true" /></span><div><h3 className="font-heading text-sm font-bold text-[#264C25]">Reservasi berhasil disimpan</h3><p className="mt-1 text-xs leading-5 text-[#52634A]">{result.message}</p></div></div>
					<dl className="grid gap-3 rounded-xl border border-obc-border p-4 sm:grid-cols-2">
						<div className="flex items-start gap-2.5"><MapPin size={16} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-[10px] uppercase tracking-wide text-obc-muted">Lapangan</dt><dd className="mt-1 text-xs font-semibold text-obc-charcoal">{result.resource.name}</dd></div></div>
						<div className="flex items-start gap-2.5"><CalendarDays size={16} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-[10px] uppercase tracking-wide text-obc-muted">Tanggal</dt><dd className="mt-1 text-xs font-semibold text-obc-charcoal">{result.bookingDate}</dd></div></div>
						<div className="flex items-start gap-2.5"><Clock3 size={16} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-[10px] uppercase tracking-wide text-obc-muted">Waktu</dt><dd className="mt-1 text-xs font-semibold text-obc-charcoal">{result.startTime}–{result.endTime}</dd></div></div>
						<div className="flex items-start gap-2.5"><UserRound size={16} className="mt-0.5 shrink-0 text-obc-green" /><div><dt className="text-[10px] uppercase tracking-wide text-obc-muted">Pelanggan</dt><dd className="mt-1 text-xs font-semibold text-obc-charcoal">{result.customer?.name ?? result.guest?.name ?? "-"}</dd><dd className="mt-0.5 text-[11px] text-obc-muted">{result.customer?.email ?? result.guest?.email ?? result.customer?.phone ?? result.guest?.phone ?? ""}</dd></div></div>
					</dl>
					<div className="rounded-xl bg-[#F7F8F4] px-4 py-3"><p className="text-[10px] uppercase tracking-wide text-obc-muted">ID booking utama</p><p className="mt-1 break-all font-mono text-xs font-semibold text-obc-charcoal">{result.bookingId}</p><p className="mt-2 text-[11px] text-obc-muted">{result.bookingIds.length} unit kapasitas terisi</p></div>
					<button type="button" onClick={onClose} className="h-11 w-full rounded-xl bg-obc-green text-sm font-semibold text-white transition-colors hover:bg-[#162A17]">Selesai</button>
				</div> : <form onSubmit={(event) => { void handleSubmit(event); }} className="space-y-5 p-5 sm:p-7">
					<div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F0F3EC] p-1" role="group" aria-label="Jenis pelanggan">
						<button type="button" aria-pressed={mode === "customer"} onClick={() => { setMode("customer"); setError(""); }} className={`h-10 rounded-lg text-xs font-semibold transition-colors ${mode === "customer" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}>Pelanggan terdaftar</button>
						<button type="button" aria-pressed={mode === "walkin"} onClick={() => { setMode("walkin"); setSelectedCustomer(null); setError(""); }} className={`h-10 rounded-lg text-xs font-semibold transition-colors ${mode === "walkin" ? "bg-white text-obc-green shadow-sm" : "text-obc-muted hover:text-obc-charcoal"}`}>Walk-in</button>
					</div>

					{mode === "customer" ? <div>
						<label className="block text-xs font-semibold text-obc-charcoal">Cari pelanggan<div className="relative mt-1.5"><Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedCustomer(null); }} className="h-11 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-sm outline-none transition focus:border-obc-green focus:ring-2 focus:ring-[#E7F5D0]" placeholder="Nama, email, atau telepon" /></div></label>
						{customers.length > 0 && !selectedCustomer && <ul className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-obc-border bg-white shadow-sm">{customers.map((customer) => <li key={customer.id}><button type="button" onClick={() => { setSelectedCustomer(customer); setSearch(customer.name); setCustomers([]); }} className="w-full border-b border-obc-border px-3 py-2.5 text-left last:border-0 transition-colors hover:bg-[#F3F8E8]"><span className="block text-xs font-semibold text-obc-charcoal">{customer.name}</span><span className="mt-0.5 block text-[11px] text-obc-muted">{customer.email} · {customer.phone ?? "Tanpa telepon"}</span></button></li>)}</ul>}
						{selectedCustomer && <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#F3F8E8] px-3 py-2 text-[11px] font-semibold text-obc-green"><CheckCircle2 size={14} />Dipilih: {selectedCustomer.name}</p>}
					</div> : <div className="grid gap-3 sm:grid-cols-2">
						<label className="text-xs font-semibold text-obc-charcoal">Nama walk-in<input required value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-obc-border px-3 text-sm outline-none focus:border-obc-green" /></label>
						<label className="text-xs font-semibold text-obc-charcoal">Email<input type="email" value={guestEmail} onChange={(event) => setGuestEmail(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-obc-border px-3 text-sm outline-none focus:border-obc-green" placeholder="Opsional" /></label>
						<label className="text-xs font-semibold text-obc-charcoal">Telepon<input value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-obc-border px-3 text-sm outline-none focus:border-obc-green" placeholder="Opsional" /></label>
					</div>}

					{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-[12px] text-red-700">{error}</p>}
					<div className="flex justify-end gap-2 border-t border-obc-border pt-4"><button type="button" onClick={onClose} className="h-10 rounded-lg border border-obc-border px-4 text-xs font-semibold text-obc-charcoal transition-colors hover:bg-obc-ivory">Batal</button><button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center gap-2 rounded-xl bg-obc-green px-5 text-xs font-bold text-white transition-colors hover:bg-[#162A17] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Menyimpan..." : <><CheckCircle2 size={15} />Simpan reservasi</>}</button></div>
				</form>}
			</section>
		</div>
	);
}
