import { useEffect, useState, type FormEvent } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import Pagination from "../../components/common/Pagination";
import { getApiErrorMessage } from "../../../../services/api";
import CustomerFilters from "./Form";
import CustomerTable from "./Table";
import { customerService, type CustomerListResponse } from "./customerService";

const PAGE_SIZE = 20;

export default function Management() {
	const [data, setData] = useState<CustomerListResponse>({
		items: [],
		pagination: { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 },
	});
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		setLoading(true);
		customerService.getCustomers({ page, limit: PAGE_SIZE, search })
			.then((response) => { if (active) setData(response); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [page, search]);

	const applyFilters = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setPage(1);
		setSearch(searchInput.trim());
	};

	const currentPage = data.pagination.page || page;
	const totalPages = Math.max(1, data.pagination.totalPages);

	return (
		<DashboardPageLayout breadcrumb="Pelanggan" title="Manajemen pelanggan" description="Cari data pelanggan dan tinjau aktivitas akun.">
			<section className="mb-4 rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Users size={18} /></span><div><p className="text-[12px] text-obc-muted">Total hasil</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{data.pagination.total.toLocaleString("id-ID")}</p></div></div></section>
			<CustomerFilters search={searchInput} onSearchChange={setSearchInput} onSubmit={applyFilters} />
			<CustomerTable customers={data.items} loading={loading} />
			<Pagination page={currentPage} totalPages={data.pagination.totalPages} onPageChange={setPage} totalItems={data.pagination.total} pageSize={data.pagination.limit} itemLabel="pelanggan" disabled={loading} className="mt-4 flex flex-col gap-3 border-t border-obc-border px-1 py-3 sm:flex-row sm:items-center sm:justify-between" />
		</DashboardPageLayout>
	);
}
