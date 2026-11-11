import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  FolderKanban,
  Image,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import ThemedSelect from "../../components/common/ThemedSelect";
import DeleteModal from "../../components/ui/DeleteModal";
import { getApiErrorMessage } from "../../../../services/api";
import { portfolioService, type Portfolio } from "../../services/cms/portfolioService";
import PortfolioForm from "./form";
import PortfolioTable from "./Table";

export default function Management() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(
    null,
  );
  const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const closeDeleteModal = useCallback(() => setDeletingPortfolio(null), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    portfolioService
      .getPortfolios({
        category: categoryFilter === "all" ? undefined : categoryFilter,
      })
      .then((data) => {
        if (active) setPortfolios(data);
      })
      .catch((error: unknown) => {
        if (active) toast.error(getApiErrorMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [categoryFilter, reload]);

  const categories = useMemo(
    () => Array.from(new Set(portfolios.map((item) => item.category))).sort(),
    [portfolios],
  );
  const imageCount = portfolios.filter((item) => item.imageUrl).length;
  const filteredPortfolios = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return portfolios.filter((item) =>
      [item.title, item.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [portfolios, query]);
  const refresh = () => setReload((value) => value + 1);
  const closePortfolioForm = useCallback(() => {
    setShowForm(false);
    setEditingPortfolio(null);
  }, []);

  const openCreate = () => {
    setEditingPortfolio(null);
    setShowForm(true);
  };

  const openEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setShowForm(true);
  };

  const deletePortfolio = (portfolio: Portfolio) =>
    setDeletingPortfolio(portfolio);

  const confirmDeletePortfolio = async () => {
    if (!deletingPortfolio) return;
    setDeleteLoading(true);
    try {
      await portfolioService.deletePortfolio(deletingPortfolio.id);
      setDeletingPortfolio(null);
      toast.success("Portfolio dipindahkan ke Sampah.");
      refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardPageLayout
      breadcrumb="Portfolio"
      title="Manajemen portfolio"
      description="Kelola judul, kategori, dan gambar portfolio untuk galeri website."
    >
      <section
        aria-label="Ringkasan portfolio"
        className="mb-5 grid gap-3 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-obc-border bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
              <BriefcaseBusiness size={18} />
            </span>
            <div>
              <p className="text-[11px] text-obc-muted">Total proyek</p>
              <p className="mt-0.5 font-heading text-[20px] font-bold text-obc-charcoal">
                {portfolios.length.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-obc-border bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#FBF0D3] text-[#8A6100]">
              <FolderKanban size={18} />
            </span>
            <div>
              <p className="text-[11px] text-obc-muted">Kategori</p>
              <p className="mt-0.5 font-heading text-[20px] font-bold text-obc-charcoal">
                {categories.length.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-obc-border bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[#E8F0F3] text-[#31556C]">
              <Image size={18} />
            </span>
            <div>
              <p className="text-[11px] text-obc-muted">Dengan gambar</p>
              <p className="mt-0.5 font-heading text-[20px] font-bold text-obc-charcoal">
                {imageCount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <ThemedSelect
            label="Filter kategori portfolio"
            value={categoryFilter}
            options={[
              { value: "all", label: "Semua kategori" },
              ...categories.map((category) => ({
                value: category,
                label: category.replace(/([A-Z])/g, " $1"),
              })),
            ]}
            onValueChange={setCategoryFilter}
            className="h-10 min-w-[180px] w-full text-[12px] sm:w-auto"
          />
          <label className="relative block w-full sm:w-70">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul atau kategori..."
              className="h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] pl-9 pr-3 text-[12px] outline-none transition focus:border-obc-olive focus:bg-white"
            />
          </label>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-obc-green-hover"
          >
            <Plus size={15} />
            Tambah portfolio
          </button>
        )}
      </section>

      {showForm && (
        <PortfolioForm
          key={editingPortfolio?.id ?? "new"}
          portfolio={editingPortfolio}
          onCancel={closePortfolioForm}
          onSaved={() => {
            setShowForm(false);
            setEditingPortfolio(null);
            refresh();
          }}
        />
      )}
      <PortfolioTable
        key={`${categoryFilter}:${query}:${reload}`}
        portfolios={filteredPortfolios}
        loading={loading}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={deletePortfolio}
      />
      <DeleteModal
        isOpen={Boolean(deletingPortfolio)}
        title="Hapus portfolio?"
        description="Portfolio dipindahkan ke Sampah dan dapat dipulihkan admin selama 30 hari."
        itemName={deletingPortfolio?.title}
        isLoading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={confirmDeletePortfolio}
      />
    </DashboardPageLayout>
  );
}
