import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit, ToggleLeft, ToggleRight, Star } from "lucide-react";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { testimonialService, type Testimonial } from "./testimonialService";
import { toast } from "sonner";
import { getTestimonialAvatarUrl } from "../../../../services/Public/Testimonial";

export default function Testimoni() {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | Testimonial["status"]>("all");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState("");
	const [reload, setReload] = useState(0);

	const [formData, setFormData] = useState({
		name: "",
		company: "",
		text: "",
		rating: 5,
		avatar: "",
		status: "draft" as "published" | "draft" | "archived",
	});

	useEffect(() => {
		let active = true;
		queueMicrotask(() => { if (active) setLoading(true); });
		testimonialService.getTestimonials({ status: statusFilter })
			.then((data) => { if (active) setTestimonials(data); })
			.catch((error: unknown) => { if (active) toast.error(error instanceof Error ? error.message : "Gagal muat data testimoni"); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [statusFilter, reload]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return testimonials.filter(
			(t) =>
				(t.name?.toLowerCase() || "").includes(q) ||
				(t.company?.toLowerCase() || "").includes(q) ||
				(t.text?.toLowerCase() || "").includes(q)
		);
	}, [query, testimonials]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const avatarRemoved = !formData.avatar && !avatarFile;
		const payload = {
			...formData,
			company: formData.company.trim() || null,
			avatar: formData.avatar.trim() || null,
		};
		try {
			if (editingItem?.id) {
				await testimonialService.updateTestimonial(editingItem.id, payload, avatarFile ?? undefined, avatarRemoved);
				toast.success("Testimoni berhasil diupdate");
			} else {
				await testimonialService.createTestimonial(payload, avatarFile ?? undefined);
				toast.success("Testimoni berhasil dibuat");
			}
			setIsModalOpen(false);
			resetForm();
			setReload((value) => value + 1);
			
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal menyimpan testimoni");
		}
	};

	const handleEdit = (t: Testimonial) => {
		setEditingItem(t);
		setFormData({
			name: t.name,
			company: t.company ?? "",
			text: t.text,
			rating: t.rating,
			avatar: t.avatar ?? "",
			status: t.status,
		});
		setAvatarFile(null);
		setAvatarPreview(getTestimonialAvatarUrl(t.avatar) ?? "");
		setIsModalOpen(true);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Hapus testimoni ini?")) return;
		try {
			await testimonialService.deleteTestimonial(id);
			toast.success("Testimoni berhasil dihapus");
			setReload((value) => value + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal hapus testimoni");
		}
	};

	const handleToggleStatus = async (id: string) => {
		try {
			await testimonialService.toggleTestimonialStatus(id);
			toast.success("Status testimoni diubah");
			setReload((value) => value + 1);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Gagal ubah status");
		}
	};

	const resetForm = () => {
		setEditingItem(null);
		setFormData({ name: "", company: "", text: "", rating: 5, avatar: "", status: "draft" });
		setAvatarFile(null);
		setAvatarPreview("");
	};

	return (
		<DashboardPageLayout
			breadcrumb="Testimoni"
			title="Manajemen Testimoni"
			description="Kelola testimoni pelanggan dan tampilkan di halaman publik."
		>
			<section className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-2">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as "all" | Testimonial["status"])}
						className="h-10 rounded-xl border border-obc-border bg-white px-3 text-[13px] outline-none"
					>
						<option value="all">Semua Status</option>
						<option value="published">Published</option>
						<option value="draft">Draft</option>
						<option value="archived">Archived</option>
					</select>
					<div className="relative w-full sm:w-[280px]">
						<Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Cari testimoni..."
							className="h-10 w-full rounded-xl border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none"
						/>
					</div>
				</div>
				<button
					onClick={() => {
						resetForm();
						setIsModalOpen(true);
					}}
					className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#004000] to-[#404F14] px-4 text-[13px] font-semibold text-white shadow"
				>
					<Plus size={16} /> Tambah Testimoni
				</button>
			</section>

			<section className="overflow-hidden rounded-2xl border border-obc-border bg-white shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[700px] text-left">
						<thead>
							<tr className="border-b border-obc-border bg-[#FDFCF7] font-heading text-[11px] font-semibold uppercase text-obc-muted">
								<th className="px-5 py-3.5">Nama & Perusahaan</th>
								<th className="px-5 py-3.5">Rating</th>
								<th className="px-5 py-3.5">Pesan</th>
								<th className="px-5 py-3.5">Status</th>
								<th className="px-5 py-3.5 text-right">Aksi</th>
							</tr>
						</thead>
						<tbody className="text-[13px]">
							{loading ? (
								<tr>
									<td colSpan={5} className="px-5 py-10 text-center text-obc-muted">
										Memuat data testimoni...
									</td>
								</tr>
							) : filtered.length > 0 ? (
								filtered.map((t) => (
									<tr key={t.id} className="border-t border-obc-border hover:bg-[#FDFCF7]">
										<td className="px-5 py-3.5">
										<div className="flex items-center gap-3">
											{getTestimonialAvatarUrl(t.avatar) ? <img src={getTestimonialAvatarUrl(t.avatar) ?? undefined} alt={t.name} className="size-10 shrink-0 rounded-full object-cover" /> : <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#CDF178] text-[12px] font-bold text-obc-green">{t.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span>}
											<div><p className="font-semibold text-obc-charcoal">{t.name}</p><p className="text-[12px] text-obc-muted">{t.company || "-"}</p></div>
										</div>
										</td>
										<td className="px-5 py-3.5">
											<div className="flex items-center gap-1 text-amber-500">
												<Star size={14} fill="currentColor" />
												<span className="font-semibold text-[#343133]">{t.rating}</span>
											</div>
										</td>
										<td className="px-5 py-3.5 max-w-xs truncate text-obc-muted">{t.text}</td>
										<td className="px-5 py-3.5">
											<span
												className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
													t.status === "published"
														? "bg-[#E7F5D0] text-[#1F3320]"
														: t.status === "draft"
														? "bg-[#FBF0D3] text-[#8A6100]"
														: "bg-gray-100 text-gray-650"
												}`}
											>
												{t.status}
											</span>
										</td>
										<td className="px-5 py-3.5 text-right">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => handleToggleStatus(t.id)}
													title="Toggle Status"
													className="rounded-lg p-1.5 text-obc-muted hover:bg-gray-100"
												>
													{t.status === "published" ? <ToggleRight size={18} className="text-green-700" /> : <ToggleLeft size={18} />}
												</button>
												<button
													onClick={() => handleEdit(t)}
													title="Edit"
													className="rounded-lg p-1.5 text-obc-muted hover:bg-gray-100"
												>
													<Edit size={16} />
												</button>
												<button
													onClick={() => handleDelete(t.id)}
													title="Hapus"
													className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
												>
													<Trash2 size={16} />
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5} className="px-5 py-10 text-center text-obc-muted">
										Tidak ada testimoni.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
						<h3 className="font-heading text-lg font-bold text-[#343133]">
							{editingItem ? "Edit Testimoni" : "Tambah Testimoni"}
						</h3>
						<form onSubmit={handleSubmit} className="mt-4 space-y-4">
							<div>
								<label className="block text-[13px] font-medium text-[#343133]">Nama</label>
								<input
									required
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px] outline-none"
									placeholder="Nama pemberi testimoni"
								/>
							</div>
							<div>
								<label className="block text-[13px] font-medium text-[#343133]">Perusahaan / Role</label>
								<input
									value={formData.company}
									onChange={(e) => setFormData({ ...formData, company: e.target.value })}
									className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px] outline-none"
									placeholder="Contoh: CEO PT Maju Jaya"
								/>
							</div>
								<div>
								<label className="block text-[13px] font-medium text-[#343133]">Foto / avatar <span className="font-normal text-obc-muted">(opsional)</span></label>
								<div className="mt-1 flex items-center gap-3 rounded-xl border border-obc-border p-3">
									{avatarPreview && <img src={avatarPreview} alt="Pratinjau avatar" className="size-14 rounded-full object-cover" />}
									<label className="inline-flex h-10 cursor-pointer items-center rounded-lg border border-obc-border px-3 text-[13px] font-medium">Pilih gambar<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; setAvatarFile(file); setAvatarPreview(file ? URL.createObjectURL(file) : getTestimonialAvatarUrl(formData.avatar) ?? ""); }}/></label>
									{(avatarPreview || formData.avatar) && <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(""); setFormData({ ...formData, avatar: "" }); }} className="text-[13px] font-medium text-red-600">Hapus</button>}
								</div>
								</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-[13px] font-medium text-[#343133]">Rating (1-5)</label>
									<input
										type="number"
										min={1}
										max={5}
										required
										value={formData.rating}
										onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
										className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px] outline-none"
									/>
								</div>
								<div>
									<label className="block text-[13px] font-medium text-[#343133]">Status</label>
									<select
										value={formData.status}
											onChange={(e) => setFormData({ ...formData, status: e.target.value as Testimonial["status"] })}
										className="mt-1 h-10 w-full rounded-xl border border-obc-border px-3 text-[13px] outline-none"
									>
										<option value="published">Published</option>
										<option value="draft">Draft</option>
										<option value="archived">Archived</option>
									</select>
								</div>
							</div>
							<div>
								<label className="block text-[13px] font-medium text-[#343133]">Testimoni / Pesan</label>
								<textarea
									required
									rows={4}
									value={formData.text}
									onChange={(e) => setFormData({ ...formData, text: e.target.value })}
									className="mt-1 w-full rounded-xl border border-obc-border p-3 text-[13px] outline-none"
									placeholder="Tulis ulasan pelanggan..."
								/>
							</div>
							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="rounded-xl border border-obc-border px-4 py-2 text-[13px] font-medium text-[#343133]"
								>
									Batal
								</button>
								<button
									type="submit"
									className="rounded-xl bg-[#004000] px-4 py-2 text-[13px] font-semibold text-white"
								>
									Simpan
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</DashboardPageLayout>
	);
}
