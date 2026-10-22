import { Pencil } from "lucide-react";
import { PERMISSION_LABELS, ROLE_LABELS, type RolePermission } from "./roleService";

type Props = {
	roles: RolePermission[];
	loading: boolean;
	onEdit: (rolePermission: RolePermission) => void;
};

export default function RolePermissionTable({ roles, loading, onEdit }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Daftar role</h2><p className="mt-0.5 text-[12px] text-obc-muted">{roles.length.toLocaleString("id-ID")} role</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Role</th><th className="px-5 py-3.5">Jumlah permission</th><th className="px-5 py-3.5">Akses aktif</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={4} className="px-5 py-12 text-center text-obc-muted">Memuat role dan permission...</td></tr> : roles.length ? roles.map((rolePermission) => <tr key={rolePermission.role} className="border-t border-obc-border hover:bg-[#FDFCF7]">
					<td className="px-5 py-4"><p className="font-semibold text-obc-charcoal">{ROLE_LABELS[rolePermission.role] ?? rolePermission.role}</p><p className="mt-0.5 text-[11px] text-obc-muted">{rolePermission.role}</p></td>
					<td className="px-5 py-4 font-medium">{rolePermission.permissions.length}</td>
					<td className="px-5 py-4"><div className="flex max-w-[520px] flex-wrap gap-1.5">{rolePermission.permissions.slice(0, 5).map((permission) => <span key={permission} className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] text-obc-charcoal">{PERMISSION_LABELS[permission] ?? permission}</span>)}{rolePermission.permissions.length > 5 && <span className="px-1 py-1 text-[11px] text-obc-muted">+{rolePermission.permissions.length - 5} lainnya</span>}{!rolePermission.permissions.length && <span className="text-[12px] text-obc-muted">Tidak ada akses</span>}</div></td>
					<td className="px-5 py-4 text-right"><button type="button" onClick={() => onEdit(rolePermission)} aria-label={`Atur permission ${ROLE_LABELS[rolePermission.role] ?? rolePermission.role}`} title="Atur permission" className="inline-grid size-9 place-items-center rounded-lg border border-obc-border text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Pencil size={15} /></button></td>
				</tr>) : <tr><td colSpan={4} className="px-5 py-12 text-center text-obc-muted">Data role belum tersedia.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
