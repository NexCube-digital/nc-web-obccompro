import { Pencil, Trash2, Users } from "lucide-react";
import { getTeamPhotoUrl, type TeamMember } from "./teamService";

type Props = {
	teams: TeamMember[];
	loading: boolean;
	onEdit: (team: TeamMember) => void;
	onDelete: (team: TeamMember) => void;
};

export default function TeamTable({ teams, loading, onEdit, onDelete }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Anggota tim</h2><p className="mt-0.5 text-[12px] text-obc-muted">{teams.length.toLocaleString("id-ID")} anggota</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Anggota</th><th className="px-5 py-3.5">Jabatan / keahlian</th><th className="px-5 py-3.5">Akun staf</th><th className="px-5 py-3.5">Urutan</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat anggota tim...</td></tr> : teams.length ? teams.map((team) => <tr key={team.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
					<td className="px-5 py-3.5"><div className="flex items-center gap-3">{team.photoUrl ? <img src={getTeamPhotoUrl(team.photoUrl)} alt="" className="size-10 shrink-0 rounded-full object-cover" /> : <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E7F5D0] text-[#1F3320]"><Users size={16} /></span>}<div className="min-w-0"><p className="truncate font-semibold text-obc-charcoal">{team.name}</p><p className="max-w-[280px] truncate text-[11px] text-obc-muted">{team.bio || "-"}</p></div></div></td>
					<td className="px-5 py-3.5"><p className="text-obc-charcoal">{team.position || "-"}</p><p className="text-[11px] text-obc-muted">{team.expertise || ""}</p></td>
					<td className="px-5 py-3.5"><p className="text-obc-charcoal">{team.user?.email || "Tidak terhubung"}</p>{team.user?.role && <p className="text-[11px] capitalize text-obc-muted">{team.user.role.replaceAll("_", " ")}</p>}</td>
					<td className="px-5 py-3.5 text-obc-muted">{team.sortOrder}</td>
					<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => onEdit(team)} aria-label={`Ubah ${team.name}`} title="Ubah anggota" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button><button type="button" onClick={() => onDelete(team)} aria-label={`Hapus ${team.name}`} title="Hapus anggota" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red"><Trash2 size={15} /></button></div></td>
				</tr>) : <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Belum ada anggota tim yang cocok.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
