import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Banknote, Plus, RefreshCw, Wallet } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import { financeService, type FinanceRecord, type FinanceSummary, type FinanceType } from "./financeService";
import FinanceForm from "./form";
import FinanceTable from "./Table";

const rupiah = (amount: number) => new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	maximumFractionDigits: 0,
}).format(amount);

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Wallet; tone: string }) {
	return <div className="rounded-xl border border-obc-border bg-white p-4">
		<div className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-lg ${tone}`}><Icon size={18} /></span><div className="min-w-0"><p className="text-[12px] text-obc-muted">{label}</p><p className="truncate font-heading text-[18px] font-bold text-obc-charcoal sm:text-[20px]">{value}</p></div></div>
	</div>;
}

export default function Management() {
	const [finances, setFinances] = useState<FinanceRecord[]>([]);
	const [summary, setSummary] = useState<FinanceSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingSummary, setLoadingSummary] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [divisionInput, setDivisionInput] = useState("");
	const [divisionFilter, setDivisionFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | FinanceType>("all");
	const [statusFilter, setStatusFilter] = useState("");
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		financeService.getFinances({
			division: divisionFilter || undefined,
			type: typeFilter === "all" ? undefined : typeFilter,
			status: statusFilter || undefined,
		})
			.then((data) => { if (active) setFinances(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [divisionFilter, reload, statusFilter, typeFilter]);

	useEffect(() => {
		let active = true;
		setLoadingSummary(true);
		financeService.getSummary()
			.then((data) => { if (active) setSummary(data); })
			.catch((error: unknown) => { if (active) toast.error(`Gagal memuat ringkasan: ${getApiErrorMessage(error)}`); })
			.finally(() => { if (active) setLoadingSummary(false); });
		return () => { active = false; };
	}, [reload]);

	const refresh = () => setReload((value) => value + 1);

	return (
		<DashboardPageLayout breadcrumb="Keuangan" title="Manajemen keuangan" description="Pantau pemasukan, pengeluaran, dan catatan transaksi seluruh divisi.">
			<section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<SummaryCard label="Total pemasukan" value={loadingSummary ? "Memuat..." : rupiah(summary?.totalIncome ?? 0)} icon={ArrowDownToLine} tone="bg-[#E7F5D0] text-[#1F3320]" />
				<SummaryCard label="Total pengeluaran" value={loadingSummary ? "Memuat..." : rupiah(summary?.totalExpense ?? 0)} icon={ArrowUpFromLine} tone="bg-[#FDF2F2] text-[#B42318]" />
				<SummaryCard label="Saldo bersih" value={loadingSummary ? "Memuat..." : rupiah(summary?.netProfit ?? 0)} icon={Wallet} tone="bg-[#CDF178] text-[#404F14]" />
				<SummaryCard label="Jumlah transaksi" value={loadingSummary ? "Memuat..." : (summary?.count ?? 0).toLocaleString("id-ID")} icon={Banknote} tone="bg-[#FBF0D3] text-[#8A6100]" />
			</section>

			<section className="mb-4 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="grid flex-1 gap-3 sm:grid-cols-3">
					<label><span className="mb-1.5 block text-[12px] font-medium text-obc-charcoal">Divisi</span><input className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive" value={divisionInput} onChange={(event) => setDivisionInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setDivisionFilter(divisionInput.trim()); } }} placeholder="Semua divisi" /></label>
					<label><span className="mb-1.5 block text-[12px] font-medium text-obc-charcoal">Jenis</span><select className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "all" | FinanceType)}><option value="all">Semua jenis</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></label>
					<label><span className="mb-1.5 block text-[12px] font-medium text-obc-charcoal">Status</span><input className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} placeholder="Semua status" /></label>
				</div>
				<div className="flex gap-2">
					<button type="button" onClick={() => setDivisionFilter(divisionInput.trim())} className="h-10 rounded-lg border border-obc-border px-3 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7]">Terapkan</button>
					<button type="button" onClick={refresh} aria-label="Muat ulang transaksi" title="Muat ulang" className="grid size-10 place-items-center rounded-lg border border-obc-border text-obc-muted hover:bg-[#FDFCF7]"><RefreshCw size={15} /></button>
					{!showForm && <button type="button" onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-3 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Catat transaksi</button>}
				</div>
			</section>

			{showForm && <div className="mb-4"><FinanceForm onCancel={() => setShowForm(false)} onCreated={() => { setShowForm(false); refresh(); }} /></div>}
			<FinanceTable finances={finances} loading={loading} />
		</DashboardPageLayout>
	);
}
