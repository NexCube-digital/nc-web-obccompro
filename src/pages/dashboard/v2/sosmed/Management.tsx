import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
	const queryClient = useQueryClient();
	const [content, setContent] = useState<SocialMediaContent>(EMPTY_CONTENT);
	const [saving, setSaving] = useState(false);
	const contentQuery = useQuery({
		queryKey: ["v2-social-content"],
		queryFn: () => sosmedService.getContent(),
	});
	const loading = contentQuery.isPending;

	useEffect(() => {
		if (contentQuery.data) setContent(contentQuery.data);
		if (contentQuery.error) {
			toast.error(`Gagal memuat sosial media: ${getApiErrorMessage(contentQuery.error)}`);
		}
	}, [contentQuery.data, contentQuery.error]);

	const save = async () => {
		setSaving(true);
		try {
			const savedContent = await sosmedService.saveContent(content);
			setContent(savedContent);
			queryClient.setQueryData(["v2-social-content"], savedContent);
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
