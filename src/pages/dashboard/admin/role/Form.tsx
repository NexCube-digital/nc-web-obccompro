import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import { PERMISSION_LABELS, ROLE_LABELS, ROLE_PERMISSION_OPTIONS, type RolePermission } from "./roleService";

type Props = {
	rolePermission: RolePermission;
	saving: boolean;
	onCancel: () => void;
	onSave: (permissions: string[]) => void;
};

export default function RolePermissionForm({ rolePermission, saving, onCancel, onSave }: Props) {
	const [selected, setSelected] = useState<string[]>(rolePermission.permissions);
	const options = useMemo(() => {
		const known = ROLE_PERMISSION_OPTIONS.map((option) => option.key);
		const additional = rolePermission.permissions.filter((permission) => !known.includes(permission as typeof known[number]));
		return [
			...ROLE_PERMISSION_OPTIONS.map((option) => ({ key: option.key, label: option.label })),
			...additional.map((key) => ({ key, label: PERMISSION_LABELS[key] ?? key })),
		];
	}, [rolePermission.permissions]);

	useEffect(() => {
		setSelected(rolePermission.permissions);
	}, [rolePermission]);

	const toggle = (permission: string) => {
		setSelected((current) => current.includes(permission)
			? current.filter((item) => item !== permission)
			: [...current, permission]);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSave(selected);
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">Permission: {ROLE_LABELS[rolePermission.role] ?? rolePermission.role}</h2><p className="mt-1 text-[12px] text-obc-muted">Pilih akses yang berlaku untuk role ini.</p></div><button type="button" onClick={onCancel} aria-label="Tutup editor permission" className="grid size-9 shrink-0 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
			<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{options.map((option) => {
					const checked = selected.includes(option.key);
					return <label key={option.key} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-[13px] transition-colors ${checked ? "border-[#9AAD3E] bg-[#F6F9E9] text-obc-charcoal" : "border-obc-border text-obc-muted hover:bg-[#FDFCF7]"}`}>
						<input type="checkbox" checked={checked} onChange={() => toggle(option.key)} className="sr-only" />
						<span className={`grid size-5 shrink-0 place-items-center rounded border ${checked ? "border-obc-green bg-obc-green text-white" : "border-obc-border bg-white"}`}>{checked && <Check size={13} />}</span>
						{option.label}
					</label>;
				})}
			</div>
			<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan permission"}</button></div>
		</form>
	);
}
