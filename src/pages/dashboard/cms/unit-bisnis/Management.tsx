import { useEffect, useMemo, useState } from "react";
import { Building2, CircleCheck, MapPin, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import BusinessUnitDetails from "./Detail";
import BusinessUnitEditor from "./Editor";
import BusinessUnitTable from "./Table";
import {
  unitbisnisService,
  type BusinessUnit,
  type BusinessUnitDetail,
  type BusinessUnitInput,
} from "./unitbisnisService";

export default function Management() {
  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnitDetail | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editorUnit, setEditorUnit] = useState<BusinessUnit | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setLoading(true);
    });
    unitbisnisService
      .getUnits()
      .then((data) => {
        if (active) setUnits(data);
      })
      .catch((error: unknown) => {
        if (active)
          toast.error(`Gagal memuat unit bisnis: ${getApiErrorMessage(error)}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reload]);

  const filteredUnits = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
    return units.filter((unit) =>
      [unit.name, unit.slug, unit.description ?? "", unit.tenantType]
        .join(" ")
        .toLocaleLowerCase("id-ID")
        .includes(normalizedQuery),
    );
  }, [query, units]);
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
      setReload((value) => value + 1);
      return savedUnit;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      throw error;
    }
  };

  const deactivateUnit = async (unit: BusinessUnit): Promise<boolean> => {
    if (!window.confirm(`Nonaktifkan unit bisnis ${unit.name}?`)) return false;
    try {
      await unitbisnisService.deleteUnit(unit.id);
      toast.success("Unit bisnis berhasil dinonaktifkan.");
      setReload((value) => value + 1);
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    }
  };

  const activateUnit = async (unit: BusinessUnit): Promise<boolean> => {
    try {
      await unitbisnisService.updateUnit(unit.id, { status: "active" });
      toast.success("Unit bisnis berhasil diaktifkan.");
      setReload((value) => value + 1);
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
    const updated =
      listUnit.status === "active"
        ? await deactivateUnit(listUnit)
        : await activateUnit(listUnit);
    if (updated) setSelectedUnit(null);
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
        <button
          type="button"
          onClick={() => openEditor()}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-obc-green-hover"
        >
          <Plus size={15} />
          Tambah unit bisnis
        </button>
      </section>

      {detailLoading && (
        <p role="status" className="mb-3 text-[13px] text-obc-muted">
          Memuat detail unit bisnis...
        </p>
      )}
      {selectedUnit && (
        <BusinessUnitDetails
          unit={selectedUnit}
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
      />
    </DashboardPageLayout>
  );
}
