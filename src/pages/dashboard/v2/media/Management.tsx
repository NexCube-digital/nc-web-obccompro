import { useEffect, useMemo, useState } from "react";
import { Files, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../../../../services/auth";
import { getApiErrorMessage } from "../../../../services/api";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import MediaForm from "./Form";
import MediaTable from "./Table";
import { mediaService, type MediaRecord, type MediaType } from "./mediaService";

export default function Management() {
	const [media, setMedia] = useState<MediaRecord[]>([]);
	const [tenantId, setTenantId] = useState(() => authService.getCurrentSession()?.user.tenantId ?? "");
	const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [reload, setReload] = useState(0);

	useEffect(() => {
		let active = true;
		setLoading(true);
		mediaService.getMedia()
			.then((data) => { if (active) setMedia(data); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [reload]);

	const filteredMedia = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return media.filter((item) => {
			const typeMatches = typeFilter === "all" || item.mediaType === typeFilter;
			const queryMatches = [item.originalName, item.filename, item.mimeType, item.altText]
				.filter(Boolean)
				.join(" ")
				.toLowerCase()
				.includes(normalizedQuery);
			return typeMatches && queryMatches;
		});
	}, [media, query, typeFilter]);

	const upload = async (file: File) => {
		setUploading(true);
		try {
			await mediaService.uploadMedia(file, tenantId.trim());
			toast.success("Media berhasil diunggah.");
			setReload((value) => value + 1);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setUploading(false);
		}
	};

	const removeMedia = async (item: MediaRecord) => {
		if (!window.confirm(`Hapus file "${item.originalName}"? File akan dihapus permanen.`)) return;
		setDeletingId(item.id);
		try {
			await mediaService.deleteMedia(item.id);
			setMedia((current) => current.filter((mediaItem) => mediaItem.id !== item.id));
			toast.success("Media berhasil dihapus.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setDeletingId(null);
		}
	};

	const imageCount = media.filter((item) => item.mediaType === "image").length;

	return (
		<DashboardPageLayout breadcrumb="Media" title="Pustaka media" description="Unggah dan kelola aset gambar serta dokumen CMS.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2">
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Files size={18} /></span><div><p className="text-[12px] text-obc-muted">Total file</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{media.length.toLocaleString("id-ID")}</p></div></div></div>
				<div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#FBF0D3] text-[#8A6100]"><ImageIcon size={18} /></span><div><p className="text-[12px] text-obc-muted">Gambar</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{imageCount.toLocaleString("id-ID")}</p></div></div></div>
			</section>
			<div className="mb-4"><MediaForm tenantId={tenantId} busy={uploading} onTenantIdChange={setTenantId} onUpload={upload} /></div>
			<section className="mb-4 flex flex-col gap-2 sm:flex-row">
				<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama file atau format..." className="h-10 w-full rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive sm:max-w-[320px]" />
				<select aria-label="Filter jenis media" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as MediaType | "all")} className="h-10 rounded-lg border border-obc-border bg-white px-3 text-[13px] outline-none focus:border-obc-olive"><option value="all">Semua jenis</option><option value="image">Gambar</option><option value="video">Video</option><option value="document">Dokumen</option></select>
			</section>
			<MediaTable media={filteredMedia} loading={loading} deletingId={deletingId} onDelete={removeMedia} />
		</DashboardPageLayout>
	);
}
