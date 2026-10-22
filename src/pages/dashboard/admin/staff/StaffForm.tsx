import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { accountService, type StaffRole } from "./AccountService";

type StaffFormValues = {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: StaffRole | "";
	position: string;
	expertise: string;
};

const initialValues: StaffFormValues = {
	name: "",
	email: "",
	phone: "",
	password: "",
	role: "",
	position: "",
	expertise: "",
};

const inputClass = "h-11 w-full rounded-xl border border-obc-border bg-white px-3 text-[13px] text-[#343133] outline-none focus:border-[#404F14] focus:ring-2 focus:ring-[#CDF178]";

export default function StaffForm({ onCreated }: { onCreated?: () => void }) {
	const [values, setValues] = useState<StaffFormValues>(initialValues);
	const [submitting, setSubmitting] = useState(false);

	const update = (field: keyof StaffFormValues, value: string) => {
		setValues((current) => ({ ...current, [field]: value }));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!values.role) {
			toast.error("Role staff wajib dipilih.");
			return;
		}
		if (values.password.length < 8 || values.password.length > 128) {
			toast.error("Password harus berisi 8-128 karakter.");
			return;
		}
		const phone = values.phone.replace(/[\s-]/g, "");
		if (phone && !/^(\+62|62|0)[0-9]{8,14}$/.test(phone)) {
			toast.error("Format nomor telepon tidak valid.");
			return;
		}

		try {
			setSubmitting(true);
			await accountService.createStaff({
				name: values.name.trim(),
				email: values.email.trim(),
				password: values.password,
				role: values.role,
				phone: phone || null,
				team: {
					position: values.position.trim() || null,
					expertise: values.expertise.trim() || null,
				},
			});
			toast.success("Staff berhasil ditambahkan.");
			setValues(initialValues);
			onCreated?.();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menambahkan staff.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className="w-full rounded-2xl border border-obc-border bg-white p-5 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-7">
			<h2 className="font-heading text-[17px] font-semibold text-[#343133]">Informasi staff</h2>
			<form onSubmit={handleSubmit} className="mt-6 grid items-start gap-x-5 gap-y-4 sm:grid-cols-2">
				<label className="grid gap-1.5 sm:col-span-2">
					<span className="text-[13px] font-semibold">Nama staff *</span>
					<input required minLength={2} maxLength={120} autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} className={inputClass} placeholder="Nama lengkap" />
				</label>
				<label className="grid gap-1.5">
					<span className="text-[13px] font-semibold">Email *</span>
					<input required type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="nama@email.com" />
				</label>
				<label className="grid gap-1.5">
					<span className="text-[13px] font-semibold">Nomor telepon</span>
					<input type="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />
				</label>
				<label className="grid gap-1.5">
					<span className="text-[13px] font-semibold">Password awal *</span>
					<input required type="password" minLength={8} maxLength={128} autoComplete="new-password" value={values.password} onChange={(event) => update("password", event.target.value)} className={inputClass} />
				</label>
				<label className="grid gap-1.5">
					<span className="text-[13px] font-semibold">Role *</span>
					<select required value={values.role} onChange={(event) => update("role", event.target.value)} className={inputClass}>
						<option value="">Pilih role</option>
						<option value="admin">Admin</option>
						<option value="super_admin">Super admin</option>
						<option value="marketing">Marketing</option>
						<option value="sport">Sport</option>
					</select>
				</label>
				<label className="grid gap-1.5">
					<span className="text-[13px] font-semibold">Posisi tim</span>
					<input maxLength={255} value={values.position} onChange={(event) => update("position", event.target.value)} className={inputClass} placeholder="Opsional" />
				</label>
				<label className="grid gap-1.5 sm:col-span-2">
					<span className="text-[13px] font-semibold">Keahlian</span>
					<textarea maxLength={500} rows={3} value={values.expertise} onChange={(event) => update("expertise", event.target.value)} className="w-full rounded-xl border border-obc-border bg-white p-3 text-[13px] outline-none focus:border-[#404F14] focus:ring-2 focus:ring-[#CDF178]" placeholder="Opsional" />
				</label>
				<div className="flex justify-end sm:col-span-2">
					<button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-[#004000] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#265021] disabled:cursor-wait disabled:opacity-60">
						<Send size={16} /> {submitting ? "Menyimpan..." : "Simpan staff"}
					</button>
				</div>
			</form>
		</section>
	);
}
