import { useEffect, useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { authService } from "../../../../services/auth";
import { getApiErrorMessage } from "../../../../services/api";
import CmsPageForm from "./Form";
import CmsPageTable from "./Table";
import { cmsPageService, type CmsPage, type CmsPageStatus } from "./pageService";

export default function Management() {
	const sessionTenantId = authService.getCurrentSession()?.user.tenantId ?? "";
	const [tenantId, setTenantId] = useState(sessionTenantId);
	const [pages, setPages] = useState<CmsPage[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<CmsPageStatus | "all">("all");
	const [showForm, setShowForm] = useState(false);
	const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		cmsPageService.getPages(tenantId || undefined)
			.then((data) => { if (active) setPages(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [reload, tenantId]);

	const filteredPages = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return pages.filter((page) => {
			const statusMatches = statusFilter === "all" || page.status === statusFilter;
			const textMatches = [page.title, page.slug, page.pageType].join(" ").toLowerCase().includes(normalizedQuery);
			return statusMatches && textMatches;
		});
	}, [pages, query, statusFilter]);
	const refresh = () => setReload((value) => value + 1);

	const deletePage = async (page: CmsPage) => {
		if (!window.confirm(`Hapus halaman CMS "${page.title}" beserta section-nya?`)) return;
		try {
			await cmsPageService.deletePage(page.id);
			toast.success("Halaman CMS berhasil dihapus.");
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	const updateStatus = async (page: CmsPage, status: CmsPageStatus) => {
		if (status === page.status) return;
		setUpdatingId(page.id);
		try {
			const updated = await cmsPageService.updatePage(page.id, { status });
			setPages((current) => current.map((item) => item.id === updated.id ? { ...item, status: updated.status } : item));
			toast.success("Status halaman berhasil diperbarui.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Halaman CMS" title="Manajemen halaman CMS" description="Kelola metadata halaman, urutan, dan status publikasi.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2">
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><FileText size={18} /></span><div><p className="text-[12px] text-obc-muted">Total halaman</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{pages.length.toLocaleString("id-ID")}</p></div></div></div>
				<div className="rounded-xl border border-obc-border bg-white p-4"><p className="text-[12px] text-obc-muted">Published</p><p className="mt-1 font-heading text-[20px] font-bold text-obc-charcoal">{pages.filter((page) => page.status === "published").length.toLocaleString("id-ID")}</p></div>
			</section>
			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2 sm:flex-row">
					<label className="relative block w-full sm:w-[280px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul atau slug..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label>
					<select aria-label="Filter status halaman" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as CmsPageStatus | "all")} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua status</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select>
				</div>
				{!showForm && <button type="button" onClick={() => { setEditingPage(null); setShowForm(true); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Tambah halaman</button>}
			</section>
			{showForm && <div className="mb-4"><CmsPageForm key={editingPage?.id ?? "new"} page={editingPage} tenantId={tenantId} tenantLocked={Boolean(sessionTenantId)} onTenantIdChange={setTenantId} onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} /></div>}
			<CmsPageTable pages={filteredPages} loading={loading} updatingId={updatingId} onEdit={(page) => { setEditingPage(page); setShowForm(true); }} onDelete={deletePage} onStatusChange={updateStatus} />
		</DashboardPageLayout>
	);
}
