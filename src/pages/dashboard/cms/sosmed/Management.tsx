import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardPageLayout from "../../components/layouts/DashboardPageLayout";
import { getApiErrorMessage } from "../../../../services/api";
import SocialMediaTable from "./Table";
import { sosmedService, type SocialMediaContent } from "./sosmedService";

const EMPTY_CONTENT: SocialMediaContent = {
	section: "site-social",
	whatsapp: "",
	instagram: "",
	tiktok: "",
	facebook: "",
};

export default function Management() {
	const [content, setContent] = useState<SocialMediaContent>(EMPTY_CONTENT);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		let active = true;
		sosmedService.getContent()
			.then((data) => { if (active) setContent(data); })
			.catch((error) => { if (active) toast.error(`Gagal memuat sosial media: ${getApiErrorMessage(error)}`); })
			.finally(() => { if (active) setLoading(false); });
		return () => { active = false; };
	}, []);

	const save = async () => {
		setSaving(true);
		try {
			setContent(await sosmedService.saveContent(content));
			toast.success("Sosial media berhasil diperbarui.");
		} catch (error) {
			toast.error(getApiErrorMessage(error));
		} finally {
			setSaving(false);
		}
	};

	return (
		<DashboardPageLayout breadcrumb="Sosial Media" title="Sosial media" description="Kelola tautan media sosial yang digunakan website.">
			<SocialMediaTable content={content} saving={saving} loading={loading} onChange={setContent} onSave={save} />
		</DashboardPageLayout>
	);
}
