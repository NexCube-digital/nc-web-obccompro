import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { Check, Send } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../components/layouts/DashboardPageLayout";

type FieldName = "firstName" | "lastName" | "email" | "phone" | "category" | "notes" | "agree";
type Status = "idle" | "valid" | "error" | "warning";
type Result = { status: Status; message: string };

type Values = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	category: string;
	notes: string;
	agree: boolean;
};

const initialValues: Values = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	category: "Pelanggan",
	notes: "",
	agree: false,
};

const NOTES_MAX = 200;
const FIELD_ORDER: FieldName[] = ["firstName", "lastName", "email", "phone", "category", "notes", "agree"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^(\+62|62|0)8\d{7,11}$/;

function validate(v: Values): Record<FieldName, Result> {
	const first = v.firstName.trim();
	const last = v.lastName.trim();
	const phone = v.phone.replace(/[\s-]/g, "");
	const remaining = NOTES_MAX - v.notes.length;

	return {
		firstName: !first
			? { status: "error", message: "Nama depan wajib diisi." }
			: first.length < 2
				? { status: "error", message: "Nama depan minimal 2 karakter." }
				: { status: "valid", message: "Sudah benar!" },
		lastName: !last
			? { status: "error", message: "Nama belakang wajib diisi." }
			: last.length < 2
				? { status: "error", message: "Nama belakang minimal 2 karakter." }
				: { status: "valid", message: "Sudah benar!" },
		email: !v.email.trim()
			? { status: "error", message: "Email wajib diisi." }
			: !emailPattern.test(v.email.trim())
				? { status: "error", message: "Masukkan alamat email yang valid." }
				: { status: "valid", message: "Sudah benar!" },
		phone: !phone
			? { status: "idle", message: "Opsional. Contoh: 081234567890" }
			: !phonePattern.test(phone)
				? { status: "error", message: "Nomor telepon tidak valid. Gunakan format 08xxxxxxxxxx." }
				: { status: "valid", message: "Nomor telepon valid." },
		category: { status: "valid", message: "" },
		notes: !v.notes
			? { status: "idle", message: `Opsional. Maksimal ${NOTES_MAX} karakter.` }
			: remaining <= 20
				? { status: "warning", message: `Mendekati batas, sisa ${remaining} karakter.` }
				: { status: "valid", message: `${v.notes.length}/${NOTES_MAX} karakter` },
		agree: v.agree
			? { status: "valid", message: "" }
			: { status: "error", message: "Persetujuan pelanggan wajib dicentang." },
	};
}

const controlStyle: Record<Status, string> = {
	idle: "border-obc-border bg-white focus:border-[#404F14] focus:ring-[#CDF178]",
	valid: "border-[#9AAD3E] bg-[#F4FBE3] focus:border-[#404F14] focus:ring-[#CDF178]",
	error: "border-[#E5484D] bg-[#FDF2F2] focus:border-[#E5484D] focus:ring-[#F9C9CB]",
	warning: "border-[#E0A100] bg-[#FFF8E6] focus:border-[#E0A100] focus:ring-[#F6E2A8]",
};

const messageStyle: Record<Status, string> = {
	idle: "text-obc-muted",
	valid: "text-[#404F14]",
	error: "text-[#B42318]",
	warning: "text-[#8A6100]",
};

const baseControl =
	"w-full rounded-xl border-2 px-3.5 font-body text-[14px] font-normal text-[#343133] outline-none transition-colors focus:ring-2";

type FieldProps = {
	id: string;
	label: string;
	required?: boolean;
	result: Result;
	children: ReactNode;
	className?: string;
};

function Field({ id, label, required, result, children, className = "" }: FieldProps) {
	return (
		<div className={`grid gap-1.5 ${className}`}>
			<label htmlFor={id} className="text-[13px] font-semibold text-[#343133]">
				{label}
				{required && <span className="ml-0.5 text-[#E5484D]">*</span>}
			</label>
			{children}
			<p
				id={`${id}-msg`}
				role={result.status === "error" ? "alert" : undefined}
				className={`min-h-[18px] text-[12px] leading-[18px] ${messageStyle[result.status]}`}
			>
				{result.message}
			</p>
		</div>
	);
}

export default function Form() {
	const [values, setValues] = useState<Values>(initialValues);
	const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
	const [saved, setSaved] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	const results = validate(values);

	// Hasil validasi hanya ditampilkan setelah kolom disentuh atau form dikirim.
	const shown = (name: FieldName): Result =>
		touched[name] ? results[name] : { status: "idle", message: name === "phone" || name === "notes" ? results[name].message : "" };

	const touch = (name: FieldName) => setTouched((t) => (t[name] ? t : { ...t, [name]: true }));

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, type, value } = event.target;
		const next = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
		setValues((v) => ({ ...v, [name]: next }));
		touch(name as FieldName);
		setSaved(false);
	};

	const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
		touch(event.target.name as FieldName);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setTouched(Object.fromEntries(FIELD_ORDER.map((n) => [n, true])));

		const firstInvalid = FIELD_ORDER.find((n) => results[n].status === "error");
		if (firstInvalid) {
			const isEmptyForm = !values.firstName.trim()
				&& !values.lastName.trim()
				&& !values.email.trim()
				&& !values.phone.trim()
				&& !values.notes.trim()
				&& !values.agree;

			if (isEmptyForm) {
				toast.info("Silakan isi data pelanggan sebelum menyimpan.");
			} else {
				toast.error(results[firstInvalid].message);
			}
			formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
			return;
		}

		toast.success("Data pelanggan berhasil disimpan.");
		setSaved(true);
		setValues(initialValues);
		setTouched({});
	};

	const controlProps = (name: FieldName) => ({
		id: name,
		name,
		onChange: handleChange,
		onBlur: handleBlur,
		"aria-invalid": shown(name).status === "error" || undefined,
		"aria-describedby": shown(name).message ? `${name}-msg` : undefined,
	});

	return (
		<DashboardPageLayout
			breadcrumb="Form"
			title="Form data pelanggan"
			description="Validasi kolom secara langsung saat data pelanggan diisi."
		>
			<section className="w-full rounded-2xl border border-obc-border bg-white p-5 shadow-[0_1px_2px_rgba(52,49,51,0.04)] sm:p-7">
				<h2 className="font-heading text-[17px] font-semibold text-[#343133]">Informasi pelanggan</h2>

				{saved && (
					<p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-[#E7F5D0] px-3.5 py-2.5 text-[13px] font-medium text-[#1F3320]">
						<Check size={16} /> Data pelanggan berhasil disimpan.
					</p>
				)}

				<form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-6 grid items-start gap-x-5 gap-y-3 sm:grid-cols-2">
					<Field id="firstName" label="Nama depan" required result={shown("firstName")}>
						<input
							{...controlProps("firstName")}
							value={values.firstName}
							autoComplete="given-name"
							placeholder="Contoh: Rizky"
							className={`${baseControl} h-11 ${controlStyle[shown("firstName").status]}`}
						/>
					</Field>

					<Field id="lastName" label="Nama belakang" required result={shown("lastName")}>
						<input
							{...controlProps("lastName")}
							value={values.lastName}
							autoComplete="family-name"
							placeholder="Contoh: Pratama"
							className={`${baseControl} h-11 ${controlStyle[shown("lastName").status]}`}
						/>
					</Field>

					<Field id="email" label="Email" required result={shown("email")} className="sm:col-span-2">
						<input
							{...controlProps("email")}
							value={values.email}
							type="email"
							autoComplete="email"
							placeholder="nama@email.com"
							className={`${baseControl} h-11 ${controlStyle[shown("email").status]}`}
						/>
					</Field>

					<Field id="phone" label="Nomor telepon" result={shown("phone")}>
						<input
							{...controlProps("phone")}
							value={values.phone}
							type="tel"
							autoComplete="tel"
							placeholder="08xxxxxxxxxx"
							className={`${baseControl} h-11 ${controlStyle[shown("phone").status]}`}
						/>
					</Field>

					<Field id="category" label="Kategori" result={{ status: "idle", message: "" }}>
						<select
							{...controlProps("category")}
							value={values.category}
							className={`${baseControl} h-11 ${controlStyle.idle}`}
						>
							<option>Pelanggan</option>
							<option>Member</option>
							<option>Mitra</option>
						</select>
					</Field>

					<Field id="notes" label="Catatan" result={shown("notes")} className="sm:col-span-2">
						<textarea
							{...controlProps("notes")}
							value={values.notes}
							rows={4}
							maxLength={NOTES_MAX}
							placeholder="Tambahkan catatan (opsional)"
							className={`${baseControl} resize-y py-2.5 ${controlStyle[shown("notes").status]}`}
						/>
					</Field>

					<div className="grid gap-1.5 sm:col-span-2">
						<label className="flex items-start gap-2.5 text-[13px] text-[#343133]">
							<input
								{...controlProps("agree")}
								type="checkbox"
								checked={values.agree}
								className="mt-0.5 size-4 shrink-0 accent-[#404F14]"
							/>
							<span>
								Pelanggan menyetujui{" "}
								<a href="#" className="font-semibold text-[#404F14] underline-offset-2 hover:underline">
									Syarat &amp; Ketentuan
								</a>{" "}
								dan{" "}
								<a href="#" className="font-semibold text-[#404F14] underline-offset-2 hover:underline">
									Kebijakan Privasi
								</a>
							</span>
						</label>
						{shown("agree").status === "error" && (
							<p id="agree-msg" role="alert" className="text-[12px] text-[#B42318]">
								{shown("agree").message}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#004000] to-[#404F14] font-heading text-[14px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CDF178] focus-visible:ring-offset-2 sm:col-span-2"
					>
						<Send size={15} /> Simpan data
					</button>
				</form>
			</section>
		</DashboardPageLayout>
	);
}