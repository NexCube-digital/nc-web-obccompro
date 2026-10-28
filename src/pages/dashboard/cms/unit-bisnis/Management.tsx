import { useEffect, useMemo, useState } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import BusinessUnitDetails from "./Form";
import BusinessUnitEditor from "./Editor";
import BusinessUnitTable from "./Table";
import { unitbisnisService, type BusinessUnit, type BusinessUnitDetail, type BusinessUnitInput } from "./unitbisnisService";

export default function Management() {
	const [units, setUnits] = useState<BusinessUnit[]>([]);
	const [selectedUnit, setSelectedUnit] = useState<BusinessUnitDetail | null>(null);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [detailLoading, setDetailLoading] = useState(false);
	const [editorUnit, setEditorUnit] = useState<BusinessUnit | null>(null);
	const [editorOpen, setEditorOpen] = useState(false);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		queueMicrotask(() => { if (active) setLoading(true); });
		unitbisnisService.getUnits()
			.then((data) => { if (active) setUnits(data); })
			.catch((error: unknown) => { if (active) toast.error(`Gagal memuat unit bisnis: ${getApiErrorMessage(error)}`); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [reload]);

	const filteredUnits = useMemo(() => {
		const normalizedQuery = query.trim().toLocaleLowerCase("id-ID");
		return units.filter((unit) => [unit.name, unit.slug, unit.description ?? "", unit.tenantType]
			.join(" ")
			.toLocaleLowerCase("id-ID")
			.includes(normalizedQuery));
	}, [query, units]);

	const openEditor = (unit?: BusinessUnit) => {
		setEditorUnit(unit ?? null);
		setEditorOpen(true);
	};

	const saveUnit = async (input: BusinessUnitInput): Promise<BusinessUnit> => {
		try {
			const savedUnit = editorUnit
				? await unitbisnisService.updateUnit(editorUnit.id, input)
				: await unitbisnisService.createUnit(input);
			toast.success(editorUnit ? "Unit bisnis berhasil diperbarui." : "Unit bisnis berhasil ditambahkan.");
			setReload((value) => value + 1);
			return savedUnit;
		} catch (error) {
			toast.error(getApiErrorMessage(error));
			throw error;
		}
	};

	const deactivateUnit = async (unit: BusinessUnit) => {
		if (!window.confirm(`Nonaktifkan unit bisnis ${unit.name}?`)) return;
		try {
			await unitbisnisService.deleteUnit(unit.id);
			toast.success("Unit bisnis berhasil dinonaktifkan.");
			setReload((value) => value + 1);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	const activateUnit = async (unit: BusinessUnit) => {
		try {
			await unitbisnisService.updateUnit(unit.id, { status: "active" });
			toast.success("Unit bisnis berhasil diaktifkan.");
			setReload((value) => value + 1);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	const viewDetails = async (unit: BusinessUnit) => {
		setDetailLoading(true);
		setSelectedUnit(null);
		try {
			setSelectedUnit(await unitbisnisService.getUnit(unit.slug));
		} catch (error) {
			toast.error(`Gagal memuat detail ${unit.name}: ${getApiErrorMessage(error)}`);
		} finally {
			setDetailLoading(false);
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Unit Bisnis" title="Data unit bisnis" description="Kelola unit bisnis dan status publiknya langsung dari backend.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2">
				<div className="rounded-xl border border-obc-border bg-white p-4">
					<div className="flex items-center gap-3">
						<span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Building2 size={18} /></span>
						<div><p className="text-[12px] text-obc-muted">Unit bisnis aktif dari backend</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{units.length.toLocaleString("id-ID")}</p></div>
					</div>
				</div>
				
			</section>

			<div className="mb-4 flex flex-col gap-2 sm:flex-row">
				<button type="button" onClick={() => openEditor()} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white"><Plus size={16} />Tambah unit bisnis</button>
				<label className="relative block w-full sm:max-w-90">
					<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
					<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau slug unit..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" />
				</label>
			</div>

			{detailLoading && <p role="status" className="mb-3 text-[13px] text-obc-muted">Memuat detail unit bisnis...</p>}
			{selectedUnit && <BusinessUnitDetails unit={selectedUnit} onClose={() => setSelectedUnit(null)} />}
			{editorOpen && <BusinessUnitEditor unit={editorUnit} onClose={() => setEditorOpen(false)} onSubmit={saveUnit} />}
			<BusinessUnitTable units={filteredUnits} loading={loading} selectedSlug={selectedUnit?.slug ?? null} onView={viewDetails} onEdit={openEditor} onDeactivate={deactivateUnit} onActivate={activateUnit} />
		</DashboardPageLayout>
	);
}