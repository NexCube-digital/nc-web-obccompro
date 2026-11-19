import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CircleCheck, MapPin, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import DeleteModal from "../../components/ui/DeleteModal";
import { authService } from "../../../../services/auth";
import { getApiErrorMessage } from "../../../../services/api";
import BusinessUnitDetails from "./ModalDetail";
import BusinessUnitEditor from "./Form";
import BusinessUnitTable from "./Table";
import {
  unitbisnisService,
  type BusinessUnit,
  type BusinessUnitDetail,
  type BusinessUnitInput,
} from "../../services/cms/unitbisnisService";
import { useDebouncedValue } from "../../components/hooks/useDebouncedValue";

export default function Management() {
  const queryClient = useQueryClient();
  const role = authService.getCurrentSession()?.user.role;
  const canDeletePermanently = role === "admin" || role === "super_admin";
  const canManageUnits = role === "super_admin";
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnitDetail | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editorUnit, setEditorUnit] = useState<BusinessUnit | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<BusinessUnit | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const closeDeleteModal = useCallback(() => setDeletingUnit(null), []);
  const unitsQuery = useQuery({
    queryKey: ["cms-business-units"],
    queryFn: () => unitbisnisService.getUnits(),
  });
  const units = unitsQuery.data ?? [];
  const loading = unitsQuery.isPending;

  useEffect(() => {
    if (unitsQuery.error) {
      toast.error(`Gagal memuat unit bisnis: ${getApiErrorMessage(unitsQuery.error)}`);
    }
  }, [unitsQuery.error]);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["cms-business-units"] });
  };

  const filteredUnits = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLocaleLowerCase("id-ID");
    return units.filter((unit) =>
      [unit.name, unit.slug, unit.description ?? "", unit.tenantType]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(normalizedQuery),
    );
  }, [debouncedQuery, units]);
  const activeUnitCount = units.filter(
    (unit) => unit.status === "active",
  ).length;
  const resourceCount = units.reduce(
    (total, unit) => total + unit.resourceCount,
    0,
  );

  const openEditor = (unit?: BusinessUnit) => {
    setEditorUnit(unit ?? null);
    setEditorOpen(true);
  };

  const saveUnit = async (input: BusinessUnitInput): Promise<BusinessUnit> => {
    try {
      const savedUnit = editorUnit
        ? await unitbisnisService.updateUnit(editorUnit.id, input)
        : await unitbisnisService.createUnit(input);
      toast.success(
        editorUnit
          ? "Unit bisnis berhasil diperbarui."
          : "Unit bisnis berhasil ditambahkan.",
      );
      refresh();
      return savedUnit;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const deleteUnit = (unit: BusinessUnit) => setDeletingUnit(unit);

  const confirmDeleteUnit = async () => {
    if (!deletingUnit) return;
    setDeleteLoading(true);
    try {
      await unitbisnisService.deleteUnitPermanently(deletingUnit.id);
      if (selectedUnit?.id === deletingUnit.id) setSelectedUnit(null);
      setDeletingUnit(null);
      toast.success("Unit bisnis berhasil dihapus permanen.");
      refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  const activateUnit = async (unit: BusinessUnit): Promise<boolean> => {
    try {
      await unitbisnisService.updateUnit(unit.id, { status: "active" });
      toast.success("Unit bisnis berhasil diaktifkan.");
      refresh();
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    }
  };

  const viewDetails = async (unit: BusinessUnit) => {
    setDetailLoading(true);
    setSelectedUnit(null);
    try {
      setSelectedUnit(await unitbisnisService.getUnit(unit.slug));
    } catch (error) {
      toast.error(
        `Gagal memuat detail ${unit.name}: ${getApiErrorMessage(error)}`,
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const editSelectedUnit = () => {
    if (!selectedUnit) return;
    const listUnit = units.find((unit) => unit.id === selectedUnit.id);
    if (!listUnit) return;
    setSelectedUnit(null);
    openEditor(listUnit);
  };

  const toggleSelectedUnitStatus = async () => {
    if (!selectedUnit) return;
    const listUnit = units.find((unit) => unit.id === selectedUnit.id);
    if (!listUnit) return;
    if (listUnit.status === "active") {
      if (canDeletePermanently) deleteUnit(listUnit);
      return;
    }
    if (canManageUnits && (await activateUnit(listUnit))) setSelectedUnit(null);
  };

  return (
    <DashboardPageLayout
      breadcrumb="Unit Bisnis"
      title="Data unit bisnis"
      description="Kelola unit bisnis dan status publiknya langsung dari backend."
    >
      <section
        aria-label="Ringkasan unit bisnis"
        className="mb-5 grid gap-3 sm:grid-cols-3"
      >
        <div className="rounded-xl border border-obc-border bg-white p-3.5 shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green">
              <Building2 size={17} />
            </span>
            <div>
              <p className="text-[11px] text-obc-muted">Total unit bisnis</p>
              <p className="mt-0.5 font-heading text-[19px] font-bold text-obc-charcoal">
                {units.length.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-obc-border bg-white p-3.5 shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#EAF4F0] text-[#296049]">
              <CircleCheck size={17} />
            </span>
            <div>
              <p className="text-[11px] text-obc-muted">Unit aktif</p>
              <p className="mt-0.5 font-heading text-[19px] font-bold text-obc-charcoal">
                {activeUnitCount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-obc-border bg-white p-3.5 shadow-[0_1px_2px_rgba(52,49,51,0.04)]">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#FBF0D3] text-[#8A6100]">
              <MapPin size={17} />
            </span>
            <div>
              <p className="text-[11px] text-obc-muted">Resource terhubung</p>
              <p className="mt-0.5 font-heading text-[19px] font-bold text-obc-charcoal">
                {resourceCount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-3 rounded-xl border border-obc-border bg-white p-3 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <label className="relative block w-full sm:max-w-90">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau slug unit..."
            className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive"
          />
        </label>
        {canManageUnits && (
          <button
            type="button"
            onClick={() => openEditor()}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-obc-green-hover"
          >
            <Plus size={15} />
            Tambah unit bisnis
          </button>
        )}
      </section>

      {detailLoading && (
        <p role="status" className="mb-3 text-[13px] text-obc-muted">
          Memuat detail unit bisnis...
        </p>
      )}
      {selectedUnit && (
        <BusinessUnitDetails
          unit={selectedUnit}
          canDelete={canDeletePermanently}
          canManage={canManageUnits}
          onClose={() => setSelectedUnit(null)}
          onEdit={editSelectedUnit}
          onToggleStatus={() => void toggleSelectedUnitStatus()}
        />
      )}
      {editorOpen && (
        <BusinessUnitEditor
          unit={editorUnit}
          onClose={() => setEditorOpen(false)}
          onSubmit={saveUnit}
        />
      )}
      <BusinessUnitTable
        units={filteredUnits}
        loading={loading}
        selectedSlug={selectedUnit?.slug ?? null}
        onView={viewDetails}
        onDelete={canDeletePermanently ? deleteUnit : undefined}
      />
      <DeleteModal
        isOpen={canDeletePermanently && Boolean(deletingUnit)}
        title="Hapus unit bisnis permanen?"
        description="Unit bisnis akan dihapus permanen dan tidak dapat dipulihkan. Penghapusan ditolak jika unit masih memiliki resource."
        itemName={deletingUnit?.name}
        confirmLabel="Hapus permanen"
        isLoading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteUnit}
      />
    </DashboardPageLayout>
  );
}
