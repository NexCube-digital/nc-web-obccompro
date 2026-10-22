import { useState, type ChangeEvent, type FormEvent } from "react";
import { FileUp, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { financeService, type FinanceInput, type FinanceType } from "./financeService";

type Props = {
	onCreated: () => void;
	onCancel: () => void;
};

type FinanceMode = "single" | "bulk";

const inputClass = "h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] text-obc-charcoal outline-none focus:border-obc-olive focus:ring-2 focus:ring-[#CDF178]";
const labelClass = "mb-1.5 block text-[12px] font-medium text-obc-charcoal";

function parseCsv(text: string): Omit<FinanceInput, "division">[] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = "";
	let quoted = false;

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index];
		if (character === '"') {
			if (quoted && text[index + 1] === '"') {
				field += '"';
				index += 1;
			} else {
				quoted = !quoted;
			}
		} else if (character === "," && !quoted) {
			row.push(field.trim());
			field = "";
		} else if ((character === "\n" || character === "\r") && !quoted) {
			if (character === "\r" && text[index + 1] === "\n") index += 1;
			row.push(field.trim());
			if (row.some(Boolean)) rows.push(row);
			row = [];
			field = "";
		} else {
			field += character;
		}
	}
	row.push(field.trim());
	if (row.some(Boolean)) rows.push(row);
	if (quoted) throw new Error("CSV memiliki tanda kutip yang belum ditutup.");
	if (rows.length < 2) throw new Error("CSV harus berisi header dan minimal satu transaksi.");

	const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").toLowerCase());
	const required = ["type", "amount", "date"];
	const missing = required.filter((header) => !headers.includes(header));
	if (missing.length) throw new Error(`Kolom wajib tidak ditemukan: ${missing.join(", ")}.`);

	return rows.slice(1).map((values, rowIndex) => {
		const get = (key: string) => values[headers.indexOf(key)] ?? "";
		const type = get("type").toLowerCase();
		const amount = Number(get("amount"));
		const date = get("date");
		if (type !== "income" && type !== "expense") {
			throw new Error(`Type pada baris ${rowIndex + 2} harus income atau expense.`);
		}
		if (!Number.isSafeInteger(amount) || amount <= 0) {
			throw new Error(`Amount pada baris ${rowIndex + 2} harus bilangan bulat positif.`);
		}
		if (!date || Number.isNaN(new Date(date).getTime())) {
			throw new Error(`Date pada baris ${rowIndex + 2} tidak valid.`);
		}

		return {
			type: type as FinanceType,
			category: get("category") || null,
			description: get("description") || null,
			amount,
			date,
			status: get("status") || "confirmed",
		};
	});
}

export default function FinanceForm({ onCreated, onCancel }: Props) {
	const [mode, setMode] = useState<FinanceMode>("single");
	const [saving, setSaving] = useState(false);
	const [division, setDivision] = useState("obc");
	const [type, setType] = useState<FinanceType>("income");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
	const [status, setStatus] = useState("confirmed");
	const [csvFile, setCsvFile] = useState<File | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCsvFile(event.target.files?.[0] ?? null);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaving(true);
		try {
			if (mode === "single") {
				await financeService.createFinance({
					division: division.trim() || "obc",
					type,
					category: category.trim() || null,
					description: description.trim() || null,
					amount: Number(amount),
					date,
					status: status.trim() || "confirmed",
				});
				toast.success("Transaksi berhasil ditambahkan.");
			} else {
				if (!csvFile) throw new Error("Pilih file CSV terlebih dahulu.");
				const items = parseCsv(await csvFile.text());
				const result = await financeService.bulkCreateFinances(items, division.trim() || "obc");
				toast.success(`${result.count} transaksi berhasil diimpor.`);
			}
			onCreated();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menyimpan transaksi.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<h2 className="font-heading text-[16px] font-semibold text-obc-charcoal">Catat transaksi</h2>
				<div role="tablist" aria-label="Mode pencatatan" className="flex rounded-lg border border-obc-border bg-[#FDFCF7] p-1">
					<button type="button" role="tab" aria-selected={mode === "single"} onClick={() => setMode("single")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium ${mode === "single" ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}><Plus size={14} />Satu transaksi</button>
					<button type="button" role="tab" aria-selected={mode === "bulk"} onClick={() => setMode("bulk")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium ${mode === "bulk" ? "bg-white text-obc-charcoal shadow-sm" : "text-obc-muted"}`}><Upload size={14} />Impor CSV</button>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<label><span className={labelClass}>Divisi</span><input className={inputClass} value={division} onChange={(event) => setDivision(event.target.value)} maxLength={50} required /></label>
				{mode === "single" ? <>
					<label><span className={labelClass}>Jenis</span><select className={inputClass} value={type} onChange={(event) => setType(event.target.value as FinanceType)}><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select></label>
					<label><span className={labelClass}>Kategori</span><input className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)} maxLength={100} placeholder="Contoh: Operasional" /></label>
					<label><span className={labelClass}>Nominal (Rp)</span><input className={inputClass} type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
					<label><span className={labelClass}>Tanggal</span><input className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
					<label><span className={labelClass}>Status</span><input className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)} maxLength={50} required /></label>
					<label className="sm:col-span-2 lg:col-span-3"><span className={labelClass}>Keterangan</span><textarea className={`${inputClass} h-20 resize-y py-2`} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} /></label>
				</> : <div className="sm:col-span-1 lg:col-span-2">
					<span className={labelClass}>File CSV</span>
					<label className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-obc-border bg-[#FDFCF7] px-3 py-2 text-[13px] text-obc-muted hover:border-obc-olive">
						<FileUp size={16} />
						<span className="truncate">{csvFile?.name ?? "Pilih file CSV transaksi"}</span>
						<input className="sr-only" type="file" accept=".csv,text/csv" onChange={handleFileChange} />
					</label>
					<p className="mt-1 text-[11px] text-obc-muted">Header wajib: type, amount, date. Opsional: category, description, status. Type: income atau expense.</p>
				</div>}
			</div>

			<div className="mt-5 flex justify-end gap-2">
				<button type="button" onClick={onCancel} disabled={saving} className="h-10 rounded-lg border border-obc-border px-4 text-[13px] font-medium text-obc-charcoal hover:bg-[#FDFCF7] disabled:opacity-60">Batal</button>
				<button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white transition-colors hover:bg-obc-green-hover disabled:cursor-wait disabled:opacity-60">
					{mode === "bulk" ? <Upload size={15} /> : <Plus size={15} />}
					{saving ? "Menyimpan..." : mode === "bulk" ? "Impor transaksi" : "Tambah transaksi"}
				</button>
			</div>
		</form>
	);
}
