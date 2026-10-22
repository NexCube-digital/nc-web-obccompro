import { useMemo, useState } from "react";
import { Mail, Phone, Users } from "lucide-react";
import { getCustomerAvatarUrl, type CustomerRecord, type CustomerStatus } from "./customerService";

type Props = {
	customers: CustomerRecord[];
	loading: boolean;
	updatingId: string | null;
	onStatusChange: (customer: CustomerRecord, status: CustomerStatus) => void;
};

const statusLabels: Record<CustomerStatus, string> = {
	active: "Aktif",
	inactive: "Nonaktif",
	suspended: "Ditangguhkan",
};

const statusClasses: Record<CustomerStatus, string> = {
	active: "bg-[#E7F5D0] text-[#1F3320]",
	inactive: "bg-[#F1EFE8] text-obc-muted",
	suspended: "bg-[#FDF2F2] text-[#B42318]",
};

export default function CustomerTable({ customers, loading, updatingId, onStatusChange }: Props) {
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const rows = useMemo(() => customers, [customers]);

	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar pelanggan</h2><p className="mt-0.5 text-[12px] text-obc-muted">{customers.length.toLocaleString("id-ID")} pelanggan pada halaman ini</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Pelanggan</th><th className="px-5 py-3.5">Aktivitas</th><th className="px-5 py-3.5">Terdaftar</th><th className="px-5 py-3.5">Login terakhir</th><th className="px-5 py-3.5">Status akun</th><th className="px-5 py-3.5">Detail</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Memuat pelanggan...</td></tr> : rows.length ? rows.map((customer) => {
					const avatarUrl = getCustomerAvatarUrl(customer.avatarUrl);
					const initials = customer.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
					return <tr key={customer.id} className="border-t border-obc-border align-top hover:bg-[#FDFCF7]">
						<td className="px-5 py-3.5"><div className="flex items-center gap-3">{avatarUrl ? <img src={avatarUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" /> : <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E7F5D0] text-[11px] font-bold text-[#1F3320]">{initials || <Users size={15} />}</span>}<div className="min-w-0"><p className="truncate font-semibold text-obc-charcoal">{customer.name}</p><p className="flex items-center gap-1 truncate text-[11px] text-obc-muted"><Mail size={11} />{customer.email}</p>{customer.phone && <p className="flex items-center gap-1 text-[11px] text-obc-muted"><Phone size={11} />{customer.phone}</p>}</div></div></td>
						<td className="px-5 py-3.5"><div className="flex gap-3 text-[12px] text-obc-muted"><span>{customer._count.bookings} booking</span><span>{customer._count.memberships} membership</span><span>{customer._count.reviews} ulasan</span></div><p className="mt-1 text-[11px] capitalize text-obc-muted">{customer.authProvider}</p></td>
						<td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-obc-muted">{new Date(customer.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
						<td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-obc-muted">{customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Belum pernah"}</td>
						<td className="px-5 py-3.5"><select aria-label={`Status akun ${customer.name}`} value={customer.status} disabled={updatingId === customer.id} onChange={(event) => onStatusChange(customer, event.target.value as CustomerStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none disabled:opacity-50 ${statusClasses[customer.status]}`}><option value="active">{statusLabels.active}</option><option value="inactive">{statusLabels.inactive}</option><option value="suspended">{statusLabels.suspended}</option></select></td>
						<td className="px-5 py-3.5"><button type="button" aria-expanded={expandedId === customer.id} onClick={() => setExpandedId((current) => current === customer.id ? null : customer.id)} className="text-[12px] font-medium text-obc-green hover:underline">{expandedId === customer.id ? "Tutup" : "Lihat"}</button>{expandedId === customer.id && <div className="mt-2 min-w-40 rounded-lg border border-obc-border bg-white p-3 text-[11px] text-obc-muted"><p>Username: {customer.username || "-"}</p><p className="mt-1 break-all">ID: {customer.id}</p></div>}</td>
					</tr>;
				}) : <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Tidak ada pelanggan yang cocok.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
