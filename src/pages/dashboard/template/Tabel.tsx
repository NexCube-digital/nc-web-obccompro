import { useMemo, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Clock,
	Search,
	ShoppingBag,
	TrendingDown,
	TrendingUp,
	Users,
	Wallet,
	type LucideIcon,
} from "lucide-react";
import DashboardPageLayout from "../components/layouts/DashboardPageLayout";

type Status = "Aktif" | "Menunggu" | "Nonaktif";

type Customer = {
	name: string;
	email: string;
	category: "Member" | "Pelanggan" | "Mitra";
	joined: string;
	orders: number;
	total: number;
	status: Status;
};

const customers: Customer[] = [
	{ name: "Rizky Pratama", email: "rizky@email.com", category: "Member", joined: "2026-06-27", orders: 8, total: 1250000, status: "Aktif" },
	{ name: "Dewi Anggraini", email: "dewi@email.com", category: "Pelanggan", joined: "2026-06-25", orders: 3, total: 480000, status: "Aktif" },
	{ name: "Budi Santoso", email: "budi@email.com", category: "Mitra", joined: "2026-06-24", orders: 1, total: 215000, status: "Menunggu" },
	{ name: "Nadia Putri", email: "nadia@email.com", category: "Pelanggan", joined: "2026-06-22", orders: 5, total: 760000, status: "Aktif" },
	{ name: "Fajar Nugroho", email: "fajar@email.com", category: "Member", joined: "2026-06-20", orders: 2, total: 330000, status: "Nonaktif" },
	{ name: "Salsa Maharani", email: "salsa@email.com", category: "Pelanggan", joined: "2026-06-18", orders: 4, total: 590000, status: "Menunggu" },
	{ name: "Andi Wijaya", email: "andi@email.com", category: "Mitra", joined: "2026-06-15", orders: 11, total: 2340000, status: "Aktif" },
	{ name: "Citra Lestari", email: "citra@email.com", category: "Member", joined: "2026-06-12", orders: 6, total: 910000, status: "Aktif" },
	{ name: "Hendra Kusuma", email: "hendra@email.com", category: "Pelanggan", joined: "2026-06-10", orders: 1, total: 120000, status: "Nonaktif" },
	{ name: "Maya Sari", email: "maya@email.com", category: "Pelanggan", joined: "2026-06-08", orders: 3, total: 445000, status: "Menunggu" },
	{ name: "Yoga Permana", email: "yoga@email.com", category: "Member", joined: "2026-06-05", orders: 7, total: 1080000, status: "Aktif" },
	{ name: "Tari Wulandari", email: "tari@email.com", category: "Mitra", joined: "2026-06-02", orders: 2, total: 275000, status: "Aktif" },
];

const PAGE_SIZE = 6;
const TABS = ["Semua", "Aktif", "Menunggu", "Nonaktif"] as const;
type Tab = (typeof TABS)[number];

const statusStyle: Record<Status, string> = {
	Aktif: "bg-[#E7F5D0] text-[#1F3320]",
	Menunggu: "bg-[#FBF0D3] text-[#8A6100]",
	Nonaktif: "bg-[#FDF2F2] text-[#B42318]",
};

const avatarGradients = [
	"from-[#004000] to-[#9AAD3E]",
	"from-[#404F14] to-[#CDF178]",
	"from-[#265021] to-[#9AAD3E]",
	"from-[#343133] to-[#404F14]",
];

const rupiah = (value: number) =>
	new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const initials = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();

type StatCardProps = {
	icon: LucideIcon;
	label: string;
	value: string;
	trend: number;
	iconClass: string;
};

function StatCard({ icon: Icon, label, value, trend, iconClass }: StatCardProps) {
	const up = trend >= 0;
	const TrendIcon = up ? TrendingUp : TrendingDown;
	return (
		<div className="rounded-2xl border border-obc-border bg-white p-5 shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
			<div className="flex items-start justify-between">
				<span className={`grid size-11 place-items-center rounded-xl ${iconClass}`}>
					<Icon size={20} />
				</span>
				<span
					className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
						up ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-[#FDF2F2] text-[#B42318]"
					}`}
				>
					<TrendIcon size={12} />
					{up ? "+" : ""}
					{trend}%
				</span>
			</div>
			<p className="mt-4 text-[13px] text-obc-muted">{label}</p>
			<p className="mt-1 font-heading text-[26px] font-bold leading-none text-[#343133]">{value}</p>
		</div>
	);
}

export default function Tabel() {
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState<Tab>("Semua");
	const [page, setPage] = useState(1);

	const counts = useMemo(
		() => ({
			Semua: customers.length,
			Aktif: customers.filter((c) => c.status === "Aktif").length,
			Menunggu: customers.filter((c) => c.status === "Menunggu").length,
			Nonaktif: customers.filter((c) => c.status === "Nonaktif").length,
		}),
		[],
	);

	const stats = useMemo(() => {
		const totalSpent = customers.reduce((sum, c) => sum + c.total, 0);
		const totalOrders = customers.reduce((sum, c) => sum + c.orders, 0);
		return {
			totalSpent,
			totalOrders,
			average: Math.round(totalSpent / customers.length),
		};
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return customers.filter((c) => {
			const matchTab = tab === "Semua" || c.status === tab;
			const matchQuery = `${c.name} ${c.email} ${c.category}`.toLowerCase().includes(q);
			return matchTab && matchQuery;
		});
	}, [query, tab]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const changeTab = (next: Tab) => {
		setTab(next);
		setPage(1);
	};

	return (
		<DashboardPageLayout
			breadcrumb="Tabel"
			title="Data pelanggan"
			description="Daftar pelanggan, kategori, dan status keanggotaan dalam satu tempat."
		>
			{/* Kartu ringkasan */}
			<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard icon={Users} label="Total pelanggan" value={String(counts.Semua)} trend={12.4} iconClass="bg-[#E7F5D0] text-[#004000]" />
				<StatCard icon={Clock} label="Menunggu verifikasi" value={String(counts.Menunggu)} trend={-3.1} iconClass="bg-[#FBF0D3] text-[#8A6100]" />
				<StatCard icon={Wallet} label="Total belanja" value={rupiah(stats.totalSpent)} trend={8.9} iconClass="bg-[#CDF178] text-[#404F14]" />
				<StatCard icon={ShoppingBag} label="Rata-rata belanja" value={rupiah(stats.average)} trend={2.2} iconClass="bg-[#EEF1E0] text-[#265021]" />
			</section>

			{/* Tabel */}
			<section className="mt-5 overflow-hidden rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
				<div className="flex flex-col gap-3 border-b border-obc-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<div role="tablist" className="flex w-full gap-1 overflow-x-auto rounded-xl border border-obc-border bg-[#FDFCF7] p-1 sm:w-auto">
						{TABS.map((name) => {
							const active = tab === name;
							return (
								<button
									key={name}
									role="tab"
									aria-selected={active}
									onClick={() => changeTab(name)}
									className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9AAD3E] ${
										active ? "bg-white text-[#343133] shadow-sm" : "text-obc-muted hover:text-[#343133]"
									}`}
								>
									{name}
									<span
										className={`rounded-md px-1.5 text-[11px] font-semibold ${
											active ? "bg-[#CDF178] text-[#404F14]" : "bg-[#F1EFE8] text-obc-muted"
										}`}
									>
										{counts[name]}
									</span>
								</button>
							);
						})}
					</div>

					<label className="relative block w-full sm:max-w-[280px]">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
							type="search"
							placeholder="Cari pelanggan..."
							className="h-10 w-full rounded-xl border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-[#404F14] focus:ring-2 focus:ring-[#CDF178]"
						/>
					</label>
				</div>

				<div className="p-4 sm:p-5">
					<div className="overflow-x-auto rounded-xl border border-obc-border">
						<table className="w-full min-w-[760px] text-left">
							<thead>
								<tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
									<th scope="col" className="px-5 py-3.5">Pelanggan</th>
									<th scope="col" className="px-5 py-3.5">Kategori</th>
									<th scope="col" className="px-5 py-3.5">Bergabung</th>
									<th scope="col" className="px-5 py-3.5">Pesanan</th>
									<th scope="col" className="px-5 py-3.5 text-right">Total belanja</th>
									<th scope="col" className="px-5 py-3.5">Status</th>
								</tr>
							</thead>
							<tbody className="text-[13px]">
								{rows.map((customer, index) => (
									<tr key={customer.email} className="border-t border-obc-border first:border-t-0 transition-colors hover:bg-[#FDFCF7]">
										<td className="px-5 py-3.5">
											<div className="flex items-center gap-3">
												<span
													className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white ${
														avatarGradients[index % avatarGradients.length]
													}`}
												>
													{initials(customer.name)}
												</span>
												<div className="min-w-0">
													<p className="truncate font-semibold text-[#343133]">{customer.name}</p>
													<p className="truncate text-[12px] text-obc-muted">{customer.email}</p>
												</div>
											</div>
										</td>
										<td className="px-5 py-3.5 text-[#343133]">{customer.category}</td>
										<td className="px-5 py-3.5 text-obc-muted">{formatDate(customer.joined)}</td>
										<td className="px-5 py-3.5 text-[#343133]">{customer.orders}</td>
										<td className="px-5 py-3.5 text-right font-semibold tabular-nums text-[#343133]">{rupiah(customer.total)}</td>
										<td className="px-5 py-3.5">
											<span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[customer.status]}`}>
												{customer.status}
											</span>
										</td>
									</tr>
								))}
								{rows.length === 0 && (
									<tr>
										<td colSpan={6} className="px-5 py-12 text-center text-[13px] text-obc-muted">
											Tidak ada pelanggan yang cocok. Coba ubah kata kunci atau pilih tab lain.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Paginasi */}
				<div className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="text-[12px] text-obc-muted">
						Menampilkan <span className="font-semibold text-[#343133]">{rows.length}</span> dari{" "}
						<span className="font-semibold text-[#343133]">{filtered.length}</span> pelanggan
					</p>
					<nav aria-label="Paginasi" className="flex items-center gap-1.5">
						<button
							onClick={() => setPage(currentPage - 1)}
							disabled={currentPage === 1}
							className="inline-flex h-9 items-center gap-1 rounded-lg border border-obc-border px-3 text-[13px] font-medium text-[#343133] hover:bg-[#FDFCF7] disabled:cursor-not-allowed disabled:text-obc-muted disabled:opacity-50 disabled:hover:bg-transparent"
						>
							<ChevronLeft size={14} /> Sebelumnya
						</button>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
							<button
								key={n}
								onClick={() => setPage(n)}
								aria-current={n === currentPage ? "page" : undefined}
								className={`size-9 rounded-lg text-[13px] font-semibold ${
									n === currentPage
										? "bg-gradient-to-r from-[#004000] to-[#404F14] text-white"
										: "text-[#343133] hover:bg-[#FDFCF7]"
								}`}
							>
								{n}
							</button>
						))}
						<button
							onClick={() => setPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="inline-flex h-9 items-center gap-1 rounded-lg border border-obc-border px-3 text-[13px] font-medium text-[#343133] hover:bg-[#FDFCF7] disabled:cursor-not-allowed disabled:text-obc-muted disabled:opacity-50 disabled:hover:bg-transparent"
						>
							Berikutnya <ChevronRight size={14} />
						</button>
					</nav>
				</div>
			</section>
		</DashboardPageLayout>
	);
}