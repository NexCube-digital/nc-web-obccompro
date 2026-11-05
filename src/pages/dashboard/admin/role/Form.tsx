import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, LoaderCircle, ShieldCheck, X } from "lucide-react";
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
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !saving) onCancel();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onCancel, saving]);

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onCancel(); }}>
			<form onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="role-permission-title" aria-describedby="role-permission-description" className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-obc-border bg-white shadow-2xl">
				<header className="flex items-start justify-between gap-4 border-b border-obc-border bg-[#FDFCF7] px-5 py-4 sm:px-6">
					<div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#E7F5D0] text-obc-green"><ShieldCheck size={19} /></span><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-wide text-obc-green">Pengaturan akses</p><h2 id="role-permission-title" className="mt-1 truncate font-heading text-lg font-bold text-obc-charcoal">{ROLE_LABELS[rolePermission.role] ?? rolePermission.role}</h2><p id="role-permission-description" className="mt-0.5 text-[12px] text-obc-muted">Pilih menu yang dapat diakses role ini.</p></div></div>
					<button type="button" onClick={onCancel} disabled={saving} aria-label="Tutup editor permission" className="grid size-9 shrink-0 place-items-center rounded-lg border border-obc-border bg-white text-obc-muted transition-colors hover:bg-obc-ivory hover:text-obc-charcoal disabled:cursor-not-allowed disabled:opacity-50"><X size={17} /></button>
				</header>
				<div className="overflow-y-auto p-5 sm:p-6">
					<div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h3 className="font-heading text-[13px] font-semibold text-obc-charcoal">Daftar permission</h3><span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F8E8] px-3 py-1.5 text-[11px] font-semibold text-obc-green"><Check size={13} />{selected.length} akses dipilih</span></div>
					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{options.map((option) => {
							const checked = selected.includes(option.key);
							return <label key={option.key} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition-colors focus-within:ring-2 focus-within:ring-[#CDF178] ${checked ? "border-obc-green bg-[#F3F8E8]" : "border-obc-border bg-white hover:bg-[#FDFCF7]"}`}>
								<input type="checkbox" checked={checked} onChange={() => toggle(option.key)} className="size-4 shrink-0 accent-[#1F3320]" />
								<span className="min-w-0"><span className={`block text-[12px] font-semibold ${checked ? "text-obc-charcoal" : "text-obc-muted"}`}>{option.label}</span><span className="mt-0.5 block truncate text-[10px] text-obc-muted">{option.key}</span></span>
							</label>;
						})}
					</div>
				</div>
				<footer className="flex flex-col-reverse gap-2 border-t border-obc-border bg-[#FDFCF7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
					<p className="text-[11px] text-obc-muted">Perubahan berlaku untuk role <span className="font-semibold text-obc-charcoal">{ROLE_LABELS[rolePermission.role] ?? rolePermission.role}</span>.</p>
					<div className="flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border bg-white px-4 text-[13px] font-medium text-obc-charcoal transition-colors hover:bg-obc-ivory disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60">{saving ? <><LoaderCircle size={15} className="animate-spin" />Menyimpan...</> : <><Check size={15} />Simpan perubahan</>}</button></div>
				</footer>
			</form>
		</div>
	);
}
