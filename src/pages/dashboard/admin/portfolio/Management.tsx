import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import { portfolioService, type Portfolio } from "./portfolioService";
import PortfolioForm from "./form";
import PortfolioTable from "./Table";

export default function Management() {
	const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "regular">("all");
	const [showForm, setShowForm] = useState(false);
	const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		portfolioService.getPortfolios({
			category: categoryFilter === "all" ? undefined : categoryFilter,
			featured: featuredFilter === "all" ? undefined : featuredFilter === "featured",
		})
			.then((data) => { if (active) setPortfolios(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [categoryFilter, featuredFilter, reload]);

	const categories = useMemo(() => Array.from(new Set(portfolios.map((item) => item.category))).sort(), [portfolios]);
	const filteredPortfolios = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return portfolios.filter((item) => [item.title, item.category, item.client, item.description, item.technologies]
			.filter(Boolean)
			.join(" ")
			.toLowerCase()
			.includes(normalizedQuery));
	}, [portfolios, query]);
	const refresh = () => setReload((value) => value + 1);

	const openCreate = () => {
		setEditingPortfolio(null);
		setShowForm(true);
	};

	const openEdit = (portfolio: Portfolio) => {
		setEditingPortfolio(portfolio);
		setShowForm(true);
	};

	const deletePortfolio = async (portfolio: Portfolio) => {
		if (!window.confirm(`Hapus portfolio "${portfolio.title}"?`)) return;
		try {
			await portfolioService.deletePortfolio(portfolio.id);
			toast.success("Portfolio berhasil dihapus.");
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	const toggleFeatured = async (portfolio: Portfolio) => {
		try {
			await portfolioService.updatePortfolio(portfolio.id, {
				title: portfolio.title,
				category: portfolio.category,
				description: portfolio.description,
				client: portfolio.client,
				technologies: portfolio.technologies,
				link: portfolio.link,
				featured: !portfolio.featured,
			});
			toast.success(portfolio.featured ? "Portfolio dihapus dari unggulan." : "Portfolio ditandai sebagai unggulan.");
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Portfolio" title="Manajemen portfolio" description="Kelola karya, informasi proyek, dan konten unggulan website.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><BriefcaseBusiness size={18} /></span><div><p className="text-[12px] text-obc-muted">Total portfolio</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{portfolios.length.toLocaleString("id-ID")}</p></div></div></div>
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#FBF0D3] text-[#8A6100]"><BriefcaseBusiness size={18} /></span><div><p className="text-[12px] text-obc-muted">Portfolio unggulan</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{portfolios.filter((item) => item.featured).length.toLocaleString("id-ID")}</p></div></div></div>
			</section>

			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2 sm:flex-row">
					<select aria-label="Filter kategori portfolio" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua kategori</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
					<select aria-label="Filter portfolio unggulan" value={featuredFilter} onChange={(event) => setFeaturedFilter(event.target.value as "all" | "featured" | "regular")} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua status</option><option value="featured">Unggulan</option><option value="regular">Non-unggulan</option></select>
					<label className="relative block w-full sm:w-[280px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari portfolio..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label>
				</div>
				{!showForm && <button type="button" onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Tambah portfolio</button>}
			</section>

			{showForm && <div className="mb-4"><PortfolioForm key={editingPortfolio?.id ?? "new"} portfolio={editingPortfolio} onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} /></div>}
			<PortfolioTable portfolios={filteredPortfolios} loading={loading} onEdit={openEdit} onDelete={deletePortfolio} onToggleFeatured={toggleFeatured} />
		</DashboardPageLayout>
	);
}
