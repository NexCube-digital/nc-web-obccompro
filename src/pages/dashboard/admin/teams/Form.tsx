import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../../../services/api";
import { getTeamPhotoUrl, teamService, type TeamInput, type TeamMember } from "./teamService";

type Props = {
	team: TeamMember | null;
	onCancel: () => void;
	onSaved: () => void;
};

const inputClass = "mt-1 h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "block text-[12px] font-medium text-obc-charcoal";

export default function TeamForm({ team, onCancel, onSaved }: Props) {
	const [name, setName] = useState(team?.name ?? "");
	const [position, setPosition] = useState(team?.position ?? "");
	const [bio, setBio] = useState(team?.bio ?? "");
	const [expertise, setExpertise] = useState(team?.expertise ?? "");
	const [photoUrl, setPhotoUrl] = useState(team?.photoUrl ?? "");
	const [bankName, setBankName] = useState(team?.bankName ?? "");
	const [bankAccount, setBankAccount] = useState(team?.bankAccount ?? "");
	const [sortOrder, setSortOrder] = useState(String(team?.sortOrder ?? 0));
	const [userId, setUserId] = useState(team?.userId ?? "");
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const payload: TeamInput = {
			name: name.trim(),
			position: position.trim() || null,
			bio: bio.trim() || null,
			expertise: expertise.trim() || null,
			photoUrl: photoUrl.trim() || null,
			bankName: bankName.trim() || null,
			bankAccount: bankAccount.trim() || null,
			sortOrder: Number(sortOrder),
			userId: userId.trim() || null,
		};
		setSaving(true);
		try {
			if (team) {
				await teamService.updateTeam(team.id, payload);
				toast.success("Data anggota tim berhasil diperbarui.");
			} else {
				await teamService.createTeam(payload);
				toast.success("Anggota tim berhasil ditambahkan.");
			}
			onSaved();
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">{team ? "Ubah anggota tim" : "Anggota tim baru"}</h2><button type="button" onClick={onCancel} aria-label="Tutup form anggota tim" className="grid size-9 place-items-center rounded-lg text-obc-muted hover:bg-[#FDFCF7]"><X size={17} /></button></div>
			<div className="grid gap-4 sm:grid-cols-2">
				<label className={labelClass}>Nama lengkap<input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} maxLength={255} required /></label>
				<label className={labelClass}>Jabatan<input className={inputClass} value={position} onChange={(event) => setPosition(event.target.value)} maxLength={255} /></label>
				<label className={labelClass}>Keahlian<input className={inputClass} value={expertise} onChange={(event) => setExpertise(event.target.value)} maxLength={500} placeholder="Contoh: Operasional, pemasaran" /></label>
				<label className={labelClass}>URL foto<input className={inputClass} value={photoUrl} onChange={(event) => setPhotoUrl(event.target.value)} maxLength={500} placeholder="https://... atau /uploads/..." /></label>
				<label className={labelClass}>Nama bank<input className={inputClass} value={bankName} onChange={(event) => setBankName(event.target.value)} maxLength={100} /></label>
				<label className={labelClass}>Nomor rekening<input className={inputClass} value={bankAccount} onChange={(event) => setBankAccount(event.target.value)} maxLength={50} /></label>
				<label className={labelClass}>Urutan tampil<input className={inputClass} type="number" min="0" step="1" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} required /></label>
				<label className={labelClass}>ID akun staf <span className="font-normal text-obc-muted">(opsional, UUID)</span><input className={inputClass} value={userId} onChange={(event) => setUserId(event.target.value)} pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" title="Masukkan UUID akun staf yang valid." /></label>
				<label className={`${labelClass} sm:col-span-2`}>Bio<textarea className={`${inputClass} h-24 resize-y py-2`} value={bio} onChange={(event) => setBio(event.target.value)} maxLength={2000} /></label>
			</div>
			{photoUrl && <img src={getTeamPhotoUrl(photoUrl)} alt="Pratinjau foto anggota tim" className="mt-4 size-20 rounded-lg border border-obc-border object-cover" />}
			<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button><button type="submit" disabled={saving} className="h-10 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60">{saving ? "Menyimpan..." : team ? "Simpan perubahan" : "Tambah anggota"}</button></div>
		</form>
	);
}
