import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { contactService, type Contact } from "./ContactService";

const PAGE_SIZE = 10;
const statuses = ["new_contact", "read", "responded", "active", "inactive"] as const;
type ContactStatus = (typeof statuses)[number];
type StatusFilter = "all" | ContactStatus;

const statusLabels: Record<ContactStatus, string> = {
	new_contact: "Baru",
	read: "Dibaca",
	responded: "Direspons",
	active: "Aktif",
	inactive: "Nonaktif",
};
const statusClasses: Record<ContactStatus, string> = {
	new_contact: "bg-[#FBF0D3] text-[#8A6100]",
	read: "bg-[#EBEEDC] text-[#404F14]",
	responded: "bg-[#E7F5D0] text-[#1F3320]",
	active: "bg-[#CDF178] text-[#1F3320]",
	inactive: "bg-[#F1EFE8] text-obc-muted",
};

function Summary({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border border-obc-border bg-white p-4">
			<div className="flex items-center gap-3">
				<span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><Users size={18} /></span>
				<div><p className="text-[12px] text-obc-muted">{label}</p><p className="font-heading text-[22px] font-bold text-obc-charcoal">{value.toLocaleString("id-ID")}</p></div>
			</div>
		</div>
	);
}

export default function ContactTable() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [page, setPage] = useState(1);

	useEffect(() => {
		let cancelled = false;
		contactService.getContactList()
			.then((data) => { if (!cancelled) setContacts(data); })
			.catch((error: unknown) => {
				if (!cancelled) {
					setContacts([]);
					toast.error(error instanceof Error ? error.message : "Gagal memuat data kontak.");
				}
			})
			.finally(() => { if (!cancelled) setLoading(false); });
		return () => { cancelled = true; };
	}, []);

	const counts = useMemo(() => ({
		all: contacts.length,
		new_contact: contacts.filter((contact) => contact.status === "new_contact").length,
		read: contacts.filter((contact) => contact.status === "read").length,
		responded: contacts.filter((contact) => contact.status === "responded").length,
		active: contacts.filter((contact) => contact.status === "active").length,
		inactive: contacts.filter((contact) => contact.status === "inactive").length,
	}), [contacts]);

	const filteredContacts = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return contacts.filter((contact) => {
			const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
			const searchText = [contact.name, contact.email, contact.company, contact.phone, contact.service, contact.message, contact.budget]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return matchesStatus && searchText.includes(normalizedQuery);
		});
	}, [contacts, query, statusFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filteredContacts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const updateStatus = async (contact: Contact, status: ContactStatus) => {
		try {
			const updated = await contactService.updateContactStatus(contact.id, status);
			setContacts((current) => current.map((item) => item.id === updated.id ? updated : item));
			toast.success("Status kontak berhasil diperbarui.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status kontak.");
		}
	};

	const deleteContact = async (contact: Contact) => {
		if (!window.confirm(`Hapus kontak ${contact.name}?`)) return;
		try {
			await contactService.deleteContact(contact.id);
			setContacts((current) => current.filter((item) => item.id !== contact.id));
			toast.success("Kontak berhasil dihapus.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menghapus kontak.");
		}
	};

	return (
		<>
			<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Summary label="Total enquiry" value={counts.all} />
				<Summary label="Enquiry baru" value={counts.new_contact} />
				<Summary label="Direspons" value={counts.responded} />
				<Summary label="Kontak aktif" value={counts.active} />
			</section>

			<section className="mt-5 overflow-hidden rounded-2xl border border-obc-border bg-white">
				<div className="flex flex-col gap-3 border-b border-obc-border p-4 sm:flex-row sm:items-center sm:justify-between">
					<div role="tablist" aria-label="Filter status kontak" className="flex gap-1 overflow-x-auto rounded-xl border border-obc-border bg-[#FDFCF7] p-1">
						{(["all", ...statuses] as StatusFilter[]).map((status) => (
							<button key={status} type="button" role="tab" aria-selected={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(1); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium ${statusFilter === status ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}>
								{status === "all" ? "Semua" : statusLabels[status]} <span className="ml-1">{counts[status]}</span>
							</button>
						))}
					</div>
					<label className="relative block w-full sm:max-w-70">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari kontak..." className="h-10 w-full rounded-xl border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]" />
					</label>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-190 text-left">
						<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
							<th className="px-5 py-3.5">Kontak</th><th className="px-5 py-3.5">Detail enquiry</th><th className="px-5 py-3.5">Diterima</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Aksi</th>
						</tr></thead>
						<tbody className="text-[13px]">
							{loading ? (
								<tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat kontak...</td></tr>
							) : rows.length ? rows.map((contact) => (
								<tr key={contact.id} className="border-t border-obc-border">
									<td className="px-5 py-3.5"><p className="font-semibold text-obc-charcoal">{contact.name}</p><p className="text-[12px] text-obc-muted">{contact.company || contact.email}</p><p className="text-[12px] text-obc-muted">{contact.phone || "Telepon tidak tersedia"}</p></td>
									<td className="max-w-[360px] px-5 py-3.5"><p className="font-medium">{contact.service || "Permintaan umum"}{contact.budget ? ` · ${contact.budget}` : ""}</p><p className="line-clamp-2 text-[12px] text-obc-muted">{contact.message || "Tidak ada pesan"}</p></td>
									<td className="whitespace-nowrap px-5 py-3.5 text-obc-muted">{new Date(contact.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
									<td className="px-5 py-3.5"><select aria-label={`Status kontak ${contact.name}`} value={contact.status} onChange={(event) => updateStatus(contact, event.target.value as ContactStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${statusClasses[contact.status]}`}>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></td>
									<td className="px-5 py-3.5 text-right"><button type="button" title="Hapus kontak" aria-label={`Hapus kontak ${contact.name}`} onClick={() => deleteContact(contact)} className="rounded-lg p-2 text-[#B42318] hover:bg-[#FDF2F2]"><Trash2 size={16} /></button></td>
								</tr>
							)) : (
								<tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Tidak ada enquiry kontak.</td></tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="text-[12px] text-obc-muted">Menampilkan {rows.length} dari {filteredContacts.length} kontak</p>
					<div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Sebelumnya</button><span className="text-[12px] text-obc-muted">{currentPage} / {totalPages}</span><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Berikutnya</button></div>
				</div>
			</section>
		</>
	);
}
