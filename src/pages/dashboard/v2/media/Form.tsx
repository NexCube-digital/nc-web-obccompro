import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FileUp, Upload, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
	tenantId: string;
	busy: boolean;
	onTenantIdChange: (value: string) => void;
	onUpload: (file: File) => void;
};

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif", "application/pdf"];
const inputClass = "h-10 w-full rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-[13px] outline-none focus:border-obc-olive";

export default function MediaForm({ tenantId, busy, onTenantIdChange, onUpload }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selected = event.target.files?.[0] ?? null;
		event.target.value = "";
		if (!selected) return;
		if (!ACCEPTED_TYPES.includes(selected.type)) {
			toast.error("Format yang didukung: JPG, PNG, WebP, SVG, GIF, atau PDF.");
			return;
		}
		if (selected.size > MAX_FILE_SIZE) {
			toast.error("Ukuran file maksimal 5 MB.");
			return;
		}
		setFile(selected);
	};

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!file) {
			toast.error("Pilih file yang akan diunggah.");
			return;
		}
		if (!tenantId.trim()) {
			toast.error("Tenant ID wajib diisi untuk upload media.");
			return;
		}
		onUpload(file);
	};

	return (
		<form onSubmit={submit} className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<div className="mb-4"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Upload media</h2><p className="mt-1 text-[12px] text-obc-muted">Pilih gambar atau PDF hingga 5 MB.</p></div>
			<div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.8fr)_auto] sm:items-end">
				<label className="block text-[12px] font-medium text-obc-charcoal">Tenant ID
					<input className={`${inputClass} mt-1`} value={tenantId} onChange={(event) => onTenantIdChange(event.target.value)} placeholder="UUID tenant" required pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" title="Masukkan UUID tenant yang valid." />
				</label>
				<div>
					<span className="mb-1 block text-[12px] font-medium text-obc-charcoal">File</span>
					<div className="flex gap-2">
						<button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-obc-border bg-[#FDFCF7] px-3 text-left text-[13px] text-obc-charcoal hover:border-obc-olive disabled:opacity-60"><FileUp size={16} className="shrink-0 text-obc-muted" /><span className="truncate">{file?.name ?? "Pilih file media"}</span></button>
						{file && <button type="button" aria-label="Hapus pilihan file" title="Hapus pilihan file" onClick={() => setFile(null)} disabled={busy} className="grid size-10 shrink-0 place-items-center rounded-lg border border-obc-border text-obc-muted hover:bg-red-50 hover:text-obc-red disabled:opacity-60"><X size={15} /></button>}
					</div>
					<input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf" onChange={handleFileChange} className="sr-only" />
				</div>
				<button type="submit" disabled={busy} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover disabled:opacity-60"><Upload size={15} />{busy ? "Mengunggah..." : "Upload"}</button>
			</div>
		</form>
	);
}
