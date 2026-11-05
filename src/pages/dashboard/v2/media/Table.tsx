import { Copy, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize, getMediaUrl, type MediaRecord, type MediaType } from "./mediaService";

type Props = {
	media: MediaRecord[];
	loading: boolean;
	deletingId: string | null;
	onDelete: (item: MediaRecord) => void;
};

const typeLabels: Record<MediaType, string> = {
	image: "Gambar",
	video: "Video",
	document: "Dokumen",
};

async function copyMediaUrl(url: string) {
	try {
		await navigator.clipboard.writeText(getMediaUrl(url));
		toast.success("URL media disalin.");
	} catch {
		toast.error("Tidak dapat menyalin URL media.");
	}
}

export default function MediaTable({ media, loading, deletingId, onDelete }: Props) {
	return (
		<section className="overflow-hidden rounded-xl border border-obc-border bg-white">
			<div className="border-b border-obc-border px-4 py-4 sm:px-5"><h2 className="font-heading text-[15px] font-semibold text-obc-charcoal">Pustaka media</h2><p className="mt-0.5 text-[12px] text-obc-muted">{media.length.toLocaleString("id-ID")} file</p></div>
			<div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left">
				<thead><tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase tracking-wide text-obc-muted"><th className="px-5 py-3.5">Pratinjau</th><th className="px-5 py-3.5">Nama file</th><th className="px-5 py-3.5">Tipe / ukuran</th><th className="px-5 py-3.5">Tanggal upload</th><th className="px-5 py-3.5 text-right">Aksi</th></tr></thead>
				<tbody className="text-[13px]">{loading ? <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Memuat media...</td></tr> : media.length ? media.map((item) => <tr key={item.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
					<td className="px-5 py-3.5">{item.mediaType === "image" ? <a href={getMediaUrl(item.url)} target="_blank" rel="noreferrer" aria-label={`Buka ${item.originalName}`}><img src={getMediaUrl(item.url)} alt={item.altText ?? item.originalName} className="size-14 rounded-lg border border-obc-border object-cover" /></a> : <span className="grid size-14 place-items-center rounded-lg bg-[#EBEEDC] text-[#404F14]">{item.mediaType === "document" ? <FileText size={20} /> : <ImageIcon size={20} />}</span>}</td>
					<td className="max-w-[360px] px-5 py-3.5"><p className="truncate font-semibold text-obc-charcoal">{item.originalName}</p><p className="truncate text-[11px] text-obc-muted">{item.filename}</p></td>
					<td className="px-5 py-3.5"><span className="rounded-full bg-[#F1EFE8] px-2.5 py-1 text-[11px] font-medium text-obc-charcoal">{typeLabels[item.mediaType]}</span><p className="mt-1 text-[11px] text-obc-muted">{item.mimeType} · {formatFileSize(item.fileSize)}</p></td>
					<td className="whitespace-nowrap px-5 py-3.5 text-[12px] text-obc-muted">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
					<td className="px-5 py-3.5"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => void copyMediaUrl(item.url)} aria-label={`Salin URL ${item.originalName}`} title="Salin URL" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-[#EBEEDC] hover:text-obc-charcoal"><Copy size={15} /></button><button type="button" onClick={() => onDelete(item)} disabled={deletingId === item.id} aria-label={`Hapus ${item.originalName}`} title="Hapus media" className="grid size-8 place-items-center rounded-lg text-obc-muted hover:bg-red-50 hover:text-obc-red disabled:opacity-50"><Trash2 size={15} /></button></div></td>
				</tr>) : <tr><td colSpan={5} className="px-5 py-12 text-center text-obc-muted">Belum ada media yang sesuai.</td></tr>}</tbody>
			</table></div>
		</section>
	);
}
