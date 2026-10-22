import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import type { FinanceRecord } from "./financeService";

const PAGE_SIZE = 10;

const rupiah = (amount: number) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
}).format(amount);

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

type Props = {
	finances: FinanceRecord[];
	loading: boolean;
};

export default function FinanceTable({ finances, loading }: Props) {
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const filtered = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return finances.filter((finance) => [finance.division, finance.type, finance.category, finance.description, finance.status]
			.filter(Boolean)
			.join(" ")
			.toLowerCase()
			.includes(normalizedQuery));
	}, [finances, query]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="flex flex-col gap-3 border-b border-obc-border p-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Riwayat transaksi</h2>
					<p className="mt-0.5 text-[12px] text-obc-muted">{filtered.length.toLocaleString("id-ID")} catatan</p>
				</div>
				<label className="relative block w-full sm:max-w-[300px]">
					<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
					<input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari transaksi..." className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]" />
				</label>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[760px] text-left">
					<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted">
						<th className="px-5 py-3.5">Transaksi</th><th className="px-5 py-3.5">Divisi</th><th className="px-5 py-3.5">Jenis</th><th className="px-5 py-3.5">Tanggal</th><th className="px-5 py-3.5 text-right">Nominal</th><th className="px-5 py-3.5">Status</th>
					</tr></thead>
					<tbody className="text-[13px]">
						{loading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">Memuat transaksi...</td></tr> : rows.length ? rows.map((finance) => {
							const income = finance.type === "income";
							return <tr key={finance.id} className="border-t border-obc-border">
								<td className="max-w-[340px] px-5 py-3.5"><p className="truncate font-semibold text-obc-charcoal">{finance.category || "Tanpa kategori"}</p><p className="truncate text-[11px] text-obc-muted">{finance.description || "-"}</p></td>
								<td className="px-5 py-3.5 capitalize text-obc-muted">{finance.division}</td>
								<td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${income ? "bg-[#E7F5D0] text-[#1F3320]" : "bg-[#FDF2F2] text-[#B42318]"}`}>{income ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}{income ? "Pemasukan" : "Pengeluaran"}</span></td>
								<td className="whitespace-nowrap px-5 py-3.5 text-obc-muted">{formatDate(finance.date)}</td>
								<td className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold ${income ? "text-obc-green" : "text-obc-red"}`}>{income ? "+" : "-"}{rupiah(finance.amount)}</td>
								<td className="px-5 py-3.5"><span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium capitalize text-obc-muted">{finance.status}</span></td>
							</tr>;
						}) : <tr><td colSpan={6} className="px-5 py-12 text-center text-obc-muted">{finances.length ? "Tidak ada transaksi yang cocok." : "Belum ada transaksi keuangan."}</td></tr>}
					</tbody>
				</table>
			</div>

			<div className="flex flex-col gap-3 border-t border-obc-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
				<p className="text-[12px] text-obc-muted">Menampilkan {rows.length} dari {filtered.length} transaksi</p>
				<div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Sebelumnya</button><span className="text-[12px] text-obc-muted">{currentPage} / {totalPages}</span><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Berikutnya</button></div>
			</div>
		</section>
	);
}
