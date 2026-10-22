import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { accountService, type Staff, type StaffStatus } from "./AccountService";

const PAGE_SIZE = 10;
const statusLabels: Record<StaffStatus, string> = {
	active: "Aktif",
	inactive: "Nonaktif",
	suspended: "Ditangguhkan",
};
const roleLabels: Record<Staff["role"], string> = {
	super_admin: "Super admin",
	admin: "Admin",
	marketing: "Marketing",
	sport: "Sport",
};
const statusClasses: Record<StaffStatus, string> = {
	active: "bg-[#E7F5D0] text-[#1F3320]",
	inactive: "bg-[#F1EFE8] text-obc-muted",
	suspended: "bg-[#FDF2F2] text-[#B42318]",
};

function Summary({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-xl border border-obc-border bg-white p-4">
			<div className="flex items-center gap-3">
				<span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#004000]"><Users size={18} /></span>
				<div>
					<p className="text-[12px] text-obc-muted">{label}</p>
					<p className="font-heading text-[22px] font-bold text-obc-charcoal">{value.toLocaleString("id-ID")}</p>
				</div>
			</div>
		</div>
	);
}

export default function StaffTable() {
	const [staff, setStaff] = useState<Staff[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | StaffStatus>("all");
	const [page, setPage] = useState(1);

	useEffect(() => {
		let cancelled = false;
		accountService.getStaffList()
			.then((data) => {
				if (!cancelled) setStaff(data);
			})
			.catch((error: unknown) => {
				if (!cancelled) {
					setStaff([]);
					toast.error(error instanceof Error ? error.message : "Gagal memuat data staff.");
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const counts = useMemo(() => ({
		all: staff.length,
		active: staff.filter((user) => user.status === "active").length,
		inactive: staff.filter((user) => user.status === "inactive").length,
		suspended: staff.filter((user) => user.status === "suspended").length,
	}), [staff]);

	const filtered = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return staff.filter((user) => {
			const matchesStatus = statusFilter === "all" || user.status === statusFilter;
			const searchable = [user.name, user.email, user.role, user.teamProfile?.position, user.teamProfile?.expertise]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return matchesStatus && searchable.includes(normalizedQuery);
		});
	}, [query, staff, statusFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const updateStatus = async (user: Staff, status: StaffStatus) => {
		try {
			const updated = await accountService.updateStaff(user.id, { status });
			setStaff((current) => current.map((item) => item.id === updated.id ? { ...item, status: updated.status } : item));
			toast.success(`Status ${user.name} diperbarui.`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal memperbarui status staff.");
		}
	};

	return (
		<>
			<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Summary label="Total staff" value={counts.all} />
				<Summary label="Staff aktif" value={counts.active} />
				<Summary label="Staff nonaktif" value={counts.inactive} />
				<Summary label="Staff ditangguhkan" value={counts.suspended} />
			</section>

			<section className="mt-5 overflow-hidden rounded-2xl border border-obc-border bg-white">
				<div className="flex flex-col gap-3 border-b border-obc-border p-4 sm:flex-row sm:items-center sm:justify-between">
					<div role="tablist" aria-label="Filter status staff" className="flex gap-1 overflow-x-auto rounded-xl border border-obc-border bg-[#FDFCF7] p-1">
						{(["all", "active", "inactive", "suspended"] as const).map((status) => (
							<button key={status} type="button" role="tab" aria-selected={statusFilter === status} onClick={() => { setStatusFilter(status); setPage(1); }} className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium ${statusFilter === status ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}>
								{status === "all" ? "Semua" : statusLabels[status]} <span className="ml-1">{counts[status]}</span>
							</button>
						))}
					</div>
					<label className="relative block w-full sm:max-w-[280px]">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari staff..." className="h-10 w-full rounded-xl border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-[#404F14] focus:ring-2 focus:ring-[#CDF178]" />
					</label>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-[760px] text-left">
						<thead>
							<tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
								<th className="px-5 py-3.5">Staff</th>
								<th className="px-5 py-3.5">Role</th>
								<th className="px-5 py-3.5">Posisi / keahlian</th>
								<th className="px-5 py-3.5">Bergabung</th>
								<th className="px-5 py-3.5">Status akun</th>
							</tr>
						</thead>
						<tbody className="text-[13px]">
							{loading ? (
								<tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat data staff...</td></tr>
							) : rows.length ? rows.map((user) => (
								<tr key={user.id} className="border-t border-obc-border">
									<td className="px-5 py-3.5">
										<div className="flex items-center gap-3">
											{user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-9 rounded-full object-cover" /> : <span className="grid size-9 place-items-center rounded-full bg-[#E7F5D0] text-[11px] font-bold text-[#004000]">{user.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span>}
											<div className="min-w-0"><p className="truncate font-semibold text-obc-charcoal">{user.name}</p><p className="truncate text-[12px] text-obc-muted">{user.email}</p></div>
										</div>
									</td>
									<td className="px-5 py-3.5">{roleLabels[user.role]}</td>
									<td className="px-5 py-3.5"><p>{user.teamProfile?.position || "-"}</p><p className="max-w-[240px] truncate text-[11px] text-obc-muted">{user.teamProfile?.expertise || ""}</p></td>
									<td className="px-5 py-3.5 text-obc-muted">{new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
									<td className="px-5 py-3.5">
										<select aria-label={`Status akun ${user.name}`} value={user.status} onChange={(event) => updateStatus(user, event.target.value as StaffStatus)} className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold outline-none ${statusClasses[user.status]}`}>
											<option value="active">Aktif</option><option value="inactive">Nonaktif</option><option value="suspended">Ditangguhkan</option>
										</select>
									</td>
								</tr>
							)) : (
								<tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Tidak ada staff yang cocok.</td></tr>
							)}
						</tbody>
					</table>
				</div>

				<div className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="text-[12px] text-obc-muted">Menampilkan {rows.length} dari {filtered.length} staff</p>
					<div className="flex items-center justify-end gap-2">
						<button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Sebelumnya</button>
						<span className="text-[12px] text-obc-muted">{currentPage} / {totalPages}</span>
						<button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Berikutnya</button>
					</div>
				</div>
			</section>
		</>
	);
}
