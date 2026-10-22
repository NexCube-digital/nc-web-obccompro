import { useEffect, useMemo, useState } from "react";
import {
	ChevronLeft,
	ChevronRight,
	MapPin,
	Search,
	TrendingDown,
	TrendingUp,
	Users,
	type LucideIcon,
} from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { toast } from "sonner";

type Status = "Aktif" | "Menunggu" | "Nonaktif" | undefined;

type Contact = {
	id?: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	createdAt?: string;
	status?: "Aktif" | "Menunggu" | "Nonaktif";
};

const API_BASE = "/api/v1/admin/contacts";

const MOCK_CONTACTS: Contact[] = [
	{ id: "1", name: "PT Maju Jaya", email: "info@majujaya.com", phone: "081234567890", address: "Jl. Ahmad Yani No. 45, Bandung", status: "Aktif", createdAt: "2026-01-10" },
	{ id: "2", name: "CV Sukses Usaha", email: "cs@suksesusaha.com", phone: "082234567891", address: "Jl. Gatot Subroto No. 12, Jakarta", status: "Aktif", createdAt: "2026-02-15" },
	{ id: "3", name: "Toko Elektronik Budi", email: "budi@toko-elektronik.com", phone: "083234567892", address: "Jl. Merdeka No. 78, Surabaya", status: "Menunggu", createdAt: "2026-03-20" },
	{ id: "4", name: "Distributor Barang Impor", email: "sales@distributor.com", phone: "084234567893", address: "Jl. Diponegoro No. 99, Medan", status: "Aktif", createdAt: "2026-04-05" },
	{ id: "5", name: "Koperasi Petani Sleman", email: "koperasi@petani.com", phone: "085234567894", address: "Jl. Raya Yogyakarta, Sleman", status: "Nonaktif", createdAt: "2026-01-25" },
	{ id: "6", name: "Retail Fashion Cantik", email: "fashion@retail.com", phone: "086234567895", address: "Mall Citra, Bandung", status: "Aktif", createdAt: "2026-05-12" },
];

const PAGE_SIZE = 6;
const TABS = ["Semua", "Aktif", "Menunggu", "Nonaktif"] as const;
type Tab = (typeof TABS)[number];

const statusStyle: Record<string, string> = {
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

export default function Kontak() {
	const [contactData, setContactData] = useState<Contact[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState<Tab>("Semua");
	const [page, setPage] = useState(1);

	useEffect(() => {
		loadContacts();
	}, []);

	const loadContacts = async () => {
		try {
			setLoading(true);
			const res = await fetch(API_BASE);
			if (!res.ok) throw new Error(`${res.status}`);
			
			const contentType = res.headers.get('content-type');
			if (!contentType?.includes('application/json')) {
				console.warn('[Kontak] API not ready, using mock data');
				setContactData(MOCK_CONTACTS);
				return;
			}
			
			const data = await res.json();
			setContactData(data.data || []);
		} catch (error) {
			console.warn('[Kontak] API error, using mock data:', error);
			setContactData(MOCK_CONTACTS);
		} finally {
			setLoading(false);
		}
	};

	const counts = useMemo(
		() => ({
			Semua: contactData.length,
			Aktif: contactData.filter((c) => c.status === "Aktif").length,
			Menunggu: contactData.filter((c) => c.status === "Menunggu").length,
			Nonaktif: contactData.filter((c) => c.status === "Nonaktif").length,
		}),
		[contactData],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return contactData.filter((c) => {
			const matchTab = tab === "Semua" || c.status === tab;
			const matchQuery = `${c.name} ${c.email} ${c.phone} ${c.address}`.toLowerCase().includes(q);
			return matchTab && matchQuery;
		});
	}, [query, tab, contactData]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const changeTab = (next: Tab) => {
		setTab(next);
		setPage(1);
	};

	return (
		<DashboardLayout>
			<div className="p-6">
				<h1 className="font-heading text-[32px] font-semibold text-[#343133] mb-2">Kontak & Lokasi</h1>
				<p className="text-[14px] text-obc-muted mb-6">Manajemen data kontak CRM dan informasi bisnis</p>

				{/* Stat Cards */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
					<StatCard icon={Users} label="Total kontak" value={String(counts.Semua)} trend={8.3} iconClass="bg-[#E7F5D0] text-[#004000]" />
					<StatCard icon={MapPin} label="Menunggu verifikasi" value={String(counts.Menunggu)} trend={2.1} iconClass="bg-[#FBF0D3] text-[#8A6100]" />
					<StatCard icon={Users} label="Kontak aktif" value={String(counts.Aktif)} trend={5.7} iconClass="bg-[#CDF178] text-[#404F14]" />
					<StatCard icon={Users} label="Kontak nonaktif" value={String(counts.Nonaktif)} trend={-1.2} iconClass="bg-[#EEF1E0] text-[#265021]" />
				</div>

				{/* Tabel */}
				<div className="overflow-hidden rounded-2xl border border-obc-border bg-white shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
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
								placeholder="Cari kontak..."
								className="h-10 w-full rounded-xl border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-[#404F14] focus:ring-2 focus:ring-[#CDF178]"
							/>
						</label>
					</div>

					<div className="p-4 sm:p-5">
						<div className="overflow-x-auto rounded-xl border border-obc-border">
							<table className="w-full min-w-[760px] text-left">
								<thead>
									<tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
										<th scope="col" className="px-5 py-3.5">Kontak</th>
										<th scope="col" className="px-5 py-3.5">Telepon</th>
										<th scope="col" className="px-5 py-3.5">Alamat</th>
										<th scope="col" className="px-5 py-3.5">Bergabung</th>
										<th scope="col" className="px-5 py-3.5">Status</th>
									</tr>
								</thead>
								<tbody className="text-[13px]">
									{loading ? (
										<tr>
											<td colSpan={5} className="px-5 py-12 text-center text-[13px] text-obc-muted">
												Memuat data kontak...
											</td>
										</tr>
									) : rows.length > 0 ? (
										rows.map((c, index) => (
											<tr key={c.id || c.email} className="border-t border-obc-border first:border-t-0 transition-colors hover:bg-[#FDFCF7]">
												<td className="px-5 py-3.5">
													<div className="flex items-center gap-3">
														<span
															className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white ${
																avatarGradients[index % avatarGradients.length]
															}`}
														>
															{initials(c.name)}
														</span>
														<div className="min-w-0">
															<p className="truncate font-semibold text-[#343133]">{c.name}</p>
															<p className="truncate text-[12px] text-obc-muted">{c.email}</p>
														</div>
													</div>
												</td>
												<td className="px-5 py-3.5 text-[#343133]">{c.phone}</td>
												<td className="px-5 py-3.5 text-[#343133] text-[12px]">
													<p className="line-clamp-2">{c.address}</p>
												</td>
												<td className="px-5 py-3.5 text-obc-muted">{c.createdAt ? formatDate(c.createdAt) : "-"}</td>
												<td className="px-5 py-3.5">
													<span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[c.status || "Aktif"]}`}>
														{c.status || "Aktif"}
													</span>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={5} className="px-5 py-12 text-center text-[13px] text-obc-muted">
												Tidak ada kontak yang cocok. Coba ubah kata kunci atau pilih tab lain.
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
							<span className="font-semibold text-[#343133]">{filtered.length}</span> kontak
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
				</div>
			</div>
		</DashboardLayout>
	);
}
