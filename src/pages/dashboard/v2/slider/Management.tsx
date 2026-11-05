import { useEffect, useMemo, useState } from "react";
import { Images, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../../../../services/auth";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import SliderForm from "./Form";
import SliderTable from "./Table";
import { sliderService, type HeroContent, type HeroSlide } from "./sliderService";

export default function SliderManagement() {
	const tenantId = authService.getCurrentSession()?.user.tenantId ?? "";
	const [content, setContent] = useState<HeroContent>({ section: "hero", slides: [] });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [query, setQuery] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<{ slide: HeroSlide; index: number } | null>(null);

	useEffect(() => {
		let active = true;
		sliderService.getContent(tenantId || undefined).then((data) => { if (active && data) setContent(data as HeroContent); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, [tenantId]);

	const filteredSlides = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		return content.slides.filter((slide) => [slide.title, slide.description, slide.image].join(" ").toLowerCase().includes(normalized));
	}, [content.slides, query]);

	const deleteSlide = async (slide: HeroSlide) => {
		const index = content.slides.indexOf(slide);
		if (index < 0 || !window.confirm("Hapus slide Hero ini?")) return;
		const nextContent = { ...content, slides: content.slides.filter((_, slideIndex) => slideIndex !== index) };
		setSaving(true);
		try {
			await sliderService.saveContent(nextContent, tenantId || undefined);
			setContent(nextContent);
			toast.success("Slide Hero berhasil dihapus.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	const saveSlide = async (slide: HeroSlide) => {
		const nextContent: HeroContent = editing
			? { ...content, slides: content.slides.map((item, index) => index === editing.index ? slide : item) }
			: { ...content, slides: [...content.slides, slide] };
		setSaving(true);
		try {
			await sliderService.saveContent(nextContent, tenantId || undefined);
			setContent(nextContent);
			setShowForm(false);
			setEditing(null);
			toast.success("Slide Hero berhasil disimpan.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	const toggleSlideStatus = async (slide: HeroSlide) => {
		const index = content.slides.indexOf(slide);
		if (index < 0) return;
		const active = !slide.active;
		const nextContent: HeroContent = {
			...content,
			slides: content.slides.map((item, itemIndex) => itemIndex === index ? { ...item, active } : item),
		};
		setSaving(true);
		try {
			await sliderService.saveContent(nextContent, tenantId || undefined);
			setContent(nextContent);
			toast.success(`Slide berhasil ${active ? "diaktifkan" : "dinonaktifkan"}.`);
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Slider" title="Manajemen Slider Hero" description="Kelola slide, gambar, judul, dan deskripsi pada Hero halaman utama.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Images size={18} /></span><div><p className="text-[12px] text-obc-muted">Total slide</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{content.slides.length.toLocaleString("id-ID")}</p></div></div></div><div className="rounded-xl border border-obc-border bg-white p-4"><p className="text-[12px] text-obc-muted">Slide aktif</p><p className="mt-1 font-heading text-[20px] font-bold text-obc-charcoal">{content.slides.filter((slide) => slide.active).length.toLocaleString("id-ID")}</p></div></section>
			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="relative block w-full sm:w-[280px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul atau gambar..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label>{!showForm && <button type="button" onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Tambah slide</button>}</section>
			{showForm && <SliderForm slide={editing?.slide ?? null} tenantId={tenantId || undefined} saving={saving} onClose={() => { setShowForm(false); setEditing(null); }} onSubmit={saveSlide} />}
			<SliderTable slides={filteredSlides} loading={loading} saving={saving} onEdit={(slide) => { const index = content.slides.indexOf(slide); setEditing({ slide, index }); setShowForm(true); }} onDelete={deleteSlide} onToggleStatus={toggleSlideStatus} />
		</DashboardPageLayout>
	);
}
