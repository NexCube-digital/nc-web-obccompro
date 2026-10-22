import { useEffect, useState, type FormEvent } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import CustomerFilters from "./Form";
import CustomerTable from "./Table";
import { customerService, type CustomerListResponse, type CustomerStatus, type CustomerRecord } from "./customerService";

const PAGE_SIZE = 20;

export default function Management() {
	const [data, setData] = useState<CustomerListResponse>({
		items: [],
		pagination: { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 },
	});
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<CustomerStatus | "all">("all");
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		customerService.getCustomers({ page, limit: PAGE_SIZE, search, status: statusFilter })
			.then((response) => { if (active) setData(response); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [page, reload, search, statusFilter]);

	const applyFilters = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setPage(1);
		setSearch(searchInput.trim());
	};

	const changeStatus = async (customer: CustomerRecord, status: CustomerStatus) => {
		if (status === customer.status) return;
		setUpdatingId(customer.id);
		try {
			await customerService.updateStatus(customer.id, status);
			toast.success(`Status akun ${customer.name} diubah menjadi ${status}.`);
			setReload((value) => value + 1);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setUpdatingId(null);
		}
	};

	const currentPage = data.pagination.page || page;
	const totalPages = Math.max(1, data.pagination.totalPages);

	return (
		<DashboardPageLayout breadcrumb="Pelanggan" title="Manajemen pelanggan" description="Cari data pelanggan, tinjau aktivitas akun, dan kelola status akses.">
			<section className="mb-4 rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Users size={18} /></span><div><p className="text-[12px] text-obc-muted">Total hasil</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{data.pagination.total.toLocaleString("id-ID")}</p></div></div></section>
			<CustomerFilters search={searchInput} status={statusFilter} onSearchChange={setSearchInput} onStatusChange={(status) => { setStatusFilter(status); setPage(1); }} onSubmit={applyFilters} />
			<CustomerTable customers={data.items} loading={loading} updatingId={updatingId} onStatusChange={changeStatus} />
			<div className="mt-4 flex flex-col gap-3 border-t border-obc-border px-1 py-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-[12px] text-obc-muted">Menampilkan {data.items.length} dari {data.pagination.total} pelanggan</p>
				<div className="flex items-center justify-end gap-2"><button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1 || loading} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Sebelumnya</button><span className="text-[12px] text-obc-muted">{data.pagination.totalPages ? currentPage : 0} / {data.pagination.totalPages}</span><button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage >= totalPages || loading || !data.pagination.totalPages} className="rounded-lg border border-obc-border px-3 py-2 text-[12px] disabled:opacity-50">Berikutnya</button></div>
			</div>
		</DashboardPageLayout>
	);
}
