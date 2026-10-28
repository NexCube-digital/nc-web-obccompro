import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import SportCenterForm from "./Form";
import SportCenterTable from "./Table";
import { sportCenterService, type SportCenterCard, type SportCenterContent } from "./sportcenterService";

export default function SportCenterManagement() {
	const [content, setContent] = useState<SportCenterContent>({ section: "sport-center", title: "", subtitle: "", cards: [] });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [query, setQuery] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState<{ card: SportCenterCard; index: number } | null>(null);

	useEffect(() => {
		let active = true;
		sportCenterService.getContent().then((data) => { if (active && data) setContent(data as SportCenterContent); })
			.catch((error: unknown) => { if (active) toast.error(getApiErrorMessage(error)); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, []);

	const filteredCards = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		return content.cards.filter((card) => [card.badge, card.icon, card.items.join(" "), card.price ?? ""].join(" ").toLowerCase().includes(normalized));
	}, [content.cards, query]);

	const saveCard = (card: SportCenterCard) => {
		setContent((current) => editing
			? { ...current, cards: current.cards.map((item, index) => index === editing.index ? card : item) }
			: { ...current, cards: [...current.cards, card] });
		setShowForm(false);
		setEditing(null);
	};

	const saveContent = async () => {
		setSaving(true);
		try { await sportCenterService.saveContent(content); toast.success("Sport Center berhasil disimpan."); }
		catch (error) { toast.error(getApiErrorMessage(error)); }
		finally { setSaving(false); }
	};

	return (
		<DashboardPageLayout breadcrumb="Sport Center" title="Manajemen Sport Center" description="Kelola judul, subjudul, fasilitas, gambar, ikon, harga, dan video Sport Center.">
			<section className="mb-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-obc-border bg-white p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#E7F5D0] text-[#1F3320]"><Dumbbell size={18} /></span><div><p className="text-[12px] text-obc-muted">Total kartu</p><p className="font-heading text-[20px] font-bold text-obc-charcoal">{content.cards.length.toLocaleString("id-ID")}</p></div></div></div><div className="rounded-xl border border-obc-border bg-white p-4"><p className="text-[12px] text-obc-muted">Section</p><p className="mt-1 font-heading text-[20px] font-bold text-obc-charcoal">{content.title || "Sport Center"}</p></div></section>
			<section className="mb-4 grid gap-3 rounded-xl border border-obc-border bg-white p-4 sm:grid-cols-2 sm:p-5"><label className="text-[12px] font-medium">Judul section<input value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 text-[13px]" /></label><label className="text-[12px] font-medium sm:col-span-2">Subjudul<textarea rows={3} value={content.subtitle} onChange={(event) => setContent({ ...content, subtitle: event.target.value })} className="mt-1 w-full rounded-lg border border-obc-border p-3 text-[13px]" /></label></section>
			<section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="relative block w-full sm:w-[280px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-obc-muted" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari badge atau fasilitas..." className="h-10 w-full rounded-lg border border-obc-border bg-white pl-9 pr-3 text-[13px] outline-none focus:border-obc-olive" /></label><div className="flex gap-2"><button type="button" onClick={saveContent} disabled={saving || loading} className="h-10 rounded-lg border border-obc-border bg-white px-4 text-[13px] font-semibold text-obc-charcoal disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button>{!showForm && <button type="button" onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-obc-green px-4 text-[13px] font-semibold text-white hover:bg-obc-green-hover"><Plus size={15} />Tambah kartu</button>}</div></section>
			{showForm && <SportCenterForm card={editing?.card ?? null} onClose={() => { setShowForm(false); setEditing(null); }} onSubmit={saveCard} />}
			<SportCenterTable cards={filteredCards} loading={loading} onEdit={(card) => { const index = content.cards.indexOf(card); setEditing({ card, index }); setShowForm(true); }} onDelete={(card) => { const index = content.cards.indexOf(card); if (index >= 0 && window.confirm("Hapus kartu Sport Center ini?")) setContent((current) => ({ ...current, cards: current.cards.filter((_, cardIndex) => cardIndex !== index) })); }} />
		</DashboardPageLayout>
	);
}
