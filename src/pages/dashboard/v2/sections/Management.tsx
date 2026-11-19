import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { authService } from "../../../../services/auth";
import { getApiErrorMessage, getDeleteConfirmationMessage, getDeleteSuccessMessage } from "../../../../services/api";
import { useDebouncedValue } from "../../components/hooks/useDebouncedValue";
import { cmsPageService } from "../pages/pageService";
import CmsSectionForm, { CmsTranslationForm } from "./Form";
import CmsSectionTable from "./Table";
import { cmsSectionService, type CmsLanguage, type CmsSection, type CmsSectionStatus } from "./sectionService";

export default function Management() {
	const tenantId = authService.getCurrentSession()?.user.tenantId ?? "";
	const queryClient = useQueryClient();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebouncedValue(query);
	const [pageFilter, setPageFilter] = useState("all");
	const [showForm, setShowForm] = useState(false);
	const [editingSection, setEditingSection] = useState<CmsSection | null>(null);
	const [translationTarget, setTranslationTarget] = useState<{ section: CmsSection; language: CmsLanguage } | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);
	const cmsDataQuery = useQuery({
		queryKey: ["v2-cms-sections", tenantId],
		queryFn: () => Promise.all([
			cmsPageService.getPages(tenantId || undefined),
			cmsSectionService.getSections(tenantId || undefined),
		]),
	});
	const pages = cmsDataQuery.data?.[0] ?? [];
	const sections = cmsDataQuery.data?.[1] ?? [];
	const loading = cmsDataQuery.isPending;

	useEffect(() => {
		if (cmsDataQuery.error) toast.error(getApiErrorMessage(cmsDataQuery.error));
	}, [cmsDataQuery.error]);

	const filteredSections = useMemo(() => {
		const normalizedQuery = debouncedQuery.trim().toLowerCase();
		return sections.filter((section) => {
			const pageMatches = pageFilter === "all" || section.pageId === pageFilter;
			const searchMatches = [section.title, section.sectionKey, section.sectionType, section.page.title, section.page.slug]
				.join(" ")
				.toLowerCase()
				.includes(normalizedQuery);
			return pageMatches && searchMatches;
		});
	}, [pageFilter, debouncedQuery, sections]);
	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["v2-cms-sections"] });
	};

	const deleteSection = async (section: CmsSection) => {
		if (!window.confirm(getDeleteConfirmationMessage(`section "${section.title}" beserta terjemahannya`))) return;
		try {
			await cmsSectionService.deleteSection(section.id);
			toast.success(getDeleteSuccessMessage("Section"));
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	const updateStatus = async (section: CmsSection, status: CmsSectionStatus) => {
		if (status === section.status) return;
		setUpdatingId(section.id);
		try {
			await cmsSectionService.updateSection(section.id, { status });
			refresh();
			toast.success("Status section berhasil diperbarui.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setUpdatingId(null);
		}
	};

	const saveTranslation = () => {
		refresh();
		setTranslationTarget(null);
	};

	return (
		<DashboardPageLayout breadcrumb="CMS Sections" title="Manajemen section CMS" description="Kelola konten section dan terjemahan Indonesia/Inggris pada setiap halaman.">
			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2 sm:flex-row">
					<label className="relative block w-full sm:w-[280px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari key, judul, halaman..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label>
					<select aria-label="Filter halaman" value={pageFilter} onChange={(event) => setPageFilter(event.target.value)} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua halaman</option>{pages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}</select>
				</div>
				{!showForm && !translationTarget && <button type="button" onClick={() => { setEditingSection(null); setShowForm(true); }} disabled={!pages.length} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60"><Plus size={15} />Tambah section</button>}
			</section>

			<section className="mb-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Layers size={18} /></span><div><p className="text-[12px] text-obc-muted">Total section</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{sections.length.toLocaleString("id-ID")}</p></div></div></div><div className="rounded-xl border border-obc-border bg-white p-4"><p className="text-[12px] text-obc-muted">Section aktif</p><p className="mt-1 font-heading text-[20px] font-bold text-obc-charcoal">{sections.filter((section) => section.status === "active").length.toLocaleString("id-ID")}</p></div></section>

			{showForm && <div className="mb-4"><CmsSectionForm key={editingSection?.id ?? "new"} section={editingSection} pages={pages} onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} /></div>}
			{translationTarget && <div className="mb-4"><CmsTranslationForm key={`${translationTarget.section.id}-${translationTarget.language}`} section={translationTarget.section} language={translationTarget.language} onCancel={() => setTranslationTarget(null)} onSaved={saveTranslation} /></div>}
			<CmsSectionTable sections={filteredSections} loading={loading} updatingId={updatingId} onEdit={(section) => { setEditingSection(section); setShowForm(true); }} onDelete={deleteSection} onStatusChange={updateStatus} onTranslate={(section, language) => setTranslationTarget({ section, language })} />
		</DashboardPageLayout>
	);
}
