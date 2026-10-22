import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import TeamForm from "./Form";
import TeamTable from "./Table";
import { teamService, type TeamMember } from "./teamService";

export default function Management() {
	const [teams, setTeams] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		teamService.getTeams()
			.then((data) => { if (active) setTeams(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [reload]);

	const filteredTeams = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return teams.filter((team) => [team.name, team.position, team.expertise, team.bio, team.user?.email]
			.filter(Boolean)
			.join(" ")
			.toLowerCase()
			.includes(normalizedQuery));
	}, [query, teams]);
	const refresh = () => setReload((value) => value + 1);

	const editTeam = (team: TeamMember) => {
		setEditingTeam(team);
		setShowForm(true);
	};

	const deleteTeam = async (team: TeamMember) => {
		if (!window.confirm(`Hapus anggota tim "${team.name}"?`)) return;
		try {
			await teamService.deleteTeam(team.id);
			toast.success("Anggota tim berhasil dihapus.");
			refresh();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Tim" title="Manajemen tim" description="Kelola profil, keahlian, urutan tampil, dan relasi akun anggota tim.">
			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<label className="relative block w-full sm:max-w-[320px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari anggota tim..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label>
				{!showForm && <button type="button" onClick={() => { setEditingTeam(null); setShowForm(true); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Tambah anggota</button>}
			</section>
			<section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Users size={18} /></span><div><p className="text-[12px] text-obc-muted">Total anggota</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{teams.length.toLocaleString("id-ID")}</p></div></div></div></section>
			{showForm && <div className="mb-4"><TeamForm key={editingTeam?.id ?? "new"} team={editingTeam} onCancel={() => setShowForm(false)} onSaved={() => { setShowForm(false); refresh(); }} /></div>}
			<TeamTable teams={filteredTeams} loading={loading} onEdit={editTeam} onDelete={deleteTeam} />
		</DashboardPageLayout>
	);
}
