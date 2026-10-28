import type { SocialMediaContent } from "./sosmedService";

type Props = {
	content: SocialMediaContent;
	saving: boolean;
	loading: boolean;
	onChange: (content: SocialMediaContent) => void;
	onSave: () => void;
};

export default function SocialMediaTable({ content, saving, loading, onChange, onSave }: Props) {
	return (
		<section className="rounded-xl border border-obc-border bg-white p-4 sm:p-5">
			<h2 className="font-heading text-lg font-semibold text-obc-charcoal">Tautan sosial media</h2>
			<div className="mt-4 grid gap-4 md:grid-cols-2">
				<label className="text-[13px] font-medium">WhatsApp<input required value={content.whatsapp} onChange={(event) => onChange({ ...content, whatsapp: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
				<label className="text-[13px] font-medium">Instagram<input required value={content.instagram} onChange={(event) => onChange({ ...content, instagram: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
				<label className="text-[13px] font-medium">TikTok<input required value={content.tiktok} onChange={(event) => onChange({ ...content, tiktok: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
				<label className="text-[13px] font-medium">Facebook<input value={content.facebook ?? ""} onChange={(event) => onChange({ ...content, facebook: event.target.value })} className="mt-1 h-10 w-full rounded-lg border border-obc-border px-3 font-normal" /></label>
			</div>
			<div className="mt-5 flex justify-end"><button type="button" onClick={onSave} disabled={loading || saving} className="h-10 rounded-lg bg-[#1F3320] px-4 text-[13px] font-medium text-white disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan perubahan"}</button></div>
		</section>
	);
}
