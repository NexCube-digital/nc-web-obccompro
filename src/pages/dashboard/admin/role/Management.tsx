import { useEffect, useState } from "react";
import { KeyRound, RotateCcw, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import { roleService, ROLE_LABELS, type RolePermission } from "./roleService";
import RolePermissionForm from "./Form";
import RolePermissionTable from "./Table";

export default function Management() {
	const [roles, setRoles] = useState<RolePermission[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingRole, setEditingRole] = useState<RolePermission | null>(null);
	const [saving, setSaving] = useState(false);
	const [resetting, setResetting] = useState(false);

	const loadRoles = async () => {
		try {
			setLoading(true);
			setRoles(await roleService.getRolePermissions());
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadRoles();
	}, []);

	const saveRolePermissions = async (permissions: string[]) => {
		if (!editingRole) return;
		setSaving(true);
		try {
			const updated = await roleService.updateRolePermissions(editingRole.role, permissions);
			setRoles((current) => current.map((item) => item.role === updated.role ? updated : item));
			setEditingRole(null);
			toast.success(`Permission role ${ROLE_LABELS[updated.role] ?? updated.role} berhasil diperbarui.`);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	const resetDefaults = async () => {
		if (!window.confirm("Kembalikan semua permission ke pengaturan default? Perubahan saat ini akan diganti.")) return;
		setResetting(true);
		try {
			setRoles(await roleService.resetRolePermissions());
			setEditingRole(null);
			toast.success("Permission semua role dikembalikan ke default.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setResetting(false);
		}
	};

	const totalPermissions = roles.reduce((total, role) => total + role.permissions.length, 0);

	return (
		<DashboardPageLayout breadcrumb="Role & permission" title="Role dan permission" description="Atur hak akses menu untuk setiap role staf.">
			<section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Users size={18} /></span><div><p className="text-[12px] text-obc-muted">Role terdaftar</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{roles.length.toLocaleString("id-ID")}</p></div></div></div>
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#FBF0D3] text-[#8A6100]"><KeyRound size={18} /></span><div><p className="text-[12px] text-obc-muted">Permission aktif</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{totalPermissions.toLocaleString("id-ID")}</p></div></div></div>
				<div className="flex items-center justify-between gap-3 rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#EBEEDC] text-[#404F14]"><ShieldCheck size={18} /></span><div><p className="text-[12px] text-obc-muted">Konfigurasi akses</p><p className="font-heading text-[16px] font-semibold text-obc-charcoal">{loading ? "Memuat..." : "Tersimpan di server"}</p></div></div><button type="button" onClick={resetDefaults} disabled={resetting || loading} aria-label="Reset permission ke default" title="Reset ke default" className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-muted hover:bg-[#FDFCF7] disabled:opacity-50"><RotateCcw size={15} /></button></div>
			</section>
			{editingRole && <div className="mb-4"><RolePermissionForm key={editingRole.role} rolePermission={editingRole} saving={saving} onCancel={() => setEditingRole(null)} onSave={saveRolePermissions} /></div>}
			<RolePermissionTable roles={roles} loading={loading} onEdit={setEditingRole} />
		</DashboardPageLayout>
	);
}
